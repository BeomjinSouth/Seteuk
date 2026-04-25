'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell,
    CalendarDays,
    CheckCircle2,
    Circle,
    ClipboardList,
    Handshake,
    Plus,
    Star,
    Triangle,
    Users,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import { Student } from '@/types';
import styles from './page.module.css';

type MarkState = 'none' | 'participated' | 'excellent';

const sessions = [
    { id: 'session-1', label: '1차시', date: '5/2 (금)', topic: '서로 알아가기' },
    { id: 'session-2', label: '2차시', date: '5/9 (금)', topic: '협동 게임' },
    { id: 'session-3', label: '3차시', date: '5/16 (금)', topic: '책 함께 읽기' },
    { id: 'session-4', label: '4차시', date: '5/23 (금)', topic: '미션 활동' },
    { id: 'session-5', label: '5차시', date: '5/30 (금)', topic: '마무리 나누기' },
];

const fallbackStudents: Student[] = [
    { id: 'sample-1', classId: 'sample', number: 1, name: '김민준', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-2', classId: 'sample', number: 2, name: '이지우', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-3', classId: 'sample', number: 3, name: '박서준', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-4', classId: 'sample', number: 4, name: '최하윤', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-5', classId: 'sample', number: 5, name: '정우진', grade: 1, classNumber: 1, learningData: {} },
    { id: 'sample-6', classId: 'sample', number: 6, name: '안채연', grade: 1, classNumber: 1, learningData: {} },
];

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

export default function ObservationBoard2Page() {
    const { classes, students, teacher } = useAppStore();
    const [selectedClassId, setSelectedClassId] = useState('all');
    const [marks, setMarks] = useState<Record<string, MarkState>>({});

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

        return Array.from(map.values()).sort((a, b) =>
            (a.grade ?? 0) - (b.grade ?? 0)
            || (a.classNumber ?? 0) - (b.classNumber ?? 0)
            || a.number - b.number
            || a.name.localeCompare(b.name)
        );
    }, [students, teacherClasses]);

    const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);

    const boardStudents = useMemo(() => {
        if (selectedClass) {
            return getStudentsInTeachingClass(students, selectedClass);
        }

        return teacherStudents.length > 0 ? teacherStudents : fallbackStudents;
    }, [selectedClass, students, teacherStudents]);

    const featuredStudents = boardStudents.slice(0, 6);

    const mentorGroups = useMemo(() => {
        const rows = featuredStudents.length > 0 ? featuredStudents : fallbackStudents;
        return Array.from({ length: Math.ceil(rows.length / 2) }, (_, groupIndex) => ({
            id: `group-${groupIndex + 1}`,
            title: `${groupIndex + 1}조`,
            mentor: rows[groupIndex * 2],
            mentee: rows[groupIndex * 2 + 1],
        })).filter((group) => group.mentor);
    }, [featuredStudents]);

    const totalExcellent = featuredStudents.reduce((sum, student, studentIndex) => (
        sum + sessions.reduce((sessionSum, session, sessionIndex) => {
            const key = `${student.id}:${session.id}`;
            const mark = marks[key] ?? getDefaultMark(studentIndex, sessionIndex);
            return sessionSum + (mark === 'excellent' ? 1 : 0);
        }, 0)
    ), 0);

    const updateMark = (studentId: string, sessionId: string, fallback: MarkState) => {
        const key = `${studentId}:${sessionId}`;
        setMarks((prev) => ({
            ...prev,
            [key]: getNextMark(prev[key] ?? fallback),
        }));
    };

    return (
        <div className={styles.page}>
            <header className={styles.hero}>
                <div className={styles.brandBlock}>
                    <div className={styles.brandBadge}>
                        <Star size={18} />
                        우리반
                    </div>
                    <div>
                        <h1>학생 기록 관찰 2</h1>
                        <p>{teacher?.subject || '수업'} · 멘토-멘티 활동 기록</p>
                    </div>
                </div>
                <div className={styles.utilityRail}>
                    <span className={styles.utilityPill}>
                        <Handshake size={18} />
                        우정 배지
                    </span>
                    <span className={styles.utilityPill}>
                        <Bell size={18} />
                        알림
                    </span>
                </div>
            </header>

            <section className={styles.classRail} aria-label="학급 선택">
                <button
                    type="button"
                    className={`${styles.classChip} ${selectedClassId === 'all' ? styles.classChipActive : ''}`}
                    onClick={() => setSelectedClassId('all')}
                >
                    전체
                    <span>{teacherStudents.length || fallbackStudents.length}</span>
                </button>
                {teacherClasses.map((cls) => (
                    <button
                        key={cls.id}
                        type="button"
                        className={`${styles.classChip} ${selectedClassId === cls.id ? styles.classChipActive : ''}`}
                        onClick={() => setSelectedClassId(cls.id)}
                    >
                        {cls.grade}-{cls.classNumber}
                        <span>{getStudentsInTeachingClass(students, cls).length}</span>
                    </button>
                ))}
            </section>

            <main className={styles.workspace}>
                <section className={styles.mentorPanel}>
                    <div className={styles.panelTitle}>
                        <Users size={22} />
                        <div>
                            <h2>멘토·멘티 구성</h2>
                            <p>{featuredStudents.length}명 표시</p>
                        </div>
                    </div>

                    <div className={styles.groupStack}>
                        {mentorGroups.map((group, index) => (
                            <motion.article
                                key={group.id}
                                className={styles.groupCard}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
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
                            {boardStudents.slice(0, 8).map((student) => (
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
                                    onUpdateMark={updateMark}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.recordFooter}>
                        <div>
                            <strong>활동 기록 안내</strong>
                            <span>
                                <Triangle size={17} /> 참여
                            </span>
                            <span>
                                <Circle size={17} /> 매우 잘함
                            </span>
                        </div>
                        <p>
                            함께 성장하는 우리, 최고야!
                            <CheckCircle2 size={18} />
                        </p>
                    </div>
                </section>
            </main>
        </div>
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
                                    aria-label={`${student.name} ${session.label} 활동 상태`}
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
