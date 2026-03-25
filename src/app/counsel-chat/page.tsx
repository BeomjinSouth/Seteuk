'use client';

import { Suspense, useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    Bot,
    CalendarRange,
    CheckCircle2,
    FileSearch,
    GraduationCap,
    Link2,
    MessageSquareQuote,
    SearchCheck,
    ShieldCheck,
    Tag
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type {
    CounselChatResponse,
    KnowledgeMeta,
    RecordReviewIssue,
    RecordReviewResponse,
} from '@/types/knowledge';
import styles from './page.module.css';

type AssistantMode = 'counsel' | 'review';

const SAMPLE_QUESTIONS = [
    '출석인정 결석의 증빙 서류는 어디까지 필요한가요?',
    '세특에 학생 이름을 직접 써도 되나요?',
    '창의적 체험활동 누가기록은 어떻게 관리해야 하나요?',
];

const SAMPLE_RECORD_TEXTS = [
    '학생은 지역 대학 탐방 활동에서 우수한 태도를 보였으며 최고 수준의 발표 역량을 바탕으로 진로 설계 내용을 구체적으로 정리함.',
    '학생은 교내 활동 전반에서 성실하였고 모든 분야에서 뛰어난 리더십을 보였으며 항상 모범적인 태도를 유지함.',
];

const REVIEW_STATUS_LABELS: Record<RecordReviewResponse['status'], string> = {
    pass: '통과',
    caution: '주의',
    revise: '수정 권장',
    needs_manual_review: '수동 확인',
};

const SEVERITY_LABELS: Record<RecordReviewIssue['severity'], string> = {
    low: '낮음',
    medium: '중간',
    high: '높음',
};

const ISSUE_TYPE_LABELS: Record<RecordReviewIssue['issueType'], string> = {
    prohibited_named_entity: '금지 인명·고유명사',
    certificate_fact_out_of_scope: '자격증 기재 범위 점검',
    award_scope_violation: '수상 기재 범위 점검',
    attendance_note_rule_risk: '출결 관련 문구 점검',
    subject_detail_style_risk: '교과 세특 문체 점검',
    objectivity_risk: '객관성 부족 위험',
    unsupported_claim_risk: '근거 부족 표현 위험',
    year_mismatch_risk: '연도 기준 불일치 위험',
    needs_manual_review: '수동 확인 필요',
};

function CounselChatPageContent() {
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<AssistantMode>('counsel');
    const [meta, setMeta] = useState<KnowledgeMeta | null>(null);
    const [schoolLevel, setSchoolLevel] = useState('고등학교');
    const [category, setCategory] = useState('');
    const [year, setYear] = useState('2026');
    const [question, setQuestion] = useState(SAMPLE_QUESTIONS[0]);
    const [recordText, setRecordText] = useState(SAMPLE_RECORD_TEXTS[0]);
    const [counselResult, setCounselResult] = useState<CounselChatResponse | null>(null);
    const [reviewResult, setReviewResult] = useState<RecordReviewResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCounselPending, startCounselTransition] = useTransition();
    const [isReviewPending, startReviewTransition] = useTransition();

    useEffect(() => {
        const presetMode = searchParams.get('mode');
        const presetQuestion = searchParams.get('q');
        const presetText = searchParams.get('text');
        const presetSchoolLevel = searchParams.get('schoolLevel');
        const presetCategory = searchParams.get('category');
        const presetYear = searchParams.get('year');

        if (presetMode === 'review') setMode('review');
        else if (presetMode === 'counsel') setMode('counsel');
        else if (presetText) setMode('review');
        else setMode('counsel');

        if (presetQuestion) setQuestion(presetQuestion);
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
                setYear((current) => current || data.year);
            }
        };

        void loadMeta();
    }, []);

    const handleCounselSubmit = () => {
        setError(null);
        startCounselTransition(async () => {
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
                setCounselResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '답변 생성에 실패했습니다.');
            }
        });
    };

    const handleReviewSubmit = () => {
        setError(null);
        startReviewTransition(async () => {
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
                setReviewResult(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : '점검에 실패했습니다.');
            }
        });
    };

    const isCounselMode = mode === 'counsel';

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.kicker}>One Workspace, Two Jobs</span>
                    <h1 className={styles.title}>학생부 상담·점검</h1>
                    <p className={styles.subtitle}>
                        질문에 대한 근거 답변과 생기부 초안 점검을 같은 화면에서 처리합니다. 상담과 점검이 분리돼 보이지 않도록
                        하나의 작업공간으로 정리했습니다.
                    </p>

                    <div className={styles.modeSwitch}>
                        <button
                            type="button"
                            className={`${styles.modeButton} ${isCounselMode ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('counsel')}
                        >
                            <MessageSquareQuote size={18} />
                            <span className={styles.modeButtonCopy}>
                                <strong>질문 답변</strong>
                                <span>규정, FAQ, 공개 Q&amp;A 근거로 답합니다.</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className={`${styles.modeButton} ${!isCounselMode ? styles.modeButtonActive : ''}`}
                            onClick={() => setMode('review')}
                        >
                            <SearchCheck size={18} />
                            <span className={styles.modeButtonCopy}>
                                <strong>문구 점검</strong>
                                <span>초안 문장의 위험 요소와 수정 방향을 봅니다.</span>
                            </span>
                        </button>
                    </div>
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
                        <ShieldCheck size={18} />
                        <div>
                            <strong>{meta?.stats.knowledgeUnits ?? '-'}</strong>
                            <span>knowledge units</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.workspacePanel}>
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

                {isCounselMode ? (
                    <>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelKicker}>Question</span>
                                <h2>학생부 관련 질문</h2>
                            </div>
                        </div>

                        <textarea
                            className={styles.inputArea}
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
                            <Button onClick={handleCounselSubmit} isLoading={isCounselPending}>
                                <Bot size={16} /> 근거 기반 답변 생성
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.panelHeader}>
                            <div>
                                <span className={styles.panelKicker}>Review</span>
                                <h2>점검할 생기부 문장</h2>
                            </div>
                        </div>

                        <textarea
                            className={styles.inputArea}
                            value={recordText}
                            onChange={(event) => setRecordText(event.target.value)}
                            placeholder="점검할 생기부 문장을 입력하세요."
                            rows={10}
                        />

                        <div className={styles.sampleRow}>
                            {SAMPLE_RECORD_TEXTS.map((sample) => (
                                <button key={sample} className={styles.sampleChip} onClick={() => setRecordText(sample)}>
                                    {sample}
                                </button>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button onClick={handleReviewSubmit} isLoading={isReviewPending}>
                                <SearchCheck size={16} /> 근거 기반 점검 실행
                            </Button>
                        </div>
                    </>
                )}
            </section>

            {error && <div className={styles.errorBox}>{error}</div>}

            {isCounselMode && counselResult && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.resultShell}
                >
                    <article className={styles.primaryCard}>
                        <div className={styles.answerHeader}>
                            <h2>답변</h2>
                            {counselResult.fallback && <span className={styles.badge}>Fallback</span>}
                        </div>
                        <p className={styles.answerText}>{counselResult.answer}</p>
                        {counselResult.conflictNote && (
                            <div className={styles.noticeBox}>
                                <strong>주의</strong>
                                <p>{counselResult.conflictNote}</p>
                            </div>
                        )}
                    </article>

                    <aside className={styles.citationPanel}>
                        <h3>근거 출처</h3>
                        <div className={styles.citationList}>
                            {counselResult.citations.map((citation) => (
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

                        {counselResult.matches.length > 0 && (
                            <div className={styles.matchPanel}>
                                <h4>검색된 지식</h4>
                                <div className={styles.matchList}>
                                    {counselResult.matches.map((match) => (
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

            {!isCounselMode && reviewResult && (
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={styles.resultShell}
                >
                    <div className={styles.primaryCard}>
                        <div className={styles.answerHeader}>
                            <h2>점검 요약</h2>
                            <span className={`${styles.statusBadge} ${styles[reviewResult.status]}`}>
                                {REVIEW_STATUS_LABELS[reviewResult.status]}
                            </span>
                        </div>
                        <p className={styles.answerText}>{reviewResult.summary}</p>

                        {reviewResult.recommendedRewrite && (
                            <div className={styles.rewriteBox}>
                                <strong>수정 방향</strong>
                                <p>{reviewResult.recommendedRewrite}</p>
                            </div>
                        )}

                        <div className={styles.issueList}>
                            {reviewResult.issues.length === 0 ? (
                                <div className={styles.passBox}>
                                    <CheckCircle2 size={18} />
                                    <span>즉시 수정이 필요한 신호는 크지 않습니다.</span>
                                </div>
                            ) : (
                                reviewResult.issues.map((issue, index) => (
                                    <div key={`${issue.issueType}-${index}`} className={styles.issueCard}>
                                        <div className={styles.issueHeader}>
                                            <span className={`${styles.severity} ${styles[issue.severity]}`}>
                                                {SEVERITY_LABELS[issue.severity]}
                                            </span>
                                            <strong>{ISSUE_TYPE_LABELS[issue.issueType]}</strong>
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

                    <aside className={styles.citationPanel}>
                        <div className={styles.citationHeader}>
                            <h3>관련 공개 근거</h3>
                            <AlertTriangle size={16} />
                        </div>
                        <div className={styles.citationList}>
                            {reviewResult.citations.map((citation) => (
                                <a
                                    key={`${citation.url}-${citation.title}`}
                                    href={citation.url}
                                    className={styles.citationCard}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className={styles.citationHeader}>
                                        <strong>{citation.title}</strong>
                                        <Link2 size={14} />
                                    </div>
                                    <p>{citation.snippet}</p>
                                </a>
                            ))}
                        </div>

                        {reviewResult.matches.length > 0 && (
                            <div className={styles.matchPanel}>
                                <h4>검색된 지식</h4>
                                <div className={styles.matchList}>
                                    {reviewResult.matches.map((match) => (
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

export default function CounselChatPage() {
    return (
        <Suspense fallback={<div className={styles.page} />}>
            <CounselChatPageContent />
        </Suspense>
    );
}
