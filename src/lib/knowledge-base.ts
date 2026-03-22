import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
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

type CachedDataset = {
    key: string;
    loadedAt: number;
    data: KnowledgeDataset;
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

function buildKnowledgeUnitId(entry: CanonicalKnowledgeEntry): string {
    return crypto
        .createHash('sha1')
        .update(`${entry.sourceType}:${entry.questionKey}:${entry.title}`)
        .digest('hex')
        .slice(0, 16);
}

function getDatasetPath(year: string): string {
    const override = process.env.KNOWLEDGE_JSON_PATH;
    if (override) return override;
    return path.resolve(process.cwd(), '..', 'student-record-knowledge', 'output', `star-moe-knowledge-${year}.json`);
}

function normalizeText(value: string): string {
    return value
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

function tokenize(value: string): string[] {
    return normalizeText(value)
        .split(/[^\p{L}\p{N}]+/u)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2);
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

    let score = 0;

    if (title.includes(normalizedQuery)) score += 80;
    if (question.includes(normalizedQuery)) score += 48;
    if (answer.includes(normalizedQuery)) score += 20;

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
    if (datasetCache && datasetCache.key === year && Date.now() - datasetCache.loadedAt < CACHE_TTL_MS) {
        return datasetCache.data;
    }

    const filePath = getDatasetPath(year);
    const text = await readFile(filePath, 'utf8');
    const data = JSON.parse(text) as KnowledgeDataset;

    datasetCache = {
        key: year,
        loadedAt: Date.now(),
        data,
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

export async function searchKnowledgeBase(params: SearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    const year = params.year ? String(params.year) : DEFAULT_YEAR;
    const data = await loadKnowledgeDataset(year);

    return mergeKnowledgeRecords(data)
        .filter((entry) => matchesSchoolLevel(entry, params.schoolLevel))
        .filter((entry) => matchesCategory(entry, params.category))
        .map((entry) => {
            const score = scoreEntry(entry, params);
            return {
                ...entry,
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
