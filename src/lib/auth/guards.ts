import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getTeacherSession } from './session';
import { requireAdminRequest } from '@/lib/admin-auth';
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

type RouteHandler = (request: NextRequest) => Promise<Response> | Response;
type TeacherRouteHandler = (
    request: NextRequest,
    ctx: { teacher: TeacherProfile },
) => Promise<Response> | Response;

/**
 * Wraps a route handler so it only runs for an authenticated teacher session.
 * The resolved teacher profile is passed to the handler via `ctx.teacher`.
 */
export function withTeacherAuth(handler: TeacherRouteHandler): RouteHandler {
    return async (request) => {
        const auth = await requireTeacherSession();
        if (!auth.ok) return auth.response;
        return handler(request, { teacher: auth.teacher });
    };
}

/**
 * Wraps a route handler so it only runs for a valid admin API token
 * (Bearer or x-admin-token), matching {@link requireAdminRequest}.
 */
export function withAdminAuth(handler: RouteHandler): RouteHandler {
    return async (request) => {
        const unauthorized = requireAdminRequest(request);
        if (unauthorized) return unauthorized;
        return handler(request);
    };
}

export function rejectWhenDifferentTeacher(sessionTeacherKey: string, inputTeacherKey?: string) {
    if (!inputTeacherKey || inputTeacherKey === sessionTeacherKey) return null;
    return NextResponse.json({ success: false, error: '교사 세션이 일치하지 않습니다.' }, { status: 403 });
}

export function rejectWhenDifferentSchool(sessionSchool: string, inputSchool?: string) {
    if (!inputSchool || inputSchool === sessionSchool) return null;
    return NextResponse.json({ success: false, error: '학교 세션이 일치하지 않습니다.' }, { status: 403 });
}
