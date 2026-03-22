export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { syncKnowledgeToVectorStore } from '@/lib/knowledge-hosted';

export async function POST(request: NextRequest) {
    let body: {
        year?: string;
        vectorStoreId?: string;
        offset?: number;
        batchSize?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    try {
        const result = await syncKnowledgeToVectorStore({
            year: body.year,
            vectorStoreId: body.vectorStoreId,
            offset: body.offset,
            batchSize: body.batchSize,
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error('Knowledge sync failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Knowledge sync failed.',
            },
            { status: 500 }
        );
    }
}
