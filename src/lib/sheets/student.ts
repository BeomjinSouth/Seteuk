import { readSheet, writeSheet, SHEETS } from './base';

export interface StudentRow {
    id: string;
    classId: string;
    number: number;
    name: string;
    grade?: number;
    school?: string;
    classNumber?: number;
    learningData: Record<string, string>;
    classLearningData?: Record<string, Record<string, string>>;
}

export interface SchoolRosterMergeResult {
    students: StudentRow[];
    addedCount: number;
    updatedCount: number;
    skippedCount: number;
}

const STUDENT_HEADERS = [
    'id',
    'classId',
    'number',
    'name',
    'grade',
    'school',
    'classNumber',
    'learningData',
    'classLearningData',
];

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

function parseClassLearningData(raw: string | undefined): Record<string, Record<string, string>> {
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed as Record<string, Record<string, string>>
            : {};
    } catch {
        return {};
    }
}

function parseOptionalNumber(raw: string | undefined): number | undefined {
    if (!raw) return undefined;
    const value = Number.parseInt(raw.trim(), 10);
    return Number.isFinite(value) && value > 0 ? value : undefined;
}

function slugify(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9가-힣-]/g, '');
}

function parseHomeroomClassId(classId: string) {
    const match = classId.match(/^home-(.+)-(\d+)-(\d+)$/);
    if (!match) return null;

    return {
        schoolSlug: match[1],
        grade: Number.parseInt(match[2], 10),
        classNumber: Number.parseInt(match[3], 10),
    };
}

function isStudentHeaderRow(row?: string[]): boolean {
    if (!row) return false;
    return STUDENT_HEADERS.every((header, index) => row[index] === header);
}

function normalizeStudentRow(student: StudentRow): StudentRow {
    const parsedClass = parseHomeroomClassId(student.classId);

    return {
        ...student,
        grade: student.grade ?? parsedClass?.grade,
        school: student.school,
        classNumber: student.classNumber ?? parsedClass?.classNumber,
        learningData: student.learningData || {},
        classLearningData: student.classLearningData || {},
    };
}

function studentToRow(student: StudentRow): string[] {
    const normalized = normalizeStudentRow(student);
    return [
        normalized.id,
        normalized.classId,
        String(normalized.number),
        normalized.name,
        normalized.grade ? String(normalized.grade) : '',
        normalized.school || '',
        normalized.classNumber ? String(normalized.classNumber) : '',
        JSON.stringify(normalized.learningData || {}),
        JSON.stringify(normalized.classLearningData || {}),
    ];
}

function rowToStudent(row: string[]): StudentRow | null {
    const id = (row[0] || '').trim();
    const classId = (row[1] || '').trim();
    const number = Number.parseInt((row[2] || '').trim(), 10);
    const name = (row[3] || '').trim();

    if (!id || !classId || !name || !Number.isFinite(number) || number <= 0) {
        return null;
    }

    const parsedClass = parseHomeroomClassId(classId);

    return {
        id,
        classId,
        number,
        name,
        grade: parseOptionalNumber(row[4]) ?? parsedClass?.grade,
        school: (row[5] || '').trim() || undefined,
        classNumber: parseOptionalNumber(row[6]) ?? parsedClass?.classNumber,
        learningData: parseLearningData(row[7] || row[4]),
        classLearningData: parseClassLearningData(row[8]),
    };
}

function isSameSchool(student: StudentRow, school: string): boolean {
    if (student.school) {
        return slugify(student.school) === slugify(school);
    }

    return parseHomeroomClassId(student.classId)?.schoolSlug === slugify(school);
}

function dedupeStudents(students: StudentRow[]): StudentRow[] {
    const orderedIds: string[] = [];
    const nextById = new Map<string, StudentRow>();

    students.forEach((student) => {
        const normalized = normalizeStudentRow(student);
        const existing = nextById.get(normalized.id);
        if (!existing) {
            orderedIds.push(normalized.id);
            nextById.set(normalized.id, normalized);
            return;
        }

        nextById.set(normalized.id, {
            ...existing,
            ...normalized,
            learningData: existing.learningData ?? normalized.learningData ?? {},
            classLearningData: {
                ...(existing.classLearningData || {}),
                ...(normalized.classLearningData || {}),
            },
        });
    });

    return orderedIds
        .map((id) => nextById.get(id))
        .filter((student): student is StudentRow => student !== undefined);
}

function hasSameRosterSnapshot(existing: StudentRow, incoming: StudentRow): boolean {
    const normalizedExisting = normalizeStudentRow(existing);
    const normalizedIncoming = normalizeStudentRow(incoming);

    return normalizedExisting.classId === normalizedIncoming.classId
        && normalizedExisting.number === normalizedIncoming.number
        && normalizedExisting.name === normalizedIncoming.name
        && normalizedExisting.grade === normalizedIncoming.grade
        && normalizedExisting.school === normalizedIncoming.school
        && normalizedExisting.classNumber === normalizedIncoming.classNumber;
}

function mergeStudentRow(existing: StudentRow, incoming: StudentRow): StudentRow {
    return {
        ...existing,
        ...incoming,
        learningData: existing.learningData ?? incoming.learningData ?? {},
        classLearningData: {
            ...(existing.classLearningData || {}),
            ...(incoming.classLearningData || {}),
        },
    };
}

/**
 * Retrieves all students from the "Student" sheet.
 * @returns Array of student objects.
 */
export async function getStudents(filters?: { school?: string; grade?: number }): Promise<StudentRow[]> {
    const rows = await readSheet(SHEETS.STUDENTS);
    const dataRows = isStudentHeaderRow(rows[0]) ? rows.slice(1) : rows;

    return dataRows
        .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
        .map(rowToStudent)
        .filter((student): student is StudentRow => student !== null)
        .filter((student) => !filters?.school || isSameSchool(student, filters.school))
        .filter((student) => !filters?.grade || student.grade === filters.grade);
}

/**
 * Inserts or updates multiple students by ID while preserving existing learning data.
 * @param students - Student rows to insert or update.
 */
async function upsertStudents(students: StudentRow[]): Promise<void> {
    const existingStudents = await getStudents();
    const existingOrder = existingStudents.map((student) => student.id);
    const updates = dedupeStudents(students);
    const updateMap = new Map(updates.map((student) => [student.id, student]));

    const mergedExisting = existingStudents.map((student) => {
        const update = updateMap.get(student.id);
        if (!update) return student;

        updateMap.delete(student.id);
        return {
            ...student,
            ...update,
            learningData: student.learningData ?? update.learningData ?? {},
            classLearningData: {
                ...(student.classLearningData || {}),
                ...(update.classLearningData || {}),
            },
        };
    });

    const appendedStudents = updates.filter((student) => !existingOrder.includes(student.id));
    const nextStudents = [...mergedExisting, ...appendedStudents];

    await writeSheet(SHEETS.STUDENTS, [
        STUDENT_HEADERS,
        ...nextStudents.map(studentToRow),
    ]);
}

/**
 * Merges a school's uploaded roster into shared storage while deduplicating overlaps.
 * @param school - School name.
 * @param students - Full roster payload for that school.
 */
export async function mergeStudentsForSchool(school: string, students: StudentRow[]): Promise<SchoolRosterMergeResult> {
    const existingStudents = await getStudents();
    const preservedOtherSchools = existingStudents.filter((student) => !isSameSchool(student, school));
    const existingSchoolStudents = existingStudents.filter((student) => isSameSchool(student, school));
    const existingById = new Map(existingSchoolStudents.map((student) => [student.id, student]));
    const mergedSchoolStudents = [...existingSchoolStudents];
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    dedupeStudents(students).forEach((student) => {
        const existing = existingById.get(student.id);
        if (!existing) {
            mergedSchoolStudents.push(normalizeStudentRow(student));
            addedCount += 1;
            return;
        }

        if (hasSameRosterSnapshot(existing, student)) {
            skippedCount += 1;
            return;
        }

        const mergedStudent = mergeStudentRow(existing, student);
        const index = mergedSchoolStudents.findIndex((item) => item.id === student.id);
        if (index >= 0) {
            mergedSchoolStudents[index] = mergedStudent;
        }
        existingById.set(student.id, mergedStudent);
        updatedCount += 1;
    });

    const nextStudents = dedupeStudents([
        ...preservedOtherSchools,
        ...mergedSchoolStudents,
    ]);

    await writeSheet(SHEETS.STUDENTS, [
        STUDENT_HEADERS,
        ...nextStudents.map(studentToRow),
    ]);

    return {
        students: mergedSchoolStudents
            .map((student) => nextStudents.find((item) => item.id === student.id) || student)
            .map((student) => normalizeStudentRow(student)),
        addedCount,
        updatedCount,
        skippedCount,
    };
}

/**
 * Adds a new student to the "Student" sheet.
 * @param student - Student data (excluding ID).
 * @returns The ID of the newly added student.
 */
export async function addStudent(student: Omit<StudentRow, 'id'>): Promise<string> {
    const id = `s-${Date.now()}`;
    await upsertStudents([{ id, ...student }]);
    return id;
}

/**
 * Updates an existing student's data.
 * @param id - The ID of the student to update.
 * @param data - Partial student data to update.
 */
export async function updateStudent(id: string, data: Partial<StudentRow>): Promise<void> {
    const students = await getStudents();
    const current = students.find((student) => student.id === id);
    if (!current) return;

    const nextStudents = students.map((student) => {
        if (student.id !== id) return student;
        return {
            ...student,
            ...data,
            learningData: data.learningData ?? student.learningData,
            classLearningData: data.classLearningData
                ? {
                    ...(student.classLearningData || {}),
                    ...data.classLearningData,
                }
                : student.classLearningData,
        };
    });

    await writeSheet(SHEETS.STUDENTS, [
        STUDENT_HEADERS,
        ...nextStudents.map(studentToRow),
    ]);
}
