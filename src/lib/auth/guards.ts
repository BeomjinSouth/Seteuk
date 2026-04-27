import { NextResponse } from 'next/server';
import { getTeacherSession } from './session';
import type { TeacherProfile } from '@/types';

export async function requireTeacherSession(): Promise<
    { ok: true; teacher: TeacherProfile }
    | { ok: false; response: NextResponse }
> {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return {
            ok: false,
            response: NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 }),
        };
    }

    return { ok: true, teacher };
}

export function rejectWhenDifferentTeacher(sessionTeacherKey: string, inputTeacherKey?: string) {
    if (!inputTeacherKey || inputTeacherKey === sessionTeacherKey) return null;
    return NextResponse.json({ success: false, error: '교사 세션이 일치하지 않습니다.' }, { status: 403 });
}

export function rejectWhenDifferentSchool(sessionSchool: string, inputSchool?: string) {
    if (!inputSchool || inputSchool === sessionSchool) return null;
    return NextResponse.json({ success: false, error: '학교 세션이 일치하지 않습니다.' }, { status: 403 });
}
