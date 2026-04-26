import { SubjectRecord, Student } from '@/types';
import { Brain, ChevronRight, Edit3, FileText, MoreVertical, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CompetencyHighlighter, getContentHash } from '@/components/KeywordHighlighter';
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
    onAnalyzeCompetency: (studentId: string) => void;
    isCompetencyAnalyzing: boolean;
}

function getCompetencySummary(record?: SubjectRecord): string {
    if (!record?.content || !record.competencyAnalysis?.segments.length) return '';
    if (record.competencyAnalysis.contentHash !== getContentHash(record.content)) return '';

    const totals = { knowledge: 0, process: 0, attitude: 0 };
    let totalLength = 0;
    record.competencyAnalysis.segments.forEach((segment) => {
        totals[segment.type] += segment.text.length;
        totalLength += segment.text.length;
    });

    if (totalLength === 0) return '';

    return [
        `지식 ${Math.round((totals.knowledge / totalLength) * 100)}%`,
        `과정 ${Math.round((totals.process / totalLength) * 100)}%`,
        `태도 ${Math.round((totals.attitude / totalLength) * 100)}%`,
    ].join(' · ');
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
    onAnalyzeCompetency,
    isCompetencyAnalyzing,
}: WriteTableRowProps) {
    const isEditingData = editingCell?.studentId === student.id && editingCell?.field === 'data';
    const isEditingContent = editingCell?.studentId === student.id && editingCell?.field === 'content';

    const customData = learningData?.customData || '';
    const otherData = Object.entries(learningData || {})
        .filter(([k]) => k !== 'customData')
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

    const displayData = [customData, otherData].filter(Boolean).join('\n');
    const hasContent = !!record?.content?.trim();
    const hasFreshCompetency = !!record?.competencyAnalysis?.segments.length
        && record.competencyAnalysis.contentHash === getContentHash(record.content);
    const hasStaleCompetency = !!record?.competencyAnalysis?.segments.length && !hasFreshCompetency;
    const competencySummary = getCompetencySummary(record);

    return (
        <tr className={`${styles.tableRow} ${isSelected ? styles.rowSelected : ''}`}>
            <td className={styles.checkboxCell}>
                <input
                    type="checkbox"
                    className={styles.tableCheckbox}
                    checked={isSelected}
                    onChange={() => onToggleSelect(student.id)}
                />
            </td>

            <td className={styles.classCell}>
                <span className={styles.cellClass}>{student.classNumber}</span>
            </td>

            <td className={styles.numberCell}>
                <span className={styles.cellNumber}>{student.number}</span>
            </td>

            <td className={styles.nameCell}>
                <span className={styles.cellName}>{student.name}</span>
            </td>

            <td className={styles.subjectCell}>
                <span className={styles.cellSubject}>{subjectName}</span>
            </td>

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
                    <button
                        type="button"
                        className={`${styles.dataPrompt} ${displayData ? styles.dataPromptFilled : ''}`}
                        onClick={() => onStartEdit(student.id, 'data', learningData?.customData || '')}
                    >
                        <FileText size={20} className={styles.promptIcon} />
                        <span>{displayData || 'AI가 생성할 정보를\n입력해주세요'}</span>
                        <Plus size={18} className={styles.promptPlusIcon} />
                    </button>
                )}
            </td>

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
                        role="button"
                        tabIndex={0}
                        className={`${styles.contentPrompt} ${hasContent ? styles.contentPromptFilled : ''}`}
                        onClick={() => onStartEdit(student.id, 'content', record?.content || '')}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                onStartEdit(student.id, 'content', record?.content || '');
                            }
                        }}
                    >
                        <Sparkles size={21} className={styles.contentPromptIcon} />
                        {hasContent ? (
                            <span className={styles.contentPreview}>
                                <span className={styles.contentMetaRow}>
                                    <span className={`${styles.analysisBadge} ${hasFreshCompetency ? styles.analysisBadgeDone : styles.analysisBadgeNeeded}`}>
                                        {hasFreshCompetency ? '역량 분석 완료' : hasStaleCompetency ? '재분석 필요' : '역량 분석 필요'}
                                    </span>
                                    {competencySummary && <span className={styles.analysisSummary}>{competencySummary}</span>}
                                    <span
                                        role="button"
                                        tabIndex={0}
                                        className={styles.rowIconButton}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (isCompetencyAnalyzing) return;
                                            onAnalyzeCompetency(student.id);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                if (isCompetencyAnalyzing) return;
                                                onAnalyzeCompetency(student.id);
                                            }
                                        }}
                                        aria-disabled={isCompetencyAnalyzing}
                                        title="이 학생 세특 역량 분석"
                                    >
                                        <Brain size={13} />
                                        {isCompetencyAnalyzing ? '분석 중' : '분석'}
                                    </span>
                                </span>
                                <CompetencyHighlighter
                                    text={record?.content || ''}
                                    showLegend={false}
                                    hideAnalyzeButton={true}
                                    savedAnalysis={record?.competencyAnalysis ? {
                                        segments: record.competencyAnalysis.segments,
                                        contentHash: record.competencyAnalysis.contentHash,
                                    } : undefined}
                                />
                            </span>
                        ) : (
                            <span className={styles.contentPlaceholder}>
                                <strong>AI로 세특 내용을</strong>
                                <span>생성해보세요</span>
                            </span>
                        )}
                        <span className={styles.contentArrow}>
                            <ChevronRight size={18} />
                        </span>
                        <Edit3 size={12} className={styles.cellEditIcon} />
                    </div>
                )}
            </td>

            <td className={styles.actionCell}>
                <button type="button" className={styles.rowMenuButton} aria-label={`${student.name} 행 메뉴`}>
                    <MoreVertical size={18} />
                </button>
            </td>
        </tr>
    );
}
