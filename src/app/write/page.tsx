'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpellCheckModal, SpellError } from '@/components/SpellCheckModal';
import { ForbiddenCheckModal } from '@/components/ForbiddenCheckModal';
import { SimilarityModal, SimilarityResult } from '@/components/SimilarityModal';
import { getContentHash } from '@/components/KeywordHighlighter';
import { useAppStore } from '@/lib/store';
import { SubjectRecord, CompetencySegment } from '@/types';
import type { OCREvaluation } from '@/types/ocr';
import { generateDraft, performSpellCheck, checkForbiddenWords, reviewAndImproveRecord } from '@/lib/write-logic';
import { applyCheckResultToRecord } from '@/lib/check-utils';
import { getRecordByStudentSemester } from '@/lib/record-utils';
import { DEFAULT_CONCURRENCY_LIMIT, mapWithConcurrency } from '@/lib/concurrency';
import { getLearningDataForClass, getStudentsInTeachingClass, getTeacherClasses } from '@/lib/teacher-context';
import { WriteTableRow } from './components/WriteTableRow';
import { WriteToolbar } from './components/WriteToolbar';
import styles from './page.module.css';

function WritePageLoading() {
    return (
        <div className={styles.page}>
            <div className={styles.emptyState}>
                <Loader2 size={48} className={styles.spinning} />
                <h3>불러오는 중...</h3>
            </div>
        </div>
    );
}

function inferSchoolLevel(schoolName?: string): '초등학교' | '중학교' | '고등학교' {
    if (schoolName?.includes('초')) return '초등학교';
    if (schoolName?.includes('중')) return '중학교';
    return '고등학교';
}

function WritePageContent() {
    const searchParams = useSearchParams();
    const classFilter = searchParams.get('classId');
    const studentFilter = searchParams.get('studentId');

    const {
        classes,
        students,
        records,
        updateRecord,
        updateStudentLearningData,
        exampleTemplate,
        teacher,
        forbiddenWords,
        getCurriculumContent,
    } = useAppStore();

    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('2');
    const [selectedGradeClass, setSelectedGradeClass] = useState<string>(classFilter || 'all');
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(
        () => new Set(studentFilter ? [studentFilter] : [])
    );
    const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
    const [editingCell, setEditingCell] = useState<{ studentId: string; field: 'data' | 'content' } | null>(null);
    const [editValue, setEditValue] = useState('');

    const [spellCheckTarget, setSpellCheckTarget] = useState<SubjectRecord | null>(null);
    const [spellErrors, setSpellErrors] = useState<SpellError[]>([]);
    const [isChecking] = useState(false);

    const [isBulkChecking, setIsBulkChecking] = useState(false);
    const [isForbiddenModalOpen, setIsForbiddenModalOpen] = useState(false);
    const [forbiddenResults, setForbiddenResults] = useState<Map<string, { word: string; suggestion: string; reason: string }[]>>(new Map());
    const [isCompetencyAnalyzing, setIsCompetencyAnalyzing] = useState(false);
    const [isCheckingSimilarity, setIsCheckingSimilarity] = useState(false);
    const [isBulkAdjusting, setIsBulkAdjusting] = useState(false);
    const [isBulkReviewImproving, setIsBulkReviewImproving] = useState(false);
    const [similarityResults, setSimilarityResults] = useState<SimilarityResult[]>([]);
    const [isSimilarityModalOpen, setIsSimilarityModalOpen] = useState(false);
    const [similaritySuggestions, setSimilaritySuggestions] = useState<Map<string, { similarityAnalysis: string; student1Suggestion: string; student2Suggestion: string }>>(new Map());

    const currentSemester: 1 | 2 = selectedSemester === '1' ? 1 : 2;
    const currentTeacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher, selectedSemester),
        [classes, selectedSemester, teacher]
    );
    const validStudents = useMemo(
        () =>
            students.filter((student) =>
                !!student.id?.trim()
                && !!student.classId?.trim()
                && !!student.name?.trim()
                && Number.isFinite(student.number)
                && student.number > 0
            ),
        [students]
    );

    const getStudentRecord = useCallback(
        (studentId: string) => getRecordByStudentSemester(records, studentId, currentSemester, teacher?.teacherKey),
        [currentSemester, records, teacher?.teacherKey]
    );

    const gradeClassTabs = useMemo(() => {
        return currentTeacherClasses.map((cls) => ({
            value: cls.id,
            count: getStudentsInTeachingClass(validStudents, cls).length,
            label: `${cls.grade}-${cls.classNumber}`,
        }));
    }, [currentTeacherClasses, validStudents]);

    const filteredStudents = useMemo(() => {
        if (!teacher || currentTeacherClasses.length === 0) return [];

        if (selectedGradeClass !== 'all') {
            const selectedClass = currentTeacherClasses.find((cls) => cls.id === selectedGradeClass);
            return selectedClass ? getStudentsInTeachingClass(validStudents, selectedClass) : [];
        }

        const uniqueStudents = new Map<string, typeof validStudents[number]>();
        currentTeacherClasses.forEach((cls) => {
            getStudentsInTeachingClass(validStudents, cls).forEach((student) => {
                uniqueStudents.set(student.id, student);
            });
        });
        return Array.from(uniqueStudents.values()).sort((a, b) => (a.number || 0) - (b.number || 0));
    }, [currentTeacherClasses, selectedGradeClass, teacher, validStudents]);
    const totalTeacherStudents = useMemo(() => {
        const uniqueStudents = new Set<string>();
        currentTeacherClasses.forEach((cls) => {
            getStudentsInTeachingClass(validStudents, cls).forEach((student) => {
                uniqueStudents.add(student.id);
            });
        });
        return uniqueStudents.size;
    }, [currentTeacherClasses, validStudents]);

    const studentNameMap = useMemo(
        () => new Map(students.map((student) => [student.id, student.name])),
        [students]
    );

    const similarityTargetStudents = useMemo(() => {
        if (selectedStudents.size > 0) {
            return Array.from(selectedStudents)
                .map((id) => students.find((student) => student.id === id))
                .filter((student): student is typeof students[number] => !!student);
        }
        return filteredStudents;
    }, [selectedStudents, students, filteredStudents]);

    const similarityTargetLabel = selectedStudents.size > 0
        ? `선택 ${similarityTargetStudents.length}명`
        : `필터 ${similarityTargetStudents.length}명`;

    const getTeachingClassForStudent = useCallback((student: typeof students[number]) => {
        if (selectedGradeClass !== 'all') {
            return currentTeacherClasses.find((cls) => cls.id === selectedGradeClass);
        }
        return currentTeacherClasses.find((cls) =>
            cls.school === student.school
            && cls.grade === student.grade
            && cls.classNumber === student.classNumber
        );
    }, [currentTeacherClasses, selectedGradeClass]);

    const toggleStudent = (id: string) => {
        setSelectedStudents((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedStudents.size === filteredStudents.length && filteredStudents.length > 0) {
            setSelectedStudents(new Set());
            return;
        }
        setSelectedStudents(new Set(filteredStudents.map((student) => student.id)));
    };

    const handleGenerateDrafts = async () => {
        const toGenerate = Array.from(selectedStudents);
        if (toGenerate.length === 0) return;

        setGeneratingIds(new Set(toGenerate));
        const ocrEvaluationCache = new Map<string, Promise<OCREvaluation[]>>();

        const getOcrEvaluations = (grade: number, semester: 1 | 2) => {
            const key = `${grade}-${semester}`;
            const cached = ocrEvaluationCache.get(key);
            if (cached) return cached;

            const request = (async () => {
                try {
                    const response = await fetch(`/api/ocr-evaluations?grade=${grade}&semester=${semester}`);
                    if (!response.ok) return [];
                    const data = await response.json() as {
                        data?: OCREvaluation[];
                        evaluations?: OCREvaluation[];
                    };
                    return data.data || data.evaluations || [];
                } catch {
                    return [];
                }
            })();
            ocrEvaluationCache.set(key, request);
            return request;
        };

        await mapWithConcurrency(toGenerate, DEFAULT_CONCURRENCY_LIMIT, async (studentId) => {
            const student = students.find((item) => item.id === studentId);
            if (!student) return;

            try {
                const teachingClass = getTeachingClassForStudent(student);
                if (!teachingClass) return;

                const studentGrade = student.grade || teachingClass.grade || 1;
                const curriculumData = getCurriculumContent(studentGrade, currentSemester);
                const evaluations = await getOcrEvaluations(studentGrade, currentSemester);

                let ocrEvaluationContext = undefined;
                for (const evaluation of evaluations) {
                    const studentResult = evaluation.batchGradingResult?.results?.find(
                        (result: { studentId: string; studentName: string }) =>
                            result.studentId === studentId || result.studentName === student.name
                    );

                    if (studentResult || evaluation.achievementStandards?.length > 0 || evaluation.scoringCriteria?.length > 0) {
                        ocrEvaluationContext = {
                            achievementStandards: evaluation.achievementStandards,
                            scoringCriteria: evaluation.scoringCriteria,
                            studentResult: studentResult || undefined,
                        };
                        break;
                    }
                }

                const result = await generateDraft(
                    studentId,
                    student.name,
                    teachingClass.subjectName || '',
                    getLearningDataForClass(student, teachingClass.id),
                    exampleTemplate,
                    curriculumData?.content,
                    ocrEvaluationContext,
                    {
                        teacherKey: teacher?.teacherKey,
                        classId: teachingClass.id,
                    }
                );

                updateRecord({
                    id: `r-${teacher?.teacherKey || 'teacher'}-${teachingClass.id}-${studentId}-${currentSemester}`,
                    studentId,
                    classId: teachingClass.id,
                    teacherKey: teacher?.teacherKey,
                    semester: currentSemester,
                    content: result.content,
                    status: 'draft',
                    lastUpdated: new Date().toISOString(),
                }, 'ai');
            } catch (error) {
                console.error('Generation failed', studentId, error);
            } finally {
                setGeneratingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(studentId);
                    return next;
                });
            }
        });

        setSelectedStudents(new Set());
    };

    const handleBulkReviewImprove = async () => {
        const targets = Array.from(selectedStudents)
            .map((studentId) => {
                const student = students.find((item) => item.id === studentId);
                const record = getStudentRecord(studentId);
                const teachingClass = student ? getTeachingClassForStudent(student) : undefined;

                if (!student || !record?.content?.trim() || !teachingClass) {
                    return null;
                }

                return { student, record, teachingClass };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

        if (targets.length === 0) {
            alert('점검·개선할 세특 내용이 없습니다.');
            return;
        }

        setIsBulkReviewImproving(true);

        let improvedCount = 0;
        let unchangedCount = 0;
        let cautionOrReviseCount = 0;
        let failureCount = 0;

        await mapWithConcurrency(targets, DEFAULT_CONCURRENCY_LIMIT, async ({ student, record, teachingClass }) => {
            try {
                const review = await reviewAndImproveRecord({
                    recordText: record.content,
                    schoolLevel: inferSchoolLevel(student.school || teacher?.school),
                    category: '교과학습발달상황',
                    year: new Date().getFullYear(),
                    subjectName: teachingClass.subjectName || teacher?.subject,
                });

                const nextContent = review.improvedDraft?.trim() || record.content;
                const contentChanged = nextContent !== record.content;
                if (contentChanged) improvedCount += 1;
                else unchangedCount += 1;

                if (review.status !== 'pass') {
                    cautionOrReviseCount += 1;
                }

                updateRecord({
                    ...record,
                    classId: teachingClass.id,
                    teacherKey: teacher?.teacherKey,
                    semester: currentSemester,
                    content: nextContent,
                    status: review.status === 'pass' && !contentChanged && record.status === 'confirmed'
                        ? 'confirmed'
                        : 'checked',
                    lastUpdated: new Date().toISOString(),
                }, 'improve');
            } catch (error) {
                failureCount += 1;
                console.error('Review and improve failed', record.studentId, error);
            }
        });

        setIsBulkReviewImproving(false);
        setSelectedStudents(new Set());

        const summaryLines = [
            `점검·개선 완료: ${targets.length}건`,
            `개선본 반영: ${improvedCount}건`,
            `원문 유지: ${unchangedCount}건`,
        ];

        if (cautionOrReviseCount > 0) {
            summaryLines.push(`주의 이상 판정: ${cautionOrReviseCount}건`);
        }

        if (failureCount > 0) {
            summaryLines.push(`실패: ${failureCount}건`);
        }

        alert(summaryLines.join('\n'));
    };

    const handleBulkSpellCheck = async () => {
        const toCheck = Array.from(selectedStudents);
        if (toCheck.length === 0) {
            alert('Select students for spell check.');
            return;
        }

        setIsBulkChecking(true);

        let firstRecordWithErrors: SubjectRecord | null = null;
        let firstErrors: SpellError[] = [];
        let totalErrorCount = 0;
        let affectedRecordCount = 0;

        await mapWithConcurrency(toCheck, DEFAULT_CONCURRENCY_LIMIT, async (studentId) => {
            const record = getStudentRecord(studentId);
            if (!record || !record.content) return;
            const errors = await performSpellCheck(record.content);
            const updatedRecord = applyCheckResultToRecord(record, { spellerErrors: errors.length });
            updateRecord(updatedRecord);

            if (errors.length > 0) {
                totalErrorCount += errors.length;
                affectedRecordCount += 1;
                if (!firstRecordWithErrors) {
                    firstRecordWithErrors = updatedRecord;
                    firstErrors = errors;
                }
            }
        });

        setIsBulkChecking(false);

        if (firstRecordWithErrors) {
            setSpellCheckTarget(firstRecordWithErrors);
            setSpellErrors(firstErrors);
            alert(`Spell check done: ${affectedRecordCount} students, ${totalErrorCount} issues.`);
        } else {
            alert('Spell check done: no issues found.');
        }
    };

    const handleBulkForbiddenCheck = async () => {
        const toCheck = Array.from(selectedStudents);
        if (toCheck.length === 0) {
            alert('Select students for forbidden-word check.');
            return;
        }

        setIsBulkChecking(true);

        const results = new Map<string, { word: string; suggestion: string; reason: string }[]>();
        let foundCount = 0;

        await mapWithConcurrency(toCheck, DEFAULT_CONCURRENCY_LIMIT, async (studentId) => {
            const record = getStudentRecord(studentId);
            if (!record || !record.content) return;
            const issues = await checkForbiddenWords(record.content, forbiddenWords);
            const updatedRecord = applyCheckResultToRecord(record, { forbiddenWords: issues.length });
            updateRecord(updatedRecord);
            if (issues.length > 0) {
                results.set(studentId, issues);
                foundCount += issues.length;
            }
        });

        setForbiddenResults(results);
        setIsBulkChecking(false);
        if (foundCount > 0) setIsForbiddenModalOpen(true);
        else alert('Forbidden-word check done: no issues found.');
    };

    const handleDeleteLearningData = () => {
        const toDelete = Array.from(selectedStudents);
        if (toDelete.length === 0) {
            alert('Select students to delete AI input data.');
            return;
        }

        if (!confirm(`Delete AI input data for ${toDelete.length} students?`)) return;

        toDelete.forEach((studentId) => {
            const student = students.find((item) => item.id === studentId);
            if (!student) return;
            const teachingClass = getTeachingClassForStudent(student);
            updateStudentLearningData(studentId, { customData: '' }, teachingClass?.id);
        });
        setSelectedStudents(new Set());
    };

    const handleBulkCompetencyAnalysis = async () => {
        const targets = Array.from(selectedStudents)
            .map((studentId) => getStudentRecord(studentId))
            .filter((record): record is SubjectRecord => !!record && !!record.content && record.content.length >= 10);

        if (targets.length === 0) {
            alert('No record content available for analysis.');
            return;
        }

        setIsCompetencyAnalyzing(true);
        await mapWithConcurrency(targets, DEFAULT_CONCURRENCY_LIMIT, async (record) => {
            try {
                const response = await fetch('/api/competency', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: record.content }),
                });
                if (!response.ok) return;
                const data = await response.json();
                if (!data.segments || data.segments.length === 0) return;

                updateRecord({
                    ...record,
                    competencyAnalysis: {
                        segments: data.segments as CompetencySegment[],
                        analyzedAt: new Date().toISOString(),
                        contentHash: getContentHash(record.content),
                    },
                });
            } catch (error) {
                console.error('Competency analysis failed', record.studentId, error);
            }
        });
        setIsCompetencyAnalyzing(false);
    };

    const handleSimilarityCheck = async () => {
        const targets = similarityTargetStudents
            .map((student) => {
                const record = getStudentRecord(student.id);
                if (!record?.content) return null;
                return { student, record };
            })
            .filter((item): item is { student: typeof students[number]; record: SubjectRecord } => !!item);

        if (targets.length < 2) {
            alert('Need at least 2 records with content for similarity check.');
            return;
        }

        setIsCheckingSimilarity(true);
        try {
            const contents = targets.map(({ student, record }) => ({
                studentId: student.id,
                studentName: student.name,
                content: record.content,
            }));

            const response = await fetch('/api/similarity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents, threshold: 0.9 }),
            });

            if (!response.ok) return;
            const data = await response.json();
            if (!data.results || data.results.length === 0) {
                alert('다른 학생 사이에서 90% 이상 동일한 문장은 발견되지 않았습니다.');
                return;
            }

            setSimilarityResults(data.results);
            setSimilaritySuggestions(new Map());
            setIsSimilarityModalOpen(true);
        } catch (error) {
            console.error('Similarity check failed', error);
        } finally {
            setIsCheckingSimilarity(false);
        }
    };

    const handleBulkAdjust = async (direction: 'expand' | 'shorten') => {
        const targets = Array.from(selectedStudents)
            .map((studentId) => getStudentRecord(studentId))
            .filter((record): record is SubjectRecord => !!record && !!record.content);

        if (targets.length === 0) {
            alert('No selected records to adjust.');
            return;
        }

        setIsBulkAdjusting(true);
        await mapWithConcurrency(targets, DEFAULT_CONCURRENCY_LIMIT, async (record) => {
            try {
                const response = await fetch('/api/adjust', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: record.content, direction }),
                });
                if (!response.ok) return;
                const data = await response.json();
                if (!data.content) return;

                updateRecord({
                    ...record,
                    content: data.content,
                    lastUpdated: new Date().toISOString(),
                }, direction === 'expand' ? 'expand' : 'shorten');
            } catch (error) {
                console.error('Bulk adjust failed', record.studentId, error);
            }
        });
        setIsBulkAdjusting(false);
        setSelectedStudents(new Set());
    };

    const handleApplySpellChanges = (newText: string) => {
        if (!spellCheckTarget) return;
        const updatedRecord = applyCheckResultToRecord(spellCheckTarget, { spellerErrors: 0 }, newText);
        updateRecord(updatedRecord);
    };

    const closeSpellCheck = () => {
        setSpellCheckTarget(null);
        setSpellErrors([]);
    };

    const startEdit = (studentId: string, field: 'data' | 'content', value: string) => {
        setEditingCell({ studentId, field });
        setEditValue(value);
    };

    const saveEdit = (studentId: string, field: 'data' | 'content') => {
        const student = students.find((item) => item.id === studentId);
        if (!student) {
            setEditingCell(null);
            return;
        }

        if (field === 'data') {
            const teachingClass = getTeachingClassForStudent(student);
            updateStudentLearningData(studentId, { customData: editValue }, teachingClass?.id);
            setEditingCell(null);
            return;
        }

        const record = getStudentRecord(studentId);
        const teachingClass = getTeachingClassForStudent(student);
        if (!teachingClass) {
            setEditingCell(null);
            return;
        }
        if (record) {
            updateRecord({
                ...record,
                classId: teachingClass.id,
                teacherKey: teacher?.teacherKey,
                semester: currentSemester,
                content: editValue,
                lastUpdated: new Date().toISOString(),
            }, 'manual');
        } else {
            updateRecord({
                id: `r-${teacher?.teacherKey || 'teacher'}-${teachingClass.id}-${studentId}-${currentSemester}`,
                studentId,
                classId: teachingClass.id,
                teacherKey: teacher?.teacherKey,
                semester: currentSemester,
                content: editValue,
                status: 'draft',
                lastUpdated: new Date().toISOString(),
            }, 'manual');
        }
        setEditingCell(null);
    };

    const getSubjectName = (student: typeof students[number]) => {
        const cls = getTeachingClassForStudent(student);
        const year = new Date().getFullYear();
        const semesterLabel = selectedSemester === '1' ? '1' : '2';
        return `${year} ${semesterLabel}학기\n${cls?.subjectName || ''}`;
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>AI 세특 작성기</h1>
                    <div className={styles.semesterToggle}>
                        <button className={`${styles.semesterBtn} ${selectedSemester === '1' ? styles.semesterBtnActive : ''}`} onClick={() => setSelectedSemester('1')}>
                            1학기
                        </button>
                        <button className={`${styles.semesterBtn} ${selectedSemester === '2' ? styles.semesterBtnActive : ''}`} onClick={() => setSelectedSemester('2')}>
                            2학기
                        </button>
                    </div>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="ghost" onClick={() => { window.location.href = '/settings/ai'; }}>
                        <Settings size={18} />
                        AI 설정
                    </Button>
                </div>
            </header>

            <motion.div className={styles.mainContent} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <WriteToolbar
                    gradeClassTabs={gradeClassTabs}
                    selectedGradeClass={selectedGradeClass}
                    onGradeClassChange={setSelectedGradeClass}
                    totalCount={totalTeacherStudents}
                    selectedCount={selectedStudents.size}
                    isAllSelected={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                    onToggleSelectAll={toggleSelectAll}
                    onGenerate={handleGenerateDrafts}
                    onBulkReviewImprove={handleBulkReviewImprove}
                    onBulkSpellCheck={handleBulkSpellCheck}
                    onBulkForbiddenCheck={handleBulkForbiddenCheck}
                    onBulkCompetencyAnalysis={handleBulkCompetencyAnalysis}
                    onSimilarityCheck={handleSimilarityCheck}
                    similarityTargetLabel={similarityTargetLabel}
                    onBulkAdjust={handleBulkAdjust}
                    onDeleteLearningData={handleDeleteLearningData}
                    isGenerating={generatingIds.size > 0}
                    isBulkReviewImproving={isBulkReviewImproving}
                    isBulkChecking={isBulkChecking}
                    isCompetencyAnalyzing={isCompetencyAnalyzing}
                    isCheckingSimilarity={isCheckingSimilarity}
                    isBulkAdjusting={isBulkAdjusting}
                />

                <div className={styles.tableContainer}>
                    <div className={styles.tableScrollArea}>
                        <table className={styles.dataTable}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={styles.checkboxCell}><input type="checkbox" className={styles.tableCheckbox} checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0} onChange={toggleSelectAll} /></th>
                                    <th className={styles.classCell}>반</th>
                                    <th className={styles.numberCell}>번호</th>
                                    <th className={styles.nameCell}>이름</th>
                                    <th className={styles.subjectCell}>과목</th>
                                    <th className={styles.dataCell}>AI 입력 데이터</th>
                                    <th className={styles.contentCell}>세특 내용</th>
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {filteredStudents.length > 0 ? filteredStudents.map((student) => (
                                    <WriteTableRow
                                        key={student.id}
                                        student={student}
                                        record={getStudentRecord(student.id)}
                                        learningData={getLearningDataForClass(student, getTeachingClassForStudent(student)?.id)}
                                        subjectName={getSubjectName(student)}
                                        isSelected={selectedStudents.has(student.id)}
                                        editingCell={editingCell}
                                        editValue={editValue}
                                        onToggleSelect={toggleStudent}
                                        onStartEdit={startEdit}
                                        onSaveEdit={saveEdit}
                                        onCancelEdit={() => setEditingCell(null)}
                                        onEditValueChange={setEditValue}
                                    />
                                )) : (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>표시할 학생이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                <SpellCheckModal
                    key="spell-check-modal"
                    isOpen={spellCheckTarget !== null && !isChecking && spellErrors.length > 0}
                    onClose={closeSpellCheck}
                    errors={spellErrors}
                    originalText={spellCheckTarget?.content || ''}
                    onApplyChanges={handleApplySpellChanges}
                />
                <ForbiddenCheckModal
                    key="forbidden-check-modal"
                    isOpen={isForbiddenModalOpen}
                    onClose={() => setIsForbiddenModalOpen(false)}
                    results={forbiddenResults}
                    studentNames={studentNameMap}
                />
                <SimilarityModal
                    key="similarity-modal"
                    isOpen={isSimilarityModalOpen}
                    onClose={() => setIsSimilarityModalOpen(false)}
                    results={similarityResults}
                    suggestions={similaritySuggestions}
                    onSuggestionReady={(pairKey, suggestion) => {
                        setSimilaritySuggestions((prev) => new Map(prev).set(pairKey, suggestion));
                    }}
                    getContentByStudentId={(studentId) => getStudentRecord(studentId)?.content || ''}
                />
            </AnimatePresence>
        </div>
    );
}

export default function WritePage() {
    return (
        <Suspense fallback={<WritePageLoading />}>
            <WritePageContent />
        </Suspense>
    );
}
