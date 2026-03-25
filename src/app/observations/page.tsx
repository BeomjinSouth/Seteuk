'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList,
    Search,
    Calendar,
    User,
    FileText,
    Trash2,
    Eye,
    X,
    ScanLine,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Plus,
    BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { Observation, Assessment, Student } from '@/types';
import { getTeacherClasses, getStudentsInTeachingClass } from '@/lib/teacher-context';
import styles from './page.module.css';

const EXTRA_OBSERVATION_TAG_OPTIONS = ['참여', '발표', '협력', '성장', '질문', '탐구', '자기주도', '성찰'];

const OBSERVATION_TAG_OPTIONS = ['문제해결', '추론', '창의·융합', '의사소통', '정보처리', '태도'];

interface ObservationDraftRow {
    date: string;
    lessonTopic: string;
    tags: string[];
    memo: string;
}

function createEmptyDraft(date: string): ObservationDraftRow {
    return {
        date,
        lessonTopic: '',
        tags: [],
        memo: '',
    };
}

function ObservationsPageContent() {
    const searchParams = useSearchParams();
    const initialClassId = searchParams.get('classId') || '';
    const initialStudentIds = useMemo(() => {
        const queryIds = (searchParams.get('studentIds') || '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
        const singleStudentId = searchParams.get('studentId') || '';
        const fallbackIds = singleStudentId ? [singleStudentId] : [];
        return Array.from(new Set(queryIds.length > 0 ? queryIds : fallbackIds));
    }, [searchParams]);
    const initialStudentId = initialStudentIds.length === 1 ? initialStudentIds[0] || '' : '';
    const { students, classes, teacher } = useAppStore();
    const teacherClasses = useMemo(
        () => getTeacherClasses(classes, teacher),
        [classes, teacher]
    );

    const [observations, setObservations] = useState<Observation[]>([]);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(initialClassId);
    const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [selectedEvidenceType, setSelectedEvidenceType] = useState('');
    const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [formClassId, setFormClassId] = useState(initialClassId);
    const [formStudentIds, setFormStudentIds] = useState<string[]>(initialStudentIds);
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [studentDrafts, setStudentDrafts] = useState<Record<string, ObservationDraftRow>>({});
    const [customTagOptions, setCustomTagOptions] = useState<string[]>([]);
    const [customTagInputs, setCustomTagInputs] = useState<Record<string, string>>({});

    const itemsPerPage = 10;
    const availableTagOptions = useMemo(
        () => Array.from(new Set([...OBSERVATION_TAG_OPTIONS, ...EXTRA_OBSERVATION_TAG_OPTIONS, ...customTagOptions])),
        [customTagOptions]
    );

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!formClassId && teacherClasses.length > 0) {
            setFormClassId(initialClassId || teacherClasses[0].id);
        }
    }, [formClassId, initialClassId, teacherClasses]);

    useEffect(() => {
        if (!formClassId) {
            setFormStudentIds([]);
            return;
        }

        const studentsInClass = getStudentsForClass(formClassId);
        if (studentsInClass.length === 0) {
            setFormStudentIds([]);
            return;
        }

        const availableStudentIds = new Set(studentsInClass.map((student) => student.id));
        const queryStudentIds = initialStudentIds.filter((studentId) => availableStudentIds.has(studentId));

        setFormStudentIds((prev) => {
            const next = prev.filter((studentId) => availableStudentIds.has(studentId));
            if (next.length > 0) return next;
            if (queryStudentIds.length > 0) return queryStudentIds;
            return [studentsInClass[0].id];
        });
    }, [formClassId, initialStudentIds, students, teacherClasses]);

    useEffect(() => {
        setStudentDrafts((prev) => {
            const next: Record<string, ObservationDraftRow> = {};
            formStudentIds.forEach((studentId) => {
                next[studentId] = prev[studentId] || createEmptyDraft(today);
            });
            return next;
        });
    }, [formStudentIds, today]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [obsRes, assessRes] = await Promise.all([
                fetch('/api/observations'),
                fetch('/api/assessments'),
            ]);

            const obsData = await obsRes.json();
            const assessData = await assessRes.json();

            if (obsData.success) {
                setObservations(obsData.data);
            }
            if (assessData.success) {
                setAssessments(assessData.data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStudentsForClass = (classId: string) => {
        const targetClass = teacherClasses.find((cls) => cls.id === classId);
        if (!targetClass) return [];
        return getStudentsInTeachingClass(students, targetClass);
    };

    const scopedStudents = useMemo(() => {
        if (selectedClassId) return getStudentsForClass(selectedClassId);

        const map = new Map<string, Student>();
        teacherClasses.forEach((cls) => {
            getStudentsInTeachingClass(students, cls).forEach((student) => {
                map.set(student.id, student);
            });
        });
        return Array.from(map.values()).sort((a, b) => a.number - b.number);
    }, [selectedClassId, students, teacherClasses]);

    const formStudents = useMemo(
        () => formClassId ? getStudentsForClass(formClassId) : [],
        [formClassId, students, teacherClasses]
    );

    const targetClass = useMemo(
        () => teacherClasses.find((cls) => cls.id === formClassId),
        [formClassId, teacherClasses]
    );

    const selectedTargetStudents = useMemo(
        () => formStudents
            .filter((student) => formStudentIds.includes(student.id))
            .sort((a, b) => a.number - b.number),
        [formStudentIds, formStudents]
    );

    const isTeacherObservation = (obs: Observation) => {
        if (!teacher) return false;
        if (obs.teacherKey) return obs.teacherKey === teacher.teacherKey;
        const student = students.find((item) => item.id === obs.studentId);
        return student?.school === teacher.school;
    };

    const filteredObservations = useMemo(() => {
        return observations
            .filter(isTeacherObservation)
            .filter((obs) => !selectedClassId || obs.classId === selectedClassId)
            .filter((obs) => !selectedStudentId || obs.studentId === selectedStudentId)
            .filter((obs) => {
                if (!selectedAssessmentId) return true;
                if (selectedAssessmentId === 'none') return !obs.assessmentId;
                return obs.assessmentId === selectedAssessmentId;
            })
            .filter((obs) => !selectedEvidenceType || obs.evidenceType === selectedEvidenceType)
            .filter((obs) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return [
                    getStudentDisplay(obs.studentId),
                    obs.memo,
                    obs.lessonTopic || '',
                ].join(' ').toLowerCase().includes(query);
            })
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [observations, searchQuery, selectedAssessmentId, selectedClassId, selectedEvidenceType, selectedStudentId, students, teacher]);

    const totalPages = Math.ceil(filteredObservations.length / itemsPerPage);
    const paginatedObservations = filteredObservations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStudentDisplay = (studentId: string): string => {
        const student = students.find((item) => item.id === studentId);
        if (!student) return '알 수 없는 학생';
        return `${student.grade || ''}학년 ${student.classNumber || ''}반 ${student.number}번 ${student.name}`;
    };

    const getComposeStudentLabel = (student: Student): string => `${student.number}번 ${student.name}`;

    const getClassDisplay = (classId?: string) => {
        if (!classId) return '미지정 수업';
        const targetClass = teacherClasses.find((cls) => cls.id === classId) || classes.find((cls) => cls.id === classId);
        if (!targetClass) return '미지정 수업';
        return `${targetClass.grade}학년 ${targetClass.classNumber}반 · ${targetClass.subjectName}`;
    };

    const getAssessmentTitle = (assessmentId?: string): string => {
        if (!assessmentId) return '과제 미연결';
        const assessment = assessments.find((item) => item.id === assessmentId);
        return assessment?.title || '알 수 없는 과제';
    };

    const toggleFormStudent = (studentId: string) => {
        setFormStudentIds((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    const toggleAllFormStudents = () => {
        if (formStudents.length === 0) return;
        if (formStudentIds.length === formStudents.length) {
            setFormStudentIds([]);
            return;
        }

        setFormStudentIds(formStudents.map((student) => student.id));
    };

    const updateStudentDraft = (
        studentId: string,
        field: 'date' | 'lessonTopic' | 'memo',
        value: string
    ) => {
        setStudentDrafts((prev) => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] ?? createEmptyDraft(today)),
                [field]: value,
            },
        }));
    };

    const toggleStudentTag = (studentId: string, tag: string) => {
        const normalizedTag = tag.trim();
        if (!normalizedTag) return;

        setStudentDrafts((prev) => {
            const current = prev[studentId] ?? createEmptyDraft(today);
            const hasTag = current.tags.includes(normalizedTag);

            return {
                ...prev,
                [studentId]: {
                    ...current,
                    tags: hasTag
                        ? current.tags.filter((item) => item !== normalizedTag)
                        : [...current.tags, normalizedTag],
                },
            };
        });
    };

    const addCustomTagForStudent = (studentId: string) => {
        const nextTag = (customTagInputs[studentId] || '').trim();
        if (!nextTag) return;

        setCustomTagOptions((prev) => (prev.includes(nextTag) ? prev : [...prev, nextTag]));
        setCustomTagInputs((prev) => ({
            ...prev,
            [studentId]: '',
        }));

        setStudentDrafts((prev) => {
            const current = prev[studentId] ?? createEmptyDraft(today);
            if (current.tags.includes(nextTag)) {
                return prev;
            }

            return {
                ...prev,
                [studentId]: {
                    ...current,
                    tags: [...current.tags, nextTag],
                },
            };
        });
    };

    const handleSaveManualObservation = async () => {
        if (!teacher || !formClassId || selectedTargetStudents.length === 0) {
            alert('수업과 학생을 먼저 선택하세요.');
            return;
        }

        if (!targetClass) {
            alert('수업 정보를 찾을 수 없습니다.');
            return;
        }

        const missingMemoStudents = selectedTargetStudents
            .filter((student) => !studentDrafts[student.id]?.memo?.trim())
            .map((student) => student.name);

        if (missingMemoStudents.length > 0) {
            alert(`기타 메모를 입력하지 않은 학생: ${missingMemoStudents.join(', ')}`);
            return;
        }

        setIsSaving(true);
        try {
            const results = await Promise.all(
                selectedTargetStudents.map(async (student) => {
                    const draft = studentDrafts[student.id];
                    const response = await fetch('/api/observations', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: student.id,
                            classId: formClassId,
                            teacherKey: teacher.teacherKey,
                            subjectName: targetClass.subjectName,
                            lessonTopic: draft.lessonTopic.trim() || undefined,
                            date: draft.date || today,
                            memo: draft.memo.trim(),
                            evidenceType: 'process',
                            tags: draft.tags,
                            sourceType: 'manual',
                        }),
                    });
                    const data = await response.json();
                    return {
                        studentId: student.id,
                        success: response.ok && data.success,
                        error: data.error as string | undefined,
                    };
                })
            );

            const failedResults = results.filter((result) => !result.success);
            if (failedResults.length > 0) {
                const savedCount = results.length - failedResults.length;
                alert(
                    savedCount > 0
                        ? `${savedCount}명 저장, ${failedResults.length}명 실패했습니다.`
                        : failedResults[0]?.error || '저장에 실패했습니다.'
                );
                await fetchData();
                return;
            }

            setStudentDrafts((prev) => {
                const next = { ...prev };
                selectedTargetStudents.forEach((student) => {
                    next[student.id] = {
                        date: today,
                        lessonTopic: '',
                        tags: [],
                        memo: '',
                    };
                });
                return next;
            });
            alert(`${results.length}명에게 수업 기록을 저장했습니다.`);
            setCustomTagInputs({});
            await fetchData();
        } catch (error) {
            console.error('Failed to save observation:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('이 관찰 메모를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/observations?id=${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                setObservations((prev) => prev.filter((item) => item.id !== id));
                if (selectedObservation?.id === id) {
                    setShowDetailModal(false);
                    setSelectedObservation(null);
                }
            }
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedClassId('');
        setSelectedStudentId('');
        setSelectedAssessmentId('');
        setSelectedEvidenceType('');
        setCurrentPage(1);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <div className={styles.titleIcon}>
                            <ClipboardList size={22} />
                        </div>
                        수업 관찰 메모
                    </h1>
                    <p className={styles.subtitle}>
                        수업 기록을 남기고 세특 작성에 연결합니다.
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" onClick={fetchData}>
                        <RefreshCw size={16} />
                        새로고침
                    </Button>
                    <Button onClick={() => window.location.href = '/ocr'}>
                        <ScanLine size={16} />
                        OCR 분석
                    </Button>
                </div>
            </header>

            <section id="compose" className={styles.composeSection}>
                <div className={styles.composeHeader}>
                    <h2><Plus size={18} /> 수업 기록 추가</h2>
                    <span>{teacher?.subject || '과목'} · {teacherClasses.length}개 학급 연결됨</span>
                </div>
                <div className={styles.composeGrid}>
                    <div className={styles.composeField}>
                        <label>수업 학급</label>
                        <select value={formClassId} onChange={(e) => setFormClassId(e.target.value)}>
                            <option value="">수업 선택</option>
                            {teacherClasses.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.year} {cls.semester}학기 · {cls.grade}학년 {cls.classNumber}반
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.composeField}>
                        <label>선택 학생</label>
                        <div className={styles.targetSummary}>
                            {selectedTargetStudents.length > 0
                                ? `${selectedTargetStudents.length}명 선택됨`
                                : '선택된 학생이 없습니다.'}
                        </div>
                    </div>
                    <div className={styles.composeField}>
                        <label>선택 제어</label>
                        <button
                            type="button"
                            className={styles.inlineSelectButton}
                            onClick={toggleAllFormStudents}
                            disabled={formStudents.length === 0}
                        >
                            {formStudents.length > 0 && formStudentIds.length === formStudents.length ? '전체 해제' : '전체 선택'}
                        </button>
                    </div>
                </div>
                <div className={styles.composeField}>
                    <label>기록 대상 선택</label>
                    <div className={styles.studentSelectionGrid}>
                        {formStudents.map((student) => {
                            const isSelected = formStudentIds.includes(student.id);
                            return (
                                <label
                                    key={student.id}
                                    className={`${styles.studentOption} ${isSelected ? styles.studentOptionSelected : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => toggleFormStudent(student.id)}
                                    />
                                    <span>{getComposeStudentLabel(student)}</span>
                                </label>
                            );
                        })}
                    </div>
                    <p className={styles.targetHint}>
                        저장하면 학생별 기록으로 따로 저장됩니다.
                    </p>
                </div>
                <div className={styles.entryList}>
                    {selectedTargetStudents.length === 0 ? (
                        <div className={styles.entryEmpty}>
                            학생을 선택하면 학생별 입력 행이 여기 열립니다.
                        </div>
                    ) : selectedTargetStudents.map((student) => {
                        const draft = studentDrafts[student.id] || createEmptyDraft(today);
                        const selectedTags = draft.tags;

                        return (
                            <div key={student.id} className={styles.entryRow}>
                                <div className={styles.entryHeader}>
                                    <p className={styles.entryStudentName}>{student.name}</p>
                                    <p className={styles.entryStudentMeta}>{student.number}번 학생</p>
                                    <div className={`${styles.entryCell} ${styles.entryCellFull}`}>
                                        <label>학년도</label>
                                        <input type="text" value={String(targetClass?.year || '')} readOnly />
                                    </div>
                                    <div className={styles.entryCell}>
                                        <label>학년</label>
                                        <input type="text" value={String(student.grade || targetClass?.grade || '')} readOnly />
                                    </div>
                                    <div className={styles.entryCell}>
                                        <label>반</label>
                                        <input type="text" value={String(student.classNumber || targetClass?.classNumber || '')} readOnly />
                                    </div>
                                    <div className={styles.entryCell}>
                                        <label>번호</label>
                                        <input type="text" value={String(student.number)} readOnly />
                                    </div>
                                    <div className={`${styles.entryCell} ${styles.entryCellWide}`}>
                                        <label>이름</label>
                                        <input type="text" value={student.name} readOnly />
                                    </div>
                                    <div className={styles.entryCell}>
                                        <label>날짜</label>
                                        <input
                                            type="date"
                                            value={draft.date}
                                            onChange={(e) => updateStudentDraft(student.id, 'date', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className={styles.entryEditorGrid}>
                                    <div className={`${styles.entryCell} ${styles.entryCellWide}`}>
                                        <label>수업 주제</label>
                                        <input
                                            type="text"
                                            value={draft.lessonTopic}
                                            onChange={(e) => updateStudentDraft(student.id, 'lessonTopic', e.target.value)}
                                            placeholder="예: 효소 반응 탐구, 발표 활동"
                                        />
                                    </div>
                                    <div className={styles.entryCell}>
                                        <label>태그</label>
                                        <div className={styles.tagButtonGroup}>
                                            {availableTagOptions.map((tag) => {
                                                const isSelected = selectedTags.includes(tag);
                                                return (
                                                    <button
                                                        key={tag}
                                                        type="button"
                                                        className={`${styles.tagButton} ${isSelected ? styles.tagButtonSelected : ''}`}
                                                        onClick={() => toggleStudentTag(student.id, tag)}
                                                    >
                                                        {tag}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className={styles.customTagRow}>
                                            <input
                                                type="text"
                                                value={customTagInputs[student.id] || ''}
                                                onChange={(e) => setCustomTagInputs((prev) => ({
                                                    ...prev,
                                                    [student.id]: e.target.value,
                                                }))}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addCustomTagForStudent(student.id);
                                                    }
                                                }}
                                                placeholder="태그 직접 추가"
                                            />
                                            <button
                                                type="button"
                                                className={styles.addTagButton}
                                                onClick={() => addCustomTagForStudent(student.id)}
                                            >
                                                <Plus size={14} />
                                                추가
                                            </button>
                                        </div>
                                        {selectedTags.length > 0 && (
                                            <p className={styles.tagSelectionSummary}>
                                                선택됨: {selectedTags.join(', ')}
                                            </p>
                                        )}
                                        <select
                                            className={styles.hiddenTagSelect}
                                            value={selectedTags[0] || ''}
                                            onChange={() => undefined}
                                        >
                                            <option value="">태그 선택</option>
                                            {availableTagOptions.map((tag) => (
                                                <option key={tag} value={tag}>
                                                    {tag}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={`${styles.entryCell} ${styles.entryCellFull}`}>
                                        <label>기타 메모</label>
                                        <textarea
                                            value={draft.memo}
                                            onChange={(e) => updateStudentDraft(student.id, 'memo', e.target.value)}
                                            placeholder="질문, 수행, 발표, 반응을 기록하세요."
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.composeActions}>
                    <Button
                        onClick={handleSaveManualObservation}
                        isLoading={isSaving}
                        disabled={teacherClasses.length === 0 || selectedTargetStudents.length === 0}
                    >
                        <BookOpen size={16} />
                        수업 기록 저장
                    </Button>
                </div>
            </section>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{filteredObservations.length}</span>
                    <span className={styles.statLabel}>표시 중 메모</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>
                        {filteredObservations.filter((item) => item.sourceType === 'manual').length}
                    </span>
                    <span className={styles.statLabel}>수동 기록</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>
                        {new Set(filteredObservations.map((item) => item.studentId)).size}
                    </span>
                    <span className={styles.statLabel}>학생 수</span>
                </div>
                <div className={styles.statCard}>
                    <span className={styles.statValue}>{teacherClasses.length}</span>
                    <span className={styles.statLabel}>담당 학급</span>
                </div>
            </div>

            <section className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="학생 이름, 수업 주제, 메모 내용 검색..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <select
                        value={selectedClassId}
                        onChange={(e) => {
                            setSelectedClassId(e.target.value);
                            setSelectedStudentId('');
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">전체 수업</option>
                        {teacherClasses.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.grade}학년 {cls.classNumber}반 · {cls.subjectName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedStudentId}
                        onChange={(e) => {
                            setSelectedStudentId(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">전체 학생</option>
                        {scopedStudents.map((student) => (
                            <option key={student.id} value={student.id}>
                                {getStudentDisplay(student.id)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedAssessmentId}
                        onChange={(e) => {
                            setSelectedAssessmentId(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">전체 과제</option>
                        <option value="none">과제 미연결</option>
                        {assessments.map((assessment) => (
                            <option key={assessment.id} value={assessment.id}>
                                {assessment.title}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedEvidenceType}
                        onChange={(e) => {
                            setSelectedEvidenceType(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">전체 유형</option>
                        <option value="process">과정 중심</option>
                        <option value="result">결과 중심</option>
                    </select>

                    {(searchQuery || selectedClassId || selectedStudentId || selectedAssessmentId || selectedEvidenceType) && (
                        <button className={styles.resetBtn} onClick={resetFilters}>
                            <X size={14} />
                            필터 초기화
                        </button>
                    )}
                </div>
            </section>

            <div className={styles.resultsInfo}>
                <span>총 {filteredObservations.length}건</span>
            </div>

            {isLoading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner} />
                    <p>관찰 메모를 불러오는 중...</p>
                </div>
            ) : paginatedObservations.length === 0 ? (
                <div className={styles.emptyState}>
                    <ClipboardList size={48} className={styles.emptyIcon} />
                    <h3>관찰 메모가 없습니다</h3>
                    <p>수업 기록과 OCR 저장분이 여기에 표시됩니다.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {paginatedObservations.map((obs) => (
                        <motion.div
                            key={obs.id}
                            className={styles.card}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            layout
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.cardMeta}>
                                    <span className={styles.studentName}>
                                        <User size={14} />
                                        {getStudentDisplay(obs.studentId)}
                                    </span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles.assessment}>{getClassDisplay(obs.classId)}</span>
                                    <span className={styles.separator}>|</span>
                                    <span className={styles.date}>
                                        <Calendar size={14} />
                                        {obs.date}
                                    </span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.actionBtn}
                                        onClick={() => {
                                            setSelectedObservation(obs);
                                            setShowDetailModal(true);
                                        }}
                                        title="상세 보기"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <button
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        onClick={() => handleDelete(obs.id)}
                                        title="삭제"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {obs.lessonTopic && (
                                <p className={styles.lessonTopic}>{obs.lessonTopic}</p>
                            )}
                            <p className={styles.cardMemo}>
                                {obs.memo.length > 220 ? `${obs.memo.slice(0, 220)}...` : obs.memo}
                            </p>

                            <div className={styles.cardFooter}>
                                <div className={styles.tags}>
                                    <span className={`${styles.typeTag} ${obs.evidenceType === 'process' ? styles.processTag : styles.resultTag}`}>
                                        {obs.evidenceType === 'process' ? '과정' : '결과'}
                                    </span>
                                    <span className={`${styles.sourceTag} ${obs.sourceType === 'ocr' ? styles.ocrTag : ''}`}>
                                        {obs.sourceType === 'ocr' ? 'OCR' : '수동'}
                                    </span>
                                    <span className={styles.sourceTag}>{getAssessmentTitle(obs.assessmentId)}</span>
                                    {obs.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className={styles.competencyTag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className={styles.pageInfo}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        className={styles.pageBtn}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}

            <AnimatePresence>
                {showDetailModal && selectedObservation && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2>
                                    <FileText size={20} />
                                    관찰 메모 상세
                                </h2>
                                <button className={styles.closeBtn} onClick={() => setShowDetailModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.detailRow}>
                                    <label>학생</label>
                                    <span>{getStudentDisplay(selectedObservation.studentId)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>수업</label>
                                    <span>{getClassDisplay(selectedObservation.classId)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>수업 주제</label>
                                    <span>{selectedObservation.lessonTopic || '미입력'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>평가 과제</label>
                                    <span>{getAssessmentTitle(selectedObservation.assessmentId)}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>날짜</label>
                                    <span>{selectedObservation.date}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>출처</label>
                                    <span>{selectedObservation.sourceType === 'ocr' ? 'OCR 분석' : '수동 입력'}</span>
                                </div>
                                <div className={styles.detailRow}>
                                    <label>태그</label>
                                    <div className={styles.detailTags}>
                                        {selectedObservation.tags.map((tag, index) => (
                                            <span key={index} className={styles.competencyTag}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.detailMemo}>
                                    <label>메모 내용</label>
                                    <p>{selectedObservation.memo}</p>
                                </div>

                                {selectedObservation.ocrData && (
                                    <div className={styles.ocrDataSection}>
                                        <h4>OCR 원본 데이터</h4>
                                        <div className={styles.ocrDataContent}>
                                            <div className={styles.ocrDataItem}>
                                                <strong>추출 텍스트</strong>
                                                <p>{selectedObservation.ocrData.extractedText}</p>
                                            </div>
                                            <div className={styles.ocrDataItem}>
                                                <strong>AI 요약</strong>
                                                <p>{selectedObservation.ocrData.summary}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalFooter}>
                                <Button variant="destructive" onClick={() => handleDelete(selectedObservation.id)}>
                                    <Trash2 size={16} />
                                    삭제
                                </Button>
                                <Button onClick={() => setShowDetailModal(false)}>
                                    닫기
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ObservationsPageLoading() {
    return (
        <div className={styles.page}>
            <div className={styles.emptyState}>
                <ClipboardList size={48} className={styles.emptyIcon} />
                <h3>불러오는 중...</h3>
            </div>
        </div>
    );
}

export default function ObservationsPage() {
    return (
        <Suspense fallback={<ObservationsPageLoading />}>
            <ObservationsPageContent />
        </Suspense>
    );
}
