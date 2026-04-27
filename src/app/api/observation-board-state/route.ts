import { NextRequest, NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth/session';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getAppStateDocument, upsertAppStateDocument } from '@/lib/supabase/state-store';

export async function GET() {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
        return NextResponse.json({ success: true, configured: false, data: null });
    }

    const document = await getAppStateDocument('observation-board', teacher.teacherKey);
    return NextResponse.json({
        success: true,
        configured: true,
        data: document?.payload || null,
        updatedAt: document?.updatedAt || null,
    });
}

export async function PUT(request: NextRequest) {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    if (!isSupabaseConfigured()) {
        return NextResponse.json({ success: true, configured: false, skipped: true });
    }

    const body = await request.json() as { teacherKey?: string; data?: unknown };
    if (body.teacherKey && body.teacherKey !== teacher.teacherKey) {
        return NextResponse.json({ success: false, error: '교사 세션이 일치하지 않습니다.' }, { status: 403 });
    }

    const document = await upsertAppStateDocument('observation-board', teacher.teacherKey, body.data || {});
    return NextResponse.json({
        success: true,
        configured: true,
        updatedAt: document.updatedAt,
    });
}

export async function POST(request: NextRequest) {
    return PUT(request);
}
