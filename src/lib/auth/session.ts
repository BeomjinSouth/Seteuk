import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { TeacherProfile } from '@/types';

const SESSION_COOKIE_NAME = 'seteuk-session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

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

export async function setTeacherSession(teacher: TeacherProfile): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, encodeSession({
        teacher,
        expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000,
    }), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production' && process.env.AUTH_ALLOW_INSECURE_COOKIES !== 'true',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    });
}

export async function clearTeacherSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getTeacherSession(): Promise<TeacherProfile | null> {
    const cookieStore = await cookies();
    const payload = decodeSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
    return payload?.teacher || null;
}
