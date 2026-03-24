'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Clock, Bot, Edit3, Plus, Minus, SearchCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { SubjectRecordHistorySource } from '@/types';
import styles from './HistoryModal.module.css';

interface HistoryEntry {
    content: string;
    timestamp: string;
    source: SubjectRecordHistorySource;
}

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentContent: string;
    history: HistoryEntry[];
    studentName: string;
    onRestore: (content: string) => void;
}

const sourceLabels: Record<
    SubjectRecordHistorySource,
    { label: string; icon: typeof Bot; color: string }
> = {
    ai: { label: 'AI 자동 생성', icon: Bot, color: '#8b5cf6' },
    manual: { label: '수동 편집', icon: Edit3, color: '#3b82f6' },
    expand: { label: '글자 수 늘리기', icon: Plus, color: '#10b981' },
    shorten: { label: '글자 수 줄이기', icon: Minus, color: '#f59e0b' },
    improve: { label: 'RAG 점검·개선', icon: SearchCheck, color: '#0f766e' },
};

function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * History Modal Component
 *
 * @description
 * Displays the revision history of a student's record.
 * Allows viewing previous versions and reverting to a specific version.
 * Shows the source of each change (AI generation, manual edit, expansion, shortening, or review improvement).
 */
export function HistoryModal({
    isOpen,
    onClose,
    currentContent,
    history,
    studentName,
    onRestore,
}: HistoryModalProps) {
    const [selectedVersion, setSelectedVersion] = useState<number | null>(null);

    if (!isOpen) return null;

    const handleRestore = () => {
        if (selectedVersion !== null && history[selectedVersion]) {
            onRestore(history[selectedVersion].content);
            onClose();
        }
    };

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
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className={styles.header}>
                        <h2><Clock size={20} /> {studentName} - 변경 이력</h2>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.body}>
                        {history.length === 0 ? (
                            <div className={styles.emptyState}>
                                <Clock size={48} />
                                <p>저장된 변경 이력이 없습니다.</p>
                                <span>세특을 수정하면 이전 버전이 여기에 저장됩니다.</span>
                            </div>
                        ) : (
                            <>
                                <div className={styles.versionList}>
                                    <div className={`${styles.versionItem} ${styles.currentVersion}`}>
                                        <div className={styles.versionInfo}>
                                            <span className={styles.versionLabel}>현재 버전</span>
                                            <span className={styles.versionDate}>지금</span>
                                        </div>
                                        <div className={styles.versionPreview}>
                                            {currentContent.slice(0, 100)}...
                                        </div>
                                    </div>

                                    {[...history].reverse().map((entry, index) => {
                                        const actualIndex = history.length - 1 - index;
                                        const sourceInfo = sourceLabels[entry.source];
                                        const Icon = sourceInfo.icon;

                                        return (
                                            <div
                                                key={`${entry.timestamp}-${index}`}
                                                className={`${styles.versionItem} ${selectedVersion === actualIndex ? styles.selected : ''}`}
                                                onClick={() => setSelectedVersion(actualIndex)}
                                            >
                                                <div className={styles.versionInfo}>
                                                    <span
                                                        className={styles.versionLabel}
                                                        style={{ color: sourceInfo.color }}
                                                    >
                                                        <Icon size={14} /> {sourceInfo.label}
                                                    </span>
                                                    <span className={styles.versionDate}>
                                                        {formatDate(entry.timestamp)}
                                                    </span>
                                                </div>
                                                <div className={styles.versionPreview}>
                                                    {entry.content.slice(0, 100)}...
                                                </div>
                                                <div className={styles.charCount}>
                                                    {entry.content.length}자
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {selectedVersion !== null && (
                                    <div className={styles.previewPanel}>
                                        <div className={styles.previewHeader}>
                                            <span>선택한 버전 전체 내용</span>
                                            <span className={styles.previewCharCount}>
                                                {history[selectedVersion].content.length}자
                                            </span>
                                        </div>
                                        <div className={styles.previewContent}>
                                            {history[selectedVersion].content}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <Button variant="secondary" onClick={onClose}>
                            닫기
                        </Button>
                        {selectedVersion !== null && (
                            <Button onClick={handleRestore}>
                                <RotateCcw size={16} /> 이 버전으로 되돌리기
                            </Button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
