export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { runKnowledgeEval } from '@/lib/knowledge-eval';

export async function GET() {
    try {
        const report = await runKnowledgeEval();
        return NextResponse.json({
            success: true,
            ...report,
        });
    } catch (error) {
        console.error('Search eval failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Search evaluation failed.',
            },
            { status: 500 }
        );
    }
}
