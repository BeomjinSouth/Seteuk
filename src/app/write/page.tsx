'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Loader2, Settings, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpellCheckModal, SpellError } from '@/components/SpellCheckModal';
import { ForbiddenCheckModal } from '@/components/ForbiddenCheckModal';
import { SimilarityModal, SimilarityResult } from '@/components/SimilarityModal';
import { getContentHash } from '@/components/KeywordHighlighter';
import { useAppStore } from '@/lib/store';
import { SubjectRecord, CompetencySegment } from '@/types';
import type { OCREvaluation, StudentGradingResult } from '@/types/ocr';
import { generateDraft, generateDraftBatch, performSpellCheck, checkForbiddenWords, reviewAndImproveRecord } from '@/lib/write-logic';
import { applyCheckResultToRecord } from '@/lib/check-utils';
import { getRecordByStudentSemester } from '@/lib/record-utils';
import { DEFAULT_CONCURRENCY_LIMIT, mapWithConcurrency } from '@/lib/concurrency';
import {
    DEFAULT_CURRICULUM_UNITS,
    buildCurriculumGenerationContext,
    getCurriculumUnitsForSubject,
    mergeCurriculumUnits,
} from '@/lib/curriculum-context';
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

const PAGE_SIZE_OPTIONS = [10, 20, 50];

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
        curriculumUnitOverrides,
        classCurriculumSelections,
        setClassCurriculumSelection,
        getClassCurriculumSelection,
    } = useAppStore();

    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('1');
    const [selectedGradeClass, setSelectedGradeClass] = useState<string>(classFilter || 'all');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
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
    const [competencyAnalyzingIds, setCompetencyAnalyzingIds] = useState<Set<string>>(new Set());
    const [isCheckingSimilarity, setIsCheckingSimilarity] = useState(false);
    const [isBulkAdjusting, setIsBulkAdjusting] = useState(false);
    const [isBulkReviewImproving, setIsBulkReviewImproving] = useState(false);
    const [similarityResults, setSimilarityResults] = useState<SimilarityResult[]>([]);
    const [isSimilarityModalOpen, setIsSimilarityModalOpen] = useState(false);
    const [similaritySuggestions, setSimilaritySuggestions] = useState<Map<string, { similarityAnalysis: string; student1Suggestion: string; student2Suggestion: string }>>(new Map());

    const currentSemester: 1 | 2 = selectedSemester === '1' ? 1 : 2;
    const isCompetencyAnalyzing = competencyAnalyzingIds.size > 0;
    const currentTeacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher, selectedSemester),
        [classes, selectedSemester, teacher]
    );
    const mergedCurriculumUnits = useMemo(
        () => mergeCurriculumUnits(DEFAULT_CURRICULUM_UNITS, curriculumUnitOverrides),
        [curriculumUnitOverrides]
    );
    const selectedTeachingClass = useMemo(
        () => selectedGradeClass === 'all'
            ? undefined
            : currentTeacherClasses.find((cls) => cls.id === selectedGradeClass),
        [currentTeacherClasses, selectedGradeClass]
    );
    const selectedClassUnits = useMemo(() => {
        if (!selectedTeachingClass) return [];
        return getCurriculumUnitsForSubject({
            units: mergedCurriculumUnits,
            grade: selectedTeachingClass.grade,
            semester: currentSemester,
            subjectName: selectedTeachingClass.subjectName || '',
        });
    }, [currentSemester, mergedCurriculumUnits, selectedTeachingClass]);
    const selectedClassSelection = useMemo(
        () => selectedTeachingClass
            ? getClassCurriculumSelection(selectedTeachingClass.id, currentSemester)
            : undefined,
        [classCurriculumSelections, currentSemester, getClassCurriculumSelection, selectedTeachingClass]
    );
    const selectedClassUnitIds = useMemo(
        () => new Set(selectedClassSelection?.unitIds || []),
        [selectedClassSelection]
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

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(filteredStudents.length / pageSize)),
        [filteredStudents.length, pageSize]
    );

    const paginatedStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredStudents.slice(startIndex, startIndex + pageSize);
    }, [currentPage, filteredStudents, pageSize]);

    const visiblePageNumbers = useMemo(() => {
        const maxVisible = 4;
        const maxStart = Math.max(1, totalPages - maxVisible + 1);
        const start = Math.min(Math.max(1, currentPage - 1), maxStart);
        const end = Math.min(totalPages, start + maxVisible - 1);
        return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }, [currentPage, totalPages]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedGradeClass, selectedSemester, pageSize]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(page, totalPages));
    }, [totalPages]);
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

    const togglePageStudents = () => {
        if (paginatedStudents.length === 0) return;

        setSelectedStudents((prev) => {
            const next = new Set(prev);
            const isCurrentPageSelected = paginatedStudents.every((student) => next.has(student.id));

            if (isCurrentPageSelected) {
                paginatedStudents.forEach((student) => next.delete(student.id));
                return next;
            }

            paginatedStudents.forEach((student) => next.add(student.id));
            return next;
        });
    };

    const handleGradeClassChange = (value: string) => {
        setSelectedGradeClass(value);
        setSelectedStudents(new Set());
    };

    const handleToggleCurriculumUnit = (unitId: string) => {
        if (!selectedTeachingClass) return;

        const current = getClassCurriculumSelection(selectedTeachingClass.id, currentSemester)?.unitIds || [];
        const next = current.includes(unitId)
            ? current.filter((id) => id !== unitId)
            : [...current, unitId];

        setClassCurriculumSelection(selectedTeachingClass.id, currentSemester, next);
    };

    const isCurrentPageSelected = paginatedStudents.length > 0
        && paginatedStudents.every((student) => selectedStudents.has(student.id));

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }
        setCurrentPage(page);
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

        let fallbackCount = 0;
        let failureCount = 0;
        const failedNames: string[] = [];

        if (toGenerate.length > 1) {
            try {
                const batchTargets = (await Promise.all(toGenerate.map(async (studentId) => {
                    const student = students.find((item) => item.id === studentId);
                    if (!student) return null;

                    const teachingClass = getTeachingClassForStudent(student);
                    if (!teachingClass) return null;

                    const studentGrade = student.grade || teachingClass.grade || 1;
                    const curriculumData = getCurriculumContent(studentGrade, currentSemester);
                    const curriculumContext = buildCurriculumGenerationContext({
                        units: mergedCurriculumUnits,
                        grade: studentGrade,
                        semester: currentSemester,
                        subjectName: teachingClass.subjectName || '',
                        selectedUnitIds: getClassCurriculumSelection(teachingClass.id, currentSemester)?.unitIds || [],
                    });
                    const evaluations = await getOcrEvaluations(studentGrade, currentSemester);

                    let matchedEvaluation: OCREvaluation | undefined;
                    let matchedStudentResult: StudentGradingResult | undefined;
                    let standardsOnlyEvaluation: OCREvaluation | undefined;

                    for (const evaluation of evaluations) {
                        const results = evaluation.batchGradingResult?.results || [];
                        const byId = results.find((result) => result.studentId === studentId);
                        if (byId) {
                            matchedEvaluation = evaluation;
                            matchedStudentResult = byId;
                            break;
                        }
                        if (!matchedStudentResult) {
                            const byName = results.filter((result) => result.studentName === student.name);
                            if (byName.length === 1) {
                                matchedEvaluation = evaluation;
                                matchedStudentResult = byName[0];
                            }
                        }
                        if (!standardsOnlyEvaluation
                            && (evaluation.achievementStandards?.length > 0 || evaluation.scoringCriteria?.length > 0)) {
                            standardsOnlyEvaluation = evaluation;
                        }
                    }

                    const contextEvaluation = matchedEvaluation || standardsOnlyEvaluation;
                    const ocrEvaluationContext = contextEvaluation
                        ? {
                            achievementStandards: contextEvaluation.achievementStandards,
                            scoringCriteria: contextEvaluation.scoringCriteria,
                            studentResult: matchedStudentResult,
                        }
                        : undefined;

                    return {
                        student,
                        teachingClass,
                        draftInput: {
                            studentId,
                            studentName: student.name,
                            subjectName: teachingClass.subjectName || '',
                            learningData: getLearningDataForClass(student, teachingClass.id),
                            curriculumContent: curriculumData?.content,
                            ocrEvaluationContext,
                            context: {
                                teacherKey: teacher?.teacherKey,
                                classId: teachingClass.id,
                                gradeLevel: studentGrade,
                                semester: currentSemester,
                                curriculumContext,
                            },
                        },
                    };
                }))).filter((item): item is NonNullable<typeof item> => item !== null);

                const batchResults = await generateDraftBatch(
                    batchTargets.map((target) => target.draftInput),
                    exampleTemplate,
                );

                batchTargets.forEach(({ student, teachingClass }) => {
                    const result = batchResults.get(student.id);
                    if (!result) {
                        failureCount += 1;
                        failedNames.push(student.name);
                        return;
                    }

                    if (result.fallback) {
                        fallbackCount += 1;
                        failedNames.push(student.name);
                        return;
                    }

                    updateRecord({
                        id: `r-${teacher?.teacherKey || 'teacher'}-${teachingClass.id}-${student.id}-${currentSemester}`,
                        studentId: student.id,
                        classId: teachingClass.id,
                        teacherKey: teacher?.teacherKey,
                        semester: currentSemester,
                        content: result.content,
                        status: 'draft',
                        lastUpdated: new Date().toISOString(),
                    }, 'ai');
                });

                setGeneratingIds(new Set());
                setSelectedStudents(new Set());

                if (fallbackCount > 0 || failureCount > 0) {
                    const lines = [`AI ?? ???: ${fallbackCount + failureCount}? (${failedNames.join(', ')})`];
                    if (fallbackCount > 0) lines.push(`- AI ???? ???? ??: ${fallbackCount}?`);
                    if (failureCount > 0) lines.push(`- ?? ? ?? ??: ${failureCount}?`);
                    lines.push('?? ??? ??? ???? ?????. ?? ? ?? ??? ???.');
                    alert(lines.join('\n'));
                }
                return;
            } catch (error) {
                console.error('Batch generation failed, falling back to single-student generation:', error);
            }
        }

        await mapWithConcurrency(toGenerate, DEFAULT_CONCURRENCY_LIMIT, async (studentId) => {
            const student = students.find((item) => item.id === studentId);
            if (!student) return;

            try {
                const teachingClass = getTeachingClassForStudent(student);
                if (!teachingClass) return;

                const studentGrade = student.grade || teachingClass.grade || 1;
                const curriculumData = getCurriculumContent(studentGrade, currentSemester);
                const curriculumContext = buildCurriculumGenerationContext({
                    units: mergedCurriculumUnits,
                    grade: studentGrade,
                    semester: currentSemester,
                    subjectName: teachingClass.subjectName || '',
                    selectedUnitIds: getClassCurriculumSelection(teachingClass.id, currentSemester)?.unitIds || [],
                });
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
                        gradeLevel: studentGrade,
                        curriculumContext,
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
                console.error('Generation failed:', error);
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
                console.error('Review and improve failed:', error);
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

    const analyzeCompetencyRecord = async (record: SubjectRecord) => {
        setCompetencyAnalyzingIds((prev) => new Set(prev).add(record.studentId));
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
            console.error('Competency analysis failed:', error);
        } finally {
            setCompetencyAnalyzingIds((prev) => {
                const next = new Set(prev);
                next.delete(record.studentId);
                return next;
            });
        }
    };

    const handleAnalyzeCompetency = (studentId: string) => {
        const record = getStudentRecord(studentId);
        if (!record?.content || record.content.length < 10) {
            alert('분석할 세특 내용이 충분하지 않습니다.');
            return;
        }

        void analyzeCompetencyRecord(record);
    };

    const handleBulkCompetencyAnalysis = async () => {
        const targets = Array.from(selectedStudents)
            .map((studentId) => getStudentRecord(studentId))
            .filter((record): record is SubjectRecord => !!record && !!record.content && record.content.length >= 10);

        if (targets.length === 0) {
            alert('No record content available for analysis.');
            return;
        }

        await mapWithConcurrency(targets, DEFAULT_CONCURRENCY_LIMIT, analyzeCompetencyRecord);
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
                console.error('Bulk adjust failed:', error);
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
                    <h1>
                        AI 세특 작성기
                        <Sparkles size={26} className={styles.titleSparkle} />
                    </h1>
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
                    <Button variant="secondary" className={styles.aiSettingsButton} onClick={() => { window.location.href = '/settings/ai'; }}>
                        <Settings size={18} />
                        AI 설정
                    </Button>
                </div>
            </header>

            <motion.div className={styles.mainContent} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <WriteToolbar
                    gradeClassTabs={gradeClassTabs}
                    selectedGradeClass={selectedGradeClass}
                    onGradeClassChange={handleGradeClassChange}
                    totalCount={totalTeacherStudents}
                    selectedCount={selectedStudents.size}
                    isAllSelected={isCurrentPageSelected}
                    onToggleSelectAll={togglePageStudents}
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

                <section className={`${styles.curriculumContextPanel} ${!selectedTeachingClass ? styles.curriculumContextPanelMuted : ''}`}>
                    <div className={styles.curriculumContextHeader}>
                        <div>
                            <span className={styles.curriculumContextLabel}>
                                <BookOpen size={16} />
                                단원 context
                            </span>
                            <strong>
                                {selectedTeachingClass
                                    ? `${selectedTeachingClass.grade}학년 ${currentSemester}학기 ${selectedTeachingClass.subjectName || '교과 미지정'}`
                                    : '반을 선택하면 단원 context를 지정할 수 있습니다'}
                            </strong>
                        </div>
                        {selectedTeachingClass && (
                            <span className={styles.curriculumContextCount}>
                                {selectedClassUnitIds.size}개 선택
                            </span>
                        )}
                    </div>

                    {selectedTeachingClass ? (
                        selectedClassUnits.length > 0 ? (
                            <div className={styles.curriculumUnitChips}>
                                {selectedClassUnits.map((unit) => {
                                    const isSelected = selectedClassUnitIds.has(unit.id);
                                    return (
                                        <button
                                            type="button"
                                            key={unit.id}
                                            className={`${styles.curriculumUnitChip} ${isSelected ? styles.curriculumUnitChipActive : ''}`}
                                            onClick={() => handleToggleCurriculumUnit(unit.id)}
                                            aria-pressed={isSelected}
                                            title={unit.learningFocus || unit.concepts.join(', ')}
                                        >
                                            <span>{unit.unit}</span>
                                            <small>{unit.concepts.slice(0, 3).join(' · ')}</small>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={styles.curriculumContextEmpty}>
                                이 학년·학기·교과에 등록된 단원이 없습니다. /examples의 단원 context 관리에서 JSON을 가져오거나 단원을 수정하세요.
                            </p>
                        )
                    ) : (
                        <p className={styles.curriculumContextEmpty}>
                            전체 탭에서는 반별 단원 선택을 바꾸지 않습니다. 생성 시에는 각 학생이 속한 반에 저장된 단원 선택을 사용합니다.
                        </p>
                    )}
                </section>

                <div className={styles.tableContainer}>
                    <div className={styles.tableScrollArea}>
                        <table className={styles.dataTable}>
                            <thead className={styles.tableHeader}>
                                <tr>
                                    <th className={styles.checkboxCell}><input type="checkbox" className={styles.tableCheckbox} checked={isCurrentPageSelected} onChange={togglePageStudents} /></th>
                                    <th className={styles.classCell}>반</th>
                                    <th className={styles.numberCell}>번호</th>
                                    <th className={styles.nameCell}>이름</th>
                                    <th className={styles.subjectCell}>과목</th>
                                    <th className={styles.dataCell}>
                                        <span className={styles.headerWithInfo}>AI 입력 데이터 <span className={styles.infoHint}>i</span></span>
                                    </th>
                                    <th className={styles.contentCell}>
                                        <span className={styles.headerWithInfo}>세특 내용 <span className={styles.infoHint}>i</span></span>
                                    </th>
                                    <th className={styles.actionCell} aria-label="행 작업" />
                                </tr>
                            </thead>
                            <tbody className={styles.tableBody}>
                                {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
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
                                        onAnalyzeCompetency={handleAnalyzeCompetency}
                                        isCompetencyAnalyzing={competencyAnalyzingIds.has(student.id)}
                                    />
                                )) : (
                                    <tr><td colSpan={8} className={styles.emptyTableCell}>표시할 학생이 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.tableFooter}>
                        <div className={styles.footerLeft}>
                            <span>전체 {filteredStudents.length}명</span>
                            <label className={styles.pageSizeSelectWrap}>
                                <select
                                    value={pageSize}
                                    onChange={(event) => setPageSize(Number(event.target.value))}
                                    className={styles.pageSizeSelect}
                                    aria-label="페이지당 학생 수"
                                >
                                    {PAGE_SIZE_OPTIONS.map((option) => (
                                        <option key={option} value={option}>{option}명씩 보기</option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <nav className={styles.pagination} aria-label="학생 목록 페이지">
                            <button
                                type="button"
                                className={styles.pageNavButton}
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="이전 페이지"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            {visiblePageNumbers.map((page) => (
                                <button
                                    type="button"
                                    key={page}
                                    className={`${styles.pageNumberButton} ${page === currentPage ? styles.pageNumberButtonActive : ''}`}
                                    onClick={() => goToPage(page)}
                                    aria-current={page === currentPage ? 'page' : undefined}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={styles.pageNavButton}
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="다음 페이지"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </nav>
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
