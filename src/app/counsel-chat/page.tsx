'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bot, CalendarRange, FileSearch, GraduationCap, Link2, MessageSquareQuote, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { CounselChatResponse, KnowledgeMeta } from '@/types/knowledge';
import styles from './page.module.css';

const SAMPLE_QUESTIONS = [
    '출석인정 결석의 증빙 서류는 어디까지 필요한가요?',
    '세특에 학생 이름을 직접 써도 되나요?',
    '창의적 체험활동 누가기록은 어떻게 관리해야 하나요?',
];

export default function CounselChatPage() {
    const searchParams = useSearchParams();
    const [meta, setMeta] = useState<KnowledgeMeta | null>(null);
    const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [result, setResult] = useState<CounselChatResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        const presetQuestion = searchParams.get('q');
        const presetSchoolLevel = searchParams.get('schoolLevel');
        const presetCategory = searchParams.get('category');
        const presetYear = searchParams.get('year');

        if (presetQuestion) setQuestion(presetQuestion);
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
            }
        };

        void loadMeta();
    }, []);

    const handleSubmit = () => {
        setError(null);
        startTransition(async () => {
            try {
                const response = await fetch('/api/counsel-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        question,
                        schoolLevel,
                        category: category || undefined,
                        year: Number(year),
                    }),
                });
                const data = await response.json();
                if (!response.ok || !data.success) {
                    throw new Error(data.error || '답변 생성에 실패했습니다.');
                }
                setResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '답변 생성에 실패했습니다.');
            }
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.topNav}>
                <Link href="/dashboard" className={styles.topLink}>대시보드</Link>
                <Link href="/counsel-chat" className={styles.topLinkActive}>학생부 상담</Link>
                <Link href="/record-review" className={styles.topLink}>생기부 점검</Link>
            </div>

            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.kicker}>Knowledge-backed Counsel</span>
                    <h1 className={styles.title}>학생부 상담 챗봇</h1>
                    <p className={styles.subtitle}>
                        FAQ와 공개 Q&A를 바탕으로 근거 있는 답변만 제시합니다. 공개 근거가 없으면 없다고 답하도록 구성했습니다.
                    </p>
                </div>
                <div className={styles.heroStats}>
                    <div className={styles.statCard}>
                        <FileSearch size={18} />
                        <div>
                            <strong>{meta?.stats.canonicalEntries ?? '-'}</strong>
                            <span>canonical answers</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <MessageSquareQuote size={18} />
                        <div>
                            <strong>{meta?.stats.qnaLastPage ?? '-'}</strong>
                            <span>Q&A pages crawled</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.composer}>
                <div className={styles.filterRow}>
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
                        <span><CalendarRange size={14} /> 연도</span>
                        <input value={year} onChange={(event) => setYear(event.target.value)} />
                    </label>
                </div>

                <textarea
                    className={styles.questionInput}
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="학생부 관련 질문을 입력하세요."
                    rows={6}
                />

                <div className={styles.sampleRow}>
                    {SAMPLE_QUESTIONS.map((sample) => (
                        <button key={sample} className={styles.sampleChip} onClick={() => setQuestion(sample)}>
                            {sample}
                        </button>
                    ))}
                </div>

                <div className={styles.actions}>
                    <Button onClick={handleSubmit} isLoading={isPending}>
                        <Bot size={16} /> 근거 기반 답변 생성
                    </Button>
                </div>
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            {result && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.resultShell}
                >
                    <article className={styles.answerCard}>
                        <div className={styles.answerHeader}>
                            <h2>답변</h2>
                            {result.fallback && <span className={styles.badge}>Fallback</span>}
                        </div>
                        <p className={styles.answerText}>{result.answer}</p>
                        {result.conflictNote && (
                            <div className={styles.noticeBox}>
                                <strong>주의</strong>
                                <p>{result.conflictNote}</p>
                            </div>
                        )}
                    </article>

                    <aside className={styles.citationPanel}>
                        <h3>근거 출처</h3>
                        <div className={styles.citationList}>
                            {result.citations.map((citation) => (
                                <a
                                    key={`${citation.url}-${citation.title}`}
                                    className={styles.citationCard}
                                    href={citation.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.citationHeader}>
                                        <span className={styles.sourceType}>{citation.sourceBoard.toUpperCase()}</span>
                                        <Link2 size={14} />
                                    </div>
                                    <strong>{citation.title}</strong>
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
