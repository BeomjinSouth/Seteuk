import { NextResponse } from 'next/server';
import { withTeacherAuth } from '@/lib/auth/guards';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5.4-mini';

interface GradingRequest {
    studentId: string;
    studentNumber: number;
    studentName: string;
    slotIndex: number;
    pageData: string;  // base64 image or PDF page data
    modelAnswer: unknown;
    scoringCriteria: Array<{
        id: string;
        element: string;
        levels: Array<{
            score: number;
            description: string;
        }>;
    }>;
    achievementStandards: Array<{
        code?: string;
        description?: string;
        levels?: Array<{
            level: string;
            description: string;
        }>;
    }>;
    systemPrompt?: string;  // 교사가 지정한 채점 가이드라인
}

interface ModelAnswerQuestion {
    questionNumber: string | number;
    questionText: string;
    answer?: string;
    answers?: Array<{ content?: string }>;
    rubricPoints: string[];
    maxScore?: number | null;
}

interface ModelAnswerPayload {
    sets?: Array<{
        label?: string;
        questions?: ModelAnswerQuestion[];
    }>;
    questions?: ModelAnswerQuestion[];
}

function resolveModelAnswerQuestions(modelAnswer: ModelAnswerPayload | null | undefined): ModelAnswerQuestion[] {
    if (!modelAnswer || typeof modelAnswer !== 'object') return [];
    const payload = modelAnswer as ModelAnswerPayload;
    if (Array.isArray(payload.sets) && payload.sets.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const preferred = payload.sets.find((set: any) => typeof set.label === 'string' && set.label.includes('표준'))
            || payload.sets[0];
        return Array.isArray(preferred?.questions) ? preferred.questions : [];
    }
    if (Array.isArray(payload.questions)) return payload.questions;
    return [];
}



/**
 * Performs AI-based batch grading for a specific student's answer sheet.
 *
 * @description
 * Analyzes the provided student answer image/PDF page against the model answer and scoring criteria.
 * Generates scores, feedback, and achievement levels using `gpt-5.4-mini`.
 *
 * @param {NextRequest} request - The request object containing:
 *   - studentId: string
 *   - studentNumber: number
 *   - studentName: string
 *   - slotIndex: number (Page/slot index)
 *   - pageData: string (Base64 image or PDF data)
 *   - modelAnswer: object (Question details and answers)
 *   - scoringCriteria: object (Rubrics)
 *   - achievementStandards: object (curriculum standards)
 *   - systemPrompt?: string (Optional teacher guidelines)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: Grading result object including scores, total score, and feedback
 */
export const POST = withTeacherAuth(async (request) => {
    try {
        const body: GradingRequest = await request.json();
        const {
            studentId,
            studentNumber,
            studentName,
            slotIndex,
            pageData,
            modelAnswer,
            scoringCriteria,
            achievementStandards,
            systemPrompt
        } = body;

        if (!pageData) {
            return NextResponse.json(
                { success: false, error: '학생 답안 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        if (!hasOpenAIApiKey()) {
            return NextResponse.json(
                { success: false, error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
                { status: 503 }
            );
        }

        // Build context for grading
        let rubricContext = '';

        if (achievementStandards && achievementStandards.length > 0) {
            rubricContext += '## 성취기준\n';
            achievementStandards.forEach((std) => {
                rubricContext += `- ${std.code || ''} ${std.description || ''}\n`;
                if (std.levels) {
                    std.levels.forEach((level) => {
                        rubricContext += `  - ${level.level}: ${level.description}\n`;
                    });
                }
            });
        }

        if (scoringCriteria && scoringCriteria.length > 0) {
            rubricContext += '\n## 채점기준\n';
            scoringCriteria.forEach((crit) => {
                rubricContext += `### ${crit.element}\n`;
                crit.levels.forEach((level) => {
                    rubricContext += `- ${level.score}점: ${level.description}\n`;
                });
            });
        }

        const modelAnswerQuestions = resolveModelAnswerQuestions(modelAnswer as ModelAnswerPayload | null | undefined);
        let modelAnswerContext = '';
        if (modelAnswerQuestions.length > 0) {
            modelAnswerContext = '\n## 모범답안\n';
            modelAnswerQuestions.forEach((q) => {
                const answerContent = (typeof q.answer === 'string' && q.answer)
                    || (Array.isArray(q.answers) && typeof q.answers[0]?.content === 'string' && q.answers[0].content)
                    || '';
                modelAnswerContext += `### ${q.questionNumber}번 문항\n`;
                modelAnswerContext += `**문제:** ${q.questionText}\n`;
                modelAnswerContext += `**모범답안:** ${answerContent}\n`;
                modelAnswerContext += `**채점 포인트:** ${q.rubricPoints.join(', ')}\n`;
                if (q.maxScore) {
                    modelAnswerContext += `**배점:** ${q.maxScore}점\n`;
                }
                modelAnswerContext += '\n';
            });
        }

        // Include system prompt from teacher feedback if provided
        const teacherGuideline = systemPrompt
            ? `\n## 교사 채점 가이드라인\n${systemPrompt}\n`
            : '';

        const prompt = `당신은 엄격하고 공정한 채점자입니다. 아래 학생의 답안을 채점해 주세요.
${teacherGuideline}
**학생 정보:** ${studentNumber}번 ${studentName}

${rubricContext}

${modelAnswerContext}

## 채점 요청
1. 이미지에서 학생의 답안을 읽어주세요.
2. 각 **문항별** 점수와 피드백을 작성해 주세요. 문항별 점수 합이 총점과 일치해야 합니다.
3. 각 채점기준별로 점수를 부여하고 피드백을 작성해 주세요.
4. 최종 성취수준(상/중/하)을 판정해 주세요.
5. **중요:** 채점 기준이 모호하거나 해석이 애매한 항목이 있다면 "ambiguousItems"에 명시해 주세요.

## 응답 형식 (JSON)
{
  "extractedText": "학생이 작성한 답안 전체 텍스트",
  "questionResults": [
    {
      "questionNumber": 1,
      "score": 점수,
      "maxScore": 최대점수,
      "feedback": "해당 문항에 대한 피드백"
    }
  ],
  "scores": [
    {
      "criteriaId": "채점기준ID",
      "criteriaElement": "평가요소명",
      "score": 점수,
      "maxScore": 최대점수,
      "feedback": "해당 기준에 대한 구체적 피드백"
    }
  ],
  "totalScore": 총점,
  "maxTotalScore": 총배점,
  "achievementLevel": "상/중/하",
  "overallFeedback": "전체적인 피드백과 개선점",
  "ambiguousItems": [
    {
      "criteriaId": "채점기준ID",
      "criteriaElement": "평가요소명",
      "reason": "애매한 이유 (예: 부분정답 인정 범위 불명확, 채점 기준 해석 상이 등)",
      "confidence": 0.0-1.0 사이의 신뢰도
    }
  ]
}

JSON 형식으로만 응답해 주세요.`;

        const base64Data = pageData.includes(',') ? pageData.split(',')[1] : pageData;

        const cacheParams = getPromptCacheParams('batch-grading:v1', [
            rubricContext,
            modelAnswerContext,
            teacherGuideline,
        ]);

        const openai = getOpenAIClient();
        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            input: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: prompt,
                        },
                        {
                            type: 'input_image',
                            image_url: `data:image/jpeg;base64,${base64Data}`,
                            detail: 'high',
                        },
                    ],
                },
            ],
            text: { format: { type: 'json_object' } },
            max_output_tokens: 4096,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const responseText = response.output_text || '{}';

        let parsedResult;
        try {
            parsedResult = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse grading response.');
            return NextResponse.json(
                { success: false, error: '채점 결과를 파싱하는데 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                studentId,
                studentNumber,
                studentName,
                slotIndex,
                ...parsedResult,
                gradedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Batch grading error:', error);
        return NextResponse.json(
            { success: false, error: '채점 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
});
