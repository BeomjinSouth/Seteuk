'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Save,
    Info,
    Sparkles,
    RotateCcw,
    BookOpen,
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SETEUK_DEFAULT_EXAMPLE_TEMPLATE } from '@/lib/prompts/seteuk';
import { useAppStore } from '@/lib/store';
import styles from './page.module.css';

// Tab types
type TabType = 'template' | 'curriculum';

/**
 * Examples Page Component
 * 
 * @description
 * Manages few-shot learning templates and curriculum content.
 * 
 * Features:
 * - Example Template Editor: Edit the reference Se-teuk style for AI generation
 * - Curriculum Editor: Manage curriculum content per grade/semester
 * - Tabs for switching between Template and Curriculum views
 */
export default function ExamplesPage() {
    const { exampleTemplate, setExampleTemplate, setCurriculumContent, getCurriculumContent } = useAppStore();

    const [activeTab, setActiveTab] = useState<TabType>('template');
    const [templateDraft, setTemplateDraft] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    // Curriculum state
    const [selectedGrade, setSelectedGrade] = useState<number>(1);
    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
    const [curriculumDrafts, setCurriculumDrafts] = useState<Record<string, string>>({});
    const content = templateDraft ?? exampleTemplate ?? SETEUK_DEFAULT_EXAMPLE_TEMPLATE;
    const selectedCurriculumKey = `${selectedGrade}-${selectedSemester}`;
    const curriculumText =
        curriculumDrafts[selectedCurriculumKey]
        ?? getCurriculumContent(selectedGrade, selectedSemester)?.content
        ?? '';

    // Save template
    const handleSaveTemplate = () => {
        setExampleTemplate(content);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Reset template
    const handleResetTemplate = () => {
        if (confirm('기본 예시로 초기화하시겠습니까?')) {
            setTemplateDraft(SETEUK_DEFAULT_EXAMPLE_TEMPLATE);
            setExampleTemplate(SETEUK_DEFAULT_EXAMPLE_TEMPLATE);
        }
    };

    // Save curriculum
    const handleSaveCurriculum = () => {
        setCurriculumContent(selectedGrade, selectedSemester, curriculumText);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const grades = [1, 2, 3];
    const semesters: (1 | 2)[] = [1, 2];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>AI 예시 양식</h1>
                    <p className={styles.subtitle}>
                        세특 예시와 교육과정을 관리합니다.
                    </p>
                </div>
            </header>

            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={styles.savedToast}
                    >
                        ✓ 저장되었습니다.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'template' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('template')}
                >
                    <FileText size={16} />
                    예시 양식
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'curriculum' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('curriculum')}
                >
                    <BookOpen size={16} />
                    학년/학기별 교육과정
                </button>
            </div>

            {activeTab === 'template' ? (
                <>
                    {/* Template Tab */}
                    <div className={styles.infoBox}>
                        <Sparkles size={20} />
                        <div>
                            <strong>AI가 참고하는 예시</strong>
                            <p>
                                문체와 표현 기준으로 쓰입니다.
                            </p>
                        </div>
                    </div>

                    <div className={styles.tipsSection}>
                        <h3><Info size={16} /> 작성 팁</h3>
                        <ul>
                            <li><strong>예시 세특</strong>: 참고 문단을 넣으세요</li>
                            <li><strong>어미/어투</strong>: 선호하는 끝맺음을 적으세요</li>
                            <li><strong>자주 쓰는 표현</strong>: 반복 표현을 정리하세요</li>
                            <li><strong>과목 특성</strong>: 핵심 용어를 넣으세요</li>
                        </ul>
                    </div>

                    <section className={styles.editorSection}>
                        <div className={styles.editorHeader}>
                            <FileText size={18} />
                            <span>예시 양식 내용</span>
                            <span className={styles.charCount}>{content.length}자</span>
                            <div className={styles.headerButtons}>
                                <Button variant="secondary" size="sm" onClick={handleResetTemplate}>
                                    <RotateCcw size={14} /> 기본값
                                </Button>
                                <Button size="sm" onClick={handleSaveTemplate}>
                                    <Save size={14} /> 저장
                                </Button>
                            </div>
                        </div>

                        <textarea
                            className={styles.editor}
                            value={content}
                            onChange={(e) => setTemplateDraft(e.target.value)}
                            rows={20}
                            placeholder="예시 세특과 작성 스타일을 입력하세요..."
                        />
                    </section>
                </>
            ) : (
                <>
                    {/* Curriculum Tab */}
                    <div className={styles.infoBox}>
                        <GraduationCap size={20} />
                        <div>
                            <strong>학년·학기별 교육과정</strong>
                            <p>
                                입력한 내용은 세특 작성에 반영됩니다.
                            </p>
                        </div>
                    </div>

                    {/* Grade/Semester Selector */}
                    <div className={styles.selectorSection}>
                        <div className={styles.selectorGroup}>
                            <label>학년</label>
                            <div className={styles.selectorButtons}>
                                {grades.map(grade => (
                                    <button
                                        key={grade}
                                        className={`${styles.selectorBtn} ${selectedGrade === grade ? styles.selected : ''}`}
                                        onClick={() => setSelectedGrade(grade)}
                                    >
                                        {grade}학년
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.selectorGroup}>
                            <label>학기</label>
                            <div className={styles.selectorButtons}>
                                {semesters.map(sem => (
                                    <button
                                        key={sem}
                                        className={`${styles.selectorBtn} ${selectedSemester === sem ? styles.selected : ''}`}
                                        onClick={() => setSelectedSemester(sem)}
                                    >
                                        {sem}학기
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <section className={styles.editorSection}>
                        <div className={styles.editorHeader}>
                            <BookOpen size={18} />
                            <span>{selectedGrade}학년 {selectedSemester}학기 교육과정</span>
                            <span className={styles.charCount}>{curriculumText.length}자</span>
                            <div className={styles.headerButtons}>
                                <Button size="sm" onClick={handleSaveCurriculum}>
                                    <Save size={14} /> 저장
                                </Button>
                            </div>
                        </div>

                        <textarea
                            className={styles.editor}
                            value={curriculumText}
                            onChange={(e) => setCurriculumDrafts((prev) => ({
                                ...prev,
                                [selectedCurriculumKey]: e.target.value,
                            }))}
                            rows={15}
                            placeholder={`${selectedGrade}학년 ${selectedSemester}학기 핵심 내용을 입력하세요.

예시:
- 단원: 세포의 구조와 기능
- 핵심 개념: 세포막, 세포 소기관
- 활동: 현미경 관찰, 모둠 발표`}
                        />
                    </section>

                    {/* Quick overview of all grades */}
                    <section className={styles.overviewSection}>
                        <h3>전체 교육과정 현황</h3>
                        <div className={styles.overviewGrid}>
                            {grades.map(grade => (
                                semesters.map(sem => {
                                    const curr = getCurriculumContent(grade, sem);
                                    const hasContent = curr?.content && curr.content.trim().length > 0;
                                    return (
                                        <div
                                            key={`${grade}-${sem}`}
                                            className={`${styles.overviewCard} ${hasContent ? styles.filled : ''}`}
                                            onClick={() => {
                                                setSelectedGrade(grade);
                                                setSelectedSemester(sem);
                                            }}
                                        >
                                            <span className={styles.overviewLabel}>{grade}-{sem}</span>
                                            <span className={styles.overviewStatus}>
                                                {hasContent ? `${curr?.content.length}자` : '미작성'}
                                            </span>
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
