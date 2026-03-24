import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';

// Google Sheets API 초기화
export function getAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

export function getSheets() {
    const auth = getAuth();
    return google.sheets({ version: 'v4', auth });
}

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID!;
const LOCAL_SHEET_STORE_PATH = path.join(process.cwd(), '.local-sheet-store.json');
type LocalSheetStore = Record<string, string[][]>;

function shouldUseLocalSheetFallback() {
    return process.env.NODE_ENV !== 'production';
}

async function readLocalSheetStore(): Promise<LocalSheetStore> {
    try {
        const raw = await fs.readFile(LOCAL_SHEET_STORE_PATH, 'utf8');
        return JSON.parse(raw) as LocalSheetStore;
    } catch {
        return {};
    }
}

async function writeLocalSheetStore(store: LocalSheetStore): Promise<void> {
    await fs.writeFile(LOCAL_SHEET_STORE_PATH, JSON.stringify(store, null, 2), 'utf8');
}

async function ensureLocalSheet(sheetName: string): Promise<LocalSheetStore> {
    const store = await readLocalSheetStore();
    if (!store[sheetName]) {
        store[sheetName] = [[]];
        await writeLocalSheetStore(store);
    }
    return store;
}

async function withLocalFallback<T>(sheetName: string, operation: string, callback: () => Promise<T>): Promise<T> {
    try {
        return await callback();
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) {
            throw error;
        }
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[sheets] ${operation} failed for "${sheetName}", using local fallback instead: ${message}`);
        throw error;
    }
}

// Sheet names
export const SHEETS = {
    STUDENTS: '\uD559\uC0DD', // 학생
    CLASSES: '\uBC18', // 반
    RECORDS: '\uC138\uD2B9', // 세특
    SETTINGS: '\uC124\uC815', // 설정
    EXAMPLES: '\uC608\uC2DC\uC591\uC2DD', // 예시양식
    ASSESSMENTS: '\uD3C9\uAC00\uACFC\uC81C', // 평가과제
    OBSERVATIONS: '\uAD00\uC230\uBA54\uBAA8', // 관찰메모
    OCR_EVALUATIONS: 'OCR\uD3C9\uAC00', // OCR평가
    // 평가 점검 시스템 시트
    EVAL_CHECK_SETTINGS: 'EC_\uC124\uC815', // EC_설정
    EVAL_CHECK_DOCUMENTS: 'EC_\uBB38\uC11C', // EC_문서
    EVAL_CHECK_RESOURCES: 'EC_\uB9AC\uC18C\uC2A4', // EC_리소스
    EVAL_CHECK_QUESTIONS: 'EC_\uBB38\uD56D', // EC_문항
    EVAL_CHECK_ISSUES: 'EC_\uBB38\uC81C\uC810_\uC694\uC57D', // EC_문제점_요약
    EVAL_CHECK_RULES: 'EC_\uADDC\uCE59', // EC_규칙
    EVAL_CHECK_LOGS: 'EC_\uC791\uC5C5\uB85C\uADF8', // EC_작업로그
} as const;

/**
 * Converts a 1-based column number to A1 notation letters (1 -> A, 27 -> AA).
 * @param n - 1-based column number.
 * @returns The column letters.
 */
export function columnNumberToLetters(n: number): string {
    let result = '';
    let num = n;
    while (num > 0) {
        const rem = (num - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        num = Math.floor((num - 1) / 26);
    }
    return result;
}

/**
 * Reads all data from a sheet.
 * Reads liberally up to column ZZ to ensure all data is captured.
 * 
 * @param sheetName - The name of the sheet to read.
 * @returns 2D array of string values.
 */
export async function readSheet(sheetName: string): Promise<string[][]> {
    try {
        const sheets = getSheets();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:ZZ`,
        });
        return response.data.values || [];
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        if (message.includes('Unable to parse range') || message.includes('not found')) {
            console.warn(`Sheet "${sheetName}" not found. Returning empty array.`);
            return [];
        }
        if (!shouldUseLocalSheetFallback()) throw error;
        console.warn(`[sheets] read failed for "${sheetName}", using local fallback instead: ${message}`);
        const store = await readLocalSheetStore();
        return store[sheetName] || [];
    }
}

/**
 * Appends a row to a sheet.
 * Always appends starting from column A to ensure consistency.
 * 
 * @param sheetName - Target sheet name.
 * @param values - Array of values to append (one row).
 */
export async function appendRow(sheetName: string, values: string[]): Promise<void> {
    try {
        const sheets = getSheets();
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1`,
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [values],
            },
        });
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await ensureLocalSheet(sheetName);
        store[sheetName].push(values);
        await writeLocalSheetStore(store);
    }
}

/**
 * Updates a specific row in a sheet.
 * Updates only the columns provided in valus.
 * 
 * @param sheetName - Target sheet name.
 * @param rowIndex - 1-based row index.
 * @param values - Values to update.
 */
export async function updateRow(sheetName: string, rowIndex: number, values: string[]): Promise<void> {
    try {
        const sheets = getSheets();

        const endCol = columnNumberToLetters(Math.max(values.length, 1));
        const range = `${sheetName}!A${rowIndex}:${endCol}${rowIndex}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await ensureLocalSheet(sheetName);
        while (store[sheetName].length < rowIndex) {
            store[sheetName].push([]);
        }
        store[sheetName][rowIndex - 1] = values;
        await writeLocalSheetStore(store);
    }
}

/**
 * Deletes a specific row in a sheet.
 * 
 * @param sheetName - Target sheet name.
 * @param rowIndex - 1-based row index to delete.
 */
export async function deleteRow(sheetName: string, rowIndex: number): Promise<void> {
    try {
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
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await ensureLocalSheet(sheetName);
        store[sheetName].splice(rowIndex - 1, 1);
        await writeLocalSheetStore(store);
    }
}

/**
 * Retrieves the numeric Sheet ID (gid) by sheet name.
 */
export async function getSheetId(sheetName: string): Promise<number> {
    try {
        const sheets = getSheets();
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const sheet = response.data.sheets?.find(s => s.properties?.title === sheetName);
        return sheet?.properties?.sheetId || 0;
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        return 0;
    }
}

/**
 * Deletes multiple rows from a sheet in a single batchUpdate call.
 * Row indices are sorted descending internally so earlier deletions
 * do not shift later indices.
 *
 * @param sheetName - Target sheet name.
 * @param rowIndices - Array of 1-based row indices to delete.
 */
export async function deleteRows(sheetName: string, rowIndices: number[]): Promise<void> {
    if (rowIndices.length === 0) return;

    try {
        const sheetId = await getSheetId(sheetName);
        const sheets = getSheets();
        const sorted = [...rowIndices].sort((a, b) => b - a);

        const requests = sorted.map(rowIndex => ({
            deleteDimension: {
                range: {
                    sheetId,
                    dimension: 'ROWS' as const,
                    startIndex: rowIndex - 1,
                    endIndex: rowIndex,
                },
            },
        }));

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: { requests },
        });
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await ensureLocalSheet(sheetName);
        const sorted = [...rowIndices].sort((a, b) => b - a);
        sorted.forEach((rowIndex) => {
            store[sheetName].splice(rowIndex - 1, 1);
        });
        await writeLocalSheetStore(store);
    }
}

/**
 * Ensures all sheets defined in the SHEETS constant exist in the spreadsheet.
 * Creates any missing sheets.
 */
export async function initializeSheets(): Promise<{ created: string[]; errors: string[] }> {
    try {
        const sheets = getSheets();
        const response = await sheets.spreadsheets.get({
            spreadsheetId: SPREADSHEET_ID,
        });

        const existingSheetNames = new Set(
            response.data.sheets?.map(s => s.properties?.title).filter((t): t is string => !!t) || []
        );

        const sheetsToCreate = Object.values(SHEETS).filter(sheetName => !existingSheetNames.has(sheetName));

        if (sheetsToCreate.length === 0) {
            return { created: [], errors: [] };
        }

        const requests = sheetsToCreate.map(sheetName => ({
            addSheet: {
                properties: {
                    title: sheetName,
                },
            },
        }));

        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                requests,
            },
        });

        console.log(`Created missing sheets: ${sheetsToCreate.join(', ')}`);
        return { created: sheetsToCreate, errors: [] };
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await readLocalSheetStore();
        const created: string[] = [];
        Object.values(SHEETS).forEach((sheetName) => {
            if (!store[sheetName]) {
                store[sheetName] = [[]];
                created.push(sheetName);
            }
        });
        await writeLocalSheetStore(store);
        return { created, errors: [] };
    }
}
