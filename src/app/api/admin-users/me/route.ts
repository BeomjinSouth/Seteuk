import { NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth/session';
import { isAdminTeacher, isBootstrapAdmin } from '@/lib/admin-roles';

export async function GET() {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const isAdmin = await isAdminTeacher(teacher);
    return NextResponse.json({
        success: true,
        isAdmin,
        bootstrap: isBootstrapAdmin(teacher),
    });
}
