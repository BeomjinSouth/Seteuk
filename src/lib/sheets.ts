import { google } from 'googleapis';

/**
 * Google Sheets Database Service
 * 
 * 이 서비스는 Google Sheets를 간이 데이터베이스로 활용합니다.
 * 
 * 필요한 시트 구조:
 * 1. "학생" 시트: id, classId, number, name, learningData (JSON)
 * 2. "반" 시트: id, grade, classNumber, subjectName, semester, year
 * 3. "세특" 시트: id, studentId, classId, content, status, lastUpdated
 * 4. "설정" 시트: key, value
 * 5. "예시양식" 시트: id, name, content, createdAt
 */

// Google Sheets API 초기화
function getAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

function getSheets() {
    const auth = getAuth();
    return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;

// Sheet names
const SHEETS = {
    STUDENTS: '학생',
    CLASSES: '반',
    RECORDS: '세특',
    SETTINGS: '설정',
    EXAMPLES: '예시양식',
} as const;

// ============ Generic CRUD Operations ============

/**
 * 시트에서 모든 데이터 읽기
 */
export async function readSheet(sheetName: string): Promise<string[][]> {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
    });
    return response.data.values || [];
}

/**
 * 시트에 행 추가
 */
export async function appendRow(sheetName: string, values: string[]): Promise<void> {
    const sheets = getSheets();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:Z`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [values],
        },
    });
}

/**
 * 시트의 특정 행 업데이트
 */
export async function updateRow(sheetName: string, rowIndex: number, values: string[]): Promise<void> {
    const sheets = getSheets();
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [values],
        },
    });
}

/**
 * 시트의 특정 행 삭제 (실제로는 빈 값으로 덮어쓰기)
 */
export async function deleteRow(sheetName: string, rowIndex: number): Promise<void> {
    const sheets = getSheets();
    await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
            requests: [{
                deleteDimension: {
                    range: {
                        sheetId: await getSheetId(sheetName),
                        dimension: 'ROWS',
                        startIndex: rowIndex - 1,
                        endIndex: rowIndex,
                    },
                },
            }],
        },
    });
}

/**
 * 시트 ID 가져오기
 */
async function getSheetId(sheetName: string): Promise<number> {
    const sheets = getSheets();
    const response = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = response.data.sheets?.find(s => s.properties?.title === sheetName);
    return sheet?.properties?.sheetId || 0;
}

// ============ Student Operations ============

export interface StudentRow {
    id: string;
    classId: string;
    number: number;
    name: string;
    learningData: Record<string, string>;
}

export async function getStudents(): Promise<StudentRow[]> {
    const rows = await readSheet(SHEETS.STUDENTS);
    if (rows.length <= 1) return []; // Skip header row

    return rows.slice(1).map(row => ({
        id: row[0],
        classId: row[1],
        number: parseInt(row[2]) || 0,
        name: row[3],
        learningData: row[4] ? JSON.parse(row[4]) : {},
    }));
}

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

// ============ Record Operations ============

export interface RecordRow {
    id: string;
    studentId: string;
    classId: string;
    content: string;
    status: 'draft' | 'checked' | 'confirmed';
    lastUpdated: string;
    spellerErrors?: number;
    forbiddenWords?: number;
}

export async function getRecords(): Promise<RecordRow[]> {
    const rows = await readSheet(SHEETS.RECORDS);
    if (rows.length <= 1) return [];

    return rows.slice(1).map(row => ({
        id: row[0],
        studentId: row[1],
        classId: row[2],
        content: row[3],
        status: (row[4] as RecordRow['status']) || 'draft',
        lastUpdated: row[5],
        spellerErrors: row[6] ? parseInt(row[6]) : undefined,
        forbiddenWords: row[7] ? parseInt(row[7]) : undefined,
    }));
}

export async function saveRecord(record: RecordRow): Promise<void> {
    const rows = await readSheet(SHEETS.RECORDS);
    const existingIndex = rows.findIndex(row => row[0] === record.id);

    const values = [
        record.id,
        record.studentId,
        record.classId,
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
}

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

export async function deleteExample(id: string): Promise<void> {
    const rows = await readSheet(SHEETS.EXAMPLES);
    const rowIndex = rows.findIndex(row => row[0] === id);
    if (rowIndex > 0) {
        await deleteRow(SHEETS.EXAMPLES, rowIndex + 1);
    }
}

// ============ Settings Operations ============

export async function getSetting(key: string): Promise<string | null> {
    const rows = await readSheet(SHEETS.SETTINGS);
    const row = rows.find(r => r[0] === key);
    return row ? row[1] : null;
}

export async function setSetting(key: string, value: string): Promise<void> {
    const rows = await readSheet(SHEETS.SETTINGS);
    const existingIndex = rows.findIndex(row => row[0] === key);

    if (existingIndex > 0) {
        await updateRow(SHEETS.SETTINGS, existingIndex + 1, [key, value]);
    } else {
        await appendRow(SHEETS.SETTINGS, [key, value]);
    }
}
