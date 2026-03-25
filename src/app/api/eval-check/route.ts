export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import {
    getEvalCheckDocumentById,
    getEvalCheckDocumentByHash,
    addEvalCheckDocument,
    updateEvalCheckDocument,
    getEvalCheckDocuments,
    addEvalCheckLog,
    updateEvalCheckLog,
    addEvalCheckResource,
    addEvalCheckQuestion,
    addEvalCheckIssue,
    deleteEvalCheckDocument,
    deleteEvalCheckResourcesByDocument,
    deleteEvalCheckQuestionsByDocument,
    deleteEvalCheckIssuesByDocument,
    deleteEvalCheckLogsByDocument,
    getEvalCheckRules,
} from '@/lib/sheets/eval-check';
import { initializeSheets } from '@/lib/sheets/base';
import {
    generateFileHash,
} from '@/lib/drive';
import {
    extractQuestionStructure,
    extractQuestionStructureFromPdf,
    generateImageDescription,
    analyzeQuestion,
    summarizeDocumentOutline,
    checkUserRules,
} from '@/lib/evalcheck-openai';
import { convertPdfToImages, extractPdfText } from '@/lib/pdf-converter-server';
import type { DocumentAnalysisStatus } from '@/types';

/**
 * 시험지 오류 점검 메인 API (하이브리드 모드)
 *
 * - Drive 업로드 없이 스프레드시트만 결과 출력
 * - 선택적 Drive 연동 추가 가능
 *
 * GET: 분석된 문서 목록 조회
 * POST: 시험지 업로드/분석 시작
 */

// 진행 상태 저장 (메모리)
type AnalysisProgressEntry = {
    status: DocumentAnalysisStatus;
    progress: number;
    currentStep: string;
    error?: string;
    updatedAt: number;
};

const analysisProgress = new Map<string, AnalysisProgressEntry>();
const ANALYSIS_PROGRESS_TTL_MS = 30 * 60 * 1000;
const ANALYSIS_PROGRESS_COMPLETED_TTL_MS = 10 * 60 * 1000;

function setAnalysisProgress(
    documentId: string,
    progress: Omit<AnalysisProgressEntry, 'updatedAt'>
) {
    analysisProgress.set(documentId, {
        ...progress,
        updatedAt: Date.now(),
    });
}

function cleanupAnalysisProgress(now = Date.now()) {
    for (const [documentId, progress] of analysisProgress.entries()) {
        const ttl =
            progress.status === 'completed'
                ? ANALYSIS_PROGRESS_COMPLETED_TTL_MS
                : ANALYSIS_PROGRESS_TTL_MS;
        if (now - progress.updatedAt > ttl) {
            analysisProgress.delete(documentId);
        }
    }
}

type StructureExtractionResult = Awaited<ReturnType<typeof extractQuestionStructure>>;

type DocumentContext = {
    summary?: string;
    outline?: string;
};

const DOCUMENT_CONTEXT_LIMITS = {
    maxTotalLength: 10000,
    maxQuestionLength: 280,
    maxPassageLength: 1200,
    maxChoiceLength: 240,
    maxConditionLength: 240,
    maxImageLength: 240,
};

const ANALYSIS_VERSION = 'v2';

type ReviewSections = {
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

type NormalizedIssue = {
    issueId?: string;
    type: string;
    riskLevel: 'low' | 'medium' | 'high';
    summary: string;
    description: string;
    location: string;
    originalText: string;
    suggestedFix: string;
};

function normalizeString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeReviewSections(input: unknown): ReviewSections {
    const source = typeof input === 'object' && input ? input as Record<string, unknown> : {};
    const toArray = <T>(value: unknown, mapper: (item: unknown) => T | null): T[] =>
        Array.isArray(value)
            ? value.map(mapper).filter((item): item is T => item !== null)
            : [];

    const scoringBorderlines = toArray(source.scoringBorderlines, (item) => {
        if (!item || typeof item !== 'object') return null;
        const entry = item as Record<string, unknown>;
        const title = normalizeString(entry.title);
        const sampleAnswer = normalizeString(entry.sampleAnswer);
        const whyDifficult = normalizeString(entry.whyDifficult);
        const scoringGuide = normalizeString(entry.scoringGuide);
        if (!title && !sampleAnswer && !whyDifficult && !scoringGuide) return null;
        return { title, sampleAnswer, whyDifficult, scoringGuide };
    });

    const ambiguityPoints = toArray(source.ambiguityPoints, (item) => {
        if (!item || typeof item !== 'object') return null;
        const entry = item as Record<string, unknown>;
        const location = normalizeString(entry.location);
        const originalPhrase = normalizeString(entry.originalPhrase);
        const reason = normalizeString(entry.reason);
        const confusionExample = normalizeString(entry.confusionExample);
        const rewriteSuggestion = normalizeString(entry.rewriteSuggestion);
        if (!location && !originalPhrase && !reason && !confusionExample && !rewriteSuggestion) return null;
        return { location, originalPhrase, reason, confusionExample, rewriteSuggestion };
    });

    const defectSource = typeof source.defectCheck === 'object' && source.defectCheck
        ? source.defectCheck as Record<string, unknown>
        : {};
    const rawSeverity = normalizeString(defectSource.severity);
    const severity: 'minor' | 'major' | 'critical' =
        rawSeverity === 'major' || rawSeverity === 'critical' ? rawSeverity : 'minor';
    const hasDefect = Boolean(defectSource.hasDefect);
    const findings = toArray(defectSource.findings, (item) => {
        if (!item || typeof item !== 'object') return null;
        const entry = item as Record<string, unknown>;
        const title = normalizeString(entry.title);
        const evidence = normalizeString(entry.evidence);
        const impact = normalizeString(entry.impact);
        const fixSuggestion = normalizeString(entry.fixSuggestion);
        if (!title && !evidence && !impact && !fixSuggestion) return null;
        return { title, evidence, impact, fixSuggestion };
    });

    const curriculumBypassRisks = toArray(source.curriculumBypassRisks, (item) => {
        if (!item || typeof item !== 'object') return null;
        const entry = item as Record<string, unknown>;
        const method = normalizeString(entry.method);
        const whyPossible = normalizeString(entry.whyPossible);
        const impact = normalizeString(entry.impact);
        const mitigation = normalizeString(entry.mitigation);
        if (!method && !whyPossible && !impact && !mitigation) return null;
        return { method, whyPossible, impact, mitigation };
    });

    return {
        scoringBorderlines,
        ambiguityPoints,
        defectCheck: {
            hasDefect,
            severity,
            findings,
        },
        curriculumBypassRisks,
    };
}

function compactReviewSections(
    sections: ReviewSections
): Partial<ReviewSections> {
    const compact: Partial<ReviewSections> = {};
    if (sections.scoringBorderlines.length > 0) compact.scoringBorderlines = sections.scoringBorderlines;
    if (sections.ambiguityPoints.length > 0) compact.ambiguityPoints = sections.ambiguityPoints;
    if (sections.curriculumBypassRisks.length > 0) compact.curriculumBypassRisks = sections.curriculumBypassRisks;
    if (sections.defectCheck.hasDefect && sections.defectCheck.findings.length > 0) {
        compact.defectCheck = sections.defectCheck;
    }
    return compact;
}

function reviewSeverityToRiskLevel(severity: 'minor' | 'major' | 'critical'): 'low' | 'medium' | 'high' {
    if (severity === 'critical') return 'high';
    if (severity === 'major') return 'medium';
    return 'low';
}

function reviewSectionsToIssues(sections: ReviewSections, questionId: string): NormalizedIssue[] {
    const issues: NormalizedIssue[] = [];

    sections.scoringBorderlines.forEach((item, idx) => {
        issues.push({
            issueId: `review_${questionId}_scoring_${idx}`,
            type: 'other',
            riskLevel: 'medium',
            summary: `[부분점수 판단] ${item.title || `사례 ${idx + 1}`}`,
            description: item.whyDifficult,
            location: '',
            originalText: item.sampleAnswer,
            suggestedFix: item.scoringGuide,
        });
    });

    sections.ambiguityPoints.forEach((item, idx) => {
        issues.push({
            issueId: `review_${questionId}_ambiguity_${idx}`,
            type: 'contradiction',
            riskLevel: 'medium',
            summary: `[표현/조건 해석] ${item.reason || `항목 ${idx + 1}`}`,
            description: item.confusionExample,
            location: item.location,
            originalText: item.originalPhrase,
            suggestedFix: item.rewriteSuggestion,
        });
    });

    if (sections.defectCheck.hasDefect) {
        const riskLevel = reviewSeverityToRiskLevel(sections.defectCheck.severity);
        sections.defectCheck.findings.forEach((item, idx) => {
            issues.push({
                issueId: `review_${questionId}_defect_${idx}`,
                type: 'question_defect',
                riskLevel,
                summary: `[출제 오류] ${item.title || `항목 ${idx + 1}`}`,
                description: item.impact,
                location: '',
                originalText: item.evidence,
                suggestedFix: item.fixSuggestion,
            });
        });
    }

    sections.curriculumBypassRisks.forEach((item, idx) => {
        issues.push({
            issueId: `review_${questionId}_bypass_${idx}`,
            type: 'other',
            riskLevel: 'medium',
            summary: `[교과 범위 이탈 가능성] ${item.method || `항목 ${idx + 1}`}`,
            description: item.impact,
            location: '',
            originalText: item.whyPossible,
            suggestedFix: item.mitigation,
        });
    });

    return issues;
}

function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

function normalizeId(value: unknown): string {
    return String(value ?? '').trim();
}

function truncateText(text: string, maxLength: number): string {
    const normalized = normalizeWhitespace(text);
    if (normalized.length <= maxLength) return normalized;
    if (maxLength <= 3) return normalized.slice(0, maxLength);
    return `${normalized.slice(0, maxLength - 3)}...`;
}

function buildDocumentOutline(
    structure: StructureExtractionResult,
    limits: typeof DOCUMENT_CONTEXT_LIMITS = DOCUMENT_CONTEXT_LIMITS
): string {
    const lines: string[] = [];
    let length = 0;
    let truncated = false;

    const pushLine = (line: string) => {
        if (truncated) return;
        if (length + line.length + 1 > limits.maxTotalLength) {
            truncated = true;
            return;
        }
        lines.push(line);
        length += line.length + 1;
    };

    if (structure.sharedResources && structure.sharedResources.length > 0) {
        pushLine('Shared Resources:');
        for (const res of structure.sharedResources) {
            const content = res.content ? truncateText(res.content, limits.maxPassageLength) : '';
            pushLine(`- [${res.resourceId}] ${res.type}: ${res.title || ''} ${content}`);
        }
    }

    if (structure.passageGroups?.length) {
        pushLine('Legacy Passages:');
        for (const group of structure.passageGroups) {
            const passageText = group.passageText
                ? truncateText(group.passageText, limits.maxPassageLength)
                : '';
            const label = group.displayName || 'Passage';
            pushLine(`- ${label}${passageText ? `: ${passageText}` : ''}`);
        }
    }

    pushLine('Questions:');
    for (const [index, question] of (structure.questions || []).entries()) {
        const label = question.displayName || question.questionNumber || `Q${index + 1}`;
        const bodyText = question.bodyText
            ? truncateText(question.bodyText, limits.maxQuestionLength)
            : '';
        const taskType = question.taskType || 'unknown';
        pushLine(`- ${label} [${taskType}]${bodyText ? `: ${bodyText}` : ''}`);

        if (question.resourceRefs && question.resourceRefs.length > 0) {
            pushLine(`  Refs: ${question.resourceRefs.join(', ')}`);
        }

        if (question.choices && question.choices.length > 0) {
            const choicesText = question.choices
                .map(choice => `${choice.label} ${choice.content}`.trim())
                .join(' / ');
            pushLine(`  Choices: ${truncateText(choicesText, limits.maxChoiceLength)}`);
        }

        if (question.conditions && question.conditions.length > 0) {
            const conditionsText = question.conditions.join('; ');
            pushLine(`  Conditions: ${truncateText(conditionsText, limits.maxConditionLength)}`);
        }

        if (question.imageDescription) {
            pushLine(`  Image: ${truncateText(question.imageDescription, limits.maxImageLength)}`);
        }
    }

    if (truncated) {
        lines.push('... (truncated)');
    }

    return lines.join('\n');
}

function formatDocumentSummary(summary: string, keyPoints: string[]): string {
    const parts: string[] = [];
    const trimmed = summary.trim();
    if (trimmed) {
        parts.push(trimmed);
    }
    if (keyPoints.length > 0) {
        parts.push('Key points:');
        keyPoints.forEach(point => parts.push(`- ${normalizeWhitespace(point)}`));
    }
    return parts.join('\n');
}

type ConsistencyReport = {
    pdfTextLength: number;
    visionTextLength: number;
    missingQuestionNumbers: string[];
    missingResourceIds: string[];
    sampleMissingPdfLines: string[];
};

function buildVisionText(structure: StructureExtractionResult): string {
    const blocks: string[] = [];
    if (structure.sharedResources) {
        for (const res of structure.sharedResources) {
            const itemsText = res.items && res.items.length > 0
                ? res.items.map(item => `${item.label ? `${item.label} ` : ''}${item.content}`.trim()).join(' ')
                : '';
            blocks.push([res.title, res.content, itemsText].filter(Boolean).join(' '));
        }
    }
    if (structure.questions) {
        for (const q of structure.questions) {
            const choicesText = q.choices?.map(choice => `${choice.label} ${choice.content}`.trim()).join(' ');
            const conditionsText = q.conditions?.join(' ');
            blocks.push([q.bodyText, choicesText, conditionsText, q.imageDescription].filter(Boolean).join(' '));
        }
    }
    return blocks.join('\n');
}

function buildConsistencyReport(
    structure: StructureExtractionResult,
    pdfText?: string
): ConsistencyReport | null {
    if (!pdfText || !pdfText.trim()) return null;

    const normalizedPdf = normalizeWhitespace(pdfText);
    const visionText = buildVisionText(structure);
    const normalizedVision = normalizeWhitespace(visionText);

    const missingQuestions: string[] = [];
    for (const q of structure.questions || []) {
        const snippet = truncateText(q.bodyText || '', 80);
        if (snippet && !normalizedPdf.includes(normalizeWhitespace(snippet))) {
            missingQuestions.push(q.questionNumber);
        }
    }

    const missingResources: string[] = [];
    for (const res of structure.sharedResources || []) {
        const snippet = truncateText(res.content || '', 80);
        if (snippet && !normalizedPdf.includes(normalizeWhitespace(snippet))) {
            missingResources.push(res.resourceId);
        }
    }

    const missingPdfLines: string[] = [];
    const pdfLines = pdfText.split(/\r?\n/).map(line => normalizeWhitespace(line)).filter(line => line.length > 20);
    for (const line of pdfLines) {
        if (missingPdfLines.length >= 5) break;
        if (!normalizedVision.includes(line)) {
            missingPdfLines.push(truncateText(line, 140));
        }
    }

    return {
        pdfTextLength: normalizedPdf.length,
        visionTextLength: normalizedVision.length,
        missingQuestionNumbers: missingQuestions,
        missingResourceIds: missingResources,
        sampleMissingPdfLines: missingPdfLines,
    };
}

function formatConsistencyReport(report: ConsistencyReport | null): string {
    if (!report) return '';
    const lines: string[] = [
        `PDF chars: ${report.pdfTextLength}, Vision chars: ${report.visionTextLength}`,
    ];
    if (report.missingQuestionNumbers.length > 0) {
        lines.push(`Missing question text match: ${report.missingQuestionNumbers.join(', ')}`);
    }
    if (report.missingResourceIds.length > 0) {
        lines.push(`Missing resource text match: ${report.missingResourceIds.join(', ')}`);
    }
    if (report.sampleMissingPdfLines.length > 0) {
        lines.push('Sample PDF lines not found in vision extract:');
        report.sampleMissingPdfLines.forEach(line => lines.push(`- ${line}`));
    }
    return lines.join('\n');
}

// GET: 문서 목록 조회
/**
 * Retrieves checking documents.
 * 
 * @description
 * If `documentId` query parameter is provided, returns that specific document.
 * Otherwise, returns a list of all documents.
 * 
 * @param {NextRequest} request - The request object containing:
 *   - documentId?: string (Optional, in searchParams)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - document?: Document object (if ID provided)
 *   - documents?: Array of Document objects (if ID not provided)
 *   - count?: number
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (documentId) {
            // 특정 문서 조회
            const documents = await getEvalCheckDocuments();
            const doc = documents.find(d => d.documentId === documentId);

            if (!doc) {
                return NextResponse.json(
                    { success: false, error: '문서를 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                document: doc,
            });
        }

        // 전체 문서 목록
        const documents = await getEvalCheckDocuments();

        return NextResponse.json({
            success: true,
            documents,
            count: documents.length,
        });
    } catch (error) {
        console.error('문서 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '문서 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// 지원되는 이미지 MIME 타입
const SUPPORTED_IMAGE_TYPES = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
];

// 지원되는 모든 파일 타입 (PDF 포함)
const SUPPORTED_FILE_TYPES = [
    ...SUPPORTED_IMAGE_TYPES,
    'application/pdf',
];

async function convertAnalysisFilesToPageImages(
    analysisFiles: File[],
    pdfFallback?: Buffer
): Promise<string[]> {
    const imageFiles = analysisFiles.filter(file => file.type !== 'application/pdf');
    const pdfFiles = analysisFiles.filter(file => file.type === 'application/pdf');
    const pageImages: string[] = [];

    if (imageFiles.length > 0) {
        const imageDataUrls = await Promise.all(
            imageFiles.map(async (analysisFile) => {
                const buffer = await analysisFile.arrayBuffer();
                const base64Content = Buffer.from(buffer).toString('base64');
                return `data:${analysisFile.type};base64,${base64Content}`;
            })
        );
        pageImages.push(...imageDataUrls);
    }

    for (const pdfFile of pdfFiles) {
        const buffer = await pdfFile.arrayBuffer();
        const { pageImages: converted } = await convertPdfToImages(Buffer.from(buffer));
        pageImages.push(...converted);
    }

    if (pageImages.length === 0 && pdfFallback) {
        const { pageImages: converted } = await convertPdfToImages(pdfFallback);
        return converted;
    }

    return pageImages;
}

// POST: 시험지 업로드 및 분석
/**
 * Uploads an exam file and starts the analysis process.
 * 
 * @description
 * Handles PDF/Image file upload, text extraction, and structure analysis initiated in background.
 * Initializes sheets if they don't exist.
 * 
 * @param {NextRequest} request - formData containing:
 *   - file: File (The exam file)
 *   - fileDescription: string (Optional description)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - documentId: string (ID of the created document)
 *   - message: string
 *   - reused: boolean (If true, indicates existing analysis was used)
 */
export async function POST(request: NextRequest) {
    try {
        // 시트 초기화 확인
        await initializeSheets();

        const formData = await request.formData();
        const originalFile = formData.get('file') as File | null;
        const fileDescription = formData.get('fileDescription') as string || '';
        const uploadedEntries = formData.getAll('files');
        const uploadedFiles = uploadedEntries.filter((entry): entry is File => entry instanceof File);
        const analysisFiles = uploadedFiles.length > 0
            ? uploadedFiles
            : (originalFile ? [originalFile] : []);
        const sourceFile = originalFile ?? analysisFiles[0] ?? null;

        if (!sourceFile || analysisFiles.length === 0) {
            return NextResponse.json(
                { success: false, error: '파일이 필요합니다.' },
                { status: 400 }
            );
        }

        if (originalFile && !SUPPORTED_FILE_TYPES.includes(originalFile.type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `지원하지 않는 파일 형식입니다. PDF, PNG, JPG, GIF, WebP 파일을 업로드해 주세요. 업로드된 파일: ${originalFile.type || '알 수 없는 형식'}`
                },
                { status: 400 }
            );
        }

        const invalidAnalysisFile = analysisFiles.find(file => !SUPPORTED_FILE_TYPES.includes(file.type));
        if (invalidAnalysisFile) {
            return NextResponse.json(
                {
                    success: false,
                    error: `지원하지 않는 파일 형식입니다. PDF, PNG, JPG, GIF, WebP 파일을 업로드해 주세요. 업로드된 파일: ${invalidAnalysisFile.type || '알 수 없는 형식'}`
                },
                { status: 400 }
            );
        }

        // 설정 확인 (Drive 연결 필수 아님)

        // 파일 해시 생성
        const hashBuffer = await sourceFile.arrayBuffer();
        const fileHash = await generateFileHash(hashBuffer);
        const pdfBuffer = sourceFile.type === 'application/pdf'
            ? Buffer.from(hashBuffer)
            : undefined;
        const pdfDataUrl = pdfBuffer
            ? `data:application/pdf;base64,${pdfBuffer.toString('base64')}`
            : undefined;

        let pdfText = '';
        if (pdfBuffer) {
            try {
                const pdfTextResult = await extractPdfText(pdfBuffer);
                pdfText = pdfTextResult.text;
            } catch (err) {
                console.warn('PDF 텍스트 추출 실패:', err);
            }
        }

        // 동일 파일 재사용 여부 확인
        const existingDoc = await getEvalCheckDocumentByHash(fileHash);
        if (existingDoc && existingDoc.status === 'completed') {
            return NextResponse.json({
                success: true,
                documentId: existingDoc.documentId,
                reused: true,
                message: '이미 분석한 동일 파일입니다. 기존 결과를 재사용합니다.',
            });
        }

        // 파일 설명 기본값
        const description = fileDescription || sourceFile.name.replace(/\.[^/.]+$/, '');

        // 문서 레코드 생성 (Drive 폴더 ID 선택적 추가)
        const documentId = await addEvalCheckDocument({
            uploadedAt: new Date().toISOString(),
            originalFileName: sourceFile.name,
            fileHash,
            driveFolderId: '', // 하이브리드 모드: Drive 미사용
            driveOriginalFileId: '',
            status: 'pending',
            progress: 0,
            highRiskCount: 0,
            manifestJsonFileId: '',
            memo: description,
            sharedResourcesJson: '[]', // Initial empty
            analysisVersion: ANALYSIS_VERSION,
            resourcesExtracted: 0,
            taskTypeDistributionJson: '{}',
            consistencyReportJson: '{}',
            errorMessage: '',
        });

        // 작업 로그 생성
        const logId = await addEvalCheckLog({
            documentId,
            taskType: 'analyze',
            status: 'running',
            progress: 0,
            startedAt: new Date().toISOString(),
            completedAt: '',
            checkpoints: '{}',
            memo: '하이브리드 모드 (스프레드시트 전용)',
        });

        // 진행 상태 초기화
        setAnalysisProgress(documentId, {
            status: 'extracting',
            progress: 0,
            currentStep: '분석 준비 중..',
        });

        // 비동기 분석 시작 (백그라운드)
        const pageImages = await convertAnalysisFilesToPageImages(analysisFiles, pdfBuffer);

        startAnalysis(documentId, pageImages, logId, {
            pdfText,
            pdfDataUrl,
            pdfFileName: sourceFile.name,
        }).catch(err => {
            console.error('분석 오류:', err);
            setAnalysisProgress(documentId, {
                status: 'error',
                progress: 0,
                currentStep: '분석 중 오류 발생',
                error: err instanceof Error ? err.message : '알 수 없는 오류',
            });
        });

        return NextResponse.json({
            success: true,
            documentId,
            message: '분석이 시작되었습니다. 진행 상황은 /api/eval-check/progress에서 확인하세요.',
        });
    } catch (error) {
        console.error('업로드 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '업로드 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

/**
 * Deletes a document and its related data.
 * 
 * @description
 * Removes document, questions, issues, logs, and resources from storage.
 * 
 * @param {NextRequest} request - The request object containing:
 *   - documentId: string (In searchParams, required)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 */
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
            return NextResponse.json(
                { success: false, error: '문서 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        const document = await getEvalCheckDocumentById(documentId);
        if (!document) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        await Promise.all([
            deleteEvalCheckIssuesByDocument(documentId),
            deleteEvalCheckResourcesByDocument(documentId),
            deleteEvalCheckQuestionsByDocument(documentId),
            deleteEvalCheckLogsByDocument(documentId),
        ]);
        await deleteEvalCheckDocument(documentId);
        analysisProgress.delete(documentId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('문서 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '문서 삭제 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// 비동기 분석 함수 (하이브리드 모드: 스프레드시트 전용)
async function startAnalysis(
    documentId: string,
    pageImages: string[],
    logId: string,
    options?: {
        pdfText?: string;
        pdfDataUrl?: string;
        pdfFileName?: string;
    }
) {
    const checkpoints: Record<string, string> = {};
    const normalizeIssueRiskLevel = (value: unknown): 'low' | 'medium' | 'high' => {
        if (value === 'high' || value === 'medium' || value === 'low') return value;
        return 'low';
    };
    const buildRuleCheckInput = (
        question: StructureExtractionResult['questions'][number],
        passageText?: string
    ) => {
        const lines: string[] = [
            `[문항 ${question.questionNumber}]`,
            question.bodyText || '',
        ];

        if (question.choices && question.choices.length > 0) {
            lines.push('[선택지]');
            lines.push(question.choices.map(choice => `${choice.label}) ${choice.content}`).join('\n'));
        }

        if (question.conditions && question.conditions.length > 0) {
            lines.push('[조건]');
            lines.push(question.conditions.join('\n'));
        }

        if (passageText) {
            lines.push('[지문]');
            lines.push(passageText);
        }

        return lines.filter(Boolean).join('\n');
    };

    try {
        // ========== 25%: 텍스트 추출 + 문항 분할 ==========
        setAnalysisProgress(documentId, {
            status: 'extracting',
            progress: 10,
            currentStep: options?.pdfDataUrl ? 'PDF 인식 준비 중..' : '이미지 처리 중..',
        });
        await updateEvalCheckDocument(documentId, { status: 'extracting', progress: 10 });

        setAnalysisProgress(documentId, {
            status: 'extracting',
            progress: 15,
            currentStep: '문항 구조 추출 중..',
        });
        await updateEvalCheckDocument(documentId, { status: 'extracting', progress: 15 });

        // 문항 구조 추출
        const pdfText = options?.pdfText;
        const pdfDataUrl = options?.pdfDataUrl;
        const pdfFileName = options?.pdfFileName;
        const structure = pdfDataUrl
            ? await extractQuestionStructureFromPdf(pdfDataUrl, pdfFileName)
            : await extractQuestionStructure(pageImages, pdfText);
        const documentOutline = buildDocumentOutline(structure);
        const consistencyReport = buildConsistencyReport(structure, pdfText);
        const documentContext: DocumentContext = {
            outline: documentOutline,
        };

        try {
            const summaryResult = await summarizeDocumentOutline(documentOutline);
            const summaryText = formatDocumentSummary(
                summaryResult.summary,
                summaryResult.keyPoints
            );
            if (summaryText) {
                documentContext.summary = summaryText;
            }
        } catch (err) {
            console.warn('Document summary failed:', err);
        }

        const consistencyReportText = formatConsistencyReport(consistencyReport);
        const resourcesExtracted = structure.sharedResources?.length ?? 0;
        const taskTypeDistribution = (structure.questions || []).reduce<Record<string, number>>((acc, question) => {
            const key = question.taskType || 'unknown';
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        await deleteEvalCheckResourcesByDocument(documentId);
        for (const res of structure.sharedResources || []) {
            await addEvalCheckResource({
                documentId,
                resourceId: res.resourceId,
                type: res.type,
                title: res.title || '',
                content: res.content || '',
                itemsJson: JSON.stringify(res.items || []),
                pageRange: '',
                rawJson: JSON.stringify(res),
            });
        }

        checkpoints['25'] = new Date().toISOString();
        await updateEvalCheckLog(logId, { checkpoints: JSON.stringify(checkpoints), progress: 25 });
        await updateEvalCheckDocument(documentId, {
            progress: 25,
            status: 'structuring',
            sharedResourcesJson: JSON.stringify(structure.sharedResources || []),
            analysisVersion: ANALYSIS_VERSION,
            resourcesExtracted,
            taskTypeDistributionJson: JSON.stringify(taskTypeDistribution),
            consistencyReportJson: JSON.stringify(consistencyReport || {}),
        });

        setAnalysisProgress(documentId, {
            status: 'structuring',
            progress: 25,
            currentStep: `${structure.questions.length}개 문항 구조화 완료`,
        });

        // ========== 50%: 그림 설명 생성 ==========
        const canDescribeImages = pageImages.length > 0;
        setAnalysisProgress(documentId, {
            status: 'structuring',
            progress: 30,
            currentStep: canDescribeImages ? '그림/표 설명 생성 중..' : 'PDF 이미지 설명 포함 처리 중..',
        });
        await updateEvalCheckDocument(documentId, { status: 'structuring', progress: 30 });

        if (canDescribeImages) {
            const getPageImage = (pageRange?: string) => {
                if (!pageRange) return pageImages[0];
                const matches = pageRange.match(/\d+/g);
                if (!matches || matches.length === 0) return pageImages[0];
                const pageNumbers = matches.map(value => Number(value)).filter(num => !Number.isNaN(num));
                if (pageNumbers.length === 0) return pageImages[0];
                const pageIndex = Math.max(0, Math.min(...pageNumbers) - 1);
                return pageImages[pageIndex] ?? pageImages[0];
            };

            const questionsWithImages = structure.questions.filter(q => q.hasImage);
            for (let i = 0; i < questionsWithImages.length; i++) {
                const q = questionsWithImages[i];
                if (q.imageDescription) continue;

                try {
                    const imgDesc = await generateImageDescription(
                        getPageImage(q.pageRange),
                        q.bodyText.substring(0, 100)
                    );
                    q.imageDescription = imgDesc.description;
                } catch (err) {
                    console.warn(`그림 설명 생성 실패 (문항 ${q.questionNumber}):`, err);
                }

                const structuringProgress =
                    30 + Math.floor(((i + 1) / questionsWithImages.length) * 15);
                setAnalysisProgress(documentId, {
                    status: 'structuring',
                    progress: structuringProgress,
                    currentStep: `그림 설명 생성 중 (${i + 1}/${questionsWithImages.length})...`,
                });
                await updateEvalCheckDocument(documentId, {
                    status: 'structuring',
                    progress: structuringProgress,
                });
            }
        }

        checkpoints['50'] = new Date().toISOString();
        await updateEvalCheckLog(logId, { checkpoints: JSON.stringify(checkpoints), progress: 50 });
        await updateEvalCheckDocument(documentId, { progress: 50, status: 'analyzing' });

        setAnalysisProgress(documentId, {
            status: 'analyzing',
            progress: 50,
            currentStep: '문항 분석 시작...',
        });

        // ========== 75%: 정답/해설 및 문제점 생성 + 스프레드시트 저장 ==========
        let highRiskCount = 0;
        const activeRules = (await getEvalCheckRules())
            .filter(rule => rule.enabled)
            .map(rule => ({
                ruleId: rule.ruleId,
                name: rule.name,
                condition: rule.condition,
                correctionGuide: rule.correctionGuide,
            }));

        for (let i = 0; i < structure.questions.length; i++) {
            const q = structure.questions[i];
            const questionIdBase = (normalizeId(q.questionNumber) || 'question').replace(/\s+/g, '_');
            const questionId = `${questionIdBase}-${i + 1}`;
            const displayName = q.displayName || questionId;

            const passageGroup = structure.passageGroups.find(pg =>
                pg.questionNumbers.includes(q.questionNumber)
            );

            const analysis = await analyzeQuestion({
                questionNumber: q.questionNumber,
                bodyText: q.bodyText,
                taskType: q.taskType,
                resourceRefs: q.resourceRefs,
                choices: q.choices,
                conditions: q.conditions,
                imageDescription: q.imageDescription,
                passageText: passageGroup?.passageText,
                sharedResources: structure.sharedResources,
                documentContext: (documentContext.summary || documentContext.outline)
                    ? documentContext
                    : undefined,
                consistencyReport: consistencyReportText || undefined,
                pdfDataUrl,
                pdfFileName,
                usePdfContext: !!pdfDataUrl,
            });

            const analysisIssues = Array.isArray(analysis.issues)
                ? analysis.issues.map((issue) => ({
                    issueId: issue?.issueId || '',
                    type: issue?.type || 'other',
                    riskLevel: normalizeIssueRiskLevel(issue?.riskLevel),
                    summary: issue?.summary || '',
                    description: issue?.description || '',
                    location: issue?.location || '',
                    originalText: issue?.originalText || '',
                    suggestedFix: issue?.suggestedFix || '',
                }))
                : [];
            const normalizedReviewSections = normalizeReviewSections(analysis.reviewSections);
            const compactedReviewSections = compactReviewSections(normalizedReviewSections);
            const reviewIssues = reviewSectionsToIssues(normalizedReviewSections, questionId);

            let ruleViolations: Array<{
                ruleId: string;
                ruleName: string;
                violatedText: string;
                suggestion: string;
            }> = [];
            if (activeRules.length > 0) {
                try {
                    const ruleCheckResult = await checkUserRules(
                        buildRuleCheckInput(q, passageGroup?.passageText),
                        activeRules
                    );
                    ruleViolations = Array.isArray(ruleCheckResult.violations)
                        ? ruleCheckResult.violations
                        : [];
                } catch (err) {
                    console.warn(`규칙 검사 실패 (문항 ${q.questionNumber}):`, err);
                }
            }

            const ruleIssues = ruleViolations.map((violation, violationIndex) => ({
                issueId: `rule_${questionId}_${violation.ruleId}_${Date.now()}_${violationIndex}`,
                type: 'format',
                riskLevel: 'medium' as const,
                summary: `[규칙] ${violation.ruleName}`,
                description: violation.violatedText || '',
                location: '',
                originalText: violation.violatedText || '',
                suggestedFix: violation.suggestion || '',
            }));

            const combinedIssues = [...analysisIssues, ...reviewIssues, ...ruleIssues];
            const highRiskTypes = ['question_defect', 'condition_mismatch'];
            const highRiskIssues = combinedIssues.filter((issue) =>
                issue.riskLevel === 'high' || highRiskTypes.includes(issue.type)
            );
            const isHighRisk = highRiskIssues.length > 0;
            if (isHighRisk) highRiskCount++;

            const analysisJsonObj = {
                ...analysis,
                reviewSections: compactedReviewSections,
                issues: combinedIssues,
                ruleViolations,
            };

            await addEvalCheckQuestion({
                documentId,
                questionId,
                displayName,
                pageRange: q.pageRange || '',
                passageGroupId: passageGroup?.displayName || '',
                hasImage: q.hasImage,
                isHighRisk,
                highRiskReason: isHighRisk ? highRiskIssues[0]?.summary || '' : '',
                answerSummary: (analysis.answerSummary || analysis.answer || '').substring(0, 500),
                reasoningSummary: (analysis.reasoningSummary || analysis.reasoning || '').substring(0, 500),
                detailJsonFileId: '',
                imageDescriptionAI: q.imageDescription || '',
                imageDescriptionTeacher: '',
                imageDescriptionFinal: q.imageDescription || '',
                suggestionMinimal: analysis.suggestion?.minimal || '',
                suggestionImproved: analysis.suggestion?.improved || '',
                taskType: q.taskType || '',
                answerType: analysis.answerType || '',
                resourceRefsJson: JSON.stringify(q.resourceRefs || []),
                analysisJson: JSON.stringify(analysisJsonObj),
            });

            for (const [issueIndex, issue] of combinedIssues.entries()) {
                await addEvalCheckIssue({
                    documentId,
                    questionId,
                    issueId:
                        issue.issueId ||
                        `${questionId}_${issue.type}_${Date.now()}_${issueIndex}`,
                    issueType: issue.type,
                    issueSummary: issue.summary,
                    suggestionSummary: issue.description || '',
                    detailJsonFileId: '',
                    issueLocation: issue.location || '',
                    riskLevel: normalizeIssueRiskLevel(issue.riskLevel),
                    originalText: issue.originalText || '',
                    suggestedFix: issue.suggestedFix || '',
                });
            }

            const analysisProgressValue =
                50 + Math.floor(((i + 1) / structure.questions.length) * 40);
            setAnalysisProgress(documentId, {
                status: 'analyzing',
                progress: analysisProgressValue,
                currentStep: `문항 분석 중 (${i + 1}/${structure.questions.length})...`,
            });
            await updateEvalCheckDocument(documentId, {
                status: 'analyzing',
                progress: analysisProgressValue,
            });
        }

        checkpoints['75'] = new Date().toISOString();
        await updateEvalCheckLog(logId, { checkpoints: JSON.stringify(checkpoints), progress: 75 });
        await updateEvalCheckDocument(documentId, { progress: 75, status: 'analyzing' });

        // ========== 100%: 완료 ==========
        checkpoints['100'] = new Date().toISOString();
        await updateEvalCheckLog(logId, {
            checkpoints: JSON.stringify(checkpoints),
            progress: 100,
            status: 'completed',
            completedAt: new Date().toISOString(),
        });

        await updateEvalCheckDocument(documentId, {
            progress: 100,
            status: 'completed',
            highRiskCount,
            manifestJsonFileId: '',
            errorMessage: '',
        });

        setAnalysisProgress(documentId, {
            status: 'completed',
            progress: 100,
            currentStep: `분석 완료 (총 ${structure.questions.length}문항, 고위험 ${highRiskCount}문항)`,
        });
    } catch (error) {
        console.error('분석 중 오류:', error);
        const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';

        await updateEvalCheckLog(logId, {
            status: 'error',
            memo: errorMessage,
        });

        await updateEvalCheckDocument(documentId, {
            status: 'error',
            errorMessage,
        });

        setAnalysisProgress(documentId, {
            status: 'error',
            progress: 0,
            currentStep: '분석 실패',
            error: errorMessage,
        });
    }
}

// 진행 상태 조회 (progress API에서 사용)
export function getAnalysisProgress(documentId: string) {
    cleanupAnalysisProgress();
    const progress = analysisProgress.get(documentId);
    if (!progress) return undefined;

    return {
        status: progress.status,
        progress: progress.progress,
        currentStep: progress.currentStep,
        error: progress.error,
    };
}
