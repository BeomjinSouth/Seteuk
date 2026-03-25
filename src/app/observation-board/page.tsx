'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Trash2,
    ClipboardList,
    FileText,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Observation, Student } from '@/types';
import {
    getLearningDataForClass,
    getTeacherClasses,
    getStudentsInTeachingClass,
} from '@/lib/teacher-context';
import styles from '../students/page.module.css';

export default function ObservationBoardPage() {
    const router = useRouter();
    const {
        classes,
        students,
        records,
        removeStudent,
        teacher,
    } = useAppStore();
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [observations, setObservations] = useState<Observation[]>([]);
    const selectedStudentIdsRef = useRef<Set<string>>(new Set());
    const clickTimerRef = useRef<{
        studentId: string;
        timerId: ReturnType<typeof setTimeout>;
    } | null>(null);

    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher),
        [classes, teacher]
    );

    useEffect(() => {
        const loadObservations = async () => {
            try {
                const response = await fetch('/api/observations');
                const data = await response.json();
                if (data.success) {
                    setObservations(data.data);
                }
            } catch (error) {
                console.error('Failed to load observations:', error);
            }
        };

        loadObservations();
    }, []);

    useEffect(() => {
        return () => {
            if (clickTimerRef.current) {
                clearTimeout(clickTimerRef.current.timerId);
            }
        };
    }, []);

    const updateSelectedStudentIds = (updater: (prev: Set<string>) => Set<string>) => {
        const next = updater(selectedStudentIdsRef.current);
        selectedStudentIdsRef.current = next;
        setSelectedStudentIds(next);
        return next;
    };

    const filteredStudents = useMemo(() => {
        if (!teacher) return [];

        const visibleStudents = selectedClass === 'all'
            ? teacherClasses.reduce<Student[]>((acc, cls) => {
                getStudentsInTeachingClass(students, cls).forEach((student) => {
                    if (!acc.some((item) => item.id === student.id)) {
                        acc.push(student);
                    }
                });
                return acc;
            }, [])
            : (() => {
                const matchedClass = teacherClasses.find((cls) => cls.id === selectedClass);
                return matchedClass ? getStudentsInTeachingClass(students, matchedClass) : [];
            })();

        return visibleStudents.filter((student) =>
            student.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, selectedClass, students, teacher, teacherClasses]);

    const scopedObservations = useMemo(
        () => observations.filter((observation) =>
            !teacher?.teacherKey
            || !observation.teacherKey
            || observation.teacherKey === teacher.teacherKey
        ),
        [observations, teacher]
    );

    const getDataCount = (student: Student) => {
        if (selectedClass !== 'all') {
            return Object.keys(getLearningDataForClass(student, selectedClass)).length;
        }

        const relatedClassIds = teacherClasses
            .filter((cls) =>
                cls.school === student.school
                && cls.grade === student.grade
                && cls.classNumber === student.classNumber
            )
            .map((cls) => cls.id);

        return relatedClassIds.reduce((count, classId) => {
            return count + Object.keys(getLearningDataForClass(student, classId)).length;
        }, 0);
    };

    const getTeachingClassForStudent = (student: Student) => {
        const matchingClasses = teacherClasses.filter((cls) =>
            cls.school === student.school
            && cls.grade === student.grade
            && cls.classNumber === student.classNumber
        );

        if (selectedClass !== 'all') {
            return matchingClasses.find((cls) => cls.id === selectedClass) ?? matchingClasses[0];
        }

        return matchingClasses[0];
    };

    const getObservationCount = (student: Student, classId?: string) => {
        return scopedObservations.filter((observation) =>
            observation.studentId === student.id
            && (!classId || observation.classId === classId)
        ).length;
    };

    const getRecordForStudent = (student: Student, classId?: string) => {
        return records.find((record) =>
            record.studentId === student.id
            && (!classId || record.classId === classId)
            && (!teacher?.teacherKey || !record.teacherKey || record.teacherKey === teacher.teacherKey)
        );
    };

    const getStudentProgress = (student: Student, classId?: string) => {
        const dataReady = getDataCount(student) > 0 ? 1 : 0;
        const observationReady = getObservationCount(student, classId) > 0 ? 1 : 0;
        const record = getRecordForStudent(student, classId);
        const recordReady = record ? (record.status === 'confirmed' ? 2 : 1) : 0;
        return Math.round(((dataReady + observationReady + recordReady) / 4) * 100);
    };

    const getRecordStatusLabel = (student: Student, classId?: string) => {
        const record = getRecordForStudent(student, classId);
        if (!record) return '초안 전';
        if (record.status === 'confirmed') return '확정 완료';
        if (record.status === 'checked') return '검토 완료';
        return '초안 작성';
    };

    const handleDeleteStudent = (student: Student) => {
        if (confirm(`"${student.name}" 학생을 삭제하시겠습니까?\n삭제하면 복원할 수 없습니다.`)) {
            removeStudent(student.id);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        updateSelectedStudentIds((prev) => {
            const next = new Set(prev);
            if (next.has(studentId)) next.delete(studentId);
            else next.add(studentId);
            return next;
        });
    };

    const toggleSelectAllStudents = () => {
        if (selectedStudentIds.size === filteredStudents.length) {
            const emptySelection = new Set<string>();
            selectedStudentIdsRef.current = emptySelection;
            setSelectedStudentIds(emptySelection);
            return;
        }

        const nextSelection = new Set(filteredStudents.map((student) => student.id));
        selectedStudentIdsRef.current = nextSelection;
        setSelectedStudentIds(nextSelection);
    };

    const handleDeleteSelectedStudents = () => {
        if (selectedStudentIds.size === 0) return;
        if (!confirm(`선택한 ${selectedStudentIds.size}명의 학생을 삭제하시겠습니까?`)) return;
        Array.from(selectedStudentIds).forEach((studentId) => removeStudent(studentId));

        const emptySelection = new Set<string>();
        selectedStudentIdsRef.current = emptySelection;
        setSelectedStudentIds(emptySelection);
    };

    const openObservationComposer = (student: Student) => {
        const teachingClass = getTeachingClassForStudent(student);
        if (!teachingClass) return;

        const query = new URLSearchParams({
            classId: teachingClass.id,
        });

        const currentSelectedStudentIds = selectedStudentIdsRef.current;
        const selectedStudentsInSameClass = currentSelectedStudentIds.has(student.id)
            ? Array.from(currentSelectedStudentIds).filter((studentId) => {
                const selectedStudent = students.find((item) => item.id === studentId);
                return selectedStudent
                    ? getTeachingClassForStudent(selectedStudent)?.id === teachingClass.id
                    : false;
            })
            : [];

        if (selectedStudentsInSameClass.length > 1) {
            query.set('studentIds', selectedStudentsInSameClass.join(','));
        } else {
            query.set('studentId', student.id);
        }

        router.push(`/observations?${query.toString()}#compose`);
    };

    const flushPendingStudentSelection = (skipStudentId?: string) => {
        const pendingClick = clickTimerRef.current;
        if (!pendingClick) return;

        clearTimeout(pendingClick.timerId);
        clickTimerRef.current = null;

        if (pendingClick.studentId !== skipStudentId) {
            toggleStudentSelection(pendingClick.studentId);
        }
    };

    const handleStudentCardClick = (studentId: string) => {
        if (clickTimerRef.current?.studentId && clickTimerRef.current.studentId !== studentId) {
            flushPendingStudentSelection();
        }

        if (clickTimerRef.current) {
            clearTimeout(clickTimerRef.current.timerId);
        }

        const timerId = setTimeout(() => {
            toggleStudentSelection(studentId);
            if (clickTimerRef.current?.studentId === studentId) {
                clickTimerRef.current = null;
            }
        }, 180);

        clickTimerRef.current = {
            studentId,
            timerId,
        };
    };

    const handleStudentCardDoubleClick = (student: Student) => {
        flushPendingStudentSelection(student.id);
        openObservationComposer(student);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>학생 카드 보드</h1>
                    <p className={styles.subtitle}>
                        카드를 클릭하면 학생이 선택되고, 더블클릭하면 관찰 기록 작성으로 바로 이동합니다.
                    </p>
                </div>
            </header>

            <section className={styles.listSection}>
                <div className={styles.listHeader}>
                    <h2><Users size={20} /> 담당 학급 학생 ({filteredStudents.length}명)</h2>
                    <div className={styles.filters}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="이름 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>
                </div>

                {teacherClasses.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>아직 연결된 담당 수업 학급이 없습니다.</p>
                        <p className={styles.hint}>학생 관리에서 학급을 연결하면 여기서 학생 카드가 열립니다.</p>
                        <Link href="/students" className={styles.summaryLink}>
                            학생 관리로 이동
                        </Link>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>조건에 맞는 학생이 없습니다.</p>
                        <p className={styles.hint}>학급 선택이나 검색어를 확인하세요.</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.boardTabs}>
                            <button
                                type="button"
                                className={`${styles.boardTab} ${selectedClass === 'all' ? styles.boardTabActive : ''}`}
                                onClick={() => setSelectedClass('all')}
                            >
                                전체
                                <span>{filteredStudents.length}</span>
                            </button>
                            {teacherClasses.map((cls) => {
                                const classStudents = getStudentsInTeachingClass(students, cls);
                                return (
                                    <button
                                        type="button"
                                        key={cls.id}
                                        className={`${styles.boardTab} ${selectedClass === cls.id ? styles.boardTabActive : ''}`}
                                        onClick={() => setSelectedClass(cls.id)}
                                    >
                                        {cls.grade}-{cls.classNumber}
                                        <span>{classStudents.length}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className={styles.boardSummary}>
                            <span>
                                여러 학생을 선택한 뒤 선택된 카드 중 하나를 더블클릭하면 같은 학급 학생들에 대해
                                관찰 기록을 한 번에 남길 수 있습니다. 학생 명부 업로드와 담당 학급 연결은 학생
                                관리에서 합니다.
                            </span>{' '}
                            <Link href="/students" className={styles.summaryLink}>
                                학생 관리 열기
                            </Link>
                        </div>

                        <div className={styles.boardBulkActions}>
                            <Button variant="secondary" onClick={toggleSelectAllStudents}>
                                <Users size={16} />
                                {selectedStudentIds.size === filteredStudents.length ? '전체 선택 해제' : '전체 선택'}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={handleDeleteSelectedStudents}
                                disabled={selectedStudentIds.size === 0}
                            >
                                <Trash2 size={16} />
                                선택 삭제
                            </Button>
                        </div>

                        <div className={styles.studentBoardGrid}>
                            {filteredStudents.map((student, index) => {
                                const dataCount = getDataCount(student);
                                const teachingClass = getTeachingClassForStudent(student);
                                const observationCount = getObservationCount(student, teachingClass?.id);
                                const progress = getStudentProgress(student, teachingClass?.id);
                                const recordStatus = getRecordStatusLabel(student, teachingClass?.id);
                                return (
                                    <motion.div
                                        key={student.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className={`${styles.studentCard} ${selectedStudentIds.has(student.id) ? styles.studentCardSelected : ''}`}
                                        role="button"
                                        tabIndex={0}
                                        aria-pressed={selectedStudentIds.has(student.id)}
                                        title="클릭하면 선택, 더블클릭하면 관찰 기록 작성"
                                        onClick={() => handleStudentCardClick(student.id)}
                                        onDoubleClick={() => handleStudentCardDoubleClick(student)}
                                        onKeyDown={(event) => {
                                            if (event.key === ' ') {
                                                event.preventDefault();
                                                toggleStudentSelection(student.id);
                                            }
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                openObservationComposer(student);
                                            }
                                        }}
                                    >
                                        <div className={styles.studentCardTop}>
                                            <input
                                                type="checkbox"
                                                className={styles.cardCheckbox}
                                                checked={selectedStudentIds.has(student.id)}
                                                onClick={(event) => event.stopPropagation()}
                                                onDoubleClick={(event) => event.stopPropagation()}
                                                onChange={() => toggleStudentSelection(student.id)}
                                            />
                                            <div className={styles.studentBadge}>
                                                {student.grade}학년 {student.classNumber}반
                                            </div>
                                        </div>

                                        <div className={styles.studentAvatar}>
                                            {student.name.slice(0, 1)}
                                        </div>
                                        <div className={styles.studentCardName}>{student.name}</div>
                                        <div className={styles.studentCardMeta}>
                                            {student.number}번 · {teachingClass?.subjectName || teacher?.subject}
                                        </div>

                                        <div className={styles.cardMetricRow}>
                                            <span><Sparkles size={14} /> AI 입력 {dataCount}</span>
                                            <span><ClipboardList size={14} /> 메모 {observationCount}</span>
                                        </div>
                                        <div className={styles.cardMetricRow}>
                                            <span><FileText size={14} /> {recordStatus}</span>
                                            <span>{progress}% 진행</span>
                                        </div>

                                        <div className={styles.cardProgressTrack}>
                                            <div
                                                className={styles.cardProgressFill}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        <button
                                            className={styles.cardDeleteButton}
                                            title="삭제"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteStudent(student);
                                            }}
                                        >
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
