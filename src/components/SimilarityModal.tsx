'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './SimilarityModal.module.css';

export interface SimilarityResult {
    student1: { id: string; name: string };
    student2: { id: string; name: string };
    similarity: number;
    similarPhrases: string[];
}

interface SimilaritySuggestion {
    similarityAnalysis: string;
    student1Suggestion: string;
    student2Suggestion: string;
}

interface SimilarityModalProps {
    isOpen: boolean;
    onClose: () => void;
    results: SimilarityResult[];
    suggestions: Map<string, SimilaritySuggestion>;
    getContentByStudentId: (studentId: string) => string;
    onSuggestionReady: (pairKey: string, suggestion: SimilaritySuggestion) => void;
}

function getPairKey(result: SimilarityResult): string {
    return `${result.student1.id}:${result.student2.id}`;
}

function getBadgeClass(similarity: number): string {
    if (similarity >= 0.8) return styles.badgeHigh;
    if (similarity >= 0.6) return styles.badgeMedium;
    return styles.badgeLow;
}

export function SimilarityModal({
    isOpen,
    onClose,
    results,
    suggestions,
    getContentByStudentId,
    onSuggestionReady,
}: SimilarityModalProps) {
    const [loadingPairs, setLoadingPairs] = useState<Set<string>>(new Set());

    const handleRequestSuggestion = async (result: SimilarityResult) => {
        const key = getPairKey(result);
        if (suggestions.has(key) || loadingPairs.has(key)) return;

        setLoadingPairs((prev) => new Set(prev).add(key));

        try {
            const response = await fetch('/api/similarity-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text1: getContentByStudentId(result.student1.id),
                    text2: getContentByStudentId(result.student2.id),
                    name1: result.student1.name,
                    name2: result.student2.name,
                }),
            });

            if (!response.ok) return;

            const data = await response.json();
            if (!data.success) return;

            onSuggestionReady(key, {
                similarityAnalysis: data.similarityAnalysis,
                student1Suggestion: data.student1Suggestion,
                student2Suggestion: data.student2Suggestion,
            });
        } catch (error) {
            console.error('Similarity suggestion failed:', error);
        } finally {
            setLoadingPairs((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    };

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
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className={styles.header}>
                        <div className={styles.headerTitle}>
                            <AlertCircle size={24} className={styles.headerIcon} />
                            <div>
                                <h2>유사도 검사 결과</h2>
                                <p className={styles.headerStats}>
                                    {results.length}쌍의 유사 세특 발견
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.resultList}>
                        {results.map((result) => {
                            const key = getPairKey(result);
                            const suggestion = suggestions.get(key);
                            const isLoading = loadingPairs.has(key);
                            const pct = Math.round(result.similarity * 100);

                            return (
                                <div key={key} className={styles.pairCard}>
                                    <div className={styles.pairHeader}>
                                        <span className={styles.studentName}>{result.student1.name}</span>
                                        <span className={styles.vs}>vs</span>
                                        <span className={styles.studentName}>{result.student2.name}</span>
                                        <span className={`${styles.similarityBadge} ${getBadgeClass(result.similarity)}`}>
                                            유사도 {pct}%
                                        </span>
                                    </div>

                                    {result.similarPhrases.length > 0 && (
                                        <div className={styles.phrasesSection}>
                                            <div className={styles.phrasesLabel}>유사 구절</div>
                                            <div className={styles.phrasesList}>
                                                {result.similarPhrases.map((phrase, index) => (
                                                    <span key={index} className={styles.phraseTag}>{phrase}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.suggestionSection}>
                                        {suggestion ? (
                                            <>
                                                {suggestion.similarityAnalysis && (
                                                    <div className={styles.suggestionAnalysis}>
                                                        <div className={styles.suggestionAnalysisLabel}>유사도 분석</div>
                                                        <div className={styles.suggestionAnalysisText}>{suggestion.similarityAnalysis}</div>
                                                    </div>
                                                )}
                                                <div className={styles.studentSuggestions}>
                                                    <div className={styles.studentSuggestionBox}>
                                                        <div className={styles.studentSuggestionName}>{result.student1.name} 수정 제안</div>
                                                        <div className={styles.studentSuggestionText}>{suggestion.student1Suggestion}</div>
                                                    </div>
                                                    <div className={styles.studentSuggestionBox}>
                                                        <div className={styles.studentSuggestionName}>{result.student2.name} 수정 제안</div>
                                                        <div className={styles.studentSuggestionText}>{suggestion.student2Suggestion}</div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <button
                                                className={styles.suggestBtn}
                                                onClick={() => handleRequestSuggestion(result)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className={styles.spinner} /> 생성 중...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles size={14} /> AI 수정 제안 생성
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.footer}>
                        <Button variant="secondary" onClick={onClose}>
                            닫기
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
