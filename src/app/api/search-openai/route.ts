export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withTeacherAuth } from '@/lib/auth/guards';
import { searchHostedKnowledge } from '@/lib/knowledge-hosted';

export const POST = withTeacherAuth(async (request) => {
    let body: {
        query?: string;
        schoolLevel?: string;
        category?: string;
        year?: number;
        limit?: number;
        vectorStoreId?: string;
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
        const matches = await searchHostedKnowledge({
            query,
            schoolLevel: body.schoolLevel,
            category: body.category,
            year: body.year,
            limit: body.limit,
            vectorStoreId: body.vectorStoreId,
        });

        return NextResponse.json({
            success: true,
            matches,
            count: matches.length,
        });
    } catch (error) {
        console.error('Hosted search failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Hosted search failed.',
            },
            { status: 500 }
        );
    }
});
