import { readdirSync } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { hasOpenAIApiKey } from '@/lib/openai-client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { isTeacherAccountsEnabled } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/**
 * 배포 상태 점검용 공개 엔드포인트.
 * 구성 여부(boolean)만 노출하고 URL·키·버전 문자열 등 비밀 정보는 싣지 않는다.
 */
export async function GET() {
    let knowledgeSnapshot = false;
    try {
        knowledgeSnapshot = readdirSync(path.join(process.cwd(), 'output'))
            .some((name) => /^star-moe-knowledge-\d{4}\.json$/.test(name));
    } catch {
        // output 디렉터리 자체가 없으면 스냅샷 없음으로 본다.
    }

    const checks = {
        supabaseConfigured: isSupabaseConfigured(),
        openaiConfigured: hasOpenAIApiKey(),
        teacherAccountsEnabled: isTeacherAccountsEnabled(),
        knowledgeSnapshot,
    };

    const degraded = !checks.supabaseConfigured || !checks.openaiConfigured;

    return NextResponse.json({
        status: degraded ? 'degraded' : 'ok',
        checks,
    });
}
