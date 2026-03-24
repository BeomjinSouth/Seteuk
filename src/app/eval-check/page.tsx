'use client';

import { Suspense, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    AlertTriangle,
    ArrowUpDown,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clipboard,
    Edit2,
    FileQuestion,
    Filter,
    Link as LinkIcon,
    Loader2,
    Maximize2,
    Minimize2,
    Plus,
    RefreshCw,
    Search,
    Settings,
    ShieldAlert,
    Trash2,
    Upload,
    Eye,
    EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { EvalCheckSettings, DocumentAnalysisStatus, IssueType } from '@/types';
import styles from './page.module.css';

type MainTab = 'settings' | 'upload' | 'results' | 'rules';
type FilterMode = 'all' | 'hasIssues' | 'high' | 'medium' | 'low';
type SortMode = 'number' | 'issueCount' | 'severity';
const MAIN_TABS: MainTab[] = ['settings', 'upload', 'results', 'rules'];
const POLL_MAX_RETRIES = 10;

const compactText = (parts: Array<string | undefined>) =>
    parts
        .map(part => (typeof part === 'string' ? part.trim() : ''))
        .filter((part): part is string => Boolean(part))
        .join(' ');

const formatDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('ko-KR');
};

const extractQuestionNumber = (value: string) => {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
};

const getQuestionSortNumber = (question: { displayName: string; questionId: string }) => {
    const displayNumber = extractQuestionNumber(question.displayName);
    if (displayNumber !== Number.MAX_SAFE_INTEGER) return displayNumber;
    const idNumber = extractQuestionNumber(question.questionId);
    return idNumber !== Number.MAX_SAFE_INTEGER ? idNumber : Number.MAX_SAFE_INTEGER;
};

interface DocumentInfo {
    documentId: string;
    uploadedAt: string;
    originalFileName: string;
    status: DocumentAnalysisStatus;
    progress: number;
    highRiskCount: number;
    errorMessage?: string;
    analysisVersion?: string;
    resourcesExtracted?: number;
    taskTypeDistributionJson?: string;
    consistencyReportJson?: string;
}

interface QuestionDisplay {
    questionId: string;
    displayName: string;
    isHighRisk: boolean;
    highRiskReason?: string;
    answerSummary: string;
    reasoningSummary: string;
    taskType?: string;
    answerType?: string;
    resourceRefs?: string[];
    reviewSections?: Partial<ReviewSectionsDisplay>;
    suggestion?: {
        minimal: string;
        improved: string;
    };
    issues: Array<{
        issueId: string;
        type: IssueType;
        riskLevel?: 'low' | 'medium' | 'high';
        summary: string;
        description?: string;
        location?: string;
        originalText?: string;
        suggestedFix?: string;
    }>;
    ruleViolations?: Array<{
        issueId: string;
        summary: string;
        description?: string;
        location?: string;
        suggestedFix?: string;
    }>;
}

interface RuleItem {
    ruleId: string;
    enabled: boolean;
    name: string;
    target: string;
    condition: string;
    correctionGuide?: string;
    exampleWrong?: string;
    exampleCorrect?: string;
}

type ReviewSectionsDisplay = {
    scoringBorderlines: Array<{
        title: string;
        sampleAnswer: string;
        whyDifficult: string;
        scoringGuide: string;
    }>;
    ambiguityPoints: Array<{
        location: string;
        originalPhrase: string;
        reason: string;
        confusionExample: string;
        rewriteSuggestion: string;
    }>;
    defectCheck: {
        hasDefect: boolean;
        severity: 'minor' | 'major' | 'critical';
        findings: Array<{
            title: string;
            evidence: string;
            impact: string;
            fixSuggestion: string;
        }>;
    };
    curriculumBypassRisks: Array<{
        method: string;
        whyPossible: string;
        impact: string;
        mitigation: string;
    }>;
};

const normalizeReviewSections = (reviewSections?: QuestionDisplay['reviewSections']): ReviewSectionsDisplay => ({
    scoringBorderlines: Array.isArray(reviewSections?.scoringBorderlines)
        ? reviewSections?.scoringBorderlines.filter(
            (item) => item && compactText([item.title, item.sampleAnswer, item.whyDifficult, item.scoringGuide]).length > 0
        )
        : [],
    ambiguityPoints: Array.isArray(reviewSections?.ambiguityPoints)
        ? reviewSections?.ambiguityPoints.filter(
            (item) =>
                item &&
                compactText([
                    item.location,
                    item.originalPhrase,
                    item.reason,
                    item.confusionExample,
                    item.rewriteSuggestion,
                ]).length > 0
        )
        : [],
    defectCheck: {
        hasDefect: Boolean(reviewSections?.defectCheck?.hasDefect),
        severity: reviewSections?.defectCheck?.severity || 'minor',
        findings: Array.isArray(reviewSections?.defectCheck?.findings)
            ? reviewSections?.defectCheck?.findings.filter(
                (item) =>
                    item &&
                    compactText([item.title, item.evidence, item.impact, item.fixSuggestion]).length > 0
            )
            : [],
    },
    curriculumBypassRisks: Array.isArray(reviewSections?.curriculumBypassRisks)
        ? reviewSections?.curriculumBypassRisks.filter(
            (item) => item && compactText([item.method, item.whyPossible, item.impact, item.mitigation]).length > 0
        )
        : [],
});

const hasReviewProblems = (reviewSections?: QuestionDisplay['reviewSections']) => {
    const normalized = normalizeReviewSections(reviewSections);
    return (
        normalized.scoringBorderlines.length > 0 ||
        normalized.ambiguityPoints.length > 0 ||
        (normalized.defectCheck.hasDefect && normalized.defectCheck.findings.length > 0) ||
        normalized.curriculumBypassRisks.length > 0
    );
};

const flattenReviewText = (reviewSections?: QuestionDisplay['reviewSections']) => {
    const normalized = normalizeReviewSections(reviewSections);
    const parts: string[] = [];
    normalized.scoringBorderlines.forEach((item) =>
        parts.push(compactText([item.title, item.sampleAnswer, item.whyDifficult, item.scoringGuide]))
    );
    normalized.ambiguityPoints.forEach((item) =>
        parts.push(compactText([item.location, item.originalPhrase, item.reason, item.confusionExample, item.rewriteSuggestion]))
    );
    normalized.defectCheck.findings.forEach((item) =>
        parts.push(compactText([item.title, item.evidence, item.impact, item.fixSuggestion]))
    );
    normalized.curriculumBypassRisks.forEach((item) =>
        parts.push(compactText([item.method, item.whyPossible, item.impact, item.mitigation]))
    );
    return parts.join(' ');
};

function EvalCheckPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState<MainTab>('settings');
    const [settings, setSettings] = useState<EvalCheckSettings | null>(null);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isTestingConnection, setIsTestingConnection] = useState(false);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileDescription, setFileDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState('');

    const [documents, setDocuments] = useState<DocumentInfo[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<DocumentInfo | null>(null);
    const [questions, setQuestions] = useState<QuestionDisplay[]>([]);
    const [isLoadingResults, setIsLoadingResults] = useState(false);
    const [resultsError, setResultsError] = useState<string | null>(null);
    const [omittedCleanQuestionCount, setOmittedCleanQuestionCount] = useState(0);
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    const [sortMode, setSortMode] = useState<SortMode>('number');
    const [searchQuery, setSearchQuery] = useState('');

    const [rules, setRules] = useState<RuleItem[]>([]);
    const [isLoadingRules, setIsLoadingRules] = useState(false);
    const [isDefaultRules, setIsDefaultRules] = useState(false);
    const [isInitializingRules, setIsInitializingRules] = useState(false);

    // 규칙 추가/수정 상태
    const [isAddingRule, setIsAddingRule] = useState(false);
    const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
    const [ruleForm, setRuleForm] = useState({
        name: '',
        target: 'question',
        condition: '',
        correctionGuide: '',
        exampleWrong: '',
        exampleCorrect: ''
    });

    const [rootFolderId, setRootFolderId] = useState('');
    const [spreadsheetId, setSpreadsheetId] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pollRetryRef = useRef(0);
    const isUnmountedRef = useRef(false);

    const serviceAccountEmail =
        process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL ||
        'your-service-account@project.iam.gserviceaccount.com';

    const clearPollTimer = useCallback(() => {
        if (pollTimeoutRef.current) {
            clearTimeout(pollTimeoutRef.current);
            pollTimeoutRef.current = null;
        }
    }, []);

    const isMainTab = useCallback((value: string | null): value is MainTab =>
        Boolean(value && MAIN_TABS.includes(value as MainTab))
    , []);

    const loadSettings = useCallback(async () => {
        setIsLoadingSettings(true);
        try {
            const response = await fetch('/api/eval-check/settings');
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('설정 JSON 파싱 실패:', text.substring(0, 200));
                return;
            }
            if (data.success && data.settings) {
                setSettings(data.settings);
            }
        } catch (error) {
            console.error('설정 로드 오류:', error);
        } finally {
            setIsLoadingSettings(false);
        }
    }, []);

    const loadDocuments = useCallback(async (nextSelectedId?: string) => {
        try {
            const response = await fetch('/api/eval-check');
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('문서 목록 JSON 파싱 실패:', text.substring(0, 500));
                return [];
            }
            if (data.success) {
                const docs: DocumentInfo[] = data.documents || [];
                setDocuments(docs);
                if (nextSelectedId) {
                    setSelectedDocument(docs.find(doc => doc.documentId === nextSelectedId) || null);
                } else {
                    setSelectedDocument(prev =>
                        prev ? docs.find(doc => doc.documentId === prev.documentId) || null : prev
                    );
                }
                return docs;
            }
        } catch (error) {
            console.error('문서 목록 로드 오류:', error);
        }
        return [];
    }, []);

    const loadRules = useCallback(async () => {
        setIsLoadingRules(true);
        try {
            const response = await fetch('/api/eval-check/rules');
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error('규칙 JSON 파싱 실패:', text.substring(0, 200));
                return;
            }
            if (data.success) {
                const normalizedRules: RuleItem[] = (data.rules || []).map(
                    (rule: RuleItem & { id?: string }, index: number) => ({
                        ...rule,
                        ruleId: rule.ruleId || rule.id || `rule-${index}`,
                    })
                );
                setRules(normalizedRules);
                setIsDefaultRules(Boolean(data.isDefault));
                if (data.isDefault) {
                    setIsAddingRule(false);
                    setEditingRuleId(null);
                }
            }
        } catch (error) {
            console.error('규칙 로드 오류:', error);
            setIsDefaultRules(false);
        } finally {
            setIsLoadingRules(false);
        }
    }, []);

    useEffect(() => {
        isUnmountedRef.current = false;
        return () => {
            isUnmountedRef.current = true;
            clearPollTimer();
        };
    }, [clearPollTimer]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (!isMainTab(tab)) return;

        // Avoid a feedback loop: only react to URL tab changes.
        setActiveTab((prevTab) => (prevTab === tab ? prevTab : tab));
    }, [searchParams, isMainTab]);

    useEffect(() => {
        const currentTab = searchParams.get('tab');
        if (currentTab === activeTab) return;

        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.set('tab', activeTab);
        const nextQuery = nextParams.toString();
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
    }, [activeTab, pathname, router, searchParams]);

    useEffect(() => {
        if (settings?.isConnected) return;
        if (activeTab === 'upload' || activeTab === 'results') {
            setActiveTab('settings');
        }
    }, [settings?.isConnected, activeTab]);

    useEffect(() => {
        loadSettings();
        loadDocuments();
        loadRules();

        const savedFolderId = localStorage.getItem('evalcheck_folderId');
        const savedSpreadsheetId = localStorage.getItem('evalcheck_spreadsheetId');
        if (savedFolderId) setRootFolderId(savedFolderId);
        if (savedSpreadsheetId) setSpreadsheetId(savedSpreadsheetId);
    }, [loadSettings, loadDocuments, loadRules]);

    useEffect(() => {
        if (!selectedDocument) {
            setQuestions([]);
            setIsLoadingResults(false);
            setResultsError(null);
            setOmittedCleanQuestionCount(0);
            return;
        }

        let isActive = true;

        const fetchResults = async () => {
            setIsLoadingResults(true);
            setResultsError(null);
            try {
                const response = await fetch(
                    `/api/eval-check/results?documentId=${selectedDocument.documentId}`
                );
                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (error) {
                    console.error('문항 결과 JSON 파싱 실패:', text.substring(0, 200));
                    if (isActive) {
                        setResultsError('문항 결과를 불러오지 못했습니다.');
                        setQuestions([]);
                        setOmittedCleanQuestionCount(0);
                    }
                    return;
                }

                // 디버깅 로그
                console.log('[EvalCheck UI] API 응답:', {
                    success: data.success,
                    questionsCount: data.questions?.length || 0,
                    error: data.error
                });

                if (data.success) {
                    const normalized = (data.questions || []).map(
                        (question: QuestionDisplay, index: number) => {
                            const questionId = question.questionId || `question-${index + 1}`;
                            return {
                                ...question,
                                questionId,
                                displayName: question.displayName || `문항 ${index + 1}`,
                                answerSummary: question.answerSummary || '',
                                reasoningSummary: question.reasoningSummary || '',
                                resourceRefs: Array.isArray(question.resourceRefs) ? question.resourceRefs : [],
                                reviewSections: question.reviewSections,
                                issues: (question.issues || []).map((issue, issueIndex) => ({
                                    issueId: issue.issueId || `${questionId}-${issue.type}-${issueIndex}`,
                                    type: issue.type,
                                    riskLevel: issue.riskLevel,
                                    summary: issue.summary,
                                    description: issue.description,
                                    location: issue.location,
                                    originalText: issue.originalText,
                                    suggestedFix: issue.suggestedFix,
                                })),
                                ruleViolations: Array.isArray(question.ruleViolations)
                                    ? question.ruleViolations.map((violation, violationIndex) => ({
                                        issueId: violation.issueId || `${questionId}-rule-${violationIndex}`,
                                        summary: violation.summary || '규칙 위반',
                                        description: violation.description,
                                        location: violation.location,
                                        suggestedFix: violation.suggestedFix,
                                    }))
                                    : [],
                            };
                        }
                    );
                    if (isActive) {
                        setQuestions(normalized.filter((question: QuestionDisplay) => hasReviewProblems(question.reviewSections)));
                        setOmittedCleanQuestionCount(
                            Math.max(
                                0,
                                Number(data.summary?.omittedCleanQuestionCount || 0)
                            )
                        );
                        setResultsError(null);
                    }
                } else if (isActive) {
                    setQuestions([]);
                    setOmittedCleanQuestionCount(0);
                    setResultsError(data.error || '문항 결과를 불러오지 못했습니다.');
                }
            } catch (error) {
                console.error('문항 결과 로드 오류:', error);
                if (isActive) {
                    setQuestions([]);
                    setOmittedCleanQuestionCount(0);
                    setResultsError(
                        error instanceof Error ? error.message : '문항 결과를 불러오지 못했습니다.'
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoadingResults(false);
                }
            }
        };

        fetchResults();

        return () => {
            isActive = false;
        };
    }, [selectedDocument?.documentId]);
    const handleTestConnection = async () => {
        if (!rootFolderId) {
            alert('루트 폴더 ID를 입력해주세요.');
            return;
        }

        setIsTestingConnection(true);
        try {
            const response = await fetch('/api/eval-check/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rootFolderId,
                    spreadsheetId,
                    testConnection: true,
                }),
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('evalcheck_folderId', rootFolderId);
                if (spreadsheetId) {
                    localStorage.setItem('evalcheck_spreadsheetId', spreadsheetId);
                }
                alert(`연결 완료! 폴더: ${data.folderName}`);
                await loadSettings();
                setActiveTab('upload');
            } else {
                alert(`연결 실패: ${data.error}`);
            }
        } catch (error) {
            alert('연결 테스트 중 오류가 발생했습니다.');
        } finally {
            setIsTestingConnection(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFileDescription(file.name.replace(/\.[^/.]+$/, ''));
        }
    };

    const pollProgress = useCallback((documentId: string) => {
        const poll = async () => {
            try {
                const response = await fetch(`/api/eval-check/progress?documentId=${documentId}`);
                const data = await response.json();

                if (!data.success) {
                    clearPollTimer();
                    if (isUnmountedRef.current) return;
                    setIsUploading(false);
                    setCurrentStep('분석 상태 조회 실패');
                    alert(`진행 상황 조회 실패: ${data.error || '알 수 없는 오류'}`);
                    return;
                }

                pollRetryRef.current = 0;
                if (isUnmountedRef.current) return;

                setUploadProgress(data.progress || 0);
                setCurrentStep(data.currentStep || '');

                if (data.status === 'completed') {
                    clearPollTimer();
                    setIsUploading(false);
                    setSelectedFile(null);
                    setFileDescription('');
                    await loadDocuments(documentId);
                    setActiveTab('results');
                    alert('분석이 완료되었습니다.');
                    return;
                }

                if (data.status === 'error') {
                    clearPollTimer();
                    setIsUploading(false);
                    alert(`분석 실패: ${data.error || '알 수 없는 오류'}`);
                    return;
                }

                clearPollTimer();
                pollTimeoutRef.current = setTimeout(poll, 2000);
            } catch (error) {
                pollRetryRef.current += 1;
                if (pollRetryRef.current > POLL_MAX_RETRIES) {
                    clearPollTimer();
                    if (isUnmountedRef.current) return;
                    setIsUploading(false);
                    setCurrentStep('네트워크 오류로 폴링 중단');
                    alert('진행 상황 조회가 반복 실패하여 중단되었습니다. 문서 목록에서 상태를 새로고침해주세요.');
                    return;
                }

                console.error('진행 상황 조회 오류:', error);
                if (isUnmountedRef.current) return;
                clearPollTimer();
                pollTimeoutRef.current = setTimeout(poll, 3000);
            }
        };

        pollRetryRef.current = 0;
        clearPollTimer();
        void poll();
    }, [clearPollTimer, loadDocuments]);

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('파일을 선택해주세요.');
            return;
        }

        clearPollTimer();
        pollRetryRef.current = 0;
        setIsUploading(true);
        setUploadProgress(0);
        setCurrentStep('파일 처리 준비 중...');

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('fileDescription', fileDescription);

            const response = await fetch('/api/eval-check', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.success) {
                if (data.reused) {
                    clearPollTimer();
                    alert(data.message);
                    await loadDocuments(data.documentId);
                    setActiveTab('results');
                    setIsUploading(false);
                } else {
                    pollProgress(data.documentId);
                }
            } else {
                clearPollTimer();
                alert(`업로드 실패: ${data.error}`);
                setIsUploading(false);
            }
        } catch (error) {
            clearPollTimer();
            console.error('업로드 오류:', error);
            alert(
                `업로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'
                }`
            );
            setIsUploading(false);
        }
    };

    const toggleQuestion = (questionId: string) => {
        setExpandedQuestions(prev => {
            const next = new Set(prev);
            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }
            return next;
        });
    };

    const expandAll = () => {
        setExpandedQuestions(new Set(questions.map(question => question.questionId)));
    };

    const collapseAll = () => {
        setExpandedQuestions(new Set());
    };

    const getMaxSeverity = useCallback((question: QuestionDisplay): number => {
        if (question.issues.length === 0) return 0;
        const severityMap: Record<string, number> = { high: 3, medium: 2, low: 1 };
        return Math.max(
            ...question.issues.map(issue => severityMap[issue.riskLevel || 'low'] || 0)
        );
    }, []);

    const filteredQuestions = useMemo(() => {
        let filtered = [...questions];

        switch (filterMode) {
            case 'hasIssues':
                filtered = filtered.filter(question => question.issues.length > 0);
                break;
            case 'high':
                filtered = filtered.filter(question =>
                    question.issues.some(issue => issue.riskLevel === 'high')
                );
                break;
            case 'medium':
                filtered = filtered.filter(question =>
                    question.issues.some(issue => issue.riskLevel === 'medium')
                );
                break;
            case 'low':
                filtered = filtered.filter(
                    question =>
                        question.issues.some(issue => issue.riskLevel === 'low') &&
                        !question.issues.some(
                            issue => issue.riskLevel === 'high' || issue.riskLevel === 'medium'
                        )
                );
                break;
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(question =>
                question.displayName.toLowerCase().includes(query) ||
                question.questionId.toLowerCase().includes(query) ||
                question.issues.some(issue => issue.summary.toLowerCase().includes(query)) ||
                question.answerSummary?.toLowerCase().includes(query) ||
                flattenReviewText(question.reviewSections).toLowerCase().includes(query)
            );
        }

        const withIndex = filtered.map((question, index) => ({ question, index }));

        if (sortMode === 'issueCount') {
            withIndex.sort(
                (a, b) => b.question.issues.length - a.question.issues.length || a.index - b.index
            );
        } else if (sortMode === 'severity') {
            withIndex.sort(
                (a, b) =>
                    getMaxSeverity(b.question) - getMaxSeverity(a.question) || a.index - b.index
            );
        } else {
            withIndex.sort((a, b) => {
                const aNumber = getQuestionSortNumber(a.question);
                const bNumber = getQuestionSortNumber(b.question);
                if (aNumber !== bNumber) return aNumber - bNumber;
                return a.index - b.index;
            });
        }

        return withIndex.map(item => item.question);
    }, [questions, filterMode, searchQuery, sortMode, getMaxSeverity]);

    const handleDeleteDocument = async (documentId: string) => {
        if (!documentId) {
            alert('문서 ID를 찾지 못했습니다.');
            return;
        }

        if (!confirm('선택한 문서를 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/eval-check?documentId=${documentId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                if (selectedDocument?.documentId === documentId) {
                    setSelectedDocument(null);
                    setQuestions([]);
                }
                await loadDocuments();
            } else {
                alert(`문서 삭제 실패: ${data.error}`);
            }
        } catch (error) {
            alert('문서 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleToggleRule = async (ruleId: string, enabled: boolean) => {
        if (isDefaultRules) {
            alert('기본 규칙 미리보기 상태에서는 수정할 수 없습니다. 먼저 기본 규칙 등록을 실행해주세요.');
            return;
        }
        try {
            const response = await fetch('/api/eval-check/rules', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ruleId, enabled }),
            });
            const data = await response.json();

            if (data.success) {
                await loadRules();
            } else {
                alert(`규칙 업데이트 실패: ${data.error}`);
            }
        } catch (error) {
            alert('규칙 업데이트 중 오류가 발생했습니다.');
        }
    };

    const resetRuleForm = () => {
        setRuleForm({
            name: '',
            target: 'question',
            condition: '',
            correctionGuide: '',
            exampleWrong: '',
            exampleCorrect: ''
        });
        setIsAddingRule(false);
        setEditingRuleId(null);
    };

    const handleAddRuleClick = () => {
        if (isDefaultRules) {
            alert('기본 규칙 미리보기 상태입니다. 먼저 기본 규칙 등록을 실행해주세요.');
            return;
        }
        resetRuleForm();
        setIsAddingRule(true);
    };

    const handleEditRuleClick = (rule: RuleItem) => {
        if (isDefaultRules) {
            alert('기본 규칙 미리보기 상태에서는 수정할 수 없습니다. 먼저 기본 규칙 등록을 실행해주세요.');
            return;
        }
        setRuleForm({
            name: rule.name,
            target: rule.target || 'question',
            condition: rule.condition,
            correctionGuide: rule.correctionGuide || '',
            exampleWrong: rule.exampleWrong || '',
            exampleCorrect: rule.exampleCorrect || ''
        });
        setEditingRuleId(rule.ruleId);
        setIsAddingRule(true);
    };

    const handleInitializeDefaultRules = async () => {
        if (!isDefaultRules) return;
        if (!confirm('기본 규칙을 실제 사용자 규칙으로 등록하시겠습니까?')) return;

        setIsInitializingRules(true);
        try {
            const response = await fetch('/api/eval-check/rules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initializeDefaults: true }),
            });
            const data = await response.json();

            if (data.success) {
                await loadRules();
                resetRuleForm();
                alert(data.message || '기본 규칙이 등록되었습니다.');
            } else {
                alert(`기본 규칙 등록 실패: ${data.error}`);
            }
        } catch (error) {
            alert('기본 규칙 등록 중 오류가 발생했습니다.');
        } finally {
            setIsInitializingRules(false);
        }
    };

    const handleSaveRule = async () => {
        if (isDefaultRules) {
            alert('기본 규칙 미리보기 상태에서는 저장할 수 없습니다. 먼저 기본 규칙 등록을 실행해주세요.');
            return;
        }
        if (!ruleForm.name.trim() || !ruleForm.condition.trim()) {
            alert('규칙 이름과 조건은 필수입니다.');
            return;
        }

        try {
            const method = editingRuleId ? 'PUT' : 'POST';
            const body = editingRuleId
                ? { ruleId: editingRuleId, ...ruleForm }
                : ruleForm;

            const response = await fetch('/api/eval-check/rules', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (data.success) {
                await loadRules();
                resetRuleForm();
            } else {
                alert(`규칙 저장 실패: ${data.error}`);
            }
        } catch (error) {
            alert('규칙 저장 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteRule = async (ruleId: string) => {
        if (isDefaultRules) {
            alert('기본 규칙 미리보기 상태에서는 삭제할 수 없습니다. 먼저 기본 규칙 등록을 실행해주세요.');
            return;
        }
        if (!confirm('이 규칙을 삭제하시겠습니까?')) return;

        try {
            const response = await fetch(`/api/eval-check/rules?ruleId=${ruleId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (data.success) {
                await loadRules();
            } else {
                alert(`규칙 삭제 실패: ${data.error}`);
            }
        } catch (error) {
            alert('규칙 삭제 중 오류가 발생했습니다.');
        }
    };

    const renderDocumentStatus = (doc: DocumentInfo) => {
        if (doc.status === 'error') {
            return <span className={styles.errorBadge}>오류</span>;
        }

        if (doc.status === 'completed') {
            if (doc.highRiskCount > 0) {
                return (
                    <span className={styles.highRiskBadge}>
                        <AlertTriangle size={14} />
                        고위험 {doc.highRiskCount}
                    </span>
                );
            }

            return <span className={styles.safeBadge}>정상</span>;
        }

        return <Loader2 size={16} className={styles.spinner} />;
    };
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1 className={styles.title}>시험지 오류 점검</h1>
                    <p className={styles.subtitle}>시험지를 업로드하고 문항 오류를 점검하세요.</p>
                </div>
            </header>

            <nav className={styles.tabNav}>
                <button
                    className={`${styles.tab} ${activeTab === 'settings' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('settings')}
                >
                    <Settings size={16} />
                    설정
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'upload' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('upload')}
                    disabled={!settings?.isConnected}
                >
                    <Upload size={16} />
                    업로드
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'results' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('results')}
                    disabled={!settings?.isConnected}
                >
                    <Clipboard size={16} />
                    결과
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'rules' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('rules')}
                >
                    <ShieldAlert size={16} />
                    규칙
                </button>
            </nav>

            <div className={styles.tabContent}>
                {activeTab === 'settings' && (
                    <div className={`${styles.card} ${styles.settingsTab}`}>
                        {isLoadingSettings ? (
                            <div className={styles.loadingState}>
                                <Loader2 size={24} className={styles.spinner} />
                                <p>설정을 불러오는 중입니다...</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.formGrid}>
                                    <Input
                                        label="폴더 ID *"
                                        placeholder="1A2B3C..."
                                        value={rootFolderId}
                                        onChange={(e) => setRootFolderId(e.target.value)}
                                    />
                                    <Input
                                        label="스프레드시트 ID"
                                        placeholder="1A2B3C..."
                                        value={spreadsheetId}
                                        onChange={(e) => setSpreadsheetId(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formActions}>
                                    <Button onClick={handleTestConnection} isLoading={isTestingConnection}>
                                        <LinkIcon size={14} />
                                        연결 테스트
                                    </Button>
                                    {settings?.isConnected && (
                                        <span className={styles.connectedBadge}>
                                            <CheckCircle size={16} />
                                            연결 완료
                                        </span>
                                    )}
                                </div>
                                <p className={styles.cardDesc}>
                                    서비스 계정 이메일에 폴더 공유 권한이 필요합니다.
                                </p>
                                <div className={styles.emailBox}>
                                    <code>{serviceAccountEmail}</code>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div className={`${styles.card} ${styles.uploadTab}`}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <div
                            className={styles.dropZone}
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                        >
                            {selectedFile ? (
                                <div className={styles.selectedFile}>
                                    <CheckCircle size={28} />
                                    <p>{selectedFile.name}</p>
                                    <span>클릭해서 다른 파일 선택</span>
                                </div>
                            ) : (
                                <>
                                    <Upload size={32} />
                                    <p>PDF 파일을 선택하세요</p>
                                    <span>클릭해서 파일을 업로드할 수 있습니다</span>
                                </>
                            )}
                        </div>
                        <Input
                            label="파일 설명"
                            placeholder="예: 중간고사"
                            value={fileDescription}
                            onChange={(e) => setFileDescription(e.target.value)}
                        />
                        <div className={styles.formActions}>
                            <Button onClick={handleUpload} isLoading={isUploading} disabled={!selectedFile}>
                                <Upload size={14} />
                                업로드
                            </Button>
                        </div>
                        {isUploading && (
                            <div className={styles.progressSection}>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                                </div>
                                <div className={styles.progressText}>{currentStep}</div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'results' && (
                    <div className={styles.card}>
                        <div className={styles.resultsTab}>
                            <aside className={styles.documentList}>
                                <div className={styles.formActions} style={{ justifyContent: 'space-between', marginTop: 0 }}>
                                    <h3>문서 목록</h3>
                                    <Button variant="secondary" onClick={() => loadDocuments()}>
                                        <RefreshCw size={14} />
                                        새로고침
                                    </Button>
                                </div>
                                {documents.length === 0 ? (
                                    <p className={styles.emptyState}>업로드된 문서가 없습니다.</p>
                                ) : (
                                    <ul>
                                        {documents.map(doc => (
                                            <li
                                                key={doc.documentId}
                                                className={`${styles.documentItem} ${selectedDocument?.documentId === doc.documentId ? styles.selected : ''}`}
                                                onClick={() => setSelectedDocument(doc)}
                                            >
                                                <div className={styles.docInfo}>
                                                    <span className={styles.docName}>{doc.originalFileName}</span>
                                                    <span className={styles.docDate}>{formatDate(doc.uploadedAt)}</span>
                                                </div>
                                                <div className={styles.docActions}>
                                                    {renderDocumentStatus(doc)}
                                                    <button
                                                        className={styles.docDeleteBtn}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleDeleteDocument(doc.documentId);
                                                        }}
                                                        aria-label="문서 삭제"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </aside>
                            <section className={styles.questionResults}>
                                <div className={styles.resultsHeader}>
                                    <h3>문항 결과</h3>
                                    {selectedDocument && !isLoadingResults && !resultsError && (
                                        <span className={styles.omittedCountBadge}>
                                            제외된 무문제 문항 수 {omittedCleanQuestionCount}개
                                        </span>
                                    )}
                                </div>

                                {resultsError && (
                                    <div className={styles.errorBanner}>
                                        <AlertTriangle size={16} />
                                        <div>
                                            <strong>결과 로드 실패</strong>
                                            <p>{resultsError}</p>
                                        </div>
                                    </div>
                                )}

                                {!selectedDocument ? (
                                    <div className={styles.selectPrompt}>
                                        <FileQuestion size={32} />
                                        <p>문서를 선택해주세요.</p>
                                    </div>
                                ) : isLoadingResults ? (
                                    <div className={styles.loadingState}>
                                        <Loader2 size={24} className={styles.spinner} />
                                        <p>분석 결과를 불러오는 중입니다.</p>
                                    </div>
                                ) : questions.length === 0 ? (
                                    <p className={styles.emptyState}>점검에서 확인된 문제 문항이 없습니다.</p>
                                ) : (
                                    <>
                                        <div className={styles.toolbar}>
                                            <div className={styles.toolbarGroup}>
                                                <span className={styles.toolbarLabel}>
                                                    <Filter size={14} />
                                                    필터
                                                </span>
                                                <select
                                                    className={styles.toolbarSelect}
                                                    value={filterMode}
                                                    onChange={(e) => setFilterMode(e.target.value as FilterMode)}
                                                >
                                                    <option value="all">전체</option>
                                                    <option value="hasIssues">오류 있음</option>
                                                    <option value="high">고위험</option>
                                                    <option value="medium">중위험</option>
                                                    <option value="low">저위험</option>
                                                </select>
                                            </div>
                                            <div className={styles.toolbarGroup}>
                                                <span className={styles.toolbarLabel}>
                                                    <ArrowUpDown size={14} />
                                                    정렬
                                                </span>
                                                <select
                                                    className={styles.toolbarSelect}
                                                    value={sortMode}
                                                    onChange={(e) => setSortMode(e.target.value as SortMode)}
                                                >
                                                    <option value="number">문항 번호</option>
                                                    <option value="issueCount">오류 개수</option>
                                                    <option value="severity">위험도</option>
                                                </select>
                                            </div>
                                            <div className={styles.toolbarGroup}>
                                                <span className={styles.toolbarLabel}>
                                                    <Search size={14} />
                                                    검색
                                                </span>
                                                <input
                                                    className={styles.toolbarSearch}
                                                    placeholder="문항/요약/오류 검색"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.toolbarActions}>
                                                <button className={styles.toolbarBtn} onClick={expandAll}>
                                                    <Maximize2 size={16} />
                                                    전체 펼치기
                                                </button>
                                                <button className={styles.toolbarBtn} onClick={collapseAll}>
                                                    <Minimize2 size={16} />
                                                    전체 접기
                                                </button>
                                            </div>
                                        </div>

                                        {filteredQuestions.length === 0 ? (
                                            <p className={styles.emptyState}>조건에 맞는 문항이 없습니다.</p>
                                        ) : (
                                            <div className={styles.questionList}>
                                                {filteredQuestions.map((question, index) => {
                                                    const reviewSections = normalizeReviewSections(question.reviewSections);
                                                    const isExpanded = expandedQuestions.has(question.questionId);
                                                    const defectSeverityClass =
                                                        reviewSections.defectCheck.severity === 'critical'
                                                            ? styles.riskHigh
                                                            : reviewSections.defectCheck.severity === 'major'
                                                                ? styles.riskMedium
                                                                : styles.riskLow;
                                                    const defectSeverityLabel =
                                                        reviewSections.defectCheck.severity === 'critical'
                                                            ? '치명'
                                                            : reviewSections.defectCheck.severity === 'major'
                                                                ? '중대'
                                                                : '경미';

                                                    const sectionTags = [
                                                        reviewSections.scoringBorderlines.length > 0
                                                            ? { label: '부분점수 경계', color: '#0f766e' }
                                                            : null,
                                                        reviewSections.ambiguityPoints.length > 0
                                                            ? { label: '표현/조건 해석 주의', color: '#b45309' }
                                                            : null,
                                                        reviewSections.defectCheck.hasDefect && reviewSections.defectCheck.findings.length > 0
                                                            ? { label: '출제 오류', color: '#b91c1c' }
                                                            : null,
                                                        reviewSections.curriculumBypassRisks.length > 0
                                                            ? { label: '교과 범위 이탈 가능성', color: '#5b21b6' }
                                                            : null,
                                                    ].filter((item): item is { label: string; color: string } => item !== null);

                                                    return (
                                                        <div
                                                            key={question.questionId || `${question.displayName}-${index}`}
                                                            className={`${styles.questionCard} ${question.isHighRisk ? styles.highRisk : ''}`}
                                                        >
                                                            <div
                                                                className={styles.questionHeader}
                                                                onClick={() => toggleQuestion(question.questionId)}
                                                            >
                                                                <div className={styles.questionTitle}>
                                                                    {isExpanded ? (
                                                                        <ChevronDown size={16} />
                                                                    ) : (
                                                                        <ChevronRight size={16} />
                                                                    )}
                                                                    <span>{question.displayName}</span>
                                                                    {question.isHighRisk && (
                                                                        <span className={styles.highRiskLabel}>
                                                                            <AlertTriangle size={14} />
                                                                            {question.highRiskReason || '고위험 문항'}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className={styles.issueTags}>
                                                                    {sectionTags.map((tag, tagIndex) => (
                                                                        <span
                                                                            key={`${question.questionId}-tag-${tagIndex}`}
                                                                            className={styles.issueTag}
                                                                            style={{ backgroundColor: tag.color }}
                                                                        >
                                                                            {tag.label}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {isExpanded && (
                                                                <div className={styles.questionDetail}>
                                                                    {reviewSections.scoringBorderlines.length > 0 && (
                                                                        <div className={styles.detailSection}>
                                                                            <h4>부분점수 판단이 갈릴 수 있는 답안</h4>
                                                                            <div className={styles.simulationList}>
                                                                                {reviewSections.scoringBorderlines.map((item, itemIndex) => (
                                                                                    <div key={`${question.questionId}-score-${itemIndex}`} className={styles.simulationCard}>
                                                                                        {item.title && (
                                                                                            <div className={styles.simulationScenario}>
                                                                                                <span className={styles.simulationLabel}>사례</span>
                                                                                                <p>{item.title}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.sampleAnswer && (
                                                                                            <div className={styles.simulationResponse}>
                                                                                                <span className={styles.simulationLabel}>예시 답안</span>
                                                                                                <p>{item.sampleAnswer}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.whyDifficult && (
                                                                                            <div className={styles.simulationDifficulty}>
                                                                                                <span className={styles.simulationLabel}>판단이 어려운 이유</span>
                                                                                                <p>{item.whyDifficult}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.scoringGuide && (
                                                                                            <div className={styles.simulationGuideline}>
                                                                                                <span className={styles.simulationLabel}>권장 채점 기준</span>
                                                                                                <p>{item.scoringGuide}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {reviewSections.ambiguityPoints.length > 0 && (
                                                                        <div className={styles.detailSection}>
                                                                            <h4>오해를 부르는 표현·조건</h4>
                                                                            <div className={styles.simulationList}>
                                                                                {reviewSections.ambiguityPoints.map((item, itemIndex) => (
                                                                                    <div key={`${question.questionId}-ambiguity-${itemIndex}`} className={styles.simulationCard}>
                                                                                        {item.location && (
                                                                                            <div className={styles.simulationScenario}>
                                                                                                <span className={styles.simulationLabel}>문제 위치</span>
                                                                                                <p>{item.location}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.originalPhrase && (
                                                                                            <div className={styles.simulationResponse}>
                                                                                                <span className={styles.simulationLabel}>원문 표현</span>
                                                                                                <p>{item.originalPhrase}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.reason && (
                                                                                            <div className={styles.simulationDifficulty}>
                                                                                                <span className={styles.simulationLabel}>문제점</span>
                                                                                                <p>{item.reason}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.confusionExample && (
                                                                                            <div className={styles.simulationGuideline}>
                                                                                                <span className={styles.simulationLabel}>학생 오해 예시</span>
                                                                                                <p>{item.confusionExample}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.rewriteSuggestion && (
                                                                                            <div className={styles.simulationGuideline}>
                                                                                                <span className={styles.simulationLabel}>문구 다듬기 제안</span>
                                                                                                <p>{item.rewriteSuggestion}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {reviewSections.defectCheck.hasDefect && reviewSections.defectCheck.findings.length > 0 && (
                                                                        <div className={styles.detailSection}>
                                                                            <h4>
                                                                                출제 오류 점검
                                                                                <span className={`${styles.riskLevel} ${defectSeverityClass}`} style={{ marginLeft: '0.5rem' }}>
                                                                                    {defectSeverityLabel}
                                                                                </span>
                                                                            </h4>
                                                                            <div className={styles.simulationList}>
                                                                                {reviewSections.defectCheck.findings.map((item, itemIndex) => (
                                                                                    <div key={`${question.questionId}-defect-${itemIndex}`} className={styles.simulationCard}>
                                                                                        {item.title && (
                                                                                            <div className={styles.simulationScenario}>
                                                                                                <span className={styles.simulationLabel}>오류 요약</span>
                                                                                                <p>{item.title}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.evidence && (
                                                                                            <div className={styles.simulationResponse}>
                                                                                                <span className={styles.simulationLabel}>근거</span>
                                                                                                <p>{item.evidence}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.impact && (
                                                                                            <div className={styles.simulationDifficulty}>
                                                                                                <span className={styles.simulationLabel}>영향</span>
                                                                                                <p>{item.impact}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.fixSuggestion && (
                                                                                            <div className={styles.simulationGuideline}>
                                                                                                <span className={styles.simulationLabel}>수정 제안</span>
                                                                                                <p>{item.fixSuggestion}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {reviewSections.curriculumBypassRisks.length > 0 && (
                                                                        <div className={styles.detailSection}>
                                                                            <h4>교과 범위를 벗어난 풀이 가능성</h4>
                                                                            <div className={styles.simulationList}>
                                                                                {reviewSections.curriculumBypassRisks.map((item, itemIndex) => (
                                                                                    <div key={`${question.questionId}-bypass-${itemIndex}`} className={styles.simulationCard}>
                                                                                        {item.method && (
                                                                                            <div className={styles.simulationScenario}>
                                                                                                <span className={styles.simulationLabel}>가능한 우회 풀이</span>
                                                                                                <p>{item.method}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.whyPossible && (
                                                                                            <div className={styles.simulationResponse}>
                                                                                                <span className={styles.simulationLabel}>가능해지는 이유</span>
                                                                                                <p>{item.whyPossible}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.impact && (
                                                                                            <div className={styles.simulationDifficulty}>
                                                                                                <span className={styles.simulationLabel}>평가 영향</span>
                                                                                                <p>{item.impact}</p>
                                                                                            </div>
                                                                                        )}
                                                                                        {item.mitigation && (
                                                                                            <div className={styles.simulationGuideline}>
                                                                                                <span className={styles.simulationLabel}>보완 방향</span>
                                                                                                <p>{item.mitigation}</p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}
                            </section>
                        </div>
                    </div>
                )}
                {activeTab === 'rules' && (
                    <div className={`${styles.card} ${styles.rulesTab}`}>
                        {/* 규칙 추가 버튼 */}
                        <div className={styles.rulesHeader}>
                            <h3>평가 점검 규칙</h3>
                            {isDefaultRules ? (
                                <button
                                    className={styles.initDefaultBtn}
                                    onClick={handleInitializeDefaultRules}
                                    disabled={isInitializingRules}
                                >
                                    <Plus size={16} />
                                    {isInitializingRules ? '기본 규칙 등록 중...' : '기본 규칙 등록'}
                                </button>
                            ) : !isAddingRule && (
                                <button
                                    className={styles.addRuleBtn}
                                    onClick={handleAddRuleClick}
                                >
                                    <Plus size={16} />
                                    규칙 추가
                                </button>
                            )}
                        </div>
                        {isDefaultRules && (
                            <div className={styles.defaultRulesNotice}>
                                <p>
                                    현재 목록은 기본 규칙 미리보기입니다. 수정하려면 먼저 기본 규칙 등록을 실행하세요.
                                </p>
                            </div>
                        )}

                        {/* 규칙 추가/수정 폼 */}
                        {isAddingRule && !isDefaultRules && (
                            <div className={styles.ruleForm}>
                                <h4>{editingRuleId ? '규칙 수정' : '새 규칙 추가'}</h4>
                                <div className={styles.formGroup}>
                                    <label>규칙 이름 *</label>
                                    <input
                                        type="text"
                                        value={ruleForm.name}
                                        onChange={(e) => setRuleForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="예: <보기> 종결 표현 규칙"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>조건 *</label>
                                    <textarea
                                        value={ruleForm.condition}
                                        onChange={(e) => setRuleForm(prev => ({ ...prev, condition: e.target.value }))}
                                        placeholder="예: &lt;보기&gt;가 있는 경우"
                                        rows={2}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>교정 가이드</label>
                                    <textarea
                                        value={ruleForm.correctionGuide}
                                        onChange={(e) => setRuleForm(prev => ({ ...prev, correctionGuide: e.target.value }))}
                                        placeholder="예: &quot;있는 대로 모두 고르시오&quot; 계열 표현 권장"
                                        rows={2}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>잘못된 예시</label>
                                        <input
                                            type="text"
                                            value={ruleForm.exampleWrong}
                                            onChange={(e) => setRuleForm(prev => ({ ...prev, exampleWrong: e.target.value }))}
                                            placeholder="예: 옳은 것을 고르시오."
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>올바른 예시</label>
                                        <input
                                            type="text"
                                            value={ruleForm.exampleCorrect}
                                            onChange={(e) => setRuleForm(prev => ({ ...prev, exampleCorrect: e.target.value }))}
                                            placeholder="예: 옳은 것만을 있는 대로 고르시오."
                                        />
                                    </div>
                                </div>
                                <div className={styles.formActions}>
                                    <button className={styles.cancelBtn} onClick={resetRuleForm}>
                                        취소
                                    </button>
                                    <button className={styles.saveBtn} onClick={handleSaveRule}>
                                        {editingRuleId ? '수정' : '추가'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {isLoadingRules ? (
                            <div className={styles.loadingState}>
                                <Loader2 size={24} className={styles.spinner} />
                                <p>규칙을 불러오는 중...</p>
                            </div>
                        ) : rules.length === 0 && !isAddingRule ? (
                            <p className={styles.emptyState}>등록된 규칙이 없습니다. 위 버튼을 클릭하여 규칙을 추가하세요.</p>
                        ) : (
                            <div className={styles.rulesList}>
                                {rules.map(rule => (
                                    <div
                                        key={rule.ruleId}
                                        className={`${styles.ruleCard} ${!rule.enabled ? styles.disabled : ''}`}
                                    >
                                        <div className={styles.ruleCardHeader}>
                                            <div className={styles.ruleInfo}>
                                                <button
                                                    className={styles.toggleBtn}
                                                    onClick={() => handleToggleRule(rule.ruleId, !rule.enabled)}
                                                    disabled={isDefaultRules}
                                                    title={rule.enabled ? '비활성화' : '활성화'}
                                                >
                                                    {rule.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                                <div>
                                                    <h4>{rule.name}</h4>
                                                    <span className={styles.ruleTarget}>{rule.target}</span>
                                                </div>
                                            </div>
                                            <div className={styles.ruleActions}>
                                                <button
                                                    className={styles.editBtn}
                                                    onClick={() => handleEditRuleClick(rule)}
                                                    disabled={isDefaultRules}
                                                    title="수정"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDeleteRule(rule.ruleId)}
                                                    disabled={isDefaultRules}
                                                    title="삭제"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.ruleDetails}>
                                            <p>
                                                <strong>조건:</strong> {rule.condition}
                                            </p>
                                            {rule.correctionGuide && (
                                                <p>
                                                    <strong>교정 가이드:</strong> {rule.correctionGuide}
                                                </p>
                                            )}
                                            {(rule.exampleWrong || rule.exampleCorrect) && (
                                                <div className={styles.ruleExamples}>
                                                    {rule.exampleWrong && (
                                                        <span className={styles.wrongExample}>✗ {rule.exampleWrong}</span>
                                                    )}
                                                    {rule.exampleCorrect && (
                                                        <span className={styles.correctExample}>✓ {rule.exampleCorrect}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

    );
}

export default function EvalCheckPage() {
    return (
        <Suspense
            fallback={
                <div className={styles.page}>
                    <div className={styles.loadingState}>
                        <Loader2 size={24} className={styles.spinner} />
                        <p>페이지를 불러오는 중입니다.</p>
                    </div>
                </div>
            }
        >
            <EvalCheckPageContent />
        </Suspense>
    );
}
