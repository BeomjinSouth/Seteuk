export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { runKnowledgeEval } from '@/lib/knowledge-eval';

export async function GET(request: NextRequest) {
    try {
        const mode = request.nextUrl.searchParams.get('mode') === 'hybrid' ? 'hybrid' : 'lexical';
        const requestedLimit = Number(request.nextUrl.searchParams.get('limit') ?? 5);
        const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
            ? Math.min(Math.floor(requestedLimit), 30)
            : 5;
        const report = await runKnowledgeEval(limit, mode);
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
