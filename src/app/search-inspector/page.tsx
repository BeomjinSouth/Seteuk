'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import type { RetrievedKnowledgeEvidence } from '@/types/knowledge';
import styles from './page.module.css';

export default function SearchInspectorPage() {
    const [query, setQuery] = useState('세특에 학생 이름을 넣어도 되나요');
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [matches, setMatches] = useState<RetrievedKnowledgeEvidence[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSearch = () => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        schoolLevel: schoolLevel || undefined,
                        category: category || undefined,
                        year: Number(year),
                        limit: 10,
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || '검색에 실패했습니다.');
                }
                setMatches(data.matches);
            } catch (err) {
                setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
            }
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.topNav}>
                <Link href="/dashboard" className={styles.topLink}>대시보드</Link>
                <Link href="/counsel-chat" className={styles.topLink}>학생부 상담</Link>
                <Link href="/record-review" className={styles.topLink}>생기부 점검</Link>
                <Link href="/search-inspector" className={styles.topLinkActive}>검색 점검</Link>
            </div>

            <section className={styles.panel}>
                <h1 className={styles.title}>검색 점검</h1>
                <p className={styles.subtitle}>현재 retrieval 결과와 점수를 직접 확인하는 개발용 화면입니다.</p>

                <div className={styles.filterGrid}>
                    <input value={query} onChange={(event) => setQuery(event.target.value)} className={styles.input} />
                    <input value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)} className={styles.input} />
                    <input value={category} onChange={(event) => setCategory(event.target.value)} className={styles.input} placeholder="구분(선택)" />
                    <input value={year} onChange={(event) => setYear(event.target.value)} className={styles.input} />
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleSearch} isLoading={isPending}>검색 실행</Button>
                </div>
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.resultList}>
                {matches.map((match, index) => (
                    <motion.article
                        key={match.knowledgeUnitId}
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
                            {match.sourceBoard} · {match.schoolLevels.join(', ')} · {match.categories.join(', ') || '-'} · {match.effectiveYear ?? '미상'}
                        </p>
                        <p className={styles.snippet}>{match.snippet}</p>
                        <div className={styles.links}>
                            {match.sourceUrls.map((url) => (
                                <a key={url} href={url} target="_blank" rel="noreferrer">{url}</a>
                            ))}
                        </div>
                    </motion.article>
                ))}
            </div>
        </div>
    );
}
