'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ScanLine,
    Upload,
    Image as ImageIcon,
    FileText,
    Shapes,
    Sparkles,
    Copy,
    Check,
    X,
    Loader2,
    AlertCircle,
    AlertTriangle,
    Plus,
    ClipboardCheck,
    Calendar,
    Users,
    Save,
    Trash2,
    Eye,
    ChevronDown,
    ChevronUp,
    Target,
    Ruler,
    FileTextIcon,
    FolderOpen,
    StickyNote,
    Edit3,
    MessageSquare,
    Maximize2,
    ChevronRight,
    Settings,
    CheckCircle,
    List,
} from 'lucide-react';
// Custom TextareaAutoHeight component implemented below.
import { Button } from '@/components/ui/Button';
import SaveObservationModal from '@/components/SaveObservationModal';
import StudentMappingEditor from '@/components/StudentMappingEditor';
import ClassSelectionTabs from '@/components/ClassSelectionTabs';
import { useAppStore } from '@/lib/store';
import {
    OCREvaluation,
    EvaluationAchievementStandard,
    EvaluationScoringCriteria,
    OCRResultEntry,
    AttachedFile,
    Semester,
    ModelAnswer,
    ModelAnswerBundle,
    ModelAnswerPayload,
    ModelAnswerOption,
    ModelAnswerQuestion,
    StudentMappingItem,
    Student,
    PreliminaryGradingResult,
    TeacherGradingFeedback,
    AmbiguousGradingItem,
    BatchGradingResult,
    StudentGradingResult,
    QuestionGradingResult,
} from '@/types';
import styles from './page.module.css';

// Tab type for the detail view
type DetailTab = 'criteria' | 'files' | 'preliminary' | 'batch' | 'memo';

// Create modal state
interface CreateModalState {
    isOpen: boolean;
    year: number;
    semester: Semester;
    grade: number;
    title: string;
}

interface OcrDraftPayload {
    evaluationId: string;
    updatedAt: string;
    achievementStandards?: EvaluationAchievementStandard[];
    scoringCriteria?: EvaluationScoringCriteria[];
    memo?: string;
    preliminaryGradings?: PreliminaryGradingResult[];
    teacherFeedbackItems?: string[];
    gradingSystemPrompt?: string;
    modelAnswer?: ModelAnswerPayload | null;
    batchGradingResult?: BatchGradingResult | null;
}

const stripAttachedFileData = (files: AttachedFile[]) =>
    files.map(file => {
        const sanitized = { ...file } as AttachedFile;
        delete sanitized.data;
        return sanitized;
    });

const stripOcrResultImageData = (results: OCRResultEntry[]) =>
    results.map(result => {
        const sanitized = { ...result } as OCRResultEntry;
        delete sanitized.imageData;
        return sanitized;
    });

// Helper to parse grading guidelines text into structured object
interface ParsedGuideline {
    score: string;
    description: string;
    example?: string;
}

const parseGradingGuidelines = (text: string): ParsedGuideline[] => {
    if (!text) return [];

    const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const result: ParsedGuideline[] = [];
    let current: ParsedGuideline | null = null;

    const scoreRegex = /^(\d+)\s*(점)?\s*[:.-]?\s*(.*)$/;
    const exampleRegex = /^(예시|example)\s*:\s*(.*)$/i;

    lines.forEach(line => {
        const scoreMatch = line.match(scoreRegex);
        if (scoreMatch) {
            if (current) result.push(current);
            const scoreValue = scoreMatch[1];
            const description = (scoreMatch[3] || '').trim();
            current = { score: `${scoreValue}점`, description };
            return;
        }

        const exampleMatch = line.match(exampleRegex);
        if (exampleMatch && current) {
            current.example = (exampleMatch[2] || '').trim();
            return;
        }

        if (current) {
            if (current.example) {
                current.example = `${current.example} ${line}`.trim();
            } else {
                current.description = `${current.description} ${line}`.trim();
            }
        }
    });

    if (current) result.push(current);

    return result;
};

const getQuestionPreview = (text: string) => {
    if (!text) return '';
    const cleaned = text.replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    const maxLength = 48;
    const sentenceEnd = cleaned.search(/[.!?。？！]/);
    const cutIndex = sentenceEnd !== -1 && sentenceEnd < maxLength ? sentenceEnd + 1 : maxLength;
    if (cleaned.length <= cutIndex) return cleaned;
    return `${cleaned.slice(0, cutIndex).trim()}...`;
};

const getRubricBadgeLabel = (point: string) => {
    if (!point) return '';
    const cleaned = point.replace(/\s+/g, ' ').trim();
    if (!cleaned) return '';
    const separators = ['(', ':', ' - ', '·', '•', '|', '/'];
    let cutIndex = cleaned.length;
    separators.forEach(separator => {
        const idx = cleaned.indexOf(separator);
        if (idx > 0 && idx < cutIndex) {
            cutIndex = idx;
        }
    });
    const label = cleaned.slice(0, cutIndex).trim();
    return label || cleaned;
};

const getLevelBadgeClass = (value: string) => {
    if (!value) return styles.levelCustom;
    const normalized = value.toLowerCase();
    if (normalized.includes('상') || normalized.includes('high')) return styles.levelHigh;
    if (normalized.includes('중') || normalized.includes('mid')) return styles.levelMid;
    if (normalized.includes('하') || normalized.includes('low')) return styles.levelLow;
    return styles.levelCustom;
};

const formatQuestionScoreSummary = (questionResults?: QuestionGradingResult[]) => {
    if (!questionResults || questionResults.length === 0) return '';
    const maxItems = 6;
    const summary = questionResults
        .slice(0, maxItems)
        .map(result => `${result.questionNumber}번 ${result.score}/${result.maxScore}`)
        .join(', ');
    if (questionResults.length <= maxItems) return summary;
    return `${summary} 외 ${questionResults.length - maxItems}문항`;
};

const buildOcrLearningPayload = (evaluationTitle: string, result: StudentGradingResult) => {
    const title = evaluationTitle?.trim() ? evaluationTitle.trim() : '평가';
    const payload: Record<string, string> = {};
    const feedback = result.overallFeedback?.trim() || '';
    payload[`OCR 총평 (${title})`] = feedback ? `OCR 총평(${title}): ${feedback}` : '';

    if (Number.isFinite(result.totalScore) && Number.isFinite(result.maxTotalScore)) {
        const levelSuffix = result.achievementLevel ? ` · 성취도 ${result.achievementLevel}` : '';
        payload[`OCR 채점 요약 (${title})`] = `OCR 채점 요약(${title}): ${result.totalScore}/${result.maxTotalScore}점${levelSuffix}`;
    }

    const questionSummary = formatQuestionScoreSummary(result.questionResults);
    if (questionSummary) {
        payload[`OCR 문항별 요약 (${title})`] = `문항별 점수(${title}): ${questionSummary}`;
    }

    return payload;
};

const parseJsonValue = <T,>(value: unknown, fallback: T): T => {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== 'string') return value as T;
    if (!value.trim()) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

const ensureArray = <T,>(value: unknown, fallback: T[] = []): T[] => {
    const parsed = parseJsonValue<unknown>(value, fallback as unknown as T[]);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
};

const normalizeAchievementStandards = (value: unknown): EvaluationAchievementStandard[] => {
    const standards = ensureArray<EvaluationAchievementStandard>(value);
    return standards.map((standard, index) => ({
        ...standard,
        id: standard.id || `std-${index}`,
        code: standard.code || '',
        description: standard.description || '',
        levels: Array.isArray(standard.levels) && standard.levels.length > 0
            ? standard.levels
            : [
                { level: "상", description: "" },
                { level: "중", description: "" },
                { level: "하", description: "" },
            ],
    }));
};

const normalizeScoringCriteria = (value: unknown): EvaluationScoringCriteria[] => {
    const criteria = ensureArray<EvaluationScoringCriteria>(value);
    return criteria.map((item, index) => ({
        ...item,
        id: item.id || `crit-${index}`,
        element: item.element || '',
        levels: Array.isArray(item.levels) && item.levels.length > 0
            ? item.levels
            : [
                { score: 4, description: '' },
                { score: 3, description: '' },
                { score: 2, description: '' },
                { score: 1, description: '' },
            ],
    }));
};

const normalizeModelAnswer = (value: unknown): ModelAnswerBundle | null => {
    const parsed = parseJsonValue<ModelAnswerPayload | null>(value, null);
    if (!parsed || typeof parsed !== 'object') return null;

    const normalizeQuestions = (questionsValue: unknown) => {
        const questions = Array.isArray(questionsValue) ? questionsValue : [];
        return questions.map((question: Partial<ModelAnswerQuestion>, index: number) => {
            const normalizedAnswers = Array.isArray(question.answers) && question.answers.length > 0
                ? question.answers
                : (question.answer ? [{ label: '표준 답안', content: question.answer }] : []);

            return {
                ...question,
                questionNumber: typeof question.questionNumber === 'number' ? question.questionNumber : index + 1,
                questionText: question.questionText ?? '',
                answers: normalizedAnswers.length > 0 ? normalizedAnswers : [{ label: '표준 답안', content: '' }],
                rubricPoints: Array.isArray(question.rubricPoints) ? question.rubricPoints : [],
                answer: normalizedAnswers[0]?.content || question.answer || '',
            };
        });
    };

    const mergeAnswerSets = (sets: ModelAnswerBundle['sets']) => {
        if (!Array.isArray(sets) || sets.length <= 1) return sets;

        const [baseSet, ...restSets] = sets;
        const mergedQuestions = baseSet.questions.map(question => ({
            ...question,
            answers: Array.isArray(question.answers)
                ? [...question.answers]
                : (question.answer ? [{ label: '표준 답안', content: question.answer }] : []),
        }));
        const questionMap = new Map(mergedQuestions.map(question => [question.questionNumber, question]));

        const normalizeAnswer = (value: string) => value.replace(/\s+/g, ' ').trim().toLowerCase();

        restSets.forEach((set) => {
            set.questions.forEach((question) => {
                const incomingAnswers = Array.isArray(question.answers) && question.answers.length > 0
                    ? question.answers
                    : (question.answer ? [{ label: '표준 답안', content: question.answer }] : []);

                if (!questionMap.has(question.questionNumber)) {
                    const normalized = {
                        ...question,
                        answers: incomingAnswers.length > 0 ? [...incomingAnswers] : [{ label: '표준 답안', content: '' }],
                        answer: incomingAnswers[0]?.content || question.answer || '',
                    };
                    questionMap.set(question.questionNumber, normalized);
                    mergedQuestions.push(normalized);
                    return;
                }

                const target = questionMap.get(question.questionNumber);
                if (!target) return;

                const seen = new Set(
                    (target.answers || []).map(answer => normalizeAnswer(answer.content ?? ''))
                );

                incomingAnswers.forEach((answer) => {
                    const key = normalizeAnswer(answer.content ?? '');
                    const dedupeKey = key || '__empty__';
                    if (seen.has(dedupeKey)) return;
                    seen.add(dedupeKey);
                    target.answers = target.answers || [];
                    target.answers.push({
                        label: answer.label ?? '추가 답안',
                        content: answer.content ?? '',
                    });
                });

                if (!target.answer && target.answers.length > 0) {
                    target.answer = target.answers[0].content;
                }
            });
        });

        return [
            {
                ...baseSet,
                questions: mergedQuestions,
            },
        ];
    };

    // New bundle shape (tabbed sets)
    if ('sets' in parsed && Array.isArray((parsed as ModelAnswerBundle).sets)) {
        const bundle = parsed as ModelAnswerBundle;
        const normalizedSets = bundle.sets.map((set, index) => ({
            ...set,
            id: set.id || `set-${index}`,
            label: set.label || `답안 ${index + 1}`,
            questions: normalizeQuestions(set.questions),
            generatedAt: set.generatedAt || bundle.generatedAt || new Date().toISOString(),
        }));

        return {
            ...bundle,
            id: bundle.id || `ma-${Date.now()}`,
            sourceFileId: bundle.sourceFileId || '',
            generatedAt: bundle.generatedAt || new Date().toISOString(),
            sets: mergeAnswerSets(normalizedSets),
        };
    }

    // Legacy single-set shape
    const legacy = parsed as ModelAnswer;
    const normalizedQuestions = normalizeQuestions(legacy.questions);
    const legacyGeneratedAt = legacy.generatedAt || new Date().toISOString();

    return {
        id: legacy.id || `ma-${Date.now()}`,
        sourceFileId: legacy.sourceFileId || '',
        generatedAt: legacyGeneratedAt,
        editedAt: legacy.editedAt,
        sets: [
            {
                id: 'standard',
                label: '표준 해설',
                questions: normalizedQuestions,
                generatedAt: legacyGeneratedAt,
                editedAt: legacy.editedAt,
            },
        ],
    };
};

// Custom Textarea component that auto-resizes
const TextareaAutoHeight = ({ value, onChange, className, style, placeholder }: { value: string, onChange: (val: string) => void, className?: string, style?: React.CSSProperties, placeholder?: string }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={className}
            style={style}
            placeholder={placeholder}
            rows={1}
        />
    );
};

/**
 * OCR Page Component
 * 
 * @description
 * Main page for OCR-based evaluation management.
 * 
 * Features:
 * - Evaluation List: Manage assessment evaluations by year/semester
 * - Evaluation Creator: Create new evaluations with rubrics
 * - OCR Analysis: Upload and analyze student worksheets/exams
 * - Rubric Management: Edit achievement standards and scoring criteria
 * - Batch Grading: Link students to uploaded PDFs for batch analysis
 * - Preliminary Grading: Test grading criteria on sample students
 */
export default function OCRPage() {
    // Evaluations state
    const [evaluations, setEvaluations] = useState<OCREvaluation[]>([]);
    const [selectedEvaluation, setSelectedEvaluation] = useState<OCREvaluation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraftHydrated, setIsDraftHydrated] = useState(false);
    const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const teacher = useAppStore((state) => state.teacher);
    const classes = useAppStore((state) => state.classes);
    const students = useAppStore((state) => state.students);
    const updateStudentLearningData = useAppStore((state) => state.updateStudentLearningData);
    const teacherKey = useMemo(() => {
        if (!teacher) return 'guest';
        const rawKey = `${teacher.name}|${teacher.school}|${teacher.subject}`.trim();
        return encodeURIComponent(rawKey || 'guest');
    }, [teacher]);

    const gradeStudents = useMemo(() => {
        if (!selectedEvaluation) return [];
        const classMap = new Map(classes.map(cls => [cls.id, cls]));
        return students
            .filter(student => {
                const cls = classMap.get(student.classId);
                const grade = student.grade ?? cls?.grade;
                if (grade !== selectedEvaluation.grade) return false;
                if (teacher?.school && student.school && student.school !== teacher.school) return false;
                return true;
            })
            .sort((a, b) => {
                const classA = a.classNumber ?? classMap.get(a.classId)?.classNumber ?? 0;
                const classB = b.classNumber ?? classMap.get(b.classId)?.classNumber ?? 0;
                if (classA !== classB) return classA - classB;
                return a.number - b.number;
            });
    }, [students, classes, selectedEvaluation, teacher?.school]);

    const buildDraftKey = useCallback((evaluationId: string) => {
        const safeId = encodeURIComponent(evaluationId);
        return `ocr-evaluation-draft::${teacherKey}::${safeId}`;
    }, [teacherKey]);

    const loadDraft = useCallback((evaluationId: string): OcrDraftPayload | null => {
        if (typeof window === 'undefined') return null;
        const storageKey = buildDraftKey(evaluationId);
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as OcrDraftPayload;
            if (parsed && parsed.evaluationId === evaluationId) {
                return parsed;
            }
        } catch (err) {
            console.warn('Failed to parse OCR draft payload', err);
        }
        return null;
    }, [buildDraftKey]);

    // Filters
    const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());
    const [filterSemester, setFilterSemester] = useState<Semester | ''>('');
    const [filterGrade, setFilterGrade] = useState<number | ''>('');

    // Detail view state
    const [activeTab, setActiveTab] = useState<DetailTab>('criteria');

    // Create modal
    const [createModal, setCreateModal] = useState<CreateModalState>({
        isOpen: false,
        year: new Date().getFullYear(),
        semester: '1',
        grade: 1,
        title: '',
    });

    // OCR analysis state (for the OCR tab)
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [ocrResult, setOcrResult] = useState<OCRResultEntry | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);

    // Rubric extraction state
    const [isExtractingRubric, setIsExtractingRubric] = useState(false);
    const rubricFileInputRef = useRef<HTMLInputElement>(null);

    // Achievement standards & scoring criteria (editable within selected evaluation)
    const [achievementStandards, setAchievementStandards] = useState<EvaluationAchievementStandard[]>([]);
    const [scoringCriteria, setScoringCriteria] = useState<EvaluationScoringCriteria[]>([]);
    const [memo, setMemo] = useState('');

    // Model answer state
    const [modelAnswer, setModelAnswer] = useState<ModelAnswerBundle | null>(null);
    const [isGeneratingModelAnswer, setIsGeneratingModelAnswer] = useState(false);
    const [selectedAssessmentFileId, setSelectedAssessmentFileId] = useState<string | null>(null);
    const resolvedModelAnswer = useMemo(
        () => normalizeModelAnswer(modelAnswer ?? selectedEvaluation?.modelAnswer),
        [modelAnswer, selectedEvaluation?.modelAnswer]
    );
    const [activeModelAnswerSetId, setActiveModelAnswerSetId] = useState<string | null>(null);
    const activeModelAnswerSet = useMemo(() => {
        if (!resolvedModelAnswer || resolvedModelAnswer.sets.length === 0) return null;
        if (activeModelAnswerSetId) {
            const found = resolvedModelAnswer.sets.find(set => set.id === activeModelAnswerSetId);
            if (found) return found;
        }
        return resolvedModelAnswer.sets[0];
    }, [resolvedModelAnswer, activeModelAnswerSetId]);

    useEffect(() => {
        if (!resolvedModelAnswer || resolvedModelAnswer.sets.length === 0) {
            setActiveModelAnswerSetId(null);
            return;
        }
        if (!activeModelAnswerSetId || !resolvedModelAnswer.sets.some(set => set.id === activeModelAnswerSetId)) {
            setActiveModelAnswerSetId(resolvedModelAnswer.sets[0].id);
        }
    }, [resolvedModelAnswer, activeModelAnswerSetId]);

    // Batch grading state
    const [batchPdfData, setBatchPdfData] = useState<string | null>(null);
    const [pagesPerStudent, setPagesPerStudent] = useState(2);
    const [mappingItems, setMappingItems] = useState<StudentMappingItem[]>([]);
    const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
    const [isBatchGrading, setIsBatchGrading] = useState(false);
    const [batchProgress, setBatchProgress] = useState(0);
    const batchPdfInputRef = useRef<HTMLInputElement>(null);

    // Preliminary grading state
    const [preliminaryGradings, setPreliminaryGradings] = useState<PreliminaryGradingResult[]>([]);
    const [currentPrelimIndex, setCurrentPrelimIndex] = useState(0);
    const [isPrelimGrading, setIsPrelimGrading] = useState(false);
    const [teacherFeedbackItems, setTeacherFeedbackItems] = useState<string[]>([]);
    const [newFeedbackItem, setNewFeedbackItem] = useState('');


    // System prompt state
    const [gradingSystemPrompt, setGradingSystemPrompt] = useState('');
    const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);

    // Sidebar collapse state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Class selection state for tabs
    const [selectedClass, setSelectedClass] = useState<string>('all');

    // Filtered students for the specific tabs
    const filteredGradeStudents = useMemo(() => {
        if (selectedClass === 'all') return gradeStudents;
        const [targetGrade, targetClass] = selectedClass.split('-').map(Number);
        const targetClassStr = `${targetClass}`;
        return gradeStudents.filter(s => {
            const cls = classes.find(c => c.id === s.classId);
            const classNum = s.classNumber || cls?.classNumber;
            return classNum === Number(targetClassStr);
        });
    }, [gradeStudents, selectedClass, classes]);

    // Grade-Class Tabs with counts (derived from gradeStudents)
    const gradeClassTabs = useMemo(() => {
        const gradeClassMap = new Map<string, number>();

        gradeStudents.forEach(s => {
            const cls = classes.find(c => c.id === s.classId);
            const grade = s.grade || cls?.grade || 0;
            const classNum = s.classNumber || cls?.classNumber || 0;

            if (grade > 0 && classNum > 0) {
                const key = `${grade}-${classNum}`;
                gradeClassMap.set(key, (gradeClassMap.get(key) || 0) + 1);
            }
        });

        return Array.from(gradeClassMap.entries())
            .sort((a, b) => {
                const [gradeA, classA] = a[0].split('-').map(Number);
                const [gradeB, classB] = b[0].split('-').map(Number);
                if (gradeA !== gradeB) return gradeA - gradeB;
                return classA - classB;
            })
            .map(([key, count]) => {
                const [grade, classNum] = key.split('-');
                return {
                    value: key,
                    label: `${classNum}반`,
                    count
                };
            });
    }, [gradeStudents, classes]);



    // === UI State for Model Answer ===
    const [expandedQuestionIds, setExpandedQuestionIds] = useState<Set<number>>(new Set([1])); // Default 1st question open
    const [activeAnswerTabs, setActiveAnswerTabs] = useState<Record<number, number>>({}); // questionNumber -> answer index
    const [editingGuidelineIds, setEditingGuidelineIds] = useState<Record<number, boolean>>({}); // questionNumber -> isEditing
    const [editingRubricPointIds, setEditingRubricPointIds] = useState<Record<number, boolean>>({});

    const toggleQuestionExpansion = (qNum: number) => {
        setExpandedQuestionIds(prev => {
            const next = new Set(prev);
            if (next.has(qNum)) {
                next.delete(qNum);
            } else {
                next.add(qNum);
            }
            return next;
        });
    };

    const applyBatchResult = useCallback((nextBatch: BatchGradingResult) => {
        if (!selectedEvaluation) return;
        const evaluationId = selectedEvaluation.id;
        setSelectedEvaluation(prev => (prev && prev.id === evaluationId
            ? { ...prev, batchGradingResult: nextBatch }
            : prev
        ));
        setEvaluations(prev => prev.map(e =>
            e.id === evaluationId ? { ...e, batchGradingResult: nextBatch } : e
        ));
    }, [selectedEvaluation]);

    const syncStudentLearningDataFromResult = useCallback((result: StudentGradingResult) => {
        if (!selectedEvaluation || !result?.studentId) return;
        const payload = buildOcrLearningPayload(selectedEvaluation.title, result);
        updateStudentLearningData(result.studentId, payload);
    }, [selectedEvaluation, updateStudentLearningData]);

    // Load evaluations on mount
    useEffect(() => {
        fetchEvaluations();
    }, []);

    // Load selected evaluation data (with account-specific draft)
    useEffect(() => {
        if (!selectedEvaluation) {
            setAchievementStandards([]);
            setScoringCriteria([]);
            setMemo('');
            setPreliminaryGradings([]);
            setTeacherFeedbackItems([]);
            setGradingSystemPrompt('');
            setModelAnswer(null);
            setIsDraftHydrated(false);
            return;
        }

        setIsDraftHydrated(false);

        const teacherFeedback = parseJsonValue<TeacherGradingFeedback | null>(selectedEvaluation.teacherFeedback, null);

        let nextAchievementStandards = normalizeAchievementStandards(selectedEvaluation.achievementStandards);
        let nextScoringCriteria = normalizeScoringCriteria(selectedEvaluation.scoringCriteria);
        let nextMemo = selectedEvaluation.memo || '';
        let nextPreliminaryGradings = ensureArray<PreliminaryGradingResult>(selectedEvaluation.preliminaryGradings);
        let nextTeacherFeedbackItems = ensureArray<string>(teacherFeedback?.feedbackItems);
        let nextGradingSystemPrompt = selectedEvaluation.gradingSystemPrompt || teacherFeedback?.generatedPrompt || '';
        let nextModelAnswer = normalizeModelAnswer(selectedEvaluation.modelAnswer);
        let nextBatchGradingResult = parseJsonValue<BatchGradingResult | null>(selectedEvaluation.batchGradingResult, null);

        const draft = loadDraft(selectedEvaluation.id);
        if (draft) {
            if (draft.achievementStandards !== undefined) {
                nextAchievementStandards = normalizeAchievementStandards(draft.achievementStandards);
            }
            if (draft.scoringCriteria !== undefined) {
                nextScoringCriteria = normalizeScoringCriteria(draft.scoringCriteria);
            }
            if (draft.memo !== undefined) nextMemo = draft.memo;
            if (draft.preliminaryGradings !== undefined) {
                nextPreliminaryGradings = ensureArray<PreliminaryGradingResult>(draft.preliminaryGradings);
            }
            if (draft.teacherFeedbackItems !== undefined) {
                nextTeacherFeedbackItems = ensureArray<string>(draft.teacherFeedbackItems);
            }
            if (draft.gradingSystemPrompt !== undefined) nextGradingSystemPrompt = draft.gradingSystemPrompt;
            if (draft.modelAnswer !== undefined) nextModelAnswer = normalizeModelAnswer(draft.modelAnswer);
            if (draft.batchGradingResult !== undefined) {
                nextBatchGradingResult = parseJsonValue<BatchGradingResult | null>(draft.batchGradingResult, null);
            }
        }

        setAchievementStandards(nextAchievementStandards);
        setScoringCriteria(nextScoringCriteria);
        setMemo(nextMemo);
        setPreliminaryGradings(nextPreliminaryGradings);
        setTeacherFeedbackItems(nextTeacherFeedbackItems);
        setGradingSystemPrompt(nextGradingSystemPrompt);
        setModelAnswer(nextModelAnswer);
        if (nextBatchGradingResult) {
            setSelectedEvaluation(prev => prev ? { ...prev, batchGradingResult: nextBatchGradingResult } : prev);
        }
        setIsDraftHydrated(true);
    }, [selectedEvaluation?.id, loadDraft]);

    // Auto-save draft per account + evaluation
    useEffect(() => {
        if (!selectedEvaluation || !isDraftHydrated) return;
        if (typeof window === 'undefined') return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            const storageKey = buildDraftKey(selectedEvaluation.id);
            const payload: OcrDraftPayload = {
                evaluationId: selectedEvaluation.id,
                updatedAt: new Date().toISOString(),
                achievementStandards,
                scoringCriteria,
                memo,
                preliminaryGradings,
                teacherFeedbackItems,
                gradingSystemPrompt,
                modelAnswer: resolvedModelAnswer ?? null,
                batchGradingResult: selectedEvaluation.batchGradingResult ?? null,
            };

            try {
                localStorage.setItem(storageKey, JSON.stringify(payload));
            } catch (err) {
                console.warn('Failed to save OCR draft payload', err);
            }
        }, 600);

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [
        selectedEvaluation?.id,
        isDraftHydrated,
        achievementStandards,
        scoringCriteria,
        memo,
        preliminaryGradings,
        teacherFeedbackItems,
        gradingSystemPrompt,
        resolvedModelAnswer,
        selectedEvaluation?.batchGradingResult,
        buildDraftKey,
    ]);

    const fetchEvaluations = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/ocr-evaluations');
            const data = await response.json();
            if (data.success) {
                setEvaluations(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch evaluations:', err);
            setError('평가 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter evaluations
    const filteredEvaluations = evaluations.filter(e => {
        if (filterYear && e.year !== filterYear) return false;
        if (filterSemester && e.semester !== filterSemester) return false;
        if (filterGrade && e.grade !== filterGrade) return false;
        return true;
    });

    // Group evaluations by year/semester
    const groupedEvaluations = filteredEvaluations.reduce((acc, e) => {
        const key = `${e.year}학년도 ${e.semester}학기`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(e);
        return acc;
    }, {} as Record<string, OCREvaluation[]>);

    // Create new evaluation
    const handleCreateEvaluation = async () => {
        if (!createModal.title.trim()) {
            setError('평가명을 입력해 주세요');
            return;
        }

        try {
            const response = await fetch('/api/ocr-evaluations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    year: createModal.year,
                    semester: createModal.semester,
                    grade: createModal.grade,
                    title: createModal.title,
                    achievementStandards: [{
                        id: `std - ${Date.now()}`,
                        code: '',
                        description: '',
                        levels: [
                            { level: "상", description: "" },
                            { level: "중", description: "" },
                            { level: "하", description: "" },
                        ]
                    }],
                    scoringCriteria: [{
                        id: `crit - ${Date.now()}`,
                        element: '',
                        levels: [
                            { score: 4, description: '' },
                            { score: 3, description: '' },
                            { score: 2, description: '' },
                            { score: 1, description: '' },
                        ]
                    }],
                }),
            });

            const data = await response.json();

            if (data.success) {
                setCreateModal({ ...createModal, isOpen: false, title: '' });
                fetchEvaluations();
            } else {
                setError(data.error || '평가 등록에 실패했습니다.');
            }
        } catch (err) {
            console.error('Failed to create evaluation:', err);
            setError('평가 등록에 실패했습니다.');
        }
    };

    // Save current evaluation
    const handleSaveEvaluation = async () => {
        if (!selectedEvaluation) return;

        setIsSaving(true);
        try {
            const response = await fetch('/api/ocr-evaluations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedEvaluation.id,
                    achievementStandards,
                    scoringCriteria,
                    memo,
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update local state
                setEvaluations(prev => prev.map(e =>
                    e.id === selectedEvaluation.id
                        ? { ...e, achievementStandards, scoringCriteria, memo }
                        : e
                ));
                setSelectedEvaluation(prev => prev ? { ...prev, achievementStandards, scoringCriteria, memo } : null);
            } else {
                setError(data.error || '저장에 실패했습니다.');
            }
        } catch (err) {
            console.error('Failed to save evaluation:', err);
            setError('저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    // Delete evaluation
    const handleDeleteEvaluation = async () => {
        if (!selectedEvaluation) return;
        if (!confirm('이 평가를 삭제하시겠습니까? 모든 데이터가 삭제됩니다.')) return;

        try {
            const evaluationId = selectedEvaluation.id;
            const response = await fetch(`/api/ocr-evaluations?id=${selectedEvaluation.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setSelectedEvaluation(null);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem(buildDraftKey(evaluationId));
                }
                fetchEvaluations();
            } else {
                setError(data.error || '삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('Failed to delete evaluation:', err);
            setError('삭제에 실패했습니다.');
        }
    };

    // === Achievement Standards Management ===
    const addAchievementStandard = () => {
        setAchievementStandards(prev => [...prev, {
            id: `std - ${Date.now()}`,
            code: '',
            description: '',
            levels: [
                { level: "상", description: "" },
                { level: "중", description: "" },
                { level: "하", description: "" },
            ]
        }]);
    };

    const removeAchievementStandard = (id: string) => {
        if (achievementStandards.length > 1) {
            setAchievementStandards(prev => prev.filter(s => s.id !== id));
        }
    };

    const updateAchievementStandard = (id: string, field: 'code' | 'description', value: string) => {
        setAchievementStandards(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    const updateAchievementLevel = (standardId: string, levelIndex: number, description: string) => {
        setAchievementStandards(prev => prev.map(s =>
            s.id === standardId ? {
                ...s,
                levels: s.levels.map((l, i) =>
                    i === levelIndex ? { ...l, description } : l
                )
            } : s
        ));
    };

    // === Scoring Criteria Management ===
    const addScoringCriteria = () => {
        setScoringCriteria(prev => [...prev, {
            id: `crit - ${Date.now()}`,
            element: '',
            levels: [
                { score: 4, description: '' },
                { score: 3, description: '' },
                { score: 2, description: '' },
                { score: 1, description: '' },
            ]
        }]);
    };

    const removeScoringCriteria = (id: string) => {
        if (scoringCriteria.length > 1) {
            setScoringCriteria(prev => prev.filter(c => c.id !== id));
        }
    };

    const updateScoringCriteria = (id: string, element: string) => {
        setScoringCriteria(prev => prev.map(c =>
            c.id === id ? { ...c, element } : c
        ));
    };

    const updateScoringLevel = (criteriaId: string, levelIndex: number, description: string) => {
        setScoringCriteria(prev => prev.map(c =>
            c.id === criteriaId ? {
                ...c,
                levels: c.levels.map((l, i) =>
                    i === levelIndex ? { ...l, description } : l
                )
            } : c
        ));
    };

    const updateScoringLevelScore = (criteriaId: string, levelIndex: number, score: number) => {
        setScoringCriteria(prev => prev.map(c =>
            c.id === criteriaId ? {
                ...c,
                levels: c.levels.map((l, i) =>
                    i === levelIndex ? { ...l, score } : l
                )
            } : c
        ));
    };

    // === Rubric File Upload (Extract) ===
    const handleRubricFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
            setError('이미지 또는 PDF 파일만 업로드 가능합니다.');
            return;
        }

        setIsExtractingRubric(true);
        setError(null);

        try {
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const response = await fetch('/api/rubric-extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Data }),
            });

            const data = await response.json();

            if (data.success && data.result) {
                if (data.result.achievementStandards?.length > 0) {
                    setAchievementStandards(data.result.achievementStandards.map((std: { code?: string; description?: string; levels?: Array<{ level: string; description: string }> }, i: number) => ({
                        id: `std - ${Date.now()} - ${i}`,
                        code: std.code || '',
                        description: std.description || '',
                        levels: std.levels?.length ? std.levels : [
                            { level: "상", description: "" },
                            { level: "중", description: "" },
                            { level: "하", description: "" },
                        ]
                    })));
                }

                if (data.result.scoringCriteria?.length > 0) {
                    setScoringCriteria(data.result.scoringCriteria.map((crit: { element?: string; levels?: Array<{ score: number; description: string }> }, i: number) => ({
                        id: `crit - ${Date.now()} - ${i}`,
                        element: crit.element || '',
                        levels: crit.levels?.length ? crit.levels : [
                            { score: 4, description: '' },
                            { score: 3, description: '' },
                            { score: 2, description: '' },
                            { score: 1, description: '' },
                        ]
                    })));
                }

                if (!data.result.achievementStandards?.length && !data.result.scoringCriteria?.length) {
                    setError('이미지에서 채점기준을 찾지 못했습니다.');
                }
            } else {
                setError(data.error || '채점기준 분석에 실패했습니다.');
            }
        } catch (err) {
            console.error('Rubric extraction error:', err);
            setError('채점기준 분석 중 오류가 발생했습니다.');
        } finally {
            setIsExtractingRubric(false);
            if (rubricFileInputRef.current) {
                rubricFileInputRef.current.value = '';
            }
        }
    };

    // === PDF/File Upload ===
    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedEvaluation) return;

        try {
            const base64Data = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const newFile: AttachedFile = {
                id: `file - ${Date.now()}`,
                name: file.name,
                type: file.type === 'application/pdf' ? 'pdf' : 'image',
                data: base64Data,
                uploadedAt: new Date().toISOString(),
            };

            const updatedFiles = [...(selectedEvaluation.attachedFiles || []), newFile];
            const filesForSave = stripAttachedFileData(updatedFiles);

            // Save to server
            const response = await fetch('/api/ocr-evaluations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedEvaluation.id,
                    attachedFiles: filesForSave,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSelectedEvaluation(prev => prev ? { ...prev, attachedFiles: updatedFiles } : null);
                setEvaluations(prev => prev.map(e =>
                    e.id === selectedEvaluation.id
                        ? { ...e, attachedFiles: updatedFiles }
                        : e
                ));
            }
        } catch (err) {
            console.error('File upload error:', err);
            setError('파일 업로드에 실패했습니다.');
        }

        if (pdfInputRef.current) {
            pdfInputRef.current.value = '';
        }
    };

    // Delete attached file
    const handleDeleteFile = async (fileId: string) => {
        if (!selectedEvaluation) return;

        const updatedFiles = selectedEvaluation.attachedFiles.filter(f => f.id !== fileId);
        const filesForSave = stripAttachedFileData(updatedFiles);

        try {
            const response = await fetch('/api/ocr-evaluations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedEvaluation.id,
                    attachedFiles: filesForSave,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSelectedEvaluation(prev => prev ? { ...prev, attachedFiles: updatedFiles } : null);
            }
        } catch (err) {
            console.error('File delete error:', err);
        }
    };

    // === OCR Analysis ===
    const handleFile = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드 가능합니다.');
            return;
        }

        setImageFile(file);
        setError(null);
        setOcrResult(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }, []);

    const analyzeImage = async () => {
        if (!image || !selectedEvaluation) return;

        setIsAnalyzing(true);
        setError(null);

        try {
            const base64Data = image.split(',')[1];

            // Build rubric context
            const achievementStandardText = achievementStandards
                .filter(s => s.code || s.description)
                .map(s => `${s.code} ${s.description}`.trim())
                .join('\n');

            const scoringCriteriaText = scoringCriteria
                .filter(c => c.element || c.levels.some(l => l.description))
                .map(c => {
                    const header = c.element ? `[${c.element}]\n` : '';
                    const levels = c.levels.map(l => `${l.score}점 ${l.description}`).join('\n');
                    return header + levels;
                })
                .join('\n\n');

            const rubricContext = {
                achievementStandard: achievementStandardText || undefined,
                scoringCriteria: scoringCriteriaText || undefined,
            };

            const response = await fetch('/api/ocr', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64Data,
                    rubricContext,
                }),
            });

            const data = await response.json();

            if (data.success) {
                const newResult: OCRResultEntry = {
                    id: `ocr - ${Date.now()}`,
                    imageData: image,
                    extractedText: data.result.extractedText,
                    drawings: data.result.drawings,
                    summary: data.result.summary,
                    evaluation: data.result.evaluation,
                    analyzedAt: new Date().toISOString(),
                };

                setOcrResult(newResult);

                // Save to evaluation
                const updatedResults = [...(selectedEvaluation.ocrResults || []), newResult];
                const resultsForSave = stripOcrResultImageData(updatedResults);
                const updateResponse = await fetch('/api/ocr-evaluations', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: selectedEvaluation.id,
                        ocrResults: resultsForSave,
                    }),
                });

                if (updateResponse.ok) {
                    setSelectedEvaluation(prev => prev ? { ...prev, ocrResults: updatedResults } : null);
                }
            } else {
                setError('분석 중 오류가 발생했습니다.');
            }
        } catch (err) {
            console.error('OCR error:', err);
            setError('서버 연결에 실패했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearImage = () => {
        setImage(null);
        setImageFile(null);
        setOcrResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // === Model Answer Generation ===
    const handleGenerateModelAnswer = async (fileId: string) => {
        if (!selectedEvaluation) return;

        const file = selectedEvaluation.attachedFiles.find(f => f.id === fileId);
        if (!file) return;
        if (!file.data) {
            setError('File data is not available. Please re-upload the file.');
            return;
        }

        setIsGeneratingModelAnswer(true);
        setSelectedAssessmentFileId(fileId);
        setError(null);

        try {
            const response = await fetch('/api/model-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileData: file.data,
                    fileName: file.name,
                    fileType: file.type,
                    achievementStandards,
                    scoringCriteria,
                }),
            });

            const data = await response.json();

            if (data.success) {
                const generatedAt = data.result?.generatedAt || new Date().toISOString();
                const sets = Array.isArray(data.result?.sets)
                    ? data.result.sets
                    : (Array.isArray(data.result?.questions)
                        ? [{
                            id: 'standard',
                            label: '표준 해설',
                            questions: data.result.questions,
                            generatedAt,
                        }]
                        : []);
                const newModelAnswer: ModelAnswerBundle = {
                    id: `ma-${Date.now()}`,
                    sourceFileId: fileId,
                    sets,
                    generatedAt,
                };

                setModelAnswer(newModelAnswer);
                if (sets.length > 0) {
                    setActiveModelAnswerSetId(sets[0].id);
                }

                // Save to evaluation
                const updateResponse = await fetch('/api/ocr-evaluations', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: selectedEvaluation.id,
                        modelAnswer: newModelAnswer,
                    }),
                });

                if (updateResponse.ok) {
                    setSelectedEvaluation(prev => prev ? { ...prev, modelAnswer: newModelAnswer } : null);
                }
            } else {
                setError(data.error || '모범답안 생성에 실패했습니다.');
            }
        } catch (err) {
            console.error('Model answer error:', err);
            setError('모범답안 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGeneratingModelAnswer(false);
        }
    };

    // === Model Answer Edit Handlers ===
    const updateModelAnswerQuestion = (
        questionIndex: number,
        field: 'answer' | 'questionText' | 'scoringGuidelines',
        value: string
    ) => {
        if (!selectedEvaluation) return;

        const currentModelAnswer = resolvedModelAnswer;
        const currentSet = activeModelAnswerSet;
        if (!currentModelAnswer || !currentSet) return;

        const updatedQuestions = currentSet.questions.map((q, idx) =>
            idx === questionIndex ? { ...q, [field]: value } : q
        );

        const updatedSets = currentModelAnswer.sets.map(set =>
            set.id === currentSet.id
                ? { ...set, questions: updatedQuestions, editedAt: new Date().toISOString() }
                : set
        );

        const updatedModelAnswer = {
            ...currentModelAnswer,
            sets: updatedSets,
            editedAt: new Date().toISOString(),
        };

        setModelAnswer(updatedModelAnswer);
    };

    const updateModelAnswerRubricPoint = (
        questionIndex: number,
        pointIndex: number,
        value: string
    ) => {
        if (!selectedEvaluation) return;

        const currentModelAnswer = resolvedModelAnswer;
        const currentSet = activeModelAnswerSet;
        if (!currentModelAnswer || !currentSet) return;

        const updatedQuestions = currentSet.questions.map((q, idx) => {
            if (idx !== questionIndex) return q;
            const updatedPoints = [...q.rubricPoints];
            updatedPoints[pointIndex] = value;
            return { ...q, rubricPoints: updatedPoints };
        });

        const updatedSets = currentModelAnswer.sets.map(set =>
            set.id === currentSet.id
                ? { ...set, questions: updatedQuestions, editedAt: new Date().toISOString() }
                : set
        );

        const updatedModelAnswer = {
            ...currentModelAnswer,
            sets: updatedSets,
            editedAt: new Date().toISOString(),
        };

        setModelAnswer(updatedModelAnswer);
    };

    const saveModelAnswer = async () => {
        if (!selectedEvaluation) return;

        const currentModelAnswer = resolvedModelAnswer;
        if (!currentModelAnswer) return;

        try {
            const updateResponse = await fetch('/api/ocr-evaluations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedEvaluation.id,
                    modelAnswer: currentModelAnswer,
                }),
            });

            if (updateResponse.ok) {
                setSelectedEvaluation(prev => prev ? { ...prev, modelAnswer: currentModelAnswer } : null);
            }
        } catch (err) {
            console.error('Save model answer error:', err);
            setError('모범답안 저장에 실패했습니다.');
        }
    };

    // === Batch Grading ===
    const handleBatchPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedEvaluation) return;

        if (file.type !== 'application/pdf') {
            setError('PDF 파일만 업로드 가능합니다.');
            return;
        }

        setIsAnalyzingPdf(true);
        setError(null);

        try {
            const pdfData = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            setBatchPdfData(pdfData);

            // Use student roster from AI 세특 학생 관리
            const studentsList = gradeStudents;

            // Analyze PDF and extract student info
            const response = await fetch('/api/pdf-split', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pdfData,
                    pagesPerStudent,
                    startPage: 1,
                    students: studentsList,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMappingItems(data.result.items);
            } else {
                setError(data.error || 'PDF 분석에 실패했습니다.');
            }
        } catch (err) {
            console.error('Batch PDF upload error:', err);
            setError('PDF 업로드 중 오류가 발생했습니다.');
        } finally {
            setIsAnalyzingPdf(false);
            if (batchPdfInputRef.current) {
                batchPdfInputRef.current.value = '';
            }
        }
    };

    const handleMappingConfirm = () => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('Mapping confirmed count:', mappingItems.length);
        }
    };

    const handleStartBatchGrading = async () => {
        if (!selectedEvaluation || !batchPdfData || mappingItems.length === 0) return;

        setIsBatchGrading(true);
        setBatchProgress(0);

        const targetItems = mappingItems.filter(item => !item.isSkipped && item.mappedStudentId);
        const totalStudents = targetItems.length;
        const results: StudentGradingResult[] = [];
        const startedAt = new Date().toISOString();
        let completed = 0;
        let errorCount = 0;

        for (const item of targetItems) {
            try {
                const response = await fetch('/api/batch-grading', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        studentId: item.mappedStudentId,
                        studentNumber: item.mappedStudentNumber,
                        studentName: item.mappedStudentName,
                        slotIndex: item.slotIndex,
                        pageData: batchPdfData, // In production, extract specific pages
                        modelAnswer: modelAnswer ?? selectedEvaluation.modelAnswer,
                        scoringCriteria,
                        achievementStandards,
                        systemPrompt: gradingSystemPrompt || undefined,
                    }),
                });

                const data = await response.json();
                if (data.success && data.result) {
                    results.push(data.result as StudentGradingResult);
                } else {
                    errorCount++;
                }
            } catch (err) {
                console.error('Batch grading item failed:', err);
                errorCount++;
            } finally {
                completed++;
                if (totalStudents > 0) {
                    setBatchProgress(Math.round((completed / totalStudents) * 100));
                }
            }
        }

        const firstStudentId = results.find(r => r.studentId)?.studentId;
        const mappingClassId = firstStudentId
            ? students.find(s => s.id === firstStudentId)?.classId || ''
            : '';
        const totalPages = mappingItems.reduce((max, item) => Math.max(max, item.pageEnd), 0);
        const completedAt = new Date().toISOString();

        const batchResult: BatchGradingResult = {
            id: `batch-${Date.now()}`,
            evaluationId: selectedEvaluation.id,
            classId: mappingClassId,
            mapping: {
                evaluationId: selectedEvaluation.id,
                classId: mappingClassId,
                pagesPerStudent,
                startPage: 1,
                totalPages,
                items: mappingItems,
                confirmedAt: completedAt,
            },
            results,
            status: errorCount > 0 ? 'error' : 'completed',
            progress: 100,
            startedAt,
            completedAt,
            errorMessage: errorCount > 0 ? `${errorCount}명의 채점에 실패했습니다.` : undefined,
        };

        applyBatchResult(batchResult);
        results.forEach(result => syncStudentLearningDataFromResult(result));

        if (errorCount > 0) {
            setError(`${errorCount}명의 채점 결과를 불러오지 못했습니다.`);
        }

        setIsBatchGrading(false);
        setBatchProgress(100);
    };

    const handleOverallFeedbackChange = (studentId: string, value: string) => {
        if (!selectedEvaluation?.batchGradingResult) return;
        const nextBatch = {
            ...selectedEvaluation.batchGradingResult,
            results: selectedEvaluation.batchGradingResult.results.map(result =>
                result.studentId === studentId ? { ...result, overallFeedback: value } : result
            ),
        };
        applyBatchResult(nextBatch);
    };

    const handleOverallFeedbackBlur = (studentId: string) => {
        if (!selectedEvaluation?.batchGradingResult) return;
        const result = selectedEvaluation.batchGradingResult.results.find(r => r.studentId === studentId);
        if (result) {
            syncStudentLearningDataFromResult(result);
        }
    };

    // === Preliminary Grading ===
    const handlePreliminaryGrading = async (item: StudentMappingItem) => {
        if (!selectedEvaluation || !batchPdfData) return;

        setIsPrelimGrading(true);
        setError(null);

        try {
            const response = await fetch('/api/preliminary-grading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: item.mappedStudentId,
                    studentNumber: item.mappedStudentNumber,
                    studentName: item.mappedStudentName,
                    slotIndex: item.slotIndex,
                    pageData: batchPdfData,
                    modelAnswer: modelAnswer,
                    scoringCriteria,
                    achievementStandards,
                }),
            });

            const data = await response.json();
            if (data.success) {
                const newResult = data.result as PreliminaryGradingResult;
                setPreliminaryGradings(prev => [...prev, newResult]);
                setCurrentPrelimIndex(prev => prev + 1);
            } else {
                setError(data.error || '가채점 중 오류가 발생했습니다.');
            }
        } catch (err) {
            console.error('Preliminary grading error:', err);
            setError('가채점 중 오류가 발생했습니다.');
        } finally {
            setIsPrelimGrading(false);
        }
    };

    // Add teacher feedback item
    const handleAddFeedbackItem = () => {
        if (newFeedbackItem.trim()) {
            setTeacherFeedbackItems(prev => [...prev, newFeedbackItem.trim()]);
            setNewFeedbackItem('');
        }
    };

    const handleRemoveFeedbackItem = (index: number) => {
        setTeacherFeedbackItems(prev => prev.filter((_, i) => i !== index));
    };

    // Generate grading system prompt from teacher feedback
    const handleGenerateSystemPrompt = async () => {
        if (teacherFeedbackItems.length === 0) {
            setError('피드백 항목을 추가해주세요.');
            return;
        }

        setIsGeneratingPrompt(true);
        setError(null);

        try {
            const response = await fetch('/api/generate-grading-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedbackItems: teacherFeedbackItems,
                    scoringCriteria,
                    achievementStandards,
                    preliminaryResults: preliminaryGradings.map(g => ({
                        studentName: g.studentName,
                        scores: g.scores,
                        achievementLevel: g.achievementLevel,
                        teacherFeedback: g.teacherFeedback,
                    })),
                }),
            });

            const data = await response.json();
            if (data.success) {
                setGradingSystemPrompt(data.result.systemPrompt);
            } else {
                setError(data.error || '채점 가이드라인 생성에 실패했습니다.');
            }
        } catch (err) {
            console.error('Generate prompt error:', err);
            setError('채점 가이드라인 생성 중 오류가 발생했습니다.');
        } finally {
            setIsGeneratingPrompt(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Sidebar - Evaluation List */}
            <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarTitleRow}>
                        <h2 className={styles.sidebarTitle}>
                            <ClipboardCheck size={20} />
                            {!isSidebarCollapsed && 'OCR 평가 관리'}
                        </h2>
                        <button
                            className={styles.sidebarToggleBtn}
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            title={isSidebarCollapsed ? '펼치기' : '접기'}
                        >
                            {isSidebarCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                        </button>
                    </div>

                    {!isSidebarCollapsed && (
                        <>
                            {/* Filters */}
                            <div className={styles.sidebarFilters}>
                                <select
                                    className={styles.filterSelect}
                                    value={filterYear}
                                    onChange={(e) => setFilterYear(parseInt(e.target.value))}
                                >
                                    <option value={2026}>2026학년도</option>
                                    <option value={2025}>2025학년도</option>
                                    <option value={2024}>2024학년도</option>
                                </select>
                                <select
                                    className={styles.filterSelect}
                                    value={filterSemester}
                                    onChange={(e) => setFilterSemester(e.target.value as Semester | '')}
                                >
                                    <option value="">전체 학기</option>
                                    <option value="1">1학기</option>
                                    <option value="2">2학기</option>
                                </select>
                                <select
                                    className={styles.filterSelect}
                                    value={filterGrade}
                                    onChange={(e) => setFilterGrade(e.target.value ? parseInt(e.target.value) : '')}
                                >
                                    <option value="">전체 학년</option>
                                    <option value="1">1학년</option>
                                    <option value="2">2학년</option>
                                    <option value="3">3학년</option>
                                </select>
                            </div>

                            {/* Add Button */}
                            <button
                                className={styles.addEvaluationBtn}
                                onClick={() => setCreateModal({ ...createModal, isOpen: true })}
                            >
                                <Plus size={18} />
                                새 평가 추가
                            </button>
                        </>
                    )}
                </div>

                {/* Evaluation List */}
                {!isSidebarCollapsed && (
                    <div className={styles.sidebarList}>
                        {isLoading ? (
                            <div className={styles.emptyList}>
                                <Loader2 size={24} className={styles.spinning} />
                                <p>불러오는 중..</p>
                            </div>
                        ) : Object.keys(groupedEvaluations).length === 0 ? (
                            <div className={styles.emptyList}>
                                <div className={styles.emptyListIcon}>
                                    <FolderOpen size={24} />
                                </div>
                                <p>등록된 평가가 없습니다.</p>
                            </div>
                        ) : (
                            Object.entries(groupedEvaluations).map(([group, items]) => (
                                <div key={group} className={styles.evaluationGroup}>
                                    <div className={styles.groupTitle}>{group}</div>
                                    {items.map((evaluation, index) => (
                                        <div
                                            key={evaluation.id || `eval - ${index}`}
                                            className={`${styles.evaluationCard} ${selectedEvaluation?.id === evaluation.id ? styles.active : ''}`}
                                            onClick={() => setSelectedEvaluation(evaluation)}
                                        >
                                            <div className={styles.evaluationCardHeader}>
                                                <span className={styles.evaluationCardTitle}>{evaluation.title || '(제목 없음)'}</span>
                                                <span className={styles.evaluationCardGrade}>{evaluation.grade}학년</span>
                                            </div>
                                            <div className={styles.evaluationCardMeta}>
                                                <span>
                                                    <FileText size={12} />
                                                    {evaluation.ocrResults?.length || 0}건 분석
                                                </span>
                                                <span>
                                                    <Calendar size={12} />
                                                    {evaluation.createdAt ? new Date(evaluation.createdAt).toLocaleDateString('ko-KR') : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {!selectedEvaluation ? (
                    <div className={styles.emptyMainState}>
                        <div className={styles.emptyMainIcon}>
                            <ScanLine size={32} />
                        </div>
                        <h3 className={styles.emptyMainTitle}>평가를 선택하세요</h3>
                        <p className={styles.emptyMainText}>
                            좌측에서 평가를 선택하거나 새 평가를 추가해 주세요.
                        </p>
                    </div>
                ) : (
                    <div className={styles.mainContentInner}>
                        {/* Detail Header */}
                        <header className={styles.detailHeader}>
                            <div className={styles.detailHeaderLeft}>
                                <h1 className={styles.detailTitle}>{selectedEvaluation.title}</h1>
                                <div className={styles.detailMeta}>
                                    <span className={styles.detailMetaItem}>
                                        <Calendar size={14} />
                                        {selectedEvaluation.year}학년도 {selectedEvaluation.semester}학기
                                    </span>
                                    <span className={styles.detailMetaItem}>
                                        <Users size={14} />
                                        {selectedEvaluation.grade}학년
                                    </span>
                                </div>
                            </div>
                            <div className={styles.detailHeaderActions}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteEvaluation}
                                    style={{ color: 'hsl(var(--destructive))' }}
                                >
                                    <Trash2 size={16} />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSaveEvaluation}
                                    isLoading={isSaving}
                                >
                                    <Save size={16} />
                                    저장
                                </Button>
                            </div>
                        </header>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    style={{
                                        padding: '1rem',
                                        background: 'hsl(var(--destructive) / 0.1)',
                                        borderRadius: '12px',
                                        color: 'hsl(var(--destructive))',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '1rem'
                                    }}
                                >
                                    <AlertCircle size={18} />
                                    {error}
                                    <button
                                        onClick={() => setError(null)}
                                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Student Roster */}
                        <section className={styles.studentRosterSection}>
                            <div className={styles.studentRosterHeader}>
                                <div className={styles.studentRosterTitle}>
                                    <List size={18} />
                                    학생 목록
                                </div>
                                <span className={styles.studentRosterMeta}>
                                    {selectedEvaluation.grade}학년 · {gradeStudents.length}명
                                </span>
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <ClassSelectionTabs
                                    selectedClass={selectedClass}
                                    onSelectClass={setSelectedClass}
                                    tabs={gradeClassTabs}
                                    totalCount={gradeStudents.length}
                                />
                            </div>

                            {filteredGradeStudents.length > 0 ? (
                                <div className={styles.studentRosterTable}>
                                    <div className={styles.studentRosterRowHeader}>
                                        <span>반</span>
                                        <span>번호</span>
                                        <span>이름</span>
                                    </div>
                                    {filteredGradeStudents.map((student) => {
                                        const cls = classes.find(c => c.id === student.classId);
                                        const classNumber = student.classNumber ?? cls?.classNumber ?? '-';
                                        return (
                                            <div key={student.id} className={styles.studentRosterRow}>
                                                <span>{classNumber}</span>
                                                <span>{student.number}</span>
                                                <span>{student.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className={styles.studentRosterEmpty}>
                                    {selectedClass === 'all'
                                        ? '학생 관리에서 학생을 추가해 주세요.'
                                        : '선택한 학급에 학생이 없습니다.'}
                                </div>
                            )}
                        </section>

                        {/* Section Tabs */}
                        {/* 순서: 1.채점기준 -> 2.첨부파일(모범답안) -> 2-1.가채점(선택) -> 3.일괄채점 -> 4.채점 및 피드백 */}
                        <div className={styles.sectionTabs}>
                            <button
                                className={`${styles.sectionTab} ${activeTab === 'criteria' ? styles.active : ''} `}
                                onClick={() => setActiveTab('criteria')}
                            >
                                <Target size={16} />
                                1. 채점 기준
                            </button>
                            <button
                                className={`${styles.sectionTab} ${activeTab === 'files' ? styles.active : ''} `}
                                onClick={() => setActiveTab('files')}
                            >
                                <FileTextIcon size={16} />
                                평가지/모범답안
                                {selectedEvaluation.attachedFiles?.length > 0 && (
                                    <span className={styles.sectionTabBadge}>
                                        {selectedEvaluation.attachedFiles.length}
                                    </span>
                                )}
                            </button>
                            <button
                                className={`${styles.sectionTab} ${activeTab === 'preliminary' ? styles.active : ''} `}
                                onClick={() => setActiveTab('preliminary')}
                                title="일괄 채점 전 선택적으로 진행"
                            >
                                <Edit3 size={16} />
                                2-1 가채점
                                {preliminaryGradings.length > 0 && (
                                    <span className={styles.sectionTabBadge}>
                                        {preliminaryGradings.length}
                                    </span>
                                )}
                            </button>
                            <button
                                className={`${styles.sectionTab} ${activeTab === 'batch' ? styles.active : ''} `}
                                onClick={() => setActiveTab('batch')}
                            >
                                <Users size={16} />
                                3. 일괄 채점
                            </button>
                            <button
                                className={`${styles.sectionTab} ${activeTab === 'memo' ? styles.active : ''} `}
                                onClick={() => setActiveTab('memo')}
                            >
                                <ClipboardCheck size={16} />
                                4. 채점 및 피드백
                                {(selectedEvaluation.batchGradingResult?.results?.length || 0) > 0 && (
                                    <span className={styles.sectionTabBadge}>
                                        {selectedEvaluation.batchGradingResult?.results?.length || 0}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'criteria' && (
                            <div>
                                {/* Rubric Upload */}
                                <div className={styles.topActionSection}>
                                    <div className={styles.rubricUploadSection}>
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            ref={rubricFileInputRef}
                                            onChange={handleRubricFileUpload}
                                            style={{ display: 'none' }}
                                        />
                                        <button
                                            className={styles.rubricUploadBtn}
                                            onClick={() => rubricFileInputRef.current?.click()}
                                            disabled={isExtractingRubric}
                                        >
                                            {isExtractingRubric ? (
                                                <>
                                                    <Loader2 size={16} className={styles.spinning} />
                                                    분석 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload size={16} />
                                                    채점기준표 파일로 자동 입력
                                                </>
                                            )}
                                        </button>
                                        <span className={styles.rubricUploadHint}>
                                            이미지/PDF를 업로드하면 성취기준 + 채점기준 모두 자동 추출
                                        </span>
                                    </div>
                                </div>

                                {/* Achievement Standards */}
                                <div className={styles.evaluationBlock}>
                                    <div className={styles.evaluationBlockHeader}>
                                        <h3><Target size={16} /> 성취기준 입력</h3>
                                    </div>

                                    {achievementStandards.map((standard, stdIndex) => (
                                        <div key={standard.id} className={styles.standardCard}>
                                            <div className={styles.standardCardHeader}>
                                                <span style={{ color: '#a78bfa', fontWeight: 800 }}>성취기준 {stdIndex + 1}</span>
                                                {achievementStandards.length > 1 && (
                                                    <button
                                                        className={styles.deleteBtn}
                                                        onClick={() => removeAchievementStandard(standard.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                        삭제
                                                    </button>
                                                )}
                                            </div>

                                            <div className={styles.standardInput}>
                                                <input
                                                    type="text"
                                                    placeholder="[12사사03-06] 공자와 맹자 사상을 탐구하여..."
                                                    value={`${standard.code} ${standard.description} `.trim()}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        const codeMatch = value.match(/^\[.*?\]/);
                                                        if (codeMatch) {
                                                            updateAchievementStandard(standard.id, 'code', codeMatch[0]);
                                                            updateAchievementStandard(standard.id, 'description', value.replace(codeMatch[0], '').trim());
                                                        } else {
                                                            updateAchievementStandard(standard.id, 'description', value);
                                                        }
                                                    }}
                                                />
                                            </div>

                                            <div className={styles.levelsTable}>
                                                {standard.levels.map((level, levelIndex) => (
                                                    <div key={levelIndex} className={styles.levelRow}>
                                                        <span className={styles.levelBadge}>
                                                            {level.level}
                                                        </span>
                                                        <input
                                                            type="text"
                                                            placeholder={`${level.level} 수준 기준 설명`}
                                                            value={level.description}
                                                            onChange={(e) => updateAchievementLevel(standard.id, levelIndex, e.target.value)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <button className={styles.addStandardBtn} onClick={addAchievementStandard}>
                                        <Plus size={16} />
                                        성취기준 추가
                                    </button>
                                </div>

                                {/* Scoring Criteria */}
                                <div className={styles.evaluationBlock}>
                                    <div className={styles.evaluationBlockHeader}>
                                        <h3><Ruler size={16} /> 채점기준 입력</h3>
                                    </div>

                                    {scoringCriteria.map((criteria, critIndex) => (
                                        <div key={criteria.id} className={styles.criteriaCard}>
                                            <div className={styles.criteriaCardHeader}>
                                                <span style={{ color: '#818cf8', fontWeight: 800 }}>채점기준 {critIndex + 1}</span>
                                                {scoringCriteria.length > 1 && (
                                                    <button
                                                        className={styles.deleteBtn}
                                                        onClick={() => removeScoringCriteria(criteria.id)}
                                                    >
                                                        <Trash2 size={14} />
                                                        삭제
                                                    </button>
                                                )}
                                            </div>

                                            <div className={styles.criteriaTable}>
                                                <div className={styles.criteriaElement}>
                                                    <input
                                                        type="text"
                                                        placeholder="평가요소"
                                                        value={criteria.element}
                                                        onChange={(e) => updateScoringCriteria(criteria.id, e.target.value)}
                                                    />
                                                </div>

                                                <div className={styles.criteriaLevels}>
                                                    {criteria.levels.map((level, levelIndex) => (
                                                        <div key={levelIndex} className={styles.criteriaLevelRow}>
                                                            <input
                                                                type="number"
                                                                className={styles.scoreInput}
                                                                value={level.score}
                                                                onChange={(e) => updateScoringLevelScore(criteria.id, levelIndex, parseInt(e.target.value) || 0)}
                                                                min={0}
                                                                max={100}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder={`${level.score}점 기준`}
                                                                value={level.description}
                                                                onChange={(e) => updateScoringLevel(criteria.id, levelIndex, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button className={styles.addCriteriaBtn} onClick={addScoringCriteria}>
                                        <Plus size={16} />
                                        채점기준 추가
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'files' && (
                            <div className={styles.attachedFilesSection}>
                                <h3 className={styles.sectionTitle}>
                                    <FileTextIcon size={18} />
                                    평가지 첨부 및 모범답안 생성
                                </h3>
                                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    평가지(문제지)를 업로드하면 AI가 모범답안을 자동으로 생성합니다.
                                </p>

                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    ref={pdfInputRef}
                                    onChange={handlePdfUpload}
                                    style={{ display: 'none' }}
                                />

                                <div className={styles.fileGrid}>
                                    {selectedEvaluation.attachedFiles?.map(file => (
                                        <div key={file.id} className={styles.fileCard}>
                                            <div className={styles.fileIcon}>
                                                {file.type === 'pdf' ? <FileText size={20} /> : <ImageIcon size={20} />}
                                            </div>
                                            <div className={styles.fileInfo}>
                                                <div className={styles.fileName}>{file.name}</div>
                                                <div className={styles.fileDate}>
                                                    {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                                                </div>
                                            </div>
                                            <div className={styles.fileActions}>
                                                <button
                                                    className={styles.fileActionBtn}
                                                    onClick={() => handleGenerateModelAnswer(file.id)}
                                                    disabled={isGeneratingModelAnswer}
                                                    title="모범답안 생성"
                                                >
                                                    {isGeneratingModelAnswer && selectedAssessmentFileId === file.id ? (
                                                        <Loader2 size={14} className={styles.spinning} />
                                                    ) : (
                                                        <Sparkles size={14} />
                                                    )}
                                                </button>
                                                <button
                                                    className={`${styles.fileActionBtn} ${styles.delete} `}
                                                    onClick={() => handleDeleteFile(file.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        className={styles.uploadFileBtn}
                                        onClick={() => pdfInputRef.current?.click()}
                                    >
                                        <Plus size={18} />
                                        평가지 추가
                                    </button>
                                </div>

                                {/* Model Answer Display - Editable */}
                                {resolvedModelAnswer && (
                                    <div className={styles.modelAnswerSection}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                            <h4 className={styles.modelAnswerTitle} style={{ marginBottom: 0 }}>
                                                <Sparkles size={16} style={{ color: '#facc15' }} />
                                                모범답안
                                            </h4>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        const allIds = activeModelAnswerSet?.questions.map(q => q.questionNumber) || [];
                                                        setExpandedQuestionIds(new Set(allIds));
                                                    }}
                                                >
                                                    <Maximize2 size={14} /> 모두 펼치기
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={saveModelAnswer}
                                                >
                                                    <Save size={14} />
                                                    저장
                                                </Button>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', marginBottom: '1rem' }}>
                                            AI가 생성한 모범답안을 확인하고 수정할 수 있습니다.
                                        </p>
                                        {resolvedModelAnswer && resolvedModelAnswer.sets.length > 1 && (
                                            <div className={styles.modelAnswerSetTabs}>
                                                {resolvedModelAnswer.sets.map((set) => (
                                                    <button
                                                        key={set.id}
                                                        className={`${styles.modelAnswerSetTab} ${activeModelAnswerSet?.id === set.id ? styles.modelAnswerSetTabActive : ''}`}
                                                        onClick={() => setActiveModelAnswerSetId(set.id)}
                                                        type="button"
                                                    >
                                                        {set.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {activeModelAnswerSet?.questions.map((q, idx) => {
                                            const isExpanded = expandedQuestionIds.has(q.questionNumber);
                                            const activeTab = activeAnswerTabs[q.questionNumber] || 0;
                                            const questionPreview = getQuestionPreview(q.questionText);

                                            // Normalize answers: keep only provided answers, ensure at least one standard answer
                                            const defaultLabel = '표준 답안';
                                            let baseAnswers = Array.isArray(q.answers)
                                                ? q.answers
                                                : (q.answer ? [{ label: defaultLabel, content: q.answer }] : []);

                                            if (baseAnswers.length === 0) {
                                                baseAnswers = [{ label: defaultLabel, content: '' }];
                                            }

                                            const answers = baseAnswers.map((answer, aIdx) => ({
                                                label: answer.label?.trim() ? answer.label : (aIdx === 0 ? defaultLabel : `추가 답안 ${aIdx + 1}`),
                                                content: answer.content ?? '',
                                            }));
                                            const activeTabIndex = activeTab >= answers.length ? 0 : activeTab;

                                            // Parse grading guidelines
                                            const parsedGuidelines = parseGradingGuidelines(q.scoringGuidelines || '');
                                            const isEditingGuideline = editingGuidelineIds[q.questionNumber] || parsedGuidelines.length === 0;
                                            const isEditingRubric = editingRubricPointIds[q.questionNumber] || false;

                                            return (
                                                <div key={idx} className={styles.modelAnswerItem}>
                                                    <div
                                                        className={styles.modelAnswerQuestion}
                                                        style={{ cursor: 'pointer', borderBottom: isExpanded ? '1px solid hsl(var(--border))' : 'none', marginBottom: isExpanded ? '1rem' : 0 }}
                                                        onClick={() => toggleQuestionExpansion(q.questionNumber)}
                                                    >
                                                        <div className={styles.questionHeaderRow}>
                                                            <div className={styles.questionHeaderLeft}>
                                                                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                                <span className={styles.questionNumberBadge}>{q.questionNumber}번</span>
                                                                <span className={styles.questionPreview} title={q.questionText}>
                                                                    {questionPreview || '문항'}
                                                                </span>
                                                            </div>
                                                            {q.maxScore && (
                                                                <span className={styles.questionScoreBadge}>{q.maxScore}점</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                style={{ overflow: 'hidden' }}
                                                            >
                                                                <div style={{ paddingTop: '1rem' }}>
                                                                    {/* Section 1: Problem Content */}
                                                                    <div className={styles.subSection}>
                                                                        <div className={styles.subSectionHeader}>
                                                                            <Settings size={16} />
                                                                            문제 내용 (수정 가능)
                                                                        </div>
                                                                        <div className={styles.subSectionContent}>
                                                                            <TextareaAutoHeight
                                                                                value={q.questionText}
                                                                                onChange={(val) => updateModelAnswerQuestion(idx, 'questionText', val)}
                                                                                className={styles.autoHeightTextarea}
                                                                                style={{ fontSize: '1rem', minHeight: '60px' }}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Section 2: Model Answer */}
                                                                    <div className={styles.subSection}>
                                                                        <div className={styles.subSectionHeader} style={{ justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                            <div className={styles.subSectionHeaderTitle}>
                                                                                <CheckCircle size={16} />
                                                                                모범 답안
                                                                            </div>
                                                                            {answers.length > 0 && (
                                                                                <div className={styles.answerTabs}>
                                                                                    {answers.map((ans, aIdx) => (
                                                                                        <button
                                                                                            key={aIdx}
                                                                                            className={`${styles.answerTab} ${activeTabIndex === aIdx ? styles.answerTabActive : ''} `}
                                                                                            onClick={() => setActiveAnswerTabs(prev => ({ ...prev, [q.questionNumber]: aIdx }))}
                                                                                            type="button"
                                                                                        >
                                                                                            {ans.label}
                                                                                        </button>
                                                                                    ))}
                                                                                    <button
                                                                                        className={styles.answerTabAdd}
                                                                                        type="button"
                                                                                        title="추가 답안"
                                                                                        onClick={() => {
                                                                                            const newAnsIndex = answers.length;
                                                                                            const newAnswers = [...answers, { label: `추가 답안 ${newAnsIndex + 1} `, content: '' }];
                                                                                            const currentModelAnswer = resolvedModelAnswer;
                                                                                            const currentSet = activeModelAnswerSet;
                                                                                            if (currentModelAnswer && currentSet) {
                                                                                                const updatedQuestions = currentSet.questions.map((ques, qIdx) =>
                                                                                                    qIdx === idx ? { ...ques, answers: newAnswers, answer: newAnswers[0].content } : ques
                                                                                                );
                                                                                                const updatedSets = currentModelAnswer.sets.map(set =>
                                                                                                    set.id === currentSet.id
                                                                                                        ? { ...set, questions: updatedQuestions, editedAt: new Date().toISOString() }
                                                                                                        : set
                                                                                                );
                                                                                                setModelAnswer({ ...currentModelAnswer, sets: updatedSets, editedAt: new Date().toISOString() });
                                                                                                setActiveAnswerTabs(prev => ({ ...prev, [q.questionNumber]: newAnsIndex }));
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        <Plus size={14} />
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className={styles.subSectionContent}>
                                                                            <TextareaAutoHeight
                                                                                value={answers[activeTabIndex]?.content || ''}
                                                                                onChange={(val) => {
                                                                                    const newAnswers = [...answers];
                                                                                    if (!newAnswers[activeTabIndex]) newAnswers[activeTabIndex] = { label: '예시 답안', content: '' };
                                                                                    newAnswers[activeTabIndex] = { ...newAnswers[activeTabIndex], content: val };

                                                                                    const currentModelAnswer = resolvedModelAnswer;
                                                                                    const currentSet = activeModelAnswerSet;
                                                                                    if (currentModelAnswer && currentSet) {
                                                                                        const updatedQuestions = currentSet.questions.map((ques, qIdx) =>
                                                                                            qIdx === idx ? { ...ques, answers: newAnswers, answer: newAnswers[0].content } : ques
                                                                                        );
                                                                                        const updatedSets = currentModelAnswer.sets.map(set =>
                                                                                            set.id === currentSet.id
                                                                                                ? { ...set, questions: updatedQuestions, editedAt: new Date().toISOString() }
                                                                                                : set
                                                                                        );
                                                                                        setModelAnswer({ ...currentModelAnswer, sets: updatedSets, editedAt: new Date().toISOString() });
                                                                                    }
                                                                                }}
                                                                                className={styles.autoHeightTextarea}
                                                                                placeholder="모범답안을 입력하세요.."
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Section 3: Rubric Points */}
                                                                    {q.rubricPoints.length > 0 && (
                                                                        <div className={styles.subSection}>
                                                                            <div className={styles.subSectionHeader} style={{ justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                                <div className={styles.subSectionHeaderTitle}>
                                                                                    <List size={16} />
                                                                                    채점 포인트
                                                                                </div>
                                                                                <button
                                                                                    className={styles.editGuidelineBtn}
                                                                                    onClick={() => setEditingRubricPointIds(prev => ({ ...prev, [q.questionNumber]: !isEditingRubric }))}
                                                                                >
                                                                                    {isEditingRubric ? <Check size={14} /> : <Edit3 size={14} />}
                                                                                    {isEditingRubric ? '완료' : '편집'}
                                                                                </button>
                                                                            </div>
                                                                            <div className={styles.subSectionContent}>
                                                                                {isEditingRubric ? (
                                                                                    <div className={styles.rubricList}>
                                                                                        {q.rubricPoints.map((point, i) => (
                                                                                            <input
                                                                                                key={i}
                                                                                                type="text"
                                                                                                value={point}
                                                                                                onChange={(e) => updateModelAnswerRubricPoint(idx, i, e.target.value)}
                                                                                                className={styles.rubricPointInput}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div className={styles.rubricBadgeList}>
                                                                                        {q.rubricPoints.map((point, i) => (
                                                                                            <span key={i} className={styles.rubricBadge} title={point}>
                                                                                                {getRubricBadgeLabel(point)}
                                                                                            </span>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {/* Section 4: Grading Guidelines */}
                                                                    <div className={styles.subSection}>
                                                                        <div className={styles.subSectionHeader} style={{ justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                                                                            <div className={styles.subSectionHeaderTitle}>
                                                                                <FileText size={16} />
                                                                                채점 가이드라인
                                                                            </div>
                                                                            <button
                                                                                className={styles.editGuidelineBtn}
                                                                                onClick={() => setEditingGuidelineIds(prev => ({ ...prev, [q.questionNumber]: !isEditingGuideline }))}
                                                                            >
                                                                                {isEditingGuideline ? <Check size={14} /> : <Edit3 size={14} />}
                                                                                {isEditingGuideline ? '완료' : '수정'}
                                                                            </button>
                                                                        </div>

                                                                        <div className={styles.subSectionContent}>
                                                                            {isEditingGuideline ? (
                                                                                <TextareaAutoHeight
                                                                                    value={q.scoringGuidelines || ''}
                                                                                    onChange={(val) => updateModelAnswerQuestion(idx, 'scoringGuidelines', val)}
                                                                                    className={styles.autoHeightTextarea}
                                                                                    placeholder="4점 [핵심 내용]...\n예시: ...\n\n3점 ..."
                                                                                    style={{ minHeight: '150px', fontSize: '1rem' }}
                                                                                />
                                                                            ) : (
                                                                                <div className={styles.guidelineTable}>
                                                                                    <div className={styles.guidelineHeaderRow}>
                                                                                        <div className={styles.guidelineHeaderCell} style={{ width: '60px' }}>점수</div>
                                                                                        <div className={styles.guidelineHeaderCell} style={{ flex: 1, borderRight: 'none', textAlign: 'left' }}>채점 기준</div>
                                                                                    </div>
                                                                                    {parsedGuidelines.map((guide, gIdx) => (
                                                                                        <div key={gIdx} className={styles.guidelineRow}>
                                                                                            <div className={styles.guidelineScoreCol} style={{ width: '60px' }}>
                                                                                                <span className={styles.guidelineScoreBadge}>{guide.score}</span>
                                                                                            </div>
                                                                                            <div className={styles.guidelineContentCol}>
                                                                                                <div className={styles.guidelineDescription}>{guide.description}</div>
                                                                                                {guide.example && (
                                                                                                    <div className={styles.guidelineExample}>
                                                                                                        <span className={styles.guidelineExampleLabel}>예시:</span>
                                                                                                        <span className={styles.guidelineExampleText}>{guide.example}</span>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'preliminary' && (
                            <div className={styles.preliminarySection}>
                                <h3 className={styles.sectionTitle}>
                                    <Edit3 size={18} />
                                    가채점 (선택 단계)
                                </h3>
                                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    일괄 채점 전에 일부 학생(5명 이상 권장)을 미리 채점하고 피드백을 입력하면, AI가 교사의 채점 성향을 반영한 가이드라인을 생성합니다.
                                </p>

                                <div style={{ marginBottom: '1rem' }}>
                                    <ClassSelectionTabs
                                        selectedClass={selectedClass}
                                        onSelectClass={setSelectedClass}
                                        tabs={gradeClassTabs}
                                        totalCount={gradeStudents.length}
                                    />
                                </div>

                                {/* Preliminary Grading Progress */}
                                <div className={styles.preliminaryProgress}>
                                    <span className={styles.progressLabel}>가채점 진행:</span>
                                    <span className={styles.progressCount}>{preliminaryGradings.length}명 완료</span>
                                    {preliminaryGradings.length >= 5 && (
                                        <span className={styles.progressSuccess}>피드백 입력 가능</span>
                                    )}
                                </div>

                                {/* Student Selection for Preliminary Grading */}
                                {batchPdfData && mappingItems.length > 0 ? (
                                    <div className={styles.preliminaryStudentList}>
                                        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>학생 선택</h4>
                                        <div className={styles.studentGrid}>
                                            {mappingItems
                                                .filter(item => {
                                                    if (selectedClass === 'all') return !item.isSkipped && item.mappedStudentId;
                                                    if (item.isSkipped || !item.mappedStudentId) return false;
                                                    const student = students.find(s => s.id === item.mappedStudentId);
                                                    if (!student) return false;
                                                    const cls = classes.find(c => c.id === student.classId);
                                                    const classNum = student.classNumber || cls?.classNumber || 0;
                                                    const [_, targetClass] = selectedClass.split('-').map(Number);
                                                    return classNum === targetClass;
                                                })
                                                .map((item) => {
                                                    const isGraded = preliminaryGradings.some(g => g.studentId === item.mappedStudentId);
                                                    return (
                                                        <button
                                                            key={item.slotIndex}
                                                            className={`${styles.prelimStudentBtn} ${isGraded ? styles.graded : ''} `}
                                                            onClick={() => !isGraded && handlePreliminaryGrading(item)}
                                                            disabled={isPrelimGrading || isGraded}
                                                        >
                                                            {isPrelimGrading && currentPrelimIndex === item.slotIndex ? (
                                                                <Loader2 size={14} className={styles.spinning} />
                                                            ) : isGraded ? (
                                                                <Check size={14} />
                                                            ) : null}
                                                            {item.mappedStudentNumber}번 {item.mappedStudentName}
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noPdfMessage}>
                                        <p>일괄 채점 탭에서 PDF를 먼저 업로드해주세요.</p>
                                    </div>
                                )}

                                {/* Preliminary Results */}
                                {preliminaryGradings.length > 0 && (
                                    <div className={styles.preliminaryResults}>
                                        <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>가채점 결과</h4>
                                        {preliminaryGradings.map((result, idx) => (
                                            <div key={result.id} className={styles.prelimResultCard}>
                                                <div className={styles.prelimResultHeader}>
                                                    <span>{result.studentNumber}번 {result.studentName}</span>
                                                    <span className={styles.achievementBadge}>
                                                        {result.achievementLevel}
                                                    </span>
                                                </div>
                                                <div className={styles.prelimResultScore}>
                                                    점수: {result.totalScore} / {result.maxTotalScore}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Teacher Feedback Section - Appears after 5+ preliminary gradings */}
                                {preliminaryGradings.length >= 5 && (
                                    <div className={styles.teacherFeedbackSection}>
                                        <h4 className={styles.feedbackTitle}>
                                            <MessageSquare size={16} />
                                            교사 피드백 입력
                                        </h4>
                                        <p className={styles.feedbackHint}>
                                            가채점 결과를 검토하고 AI에게 전달할 채점 시 유의사항을 입력하세요.
                                        </p>

                                        {/* Feedback Items */}
                                        <div className={styles.feedbackItems}>
                                            {teacherFeedbackItems.map((item, idx) => (
                                                <div key={idx} className={styles.feedbackItem}>
                                                    <span>{item}</span>
                                                    <button onClick={() => handleRemoveFeedbackItem(idx)}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Feedback Input */}
                                        <div className={styles.addFeedbackRow}>
                                            <input
                                                type="text"
                                                placeholder="이 부분 정답을 인정해주세요, 계산 실수는 감점 최소화.."
                                                value={newFeedbackItem}
                                                onChange={(e) => setNewFeedbackItem(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddFeedbackItem()}
                                                className={styles.feedbackInput}
                                            />
                                            <Button variant="secondary" size="sm" onClick={handleAddFeedbackItem}>
                                                <Plus size={14} />
                                                추가
                                            </Button>
                                        </div>
                                        {/* Generate System Prompt Button */}
                                        <Button
                                            onClick={handleGenerateSystemPrompt}
                                            disabled={teacherFeedbackItems.length === 0 || isGeneratingPrompt}
                                            isLoading={isGeneratingPrompt}
                                            style={{ marginTop: '1rem' }}
                                        >
                                            <Sparkles size={16} />
                                            AI 채점 가이드라인 생성
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'batch' && (
                            <div className={styles.batchGradingSection}>
                                {/* System Prompt Section */}
                                <div className={styles.systemPromptSection}>
                                    <h4 className={styles.systemPromptTitle}>
                                        <MessageSquare size={16} />
                                        채점 가이드라인 (시스템 프롬프트)
                                    </h4>
                                    <p className={styles.systemPromptHint}>
                                        AI 채점 시 참고할 가이드라인을 작성하세요. 가채점에서 피드백을 입력했다면 자동 생성됩니다.
                                    </p>
                                    <textarea
                                        className={styles.systemPromptTextarea}
                                        placeholder="이 부분 정답은 관대하게 인정해 주세요. 개념 이해를 중시합니다.."
                                        value={gradingSystemPrompt}
                                        onChange={(e) => setGradingSystemPrompt(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <h3 className={styles.sectionTitle}>
                                    <Users size={18} />
                                    학급 일괄 채점
                                </h3>
                                <p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                    학급 전체 평가지(답안지)를 스캔한 PDF를 업로드하면 학생별로 자동 인식하여 일괄 채점합니다.
                                </p>

                                {/* Settings */}
                                <div className={styles.batchSettings}>
                                    <label className={styles.settingLabel}>
                                        학생당 페이지 수
                                        <input
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={pagesPerStudent}
                                            onChange={(e) => setPagesPerStudent(parseInt(e.target.value) || 1)}
                                            className={styles.settingInput}
                                        />
                                    </label>
                                </div>

                                {/* PDF Upload */}
                                <input
                                    type="file"
                                    accept=".pdf"
                                    ref={batchPdfInputRef}
                                    onChange={handleBatchPdfUpload}
                                    style={{ display: 'none' }}
                                />

                                {!batchPdfData ? (
                                    <motion.div
                                        className={styles.dropzone}
                                        onClick={() => batchPdfInputRef.current?.click()}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                    >
                                        <div className={styles.dropzoneIcon}>
                                            {isAnalyzingPdf ? <Loader2 size={28} className={styles.spinning} /> : <Upload size={28} />}
                                        </div>
                                        <p className={styles.dropzoneText}>
                                            {isAnalyzingPdf ? 'PDF 분석 중..' : '학급 PDF 파일을 업로드하세요'}
                                        </p>
                                        <p className={styles.dropzoneSubtext}>
                                            학생별 {pagesPerStudent}페이지씩 분할하여 분석합니다.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className={styles.batchContent}>
                                        {/* Student Mapping Editor */}
                                        {mappingItems.length > 0 && (
                                            <StudentMappingEditor
                                                items={mappingItems}
                                                students={filteredGradeStudents}
                                                pagesPerStudent={pagesPerStudent}
                                                onItemsChange={setMappingItems}
                                                onConfirm={handleMappingConfirm}
                                            />
                                        )}

                                        {/* Batch Grading Controls */}
                                        <div className={styles.batchControls}>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setBatchPdfData(null);
                                                    setMappingItems([]);
                                                }}
                                            >
                                                다시 업로드
                                            </Button>
                                            <Button
                                                onClick={handleStartBatchGrading}
                                                disabled={isBatchGrading || mappingItems.length === 0}
                                                isLoading={isBatchGrading}
                                            >
                                                <ScanLine size={16} />
                                                일괄 채점 시작
                                            </Button>
                                        </div>

                                        {/* Progress */}
                                        {isBatchGrading && (
                                            <div className={styles.batchProgress}>
                                                <div className={styles.progressBar}>
                                                    <div
                                                        className={styles.progressFill}
                                                        style={{ width: `${batchProgress}% ` }}
                                                    />
                                                </div>
                                                <span>{batchProgress}% 완료</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'memo' && (
                            <div className={styles.memoSection}>
                                <h3 className={styles.sectionTitle}>
                                    <ClipboardCheck size={18} />
                                    채점 및 피드백
                                </h3>

                                <div style={{ marginBottom: '1rem' }}>
                                    <ClassSelectionTabs
                                        selectedClass={selectedClass}
                                        onSelectClass={setSelectedClass}
                                        tabs={gradeClassTabs}
                                        totalCount={gradeStudents.length}
                                    />
                                </div>

                                {/* Batch Grading Results */}
                                {selectedEvaluation.batchGradingResult?.results && selectedEvaluation.batchGradingResult.results.length > 0 ? (
                                    <div className={styles.gradingResultsSection}>
                                        <div className={styles.gradingSummary}>
                                            <span>총 {selectedEvaluation.batchGradingResult.results.length}명 채점 완료</span>
                                        </div>
                                        <div className={styles.studentResultsList}>
                                            {selectedEvaluation.batchGradingResult.results
                                                .filter(result => {
                                                    if (selectedClass === 'all') return true;
                                                    const student = students.find(s => s.id === result.studentId);
                                                    if (!student) return false;
                                                    const cls = classes.find(c => c.id === student.classId);
                                                    const classNum = student.classNumber || cls?.classNumber || 0;
                                                    const [_, targetClass] = selectedClass.split('-').map(Number);
                                                    return classNum === targetClass;
                                                })
                                                .map((result, idx) => (
                                                    <div key={result.studentId || idx} className={styles.studentResultCard}>
                                                        <div className={styles.studentResultHeader}>
                                                            <span className={styles.studentResultName}>
                                                                {result.studentNumber}번 {result.studentName}
                                                            </span>
                                                            <span className={styles.achievementBadge}>
                                                                {result.achievementLevel}
                                                            </span>
                                                        </div>
                                                        <div className={styles.studentResultScore}>
                                                            점수: {result.totalScore} / {result.maxTotalScore}점
                                                        </div>
                                                        {result.questionResults && result.questionResults.length > 0 ? (
                                                            <div className={styles.questionResults}>
                                                                <div className={styles.questionResultsHeader}>문항별 채점 결과</div>
                                                                <div className={styles.questionResultsList}>
                                                                    {[...result.questionResults].sort((a, b) => a.questionNumber - b.questionNumber).map((q, qIdx) => (
                                                                        <div key={`${q.questionNumber}-${qIdx}`} className={styles.questionResultRow}>
                                                                            <span className={styles.questionResultNumber}>{q.questionNumber}번</span>
                                                                            <span className={styles.questionResultScore}>{q.score}/{q.maxScore}</span>
                                                                            <span className={styles.questionResultFeedback}>{q.feedback || '-'}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className={styles.questionResultsEmpty}>
                                                                문항별 채점 결과가 없습니다.
                                                            </div>
                                                        )}
                                                        {result.scores && result.scores.length > 0 && (
                                                            <div className={styles.criteriaScores}>
                                                                {result.scores.map((s, sIdx) => (
                                                                    <div key={sIdx} className={styles.criteriaScoreItem}>
                                                                        <span className={styles.criteriaName}>{s.criteriaElement}</span>
                                                                        <span className={styles.criteriaScore}>{s.score}/{s.maxScore}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <div className={styles.overallFeedbackSection}>
                                                            <label className={styles.overallFeedbackLabel}>
                                                                <MessageSquare size={14} />
                                                                총평
                                                            </label>
                                                            <textarea
                                                                className={styles.overallFeedbackTextarea}
                                                                placeholder="학생별 총평을 입력하세요..."
                                                                value={result.overallFeedback || ''}
                                                                onChange={(e) => handleOverallFeedbackChange(result.studentId, e.target.value)}
                                                                onBlur={() => handleOverallFeedbackBlur(result.studentId)}
                                                            />
                                                            <span className={styles.overallFeedbackHint}>
                                                                AI 세특 생성용 데이터에 자동 반영됩니다.
                                                            </span>
                                                        </div>

                                                        {/* Ambiguous Items Display */}
                                                        {result.ambiguousItems && result.ambiguousItems.length > 0 && (
                                                            <div className={styles.ambiguousSection}>
                                                                <div className={styles.ambiguousHeader}>
                                                                    <AlertTriangle size={14} />
                                                                    <span>채점 기준 불명확 ({result.ambiguousItems.length}건)</span>
                                                                </div>
                                                                <div className={styles.ambiguousItems}>
                                                                    {result.ambiguousItems.map((item, aIdx) => (
                                                                        <div key={aIdx} className={styles.ambiguousItem} title={item.reason}>
                                                                            <span className={styles.ambiguousCriteria}>{item.criteriaElement}</span>
                                                                            <span className={styles.ambiguousConfidence}>
                                                                                신뢰도 {Math.round((item.confidence || 0) * 100)}%
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.noResultsMessage}>
                                        <p>아직 채점 결과가 없습니다.</p>
                                        <p style={{ fontSize: '0.85rem', color: 'hsl(var(--muted-foreground))' }}>
                                            일괄 채점 탭에서 학급 PDF를 업로드 후 채점을 진행해주세요.
                                        </p>
                                    </div>
                                )}

                                {/* General Memo */}
                                <div style={{ marginTop: '2rem' }}>
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <StickyNote size={16} /> 메모
                                    </h4>
                                    <textarea
                                        className={styles.memoTextarea}
                                        placeholder="평가에 대한 메모를 작성하세요..."
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Create Modal */}
            <AnimatePresence>
                {createModal.isOpen && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCreateModal({ ...createModal, isOpen: false })}
                    >
                        <motion.div
                            className={styles.modalContent}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h3 className={styles.modalTitle}>새 평가 추가</h3>
                                <button
                                    className={styles.modalCloseBtn}
                                    onClick={() => setCreateModal({ ...createModal, isOpen: false })}
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className={styles.modalBody}>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>학년도</label>
                                        <select
                                            className={styles.formSelect}
                                            value={createModal.year}
                                            onChange={(e) => setCreateModal({ ...createModal, year: parseInt(e.target.value) })}
                                        >
                                            <option value={2026}>2026학년도</option>
                                            <option value={2025}>2025학년도</option>
                                            <option value={2024}>2024학년도</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>학기</label>
                                        <select
                                            className={styles.formSelect}
                                            value={createModal.semester}
                                            onChange={(e) => setCreateModal({ ...createModal, semester: e.target.value as Semester })}
                                        >
                                            <option value="1">1학기</option>
                                            <option value="2">2학기</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>학년</label>
                                    <select
                                        className={styles.formSelect}
                                        value={createModal.grade}
                                        onChange={(e) => setCreateModal({ ...createModal, grade: parseInt(e.target.value) })}
                                    >
                                        <option value={1}>1학년</option>
                                        <option value={2}>2학년</option>
                                        <option value={3}>3학년</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>평가명</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="예: 수행평가 1차"
                                        value={createModal.title}
                                        onChange={(e) => setCreateModal({ ...createModal, title: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    className={`${styles.modalBtn} ${styles.modalBtnSecondary} `}
                                    onClick={() => setCreateModal({ ...createModal, isOpen: false })}
                                >
                                    취소
                                </button>
                                <button
                                    className={`${styles.modalBtn} ${styles.modalBtnPrimary} `}
                                    onClick={handleCreateEvaluation}
                                >
                                    추가
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

