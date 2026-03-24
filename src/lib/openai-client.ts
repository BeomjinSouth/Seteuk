import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function hasOpenAIApiKey(): boolean {
    return typeof process.env.OPENAI_API_KEY === 'string'
        && process.env.OPENAI_API_KEY.trim().length > 0;
}

export function getOpenAIClient(): OpenAI {
    if (!hasOpenAIApiKey()) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    return openaiClient;
}
