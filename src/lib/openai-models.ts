export const OPENAI_STANDARD_MODEL = 'gpt-5.4-mini' as const;

/**
 * Normalizes any persisted or user-provided model value to the single
 * OpenAI model currently operated in this workspace.
 */
export function normalizeOpenAIModel(model?: string | null): typeof OPENAI_STANDARD_MODEL {
    if (model === OPENAI_STANDARD_MODEL) {
        return OPENAI_STANDARD_MODEL;
    }

    return OPENAI_STANDARD_MODEL;
}
