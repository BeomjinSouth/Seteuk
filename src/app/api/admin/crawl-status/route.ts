export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/guards';
import { getKnowledgeMeta, loadKnowledgeDataset } from '@/lib/knowledge-base';

export const GET = withAdminAuth(async () => {
    try {
        const meta = await getKnowledgeMeta();
        const dataset = await loadKnowledgeDataset();

        return NextResponse.json({
            success: true,
            generatedAt: meta.generatedAt,
            year: meta.year,
            stats: meta.stats,
            schoolLevelCount: meta.schoolLevels.length,
            categoryCount: meta.categories.length,
            latestSourceUrl: dataset.canonicalEntries[0]?.sourceUrls[0] ?? null,
        });
    } catch (error) {
        console.error('Admin crawl status failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Admin crawl status failed.',
            },
            { status: 500 },
        );
    }
});
