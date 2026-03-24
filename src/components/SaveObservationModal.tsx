'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Save,
    User,
    Calendar,
    Tag,
    FileText,
    Loader2,
    ClipboardList,
    Plus,
    Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { OCRData, EvidenceType, Assessment } from '@/types';
import { getTeacherClasses } from '@/lib/teacher-context';
import styles from './SaveObservationModal.module.css';

interface SaveObservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    ocrResult: OCRData;
    onSaved?: () => void;
}

/**
 * Save Observation Modal Component
 * 
 * @description
 * Dialog for saving OCR analysis results as an observation record.
 * Allows editing the extracted text, adding tags, assigning to a specific student,
 * and linking to an assessment.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Handler to close the modal
 * @param {OCRData} props.ocrResult - The raw OCR data to save
 * @param {() => void} [props.onSaved] - Callback after successful save
 */
export default function SaveObservationModal({
    isOpen,
    onClose,
    ocrResult,
    onSaved,
}: SaveObservationModalProps) {
    const { students, classes, teacher } = useAppStore();
    const teacherClasses = getTeacherClasses(classes, teacher);

    // Form state
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [evidenceType, setEvidenceType] = useState<EvidenceType>('process');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [memo, setMemo] = useState('');
    const [lessonTopic, setLessonTopic] = useState('');

    // Data state
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewAssessment, setShowNewAssessment] = useState(false);

    // New assessment form
    const [newAssessmentTitle, setNewAssessmentTitle] = useState('');

    // Predefined competency tags
    const predefinedTags = ['문제해결', '추론', '창의·융합', '의사소통', '정보처리', '태도'];

    // Initialize memo from OCR result
    useEffect(() => {
        if (isOpen && ocrResult) {
            // Combine extracted text and summary for initial memo
            const initialMemo = ocrResult.summary || ocrResult.extractedText.slice(0, 300);
            setMemo(initialMemo);
            if (!selectedClassId && teacherClasses.length > 0) {
                setSelectedClassId(teacherClasses[0].id);
            }
        }
    }, [isOpen, ocrResult, selectedClassId, teacherClasses]);

    // Fetch assessments
    useEffect(() => {
        if (isOpen) {
            fetchAssessments();
        }
    }, [isOpen]);

    useEffect(() => {
        if (!selectedClassId) return;
        const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);
        if (!selectedClass) return;
        const studentsInClass = students.filter((student) =>
            (!teacher?.school || student.school === teacher.school)
            && student.school === selectedClass.school
            && student.grade === selectedClass.grade
            && student.classNumber === selectedClass.classNumber
        );
        if (studentsInClass.length > 0 && !studentsInClass.some((student) => student.id === selectedStudentId)) {
            setSelectedStudentId(studentsInClass[0].id);
        }
    }, [selectedClassId, selectedStudentId, students, teacher?.school, teacherClasses]);

    const fetchAssessments = async () => {
        try {
            const response = await fetch('/api/assessments');
            const data = await response.json();
            if (data.success) {
                setAssessments(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch assessments:', error);
        }
    };

    // Filter students by search query
    const filteredStudents = students.filter(student => {
        if (teacher?.school && student.school !== teacher.school) {
            return false;
        }
        if (selectedClassId) {
            const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);
            if (!selectedClass) return false;
            if (student.school !== selectedClass.school || student.grade !== selectedClass.grade || student.classNumber !== selectedClass.classNumber) {
                return false;
            }
        }
        if (!searchQuery) return true;
        const searchStr = `${student.grade || ''}학년 ${student.classNumber || ''}반 ${student.number}번 ${student.name}`.toLowerCase();
        return searchStr.includes(searchQuery.toLowerCase());
    });

    // Get student display name
    const getStudentDisplay = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        if (!student) return '';
        return `${student.grade || ''}학년 ${student.classNumber || ''}반 ${student.number}번 ${student.name}`;
    };

    // Add tag
    const handleAddTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
        setNewTag('');
    };

    // Remove tag
    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    // Create new assessment
    const handleCreateAssessment = async () => {
        if (!newAssessmentTitle.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/assessments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newAssessmentTitle,
                    assessmentDate: date,
                }),
            });
            const data = await response.json();
            if (data.success) {
                await fetchAssessments();
                setSelectedAssessmentId(data.id);
                setShowNewAssessment(false);
                setNewAssessmentTitle('');
            }
        } catch (error) {
            console.error('Failed to create assessment:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Save observation
    const handleSave = async () => {
        if (!teacher) {
            alert('교사 정보가 필요합니다.');
            return;
        }
        if (!selectedClassId) {
            alert('수업을 선택해주세요.');
            return;
        }
        if (!selectedStudentId) {
            alert('학생을 선택해주세요.');
            return;
        }
        if (!memo.trim()) {
            alert('메모 내용을 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId);
            const response = await fetch('/api/observations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: selectedStudentId,
                    classId: selectedClassId,
                    teacherKey: teacher.teacherKey,
                    assessmentId: selectedAssessmentId || undefined,
                    subjectName: selectedClass?.subjectName,
                    lessonTopic: lessonTopic || undefined,
                    date,
                    memo,
                    evidenceType,
                    tags,
                    sourceType: 'ocr',
                    ocrData: ocrResult,
                }),
            });

            const data = await response.json();
            if (data.success) {
                onSaved?.();
                onClose();
                // Reset form
                setSelectedClassId('');
                setSelectedStudentId('');
                setSelectedAssessmentId('');
                setTags([]);
                setMemo('');
                setLessonTopic('');
            } else {
                alert(data.error || '저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Failed to save observation:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <h2>
                            <Save size={20} />
                            관찰 메모로 저장
                        </h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className={styles.body}>
                        {/* Student Selection */}
                        <div className={styles.field}>
                            <label>
                                <ClipboardList size={16} />
                                수업 선택 <span className={styles.required}>*</span>
                            </label>
                            <select
                                className={styles.select}
                                value={selectedClassId}
                                onChange={(e) => {
                                    setSelectedClassId(e.target.value);
                                    setSelectedStudentId('');
                                }}
                            >
                                <option value="">수업을 선택하세요</option>
                                {teacherClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.year} {cls.semester}학기 · {cls.grade}학년 {cls.classNumber}반 · {cls.subjectName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Student Selection */}
                        <div className={styles.field}>
                            <label>
                                <User size={16} />
                                학생 선택 <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="학생 검색 (학년, 반, 번호, 이름)"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select
                                className={styles.select}
                                value={selectedStudentId}
                                onChange={(e) => setSelectedStudentId(e.target.value)}
                            >
                                <option value="">학생을 선택하세요</option>
                                {filteredStudents.map((student) => (
                                    <option key={student.id} value={student.id}>
                                        {getStudentDisplay(student.id)}
                                    </option>
                                ))}
                            </select>
                            {selectedStudentId && (
                                <div className={styles.selectedDisplay}>
                                    ✓ {getStudentDisplay(selectedStudentId)}
                                </div>
                            )}
                        </div>

                        {/* Assessment Selection */}
                        <div className={styles.field}>
                            <label>
                                <ClipboardList size={16} />
                                평가 과제 (선택)
                            </label>
                            {!showNewAssessment ? (
                                <>
                                    <select
                                        className={styles.select}
                                        value={selectedAssessmentId}
                                        onChange={(e) => setSelectedAssessmentId(e.target.value)}
                                    >
                                        <option value="">과제 미연결</option>
                                        {assessments.map((assessment) => (
                                            <option key={assessment.id} value={assessment.id}>
                                                {assessment.title} ({assessment.assessmentDate})
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        className={styles.addNewBtn}
                                        onClick={() => setShowNewAssessment(true)}
                                    >
                                        <Plus size={14} /> 새 과제 등록
                                    </button>
                                </>
                            ) : (
                                <div className={styles.newAssessmentForm}>
                                    <input
                                        type="text"
                                        placeholder="과제명 입력"
                                        value={newAssessmentTitle}
                                        onChange={(e) => setNewAssessmentTitle(e.target.value)}
                                        className={styles.input}
                                    />
                                    <div className={styles.newAssessmentActions}>
                                        <Button
                                            size="sm"
                                            onClick={handleCreateAssessment}
                                            disabled={!newAssessmentTitle.trim() || isLoading}
                                        >
                                            {isLoading ? <Loader2 className={styles.spin} size={14} /> : <Check size={14} />}
                                            등록
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                setShowNewAssessment(false);
                                                setNewAssessmentTitle('');
                                            }}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date */}
                        <div className={styles.field}>
                            <label>
                                <Calendar size={16} />
                                관찰 날짜
                            </label>
                            <input
                                type="date"
                                className={styles.input}
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        <div className={styles.field}>
                            <label>
                                <FileText size={16} />
                                수업 주제
                            </label>
                            <input
                                type="text"
                                className={styles.input}
                                value={lessonTopic}
                                onChange={(e) => setLessonTopic(e.target.value)}
                                placeholder="예: 탐구 발표, 실험 활동"
                            />
                        </div>

                        {/* Evidence Type */}
                        <div className={styles.field}>
                            <label>근거 유형</label>
                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="evidenceType"
                                        checked={evidenceType === 'process'}
                                        onChange={() => setEvidenceType('process')}
                                    />
                                    <span>과정 중심</span>
                                </label>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="evidenceType"
                                        checked={evidenceType === 'result'}
                                        onChange={() => setEvidenceType('result')}
                                    />
                                    <span>결과 중심</span>
                                </label>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className={styles.field}>
                            <label>
                                <Tag size={16} />
                                역량 태그
                            </label>
                            <div className={styles.tagsContainer}>
                                <div className={styles.predefinedTags}>
                                    {predefinedTags.map((tag) => (
                                        <button
                                            key={tag}
                                            className={`${styles.tagBtn} ${tags.includes(tag) ? styles.tagActive : ''}`}
                                            onClick={() => {
                                                if (tags.includes(tag)) {
                                                    handleRemoveTag(tag);
                                                } else {
                                                    handleAddTag(tag);
                                                }
                                            }}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                <div className={styles.customTagInput}>
                                    <input
                                        type="text"
                                        placeholder="+ 태그 추가"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag(newTag);
                                            }
                                        }}
                                    />
                                </div>
                                {tags.length > 0 && (
                                    <div className={styles.selectedTags}>
                                        {tags.map((tag) => (
                                            <span key={tag} className={styles.selectedTag}>
                                                {tag}
                                                <button onClick={() => handleRemoveTag(tag)}>
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Memo */}
                        <div className={styles.field}>
                            <label>
                                <FileText size={16} />
                                메모 내용 <span className={styles.required}>*</span>
                            </label>
                            <textarea
                                className={styles.textarea}
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="OCR 결과를 바탕으로 관찰 메모를 작성하세요..."
                                rows={6}
                            />
                            <div className={styles.charCount}>
                                {memo.length}자
                            </div>
                        </div>

                        {/* OCR Preview */}
                        <div className={styles.ocrPreview}>
                            <h4>📋 OCR 원본 데이터 (참고용)</h4>
                            <div className={styles.ocrContent}>
                                <p><strong>추출 텍스트:</strong> {ocrResult.extractedText.slice(0, 200)}...</p>
                                {ocrResult.drawings.length > 0 && (
                                    <p><strong>그림/도표:</strong> {ocrResult.drawings.map(d => d.description).join(', ')}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <Button variant="secondary" onClick={onClose}>
                            취소
                        </Button>
                        <Button onClick={handleSave} isLoading={isSaving}>
                            <Save size={16} />
                            저장
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
