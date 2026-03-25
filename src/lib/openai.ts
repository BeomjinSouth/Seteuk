import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';

// Lazy initialization of OpenAI client to prevent build-time errors
let openaiClient: OpenAI | null = null;

/**
 * Retrieves the singleton instance of the OpenAI client.
 * Initializes the client if it hasn't been created yet.
 * @returns The OpenAI client instance.
 * @throws Error if OPENAI_API_KEY is not set in environment variables.
 */
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

// GPT-5 model variants
/**
 * Available GPT-5 model variants.
 */
export const GPT_MODELS = {
    /** Fast responses suitable for simple tasks. */
    INSTANT: 'gpt-5.4-mini',
    /** Deep reasoning capability for complex logic. */
    THINKING: 'gpt-5.4-mini',
    /** Best overall quality. */
    PRO: 'gpt-5.4-mini',
} as const;

/** Type representing available GPT models. */
export type GPTModel = typeof GPT_MODELS[keyof typeof GPT_MODELS];

// System prompt for generating subject records
const SYSTEM_PROMPT = `당신은 한국 고등학교 교사로서 교과 세특(교과세부능력 및 특기사항)을 작성하는 AI 어시스턴트입니다.

세특 작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 기술합니다.
2. 과정 중심 평가 용어를 활용합니다.
3. 객관적이고 긍정적인 서술을 사용합니다.
4. 350~500자 내외로 작성합니다.
5. 비교/서열의 표현, 확정의 표현은 지양합니다.
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.

입력받은 학생의 학습 데이터와 수업 의도, 행동지표 등을 바탕으로 세특을 작성해 주세요.`;

/**
 * Parameters for generating a subject record.
 */
interface GenerateRecordParams {
    /** Name of the student. */
    studentName: string;
    /** Subject name. */
    subjectName: string;
    /** Map of learning data (categories and content). */
    learningData: Record<string, string>;
    /** Optional example templates to guide the generation. */
    exampleTemplates?: string[];
    /** GPT model to use. Defaults to INSTANT. */
    model?: GPTModel;
}

/**
 * Result of the subject record generation.
 */
interface GenerateRecordResult {
    /** Generated text content. */
    content: string;
    /** Token usage statistics. */
    tokenUsage: {
        prompt: number;
        completion: number;
        total: number;
    };
}

/**
 * Generates a subject record (Se-Teuk) using OpenAI's GPT model.
 * 
 * @param params - Generation parameters including student info and data.
 * @returns The generated content and usage stats.
 */
export async function generateSubjectRecord({
    studentName,
    subjectName,
    learningData,
    exampleTemplates = [],
    model = GPT_MODELS.INSTANT
}: GenerateRecordParams): Promise<GenerateRecordResult> {

    // Build the user prompt
    const dataEntries = Object.entries(learningData)
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n');

    let userPrompt = `학생 이름: ${studentName}
과목: ${subjectName}

학습 데이터:
${dataEntries}

위 정보를 바탕으로 교과 세특을 작성해 주세요.`;

    // Add example templates if provided
    if (exampleTemplates.length > 0) {
        userPrompt += `\n\n참고할 수 있는 예시 양식:
${exampleTemplates.map((t, i) => `예시 ${i + 1}: ${t}`).join('\n')}`;
    }

    const cacheParams = getPromptCacheParams('subject-record:v1', [
        SYSTEM_PROMPT,
        model,
    ]);

    const response = await getOpenAIClient().responses.create({
        model: model,
        instructions: SYSTEM_PROMPT,
        input: userPrompt,
        reasoning: { effort: 'low' },
        max_output_tokens: 1000,
        ...cacheParams,
    });

    const content = response.output_text || '';

    return {
        content,
        tokenUsage: {
            prompt: response.usage?.input_tokens || 0,
            completion: response.usage?.output_tokens || 0,
            total: response.usage?.total_tokens || 0,
        }
    };
}

// Forbidden word check prompt
const FORBIDDEN_CHECK_PROMPT = `주어진 세특 문장에서 교과 세특 기재 시 부적절한 표현을 찾아주세요.

부적절한 표현 유형:
1. 비교/서열의 표현 (최고, 가장, 1등)
2. 확정의 표현 (반드시, 틀림없이)
3. 개인정보 노출 우려 표현
4. 부적절한 칭양의 표현

JSON 형식으로 응답해 주세요.
{
  "issues": [
    {
      "word": "문제가 되는 표현",
      "reason": "문제의 이유",
      "suggestion": "대체 표현 제안"
    }
  ]
}`;

/**
 * Result of the forbidden expression check.
 */
interface ForbiddenCheckResult {
    /** List of issues found. */
    issues: {
        /** The word or phrase identified as problematic. */
        word: string;
        /** Reason why it is considered problematic. */
        reason: string;
        /** Suggested replacement. */
        suggestion: string;
    }[];
}

/**
 * Checks the text for forbidden or inappropriate expressions using GPT.
 * 
 * @param text - The text to check.
 * @returns A result object containing a list of issues found.
 */
export async function checkForbiddenExpressions(text: string): Promise<ForbiddenCheckResult> {
    const cacheParams = getPromptCacheParams('forbidden-check:v1', [FORBIDDEN_CHECK_PROMPT]);

    const response = await getOpenAIClient().responses.create({
        model: GPT_MODELS.INSTANT,
        instructions: FORBIDDEN_CHECK_PROMPT,
        input: `다음 세특 문장을 검사하여 JSON 형식으로 응답해 주세요.\n\n${text}`,
        reasoning: { effort: 'low' },
        max_output_tokens: 500,
        text: { format: { type: 'json_object' } },
        ...cacheParams,
    });

    const content = response.output_text || '{"issues": []}';

    try {
        return JSON.parse(content);
    } catch {
        return { issues: [] };
    }
}
