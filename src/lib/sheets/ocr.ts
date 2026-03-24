import { readSheet, appendRow, updateRow, deleteRow, SHEETS } from './base';

export interface ObservationRow {
    id: string;
    studentId: string;
    classId: string;
    teacherKey: string;
    assessmentId?: string;
    subjectName?: string;
    lessonTopic?: string;
    date: string;
    memo: string;
    evidenceType: 'process' | 'result';
    tags: string[];
    sourceType: 'ocr' | 'manual';
    ocrData?: {
        extractedText: string;
        drawings: Array<{ description: string; location: string }>;
        summary: string;
    };
    imageUrl?: string;
    createdAt: string;
    updatedAt?: string;
}

function parseJsonValue<T>(raw: string | undefined, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

// ============ Observation Operations (Observation Memos) ============

/**
 * Retrieves all observation memos.
 * @returns Array of observation objects.
 */
export async function getObservations(): Promise<ObservationRow[]> {
    const rows = await readSheet(SHEETS.OBSERVATIONS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map((row) => {
        const isNewRow = (row[2] || '').startsWith('teach-')
            || (row[3] || '').includes('::')
            || /^\d{4}-\d{2}-\d{2}$/.test(row[7] || '');

        if (!isNewRow) {
            return {
                id: row[0],
                studentId: row[1] || '',
                classId: '',
                teacherKey: '',
                assessmentId: row[2] || undefined,
                subjectName: undefined,
                lessonTopic: undefined,
                date: row[3] || '',
                memo: row[4] || '',
                evidenceType: (row[5] as 'process' | 'result') || 'process',
                tags: parseJsonValue<string[]>(row[6], []),
                sourceType: (row[7] as 'ocr' | 'manual') || 'manual',
                ocrData: parseJsonValue<ObservationRow['ocrData']>(row[8], undefined),
                imageUrl: row[9] || undefined,
                createdAt: row[10] || '',
                updatedAt: row[11] || undefined,
            };
        }

        return {
            id: row[0],
            studentId: row[1] || '',
            classId: row[2] || '',
            teacherKey: row[3] || '',
            assessmentId: row[4] || undefined,
            subjectName: row[5] || undefined,
            lessonTopic: row[6] || undefined,
            date: row[7] || '',
            memo: row[8] || '',
            evidenceType: (row[9] as 'process' | 'result') || 'process',
            tags: parseJsonValue<string[]>(row[10], []),
            sourceType: (row[11] as 'ocr' | 'manual') || 'manual',
            ocrData: parseJsonValue<ObservationRow['ocrData']>(row[12], undefined),
            imageUrl: row[13] || undefined,
            createdAt: row[14] || '',
            updatedAt: row[15] || undefined,
        };
    });
}

/**
 * Retrieves observations by student ID.
 * @param studentId - The ID of the student.
 * @returns Array of observations for the student.
 */
export async function getObservationsByStudent(studentId: string): Promise<ObservationRow[]> {
    const all = await getObservations();
    return all.filter(obs => obs.studentId === studentId);
}

export async function getObservationsForContext(input: {
    studentId: string;
    teacherKey?: string;
    classId?: string;
}): Promise<ObservationRow[]> {
    const all = await getObservations();
    return all.filter((obs) => {
        if (obs.studentId !== input.studentId) return false;
        if (input.teacherKey && obs.teacherKey && obs.teacherKey !== input.teacherKey) return false;
        if (input.classId && obs.classId && obs.classId !== input.classId) return false;
        return true;
    });
}

/**
 * Retrieves observations by assessment ID.
 * @param assessmentId - The ID of the assessment.
 * @returns Array of observations for the assessment.
 */
export async function getObservationsByAssessment(assessmentId: string): Promise<ObservationRow[]> {
    const all = await getObservations();
    return all.filter(obs => obs.assessmentId === assessmentId);
}

/**
 * Adds a new observation memo.
 * @param observation - Observation data.
 * @returns The ID of the newly added observation.
 */
export async function addObservation(observation: Omit<ObservationRow, 'id' | 'createdAt'>): Promise<string> {
    const id = `obs-${Date.now()}`;
    const now = new Date().toISOString();
    await appendRow(SHEETS.OBSERVATIONS, [
        id,
        observation.studentId,
        observation.classId,
        observation.teacherKey,
        observation.assessmentId || '',
        observation.subjectName || '',
        observation.lessonTopic || '',
        observation.date,
        observation.memo,
        observation.evidenceType,
        JSON.stringify(observation.tags),
        observation.sourceType,
        observation.ocrData ? JSON.stringify(observation.ocrData) : '',
        observation.imageUrl || '',
        now,
        '',
    ]);
    return id;
}

/**
 * Updates an existing observation memo.
 * @param id - The ID of the observation to update.
 * @param data - Partial observation data.
 */
export async function updateObservation(id: string, data: Partial<ObservationRow>): Promise<void> {
    const rows = await readSheet(SHEETS.OBSERVATIONS);
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex > 0) {
        const current = (await getObservations()).find((observation) => observation.id === id);
        if (!current) return;
        const now = new Date().toISOString();
        await updateRow(SHEETS.OBSERVATIONS, rowIndex + 1, [
            id,
            data.studentId ?? current.studentId,
            data.classId ?? current.classId,
            data.teacherKey ?? current.teacherKey,
            data.assessmentId ?? current.assessmentId ?? '',
            data.subjectName ?? current.subjectName ?? '',
            data.lessonTopic ?? current.lessonTopic ?? '',
            data.date ?? current.date,
            data.memo ?? current.memo,
            data.evidenceType ?? current.evidenceType,
            JSON.stringify(data.tags ?? current.tags),
            data.sourceType ?? current.sourceType,
            data.ocrData ? JSON.stringify(data.ocrData) : current.ocrData ? JSON.stringify(current.ocrData) : '',
            data.imageUrl ?? current.imageUrl ?? '',
            current.createdAt,
            now,
        ]);
    }
}

/**
 * Deletes an observation memo by ID.
 * @param id - The ID of the observation to delete.
 */
export async function deleteObservation(id: string): Promise<void> {
    const rows = await readSheet(SHEETS.OBSERVATIONS);
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.OBSERVATIONS, rowIndex + 1);
    }
}

// ============ OCR Evaluation Operations ============

export interface OCREvaluationRow {
    id: string;
    year: number;
    semester: '1' | '2';
    grade: number;
    title: string;
    description: string;
    attachedFiles: string;        // JSON string
    achievementStandards: string; // JSON string
    scoringCriteria: string;      // JSON string
    ocrResults: string;           // JSON string
    memo: string;
    createdAt: string;
    updatedAt?: string;
    modelAnswer?: string;         // JSON string (optional)
    preliminaryGradings?: string; // JSON string (optional)
    teacherFeedback?: string;     // JSON string (optional)
    gradingSystemPrompt?: string; // string (optional)
    batchGradingResult?: string;  // JSON string (optional)
}

// Avoid storing large base64 payloads in Sheets cells.
function sanitizeAttachedFilesForSheet(files?: unknown[]): unknown[] {
    if (!Array.isArray(files)) return [];
    return files.map(file => {
        if (!file || typeof file !== 'object') return file;
        const sanitized = { ...(file as Record<string, unknown>) };
        delete sanitized.data;
        return sanitized;
    });
}

function sanitizeOCRResultsForSheet(results?: unknown[]): unknown[] {
    if (!Array.isArray(results)) return [];
    return results.map(result => {
        if (!result || typeof result !== 'object') return result;
        const sanitized = { ...(result as Record<string, unknown>) };
        delete sanitized.imageData;
        return sanitized;
    });
}

/**
 * Retrieves all OCR evaluation records.
 * @returns Array of OCR evaluation objects.
 */
export async function getOCREvaluations(): Promise<OCREvaluationRow[]> {
    const rows = await readSheet(SHEETS.OCR_EVALUATIONS);
    if (rows.length <= 1) return [];

    return rows.slice(1)
        .filter(row => row[0] && row[0].trim() !== '') // Filter out empty rows
        .map((row, index) => ({
            id: row[0] || `temp-${index}`,
            year: parseInt(row[1]) || new Date().getFullYear(),
            semester: (row[2] as '1' | '2') || '1',
            grade: parseInt(row[3]) || 1,
            title: row[4] || '(제목 없음)',
            description: row[5] || '',
            attachedFiles: row[6] || '[]',
            achievementStandards: row[7] || '[]',
            scoringCriteria: row[8] || '[]',
            ocrResults: row[9] || '[]',
            memo: row[10] || '',
            createdAt: row[11] || new Date().toISOString(),
            updatedAt: row[12] || undefined,
            modelAnswer: row[13] || undefined,
            preliminaryGradings: row[14] || undefined,
            teacherFeedback: row[15] || undefined,
            gradingSystemPrompt: row[16] || undefined,
            batchGradingResult: row[17] || undefined,
        }));
}

/**
 * Retrieves an OCR evaluation by ID.
 * @param id - The ID of the evaluation.
 * @returns The evaluation object or null if not found.
 */
export async function getOCREvaluationById(id: string): Promise<OCREvaluationRow | null> {
    const all = await getOCREvaluations();
    return all.find(e => e.id === id) || null;
}

/**
 * Retrieves OCR evaluations filtered by year, semester, and grade.
 * @param year - Optional year to filter by.
 * @param semester - Optional semester to filter by.
 * @param grade - Optional grade to filter by.
 * @returns Filtered array of OCR evaluations.
 */
export async function getOCREvaluationsByFilter(year?: number, semester?: '1' | '2', grade?: number): Promise<OCREvaluationRow[]> {
    const all = await getOCREvaluations();
    return all.filter(e => {
        if (year && e.year !== year) return false;
        if (semester && e.semester !== semester) return false;
        if (grade && e.grade !== grade) return false;
        return true;
    });
}

/**
 * Adds a new OCR evaluation record.
 * @param evaluation - Evaluation data.
 * @returns The ID of the newly added record.
 */
export async function addOCREvaluation(evaluation: {
    year: number;
    semester: '1' | '2';
    grade: number;
    title: string;
    description?: string;
    attachedFiles?: unknown[];
    achievementStandards?: unknown[];
    scoringCriteria?: unknown[];
    ocrResults?: unknown[];
    memo?: string;
    modelAnswer?: unknown;
    preliminaryGradings?: unknown[];
    teacherFeedback?: unknown;
    gradingSystemPrompt?: string;
    batchGradingResult?: unknown;
}): Promise<string> {
    const id = `ocr-eval-${Date.now()}`;
    const now = new Date().toISOString();

    // Sanitize large data
    const sanitizedFiles = sanitizeAttachedFilesForSheet(evaluation.attachedFiles);
    const sanitizedResults = sanitizeOCRResultsForSheet(evaluation.ocrResults);

    await appendRow(SHEETS.OCR_EVALUATIONS, [
        id,
        String(evaluation.year),
        evaluation.semester,
        String(evaluation.grade),
        evaluation.title,
        evaluation.description || '',
        JSON.stringify(sanitizedFiles),
        JSON.stringify(evaluation.achievementStandards || []),
        JSON.stringify(evaluation.scoringCriteria || []),
        JSON.stringify(sanitizedResults),
        evaluation.memo || '',
        now,
        '',
        evaluation.modelAnswer ? JSON.stringify(evaluation.modelAnswer) : '',
        evaluation.preliminaryGradings ? JSON.stringify(evaluation.preliminaryGradings) : '',
        evaluation.teacherFeedback ? JSON.stringify(evaluation.teacherFeedback) : '',
        evaluation.gradingSystemPrompt || '',
        evaluation.batchGradingResult ? JSON.stringify(evaluation.batchGradingResult) : '',
    ]);
    return id;
}

export async function updateOCREvaluation(id: string, evaluation: Partial<{
    year: number;
    semester: '1' | '2';
    grade: number;
    title: string;
    description: string;
    attachedFiles: unknown[];
    achievementStandards: unknown[];
    scoringCriteria: unknown[];
    ocrResults: unknown[];
    memo: string;
    modelAnswer: unknown;
    preliminaryGradings: unknown[];
    teacherFeedback: unknown;
    gradingSystemPrompt: string;
    batchGradingResult: unknown;
}>): Promise<void> {
    const rows = await readSheet(SHEETS.OCR_EVALUATIONS);
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex > 0) {
        const currentRow = rows[rowIndex];
        const now = new Date().toISOString();

        // Data preparation handling partial updates
        let sanitizedFiles = evaluation.attachedFiles;
        if (sanitizedFiles) sanitizedFiles = sanitizeAttachedFilesForSheet(sanitizedFiles);

        let sanitizedResults = evaluation.ocrResults;
        if (sanitizedResults) sanitizedResults = sanitizeOCRResultsForSheet(sanitizedResults);

        await updateRow(SHEETS.OCR_EVALUATIONS, rowIndex + 1, [
            id,
            evaluation.year ? String(evaluation.year) : currentRow[1],
            evaluation.semester ?? currentRow[2],
            evaluation.grade ? String(evaluation.grade) : currentRow[3],
            evaluation.title ?? currentRow[4],
            evaluation.description ?? currentRow[5],
            sanitizedFiles ? JSON.stringify(sanitizedFiles) : currentRow[6],
            evaluation.achievementStandards ? JSON.stringify(evaluation.achievementStandards) : currentRow[7],
            evaluation.scoringCriteria ? JSON.stringify(evaluation.scoringCriteria) : currentRow[8],
            sanitizedResults ? JSON.stringify(sanitizedResults) : currentRow[9],
            evaluation.memo ?? currentRow[10],
            currentRow[11], // createdAt
            now, // updatedAt
            evaluation.modelAnswer ? JSON.stringify(evaluation.modelAnswer) : currentRow[13] || '',
            evaluation.preliminaryGradings ? JSON.stringify(evaluation.preliminaryGradings) : currentRow[14] || '',
            evaluation.teacherFeedback ? JSON.stringify(evaluation.teacherFeedback) : currentRow[15] || '',
            (evaluation.gradingSystemPrompt ?? currentRow[16]) || '',
            evaluation.batchGradingResult ? JSON.stringify(evaluation.batchGradingResult) : currentRow[17] || '',
        ]);
    }
}

export async function deleteOCREvaluation(id: string): Promise<void> {
    const rows = await readSheet(SHEETS.OCR_EVALUATIONS);
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.OCR_EVALUATIONS, rowIndex + 1);
    }
}
