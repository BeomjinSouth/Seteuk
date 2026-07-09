import type { RecordReviewResponse } from '@/types/knowledge';
import type { OCREvaluation, StudentGradingResult } from '@/types/ocr';
import { readObservationBoardAiContext } from '@/lib/observation-board-ai-context';
import type { CurriculumGenerationContext } from '@/lib/curriculum-context';
import { OPENAI_STANDARD_MODEL, normalizeOpenAIModel } from '@/lib/openai-models';
import { resolveSeteukSystemPrompt } from '@/lib/prompts/seteuk';
import { useAppStore } from '@/lib/store';

type ReasoningEffort = 'none' | 'low' | 'medium' | 'high' | 'xhigh';

interface AISettings {
    systemPrompt: string;
    model: string;
    maxOutputTokens: number;
    reasoningEffort: ReasoningEffort;
}

interface ReviewAndImproveParams {
    recordText: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    subjectName?: string;
}

export interface OcrEvaluationContext {
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
}

interface GenerationContext {
    teacherKey?: string;
    classId?: string;
    gradeLevel?: number;
    semester?: 1 | 2;
    curriculumContext?: CurriculumGenerationContext;
}

interface BatchDraftStudentInput {
    studentId: string;
    studentName: string;
    subjectName: string;
    learningData: Record<string, string>;
    curriculumContent?: string;
    ocrEvaluationContext?: OcrEvaluationContext;
    context?: GenerationContext;
}

interface BatchDraftResult {
    studentId: string;
    content: string;
    observationCount: number;
    fallback: boolean;
    fallbackMessage?: string;
}

/**
 * Picks the OCR evaluation context for a student: an ID match wins over a
 * unique name match (동명이인 위험), and a standards-only evaluation is used
 * only when no graded result exists for the student.
 */
export function selectOcrEvaluationContext(
    evaluations: OCREvaluation[],
    studentId: string,
    studentName: string,
): OcrEvaluationContext | undefined {
    let matchedEvaluation: OCREvaluation | undefined;
    let matchedStudentResult: StudentGradingResult | undefined;
    let standardsOnlyEvaluation: OCREvaluation | undefined;

    for (const evaluation of evaluations) {
        const results = evaluation.batchGradingResult?.results || [];
        const byId = results.find((result) => result.studentId === studentId);
        if (byId) {
            matchedEvaluation = evaluation;
            matchedStudentResult = byId;
            break;
        }
        if (!matchedStudentResult) {
            const byName = results.filter((result) => result.studentName === studentName);
            if (byName.length === 1) {
                matchedEvaluation = evaluation;
                matchedStudentResult = byName[0];
            }
        }
        if (!standardsOnlyEvaluation
            && (evaluation.achievementStandards?.length > 0 || evaluation.scoringCriteria?.length > 0)) {
            standardsOnlyEvaluation = evaluation;
        }
    }

    const contextEvaluation = matchedEvaluation || standardsOnlyEvaluation;
    if (!contextEvaluation) return undefined;

    return {
        achievementStandards: contextEvaluation.achievementStandards,
        scoringCriteria: contextEvaluation.scoringCriteria,
        studentResult: matchedStudentResult,
    };
}

// Get stored settings
function getAISettings(): AISettings {
    if (typeof window === 'undefined') {
        return {
            systemPrompt: resolveSeteukSystemPrompt(null),
            model: OPENAI_STANDARD_MODEL,
            maxOutputTokens: 1000,
            reasoningEffort: 'low',
        };
    }

    const storedReasoningEffort = localStorage.getItem('ai_reasoning_effort') as ReasoningEffort | null;
    const parsedMaxOutputTokens = parseInt(localStorage.getItem('ai_max_tokens') || '1000', 10);

    const reasoningEffort: ReasoningEffort = (
        storedReasoningEffort === 'none'
        || storedReasoningEffort === 'low'
        || storedReasoningEffort === 'medium'
        || storedReasoningEffort === 'high'
        || storedReasoningEffort === 'xhigh'
    )
        ? storedReasoningEffort
        : 'low';

    const maxOutputTokens = Number.isFinite(parsedMaxOutputTokens)
        ? Math.max(200, Math.min(3000, parsedMaxOutputTokens))
        : 1000;
    const { seteukPromptMode, personalSeteukPrompt } = useAppStore.getState();
    const selectedSystemPrompt = seteukPromptMode === 'personal' && personalSeteukPrompt.trim()
        ? personalSeteukPrompt
        : null;

    return {
        systemPrompt: resolveSeteukSystemPrompt(selectedSystemPrompt),
        model: normalizeOpenAIModel(localStorage.getItem('ai_model')),
        maxOutputTokens,
        reasoningEffort,
    };
}

// AI generation using GPT API with settings
/**
 * Generates a draft using the AI API.
 *
 * @description
 * Calls the backend API to generate text based on student data, template, and curriculum.
 */
export async function generateDraft(
    studentId: string,
    studentName: string,
    subjectName: string,
    learningData: Record<string, string>,
    exampleTemplate: string,
    curriculumContent?: string,
    ocrEvaluationContext?: OcrEvaluationContext,
    context?: GenerationContext
): Promise<{ content: string; observationCount: number; fallback: boolean; fallbackMessage?: string }> {
    const settings = getAISettings();
    const observationBoardContext = readObservationBoardAiContext({
        studentId,
        teacherKey: context?.teacherKey,
        classId: context?.classId,
    });

    let response: Response;
    try {
        response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId,
                studentName,
                subjectName,
                learningData,
                exampleTemplates: exampleTemplate ? [exampleTemplate] : [],
                curriculumContent,
                model: settings.model,
                systemPrompt: settings.systemPrompt,
                maxOutputTokens: settings.maxOutputTokens,
                reasoningEffort: settings.reasoningEffort,
                includeObservations: true,
                observationBoardContext,
                ocrEvaluationContext,
                teacherKey: context?.teacherKey,
                classId: context?.classId,
                gradeLevel: context?.gradeLevel,
                semester: context?.semester,
                curriculumContext: context?.curriculumContext,
            }),
        });
    } catch (error) {
        throw new Error('세특 생성 서버에 연결하지 못했습니다.', { cause: error });
    }

    const data = await response.json().catch(() => null);
    if (!response.ok || !data) {
        throw new Error(data?.error || `세특 생성에 실패했습니다. (HTTP ${response.status})`);
    }

    // The server returns fallback: true when no API key is set or the OpenAI call failed.
    // Never fabricate content client-side; surface the flag so callers can skip saving.
    return {
        content: data.content || '',
        observationCount: data.observationCount || 0,
        fallback: data.fallback === true,
        fallbackMessage: data.message || data.error,
    };
}

export async function generateDraftBatch(
    students: BatchDraftStudentInput[],
    exampleTemplate: string,
): Promise<Map<string, BatchDraftResult>> {
    if (students.length === 0) return new Map();

    const settings = getAISettings();
    const response = await fetch('/api/generate-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            students: students.map((student) => ({
                studentId: student.studentId,
                studentName: student.studentName,
                subjectName: student.subjectName,
                learningData: student.learningData,
                curriculumContent: student.curriculumContent,
                curriculumContext: student.context?.curriculumContext,
                model: settings.model,
                systemPrompt: settings.systemPrompt,
                maxOutputTokens: settings.maxOutputTokens,
                reasoningEffort: settings.reasoningEffort,
                includeObservations: true,
                observationBoardContext: readObservationBoardAiContext({
                    studentId: student.studentId,
                    teacherKey: student.context?.teacherKey,
                    classId: student.context?.classId,
                }),
                ocrEvaluationContext: student.ocrEvaluationContext,
                teacherKey: student.context?.teacherKey,
                classId: student.context?.classId,
            })),
            exampleTemplates: exampleTemplate ? [exampleTemplate] : [],
            model: settings.model,
            systemPrompt: settings.systemPrompt,
            maxOutputTokens: settings.maxOutputTokens,
            reasoningEffort: settings.reasoningEffort,
        }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.success || !Array.isArray(data.results)) {
        throw new Error(data?.error || 'Batch generation failed.');
    }

    return new Map(
        data.results
            .filter((result: { studentId?: unknown; content?: unknown }) =>
                typeof result.studentId === 'string' && typeof result.content === 'string'
            )
            .map((result: {
                studentId: string;
                content: string;
                observationCount?: number;
                fallback?: boolean;
                message?: string;
                error?: string;
            }) => [
                result.studentId,
                {
                    studentId: result.studentId,
                    content: result.content,
                    observationCount: result.observationCount || 0,
                    fallback: result.fallback === true,
                    fallbackMessage: result.message || result.error,
                },
            ]),
    );
}

export async function reviewAndImproveRecord({
    recordText,
    schoolLevel,
    category,
    year,
    subjectName,
}: ReviewAndImproveParams): Promise<RecordReviewResponse> {
    const response = await fetch('/api/record-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            recordText,
            schoolLevel,
            category,
            year,
            subjectName,
            includeImprovedDraft: true,
        }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
        throw new Error(data.error || '세특 점검 및 개선에 실패했습니다.');
    }

    return data as RecordReviewResponse;
}
