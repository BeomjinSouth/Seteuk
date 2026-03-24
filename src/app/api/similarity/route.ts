import { NextRequest, NextResponse } from 'next/server';

// Tokenize Korean text into words/phrases
function tokenize(text: string): Set<string> {
    // Remove punctuation and split into tokens
    const cleaned = text.replace(/[.,!?;:'"()\[\]{}]/g, ' ');
    const tokens = cleaned.split(/\s+/).filter(t => t.length > 1);

    // Also create bigrams for better similarity detection
    const bigrams: string[] = [];
    for (let i = 0; i < tokens.length - 1; i++) {
        bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
    }

    return new Set([...tokens, ...bigrams]);
}

// Calculate Jaccard similarity between two texts
function jaccardSimilarity(text1: string, text2: string): number {
    const set1 = tokenize(text1);
    const set2 = tokenize(text2);

    if (set1.size === 0 && set2.size === 0) return 0;

    let intersection = 0;
    set1.forEach(token => {
        if (set2.has(token)) intersection++;
    });

    const union = set1.size + set2.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

interface ContentItem {
    studentId: string;
    studentName: string;
    content: string;
}

interface SimilarityResult {
    student1: { id: string; name: string };
    student2: { id: string; name: string };
    similarity: number;  // 0-1
    similarPhrases: string[];
}

/**
 * Calculates similarity between multiple student contents.
 * 
 * @description
 * Uses Jaccard similarity to compare texts and identify
 * potential duplicate or highly similar content.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - contents: Array<{ studentId, studentName, content }>
 *   - threshold?: number (0.0 to 1.0, default 0.6)
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
        threshold?: number;  // default 0.6 (60% similarity)
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: '잘못된 요청입니다.' },
            { status: 400 }
        );
    }

    const { contents, threshold = 0.6 } = body;

    if (!contents || contents.length < 2) {
        return NextResponse.json({
            success: true,
            results: [],
            message: '비교할 세특이 2개 이상 필요합니다.'
        });
    }

    const results: SimilarityResult[] = [];

    // Compare all pairs
    for (let i = 0; i < contents.length; i++) {
        for (let j = i + 1; j < contents.length; j++) {
            const content1 = contents[i];
            const content2 = contents[j];

            if (!content1.content || !content2.content) continue;

            const similarity = jaccardSimilarity(content1.content, content2.content);

            if (similarity >= threshold) {
                // Find common phrases
                const tokens1 = tokenize(content1.content);
                const tokens2 = tokenize(content2.content);
                const commonPhrases: string[] = [];

                tokens1.forEach(token => {
                    if (tokens2.has(token) && token.includes(' ')) {
                        commonPhrases.push(token);
                    }
                });

                results.push({
                    student1: { id: content1.studentId, name: content1.studentName },
                    student2: { id: content2.studentId, name: content2.studentName },
                    similarity: Math.round(similarity * 100) / 100,
                    similarPhrases: commonPhrases.slice(0, 5)  // Top 5 similar phrases
                });
            }
        }
    }

    // Sort by similarity (highest first)
    results.sort((a, b) => b.similarity - a.similarity);

    return NextResponse.json({
        success: true,
        results,
        totalCompared: (contents.length * (contents.length - 1)) / 2,
        similarCount: results.length
    });
}
