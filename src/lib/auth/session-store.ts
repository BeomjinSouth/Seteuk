import { getSupabaseAdminClient } from '@/lib/supabase/server';
import type { AuthenticatedTeacherAccount, TeacherAccountRole } from './accounts';

export interface StoredTeacherSession {
    expiresAt: string;
    account: AuthenticatedTeacherAccount & { active: boolean };
}

interface SessionAccountRow {
    id: string;
    teacher_key: string;
    teacher_name: string;
    school: string;
    subject: string;
    role: TeacherAccountRole;
    active: boolean;
}

interface SessionRow {
    expires_at: string;
    teacher_accounts: SessionAccountRow | SessionAccountRow[] | null;
}

function firstAccount(value: SessionRow['teacher_accounts']): SessionAccountRow | null {
    return Array.isArray(value) ? value[0] ?? null : value;
}

export async function insertTeacherSession(input: {
    tokenHash: string;
    accountId: string;
    expiresAt: string;
}): Promise<void> {
    const { error } = await getSupabaseAdminClient()
        .from('teacher_sessions')
        .insert({
            token_hash: input.tokenHash,
            account_id: input.accountId,
            expires_at: input.expiresAt,
            last_seen_at: new Date().toISOString(),
        });

    if (error) {
        throw new Error(`Teacher session creation failed: ${error.message}`);
    }
}

export async function findTeacherSession(tokenHash: string): Promise<StoredTeacherSession | null> {
    const { data, error } = await getSupabaseAdminClient()
        .from('teacher_sessions')
        .select(`
            expires_at,
            teacher_accounts!inner(
                id,
                teacher_key,
                teacher_name,
                school,
                subject,
                role,
                active
            )
        `)
        .eq('token_hash', tokenHash)
        .maybeSingle();

    if (error) {
        throw new Error(`Teacher session lookup failed: ${error.message}`);
    }

    const row = data as SessionRow | null;
    const account = row ? firstAccount(row.teacher_accounts) : null;
    if (!row || !account) return null;

    return {
        expiresAt: row.expires_at,
        account: {
            accountId: account.id,
            teacherKey: account.teacher_key,
            name: account.teacher_name,
            school: account.school,
            subject: account.subject,
            role: account.role,
            active: account.active,
        },
    };
}

export async function touchTeacherSession(tokenHash: string): Promise<void> {
    const { error } = await getSupabaseAdminClient()
        .from('teacher_sessions')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('token_hash', tokenHash);

    if (error) {
        throw new Error(`Teacher session update failed: ${error.message}`);
    }
}

export async function deleteTeacherSession(tokenHash: string): Promise<void> {
    const { error } = await getSupabaseAdminClient()
        .from('teacher_sessions')
        .delete()
        .eq('token_hash', tokenHash);

    if (error) {
        throw new Error(`Teacher session revocation failed: ${error.message}`);
    }
}
