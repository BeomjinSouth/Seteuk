import { runKnowledgeEval } from '@/lib/knowledge-eval';

async function main() {
    const report = await runKnowledgeEval(5, 'lexical');
    console.log('=== metrics ===');
    console.log('hit@1  :', report.hitAt1.toFixed(3));
    console.log('hit@3  :', report.hitAt3.toFixed(3));
    console.log('recall@5:', report.recallAtK.toFixed(3));
    console.log('MRR    :', report.meanReciprocalRank.toFixed(3));
    console.log('failures:', report.failures.map((f) => f.id));

    const target = report.results.find((r) => r.id === 'seteuk-contest-term');
    if (target) {
        console.log('\n=== seteuk-contest-term ===');
        console.log('rank (0-based):', target.matchedTitles.findIndex((t) =>
            ['대회 용어', '인용문'].some((k) => t.normalize('NFKC').toLowerCase().includes(k.normalize('NFKC').toLowerCase()))));
        console.log('reciprocalRank:', target.reciprocalRank.toFixed(3));
        console.log('top titles:');
        target.matchedTitles.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
