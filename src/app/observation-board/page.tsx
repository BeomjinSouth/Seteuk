'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Users,
    Search,
    ClipboardList,
    PenLine,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Observation, Student } from '@/types';
import {
    getTeacherClasses,
    getStudentsInTeachingClass,
} from '@/lib/teacher-context';
import styles from './page.module.css';

interface ObservationCardStats {
    count: number;
    latest?: Observation;
    tags: string[];
}

function formatShortDate(value?: string) {
    if (!value) return '기록 전';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function getObservationTimestamp(observation: Observation) {
    const dateValue = observation.date || observation.createdAt;
    const date = new Date(dateValue);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export default function ObservationBoardPage() {
    const router = useRouter();
    const {
        classes,
        students,
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

    const allTeacherStudents = useMemo(() => {
        const visibleStudents = teacherClasses.reduce<Student[]>((acc, cls) => {
            getStudentsInTeachingClass(students, cls).forEach((student) => {
                if (!acc.some((item) => item.id === student.id)) {
                    acc.push(student);
                }
            });
            return acc;
        }, []);

        return visibleStudents.sort((a, b) =>
            (a.grade ?? 0) - (b.grade ?? 0)
            || (a.classNumber ?? 0) - (b.classNumber ?? 0)
            || a.number - b.number
            || a.name.localeCompare(b.name)
        );
    }, [students, teacherClasses]);

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
            ? allTeacherStudents
            : (() => {
                const matchedClass = teacherClasses.find((cls) => cls.id === selectedClass);
                return matchedClass ? getStudentsInTeachingClass(students, matchedClass) : [];
            })();

        return visibleStudents
            .filter((student) =>
                student.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) =>
                (a.grade ?? 0) - (b.grade ?? 0)
                || (a.classNumber ?? 0) - (b.classNumber ?? 0)
                || a.number - b.number
                || a.name.localeCompare(b.name)
            );
    }, [allTeacherStudents, searchQuery, selectedClass, students, teacher, teacherClasses]);

    const scopedObservations = useMemo(
        () => observations.filter((observation) =>
            !teacher?.teacherKey
            || !observation.teacherKey
            || observation.teacherKey === teacher.teacherKey
        ),
        [observations, teacher]
    );

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

    const observationStatsByClass = useMemo(() => {
        const stats = new Map<string, ObservationCardStats>();

        scopedObservations.forEach((observation) => {
            const key = `${observation.studentId}:${observation.classId}`;
            const current = stats.get(key) ?? {
                count: 0,
                latest: undefined,
                tags: [],
            };
            const tagSet = new Set(current.tags);

            observation.tags.forEach((tag) => {
                if (tagSet.size < 3) tagSet.add(tag);
            });

            const latest = current.latest
                && getObservationTimestamp(current.latest) > getObservationTimestamp(observation)
                ? current.latest
                : observation;

            stats.set(key, {
                count: current.count + 1,
                latest,
                tags: Array.from(tagSet),
            });
        });

        return stats;
    }, [scopedObservations]);

    const getObservationStats = (student: Student, classId?: string): ObservationCardStats => {
        if (classId) {
            return observationStatsByClass.get(`${student.id}:${classId}`) ?? { count: 0, tags: [] };
        }

        const classIds = teacherClasses
            .filter((cls) =>
                cls.school === student.school
                && cls.grade === student.grade
                && cls.classNumber === student.classNumber
            )
            .map((cls) => cls.id);

        return classIds.reduce<ObservationCardStats>((acc, classId) => {
            const next = observationStatsByClass.get(`${student.id}:${classId}`);
            if (!next) return acc;

            const tagSet = new Set([...acc.tags, ...next.tags]);
            const latest = !acc.latest
                || (next.latest && getObservationTimestamp(next.latest) > getObservationTimestamp(acc.latest))
                ? next.latest
                : acc.latest;

            return {
                count: acc.count + next.count,
                latest,
                tags: Array.from(tagSet).slice(0, 3),
            };
        }, { count: 0, tags: [] });
    };

    const handleClassChange = (classId: string) => {
        setSelectedClass(classId);
        const emptySelection = new Set<string>();
        selectedStudentIdsRef.current = emptySelection;
        setSelectedStudentIds(emptySelection);
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
        if (filteredStudents.length === 0) return;

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

    const clearSelectedStudents = () => {
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

    const resolveClassIdForSelectedStudents = (selectedStudents: Student[]) => {
        if (selectedClass !== 'all') return selectedClass;

        const classIds = new Set(
            selectedStudents
                .map((student) => getTeachingClassForStudent(student)?.id)
                .filter(Boolean)
        );

        return classIds.size === 1 ? Array.from(classIds)[0] : '';
    };

    const openSelectedObservationComposer = () => {
        flushPendingStudentSelection();

        const selectedStudents = filteredStudents.filter((student) => selectedStudentIdsRef.current.has(student.id));
        if (selectedStudents.length === 0) return;

        const classId = resolveClassIdForSelectedStudents(selectedStudents);
        if (!classId) {
            alert('한 번에 기록하려면 같은 수업 학급 학생만 선택하세요.');
            return;
        }

        const query = new URLSearchParams({ classId });
        if (selectedStudents.length > 1) {
            query.set('studentIds', selectedStudents.map((student) => student.id).join(','));
        } else {
            query.set('studentId', selectedStudents[0].id);
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
                    <h1 className={styles.title}>학생 관찰 기록</h1>
                    <p className={styles.subtitle}>
                        {teacher?.subject || '수업'} · {teacherClasses.length}개 담당 학급
                    </p>
                </div>
                <div className={styles.headerStats}>
                    <div>
                        <strong>{filteredStudents.length}</strong>
                        <span>표시 학생</span>
                    </div>
                    <div>
                        <strong>{selectedStudentIds.size}</strong>
                        <span>선택</span>
                    </div>
                    <div>
                        <strong>{scopedObservations.length}</strong>
                        <span>누적 기록</span>
                    </div>
                </div>
            </header>

            <section className={styles.boardWorkspace}>
                <div className={styles.boardToolbar}>
                    <div className={styles.boardTabs} aria-label="담당 학급">
                        <button
                            type="button"
                            className={`${styles.boardTab} ${selectedClass === 'all' ? styles.boardTabActive : ''}`}
                            onClick={() => handleClassChange('all')}
                        >
                            전체
                            <span>{allTeacherStudents.length}</span>
                        </button>
                        {teacherClasses.map((cls) => {
                            const classStudents = getStudentsInTeachingClass(students, cls);
                            return (
                                <button
                                    type="button"
                                    key={cls.id}
                                    className={`${styles.boardTab} ${selectedClass === cls.id ? styles.boardTabActive : ''}`}
                                    onClick={() => handleClassChange(cls.id)}
                                >
                                    {cls.grade}-{cls.classNumber}
                                    <span>{classStudents.length}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className={styles.boardControls}>
                        <div className={styles.searchBox}>
                            <Search size={18} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="이름 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <button
                            type="button"
                            className={styles.toolbarButton}
                            onClick={toggleSelectAllStudents}
                            disabled={filteredStudents.length === 0}
                        >
                            <Users size={16} />
                            {selectedStudentIds.size === filteredStudents.length && filteredStudents.length > 0 ? '전체 해제' : '전체 선택'}
                        </button>
                        <button
                            type="button"
                            className={styles.iconButton}
                            onClick={clearSelectedStudents}
                            disabled={selectedStudentIds.size === 0}
                            title="선택 해제"
                            aria-label="선택 해제"
                        >
                            <X size={16} />
                        </button>
                        <Button
                            size="sm"
                            onClick={openSelectedObservationComposer}
                            disabled={selectedStudentIds.size === 0}
                        >
                            <PenLine size={16} />
                            기록하기
                        </Button>
                    </div>
                </div>

                {teacherClasses.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>연결된 담당 수업 학급이 없습니다.</p>
                        <Link href="/students" className={styles.summaryLink}>
                            학생 관리로 이동
                        </Link>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>조건에 맞는 학생이 없습니다.</p>
                    </div>
                ) : (
                    <div className={styles.studentBoardGrid}>
                        {filteredStudents.map((student, index) => {
                            const teachingClass = getTeachingClassForStudent(student);
                            const stats = getObservationStats(student, teachingClass?.id);
                            const latestTag = stats.latest?.tags[0] || stats.tags[0] || '기록 전';
                            const latestTopic = stats.latest?.lessonTopic || teachingClass?.subjectName || teacher?.subject || '수업';
                            const isSelected = selectedStudentIds.has(student.id);

                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: Math.min(index * 0.01, 0.2) }}
                                    className={`${styles.studentCard} ${isSelected ? styles.studentCardSelected : ''}`}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isSelected}
                                    aria-label={`${student.name}, 관찰 기록 ${stats.count}개, 최근 ${latestTag}`}
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
                                            checked={isSelected}
                                            onClick={(event) => event.stopPropagation()}
                                            onDoubleClick={(event) => event.stopPropagation()}
                                            onChange={() => toggleStudentSelection(student.id)}
                                            aria-label={`${student.name} 선택`}
                                        />
                                        <span className={styles.studentNumber}>{student.number}</span>
                                        {isSelected && (
                                            <CheckCircle2 className={styles.selectedIcon} size={18} aria-hidden="true" />
                                        )}
                                    </div>

                                    <div className={styles.studentCardName}>{student.name}</div>
                                    <div className={styles.studentCardMeta}>
                                        {student.grade}학년 {student.classNumber}반 · {teachingClass?.subjectName || teacher?.subject}
                                    </div>

                                    <div className={`${styles.latestTag} ${stats.count === 0 ? styles.latestTagEmpty : ''}`}>
                                        {latestTag}
                                    </div>
                                    <div className={styles.latestTopic}>{latestTopic}</div>

                                    <div className={styles.cardStatRow}>
                                        <span>
                                            <ClipboardList size={14} />
                                            {stats.count}개
                                        </span>
                                        <span>
                                            <CalendarDays size={14} />
                                            {formatShortDate(stats.latest?.date || stats.latest?.createdAt)}
                                        </span>
                                    </div>

                                    {stats.latest?.createdAt && (
                                        <div className={styles.cardUpdatedAt}>
                                            <Clock3 size={13} />
                                            {formatShortDate(stats.latest.createdAt)}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
