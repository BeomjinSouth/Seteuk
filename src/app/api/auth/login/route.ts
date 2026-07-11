import { NextRequest, NextResponse } from 'next/server';
import { setTeacherSession } from '@/lib/auth/session';
import { checkRateLimit, getClientAddress } from '@/lib/rate-limit';
import {
    SEONGHO_AUTH_MODE,
    SEONGHO_DEFAULT_SUBJECT,
    validateSeonghoLogin,
} from '@/lib/seongho-auth';
import { buildTeacherKey } from '@/lib/teacher-context';
import type { TeacherProfile } from '@/types';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as {
            school?: string;
            userId?: string;
            password?: string;
        };

        const rate = checkRateLimit({
            scope: 'auth-login',
            identity: `${getClientAddress(request)}:${(body.userId || '').trim()}`,
            limit: 10,
            windowSeconds: 15 * 60,
        });
        if (!rate.allowed) {
            return NextResponse.json(
                { success: false, error: '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
                { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
            );
        }

        const result = validateSeonghoLogin({
            school: body.school || '',
            userId: body.userId || '',
            password: body.password || '',
        });

        if (!result.ok) {
            return NextResponse.json({ success: false, error: result.message }, { status: 401 });
        }

        const teacherKey = buildTeacherKey({
            school: result.school,
            name: result.teacherName,
            subject: SEONGHO_DEFAULT_SUBJECT,
        });
        const teacher: TeacherProfile = {
            id: teacherKey,
            teacherKey,
            name: result.teacherName,
            subject: SEONGHO_DEFAULT_SUBJECT,
            school: result.school,
            authMode: SEONGHO_AUTH_MODE,
        };

        await setTeacherSession(teacher);
        return NextResponse.json({ success: true, teacher });
    } catch (error) {
        console.error('Login session error:', error);
        return NextResponse.json(
            { success: false, error: '로그인 세션을 만들지 못했습니다.' },
            { status: 500 }
        );
    }
}
