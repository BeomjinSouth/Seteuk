'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    BookOpenCheck,
    CalendarDays,
    Cookie,
    Database,
    Gift,
    HandCoins,
    Link2,
    Medal,
    Plus,
    RefreshCw,
    Save,
    Trash2,
    Users,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { CookieBalance, CookieReward, CookieTransaction, StudentDataEntry } from '@/types';
import { getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import styles from './page.module.css';

type PanelMode = 'data' | 'mentor' | 'cookie';

const today = () => new Date().toISOString().slice(0, 10);

export default function StudentDataPage() {
    const teacher = useAppStore((state) => state.teacher);
    const classes = useAppStore((state) => state.classes);
    const students = useAppStore((state) => state.students);

    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('2');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [mode, setMode] = useState<PanelMode>('data');
    const [entries, setEntries] = useState<StudentDataEntry[]>([]);
    const [transactions, setTransactions] = useState<CookieTransaction[]>([]);
    const [balances, setBalances] = useState<CookieBalance[]>([]);
    const [rewards, setRewards] = useState<CookieReward[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [noteForm, setNoteForm] = useState({ title: '', occurredAt: today(), memo: '', includeInAi: true });
    const [gradeForm, setGradeForm] = useState({ examName: '', examDate: today(), score: '', maxScore: '', level: '', memo: '', includeInAi: true });
    const [mentorForm, setMentorForm] = useState({ mentorStudentId: '', memo: '', includeInAi: true });
    const [cookieForm, setCookieForm] = useState({ amount: '1', reason: '' });
    const [rewardForm, setRewardForm] = useState({ name: '', cost: '' });
    const [selectedRewardId, setSelectedRewardId] = useState('');

    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher, selectedSemester),
        [classes, selectedSemester, teacher]
    );

    const selectedClass = useMemo(
        () => teacherClasses.find((item) => item.id === selectedClassId),
        [selectedClassId, teacherClasses]
    );

    const classStudents = useMemo(
        () => selectedClass ? getStudentsInTeachingClass(students, selectedClass) : [],
        [selectedClass, students]
    );

    const studentsById = useMemo(
        () => new Map(students.map((student) => [student.id, student])),
        [students]
    );

    const selectedStudent = selectedStudentId ? studentsById.get(selectedStudentId) : undefined;
    const selectedBalance = balances.find((balance) => balance.studentId === selectedStudentId);
    const selectedEntries = entries.filter((entry) => entry.studentId === selectedStudentId);
    const selectedTransactions = transactions.filter((transaction) => transaction.studentId === selectedStudentId);
    const mentorEntries = entries.filter((entry) => entry.kind === 'mentor_match');
    const activeRewards = rewards.filter((reward) => reward.active);

    useEffect(() => {
        if (!teacherClasses.length) {
            setSelectedClassId('');
            return;
        }

        if (!teacherClasses.some((item) => item.id === selectedClassId)) {
            setSelectedClassId(teacherClasses[0].id);
        }
    }, [selectedClassId, teacherClasses]);

    useEffect(() => {
        if (!classStudents.length) {
            setSelectedStudentId('');
            return;
        }

        if (!classStudents.some((student) => student.id === selectedStudentId)) {
            setSelectedStudentId(classStudents[0].id);
        }
    }, [classStudents, selectedStudentId]);

    const loadData = useCallback(async () => {
        if (!teacher?.school || !teacher.teacherKey || !selectedClassId) return;

        setIsLoading(true);
        try {
            const studentDataParams = new URLSearchParams({
                school: teacher.school,
                teacherKey: teacher.teacherKey,
                classId: selectedClassId,
                semester: selectedSemester,
            });
            const cookieParams = new URLSearchParams({ school: teacher.school });

            const [studentDataResponse, cookiesResponse, rewardsResponse] = await Promise.all([
                fetch(`/api/student-data?${studentDataParams.toString()}`, { cache: 'no-store' }),
                fetch(`/api/cookies?${cookieParams.toString()}`, { cache: 'no-store' }),
                fetch(`/api/cookie-rewards?${cookieParams.toString()}`, { cache: 'no-store' }),
            ]);

            if (studentDataResponse.ok) {
                const payload = await studentDataResponse.json() as { data?: StudentDataEntry[]; entries?: StudentDataEntry[] };
                setEntries(payload.data || payload.entries || []);
            }

            if (cookiesResponse.ok) {
                const payload = await cookiesResponse.json() as {
                    data?: CookieTransaction[];
                    transactions?: CookieTransaction[];
                    balances?: CookieBalance[];
                };
                setTransactions(payload.data || payload.transactions || []);
                setBalances(payload.balances || []);
            }

            if (rewardsResponse.ok) {
                const payload = await rewardsResponse.json() as { data?: CookieReward[]; rewards?: CookieReward[] };
                setRewards(payload.data || payload.rewards || []);
            }
        } finally {
            setIsLoading(false);
        }
    }, [selectedClassId, selectedSemester, teacher?.school, teacher?.teacherKey]);

    useEffect(() => {
        void loadData();
    }, [loadData]);

    const saveEntry = async (entry: {
        id?: string;
        kind: StudentDataEntry['kind'];
        title: string;
        occurredAt: string;
        includeInAi: boolean;
        payload: StudentDataEntry['payload'];
        studentId?: string;
    }) => {
        if (!teacher?.school || !teacher.teacherKey || !selectedClassId || !selectedStudentId) return;
        setIsSaving(true);
        try {
            const response = await fetch('/api/student-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...entry,
                    school: teacher.school,
                    teacherKey: teacher.teacherKey,
                    classId: selectedClassId,
                    semester: selectedSemester,
                    studentId: entry.studentId || selectedStudentId,
                }),
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => null) as { error?: string } | null;
                alert(payload?.error || '저장에 실패했습니다.');
                return;
            }
            await loadData();
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNote = async () => {
        if (!noteForm.memo.trim()) return;
        await saveEntry({
            kind: 'note',
            title: noteForm.title.trim() || '개별 메모',
            occurredAt: noteForm.occurredAt,
            includeInAi: noteForm.includeInAi,
            payload: { memo: noteForm.memo.trim() },
        });
        setNoteForm({ title: '', occurredAt: today(), memo: '', includeInAi: true });
    };

    const handleSaveGrade = async () => {
        if (!gradeForm.examName.trim()) return;
        await saveEntry({
            kind: 'grade',
            title: gradeForm.examName.trim(),
            occurredAt: gradeForm.examDate,
            includeInAi: gradeForm.includeInAi,
            payload: {
                examName: gradeForm.examName.trim(),
                examDate: gradeForm.examDate,
                score: gradeForm.score,
                maxScore: gradeForm.maxScore,
                level: gradeForm.level,
                memo: gradeForm.memo,
            },
        });
        setGradeForm({ examName: '', examDate: today(), score: '', maxScore: '', level: '', memo: '', includeInAi: true });
    };

    const handleSaveMentor = async () => {
        if (!mentorForm.mentorStudentId || !selectedStudent) return;
        const mentor = studentsById.get(mentorForm.mentorStudentId);
        await saveEntry({
            kind: 'mentor_match',
            title: `${mentor?.name || '멘토'} → ${selectedStudent.name}`,
            occurredAt: today(),
            includeInAi: mentorForm.includeInAi,
            payload: {
                mentorStudentId: mentorForm.mentorStudentId,
                menteeStudentId: selectedStudent.id,
                memo: mentorForm.memo,
            },
        });
        setMentorForm({ mentorStudentId: '', memo: '', includeInAi: true });
    };

    const updateEntryInclude = async (entry: StudentDataEntry, includeInAi: boolean) => {
        await saveEntry({
            id: entry.id,
            kind: entry.kind,
            title: entry.title,
            occurredAt: entry.occurredAt,
            includeInAi,
            payload: entry.payload,
            studentId: entry.studentId,
        });
    };

    const deleteEntry = async (entryId: string) => {
        if (!confirm('이 데이터를 삭제할까요?')) return;
        const response = await fetch(`/api/student-data?id=${encodeURIComponent(entryId)}`, { method: 'DELETE' });
        if (response.ok) await loadData();
    };

    const postCookie = async (type: 'award' | 'redeem') => {
        if (!teacher?.school || !teacher.teacherKey || !selectedStudentId) return;
        const reward = rewards.find((item) => item.id === selectedRewardId);
        const amount = type === 'redeem' ? reward?.cost || 0 : Number(cookieForm.amount);
        const reason = type === 'redeem' ? reward?.name || '상품 교환' : cookieForm.reason.trim() || '수업 참여';

        const response = await fetch('/api/cookies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                school: teacher.school,
                teacherKey: teacher.teacherKey,
                studentId: selectedStudentId,
                type,
                amount,
                reason,
                rewardId: type === 'redeem' ? selectedRewardId : undefined,
            }),
        });
        const payload = await response.json().catch(() => null) as { error?: string } | null;
        if (!response.ok) {
            alert(payload?.error || '쿠키 처리에 실패했습니다.');
            return;
        }
        setCookieForm({ amount: '1', reason: '' });
        setSelectedRewardId('');
        await loadData();
    };

    const saveReward = async () => {
        if (!teacher?.school || !rewardForm.name.trim()) return;
        const response = await fetch('/api/cookie-rewards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                school: teacher.school,
                name: rewardForm.name.trim(),
                cost: Number(rewardForm.cost),
                active: true,
            }),
        });
        if (response.ok) {
            setRewardForm({ name: '', cost: '' });
            await loadData();
        }
    };

    const toggleReward = async (reward: CookieReward) => {
        await fetch('/api/cookie-rewards', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reward, active: !reward.active }),
        });
        await loadData();
    };

    if (!teacher) {
        return (
            <div className={styles.page}>
                <div className={styles.emptyState}>
                    <Users size={42} />
                    <p>로그인 후 학생 데이터를 관리할 수 있습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.titleBlock}>
                    <h1 className={styles.title}>학생 데이터</h1>
                    <p className={styles.subtitle}>성적과 멘토링은 교사별로, 쿠키와 상품은 학교 공용으로 관리합니다.</p>
                </div>
                <div className={styles.semesterToggle}>
                    <button className={`${styles.semesterBtn} ${selectedSemester === '1' ? styles.semesterBtnActive : ''}`} onClick={() => setSelectedSemester('1')}>1학기</button>
                    <button className={`${styles.semesterBtn} ${selectedSemester === '2' ? styles.semesterBtnActive : ''}`} onClick={() => setSelectedSemester('2')}>2학기</button>
                </div>
            </header>

            <div className={styles.classBar}>
                {teacherClasses.map((cls) => (
                    <button
                        key={cls.id}
                        className={`${styles.classChip} ${selectedClassId === cls.id ? styles.classChipActive : ''}`}
                        onClick={() => setSelectedClassId(cls.id)}
                    >
                        {cls.grade}학년 {cls.classNumber}반
                        <span className={styles.classCount}>{cls.studentCount}</span>
                    </button>
                ))}
            </div>

            {teacherClasses.length === 0 ? (
                <div className={styles.emptyState}>
                    <Database size={42} />
                    <p>먼저 학생 관리에서 담당 학급을 연결하세요.</p>
                </div>
            ) : (
                <div className={styles.workspace}>
                    <aside className={styles.studentPanel}>
                        <div className={styles.panelHeader}>
                            <h2><Users size={18} /> 학생</h2>
                            <button className={styles.secondaryButton} onClick={() => void loadData()} disabled={isLoading}>
                                <RefreshCw size={15} /> 새로고침
                            </button>
                        </div>
                        <div className={styles.studentList}>
                            {classStudents.map((student) => {
                                const balance = balances.find((item) => item.studentId === student.id)?.balance || 0;
                                const count = entries.filter((entry) => entry.studentId === student.id).length;
                                return (
                                    <button
                                        key={student.id}
                                        className={`${styles.studentButton} ${selectedStudentId === student.id ? styles.studentButtonActive : ''}`}
                                        onClick={() => setSelectedStudentId(student.id)}
                                    >
                                        <span className={styles.studentNo}>{student.number}</span>
                                        <span>
                                            <span className={styles.studentName}>{student.name}</span>
                                            <span className={styles.studentMeta}>입력 {count}건</span>
                                        </span>
                                        <span className={styles.cookiePill}><Cookie size={13} /> {balance}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <main className={styles.detailPanel}>
                        {selectedStudent ? (
                            <>
                                <div className={styles.studentHero}>
                                    <div>
                                        <h2 className={styles.heroName}>{selectedStudent.name}</h2>
                                        <p className={styles.heroMeta}>{selectedClass?.grade}학년 {selectedClass?.classNumber}반 {selectedStudent.number}번 · {teacher.subject}</p>
                                    </div>
                                    <div className={styles.heroStats}>
                                        <span className={styles.statBadge}><BookOpenCheck size={15} /> AI 반영 {selectedEntries.filter((entry) => entry.includeInAi).length}건</span>
                                        <span className={styles.statBadge}><Cookie size={15} /> 쿠키 {selectedBalance?.balance || 0}개</span>
                                    </div>
                                </div>

                                <div className={styles.modeTabs}>
                                    <button className={`${styles.modeTab} ${mode === 'data' ? styles.modeTabActive : ''}`} onClick={() => setMode('data')}><Database size={15} /> 개별 데이터</button>
                                    <button className={`${styles.modeTab} ${mode === 'mentor' ? styles.modeTabActive : ''}`} onClick={() => setMode('mentor')}><Link2 size={15} /> 멘토·멘티</button>
                                    <button className={`${styles.modeTab} ${mode === 'cookie' ? styles.modeTabActive : ''}`} onClick={() => setMode('cookie')}><Cookie size={15} /> 쿠키·상품</button>
                                </div>

                                <div className={styles.detailBody}>
                                    {mode === 'data' && (
                                        <div className={styles.twoColumn}>
                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><Plus size={17} /> 개별 메모</h3></div>
                                                <div className={styles.formGrid}>
                                                    <div className={styles.field}>
                                                        <label>제목</label>
                                                        <input className={styles.input} value={noteForm.title} onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })} placeholder="프로젝트 참여, 발표 태도 등" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>날짜</label>
                                                        <input className={styles.input} type="date" value={noteForm.occurredAt} onChange={(e) => setNoteForm({ ...noteForm, occurredAt: e.target.value })} />
                                                    </div>
                                                    <div className={`${styles.field} ${styles.full}`}>
                                                        <label>메모</label>
                                                        <textarea className={styles.textarea} value={noteForm.memo} onChange={(e) => setNoteForm({ ...noteForm, memo: e.target.value })} placeholder="세특 생성 시 참고할 구체적 행동을 기록하세요." />
                                                    </div>
                                                    <label className={`${styles.checkRow} ${styles.full}`}>
                                                        <input type="checkbox" checked={noteForm.includeInAi} onChange={(e) => setNoteForm({ ...noteForm, includeInAi: e.target.checked })} />
                                                        AI 세특 생성에 반영
                                                    </label>
                                                    <button className={`${styles.primaryButton} ${styles.full}`} onClick={handleSaveNote} disabled={isSaving || !noteForm.memo.trim()}><Save size={15} /> 메모 저장</button>
                                                </div>
                                            </section>

                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><Medal size={17} /> 성적 기록</h3></div>
                                                <div className={styles.formGrid}>
                                                    <div className={styles.field}>
                                                        <label>시험명</label>
                                                        <input className={styles.input} value={gradeForm.examName} onChange={(e) => setGradeForm({ ...gradeForm, examName: e.target.value })} placeholder="중간고사, 수행평가 등" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>날짜</label>
                                                        <input className={styles.input} type="date" value={gradeForm.examDate} onChange={(e) => setGradeForm({ ...gradeForm, examDate: e.target.value })} />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>점수</label>
                                                        <input className={styles.input} value={gradeForm.score} onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })} placeholder="85" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>만점/수준</label>
                                                        <input className={styles.input} value={gradeForm.maxScore} onChange={(e) => setGradeForm({ ...gradeForm, maxScore: e.target.value })} placeholder="100" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>성취수준</label>
                                                        <input className={styles.input} value={gradeForm.level} onChange={(e) => setGradeForm({ ...gradeForm, level: e.target.value })} placeholder="A, 상, 3수준 등" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>메모</label>
                                                        <input className={styles.input} value={gradeForm.memo} onChange={(e) => setGradeForm({ ...gradeForm, memo: e.target.value })} placeholder="서술형 강점 등" />
                                                    </div>
                                                    <label className={`${styles.checkRow} ${styles.full}`}>
                                                        <input type="checkbox" checked={gradeForm.includeInAi} onChange={(e) => setGradeForm({ ...gradeForm, includeInAi: e.target.checked })} />
                                                        AI 세특 생성에 반영
                                                    </label>
                                                    <button className={`${styles.primaryButton} ${styles.full}`} onClick={handleSaveGrade} disabled={isSaving || !gradeForm.examName.trim()}><Save size={15} /> 성적 저장</button>
                                                </div>
                                            </section>

                                            <section className={`${styles.section} ${styles.full}`}>
                                                <div className={styles.sectionHeader}><h3><BookOpenCheck size={17} /> 저장된 데이터</h3><span className={styles.muted}>{selectedEntries.length}건</span></div>
                                                <EntryList entries={selectedEntries.filter((entry) => entry.kind !== 'mentor_match')} onToggleAi={updateEntryInclude} onDelete={deleteEntry} />
                                            </section>
                                        </div>
                                    )}

                                    {mode === 'mentor' && (
                                        <div className={styles.twoColumn}>
                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><Link2 size={17} /> 멘토 매칭</h3></div>
                                                <div className={styles.formGrid}>
                                                    <div className={`${styles.field} ${styles.full}`}>
                                                        <label>{selectedStudent.name}의 멘토</label>
                                                        <select className={styles.select} value={mentorForm.mentorStudentId} onChange={(e) => setMentorForm({ ...mentorForm, mentorStudentId: e.target.value })}>
                                                            <option value="">멘토 학생 선택</option>
                                                            {classStudents.filter((student) => student.id !== selectedStudent.id).map((student) => (
                                                                <option key={student.id} value={student.id}>{student.number}번 {student.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className={`${styles.field} ${styles.full}`}>
                                                        <label>메모</label>
                                                        <textarea className={styles.textarea} value={mentorForm.memo} onChange={(e) => setMentorForm({ ...mentorForm, memo: e.target.value })} placeholder="도움 주는 방식, 협력 내용 등" />
                                                    </div>
                                                    <label className={`${styles.checkRow} ${styles.full}`}>
                                                        <input type="checkbox" checked={mentorForm.includeInAi} onChange={(e) => setMentorForm({ ...mentorForm, includeInAi: e.target.checked })} />
                                                        AI 세특 생성에 반영
                                                    </label>
                                                    <button className={`${styles.primaryButton} ${styles.full}`} onClick={handleSaveMentor} disabled={!mentorForm.mentorStudentId}><Save size={15} /> 매칭 저장</button>
                                                </div>
                                            </section>
                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><Users size={17} /> 우리 학급 매칭</h3><span className={styles.muted}>{mentorEntries.length}건</span></div>
                                                <EntryList entries={mentorEntries} studentsById={studentsById} onToggleAi={updateEntryInclude} onDelete={deleteEntry} />
                                            </section>
                                        </div>
                                    )}

                                    {mode === 'cookie' && (
                                        <div className={styles.twoColumn}>
                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><HandCoins size={17} /> 쿠키 지급·교환</h3></div>
                                                <div className={styles.detailBody}>
                                                    <div className={styles.cookieSummary}>
                                                        <div className={styles.summaryBox}><span className={styles.summaryLabel}>잔액</span><span className={styles.summaryValue}>{selectedBalance?.balance || 0}</span></div>
                                                        <div className={styles.summaryBox}><span className={styles.summaryLabel}>지급</span><span className={styles.summaryValue}>{selectedBalance?.awarded || 0}</span></div>
                                                        <div className={styles.summaryBox}><span className={styles.summaryLabel}>교환</span><span className={styles.summaryValue}>{selectedBalance?.redeemed || 0}</span></div>
                                                    </div>
                                                    <div className={styles.formGrid}>
                                                        <div className={styles.field}>
                                                            <label>지급 수량</label>
                                                            <input className={styles.input} value={cookieForm.amount} onChange={(e) => setCookieForm({ ...cookieForm, amount: e.target.value })} />
                                                        </div>
                                                        <div className={styles.field}>
                                                            <label>사유</label>
                                                            <input className={styles.input} value={cookieForm.reason} onChange={(e) => setCookieForm({ ...cookieForm, reason: e.target.value })} placeholder="토론 참여, 멘토링 등" />
                                                        </div>
                                                        <button className={`${styles.primaryButton} ${styles.full}`} onClick={() => void postCookie('award')}><Cookie size={15} /> 쿠키 지급</button>
                                                        <div className={`${styles.field} ${styles.full}`}>
                                                            <label>상품 교환</label>
                                                            <select className={styles.select} value={selectedRewardId} onChange={(e) => setSelectedRewardId(e.target.value)}>
                                                                <option value="">상품 선택</option>
                                                                {activeRewards.map((reward) => <option key={reward.id} value={reward.id}>{reward.name} · {reward.cost}개</option>)}
                                                            </select>
                                                        </div>
                                                        <button className={`${styles.secondaryButton} ${styles.full}`} disabled={!selectedRewardId} onClick={() => void postCookie('redeem')}><Gift size={15} /> 선택 상품 교환</button>
                                                    </div>
                                                </div>
                                            </section>

                                            <section className={styles.section}>
                                                <div className={styles.sectionHeader}><h3><Gift size={17} /> 학교 공용 상품</h3></div>
                                                <div className={styles.formGrid}>
                                                    <div className={styles.field}>
                                                        <label>상품명</label>
                                                        <input className={styles.input} value={rewardForm.name} onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })} placeholder="간식 교환권" />
                                                    </div>
                                                    <div className={styles.field}>
                                                        <label>쿠키 가격</label>
                                                        <input className={styles.input} value={rewardForm.cost} onChange={(e) => setRewardForm({ ...rewardForm, cost: e.target.value })} placeholder="10" />
                                                    </div>
                                                    <button className={`${styles.primaryButton} ${styles.full}`} onClick={saveReward} disabled={!rewardForm.name.trim() || !rewardForm.cost}><Plus size={15} /> 상품 추가</button>
                                                </div>
                                                <div className={styles.rewardGrid}>
                                                    {rewards.map((reward) => (
                                                        <div key={reward.id} className={`${styles.rewardCard} ${!reward.active ? styles.rewardCardInactive : ''}`}>
                                                            <span className={styles.rewardName}>{reward.name}</span>
                                                            <span className={styles.rewardCost}>{reward.cost} 쿠키</span>
                                                            <button className={styles.secondaryButton} onClick={() => void toggleReward(reward)}>{reward.active ? '비활성화' : '활성화'}</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section className={`${styles.section} ${styles.full}`}>
                                                <div className={styles.sectionHeader}><h3><CalendarDays size={17} /> 쿠키 내역</h3><span className={styles.muted}>{selectedTransactions.length}건</span></div>
                                                <div className={styles.entryList}>
                                                    {selectedTransactions.length === 0 ? <div className={styles.emptyState}>아직 쿠키 내역이 없습니다.</div> : selectedTransactions.map((transaction) => (
                                                        <div key={transaction.id} className={styles.entryCard}>
                                                            <div className={styles.entryTop}>
                                                                <div>
                                                                    <p className={styles.entryTitle}>{transaction.type === 'award' ? '지급' : transaction.type === 'redeem' ? '상품 교환' : '조정'} · {transaction.amount}개</p>
                                                                    <p className={styles.entrySub}>{transaction.createdAt.slice(0, 10)} · {transaction.reason}</p>
                                                                </div>
                                                                <span className={styles.cookiePill}><Cookie size={13} /> {transaction.type === 'redeem' ? '-' : '+'}{transaction.amount}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className={styles.emptyState}>
                                <Users size={42} />
                                <p>학생을 선택하세요.</p>
                            </div>
                        )}
                    </main>
                </div>
            )}
        </div>
    );
}

function EntryList({
    entries,
    studentsById,
    onToggleAi,
    onDelete,
}: {
    entries: StudentDataEntry[];
    studentsById?: Map<string, { name: string; number: number }>;
    onToggleAi: (entry: StudentDataEntry, includeInAi: boolean) => void;
    onDelete: (entryId: string) => void;
}) {
    if (entries.length === 0) {
        return <div className={styles.emptyState}>저장된 데이터가 없습니다.</div>;
    }

    return (
        <div className={styles.entryList}>
            {entries.map((entry) => {
                const mentor = entry.payload.mentorStudentId ? studentsById?.get(String(entry.payload.mentorStudentId)) : undefined;
                const mentee = entry.payload.menteeStudentId ? studentsById?.get(String(entry.payload.menteeStudentId)) : undefined;
                const memo = typeof entry.payload.memo === 'string' ? entry.payload.memo : '';
                return (
                    <div key={entry.id} className={styles.entryCard}>
                        <div className={styles.entryTop}>
                            <div>
                                <p className={styles.entryTitle}>
                                    {entry.kind === 'mentor_match' && mentor && mentee
                                        ? `${mentor.number}번 ${mentor.name} → ${mentee.number}번 ${mentee.name}`
                                        : entry.title}
                                </p>
                                <p className={styles.entrySub}>{entry.occurredAt} · {entry.kind === 'grade' ? '성적' : entry.kind === 'mentor_match' ? '멘토링' : '메모'}</p>
                            </div>
                            <div className={styles.entryActions}>
                                <span className={styles.kindBadge}>{entry.kind}</span>
                                {entry.includeInAi && <span className={styles.aiBadge}>AI 반영</span>}
                            </div>
                        </div>
                        {entry.kind === 'grade' && (
                            <p className={styles.entryMemo}>
                                {String(entry.payload.examName || entry.title)} · {String(entry.payload.score || '-')}/{String(entry.payload.maxScore || '-')} · {String(entry.payload.level || '')}
                            </p>
                        )}
                        {memo && <p className={styles.entryMemo}>{memo}</p>}
                        <div className={styles.entryActions}>
                            <button className={styles.secondaryButton} onClick={() => onToggleAi(entry, !entry.includeInAi)}>
                                {entry.includeInAi ? 'AI 반영 끄기' : 'AI 반영 켜기'}
                            </button>
                            <button className={styles.dangerButton} onClick={() => onDelete(entry.id)}><Trash2 size={14} /> 삭제</button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
