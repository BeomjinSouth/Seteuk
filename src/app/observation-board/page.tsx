'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Trash2,
    ClipboardList,
    FileText,
    Sparkles,
    ChevronRight,
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
        [observations, teacher?.teacherKey]
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
        if (selectedClass !== 'all') {
            return teacherClasses.find((cls) => cls.id === selectedClass);
        }
        return teacherClasses.find((cls) =>
            cls.school === student.school
            && cls.grade === student.grade
            && cls.classNumber === student.classNumber
        );
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
        setSelectedStudentIds((prev) => {
            const next = new Set(prev);
            if (next.has(studentId)) next.delete(studentId);
            else next.add(studentId);
            return next;
        });
    };

    const toggleSelectAllStudents = () => {
        if (selectedStudentIds.size === filteredStudents.length) {
            setSelectedStudentIds(new Set());
            return;
        }
        setSelectedStudentIds(new Set(filteredStudents.map((student) => student.id)));
    };

    const handleDeleteSelectedStudents = () => {
        if (selectedStudentIds.size === 0) return;
        if (!confirm(`선택한 ${selectedStudentIds.size}명의 학생을 삭제하시겠습니까?`)) return;
        Array.from(selectedStudentIds).forEach((studentId) => removeStudent(studentId));
        setSelectedStudentIds(new Set());
    };

    const handleOpenSelectedRecords = () => {
        if (selectedStudentIds.size === 0) return;
        const firstStudentId = Array.from(selectedStudentIds)[0];
        const firstStudent = filteredStudents.find((student) => student.id === firstStudentId);
        const teachingClass = firstStudent ? getTeachingClassForStudent(firstStudent) : undefined;

        if (!teachingClass) return;

        const query = new URLSearchParams({
            classId: teachingClass.id,
        });
        if (selectedStudentIds.size === 1) {
            query.set('studentId', firstStudentId);
        }
        window.location.href = `/observations?${query.toString()}`;
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>학생 카드 보드</h1>
                    <p className={styles.subtitle}>
                        학생 관리에서 연결한 담당 학급 학생을 카드로 확인하고, 관찰 메모와 세특 작성으로 바로 이동합니다.
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
                            <span>학생 명부 업로드와 담당 학급 연결은 학생 관리에서 합니다.</span>{' '}
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
                                variant="secondary"
                                onClick={handleOpenSelectedRecords}
                                disabled={selectedStudentIds.size === 0}
                            >
                                <ClipboardList size={16} />
                                선택 기록 보기
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
                                    >
                                        <div className={styles.studentCardTop}>
                                            <input
                                                type="checkbox"
                                                className={styles.cardCheckbox}
                                                checked={selectedStudentIds.has(student.id)}
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

                                        <div className={styles.cardActions}>
                                            {teachingClass && (
                                                <Link
                                                    href={`/observations?classId=${encodeURIComponent(teachingClass.id)}&studentId=${encodeURIComponent(student.id)}`}
                                                    className={styles.cardLink}
                                                >
                                                    <ClipboardList size={14} />
                                                    기록 보기
                                                </Link>
                                            )}
                                            {teachingClass && (
                                                <Link
                                                    href={`/write?classId=${encodeURIComponent(teachingClass.id)}&studentId=${encodeURIComponent(student.id)}`}
                                                    className={styles.cardLink}
                                                >
                                                    <ChevronRight size={14} />
                                                    세특 작성
                                                </Link>
                                            )}
                                        </div>

                                        <button
                                            className={styles.cardDeleteButton}
                                            title="삭제"
                                            onClick={() => handleDeleteStudent(student)}
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
