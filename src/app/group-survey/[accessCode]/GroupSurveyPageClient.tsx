'use client';

import { FormEvent, useMemo, useState } from 'react';
import { CheckCircle2, ChevronLeft, Loader2, Send, UserCheck } from 'lucide-react';
import {
    GROUP_SURVEY_QUESTIONS,
    GROUP_SURVEY_SCALE,
} from '@/lib/group-survey';
import type { SurveyAnswerValue } from '@/types';
import styles from './page.module.css';

type IdentifyResult = {
    token: string;
    alreadySubmitted?: boolean;
    student: {
        grade: number;
        classNumber: number;
        number: number;
    };
    session: {
        title: string;
        accessCode: string;
    };
};

const answerValues: SurveyAnswerValue[] = [1, 2, 3, 4, 5];

function emptyAnswers(): Array<SurveyAnswerValue | 0> {
    return Array.from({ length: GROUP_SURVEY_QUESTIONS.length }, () => 0);
}

export default function GroupSurveyPageClient({ accessCode }: { accessCode: string }) {
    const normalizedAccessCode = accessCode.trim().toUpperCase();
    const [grade, setGrade] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [number, setNumber] = useState('');
    const [studentName, setStudentName] = useState('');
    const [identified, setIdentified] = useState<IdentifyResult | null>(null);
    const [step, setStep] = useState<'identify' | 'confirm' | 'survey' | 'done'>('identify');
    const [answers, setAnswers] = useState<Array<SurveyAnswerValue | 0>>(emptyAnswers);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const answeredCount = useMemo(
        () => answers.filter((answer) => answer !== 0).length,
        [answers]
    );
    const canSubmit = answeredCount === GROUP_SURVEY_QUESTIONS.length;

    const handleIdentify = async (event: FormEvent) => {
        event.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/group-survey/identify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accessCode: normalizedAccessCode,
                    grade: Number(grade),
                    classNumber: Number(classNumber),
                    number: Number(number),
                    name: studentName,
                }),
            });
            const payload = await response.json() as IdentifyResult & { success?: boolean; error?: string };
            if (!response.ok || !payload.success) {
                setMessage(payload.error || '학생 확인을 하지 못했습니다.');
                return;
            }

            setIdentified(payload);
            setStep('confirm');
        } catch (error) {
            console.error('Student identify failed:', error);
            setMessage('잠시 후 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!identified || !canSubmit) return;
        setMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/group-survey/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token: identified.token,
                    answers,
                }),
            });
            const payload = await response.json() as { success?: boolean; error?: string };
            if (!response.ok || !payload.success) {
                setMessage(payload.error || '제출하지 못했습니다.');
                return;
            }

            setStep('done');
        } catch (error) {
            console.error('Student survey submit failed:', error);
            setMessage('잠시 후 다시 시도해 주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <section className={styles.shell}>
                <div className={styles.hero}>
                    <div className={styles.heroText}>
                        <span className={styles.codeBadge}>설문 코드 {normalizedAccessCode}</span>
                        <h1>함께 배우기 설문</h1>
                        <p>
                            더 좋은 모둠활동을 준비하기 위한 설문입니다. 정답은 없습니다.
                            최근 모둠활동에서의 내 모습에 가장 가까운 번호를 골라 주세요.
                        </p>
                    </div>
                    <div className={styles.heroMark} aria-hidden="true">
                        <span />
                        <i />
                    </div>
                </div>

                {step === 'identify' && (
                    <form className={styles.identifyPanel} onSubmit={handleIdentify}>
                        <h2>학생 확인</h2>
                        <div className={styles.inputGrid}>
                            <label>
                                학년
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    value={grade}
                                    onChange={(event) => setGrade(event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                반
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    value={classNumber}
                                    onChange={(event) => setClassNumber(event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                번호
                                <input
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    value={number}
                                    onChange={(event) => setNumber(event.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                이름
                                <input
                                    type="text"
                                    autoComplete="off"
                                    value={studentName}
                                    onChange={(event) => setStudentName(event.target.value)}
                                    required
                                />
                            </label>
                        </div>
                        {message && <p className={styles.errorText}>{message}</p>}
                        <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                            {isLoading ? <Loader2 size={18} className={styles.spin} /> : <UserCheck size={18} />}
                            확인하기
                        </button>
                    </form>
                )}

                {step === 'confirm' && identified && (
                    <section className={styles.confirmPanel}>
                        <UserCheck size={42} />
                        <h2>{studentName.trim()} 님이 맞습니까?</h2>
                        <p>
                            {identified.student.grade}학년 {identified.student.classNumber}반 {identified.student.number}번으로 확인되었습니다.
                        </p>
                        {identified.alreadySubmitted && (
                            <p className={styles.noticeText}>이미 제출한 기록이 있어 다시 제출하면 새 응답으로 바뀝니다.</p>
                        )}
                        <div className={styles.confirmActions}>
                            <button type="button" className={styles.secondaryButton} onClick={() => setStep('identify')}>
                                <ChevronLeft size={18} />
                                다시 입력
                            </button>
                            <button type="button" className={styles.primaryButton} onClick={() => setStep('survey')}>
                                맞습니다
                            </button>
                        </div>
                    </section>
                )}

                {step === 'survey' && identified && (
                    <section className={styles.surveyPanel}>
                        <div className={styles.surveyHeader}>
                            <div>
                                <h2>{identified.session.title || '함께 배우기 설문'}</h2>
                                <p>{answeredCount}/{GROUP_SURVEY_QUESTIONS.length}문항 응답</p>
                            </div>
                        </div>

                        <div className={styles.scaleLegend}>
                            {GROUP_SURVEY_SCALE.map((label, index) => (
                                <span key={label}>{index + 1}. {label}</span>
                            ))}
                        </div>

                        <div className={styles.questionList}>
                            {GROUP_SURVEY_QUESTIONS.map((question, questionIndex) => (
                                <article key={question} className={styles.questionCard}>
                                    <h3>
                                        <span>{questionIndex + 1}</span>
                                        {question}
                                    </h3>
                                    <div className={styles.answerRow}>
                                        {answerValues.map((value) => (
                                            <label
                                                key={value}
                                                className={answers[questionIndex] === value ? styles.answerActive : ''}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${questionIndex}`}
                                                    value={value}
                                                    checked={answers[questionIndex] === value}
                                                    onChange={() => {
                                                        setAnswers((prev) => {
                                                            const next = [...prev];
                                                            next[questionIndex] = value;
                                                            return next;
                                                        });
                                                    }}
                                                />
                                                {value}
                                            </label>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {message && <p className={styles.errorText}>{message}</p>}
                        <button
                            type="button"
                            className={styles.submitButton}
                            onClick={handleSubmit}
                            disabled={!canSubmit || isLoading}
                        >
                            {isLoading ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
                            제출하기
                        </button>
                    </section>
                )}

                {step === 'done' && (
                    <section className={styles.donePanel}>
                        <CheckCircle2 size={54} />
                        <h2>제출되었습니다</h2>
                        <p>설문에 참여해 주어서 고마워요. 창을 닫아도 됩니다.</p>
                    </section>
                )}
            </section>
        </main>
    );
}
