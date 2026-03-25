import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';

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

// 역량 분류 유형
export type CompetencyType = 'knowledge' | 'process' | 'attitude';

interface CompetencySegment {
    text: string;
    type: CompetencyType;
    startIndex: number;
    endIndex: number;
}

interface AnalyzeResponse {
    segments: CompetencySegment[];
}

const ANALYZE_PROMPT = `당신은 한국 교육과정 역량 분류 전문가입니다. 주어진 텍스트(행동특성 및 종합의견)를 분석하여 **문장 전체를 하나로 분류하지 말고**, 문장 내 의미가 구절(clause) 단위로 가지는 역량 유형으로 분류해주세요.

## 역량 유형 정의

1. **knowledge (지식·이해)**: 개념, 원리, 이론, 내용 지식을 언급하는 부분
   - 핵심 키워드: "이해하고", "알고", "개념", "원리", "내용", "지식", "파악하여"
   - 예: "피타고라스 정리의 핵심 내용을 이해하며"

2. **process (과정·기능)**: 활동, 행동, 수행, 문제해결, 적용, 계산, 분석 등 조작을 언급하는 부분
   - 핵심 키워드: "해결", "수행", "적용하여", "계산", "분석", "구함", "도출", "발표", "탐구"
   - 예: "문제를 명확히 해결", "실험을 설계하고 수행하여"

3. **attitude (가치·태도)**: 가치인식, 태도, 흥미, 감정, 정서적 반응을 언급하는 부분
   - 핵심 키워드: "인식하는", "가치를", "중요성을", "태도", "관심을", "깨닫고", "모습을 보임"
   - 예: "수학적 가치를 인식하는 모습을 보임"

## ⚠️ 반드시 지켜야 할 핵심 규칙

### 규칙 1: 구절(clause) 단위로 분리하라
- 한국어 문장에서 "~으며", "~하고", "~하여" 등의 연결 어미를 기준으로 분리하세요.
- 쉼표(,)나 마침표(.)는 분리 기준이 아닙니다.

### 규칙 2: 예시 분석 (필수 참고)
**입력**: "피타고라스 정리 단원 학습에서 정리의 핵심 내용을 이해하며, 수학적 가치를 인식하는 모습을 보임, 문제를 명확히 해결"

**올바른 분류**:
\`\`\`json
{
  "segments": [
    {"text": "피타고라스 정리 단원 학습에서 정리의 핵심 내용을 이해하며, ", "type": "knowledge"},
    {"text": "수학적 가치를 인식하는 모습을 보임", "type": "attitude"},
    {"text": "문제를 명확히 해결", "type": "process"}
  ]
}
\`\`\`

### 규칙 3: 분리 판단 기준
- "~이해하며" -> knowledge로 분리
- "~모습을 보임" -> attitude로 분리
- "~해결" -> process로 분리

### 규칙 4: 최소 분리 개수
- 문장이 연결 어미(~으며, ~하고, ~하여)가 있으면 **반드시 2개 이상의 segment로 분리**해야 합니다.
- 문장 하나가 100% 하나를 포함하는 경우는 매우 드뭅니다.

## 응답 JSON 형식
{
  "segments": [
    {
      "text": "해당 텍스트 부분(공백, 구두점 포함)",
      "type": "knowledge" | "process" | "attitude",
      "startIndex": 시작 인덱스(0부터),
      "endIndex": 끝 인덱스(exclusive)
    }
  ]
}

## 최종 체크리스트
- 모든 segment의 text를 이어붙이면 원본과 일치해야 함
- segment의 순서는 연속되어야 함(빈틈 없이)
- 연결어미가 있는 문장은 반드시 분리해야 함
- 전체 텍스트를 하나의 segment로 만들지 말 것
`;

/**
 * Analyzes text to identify and classify competency segments.
 * 
 * @description
 * Splits the input text into segments and classifies them into three competency types:
 * - knowledge (지식·이해)
 * - process (과정·기능)
 * - attitude (가치·태도)
 * 
 * @param {NextRequest} request - The request object containing:
 *   - text: string (The text to analyze)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - segments: Array of CompetencySegment objects
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json(
                { error: '분석할 텍스트가 필요합니다.' },
                { status: 400 }
            );
        }

        const cacheParams = getPromptCacheParams('competency:v1', [ANALYZE_PROMPT]);

        const response = await getOpenAIClient().responses.create({
            model: 'gpt-5.4-mini',
            instructions: ANALYZE_PROMPT,
            input: `다음 텍스트를 분석하여 JSON 형식으로 응답해 주세요.\n\n${text}`,
            text: { format: { type: 'json_object' } },
            max_output_tokens: 2000,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const content = response.output_text || '{"segments": []}';

        try {
            const result: AnalyzeResponse = JSON.parse(content);

            // Validate and clean up segments
            const validatedSegments = result.segments
                .filter(seg => seg.text && seg.type && ['knowledge', 'process', 'attitude'].includes(seg.type))
                .map(seg => ({
                    text: seg.text,
                    type: seg.type as CompetencyType,
                    startIndex: typeof seg.startIndex === 'number' ? seg.startIndex : text.indexOf(seg.text),
                    endIndex: typeof seg.endIndex === 'number' ? seg.endIndex : text.indexOf(seg.text) + seg.text.length
                }));

            return NextResponse.json({
                success: true,
                segments: validatedSegments
            });
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            return NextResponse.json({
                success: false,
                segments: [],
                error: 'AI 응답 파싱 실패'
            });
        }
    } catch (error) {
        console.error('Competency analysis error:', error);
        return NextResponse.json(
            { error: '역량 분석 중 오류가 발생했습니다.', segments: [] },
            { status: 500 }
        );
    }
}
