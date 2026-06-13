import { searchKnowledgeBase } from '@/lib/knowledge-base';
import { isHostedKnowledgeConfigured, searchHostedKnowledge } from '@/lib/knowledge-hosted';
import type { RetrievedKnowledgeEvidence } from '@/types/knowledge';

/**
 * Retrieval entry points for answer-generating routes.
 *
 * - `searchKnowledgeHybrid`: lexical search merged with hosted vector search
 *   (when configured). Vector search fails open to lexical-only.
 * - `searchKnowledgeForRecordReview`: sentence-level retrieval tuned for long
 *   세특 paragraphs, where a single whole-text lexical query is too noisy.
 */

type HybridSearchParams = {
    query: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    limit?: number;
};

type RecordReviewSearchParams = {
    recordText: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    limit?: number;
};

const DEFAULT_LIMIT = 6;
const RRF_K = 60;
const RRF_SCORE_SCALE = 3000;
const MIN_CANDIDATE_POOL = 12;
const MAX_CANDIDATE_POOL = 30;
const HIGH_CONFIDENCE_TOP_SCORE = 140;
const HIGH_CONFIDENCE_MARGIN = 45;
// Hosted raw scores are kept only for tie-break diagnostics; hybrid ranking
// uses ranks so lexical and vector score scales never compete directly.
const HOSTED_SCORE_SCALE = 100;
// Small bump when lexical and vector retrieval agree on the same unit.
const AGREEMENT_BONUS = 8;
const MAX_RECORD_SEGMENTS = 12;
const MIN_SEGMENT_LENGTH = 10;
const PER_SEGMENT_LIMIT = 3;

function sortByScore(matches: RetrievedKnowledgeEvidence[]): RetrievedKnowledgeEvidence[] {
    return [...matches].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (b.effectiveYear ?? 0) - (a.effectiveYear ?? 0);
    });
}

function candidatePoolLimit(limit: number): number {
    return Math.min(MAX_CANDIDATE_POOL, Math.max(limit * 3, MIN_CANDIDATE_POOL));
}

function mergeMatches(
    lexical: RetrievedKnowledgeEvidence[],
    hosted: RetrievedKnowledgeEvidence[],
): RetrievedKnowledgeEvidence[] {
    if (hosted.length === 0) return sortByScore(lexical);
    if (lexical.length === 0) {
        return hosted.map((match, index) => ({
            ...match,
            score: Math.round((RRF_SCORE_SCALE / (RRF_K + index + 1))),
        }));
    }

    const merged = new Map<string, {
        match: RetrievedKnowledgeEvidence;
        lexicalRank?: number;
        hostedRank?: number;
        lexicalScore?: number;
        hostedScore?: number;
    }>();

    lexical.forEach((match, index) => {
        merged.set(match.knowledgeUnitId, {
            match,
            lexicalRank: index + 1,
            lexicalScore: match.score,
        });
    });

    hosted.forEach((match, index) => {
        const existing = merged.get(match.knowledgeUnitId);
        if (existing) {
            merged.set(match.knowledgeUnitId, {
                ...existing,
                match: {
                    ...existing.match,
                    graphLabels: existing.match.graphLabels ?? match.graphLabels,
                    snippet: existing.match.snippet || match.snippet,
                },
                hostedRank: index + 1,
                hostedScore: match.score,
            });
        } else {
            merged.set(match.knowledgeUnitId, {
                match,
                hostedRank: index + 1,
                hostedScore: match.score,
            });
        }
    });

    return [...merged.values()]
        .map((candidate) => {
            const rrfScore =
                (candidate.lexicalRank ? 1 / (RRF_K + candidate.lexicalRank) : 0) +
                (candidate.hostedRank ? 1 / (RRF_K + candidate.hostedRank) : 0);
            const agreement = candidate.lexicalRank && candidate.hostedRank ? AGREEMENT_BONUS : 0;

            return {
                ...candidate.match,
                score: Math.round(rrfScore * RRF_SCORE_SCALE) + agreement,
                rawLexicalScore: candidate.lexicalScore ?? 0,
                rawHostedScore: candidate.hostedScore ?? 0,
                matchedBoth: Boolean(candidate.lexicalRank && candidate.hostedRank),
            };
        })
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            if (Number(b.matchedBoth) !== Number(a.matchedBoth)) return Number(b.matchedBoth) - Number(a.matchedBoth);
            const rawA = Math.max(a.rawLexicalScore, a.rawHostedScore);
            const rawB = Math.max(b.rawLexicalScore, b.rawHostedScore);
            if (rawB !== rawA) return rawB - rawA;
            return (b.effectiveYear ?? 0) - (a.effectiveYear ?? 0);
        })
        .map(({ rawLexicalScore, rawHostedScore, matchedBoth, ...match }) => match);
}

async function searchHostedSafely(params: HybridSearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    if (!isHostedKnowledgeConfigured()) return [];

    try {
        const hosted = await searchHostedKnowledge({
            query: params.query,
            schoolLevel: params.schoolLevel,
            category: params.category,
            year: params.year,
            limit: params.limit ?? DEFAULT_LIMIT,
        });

        return hosted.map((match) => ({
            ...match,
            score: Math.round(match.score * HOSTED_SCORE_SCALE),
        }));
    } catch (error) {
        console.warn('Hosted knowledge search failed, falling back to lexical only:', error);
        return [];
    }
}

export async function searchKnowledgeHybrid(params: HybridSearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    const limit = params.limit ?? DEFAULT_LIMIT;
    const poolLimit = candidatePoolLimit(limit);
    const [lexical, hosted] = await Promise.all([
        searchKnowledgeBase({ ...params, limit: poolLimit }),
        searchHostedSafely({ ...params, limit: poolLimit }),
    ]);

    return mergeMatches(lexical, hosted).slice(0, limit);
}

export function shouldSkipRerankForHighConfidenceLexical(matches: RetrievedKnowledgeEvidence[]): boolean {
    const [top, second] = matches;
    if (!top) return false;
    const hasCitationUrl = Boolean(top.sourceUrls[0] || top.sources[0]?.url);
    const margin = top.score - (second?.score ?? 0);
    return hasCitationUrl && top.score >= HIGH_CONFIDENCE_TOP_SCORE && margin >= HIGH_CONFIDENCE_MARGIN;
}

function splitRecordSentences(recordText: string): string[] {
    return recordText
        .replace(/\r\n/g, '\n')
        .split(/(?<=[.!?。])\s+|\n+/u)
        .map((segment) => segment.trim())
        .filter((segment) => segment.length >= MIN_SEGMENT_LENGTH)
        .slice(0, MAX_RECORD_SEGMENTS);
}

async function searchRecordSegments(params: RecordReviewSearchParams): Promise<RetrievedKnowledgeEvidence[]> {
    const segments = splitRecordSentences(params.recordText);
    const queries = segments.length > 0 ? segments : [params.recordText];

    const bestByUnit = new Map<string, RetrievedKnowledgeEvidence>();

    const matchGroups = await Promise.all(queries.map((query) =>
        searchKnowledgeBase({
            query,
            schoolLevel: params.schoolLevel,
            category: params.category,
            year: params.year,
            limit: PER_SEGMENT_LIMIT,
        })
    ));

    for (const matches of matchGroups) {
        for (const match of matches) {
            const existing = bestByUnit.get(match.knowledgeUnitId);
            if (!existing || match.score > existing.score) {
                bestByUnit.set(match.knowledgeUnitId, match);
            }
        }
    }

    return sortByScore([...bestByUnit.values()]);
}

/**
 * Retrieval for record review: searches sentence-by-sentence so that one risky
 * sentence (자격증, 수상, 기관명 등) is not drowned out by the rest of the
 * paragraph, then augments with semantic search over the full text.
 */
export async function searchKnowledgeForRecordReview(
    params: RecordReviewSearchParams,
): Promise<RetrievedKnowledgeEvidence[]> {
    const limit = params.limit ?? DEFAULT_LIMIT;

    let lexical = await searchRecordSegments(params);

    // Mirror the previous behavior: when a category filter yields nothing,
    // retry across all categories rather than returning no evidence.
    if (lexical.length === 0 && params.category) {
        lexical = await searchRecordSegments({ ...params, category: undefined });
    }

    const hosted = await searchHostedSafely({
        query: params.recordText,
        schoolLevel: params.schoolLevel,
        year: params.year,
        limit: candidatePoolLimit(limit),
    });

    return mergeMatches(lexical, hosted).slice(0, limit);
}
