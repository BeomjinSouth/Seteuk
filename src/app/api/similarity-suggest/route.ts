import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = 'gpt-5-mini';

const SYSTEM_PROMPT = `당신은 학생 세특(교과세부능력 및 특기사항) 작성을 도와주는 AI입니다.
두 학생의 세특이 유사하다고 판단되었습니다. 다음 작업을 수행해 주세요.

1. 유사성 분석: 두 세특에서 어떤 표현·구조가 비슷한지 구체적으로 분석합니다.
2. 학생별 개별 수정 제안: 각 학생의 세특에서 유사한 부분을 어떻게 바꾸면 서로 구별되는지 구체적으로 제안합니다.
   - 학생별 고유한 학습 과정과 역량을 강조하세요.
   - 원래 내용의 핵심은 유지하되, 유사한 표현을 구별하세요.
   - 세특 기재 원칙(과정 중심, 객관적·긍정적 서술)을 준수하세요.

반드시 JSON 형식으로 응답해 주세요:
{
  "similarityAnalysis": "두 세특의 유사한 부분을 구체적으로 분석한 내용",
  "student1Suggestion": "학생1의 세특을 어떻게 수정하면 좋은지의 구체적 제안",
  "student2Suggestion": "학생2의 세특을 어떻게 수정하면 좋은지의 구체적 제안"
}`;

/**
 * Generates AI suggestions to differentiate two similar student records.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - text1: string (학생1의 세특)
 *   - text2: string (학생2의 세특)
 *   - name1: string (학생1 이름)
 *   - name2: string (학생2 이름)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - similarityAnalysis: string
 *   - student1Suggestion: string
 *   - student2Suggestion: string
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text1, text2, name1, name2 } = body;

        if (!text1 || !text2) {
            return NextResponse.json(
                { success: false, error: '두 학생의 세특 내용이 필요합니다.' },
                { status: 400 }
            );
        }

        const userPrompt = `학생1(${name1 || '학생A'})의 세특:
${text1}

학생2(${name2 || '학생B'})의 세특:
${text2}

위 두 세특의 유사한 부분을 분석하고, 각 학생별로 구별되는 표현으로 수정하는 제안을 JSON 형식으로 드려주세요.`;

        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            instructions: SYSTEM_PROMPT,
            input: userPrompt,
            reasoning: { effort: 'low' },
            max_output_tokens: 1500,
            text: { format: { type: 'json_object' } },
        });

        const content = response.output_text || '{}';
        const result = JSON.parse(content);

        return NextResponse.json({
            success: true,
            similarityAnalysis: result.similarityAnalysis || '',
            student1Suggestion: result.student1Suggestion || '',
            student2Suggestion: result.student2Suggestion || '',
        });
    } catch (error) {
        console.error('Similarity suggestion error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '수정 제안 생성 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
