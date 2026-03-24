import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getAssessments, getObservationsForContext } from '@/lib/sheets';
import { getPromptCacheParams } from '@/lib/prompt-cache';

// GPT-5 Model names (released December 11, 2025)
const DEFAULT_MODEL = 'gpt-5-mini';
const DEFAULT_MAX_OUTPUT_TOKENS = 1000;
const DEFAULT_REASONING_EFFORT: 'none' | 'low' | 'medium' | 'high' | 'xhigh' = 'low';
const ALLOWED_REASONING_EFFORTS = new Set(['none', 'low', 'medium', 'high', 'xhigh']);

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `당신은 한국 고등학교 교사로서 교과 세특(교과세부능력 및 특기사항)을 작성하는 AI 어시스턴트입니다.

세특 작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 기술합니다.
2. 과정 중심 평가 용어를 활용합니다.
3. 객관적이고 긍정적인 서술을 사용합니다.
4. 350~500자 내외로 작성합니다.
5. 비교/서열의 표현, 확정의 표현은 지양합니다.
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.
7. 관찰메모가 존재하면, 그 내용을 근거로 구체적인 예시를 활용합니다.

세특 구성 요소 (4가지를 모두 포함):
- 성취수준: 학생의 교과 목표의 달성한 정도
- 수행 과정 및 결과: 구체적인 학습 행동과 그 결과
- 역량: 발휘된 특별한 역량 (문제해결, 추론, 창의·융합, 의사소통, 정보처리, 태도 등)
- 교사 총평: 학생의 성장과 발전 가능성

입력받은 학생의 학습 데이터와 관찰메모를 바탕으로 세특을 생성해 주세요.`;

/**
 * Generates subject-specific student assessment records (Se-teuk) using AI.
 *
 * @description
 * Creates a comprehensive student evaluation based on:
 * - Student's learning data and observations
 * - Curriculum content
 * - OCR evaluation results (optional)
 * - Teacher's system prompt and guidelines
 *
 * Uses 'gpt-5-mini' (default) or specified model.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - studentName: string (Required)
 *   - subjectName?: string
 *   - learningData?: Record<string, string>
 *   - curriculumContent?: string (Important for context)
 *   - ocrEvaluationContext?: object (OCR analysis results)
 *   - includeObservations?: boolean (Default: true)
 *   - model?: string
 *   - systemPrompt?: string
 *   - maxOutputTokens?: number
 *   - reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh'
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - content: string (Generated Se-teuk text)
 *   - model: string
 *   - usedObservationIds: string[]
 *   - tokenUsage: object
 */
export async function POST(request: NextRequest) {
    // Parse body once and store it
    let body: {
        studentName?: string;
        studentId?: string;  // NEW: For fetching observations
        teacherKey?: string;
        classId?: string;
        subjectName?: string;
        learningData?: Record<string, string>;
        exampleTemplates?: string[];
        curriculumContent?: string;  // What is taught in this grade/semester
        model?: string;
        systemPrompt?: string;
        maxOutputTokens?: number;
        reasoningEffort?: 'none' | 'low' | 'medium' | 'high' | 'xhigh';
        includeObservations?: boolean;  // NEW: Whether to include observations
        // OCR Evaluation Context for integration
        ocrEvaluationContext?: {
            achievementStandards?: Array<{
                code: string;
                description: string;
                levels?: Array<{ level: string; description: string }>;
            }>;
            scoringCriteria?: Array<{
                element: string;
                levels?: Array<{ score: number; description: string }>;
            }>;
            studentResult?: {
                achievementLevel?: string;
                totalScore?: number;
                maxTotalScore?: number;
                scores?: Array<{
                    criteriaElement: string;
                    score: number;
                    maxScore: number;
                    feedback: string;
                }>;
                overallFeedback?: string;
            };
        };
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const {
        studentName,
        studentId,
        teacherKey,
        classId,
        subjectName,
        learningData,
        exampleTemplates,
        curriculumContent,  // What is taught in this grade/semester
        model,
        systemPrompt,
        maxOutputTokens,
        reasoningEffort,
        includeObservations = true,  // Default to true
        ocrEvaluationContext,  // OCR evaluation data
    } = body;

    if (!studentName) {
        return NextResponse.json(
            { error: '학생 이름이 필수입니다.' },
            { status: 400 }
        );
    }

    // Fetch observations for this student if studentId is provided
    let observationsText = '';
    let usedObservationIds: string[] = [];

    if (studentId && includeObservations) {
        try {
            const observations = await getObservationsForContext({ studentId, teacherKey, classId });
            const assessments = await getAssessments();

            if (observations.length > 0) {
                usedObservationIds = observations.map(o => o.id);

                observationsText = observations.map(obs => {
                    const assessment = assessments.find(a => a.id === obs.assessmentId);
                    const assessmentInfo = assessment ? `[${assessment.title}]` : '[일반 관찰]';
                    const typeInfo = obs.evidenceType === 'process' ? '(과정)' : '(결과)';
                    const classInfo = obs.subjectName ? `[${obs.subjectName}]` : '';
                    const lessonInfo = obs.lessonTopic ? ` ${obs.lessonTopic}` : '';
                    const tagsInfo = obs.tags.length > 0 ? ` - 역량: ${obs.tags.join(', ')}` : '';

                    return `• ${assessmentInfo}${classInfo}${lessonInfo} ${typeInfo} ${obs.date}\n  ${obs.memo}${tagsInfo}`;
                }).join('\n\n');
            }
        } catch (error) {
            console.error('Failed to fetch observations:', error);
            // Continue without observations
        }
    }

    let userPrompt = `다음 정보를 바탕으로 ${studentName} 학생의 ${subjectName || ''} 교과 세특을 작성해 주세요.`;

    // Add learning data if provided
    if (learningData && Object.keys(learningData).length > 0) {
        userPrompt += `\n\n[학습 데이터]:`;
        for (const key in learningData) {
            if (learningData[key]) {
                userPrompt += `\n- ${key}: ${learningData[key]}`;
            }
        }
    }

    // Add observations if available
    if (observationsText) {
        userPrompt += `\n\n[관찰 메모]\n${observationsText}\n\n// 관찰 메모는 수업 중 학생을 직접 관찰하고 기록한 내용입니다.\n// 관찰 내용을 근거로 구체적인 사례와 역량을 포함하여 세특을 작성해 주세요.`;
    }

    // Add curriculum content if provided
    if (curriculumContent && curriculumContent.trim()) {
        userPrompt += `\n\n[중요] 이번 학기 교육과정 내용 :\n${curriculumContent}\n\n// 교육과정 내용에 포함된 핵심 개념과 학습 내용을 반드시 세특에 포함하여 작성해 주세요.\n- 교육과정에 명시된 단원명, 개념, 활동을 구체적으로 언급하세요.\n- 학생이 해당 내용을 어떻게 이해하고 적용했는지 서술하세요.\n- 교육과정 내용과 학생의 학습 데이터를 연결하여 작성하세요.`;
    } else {
        userPrompt += `\n\n위 정보를 바탕으로 교과 세특을 작성해 주세요.`;
    }

    // Add OCR evaluation context if provided
    if (ocrEvaluationContext) {
        let ocrContextText = '\n\n■ 수행평가 결과 (OCR 분석 데이터):';

        // Achievement standards
        if (ocrEvaluationContext.achievementStandards && ocrEvaluationContext.achievementStandards.length > 0) {
            ocrContextText += '\n\n성취기준:';
            ocrEvaluationContext.achievementStandards.forEach(std => {
                ocrContextText += `\n - ${std.code} ${std.description}`;
            });
        }

        // Scoring criteria
        if (ocrEvaluationContext.scoringCriteria && ocrEvaluationContext.scoringCriteria.length > 0) {
            ocrContextText += '\n\n채점기준:';
            ocrEvaluationContext.scoringCriteria.forEach(crit => {
                ocrContextText += `\n - ${crit.element}`;
            });
        }

        // Student's grading result
        if (ocrEvaluationContext.studentResult) {
            const result = ocrEvaluationContext.studentResult;
            ocrContextText += `\n\n학생 평가 결과:`;
            if (result.achievementLevel) {
                ocrContextText += `\n - 성취수준: ${result.achievementLevel}`;
            }
            if (result.totalScore !== undefined && result.maxTotalScore !== undefined) {
                ocrContextText += `\n - 총점: ${result.totalScore}/${result.maxTotalScore}점`;
            }
            if (result.scores && result.scores.length > 0) {
                ocrContextText += '\n- 세부 점수:';
                result.scores.forEach(s => {
                    ocrContextText += `\n  • ${s.criteriaElement}: ${s.score}/${s.maxScore}점`;
                    if (s.feedback) {
                        ocrContextText += ` - ${s.feedback}`;
                    }
                });
            }
            if (result.overallFeedback) {
                ocrContextText += `\n - 종합 피드백: ${result.overallFeedback}`;
            }
        }

        userPrompt += ocrContextText;
        userPrompt += '\n\n위 수행평가 결과와 피드백을 참고하여, 학생의 성취 수준과 구체적인 수행 내용을 세특에 반영해 주세요.';
    }

    // Add example templates if provided
    if (exampleTemplates && exampleTemplates.length > 0) {
        userPrompt += `\n\n참고할 수 있는 예시 양식:
${exampleTemplates.join('\n\n')}

위 예시의 어휘, 어투, 표현 방식 등을 참고하여 작성해 주세요.`;
    }

    // Use custom system prompt if provided, otherwise use default
    const finalSystemPrompt = systemPrompt && systemPrompt.trim()
        ? systemPrompt
        : DEFAULT_SYSTEM_PROMPT;

    // Use specified model or default to gpt-5
    const actualModel = model || DEFAULT_MODEL;
    const actualMaxOutputTokens = typeof maxOutputTokens === 'number'
        ? Math.max(200, Math.min(3000, Math.floor(maxOutputTokens)))
        : DEFAULT_MAX_OUTPUT_TOKENS;
    const actualReasoningEffort: 'none' | 'low' | 'medium' | 'high' | 'xhigh' = ALLOWED_REASONING_EFFORTS.has(reasoningEffort || '')
        ? (reasoningEffort as 'none' | 'low' | 'medium' | 'high' | 'xhigh')
        : DEFAULT_REASONING_EFFORT;

    // Check if API key is available
    if (!hasOpenAIApiKey()) {
        console.log('No OpenAI API key, using fallback');
        return NextResponse.json({
            success: true,
            content: generateFallbackContent(studentName, subjectName, learningData),
            fallback: true,
            message: 'API 키가 설정되지 않아 기본 템플릿을 사용합니다.'
        });
    }

    try {
        const openai = getOpenAIClient();
        console.log(`Calling OpenAI with model: ${actualModel}`);
        console.log(`Learning data:`, learningData);

        const cacheParams = getPromptCacheParams('generate:v1', [
            finalSystemPrompt,
            subjectName || '',
            actualModel,
            actualMaxOutputTokens,
            actualReasoningEffort,
        ]);

        const response = await openai.responses.create({
            model: actualModel,
            instructions: finalSystemPrompt,
            input: userPrompt,
            max_output_tokens: actualMaxOutputTokens,
            reasoning: { effort: actualReasoningEffort },
            ...cacheParams,
        });

        const content = response.output_text || '';

        return NextResponse.json({
            success: true,
            content,
            model: actualModel,
            usedObservationIds,  // NEW: IDs of observations used
            observationCount: usedObservationIds.length,  // NEW: Count of observations used
            tokenUsage: {
                prompt: response.usage?.input_tokens || 0,
                completion: response.usage?.output_tokens || 0,
                total: response.usage?.total_tokens || 0,
            }
        });
    } catch (error) {
        console.error('OpenAI API error:', error);

        // Return fallback with the learning data we already have
        return NextResponse.json({
            success: true,
            content: generateFallbackContent(studentName, subjectName, learningData),
            fallback: true,
            error: 'API 호출 실패로 기본 템플릿을 사용했습니다.'
        });
    }
}

// Fallback content generator - properly uses learning data
function generateFallbackContent(
    studentName: string,
    subjectName?: string,
    learningData?: Record<string, string>
): string {
    // Extract meaningful data from learningData
    let dataText = '';

    if (learningData && Object.keys(learningData).length > 0) {
        const values = Object.values(learningData).filter(v => v && v.trim());
        if (values.length > 0) {
            dataText = values.join('. ');
        }
    }

    if (!dataText) {
        dataText = '수업에 성실하게 참여하며 학습 활동에 적극적으로 임함';
    }

    const subject = subjectName || '해당 교과';

    return `${studentName} 학생은 ${dataText}. ${subject} 수업에서 적극적인 학습 태도를 보이며 다양한 탐구 활동에서 주도적으로 참여하는 모습이 인상적이었음. 수업 과정에서 정확한 관찰력과 논리적인 분석 능력을 발휘하고 조별 활동에서 원활하게 소통하며 협력하는 과제 수행을 성실하고 꾸준하게 임하며 어려운 문제에도 포기하지 않고 끝까지 해결하려는 자세가 돋보임.`;
}
