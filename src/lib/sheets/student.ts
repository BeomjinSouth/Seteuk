import { readSheet, appendRow, updateRow, SHEETS } from './base';

export interface StudentRow {
    id: string;
    classId: string;
    number: number;
    name: string;
    learningData: Record<string, string>;
}

function parseLearningData(raw: string | undefined): Record<string, string> {
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed as Record<string, string>
            : {};
    } catch {
        return {};
    }
}

/**
 * Retrieves all students from the "Student" sheet.
 * @returns Array of student objects.
 */
export async function getStudents(): Promise<StudentRow[]> {
    const rows = await readSheet(SHEETS.STUDENTS);
    if (rows.length <= 1) return []; // Skip header row

    return rows
        .slice(1)
        .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
        .map((row) => {
            const id = (row[0] || '').trim();
            const classId = (row[1] || '').trim();
            const number = Number.parseInt((row[2] || '').trim(), 10);
            const name = (row[3] || '').trim();

            if (!id || !classId || !name || !Number.isFinite(number) || number <= 0) {
                return null;
            }

            return {
                id,
                classId,
                number,
                name,
                learningData: parseLearningData(row[4]),
            };
        })
        .filter((student): student is StudentRow => student !== null);
}

/**
 * Adds a new student to the "Student" sheet.
 * @param student - Student data (excluding ID).
 * @returns The ID of the newly added student.
 */
export async function addStudent(student: Omit<StudentRow, 'id'>): Promise<string> {
    const id = `s-${Date.now()}`;
    await appendRow(SHEETS.STUDENTS, [
        id,
        student.classId,
        String(student.number),
        student.name,
        JSON.stringify(student.learningData),
    ]);
    return id;
}

/**
 * Updates an existing student's data.
 * @param id - The ID of the student to update.
 * @param data - Partial student data to update.
 */
export async function updateStudent(id: string, data: Partial<StudentRow>): Promise<void> {
    const rows = await readSheet(SHEETS.STUDENTS);
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex > 0) {
        const currentRow = rows[rowIndex];
        await updateRow(SHEETS.STUDENTS, rowIndex + 1, [
            id,
            data.classId ?? currentRow[1],
            String(data.number ?? currentRow[2]),
            data.name ?? currentRow[3],
            data.learningData ? JSON.stringify(data.learningData) : currentRow[4],
        ]);
    }
}

// ============ Class Operations ============

export interface ClassRow {
    id: string;
    grade: number;
    classNumber: number;
    subjectName: string;
    semester: string;
    year: number;
}

/**
 * Retrieves all classes from the "Class" sheet.
 * @returns Array of class objects.
 */
export async function getClasses(): Promise<ClassRow[]> {
    const rows = await readSheet(SHEETS.CLASSES);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        id: row[0],
        grade: parseInt(row[1]) || 0,
        classNumber: parseInt(row[2]) || 0,
        subjectName: row[3],
        semester: row[4],
        year: parseInt(row[5]) || 2025,
    }));
}

/**
 * Adds a new class to the "Class" sheet.
 * @param cls - Class data (excluding ID).
 * @returns The ID of the newly added class.
 */
export async function addClass(cls: Omit<ClassRow, 'id'>): Promise<string> {
    const id = `c-${Date.now()}`;
    await appendRow(SHEETS.CLASSES, [
        id,
        String(cls.grade),
        String(cls.classNumber),
        cls.subjectName,
        cls.semester,
        String(cls.year),
    ]);
    return id;
}
