'use client';

import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { KnowledgeEvalReport, RetrievedKnowledgeEvidence } from '@/types/knowledge';
import styles from './page.module.css';

export default function SearchInspectorPage() {
    const [query, setQuery] = useState('세특에 학생 이름을 넣어도 되나요');
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [matches, setMatches] = useState<RetrievedKnowledgeEvidence[]>([]);
    const [hostedMatches, setHostedMatches] = useState<RetrievedKnowledgeEvidence[]>([]);
    const [evalReport, setEvalReport] = useState<KnowledgeEvalReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [isHostedPending, startHostedTransition] = useTransition();
    const [isEvalPending, startEvalTransition] = useTransition();

    const payload = {
        query,
        schoolLevel: schoolLevel || undefined,
        category: category || undefined,
        year: Number(year),
        limit: 10,
    };

    const handleSearch = () => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Local search failed.');
                }
                setMatches(data.matches);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Local search failed.');
            }
        });
    };

    const handleHostedSearch = () => {
        setError(null);
        startHostedTransition(async () => {
            try {
                const response = await fetch('/api/search-openai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Hosted search failed.');
                }
                setHostedMatches(data.matches);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Hosted search failed.');
            }
        });
    };

    const handleRunEval = () => {
        setError(null);
        startEvalTransition(async () => {
            try {
                const response = await fetch('/api/search-eval');
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Evaluation failed.');
                }
                setEvalReport(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Evaluation failed.');
            }
        });
    };

    return (
        <div className={styles.page}>
            <section className={styles.panel}>
                <h1 className={styles.title}>Search Inspector</h1>
                <p className={styles.subtitle}>
                    Inspect local retrieval, hosted retrieval, and evaluation metrics from one place.
                </p>

                <div className={styles.filterGrid}>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} className={styles.input} />
                    <input value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)} className={styles.input} />
                    <input value={category} onChange={(event) => setCategory(event.target.value)} className={styles.input} placeholder="category (optional)" />
                    <input value={year} onChange={(event) => setYear(event.target.value)} className={styles.input} />
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleSearch} isLoading={isPending}>Local Search</Button>
                    <Button variant="secondary" onClick={handleHostedSearch} isLoading={isHostedPending}>Hosted Search</Button>
                    <Button variant="secondary" onClick={handleRunEval} isLoading={isEvalPending}>Run Eval Set</Button>
                </div>
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            {evalReport && (
                <section className={styles.evalPanel}>
                    <div className={styles.evalHeader}>
                        <h2>Retrieval Evaluation</h2>
                        <span>{evalReport.caseCount} cases</span>
                    </div>
                    <div className={styles.evalStats}>
                        <div className={styles.evalStatCard}>
                            <strong>{(evalReport.hitAt1 * 100).toFixed(1)}%</strong>
                            <span>Hit@1</span>
                        </div>
                        <div className={styles.evalStatCard}>
                            <strong>{(evalReport.hitAt3 * 100).toFixed(1)}%</strong>
                            <span>Hit@3</span>
                        </div>
                        <div className={styles.evalStatCard}>
                            <strong>{evalReport.meanReciprocalRank.toFixed(3)}</strong>
                            <span>MRR</span>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.resultSection}>
                <div className={styles.resultColumn}>
                    <h2>Local Search Results</h2>
                    <div className={styles.resultList}>
                        {matches.map((match, index) => (
                            <motion.article
                                key={`local-${match.knowledgeUnitId}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={styles.card}
                            >
                                <div className={styles.cardHeader}>
                                    <strong>{match.title}</strong>
                                    <span>{match.score} pts</span>
                                </div>
                                <p className={styles.meta}>
                                    {match.sourceBoard} · {match.schoolLevels.join(', ')} · {match.categories.join(', ') || '-'} · {match.effectiveYear ?? 'unknown'}
                                </p>
                                <p className={styles.snippet}>{match.snippet}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>

                <div className={styles.resultColumn}>
                    <h2>Hosted Search Results</h2>
                    <div className={styles.resultList}>
                        {hostedMatches.map((match, index) => (
                            <motion.article
                                key={`hosted-${match.knowledgeUnitId}-${index}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={styles.card}
                            >
                                <div className={styles.cardHeader}>
                                    <strong>{match.title}</strong>
                                    <span>{match.score.toFixed(3)}</span>
                                </div>
                                <p className={styles.meta}>
                                    {match.sourceBoard} · {match.schoolLevels.join(', ')} · {match.categories.join(', ') || '-'} · {match.effectiveYear ?? 'unknown'}
                                </p>
                                <p className={styles.snippet}>{match.snippet}</p>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
