import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { TeacherProfile } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { AuthenticatedTeacherAccount } from './accounts';
import {
    deleteTeacherSession,
    findTeacherSession,
    insertTeacherSession,
    touchTeacherSession,
} from './session-store';

const SESSION_COOKIE_NAME = 'seteuk-session';
// 서명 쿠키(레거시) 세션은 서버에서 개별 폐기가 불가능하므로 TTL이 유일한
// 만료 수단이다. 학교 일과를 넉넉히 덮는 12시간으로 제한한다.
const SESSION_TTL_SECONDS = 60 * 60 * 12;
// 계정 모드 세션은 서버에서 폐기 가능하므로 계획 스펙(8시간)을 따른다.
const ACCOUNT_SESSION_TTL_SECONDS = 60 * 60 * 8;

/**
 * 개별 교사 계정 + 서버 저장(폐기 가능) 세션 모드.
 *
 * Supabase에 202607100001 마이그레이션을 적용하고 계정을 프로비저닝한 뒤
 * TEACHER_ACCOUNTS_ENABLED=true 로 켠다. 꺼져 있으면 기존 공용 비밀번호
 * (SETEUK_LOGIN_PASSWORD) + 서명 쿠키 로그인이 그대로 동작한다.
 *
 * 쿠키 값 형태로 두 모드를 구분한다:
 * - 레거시 서명 세션: `<base64url payload>.<base64url hmac>` ('.' 포함)
 * - 계정 서버 세션: 32바이트 난수 토큰 base64url ('.' 없음, 서버엔 해시만 저장)
 */
export function isTeacherAccountsEnabled(): boolean {
    return process.env.TEACHER_ACCOUNTS_ENABLED === 'true' && isSupabaseConfigured();
}

interface SessionPayload {
    teacher: TeacherProfile;
    expiresAt: number;
}

function getSessionSecret(): string {
    const secret = (process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET || '').trim();
    if (secret) return secret;

    if (process.env.NODE_ENV === 'production') {
        throw new Error('AUTH_SESSION_SECRET is required in production.');
    }

    return 'dev-only-seteuk-session-secret';
}

function toBase64Url(value: Buffer | string): string {
    return Buffer.from(value)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/g, '');
}

function fromBase64Url(value: string): string {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
    return Buffer.from(normalized + padding, 'base64').toString('utf8');
}

function sign(payload: string): string {
    return toBase64Url(crypto.createHmac('sha256', getSessionSecret()).update(payload).digest());
}

function safeEqual(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);
    return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function encodeSession(payload: SessionPayload): string {
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    return `${encodedPayload}.${sign(encodedPayload)}`;
}

function decodeSession(value?: string): SessionPayload | null {
    if (!value) return null;
    const [encodedPayload, signature] = value.split('.');
    if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
        return null;
    }

    try {
        const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload;
        if (!payload.teacher?.teacherKey || !payload.expiresAt || payload.expiresAt < Date.now()) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

function cookieOptions(maxAge: number) {
    return {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production' && process.env.AUTH_ALLOW_INSECURE_COOKIES !== 'true',
        path: '/',
        maxAge,
    };
}

function hashSessionToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
}

/** 계정 세션의 프로필은 기존 TeacherProfile 계약을 그대로 따른다
 *  (teacherKey 규약이 동일해 관찰기록·상태 문서가 이어진다). */
export function teacherProfileFromAccount(account: AuthenticatedTeacherAccount): TeacherProfile {
    return {
        id: account.teacherKey,
        teacherKey: account.teacherKey,
        name: account.name,
        subject: account.subject,
        school: account.school,
        authMode: 'seongho-school',
    };
}

export async function setTeacherSession(teacher: TeacherProfile): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeSession({
        teacher,
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    }), cookieOptions(SESSION_TTL_SECONDS));
}

export async function createAccountTeacherSession(account: AuthenticatedTeacherAccount): Promise<void> {
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + ACCOUNT_SESSION_TTL_SECONDS * 1000);

    await insertTeacherSession({
        tokenHash: hashSessionToken(token),
        accountId: account.accountId,
        expiresAt: expiresAt.toISOString(),
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions(ACCOUNT_SESSION_TTL_SECONDS));
}

async function getAccountTeacherSession(token: string): Promise<TeacherProfile | null> {
    if (!isSupabaseConfigured()) return null;

    try {
        const tokenHash = hashSessionToken(token);
        const session = await findTeacherSession(tokenHash);
        if (!session) return null;

        const expired = new Date(session.expiresAt).getTime() <= Date.now();
        if (expired || !session.account.active) {
            await deleteTeacherSession(tokenHash);
            return null;
        }

        await touchTeacherSession(tokenHash);
        return teacherProfileFromAccount(session.account);
    } catch (error) {
        console.error('Teacher account session lookup failed:', error);
        return null;
    }
}

export async function clearTeacherSession(): Promise<void> {
    const cookieStore = await cookies();
    const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    try {
        if (value && !value.includes('.') && isSupabaseConfigured()) {
            await deleteTeacherSession(hashSessionToken(value));
        }
    } catch (error) {
        console.error('Teacher account session revocation failed:', error);
    } finally {
        cookieStore.delete(SESSION_COOKIE_NAME);
    }
}

export async function getTeacherSession(): Promise<TeacherProfile | null> {
    const cookieStore = await cookies();
    const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!value) return null;

    if (!value.includes('.')) {
        return getAccountTeacherSession(value);
    }

    const payload = decodeSession(value);
    return payload?.teacher || null;
}
