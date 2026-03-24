import { readSheet, appendRow, updateRow, deleteRow, SHEETS } from './base';

export interface RecordRow {
    id: string;
    studentId: string;
    classId: string;
    teacherKey?: string;
    content: string;
    status: 'draft' | 'checked' | 'confirmed';
    lastUpdated: string;
    spellerErrors?: number;
    forbiddenWords?: number;
}

/**
 * Retrieves all subject records from the "Record" sheet.
 * @returns Array of record objects.
 */
export async function getRecords(): Promise<RecordRow[]> {
    const rows = await readSheet(SHEETS.RECORDS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map((row) => {
        const isLegacyRow = row.length < 9;
        if (isLegacyRow) {
            return {
                id: row[0],
                studentId: row[1],
                classId: row[2],
                content: row[3],
                status: (row[4] as RecordRow['status']) || 'draft',
                lastUpdated: row[5],
                spellerErrors: row[6] ? parseInt(row[6]) : undefined,
                forbiddenWords: row[7] ? parseInt(row[7]) : undefined,
            };
        }

        return {
            id: row[0],
            studentId: row[1],
            classId: row[2],
            teacherKey: row[3] || undefined,
            content: row[4],
            status: (row[5] as RecordRow['status']) || 'draft',
            lastUpdated: row[6],
            spellerErrors: row[7] ? parseInt(row[7]) : undefined,
            forbiddenWords: row[8] ? parseInt(row[8]) : undefined,
        };
    });
}

/**
 * Saves a subject record (create or update).
 * If the ID exists, it updates the row; otherwise, it appends a new row.
 * @param record - The record object to save.
 */
export async function saveRecord(record: RecordRow): Promise<void> {
    const rows = await readSheet(SHEETS.RECORDS);
    const existingIndex = rows.findIndex(row => row[0] === record.id);

    const values = [
        record.id,
        record.studentId,
        record.classId,
        record.teacherKey || '',
        record.content,
        record.status,
        record.lastUpdated,
        String(record.spellerErrors ?? ''),
        String(record.forbiddenWords ?? ''),
    ];

    if (existingIndex > 0) {
        await updateRow(SHEETS.RECORDS, existingIndex + 1, values);
    } else {
        await appendRow(SHEETS.RECORDS, values);
    }
}

// ============ Example Template Operations ============

export interface ExampleRow {
    id: string;
    name: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
}

/**
 * Retrieves all example templates from the "ExampleTemplates" sheet.
 * @returns Array of example templates.
 */
export async function getExamples(): Promise<ExampleRow[]> {
    const rows = await readSheet(SHEETS.EXAMPLES);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        id: row[0],
        name: row[1],
        content: row[2],
        createdAt: row[3],
    }));
}

/**
 * Adds a new example template.
 * @param example - Example template data.
 * @returns The ID of the newly added example.
 */
export async function addExample(example: Omit<ExampleRow, 'id'>): Promise<string> {
    const id = `ex-${Date.now()}`;
    await appendRow(SHEETS.EXAMPLES, [
        id,
        example.name,
        example.content,
        example.createdAt,
    ]);
    return id;
}

/**
 * Deletes an example template by ID.
 * @param id - The ID of the example to delete.
 */
export async function deleteExample(id: string): Promise<void> {
    const rows = await readSheet(SHEETS.EXAMPLES);
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.EXAMPLES, rowIndex + 1);
    }
}
