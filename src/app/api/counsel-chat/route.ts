export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import {
    buildCitations,
    buildConflictSummary,
    buildFallbackCounselAnswer,
    searchKnowledgeBase,
} from '@/lib/knowledge-base';
import type { CounselChatResponse } from '@/types/knowledge';

const DEFAULT_MODEL = 'gpt-5-mini';

function getClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function POST(request: NextRequest) {
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
        const matches = await searchKnowledgeBase({
            query: question,
            schoolLevel: body.schoolLevel,
            category: body.category,
            year: body.year,
            limit: 5,
        });

        const citations = buildCitations(matches);
        const conflictNote = buildConflictSummary(matches);
        if (matches.length === 0) {
            const payload: CounselChatResponse = {
                success: true,
                answer: buildFallbackCounselAnswer(question, matches),
                citations: [],
                matches: [],
                conflictNote: null,
                fallback: true,
                model: null,
            };
            return NextResponse.json(payload);
        }

        const client = getClient();

        if (!client) {
            const payload: CounselChatResponse = {
                success: true,
                answer: buildFallbackCounselAnswer(question, matches),
                citations,
                matches,
                conflictNote,
                fallback: true,
                model: null,
            };
            return NextResponse.json(payload);
        }

        const evidenceText = matches
            .map((match, index) => {
                const anchors = match.policyAnchors.map((anchor) => `- ${anchor.rule}`).join('\n');
                return [
                    `[Evidence ${index + 1}]`,
                    `제목: ${match.title}`,
                    `출처: ${match.sourceBoard}`,
                    `학교급: ${match.schoolLevels.join(', ')}`,
                    `구분: ${match.categories.join(', ') || '-'}`,
                    `기준연도: ${match.effectiveYear ?? '미상'}`,
                    `질문: ${match.question}`,
                    `답변: ${match.answer}`,
                    anchors ? `정책 근거:\n${anchors}` : '',
                ].filter(Boolean).join('\n');
            })
            .join('\n\n');

        const cacheParams = getPromptCacheParams('counsel-chat:v1', [
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
                evidenceText,
            ].filter(Boolean).join('\n'),
            reasoning: { effort: 'low' },
            max_output_tokens: 1200,
            ...cacheParams,
        });

        const payload: CounselChatResponse = {
            success: true,
            answer: response.output_text || buildFallbackCounselAnswer(question, matches),
            citations,
            matches,
            conflictNote,
            model: DEFAULT_MODEL,
        };

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Counsel chat failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to generate answer.',
            },
            { status: 500 }
        );
    }
}
