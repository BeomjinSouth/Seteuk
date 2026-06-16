'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    FileText,
    GraduationCap,
    Info,
    RotateCcw,
    Save,
    Sparkles,
    Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
    DEFAULT_CURRICULUM_CONTEXT_VERSION,
    DEFAULT_CURRICULUM_UNITS,
    getCurriculumUnitsForSubject,
    mergeCurriculumUnits,
    normalizeSubjectKey,
    parseCurriculumContextJson,
    type CurriculumUnitContext,
} from '@/lib/curriculum-context';
import { SETEUK_DEFAULT_EXAMPLE_TEMPLATE } from '@/lib/prompts/seteuk';
import { useAppStore } from '@/lib/store';
import styles from './page.module.css';

type TabType = 'template' | 'curriculum';

interface UnitDraft {
    unit: string;
    concepts: string;
    subUnits: string;
    learningFocus: string;
    activities: string;
    achievementStandards: string;
}

const grades = [1, 2, 3];
const semesters: Array<1 | 2> = [1, 2];

export default function ExamplesPage() {
    const {
        exampleTemplate,
        setExampleTemplate,
        setCurriculumContent,
        getCurriculumContent,
        curriculumUnitOverrides,
        upsertCurriculumUnitOverride,
        resetCurriculumUnitOverride,
        importCurriculumUnitOverrides,
    } = useAppStore();

    const [activeTab, setActiveTab] = useState<TabType>('template');
    const [templateDraft, setTemplateDraft] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState<number>(1);
    const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
    const [selectedSubject, setSelectedSubject] = useState('수학');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [unitDraft, setUnitDraft] = useState<UnitDraft | null>(null);
    const [importText, setImportText] = useState('');
    const [importErrors, setImportErrors] = useState<string[]>([]);
    const [curriculumDrafts, setCurriculumDrafts] = useState<Record<string, string>>({});

    const content = templateDraft ?? exampleTemplate ?? SETEUK_DEFAULT_EXAMPLE_TEMPLATE;
    const selectedCurriculumKey = `${selectedGrade}-${selectedSemester}`;
    const curriculumText =
        curriculumDrafts[selectedCurriculumKey]
        ?? getCurriculumContent(selectedGrade, selectedSemester)?.content
        ?? '';

    const mergedUnits = useMemo(
        () => mergeCurriculumUnits(DEFAULT_CURRICULUM_UNITS, curriculumUnitOverrides),
        [curriculumUnitOverrides]
    );

    const subjectOptions = useMemo(() => {
        const subjects = new Map<string, string>();
        mergedUnits
            .filter((unit) => unit.grade === selectedGrade && unit.semester === selectedSemester)
            .forEach((unit) => {
                subjects.set(normalizeSubjectKey(unit.subject), unit.subject);
            });
        return Array.from(subjects.values()).sort((a, b) => a.localeCompare(b, 'ko'));
    }, [mergedUnits, selectedGrade, selectedSemester]);

    useEffect(() => {
        if (subjectOptions.length === 0) {
            setSelectedSubject('');
            return;
        }
        if (!subjectOptions.some((subject) => normalizeSubjectKey(subject) === normalizeSubjectKey(selectedSubject))) {
            setSelectedSubject(subjectOptions[0]);
        }
    }, [selectedSubject, subjectOptions]);

    const currentUnits = useMemo(() => {
        if (!selectedSubject) return [];
        return getCurriculumUnitsForSubject({
            units: mergedUnits,
            grade: selectedGrade,
            semester: selectedSemester,
            subjectName: selectedSubject,
        });
    }, [mergedUnits, selectedGrade, selectedSemester, selectedSubject]);

    useEffect(() => {
        setSelectedUnitId((current) =>
            currentUnits.some((unit) => unit.id === current) ? current : currentUnits[0]?.id || ''
        );
    }, [currentUnits]);

    const selectedUnit = useMemo(
        () => currentUnits.find((unit) => unit.id === selectedUnitId),
        [currentUnits, selectedUnitId]
    );

    const overriddenUnitIds = useMemo(
        () => new Set(curriculumUnitOverrides.map((unit) => unit.id)),
        [curriculumUnitOverrides]
    );

    useEffect(() => {
        if (!selectedUnit) {
            setUnitDraft(null);
            return;
        }
        setUnitDraft(toUnitDraft(selectedUnit));
    }, [selectedUnit]);

    const showSaved = () => {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
    };

    const handleSaveTemplate = () => {
        setExampleTemplate(content);
        showSaved();
    };

    const handleResetTemplate = () => {
        if (confirm('기본 예시 양식으로 되돌릴까요?')) {
            setTemplateDraft(SETEUK_DEFAULT_EXAMPLE_TEMPLATE);
            setExampleTemplate(SETEUK_DEFAULT_EXAMPLE_TEMPLATE);
            showSaved();
        }
    };

    const handleSaveCurriculum = () => {
        setCurriculumContent(selectedGrade, selectedSemester, curriculumText);
        showSaved();
    };

    const handleSaveUnitOverride = () => {
        if (!selectedUnit || !unitDraft) return;

        const concepts = splitListText(unitDraft.concepts);
        if (concepts.length === 0) {
            setImportErrors(['개념(concepts)은 한 개 이상 필요합니다.']);
            return;
        }

        upsertCurriculumUnitOverride({
            ...selectedUnit,
            unit: unitDraft.unit.trim() || selectedUnit.unit,
            concepts,
            subUnits: splitListText(unitDraft.subUnits),
            learningFocus: unitDraft.learningFocus.trim(),
            activities: splitListText(unitDraft.activities),
            achievementStandards: splitListText(unitDraft.achievementStandards),
        });
        setImportErrors([]);
        showSaved();
    };

    const handleResetUnitOverride = () => {
        if (!selectedUnit) return;
        if (confirm('이 단원의 교사 수정값을 삭제하고 기본값으로 복원할까요?')) {
            resetCurriculumUnitOverride(selectedUnit.id);
            showSaved();
        }
    };

    const handleImportText = () => {
        const result = parseCurriculumContextJson(importText);
        if (result.errors.length > 0) {
            setImportErrors(result.errors);
            return;
        }

        importCurriculumUnitOverrides(result.units);
        const firstUnit = result.units[0];
        if (firstUnit) {
            setSelectedGrade(firstUnit.grade);
            setSelectedSemester(firstUnit.semester);
            setSelectedSubject(firstUnit.subject);
            setSelectedUnitId(firstUnit.id);
        }
        setImportErrors([]);
        showSaved();
    };

    const handleJsonFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImportText(await file.text());
        event.target.value = '';
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>AI 예시 양식</h1>
                    <p className={styles.subtitle}>
                        세특 예시 양식과 단원 context를 관리합니다.
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
                        저장되었습니다.
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.tabs}>
                <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'template' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('template')}
                >
                    <FileText size={16} />
                    예시 양식
                </button>
                <button
                    type="button"
                    className={`${styles.tab} ${activeTab === 'curriculum' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('curriculum')}
                >
                    <BookOpen size={16} />
                    단원 context 관리
                </button>
            </div>

            {activeTab === 'template' ? (
                <>
                    <div className={styles.infoBox}>
                        <Sparkles size={20} />
                        <div>
                            <strong>AI가 참고하는 예시</strong>
                            <p>문체와 표현 기준으로만 사용되며, 학생별 관찰 근거를 대체하지 않습니다.</p>
                        </div>
                    </div>

                    <div className={styles.tipsSection}>
                        <h3><Info size={16} /> 작성 기준</h3>
                        <ul>
                            <li><strong>관찰 행동</strong>: 학생별 입력 자료에 있는 행동을 우선합니다.</li>
                            <li><strong>교과 맥락</strong>: 단원 context나 교육과정 메모는 배경으로만 씁니다.</li>
                            <li><strong>표현</strong>: 과장 칭찬, 리더십 단정, 미래 예측은 피합니다.</li>
                            <li><strong>출력</strong>: 최종 문장은 세특 문장만 남도록 정리합니다.</li>
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
                            onChange={(event) => setTemplateDraft(event.target.value)}
                            rows={20}
                            placeholder="예시 세특과 작성 스타일을 입력하세요."
                        />
                    </section>
                </>
            ) : (
                <>
                    <div className={styles.infoBox}>
                        <GraduationCap size={20} />
                        <div>
                            <strong>단원 context 관리</strong>
                            <p>
                                기본 버전 {DEFAULT_CURRICULUM_CONTEXT_VERSION}을 바탕으로 교사 수정값을 저장합니다.
                                선택된 단원은 /write에서 반별로 AI context에 전달됩니다.
                            </p>
                        </div>
                    </div>

                    <div className={styles.importPanel}>
                        <div className={styles.importHeader}>
                            <div>
                                <strong>JSON 가져오기</strong>
                                <p>version과 units 배열을 가진 JSON을 붙여넣거나 업로드합니다. 가져온 단원은 교사 override로 저장됩니다.</p>
                            </div>
                            <label className={styles.fileButton}>
                                <Upload size={14} />
                                파일 선택
                                <input type="file" accept=".json,application/json" onChange={handleJsonFile} />
                            </label>
                        </div>
                        <textarea
                            className={styles.importTextarea}
                            value={importText}
                            onChange={(event) => setImportText(event.target.value)}
                            rows={5}
                            placeholder='{"version":"2026-middle-school-v1","units":[{"grade":1,"semester":1,"subject":"수학","unit":"문자와 식","concepts":["문자 사용","식의 값"]}]}'
                        />
                        <div className={styles.importActions}>
                            <Button size="sm" onClick={handleImportText} disabled={!importText.trim()}>
                                <Upload size={14} /> 검증 후 가져오기
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => {
                                setImportText('');
                                setImportErrors([]);
                            }}>
                                지우기
                            </Button>
                        </div>
                        {importErrors.length > 0 && (
                            <div className={styles.errorBox}>
                                {importErrors.slice(0, 8).map((error) => (
                                    <p key={error}>{error}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={styles.selectorSection}>
                        <div className={styles.selectorGroup}>
                            <label>학년</label>
                            <div className={styles.selectorButtons}>
                                {grades.map((grade) => (
                                    <button
                                        type="button"
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
                                {semesters.map((semester) => (
                                    <button
                                        type="button"
                                        key={semester}
                                        className={`${styles.selectorBtn} ${selectedSemester === semester ? styles.selected : ''}`}
                                        onClick={() => setSelectedSemester(semester)}
                                    >
                                        {semester}학기
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.selectorGroup}>
                            <label>교과</label>
                            <select
                                className={styles.subjectSelect}
                                value={selectedSubject}
                                onChange={(event) => setSelectedSubject(event.target.value)}
                                disabled={subjectOptions.length === 0}
                            >
                                {subjectOptions.length === 0 ? (
                                    <option value="">등록된 단원 없음</option>
                                ) : subjectOptions.map((subject) => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <section className={styles.curriculumLayout}>
                        <div className={styles.unitListPanel}>
                            <div className={styles.panelHeader}>
                                <strong>단원 목록</strong>
                                <span>{currentUnits.length}개</span>
                            </div>
                            {currentUnits.length === 0 ? (
                                <div className={styles.emptyStateBox}>해당 학년·학기·교과에 등록된 단원이 없습니다.</div>
                            ) : (
                                <div className={styles.unitList}>
                                    {currentUnits.map((unit) => (
                                        <button
                                            type="button"
                                            key={unit.id}
                                            className={`${styles.unitButton} ${selectedUnitId === unit.id ? styles.unitButtonActive : ''}`}
                                            onClick={() => setSelectedUnitId(unit.id)}
                                        >
                                            <span className={styles.unitTitleRow}>
                                                <strong>{unit.unit}</strong>
                                                {overriddenUnitIds.has(unit.id) && <span>수정됨</span>}
                                            </span>
                                            <span className={styles.unitConcepts}>{unit.concepts.slice(0, 4).join(' · ')}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className={styles.unitEditorPanel}>
                            <div className={styles.panelHeader}>
                                <strong>단원 편집</strong>
                                {selectedUnit && (
                                    <span>{selectedGrade}학년 {selectedSemester}학기 {selectedSubject}</span>
                                )}
                            </div>

                            {selectedUnit && unitDraft ? (
                                <>
                                    <div className={styles.unitMetaBar}>
                                        <span className={styles.pill}>id: {selectedUnit.id}</span>
                                        <span className={styles.pill}>
                                            {overriddenUnitIds.has(selectedUnit.id) ? '교사 수정본 적용 중' : '기본값 사용 중'}
                                        </span>
                                    </div>

                                    <div className={styles.unitEditorGrid}>
                                        <label className={styles.fieldGroup}>
                                            <span>단원명</span>
                                            <input
                                                className={styles.textInput}
                                                value={unitDraft.unit}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, unit: event.target.value })}
                                            />
                                        </label>
                                        <label className={styles.fieldGroup}>
                                            <span>핵심 개념</span>
                                            <textarea
                                                className={styles.smallEditor}
                                                value={unitDraft.concepts}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, concepts: event.target.value })}
                                                rows={4}
                                                placeholder="쉼표나 줄바꿈으로 구분"
                                            />
                                        </label>
                                        <label className={styles.fieldGroup}>
                                            <span>세부 단원</span>
                                            <textarea
                                                className={styles.smallEditor}
                                                value={unitDraft.subUnits}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, subUnits: event.target.value })}
                                                rows={3}
                                                placeholder="선택 입력"
                                            />
                                        </label>
                                        <label className={styles.fieldGroup}>
                                            <span>학습 초점</span>
                                            <textarea
                                                className={styles.smallEditor}
                                                value={unitDraft.learningFocus}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, learningFocus: event.target.value })}
                                                rows={3}
                                                placeholder="이 단원에서 학생이 무엇을 읽고, 계산하고, 설명하는지"
                                            />
                                        </label>
                                        <label className={styles.fieldGroup}>
                                            <span>가능 활동</span>
                                            <textarea
                                                className={styles.smallEditor}
                                                value={unitDraft.activities}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, activities: event.target.value })}
                                                rows={3}
                                                placeholder="예: 그래프 해석, 실험 결과 정리"
                                            />
                                        </label>
                                        <label className={styles.fieldGroup}>
                                            <span>성취기준</span>
                                            <textarea
                                                className={styles.smallEditor}
                                                value={unitDraft.achievementStandards}
                                                onChange={(event) => setUnitDraft({ ...unitDraft, achievementStandards: event.target.value })}
                                                rows={3}
                                                placeholder="선택 입력"
                                            />
                                        </label>
                                    </div>

                                    <div className={styles.editorActions}>
                                        <Button variant="secondary" size="sm" onClick={handleResetUnitOverride} disabled={!overriddenUnitIds.has(selectedUnit.id)}>
                                            <RotateCcw size={14} /> 기본값 복원
                                        </Button>
                                        <Button size="sm" onClick={handleSaveUnitOverride}>
                                            <Save size={14} /> 단원 저장
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.emptyStateBox}>편집할 단원을 선택하세요.</div>
                            )}
                        </div>
                    </section>

                    <section className={`${styles.editorSection} ${styles.legacySection}`}>
                        <div className={styles.editorHeader}>
                            <BookOpen size={18} />
                            <span>학년·학기 보조 메모</span>
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
                            onChange={(event) => setCurriculumDrafts((prev) => ({
                                ...prev,
                                [selectedCurriculumKey]: event.target.value,
                            }))}
                            rows={8}
                            placeholder="선택 단원이 없을 때만 fallback context로 참고할 학년·학기 메모를 입력하세요."
                        />
                    </section>

                    <section className={styles.overviewSection}>
                        <h3>단원 context 현황</h3>
                        <div className={styles.overviewGrid}>
                            {grades.map((grade) => (
                                semesters.map((semester) => {
                                    const unitCount = mergedUnits.filter((unit) => unit.grade === grade && unit.semester === semester).length;
                                    const hasLegacyContent = !!getCurriculumContent(grade, semester)?.content?.trim();
                                    return (
                                        <div
                                            key={`${grade}-${semester}`}
                                            className={`${styles.overviewCard} ${unitCount > 0 || hasLegacyContent ? styles.filled : ''}`}
                                            onClick={() => {
                                                setSelectedGrade(grade);
                                                setSelectedSemester(semester);
                                            }}
                                        >
                                            <span className={styles.overviewLabel}>{grade}-{semester}</span>
                                            <span className={styles.overviewStatus}>{unitCount}개 단원</span>
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

function toUnitDraft(unit: CurriculumUnitContext): UnitDraft {
    return {
        unit: unit.unit,
        concepts: unit.concepts.join('\n'),
        subUnits: unit.subUnits?.join('\n') || '',
        learningFocus: unit.learningFocus || '',
        activities: unit.activities?.join('\n') || '',
        achievementStandards: unit.achievementStandards?.join('\n') || '',
    };
}

function splitListText(value: string): string[] {
    return Array.from(new Set(
        value
            .split(/[\n,]/)
            .map((item) => item.trim())
            .filter(Boolean)
    ));
}
