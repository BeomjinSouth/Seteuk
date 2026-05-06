import type { TeacherProfile } from '@/types';
import { buildTeacherKey } from '@/lib/teacher-context';
import {
    isHangulTeacherName,
    isSeonghoSchool,
    SEONGHO_DEFAULT_SUBJECT,
    SEONGHO_SCHOOL_NAME,
} from '@/lib/seongho-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getSupabaseAdminClient } from '@/lib/supabase/server';

export const BOOTSTRAP_ADMIN = {
    name: '박범진',
    school: SEONGHO_SCHOOL_NAME,
    subject: SEONGHO_DEFAULT_SUBJECT,
};

export interface AdminRoleUser {
    school: string;
    teacherKey: string;
    teacherName: string;
    bootstrap: boolean;
    active: boolean;
    grantedAt: string | null;
}

type AdminRoleRow = {
    school: string;
    teacher_key: string;
    teacher_name: string;
    active: boolean;
    bootstrap: boolean;
    granted_at: string | null;
};

export function getBootstrapAdminTeacherKey(): string {
    return buildTeacherKey(BOOTSTRAP_ADMIN);
}

export function isBootstrapAdmin(teacher: TeacherProfile | null): boolean {
    return Boolean(
        teacher
        && teacher.name === BOOTSTRAP_ADMIN.name
        && isSeonghoSchool(teacher.school)
    );
}

function normalizeAdminRow(row: AdminRoleRow): AdminRoleUser {
    return {
        school: row.school,
        teacherKey: row.teacher_key,
        teacherName: row.teacher_name,
        bootstrap: row.bootstrap,
        active: row.active,
        grantedAt: row.granted_at,
    };
}

function bootstrapAdminRow(): AdminRoleUser {
    return {
        school: BOOTSTRAP_ADMIN.school,
        teacherKey: getBootstrapAdminTeacherKey(),
        teacherName: BOOTSTRAP_ADMIN.name,
        bootstrap: true,
        active: true,
        grantedAt: null,
    };
}

export async function isAdminTeacher(teacher: TeacherProfile | null): Promise<boolean> {
    if (!teacher || !isSeonghoSchool(teacher.school)) return false;
    if (isBootstrapAdmin(teacher)) return true;
    if (!isSupabaseConfigured()) return false;

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('admin_role_grants')
        .select('teacher_key')
        .eq('school', SEONGHO_SCHOOL_NAME)
        .eq('teacher_key', teacher.teacherKey)
        .eq('active', true)
        .maybeSingle();

    if (error) {
        throw new Error(`Admin role lookup failed: ${error.message}`);
    }

    return Boolean(data);
}

export async function listAdminUsers(school = SEONGHO_SCHOOL_NAME): Promise<AdminRoleUser[]> {
    const normalizedSchool = isSeonghoSchool(school) ? SEONGHO_SCHOOL_NAME : school.trim();
    const admins = new Map<string, AdminRoleUser>();
    const bootstrap = bootstrapAdminRow();
    admins.set(bootstrap.teacherKey, bootstrap);

    if (!isSupabaseConfigured()) {
        return Array.from(admins.values());
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('admin_role_grants')
        .select('school,teacher_key,teacher_name,active,bootstrap,granted_at')
        .eq('school', normalizedSchool)
        .eq('active', true)
        .order('bootstrap', { ascending: false })
        .order('teacher_name', { ascending: true });

    if (error) {
        throw new Error(`Admin role list failed: ${error.message}`);
    }

    (data as AdminRoleRow[] | null || []).forEach((row) => {
        admins.set(row.teacher_key, normalizeAdminRow(row));
    });

    return Array.from(admins.values());
}

export async function grantAdminUser(input: {
    school: string;
    teacherName: string;
    grantedBy: TeacherProfile;
}): Promise<AdminRoleUser> {
    if (!isSeonghoSchool(input.school)) {
        throw new Error('성호중학교 내부 계정에만 관리자 권한을 부여할 수 있습니다.');
    }

    const teacherName = input.teacherName.trim();
    if (!isHangulTeacherName(teacherName)) {
        throw new Error('교사 이름은 한글 2~10자로 입력해야 합니다.');
    }

    const teacherKey = buildTeacherKey({
        school: SEONGHO_SCHOOL_NAME,
        name: teacherName,
        subject: SEONGHO_DEFAULT_SUBJECT,
    });

    if (teacherKey === getBootstrapAdminTeacherKey()) {
        return bootstrapAdminRow();
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('admin_role_grants')
        .upsert({
            school: SEONGHO_SCHOOL_NAME,
            teacher_key: teacherKey,
            teacher_name: teacherName,
            active: true,
            bootstrap: false,
            granted_by_teacher_key: input.grantedBy.teacherKey,
            granted_at: new Date().toISOString(),
            revoked_at: null,
        }, {
            onConflict: 'school,teacher_key',
        })
        .select('school,teacher_key,teacher_name,active,bootstrap,granted_at')
        .single();

    if (error) {
        throw new Error(`Admin role grant failed: ${error.message}`);
    }

    return normalizeAdminRow(data as AdminRoleRow);
}

export async function revokeAdminUser(input: {
    school: string;
    teacherKey: string;
    revokedBy: TeacherProfile;
}): Promise<void> {
    if (!isSeonghoSchool(input.school)) {
        throw new Error('성호중학교 관리자 권한만 해제할 수 있습니다.');
    }

    if (input.teacherKey === getBootstrapAdminTeacherKey()) {
        throw new Error('최초 부트스트랩 관리자는 해제할 수 없습니다.');
    }

    if (input.teacherKey === input.revokedBy.teacherKey) {
        throw new Error('본인의 관리자 권한은 직접 해제할 수 없습니다.');
    }

    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
        .from('admin_role_grants')
        .update({
            active: false,
            revoked_at: new Date().toISOString(),
            revoked_by_teacher_key: input.revokedBy.teacherKey,
        })
        .eq('school', SEONGHO_SCHOOL_NAME)
        .eq('teacher_key', input.teacherKey);

    if (error) {
        throw new Error(`Admin role revoke failed: ${error.message}`);
    }
}
