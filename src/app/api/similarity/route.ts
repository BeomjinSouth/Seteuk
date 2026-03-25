import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_THRESHOLD = 0.9;
const MAX_MATCHED_SENTENCES = 5;
const MIN_SENTENCE_LENGTH = 8;

function splitSentences(text: string): string[] {
    return text
        .replace(/\r\n/g, '\n')
        .split(/(?<=[.!?。！？])\s*|\n+/u)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
}

function normalizeSentence(text: string): string {
    return text
        .toLowerCase()
        .replace(/\r\n/g, ' ')
        .replace(/[“”"'`´’‘~!@#$%^&*()_+=|\\/:;<>{}\[\],.?·•-]/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function levenshteinDistance(source: string, target: string): number {
    if (source === target) return 0;
    if (source.length === 0) return target.length;
    if (target.length === 0) return source.length;

    const previous = Array.from({ length: target.length + 1 }, (_, index) => index);
    const current = new Array<number>(target.length + 1).fill(0);

    for (let i = 1; i <= source.length; i++) {
        current[0] = i;

        for (let j = 1; j <= target.length; j++) {
            const substitutionCost = source[i - 1] === target[j - 1] ? 0 : 1;
            current[j] = Math.min(
                current[j - 1] + 1,
                previous[j] + 1,
                previous[j - 1] + substitutionCost,
            );
        }

        for (let j = 0; j <= target.length; j++) {
            previous[j] = current[j];
        }
    }

    return previous[target.length];
}

function calculateSentenceSimilarity(source: string, target: string): number {
    const normalizedSource = normalizeSentence(source);
    const normalizedTarget = normalizeSentence(target);

    if (!normalizedSource || !normalizedTarget) return 0;
    if (
        normalizedSource.length < MIN_SENTENCE_LENGTH
        || normalizedTarget.length < MIN_SENTENCE_LENGTH
    ) {
        return 0;
    }

    if (normalizedSource === normalizedTarget) return 1;

    const maxLength = Math.max(normalizedSource.length, normalizedTarget.length);
    if (maxLength === 0) return 0;

    return 1 - (levenshteinDistance(normalizedSource, normalizedTarget) / maxLength);
}

interface ContentItem {
    studentId: string;
    studentName: string;
    content: string;
}

interface MatchedSentence {
    student1Sentence: string;
    student2Sentence: string;
    similarity: number;
}

interface SimilarityResult {
    student1: { id: string; name: string };
    student2: { id: string; name: string };
    similarity: number;
    matchedSentences: MatchedSentence[];
}

/**
 * Finds near-identical sentences across different students' records.
 *
 * @description
 * Splits each record into sentences, compares sentences pairwise, and returns
 * only student pairs that share at least one sentence above the similarity threshold.
 *
 * @param {NextRequest} request - JSON body containing:
 *   - contents: Array<{ studentId, studentName, content }>
 *   - threshold?: number (0.0 to 1.0, default 0.9)
 *
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - results: Array of SimilarityResult
 *   - totalCompared: number
 *   - similarCount: number
 */
export async function POST(request: NextRequest) {
    let body: {
        contents: ContentItem[];
        threshold?: number;
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
        contents,
        threshold = DEFAULT_THRESHOLD,
    } = body;

    if (!contents || contents.length < 2) {
        return NextResponse.json({
            success: true,
            results: [],
            message: '비교할 세특이 2개 이상 필요합니다.',
        });
    }

    const preparedContents = contents.map((item) => ({
        ...item,
        sentences: splitSentences(item.content),
    }));

    const results: SimilarityResult[] = [];

    for (let i = 0; i < preparedContents.length; i++) {
        for (let j = i + 1; j < preparedContents.length; j++) {
            const content1 = preparedContents[i];
            const content2 = preparedContents[j];

            if (!content1.content || !content2.content) continue;

            const matchedSentences: MatchedSentence[] = [];
            const seenPairs = new Set<string>();

            content1.sentences.forEach((sentence1) => {
                content2.sentences.forEach((sentence2) => {
                    const similarity = calculateSentenceSimilarity(sentence1, sentence2);
                    if (similarity < threshold) return;

                    const normalizedPair = [
                        normalizeSentence(sentence1),
                        normalizeSentence(sentence2),
                    ].sort().join('::');

                    if (seenPairs.has(normalizedPair)) return;
                    seenPairs.add(normalizedPair);

                    matchedSentences.push({
                        student1Sentence: sentence1,
                        student2Sentence: sentence2,
                        similarity: Math.round(similarity * 100) / 100,
                    });
                });
            });

            if (matchedSentences.length === 0) continue;

            matchedSentences.sort((left, right) => right.similarity - left.similarity);

            results.push({
                student1: { id: content1.studentId, name: content1.studentName },
                student2: { id: content2.studentId, name: content2.studentName },
                similarity: matchedSentences[0].similarity,
                matchedSentences: matchedSentences.slice(0, MAX_MATCHED_SENTENCES),
            });
        }
    }

    results.sort((left, right) => right.similarity - left.similarity);

    return NextResponse.json({
        success: true,
        results,
        totalCompared: (preparedContents.length * (preparedContents.length - 1)) / 2,
        similarCount: results.length,
        threshold,
    });
}
