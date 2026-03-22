export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getPromptCacheParams } from '@/lib/prompt-cache';
import { buildCitations, searchKnowledgeBase } from '@/lib/knowledge-base';
import { rerankMatchesWithAI } from '@/lib/knowledge-rerank';
import type { RecordReviewIssue, RecordReviewResponse } from '@/types/knowledge';

const DEFAULT_MODEL = 'gpt-5-mini';

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

function getClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) return null;
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function normalizeIssue(raw: any): RecordReviewIssue | null {
    if (!raw || typeof raw !== 'object') return null;
    const severity = raw.severity === 'high' || raw.severity === 'medium' ? raw.severity : 'low';
    const issueType = ALLOWED_ISSUE_TYPES.has(raw.issueType) ? raw.issueType : 'needs_manual_review';
    const message = typeof raw.message === 'string' ? raw.message.trim() : '';
    if (!message) return null;
    const evidence = Array.isArray(raw.evidence)
        ? raw.evidence.filter((item: unknown): item is string => typeof item === 'string' && item.trim().length > 0)
        : [];

    return {
        severity,
        issueType,
        message,
        evidence,
        rewriteGuidance: typeof raw.rewriteGuidance === 'string' ? raw.rewriteGuidance : null,
    };
}

function buildFallbackReview(
    recordText: string,
    schoolLevel: string,
    category: string,
    year: number,
    citations: RecordReviewResponse['citations'],
    matches: RecordReviewResponse['matches'],
): RecordReviewResponse {
    const issues: RecordReviewIssue[] = [];

    if (/(최고|완벽|천재|압도적|1위)/u.test(recordText)) {
        issues.push({
            severity: 'medium',
            issueType: 'objectivity_risk',
            message: '과도하게 단정적이거나 서열화로 읽힐 수 있는 표현이 포함됐을 가능성이 있습니다.',
            evidence: ['객관적 근거와 관찰 사실 중심의 표현이 더 안전합니다.'],
            rewriteGuidance: '평가형 수식어 대신 실제 행동과 학습 과정으로 바꿔 보세요.',
        });
    }

    if (/(대학교|대학|기업|기관명|회사명)/u.test(recordText)) {
        issues.push({
            severity: 'high',
            issueType: 'prohibited_named_entity',
            message: '특정 기관명 또는 고유명사가 직접 노출됐을 가능성이 있습니다.',
            evidence: ['기관 실명 노출 여부를 다시 확인해야 합니다.'],
            rewriteGuidance: '기관 실명 대신 활동 맥락이나 역할을 일반화해 표현하는 방향을 검토하세요.',
        });
    }

    if (/(자격증|토익|토플|한국사능력검정|컴퓨터활용능력)/u.test(recordText)) {
        issues.push({
            severity: 'medium',
            issueType: 'certificate_fact_out_of_scope',
            message: '자격증 또는 외부 인증 관련 사실이 현재 기재 영역에 맞지 않을 수 있습니다.',
            evidence: ['영역별 기재 가능 범위를 다시 확인할 필요가 있습니다.'],
            rewriteGuidance: '현재 영역에서 허용되는 근거인지 먼저 확인한 뒤 유지 여부를 판단하세요.',
        });
    }

    const riskLevel = issues.some((item) => item.severity === 'high')
        ? 'high'
        : issues.some((item) => item.severity === 'medium')
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
            ? '관찰 사실, 학습 과정, 구체적 행동 근거 중심으로 다시 정리하는 것이 안전합니다.'
            : null,
        summary: issues.length === 0
            ? '검색된 공개 근거 범위에서 즉시 수정이 필요한 신호는 크지 않습니다.'
            : '자동 점검 기준으로 확인이 필요한 표현이 감지되었습니다. 근거 카드와 함께 수동 검토가 필요합니다.',
        matches,
        fallback: true,
        model: null,
    };
}

export async function POST(request: NextRequest) {
    let body: {
        recordText?: string;
        schoolLevel?: string;
        category?: string;
        year?: number;
    };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
    }

    const recordText = body.recordText?.trim();
    if (!recordText) {
        return NextResponse.json({ success: false, error: 'recordText is required.' }, { status: 400 });
    }

    const schoolLevel = body.schoolLevel?.trim() || '고등학교';
    const category = body.category?.trim() || '기타사항';
    const year = body.year || 2026;

    try {
        let matches = await searchKnowledgeBase({
            query: recordText,
            schoolLevel,
            category,
            year,
            limit: 6,
        });
        if (matches.length === 0) {
            return NextResponse.json({
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
                        message: '직접 연결되는 공개 근거를 찾지 못해 자동 판정 대신 수동 확인이 필요합니다.',
                        evidence: [],
                        rewriteGuidance: '학교급, 구분, 핵심 키워드를 더 구체적으로 넣어 다시 점검해 보세요.',
                    },
                ],
                citations: [],
                recommendedRewrite: null,
                summary: '공개 근거가 부족해 보수적으로 수동 검토가 필요하다고 판단했습니다.',
                matches: [],
                fallback: true,
                model: null,
            } satisfies RecordReviewResponse);
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
            return NextResponse.json(buildFallbackReview(recordText, schoolLevel, category, year, citations, matches));
        }

        const evidenceText = matches
            .map((match, index) => [
                `[Evidence ${index + 1}]`,
                `제목: ${match.title}`,
                `학교급: ${match.schoolLevels.join(', ')}`,
                `구분: ${match.categories.join(', ') || '-'}`,
                `기준연도: ${match.effectiveYear ?? '미상'}`,
                `요약: ${match.ruleSummary || match.snippet}`,
            ].join('\n'))
            .join('\n\n');

        const cacheParams = getPromptCacheParams('record-review:v1', [
            schoolLevel,
            category,
            year,
            recordText,
            matches.map((match) => `${match.knowledgeUnitId}:${match.score}`).join('|'),
        ]);

        const response = await client.responses.create({
            model: DEFAULT_MODEL,
            instructions: [
                '당신은 학교생활기록부 점검 보조 AI다.',
                '제공된 공개 근거만 사용해 위험 항목을 분석한다.',
                '수정 방향은 제안 수준으로만 작성한다.',
                '반드시 JSON 객체만 반환한다.',
                'JSON keys: status, riskLevel, summary, recommendedRewrite, issues.',
                'issues[].keys: severity, issueType, message, evidence, rewriteGuidance.',
            ].join('\n'),
            input: [
                `학교급: ${schoolLevel}`,
                `구분: ${category}`,
                `연도: ${year}`,
                '',
                '[검토 대상 문장]',
                recordText,
                '',
                '[공개 근거]',
                evidenceText,
            ].join('\n'),
            reasoning: { effort: 'low' },
            max_output_tokens: 1200,
            text: { format: { type: 'json_object' } },
            ...cacheParams,
        });

        const raw = JSON.parse(response.output_text || '{}');
        const issues = Array.isArray(raw.issues)
            ? raw.issues
                .map(normalizeIssue)
                .filter((item: RecordReviewIssue | null): item is RecordReviewIssue => item !== null)
            : [];

        const riskLevel = raw.riskLevel === 'high' || raw.riskLevel === 'medium' ? raw.riskLevel : 'low';
        const status = raw.status === 'revise' || raw.status === 'caution' || raw.status === 'needs_manual_review'
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
            recommendedRewrite: typeof raw.recommendedRewrite === 'string' ? raw.recommendedRewrite : null,
            summary: typeof raw.summary === 'string' && raw.summary.trim()
                ? raw.summary
                : '검토 결과를 요약할 수 없었습니다.',
            matches,
            model: DEFAULT_MODEL,
        };

        return NextResponse.json(payload);
    } catch (error) {
        console.error('Record review failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to review text.',
            },
            { status: 500 }
        );
    }
}
