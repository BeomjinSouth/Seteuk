import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { OPENAI_STANDARD_MODEL, normalizeOpenAIModel } from '@/lib/openai-models';
import {
    countObservationBoardContextItems,
    formatObservationBoardContextForPrompt,
    type ObservationBoardAiContext,
} from '@/lib/observation-board-ai-context';
import { getAssessments, getObservationsForContext } from '@/lib/sheets';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import { resolveSeteukSystemPrompt } from '@/lib/prompts/seteuk';

const DEFAULT_MODEL = OPENAI_STANDARD_MODEL;
const DEFAULT_MAX_OUTPUT_TOKENS = 1000;
const DEFAULT_REASONING_EFFORT: 'none' | 'low' | 'medium' | 'high' | 'xhigh' = 'low';
const ALLOWED_REASONING_EFFORTS = new Set(['none', 'low', 'medium', 'high', 'xhigh']);
const PROHIBITED_FALLBACK_EVIDENCE_PATTERN = /점수|총점|원점수|평균|성취율|등급|등수|석차|백분위|수상|상훈|대회|문항 번호|문제 번호|세부 문항|평가 결과/;

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
 * Uses `gpt-5.4-mini` as the standard model.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - studentName: string (Required)
 *   - subjectName?: string
 *   - learningData?: Record<string, string>
 *   - curriculumContent?: string (Important for context)
 *   - ocrEvaluationContext?: object (OCR analysis results)
 *   - includeObservations?: boolean (Default: true)
 *   - observationBoardContext?: object (멘토·멘티 활동판 해석 context)
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
        observationBoardContext?: ObservationBoardAiContext;
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
        observationBoardContext,
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

    const observationBoardText = formatObservationBoardContextForPrompt(observationBoardContext);
    const observationBoardContextCount = countObservationBoardContextItems(observationBoardContext);
    if (observationBoardText) {
        userPrompt += `\n\n[멘토·멘티 활동 해석]\n${observationBoardText}\n\n// 이 섹션은 교사가 차시별 활동 표에 남긴 △/○ 기록을 해석한 요약입니다.\n// 차시명이나 △/○를 그대로 나열하지 말고, 관계 기반 활동에서 드러난 성실성·책임감·협력 태도·활동 지속성·성장 흐름으로 자연스럽게 반영하세요.\n// 활동판 기록만으로 교과 지식 성취나 리더십을 단정하지 말고, 관찰 메모와 학습 데이터가 있으면 그 구체 장면을 우선하세요.`;
    }

    // Add curriculum content if provided
    if (curriculumContent && curriculumContent.trim()) {
        userPrompt += `\n\n[중요] 이번 학기 교육과정 내용 :\n${curriculumContent}\n\n// 교육과정은 활동 맥락을 파악하기 위한 참고자료입니다.\n- 단원명, 개념, 활동은 관찰 메모나 학습 데이터와 직접 연결될 때만 언급하세요.\n- 학생이 해당 내용을 어떻게 이해하고 적용했는지는 입력 자료에 관찰된 근거가 있을 때만 서술하세요.\n- 교육과정 내용만으로 학생의 성취, 태도, 역량을 새로 만들지 마세요.`;
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
            ocrContextText += `\n\n학생 피드백 참고자료:`;
            const feedbacks = result.scores?.filter(s => !!s.feedback?.trim()) || [];
            if (feedbacks.length > 0) {
                ocrContextText += '\n- 세부 피드백:';
                feedbacks.forEach(s => {
                    ocrContextText += `\n  • ${s.criteriaElement}: ${s.feedback}`;
                });
            }
            if (result.overallFeedback) {
                ocrContextText += `\n - 종합 피드백: ${result.overallFeedback}`;
            }
        }

        userPrompt += ocrContextText;
        userPrompt += '\n\n위 OCR 참고자료는 관찰 근거가 있는 수행 내용과 피드백만 세특 맥락으로 활용하고, 점수·등급·성취수준·문항 번호처럼 학교생활기록부에 부적절한 정보는 출력하지 마세요.';
    }

    // Add example templates if provided
    if (exampleTemplates && exampleTemplates.length > 0) {
        userPrompt += `\n\n참고할 수 있는 예시 양식:
${exampleTemplates.join('\n\n')}

위 예시의 어휘, 어투, 표현 방식 등을 참고하여 작성해 주세요.`;
    }

    // Use custom system prompt if provided, otherwise use default
    const finalSystemPrompt = resolveSeteukSystemPrompt(systemPrompt);

    // Normalize any legacy/persisted model selection to the current standard model.
    const actualModel = normalizeOpenAIModel(model || DEFAULT_MODEL);
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
            message: 'API 키가 설정되지 않아 기본 템플릿을 사용합니다.',
            observationBoardContextCount,
        });
    }

    try {
        const openai = getOpenAIClient();
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Calling OpenAI with model: ${actualModel}`);
        }

        const cacheParams = getPromptCacheParams('generate:v2', [
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
            observationBoardContextCount,
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
            error: 'API 호출 실패로 기본 템플릿을 사용했습니다.',
            observationBoardContextCount,
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
        const values = Object.entries(learningData)
            .filter(([, value]) => !!value?.trim())
            .filter(([key, value]) => !PROHIBITED_FALLBACK_EVIDENCE_PATTERN.test(`${key} ${value}`))
            .map(([, value]) => value.trim());
        if (values.length > 0) {
            dataText = values.join('. ');
        }
    }

    if (!dataText) {
        return '충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.';
    }

    const subject = subjectName || '해당 교과';

    return `${subject} 활동에서 제공된 관찰 자료를 바탕으로 ${dataText} 내용을 기록함. 입력된 학습 자료와 관찰 메모 범위 안에서 수행 내용과 참여 과정을 정리함.`;
}
