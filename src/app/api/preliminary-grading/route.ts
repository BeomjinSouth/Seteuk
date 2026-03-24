import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5-mini';

interface PreliminaryGradingRequest {
    studentId: string;
    studentNumber: number;
    studentName: string;
    slotIndex: number;
    pageData: string;  // base64 image or PDF page data
    modelAnswer?: unknown;
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
}

function resolveModelAnswerQuestions(modelAnswer: any) {
    if (!modelAnswer || typeof modelAnswer !== 'object') return [];
    if (Array.isArray(modelAnswer.sets) && modelAnswer.sets.length > 0) {
        const preferred = modelAnswer.sets.find((set: any) => typeof set.label === 'string' && set.label.includes('표준'))
            || modelAnswer.sets[0];
        return Array.isArray(preferred?.questions) ? preferred.questions : [];
    }
    if (Array.isArray(modelAnswer.questions)) return modelAnswer.questions;
    return [];
}

/**
 * Performs preliminary grading (sample grading) for a single student.
 *
 * @description
 * Used by teachers to verify and tune the grading criteria before batch processing.
 * Analyzes one student's answer sheet against rubrics and model answers.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - studentId: string
 *   - pageData: string (Base64 image/PDF)
 *   - scoringCriteria: object
 *   - achievementStandards: object
 *   - modelAnswer?: object
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: Grading result object
 */
export async function POST(request: NextRequest) {
    try {
        const body: PreliminaryGradingRequest = await request.json();
        const {
            studentId,
            studentNumber,
            studentName,
            slotIndex,
            pageData,
            modelAnswer,
            scoringCriteria,
            achievementStandards
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

        const modelAnswerQuestions = resolveModelAnswerQuestions(modelAnswer);
        let modelAnswerContext = '';
        if (modelAnswerQuestions.length > 0) {
            modelAnswerContext = '\n## 모범답안\n';
            modelAnswerQuestions.forEach((q: any) => {
                const answerContent = q.answer
                    || (Array.isArray(q.answers) && q.answers[0]?.content)
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

        const prompt = `당신은 가채점(예비 채점)을 수행하는 채점자입니다. 이 채점 결과는 교사가 검토하고 피드백을 제공하는 데 사용됩니다.

**학생 정보:** ${studentNumber}번 ${studentName}

${rubricContext}

${modelAnswerContext}

## 가채점 요청
1. 이미지에서 학생의 답안을 읽어주세요.
2. 각 채점기준별로 점수를 부여하고 피드백을 작성해 주세요.
3. 최종 성취수준(상/중/하)을 판정해 주세요.

## 응답 형식 (JSON)
{
  "extractedText": "학생이 작성한 답안 전체 텍스트",
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
  "overallFeedback": "전체적인 피드백과 개선점"
}

JSON 형식으로만 응답해 주세요.`;

        const base64Data = pageData.includes(',') ? pageData.split(',')[1] : pageData;

        const cacheParams = getPromptCacheParams('preliminary-grading:v1', [
            rubricContext,
            modelAnswerContext,
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
            console.error('Failed to parse preliminary grading response:', responseText);
            return NextResponse.json(
                { success: false, error: '가채점 결과를 파싱하는데 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                id: `prelim-${Date.now()}`,
                studentId,
                studentNumber,
                studentName,
                slotIndex,
                ...parsedResult,
                gradedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Preliminary grading error:', error);
        return NextResponse.json(
            { success: false, error: '가채점 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
