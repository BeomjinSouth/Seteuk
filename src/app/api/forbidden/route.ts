import { NextRequest, NextResponse } from 'next/server';
import { checkForbiddenExpressions } from '@/lib/openai';

const HARDCODED_FORBIDDEN_WORDS = [
    '최고',
    '최상',
    '1등',
    '천재',
    '완벽',
    '결코',
    '가장',
];

function findEnglishWords(text: string): Array<{ word: string; suggestion: string; reason: string }> {
    const ignored = new Set(['AI', 'IT', 'DNA', 'RNA', 'ICT', 'STEAM', 'SW', 'AR', 'VR']);
    const matches = text.match(/[a-zA-Z]{2,}/g) || [];
    return matches
        .filter((word) => !ignored.has(word.toUpperCase()))
        .map((word) => ({
            word,
            reason: '영문 표현',
            suggestion: '필요할 때만 사용하고, 가능하면 한국어로 바꿔주세요.',
        }));
}

function findInappropriateSymbols(text: string): Array<{ word: string; suggestion: string; reason: string }> {
    const matches = text.match(/[~!@#$%^&*_+=\[\]{}|\\:;"'<>,?/]+/g) || [];
    return matches
        .filter((token) => token !== '.' && token !== ',')
        .map((word) => ({
            word,
            reason: '특수기호',
            suggestion: '특수기호 대신 서술형 문장으로 바꿔주세요.',
        }));
}

function findProblematicNumbers(text: string): Array<{ word: string; suggestion: string; reason: string }> {
    const issues: Array<{ word: string; suggestion: string; reason: string }> = [];
    const percentMatches = text.match(/\d+(\.\d+)?\s*%/g) || [];
    percentMatches.forEach((word) => {
        issues.push({
            word,
            reason: '수치 표현',
            suggestion: '백분율 표현은 서열로 오해될 수 있어 주의가 필요합니다.',
        });
    });

    const scoreMatches = text.match(/\d+\s*점/g) || [];
    scoreMatches.forEach((word) => {
        issues.push({
            word,
            reason: '점수 표현',
            suggestion: '구체 점수 대신 과정 중심 서술을 권장합니다.',
        });
    });

    return issues;
}

type ForbiddenRequestBody = {
    text?: string;
    customForbiddenWords?: string[];
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as ForbiddenRequestBody;
        const text = body.text || '';
        const customForbiddenWords = Array.isArray(body.customForbiddenWords)
            ? body.customForbiddenWords
                .filter((word): word is string => typeof word === 'string')
                .map((word) => word.trim())
                .filter(Boolean)
            : [];

        if (!text.trim()) {
            return NextResponse.json({ error: 'text is required' }, { status: 400 });
        }

        const mergedForbiddenWords = Array.from(new Set([
            ...HARDCODED_FORBIDDEN_WORDS,
            ...customForbiddenWords,
        ]));

        const hardcodedIssues = mergedForbiddenWords
            .filter((word) => text.includes(word))
            .map((word) => ({
                word,
                reason: '금지어',
                suggestion: '중립적이고 근거 중심의 표현으로 바꿔주세요.',
            }));

        const englishIssues = findEnglishWords(text);
        const symbolIssues = findInappropriateSymbols(text);
        const numberIssues = findProblematicNumbers(text);

        let aiIssues: Array<{ word: string; reason: string; suggestion: string }> = [];
        try {
            const aiResult = await checkForbiddenExpressions(text);
            aiIssues = aiResult.issues.map((issue) => ({
                word: issue.word,
                reason: issue.reason,
                suggestion: issue.suggestion,
            }));
        } catch (error) {
            console.warn('AI forbidden-check failed:', error);
        }

        const issues = [...hardcodedIssues, ...englishIssues, ...symbolIssues, ...numberIssues, ...aiIssues]
            .reduce<Array<{ word: string; reason: string; suggestion: string }>>((acc, issue) => {
                if (!acc.find((item) => item.word === issue.word && item.reason === issue.reason)) {
                    acc.push(issue);
                }
                return acc;
            }, []);

        return NextResponse.json({ success: true, issues });
    } catch (error) {
        console.error('Forbidden check error:', error);
        return NextResponse.json({ error: 'Forbidden check failed' }, { status: 500 });
    }
}
