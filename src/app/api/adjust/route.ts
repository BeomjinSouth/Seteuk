import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5-mini';

/**
 * Adjusts the length of the provided text content using AI.
 *
 * @description
 * Expands or shortens the given text based on the 'direction' parameter.
 * Uses GPT to rewrite the content while maintaining its original meaning and context.
 *
 * @param {NextRequest} request - The request object containing:
 *   - content: string (The text to adjust)
 *   - direction: 'expand' | 'shorten'
 *   - targetLength?: number (Optional target length in characters)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - content: string (The adjusted text)
 *   - originalLength: number
 *   - newLength: number
 *   - direction: 'expand' | 'shorten'
 *   - tokenUsage: object (Token usage stats)
 */
export async function POST(request: NextRequest) {
    let body: {
        content: string;
        direction: 'expand' | 'shorten';
        targetLength?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const { content, direction, targetLength } = body;

    if (!content) {
        return NextResponse.json(
            { error: '내용이 필요합니다.' },
            { status: 400 }
        );
    }

    if (!direction || !['expand', 'shorten'].includes(direction)) {
        return NextResponse.json(
            { error: '방향(expand/shorten)을 지정해주세요.' },
            { status: 400 }
        );
    }

    const currentLength = content.length;
    let target = targetLength;

    // Default target: expand by ~30% or shorten by ~30%
    if (!target) {
        target = direction === 'expand'
            ? Math.round(currentLength * 1.3)
            : Math.round(currentLength * 0.7);
    }

    const systemPrompt = direction === 'expand'
        ? `당신은 한국 고등학교 교과 세특(교과세부능력 및 특기사항) 전문 작성자입니다.

주어진 세특 내용을 더 풍부하게 확장하세요.
1. 원래 내용의 핵심 내용은 유지합니다.
2. 구체적인 예시, 상황, 과정 설명을 추가합니다.
3. 학생의 역량, 태도, 성장에 대해 더 상세히 묘사합니다.
4. 자연스럽고 매끄러운 문장으로 작성합니다.
5. 목표 글자수: 약 ${target}자 (현재: ${currentLength}자)
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.
7. 비교/서열의 표현은 지양합니다.

확장된 세특 내용만 출력하세요.`
        : `당신은 한국 고등학교 교과 세특(교과세부능력 및 특기사항) 전문 작성자입니다.

주어진 세특 내용을 간결하게 축소하세요.
1. 핵심 내용과 중요한 정보만 유지합니다.
2. 중복되거나 부수적인 내용은 제거합니다.
3. 간결하면서도 의미가 전달되도록 합니다.
4. 자연스럽고 매끄러운 문장으로 작성합니다.
5. 목표 글자수: 약 ${target}자 (현재: ${currentLength}자)

축소된 세특 내용만 출력하세요.`;

    // Check if API key is available
    if (!hasOpenAIApiKey()) {
        // Simple fallback: just return original with a note
        return NextResponse.json({
            success: true,
            content: direction === 'expand'
                ? content + ' 또한 수업 활동에 적극적으로 참여하여 자료를 수집하고 협력하는 모습을 보임.'
                : content.substring(0, Math.max(100, Math.round(content.length * 0.7))).trim() + '.',
            fallback: true,
            message: 'API 키가 설정되지 않아 기본 처리를 사용합니다.'
        });
    }

    try {
        const openai = getOpenAIClient();
        const cacheParams = getPromptCacheParams('adjust:v1', [direction]);
        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            instructions: systemPrompt,
            input: `다음 세특 내용을 ${direction === 'expand' ? '확장' : '축소'}해주세요:\n\n${content}`,
            max_output_tokens: 1500,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const adjustedContent = response.output_text || content;

        return NextResponse.json({
            success: true,
            content: adjustedContent,
            originalLength: currentLength,
            newLength: adjustedContent.length,
            direction,
            tokenUsage: {
                prompt: response.usage?.input_tokens || 0,
                completion: response.usage?.output_tokens || 0,
                total: response.usage?.total_tokens || 0,
            }
        });
    } catch (error) {
        console.error('OpenAI API error:', error);

        return NextResponse.json({
            success: false,
            error: 'API 호출에 실패했습니다.',
            content: content
        }, { status: 500 });
    }
}
