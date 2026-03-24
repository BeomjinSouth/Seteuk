import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT-5 Model with Vision capabilities
const DEFAULT_MODEL = 'gpt-5-mini';

// Base OCR System Prompt
const OCR_SYSTEM_PROMPT = `당신은 학습지 이미지를 분석하는 OCR 전문가 AI입니다.

학습지 이미지에서 다음을 정확하게 분석해 주세요.

1. **텍스트 추출**:
   - 인쇄된 텍스트와 손글씨 모두 인식
   - 문제 번호, 지시문, 학생 답안 구분
   - 수식이나 특수 기호도 가능한 정확히 표현

2. **그림/도표 분석**:
   - 도형, 그래프, 표, 그림 등의 시각 자료 설명
   - 해당 위치 설명 (상단, 하단, 좌측, 우측 등)

3. **전체 요약**:
   - 학습지의 주제와 내용을 간략히 요약
   - 학생이 작성한 내용의 특징 파악

응답은 반드시 한국어로 해주세요.`;

// Rubric-based evaluation system prompt
const RUBRIC_EVALUATION_PROMPT = `

추가로 다음 평가 기준에 따라 학생의 답안을 평가해 주세요.

**성취기준**: {achievementStandard}

**평가 기준 (루브릭)**:
{rubricCriteria}

**성취수준별 기준**:
{rubricLevels}

**채점기준**:
{scoringCriteria}

평가 시 다음을 분석해 주세요.
1. 학생이 어떤 성취수준(상/중/하)에 해당하는지 판단
2. 채점기준에 따른 점수 (해당하는 경우)
3. 학생이 발휘한 역량 (문제해결, 추론, 창의·융합, 의사소통, 정보처리, 태도 등)
4. 학생에게 줄 수 있는 구체적인 피드백

"evaluation" 필드에 평가 결과를 포함해 주세요.`;

// Response structure interface
interface RubricContext {
    achievementStandard?: string;
    achievementLevels?: string;
    scoringCriteria?: string;
}

interface OCRResult {
    extractedText: string;
    drawings: Array<{
        description: string;
        location: string;
    }>;
    summary: string;
    evaluation?: {
        achievementLevel: string;
        competencies: string[];
        feedback: string;
    };
}

/**
 * Performs OCR and optional rubric-based evaluation on an image.
 *
 * @description
 * Uses GPT-5 Vision to analyze educational worksheets.
 * Can extract text, describe diagrams, summarize content, and perform evaluation.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - image?: string (Base64 image)
 *   - imageUrl?: string (URL to image)
 *   - rubricContext?: object (Optional context for evaluation)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: OCRResult object
 *   - model: string
 *   - tokenUsage: object
 */
export async function POST(request: NextRequest) {
    let body: {
        image?: string; // Base64 encoded image
        imageUrl?: string; // Or URL to image
        rubricContext?: RubricContext; // NEW: Rubric context for evaluation
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const { image, imageUrl, rubricContext } = body;

    if (!image && !imageUrl) {
        return NextResponse.json(
            { error: '이미지가 필요합니다. base64 인코딩된 이미지 또는 이미지 URL을 제공해 주세요.' },
            { status: 400 }
        );
    }

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
        console.log('No OpenAI API key, using fallback');
        return NextResponse.json({
            success: true,
            result: generateFallbackResult(!!rubricContext),
            fallback: true,
            message: 'API 키가 설정되지 않아 기본 결과를 반환합니다.'
        });
    }

    try {
        console.log(`Calling OpenAI Vision API with model: ${DEFAULT_MODEL}`);
        console.log(`Rubric context provided: ${!!rubricContext}`);

        // Build system prompt with optional rubric evaluation
        let systemPrompt = OCR_SYSTEM_PROMPT;

        const hasRubric = rubricContext && (rubricContext.achievementStandard || rubricContext.achievementLevels || rubricContext.scoringCriteria);

        if (hasRubric) {
            systemPrompt += RUBRIC_EVALUATION_PROMPT
                .replace('{achievementStandard}', rubricContext.achievementStandard || '(미제공)')
                .replace('{rubricCriteria}', '(성취기준 참조)')
                .replace('{rubricLevels}', rubricContext.achievementLevels || '(미제공)')
                .replace('{scoringCriteria}', rubricContext.scoringCriteria || '(미제공)');
        }

        // Prepare the image content
        const imageContent = image
            ? { type: 'input_image' as const, image_url: `data:image/jpeg;base64,${image}`, detail: 'high' as const }
            : { type: 'input_image' as const, image_url: imageUrl!, detail: 'high' as const };

        // Build the response format instruction
        const jsonFormat = hasRubric ? `{
  "extractedText": "이미지에서 추출한 모든 텍스트(문제, 지시문, 학생 답안 등)",
  "drawings": [
    {
      "description": "그림/도표의 상세 설명",
      "location": "위치 (예: 상단 좌측, 문제 3번 옆)"
    }
  ],
  "summary": "학습지 전체 내용 요약",
  "evaluation": {
    "achievementLevel": "상/중/하 중 하나",
    "competencies": ["발휘한 역량 목록"],
    "feedback": "학생에게 줄 수 있는 구체적인 피드백"
  }
}` : `{
  "extractedText": "이미지에서 추출한 모든 텍스트(문제, 지시문, 학생 답안 등)",
  "drawings": [
    {
      "description": "그림/도표의 상세 설명",
      "location": "위치 (예: 상단 좌측, 문제 3번 옆)"
    }
  ],
  "summary": "학습지 전체 내용 요약"
}`;

        const cacheParams = getPromptCacheParams(hasRubric ? 'ocr:rubric:v1' : 'ocr:v1');

        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            instructions: systemPrompt,
            input: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: `이 학습지 이미지를 분석해 주세요.

다음 형식으로 JSON 응답을 작성해 주세요.
${jsonFormat}

JSON 형식으로만 응답해 주세요.`
                        },
                        imageContent
                    ]
                }
            ],
            text: { format: { type: 'json_object' } },
            max_output_tokens: 2000,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const content = response.output_text || '{}';

        let result: OCRResult;
        try {
            result = JSON.parse(content);
        } catch {
            // If JSON parsing fails, create a structured result from the raw content
            result = {
                extractedText: content,
                drawings: [],
                summary: '이미지 분석 결과'
            };
        }

        return NextResponse.json({
            success: true,
            result,
            model: DEFAULT_MODEL,
            hasRubricEvaluation: hasRubric,
            tokenUsage: {
                prompt: response.usage?.input_tokens || 0,
                completion: response.usage?.output_tokens || 0,
                total: response.usage?.total_tokens || 0,
            }
        });
    } catch (error) {
        console.error('OpenAI Vision API error:', error);

        return NextResponse.json({
            success: true,
            result: generateFallbackResult(!!rubricContext),
            fallback: true,
            error: 'API 호출 실패로 기본 결과를 반환했습니다.'
        });
    }
}

// Fallback result generator
function generateFallbackResult(includeEvaluation: boolean = false): OCRResult {
    const base: OCRResult = {
        extractedText: '[API 키가 설정되지 않았거나 API 호출에 실패했습니다]\n\n실제 환경에서는 여기에 학습지에서 추출한 텍스트가 표시됩니다.\n- 문제 번호와 지시문\n- 학생이 작성한 답안\n- 수식 및 특수 기호',
        drawings: [
            {
                description: '예시: 그래프, 도형, 표 등의 시각 자료가 여기에 설명됩니다.',
                location: '예시 위치'
            }
        ],
        summary: 'API 키를 설정하면 실제 학습지 분석 결과가 표시됩니다. OpenAI GPT-5 Vision API를 활용하여 텍스트와 그림 모두를 인식할 수 있습니다.'
    };

    if (includeEvaluation) {
        base.evaluation = {
            achievementLevel: '중',
            competencies: ['문제해결', '추론'],
            feedback: '예시 피드백: 설정된 루브릭 기준에 맞춰 실제 평가 결과가 여기에 표시됩니다.'
        };
    }

    return base;
}
