import { google } from 'googleapis';
import { promises as fs } from 'fs';
import path from 'path';
import { isSupabaseConfigured, isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import {
    appendSupabaseSheetRow,
    deleteSupabaseSheetRows,
    readSupabaseSheet,
    updateSupabaseSheetRow,
    writeSupabaseSheet,
} from '@/lib/supabase/sheet-store';

function stripWrappingQuotes(value: string): string {
    const trimmed = value.trim();
    const quotePairs: Array<[string, string]> = [
        ['"', '"'],
        ["'", "'"],
        ['\\"', '\\"'],
        ["\\'", "\\'"],
    ];

    const pair = quotePairs.find(([start, end]) =>
        trimmed.startsWith(start)
        && trimmed.endsWith(end)
        && trimmed.length > start.length + end.length
    );

    return pair
        ? trimmed.slice(pair[0].length, trimmed.length - pair[1].length)
        : trimmed;
}

function normalizeGooglePrivateKey(raw?: string): string | undefined {
    if (!raw) return undefined;

    let privateKey = stripWrappingQuotes(raw)
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\r\n/g, '\n')
        .trim();

    if (!privateKey.includes('BEGIN') && /^[A-Za-z0-9+/=\s]+$/.test(privateKey)) {
        try {
            const decoded = Buffer.from(privateKey, 'base64').toString('utf8').trim();
            if (decoded.includes('BEGIN')) {
                privateKey = decoded;
            }
        } catch {
            // Keep the original value so GoogleAuth can surface the provider error.
        }
    }

    return privateKey;
}

// Google Sheets API initialization
function getAuth() {
    return new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim(),
            private_key: normalizeGooglePrivateKey(process.env.GOOGLE_PRIVATE_KEY),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
}

function getSheets() {
    const auth = getAuth();
    return google.sheets({ version: 'v4', auth });
}

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID?.trim() || '';
const LOCAL_SHEET_STORE_PATH = path.join(process.cwd(), '.local-sheet-store.json');
type LocalSheetStore = Record<string, string[][]>;

function shouldUseLocalSheetFallback() {
    return process.env.NODE_ENV !== 'production';
}

function assertProductionStorageConfigured() {
    if (isSupabaseRequiredButMissing()) {
        throw new Error('운영 환경에서는 Supabase 저장소 설정이 필요합니다.');
    }
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


// Sheet names
export const SHEETS = {
    STUDENTS: '\uD559\uC0DD', // students
    CLASSES: '\uBC18', // classes
    RECORDS: '\uC138\uD2B9', // records
    SETTINGS: '\uC124\uC815', // settings
    EXAMPLES: '\uC608\uC2DC\uC591\uC2DD', // examples
    ASSESSMENTS: '\uD3C9\uAC00\uACFC\uC81C', // assessments
    OBSERVATIONS: '\uAD00\uC230\uBA54\uBAA8', // observation notes
    STUDENT_DATA: '\uD559\uC0DD\uB370\uC774\uD130', // student data
    COOKIE_LEDGER: '\uCFE0\uD0A4\uC6D0\uC7A5', // cookie ledger
    COOKIE_REWARDS: '\uCFE0\uD0A4\uC0C1\uD488', // cookie rewards
    OCR_EVALUATIONS: 'OCR\uD3C9\uAC00', // OCR evaluations
    EVAL_CHECK_SETTINGS: 'EC_\uC124\uC815', // eval-check settings
    EVAL_CHECK_DOCUMENTS: 'EC_\uBB38\uC11C', // eval-check documents
    EVAL_CHECK_RESOURCES: 'EC_\uB9AC\uC18C\uC2A4', // eval-check resources
    EVAL_CHECK_QUESTIONS: 'EC_\uBB38\uD56D', // eval-check questions
    EVAL_CHECK_ISSUES: 'EC_\uBB38\uC81C\uC810_\uC694\uC57D', // eval-check issue summaries
    EVAL_CHECK_RULES: 'EC_\uADDC\uCE59', // eval-check rules
    EVAL_CHECK_LOGS: 'EC_\uC791\uC5C5\uB85C\uADF8', // eval-check logs
} as const;

/**
 * Converts a 1-based column number to A1 notation letters (1 -> A, 27 -> AA).
 * @param n - 1-based column number.
 * @returns The column letters.
 */
function columnNumberToLetters(n: number): string {
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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        return readSupabaseSheet(sheetName);
    }

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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        await appendSupabaseSheetRow(sheetName, values);
        return;
    }

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
 * Replaces the full contents of a sheet with the provided 2D rows.
 *
 * @param sheetName - Target sheet name.
 * @param values - Full sheet payload, including header rows when needed.
 */
export async function writeSheet(sheetName: string, values: string[][]): Promise<void> {
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        await writeSupabaseSheet(sheetName, values);
        return;
    }

    try {
        const sheets = getSheets();
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:ZZ`,
        });

        if (values.length === 0) {
            return;
        }

        const maxColumns = Math.max(1, ...values.map((row) => row.length));
        const endCol = columnNumberToLetters(maxColumns);
        const range = `${sheetName}!A1:${endCol}${values.length}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
    } catch (error) {
        if (!shouldUseLocalSheetFallback()) throw error;
        const store = await ensureLocalSheet(sheetName);
        store[sheetName] = values;
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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        await updateSupabaseSheetRow(sheetName, rowIndex, values);
        return;
    }

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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        await deleteSupabaseSheetRows(sheetName, [rowIndex]);
        return;
    }

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
async function getSheetId(sheetName: string): Promise<number> {
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        return 0;
    }

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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        await deleteSupabaseSheetRows(sheetName, rowIndices);
        return;
    }

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
    assertProductionStorageConfigured();

    if (isSupabaseConfigured()) {
        return { created: [], errors: [] };
    }

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
