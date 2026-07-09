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
import {
    formatCurriculumContextForPrompt,
    type CurriculumGenerationContext,
} from '@/lib/curriculum-context';
type ReasoningEffort = 'none' | 'low' | 'medium' | 'high' | 'xhigh';

type OcrEvaluationContext = {
    achievementStandards?: Array<{ code: string; description: string; levels?: Array<{ level: string; description: string }> }>;
    scoringCriteria?: Array<{ element: string; levels?: Array<{ score: number; description: string }> }>;
    studentResult?: {
        achievementLevel?: string;
        totalScore?: number;
        maxTotalScore?: number;
        scores?: Array<{ criteriaElement: string; score: number; maxScore: number; feedback: string }>;
        overallFeedback?: string;
    };
};

type BatchStudentInput = {
    studentId: string;
    studentName: string;
    teacherKey?: string;
    classId?: string;
    subjectName?: string;
    learningData?: Record<string, string>;
    curriculumContent?: string;
    curriculumContext?: CurriculumGenerationContext;
    includeObservations?: boolean;
    observationBoardContext?: ObservationBoardAiContext;
    ocrEvaluationContext?: OcrEvaluationContext;
};

type BatchBody = {
    students?: BatchStudentInput[];
    exampleTemplates?: string[];
    model?: string;
    systemPrompt?: string;
    maxOutputTokens?: number;
    reasoningEffort?: ReasoningEffort;
    teacherKey?: string;
    classId?: string;
    subjectName?: string;
    curriculumContent?: string;
};

type PreparedStudent = BatchStudentInput & {
    sanitizedLearningData: Record<string, string>;
    observationsText: string;
    usedObservationIds: string[];
    observationBoardText: string;
    observationBoardContextCount: number;
};

const DEFAULT_MAX_OUTPUT_TOKENS = 1000;
const DEFAULT_REASONING_EFFORT: ReasoningEffort = 'low';
const ALLOWED_REASONING_EFFORTS = new Set<ReasoningEffort>(['none', 'low', 'medium', 'high', 'xhigh']);
const SAFE_SETEUK_FALLBACK_MESSAGE = '충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.';

function sanitizeSeteukLearningData(learningData?: Record<string, string>): Record<string, string> {
    if (!learningData) return {};

    return Object.fromEntries(
        Object.entries(learningData)
            .map(([key, value]) => [key, value?.replace(/\s+/g, ' ').trim() || ''] as const)
            .filter(([, value]) => value.length > 0),
    );
}

function shouldUseSafeSeteukFallback(learningData?: Record<string, string>): boolean {
    const text = Object.values(learningData || {}).join(' ').trim();
    if (!text) return true;
    return !/[가-힣A-Za-z0-9]/.test(text);
}

function sanitizeGeneratedSeteukContent(content: string): string {
    return content.replace(/\s{2,}/g, ' ').trim();
}

async function prepareStudent(input: BatchStudentInput): Promise<PreparedStudent> {
    const sanitizedLearningData = sanitizeSeteukLearningData(input.learningData);
    let observationsText = '';
    let usedObservationIds: string[] = [];

    if (input.studentId && input.includeObservations !== false) {
        try {
            const [observations, assessments] = await Promise.all([
                getObservationsForContext({ studentId: input.studentId, teacherKey: input.teacherKey, classId: input.classId }),
                getAssessments(),
            ]);

            usedObservationIds = observations.map((observation) => observation.id);
            observationsText = observations.map((observation) => {
                const assessment = assessments.find((item) => item.id === observation.assessmentId);
                const assessmentInfo = assessment ? `[${assessment.title}]` : '[general observation]';
                const typeInfo = observation.evidenceType === 'process' ? '(process)' : '(result)';
                const classInfo = observation.subjectName ? `[${observation.subjectName}]` : '';
                const lessonInfo = observation.lessonTopic ? ` ${observation.lessonTopic}` : '';
                const tagsInfo = observation.tags.length > 0 ? ` - tags: ${observation.tags.join(', ')}` : '';
                return `- ${assessmentInfo}${classInfo}${lessonInfo} ${typeInfo} ${observation.date}\n  ${observation.memo}${tagsInfo}`;
            }).join('\n\n');
        } catch (error) {
            console.error('Failed to fetch batch observations:', error);
        }
    }

    return {
        ...input,
        sanitizedLearningData,
        observationsText,
        usedObservationIds,
        observationBoardText: formatObservationBoardContextForPrompt(input.observationBoardContext),
        observationBoardContextCount: countObservationBoardContextItems(input.observationBoardContext),
    };
}

function hasDirectEvidence(student: PreparedStudent): boolean {
    return Boolean(student.observationsText || student.observationBoardText || student.ocrEvaluationContext);
}

function formatLearningData(learningData: Record<string, string>): string {
    const lines = Object.entries(learningData)
        .filter(([, value]) => value?.trim())
        .map(([key, value]) => `- ${key}: ${value}`);
    return lines.length > 0 ? lines.join('\n') : '- none';
}

function formatOcrContext(context?: OcrEvaluationContext): string {
    if (!context) return '- none';
    const lines: string[] = [];
    context.achievementStandards?.forEach((standard) => lines.push(`- ${standard.code} ${standard.description}`));
    context.scoringCriteria?.forEach((criteria) => lines.push(`- ${criteria.element}`));
    context.studentResult?.scores
        ?.filter((score) => score.feedback?.trim())
        .forEach((score) => lines.push(`- ${score.criteriaElement}: ${score.feedback}`));
    if (context.studentResult?.overallFeedback?.trim()) lines.push(`- Overall feedback: ${context.studentResult.overallFeedback}`);
    return lines.length > 0 ? lines.join('\n') : '- none';
}

function buildBatchPrompt(students: PreparedStudent[], exampleTemplates: string[]): string {
    const studentBlocks = students.map((student, index) => {
        return [
            `## Student ${index + 1}`,
            `studentId: ${student.studentId}`,
            `studentName: ${student.studentName}`,
            `subjectName: ${student.subjectName || ''}`,
            `classId: ${student.classId || ''}`,
            '',
            '[Learning data]',
            formatLearningData(student.sanitizedLearningData),
            '',
            '[Observation memos]',
            student.observationsText || '- none',
            '',
            '[Observation-board interpreted activity]',
            student.observationBoardText || '- none',
            '',
            '[Selected curriculum context: background only, not student evidence]',
            formatCurriculumContextForPrompt(student.curriculumContext) || student.curriculumContent?.trim() || '- none',
            '',
            '[OCR/evaluation context: use only feedback/evidence, not scores/ranks]',
            formatOcrContext(student.ocrEvaluationContext),
        ].join('\n');
    }).join('\n\n---\n\n');

    return [
        'Write separate Korean 세특 drafts for the following students.',
        'Use only each student block as evidence for that student. Do not transfer facts between students.',
        'Do not invent achievement, understanding, improvement, leadership, score, rank, award, future prediction, media/output-format, or AI-tool claims.',
        'Curriculum context is class background only; mention it only when the student evidence directly connects to it.',
        'Return strict JSON only: {"results":[{"studentId":"...","content":"..."}]}.',
        'Every requested studentId must appear exactly once. Do not include markdown.',
        exampleTemplates.length > 0 ? `\n[Reference style examples]\n${exampleTemplates.join('\n\n')}` : '',
        '',
        studentBlocks,
    ].join('\n');
}

function parseBatchOutput(text: string): Array<{ studentId: string; content: string }> {
    const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(trimmed) as unknown;
    const candidate = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === 'object' && Array.isArray((parsed as { results?: unknown }).results)
            ? (parsed as { results: unknown[] }).results
            : [];

    return candidate
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const studentId = String((item as { studentId?: unknown }).studentId || '').trim();
            const content = String((item as { content?: unknown }).content || '').trim();
            return studentId && content ? { studentId, content } : null;
        })
        .filter((item): item is { studentId: string; content: string } => item !== null);
}

export async function POST(request: NextRequest) {
    let body: BatchBody;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const requestedStudents = (body.students || [])
        .filter((student) => student?.studentId?.trim() && student?.studentName?.trim())
        .map((student) => ({
            ...student,
            teacherKey: student.teacherKey || body.teacherKey,
            classId: student.classId || body.classId,
            subjectName: student.subjectName || body.subjectName,
            curriculumContent: student.curriculumContent || body.curriculumContent,
        }));

    if (requestedStudents.length === 0) {
        return NextResponse.json({ error: 'No students supplied.' }, { status: 400 });
    }

    const prepared = await Promise.all(requestedStudents.map(prepareStudent));
    const fallbackResults = prepared
        .filter((student) => !hasDirectEvidence(student) && shouldUseSafeSeteukFallback(student.sanitizedLearningData))
        .map((student) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            content: SAFE_SETEUK_FALLBACK_MESSAGE,
            observationCount: student.usedObservationIds.length,
            usedObservationIds: student.usedObservationIds,
            observationBoardContextCount: student.observationBoardContextCount,
            fallback: true,
            safetyFallback: true,
        }));

    const fallbackIds = new Set(fallbackResults.map((result) => result.studentId));
    const openAiStudents = prepared.filter((student) => !fallbackIds.has(student.studentId));

    if (!hasOpenAIApiKey() || openAiStudents.length === 0) {
        const noKeyFallbacks = openAiStudents.map((student) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            content: buildNoKeyFallback(student),
            observationCount: student.usedObservationIds.length,
            usedObservationIds: student.usedObservationIds,
            observationBoardContextCount: student.observationBoardContextCount,
            fallback: true,
        }));
        return NextResponse.json({ success: true, batch: true, results: [...fallbackResults, ...noKeyFallbacks] });
    }

    const finalSystemPrompt = resolveSeteukSystemPrompt(body.systemPrompt);
    const actualModel = normalizeOpenAIModel(body.model || OPENAI_STANDARD_MODEL);
    const actualMaxOutputTokens = typeof body.maxOutputTokens === 'number'
        ? Math.max(400, Math.min(12000, Math.floor(body.maxOutputTokens * Math.max(1, openAiStudents.length))))
        : Math.min(12000, DEFAULT_MAX_OUTPUT_TOKENS * Math.max(1, openAiStudents.length));
    const actualReasoningEffort = ALLOWED_REASONING_EFFORTS.has(body.reasoningEffort || DEFAULT_REASONING_EFFORT)
        ? (body.reasoningEffort || DEFAULT_REASONING_EFFORT)
        : DEFAULT_REASONING_EFFORT;

    try {
        const response = await getOpenAIClient().responses.create({
            model: actualModel,
            instructions: finalSystemPrompt,
            input: buildBatchPrompt(openAiStudents, body.exampleTemplates || []),
            max_output_tokens: actualMaxOutputTokens,
            reasoning: { effort: actualReasoningEffort },
            ...getPromptCacheParams('generate-batch:v1', [
                finalSystemPrompt,
                actualModel,
                actualReasoningEffort,
                body.exampleTemplates?.join('\n\n') || '',
            ]),
        });

        const parsed = new Map(parseBatchOutput(response.output_text || '').map((item) => [item.studentId, item.content]));
        const generatedResults = openAiStudents.map((student) => {
            const rawContent = parsed.get(student.studentId) || buildNoKeyFallback(student);
            return {
                studentId: student.studentId,
                studentName: student.studentName,
                content: sanitizeGeneratedSeteukContent(rawContent),
                observationCount: student.usedObservationIds.length,
                usedObservationIds: student.usedObservationIds,
                observationBoardContextCount: student.observationBoardContextCount,
                fallback: !parsed.has(student.studentId),
            };
        });

        return NextResponse.json({
            success: true,
            batch: true,
            results: [...fallbackResults, ...generatedResults],
            model: actualModel,
            tokenUsage: {
                prompt: response.usage?.input_tokens || 0,
                completion: response.usage?.output_tokens || 0,
                total: response.usage?.total_tokens || 0,
            },
        });
    } catch (error) {
        console.error('Batch generation failed:', error);
        return NextResponse.json({ error: 'Batch generation failed.' }, { status: 502 });
    }
}

function buildNoKeyFallback(student: PreparedStudent): string {
    const evidence = [
        ...Object.values(student.sanitizedLearningData),
        student.observationsText,
        student.observationBoardText,
    ].join(' ').replace(/\s+/g, ' ').trim();

    if (!evidence) return SAFE_SETEUK_FALLBACK_MESSAGE;
    return `${student.subjectName || '해당 교과'} 활동에서 제공된 관찰 자료를 바탕으로 ${evidence}`;
}
