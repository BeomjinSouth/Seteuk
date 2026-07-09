import { getOpenAIClient } from '@/lib/openai-client';
import { OPENAI_STANDARD_MODEL } from '@/lib/openai-models';
import { getPromptCacheParams } from '@/lib/prompt-cache';

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
        model: OPENAI_STANDARD_MODEL,
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
