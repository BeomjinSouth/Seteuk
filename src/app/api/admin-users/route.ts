import { NextRequest, NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth/session';
import {
    grantAdminUser,
    isAdminTeacher,
    listAdminUsers,
    revokeAdminUser,
} from '@/lib/admin-roles';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function adminStorageUnavailableResponse() {
    return NextResponse.json({
        success: false,
        error: '관리자 권한 저장소가 설정되지 않았습니다. Supabase 환경변수를 확인하세요.',
    }, { status: 503 });
}

async function requireAdmin() {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return {
            teacher: null,
            response: NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 }),
        };
    }

    const isAdmin = await isAdminTeacher(teacher);
    if (!isAdmin) {
        return {
            teacher,
            response: NextResponse.json({ success: false, error: '관리자 권한이 필요합니다.' }, { status: 403 }),
        };
    }

    return { teacher, response: null };
}

export async function GET() {
    const { teacher, response } = await requireAdmin();
    if (response) return response;

    const admins = await listAdminUsers(teacher!.school);
    return NextResponse.json({ success: true, admins });
}

export async function POST(request: NextRequest) {
    const { teacher, response } = await requireAdmin();
    if (response) return response;
    if (!isSupabaseConfigured()) return adminStorageUnavailableResponse();

    const body = await request.json() as { teacherName?: string };
    try {
        const admin = await grantAdminUser({
            school: teacher!.school,
            teacherName: body.teacherName || '',
            grantedBy: teacher!,
        });
        const admins = await listAdminUsers(teacher!.school);
        return NextResponse.json({ success: true, admin, admins });
    } catch (error) {
        const message = error instanceof Error ? error.message : '관리자 추가에 실패했습니다.';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    const { teacher, response } = await requireAdmin();
    if (response) return response;
    if (!isSupabaseConfigured()) return adminStorageUnavailableResponse();

    const body = await request.json() as { teacherKey?: string };
    if (!body.teacherKey) {
        return NextResponse.json({ success: false, error: 'teacherKey is required.' }, { status: 400 });
    }

    try {
        await revokeAdminUser({
            school: teacher!.school,
            teacherKey: body.teacherKey,
            revokedBy: teacher!,
        });
        const admins = await listAdminUsers(teacher!.school);
        return NextResponse.json({ success: true, admins });
    } catch (error) {
        const message = error instanceof Error ? error.message : '관리자 해제에 실패했습니다.';
        return NextResponse.json({ success: false, error: message }, { status: 400 });
    }
}
