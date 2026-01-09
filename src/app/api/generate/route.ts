import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// GPT-5.2 Model names (released December 11, 2025)
const DEFAULT_MODEL = 'gpt-5.2';

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `당신은 한국 고등학교 교사를 도와 교과 세특(교과 세부능력 및 특기사항)을 작성하는 AI 어시스턴트입니다.

세특 작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 기술합니다.
2. 과정 중심 평가 내용을 포함합니다.
3. 객관적이고 긍정적인 서술을 사용합니다.
4. 350~500자 내외로 작성합니다.
5. 비교/서열화 표현, 단정적 표현을 피합니다.
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.

입력받은 학생의 학습 데이터(수업 태도, 수행평가 등)를 바탕으로 세특을 생성해 주세요.`;

export async function POST(request: NextRequest) {
    // Parse body once and store it
    let body: {
        studentName?: string;
        subjectName?: string;
        learningData?: Record<string, string>;
        exampleTemplates?: string[];
        curriculumContent?: string;  // What is taught in this grade/semester
        model?: string;
        systemPrompt?: string;
        temperature?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const {
        studentName,
        subjectName,
        learningData,
        exampleTemplates,
        curriculumContent,  // What is taught in this grade/semester
        model,
        systemPrompt,
    } = body;

    if (!studentName) {
        return NextResponse.json(
            { error: '학생 이름은 필수입니다.' },
            { status: 400 }
        );
    }

    // Build the user prompt with learning data
    const dataEntries = Object.entries(learningData || {})
        .filter(([_, v]) => v && (v as string).trim())
        .map(([key, value]) => `- ${key}: ${value}`)
        .join('\n');

    let userPrompt = `학생 이름: ${studentName}
과목: ${subjectName || '미지정'}

학습 데이터:
${dataEntries || '- 수업에 성실하게 참여함'}`;

    // Add curriculum content if provided
    if (curriculumContent && curriculumContent.trim()) {
        userPrompt += `\n\n[중요] 이번 학기 교육과정 내용:
${curriculumContent}

위 교육과정 내용에 포함된 핵심 개념과 학습 내용을 반드시 세특에 포함하여 작성해 주세요.
- 교육과정에 명시된 단원명, 개념, 활동을 구체적으로 언급하세요.
- 학생이 해당 내용을 어떻게 이해하고 적용했는지 서술하세요.
- 교육과정 내용과 학생의 학습 데이터를 연결하여 작성하세요.`;
    } else {
        userPrompt += `\n\n위 정보를 바탕으로 교과 세특을 작성해 주세요.`;
    }

    // Add example templates if provided
    if (exampleTemplates && exampleTemplates.length > 0) {
        userPrompt += `\n\n참고할 수 있는 예시 양식:
${exampleTemplates.join('\n\n')}

위 예시의 어미, 어투, 표현 방식을 참고하여 작성해 주세요.`;
    }

    // Use custom system prompt if provided, otherwise use default
    const finalSystemPrompt = systemPrompt && systemPrompt.trim()
        ? systemPrompt
        : DEFAULT_SYSTEM_PROMPT;

    // Use specified model or default to gpt-5.2
    const actualModel = model || DEFAULT_MODEL;

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
        console.log('No OpenAI API key, using fallback');
        return NextResponse.json({
            success: true,
            content: generateFallbackContent(studentName, subjectName, learningData),
            fallback: true,
            message: 'API 키가 설정되지 않아 기본 템플릿을 사용합니다.'
        });
    }

    try {
        console.log(`Calling OpenAI with model: ${actualModel}`);
        console.log(`Learning data:`, learningData);

        // GPT-5.2 uses different parameters:
        // - max_completion_tokens instead of max_tokens
        // - reasoning.effort for controlling reasoning depth
        // - temperature only works when reasoning.effort is "none"
        const response = await openai.chat.completions.create({
            model: actualModel,
            messages: [
                { role: 'system', content: finalSystemPrompt },
                { role: 'user', content: userPrompt }
            ],
            // GPT-5.2 specific parameters
            max_completion_tokens: 1000,
            // Note: For GPT-5.2, use reasoning_effort instead of temperature
            // temperature only works with reasoning_effort: "none"
            reasoning_effort: 'low',  // low for better quality (options: none, low, medium, high, xhigh)
        } as OpenAI.ChatCompletionCreateParamsNonStreaming);

        const content = response.choices[0]?.message?.content || '';

        return NextResponse.json({
            success: true,
            content,
            model: actualModel,
            tokenUsage: {
                prompt: response.usage?.prompt_tokens || 0,
                completion: response.usage?.completion_tokens || 0,
                total: response.usage?.total_tokens || 0,
            }
        });
    } catch (error) {
        console.error('OpenAI API error:', error);

        // Return fallback with the learning data we already have
        return NextResponse.json({
            success: true,
            content: generateFallbackContent(studentName, subjectName, learningData),
            fallback: true,
            error: 'API 호출 실패로 기본 템플릿을 사용했습니다.'
        });
    }
}

// Fallback content generator - properly uses learning data
function generateFallbackContent(
    studentName: string,
    subjectName?: string,
    learningData?: Record<string, string>
): string {
    // Extract meaningful data from learningData
    let dataText = '';

    if (learningData && Object.keys(learningData).length > 0) {
        const values = Object.values(learningData).filter(v => v && v.trim());
        if (values.length > 0) {
            dataText = values.join('. ');
        }
    }

    if (!dataText) {
        dataText = '수업에 성실하게 참여하며 학습 활동에 적극적으로 임함';
    }

    const subject = subjectName || '해당 과목';

    return `${studentName} 학생은 ${dataText}. ${subject} 수업에서 적극적인 학습 태도를 보이며, 특히 탐구 활동에서 주도적으로 참여하는 모습이 인상적이었음. 실험 과정에서 정확한 관찰력과 논리적인 분석 능력을 발휘하였고, 조별 활동에서는 동료들과 원활하게 소통하며 협력함. 과제 수행 시 성실하고 꼼꼼하게 임하며, 어려운 문제에도 포기하지 않고 끈기 있게 해결하려는 자세가 돋보임.`;
}
