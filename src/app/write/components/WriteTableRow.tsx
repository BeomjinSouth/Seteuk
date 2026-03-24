import { SubjectRecord, Student } from '@/types';
import { Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CompetencyHighlighter } from '@/components/KeywordHighlighter';
import styles from '../page.module.css';

interface WriteTableRowProps {
    student: Student;
    record?: SubjectRecord;
    learningData: Record<string, string>;
    subjectName: string;
    isSelected: boolean;
    editingCell: { studentId: string; field: 'data' | 'content' } | null;
    editValue: string;
    onToggleSelect: (id: string) => void;
    onStartEdit: (studentId: string, field: 'data' | 'content', value: string) => void;
    onSaveEdit: (studentId: string, field: 'data' | 'content') => void;
    onCancelEdit: () => void;
    onEditValueChange: (value: string) => void;
}

export function WriteTableRow({
    student,
    record,
    learningData,
    subjectName,
    isSelected,
    editingCell,
    editValue,
    onToggleSelect,
    onStartEdit,
    onSaveEdit,
    onCancelEdit,
    onEditValueChange,
}: WriteTableRowProps) {
    const isEditingData = editingCell?.studentId === student.id && editingCell?.field === 'data';
    const isEditingContent = editingCell?.studentId === student.id && editingCell?.field === 'content';

    const customData = learningData?.customData || '';
    const otherData = Object.entries(learningData || {})
        .filter(([k]) => k !== 'customData')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    const displayData = [customData, otherData].filter(Boolean).join('\n');

    return (
        <tr className={`${isSelected ? styles.rowSelected : ''}`}>
            {/* Checkbox */}
            <td className={styles.checkboxCell}>
                <input
                    type="checkbox"
                    className={styles.tableCheckbox}
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                />
            </td>

            {/* Class Number */}
            <td className={styles.classCell}>
                <span className={styles.cellClass}>{student.classNumber}</span>
            </td>

            {/* Student Number */}
            <td className={styles.numberCell}>
                <span className={styles.cellNumber}>{student.number}</span>
            </td>

            {/* Name */}
            <td className={styles.nameCell}>
                <span className={styles.cellName}>{student.name}</span>
            </td>

            {/* Subject */}
            <td className={styles.subjectCell}>
                <span className={styles.cellSubject}>{subjectName}</span>
            </td>

            {/* Learning Data */}
            <td className={styles.dataCell}>
                {isEditingData ? (
                    <div>
                        <textarea
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            className={styles.cellTextarea}
                            autoFocus
                        />
                        <div className={styles.cellEditActions}>
                            <Button size="xs" onClick={() => onSaveEdit(student.id, 'data')}>저장</Button>
                            <Button size="xs" variant="ghost" onClick={onCancelEdit}>취소</Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={styles.editableCell}
                        onClick={() => onStartEdit(student.id, 'data', learningData?.customData || '')}
                    >
                        {displayData || <span className={styles.placeholder}>클릭하여 입력...</span>}
                        <span className={styles.cellEditIcon}><Edit3 size={12} /></span>
                    </div>
                )}
            </td>

            {/* Content (세특) */}
            <td className={styles.contentCell}>
                {isEditingContent ? (
                    <div>
                        <textarea
                            value={editValue}
                            onChange={(e) => onEditValueChange(e.target.value)}
                            className={styles.cellTextarea}
                            autoFocus
                        />
                        <div className={styles.cellEditActions}>
                            <span className={styles.charCount}>
                                {editValue.length}자 ({new TextEncoder().encode(editValue).length}byte)
                            </span>
                            <Button size="xs" onClick={() => onSaveEdit(student.id, 'content')}>저장</Button>
                            <Button size="xs" variant="ghost" onClick={onCancelEdit}>취소</Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={styles.editableCell}
                        onClick={() => onStartEdit(student.id, 'content', record?.content || '')}
                    >
                        {record?.content ? (
                            <CompetencyHighlighter
                                text={record.content}
                                showLegend={false}
                                hideAnalyzeButton={true}
                                savedAnalysis={record.competencyAnalysis ? {
                                    segments: record.competencyAnalysis.segments,
                                    contentHash: record.competencyAnalysis.contentHash,
                                } : undefined}
                            />
                        ) : (
                            <span className={styles.placeholder}>클릭하여 입력...</span>
                        )}
                        <span className={styles.cellEditIcon}><Edit3 size={12} /></span>
                    </div>
                )}
            </td>
        </tr>
    );
}
