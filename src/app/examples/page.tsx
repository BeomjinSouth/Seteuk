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
import { useAppStore } from '@/lib/store';
import styles from './page.module.css';

// Default example template
const DEFAULT_TEMPLATE = `[예시 세특]
김철수 학생은 수업 시간에 집중력 있게 참여하며, 교사의 질문에 적극적으로 답변하는 모습을 보임. 특히 '세포의 구조와 기능' 단원에서 세포 소기관의 역할을 정확하게 이해하고, 이를 실생활 현상과 연결 지어 설명하는 능력이 돋보였음. 모둠 실험 활동에서 현미경 조작을 능숙하게 수행하며 동료들에게 관찰 방법을 안내하는 리더십을 발휘함. 탐구 보고서 작성 시 실험 결과를 체계적으로 정리하고 오차 원인을 논리적으로 분석하는 과학적 탐구 능력을 보여줌.

[어미/어투 특징]
- ~함, ~음, ~였음 등 명사형 어미 사용
- 객관적이고 구체적인 서술
- 학생의 성장과 변화 중심 기술
- 과목 특성을 반영한 용어 사용

[자주 사용하는 표현]
- 적극적으로 참여함
- 깊은 이해를 보여줌
- 논리적으로 분석하는 능력
- 협력하여 문제를 해결함
- 탐구 능력을 발휘함`;

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
    const content = templateDraft ?? exampleTemplate ?? DEFAULT_TEMPLATE;
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
            setTemplateDraft(DEFAULT_TEMPLATE);
            setExampleTemplate(DEFAULT_TEMPLATE);
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
