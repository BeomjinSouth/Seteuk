export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withTeacherAuth } from '@/lib/auth/guards';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import {
    buildCitations,
    buildConflictSummary,
    buildFallbackCounselAnswer,
} from '@/lib/knowledge-base';
import { buildGraphRagAnswerSpans, buildGraphRagGraph } from '@/lib/knowledge-graph';
import { formatGraphLabelsForPrompt } from '@/lib/knowledge-labels';
import { rerankMatchesWithAI } from '@/lib/knowledge-rerank';
import { isHostedKnowledgeConfigured } from '@/lib/knowledge-hosted';
import { searchKnowledgeHybrid, shouldSkipRerankForHighConfidenceLexical } from '@/lib/knowledge-search';
import type { GraphRagResponse, RetrievedKnowledgeEvidence } from '@/types/knowledge';

const DEFAULT_MODEL = 'gpt-5.4-mini';
const GRAPH_MATCH_LIMIT = 8;

function getClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildEvidenceText(matches: RetrievedKnowledgeEvidence[]): string {
    return matches
        .map((match, index) => {
            const anchors = match.policyAnchors.map((anchor) => `- ${anchor.rule}`).join('\n');
            const labels = formatGraphLabelsForPrompt(match.graphLabels);
            return [
                `[Graph Evidence ${index + 1}]`,
                `knowledgeUnitId: ${match.knowledgeUnitId}`,
                `제목: ${match.title}`,
                `출처: ${match.sourceBoard}`,
                `학교급: ${match.schoolLevels.join(', ')}`,
                `구분: ${match.categories.join(', ') || '-'}`,
                `기준연도: ${match.effectiveYear ?? '미상'}`,
                labels ? `분류 라벨: ${labels}` : '',
                `질문: ${match.question}`,
                `답변: ${match.answer}`,
                match.ruleSummary ? `요약: ${match.ruleSummary}` : '',
                anchors ? `정책 근거:\n${anchors}` : '',
            ].filter(Boolean).join('\n');
        })
        .join('\n\n');
}

function buildPayload(input: {
    question: string;
    answer: string;
    matches: RetrievedKnowledgeEvidence[];
    fallback?: boolean;
    model?: string | null;
}): GraphRagResponse {
    const citations = buildCitations(input.matches);
    return {
        success: true,
        answer: input.answer,
        citations,
        matches: input.matches,
        conflictNote: buildConflictSummary(input.matches),
        fallback: input.fallback,
        model: input.model,
        graph: buildGraphRagGraph(input.question, input.matches),
        answerSpans: buildGraphRagAnswerSpans(input.answer, input.matches),
    };
}

export const POST = withTeacherAuth(async (request) => {
    let body: {
        question?: string;
        schoolLevel?: string;
        category?: string;
        year?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const question = body.question?.trim();
    if (!question) {
        return NextResponse.json({ success: false, error: 'question is required.' }, { status: 400 });
    }

    try {
        let matches = await searchKnowledgeHybrid({
            query: question,
            schoolLevel: body.schoolLevel,
            category: body.category,
            year: body.year,
            limit: GRAPH_MATCH_LIMIT,
        });

        if (matches.length === 0) {
            const answer = buildFallbackCounselAnswer(question, matches);
            return NextResponse.json(buildPayload({
                question,
                answer,
                matches,
                fallback: true,
                model: null,
            }));
        }

        const client = getClient();
        const skipRerank = !isHostedKnowledgeConfigured() && shouldSkipRerankForHighConfidenceLexical(matches);
        if (client && !skipRerank) {
            matches = await rerankMatchesWithAI({
                client,
                query: question,
                matches,
                schoolLevel: body.schoolLevel,
                category: body.category,
                year: body.year,
                model: DEFAULT_MODEL,
            });
        }

        if (!client) {
            const answer = buildFallbackCounselAnswer(question, matches);
            return NextResponse.json(buildPayload({
                question,
                answer,
                matches,
                fallback: true,
                model: null,
            }));
        }

        const cacheParams = getPromptCacheParams('counsel-chat:graph-rag:v1', [
            question,
            body.schoolLevel || '',
            body.category || '',
            body.year || '',
            matches.map((match) => `${match.knowledgeUnitId}:${match.score}`).join('|'),
        ]);

        const response = await client.responses.create({
            model: DEFAULT_MODEL,
            instructions: [
                '당신은 학교생활기록부 상담 보조 AI다.',
                '반드시 제공된 공개 근거만 사용해 답변한다.',
                '답변은 문장이나 짧은 단락 단위로 작성해 각 부분을 근거 발췌와 연결할 수 있게 한다.',
                '근거가 충돌하면 차이를 숨기지 말고 설명한다.',
                '비밀글, 추정, 일반 상식으로 답을 보강하지 않는다.',
                '답변은 한국어로 작성한다.',
            ].join('\n'),
            input: [
                `사용자 질문: ${question}`,
                body.schoolLevel ? `학교급 필터: ${body.schoolLevel}` : '',
                body.category ? `구분 필터: ${body.category}` : '',
                body.year ? `연도 필터: ${body.year}` : '',
                '',
                '[온톨로지/RAG 후보 근거]',
                buildEvidenceText(matches),
            ].filter(Boolean).join('\n'),
            reasoning: { effort: 'low' },
            max_output_tokens: 1200,
            ...cacheParams,
        });

        const answer = response.output_text || buildFallbackCounselAnswer(question, matches);
        return NextResponse.json(buildPayload({
            question,
            answer,
            matches,
            model: DEFAULT_MODEL,
        }));
    } catch (error) {
        console.error('Graph counsel chat failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate graph answer.',
            },
            { status: 500 },
        );
    }
});
