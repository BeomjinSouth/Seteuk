import { ChevronDown, Search, SearchCheck, Shield, Sparkles, SpellCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from '../page.module.css';

interface GradeClassTab {
    value: string;
    label: string;
    count: number;
}

interface WriteToolbarProps {
    gradeClassTabs: GradeClassTab[];
    selectedGradeClass: string;
    onGradeClassChange: (value: string) => void;
    totalCount: number;

    selectedCount: number;
    isAllSelected: boolean;
    onToggleSelectAll: () => void;

    onGenerate: () => void;
    onBulkReviewImprove: () => void;
    onBulkSpellCheck: () => void;
    onBulkForbiddenCheck: () => void;
    onBulkCompetencyAnalysis: () => void;
    onSimilarityCheck: () => void;
    similarityTargetLabel: string;
    onBulkAdjust: (direction: 'expand' | 'shorten') => void;
    onDeleteLearningData: () => void;
    isGenerating: boolean;
    isBulkReviewImproving: boolean;
    isBulkChecking: boolean;
    isCompetencyAnalyzing: boolean;
    isCheckingSimilarity: boolean;
    isBulkAdjusting: boolean;
}

export function WriteToolbar({
    gradeClassTabs,
    selectedGradeClass,
    onGradeClassChange,
    totalCount,
    onGenerate,
    onBulkReviewImprove,
    onBulkSpellCheck,
    onBulkForbiddenCheck,
    onBulkCompetencyAnalysis,
    onDeleteLearningData,
    isGenerating,
    isBulkReviewImproving,
    isBulkChecking,
    isCompetencyAnalyzing,
}: WriteToolbarProps) {
    return (
        <div className={styles.toolbarRow}>
            <div className={styles.toolbarLeft}>
                <span className={styles.toolbarLabel}>반 선택</span>
                <div className={styles.toolbarTabs}>
                    <button
                        type="button"
                        className={`${styles.tabBtn} ${selectedGradeClass === 'all' ? styles.tabBtnActive : ''}`}
                        onClick={() => onGradeClassChange('all')}
                    >
                        전체 <span className={styles.tabCount}>{totalCount}</span>
                    </button>
                    {gradeClassTabs.map((tab) => (
                        <button
                            type="button"
                            key={tab.value}
                            className={`${styles.tabBtn} ${selectedGradeClass === tab.value ? styles.tabBtnActive : ''}`}
                            onClick={() => onGradeClassChange(tab.value)}
                        >
                            {tab.label} <span className={styles.tabCount}>{tab.count}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        className={styles.classMoreBtn}
                        title="다른 반 보기"
                        aria-label="다른 반 보기"
                    >
                        <ChevronDown size={18} />
                    </button>
                </div>
            </div>

            <div className={styles.toolbarCenter}>
                <Button
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className={styles.toolbarActionPrimary}
                    size="sm"
                >
                    <Sparkles size={16} />
                    AI 세특 생성
                </Button>

                <Button
                    onClick={onBulkReviewImprove}
                    disabled={isBulkReviewImproving}
                    isLoading={isBulkReviewImproving}
                    className={styles.toolbarActionReview}
                    size="sm"
                >
                    <Search size={16} />
                    RAG 점검·개선
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkSpellCheck}
                    disabled={isBulkChecking}
                    className={styles.toolbarActionSecondary}
                >
                    <SpellCheck size={16} />
                    맞춤법
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkForbiddenCheck}
                    disabled={isBulkChecking}
                    className={styles.toolbarActionSecondary}
                >
                    <Shield size={16} />
                    금지어
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkCompetencyAnalysis}
                    disabled={isCompetencyAnalyzing}
                    isLoading={isCompetencyAnalyzing}
                    className={styles.toolbarActionSecondary}
                >
                    <SearchCheck size={16} />
                    역량
                </Button>
            </div>

            <div className={styles.toolbarRight}>
                <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={onDeleteLearningData}
                >
                    <Trash2 size={16} />
                    데이터 삭제
                </button>
            </div>
        </div>
    );
}
