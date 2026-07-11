import { getSupabaseAdminClient } from './server';
import { LEGACY_SHEET_RENAMES } from '@/lib/sheets/legacy-names';

type SupabaseSheetRow = {
    row_index: number;
    cells: unknown;
};

// 프로세스당 한 번, 레거시(오타) 시트 이름으로 저장된 행을 현재 이름으로 옮긴다.
// 실패해도 시트 접근 자체를 막지 않는다(다음 프로세스에서 재시도).
let legacyRenamePromise: Promise<void> | null = null;

async function applyLegacySheetRenames(): Promise<void> {
    const supabase = getSupabaseAdminClient();
    for (const [legacyName, currentName] of Object.entries(LEGACY_SHEET_RENAMES)) {
        const { error } = await supabase
            .from('sheet_rows')
            .update({ sheet_name: currentName })
            .eq('sheet_name', legacyName);
        if (error) {
            console.warn(`[sheets] legacy sheet rename "${legacyName}" -> "${currentName}" failed: ${error.message}`);
        }
    }
}

function ensureLegacySheetRenames(): Promise<void> {
    if (!legacyRenamePromise) {
        legacyRenamePromise = applyLegacySheetRenames().catch((error) => {
            console.warn(`[sheets] legacy sheet rename skipped: ${error instanceof Error ? error.message : String(error)}`);
        });
    }
    return legacyRenamePromise;
}

function normalizeCells(cells: unknown): string[] {
    if (!Array.isArray(cells)) return [];
    return cells.map((cell) => (cell === null || cell === undefined ? '' : String(cell)));
}

function assertNoSupabaseError(error: unknown, operation: string): void {
    if (!error) return;
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Supabase sheet store ${operation} failed: ${message}`);
}

export async function readSupabaseSheet(sheetName: string): Promise<string[][]> {
    await ensureLegacySheetRenames();
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('sheet_rows')
        .select('row_index,cells')
        .eq('sheet_name', sheetName)
        .order('row_index', { ascending: true });

    assertNoSupabaseError(error, `read "${sheetName}"`);

    return ((data || []) as SupabaseSheetRow[]).map((row) => normalizeCells(row.cells));
}

export async function appendSupabaseSheetRow(sheetName: string, values: string[]): Promise<void> {
    await ensureLegacySheetRenames();
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('append_sheet_row', {
        p_sheet_name: sheetName,
        p_cells: values,
    });

    assertNoSupabaseError(error, `append "${sheetName}"`);
}

export async function writeSupabaseSheet(sheetName: string, values: string[][]): Promise<void> {
    await ensureLegacySheetRenames();
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('replace_sheet', {
        p_sheet_name: sheetName,
        p_rows: values,
    });

    assertNoSupabaseError(error, `write "${sheetName}"`);
}

export async function updateSupabaseSheetRow(sheetName: string, rowIndex: number, values: string[]): Promise<void> {
    await ensureLegacySheetRenames();
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('update_sheet_row', {
        p_sheet_name: sheetName,
        p_row_index: rowIndex,
        p_cells: values,
    });

    assertNoSupabaseError(error, `update "${sheetName}" row ${rowIndex}`);
}

export async function deleteSupabaseSheetRows(sheetName: string, rowIndices: number[]): Promise<void> {
    if (rowIndices.length === 0) return;

    await ensureLegacySheetRenames();
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('delete_sheet_rows', {
        p_sheet_name: sheetName,
        p_row_indices: rowIndices,
    });

    assertNoSupabaseError(error, `delete rows from "${sheetName}"`);
}
