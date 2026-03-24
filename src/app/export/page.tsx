'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
    Download,
    FileSpreadsheet,
    Copy,
    CheckCircle2,
    Filter,
    Users,
    DownloadCloud
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import * as XLSX from 'xlsx';
import styles from './page.module.css';
import ClassSelectionTabs from '@/components/ClassSelectionTabs';

/**
 * Export Page Component
 * 
 * @description
 * Handles exporting student records to Excel and clipboard copying.
 * 
 * Features:
 * - Export statistics (Confirmed/Total)
 * - Excel download by class or entire batch
 * - Option to include draft records
 * - Copy-to-clipboard view for easy NEIS entry
 */
export default function ExportPage() {
    const { classes, students, records, teacher } = useAppStore();

    const [selectedGradeClass, setSelectedGradeClass] = useState<string>('all');
    const [includeUnconfirmed, setIncludeUnconfirmed] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    // Get unique grade-class combinations from students
    const gradeClassTabs = useMemo(() => {
        const gradeClassMap = new Map<string, number>();

        students
            .filter(s => !teacher?.school || s.school === teacher.school)
            .forEach(s => {
                const grade = s.grade || 0;
                const classNum = s.classNumber || 0;
                if (grade > 0 && classNum > 0) {
                    const key = `${grade}-${classNum}`;
                    gradeClassMap.set(key, (gradeClassMap.get(key) || 0) + 1);
                }
            });

        return Array.from(gradeClassMap.entries())
            .sort((a, b) => {
                const [gradeA, classA] = a[0].split('-').map(Number);
                const [gradeB, classB] = b[0].split('-').map(Number);
                if (gradeA !== gradeB) return gradeA - gradeB;
                return classA - classB;
            })
            .map(([key, count]) => {
                const [grade, classNum] = key.split('-');
                return {
                    value: key,
                    label: `${grade}-${classNum}반`,
                    count
                };
            });
    }, [students, teacher]);

    // Filter records for export
    const exportableRecords = useMemo(() => {
        return records.filter(r => {
            const student = students.find(s => s.id === r.studentId);
            const matchTeacher = !teacher?.teacherKey || !r.teacherKey || r.teacherKey === teacher.teacherKey;

            // Filter by school
            const matchSchool = !teacher?.school || student?.school === teacher.school;

            // Filter by grade-class
            let matchGradeClass = true;
            if (selectedGradeClass !== 'all') {
                const [targetGrade, targetClass] = selectedGradeClass.split('-').map(Number);
                matchGradeClass = student?.grade === targetGrade && student?.classNumber === targetClass;
            }

            const matchStatus = includeUnconfirmed || r.status === 'confirmed';
            return matchTeacher && matchSchool && matchGradeClass && matchStatus;
        }).sort((a, b) => {
            const studentA = students.find(s => s.id === a.studentId);
            const studentB = students.find(s => s.id === b.studentId);
            if ((studentA?.grade || 0) !== (studentB?.grade || 0)) {
                return (studentA?.grade || 0) - (studentB?.grade || 0);
            }
            if ((studentA?.classNumber || 0) !== (studentB?.classNumber || 0)) {
                return (studentA?.classNumber || 0) - (studentB?.classNumber || 0);
            }
            return (studentA?.number || 0) - (studentB?.number || 0);
        });
    }, [records, selectedGradeClass, includeUnconfirmed, students, teacher]);

    // Get student info
    const getStudentInfo = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        const cls = classes.find(c => c.id === student?.classId);
        return { student, cls };
    };

    // Export single class to Excel
    const exportClassToExcel = (gradeClass: string, recordsToExport: typeof records) => {
        const [grade, classNum] = gradeClass.split('-').map(Number);

        const data = recordsToExport.map(record => {
            const { student, cls } = getStudentInfo(record.studentId);
            const recordClass = classes.find(c => c.id === record.classId);
            return {
                '학년': student?.grade || cls?.grade || '',
                '반': student?.classNumber || cls?.classNumber || '',
                '번호': student?.number || '',
                '이름': student?.name || '',
                '과목': recordClass?.subjectName || cls?.subjectName || '',
                '세특 내용': record.content,
                '상태': record.status === 'confirmed' ? '확정' : '초안',
                '마지막 수정': new Date(record.lastUpdated).toLocaleDateString('ko-KR')
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '세특');

        // Column widths
        ws['!cols'] = [
            { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 10 },
            { wch: 15 }, { wch: 80 }, { wch: 8 }, { wch: 12 }
        ];

        const fileName = `세특_${grade}학년${classNum}반_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    // Export to Excel (current selection)
    const handleExportExcel = () => {
        if (selectedGradeClass === 'all') {
            // Export all as single file
            const data = exportableRecords.map(record => {
                const { student, cls } = getStudentInfo(record.studentId);
                const recordClass = classes.find(c => c.id === record.classId);
                return {
                    '학년': student?.grade || cls?.grade || '',
                    '반': student?.classNumber || cls?.classNumber || '',
                    '번호': student?.number || '',
                    '이름': student?.name || '',
                    '과목': recordClass?.subjectName || cls?.subjectName || '',
                    '세특 내용': record.content,
                    '상태': record.status === 'confirmed' ? '확정' : '초안',
                    '마지막 수정': new Date(record.lastUpdated).toLocaleDateString('ko-KR')
                };
            });

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, '세특');

            ws['!cols'] = [
                { wch: 6 }, { wch: 6 }, { wch: 6 }, { wch: 10 },
                { wch: 15 }, { wch: 80 }, { wch: 8 }, { wch: 12 }
            ];

            const fileName = `세특_전체_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, fileName);
        } else {
            exportClassToExcel(selectedGradeClass, exportableRecords);
        }
    };

    // Download all classes as separate files
    const handleDownloadAll = async () => {
        setIsDownloadingAll(true);

        for (const gcTab of gradeClassTabs) {
            const gc = gcTab.value;
            const [targetGrade, targetClass] = gc.split('-').map(Number);

            const classRecords = records.filter(r => {
                const student = students.find(s => s.id === r.studentId);
                const matchTeacher = !teacher?.teacherKey || !r.teacherKey || r.teacherKey === teacher.teacherKey;
                const matchSchool = !teacher?.school || student?.school === teacher.school;
                const matchGradeClass = student?.grade === targetGrade && student?.classNumber === targetClass;
                const matchStatus = includeUnconfirmed || r.status === 'confirmed';
                return matchTeacher && matchSchool && matchGradeClass && matchStatus;
            }).sort((a, b) => {
                const studentA = students.find(s => s.id === a.studentId);
                const studentB = students.find(s => s.id === b.studentId);
                return (studentA?.number || 0) - (studentB?.number || 0);
            });

            if (classRecords.length > 0) {
                exportClassToExcel(gc, classRecords);

                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        setIsDownloadingAll(false);
        alert(`${gradeClassTabs.length}개 반의 파일이 다운로드되었습니다.`);
    };

    // Copy single record
    const handleCopy = async (recordId: string, content: string) => {
        await navigator.clipboard.writeText(content);
        setCopiedId(recordId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // Stats
    const confirmedCount = records.filter(r => {
        const student = students.find(s => s.id === r.studentId);
        return r.status === 'confirmed'
            && (!teacher?.teacherKey || !r.teacherKey || r.teacherKey === teacher.teacherKey)
            && (!teacher?.school || student?.school === teacher.school);
    }).length;
    const totalCount = records.filter(r => {
        const student = students.find(s => s.id === r.studentId);
        return (!teacher?.teacherKey || !r.teacherKey || r.teacherKey === teacher.teacherKey)
            && (!teacher?.school || student?.school === teacher.school);
    }).length;

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>내보내기</h1>
                    <p className={styles.subtitle}>세특 데이터를 엑셀로 내보내거나 복사하세요.</p>
                </div>
            </header>

            {/* Stats */}
            <div className={styles.statsRow}>
                <div className={styles.statCard}>
                    <CheckCircle2 size={24} className={styles.statIconGreen} />
                    <div>
                        <p className={styles.statValue}>{confirmedCount}</p>
                        <p className={styles.statLabel}>확정 완료</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <Users size={24} className={styles.statIconBlue} />
                    <div>
                        <p className={styles.statValue}>{totalCount}</p>
                        <p className={styles.statLabel}>전체 작성</p>
                    </div>
                </div>
            </div>

            {/* Export Options */}
            <section className={styles.exportSection}>
                <h2><FileSpreadsheet size={20} /> 엑셀 내보내기</h2>

                {/* Grade-Class Selection */}
                <ClassSelectionTabs
                    selectedClass={selectedGradeClass}
                    onSelectClass={setSelectedGradeClass}
                    tabs={gradeClassTabs}
                    totalCount={totalCount}
                />

                <div className={styles.options}>
                    <label className={styles.checkbox}>
                        <input
                            type="checkbox"
                            checked={includeUnconfirmed}
                            onChange={(e) => setIncludeUnconfirmed(e.target.checked)}
                        />
                        <span>초안 포함 (백업용)</span>
                    </label>
                </div>

                <div className={styles.exportInfo}>
                    <p>내보낼 세특: <strong>{exportableRecords.length}건</strong></p>
                </div>

                <div className={styles.buttonGroup}>
                    <Button
                        onClick={handleExportExcel}
                        disabled={exportableRecords.length === 0}
                    >
                        <Download size={18} />
                        {selectedGradeClass === 'all' ? '전체' : selectedGradeClass} 다운로드
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleDownloadAll}
                        disabled={gradeClassTabs.length === 0 || isDownloadingAll}
                    >
                        <DownloadCloud size={18} />
                        {isDownloadingAll ? '다운로드 중...' : `전체 반별 다운로드 (${gradeClassTabs.length}개 파일)`}
                    </Button>
                </div>
            </section>

            {/* Copy View */}
            <section className={styles.copySection}>
                <h2><Copy size={20} /> 복사용 보기 (나이스 입력용)</h2>
                <p className={styles.hint}>각 학생의 세특을 클릭하여 복사하세요.</p>

                {exportableRecords.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>내보낼 세특이 없습니다.</p>
                    </div>
                ) : (
                    <div className={styles.copyList}>
                        {exportableRecords.map((record, i) => {
                            const { student, cls } = getStudentInfo(record.studentId);
                            const isCopied = copiedId === record.id;

                            return (
                                <motion.div
                                    key={record.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={`${styles.copyCard} ${isCopied ? styles.copied : ''}`}
                                    onClick={() => handleCopy(record.id, record.content)}
                                >
                                    <div className={styles.copyHeader}>
                                        <span className={styles.studentLabel}>
                                            {student?.grade || '-'}학년 {student?.classNumber || cls?.classNumber || '-'}반 {student?.number}번 {student?.name}
                                        </span>
                                        <span className={styles.copyStatus}>
                                            {isCopied ? (
                                                <><CheckCircle2 size={14} /> 복사됨</>
                                            ) : (
                                                <><Copy size={14} /> 클릭하여 복사</>
                                            )}
                                        </span>
                                    </div>
                                    <p className={styles.copyContent}>{record.content}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
