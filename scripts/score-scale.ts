// Prints top-1/top-2 lexical scores per eval case to sanity-check that the
// absolute thresholds (grounding >= 40, high-confidence 140/45) stay calibrated.
import { KNOWLEDGE_EVAL_CASES } from '@/data/knowledge-eval-cases';
import { searchKnowledgeBase } from '@/lib/knowledge-base';
import { shouldSkipRerankForHighConfidenceLexical } from '@/lib/knowledge-search';

async function main() {
    const rows: Array<{ id: string; top: number; second: number; skip: boolean }> = [];
    for (const c of KNOWLEDGE_EVAL_CASES) {
        const matches = await searchKnowledgeBase({
            query: c.query, schoolLevel: c.schoolLevel, category: c.category, year: c.year, limit: 5,
        });
        rows.push({
            id: c.id,
            top: matches[0]?.score ?? 0,
            second: matches[1]?.score ?? 0,
            skip: shouldSkipRerankForHighConfidenceLexical(matches),
        });
    }
    const tops = rows.map((r) => r.top).sort((a, b) => a - b);
    console.log('top-1 score: min', tops[0], 'median', tops[Math.floor(tops.length / 2)], 'max', tops[tops.length - 1]);
    console.log('below grounding threshold 40:', rows.filter((r) => r.top < 40).map((r) => `${r.id}(${r.top})`));
    console.log('high-confidence skip count:', rows.filter((r) => r.skip).length, '/', rows.length);
    for (const r of rows) console.log(`  ${r.id.padEnd(36)} top=${String(r.top).padStart(4)} second=${String(r.second).padStart(4)} skip=${r.skip}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
