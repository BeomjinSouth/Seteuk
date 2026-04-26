'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Check,
    CheckCircle2,
    AlertCircle,
    ChevronDown,
    ChevronUp,
    RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './SpellCheckModal.module.css';

export interface SpellError {
    id: string;
    original: string;
    suggestions: string[];
    context: string; // surrounding text for context
    position: { start: number; end: number };
    type: 'spelling' | 'spacing' | 'grammar';
}

interface SpellCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    errors: SpellError[];
    originalText: string;
    onApplyChanges: (newText: string) => void;
}

/**
 * Spell Check Modal Component
 * 
 * @description
 * Interactive spell checking interface.
 * Displays errors with context and suggested fixes.
 * Supports individual fix application, bulk application, and "Apply All".
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Handler to close the modal
 * @param {SpellError[]} props.errors - List of spelling errors detected
 * @param {string} props.originalText - The original text being checked
 * @param {(newText: string) => void} props.onApplyChanges - Handler to apply fixed text
 */
export function SpellCheckModal({
    isOpen,
    onClose,
    errors,
    originalText,
    onApplyChanges
}: SpellCheckModalProps) {
    const [selectedFixes, setSelectedFixes] = useState<Map<string, string>>(new Map());
    const [expandedError, setExpandedError] = useState<string | null>(null);
    const [appliedErrors, setAppliedErrors] = useState<Set<string>>(new Set());

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            queueMicrotask(() => {
                setSelectedFixes(new Map());
                setAppliedErrors(new Set());
                setExpandedError(errors[0]?.id || null);
            });
        }
    }, [isOpen, errors]);

    // Select a suggestion for an error
    const selectSuggestion = (errorId: string, suggestion: string) => {
        const newMap = new Map(selectedFixes);
        newMap.set(errorId, suggestion);
        setSelectedFixes(newMap);
    };

    // Apply single fix - actually update the text
    const applySingleFix = (error: SpellError) => {
        const fix = selectedFixes.get(error.id) || error.suggestions[0];
        if (!fix) return;

        // Get current text (considering already applied changes)
        // We need to recalculate position based on previous changes
        const sortedApplied = [...errors]
            .filter(e => appliedErrors.has(e.id) && e.position.start < error.position.start)
            .sort((a, b) => a.position.start - b.position.start);

        let offset = 0;
        for (const applied of sortedApplied) {
            const appliedFix = selectedFixes.get(applied.id) || applied.suggestions[0];
            if (appliedFix) {
                offset += appliedFix.length - applied.original.length;
            }
        }

        const adjustedStart = error.position.start + offset;
        const adjustedEnd = error.position.end + offset;

        // Get the current state of the text by applying all previous fixes
        let currentText = originalText;
        const previousFixes = [...errors]
            .filter(e => appliedErrors.has(e.id))
            .sort((a, b) => b.position.start - a.position.start);

        for (const prev of previousFixes) {
            const prevFix = selectedFixes.get(prev.id) || prev.suggestions[0];
            if (prevFix) {
                currentText = currentText.slice(0, prev.position.start) + prevFix + currentText.slice(prev.position.end);
            }
        }

        // Now apply the current fix
        const newText = currentText.slice(0, adjustedStart) + fix + currentText.slice(adjustedEnd);

        onApplyChanges(newText);
        setAppliedErrors(prev => new Set([...prev, error.id]));
    };

    // Apply selected fixes
    const applySelectedFixes = () => {
        // First, get the current state of text with already applied fixes
        let currentText = originalText;
        const alreadyApplied = [...errors]
            .filter(e => appliedErrors.has(e.id))
            .sort((a, b) => b.position.start - a.position.start);

        for (const prev of alreadyApplied) {
            const prevFix = selectedFixes.get(prev.id) || prev.suggestions[0];
            if (prevFix) {
                currentText = currentText.slice(0, prev.position.start) + prevFix + currentText.slice(prev.position.end);
            }
        }

        // Calculate offset for remaining errors
        const getOffset = (errorPos: number) => {
            let offset = 0;
            const applied = [...errors]
                .filter(e => appliedErrors.has(e.id) && e.position.start < errorPos)
                .sort((a, b) => a.position.start - b.position.start);

            for (const e of applied) {
                const fix = selectedFixes.get(e.id) || e.suggestions[0];
                if (fix) {
                    offset += fix.length - e.original.length;
                }
            }
            return offset;
        };

        // Apply new fixes (not yet applied)
        const toApply = [...errors]
            .filter(e => selectedFixes.has(e.id) && !appliedErrors.has(e.id))
            .sort((a, b) => b.position.start - a.position.start);

        let newText = currentText;
        for (const error of toApply) {
            const fix = selectedFixes.get(error.id);
            if (fix) {
                const offset = getOffset(error.position.start);
                const adjustedStart = error.position.start + offset;
                const adjustedEnd = error.position.end + offset;
                newText = newText.slice(0, adjustedStart) + fix + newText.slice(adjustedEnd);
            }
        }

        onApplyChanges(newText);
        setAppliedErrors(prev => {
            const newSet = new Set(prev);
            selectedFixes.forEach((_, key) => newSet.add(key));
            return newSet;
        });
    };

    // Apply all fixes (first suggestion for each)
    const applyAllFixes = () => {
        // First, get the current state of text with already applied fixes
        let currentText = originalText;
        const alreadyApplied = [...errors]
            .filter(e => appliedErrors.has(e.id))
            .sort((a, b) => b.position.start - a.position.start);

        for (const prev of alreadyApplied) {
            const prevFix = selectedFixes.get(prev.id) || prev.suggestions[0];
            if (prevFix) {
                currentText = currentText.slice(0, prev.position.start) + prevFix + currentText.slice(prev.position.end);
            }
        }

        // Calculate offset for remaining errors
        const getOffset = (errorPos: number) => {
            let offset = 0;
            const applied = [...errors]
                .filter(e => appliedErrors.has(e.id) && e.position.start < errorPos)
                .sort((a, b) => a.position.start - b.position.start);

            for (const e of applied) {
                const fix = selectedFixes.get(e.id) || e.suggestions[0];
                if (fix) {
                    offset += fix.length - e.original.length;
                }
            }
            return offset;
        };

        // Apply remaining fixes
        const toApply = [...errors]
            .filter(e => !appliedErrors.has(e.id))
            .sort((a, b) => b.position.start - a.position.start);

        let newText = currentText;
        for (const error of toApply) {
            const fix = selectedFixes.get(error.id) || error.suggestions[0];
            if (fix) {
                const offset = getOffset(error.position.start);
                const adjustedStart = error.position.start + offset;
                const adjustedEnd = error.position.end + offset;
                newText = newText.slice(0, adjustedStart) + fix + newText.slice(adjustedEnd);
            }
        }

        onApplyChanges(newText);
        setAppliedErrors(new Set(errors.map(e => e.id)));
    };

    // Get error type label
    const getTypeLabel = (type: SpellError['type']) => {
        switch (type) {
            case 'spelling': return '맞춤법';
            case 'spacing': return '띄어쓰기';
            case 'grammar': return '문법';
        }
    };

    // Count stats
    const totalErrors = errors.length;
    const fixedErrors = appliedErrors.size;
    const remainingErrors = totalErrors - fixedErrors;

    if (!isOpen) return null;

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
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            <AlertCircle size={24} className={styles.headerIcon} />
                            <div>
                                <h2>맞춤법 검사 결과</h2>
                                <p className={styles.headerStats}>
                                    총 {totalErrors}개 오류 발견 · {fixedErrors}개 수정됨 · {remainingErrors}개 남음
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Error List */}
                    <div className={styles.errorList}>
                        {errors.length === 0 ? (
                            <div className={styles.noErrors}>
                                <CheckCircle2 size={48} />
                                <p>맞춤법 오류가 없습니다!</p>
                            </div>
                        ) : (
                            errors.map((error, index) => {
                                const isExpanded = expandedError === error.id;
                                const isApplied = appliedErrors.has(error.id);
                                const selectedFix = selectedFixes.get(error.id);

                                return (
                                    <div
                                        key={error.id}
                                        className={`${styles.errorItem} ${isApplied ? styles.applied : ''}`}
                                    >
                                        <button
                                            className={styles.errorHeader}
                                            onClick={() => setExpandedError(isExpanded ? null : error.id)}
                                        >
                                            <div className={styles.errorIndex}>
                                                {isApplied ? <Check size={16} /> : index + 1}
                                            </div>
                                            <div className={styles.errorSummary}>
                                                <span className={styles.errorOriginal}>{error.original}</span>
                                                <span className={styles.errorArrow}>→</span>
                                                <span className={styles.errorSuggestion}>
                                                    {selectedFix || error.suggestions[0]}
                                                </span>
                                                <span className={`${styles.errorType} ${styles[error.type]}`}>
                                                    {getTypeLabel(error.type)}
                                                </span>
                                            </div>
                                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                        </button>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className={styles.errorBody}
                                                >
                                                    {/* Context */}
                                                    <div className={styles.contextSection}>
                                                        <label>문맥</label>
                                                        {(() => {
                                                            const idx = error.context.indexOf(error.original);
                                                            if (idx === -1) {
                                                                return <p className={styles.contextText}>...{error.context}...</p>;
                                                            }
                                                            return (
                                                                <p className={styles.contextText}>
                                                                    ...{error.context.slice(0, idx)}
                                                                    <mark>{error.original}</mark>
                                                                    {error.context.slice(idx + error.original.length)}...
                                                                </p>
                                                            );
                                                        })()}
                                                    </div>

                                                    {/* Suggestions */}
                                                    <div className={styles.suggestionsSection}>
                                                        <label>수정 제안</label>
                                                        <div className={styles.suggestionList}>
                                                            {error.suggestions.map((suggestion, i) => (
                                                                <button
                                                                    key={i}
                                                                    className={`${styles.suggestionBtn} ${selectedFix === suggestion ? styles.selected : ''}`}
                                                                    onClick={() => selectSuggestion(error.id, suggestion)}
                                                                    disabled={isApplied}
                                                                >
                                                                    {suggestion}
                                                                    {i === 0 && <span className={styles.recommended}>추천</span>}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    {!isApplied && (
                                                        <div className={styles.errorActions}>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => applySingleFix(error)}
                                                            >
                                                                <Check size={14} /> 이 오류만 수정
                                                            </Button>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <div className={styles.footerInfo}>
                            {selectedFixes.size > 0 && (
                                <span>{selectedFixes.size}개 선택됨</span>
                            )}
                        </div>
                        <div className={styles.footerActions}>
                            <Button variant="secondary" onClick={onClose}>
                                닫기
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={applySelectedFixes}
                                disabled={selectedFixes.size === 0 || remainingErrors === 0}
                            >
                                선택한 것만 수정 ({selectedFixes.size}개)
                            </Button>
                            <Button
                                onClick={applyAllFixes}
                                disabled={remainingErrors === 0}
                            >
                                <RefreshCw size={16} /> 모두 수정 ({remainingErrors}개)
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
