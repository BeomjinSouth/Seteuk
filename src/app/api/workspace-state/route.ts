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

    const document = await getAppStateDocument('workspace', teacher.teacherKey);
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

    const body = await request.json() as {
        teacherKey?: string;
        data?: unknown;
        expectedUpdatedAt?: string | null;
    };
    if (body.teacherKey && body.teacherKey !== teacher.teacherKey) {
        return NextResponse.json({ success: false, error: '교사 세션이 일치하지 않습니다.' }, { status: 403 });
    }

    // expectedUpdatedAt을 보낸 클라이언트에 한해 낙관적 동시성 검사를 한다.
    // 값이 서버의 현재 updatedAt과 다르면 다른 기기/탭이 먼저 저장한 것이므로
    // 덮어쓰지 않고 최신본을 409로 돌려준다. (미전송 시 기존 동작 유지)
    if (body.expectedUpdatedAt !== undefined) {
        const current = await getAppStateDocument('workspace', teacher.teacherKey);
        const currentUpdatedAt = current?.updatedAt ?? null;
        if (currentUpdatedAt !== body.expectedUpdatedAt) {
            return NextResponse.json({
                success: false,
                conflict: true,
                error: '다른 기기에서 더 최신 상태가 저장되었습니다.',
                updatedAt: currentUpdatedAt,
                data: current?.payload ?? null,
            }, { status: 409 });
        }
    }

    const document = await upsertAppStateDocument('workspace', teacher.teacherKey, body.data || {});
    return NextResponse.json({
        success: true,
        configured: true,
        updatedAt: document.updatedAt,
    });
}

export async function POST(request: NextRequest) {
    return PUT(request);
}
