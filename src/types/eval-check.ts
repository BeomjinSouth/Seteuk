import { IssueType, RiskLevel } from './common';

/** Progress checkpoints: 25, 50, 75, 100%. */
export type ProgressCheckpoint = 25 | 50 | 75 | 100;

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
 * Reference resource (Image, Table, Graph).
 */
export interface ReferenceResource {
    /** Unique ID. */
    id: string;
    /** Resource type. */
    type: 'image' | 'table' | 'graph' | 'diagram';
    /** Page number. */
    page: number;
    /** Coordinates on the page. */
    coordinates?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Base64 image data. */
    imageData?: string;           // base64 이미지 데이터
    /** AI generated description. */
    aiDescription?: string;       // AI 생성 설명
    /** Teacher's override description. */
    teacherOverride?: string;     // 교사 수정 설명
    /** Final description to be used (override > ai). */
    finalDescription?: string;    // 최종 설명 (override 있으면 override, 없으면 aiDescription)
}

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
export interface ConditionalOutcome {
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
export interface SolutionVariant {
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
export interface IssueDetail {
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
export interface SuggestionDetail {
    /** Minimal change suggestion. */
    minimal: string;              // 최소 수정안 (원문 유지)
    /** Improved change suggestion. */
    improved: string;             // 개선 수정안 (구조적으로 명확하게)
}

/**
 * Simulation of student response for grading considerations.
 */
export interface StudentResponseSimulation {
    /** Scenario description. */
    scenario: string;             // 학생 답안 유형 설명
    /** Potential response example. */
    potentialResponse: string;    // 예상되는 학생 답안 예시
    /** Difficulty in scoring this response. */
    scoringDifficulty: string;    // 왜 채점이 애매한지
    /** Guideline for scoring. */
    scoringGuideline: string;     // 이 경우 어떻게 채점하면 좋은지
}

/**
 * 출제 의도 분석 결과
 */
export interface QuestionIntent {
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
export interface AnswerExample {
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
export interface StudentMisunderstanding {
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
export interface IssueCorrection {
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
export interface ReviewScoringBorderline {
    title: string;
    sampleAnswer: string;
    whyDifficult: string;
    scoringGuide: string;
}

export interface ReviewAmbiguityPoint {
    location: string;
    originalPhrase: string;
    reason: string;
    confusionExample: string;
    rewriteSuggestion: string;
}

export interface ReviewDefectFinding {
    title: string;
    evidence: string;
    impact: string;
    fixSuggestion: string;
}

export interface ReviewDefectCheck {
    hasDefect: boolean;
    severity: 'minor' | 'major' | 'critical';
    findings: ReviewDefectFinding[];
}

export interface ReviewCurriculumBypassRisk {
    method: string;
    whyPossible: string;
    impact: string;
    mitigation: string;
}

export interface ReviewSections {
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
 * Question object from evaluation check.
 */
export interface EvalCheckQuestion {
    /** Unique ID (e.g., Q001). */
    id: string;                   // Q001, Q002 형식
    /** Display name. */
    displayName: string;          // 표시용: "1번", "1-1번", "3번(지문A)"
    /** Original question number. */
    questionNumber: string;       // 원본 문항 번호
    /** Page range. */
    pageRange: string;            // "1" 또는 "1-2"
    /** ID of the passage group if any. */
    passageGroupId?: string;      // 지문 묶음 ID (있는 경우)
    /** Extracted task type (if provided). */
    taskType?: string;

    // 본문
    /** Question body text. */
    bodyText: string;             // 문항 본문 텍스트
    /** Choices (for multiple choice). */
    choices?: ChoiceItem[];       // 보기(선지) 구조
    /** Conditions or constraints. */
    conditions?: string[];        // 조건/제약 목록


    // 참조 리소스
    /** Whether the question has images. */
    hasImage: boolean;            // 그림 포함 여부
    /** Reference resources. */
    references: ReferenceResource[];
    /** Resource reference IDs (if provided). */
    resourceRefs?: string[];

    // 분석 결과
    /** Analysis result. */
    analysis?: QuestionAnalysisResult;

    // 고위험 여부
    /** Is this a high-risk question (has errors). */
    isHighRisk: boolean;
    /** Reason for high risk. */
    highRiskReason?: string;      // 고위험_사유한줄
}

/**
 * Group of passages shared by multiple questions.
 */
export interface PassageGroup {
    /** Unique ID. */
    id: string;                   // PG001, PG002 형식
    /** Display name. */
    displayName: string;          // "지문A", "1~3번 공통 지문"
    /** Page range. */
    pageRange: string;
    /** Full text of the passage. */
    passageText: string;          // 지문 전체 텍스트
    /** IDs of questions belonging to this group. */
    questionIds: string[];        // 소속 문항 ID 목록
    /** Referenced resources. */
    references: ReferenceResource[];
}

/**
 * Uploaded exam document info.
 */
export interface ExamDocument {
    /** Unique ID. */
    id: string;                   // 2026-01-17_중3영어_기말_독해지문포함_DOC_A1B2C3D4
    /** Upload timestamp. */
    uploadedAt: string;           // 업로드일시
    /** Original file name. */
    originalFileName: string;     // 원본파일명
    /** SHA-256 hash. */
    fileHash: string;             // SHA-256 해시
    /** File description. */
    fileDescription: string;      // 파일 설명 (한글)

    // Drive 저장 정보
    /** Google Drive folder ID. */
    driveFolderId?: string;       // 문서 폴더 ID
    /** Original file ID on Drive. */
    driveOriginalFileId?: string; // 원본 파일 ID
    /** Manifest JSON file ID. */
    manifestJsonFileId?: string;  // manifest.json 파일 ID

    // 분석 상태
    /** Analysis status. */
    status: DocumentAnalysisStatus;
    /** Progress percentage. */
    progress: ProgressCheckpoint | 0;

    // 결과 요약
    /** Total questions found. */
    totalQuestions: number;
    /** Count of high risk issues. */
    highRiskCount: number;

    // 구조화 결과
    /** List of questions. */
    questions: EvalCheckQuestion[];
    /** List of passage groups. */
    passageGroups: PassageGroup[];

    // 페이지 정보
    /** Page count. */
    pageCount: number;
    /** Extracted text per page. */
    pageTexts: string[];          // 페이지별 추출 텍스트
    /** Page images (base64). */
    pageImages?: string[];        // 페이지별 렌더 이미지 (base64)

    // 메모
    /** Memo. */
    memo?: string;

    // 타임스탬프
    /** Creation timestamp. */
    createdAt: string;
    /** Last update timestamp. */
    updatedAt?: string;
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

/**
 * Work log for evaluation check.
 */
export interface EvalCheckWorkLog {
    /** Work ID. */
    id: string;                   // 작업ID
    /** Document ID. */
    documentId: string;           // 문서ID
    /** Task type. */
    taskType: 'extract' | 'structure' | 'analyze' | 'reanalyze'; // 작업유형
    /** Status. */
    status: 'pending' | 'running' | 'completed' | 'error';
    /** Progress. */
    progress: ProgressCheckpoint | 0;
    /** Start time. */
    startedAt: string;
    /** Completion time. */
    completedAt?: string;
    /** Checkpoints times. */
    checkpoints: {                // 체크포인트별 완료 시각
        25?: string;
        50?: string;
        75?: string;
        100?: string;
    };
    /** Memo. */
    memo?: string;
    /** Error message. */
    errorMessage?: string;
}

/**
 * API Response for progress check.
 */
export interface EvalCheckProgressResponse {
    /** Document ID. */
    documentId: string;
    /** Status. */
    status: DocumentAnalysisStatus;
    /** Progress. */
    progress: ProgressCheckpoint | 0;
    /** Current step description. */
    currentStep: string;          // 현재 작업 설명

    // 중간 결과 (진행 중일 때)
    /** Partial questions. */
    partialQuestions?: EvalCheckQuestion[];

    // 에러 정보
    /** Error message. */
    error?: string;
}

/**
 * API Request for document upload.
 */
export interface EvalCheckUploadRequest {
    /** The file object. */
    file: File;
    /** Description of the file. */
    fileDescription: string;
    /** Spreadsheet ID. */
    spreadsheetId: string;
    /** Root folder ID. */
    rootFolderId: string;
}

/**
 * API Request for re-analysis.
 */
export interface EvalCheckReanalyzeRequest {
    /** Document ID. */
    documentId: string;
    /** Specific question ID to re-analyze. */
    questionId?: string;          // 특정 문항만 재분석 (없으면 전체)
    /** Specific passage group ID to re-analyze. */
    passageGroupId?: string;      // 지문 묶음 재분석
    /** Image overrides. */
    imageOverrides?: {
        resourceId: string;
        teacherDescription: string;
    }[];
}
