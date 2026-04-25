export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAdminRequest } from '@/lib/admin-auth';
import { syncKnowledgeToVectorStore } from '@/lib/knowledge-hosted';

export async function POST(request: NextRequest) {
    const unauthorized = requireAdminRequest(request);
    if (unauthorized) return unauthorized;

    let body: {
        year?: string;
        vectorStoreId?: string;
        offset?: number;
        batchSize?: number;
    } = {};

    try {
        body = await request.json();
    } catch {
        body = {};
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
        console.error('Admin reindex failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Admin reindex failed.',
            },
            { status: 500 },
        );
    }
}
