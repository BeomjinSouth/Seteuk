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
    matchedSentences: Array<{
        student1Sentence: string;
        student2Sentence: string;
        similarity: number;
    }>;
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
    if (similarity >= 0.95) return styles.badgeHigh;
    if (similarity >= 0.9) return styles.badgeMedium;
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
                                <h2>90% 이상 동일 문장 검사 결과</h2>
                                <p className={styles.headerStats}>
                                    {results.length}쌍의 학생 기록에서 중복 의심 문장을 발견했습니다.
                                </p>
                            </div>
                        </div>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.resultList}>
                        <div className={styles.noticeBox}>
                            세특 전체 유사도가 아니라, 서로 다른 학생 사이에서 90% 이상 비슷한 문장만 표시합니다.
                        </div>
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
                                            최대 문장 유사도 {pct}%
                                        </span>
                                    </div>

                                    {result.matchedSentences.length > 0 && (
                                        <div className={styles.sentencesSection}>
                                            <div className={styles.sentencesLabel}>중복 의심 문장</div>
                                            <div className={styles.sentencesList}>
                                                {result.matchedSentences.map((sentence, index) => (
                                                    <div key={`${key}-${index}`} className={styles.sentencePair}>
                                                        <div className={styles.sentenceMeta}>
                                                            문장 {index + 1}
                                                            <span>{Math.round(sentence.similarity * 100)}%</span>
                                                        </div>
                                                        <div className={styles.sentenceBox}>
                                                            <strong>{result.student1.name}</strong>
                                                            <p>{sentence.student1Sentence}</p>
                                                        </div>
                                                        <div className={styles.sentenceBox}>
                                                            <strong>{result.student2.name}</strong>
                                                            <p>{sentence.student2Sentence}</p>
                                                        </div>
                                                    </div>
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
