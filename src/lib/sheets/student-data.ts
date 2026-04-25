import { CookieBalance, CookieReward, CookieTransaction, StudentDataEntry, StudentDataPayload } from '@/types';
import { readSheet, SHEETS, writeSheet } from './base';

const STUDENT_DATA_HEADERS = [
    'id',
    'school',
    'teacherKey',
    'classId',
    'semester',
    'studentId',
    'kind',
    'title',
    'occurredAt',
    'includeInAi',
    'payloadJson',
    'createdAt',
    'updatedAt',
];

const COOKIE_LEDGER_HEADERS = [
    'id',
    'school',
    'studentId',
    'amount',
    'type',
    'reason',
    'rewardId',
    'teacherKey',
    'createdAt',
];

const COOKIE_REWARD_HEADERS = [
    'id',
    'school',
    'name',
    'cost',
    'active',
    'createdAt',
    'updatedAt',
];

function isHeaderRow(row: string[] | undefined, headers: string[]): boolean {
    if (!row) return false;
    return headers.every((header, index) => row[index] === header);
}

function parsePayload(raw: string | undefined): StudentDataPayload {
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
            ? parsed as StudentDataPayload
            : {};
    } catch {
        return {};
    }
}

function parseBoolean(raw: string | undefined): boolean {
    return raw === 'true' || raw === 'TRUE' || raw === '1' || raw === 'Y';
}

function parseNumber(raw: string | undefined): number {
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
}

function nowIso(): string {
    return new Date().toISOString();
}

function studentDataToRow(entry: StudentDataEntry): string[] {
    return [
        entry.id,
        entry.school,
        entry.teacherKey,
        entry.classId,
        entry.semester,
        entry.studentId,
        entry.kind,
        entry.title,
        entry.occurredAt,
        String(entry.includeInAi),
        JSON.stringify(entry.payload || {}),
        entry.createdAt,
        entry.updatedAt,
    ];
}

function rowToStudentData(row: string[]): StudentDataEntry | null {
    const id = (row[0] || '').trim();
    const school = (row[1] || '').trim();
    const teacherKey = (row[2] || '').trim();
    const classId = (row[3] || '').trim();
    const semester = (row[4] || '').trim();
    const studentId = (row[5] || '').trim();
    const kind = (row[6] || '').trim();

    if (
        !id
        || !school
        || !teacherKey
        || !classId
        || !studentId
        || (semester !== '1' && semester !== '2')
        || (kind !== 'note' && kind !== 'grade' && kind !== 'mentor_match')
    ) {
        return null;
    }

    return {
        id,
        school,
        teacherKey,
        classId,
        semester,
        studentId,
        kind,
        title: row[7] || '',
        occurredAt: row[8] || '',
        includeInAi: parseBoolean(row[9]),
        payload: parsePayload(row[10]),
        createdAt: row[11] || '',
        updatedAt: row[12] || '',
    };
}

function cookieTransactionToRow(transaction: CookieTransaction): string[] {
    return [
        transaction.id,
        transaction.school,
        transaction.studentId,
        String(transaction.amount),
        transaction.type,
        transaction.reason,
        transaction.rewardId || '',
        transaction.teacherKey,
        transaction.createdAt,
    ];
}

function rowToCookieTransaction(row: string[]): CookieTransaction | null {
    const id = (row[0] || '').trim();
    const school = (row[1] || '').trim();
    const studentId = (row[2] || '').trim();
    const type = (row[4] || '').trim();
    const teacherKey = (row[7] || '').trim();
    if (!id || !school || !studentId || !teacherKey || (type !== 'award' && type !== 'redeem' && type !== 'adjust')) {
        return null;
    }

    return {
        id,
        school,
        studentId,
        amount: parseNumber(row[3]),
        type,
        reason: row[5] || '',
        rewardId: row[6] || undefined,
        teacherKey,
        createdAt: row[8] || '',
    };
}

function cookieRewardToRow(reward: CookieReward): string[] {
    return [
        reward.id,
        reward.school,
        reward.name,
        String(reward.cost),
        String(reward.active),
        reward.createdAt,
        reward.updatedAt,
    ];
}

function rowToCookieReward(row: string[]): CookieReward | null {
    const id = (row[0] || '').trim();
    const school = (row[1] || '').trim();
    const name = (row[2] || '').trim();
    if (!id || !school || !name) return null;

    return {
        id,
        school,
        name,
        cost: Math.max(0, parseNumber(row[3])),
        active: row[4] === '' ? true : parseBoolean(row[4]),
        createdAt: row[5] || '',
        updatedAt: row[6] || '',
    };
}

export async function getStudentDataEntries(filters?: {
    school?: string;
    teacherKey?: string;
    classId?: string;
    semester?: '1' | '2';
    studentId?: string;
    includeInAi?: boolean;
}): Promise<StudentDataEntry[]> {
    const rows = await readSheet(SHEETS.STUDENT_DATA);
    const dataRows = isHeaderRow(rows[0], STUDENT_DATA_HEADERS) ? rows.slice(1) : rows;

    return dataRows
        .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
        .map(rowToStudentData)
        .filter((entry): entry is StudentDataEntry => entry !== null)
        .filter((entry) => !filters?.school || entry.school === filters.school)
        .filter((entry) => !filters?.teacherKey || entry.teacherKey === filters.teacherKey)
        .filter((entry) => !filters?.classId || entry.classId === filters.classId)
        .filter((entry) => !filters?.semester || entry.semester === filters.semester)
        .filter((entry) => !filters?.studentId || entry.studentId === filters.studentId)
        .filter((entry) => filters?.includeInAi === undefined || entry.includeInAi === filters.includeInAi)
        .sort((a, b) => (b.occurredAt || b.createdAt).localeCompare(a.occurredAt || a.createdAt));
}

export async function saveStudentDataEntry(input: Omit<StudentDataEntry, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
}): Promise<StudentDataEntry> {
    const entries = await getStudentDataEntries();
    const existing = input.id ? entries.find((entry) => entry.id === input.id) : undefined;
    const timestamp = nowIso();
    const nextEntry: StudentDataEntry = {
        ...input,
        id: input.id || `sd-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
    };

    let nextEntries = entries.filter((entry) => entry.id !== nextEntry.id);

    if (nextEntry.kind === 'mentor_match') {
        const menteeStudentId = typeof nextEntry.payload.menteeStudentId === 'string'
            ? nextEntry.payload.menteeStudentId
            : nextEntry.studentId;

        nextEntries = nextEntries.filter((entry) => {
            if (
                entry.kind !== 'mentor_match'
                || entry.school !== nextEntry.school
                || entry.teacherKey !== nextEntry.teacherKey
                || entry.classId !== nextEntry.classId
                || entry.semester !== nextEntry.semester
            ) {
                return true;
            }

            return entry.payload.menteeStudentId !== menteeStudentId;
        });
    }

    nextEntries.push(nextEntry);

    await writeSheet(SHEETS.STUDENT_DATA, [
        STUDENT_DATA_HEADERS,
        ...nextEntries.map(studentDataToRow),
    ]);

    return nextEntry;
}

export async function deleteStudentDataEntry(id: string): Promise<void> {
    const entries = await getStudentDataEntries();
    await writeSheet(SHEETS.STUDENT_DATA, [
        STUDENT_DATA_HEADERS,
        ...entries.filter((entry) => entry.id !== id).map(studentDataToRow),
    ]);
}

export async function getCookieTransactions(filters?: {
    school?: string;
    studentId?: string;
}): Promise<CookieTransaction[]> {
    const rows = await readSheet(SHEETS.COOKIE_LEDGER);
    const dataRows = isHeaderRow(rows[0], COOKIE_LEDGER_HEADERS) ? rows.slice(1) : rows;

    return dataRows
        .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
        .map(rowToCookieTransaction)
        .filter((transaction): transaction is CookieTransaction => transaction !== null)
        .filter((transaction) => !filters?.school || transaction.school === filters.school)
        .filter((transaction) => !filters?.studentId || transaction.studentId === filters.studentId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function calculateCookieBalances(transactions: CookieTransaction[]): CookieBalance[] {
    const map = new Map<string, CookieBalance>();

    transactions.forEach((transaction) => {
        const current = map.get(transaction.studentId) || {
            studentId: transaction.studentId,
            balance: 0,
            awarded: 0,
            redeemed: 0,
            adjusted: 0,
        };

        if (transaction.type === 'award') {
            current.awarded += transaction.amount;
            current.balance += transaction.amount;
        } else if (transaction.type === 'redeem') {
            const spend = Math.abs(transaction.amount);
            current.redeemed += spend;
            current.balance -= spend;
        } else {
            current.adjusted += transaction.amount;
            current.balance += transaction.amount;
        }

        map.set(transaction.studentId, current);
    });

    return Array.from(map.values());
}

export async function addCookieTransaction(input: Omit<CookieTransaction, 'id' | 'createdAt'>): Promise<CookieTransaction> {
    const transactions = await getCookieTransactions();
    const transaction: CookieTransaction = {
        ...input,
        id: `cookie-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: nowIso(),
    };

    await writeSheet(SHEETS.COOKIE_LEDGER, [
        COOKIE_LEDGER_HEADERS,
        ...[...transactions, transaction].map(cookieTransactionToRow),
    ]);

    return transaction;
}

export async function getCookieRewards(filters?: {
    school?: string;
    activeOnly?: boolean;
}): Promise<CookieReward[]> {
    const rows = await readSheet(SHEETS.COOKIE_REWARDS);
    const dataRows = isHeaderRow(rows[0], COOKIE_REWARD_HEADERS) ? rows.slice(1) : rows;

    return dataRows
        .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
        .map(rowToCookieReward)
        .filter((reward): reward is CookieReward => reward !== null)
        .filter((reward) => !filters?.school || reward.school === filters.school)
        .filter((reward) => !filters?.activeOnly || reward.active)
        .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
}

export async function saveCookieReward(input: Omit<CookieReward, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
}): Promise<CookieReward> {
    const rewards = await getCookieRewards();
    const existing = input.id ? rewards.find((reward) => reward.id === input.id) : undefined;
    const timestamp = nowIso();
    const reward: CookieReward = {
        ...input,
        id: input.id || `reward-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
    };

    await writeSheet(SHEETS.COOKIE_REWARDS, [
        COOKIE_REWARD_HEADERS,
        ...[...rewards.filter((item) => item.id !== reward.id), reward].map(cookieRewardToRow),
    ]);

    return reward;
}
