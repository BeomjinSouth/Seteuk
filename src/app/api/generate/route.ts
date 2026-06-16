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

const SUBJECT_CONTEXT_HINTS: Array<{
    pattern: RegExp;
    byGrade?: Partial<Record<1 | 2 | 3, string[]>>;
    common: string[];
}> = [
    {
        pattern: /수학/,
        byGrade: {
            1: ['문자와 식의 수량 관계', '좌표평면과 그래프', '기본 도형의 성질', '자료의 정리'],
            2: ['일차부등식과 연립일차방정식', '일차함수의 그래프', '도형의 성질', '확률'],
            3: ['제곱근과 실수', '이차방정식과 이차함수', '삼각비와 원의 성질', '통계'],
        },
        common: ['수량 관계를 식으로 나타내기', '문제 조건 확인', '풀이 과정 설명'],
    },
    {
        pattern: /국어/,
        common: ['글의 중심 내용과 근거 파악', '글의 전개 흐름 확인', '말하기와 듣기에서 질문에 응답하기', '쓰기 내용 조직과 표현 조정'],
    },
    {
        pattern: /과학/,
        byGrade: {
            1: ['물질의 상태 변화', '힘과 운동', '생물 다양성', '지권과 기권의 변화'],
            2: ['물질의 구성', '전기와 자기', '식물과 에너지', '태양계와 별'],
            3: ['화학 반응 전후의 변화', '생식과 유전', '역학적 에너지', '기후 변화와 환경'],
        },
        common: ['관찰 결과 기록', '실험 전후 변화 확인', '자료와 현상 비교'],
    },
    {
        pattern: /사회/,
        common: ['지도와 자료를 활용한 지역 이해', '자연환경과 인간 생활의 관계', '사회 현상의 원인과 영향 비교', '시민 생활과 제도 이해'],
    },
    {
        pattern: /역사/,
        common: ['역사 자료의 내용 확인', '시대적 배경과 사건의 흐름 파악', '인물과 제도의 변화 비교', '근거를 바탕으로 역사적 사실 설명'],
    },
    {
        pattern: /영어/,
        common: ['일상 대화문의 요청과 응답 표현', '글의 중심 내용과 세부 정보 파악', '어휘와 문장 구조 확인', '자신의 생각을 짧은 문장으로 표현'],
    },
    {
        pattern: /도덕/,
        common: ['도덕적 문제 상황의 쟁점 확인', '가치 판단의 근거 말하기', '타인의 관점과 자신의 생각 비교', '생활 속 실천 방안 정리'],
    },
    {
        pattern: /기술|가정/,
        common: ['생활 문제 해결 절차 확인', '제작 과정과 안전 수칙 준수', '가정생활 자료 비교', '기술의 활용 사례 정리'],
    },
    {
        pattern: /정보/,
        common: ['자료의 구조 확인', '알고리즘 절차 표현', '문제 해결 과정을 단계로 정리', '디지털 자료 처리 방식 비교'],
    },
    {
        pattern: /미술/,
        common: ['표현 의도와 시각 요소 선택', '재료와 기법의 효과 확인', '작품 감상에서 특징 말하기', '제작 과정에서 표현 방식 조정'],
    },
    {
        pattern: /음악/,
        common: ['음악 요소의 변화 듣기', '리듬과 가락의 특징 확인', '표현 활동에서 소리의 흐름 맞추기', '감상 내용을 근거와 함께 말하기'],
    },
    {
        pattern: /체육/,
        common: ['움직임의 원리 확인', '경기 규칙과 역할 수행', '기능 연습 과정 점검', '안전 수칙에 맞춘 활동 참여'],
    },
];

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
 *   - gradeLevel?: number
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
        gradeLevel?: number;
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
        gradeLevel,
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

    const normalizedGradeLevel = typeof gradeLevel === 'number' && Number.isFinite(gradeLevel)
        ? Math.max(1, Math.min(3, Math.floor(gradeLevel)))
        : undefined;

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
    userPrompt += `\n\n[교과/수업 맥락]\n- 교과: ${subjectName?.trim() || '미제공'}`;
    if (normalizedGradeLevel) {
        userPrompt += `\n- 학년: 중학교 ${normalizedGradeLevel}학년`;
    }
    const subjectContextHint = buildSubjectContextHint(subjectName, normalizedGradeLevel);
    if (subjectContextHint) {
        userPrompt += `\n- 학년·교과 참고 주제: ${subjectContextHint}`;
    }

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
        userPrompt += `\n\n[중요] 이번 학기 교육과정 내용 :\n${curriculumContent}\n\n// 교육과정은 활동 맥락을 파악하기 위한 참고자료입니다.\n- 관찰 메모나 학습 데이터가 짧더라도, 학생별 수행 행동이 하나 이상 있으면 단원명·주제·활동명은 문장 맥락으로 활용하세요.\n- 단원명이 직접 입력되지 않아도 학년·교과·교육과정 범위 안에서 자연스러운 일반 주제 하나를 골라 교과 내용이 보이게 작성하세요.\n- 단원명, 개념, 활동은 관찰 메모나 학습 데이터와 직접 연결될 때만 언급하세요.\n- 학생이 해당 내용을 어떻게 이해하고 적용했는지는 입력 자료에 관찰된 근거가 있을 때만 서술하세요.\n- 교육과정 내용만으로 학생의 성취, 태도, 역량을 새로 만들지 마세요.\n- 입력에 횟수나 차시 수가 있어도 최종 문장에는 쓰지 말고 행동 표현으로 바꾸세요.`;
    } else {
        userPrompt += `\n\n[학년·교과 기반 작성 안내]\n- 단원명이 직접 입력되지 않아도 학년과 교과가 제공되면 해당 교과의 넓은 일반 주제 안에서 문장 맥락을 잡으세요.\n- 단, 작품명·도서명·구체 실험명·세부 사건명처럼 확인되지 않은 고유 정보는 만들지 마세요.\n- "수업에 열심히 참여함", "활동지를 작성함", "발표에 참여함"만 반복하지 말고, 입력된 행동을 교과 내용과 연결해 무엇을 읽고, 계산하고, 관찰하고, 표현하고, 비교하고, 말했는지로 바꾸세요.\n- 입력에 횟수나 차시 수가 있어도 최종 문장에는 쓰지 말고 행동 표현으로 바꾸세요.`;
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
            content: generateFallbackContent(studentName, subjectName, learningData, curriculumContent, normalizedGradeLevel),
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
            normalizedGradeLevel || '',
            subjectContextHint,
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
            content: generateFallbackContent(studentName, subjectName, learningData, curriculumContent, normalizedGradeLevel),
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
    learningData?: Record<string, string>,
    curriculumContent?: string,
    gradeLevel?: number
): string {
    // Extract meaningful data from learningData
    let dataText = '';

    if (learningData && Object.keys(learningData).length > 0) {
        const values = Object.entries(learningData)
            .filter(([, value]) => !!value?.trim())
            .filter(([key, value]) => !PROHIBITED_FALLBACK_EVIDENCE_PATTERN.test(`${key} ${value}`))
            .flatMap(([, value]) => splitFallbackEvidence(value));
        if (values.length > 0) {
            dataText = formatFallbackEvidence(values);
        }
    }

    if (!dataText) {
        return '충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.';
    }

    const context = buildFallbackContext(subjectName, curriculumContent, gradeLevel);

    return `${context}에서 ${dataText}`;
}

function splitFallbackEvidence(value: string): string[] {
    return value
        .split(/[\n.;。]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 5);
}

function formatFallbackEvidence(values: string[]): string {
    const normalized = values
        .map((value) => value
            .replace(/\s+/g, ' ')
            .replace(/\b\d+\s*(회|번|차시)\b/gu, '')
            .replace(/[0-9０-９]+\s*(회|번|차시)/gu, '')
            .replace(/(하였음|하였고|하였다|했음|했고|했다|함)$/u, '')
            .trim()
        )
        .filter(Boolean);

    const clauses = normalized.map(formatFallbackClause);

    if (clauses.length === 0) return '제공된 관찰 내용을 기록함.';

    return clauses.join(' ');
}

function formatFallbackClause(value: string): string {
    if (/문제|풀이|계산/u.test(value)) return '주어진 조건을 확인하며 풀이 과정을 이어감.';
    if (/글|읽/u.test(value) && /질문|답/u.test(value)) return '읽은 내용의 중심 내용을 확인하고 질문에 답함.';
    if (/글|읽/u.test(value)) return '글의 중심 내용과 근거를 확인함.';
    if (/질문|답변|응답|답/u.test(value)) return '읽은 내용을 바탕으로 질문에 답함.';
    if (/설명/u.test(value)) return '확인한 내용을 말로 설명함.';
    if (/실험|관찰/u.test(value) && /결과|기록/u.test(value)) return '관찰한 변화와 결과를 기록함.';
    if (/실험|관찰/u.test(value)) return '관찰 대상의 변화와 특징을 확인함.';
    if (/자료\s*조사/u.test(value)) return '자료의 주요 내용을 확인함.';
    if (/활동지/u.test(value) && /제출/u.test(value)) return '확인한 내용을 산출물로 제출함.';
    if (/활동지/u.test(value) && /(작성|정리)/u.test(value)) return '확인한 내용을 교과 맥락에 맞게 기록함.';
    if (/발표/u.test(value)) return '확인한 교과 내용을 말로 설명함.';
    if (/모둠|모둠활동/u.test(value)) return '공동 활동의 흐름에 맞추어 맡은 과정을 수행함.';
    if (/태도/u.test(value) && /(좋|양호)/u.test(value)) return '수업 흐름에 맞추어 활동에 참여함.';

    return `${value} 활동이 관찰됨.`;
}

function buildFallbackContext(subjectName?: string, curriculumContent?: string, gradeLevel?: number): string {
    const subject = subjectName?.trim() || '해당 교과';
    const gradePrefix = gradeLevel ? `중학교 ${gradeLevel}학년 ` : '';
    const subjectContextHint = buildSubjectContextHint(subjectName, gradeLevel);
    const curriculumLine = curriculumContent
        ?.split(/\r?\n/)
        .map((line) => line.replace(/^(?:[-*•]\s*|\d+[.)]\s*)+/, '').trim())
        .find((line) => line.length > 0);

    if (!curriculumLine) {
        const firstHint = subjectContextHint?.split(',')[0]?.trim();
        return firstHint ? `${gradePrefix}${subject} 교과의 ${firstHint} 맥락` : `${gradePrefix}${subject} 수업`;
    }

    const compactCurriculum = curriculumLine
        .replace(/\s+/g, ' ')
        .slice(0, 40)
        .trim();

    return `${gradePrefix}${subject} 교과의 ${compactCurriculum} 맥락`;
}

function buildSubjectContextHint(subjectName?: string, gradeLevel?: number): string {
    const normalizedSubject = subjectName?.trim();
    if (!normalizedSubject) return '';

    const matched = SUBJECT_CONTEXT_HINTS.find((item) => item.pattern.test(normalizedSubject));
    if (!matched) return '';

    const gradeTopics = gradeLevel === 1 || gradeLevel === 2 || gradeLevel === 3
        ? matched.byGrade?.[gradeLevel]
        : undefined;
    const topics = gradeTopics?.length ? gradeTopics : matched.common;

    return topics.slice(0, 4).join(', ');
}
