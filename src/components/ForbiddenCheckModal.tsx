'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './SpellCheckModal.module.css'; // Reuse spell check styles for consistency

interface ForbiddenIssue {
    word: string;
    reason: string;
    suggestion: string;
}

interface ForbiddenCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: Map<string, ForbiddenIssue[]>;
    studentNames: Map<string, string>;
}

/**
 * Forbidden Word Check Modal Component
 * 
 * @description
 * Displays a summary of forbidden words detected in student records.
 * Provides a list of issues grouped by student, including the forbidden word,
 * the reason it is prohibited, and suggested alternatives.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Handler to close the modal
 * @param {Map<string, ForbiddenIssue[]>} props.results - Map of student ID to detected issues
 * @param {Map<string, string>} props.studentNames - Map of student ID to student name for display
 */
export function ForbiddenCheckModal({
    isOpen,
    onClose,
    results,
    studentNames
}: ForbiddenCheckModalProps) {
    if (!isOpen) return null;

    const totalStudents = results.size;
    const totalIssues = Array.from(results.values()).reduce((acc, current) => acc + current.length, 0);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.overlay}
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                    style={{ maxWidth: '800px' }}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            <ShieldAlert size={28} color="#ef4444" />
                            <div>
                                <h2>기재 금지어 검사 결과</h2>
                                <p className={styles.headerStats}>
                                    {totalStudents}명의 학생에게서 총 {totalIssues}개의 주의 요소 발견
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Result List */}
                    <div className={styles.errorList} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1rem' }}>
                        {results.size === 0 ? (
                            <div className={styles.noErrors}>
                                <CheckCircle2 size={48} color="#10b981" />
                                <p>발견된 기재 금지어가 없습니다!</p>
                            </div>
                        ) : (
                            Array.from(results.entries()).map(([studentId, issues]) => (
                                <div key={studentId} style={{ marginBottom: '2rem', border: '1px solid #fee2e2', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                    <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem 1rem', borderBottom: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{studentNames.get(studentId) || '학생'}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#ef4444', backgroundColor: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem', border: '1px solid #fca5a5' }}>
                                            {issues.length}개 발견
                                        </span>
                                    </div>
                                    <div style={{ padding: '0.5rem' }}>
                                        {issues.map((issue, idx) => (
                                            <div key={idx} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '1fr 1.5fr 2fr',
                                                gap: '1rem',
                                                padding: '0.75rem',
                                                borderBottom: idx === issues.length - 1 ? 'none' : '1px solid #f1f5f9',
                                                alignItems: 'center'
                                            }}>
                                                <div style={{ fontWeight: '600', color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', textAlign: 'center' }}>
                                                    {issue.word}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <AlertTriangle size={14} /> {issue.reason}
                                                </div>
                                                <div style={{ fontSize: '0.85rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <ChevronRight size={14} /> {issue.suggestion}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            ※ 금지어는 학교생활기록부 기재 요령에 따라 반드시 수정해야 합니다.
                        </p>
                        <div className={styles.footerActions}>
                            <Button onClick={onClose}>확인</Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
