'use client';

import { useState, useCallback } from 'react';
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
    Edit2,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as XLSX from 'xlsx';
import { Student } from '@/types';
import styles from './page.module.css';

// Helper function to extract number from Korean text like "3반" -> 3
function extractClassNumber(classStr: string | number): number {
    if (typeof classStr === 'number') return classStr;
    const str = String(classStr).trim();
    // Try to extract number from strings like "3반", "3", "삼반" etc.
    const match = str.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    // Map Korean number words
    const koreanNumbers: Record<string, number> = {
        '일': 1, '이': 2, '삼': 3, '사': 4, '오': 5,
        '육': 6, '칠': 7, '팔': 8, '구': 9, '십': 10
    };
    for (const [k, v] of Object.entries(koreanNumbers)) {
        if (str.includes(k)) return v;
    }
    return 0; // Default if no number found
}

export default function StudentsPage() {
    const { classes, students, setStudents, teacher } = useAppStore();
    const [selectedClass, setSelectedClass] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [uploadResult, setUploadResult] = useState<{
        success: boolean;
        message: string;
        details?: string[];
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Filter students - only show students from the same school as logged-in teacher
    const filteredStudents = students.filter(s => {
        const matchSchool = !teacher?.school || s.school === teacher.school;
        const matchClass = selectedClass === 'all' || s.classId === selectedClass;
        const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSchool && matchClass && matchSearch;
    });

    // Download template
    const handleDownloadTemplate = () => {
        const template = [
            ['학교', '학년', '학기', '과목', '반', '번호', '이름'],
            [teacher?.school || '성호중학교', '2', '1', '생명과학I', '3', '1', '홍길동'],
            [teacher?.school || '성호중학교', '2', '1', '생명과학I', '3반', '2', '김철수'],
        ];

        const ws = XLSX.utils.aoa_to_sheet(template);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '학생목록');

        // Set column widths
        ws['!cols'] = [
            { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 15 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
        ];

        XLSX.writeFile(wb, '학생목록_템플릿.xlsx');
    };

    // Handle file upload
    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

                // Validate headers
                const headers = jsonData[0];
                const requiredHeaders = ['학교', '학년', '학기', '과목', '반', '번호', '이름'];
                const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

                if (missingHeaders.length > 0) {
                    setUploadResult({
                        success: false,
                        message: '필수 열이 누락되었습니다.',
                        details: missingHeaders.map(h => `'${h}' 열이 없습니다.`)
                    });
                    return;
                }

                // Parse rows
                const errors: string[] = [];
                const newStudents: Student[] = [];
                const seenStudents = new Set<string>();

                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row || row.length === 0) continue;

                    const school = row[headers.indexOf('학교')];
                    const grade = row[headers.indexOf('학년')];
                    const semester = row[headers.indexOf('학기')];
                    const subject = row[headers.indexOf('과목')];
                    const classNum = row[headers.indexOf('반')];
                    const number = row[headers.indexOf('번호')];
                    const name = row[headers.indexOf('이름')];

                    // Validation - include school and grade as required
                    if (!school || !grade || !subject || !classNum || !number || !name) {
                        errors.push(`${i + 1}행: 필수 정보 누락 (학교, 학년, 과목, 반, 번호, 이름 모두 필수)`);
                        continue;
                    }

                    // Only allow students from the same school as the logged-in teacher
                    if (teacher && school !== teacher.school) {
                        errors.push(`${i + 1}행: ${school} 학생은 현재 로그인한 교사(${teacher.school})와 다른 학교입니다.`);
                        continue;
                    }

                    // Extract class number from text like "3반" or "3"
                    const classNumber = extractClassNumber(classNum);
                    if (classNumber === 0) {
                        errors.push(`${i + 1}행: 반 정보를 인식할 수 없습니다 (${classNum})`);
                        continue;
                    }

                    const studentKey = `${school}-${grade}-${classNumber}-${number}`;
                    if (seenStudents.has(studentKey)) {
                        errors.push(`${i + 1}행: 중복 학생 (${grade}학년 ${classNumber}반 ${number}번)`);
                        continue;
                    }
                    seenStudents.add(studentKey);

                    // Include school in classId for proper isolation
                    let classId = classes.find(
                        c => c.classNumber === classNumber && c.subjectName === subject && c.grade === Number(grade)
                    )?.id;

                    if (!classId) {
                        // Create unique classId including school name for isolation
                        classId = `c-${school}-${grade}-${classNumber}-${Date.now()}-${i}`;
                    }

                    newStudents.push({
                        id: `s-${school}-${Date.now()}-${i}`,
                        classId,
                        number: Number(number),
                        name: String(name),
                        grade: Number(grade),
                        school: String(school),
                        classNumber: classNumber,
                        learningData: {}
                    });
                }

                if (newStudents.length > 0) {
                    // Group by class and set students
                    const studentsByClass = new Map<string, Student[]>();
                    newStudents.forEach(s => {
                        const existing = studentsByClass.get(s.classId) || [];
                        studentsByClass.set(s.classId, [...existing, s]);
                    });

                    studentsByClass.forEach((classStudents, classId) => {
                        setStudents(classId, classStudents);
                    });

                    setUploadResult({
                        success: true,
                        message: `${newStudents.length}명의 학생이 추가되었습니다.`,
                        details: errors.length > 0 ? errors : undefined
                    });
                } else {
                    setUploadResult({
                        success: false,
                        message: '추가할 학생이 없습니다.',
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
    }, [classes, setStudents]);

    // Drag and drop handlers
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
        } else {
            setUploadResult({
                success: false,
                message: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.'
            });
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>학생 관리</h1>
                    <p className={styles.subtitle}>학생 데이터를 업로드하고 관리하세요.</p>
                </div>
            </header>

            {/* Upload Section */}
            <section className={styles.uploadSection}>
                <div className={styles.uploadHeader}>
                    <h2><FileSpreadsheet size={20} /> 엑셀 파일 업로드</h2>
                    <Button variant="secondary" onClick={handleDownloadTemplate}>
                        <Download size={16} /> 템플릿 다운로드
                    </Button>
                </div>

                <div
                    className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <Upload size={48} className={styles.dropzoneIcon} />
                    <p className={styles.dropzoneText}>
                        엑셀 파일을 여기에 드래그하거나 클릭하여 업로드
                    </p>
                    <p className={styles.dropzoneHint}>
                        필수 열: 학교, 학년, 학기, 과목, 반, 번호, 이름
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
                                        {uploadResult.details.slice(0, 5).map((d, i) => (
                                            <li key={i}>{d}</li>
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

            {/* Student List */}
            <section className={styles.listSection}>
                <div className={styles.listHeader}>
                    <h2><Users size={20} /> 학생 목록 ({filteredStudents.length}명)</h2>
                    <div className={styles.filters}>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className={styles.select}
                        >
                            <option value="all">전체 반</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.grade}학년 {c.classNumber}반
                                </option>
                            ))}
                        </select>
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

                {filteredStudents.length === 0 ? (
                    <div className={styles.emptyList}>
                        <Users size={48} />
                        <p>등록된 학생이 없습니다.</p>
                        <p className={styles.hint}>위에서 엑셀 파일을 업로드하세요.</p>
                    </div>
                ) : (
                    <div className={styles.studentList}>
                        <div className={styles.listHeaderRow}>
                            <span>반</span>
                            <span>번호</span>
                            <span>이름</span>
                            <span>근거 데이터</span>
                            <span>작업</span>
                        </div>
                        {filteredStudents.map((student, i) => {
                            const cls = classes.find(c => c.id === student.classId);
                            const dataCount = Object.keys(student.learningData).length;
                            return (
                                <motion.div
                                    key={student.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={styles.studentRow}
                                >
                                    <span>{student.classNumber || cls?.classNumber || '-'}반</span>
                                    <span>{student.number}번</span>
                                    <span className={styles.studentName}>{student.name}</span>
                                    <span>
                                        <span className={`${styles.dataBadge} ${dataCount > 0 ? styles.hasData : ''}`}>
                                            {dataCount > 0 ? `${dataCount}개 입력됨` : '미입력'}
                                        </span>
                                    </span>
                                    <span className={styles.actions}>
                                        <button className={styles.actionBtn} title="수정">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className={`${styles.actionBtn} ${styles.deleteBtn}`} title="삭제">
                                            <Trash2 size={16} />
                                        </button>
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
