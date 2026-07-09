import { AttachedFile, Semester } from './common';

/**
 * Achievement level definition (e.g., High, Medium, Low).
 */
interface EvaluationAchievementLevel {
    /** Level identifier or name (e.g., '상', '중', '하'). */
    level: string;        // '상', '중', '하' 또는 커스텀
    /** Description of the level. */
    description: string;
}

/**
 * Achievement standard definition.
 */
export interface EvaluationAchievementStandard {
    /** Unique ID. */
    id: string;
    /** Standard code (e.g., [12윤사03-06]). */
    code: string;           // 예: [12윤사03-06]
    /** Description of the standard. */
    description: string;    // 성취기준 설명
    /** Defined levels for this standard. */
    levels: EvaluationAchievementLevel[];
}

/**
 * Scoring level definition.
 */
interface EvaluationScoringLevel {
    /** Score value (e.g., 4, 3, 2, 1). */
    score: number;          // 4, 3, 2, 1 등
    /** Description for this score. */
    description: string;
}

/**
 * Scoring criteria definition.
 */
export interface EvaluationScoringCriteria {
    /** Unique ID. */
    id: string;
    /** Evaluation element name (e.g., "Perspective on Nature"). */
    element: string;        // 평가요소 (예: "노자와 장자의 인간관")
    /** Defined scoring levels. */
    levels: EvaluationScoringLevel[];
}

/**
 * OCR analysis result for an individual student entry.
 */
export interface OCRResultEntry {
    /** Unique ID. */
    id: string;
    /** Student ID (optional, if mapped). */
    studentId?: string;         // 학생 ID (선택)
    /** Student name (manually entered). */
    studentName?: string;       // 학생 이름 (직접 입력)
    /** Base64 or URL of the image data. */
    imageData?: string;         // 이미지 base64 또는 URL
    /** Extracted text content. */
    extractedText: string;
    /** List of drawings found. */
    drawings: Array<{
        description: string;
        location: string;
    }>;
    /** Content summary. */
    summary: string;
    /** Evaluation results. */
    evaluation?: {
        achievementLevel: string;  // 상/중/하
        competencies: string[];    // 발휘된 역량
        feedback: string;          // 피드백
    };
    /** Analysis timestamp. */
    analyzedAt: string;
}

/**
 * Single answer option for a question.
 */
export interface ModelAnswerOption {
    /** Label for this answer (e.g., "표준 답안", "대안 답안 (선행 지식 활용)") */
    label: string;
    /** The answer content including solution and final answer */
    content: string;
}

/**
 * Question in a model answer.
 */
export interface ModelAnswerQuestion {
    /** Question number. */
    questionNumber: number;
    /** Question text. */
    questionText: string;
    /**
      * Multiple model answers for this question.
      * Always include a "표준 답안". Add more only when there are distinct solution methods.
      */
    answers: ModelAnswerOption[];
    /**
      * @deprecated Use `answers[0].content` instead.
      * Kept for backward compatibility with existing data.
      */
    answer?: string;
    /** Key points for the rubric. */
    rubricPoints: string[];
    /** Guidelines for scoring with score levels and examples. */
    scoringGuidelines?: string;
    /** Maximum score for this question. */
    maxScore?: number;
}

/**
 * Model answer document.
 */
export interface ModelAnswer {
    /** Unique ID. */
    id: string;
    /** Source file ID (if derived from a file). */
    sourceFileId: string;       // 원본 평가지 파일 ID
    /** List of questions. */
    questions: ModelAnswerQuestion[];
    /** Generation timestamp. */
    generatedAt: string;
    /** Last edited timestamp. */
    editedAt?: string;
}

/**
 * A tabbed set of model answers (e.g., 표준/대안).
 */
interface ModelAnswerSet {
    /** Unique ID for this set. */
    id: string;
    /** Tab label. */
    label: string;
    /** Questions in this set. */
    questions: ModelAnswerQuestion[];
    /** Generation timestamp. */
    generatedAt: string;
    /** Last edited timestamp. */
    editedAt?: string;
}

/**
 * Model answer bundle with multiple tabbed sets.
 */
export interface ModelAnswerBundle {
    /** Unique ID. */
    id: string;
    /** Source file ID (if derived from a file). */
    sourceFileId: string;
    /** Tabbed answer sets. */
    sets: ModelAnswerSet[];
    /** Generation timestamp. */
    generatedAt: string;
    /** Last edited timestamp. */
    editedAt?: string;
}

/** Backward-compatible model answer payload. */
export type ModelAnswerPayload = ModelAnswer | ModelAnswerBundle;

/**
 * Item mapping a student to a page range in the exam.
 */
export interface StudentMappingItem {
    /** Slot index (0-based). */
    slotIndex: number;          // 순서 (0부터)
    /** Start page number (1-based). */
    pageStart: number;          // 시작 페이지 (1부터)
    /** End page number. */
    pageEnd: number;            // 끝 페이지
    /** OCR recognition results for student info. */
    ocrRecognized?: {           // OCR 인식 결과
        studentNumber?: number;   // 인식된 학번
        studentName?: string;     // 인식된 이름
        confidence: number;       // 신뢰도 (0-1)
        rawText: string;          // 원본 텍스트
    };
    /** ID of the mapped student. */
    mappedStudentId?: string;   // 매핑된 학생 ID
    /** Number of the mapped student. */
    mappedStudentNumber?: number; // 매핑된 학생 번호
    /** Name of the mapped student. */
    mappedStudentName?: string; // 매핑된 학생 이름
    /** Mapping status. */
    status: 'matched' | 'mismatch' | 'unrecognized' | 'empty';
    /** Whether this slot is skipped (e.g. absent student). */
    isSkipped?: boolean;        // 결번으로 건너뜀
}

/**
 * Full mapping of students to exam pages.
 */
interface StudentMapping {
    /** Evaluation ID. */
    evaluationId: string;
    /** Class ID. */
    classId: string;
    /** Number of pages per student. */
    pagesPerStudent: number;    // 학생당 페이지 수
    /** Starting page number. */
    startPage: number;          // 시작 페이지
    /** Total pages in the file. */
    totalPages: number;         // 전체 페이지 수
    /** mapping items. */
    items: StudentMappingItem[];
    /** Confirmation timestamp. */
    confirmedAt?: string;       // 확인 완료 시각
}

/**
 * Question-level grading result.
 */
export interface QuestionGradingResult {
    /** Question number. */
    questionNumber: number;
    /** Score for this question. */
    score: number;
    /** Maximum score for this question. */
    maxScore: number;
    /** Feedback for this question. */
    feedback: string;
}

/**
 * Grading item that was ambiguous or low confidence.
 */
export interface AmbiguousGradingItem {
    /** Criteria ID. */
    criteriaId: string;
    /** Criteria element name. */
    criteriaElement: string;
    /** Reason for ambiguity. */
    reason: string;                 // 애매한 이유
    /** Confidence score (0-1). */
    confidence: number;             // 신뢰도 (0-1)
}

/**
 * Grading result for a single student.
 */
export interface StudentGradingResult {
    /** Student ID. */
    studentId: string;
    /** Student number. */
    studentNumber: number;
    /** Student name. */
    studentName: string;
    /** Slot index. */
    slotIndex: number;
    /** Scores for each criteria. */
    scores: {
        criteriaId: string;
        criteriaElement: string;
        score: number;
        maxScore: number;
        feedback: string;
    }[];
    /** Question-level grading results. */
    questionResults?: QuestionGradingResult[];
    /** Total score obtained. */
    totalScore: number;
    /** Maximum possible total score. */
    maxTotalScore: number;
    /** Achievement level (e.g., '상', '중', '하'). */
    achievementLevel: string;   // 상/중/하
    /** Overall feedback. */
    overallFeedback: string;
    /** Extracted text from student's paper. */
    extractedText: string;
    /** Grading timestamp. */
    gradedAt: string;
    /** Items that were difficult to grade confidently. */
    ambiguousItems?: AmbiguousGradingItem[];
}

/**
 * Result of batch grading process.
 */
export interface BatchGradingResult {
    /** Unique ID. */
    id: string;
    /** Evaluation ID. */
    evaluationId: string;
    /** Class ID. */
    classId: string;
    /** Student mapping used. */
    mapping: StudentMapping;
    /** List of individual results. */
    results: StudentGradingResult[];
    /** Process status. */
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    /** Progress percentage (0-100). */
    progress: number;           // 0-100
    /** Start timestamp. */
    startedAt: string;
    /** Completion timestamp. */
    completedAt?: string;
    /** Error message if failed. */
    errorMessage?: string;
}

/**
 * Preliminary grading result (before final confirmation).
 */
export interface PreliminaryGradingResult {
    /** Unique ID. */
    id: string;
    /** Student ID. */
    studentId: string;
    /** Student number. */
    studentNumber: number;
    /** Student name. */
    studentName: string;
    /** Slot index. */
    slotIndex: number;
    /** Scores. */
    scores: {
        criteriaId: string;
        criteriaElement: string;
        score: number;
        maxScore: number;
        feedback: string;
    }[];
    /** Total score. */
    totalScore: number;
    /** Max total score. */
    maxTotalScore: number;
    /** Achievement level. */
    achievementLevel: string;
    /** Extracted text. */
    extractedText: string;
    /** Teacher's feedback on this grading. */
    teacherFeedback?: string;   // 교사의 개별 피드백
    /** Grading timestamp. */
    gradedAt: string;
}

/**
 * Feedback provided by the teacher to improve grading AI.
 */
export interface TeacherGradingFeedback {
    /** Individual feedback items. */
    feedbackItems: string[];        // 개별 피드백 항목들
    /** Summary of teacher's grading tendency. */
    gradingTendency?: string;       // 채점 성향 요약
    /** Generated system prompt based on feedback. */
    generatedPrompt?: string;       // AI가 생성한 시스템 프롬프트
    /** Creation timestamp. */
    createdAt: string;
}

/**
 * Main OCR Evaluation object.
 */
export interface OCREvaluation {
    /** Unique ID. */
    id: string;
    /** Academic year (e.g., 2026). */
    year: number;             // 학년도 (예: 2026)
    /** Semester (1 or 2). */
    semester: Semester;       // 학기 (1 또는 2)
    /** Grade level. */
    grade: number;            // 학년 (1, 2, 3)
    /** Evaluation title. */
    title: string;            // 평가명 (예: "수행평가 1차")
    /** Description. */
    description?: string;     // 평가 설명
    /** Attached files. */
    attachedFiles: AttachedFile[];
    /** Achievement standards. */
    achievementStandards: EvaluationAchievementStandard[];
    /** Scoring criteria. */
    scoringCriteria: EvaluationScoringCriteria[];
    /** Model answer (optional). */
    modelAnswer?: ModelAnswerPayload;
    /** List of OCR results. */
    ocrResults: OCRResultEntry[];
    /** Preliminary grading results. */
    preliminaryGradings?: PreliminaryGradingResult[];
    /** Teacher feedback on grading. */
    teacherFeedback?: TeacherGradingFeedback;
    /** System prompt for grading (editable by teacher). */
    gradingSystemPrompt?: string;  // 교사가 편집 가능한 채점 가이드라인
    /** Batch grading result. */
    batchGradingResult?: BatchGradingResult;
    /** General memo. */
    memo: string;
    /** Creation timestamp. */
    createdAt: string;
    /** Last update timestamp. */
    updatedAt?: string;
}
