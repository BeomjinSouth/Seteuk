import { getSupabaseAdminClient } from './server';

type SupabaseSheetRow = {
    row_index: number;
    cells: unknown;
};

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
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('append_sheet_row', {
        p_sheet_name: sheetName,
        p_cells: values,
    });

    assertNoSupabaseError(error, `append "${sheetName}"`);
}

export async function writeSupabaseSheet(sheetName: string, values: string[][]): Promise<void> {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('replace_sheet', {
        p_sheet_name: sheetName,
        p_rows: values,
    });

    assertNoSupabaseError(error, `write "${sheetName}"`);
}

export async function updateSupabaseSheetRow(sheetName: string, rowIndex: number, values: string[]): Promise<void> {
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

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.rpc('delete_sheet_rows', {
        p_sheet_name: sheetName,
        p_row_indices: rowIndices,
    });

    assertNoSupabaseError(error, `delete rows from "${sheetName}"`);
}
