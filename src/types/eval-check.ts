import { IssueType, RiskLevel } from './common';

/**
 * Status of document analysis.
 */
export type DocumentAnalysisStatus =
    | 'pending'      // 대기 중
    | 'extracting'   // 텍스트 추출 중 (25%)
    | 'structuring'  // 문항 구조화 중 (50%)
    | 'analyzing'    // 분석 중 (75%)
    | 'completed'    // 완료 (100%)
    | 'error';       // 오류

/**
 * Multiple choice item structure.
 */
export interface ChoiceItem {
    /** Label (e.g. 1, 2, A, B). */
    label: string;                // ①, ②, ③ 또는 ㄱ, ㄴ, ㄷ 등
    /** Content text. */
    content: string;              // 선지 내용
}

/**
 * Result of conditional logic analysis.
 */
interface ConditionalOutcome {
    /** Condition label. */
    conditionLabel: string;
    /** Predicted conclusion. */
    predictedConclusion: string;
    /** Proof outline. */
    proofOutline?: string;
    /** Guide for reasoning. */
    reasoningGuide?: string;
    /** Rubric points. */
    rubric?: string[];
}

/**
 * Solution variant for a question.
 */
interface SolutionVariant {
    /** Label for the solution (e.g., 풀이 1). */
    label: string;
    /** Step-by-step solution/explanation. */
    solution: string;
    /** Final answer/output. */
    finalAnswer: string;
}

/**
 * Details of an issue found in a question.
 */
interface IssueDetail {
    /** Unique ID. */
    id: string;
    /** Issue type. */
    type: IssueType;
    /** Risk level. */
    riskLevel: RiskLevel;         // 위험도
    /** Summary. */
    summary: string;              // 오류 한줄 요약
    /** Detailed description. */
    description: string;          // 상세 설명
    /** Location in text. */
    location?: string;            // 문제 위치 (선지, 조건 등)
    /** Original text causing the issue. */
    originalText?: string;        // 문제가 되는 원본 텍스트
    /** Suggested fix. */
    suggestedFix?: string;        // 수정 후 텍스트
}

/**
 * Suggested modification detail.
 */
interface SuggestionDetail {
    /** Minimal change suggestion. */
    minimal: string;              // 최소 수정안 (원문 유지)
    /** Improved change suggestion. */
    improved: string;             // 개선 수정안 (구조적으로 명확하게)
}

/**
 * 출제 의도 분석 결과
 */
interface QuestionIntent {
    /** 평가하고자 하는 핵심 역량 목록 */
    targetCompetencies: string[];
    /** 출제 의도 설명 */
    intentDescription: string;
    /** 관련 성취기준 코드 (예: [9수02-03]) */
    relatedStandards?: string[];
    /** 난이도 (상/중/하) */
    difficulty?: 'high' | 'medium' | 'low';
}

/**
 * 구체적인 답변 예시
 */
interface AnswerExample {
    /** 예시 라벨 (예: "모범 답안", "부분 점수 답안", "오답 예시") */
    label: string;
    /** 답변 내용 */
    content: string;
    /** 예상 점수 또는 평가 (예: "만점", "80%", "0점") */
    score?: string;
    /** 이 답안의 특징 설명 */
    explanation?: string;
}

/**
 * 학생 오해 부분 및 교사 안내
 */
interface StudentMisunderstanding {
    /** 오해 가능한 부분 */
    misunderstandingPoint: string;
    /** 왜 오해가 발생하는지 */
    reason: string;
    /** 교사의 안내/지도 방법 */
    teacherGuidance: string;
    /** 오해 빈도 예측 (높음/중간/낮음) */
    frequency?: 'high' | 'medium' | 'low';
}

/**
 * 문항 오류와 수정 연결 정보
 */
interface IssueCorrection {
    /** 원본 문제 텍스트 */
    originalText: string;
    /** 수정된 텍스트 */
    correctedText: string;
    /** 수정 유형 (minimal: 최소 수정, improved: 개선 수정) */
    correctionType: 'minimal' | 'improved';
    /** 수정 이유 */
    correctionReason: string;
}

/**
 * Analysis result for a question.
 */
interface ReviewScoringBorderline {
    title: string;
    sampleAnswer: string;
    whyDifficult: string;
    scoringGuide: string;
}

interface ReviewAmbiguityPoint {
    location: string;
    originalPhrase: string;
    reason: string;
    confusionExample: string;
    rewriteSuggestion: string;
}

interface ReviewDefectFinding {
    title: string;
    evidence: string;
    impact: string;
    fixSuggestion: string;
}

interface ReviewDefectCheck {
    hasDefect: boolean;
    severity: 'minor' | 'major' | 'critical';
    findings: ReviewDefectFinding[];
}

interface ReviewCurriculumBypassRisk {
    method: string;
    whyPossible: string;
    impact: string;
    mitigation: string;
}

interface ReviewSections {
    scoringBorderlines: ReviewScoringBorderline[];
    ambiguityPoints: ReviewAmbiguityPoint[];
    defectCheck: ReviewDefectCheck;
    curriculumBypassRisks: ReviewCurriculumBypassRisk[];
}

export interface QuestionAnalysisResult {

    /** Output language. */
    outputLanguage?: 'ko';

    // 1) 예시 답안
    /** Model answer. */
    answer?: string;              // 모범 답안
    /** Summary of answer (short version). */
    answerSummary?: string;       // 정답_요약 (시트용 짧은 버전)
    /** Reasoning process. */
    reasoning?: string;           // 풀이 과정
    /** Summary of reasoning. */
    reasoningSummary?: string;    // 풀이_요약 (시트용 짧은 버전)

    /** Multiple solution variants. */
    solutionVariants?: SolutionVariant[];

    // 2) 문항 오류
    /** List of issues found. */
    issues: IssueDetail[];
    /** Modification suggestion. */
    suggestion?: SuggestionDetail;  // 수정 제안 (문제점이 있는 경우)

    // 3) 학생 답안 시뮬레이션 시 고려사항
    /** Problem-focused review sections for eval-check report v2. */
    reviewSections?: ReviewSections;

    // Additional fields
    /** Scoring rubric. */
    rubric?: string[];            // 채점 요소
    /** Sample student responses. */
    sampleResponses?: string[];   // 모범 학생 답안 예시
    /** Common misconceptions. */
    commonMisconceptions?: string[]; // 학생 오개념
    /** Reference notes. */
    reference?: string;           // 참고사항

    /** Proof outline. */
    proofOutline?: string;        // 증명 개요
    /** Required properties for solution. */
    requiredProperties?: string[];// 사용 성질 목록

    /** Conditional outcomes. */
    conditionalOutcomes?: ConditionalOutcome[];

    // === 새로운 필드 (학습지 OCR 방식 차용) ===

    /** 출제 의도 분석 */
    questionIntent?: QuestionIntent;

    /** 구체적인 답변 예시 목록 (가능한 모든 유형) */
    answerExamples?: AnswerExample[];

    /** 학생 오해 부분 및 교사 안내 */
    studentMisunderstandings?: StudentMisunderstanding[];

    /** 문항 오류-수정 연결 정보 */
    issueCorrections?: IssueCorrection[];

    // JSON 파일 ID (Drive에 저장된 상세 결과)
    /** Detailed JSON file ID. */
    detailJsonFileId?: string;

    // 분석 완료 시각
    /** Analysis timestamp. */
    analyzedAt: string;
}

/**
 * User defined rule for checking.
 */
export interface UserRule {
    /** Unique ID. */
    ruleId: string;
    /** Whether the rule is enabled. */
    enabled: boolean;             // 사용여부
    /** Rule name. */
    name: string;                 // 규칙 이름
    /** Target scope of the rule. */
    target: 'question' | 'passage' | 'choice' | 'all'; // 적용 대상
    /** Condition to check. */
    condition: string;            // 위반 판단 (키워드/조건)
    /** Guide for correction. */
    correctionGuide: string;      // 위반 시 수정 가이드 문구
    /** Example of wrong case. */
    exampleWrong?: string;        // 예시_잘못된문장
    /** Example of correct case. */
    exampleCorrect?: string;      // 예시_수정문장
}

// 기본 제공 규칙 예시
export const DEFAULT_RULES: Omit<UserRule, 'ruleId'>[] = [
    {
        enabled: true,
        name: '<보기> 종결 표현 규칙',
        target: 'question',
        condition: '<보기>가 있는 경우',
        correctionGuide: '"있는 대로 모두 고르시오" 계열 표현 권장',
        exampleWrong: '옳은 것을 고르시오.',
        exampleCorrect: '옳은 것만을 있는 대로 고르시오.',
    },
    {
        enabled: true,
        name: '그림 참조 표현 규칙',
        target: 'question',
        condition: '그림이 포함된 문항',
        correctionGuide: '"다음 그림을" 표현 금지, 구체적 참조 권장',
        exampleWrong: '다음 그림을 보고 답하시오.',
        exampleCorrect: '[그림 1]을 보고 답하시오.',
    },
];

/**
 * Evaluation check settings.
 */
export interface EvalCheckSettings {
    /** Root folder ID for teacher's drive. */
    rootFolderId: string;         // 교사 드라이브의 평가점검 루트 폴더 ID
    /** Spreadsheet ID for results. */
    spreadsheetId: string;        // 결과 스프레드시트 ID
    /** Service account email. */
    serviceAccountEmail: string;  // 서비스 계정 이메일
    /** Rule set ID. */
    ruleSetId: string;            // 규칙 버전 관리용 (기본: DEFAULT)

    // 연결 상태
    /** Connection status. */
    isConnected: boolean;
    /** Last connection test timestamp. */
    lastTestedAt?: string;
}

