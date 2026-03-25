import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import type { RetrievedKnowledgeEvidence } from '@/types/knowledge';

type RerankParams = {
    client: OpenAI;
    query: string;
    matches: RetrievedKnowledgeEvidence[];
    schoolLevel?: string;
    category?: string;
    year?: number;
    model?: string;
};

export async function rerankMatchesWithAI({
    client,
    query,
    matches,
    schoolLevel,
    category,
    year,
    model = 'gpt-5.4-mini',
}: RerankParams): Promise<RetrievedKnowledgeEvidence[]> {
    if (matches.length <= 1) return matches;

    const candidates = matches.slice(0, 8);
    const prompt = candidates
        .map((match, index) => [
            `[${index + 1}]`,
            `제목: ${match.title}`,
            `학교급: ${match.schoolLevels.join(', ')}`,
            `구분: ${match.categories.join(', ') || '-'}`,
            `연도: ${match.effectiveYear ?? '미상'}`,
            `스니펫: ${match.snippet}`,
        ].join('\n'))
        .join('\n\n');

    const cacheParams = getPromptCacheParams('knowledge-rerank:v1', [
        query,
        schoolLevel || '',
        category || '',
        year || '',
        candidates.map((match) => `${match.knowledgeUnitId}:${match.score}`).join('|'),
    ]);

    try {
        const response = await client.responses.create({
            model,
            instructions: [
                '당신은 학생부 FAQ/Q&A retrieval reranker다.',
                '사용자 질문에 가장 직접적으로 답하는 공개 근거 순서대로 후보를 정렬한다.',
                '반드시 JSON 객체만 반환한다.',
                '형식: {"orderedIds":[...]}',
                'orderedIds에는 제공된 후보 번호만 넣는다.',
            ].join('\n'),
            input: [
                'Return JSON only.',
                'Output format: {"orderedIds":[...]}',
                `질문: ${query}`,
                schoolLevel ? `학교급: ${schoolLevel}` : '',
                category ? `구분: ${category}` : '',
                year ? `연도: ${year}` : '',
                '',
                prompt,
            ].filter(Boolean).join('\n'),
            reasoning: { effort: 'low' },
            max_output_tokens: 200,
            text: { format: { type: 'json_object' } },
            ...cacheParams,
        });

        const raw = JSON.parse(response.output_text || '{}');
        const orderedIds = Array.isArray(raw.orderedIds)
            ? raw.orderedIds
                .map((item: unknown) => Number(item))
                .filter((item: number) => Number.isInteger(item) && item >= 1 && item <= candidates.length)
            : [];

        if (orderedIds.length === 0) return matches;

        const ordered = orderedIds
            .map((id: number) => candidates[id - 1])
            .filter((item: RetrievedKnowledgeEvidence | undefined): item is RetrievedKnowledgeEvidence => Boolean(item));

        const seen = new Set(ordered.map((item: RetrievedKnowledgeEvidence) => item.knowledgeUnitId));
        const remainder = matches.filter((item: RetrievedKnowledgeEvidence) => !seen.has(item.knowledgeUnitId));
        return [...ordered, ...remainder];
    } catch (error) {
        console.warn('AI reranking failed:', error);
        return matches;
    }
}
