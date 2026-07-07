/** Semester type: '1' for First Semester, '2' for Second Semester. */
export type Semester = '1' | '2';

/** Status of a record: 'empty', 'draft', 'checked', or 'confirmed'. */
export type RecordStatus = 'empty' | 'draft' | 'checked' | 'confirmed';

/** Evidence type: 'process' (learning process) or 'result' (learning outcome). */
export type EvidenceType = 'process' | 'result';

/** Source type: 'ocr' (automatic from image) or 'manual' (entered by user). */
export type SourceType = 'ocr' | 'manual';

/**
 * Attached file (PDF or Image).
 */
export interface AttachedFile {
    /** Unique ID. */
    id: string;
    /** File name. */
    name: string;
    /** File type. */
    type: 'pdf' | 'image';
    /** Base64 data (optional). */
    data?: string;             // base64 데이터
    /** Upload timestamp. */
    uploadedAt: string;
}

/**
 * Type of issue found in the question or text.
 */
export type IssueType =
    | 'grammatical_error'      // 문법적 오류/비문 (저위험)
    | 'question_defect'        // 문항 자체의 출제 오류 (고위험)
    | 'contradiction'          // 모순된 표현 (중위험)
    | 'condition_mismatch'     // 조건이 맞지 않는 문제 (고위험)
    | 'unrealistic_condition'  // 현실적으로 타당하지 않은 조건 (중위험)
    | 'format'                 // 형식 오류 (저위험)
    | 'other';                 // 기타

/** Risk level: low, medium, high. */
export type RiskLevel = 'low' | 'medium' | 'high';

/** Labels for IssueType. */
export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
    grammatical_error: '문법적 오류',
    question_defect: '출제 오류',
    contradiction: '모순된 표현',
    condition_mismatch: '조건 불일치',
    unrealistic_condition: '비현실적 조건',
    format: '형식 오류',
    other: '기타',
};
