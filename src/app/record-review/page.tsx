'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, GraduationCap, Link2, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { KnowledgeMeta, RecordReviewResponse } from '@/types/knowledge';
import styles from './page.module.css';

const SAMPLE_TEXT = '학생은 지역 대학 탐방 활동에서 우수한 태도를 보였으며 최고 수준의 발표 역량을 바탕으로 진로 설계 내용을 구체적으로 정리함.';

export default function RecordReviewPage() {
    const searchParams = useSearchParams();
    const [meta, setMeta] = useState<KnowledgeMeta | null>(null);
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [recordText, setRecordText] = useState(SAMPLE_TEXT);
    const [result, setResult] = useState<RecordReviewResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const presetText = searchParams.get('text');
        const presetSchoolLevel = searchParams.get('schoolLevel');
        const presetCategory = searchParams.get('category');
        const presetYear = searchParams.get('year');

        if (presetText) setRecordText(presetText);
        if (presetSchoolLevel) setSchoolLevel(presetSchoolLevel);
        if (presetCategory) setCategory(presetCategory);
        if (presetYear) setYear(presetYear);
    }, [searchParams]);

    useEffect(() => {
        const loadMeta = async () => {
            const response = await fetch('/api/knowledge/meta');
            const data = await response.json();
            if (data.success) {
                setMeta(data);
                setYear(data.year);
                setCategory((current: string) => current || data.categories?.[0] || '');
            }
        };

        void loadMeta();
    }, []);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch('/api/record-review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recordText,
                        schoolLevel,
                        category: category || undefined,
                        year: Number(year),
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || '점검에 실패했습니다.');
                }
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '점검에 실패했습니다.');
            }
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.topNav}>
                <Link href="/dashboard" className={styles.topLink}>대시보드</Link>
                <Link href="/counsel-chat" className={styles.topLink}>학생부 상담</Link>
                <Link href="/record-review" className={styles.topLinkActive}>생기부 점검</Link>
            </div>

            <section className={styles.hero}>
                <div>
                    <span className={styles.kicker}>Context-grounded Review</span>
                    <h1 className={styles.title}>생기부 점검 AI</h1>
                    <p className={styles.subtitle}>
                        공개 FAQ/Q&A를 컨텍스트로 활용해 문장 위험 요소, 근거, 수정 방향을 함께 제공합니다.
                    </p>
                </div>
                <div className={styles.heroPanel}>
                    <div className={styles.heroStat}>
                        <ShieldCheck size={18} />
                        <span>{meta?.stats.knowledgeUnits ?? '-'} knowledge units</span>
                    </div>
                    <div className={styles.heroStat}>
                        <CheckCircle2 size={18} />
                        <span>schema-validated review flow</span>
                    </div>
                </div>
            </section>

            <section className={styles.editorPanel}>
                <div className={styles.filterGrid}>
                    <label className={styles.filterField}>
                        <span><GraduationCap size={14} /> 학교급</span>
                        <select value={schoolLevel} onChange={(event) => setSchoolLevel(event.target.value)}>
                            {(meta?.schoolLevels ?? ['초등학교', '중학교', '고등학교']).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span><Tag size={14} /> 구분</span>
                        <select value={category} onChange={(event) => setCategory(event.target.value)}>
                            <option value="">전체</option>
                            {(meta?.categories ?? []).map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.filterField}>
                        <span>연도</span>
                        <input value={year} onChange={(event) => setYear(event.target.value)} />
                    </label>
                </div>

                <textarea
                    className={styles.textarea}
                    value={recordText}
                    onChange={(event) => setRecordText(event.target.value)}
                    rows={10}
                    placeholder="점검할 생기부 문장을 입력하세요."
                />

                <div className={styles.actions}>
                    <Button onClick={handleSubmit} isLoading={isPending}>
                        <Sparkles size={16} /> 근거 기반 점검 실행
                    </Button>
                </div>
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            {result && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.reviewGrid}
                >
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryHeader}>
                            <h2>점검 요약</h2>
                            <span className={`${styles.statusBadge} ${styles[result.status]}`}>{result.status}</span>
                        </div>
                        <p className={styles.summaryText}>{result.summary}</p>

                        {result.recommendedRewrite && (
                            <div className={styles.rewriteBox}>
                                <strong>수정 방향</strong>
                                <p>{result.recommendedRewrite}</p>
                            </div>
                        )}

                        <div className={styles.issueList}>
                            {result.issues.length === 0 ? (
                                <div className={styles.passBox}>
                                    <CheckCircle2 size={18} />
                                    <span>즉시 수정이 필요한 신호는 크지 않습니다.</span>
                                </div>
                            ) : (
                                result.issues.map((issue, index) => (
                                    <div key={`${issue.issueType}-${index}`} className={styles.issueCard}>
                                        <div className={styles.issueHeader}>
                                            <span className={`${styles.severity} ${styles[issue.severity]}`}>{issue.severity}</span>
                                            <strong>{issue.issueType}</strong>
                                        </div>
                                        <p className={styles.issueMessage}>{issue.message}</p>
                                        {issue.evidence.length > 0 && (
                                            <ul className={styles.issueEvidence}>
                                                {issue.evidence.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {issue.rewriteGuidance && (
                                            <p className={styles.issueGuidance}>{issue.rewriteGuidance}</p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <aside className={styles.citationCard}>
                        <div className={styles.citationHeader}>
                            <h3>관련 공개 근거</h3>
                            <AlertTriangle size={16} />
                        </div>
                        <div className={styles.citationList}>
                            {result.citations.map((citation) => (
                                <a
                                    key={`${citation.url}-${citation.title}`}
                                    href={citation.url}
                                    className={styles.citationItem}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.citationTop}>
                                        <strong>{citation.title}</strong>
                                        <Link2 size={14} />
                                    </div>
                                    <p>{citation.snippet}</p>
                                </a>
                            ))}
                        </div>

                        {result.matches.length > 0 && (
                            <div className={styles.matchPanel}>
                                <h4>검색된 지식</h4>
                                <div className={styles.matchList}>
                                    {result.matches.map((match) => (
                                        <div key={match.knowledgeUnitId} className={styles.matchCard}>
                                            <strong>{match.title}</strong>
                                            <span>{match.score} pts</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </motion.section>
            )}
        </div>
    );
}
