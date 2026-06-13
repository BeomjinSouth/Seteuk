export function normalizeKnowledgeText(value: string): string {
    return value
        .normalize('NFKC')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

export function compactKnowledgeText(value: string): string {
    return normalizeKnowledgeText(value).replace(/[^\p{L}\p{N}]+/gu, '');
}

export function tokenizeKnowledgeText(
    value: string,
    options: { lowSignalTokens?: ReadonlySet<string> } = {},
): string[] {
    const lowSignalTokens = options.lowSignalTokens;
    return normalizeKnowledgeText(value)
        .split(/[^\p{L}\p{N}]+/u)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2 && !lowSignalTokens?.has(token));
}
