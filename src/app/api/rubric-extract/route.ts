import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5.4-mini';

// 채점기준표 추출 시스템 프롬프트
const RUBRIC_EXTRACTION_PROMPT = `당신은 채점기준표(루브릭) 이미지를 분석하는 전문가입니다.

이미지에서 다음 정보를 추출해 주세요.

1. **성취기준**: 평가의 근거가 되는 성취기준 코드와 설명
   - 코드 형식: [학년-교과-번호] (예: [9영02-03], [12역사03-06])
   - 성취수준: 상/중/하 또는 A/B/C/D/E 등의 수준별 기준

2. **채점기준**: 평가요소와 배점 기준
   - 평가요소: 무엇을 평가하는지 (예: "일차함수의 이해", "논리적 표현력")
   - 배점: 점수별 기준 (4점, 3점, 2점, 1점)

## 응답 형식

다음 JSON 형식으로만 응답해 주세요.
{
  "achievementStandards": [
    {
      "code": "[성취기준 코드]",
      "description": "성취기준 설명",
      "levels": [
        { "level": "상", "description": "상수준 기준" },
        { "level": "중", "description": "중수준 기준" },
        { "level": "하", "description": "하수준 기준" }
      ]
    }
  ],
  "scoringCriteria": [
    {
      "element": "평가요소명",
      "levels": [
        { "score": 4, "description": "4점 기준" },
        { "score": 3, "description": "3점 기준" },
        { "score": 2, "description": "2점 기준" },
        { "score": 1, "description": "1점 기준" }
      ]
    }
  ],
  "rawText": "이미지에서 추출한 원본 텍스트",
  "confidence": "high" | "medium" | "low"
}

- 이미지에서 해당 정보를 찾을 수 없으면 빈 배열을 반환
- 성취기준 코드가 명시되지 않은 경우 "(추정)" 표시
- 배점이 숫자가 아닌 경우 적절히 변환(상=3, 중=2, 하=1 등)`;

/**
 * Extracts rubric information from an image.
 * 
 * @description
 * Uses `gpt-5.4-mini` vision input to analyze an image of a rubric table
 * and extract achievement standards and scoring criteria.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - image?: string (Base64)
 *   - imageUrl?: string (URL)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: object
 *     - achievementStandards: Array
 *     - scoringCriteria: Array
 *     - rawText: string
 *     - confidence: 'high' | 'medium' | 'low'
 */
export async function POST(request: NextRequest) {
    let body: {
        image?: string; // Base64 encoded image
        imageUrl?: string;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const { image, imageUrl } = body;

    if (!image && !imageUrl) {
        return NextResponse.json(
            { error: '이미지가 필요합니다.' },
            { status: 400 }
        );
    }

    // API 키 없으면 데모 결과 반환
    if (!hasOpenAIApiKey()) {
        return NextResponse.json({
            success: true,
            result: generateDemoExtraction(),
            demo: true,
            message: 'API 키가 설정되지 않아 데모 결과를 반환합니다.'
        });
    }

    try {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Extracting rubric from image...');
        }
        const openai = getOpenAIClient();

        const imageContent = image
            ? { type: 'input_image' as const, image_url: `data:image/jpeg;base64,${image}`, detail: 'high' as const }
            : { type: 'input_image' as const, image_url: imageUrl!, detail: 'high' as const };

        const cacheParams = getPromptCacheParams('rubric-extract:v1', [RUBRIC_EXTRACTION_PROMPT]);

        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            instructions: RUBRIC_EXTRACTION_PROMPT,
            input: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'input_text',
                            text: '이 채점기준표 이미지를 분석하여 성취기준과 채점기준을 추출해 주세요. JSON 형식으로만 응답해 주세요.'
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
        let result;

        try {
            result = JSON.parse(content);
            if (process.env.NODE_ENV !== 'production') {
                console.log('Achievement standards count:', result.achievementStandards?.length || 0);
                console.log('Scoring criteria count:', result.scoringCriteria?.length || 0);
            }
        } catch {
            console.error('Failed to parse rubric extraction response.');
            result = {
                achievementStandards: [],
                scoringCriteria: [],
                rawText: content,
                confidence: 'low'
            };
        }

        return NextResponse.json({
            success: true,
            result,
            tokenUsage: {
                prompt: response.usage?.input_tokens || 0,
                completion: response.usage?.output_tokens || 0,
                total: response.usage?.total_tokens || 0,
            }
        });
    } catch (error) {
        console.error('Rubric extraction error:', error);
        return NextResponse.json({
            success: false,
            error: '채점기준표 분석 중 오류가 발생했습니다.'
        }, { status: 500 });
    }
}

function generateDemoExtraction() {
    return {
        achievementStandards: [
            {
                code: '[예시-01-01]',
                description: '예시 성취기준입니다. API 키를 설정하면 실제 추출 결과가 표시됩니다.',
                levels: [
                    { level: '상', description: '상수준 기준 예시' },
                    { level: '중', description: '중수준 기준 예시' },
                    { level: '하', description: '하수준 기준 예시' }
                ]
            }
        ],
        scoringCriteria: [
            {
                element: '예시 평가요소',
                levels: [
                    { score: 4, description: '4점 기준 예시' },
                    { score: 3, description: '3점 기준 예시' },
                    { score: 2, description: '2점 기준 예시' },
                    { score: 1, description: '1점 기준 예시' }
                ]
            }
        ],
        rawText: 'API 키를 설정하면 실제 이미지 분석 결과가 표시됩니다.',
        confidence: 'low'
    };
}

