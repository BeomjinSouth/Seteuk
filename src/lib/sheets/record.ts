import { readSheet, appendRow, updateRow, SHEETS } from './base';

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
