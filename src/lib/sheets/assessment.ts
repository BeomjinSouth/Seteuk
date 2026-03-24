import { readSheet, appendRow, updateRow, deleteRow, SHEETS } from './base';

export interface AssessmentRow {
    id: string;
    title: string;
    unit: string;
    achievementStandard: string;
    assessmentDate: string;
    competencyTags: string[];
    description: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Retrieves all assessment tasks.
 * @returns Array of assessment objects.
 */
export async function getAssessments(): Promise<AssessmentRow[]> {
    const rows = await readSheet(SHEETS.ASSESSMENTS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        id: row[0],
        title: row[1] || '',
        unit: row[2] || '',
        achievementStandard: row[3] || '',
        assessmentDate: row[4] || '',
        competencyTags: row[5] ? JSON.parse(row[5]) : [],
        description: row[6] || '',
        createdAt: row[7] || '',
        updatedAt: row[8] || undefined,
    }));
}

/**
 * Adds a new assessment task.
 * @param assessment - Assessment data.
 * @returns The ID of the newly added assessment.
 */
export async function addAssessment(assessment: Omit<AssessmentRow, 'id' | 'createdAt'>): Promise<string> {
    const id = `assess-${Date.now()}`;
    const now = new Date().toISOString();
    await appendRow(SHEETS.ASSESSMENTS, [
        id,
        assessment.title,
        assessment.unit,
        assessment.achievementStandard,
        assessment.assessmentDate,
        JSON.stringify(assessment.competencyTags),
        assessment.description,
        now,
        '',
    ]);
    return id;
}

/**
 * Updates an existing assessment task.
 * @param id - The ID of the assessment to update.
 * @param data - Partial assessment data.
 */
export async function updateAssessment(id: string, data: Partial<AssessmentRow>): Promise<void> {
    const rows = await readSheet(SHEETS.ASSESSMENTS);
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex > 0) {
        const currentRow = rows[rowIndex];
        const now = new Date().toISOString();
        await updateRow(SHEETS.ASSESSMENTS, rowIndex + 1, [
            id,
            data.title ?? currentRow[1],
            data.unit ?? currentRow[2],
            data.achievementStandard ?? currentRow[3],
            data.assessmentDate ?? currentRow[4],
            data.competencyTags ? JSON.stringify(data.competencyTags) : currentRow[5],
            data.description ?? currentRow[6],
            currentRow[7], // createdAt stays the same
            now, // updatedAt
        ]);
    }
}

/**
 * Deletes an assessment task by ID.
 * @param id - The ID of the assessment to delete.
 */
export async function deleteAssessment(id: string): Promise<void> {
    const rows = await readSheet(SHEETS.ASSESSMENTS);
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.ASSESSMENTS, rowIndex + 1);
    }
}
