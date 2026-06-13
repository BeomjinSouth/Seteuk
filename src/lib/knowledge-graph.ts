import type {
    GraphRagAnswerSpan,
    GraphRagEdge,
    GraphRagFlowStep,
    GraphRagNode,
    RetrievedKnowledgeEvidence,
} from '@/types/knowledge';
import {
    normalizeKnowledgeText as normalizeText,
    tokenizeKnowledgeText,
} from '@/lib/knowledge-text';

const GROUNDING_LOW_SIGNAL_TOKENS = new Set([
    '학생',
    '기재',
    '관련',
    '내용',
    '질문',
    '답변',
    '학교',
    '활동',
    '경우',
    '확인',
    '공개',
    '근거',
    '출처',
    '추가',
    '추가로',
    '비슷한',
    '함께',
    '검토',
    '검토하는',
    '안전',
    '안전합니다',
    '가장',
    '가까운',
]);

const MIN_GROUNDED_MATCH_SCORE = 3;
const MIN_GROUNDED_TOKEN_COVERAGE = 0.28;
const MIN_GROUNDED_RETRIEVAL_SCORE = 40;

function tokenize(value: string): string[] {
    return tokenizeKnowledgeText(value, { lowSignalTokens: GROUNDING_LOW_SIGNAL_TOKENS });
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string): T[] {
    const seen = new Set<string>();
    const next: T[] = [];

    for (const item of items) {
        const key = getKey(item);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(item);
    }

    return next;
}

function compactLabel(value: string, maxLength = 30): string {
    const normalized = value.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) return normalized;
    return `${normalized.slice(0, maxLength - 1)}…`;
}

function sourceLabel(match: RetrievedKnowledgeEvidence): string {
    const primary = match.sources[0];
    if (primary?.title) return primary.title;
    return match.title;
}

function sourceUrl(match: RetrievedKnowledgeEvidence): string | null {
    return match.sourceUrls[0] || match.sources[0]?.url || null;
}

function buildOntologyTerms(matches: RetrievedKnowledgeEvidence[]): Array<{
    id: string;
    label: string;
    sublabel: string;
    weight: number;
    matcher: (match: RetrievedKnowledgeEvidence) => boolean;
}> {
    const terms = new Map<string, {
        id: string;
        label: string;
        sublabel: string;
        weight: number;
        matcher: (match: RetrievedKnowledgeEvidence) => boolean;
    }>();

    for (const match of matches) {
        for (const category of match.categories.slice(0, 3)) {
            const id = `ontology:category:${category}`;
            const existing = terms.get(id);
            terms.set(id, {
                id,
                label: category,
                sublabel: '영역',
                weight: (existing?.weight ?? 0) + 1,
                matcher: (candidate) => candidate.categories.includes(category),
            });
        }

        for (const schoolLevel of match.schoolLevels.slice(0, 2)) {
            const id = `ontology:school:${schoolLevel}`;
            const existing = terms.get(id);
            terms.set(id, {
                id,
                label: schoolLevel,
                sublabel: '학교급',
                weight: (existing?.weight ?? 0) + 1,
                matcher: (candidate) => candidate.schoolLevels.includes(schoolLevel),
            });
        }

        if (match.effectiveYear) {
            const id = `ontology:year:${match.effectiveYear}`;
            const existing = terms.get(id);
            terms.set(id, {
                id,
                label: `${match.effectiveYear}`,
                sublabel: '기준연도',
                weight: (existing?.weight ?? 0) + 1,
                matcher: (candidate) => candidate.effectiveYear === match.effectiveYear,
            });
        }

        for (const anchor of match.policyAnchors.slice(0, 2)) {
            const label = compactLabel(anchor.rule, 24);
            const id = `ontology:anchor:${label}`;
            const existing = terms.get(id);
            terms.set(id, {
                id,
                label,
                sublabel: '정책 앵커',
                weight: (existing?.weight ?? 0) + 1,
                matcher: (candidate) => candidate.policyAnchors.some((item) => compactLabel(item.rule, 24) === label),
            });
        }

        for (const tag of match.graphLabels?.domainTags.slice(0, 3) ?? []) {
            const id = `ontology:domain:${tag}`;
            const existing = terms.get(id);
            terms.set(id, {
                id,
                label: tag.replace(/^domain\//, ''),
                sublabel: '도메인 라벨',
                weight: (existing?.weight ?? 0) + 2,
                matcher: (candidate) => candidate.graphLabels?.domainTags.includes(tag) ?? false,
            });
        }
    }

    return [...terms.values()]
        .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label, 'ko'))
        .slice(0, 5);
}

export function buildGraphRagGraph(
    question: string,
    matches: RetrievedKnowledgeEvidence[],
): {
    nodes: GraphRagNode[];
    edges: GraphRagEdge[];
    flow: GraphRagFlowStep[];
} {
    const topMatches = matches.slice(0, 4);
    const ontologyTerms = buildOntologyTerms(topMatches);
    const sourceMatches = uniqueBy(topMatches, (match) => sourceUrl(match) || match.knowledgeUnitId);
    const nodes: GraphRagNode[] = [
        {
            id: 'query',
            type: 'query',
            label: compactLabel(question || '사용자 질문', 28),
            sublabel: '질문',
            weight: 1,
        },
        ...ontologyTerms.map<GraphRagNode>((term) => ({
            id: term.id,
            type: 'ontology',
            label: term.label,
            sublabel: term.sublabel,
            weight: term.weight,
        })),
        ...topMatches.map<GraphRagNode>((match, index) => ({
            id: `knowledge:${match.knowledgeUnitId}`,
            type: 'knowledge',
            label: compactLabel(match.title, 30),
            sublabel: `지식유닛 ${index + 1} · ${match.score}점`,
            weight: Math.max(1, match.score),
            matchId: match.knowledgeUnitId,
        })),
        ...sourceMatches.map<GraphRagNode>((match, index) => ({
            id: `source:${match.knowledgeUnitId}`,
            type: 'source',
            label: compactLabel(sourceLabel(match), 30),
            sublabel: `${match.sourceBoard.toUpperCase()} 출처 ${index + 1}`,
            weight: Math.max(1, match.duplicateCount + match.variantCount),
            matchId: match.knowledgeUnitId,
            sourceUrl: sourceUrl(match),
        })),
        {
            id: 'answer',
            type: 'answer',
            label: '근거 연결 답변',
            sublabel: '형광펜 span',
            weight: 1,
        },
    ];

    const edges: GraphRagEdge[] = [];

    for (const term of ontologyTerms) {
        edges.push({
            id: `query:${term.id}`,
            from: 'query',
            to: term.id,
            label: term.sublabel,
            strength: Math.max(1, term.weight),
        });
    }

    if (ontologyTerms.length === 0) {
        for (const match of topMatches) {
            edges.push({
                id: `query:knowledge:${match.knowledgeUnitId}`,
                from: 'query',
                to: `knowledge:${match.knowledgeUnitId}`,
                label: '검색',
                strength: 1,
            });
        }
    }

    for (const match of topMatches) {
        for (const term of ontologyTerms) {
            if (!term.matcher(match)) continue;
            edges.push({
                id: `${term.id}:knowledge:${match.knowledgeUnitId}`,
                from: term.id,
                to: `knowledge:${match.knowledgeUnitId}`,
                label: '포함',
                strength: Math.max(1, Math.round(match.score / 30)),
            });
        }

        edges.push({
            id: `knowledge:source:${match.knowledgeUnitId}`,
            from: `knowledge:${match.knowledgeUnitId}`,
            to: `source:${match.knowledgeUnitId}`,
            label: '원문',
            strength: 2,
        });
        edges.push({
            id: `source:answer:${match.knowledgeUnitId}`,
            from: `source:${match.knowledgeUnitId}`,
            to: 'answer',
            label: '발췌',
            strength: 2,
        });
    }

    const flow: GraphRagFlowStep[] = [
        {
            id: 'question',
            label: '질문',
            description: '사용자 질문과 학교급·영역·연도 필터를 검색 신호로 정리합니다.',
            count: question.trim() ? 1 : 0,
        },
        {
            id: 'ontology',
            label: '기준 정렬',
            description: '학교급, 영역, 기준연도, 정책 앵커를 그래프 노드로 묶습니다.',
            count: ontologyTerms.length,
        },
        {
            id: 'retrieval',
            label: '검색 후보',
            description: '공개 FAQ/Q&A 기반 지식유닛을 검색하고 점수화합니다.',
            count: matches.length,
        },
        {
            id: 'grounding',
            label: '근거 연결',
            description: '답변 문장과 가장 가까운 원문 발췌를 span 단위로 연결합니다.',
            count: topMatches.length,
        },
    ];

    return { nodes, edges, flow };
}

function splitAnswerText(answer: string): string[] {
    const normalized = answer.replace(/\r\n/g, '\n').trim();
    if (!normalized) return [];

    const pieces = normalized
        .split(/(?<=[.!?。])\s+|\n+/u)
        .map((piece) => piece.trim())
        .filter(Boolean);

    return pieces.length > 0 ? pieces : [normalized];
}

type PreparedGroundingMatch = {
    match: RetrievedKnowledgeEvidence;
    combinedText: string;
};

function prepareGroundingMatches(matches: RetrievedKnowledgeEvidence[]): PreparedGroundingMatch[] {
    return matches.map((match) => ({
        match,
        combinedText: normalizeText([
            match.title,
            match.question,
            match.answer,
            match.ruleSummary || '',
            match.snippet,
            match.categories.join(' '),
            match.policyAnchors.map((anchor) => anchor.rule).join(' '),
        ].join(' ')),
    }));
}

function scoreTokensAgainstMatch(tokens: string[], prepared: PreparedGroundingMatch): number {
    if (tokens.length === 0) return 0;
    return tokens.reduce((score, token) => score + (prepared.combinedText.includes(token) ? 1 : 0), 0);
}

function scoreSegmentAgainstMatch(segment: string, match: RetrievedKnowledgeEvidence): number {
    const tokens = tokenize(segment);
    return scoreTokensAgainstMatch(tokens, {
        match,
        combinedText: normalizeText([
        match.title,
        match.question,
        match.answer,
        match.ruleSummary || '',
        match.snippet,
        match.categories.join(' '),
        match.policyAnchors.map((anchor) => anchor.rule).join(' '),
        ].join(' ')),
    });
}

function hasGroundedSourceMatch(tokenCount: number, score: number, retrievalScore: number): boolean {
    if (retrievalScore < MIN_GROUNDED_RETRIEVAL_SCORE) return false;
    if (tokenCount === 0) return false;
    const coverage = score / tokenCount;
    return score >= MIN_GROUNDED_MATCH_SCORE && coverage >= MIN_GROUNDED_TOKEN_COVERAGE;
}

function extractBestExcerpt(segment: string, match: RetrievedKnowledgeEvidence): string {
    const sourceText = (match.answer || match.snippet || match.ruleSummary || match.question)
        .replace(/\s+/g, ' ')
        .trim();
    if (!sourceText) return match.snippet;
    if (sourceText.length <= 360) return sourceText;

    const tokens = tokenize(segment);
    const lowerSource = sourceText.toLowerCase();
    const firstIndex = tokens
        .map((token) => lowerSource.indexOf(token.toLowerCase()))
        .filter((index) => index >= 0)
        .sort((a, b) => a - b)[0];

    const start = firstIndex === undefined ? 0 : Math.max(0, firstIndex - 90);
    const end = Math.min(sourceText.length, start + 360);
    return `${start > 0 ? '…' : ''}${sourceText.slice(start, end)}${end < sourceText.length ? '…' : ''}`;
}

function confidenceFromScore(score: number): GraphRagAnswerSpan['confidence'] {
    if (score >= 4) return 'high';
    if (score >= 2) return 'medium';
    return 'low';
}

export function buildGraphRagAnswerSpans(
    answer: string,
    matches: RetrievedKnowledgeEvidence[],
): GraphRagAnswerSpan[] {
    const segments = splitAnswerText(answer);
    const primaryMatch = matches[0];
    const preparedMatches = prepareGroundingMatches(matches);

    if (matches.length === 0) {
        return segments.map((segment, index) => ({
            id: `span:${index}`,
            text: segment,
            knowledgeUnitId: null,
            sourceTitle: null,
            sourceUrl: null,
            sourceBoard: null,
            evidenceLabel: '직접 연결된 공개 근거 없음',
            excerpt: '검색된 공개 근거가 없어 답변을 보수적으로 제한했습니다.',
            confidence: 'low',
        }));
    }

    return segments.map((segment, index) => {
        const tokens = tokenize(segment);
        const scored = preparedMatches
            .map((prepared) => ({
                match: prepared.match,
                score: scoreTokensAgainstMatch(tokens, prepared),
            }))
            .sort((a, b) => b.score - a.score || b.match.score - a.match.score);
        const best = scored[0]?.match ?? primaryMatch;
        const score = scored[0]?.score ?? 0;

        if (!hasGroundedSourceMatch(tokens.length, score, best.score)) {
            return {
                id: `span:${index}`,
                text: segment,
                knowledgeUnitId: null,
                sourceTitle: null,
                sourceUrl: null,
                sourceBoard: null,
                evidenceLabel: '직접 연결된 공개 근거 없음',
                excerpt: '답변 문장과 공개 원문 발췌 사이의 핵심어 연결이 충분하지 않아 출처 주석을 표시하지 않았습니다.',
                confidence: 'low',
            };
        }

        return {
            id: `span:${index}`,
            text: segment,
            knowledgeUnitId: best.knowledgeUnitId,
            sourceTitle: sourceLabel(best),
            sourceUrl: sourceUrl(best),
            sourceBoard: best.sourceBoard,
            evidenceLabel: `${best.sourceBoard.toUpperCase()} · ${best.effectiveYear ?? '연도 미상'} · ${best.score}점`,
            excerpt: extractBestExcerpt(segment, best),
            confidence: confidenceFromScore(score),
        };
    });
}
