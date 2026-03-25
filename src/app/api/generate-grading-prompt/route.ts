import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5.4-mini';

interface GeneratePromptRequest {
    feedbackItems: string[];
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
    preliminaryResults?: Array<{
        studentName: string;
        scores: Array<{
            criteriaElement: string;
            score: number;
            maxScore: number;
        }>;
        achievementLevel: string;
        teacherFeedback?: string;
    }>;
}

/**
 * Generates a system prompt for batch grading based on teacher feedback.
 *
 * @description
 * Analyzes preliminary grading results and teacher's manual feedback to create
 * a consistent grading guideline (system prompt) for the AI to use in batch processing.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - feedbackItems: string[] (Teacher's feedback notes)
 *   - scoringCriteria: object (Rubrics)
 *   - preliminaryResults?: object (Sample graded results)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: object
 *     - gradingTendency: string
 *     - systemPrompt: string (The generated guideline)
 */
export async function POST(request: NextRequest) {
    try {
        const body: GeneratePromptRequest = await request.json();
        const { feedbackItems, scoringCriteria, achievementStandards, preliminaryResults } = body;

        if (!feedbackItems || feedbackItems.length === 0) {
            return NextResponse.json(
                { success: false, error: '피드백 항목이 필요합니다.' },
                { status: 400 }
            );
        }

        if (!hasOpenAIApiKey()) {
            return NextResponse.json(
                { success: false, error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
                { status: 503 }
            );
        }

        // Build context from scoring criteria
        let criteriaContext = '';
        if (scoringCriteria && scoringCriteria.length > 0) {
            criteriaContext = '## 채점기준\n';
            scoringCriteria.forEach((crit) => {
                criteriaContext += `- ${crit.element}\n`;
                crit.levels.forEach((level) => {
                    criteriaContext += `  - ${level.score}점: ${level.description}\n`;
                });
            });
        }

        // Build context from preliminary results
        let resultsContext = '';
        if (preliminaryResults && preliminaryResults.length > 0) {
            resultsContext = '\n## 가채점 결과 및 교사 피드백\n';
            preliminaryResults.forEach((result, idx) => {
                resultsContext += `### ${idx + 1}. ${result.studentName} (${result.achievementLevel})\n`;
                result.scores.forEach((s) => {
                    resultsContext += `- ${s.criteriaElement}: ${s.score}/${s.maxScore}점\n`;
                });
                if (result.teacherFeedback) {
                    resultsContext += `**교사 피드백:** ${result.teacherFeedback}\n`;
                }
                resultsContext += '\n';
            });
        }

        const feedbackText = feedbackItems.map((item, idx) => `${idx + 1}. ${item}`).join('\n');

        const prompt = `당신은 교사의 채점 피드백을 분석하여 채점 가이드라인(시스템 프롬프트)을 생성하는 전문가입니다.

아래 교사의 피드백과 가채점 결과를 분석하여, 일괄 채점 시 AI가 참고할 채점 가이드라인을 생성해 주세요.

${criteriaContext}

${resultsContext}

## 교사 피드백 항목
${feedbackText}

## 생성 요청
위 피드백을 기반으로 다음을 포함한 채점 가이드라인을 생성해 주세요:
1. 교사의 채점 성향 (관대함/엄격함, 중시하는 요소 등)
2. 특별히 주의해야 할 채점 포인트
3. 점수 부여 시 고려해야 할 세부 기준
4. 피드백 작성 시 주의사항

## 응답 형식 (JSON)
{
  "gradingTendency": "교사의 채점 성향 요약",
  "systemPrompt": "채점 시 AI가 참고할 가이드라인 프롬프트 (3-5문장)"
}

JSON 형식으로만 응답해 주세요.`;

        const cacheParams = getPromptCacheParams('generate-grading-prompt:v1', [
            JSON.stringify(scoringCriteria ?? []),
            JSON.stringify(achievementStandards ?? []),
        ]);

        const openai = getOpenAIClient();
        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            input: prompt,
            text: { format: { type: 'json_object' } },
            max_output_tokens: 2048,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const responseText = response.output_text || '{}';

        let parsedResult;
        try {
            parsedResult = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse generate prompt response:', responseText);
            return NextResponse.json(
                { success: false, error: '프롬프트 생성 결과를 파싱하는데 실패했습니다.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            result: {
                gradingTendency: parsedResult.gradingTendency || '',
                systemPrompt: parsedResult.systemPrompt || '',
                generatedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Generate grading prompt error:', error);
        return NextResponse.json(
            { success: false, error: '채점 가이드라인 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
