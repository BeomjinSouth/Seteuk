import { NextResponse } from 'next/server';

export function supabaseRequiredResponse() {
    return NextResponse.json({
        success: false,
        configured: false,
        error: '운영 환경에서는 Supabase 저장소 설정이 필요합니다.',
    }, { status: 503 });
}
