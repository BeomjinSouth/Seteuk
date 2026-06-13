import { KNOWLEDGE_EVAL_CASES } from '@/data/knowledge-eval-cases';
import { searchKnowledgeBase } from '@/lib/knowledge-base';
import { searchKnowledgeHybrid } from '@/lib/knowledge-search';
import type {
    KnowledgeEvalCase,
    KnowledgeEvalCaseResult,
    KnowledgeEvalReport,
    RetrievedKnowledgeEvidence,
} from '@/types/knowledge';

type KnowledgeEvalProvider = KnowledgeEvalReport['provider'];

function normalize(value: string): string {
    return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function sourceUrls(match: RetrievedKnowledgeEvidence): string[] {
    return [...match.sourceUrls, ...match.sources.map((source) => source.url)].filter(Boolean);
}

function titleMatchesCase(title: string, expectedTitleKeywords: string[]): boolean {
    if (expectedTitleKeywords.length === 0) return false;
    const normalizedTitle = normalize(title);
    return expectedTitleKeywords.some((keyword) => normalizedTitle.includes(normalize(keyword)));
}

function matchSatisfiesCase(match: RetrievedKnowledgeEvidence, testCase: KnowledgeEvalCase): boolean {
    if (testCase.expectedKnowledgeUnitIds?.includes(match.knowledgeUnitId)) return true;

    const expectedUrls = testCase.expectedSourceUrls ?? [];
    if (expectedUrls.length > 0 && sourceUrls(match).some((url) => expectedUrls.includes(url))) return true;

    return titleMatchesCase(match.title, testCase.expectedTitleKeywords);
}

function recallForCase(testCase: KnowledgeEvalCase, matches: RetrievedKnowledgeEvidence[]): number {
    const expectedIds = testCase.expectedKnowledgeUnitIds ?? [];
    if (expectedIds.length > 0) {
        const matchedIds = new Set(matches.map((match) => match.knowledgeUnitId));
        const foundCount = expectedIds.filter((id) => matchedIds.has(id)).length;
        return foundCount / expectedIds.length;
    }

    const expectedUrls = testCase.expectedSourceUrls ?? [];
    if (expectedUrls.length > 0) {
        const matchedUrls = new Set(matches.flatMap(sourceUrls));
        const foundCount = expectedUrls.filter((url) => matchedUrls.has(url)).length;
        return foundCount / expectedUrls.length;
    }

    return matches.some((match) => titleMatchesCase(match.title, testCase.expectedTitleKeywords)) ? 1 : 0;
}

function evaluateSingleCase(
    testCase: KnowledgeEvalCase,
    matches: RetrievedKnowledgeEvidence[],
): KnowledgeEvalCaseResult {
    const matchedTitles = matches.map((item) => item.title);
    const matchedKnowledgeUnitIds = matches.map((item) => item.knowledgeUnitId);
    const matchedSourceUrls = matches.flatMap(sourceUrls);
    const rank = matches.findIndex((match) => matchSatisfiesCase(match, testCase));
    const reciprocalRank = rank === -1 ? 0 : 1 / (rank + 1);
    const recallAtK = recallForCase(testCase, matches);

    return {
        id: testCase.id,
        query: testCase.query,
        expectedTitleKeywords: testCase.expectedTitleKeywords,
        expectedKnowledgeUnitIds: testCase.expectedKnowledgeUnitIds,
        expectedSourceUrls: testCase.expectedSourceUrls,
        matchedTitles,
        matchedKnowledgeUnitIds,
        matchedSourceUrls,
        top1Matched: rank === 0,
        top3Matched: rank >= 0 && rank < 3,
        topKMatched: rank >= 0,
        recallAtK,
        reciprocalRank,
    };
}

async function searchForProvider(
    provider: KnowledgeEvalProvider,
    testCase: KnowledgeEvalCase,
    limit: number,
): Promise<RetrievedKnowledgeEvidence[]> {
    const searchParams = {
        query: testCase.query,
        schoolLevel: testCase.schoolLevel,
        category: testCase.category,
        year: testCase.year,
        limit,
    };

    return provider === 'hybrid'
        ? searchKnowledgeHybrid(searchParams)
        : searchKnowledgeBase(searchParams);
}

export async function runKnowledgeEval(
    limit = 5,
    provider: KnowledgeEvalProvider = 'lexical',
): Promise<KnowledgeEvalReport> {
    const results: KnowledgeEvalCaseResult[] = [];

    for (const testCase of KNOWLEDGE_EVAL_CASES) {
        const matches = await searchForProvider(provider, testCase, limit);
        results.push(evaluateSingleCase(testCase, matches));
    }

    const caseCount = results.length;
    const hitAt1Count = results.filter((item) => item.top1Matched).length;
    const hitAt3Count = results.filter((item) => item.top3Matched).length;
    const reciprocalRankSum = results.reduce((sum, item) => sum + item.reciprocalRank, 0);
    const recallSum = results.reduce((sum, item) => sum + item.recallAtK, 0);

    return {
        provider,
        limit,
        caseCount,
        hitAt1: caseCount === 0 ? 0 : hitAt1Count / caseCount,
        hitAt3: caseCount === 0 ? 0 : hitAt3Count / caseCount,
        recallAtK: caseCount === 0 ? 0 : recallSum / caseCount,
        meanReciprocalRank: caseCount === 0 ? 0 : reciprocalRankSum / caseCount,
        failures: results.filter((item) => !item.topKMatched),
        results,
    };
}
