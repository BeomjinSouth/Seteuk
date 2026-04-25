'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Bell,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    Circle,
    ClipboardList,
    Eye,
    Handshake,
    Home,
    Megaphone,
    Plus,
    Save,
    Search,
    Settings,
    Sparkles,
    Star,
    Trash2,
    Triangle,
    UserRound,
    Users,
    X,
} from 'lucide-react';
import { SharedRosterSync } from '@/components/providers/SharedRosterSync';
import { useAppStore } from '@/lib/store';
import { isAuthorizedSeonghoTeacher } from '@/lib/seongho-auth';
import { getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import { ClassGroup, Observation, Student } from '@/types';
import styles from './page.module.css';

type MarkState = 'none' | 'participated' | 'excellent';
type BoardMode = 'mentor' | 'records';

interface ObservationDraftRow {
    lessonTopic: string;
    tags: string[];
    memo: string;
}

interface ObservationCardStats {
    count: number;
    latest?: Observation;
}

const sessions = [
    { id: 'session-1', label: '1차시', date: '5/2 (금)', topic: '서로 알아가기' },
    { id: 'session-2', label: '2차시', date: '5/9 (금)', topic: '협동 게임' },
    { id: 'session-3', label: '3차시', date: '5/16 (금)', topic: '책 함께 읽기' },
    { id: 'session-4', label: '4차시', date: '5/23 (금)', topic: '미션 활동' },
    { id: 'session-5', label: '5차시', date: '5/30 (금)', topic: '마무리 나누기' },
];

const fallbackStudents: Student[] = [
    { id: 'sample-1', classId: 'sample', number: 1, name: '김민지', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-2', classId: 'sample', number: 2, name: '이도윤', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-3', classId: 'sample', number: 3, name: '박서준', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-4', classId: 'sample', number: 4, name: '최하은', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-5', classId: 'sample', number: 5, name: '정우진', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-6', classId: 'sample', number: 6, name: '한서아', grade: 1, classNumber: 1, learningData: {} },
];

const observationTagOptions = [
    '참여',
    '발표',
    '협력',
    '성장',
    '질문',
    '탐구',
    '자기주도',
    '배려',
    '문제해결',
    '의사소통',
];

const today = () => new Date().toISOString().split('T')[0];

function createEmptyDraft(): ObservationDraftRow {
    return {
        lessonTopic: '',
        tags: [],
        memo: '',
    };
}

function getInitials(name: string) {
    return name.length > 2 ? name.slice(1) : name;
}

function getDefaultMark(studentIndex: number, sessionIndex: number): MarkState {
    const pattern: MarkState[] = ['participated', 'excellent', 'participated', 'none', 'excellent'];
    return pattern[(studentIndex + sessionIndex) % pattern.length];
}

function getNextMark(mark: MarkState): MarkState {
    if (mark === 'none') return 'participated';
    if (mark === 'participated') return 'excellent';
    return 'none';
}

function getObservationTimestamp(observation?: Observation) {
    if (!observation) return 0;
    const value = observation.date || observation.createdAt;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatShortDate(value?: string) {
    if (!value) return '기록 전';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function sortStudents(a: Student, b: Student) {
    return (a.grade ?? 0) - (b.grade ?? 0)
        || (a.classNumber ?? 0) - (b.classNumber ?? 0)
        || a.number - b.number
        || a.name.localeCompare(b.name);
}

export default function ObservationBoard2Page() {
    const router = useRouter();
    const { classes, students, teacher, logout } = useAppStore();
    const [isStoreReady, setIsStoreReady] = useState(false);
    const [activeMode, setActiveMode] = useState<BoardMode>('mentor');
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [marks, setMarks] = useState<Record<string, MarkState>>({});
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [observations, setObservations] = useState<Observation[]>([]);
    const [isLoadingObservations, setIsLoadingObservations] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [commonDate, setCommonDate] = useState(today);
    const [commonLessonTopic, setCommonLessonTopic] = useState('');
    const [commonTags, setCommonTags] = useState<string[]>([]);
    const [customTagInput, setCustomTagInput] = useState('');
    const [customTagOptions, setCustomTagOptions] = useState<string[]>([]);
    const [studentDrafts, setStudentDrafts] = useState<Record<string, ObservationDraftRow>>({});
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

    useEffect(() => {
        setIsStoreReady(useAppStore.persist.hasHydrated());
        return useAppStore.persist.onFinishHydration(() => setIsStoreReady(true));
    }, []);

    useEffect(() => {
        if (!isStoreReady) return;

        if (!teacher) {
            router.replace('/');
            return;
        }

        if (!isAuthorizedSeonghoTeacher(teacher)) {
            logout();
            router.replace('/');
        }
    }, [isStoreReady, logout, router, teacher]);

    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher),
        [classes, teacher]
    );

    const teacherStudents = useMemo(() => {
        const map = new Map<string, Student>();
        teacherClasses.forEach((cls) => {
            getStudentsInTeachingClass(students, cls).forEach((student) => {
                map.set(student.id, student);
            });
        });

        return Array.from(map.values()).sort(sortStudents);
    }, [students, teacherClasses]);

    const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);

    const boardStudents = useMemo(() => {
        const classStudents = selectedClass
            ? getStudentsInTeachingClass(students, selectedClass)
            : teacherStudents;

        return classStudents.length > 0 ? classStudents : fallbackStudents;
    }, [selectedClass, students, teacherStudents]);

    const filteredStudents = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return boardStudents
            .filter((student) => !normalizedQuery || student.name.toLowerCase().includes(normalizedQuery))
            .sort(sortStudents);
    }, [boardStudents, searchQuery]);

    const featuredStudents = filteredStudents.slice(0, 6);

    const mentorGroups = useMemo(() => {
        const rows = featuredStudents.length > 0 ? featuredStudents : fallbackStudents;
        return Array.from({ length: Math.ceil(rows.length / 2) }, (_, groupIndex) => ({
            id: `group-${groupIndex + 1}`,
            title: `${groupIndex + 1}조`,
            mentor: rows[groupIndex * 2],
            mentee: rows[groupIndex * 2 + 1],
        })).filter((group) => group.mentor);
    }, [featuredStudents]);

    const selectedStudents = useMemo(
        () => filteredStudents.filter((student) => selectedStudentIds.has(student.id)),
        [filteredStudents, selectedStudentIds]
    );

    const availableTagOptions = useMemo(
        () => Array.from(new Set([...observationTagOptions, ...customTagOptions])),
        [customTagOptions]
    );

    const scopedObservations = useMemo(
        () => observations.filter((observation) =>
            (!teacher?.teacherKey || !observation.teacherKey || observation.teacherKey === teacher.teacherKey)
            && (selectedClassId === 'all' || observation.classId === selectedClassId)
        ),
        [observations, selectedClassId, teacher]
    );

    const observationStatsByStudent = useMemo(() => {
        const stats = new Map<string, ObservationCardStats>();

        scopedObservations.forEach((observation) => {
            const current = stats.get(observation.studentId) ?? { count: 0 };
            stats.set(observation.studentId, {
                count: current.count + 1,
                latest: getObservationTimestamp(current.latest) > getObservationTimestamp(observation)
                    ? current.latest
                    : observation,
            });
        });

        return stats;
    }, [scopedObservations]);

    const filteredObservations = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return scopedObservations
            .filter((observation) => {
                if (!normalizedQuery) return true;
                const student = students.find((item) => item.id === observation.studentId);
                return [
                    student?.name,
                    observation.lessonTopic,
                    observation.memo,
                    observation.tags.join(' '),
                ].filter(Boolean).join(' ').toLowerCase().includes(normalizedQuery);
            })
            .sort((a, b) => getObservationTimestamp(b) - getObservationTimestamp(a));
    }, [scopedObservations, searchQuery, students]);

    const totalExcellent = featuredStudents.reduce((sum, student, studentIndex) => (
        sum + sessions.reduce((sessionSum, session, sessionIndex) => {
            const key = `${student.id}:${session.id}`;
            const mark = marks[key] ?? getDefaultMark(studentIndex, sessionIndex);
            return sessionSum + (mark === 'excellent' ? 1 : 0);
        }, 0)
    ), 0);

    useEffect(() => {
        void loadObservations();
    }, []);

    useEffect(() => {
        setStudentDrafts((prev) => {
            const next: Record<string, ObservationDraftRow> = {};
            selectedStudentIds.forEach((studentId) => {
                next[studentId] = prev[studentId] ?? createEmptyDraft();
            });
            return next;
        });
    }, [selectedStudentIds]);

    const loadObservations = async () => {
        setIsLoadingObservations(true);
        try {
            const response = await fetch('/api/observations');
            const data = await response.json();
            if (data.success) {
                setObservations(data.data);
            }
        } catch (error) {
            console.error('Failed to load observations:', error);
        } finally {
            setIsLoadingObservations(false);
        }
    };

    const handleClassChange = (classId: string) => {
        setSelectedClassId(classId);
        setSelectedStudentIds(new Set());
    };

    const updateMark = (studentId: string, sessionId: string, fallback: MarkState) => {
        const key = `${studentId}:${sessionId}`;
        setMarks((prev) => ({
            ...prev,
            [key]: getNextMark(prev[key] ?? fallback),
        }));
    };

    const toggleStudentSelection = (studentId: string) => {
        setSelectedStudentIds((prev) => {
            const next = new Set(prev);
            if (next.has(studentId)) next.delete(studentId);
            else next.add(studentId);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (filteredStudents.length === 0) return;
        if (selectedStudentIds.size === filteredStudents.length) {
            setSelectedStudentIds(new Set());
            return;
        }

        setSelectedStudentIds(new Set(filteredStudents.map((student) => student.id)));
    };

    const getTeachingClassForStudent = (student: Student): ClassGroup | undefined => {
        if (selectedClass) return selectedClass;
        return teacherClasses.find((cls) =>
            cls.school === student.school
            && cls.grade === student.grade
            && cls.classNumber === student.classNumber
        );
    };

    const getClassDisplay = (classId?: string) => {
        const targetClass = teacherClasses.find((cls) => cls.id === classId)
            || classes.find((cls) => cls.id === classId);
        if (!targetClass) return '수업 정보 없음';
        return `${targetClass.grade}학년 ${targetClass.classNumber}반 · ${targetClass.subjectName}`;
    };

    const getStudentDisplay = (studentId: string) => {
        const student = students.find((item) => item.id === studentId)
            || fallbackStudents.find((item) => item.id === studentId);
        if (!student) return '알 수 없는 학생';
        return `${student.number}번 ${student.name}`;
    };

    const updateStudentDraft = (
        studentId: string,
        field: 'lessonTopic' | 'memo',
        value: string
    ) => {
        setStudentDrafts((prev) => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] ?? createEmptyDraft()),
                [field]: value,
            },
        }));
    };

    const toggleCommonTag = (tag: string) => {
        setCommonTags((prev) =>
            prev.includes(tag)
                ? prev.filter((item) => item !== tag)
                : [...prev, tag]
        );
    };

    const toggleStudentTag = (studentId: string, tag: string) => {
        setStudentDrafts((prev) => {
            const current = prev[studentId] ?? createEmptyDraft();
            const nextTags = current.tags.includes(tag)
                ? current.tags.filter((item) => item !== tag)
                : [...current.tags, tag];

            return {
                ...prev,
                [studentId]: {
                    ...current,
                    tags: nextTags,
                },
            };
        });
    };

    const addCustomTag = () => {
        const nextTag = customTagInput.trim();
        if (!nextTag) return;

        setCustomTagOptions((prev) => (prev.includes(nextTag) ? prev : [...prev, nextTag]));
        setCommonTags((prev) => (prev.includes(nextTag) ? prev : [...prev, nextTag]));
        setCustomTagInput('');
    };

    const handleSaveManualObservations = async () => {
        if (!teacher || selectedStudents.length === 0) {
            alert('학생을 먼저 선택하세요.');
            return;
        }

        const missingClassStudents = selectedStudents.filter((student) => !getTeachingClassForStudent(student));
        if (missingClassStudents.length > 0) {
            alert('수업 학급을 찾을 수 없는 학생이 있습니다. 담당 학급을 먼저 선택하세요.');
            return;
        }

        const missingMemoStudents = selectedStudents
            .filter((student) => !studentDrafts[student.id]?.memo?.trim())
            .map((student) => student.name);
        if (missingMemoStudents.length > 0) {
            alert(`관찰 메모가 비어 있는 학생: ${missingMemoStudents.join(', ')}`);
            return;
        }

        setIsSaving(true);
        try {
            const results = await Promise.all(selectedStudents.map(async (student) => {
                const targetClass = getTeachingClassForStudent(student);
                const draft = studentDrafts[student.id] ?? createEmptyDraft();
                const tags = Array.from(new Set([...commonTags, ...draft.tags]));
                const response = await fetch('/api/observations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: student.id,
                        classId: targetClass?.id,
                        teacherKey: teacher.teacherKey,
                        subjectName: targetClass?.subjectName,
                        lessonTopic: commonLessonTopic.trim() || draft.lessonTopic.trim() || undefined,
                        date: commonDate,
                        memo: draft.memo.trim(),
                        evidenceType: 'process',
                        tags,
                        sourceType: 'manual',
                    }),
                });
                const data = await response.json();
                return response.ok && data.success;
            }));

            const failedCount = results.filter((result) => !result).length;
            if (failedCount > 0) {
                alert(`${selectedStudents.length - failedCount}명 저장, ${failedCount}명 저장 실패`);
                await loadObservations();
                return;
            }

            setCommonLessonTopic('');
            setCommonTags([]);
            setStudentDrafts({});
            setSelectedStudentIds(new Set());
            await loadObservations();
            alert(`${results.length}명의 관찰 기록을 저장했습니다.`);
        } catch (error) {
            console.error('Failed to save observations:', error);
            alert('관찰 기록 저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteObservation = async (id: string) => {
        if (!confirm('이 관찰 기록을 삭제할까요?')) return;

        try {
            const response = await fetch(`/api/observations?id=${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok || !data.success) {
                alert(data.error || '관찰 기록 삭제에 실패했습니다.');
                return;
            }

            setObservations((prev) => prev.filter((item) => item.id !== id));
            if (selectedObservation?.id === id) {
                setSelectedObservation(null);
            }
        } catch (error) {
            console.error('Failed to delete observation:', error);
            alert('관찰 기록 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.dashboardShell}>
            {teacher && <SharedRosterSync />}
            <ClassroomSidebar activeMode={activeMode} onModeChange={setActiveMode} />

            <main className={styles.dashboardMain}>
                <header className={styles.dashboardHeader}>
                    <div className={styles.titleCluster}>
                        <span className={styles.eyebrow}>
                            <ClipboardList size={18} />
                            학생 기록 관찰 2
                        </span>
                        <h1>학생 관찰 기록</h1>
                        <p>
                            {teacher?.subject || '수업'} · {teacherClasses.length || 0}개 담당 학급 ·
                            관찰2 디자인 안에서 멘토·멘티 활동과 개별 관찰 메모를 함께 관리합니다.
                        </p>
                    </div>
                    <div className={styles.headerActions} aria-label="상단 도구">
                        <button type="button">
                            <Sparkles size={17} />
                            우정 배지
                        </button>
                        <button type="button">
                            <Bell size={17} />
                            알림
                        </button>
                        <button type="button">
                            <UserRound size={17} />
                            선생님
                        </button>
                    </div>
                </header>

                <section className={styles.modeTabs} aria-label="학생 기록 관찰 2 보기">
                    <button
                        type="button"
                        className={activeMode === 'mentor' ? styles.modeTabActive : ''}
                        onClick={() => setActiveMode('mentor')}
                    >
                        <Handshake size={18} />
                        멘토·멘티 활동
                    </button>
                    <button
                        type="button"
                        className={activeMode === 'records' ? styles.modeTabActive : ''}
                        onClick={() => setActiveMode('records')}
                    >
                        <ClipboardList size={18} />
                        관찰 기록
                    </button>
                </section>

                <section className={styles.classRail} aria-label="담당 학급 선택">
                    <button
                        type="button"
                        className={`${styles.classChip} ${selectedClassId === 'all' ? styles.classChipActive : ''}`}
                        onClick={() => handleClassChange('all')}
                    >
                        전체
                        <span>{teacherStudents.length || fallbackStudents.length}</span>
                    </button>
                    {teacherClasses.map((cls) => (
                        <button
                            key={cls.id}
                            type="button"
                            className={`${styles.classChip} ${selectedClassId === cls.id ? styles.classChipActive : ''}`}
                            onClick={() => handleClassChange(cls.id)}
                        >
                            {cls.grade}-{cls.classNumber}
                            <span>{getStudentsInTeachingClass(students, cls).length}</span>
                        </button>
                    ))}
                    <label className={styles.searchBox}>
                        <Search size={17} />
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="학생 이름, 메모 검색"
                        />
                    </label>
                </section>

                {activeMode === 'mentor' ? (
                    <MentorActivityView
                        boardStudents={boardStudents}
                        featuredStudents={featuredStudents}
                        mentorGroups={mentorGroups}
                        marks={marks}
                        selectedClass={selectedClass}
                        totalExcellent={totalExcellent}
                        onUpdateMark={updateMark}
                    />
                ) : (
                    <ObservationRecordsView
                        filteredStudents={filteredStudents}
                        selectedStudentIds={selectedStudentIds}
                        selectedStudents={selectedStudents}
                        observations={filteredObservations}
                        observationStatsByStudent={observationStatsByStudent}
                        isLoadingObservations={isLoadingObservations}
                        commonDate={commonDate}
                        commonLessonTopic={commonLessonTopic}
                        commonTags={commonTags}
                        availableTagOptions={availableTagOptions}
                        customTagInput={customTagInput}
                        studentDrafts={studentDrafts}
                        isSaving={isSaving}
                        getClassDisplay={getClassDisplay}
                        getStudentDisplay={getStudentDisplay}
                        onToggleStudent={toggleStudentSelection}
                        onToggleAll={toggleSelectAll}
                        onClearSelected={() => setSelectedStudentIds(new Set())}
                        onCommonDateChange={setCommonDate}
                        onCommonLessonTopicChange={setCommonLessonTopic}
                        onToggleCommonTag={toggleCommonTag}
                        onCustomTagInputChange={setCustomTagInput}
                        onAddCustomTag={addCustomTag}
                        onToggleStudentTag={toggleStudentTag}
                        onUpdateStudentDraft={updateStudentDraft}
                        onSave={handleSaveManualObservations}
                        onOpenDetail={setSelectedObservation}
                        onDelete={handleDeleteObservation}
                    />
                )}
            </main>

            <AnimatePresence>
                {selectedObservation && (
                    <ObservationDetailModal
                        observation={selectedObservation}
                        getClassDisplay={getClassDisplay}
                        getStudentDisplay={getStudentDisplay}
                        onClose={() => setSelectedObservation(null)}
                        onDelete={handleDeleteObservation}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ClassroomSidebar({
    activeMode,
    onModeChange,
}: {
    activeMode: BoardMode;
    onModeChange: (mode: BoardMode) => void;
}) {
    return (
        <aside className={styles.classroomSidebar}>
            <div className={styles.logoBlock}>
                <div className={styles.logoBadge}>
                    <Star size={20} />
                </div>
                <div>
                    <strong>우리반</strong>
                    <span>관찰기록</span>
                </div>
            </div>

            <nav className={styles.sidebarNav} aria-label="관찰2 사이드 메뉴">
                <Link href="/dashboard">
                    <Home size={18} />
                    홈
                </Link>
                <button
                    type="button"
                    className={activeMode === 'mentor' ? styles.sidebarNavActive : ''}
                    onClick={() => onModeChange('mentor')}
                >
                    <ClipboardList size={18} />
                    학생 관찰 기록
                </button>
                <button
                    type="button"
                    className={activeMode === 'records' ? styles.sidebarNavActive : ''}
                    onClick={() => onModeChange('records')}
                >
                    <BookOpen size={18} />
                    관찰 기록 작성
                </button>
                <Link href="/student-data">
                    <Users size={18} />
                    성장 기록
                </Link>
                <Link href="/write">
                    <BarChart3 size={18} />
                    통계 보기
                </Link>
                <Link href="/dashboard">
                    <Megaphone size={18} />
                    알림장
                </Link>
                <Link href="/settings">
                    <Settings size={18} />
                    설정
                </Link>
            </nav>

            <div className={styles.sidebarIllustration} aria-hidden="true">
                <div className={styles.sunShape} />
                <div className={styles.treeShape} />
                <div className={styles.childOne} />
                <div className={styles.childTwo} />
                <div className={styles.childThree} />
                <span>함께 자라는 교실</span>
            </div>
        </aside>
    );
}

function MentorActivityView({
    boardStudents,
    featuredStudents,
    mentorGroups,
    marks,
    selectedClass,
    totalExcellent,
    onUpdateMark,
}: {
    boardStudents: Student[];
    featuredStudents: Student[];
    mentorGroups: Array<{
        id: string;
        title: string;
        mentor: Student;
        mentee?: Student;
    }>;
    marks: Record<string, MarkState>;
    selectedClass?: ClassGroup;
    totalExcellent: number;
    onUpdateMark: (studentId: string, sessionId: string, fallback: MarkState) => void;
}) {
    return (
        <>
            <main className={styles.workspace}>
                <section className={styles.mentorPanel}>
                    <div className={styles.panelTitle}>
                        <Users size={22} />
                        <div>
                            <h2>멘토·멘티 구성</h2>
                            <p>{featuredStudents.length}명 표시</p>
                        </div>
                    </div>

                    <div className={styles.yellowNotice}>
                        <Handshake size={18} />
                        서로 도와가며 활동할 수 있도록 2명씩 짝을 구성합니다.
                    </div>

                    <div className={styles.groupStack}>
                        {mentorGroups.map((group, index) => (
                            <motion.article
                                key={group.id}
                                className={styles.groupCard}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                            >
                                <div className={styles.groupHeader}>
                                    <strong>{group.title}</strong>
                                    <Star size={17} />
                                </div>
                                <div className={styles.pairRow}>
                                    <StudentToken student={group.mentor} role="멘토" tone="blue" />
                                    <div className={styles.handshakeMark}>
                                        <Handshake size={22} />
                                    </div>
                                    <StudentToken student={group.mentee} role="멘티" tone="pink" />
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <div className={styles.rosterTray}>
                        <div className={styles.trayTitle}>
                            학생 목록
                            <span>{boardStudents.length}명</span>
                        </div>
                        <div className={styles.rosterGrid}>
                            {boardStudents.slice(0, 10).map((student) => (
                                <div key={student.id} className={styles.rosterItem}>
                                    <span>{getInitials(student.name)}</span>
                                    {student.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.recordPanel}>
                    <div className={styles.recordHeader}>
                        <div className={styles.panelTitle}>
                            <ClipboardList size={24} />
                            <div>
                                <h2>멘토·멘티 활동 기록</h2>
                                <p>{sessions.length}차시 · 매우 잘함 {totalExcellent}회</p>
                            </div>
                        </div>
                        <div className={styles.legend}>
                            <span>
                                <Triangle size={18} />
                                참여함
                            </span>
                            <span>
                                <Circle size={18} />
                                매우 잘함
                            </span>
                        </div>
                    </div>

                    <div className={styles.sessionNote}>
                        <CalendarDays size={18} />
                        <span>{selectedClass ? `${selectedClass.grade}학년 ${selectedClass.classNumber}반` : '전체 담당 학급'}</span>
                    </div>

                    <div className={styles.tableShell}>
                        <div className={styles.activityTable} role="table" aria-label="멘토·멘티 차시별 활동 기록">
                            <div className={styles.tableHeaderCell} role="columnheader">차시</div>
                            {sessions.map((session) => (
                                <div key={session.id} className={styles.sessionHeader} role="columnheader">
                                    <strong>{session.label}</strong>
                                    <span>{session.date}</span>
                                    <em>{session.topic}</em>
                                </div>
                            ))}
                            <button type="button" className={styles.addSessionButton} aria-label="차시 추가">
                                <Plus size={20} />
                            </button>

                            {mentorGroups.map((group, groupIndex) => (
                                <ActivityGroupRows
                                    key={group.id}
                                    groupTitle={group.title}
                                    groupIndex={groupIndex}
                                    students={[group.mentor, group.mentee].filter(Boolean) as Student[]}
                                    marks={marks}
                                    onUpdateMark={onUpdateMark}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <section className={styles.guideBanner}>
                <div>
                    <strong>활동 기록 안내</strong>
                    <span>
                        <Triangle size={17} />
                        참여
                    </span>
                    <span>
                        <Circle size={17} />
                        매우 잘함
                    </span>
                </div>
                <p>
                    함께 성장하는 우리, 최고예요!
                    <CheckCircle2 size={18} />
                </p>
            </section>
        </>
    );
}

function ObservationRecordsView({
    filteredStudents,
    selectedStudentIds,
    selectedStudents,
    observations,
    observationStatsByStudent,
    isLoadingObservations,
    commonDate,
    commonLessonTopic,
    commonTags,
    availableTagOptions,
    customTagInput,
    studentDrafts,
    isSaving,
    getClassDisplay,
    getStudentDisplay,
    onToggleStudent,
    onToggleAll,
    onClearSelected,
    onCommonDateChange,
    onCommonLessonTopicChange,
    onToggleCommonTag,
    onCustomTagInputChange,
    onAddCustomTag,
    onToggleStudentTag,
    onUpdateStudentDraft,
    onSave,
    onOpenDetail,
    onDelete,
}: {
    filteredStudents: Student[];
    selectedStudentIds: Set<string>;
    selectedStudents: Student[];
    observations: Observation[];
    observationStatsByStudent: Map<string, ObservationCardStats>;
    isLoadingObservations: boolean;
    commonDate: string;
    commonLessonTopic: string;
    commonTags: string[];
    availableTagOptions: string[];
    customTagInput: string;
    studentDrafts: Record<string, ObservationDraftRow>;
    isSaving: boolean;
    getClassDisplay: (classId?: string) => string;
    getStudentDisplay: (studentId: string) => string;
    onToggleStudent: (studentId: string) => void;
    onToggleAll: () => void;
    onClearSelected: () => void;
    onCommonDateChange: (date: string) => void;
    onCommonLessonTopicChange: (topic: string) => void;
    onToggleCommonTag: (tag: string) => void;
    onCustomTagInputChange: (value: string) => void;
    onAddCustomTag: () => void;
    onToggleStudentTag: (studentId: string, tag: string) => void;
    onUpdateStudentDraft: (studentId: string, field: 'lessonTopic' | 'memo', value: string) => void;
    onSave: () => void;
    onOpenDetail: (observation: Observation) => void;
    onDelete: (id: string) => void;
}) {
    const selectedAll = filteredStudents.length > 0 && selectedStudentIds.size === filteredStudents.length;

    return (
        <main className={styles.recordsWorkspace}>
            <section className={styles.recordsStudentPanel}>
                <div className={styles.panelTitle}>
                    <Users size={22} />
                    <div>
                        <h2>학생 선택</h2>
                        <p>{selectedStudentIds.size}명 선택 · {filteredStudents.length}명 표시</p>
                    </div>
                </div>

                <div className={styles.selectionActions}>
                    <button type="button" onClick={onToggleAll} disabled={filteredStudents.length === 0}>
                        <Users size={16} />
                        {selectedAll ? '전체 해제' : '전체 선택'}
                    </button>
                    <button type="button" onClick={onClearSelected} disabled={selectedStudentIds.size === 0}>
                        <X size={16} />
                        선택 해제
                    </button>
                </div>

                <div className={styles.studentRecordGrid}>
                    {filteredStudents.map((student, index) => {
                        const stats = observationStatsByStudent.get(student.id) ?? { count: 0 };
                        const isSelected = selectedStudentIds.has(student.id);
                        return (
                            <motion.button
                                key={student.id}
                                type="button"
                                className={`${styles.studentRecordCard} ${isSelected ? styles.studentRecordCardSelected : ''}`}
                                onClick={() => onToggleStudent(student.id)}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.01, 0.16) }}
                            >
                                <span className={styles.studentRecordNumber}>{student.number}</span>
                                <strong>{student.name}</strong>
                                <small>{student.grade}학년 {student.classNumber}반</small>
                                <em>{stats.count}건 · {formatShortDate(stats.latest?.date || stats.latest?.createdAt)}</em>
                            </motion.button>
                        );
                    })}
                </div>
            </section>

            <section className={styles.composePanel}>
                <div className={styles.panelTitle}>
                    <BookOpen size={22} />
                    <div>
                        <h2>관찰 기록 작성</h2>
                        <p>관찰2 분위기에 맞춘 일괄 메모 입력</p>
                    </div>
                </div>

                <div className={styles.composeTopBar}>
                    <label>
                        날짜
                        <input
                            type="date"
                            value={commonDate}
                            onChange={(event) => onCommonDateChange(event.target.value)}
                        />
                    </label>
                    <label>
                        공통 수업 주제
                        <input
                            type="text"
                            value={commonLessonTopic}
                            onChange={(event) => onCommonLessonTopicChange(event.target.value)}
                            placeholder="예: 협동 문제 해결 활동"
                        />
                    </label>
                </div>

                <div className={styles.tagBoard}>
                    {availableTagOptions.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            className={commonTags.includes(tag) ? styles.tagButtonActive : ''}
                            onClick={() => onToggleCommonTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                    <div className={styles.customTagBox}>
                        <input
                            type="text"
                            value={customTagInput}
                            onChange={(event) => onCustomTagInputChange(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    onAddCustomTag();
                                }
                            }}
                            placeholder="태그 추가"
                        />
                        <button type="button" onClick={onAddCustomTag}>
                            <Plus size={14} />
                        </button>
                    </div>
                </div>

                <div className={styles.draftList}>
                    {selectedStudents.length === 0 ? (
                        <div className={styles.emptyDraft}>
                            <ClipboardList size={36} />
                            <p>왼쪽에서 학생을 선택하면 관찰 메모 입력 칸이 열립니다.</p>
                        </div>
                    ) : (
                        selectedStudents.map((student) => {
                            const draft = studentDrafts[student.id] ?? createEmptyDraft();
                            return (
                                <article key={student.id} className={styles.draftRow}>
                                    <div className={styles.draftStudent}>
                                        <span>{getInitials(student.name)}</span>
                                        <div>
                                            <strong>{student.name}</strong>
                                            <small>{student.number}번</small>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        value={draft.lessonTopic}
                                        onChange={(event) => onUpdateStudentDraft(student.id, 'lessonTopic', event.target.value)}
                                        placeholder="개별 주제 보충"
                                    />
                                    <div className={styles.studentTagStrip}>
                                        {availableTagOptions.slice(0, 7).map((tag) => (
                                            <button
                                                key={tag}
                                                type="button"
                                                className={draft.tags.includes(tag) ? styles.tagButtonActive : ''}
                                                onClick={() => onToggleStudentTag(student.id, tag)}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={draft.memo}
                                        onChange={(event) => onUpdateStudentDraft(student.id, 'memo', event.target.value)}
                                        placeholder="질문, 수행, 협력, 발표, 변화가 보인 장면을 구체적으로 적어주세요."
                                    />
                                </article>
                            );
                        })
                    )}
                </div>

                <div className={styles.composeActions}>
                    <button
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || selectedStudents.length === 0}
                    >
                        <Save size={17} />
                        {isSaving ? '저장 중' : '관찰 기록 저장'}
                    </button>
                </div>
            </section>

            <section className={styles.observationListPanel}>
                <div className={styles.panelTitle}>
                    <ClipboardList size={22} />
                    <div>
                        <h2>최근 관찰 기록</h2>
                        <p>{observations.length}건 표시</p>
                    </div>
                </div>

                {isLoadingObservations ? (
                    <div className={styles.emptyList}>관찰 기록을 불러오는 중입니다.</div>
                ) : observations.length === 0 ? (
                    <div className={styles.emptyList}>아직 표시할 관찰 기록이 없습니다.</div>
                ) : (
                    <div className={styles.observationList}>
                        {observations.slice(0, 8).map((observation) => (
                            <article key={observation.id} className={styles.observationCard}>
                                <div>
                                    <strong>{getStudentDisplay(observation.studentId)}</strong>
                                    <span>{getClassDisplay(observation.classId)} · {formatShortDate(observation.date)}</span>
                                </div>
                                {observation.lessonTopic && <h3>{observation.lessonTopic}</h3>}
                                <p>{observation.memo.length > 150 ? `${observation.memo.slice(0, 150)}...` : observation.memo}</p>
                                <div className={styles.observationTags}>
                                    <span>{observation.sourceType === 'ocr' ? 'OCR' : '수동'}</span>
                                    {observation.tags.slice(0, 4).map((tag) => (
                                        <span key={tag}>{tag}</span>
                                    ))}
                                </div>
                                <div className={styles.observationActions}>
                                    <button type="button" onClick={() => onOpenDetail(observation)} title="상세 보기">
                                        <Eye size={16} />
                                    </button>
                                    <button type="button" onClick={() => onDelete(observation.id)} title="삭제">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function StudentToken({
    student,
    role,
    tone,
}: {
    student?: Student;
    role: string;
    tone: 'blue' | 'pink';
}) {
    if (!student) {
        return (
            <div className={`${styles.studentToken} ${styles.emptyToken}`}>
                <span className={styles.roleLabel}>{role}</span>
                <strong>대기</strong>
            </div>
        );
    }

    return (
        <div className={`${styles.studentToken} ${tone === 'blue' ? styles.tokenBlue : styles.tokenPink}`}>
            <span className={styles.avatar}>{getInitials(student.name)}</span>
            <span className={styles.roleLabel}>{role}</span>
            <strong>{student.name}</strong>
        </div>
    );
}

function ActivityGroupRows({
    groupTitle,
    groupIndex,
    students,
    marks,
    onUpdateMark,
}: {
    groupTitle: string;
    groupIndex: number;
    students: Student[];
    marks: Record<string, MarkState>;
    onUpdateMark: (studentId: string, sessionId: string, fallback: MarkState) => void;
}) {
    return (
        <>
            {students.map((student, studentIndex) => {
                const absoluteStudentIndex = groupIndex * 2 + studentIndex;
                return (
                    <div className={styles.studentRow} role="row" key={student.id}>
                        {studentIndex === 0 && (
                            <div
                                className={styles.groupLabel}
                                role="rowheader"
                                style={{ gridRow: `span ${students.length}` }}
                            >
                                {groupTitle}
                            </div>
                        )}
                        <div className={styles.studentNameCell}>
                            <span className={styles.smallAvatar}>{getInitials(student.name)}</span>
                            <div>
                                <strong>{student.name}</strong>
                                <span>{studentIndex === 0 ? '멘토' : '멘티'}</span>
                            </div>
                        </div>
                        {sessions.map((session, sessionIndex) => {
                            const fallback = getDefaultMark(absoluteStudentIndex, sessionIndex);
                            const mark = marks[`${student.id}:${session.id}`] ?? fallback;

                            return (
                                <button
                                    key={session.id}
                                    type="button"
                                    className={`${styles.markButton} ${styles[`mark-${mark}`]}`}
                                    onClick={() => onUpdateMark(student.id, session.id, fallback)}
                                    aria-label={`${student.name} ${session.label} 활동 상태 변경`}
                                >
                                    {mark === 'participated' && <Triangle size={28} />}
                                    {mark === 'excellent' && <Circle size={28} />}
                                </button>
                            );
                        })}
                        <div className={styles.rowSpacer} aria-hidden="true" />
                    </div>
                );
            })}
        </>
    );
}

function ObservationDetailModal({
    observation,
    getClassDisplay,
    getStudentDisplay,
    onClose,
    onDelete,
}: {
    observation: Observation;
    getClassDisplay: (classId?: string) => string;
    getStudentDisplay: (studentId: string) => string;
    onClose: () => void;
    onDelete: (id: string) => void;
}) {
    return (
        <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.detailModal}
                initial={{ opacity: 0, scale: 0.96, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                onClick={(event) => event.stopPropagation()}
            >
                <header>
                    <h2>
                        <ClipboardList size={20} />
                        관찰 기록 상세
                    </h2>
                    <button type="button" onClick={onClose} aria-label="닫기">
                        <X size={20} />
                    </button>
                </header>
                <dl>
                    <div>
                        <dt>학생</dt>
                        <dd>{getStudentDisplay(observation.studentId)}</dd>
                    </div>
                    <div>
                        <dt>수업</dt>
                        <dd>{getClassDisplay(observation.classId)}</dd>
                    </div>
                    <div>
                        <dt>날짜</dt>
                        <dd>{observation.date}</dd>
                    </div>
                    <div>
                        <dt>수업 주제</dt>
                        <dd>{observation.lessonTopic || '미입력'}</dd>
                    </div>
                    <div>
                        <dt>출처</dt>
                        <dd>{observation.sourceType === 'ocr' ? 'OCR 분석' : '수동 입력'}</dd>
                    </div>
                </dl>
                <div className={styles.detailTags}>
                    {observation.tags.length === 0 ? (
                        <span>태그 없음</span>
                    ) : (
                        observation.tags.map((tag) => <span key={tag}>{tag}</span>)
                    )}
                </div>
                <p className={styles.detailMemo}>{observation.memo}</p>
                <footer>
                    <button type="button" onClick={() => onDelete(observation.id)}>
                        <Trash2 size={16} />
                        삭제
                    </button>
                    <button type="button" onClick={onClose}>
                        닫기
                    </button>
                </footer>
            </motion.div>
        </motion.div>
    );
}
