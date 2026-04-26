import { SpellError } from '@/components/SpellCheckModal';
import type { RecordReviewResponse } from '@/types/knowledge';
import {
    checkForbiddenWordsRequest,
    ForbiddenIssue,
    performSpellCheckRequest,
} from '@/lib/check-utils';
import { readObservationBoardAiContext } from '@/lib/observation-board-ai-context';
import { OPENAI_STANDARD_MODEL, normalizeOpenAIModel } from '@/lib/openai-models';

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

// Get stored settings
export function getAISettings(): AISettings {
    if (typeof window === 'undefined') {
        return {
            systemPrompt: '',
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

    return {
        systemPrompt: localStorage.getItem('ai_system_prompt') || '',
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
    },
    context?: {
        teacherKey?: string;
        classId?: string;
    }
): Promise<{ content: string; observationCount: number }> {
    const settings = getAISettings();
    const observationBoardContext = readObservationBoardAiContext({
        studentId,
        teacherKey: context?.teacherKey,
        classId: context?.classId,
    });

    try {
        const response = await fetch('/api/generate', {
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
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return {
                content: data.content,
                observationCount: data.observationCount || 0,
            };
        }
    } catch (error) {
        console.error('API call failed, using fallback:', error);
    }

    // Fallback for development or API failure
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Build content from learning data
    const dataEntries = Object.values(learningData)
        .filter((value) => value && value.trim())
        .join(' ');

    const baseContent = dataEntries || '수업에 성실하게 참여함';

    return {
        content: `${studentName} 학생은 ${baseContent}. ${subjectName || '해당 과목'} 수업에서 적극적으로 참여하며 탐구 과정을 주도적으로 수행하였고, 협력 활동에서도 의미 있는 기여를 보였다.`,
        observationCount: 0,
    };
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

// Spell check
export async function performSpellCheck(text: string): Promise<SpellError[]> {
    return performSpellCheckRequest(text);
}

// Forbidden word check
export async function checkForbiddenWords(
    text: string,
    customForbiddenWords: string[] = []
): Promise<ForbiddenIssue[]> {
    return checkForbiddenWordsRequest(text, customForbiddenWords);
}
