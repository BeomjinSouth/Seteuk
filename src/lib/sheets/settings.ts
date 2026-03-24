import { readSheet, appendRow, updateRow, SHEETS } from './base';

/**
 * Retrieves a setting value by key.
 * @param key - The setting key.
 * @returns The setting value or null if not found.
 */
export async function getSetting(key: string): Promise<string | null> {
    const rows = await readSheet(SHEETS.SETTINGS);
    const row = rows.find(r => r[0] === key);
    return row ? row[1] : null;
}

/**
 * Sets a setting value (create or update).
 * @param key - The setting key.
 * @param value - The value to set.
 */
export async function setSetting(key: string, value: string): Promise<void> {
    const rows = await readSheet(SHEETS.SETTINGS);
    const existingIndex = rows.findIndex(row => row[0] === key);

    if (existingIndex > 0) {
        await updateRow(SHEETS.SETTINGS, existingIndex + 1, [key, value]);
    } else {
        await appendRow(SHEETS.SETTINGS, [key, value]);
    }
}
