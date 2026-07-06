'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    AlertCircle,
    CheckCircle,
    HelpCircle,
    ChevronDown,
    Plus,
    Minus,
    RotateCcw,
    ArrowUp,
    ArrowDown,
    Trash2,
    FileText,
} from 'lucide-react';
import { Student, StudentMappingItem } from '@/types';
import styles from './StudentMappingEditor.module.css';

interface StudentMappingEditorProps {
    items: StudentMappingItem[];
    students: Student[];
    pagesPerStudent: number;
    onItemsChange: (items: StudentMappingItem[]) => void;
    onConfirm: () => void;
}

/**
 * Student Mapping Editor Component
 * 
 * @description
 * Interface for mapping OCR-detected student records to actual student database entries.
 * Allows manual correction when OCR fails to identify the correct student number/name.
 * Supports bulk shifting (e.g. if one student is missing, shift all subsequent mappings).
 * 
 * @param {object} props - Component props
 * @param {StudentMappingItem[]} props.items - List of mapping items
 * @param {Student[]} props.students - List of available students
 * @param {number} props.pagesPerStudent - Number of pages per student
 * @param {(items: StudentMappingItem[]) => void} props.onItemsChange - Handler for mapping updates
 * @param {() => void} props.onConfirm - Handler for confirming the mapping
 */
export default function StudentMappingEditor({
    items,
    students,
    pagesPerStudent,
    onItemsChange,
    onConfirm,
}: StudentMappingEditorProps) {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    // Get status icon and color
    const getStatusIcon = (status: StudentMappingItem['status']) => {
        switch (status) {
            case 'matched':
                return <CheckCircle size={16} className={styles.statusMatched} />;
            case 'mismatch':
                return <AlertCircle size={16} className={styles.statusMismatch} />;
            case 'unrecognized':
                return <HelpCircle size={16} className={styles.statusUnrecognized} />;
            case 'empty':
                return <Minus size={16} className={styles.statusEmpty} />;
            default:
                return null;
        }
    };

    // Handle mapping change for a single item
    const handleMappingChange = (slotIndex: number, studentId: string) => {
        const student = students.find(s => s.id === studentId);
        const updatedItems = items.map(item => {
            if (item.slotIndex === slotIndex) {
                return {
                    ...item,
                    mappedStudentId: studentId || undefined,
                    mappedStudentNumber: student?.number,
                    mappedStudentName: student?.name,
                    status: student
                        ? (item.ocrRecognized?.studentNumber === student.number ? 'matched' : 'mismatch')
                        : 'unrecognized' as const,
                };
            }
            return item;
        });
        onItemsChange(updatedItems as StudentMappingItem[]);
    };

    // Bulk shift: shift all items from a certain index by +1 or -1
    const handleBulkShift = (fromSlotIndex: number, direction: 1 | -1) => {
        const updatedItems = items.map(item => {
            if (item.slotIndex >= fromSlotIndex) {
                const newNumber = (item.mappedStudentNumber || 0) + direction;
                const newStudent = students.find(s => s.number === newNumber);

                return {
                    ...item,
                    mappedStudentId: newStudent?.id,
                    mappedStudentNumber: newNumber > 0 ? newNumber : undefined,
                    mappedStudentName: newStudent?.name,
                    status: newStudent
                        ? (item.ocrRecognized?.studentNumber === newStudent.number ? 'matched' : 'mismatch')
                        : 'unrecognized' as const,
                };
            }
            return item;
        });
        onItemsChange(updatedItems as StudentMappingItem[]);
    };

    // Insert empty slot at a position
    const handleInsertEmptySlot = (afterSlotIndex: number) => {
        const newItems: StudentMappingItem[] = [];
        let insertedNewSlot = false;

        items.forEach((item) => {
            newItems.push(item);

            if (item.slotIndex === afterSlotIndex && !insertedNewSlot) {
                // Insert a new empty slot after this position
                newItems.push({
                    slotIndex: item.slotIndex + 0.5, // Temporary index
                    pageStart: item.pageEnd + 1,
                    pageEnd: item.pageEnd + pagesPerStudent,
                    status: 'empty',
                    isSkipped: true,
                });
                insertedNewSlot = true;
            }
        });

        // Renumber slots
        const renumberedItems = newItems.map((item, index) => ({
            ...item,
            slotIndex: index,
        }));

        onItemsChange(renumberedItems);
    };

    // Remove an empty/skipped slot
    const handleRemoveSlot = (slotIndex: number) => {
        const filteredItems = items.filter(item => item.slotIndex !== slotIndex);
        const renumberedItems = filteredItems.map((item, index) => ({
            ...item,
            slotIndex: index,
        }));
        onItemsChange(renumberedItems);
    };

    // Reset to auto-detected mapping
    const handleReset = () => {
        const resetItems = items.map(item => {
            const recognizedNumber = item.ocrRecognized?.studentNumber;
            const matchedStudent = recognizedNumber
                ? students.find(s => s.number === recognizedNumber)
                : undefined;

            return {
                ...item,
                mappedStudentId: matchedStudent?.id,
                mappedStudentNumber: recognizedNumber,
                mappedStudentName: matchedStudent?.name || item.ocrRecognized?.studentName,
                status: matchedStudent ? 'matched' : 'unrecognized' as const,
                isSkipped: false,
            };
        });
        onItemsChange(resetItems as StudentMappingItem[]);
    };

    // Check if all items are properly mapped
    const allMapped = items.every(
        item => item.isSkipped || (item.mappedStudentId && item.status !== 'empty')
    );

    const matchedCount = items.filter(i => i.status === 'matched').length;
    const mismatchCount = items.filter(i => i.status === 'mismatch').length;
    const unrecognizedCount = items.filter(i => i.status === 'unrecognized').length;

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarStats}>
                    <span className={styles.statItem}>
                        <CheckCircle size={14} className={styles.statusMatched} />
                        일치: {matchedCount}
                    </span>
                    <span className={styles.statItem}>
                        <AlertCircle size={14} className={styles.statusMismatch} />
                        불일치: {mismatchCount}
                    </span>
                    <span className={styles.statItem}>
                        <HelpCircle size={14} className={styles.statusUnrecognized} />
                        인식안됨: {unrecognizedCount}
                    </span>
                </div>
                <div className={styles.toolbarActions}>
                    <button
                        className={styles.toolBtn}
                        onClick={handleReset}
                        title="자동 인식 결과로 초기화"
                    >
                        <RotateCcw size={16} />
                        초기화
                    </button>
                    <button
                        className={`${styles.toolBtn} ${styles.confirmBtn}`}
                        onClick={onConfirm}
                        disabled={!allMapped}
                    >
                        <CheckCircle size={16} />
                        매핑 확인
                    </button>
                </div>
            </div>

            {/* Mapping Cards */}
            <div className={styles.mappingGrid}>
                {items.map((item) => (
                    <motion.div
                        key={item.slotIndex}
                        className={`${styles.mappingCard} ${styles[item.status]} ${selectedSlot === item.slotIndex ? styles.selected : ''}`}
                        onClick={() => setSelectedSlot(item.slotIndex === selectedSlot ? null : item.slotIndex)}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        {/* Card Header */}
                        <div className={styles.cardHeader}>
                            <div className={styles.pageInfo}>
                                <FileText size={14} />
                                <span>{item.pageStart}-{item.pageEnd}p</span>
                            </div>
                            <div className={styles.statusBadge}>
                                {getStatusIcon(item.status)}
                            </div>
                        </div>

                        {/* OCR Result */}
                        {item.ocrRecognized && !item.isSkipped && (
                            <div className={styles.ocrResult}>
                                <span className={styles.ocrLabel}>OCR 인식:</span>
                                <span className={styles.ocrValue}>
                                    {item.ocrRecognized.studentNumber
                                        ? `${item.ocrRecognized.studentNumber}번`
                                        : ''
                                    }
                                    {item.ocrRecognized.studentName && ` ${item.ocrRecognized.studentName}`}
                                    {!item.ocrRecognized.studentNumber && !item.ocrRecognized.studentName && '인식 안됨'}
                                </span>
                            </div>
                        )}

                        {/* Skipped indicator */}
                        {item.isSkipped && (
                            <div className={styles.skippedLabel}>
                                ⏭️ 결번 (건너뜀)
                            </div>
                        )}

                        {/* Mapping Selector */}
                        {!item.isSkipped && (
                            <div className={styles.mappingSelector}>
                                <User size={14} />
                                <select
                                    value={item.mappedStudentId || ''}
                                    onChange={(e) => handleMappingChange(item.slotIndex, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <option value="">-- 학생 선택 --</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.number}번 {student.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} />
                            </div>
                        )}

                        {/* Quick Actions (visible when selected) */}
                        {selectedSlot === item.slotIndex && (
                            <motion.div
                                className={styles.quickActions}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                            >
                                <button
                                    className={styles.quickActionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBulkShift(item.slotIndex, 1);
                                    }}
                                    title="이 위치부터 +1 시프트"
                                >
                                    <ArrowDown size={14} />
                                    +1 시프트
                                </button>
                                <button
                                    className={styles.quickActionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBulkShift(item.slotIndex, -1);
                                    }}
                                    title="이 위치부터 -1 시프트"
                                >
                                    <ArrowUp size={14} />
                                    -1 시프트
                                </button>
                                <button
                                    className={styles.quickActionBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleInsertEmptySlot(item.slotIndex);
                                    }}
                                    title="여기 다음에 빈 슬롯 추가"
                                >
                                    <Plus size={14} />
                                    결번 삽입
                                </button>
                                {item.isSkipped && (
                                    <button
                                        className={`${styles.quickActionBtn} ${styles.deleteBtn}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveSlot(item.slotIndex);
                                        }}
                                        title="이 슬롯 삭제"
                                    >
                                        <Trash2 size={14} />
                                        삭제
                                    </button>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Help Text */}
            <div className={styles.helpText}>
                <p>💡 카드를 클릭하면 편집 옵션이 표시됩니다. 일괄 시프트로 결번을 빠르게 조정하세요.</p>
            </div>
        </div>
    );
}
