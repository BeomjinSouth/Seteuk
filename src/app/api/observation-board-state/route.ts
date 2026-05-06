import { NextRequest, NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth/session';
import { isSupabaseConfigured, isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { getAppStateDocument, upsertAppStateDocument } from '@/lib/supabase/state-store';

function supabaseMissingResponse() {
    return NextResponse.json({
        success: false,
        configured: false,
        error: '운영 환경에서는 Supabase 저장소 설정이 필요합니다.',
    }, { status: 503 });
}

export async function GET() {
    const teacher = await getTeacherSession();
    if (!teacher) {
        return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    if (isSupabaseRequiredButMissing()) {
        return supabaseMissingResponse();
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

    if (isSupabaseRequiredButMissing()) {
        return supabaseMissingResponse();
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
