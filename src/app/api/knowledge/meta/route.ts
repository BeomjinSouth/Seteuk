export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getKnowledgeMeta } from '@/lib/knowledge-base';

export async function GET() {
    try {
        const meta = await getKnowledgeMeta();
        return NextResponse.json({
            success: true,
            ...meta,
        });
    } catch (error) {
        console.error('Failed to load knowledge meta:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to load knowledge metadata.',
            },
            { status: 500 }
        );
    }
}
