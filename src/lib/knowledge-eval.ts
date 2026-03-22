import { KNOWLEDGE_EVAL_CASES } from '@/data/knowledge-eval-cases';
import { searchKnowledgeBase } from '@/lib/knowledge-base';
import type {
    KnowledgeEvalCase,
    KnowledgeEvalCaseResult,
    KnowledgeEvalReport,
    RetrievedKnowledgeEvidence,
} from '@/types/knowledge';

function normalize(value: string): string {
    return value.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function titleMatchesCase(title: string, expectedTitleKeywords: string[]): boolean {
    const normalizedTitle = normalize(title);
    return expectedTitleKeywords.some((keyword) => normalizedTitle.includes(normalize(keyword)));
}

function evaluateSingleCase(
    testCase: KnowledgeEvalCase,
    matches: RetrievedKnowledgeEvidence[],
): KnowledgeEvalCaseResult {
    const matchedTitles = matches.map((item) => item.title);
    const rank = matchedTitles.findIndex((title) => titleMatchesCase(title, testCase.expectedTitleKeywords));
    const reciprocalRank = rank === -1 ? 0 : 1 / (rank + 1);

    return {
        id: testCase.id,
        query: testCase.query,
        expectedTitleKeywords: testCase.expectedTitleKeywords,
        matchedTitles,
        top1Matched: rank === 0,
        top3Matched: rank >= 0 && rank < 3,
        reciprocalRank,
    };
}

export async function runKnowledgeEval(limit = 5): Promise<KnowledgeEvalReport> {
    const results: KnowledgeEvalCaseResult[] = [];

    for (const testCase of KNOWLEDGE_EVAL_CASES) {
        const matches = await searchKnowledgeBase({
            query: testCase.query,
            schoolLevel: testCase.schoolLevel,
            category: testCase.category,
            year: testCase.year,
            limit,
        });

        results.push(evaluateSingleCase(testCase, matches));
    }

    const caseCount = results.length;
    const hitAt1Count = results.filter((item) => item.top1Matched).length;
    const hitAt3Count = results.filter((item) => item.top3Matched).length;
    const reciprocalRankSum = results.reduce((sum, item) => sum + item.reciprocalRank, 0);

    return {
        caseCount,
        hitAt1: caseCount === 0 ? 0 : hitAt1Count / caseCount,
        hitAt3: caseCount === 0 ? 0 : hitAt3Count / caseCount,
        meanReciprocalRank: caseCount === 0 ? 0 : reciprocalRankSum / caseCount,
        results,
    };
}
