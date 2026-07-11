import { verifyPassword } from './password';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export type TeacherAccountRole = 'teacher' | 'admin';

export interface AuthenticatedTeacherAccount {
    accountId: string;
    teacherKey: string;
    name: string;
    school: string;
    subject: string;
    role: TeacherAccountRole;
}

interface TeacherAccountRow {
    id: string;
    teacher_key: string;
    teacher_name: string;
    school: string;
    subject: string;
    role: TeacherAccountRole;
    password_hash: string;
    active: boolean;
}

export function normalizeTeacherLogin(input: { school: string; loginId: string }) {
    return {
        school: input.school.trim().replace(/\s+/g, ''),
        loginId: input.loginId.trim().toLowerCase(),
    };
}

export function toAuthenticatedTeacherAccount(row: Omit<TeacherAccountRow, 'password_hash'>): AuthenticatedTeacherAccount {
    return {
        accountId: row.id,
        teacherKey: row.teacher_key,
        name: row.teacher_name,
        school: row.school,
        subject: row.subject,
        role: row.role,
    };
}

export async function verifyTeacherLogin(input: {
    school: string;
    loginId: string;
    password: string;
}): Promise<AuthenticatedTeacherAccount | null> {
    const normalized = normalizeTeacherLogin(input);
    if (!normalized.school || !normalized.loginId || !input.password) return null;

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('teacher_accounts')
        .select('id,teacher_key,teacher_name,school,subject,role,password_hash,active')
        .eq('school', normalized.school)
        .eq('login_id', normalized.loginId)
        .maybeSingle();

    if (error) {
        throw new Error(`Teacher account lookup failed: ${error.message}`);
    }

    const account = data as TeacherAccountRow | null;
    if (!account?.active) return null;
    if (!await verifyPassword(input.password, account.password_hash)) return null;

    return toAuthenticatedTeacherAccount(account);
}
