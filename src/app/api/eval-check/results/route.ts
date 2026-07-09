import { NextRequest, NextResponse } from 'next/server';
import {
    getEvalCheckDocumentById,
    getEvalCheckIssues,
    getEvalCheckQuestions,
    getEvalCheckResources,
} from '@/lib/sheets/eval-check';
import type { IssueType } from '@/types';

const ISSUE_TYPE_SET = new Set<IssueType>([
    'grammatical_error',
    'question_defect',
    'contradiction',
    'condition_mismatch',
    'unrealistic_condition',
    'format',
    'other',
]);
const RISK_LEVEL_SET = new Set(['low', 'medium', 'high']);
const CURRICULUM_BYPASS_REGEX =
    /(로피탈|선행\s*공식|선행\s*개념|교육과정\s*외|outside\s*curriculum|beyond\s*curriculum|shortcut)/i;

const normalizeId = (value: unknown) => String(value ?? '').trim();
const normalizeString = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

type RiskLevel = 'low' | 'medium' | 'high';

type IssueEntry = {
    issueId: string;
    type: IssueType;
    riskLevel: RiskLevel;
    summary: string;
    description?: string;
    location?: string;
    originalText?: string;
    suggestedFix?: string;
};

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

function normalizeRiskLevel(value?: string): RiskLevel {
    if (value && RISK_LEVEL_SET.has(value)) return value as RiskLevel;
    return 'low';
}


function emptyReviewSections(): ReviewSections {
    return {
        scoringBorderlines: [],
        ambiguityPoints: [],
        defectCheck: {
            hasDefect: false,
            severity: 'minor',
            findings: [],
        },
        curriculumBypassRisks: [],
    };
}

function normalizeReviewSections(input: unknown): ReviewSections {
    const source = typeof input === 'object' && input ? input as Record<string, unknown> : {};
    const result = emptyReviewSections();

    if (Array.isArray(source.scoringBorderlines)) {
        result.scoringBorderlines = source.scoringBorderlines
            .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const row = item as Record<string, unknown>;
                const title = normalizeString(row.title);
                const sampleAnswer = normalizeString(row.sampleAnswer);
                const whyDifficult = normalizeString(row.whyDifficult);
                const scoringGuide = normalizeString(row.scoringGuide);
                if (!title && !sampleAnswer && !whyDifficult && !scoringGuide) return null;
                return { title, sampleAnswer, whyDifficult, scoringGuide };
            })
            .filter((item): item is ReviewSections['scoringBorderlines'][number] => item !== null);
    }

    if (Array.isArray(source.ambiguityPoints)) {
        result.ambiguityPoints = source.ambiguityPoints
            .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const row = item as Record<string, unknown>;
                const location = normalizeString(row.location);
                const originalPhrase = normalizeString(row.originalPhrase);
                const reason = normalizeString(row.reason);
                const confusionExample = normalizeString(row.confusionExample);
                const rewriteSuggestion = normalizeString(row.rewriteSuggestion);
                if (!location && !originalPhrase && !reason && !confusionExample && !rewriteSuggestion) return null;
                return { location, originalPhrase, reason, confusionExample, rewriteSuggestion };
            })
            .filter((item): item is ReviewSections['ambiguityPoints'][number] => item !== null);
    }

    const defectSource = typeof source.defectCheck === 'object' && source.defectCheck
        ? source.defectCheck as Record<string, unknown>
        : {};
    const rawSeverity = normalizeString(defectSource.severity);
    result.defectCheck.severity =
        rawSeverity === 'major' || rawSeverity === 'critical' ? rawSeverity : 'minor';
    result.defectCheck.hasDefect = Boolean(defectSource.hasDefect);
    if (Array.isArray(defectSource.findings)) {
        result.defectCheck.findings = defectSource.findings
            .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const row = item as Record<string, unknown>;
                const title = normalizeString(row.title);
                const evidence = normalizeString(row.evidence);
                const impact = normalizeString(row.impact);
                const fixSuggestion = normalizeString(row.fixSuggestion);
                if (!title && !evidence && !impact && !fixSuggestion) return null;
                return { title, evidence, impact, fixSuggestion };
            })
            .filter((item): item is ReviewSections['defectCheck']['findings'][number] => item !== null);
    }
    if (!result.defectCheck.hasDefect) {
        result.defectCheck.findings = [];
    }

    if (Array.isArray(source.curriculumBypassRisks)) {
        result.curriculumBypassRisks = source.curriculumBypassRisks
            .map((item) => {
                if (!item || typeof item !== 'object') return null;
                const row = item as Record<string, unknown>;
                const method = normalizeString(row.method);
                const whyPossible = normalizeString(row.whyPossible);
                const impact = normalizeString(row.impact);
                const mitigation = normalizeString(row.mitigation);
                if (!method && !whyPossible && !impact && !mitigation) return null;
                return { method, whyPossible, impact, mitigation };
            })
            .filter((item): item is ReviewSections['curriculumBypassRisks'][number] => item !== null);
    }

    return result;
}

function mergeReviewSections(base: ReviewSections, legacy: ReviewSections): ReviewSections {
    const merged = emptyReviewSections();
    merged.scoringBorderlines = [...base.scoringBorderlines, ...legacy.scoringBorderlines];
    merged.ambiguityPoints = [...base.ambiguityPoints, ...legacy.ambiguityPoints];
    merged.curriculumBypassRisks = [...base.curriculumBypassRisks, ...legacy.curriculumBypassRisks];
    merged.defectCheck = base.defectCheck.hasDefect
        ? base.defectCheck
        : legacy.defectCheck;
    return merged;
}

function detectLegacySeverity(issues: IssueEntry[]): 'minor' | 'major' | 'critical' {
    if (issues.some((issue) => issue.riskLevel === 'high')) return 'critical';
    if (issues.some((issue) => issue.riskLevel === 'medium')) return 'major';
    return 'minor';
}

function mapLegacyToReviewSections(parsedAnalysis: Record<string, unknown>, issues: IssueEntry[]): ReviewSections {
    const mapped = emptyReviewSections();

    const legacySimulations = Array.isArray(parsedAnalysis.studentResponseSimulation)
        ? parsedAnalysis.studentResponseSimulation
        : [];
    mapped.scoringBorderlines = legacySimulations
        .map((entry, index) => {
            if (!entry || typeof entry !== 'object') return null;
            const row = entry as Record<string, unknown>;
            const title = normalizeString(row.scenario) || `부분점수 경계 사례 ${index + 1}`;
            const sampleAnswer = normalizeString(row.potentialResponse);
            const whyDifficult = normalizeString(row.scoringDifficulty);
            const scoringGuide = normalizeString(row.scoringGuideline);
            if (!sampleAnswer && !whyDifficult && !scoringGuide) return null;
            return { title, sampleAnswer, whyDifficult, scoringGuide };
        })
        .filter((item): item is ReviewSections['scoringBorderlines'][number] => item !== null);

    mapped.ambiguityPoints = issues
        .filter((issue) => issue.type !== 'question_defect')
        .map((issue) => {
            const originalPhrase = normalizeString(issue.originalText);
            const reason = normalizeString(issue.summary);
            const confusionExample = normalizeString(issue.description);
            const rewriteSuggestion = normalizeString(issue.suggestedFix);
            if (!originalPhrase && !reason && !confusionExample && !rewriteSuggestion) return null;
            return {
                location: normalizeString(issue.location),
                originalPhrase,
                reason,
                confusionExample,
                rewriteSuggestion,
            };
        })
        .filter((item): item is ReviewSections['ambiguityPoints'][number] => item !== null);

    const defectIssues = issues.filter((issue) => issue.type === 'question_defect');
    if (defectIssues.length > 0) {
        mapped.defectCheck.hasDefect = true;
        mapped.defectCheck.severity = detectLegacySeverity(defectIssues);
        mapped.defectCheck.findings = defectIssues.map((issue, index) => ({
            title: normalizeString(issue.summary) || `출제 오류 ${index + 1}`,
            evidence: normalizeString(issue.originalText) || normalizeString(issue.description),
            impact: normalizeString(issue.description),
            fixSuggestion: normalizeString(issue.suggestedFix),
        }));
    }

    const bypassCandidates = [
        ...legacySimulations.map((entry) => {
            if (!entry || typeof entry !== 'object') return '';
            const row = entry as Record<string, unknown>;
            return [
                normalizeString(row.scenario),
                normalizeString(row.potentialResponse),
                normalizeString(row.scoringDifficulty),
                normalizeString(row.scoringGuideline),
            ].join(' ');
        }),
        ...issues.map((issue) => [
            normalizeString(issue.summary),
            normalizeString(issue.description),
            normalizeString(issue.originalText),
            normalizeString(issue.suggestedFix),
        ].join(' ')),
    ];

    mapped.curriculumBypassRisks = bypassCandidates
        .filter((text) => CURRICULUM_BYPASS_REGEX.test(text))
        .map((text, index) => ({
            method: `우회 풀이 가능성 ${index + 1}`,
            whyPossible: text,
            impact: '출제 의도와 다른 풀이가 정답으로 인정될 수 있어 채점 일관성이 흔들릴 수 있습니다.',
            mitigation: '문항 조건에 교과 범위와 허용 풀이 기준을 명시해 주세요.',
        }));

    return mapped;
}

function hasReviewProblems(reviewSections: ReviewSections): boolean {
    return (
        reviewSections.scoringBorderlines.length > 0 ||
        reviewSections.ambiguityPoints.length > 0 ||
        (reviewSections.defectCheck.hasDefect && reviewSections.defectCheck.findings.length > 0) ||
        reviewSections.curriculumBypassRisks.length > 0
    );
}

/**
 * Retrieves checking results for a specific document.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId')?.trim();

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

        const questions = await getEvalCheckQuestions(documentId);
        const issues = await getEvalCheckIssues(documentId);
        const resourceRows = await getEvalCheckResources(documentId);

        console.log(
            `[EvalCheck Results] documentId=${documentId} questions=${questions.length} issues=${issues.length}`
        );

        const issuesByQuestion = new Map<string, IssueEntry[]>();
        const ruleViolationsByQuestion = new Map<string, Array<{
            issueId: string;
            summary: string;
            description?: string;
            location?: string;
            suggestedFix?: string;
        }>>();

        for (const issue of issues) {
            const rawType = issue.issueType as IssueType;
            const issueType = ISSUE_TYPE_SET.has(rawType) ? rawType : 'format';
            const questionKey = normalizeId(issue.questionId);
            const entry: IssueEntry = {
                issueId: issue.issueId,
                type: issueType,
                riskLevel: normalizeRiskLevel(issue.riskLevel),
                summary: issue.issueSummary,
                description: issue.suggestionSummary,
                location: issue.issueLocation || '',
                originalText: issue.originalText || '',
                suggestedFix: issue.suggestedFix || '',
            };
            const isRuleViolation = issue.issueId.startsWith('rule_');

            if (isRuleViolation) {
                if (!ruleViolationsByQuestion.has(questionKey)) {
                    ruleViolationsByQuestion.set(questionKey, []);
                }
                ruleViolationsByQuestion.get(questionKey)?.push({
                    issueId: entry.issueId,
                    summary: entry.summary,
                    description: entry.description,
                    location: entry.location,
                    suggestedFix: entry.suggestedFix,
                });
            }

            if (!issuesByQuestion.has(questionKey)) {
                issuesByQuestion.set(questionKey, []);
            }
            issuesByQuestion.get(questionKey)?.push(entry);
        }

        let omittedCleanQuestionCount = 0;
        const results = questions.flatMap((question, index) => {
            let parsedAnalysis: Record<string, unknown> = {};
            try {
                parsedAnalysis = JSON.parse(question.analysisJson || '{}');
            } catch {
                parsedAnalysis = {};
            }

            let parsedResourceRefs = [];
            try {
                parsedResourceRefs = JSON.parse(question.resourceRefsJson || '[]');
            } catch {
                parsedResourceRefs = [];
            }

            const questionId = normalizeId(question.questionId) || `question-${index + 1}`;
            const questionIssues = issuesByQuestion.get(questionId) ?? [];
            const reviewSectionsFromAnalysis = normalizeReviewSections(parsedAnalysis.reviewSections);
            const legacyMappedSections = mapLegacyToReviewSections(parsedAnalysis, questionIssues);
            const reviewSections = mergeReviewSections(reviewSectionsFromAnalysis, legacyMappedSections);
            const hasProblems = hasReviewProblems(reviewSections);

            if (!hasProblems) {
                omittedCleanQuestionCount += 1;
                return [];
            }

            return [{
                questionId,
                displayName: question.displayName || questionId || `문항 ${index + 1}`,
                isHighRisk: question.isHighRisk,
                highRiskReason: question.highRiskReason,
                answerSummary: question.answerSummary,
                reasoningSummary: question.reasoningSummary,
                suggestion: question.suggestionMinimal || question.suggestionImproved
                    ? {
                        minimal: question.suggestionMinimal || '',
                        improved: question.suggestionImproved || '',
                    }
                    : undefined,
                issues: questionIssues,
                ruleViolations: ruleViolationsByQuestion.get(questionId) ?? [],
                taskType: question.taskType,
                answerType: question.answerType,
                resourceRefs: parsedResourceRefs,
                analysis: parsedAnalysis,
                reviewSections,
            }];
        });

        let sharedResources: Array<Record<string, unknown>> = [];
        if (resourceRows.length > 0) {
            sharedResources = resourceRows.map((row) => {
                if (row.rawJson) {
                    try {
                        return JSON.parse(row.rawJson);
                    } catch {
                        // fall through to fallback object
                    }
                }
                let items: unknown = [];
                try {
                    items = JSON.parse(row.itemsJson || '[]');
                } catch {
                    items = [];
                }
                return {
                    resourceId: row.resourceId,
                    type: row.type,
                    title: row.title,
                    content: row.content,
                    items,
                };
            });
        } else if (document.sharedResourcesJson) {
            try {
                sharedResources = JSON.parse(document.sharedResourcesJson);
            } catch {
                sharedResources = [];
            }
        }

        let consistencyReport: Record<string, unknown> = {};
        if (document.consistencyReportJson) {
            try {
                consistencyReport = JSON.parse(document.consistencyReportJson);
            } catch {
                consistencyReport = {};
            }
        }

        return NextResponse.json({
            success: true,
            documentId,
            questions: results,
            sharedResources,
            consistencyReport,
            summary: {
                omittedCleanQuestionCount,
            },
        });
    } catch (error) {
        console.error('문항 결과 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '문항 결과 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
