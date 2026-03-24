export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import { buildCitations, searchKnowledgeBase } from '@/lib/knowledge-base';
import { rerankMatchesWithAI } from '@/lib/knowledge-rerank';
import type { RecordReviewIssue, RecordReviewResponse, RetrievedKnowledgeEvidence } from '@/types/knowledge';

const DEFAULT_MODEL = 'gpt-5-mini';
const DEFAULT_SCHOOL_LEVEL = '고등학교';
const DEFAULT_CATEGORY = '기타사항';
const DEFAULT_YEAR = 2026;
const MATCH_LIMIT = 6;

const ALLOWED_ISSUE_TYPES = new Set<RecordReviewIssue['issueType']>([
    'prohibited_named_entity',
    'certificate_fact_out_of_scope',
    'award_scope_violation',
    'attendance_note_rule_risk',
    'subject_detail_style_risk',
    'objectivity_risk',
    'unsupported_claim_risk',
    'year_mismatch_risk',
    'needs_manual_review',
]);

type ReviewRequestBody = {
    recordText?: string;
    schoolLevel?: string;
    category?: string;
    year?: number;
    includeImprovedDraft?: boolean;
    subjectName?: string;
};

function getClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function normalizeIssue(raw: unknown): RecordReviewIssue | null {
    if (!raw || typeof raw !== 'object') return null;

    const issue = raw as Record<string, unknown>;
    const severity = issue.severity === 'high' || issue.severity === 'medium' ? issue.severity : 'low';
    const issueType = ALLOWED_ISSUE_TYPES.has(issue.issueType as RecordReviewIssue['issueType'])
        ? issue.issueType as RecordReviewIssue['issueType']
        : 'needs_manual_review';
    const message = typeof issue.message === 'string' ? issue.message.trim() : '';
    if (!message) return null;

    return {
        severity,
        issueType,
        message,
        evidence: Array.isArray(issue.evidence)
            ? issue.evidence.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            : [],
        rewriteGuidance: typeof issue.rewriteGuidance === 'string' ? issue.rewriteGuidance.trim() : null,
    };
}

function buildEvidenceText(matches: RetrievedKnowledgeEvidence[]): string {
    return matches
        .map((match, index) => [
            `[근거 ${index + 1}]`,
            `제목: ${match.title}`,
            `학교급: ${match.schoolLevels.join(', ')}`,
            `구분: ${match.categories.join(', ') || '-'}`,
            `기준 연도: ${match.effectiveYear ?? '미상'}`,
            `요약: ${match.ruleSummary || match.snippet}`,
        ].join('\n'))
        .join('\n\n');
}

function sanitizeImprovedDraft(text: string): string {
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function buildFallbackImprovedDraft(recordText: string): string {
    const softened = recordText
        .replace(/(최고|최상|천재|완벽|1등)/gu, '')
        .replace(/\s{2,}/gu, ' ')
        .trim();

    return softened || recordText;
}

function buildNoEvidenceReview(
    recordText: string,
    schoolLevel: string,
    category: string,
    year: number,
    includeImprovedDraft: boolean,
): RecordReviewResponse {
    return {
        success: true,
        schoolLevel,
        category,
        year,
        status: 'needs_manual_review',
        riskLevel: 'medium',
        issues: [
            {
                severity: 'medium',
                issueType: 'needs_manual_review',
                message: '직접 연결되는 공개 근거를 찾지 못해 자동 판정보다 수동 확인이 우선입니다.',
                evidence: [],
                rewriteGuidance: '학교급, 영역, 핵심 표현을 더 구체적으로 넣어 다시 점검하거나 공개 근거를 추가 확인하세요.',
            },
        ],
        citations: [],
        recommendedRewrite: null,
        summary: '공개 근거가 부족해 보수적으로 수동 검토가 필요하다고 판단했습니다.',
        improvedDraft: includeImprovedDraft ? recordText : undefined,
        matches: [],
        fallback: true,
        model: null,
    };
}

function buildFallbackReview(
    recordText: string,
    schoolLevel: string,
    category: string,
    year: number,
    citations: RecordReviewResponse['citations'],
    matches: RecordReviewResponse['matches'],
    includeImprovedDraft: boolean,
): RecordReviewResponse {
    const issues: RecordReviewIssue[] = [];

    if (/(최고|최상|천재|완벽|1등)/u.test(recordText)) {
        issues.push({
            severity: 'medium',
            issueType: 'objectivity_risk',
            message: '과도하게 단정적이거나 서열형으로 해석될 수 있는 표현이 포함됐을 가능성이 있습니다.',
            evidence: ['객관적 관찰 사실과 학습 과정 중심 표현으로 바꾸는 것이 안전합니다.'],
            rewriteGuidance: '평가형 수식어 대신 실제 수행 과정과 행동 근거를 서술하세요.',
        });
    }

    if (/(자격증|자격 취득|한국사|컴퓨터활용능력|토익|토플)/u.test(recordText)) {
        issues.push({
            severity: 'medium',
            issueType: 'certificate_fact_out_of_scope',
            message: '자격증 또는 외부 인증 관련 사실이 교과 세특 취지와 맞지 않을 수 있습니다.',
            evidence: ['자격 취득 사실은 기재 가능 영역과 근거를 다시 확인해야 합니다.'],
            rewriteGuidance: '자격 취득 사실 대신 수업 안에서 확인 가능한 학습 활동과 성취를 중심으로 재작성하세요.',
        });
    }

    if (/(대학교|대학명|기관명|회사명|기업명)/u.test(recordText)) {
        issues.push({
            severity: 'high',
            issueType: 'prohibited_named_entity',
            message: '특정 기관명 또는 고유명사가 직접 노출됐을 가능성이 있습니다.',
            evidence: ['외부 기관명은 일반화된 표현으로 바꾸는 편이 안전합니다.'],
            rewriteGuidance: '기관명을 직접 쓰기보다 활동 맥락과 역할을 일반화해 표현하세요.',
        });
    }

    const riskLevel = issues.some((issue) => issue.severity === 'high')
        ? 'high'
        : issues.some((issue) => issue.severity === 'medium')
            ? 'medium'
            : 'low';

    return {
        success: true,
        schoolLevel,
        category,
        year,
        status: issues.length === 0 ? 'pass' : riskLevel === 'high' ? 'revise' : 'caution',
        riskLevel,
        issues,
        citations,
        recommendedRewrite: issues.length > 0
            ? '관찰 사실, 학습 과정, 수업 안에서 확인 가능한 근거만 남기고 평가형 표현을 줄이는 방향으로 정리하세요.'
            : null,
        summary: issues.length === 0
            ? '검토 가능한 공개 근거 범위에서 즉시 수정이 필요한 위험 신호는 확인되지 않았습니다.'
            : '자동 점검 기준으로 표현 위험 가능성이 보여 근거 카드와 함께 확인하는 것이 좋습니다.',
        improvedDraft: includeImprovedDraft ? buildFallbackImprovedDraft(recordText) : undefined,
        matches,
        fallback: true,
        model: null,
    };
}

async function generateImprovedDraft(params: {
    client: OpenAI;
    recordText: string;
    schoolLevel: string;
    category: string;
    year: number;
    subjectName?: string;
    review: RecordReviewResponse;
    matches: RetrievedKnowledgeEvidence[];
}): Promise<string> {
    const { client, recordText, schoolLevel, category, year, subjectName, review, matches } = params;

    if (review.status === 'pass' && review.issues.length === 0 && !review.recommendedRewrite) {
        return recordText;
    }

    const issueText = review.issues.length > 0
        ? review.issues.map((issue, index) => [
            `- 이슈 ${index + 1}`,
            `  severity: ${issue.severity}`,
            `  type: ${issue.issueType}`,
            `  message: ${issue.message}`,
            issue.rewriteGuidance ? `  guidance: ${issue.rewriteGuidance}` : '',
            issue.evidence.length > 0 ? `  evidence: ${issue.evidence.join(' / ')}` : '',
        ].filter(Boolean).join('\n'))
        : '- 즉시 수정 필요 이슈 없음';

    const cacheParams = getPromptCacheParams('record-improve:v1', [
        schoolLevel,
        category,
        year,
        subjectName || '',
        review.status,
        review.riskLevel,
        review.summary,
        recordText,
        matches.map((match) => `${match.knowledgeUnitId}:${match.score}`).join('|'),
    ]);

    const response = await client.responses.create({
        model: DEFAULT_MODEL,
        instructions: [
            '당신은 한국 학교 교과 세특 문장을 점검 후 다듬는 편집 AI다.',
            '원문에 없는 사실, 수치, 활동, 성취, 기관명, 자격증, 수상 실적을 새로 만들지 않는다.',
            '공개 근거와 점검 이슈를 반영해 객관적이고 관찰 가능한 표현으로 고친다.',
            '과장, 서열, 단정 표현을 줄이고 교과 수업 맥락을 유지한다.',
            '가능하면 원문 길이와 밀도를 크게 벗어나지 않는다.',
            '결과는 교사가 바로 붙여 넣을 수 있는 세특 한 단락만 출력한다.',
        ].join('\n'),
        input: [
            `학교급: ${schoolLevel}`,
            `영역: ${category}`,
            `연도: ${year}`,
            subjectName ? `과목: ${subjectName}` : '',
            '',
            '[원문]',
            recordText,
            '',
            '[점검 결과]',
            `status: ${review.status}`,
            `riskLevel: ${review.riskLevel}`,
            `summary: ${review.summary}`,
            review.recommendedRewrite ? `recommendedRewrite: ${review.recommendedRewrite}` : '',
            issueText,
            '',
            '[공개 근거]',
            buildEvidenceText(matches),
        ].filter(Boolean).join('\n'),
        reasoning: { effort: 'low' },
        max_output_tokens: 1000,
        ...cacheParams,
    });

    return sanitizeImprovedDraft(response.output_text || recordText) || recordText;
}

export async function POST(request: NextRequest) {
    let body: ReviewRequestBody;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const recordText = body.recordText?.trim();
    if (!recordText) {
        return NextResponse.json({ success: false, error: 'recordText is required.' }, { status: 400 });
    }

    const schoolLevel = body.schoolLevel?.trim() || DEFAULT_SCHOOL_LEVEL;
    const category = body.category?.trim() || DEFAULT_CATEGORY;
    const year = Number.isFinite(body.year) ? Number(body.year) : DEFAULT_YEAR;
    const includeImprovedDraft = body.includeImprovedDraft === true;
    const subjectName = body.subjectName?.trim() || undefined;

    try {
        let matches = await searchKnowledgeBase({
            query: recordText,
            schoolLevel,
            category,
            year,
            limit: MATCH_LIMIT,
        });

        if (matches.length === 0 && category) {
            matches = await searchKnowledgeBase({
                query: recordText,
                schoolLevel,
                year,
                limit: MATCH_LIMIT,
            });
        }

        if (matches.length === 0) {
            return NextResponse.json(buildNoEvidenceReview(recordText, schoolLevel, category, year, includeImprovedDraft));
        }

        const client = getClient();
        if (client) {
            matches = await rerankMatchesWithAI({
                client,
                query: recordText,
                matches,
                schoolLevel,
                category,
                year,
                model: DEFAULT_MODEL,
            });
        }

        const citations = buildCitations(matches);

        if (!client) {
            return NextResponse.json(
                buildFallbackReview(recordText, schoolLevel, category, year, citations, matches, includeImprovedDraft)
            );
        }

        const cacheParams = getPromptCacheParams('record-review:v2', [
            schoolLevel,
            category,
            year,
            recordText,
            matches.map((match) => `${match.knowledgeUnitId}:${match.score}`).join('|'),
        ]);

        const response = await client.responses.create({
            model: DEFAULT_MODEL,
            instructions: [
                '당신은 학교생활기록부 문장 점검 보조 AI다.',
                '제공된 공개 근거만 사용해 위험 항목을 판별한다.',
                '확실하지 않으면 needs_manual_review 또는 보수적 표현을 선택한다.',
                '수정 방향은 사실을 새로 만들지 않는 범위에서만 제안한다.',
                '반드시 JSON 객체만 반환한다.',
                'JSON keys: status, riskLevel, summary, recommendedRewrite, issues.',
                'issues[].keys: severity, issueType, message, evidence, rewriteGuidance.',
            ].join('\n'),
            input: [
                `학교급: ${schoolLevel}`,
                `영역: ${category}`,
                `연도: ${year}`,
                subjectName ? `과목: ${subjectName}` : '',
                '',
                '[점검 대상 문장]',
                recordText,
                '',
                '[공개 근거]',
                buildEvidenceText(matches),
            ].filter(Boolean).join('\n'),
            reasoning: { effort: 'low' },
            max_output_tokens: 1200,
            text: { format: { type: 'json_object' } },
            ...cacheParams,
        });

        const raw = JSON.parse(response.output_text || '{}') as Record<string, unknown>;
        const issues = Array.isArray(raw.issues)
            ? raw.issues
                .map(normalizeIssue)
                .filter((issue): issue is RecordReviewIssue => issue !== null)
            : [];

        const riskLevel = raw.riskLevel === 'high' || raw.riskLevel === 'medium' ? raw.riskLevel : 'low';
        const status = raw.status === 'revise'
            || raw.status === 'caution'
            || raw.status === 'needs_manual_review'
            ? raw.status
            : 'pass';

        const payload: RecordReviewResponse = {
            success: true,
            schoolLevel,
            category,
            year,
            status,
            riskLevel,
            issues,
            citations,
            recommendedRewrite: typeof raw.recommendedRewrite === 'string' ? raw.recommendedRewrite.trim() : null,
            summary: typeof raw.summary === 'string' && raw.summary.trim()
                ? raw.summary.trim()
                : '점검 결과를 요약하지 못했습니다.',
            matches,
            model: DEFAULT_MODEL,
        };

        if (includeImprovedDraft) {
            try {
                payload.improvedDraft = await generateImprovedDraft({
                    client,
                    recordText,
                    schoolLevel,
                    category,
                    year,
                    subjectName,
                    review: payload,
                    matches,
                });
            } catch (error) {
                console.error('Record improvement failed:', error);
                payload.improvedDraft = buildFallbackImprovedDraft(recordText);
            }
        }

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Record review failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to review text.',
            },
            { status: 500 },
        );
    }
}
