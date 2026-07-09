export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/guards';
import { loadKnowledgeDataset } from '@/lib/knowledge-base';

export const GET = withAdminAuth(async () => {
    try {
        const dataset = await loadKnowledgeDataset();
        const units = dataset.knowledgeUnits;
        const conflictUnits = units.filter((unit) => unit.answer_consistency_label === 'same_question_different_answer');
        const unitsWithPolicyAnchors = units.filter((unit) => unit.policy_anchors.length > 0);
        const boilerplateSummaryPatterns = [
            /^안녕하십니까/,
            /^감사합니다/,
            /^귀하께서/,
            /^귀하의 질의/,
            /학생생활기록부 종합지원센터/,
            /질의하신 내용/,
            /문의하신 내용/,
            /대한 것으로 이해/,
        ];
        const noisySummaries = units.filter((unit) => {
            const summary = unit.rule_summary ?? '';
            return boilerplateSummaryPatterns.some((pattern) => pattern.test(summary));
        });
        const nullEffectiveYear = units.filter((unit) => unit.effective_year_from === null);
        const privateEvidenceInCanonical = dataset.canonicalEntries.filter((entry) =>
            entry.sources.some((source) => source.url.includes('isSecret=true')),
        );

        return NextResponse.json({
            success: true,
            generatedAt: dataset.generatedAt,
            year: dataset.year,
            stats: dataset.stats,
            quality: {
                totalUnits: units.length,
                conflictUnits: conflictUnits.length,
                unitsWithPolicyAnchors: unitsWithPolicyAnchors.length,
                unitsWithoutPolicyAnchors: units.length - unitsWithPolicyAnchors.length,
                noisyRuleSummaries: noisySummaries.length,
                nullEffectiveYear: nullEffectiveYear.length,
                privateEvidenceInCanonical: privateEvidenceInCanonical.length,
            },
        });
    } catch (error) {
        console.error('Admin quality report failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Admin quality report failed.',
            },
            { status: 500 },
        );
    }
});
