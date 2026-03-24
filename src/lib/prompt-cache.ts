import crypto from 'crypto';

function buildPromptCacheKey(
    scope: string,
    parts: Array<string | number | null | undefined>
): string {
    const hash = crypto.createHash('sha256');
    const normalizedParts = parts.map((part) => {
        if (part === undefined) return { t: 'u' };
        if (part === null) return { t: 'n' };
        if (typeof part === 'number') return { t: 'num', v: part };
        return { t: 'str', v: part };
    });
    hash.update(JSON.stringify({ scope, parts: normalizedParts }));
    return `${scope}:${hash.digest('hex').slice(0, 32)}`;
}

export function getPromptCacheParams(
    scope: string,
    parts: Array<string | number | null | undefined> = []
) {
    return {
        prompt_cache_key: buildPromptCacheKey(scope, parts),
    };
}
