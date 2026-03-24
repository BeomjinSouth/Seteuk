'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Download,
    FileSpreadsheet,
    Users,
    CheckCircle2,
    AlertCircle,
    Trash2,
    Search,
    Link2,
    FlaskConical,
    ClipboardList,
    FileText,
    Sparkles,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import { ClassGroup, Observation, Student } from '@/types';
import {
    buildHomeroomClassId,
    buildTeachingClassId,
    getLearningDataForClass,
    getTeacherClasses,
    getUniqueHomeroomOptions,
    getStudentsInTeachingClass,
} from '@/lib/teacher-context';
import styles from './page.module.css';

function extractClassNumber(classStr: string | number): number {
    if (typeof classStr === 'number') return classStr;
    const str = String(classStr).trim();
    const match = str.match(/\d+/);
    if (match) return parseInt(match[0], 10);

    const koreanNumbers: Record<string, number> = {
        '일': 1, '이': 2, '삼': 3, '사': 4, '오': 5,
        '육': 6, '칠': 7, '팔': 8, '구': 9, '십': 10
    };

    for (const [k, v] of Object.entries(koreanNumbers)) {
        if (str.includes(k)) return v;
    }
    return 0;
}

function buildStudentId(school: string, grade: number, classNumber: number, number: number): string {
    return `student-${school.replace(/\s+/g, '').toLowerCase()}-${grade}-${classNumber}-${number}`;
}

export default function StudentsPage() {
    const {
        classes,
        students,
        records,
        upsertClass,
        upsertRosterStudents,
        removeStudent,
        seedDemoWorkspace,
        teacher,
    } = useAppStore();
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [selectedHomerooms, setSelectedHomerooms] = useState<Set<string>>(new Set());
    const [observations, setObservations] = useState<Observation[]>([]);
    const [uploadResult, setUploadResult] = useState<{
        success: boolean;
        message: string;
        details?: string[];
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher),
        [classes, teacher]
    );

    const homeroomOptions = useMemo(
        () => getUniqueHomeroomOptions(students, teacher?.school),
        [students, teacher?.school]
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

    const importedHomeroomKeys = useMemo(
        () => new Set(
            teacherClasses
                .filter((cls) => cls.semester === selectedSemester)
                .map((cls) => `${cls.grade}-${cls.classNumber}`)
        ),
        [selectedSemester, teacherClasses]
    );

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

    const handleDownloadTemplate = () => {
        const template = [
            ['학교', '학년', '반', '번호', '이름'],
            [teacher?.school || '성호중학교', '2', '3', '1', '홍길동'],
            [teacher?.school || '성호중학교', '2', '3반', '2', '김철수'],
        ];

        const ws = XLSX.utils.aoa_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '학생명부');
        ws['!cols'] = [
            { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
        ];

        XLSX.writeFile(wb, '학생명부_템플릿.xlsx');
    };

    const handleSeedDemoRoster = () => {
        const defaultClassId = seedDemoWorkspace();
        if (defaultClassId) {
            setSelectedClass(defaultClassId);
        }
        setUploadResult({
            success: true,
            message: '데모 명부와 담당 학급을 채웠습니다. 바로 관찰 메모와 세특 생성 흐름을 체험할 수 있습니다.',
        });
    };

    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
                const headers = jsonData[0] || [];
                const requiredHeaders = ['학교', '학년', '반', '번호', '이름'];
                const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

                if (missingHeaders.length > 0) {
                    setUploadResult({
                        success: false,
                        message: '필수 열이 누락되었습니다.',
                        details: missingHeaders.map((header) => `'${header}' 열이 없습니다.`)
                    });
                    return;
                }

                const errors: string[] = [];
                const newStudents: Student[] = [];
                const homeroomClasses = new Map<string, ClassGroup>();
                const seenStudents = new Set<string>();

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.length === 0) continue;

                    const school = String(row[headers.indexOf('학교')] || '').trim();
                    const grade = Number(row[headers.indexOf('학년')] || 0);
                    const classRaw = row[headers.indexOf('반')];
                    const number = Number(row[headers.indexOf('번호')] || 0);
                    const name = String(row[headers.indexOf('이름')] || '').trim();

                    if (!school || !grade || !classRaw || !number || !name) {
                        errors.push(`${i + 1}행: 학교, 학년, 반, 번호, 이름은 모두 필수입니다.`);
                        continue;
                    }

                    if (teacher?.school && school !== teacher.school) {
                        errors.push(`${i + 1}행: ${school} 학생은 현재 로그인한 교사(${teacher.school})와 다른 학교입니다.`);
                        continue;
                    }

                    const classNumber = extractClassNumber(classRaw);
                    if (classNumber === 0) {
                        errors.push(`${i + 1}행: 반 정보를 인식할 수 없습니다 (${classRaw})`);
                        continue;
                    }

                    const studentKey = `${school}-${grade}-${classNumber}-${number}`;
                    if (seenStudents.has(studentKey)) {
                        errors.push(`${i + 1}행: 중복 학생 (${grade}학년 ${classNumber}반 ${number}번)`);
                        continue;
                    }
                    seenStudents.add(studentKey);

                    const homeroomClassId = buildHomeroomClassId(school, grade, classNumber);
                    homeroomClasses.set(homeroomClassId, {
                        id: homeroomClassId,
                        kind: 'homeroom',
                        school,
                        grade,
                        classNumber,
                        subjectName: '학적 명부',
                        semester: '1',
                        year: new Date().getFullYear(),
                        studentCount: 0,
                    });

                    newStudents.push({
                        id: buildStudentId(school, grade, classNumber, number),
                        classId: homeroomClassId,
                        number,
                        name,
                        grade,
                        school,
                        classNumber,
                        learningData: {},
                        classLearningData: {},
                    });
                }

                homeroomClasses.forEach((cls) => {
                    const studentCount = newStudents.filter((student) => student.classId === cls.id).length;
                    upsertClass({ ...cls, studentCount });
                });

                if (newStudents.length > 0) {
                    upsertRosterStudents(newStudents);
                    setUploadResult({
                        success: true,
                        message: `${newStudents.length}명의 학생 명부를 반영했습니다.`,
                        details: errors.length > 0 ? errors : undefined
                    });
                } else {
                    setUploadResult({
                        success: false,
                        message: '반영할 학생이 없습니다.',
                        details: errors
                    });
                }
            } catch (error) {
                setUploadResult({
                    success: false,
                    message: '파일 처리 중 오류가 발생했습니다.',
                    details: [String(error)]
                });
            }
        };
        reader.readAsArrayBuffer(file);
    }, [teacher, upsertClass, upsertRosterStudents]);

    const handleImportTeachingClasses = () => {
        if (!teacher || selectedHomerooms.size === 0) return;

        const year = new Date().getFullYear();
        selectedHomerooms.forEach((key) => {
            const [grade, classNumber] = key.split('-').map(Number);
            const teacherClassId = buildTeachingClassId({
                teacherKey: teacher.teacherKey,
                school: teacher.school,
                grade,
                classNumber,
                semester: selectedSemester,
                year,
                subjectName: teacher.subject,
            });

            upsertClass({
                id: teacherClassId,
                kind: 'teaching',
                school: teacher.school,
                teacherKey: teacher.teacherKey,
                grade,
                classNumber,
                subjectName: teacher.subject,
                semester: selectedSemester,
                year,
                studentCount: students.filter((student) =>
                    student.school === teacher.school
                    && student.grade === grade
                    && student.classNumber === classNumber
                ).length,
            });
        });

        const firstImportedKey = Array.from(selectedHomerooms)[0];
        if (firstImportedKey) {
            const [grade, classNumber] = firstImportedKey.split('-').map(Number);
            setSelectedClass(buildTeachingClassId({
                teacherKey: teacher.teacherKey,
                school: teacher.school,
                grade,
                classNumber,
                semester: selectedSemester,
                year: new Date().getFullYear(),
                subjectName: teacher.subject,
            }));
        }
        setSelectedHomerooms(new Set());
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            handleFileUpload(file);
            return;
        }

        setUploadResult({
            success: false,
            message: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.'
        });
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDeleteStudent = (student: Student) => {
        if (confirm(`"${student.name}" 학생을 삭제하시겠습니까?\n삭제하면 복원할 수 없습니다.`)) {
            removeStudent(student.id);
        }
    };

    const toggleHomeroomSelection = (key: string) => {
        setSelectedHomerooms((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

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

    const scopedObservations = useMemo(
        () => observations.filter((observation) =>
            !teacher?.teacherKey
            || !observation.teacherKey
            || observation.teacherKey === teacher.teacherKey
        ),
        [observations, teacher?.teacherKey]
    );

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
                    <h1 className={styles.title}>학생 관리</h1>
                    <p className={styles.subtitle}>
                        전교 명부를 한 번 업로드하고, 로그인한 교사의 담당 수업 학급만 가져와 세특 작업에 연결합니다.
                    </p>
                </div>
            </header>

            <section className={styles.uploadSection}>
                <div className={styles.uploadHeader}>
                    <h2><FileSpreadsheet size={20} /> 학교 학생 명부 업로드</h2>
                    <div className={styles.uploadActions}>
                        <Button variant="secondary" onClick={handleDownloadTemplate}>
                            <Download size={16} /> 템플릿 다운로드
                        </Button>
                        <Button variant="ghost" onClick={handleSeedDemoRoster}>
                            <FlaskConical size={16} /> 데모 명부 채우기
                        </Button>
                    </div>
                </div>

                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload size={48} className={styles.dropzoneIcon} />
                    <p className={styles.dropzoneText}>
                        전교 명부 엑셀을 드래그하거나 클릭하여 업로드
                    </p>
                    <p className={styles.dropzoneHint}>
                        필수 열: 학교, 학년, 반, 번호, 이름
                    </p>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileInput}
                        className={styles.fileInput}
                    />
                </div>

                <AnimatePresence>
                    {uploadResult && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`${styles.uploadResult} ${uploadResult.success ? styles.success : styles.error}`}
                        >
                            {uploadResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                            <div>
                                <p className={styles.resultMessage}>{uploadResult.message}</p>
                                {uploadResult.details && (
                                    <ul className={styles.resultDetails}>
                                        {uploadResult.details.slice(0, 5).map((detail, index) => (
                                            <li key={index}>{detail}</li>
                                        ))}
                                        {uploadResult.details.length > 5 && (
                                            <li>... 외 {uploadResult.details.length - 5}건</li>
                                        )}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className={styles.assignmentSection}>
                <div className={styles.assignmentHeader}>
                    <div>
                        <h2><Link2 size={20} /> 담당 수업 학급 가져오기</h2>
                        <p className={styles.assignmentHint}>
                            {teacher?.subject || '로그인한 과목'} 기준으로 내가 가르치는 학급만 작업 목록에 연결합니다.
                        </p>
                    </div>
                    <div className={styles.semesterToggle}>
                        <button
                            type="button"
                            className={`${styles.semesterBtn} ${selectedSemester === '1' ? styles.semesterBtnActive : ''}`}
                            onClick={() => setSelectedSemester('1')}
                        >
                            1학기
                        </button>
                        <button
                            type="button"
                            className={`${styles.semesterBtn} ${selectedSemester === '2' ? styles.semesterBtnActive : ''}`}
                            onClick={() => setSelectedSemester('2')}
                        >
                            2학기
                        </button>
                    </div>
                </div>

                {homeroomOptions.length === 0 ? (
                    <div className={styles.emptyAssignment}>
                        <p>먼저 학교 학생 명부를 업로드하세요.</p>
                    </div>
                ) : (
                    <>
                        <div className={styles.assignmentGrid}>
                            {homeroomOptions.map((option) => {
                                const imported = importedHomeroomKeys.has(option.key);
                                return (
                                    <label
                                        key={option.key}
                                        className={`${styles.assignmentCard} ${selectedHomerooms.has(option.key) ? styles.assignmentCardActive : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedHomerooms.has(option.key)}
                                            onChange={() => toggleHomeroomSelection(option.key)}
                                            disabled={imported}
                                        />
                                        <div>
                                            <strong>{option.grade}학년 {option.classNumber}반</strong>
                                            <span>{option.count}명</span>
                                        </div>
                                        {imported && <span className={styles.assignmentBadge}>연결됨</span>}
                                    </label>
                                );
                            })}
                        </div>

                        <div className={styles.assignmentActions}>
                            <span>{selectedHomerooms.size}개 학급 선택</span>
                            <Button onClick={handleImportTeachingClasses} disabled={!teacher || selectedHomerooms.size === 0}>
                                <Users size={16} /> 담당 학급 가져오기
                            </Button>
                        </div>
                    </>
                )}
            </section>

            <section className={styles.listSection}>
                <div className={styles.listHeader}>
                    <h2><Users size={20} /> 내 수업 학생 목록 ({filteredStudents.length}명)</h2>
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
                        <p className={styles.hint}>위에서 학급을 선택해 내 수업 학생 목록을 만드세요.</p>
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
                            <span>탭으로 학급을 바꾸고, 카드에서 바로 수업 기록과 세특 작성으로 이동할 수 있습니다.</span>
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
