export interface KnowledgeUnitPolicyAnchor {
    rule: string;
    exception: string | null;
    source: string;
}

export interface KnowledgeUnitSourceDocument {
    document_id: string;
    relation_type: 'primary' | 'duplicate' | 'versioned';
}

export interface KnowledgeUnit {
    knowledge_unit_id: string;
    source_board: 'faq' | 'qa' | 'mixed';
    canonical_title: string;
    canonical_question: string | null;
    canonical_answer: string | null;
    rule_summary: string | null;
    school_level_scope: Array<'공통' | '초등학교' | '중학교' | '고등학교'>;
    category_scope: string[];
    effective_year_from: number | null;
    effective_year_to: number | null;
    access_level: 'public' | 'restricted_metadata_only' | 'unusable';
    answer_consistency_label: 'exact_duplicate_same_answer' | 'same_question_different_answer' | 'unique';
    policy_anchors: KnowledgeUnitPolicyAnchor[];
    source_documents: KnowledgeUnitSourceDocument[];
}

export interface CanonicalKnowledgeSource {
    sourceType: 'faq' | 'qna';
    sourceId: string;
    title: string;
    url: string;
    createdAt?: string;
    answerDate?: string;
    schoolLevels: string[];
    category?: string;
}

export interface CanonicalKnowledgeEntry {
    questionKey: string;
    title: string;
    question: string;
    answer: string;
    sourceType: 'faq' | 'qna';
    effectiveDate: string | null;
    schoolLevels: string[];
    categories: string[];
    sourceUrls: string[];
    resolution: string;
    duplicateCount: number;
    variantCount: number;
    sources: CanonicalKnowledgeSource[];
}

export interface KnowledgeDatasetStats {
    faqListed: number;
    qnaLastPage: number;
    qnaPagesFetched: number;
    qnaListed: number;
    qnaPublic: number;
    qnaSecret: number;
    answeredEntries: number;
    canonicalEntries: number;
    knowledgeUnits: number;
    pendingPublicEntries: number;
    inaccessibleEntries: number;
}

export interface KnowledgeDataset {
    generatedAt: string;
    year: string;
    source: {
        faq: string;
        qna: string;
    };
    options: {
        maxPages?: number;
        concurrency: number;
        delayMs: number;
        preferFaqOnConflict: boolean;
    };
    stats: KnowledgeDatasetStats;
    canonicalEntries: CanonicalKnowledgeEntry[];
    knowledgeUnits: KnowledgeUnit[];
}

export interface RetrievedKnowledgeEvidence {
    knowledgeUnitId: string;
    title: string;
    question: string;
    answer: string;
    ruleSummary: string | null;
    schoolLevels: string[];
    categories: string[];
    effectiveYear: number | null;
    sourceBoard: 'faq' | 'qa' | 'mixed';
    resolution: string;
    duplicateCount: number;
    variantCount: number;
    sourceUrls: string[];
    sources: CanonicalKnowledgeSource[];
    policyAnchors: KnowledgeUnitPolicyAnchor[];
    score: number;
    snippet: string;
}

export interface KnowledgeMeta {
    year: string;
    generatedAt: string;
    stats: KnowledgeDatasetStats;
    schoolLevels: string[];
    categories: string[];
}

export interface Citation {
    title: string;
    url: string;
    snippet: string;
    sourceBoard: 'faq' | 'qa' | 'mixed';
    effectiveYear: number | null;
}

export interface CounselChatResponse {
    success: boolean;
    answer: string;
    citations: Citation[];
    matches: RetrievedKnowledgeEvidence[];
    conflictNote?: string | null;
    fallback?: boolean;
    model?: string | null;
    error?: string;
}

export interface RecordReviewIssue {
    severity: 'low' | 'medium' | 'high';
    issueType:
        | 'prohibited_named_entity'
        | 'certificate_fact_out_of_scope'
        | 'award_scope_violation'
        | 'attendance_note_rule_risk'
        | 'subject_detail_style_risk'
        | 'objectivity_risk'
        | 'unsupported_claim_risk'
        | 'year_mismatch_risk'
        | 'needs_manual_review';
    message: string;
    evidence: string[];
    rewriteGuidance: string | null;
}

export interface RecordReviewResponse {
    success: boolean;
    schoolLevel: string;
    category: string;
    year: number;
    status: 'pass' | 'caution' | 'revise' | 'needs_manual_review';
    riskLevel: 'low' | 'medium' | 'high';
    issues: RecordReviewIssue[];
    citations: Citation[];
    recommendedRewrite: string | null;
    summary: string;
    improvedDraft?: string | null;
    matches: RetrievedKnowledgeEvidence[];
    fallback?: boolean;
    model?: string | null;
    error?: string;
}

export interface KnowledgeEvalCase {
    id: string;
    query: string;
    schoolLevel?: string;
    category?: string;
    year: number;
    expectedTitleKeywords: string[];
    notes?: string;
}

export interface KnowledgeEvalCaseResult {
    id: string;
    query: string;
    expectedTitleKeywords: string[];
    matchedTitles: string[];
    top1Matched: boolean;
    top3Matched: boolean;
    reciprocalRank: number;
}

export interface KnowledgeEvalReport {
    caseCount: number;
    hitAt1: number;
    hitAt3: number;
    meanReciprocalRank: number;
    results: KnowledgeEvalCaseResult[];
}
