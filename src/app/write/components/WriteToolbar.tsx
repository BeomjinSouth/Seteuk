import { Sparkles, SpellCheck, ShieldAlert, Trash2, Brain, Copy, Plus, Minus, SearchCheck } from 'lucide-react';
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
    selectedCount,
    isAllSelected,
    onToggleSelectAll,
    onGenerate,
    onBulkReviewImprove,
    onBulkSpellCheck,
    onBulkForbiddenCheck,
    onBulkCompetencyAnalysis,
    onSimilarityCheck,
    similarityTargetLabel,
    onBulkAdjust,
    onDeleteLearningData,
    isGenerating,
    isBulkReviewImproving,
    isBulkChecking,
    isCompetencyAnalyzing,
    isCheckingSimilarity,
    isBulkAdjusting,
}: WriteToolbarProps) {
    return (
        <div className={styles.toolbarRow}>
            <div className={styles.toolbarLeft}>
                <div className={styles.toolbarTabs}>
                    <button
                        className={`${styles.tabBtn} ${selectedGradeClass === 'all' ? styles.tabBtnActive : ''}`}
                        onClick={() => onGradeClassChange('all')}
                    >
                        전체 <span className={styles.tabCount}>{totalCount}</span>
                    </button>
                    {gradeClassTabs.map((tab) => (
                        <button
                            key={tab.value}
                            className={`${styles.tabBtn} ${selectedGradeClass === tab.value ? styles.tabBtnActive : ''}`}
                            onClick={() => onGradeClassChange(tab.value)}
                        >
                            {tab.label} <span className={styles.tabCount}>{tab.count}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.toolbarCenter}>
                <label className={styles.selectAllLabel}>
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={onToggleSelectAll}
                        className={styles.tableCheckbox}
                    />
                    전체 선택
                </label>

                <Button
                    onClick={onGenerate}
                    disabled={selectedCount === 0 || isGenerating}
                    className={styles.generateBtn}
                >
                    <Sparkles size={16} />
                    AI 세특 생성
                </Button>

                <Button
                    onClick={onBulkReviewImprove}
                    disabled={selectedCount === 0 || isBulkReviewImproving}
                    isLoading={isBulkReviewImproving}
                    className={styles.reviewImproveBtn}
                >
                    <SearchCheck size={16} />
                    RAG 점검·개선
                </Button>

                <div className={styles.toolbarDivider} />

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkSpellCheck}
                    disabled={selectedCount === 0 || isBulkChecking}
                >
                    <SpellCheck size={16} />
                    맞춤법
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkForbiddenCheck}
                    disabled={selectedCount === 0 || isBulkChecking}
                >
                    <ShieldAlert size={16} />
                    금지어
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onBulkCompetencyAnalysis}
                    disabled={selectedCount === 0 || isCompetencyAnalyzing}
                    isLoading={isCompetencyAnalyzing}
                >
                    <Brain size={16} />
                    역량 분석
                </Button>

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onSimilarityCheck}
                    disabled={isCheckingSimilarity}
                    isLoading={isCheckingSimilarity}
                    title={similarityTargetLabel}
                >
                    <Copy size={16} />
                    유사도 ({similarityTargetLabel})
                </Button>

                <div className={styles.toolbarDivider} />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBulkAdjust('expand')}
                    disabled={selectedCount === 0 || isBulkAdjusting}
                    title="선택 학생 내용 늘리기"
                >
                    <Plus size={16} />
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onBulkAdjust('shorten')}
                    disabled={selectedCount === 0 || isBulkAdjusting}
                    title="선택 학생 내용 줄이기"
                >
                    <Minus size={16} />
                </Button>
            </div>

            <div className={styles.toolbarRight}>
                <button
                    className={styles.deleteBtn}
                    onClick={onDeleteLearningData}
                    disabled={selectedCount === 0}
                >
                    <Trash2 size={16} />
                    AI 생성용 데이터 삭제
                </button>
            </div>
        </div>
    );
}
