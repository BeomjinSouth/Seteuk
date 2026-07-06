import { EvidenceType, RecordStatus, SourceType } from './common';

/** Competency analysis segment type: Knowledge, Process, or Attitude. */
export type CompetencyType = 'knowledge' | 'process' | 'attitude';

/** Source of a subject record revision. */
export type SubjectRecordHistorySource = 'ai' | 'manual' | 'expand' | 'shorten' | 'improve';

/**
 * Represents a segment of text identified as related to a specific competency.
 */
export interface CompetencySegment {
    /** The text content of the segment. */
    text: string;
    /** The type of competency (knowledge, process, attitude). */
    type: CompetencyType;
    /** Start index of the segment in the original text. */
    startIndex: number;
    /** End index of the segment in the original text. */
    endIndex: number;
}

/**
 * Represents a subject record for a student.
 */
export interface SubjectRecord {
    /** Unique identifier for the record. */
    id: string;
    /** Student ID. */
    studentId: string;
    /** Class ID. */
    classId: string;
    /** Stable teacher key for subject ownership. */
    teacherKey?: string;
    /** Semester (1 or 2). */
    semester?: 1 | 2;
    /** The generated or edited text content. */
    content: string; // The generated or edited text
    /** Original content before edits. */
    originalContent?: string; // For comparison
    /** Current status of the record. */
    status: RecordStatus;
    /** Last updated timestamp (ISO string). */
    lastUpdated: string;
    /** Result of spell and forbidden word check. */
    checkResult?: {
        spellerErrors: number;
        forbiddenWords: number;
    };
    /** History of content changes. */
    history?: {
        content: string;
        timestamp: string;
        source: SubjectRecordHistorySource;
    }[];
    /** Competency analysis results. */
    competencyAnalysis?: {
        segments: CompetencySegment[];
        analyzedAt: string; // 분석 시점
        contentHash: string; // 분석 당시 내용의 해시 (내용 변경 감지용)
    };
}

/**
 * Assessment task definition.
 */
export interface Assessment {
    /** Unique ID for the assessment. */
    id: string;
    /** Title of the assessment. */
    title: string;              // 과제명
    /** Unit or chapter. */
    unit: string;               // 단원
    /** Achievement standard code (e.g., [9수02-03]). */
    achievementStandard: string; // 성취기준 (예: [9수02-03])
    /** Date of assessment. */
    assessmentDate: string;     // 평가일
    /** Tags related to competencies. */
    competencyTags: string[];   // 역량 태그
    /** Description of the assessment. */
    description: string;        // 설명
    /** Rubric for evaluation. */
    rubric?: {
        /** Description of evaluation criteria. */
        criteria: string;         // 평가 기준 설명
        /** Levels of achievement. */
        levels: Array<{
            level: string;          // 수준 (상/중/하 또는 A/B/C/D/E)
            description: string;    // 수준별 기준 설명
        }>;
    };
    /** Achievement level descriptions. */
    achievementLevels?: {       // 성취수준 기준
        상: string;
        중: string;
        하: string;
    };
    /** Creation timestamp. */
    createdAt: string;
    /** Last update timestamp. */
    updatedAt?: string;
}

/**
 * Data extracted from OCR analysis.
 */
export interface OCRData {
    /** Extracted text content. */
    extractedText: string;
    /** Descriptions of drawings or images found. */
    drawings: Array<{
        description: string;
        location: string;
    }>;
    /** Summary of the content. */
    summary: string;
}

/**
 * Observation memo record.
 */
export interface Observation {
    /** Unique ID for the observation. */
    id: string;
    /** Student ID. */
    studentId: string;          // 학생 ID (참조)
    /** Teaching class ID that produced this observation. */
    classId: string;
    /** Stable teacher key that owns this observation. */
    teacherKey: string;
    /** Assessment ID (optional). */
    assessmentId?: string;      // 평가 과제 ID (선택, 참조)
    /** Subject name for the teaching class. */
    subjectName?: string;
    /** Lesson topic or activity context. */
    lessonTopic?: string;
    /** Date of observation. */
    date: string;               // 관찰 날짜
    /** Content of the observation memo. */
    memo: string;               // 관찰 메모 본문
    /** Type of evidence (process/result). */
    evidenceType: EvidenceType; // 근거 유형 (과정/결과)
    /** Tags (competencies, keywords). */
    tags: string[];             // 태그 (역량, 키워드)
    /** Source of the observation (ocr/manual). */
    sourceType: SourceType;     // 출처 유형 (OCR/수동)
    /** Original OCR data if source is OCR. */
    ocrData?: OCRData;          // OCR 원본 데이터 (OCR인 경우)
    /** URL of the original image (optional). */
    imageUrl?: string;          // 원본 이미지 URL (선택)
    /** Creation timestamp. */
    createdAt: string;
    /** Last update timestamp. */
    updatedAt?: string;
}
