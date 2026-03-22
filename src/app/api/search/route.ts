export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledgeBase } from '@/lib/knowledge-base';

export async function POST(request: NextRequest) {
    let body: {
        query?: string;
        schoolLevel?: string;
        category?: string;
        year?: number;
        limit?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const query = body.query?.trim();
    if (!query) {
        return NextResponse.json({ success: false, error: 'query is required.' }, { status: 400 });
    }

    try {
        const matches = await searchKnowledgeBase({
            query,
            schoolLevel: body.schoolLevel,
            category: body.category,
            year: body.year,
            limit: body.limit,
        });

        return NextResponse.json({
            success: true,
            matches,
            count: matches.length,
        });
    } catch (error) {
        console.error('Search API failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Search failed.',
            },
            { status: 500 }
        );
    }
}
