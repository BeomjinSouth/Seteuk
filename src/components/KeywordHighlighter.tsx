'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './KeywordHighlighter.module.css';
import { CompetencySegment, CompetencyType } from '@/types';

// Re-export types for backward compatibility
export type { CompetencyType, CompetencySegment };

interface CompetencyHighlighterProps {
    text: string;
    showLegend?: boolean;
    autoAnalyze?: boolean;
    /** true이면 학생당 개별 역량 분석 버튼을 숨김 (일괄 역량 분석만 사용하는 경우) */
    hideAnalyzeButton?: boolean;
    // 저장된 분석 결과 (있으면 API 호출 없이 바로 표시)
    savedAnalysis?: {
        segments: CompetencySegment[];
        contentHash: string;
    };
    // 분석 완료 시 결과를 저장하기 위한 콜백
    onAnalysisComplete?: (segments: CompetencySegment[]) => void;
}

// 역량 유형별 라벨 및 색상
const competencyLabels: Record<CompetencyType, { label: string; color: string; bgColor: string; underlineColor: string }> = {
    knowledge: { label: '지식·개념', color: '#059669', bgColor: 'rgba(5, 150, 105, 0.15)', underlineColor: '#10b981' },
    process: { label: '과정·기능', color: '#2563eb', bgColor: 'rgba(37, 99, 235, 0.15)', underlineColor: '#3b82f6' },
    attitude: { label: '가치·태도', color: '#9333ea', bgColor: 'rgba(147, 51, 234, 0.15)', underlineColor: '#a855f7' }
};

// 퍼센티지 계산 함수
function calculatePercentages(segments: CompetencySegment[]): Record<CompetencyType, number> {
    const totalLength = segments.reduce((sum, seg) => sum + seg.text.length, 0);
    if (totalLength === 0) return { knowledge: 0, process: 0, attitude: 0 };

    const typeLengths = segments.reduce((acc, seg) => {
        acc[seg.type] = (acc[seg.type] || 0) + seg.text.length;
        return acc;
    }, {} as Record<CompetencyType, number>);

    return {
        knowledge: Math.round((typeLengths.knowledge || 0) / totalLength * 100),
        process: Math.round((typeLengths.process || 0) / totalLength * 100),
        attitude: Math.round((typeLengths.attitude || 0) / totalLength * 100)
    };
}

type DisplayPart = {
    text: string;
    type?: CompetencyType;
};

function buildDisplayParts(text: string, segments: CompetencySegment[]): DisplayPart[] {
    const parts: DisplayPart[] = [];
    let cursor = 0;

    segments.forEach((segment) => {
        let start = segment.startIndex;
        let end = segment.endIndex;
        const hasValidIndex = Number.isFinite(start)
            && Number.isFinite(end)
            && start >= cursor
            && end > start
            && end <= text.length
            && text.slice(start, end) === segment.text;

        if (!hasValidIndex) {
            const foundAt = segment.text ? text.indexOf(segment.text, cursor) : -1;
            if (foundAt < 0) return;
            start = foundAt;
            end = foundAt + segment.text.length;
        }

        if (start > cursor) {
            parts.push({ text: text.slice(cursor, start) });
        }

        parts.push({
            text: text.slice(start, end),
            type: segment.type,
        });
        cursor = end;
    });

    if (cursor < text.length) {
        parts.push({ text: text.slice(cursor) });
    }

    return parts.filter((part) => part.text.length > 0);
}

// 간단한 해시 함수 (내용 변경 감지용)
function simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

/**
 * Competency Highlighter Component
 * 
 * @description
 * Analyzes and highlights text based on core competencies:
 * - Knowledge (Green): Concepts and understanding
 * - Process (Blue): Inquiry, analysis, and application
 * - Attitude (Purple): Values, cooperation, and meaningful participation
 * 
 * Displays a color-coded legend and visual warning if one type dominates (>70%).
 * 
 * @param {object} props - Component props
 * @param {string} props.text - Text to analyze and highlight
 * @param {boolean} [props.showLegend=true] - Whether to show the color legend
 * @param {boolean} [props.autoAnalyze=false] - Whether to automatically start analysis on mount
 * @param {object} [props.savedAnalysis] - Pre-computed analysis result to display immediately
 * @param {(segments: CompetencySegment[]) => void} [props.onAnalysisComplete] - Callback when fresh analysis is done
 */
export function CompetencyHighlighter({
    text,
    showLegend = true,
    autoAnalyze = false,
    hideAnalyzeButton = false,
    savedAnalysis,
    onAnalysisComplete
}: CompetencyHighlighterProps) {
    const [segments, setSegments] = useState<CompetencySegment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnalyzed, setIsAnalyzed] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 저장된 분석 결과가 있고, 내용이 변경되지 않았으면 사용
    useEffect(() => {
        if (savedAnalysis && savedAnalysis.segments.length > 0) {
            const currentHash = simpleHash(text);
            if (savedAnalysis.contentHash === currentHash) {
                queueMicrotask(() => {
                    setSegments(savedAnalysis.segments);
                    setIsAnalyzed(true);
                });
            }
        }
    }, [savedAnalysis, text]);

    const analyzeText = useCallback(async () => {
        if (!text || text.length < 10) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/competency', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.segments && data.segments.length > 0) {
                    setSegments(data.segments);
                    setIsAnalyzed(true);

                    // 분석 결과 저장을 위해 콜백 호출
                    if (onAnalysisComplete) {
                        onAnalysisComplete(data.segments);
                    }
                } else {
                    setError('분석 결과가 없습니다');
                }
            } else {
                setError('API 오류');
            }
        } catch (err) {
            console.error('Competency analysis failed:', err);
            setError('분석 실패');
        }

        setIsLoading(false);
    }, [text, onAnalysisComplete]);

    // Auto-analyze if enabled and no saved analysis
    useEffect(() => {
        if (autoAnalyze && text && !isAnalyzed && !savedAnalysis) {
            queueMicrotask(() => {
                void analyzeText();
            });
        }
    }, [autoAnalyze, text, isAnalyzed, savedAnalysis, analyzeText]);

    // Reset when text changes significantly
    useEffect(() => {
        if (savedAnalysis) {
            const currentHash = simpleHash(text);
            if (savedAnalysis.contentHash !== currentHash) {
                queueMicrotask(() => {
                    setSegments([]);
                    setIsAnalyzed(false);
                    setError(null);
                });
            }
        } else if (!isAnalyzed) {
            queueMicrotask(() => {
                setSegments([]);
                setError(null);
            });
        }
    }, [text, savedAnalysis, isAnalyzed]);

    // If not analyzed yet, show plain text with analyze button
    if (!isAnalyzed) {
        return (
            <div className={styles.competencyContainer}>
                <div className={styles.plainText}>{text}</div>
                {!autoAnalyze && !hideAnalyzeButton && (
                    <div className={styles.analyzeWrapper}>
                        <button
                            className={styles.analyzeButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                analyzeText();
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className={styles.spinner}></span> 분석 중...
                                </>
                            ) : (
                                '🔍 문장별 역량 분석 실행'
                            )}
                        </button>
                        <p className={styles.analyzeHint}>AI가 문장 내 요소를 지식, 과정, 태도로 세밀하게 분류합니다.</p>
                    </div>
                )}
                {isLoading && !autoAnalyze && !hideAnalyzeButton && (
                    <div className={styles.loadingIndicator}>
                        <span className={styles.spinner}></span> AI 역량 분석 중...
                    </div>
                )}
                {error && <div className={styles.errorText}>{error}</div>}
            </div>
        );
    }

    // 퍼센티지 계산
    const percentages = calculatePercentages(segments);
    const maxPercentage = Math.max(percentages.knowledge, percentages.process, percentages.attitude);
    const isImbalanced = maxPercentage >= 70;
    const dominantType = Object.entries(percentages).find(([, pct]) => pct >= 70)?.[0] as CompetencyType | undefined;

    // Render analyzed segments
    return (
        <div className={styles.competencyContainer}>
            {showLegend && (
                <div className={styles.legend}>
                    {Object.entries(competencyLabels).map(([type, info]) => {
                        const pct = percentages[type as CompetencyType];
                        return (
                            <span key={type} className={styles.legendItem}>
                                <span
                                    className={styles.legendUnderline}
                                    style={{ backgroundColor: info.underlineColor }}
                                />
                                {info.label}
                                <span className={styles.percentBadge} style={{ color: info.color }}>
                                    {pct}%
                                </span>
                            </span>
                        );
                    })}
                </div>
            )}

            {/* 70% 이상 경고 */}
            {isImbalanced && dominantType && (
                <div className={styles.imbalanceWarning}>
                    ⚠️ <strong>{competencyLabels[dominantType].label}</strong> 요소가 {percentages[dominantType]}%로 높습니다. 다른 역량 요소의 균형을 확인해 주세요.
                </div>
            )}

            <div className={styles.highlightedText}>
                {buildDisplayParts(text, segments).map((part, index) => {
                    if (!part.type) {
                        return <span key={index}>{part.text}</span>;
                    }

                    const { label, underlineColor } = competencyLabels[part.type];
                    return (
                        <span
                            key={index}
                            className={styles.segment}
                            style={{
                                textDecoration: 'underline',
                                textDecorationColor: underlineColor,
                                textDecorationThickness: '2px',
                                textUnderlineOffset: '3px',
                            }}
                            title={label}
                        >
                            {part.text}
                        </span>
                    );
                })}
            </div>
            <div className={styles.analysisInfo}>
                <span className={styles.savedBadge}>✓ 분석 완료</span>
                <button
                    className={styles.resetButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSegments([]);
                        setIsAnalyzed(false);
                    }}
                >
                    ↩ 다시 분석
                </button>
            </div>
        </div>
    );
}

// Backward compatibility - keep old KeywordHighlighter for existing code
interface KeywordHighlighterProps {
    text: string;
    keywords: string[];
    showBadge?: boolean;
}

/**
 * Legacy Keyword Highlighter Component
 * @deprecated Use CompetencyHighlighter for new features.
 * 
 * @description
 * Simple string matching highlighter for backward compatibility.
 */
export function KeywordHighlighter({ text, keywords, showBadge = false }: KeywordHighlighterProps) {
    if (!text || keywords.length === 0) {
        return <>{text}</>;
    }

    let matchCount = 0;
    const matchedKeywords: string[] = [];

    for (const keyword of keywords) {
        if (text.includes(keyword)) {
            matchCount++;
            matchedKeywords.push(keyword);
        }
    }

    if (matchCount === 0) {
        return <>{text}</>;
    }

    const pattern = new RegExp(`(${keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = text.split(pattern);

    return (
        <span className={styles.container}>
            {parts.map((part, index) => {
                const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
                if (isKeyword) {
                    return (
                        <mark key={index} className={styles.highlight}>
                            {part}
                        </mark>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
            {showBadge && matchCount > 0 && (
                <span className={styles.badge}>
                    키워드 {matchCount}개
                </span>
            )}
        </span>
    );
}

// Utility: simple hash for content comparison
export function getContentHash(text: string): string {
    return simpleHash(text);
}
