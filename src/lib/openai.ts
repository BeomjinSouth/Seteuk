import OpenAI from 'openai';

// Lazy initialization of OpenAI client to prevent build-time errors
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

// GPT-5.2 model variants
export const GPT_MODELS = {
    INSTANT: 'gpt-5.2-instant',      // Fast responses
    THINKING: 'gpt-5.2-thinking',    // Deep reasoning
    PRO: 'gpt-5.2-pro',              // Best quality
} as const;

export type GPTModel = typeof GPT_MODELS[keyof typeof GPT_MODELS];

// System prompt for generating subject records
const SYSTEM_PROMPT = `당신은 한국 고등학교 교사를 도와 교과 세특(교과 세부능력 및 특기사항)을 작성하는 AI 어시스턴트입니다.

세특 작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 기술합니다.
2. 과정 중심 평가 내용을 포함합니다.
3. 객관적이고 긍정적인 서술을 사용합니다.
4. 350~500자 내외로 작성합니다.
5. 비교/서열화 표현, 단정적 표현을 피합니다.
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.

입력받은 학생의 학습 데이터(수업 태도, 수행평가 등)를 바탕으로 세특을 생성해 주세요.`;

interface GenerateRecordParams {
    studentName: string;
    subjectName: string;
    learningData: Record<string, string>;
    exampleTemplates?: string[];
    model?: GPTModel;
}

interface GenerateRecordResult {
    content: string;
    tokenUsage: {
        prompt: number;
        completion: number;
        total: number;
    };
}

/**
 * Generate a subject record using GPT-5.2
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

    const response = await getOpenAIClient().chat.completions.create({
        model: model,
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content || '';

    return {
        content,
        tokenUsage: {
            prompt: response.usage?.prompt_tokens || 0,
            completion: response.usage?.completion_tokens || 0,
            total: response.usage?.total_tokens || 0,
        }
    };
}

// Forbidden word check prompt
const FORBIDDEN_CHECK_PROMPT = `주어진 세특 문장에서 교과 세특 기재 시 부적절한 표현을 찾아주세요.

부적절한 표현 유형:
1. 비교/서열화 표현 (최고, 가장, 1등 등)
2. 단정적 표현 (반드시, 틀림없이 등)
3. 개인정보 노출 우려 표현
4. 부정적 뉘앙스 표현

JSON 형식으로 응답해 주세요:
{
  "issues": [
    {
      "word": "문제가 되는 표현",
      "reason": "문제인 이유",
      "suggestion": "대체 표현 제안"
    }
  ]
}`;

interface ForbiddenCheckResult {
    issues: {
        word: string;
        reason: string;
        suggestion: string;
    }[];
}

/**
 * Check for forbidden expressions using GPT-5.2
 */
export async function checkForbiddenExpressions(text: string): Promise<ForbiddenCheckResult> {
    const response = await getOpenAIClient().chat.completions.create({
        model: GPT_MODELS.INSTANT,
        messages: [
            { role: 'system', content: FORBIDDEN_CHECK_PROMPT },
            { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content || '{"issues": []}';

    try {
        return JSON.parse(content);
    } catch {
        return { issues: [] };
    }
}
