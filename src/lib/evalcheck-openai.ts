'use server';

import OpenAI from 'openai';
import type { QuestionAnalysisResult } from '@/types/eval-check';
import type { ChoiceItem } from '@/types';
import {
    QUESTION_STRUCTURE_SCHEMA,
    QUESTION_ANALYSIS_SCHEMA,
    DOCUMENT_SUMMARY_SCHEMA,
    IMAGE_DESCRIPTION_SCHEMA,
    RULE_CHECK_SCHEMA,
    SYSTEM_PROMPTS
} from './prompts/evalcheck';
import { getPromptCacheParams } from '@/lib/prompt-cache';

/**
 * OpenAI Evaluation Checking Service
 * 
 * 평가 점검 기능을 위한 OpenAI API 호출 모듈
 * 
 * 주요 기능:
 * - 문항 구조화 (시험지 이미지 → 문항 객체 + 공통 자료)
 * - 그림/그래프 텍스트 설명 생성
 * - 문항 분석 (정답, 풀이, 참고, 문제점, 수정 제안, 루브릭 등)
 * - 사용자 규칙 위반 검사
 * 
 * 비용 최적화 전략:
 * - 문항당 1회 호출로 모든 분석 수행 (Structured Outputs)
 * - Prompt Caching 활용 (반복 시스템 프롬프트)
 */

// ============ OpenAI 클라이언트 초기화 ============

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
    if (!openaiClient) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set');
        }
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// OpenAI 운영 표준 모델 설정
const MODELS = {
    FAST: 'gpt-5.4-mini',        // 구조화, 요약, 그림 설명
    ANALYSIS: 'gpt-5.4-mini',     // 문항 분석
} as const;

type ModelInputContent =
    | { type: 'input_text'; text: string }
    | { type: 'input_file'; file_data: string; filename?: string }
    | { type: 'input_image'; image_url: string; detail: 'low' | 'high' | 'auto' };

const PDF_TEXT_LIMIT = 12000;

function truncateForPrompt(text: string, limit: number): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= limit) return normalized;
    if (limit <= 3) return normalized.slice(0, limit);
    return `${normalized.slice(0, limit - 3)}...`;
}

// ============ 메인 함수들 ============

export interface SharedResource {
    resourceId: string;
    type: 'condition_cards' | 'scenario' | 'instructions' | 'passage' | 'table' | 'graph' | 'diagram' | 'image' | 'other';
    title?: string;
    content: string;
    items?: ChoiceItem[];
}

export interface StructureExtractionResult {
    sharedResources: SharedResource[];
    questions: Array<{
        questionNumber: string;
        displayName: string;
        pageRange: string;
        bodyText: string;
        taskType?: string;
        resourceRefs?: string[];

        choices?: ChoiceItem[];
        conditions?: string[];
        hasImage: boolean;
        imageDescription?: string;
        passageGroupHint?: string;
    }>;
    passageGroups: Array<{
        displayName: string;
        passageText: string;
        questionNumbers: string[];
    }>;
}

interface DocumentSummaryResult {
    summary: string;
    keyPoints: string[];
}

type QuestionAnalysisIssue = QuestionAnalysisResult['issues'][number] & {
    issueId?: string;
};

type QuestionAnalysisResponse = Omit<QuestionAnalysisResult, 'analyzedAt' | 'issues'> & {
    issues: QuestionAnalysisIssue[];
    answerType?: string;
};

/**
 * 시험지 이미지에서 문항 구조 추출
 * @param pageImages base64 인코딩된 페이지 이미지들
 * @returns 문항 및 지문 그룹 구조
 */
export async function extractQuestionStructure(
    pageImages: string[],
    pdfText?: string
): Promise<StructureExtractionResult> {
    const client = getOpenAIClient();

    // 이미지 콘텐츠 구성 (Responses API)
    const imageMessages: ModelInputContent[] = pageImages.map((img) => ({
        type: 'input_image',
        image_url: img.startsWith('data:') ? img : `data:image/png;base64,${img}`,
        detail: 'high',
    }));

    const supplementalText = pdfText ? truncateForPrompt(pdfText, PDF_TEXT_LIMIT) : '';
    const promptText = supplementalText
        ? `Extract structural components: Shared Resources and Questions.\n\n[PDF TEXT - supplemental]\n${supplementalText}`
        : 'Extract structural components: Shared Resources and Questions.';

    const response = await client.responses.create({
        model: MODELS.ANALYSIS,
        instructions: SYSTEM_PROMPTS.STRUCTURE,
        input: [
            {
                role: 'user',
                content: [
                    { type: 'input_text', text: promptText },
                    ...imageMessages,
                ],
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'question_structure',
                strict: true,
                schema: QUESTION_STRUCTURE_SCHEMA,
            },
        },
        max_output_tokens: 12000,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:structure:v1', [SYSTEM_PROMPTS.STRUCTURE]),
    });

    const outputText = response.output_text;
    if (!outputText) {
        throw new Error('문항 구조화 응답이 비어있습니다.');
    }

    return JSON.parse(outputText);
}

/**
 * PDF 입력으로 문항 구조 추출 (OpenAI PDF 입력 활용)
 */
export async function extractQuestionStructureFromPdf(
    pdfDataUrl: string,
    fileName = 'assessment.pdf'
): Promise<StructureExtractionResult> {
    const client = getOpenAIClient();

    const promptText = 'Extract structural components: Shared Resources and Questions. Use the entire PDF (all pages).';
    const contentParts: ModelInputContent[] = [
        { type: 'input_text', text: promptText },
        { type: 'input_file', file_data: pdfDataUrl, filename: fileName },
    ];

    const response = await client.responses.create({
        model: MODELS.ANALYSIS,
        instructions: SYSTEM_PROMPTS.STRUCTURE,
        input: [
            {
                role: 'user',
                content: contentParts,
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'question_structure',
                strict: true,
                schema: QUESTION_STRUCTURE_SCHEMA,
            },
        },
        max_output_tokens: 12000,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:structure:v1', [SYSTEM_PROMPTS.STRUCTURE]),
    });

    const outputText = response.output_text;
    if (!outputText) {
        throw new Error('문항 구조화 응답이 비어있습니다.');
    }

    return JSON.parse(outputText);
}

/**
 * Summarize the full document content based on the extracted outline.
 */
export async function summarizeDocumentOutline(
    documentOutline: string
): Promise<DocumentSummaryResult> {
    const trimmed = documentOutline.trim();
    if (!trimmed) {
        return { summary: '', keyPoints: [] };
    }

    const client = getOpenAIClient();

    const response = await client.responses.create({
        model: MODELS.FAST,
        instructions: SYSTEM_PROMPTS.DOCUMENT_SUMMARY,
        input: [
            {
                role: 'user',
                content: [{ type: 'input_text', text: trimmed }],
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'document_summary',
                strict: true,
                schema: DOCUMENT_SUMMARY_SCHEMA,
            },
        },
        max_output_tokens: 1200,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:summary:v1', [SYSTEM_PROMPTS.DOCUMENT_SUMMARY]),
    });

    const outputText = response.output_text;
    if (!outputText) {
        throw new Error('Document summary response is empty.');
    }

    const parsed = JSON.parse(outputText);
    return {
        summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
        keyPoints: Array.isArray(parsed.keyPoints)
            ? parsed.keyPoints.filter((item: unknown): item is string => typeof item === 'string')
            : [],
    };
}

/**
 * 그림/표/그래프 텍스트 설명 생성
 */
export async function generateImageDescription(
    imageData: string,
    context?: string
): Promise<{
    description: string;
    type: 'image' | 'table' | 'graph' | 'diagram';
    elements: string[];
    dataValues?: string[];
}> {
    const client = getOpenAIClient();

    const userMessage = context
        ? `다음 그림/표/그래프를 문항 풀이에 필요한 모든 정보를 포함하여 텍스트로 설명해 주세요.\n\n문항 맥락: ${context}`
        : '다음 그림/표/그래프를 문항 풀이에 필요한 모든 정보를 포함하여 텍스트로 설명해 주세요.';

    const response = await client.responses.create({
        model: MODELS.FAST,
        instructions: SYSTEM_PROMPTS.IMAGE_DESCRIBE,
        input: [
            {
                role: 'user',
                content: [
                    { type: 'input_text', text: userMessage },
                    {
                        type: 'input_image',
                        image_url: imageData.startsWith('data:') ? imageData : `data:image/png;base64,${imageData}`,
                        detail: 'high',
                    },
                ],
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'image_description',
                strict: true,
                schema: IMAGE_DESCRIPTION_SCHEMA,
            },
        },
        max_output_tokens: 1500,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:image-describe:v1', [SYSTEM_PROMPTS.IMAGE_DESCRIBE]),
    });

    const outputText = response.output_text;
    if (!outputText) {
        throw new Error('이미지 설명 응답이 비어있습니다.');
    }

    return JSON.parse(outputText);
}

/**
 * 개별 문항 상세 분석 (Structured Outputs)
 */
async function analyzeQuestionDetail(
    questionText: string,
    context?: string,
    imageUrl?: string,
    imageDescription?: string,
    pdfDataUrl?: string,
    pdfFileName?: string,
): Promise<QuestionAnalysisResponse> {
    const client = getOpenAIClient();

    const userContent: ModelInputContent[] = [{ type: 'input_text', text: questionText }];

    // Add context with clear labels
    if (context) {
        userContent.push({
            type: 'input_text',
            text: `\n\n[Document Context & Shared Resources]\n${context}`,
        });
    }

    if (imageDescription) {
        userContent.push({
            type: 'input_text',
            text: `\n\n[Image Description]\n${imageDescription}`,
        });
    }

    if (pdfDataUrl) {
        userContent.push({
            type: 'input_file',
            file_data: pdfDataUrl,
            filename: pdfFileName || 'assessment.pdf',
        });
    }

    // Add image if provided (allows visual reasoning)
    if (imageUrl) {
        userContent.push({
            type: 'input_image',
            image_url: imageUrl.startsWith('data:') ? imageUrl : `data:image/png;base64,${imageUrl}`,
            detail: 'high',
        });
    }

    const response = await client.responses.create({
        model: MODELS.ANALYSIS,
        instructions: SYSTEM_PROMPTS.ANALYZE,
        input: [
            { role: 'user', content: userContent },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'question_analysis',
                strict: true,
                schema: QUESTION_ANALYSIS_SCHEMA,
            },
        },
        max_output_tokens: 8000,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:analysis:v3', [SYSTEM_PROMPTS.ANALYZE]),
    });

    const outputText = response.output_text;
    if (!outputText) {
        throw new Error('문항 분석 응답이 비어있습니다.');
    }

    return JSON.parse(outputText) as QuestionAnalysisResponse;
}

/**
 * 사용자 정의 규칙 위반 검사
 */
export async function checkUserRules(
    questionText: string,
    rules: Array<{ ruleId: string; name: string; condition: string; correctionGuide: string }>
): Promise<{
    violations: Array<{
        ruleId: string;
        ruleName: string;
        violatedText: string;
        suggestion: string;
    }>
}> {
    if (rules.length === 0) return { violations: [] };

    const client = getOpenAIClient();

    const rulesText = rules.map((r, i) =>
        `${i + 1}. [${r.name}] (ID: ${r.ruleId})\n   Condition: ${r.condition}\n   Correction Guide: ${r.correctionGuide}`
    ).join('\n\n');

    const prompt = `Check the following question against these rules:\n\n${rulesText}\n\n[Question]\n${questionText}`;

    const response = await client.responses.create({
        model: MODELS.FAST,
        instructions: SYSTEM_PROMPTS.RULE_CHECK,
        input: [
            {
                role: 'user',
                content: [{ type: 'input_text', text: prompt }],
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'rule_check',
                strict: true,
                schema: RULE_CHECK_SCHEMA,
            },
        },
        max_output_tokens: 1200,
        reasoning: { effort: 'low' },
        ...getPromptCacheParams('evalcheck:rule-check:v1', [SYSTEM_PROMPTS.RULE_CHECK]),
    });

    const outputText = response.output_text;
    if (!outputText) return { violations: [] };

    return JSON.parse(outputText);
}

/**
 * Wraps analyzeQuestionDetail to accept a structured object as used in the API route.
 */
export async function analyzeQuestion(params: {
    questionNumber: string;
    bodyText: string;
    taskType?: string;
    resourceRefs?: string[];
    choices?: ChoiceItem[];
    conditions?: string[];
    imageDescription?: string;
    passageText?: string;
    sharedResources?: SharedResource[];
    documentContext?: DocumentSummaryResult | Record<string, unknown>;
    consistencyReport?: string;
    pdfDataUrl?: string;
    pdfFileName?: string;
    usePdfContext?: boolean;
}): Promise<QuestionAnalysisResponse> {
    // 1. Construct Question Text
    let qText = `[Question ${params.questionNumber}]`;
    if (params.taskType) qText += ` (Type: ${params.taskType})`;
    qText += `\n${params.bodyText}`;

    if (params.choices && params.choices.length > 0) {
        qText += `\n\n[Choices]\n` + params.choices.map(c => `${c.label}) ${c.content}`).join('\n');
    }

    if (params.conditions && params.conditions.length > 0) {
        qText += `\n\n[Conditions]\n` + params.conditions.join('\n');
    }

    // 2. Construct Context
    let context = '';
    if (params.passageText) {
        context += `\n[Passage/Context]\n${params.passageText}\n`;
    }

    if (params.sharedResources && params.sharedResources.length > 0) {
        context += `\n[Shared Resources]\n`;
        for (const res of params.sharedResources) {
            context += `- [${res.resourceId}] ${res.type}: ${res.content}\n`;
        }
    }

    if (params.documentContext) {
        context += `\n[Document Summary]\n${JSON.stringify(params.documentContext)}\n`;
    }

    if (params.consistencyReport) {
        context += `\n[Consistency Check]\n${params.consistencyReport}\n`;
    }

    // 3. Call Detail (PDF가 있으면 함께 제공해 이미지/텍스트 맥락 활용)
    const pdfDataUrl = params.usePdfContext === false ? undefined : params.pdfDataUrl;
    return analyzeQuestionDetail(
        qText,
        context,
        undefined,
        params.imageDescription,
        pdfDataUrl,
        params.pdfFileName
    );
}
