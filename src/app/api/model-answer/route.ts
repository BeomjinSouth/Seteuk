import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
    extractQuestionStructure,
    extractQuestionStructureFromPdf,
    type StructureExtractionResult,
} from '@/lib/evalcheck-openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = 'gpt-5-mini';
const SUPPORTED_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/gif', 'image/webp']);
const SUPPORTED_PDF_TYPES = new Set(['application/pdf']);

const MODEL_ANSWER_SET = {
    id: 'standard',
    label: '표준 해설',
} as const;

const MODEL_ANSWER_QUESTION_SCHEMA = {
    type: 'object',
    properties: {
        questionNumber: { type: 'number' },
        questionText: { type: 'string' },
        answers: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    label: { type: 'string' },
                    content: { type: 'string' },
                },
                required: ['label', 'content'],
                additionalProperties: false,
            },
            minItems: 1,
        },
        rubricPoints: {
            type: 'array',
            items: { type: 'string' },
        },
        scoringGuidelines: { type: 'string' },
        maxScore: { type: ['number', 'null'] },
    },
    required: ['questionNumber', 'questionText', 'answers', 'rubricPoints', 'scoringGuidelines', 'maxScore'],
    additionalProperties: false,
} as const;

type PromptCacheParams = ReturnType<typeof getPromptCacheParams>;

function buildImageDataUrl(imageData: string): { dataUrl?: string; error?: string } {
    if (typeof imageData !== 'string') {
        return { error: 'Image data must be a base64 string.' };
    }

    const trimmed = imageData.trim();
    if (!trimmed) {
        return { error: 'Image data is required.' };
    }

    const match = trimmed.match(/^data:(.*?);base64,(.*)$/);
    let mimeType = 'image/jpeg';
    let base64 = trimmed;

    if (match) {
        mimeType = match[1].toLowerCase();
        base64 = match[2];
    }

    if (mimeType === 'image/jpg') {
        mimeType = 'image/jpeg';
    }

    if (!SUPPORTED_IMAGE_TYPES.has(mimeType)) {
        return { error: 'Unsupported image format. Please upload a PNG, JPEG, GIF, or WebP image.' };
    }

    return { dataUrl: `data:${mimeType};base64,${base64}` };
}

function buildPdfDataUrl(fileData: string): { dataUrl?: string; error?: string } {
    if (typeof fileData !== 'string') {
        return { error: 'File data must be a base64 string.' };
    }

    const trimmed = fileData.trim();
    if (!trimmed) {
        return { error: 'File data is required.' };
    }

    if (trimmed.startsWith('data:')) {
        const match = trimmed.match(/^data:(.*?);base64,(.*)$/);
        if (!match) {
            return { error: 'Invalid file data URL.' };
        }
        const mimeType = match[1].toLowerCase();
        if (!SUPPORTED_PDF_TYPES.has(mimeType)) {
            return { error: 'Unsupported file format. Please upload a PDF file.' };
        }
        return { dataUrl: `data:${mimeType};base64,${match[2]}` };
    }

    return { dataUrl: `data:application/pdf;base64,${trimmed}` };
}

function normalizeQuestionNumber(value: unknown, fallback: number): number {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
        const parsed = Number.parseInt(value.replace(/[^\d]/g, ''), 10);
        if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return fallback;
}

function buildRubricContext(
    achievementStandards?: Array<{ code?: string; description?: string; levels?: Array<{ level: string; description: string }> }>,
    scoringCriteria?: Array<{ element?: string; levels?: Array<{ score: number; description: string }> }>
): string {
    let rubricContext = '';

    if (achievementStandards && achievementStandards.length > 0) {
        rubricContext += '### 성취기준\n';
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
        rubricContext += '\n### 채점기준\n';
        scoringCriteria.forEach((crit) => {
            rubricContext += `- 평가요소: ${crit.element || ''}\n`;
            if (crit.levels) {
                crit.levels.forEach((level) => {
                    rubricContext += `  - ${level.score}점: ${level.description}\n`;
                });
            }
        });
    }

    return rubricContext.trim();
}

function buildSharedResourceContext(
    structure: StructureExtractionResult,
    question: StructureExtractionResult['questions'][number]
): string {
    const resources = structure.sharedResources || [];
    if (resources.length === 0) return '';

    const refs = new Set(question.resourceRefs || []);
    const relevant = refs.size > 0
        ? resources.filter((res) => refs.has(res.resourceId))
        : resources;

    if (relevant.length === 0) return '';

    const lines = relevant.map((res) => {
        const header = `- [${res.resourceId}] ${res.type}${res.title ? `: ${res.title}` : ''}`;
        const items = Array.isArray(res.items) && res.items.length > 0
            ? res.items.map((item) => `${item.label ?? ''} ${item.content ?? ''}`.trim()).join(' / ')
            : res.content;
        return `${header}\n  ${items}`.trim();
    });

    return lines.join('\n');
}

function buildQuestionPrompt(params: {
    question: StructureExtractionResult['questions'][number];
    questionNumber: number;
    rubricContext: string;
    resourceContext: string;
}) {
    const { question, questionNumber, rubricContext, resourceContext } = params;
    const choicesText = question.choices?.length
        ? question.choices.map((c) => `${c.label}) ${c.content}`).join('\n')
        : '';
    const conditionsText = question.conditions?.length
        ? question.conditions.join('\n')
        : '';

    const answersGuide = [
        '- answers 배열의 첫 항목 label은 "표준 답안"으로 작성합니다.',
        '- 서로 다른 풀이가 있을 때만 추가 항목을 만들고, label은 "대안/심화 1", "대안/심화 2"처럼 번호를 붙입니다.',
        '- 같은 풀이를 표현만 바꾼 답안은 포함하지 않습니다.',
    ].join('\n');

    return `당신은 교사용 모범답안 전문가입니다. 아래 문항에 대해 가능한 모든 정답/풀이 유형을 탐색해 자세히 작성하세요.

필수 원칙:
1) 모든 답안은 서로 **중복 금지** (같은 풀이를 말만 바꾼 것은 제외)
2) 정답이 여러 형태로 가능한 경우(서술/식/그래프/표 등) 각각 포함
3) 정답이 무한히 가능한 경우에는 **정답 범위**를 명시하고 대표 예시 2~3개 포함
4) 각 답안은 "풀이:"와 "답:"을 포함하고, 풀이 과정은 구체적일수록 좋습니다.
5) 출력 언어는 한국어

${answersGuide}
[문항 번호] ${questionNumber}
[문항 유형] ${question.taskType || '일반'}
[문항 본문]
${question.bodyText}
${choicesText ? `\n[선택지]\n${choicesText}` : ''}
${conditionsText ? `\n[조건]\n${conditionsText}` : ''}
${resourceContext ? `\n[공통 자료]\n${resourceContext}` : ''}
${question.imageDescription ? `\n[이미지 설명]\n${question.imageDescription}` : ''}

${rubricContext ? `\n[루브릭 참고]\n${rubricContext}` : ''}

JSON 형식으로만 응답하세요.`;
}

function normalizeQuestionOutput(
    raw: any,
    fallbackNumber: number,
    fallbackText: string,
    defaultLabel: string
) {
    const normalizeAnswerContent = (value: string) =>
        value.replace(/\s+/g, ' ').trim().toLowerCase();

    const questionNumber = normalizeQuestionNumber(raw?.questionNumber, fallbackNumber);
    const questionText = typeof raw?.questionText === 'string' && raw.questionText.trim().length > 0
        ? raw.questionText
        : fallbackText;

    let answers = Array.isArray(raw?.answers) ? raw.answers : [];
    if (answers.length === 0 && raw?.answer) {
        answers = [{ label: defaultLabel, content: raw.answer }];
    }
    if (answers.length === 0) {
        answers = [{ label: defaultLabel, content: '' }];
    }

    answers = answers.map((answer: { label?: string; content?: string }, idx: number) => ({
        label: answer.label?.trim() ? answer.label : (idx === 0 ? defaultLabel : `추가 답안 ${idx + 1}`),
        content: answer.content ?? '',
    }));

    const seen = new Set<string>();
    answers = answers.filter((answer: { content: string }) => {
        const key = normalizeAnswerContent(answer.content);
        const dedupeKey = key || '__empty__';
        if (seen.has(dedupeKey)) return false;
        seen.add(dedupeKey);
        return true;
    });

    if (answers.length === 0) {
        answers = [{ label: defaultLabel, content: '' }];
    }

    return {
        questionNumber,
        questionText,
        answers,
        answer: answers[0]?.content || raw?.answer || '',
        rubricPoints: Array.isArray(raw?.rubricPoints) ? raw.rubricPoints : [],
        scoringGuidelines: typeof raw?.scoringGuidelines === 'string' ? raw.scoringGuidelines : '',
        maxScore: typeof raw?.maxScore === 'number' ? raw.maxScore : undefined,
    };
}

async function generateModelAnswerForQuestion(params: {
    question: StructureExtractionResult['questions'][number];
    questionNumber: number;
    rubricContext: string;
    resourceContext: string;
    cacheParams?: PromptCacheParams;
}) {
    const prompt = buildQuestionPrompt(params);
    const response = await openai.responses.create({
        model: DEFAULT_MODEL,
        input: [
            {
                role: 'user',
                content: [{ type: 'input_text', text: prompt }],
            },
        ],
        text: {
            format: {
                type: 'json_schema',
                name: 'model_answer_question',
                strict: true,
                schema: MODEL_ANSWER_QUESTION_SCHEMA,
            },
        },
        max_output_tokens: 8000,
        reasoning: { effort: 'low' },
        ...(params.cacheParams ?? {}),
    });

    const outputText = response.output_text || '{}';
    let parsed;
    try {
        parsed = JSON.parse(outputText);
    } catch {
        parsed = {};
    }

    const defaultLabel = '표준 답안';
    return normalizeQuestionOutput(parsed, params.questionNumber, params.question.bodyText, defaultLabel);
}

/**
 * Generates model answers and scoring guidelines from an assessment file.
 *
 * @description
 * Analyzes an uploaded assessment file (PDF or Images) to:
 * 1. Identify all questions
 * 2. Generate model answers (add multiple answers only when distinct solution paths exist)
 * 3. Extract scoring points and guidelines
 *
 * @param {NextRequest} request - JSON body containing:
 *   - fileData?: string (Base64 file content, preferably PDF)
 *   - imageDataList?: string[] (List of base64 images if not PDF)
 *   - achievementStandards?: object
 *   - scoringCriteria?: object
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: object
 *     - questions: Array of analyzed questions with model answers
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Support both fileData (PDF/image) and imageDataList
        const { fileData, fileName, fileType, imageData, imageDataList, achievementStandards, scoringCriteria } = body;

        const hasFileData = typeof fileData === 'string' && fileData.trim().length > 0;
        const isPdf =
            fileType === 'pdf' ||
            (typeof fileData === 'string' && fileData.trim().startsWith('data:application/pdf'));

        // Determine which images to process (fallback when not PDF)
        let imagesToProcess: string[] = [];
        if (!isPdf) {
            if (imageDataList && Array.isArray(imageDataList) && imageDataList.length > 0) {
                imagesToProcess = imageDataList;
            } else if (imageData) {
                imagesToProcess = [imageData];
            } else if (hasFileData) {
                imagesToProcess = [fileData];
            }
        }

        if (isPdf && !hasFileData) {
            return NextResponse.json(
                { success: false, error: 'PDF file data is required.' },
                { status: 400 }
            );
        }

        if (!isPdf && imagesToProcess.length === 0) {
            return NextResponse.json(
                { success: false, error: '평가지 이미지가 필요합니다.' },
                { status: 400 }
            );
        }

        const rubricContext = buildRubricContext(achievementStandards, scoringCriteria);

        let structure: StructureExtractionResult;
        if (isPdf) {
            const pdfPayload = buildPdfDataUrl(fileData);
            if (!pdfPayload.dataUrl) {
                return NextResponse.json(
                    { success: false, error: pdfPayload.error || 'Invalid PDF data.' },
                    { status: 400 }
                );
            }
            structure = await extractQuestionStructureFromPdf(
                pdfPayload.dataUrl,
                fileName || 'assessment.pdf'
            );
        } else {
            const pageImages: string[] = [];
            for (const img of imagesToProcess) {
                const imagePayload = buildImageDataUrl(img);
                if (!imagePayload.dataUrl) {
                    return NextResponse.json(
                        { success: false, error: imagePayload.error || 'Invalid image data.' },
                        { status: 400 }
                    );
                }
                pageImages.push(imagePayload.dataUrl);
            }
            structure = await extractQuestionStructure(pageImages);
        }

        if (!structure.questions || structure.questions.length === 0) {
            return NextResponse.json(
                { success: false, error: '문항을 인식하지 못했습니다. PDF/이미지를 확인해 주세요.' },
                { status: 422 }
            );
        }

        const generatedAt = new Date().toISOString();
        const runId = Date.now();
        const cacheParams = getPromptCacheParams('model-answer:v2', [rubricContext]);
        const setQuestions: Array<ReturnType<typeof normalizeQuestionOutput>> = [];

        for (let idx = 0; idx < structure.questions.length; idx++) {
            const question = structure.questions[idx];
            const questionNumber = normalizeQuestionNumber(question.questionNumber, idx + 1);
            const resourceContext = buildSharedResourceContext(structure, question);

            const questionResult = await generateModelAnswerForQuestion({
                question,
                questionNumber,
                rubricContext,
                resourceContext,
                cacheParams,
            });
            setQuestions.push(questionResult);
        }

        const sets: Array<{
            id: string;
            label: string;
            questions: Array<ReturnType<typeof normalizeQuestionOutput>>;
            generatedAt: string;
        }> = [{
            id: `${MODEL_ANSWER_SET.id}-${runId}`,
            label: MODEL_ANSWER_SET.label,
            questions: setQuestions,
            generatedAt,
        }];

        return NextResponse.json({
            success: true,
            result: {
                sets,
                generatedAt,
            },
        });
    } catch (error) {
        console.error('Model answer generation error:', error);
        return NextResponse.json(
            { success: false, error: '모범답안 생성 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
