import { SpellError } from '@/components/SpellCheckModal';
import { SubjectRecord } from '@/types';

export interface ForbiddenIssue {
    word: string;
    suggestion: string;
    reason: string;
}

export interface CheckResultCounts {
    spellerErrors: number;
    forbiddenWords: number;
}

function normalizeCount(value: number | undefined): number {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    return Math.max(0, Math.floor(value));
}

export function mergeCheckResult(
    record: SubjectRecord,
    updates: Partial<CheckResultCounts>
): CheckResultCounts {
    const current: CheckResultCounts = {
        spellerErrors: normalizeCount(record.checkResult?.spellerErrors),
        forbiddenWords: normalizeCount(record.checkResult?.forbiddenWords),
    };

    return {
        spellerErrors: updates.spellerErrors === undefined
            ? current.spellerErrors
            : normalizeCount(updates.spellerErrors),
        forbiddenWords: updates.forbiddenWords === undefined
            ? current.forbiddenWords
            : normalizeCount(updates.forbiddenWords),
    };
}

function resolveStatus(record: SubjectRecord, nextCheckResult: CheckResultCounts): SubjectRecord['status'] {
    if (record.status === 'confirmed') return 'confirmed';
    const isCheckClean = nextCheckResult.spellerErrors === 0 && nextCheckResult.forbiddenWords === 0;
    return isCheckClean ? 'checked' : 'draft';
}

export function applyCheckResultToRecord(
    record: SubjectRecord,
    updates: Partial<CheckResultCounts>,
    content?: string
): SubjectRecord {
    const checkResult = mergeCheckResult(record, updates);
    return {
        ...record,
        ...(content !== undefined ? { content } : {}),
        checkResult,
        status: resolveStatus(record, checkResult),
        lastUpdated: new Date().toISOString(),
    };
}

/**
 * Calls /api/speller and normalizes payload into SpellError[] for UI.
 */
export async function performSpellCheckRequest(text: string): Promise<SpellError[]> {
    try {
        const response = await fetch('/api/speller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) return [];

        const data = await response.json();
        if (!data.suggestions || data.suggestions.length === 0) return [];

        return data.suggestions
            .filter((suggestion: { token?: string; suggestions?: string[] }) => suggestion && suggestion.token)
            .map((suggestion: {
                id?: string;
                token: string;
                suggestions?: string[];
                type?: string;
                position?: { start: number; end: number };
            }, index: number) => {
                const fallbackStart = text.indexOf(suggestion.token);
                const start = suggestion.position?.start ?? fallbackStart;
                const end = suggestion.position?.end ?? (fallbackStart + suggestion.token.length);

                return {
                    id: suggestion.id || `err-${index}`,
                    original: suggestion.token,
                    suggestions: suggestion.suggestions || [],
                    context: text.slice(
                        Math.max(0, start - 30),
                        Math.min(text.length, end + 30)
                    ),
                    position: { start, end },
                    type: (suggestion.type || 'spelling') as SpellError['type'],
                };
            })
            .filter((error: SpellError) => error.position.start >= 0 && error.position.end >= error.position.start);
    } catch (error) {
        console.error('Spell check request failed:', error);
        return [];
    }
}

/**
 * Calls /api/forbidden with optional custom forbidden words.
 */
export async function checkForbiddenWordsRequest(
    text: string,
    customForbiddenWords: string[] = []
): Promise<ForbiddenIssue[]> {
    try {
        const response = await fetch('/api/forbidden', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, customForbiddenWords }),
        });

        if (!response.ok) return [];

        const data = await response.json();
        return data.issues || [];
    } catch (error) {
        console.error('Forbidden check request failed:', error);
    }

        const fallbackWords = Array.from(new Set([
        '최고',
        '최상',
        '천재',
        '완벽',
        '1등',
        ...customForbiddenWords
            .filter((word) => typeof word === 'string')
            .map((word) => word.trim())
            .filter(Boolean),
    ]));

    return fallbackWords
        .filter((word) => text.includes(word))
        .map((word) => ({
            word,
            reason: 'forbidden expression',
            suggestion: 'replace with a neutral, evidence-based expression',
        }));
}

