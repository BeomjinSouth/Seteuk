'use client';

import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    Download,
    FileSpreadsheet,
    Users,
    CheckCircle2,
    AlertCircle,
    Link2,
    FlaskConical,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import { ClassGroup, Student } from '@/types';
import {
    buildHomeroomClassId,
    buildTeachingClassId,
    getTeacherClasses,
    getUniqueHomeroomOptions,
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
        upsertClass,
        upsertRosterStudents,
        seedDemoWorkspace,
        teacher,
    } = useAppStore();
    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
    const [selectedHomerooms, setSelectedHomerooms] = useState<Set<string>>(new Set());
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

    const importedHomeroomKeys = useMemo(
        () => new Set(
            teacherClasses
                .filter((cls) => cls.semester === selectedSemester)
                .map((cls) => `${cls.grade}-${cls.classNumber}`)
        ),
        [selectedSemester, teacherClasses]
    );

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
        seedDemoWorkspace();
        setUploadResult({
            success: true,
            message: '데모 명부와 담당 학급을 채웠습니다. 상단 학생 관찰 기록 탭에서 학생 카드 보드를 확인하세요.',
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

        const importedCount = selectedHomerooms.size;
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

        setSelectedHomerooms(new Set());
        setUploadResult({
            success: true,
            message: `${importedCount}개 학급을 담당 수업에 연결했습니다. 학생 관찰 기록 탭에서 학생 카드 보드를 확인하세요.`,
        });
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

    const toggleHomeroomSelection = (key: string) => {
        setSelectedHomerooms((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>학생 관리</h1>
                    <p className={styles.subtitle}>
                        전교 명부를 한 번 업로드하고, 로그인한 교사의 담당 수업 학급만 연결합니다.
                        학생 목록과 학생별 카드는 상단 학생 관찰 기록 탭으로 분리되었습니다.
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
                    <h2><Users size={20} /> 다음 단계</h2>
                </div>

                {teacherClasses.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>담당 수업 학급을 연결하면 학생 카드 보드가 열립니다.</p>
                        <p className={styles.hint}>위에서 학급을 선택한 뒤 상단 학생 관찰 기록 탭으로 이동하세요.</p>
                    </div>
                ) : (
                    <div className={styles.emptyAssignment}>
                        <p>담당 수업 학급 {teacherClasses.length}개가 연결되었습니다.</p>
                        <p className={styles.hint}>
                            학생 목록과 학생별 카드는 상단 학생 관찰 기록 탭의 학생 카드 보드에서 확인합니다.
                        </p>
                        <Link href="/observation-board" className={styles.summaryLink}>
                            학생 카드 보드 열기
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
