import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { detectQueryDomainTags, loadKnowledgeGraphLabelMap } from '@/lib/knowledge-labels';
import {
    compactKnowledgeText as compactText,
    normalizeKnowledgeText as normalizeText,
    tokenizeKnowledgeText as tokenize,
} from '@/lib/knowledge-text';
import type {
    CanonicalKnowledgeEntry,
    Citation,
    KnowledgeDataset,
    KnowledgeMeta,
    RetrievedKnowledgeEvidence,
} from '@/types/knowledge';

type SearchParams = {
    query: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    limit?: number;
};

type ConceptConstraint = {
    name: string;
    allOf: string[];
    anyOf: string[];
};

type CachedDataset = {
    key: string;
    loadedAt: number;
    data: KnowledgeDataset;
    mergedRecords: RetrievedKnowledgeEvidence[];
};

let datasetCache: CachedDataset | null = null;

const CACHE_TTL_MS = 60 * 1000;
const DEFAULT_YEAR = process.env.KNOWLEDGE_YEAR || '2026';
const DEFAULT_LIMIT = 6;
const LOW_SIGNAL_TOKENS = new Set([
    '학생',
    '기재',
    '입력',
    '문의',
    '여부',
    '가능',
    '되나요',
    '관련',
    '내용',
    '사용',
    '처리',
]);

export function clearKnowledgeDatasetCache() {
    datasetCache = null;
}
const QUERY_SYNONYMS: Record<string, string[]> = {
    세특: ['세부능력특기사항', '세부 능력 및 특기사항', '행동특성 및 종합의견'],
    생기부: ['학생부', '학교생활기록부'],
    이름: ['성명'],
    창체: ['창의적 체험활동'],
    출결: ['출결상황', '출석', '결석'],
    자격증: ['자격증 취득', '국가직무능력표준', '이수상황'],
    진로: ['진로활동', '진로특기사항'],
};
const CONCEPT_BOOSTS: Array<{
    queryIncludes: string[];
    targetIncludes: string[];
    score: number;
}> = [
    {
        queryIncludes: ['학생', '이름'],
        targetIncludes: ['성명'],
        score: 72,
    },
    {
        queryIncludes: ['세특'],
        targetIncludes: ['세부능력', '특기사항', '행동특성', '종합의견'],
        score: 6,
    },
    {
        queryIncludes: ['자격증'],
        targetIncludes: ['자격증', '취득', '국가직무능력표준'],
        score: 28,
    },
];

const CONCEPT_CONSTRAINTS: ConceptConstraint[] = [
    {
        name: 'student-name',
        allOf: ['학생'],
        anyOf: ['이름', '성명'],
    },
    {
        name: 'certificate',
        allOf: ['자격증'],
        anyOf: ['자격증', '취득', '국가직무능력표준'],
    },
    {
        name: 'attendance-bongsa-time',
        allOf: ['봉사', '결석'],
        anyOf: ['봉사활동', '결석', '출결', '시수', '이수시간'],
    },
];

export function buildKnowledgeUnitId(entry: CanonicalKnowledgeEntry): string {
    return crypto
        .createHash('sha1')
        .update(`${entry.sourceType}:${entry.questionKey}:${entry.title}`)
        .digest('hex')
        .slice(0, 16);
}

function getDatasetCandidatePaths(year: string): string[] {
    const filename = `star-moe-knowledge-${year}.json`;
    const override = process.env.KNOWLEDGE_JSON_PATH;
    const candidates = override
        ? [override]
        : [
            path.resolve(process.cwd(), 'output', filename),
            path.resolve(process.cwd(), '..', 'student-record-knowledge', 'output', filename),
        ];

    return [...new Set(candidates)];
}

async function readKnowledgeDatasetFile(year: string): Promise<{ filePath: string; text: string }> {
    const checkedPaths: string[] = [];

    for (const filePath of getDatasetCandidatePaths(year)) {
        try {
            const text = await readFile(filePath, 'utf8');
            return { filePath, text };
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                checkedPaths.push(filePath);
                continue;
            }

            throw error;
        }
    }

    throw new Error(
        `Knowledge dataset not found. Checked: ${checkedPaths.join(', ')}. Run \`npm run sync:knowledge-docs\` in the web app or set KNOWLEDGE_JSON_PATH.`,
    );
}

function expandQueryTokens(value: string): string[] {
    const baseTokens = tokenize(value);
    const expanded = new Set(baseTokens);

    for (const token of baseTokens) {
        const synonyms = QUERY_SYNONYMS[token];
        if (!synonyms) continue;
        for (const synonym of synonyms) {
            expanded.add(normalizeText(synonym));
            for (const nested of tokenize(synonym)) {
                expanded.add(nested);
            }
        }
    }

    return [...expanded];
}

function detectConstraints(query: string): ConceptConstraint[] {
    const normalized = normalizeText(query);
    return CONCEPT_CONSTRAINTS.filter((constraint) =>
        constraint.allOf.every((token) => normalized.includes(token)) &&
        constraint.anyOf.some((token) => normalized.includes(token))
    );
}

function parseYear(value: string | null | undefined): number | null {
    if (!value) return null;
    const match = value.match(/^(\d{4})-/);
    return match ? Number(match[1]) : null;
}

function extractSnippet(text: string, tokens: string[]): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (!normalized) return '';
    if (normalized.length <= 220) return normalized;

    const lower = normalized.toLowerCase();
    const firstIndex = tokens
        .map((token) => lower.indexOf(token.toLowerCase()))
        .find((index) => index >= 0);

    const start = firstIndex !== undefined && firstIndex >= 0 ? Math.max(0, firstIndex - 60) : 0;
    const end = Math.min(normalized.length, start + 220);
    return `${start > 0 ? '...' : ''}${normalized.slice(start, end)}${end < normalized.length ? '...' : ''}`;
}

function matchesSchoolLevel(entry: RetrievedKnowledgeEvidence, schoolLevel?: string): boolean {
    if (!schoolLevel) return true;
    return entry.schoolLevels.includes('공통') || entry.schoolLevels.includes(schoolLevel);
}

function matchesCategory(entry: RetrievedKnowledgeEvidence, category?: string): boolean {
    if (!category) return true;
    const target = normalizeText(category);
    return entry.categories.some((item) => normalizeText(item) === target);
}

function mergeKnowledgeRecords(dataset: KnowledgeDataset): RetrievedKnowledgeEvidence[] {
    const unitMap = new Map(dataset.knowledgeUnits.map((unit) => [unit.knowledge_unit_id, unit]));

    return dataset.canonicalEntries.map((entry) => {
        const knowledgeUnitId = buildKnowledgeUnitId(entry);
        const unit = unitMap.get(knowledgeUnitId);

        return {
            knowledgeUnitId,
            title: entry.title,
            question: entry.question,
            answer: entry.answer,
            ruleSummary: unit?.rule_summary ?? null,
            schoolLevels: entry.schoolLevels,
            categories: entry.categories,
            effectiveYear: unit?.effective_year_from ?? parseYear(entry.effectiveDate),
            sourceBoard: unit?.source_board ?? (entry.sourceType === 'faq' ? 'faq' : 'qa'),
            resolution: entry.resolution,
            duplicateCount: entry.duplicateCount,
            variantCount: entry.variantCount,
            sourceUrls: entry.sourceUrls,
            sources: entry.sources,
            policyAnchors: unit?.policy_anchors ?? [],
            score: 0,
            snippet: '',
        };
    });
}

function scoreEntry(entry: RetrievedKnowledgeEvidence, params: SearchParams): number {
    const normalizedQuery = normalizeText(params.query);
    const tokens = expandQueryTokens(params.query);
    const title = normalizeText(entry.title);
    const question = normalizeText(entry.question);
    const answer = normalizeText(entry.answer);
    const categoryText = entry.categories.map(normalizeText).join(' ');
    const schoolText = entry.schoolLevels.map(normalizeText).join(' ');
    const policyText = entry.policyAnchors.map((anchor) => normalizeText(anchor.rule)).join(' ');
    const compactQuery = compactText(params.query);
    const compactTitle = compactText(entry.title);
    const compactQuestion = compactText(entry.question);
    const compactAnswer = compactText(entry.answer);

    let score = 0;

    if (title.includes(normalizedQuery)) score += 80;
    if (question.includes(normalizedQuery)) score += 48;
    if (answer.includes(normalizedQuery)) score += 20;
    if (compactQuery.length >= 4) {
        if (compactTitle.includes(compactQuery)) score += 88;
        if (compactQuestion.includes(compactQuery)) score += 52;
        if (compactAnswer.includes(compactQuery)) score += 18;
    }

    for (const token of tokens) {
        const titleWeight = LOW_SIGNAL_TOKENS.has(token) ? 2 : 14;
        const questionWeight = LOW_SIGNAL_TOKENS.has(token) ? 1 : 7;
        const answerWeight = LOW_SIGNAL_TOKENS.has(token) ? 1 : 3;
        const categoryWeight = LOW_SIGNAL_TOKENS.has(token) ? 1 : 8;
        const schoolWeight = LOW_SIGNAL_TOKENS.has(token) ? 1 : 6;
        const policyWeight = LOW_SIGNAL_TOKENS.has(token) ? 1 : 5;

        if (title.includes(token)) score += titleWeight;
        if (question.includes(token)) score += questionWeight;
        if (answer.includes(token)) score += answerWeight;
        if (categoryText.includes(token)) score += categoryWeight;
        if (schoolText.includes(token)) score += schoolWeight;
        if (policyText.includes(token)) score += policyWeight;
    }

    if (params.schoolLevel) {
        if (entry.schoolLevels.includes(params.schoolLevel)) score += 12;
        else if (entry.schoolLevels.includes('공통')) score += 5;
    }

    if (params.category && entry.categories.some((item) => normalizeText(item) === normalizeText(params.category!))) {
        score += 16;
    }

    if (params.year && entry.effectiveYear === params.year) score += 8;
    if (entry.sourceBoard === 'faq') score += 4;
    if (entry.variantCount === 1) score += 2;

    const combinedText = [title, question, answer, categoryText, policyText].join(' ');
    for (const rule of CONCEPT_BOOSTS) {
        if (rule.queryIncludes.every((token) => normalizedQuery.includes(token))) {
            if (rule.targetIncludes.some((token) => combinedText.includes(normalizeText(token)))) {
                score += rule.score;
            }
        }
    }

    if (normalizedQuery.includes('학생') && (normalizedQuery.includes('이름') || normalizedQuery.includes('성명'))) {
        if (combinedText.includes('성명')) score += 90;
        if (combinedText.includes('본인 이름')) score += 72;
        if (combinedText.includes('학생의 성명')) score += 96;
        if (!combinedText.includes('성명') && !combinedText.includes('이름')) score -= 96;
    }

    return score;
}

export async function loadKnowledgeDataset(year: string = DEFAULT_YEAR): Promise<KnowledgeDataset> {
    const cacheKey = getDatasetCandidatePaths(year).join('|');
    if (datasetCache && datasetCache.key === cacheKey && Date.now() - datasetCache.loadedAt < CACHE_TTL_MS) {
        return datasetCache.data;
    }

    const { text } = await readKnowledgeDatasetFile(year);
    const data = JSON.parse(text) as KnowledgeDataset;
    const mergedRecords = mergeKnowledgeRecords(data);

    datasetCache = {
        key: cacheKey,
        loadedAt: Date.now(),
        data,
        mergedRecords,
    };

    return data;
}

export async function getKnowledgeMeta(year: string = DEFAULT_YEAR): Promise<KnowledgeMeta> {
    const data = await loadKnowledgeDataset(year);
    const schoolLevels = [...new Set(data.canonicalEntries.flatMap((entry) => entry.schoolLevels))].sort();
    const categories = [...new Set(data.canonicalEntries.flatMap((entry) => entry.categories))].sort((a, b) => a.localeCompare(b, 'ko'));

    return {
        year: data.year,
        generatedAt: data.generatedAt,
        stats: data.stats,
        schoolLevels,
        categories,
    };
}

const DOMAIN_LABEL_BASE_BOOST = 10;
const DOMAIN_LABEL_EXTRA_BOOST = 4;

export async function searchKnowledgeBase(params: SearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    const year = params.year ? String(params.year) : DEFAULT_YEAR;
    const data = await loadKnowledgeDataset(year);
    const mergedRecords = datasetCache?.data === data ? datasetCache.mergedRecords : mergeKnowledgeRecords(data);
    const constraints = detectConstraints(params.query);
    const labelMap = await loadKnowledgeGraphLabelMap(year);
    const queryDomains = detectQueryDomainTags(params.query);

    return mergedRecords
        .filter((entry) => matchesSchoolLevel(entry, params.schoolLevel))
        .filter((entry) => matchesCategory(entry, params.category))
        .filter((entry) => {
            if (constraints.length === 0) return true;
            const combinedText = normalizeText([
                entry.title,
                entry.question,
                entry.answer,
                entry.categories.join(' '),
                entry.policyAnchors.map((anchor) => anchor.rule).join(' '),
            ].join(' '));

            return constraints.every((constraint) =>
                constraint.anyOf.some((token) => combinedText.includes(normalizeText(token)))
            );
        })
        .map((entry) => {
            const graphLabels = labelMap.get(entry.knowledgeUnitId);
            let score = scoreEntry(entry, params);

            // Graph label boost: entries whose offline domain tags overlap the
            // query's detected domains rank higher. Only boosts entries that
            // already matched lexically (score > 0) so labels never surface
            // otherwise-unrelated documents on their own.
            if (score > 0 && graphLabels && queryDomains.length > 0) {
                const overlap = graphLabels.domainTags.filter((tag) => queryDomains.includes(tag)).length;
                if (overlap > 0) {
                    score += DOMAIN_LABEL_BASE_BOOST + (overlap - 1) * DOMAIN_LABEL_EXTRA_BOOST;
                }
            }

            return {
                ...entry,
                graphLabels,
                score,
                snippet: extractSnippet(`${entry.answer}\n${entry.question}`, tokenize(params.query)),
            };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.effectiveYear ?? 0) - (a.effectiveYear ?? 0);
        })
        .slice(0, params.limit ?? DEFAULT_LIMIT);
}

export function buildCitations(matches: RetrievedKnowledgeEvidence[]): Citation[] {
    return matches
        .map((match) => ({
            title: match.title,
            url: match.sourceUrls[0] || match.sources[0]?.url || '',
            snippet: match.snippet,
            sourceBoard: match.sourceBoard,
            effectiveYear: match.effectiveYear,
        }))
        .filter((citation) => Boolean(citation.url));
}

export function buildConflictSummary(matches: RetrievedKnowledgeEvidence[]): string | null {
    const conflicting = matches.filter((match) => match.variantCount > 1);
    if (conflicting.length === 0) return null;
    const titles = [...new Set(conflicting.map((match) => match.title))].slice(0, 3);
    return `유사 질문 중 답변 차이가 있는 항목이 있어 최신 기준과 출처를 함께 확인해야 합니다: ${titles.join(', ')}`;
}

export function buildFallbackCounselAnswer(question: string, matches: RetrievedKnowledgeEvidence[]): string {
    if (matches.length === 0) {
        return `질문과 직접 연결되는 공개 근거를 찾지 못했습니다. 검색어를 더 구체적으로 입력하거나 학교급/구분을 함께 지정해 주세요.\n\n질문: ${question}`;
    }

    const primary = matches[0];
    const summary = primary.ruleSummary || primary.answer.slice(0, 360);

    return [
        `가장 가까운 공개 근거는 "${primary.title}"입니다.`,
        '',
        summary,
        matches.length > 1 ? '\n추가로 비슷한 공개 근거도 함께 검토하는 것이 안전합니다.' : '',
    ].join('\n');
}
