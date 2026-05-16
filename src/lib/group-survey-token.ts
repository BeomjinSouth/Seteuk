import crypto from 'crypto';

export interface GroupSurveySubmitTokenPayload {
    sessionId: string;
    studentId: string;
    expiresAt: number;
}

function getSurveyTokenSecret(): string {
    const secret = (process.env.GROUP_SURVEY_TOKEN_SECRET || process.env.AUTH_SESSION_SECRET || process.env.NEXTAUTH_SECRET || '').trim();
    if (secret) return secret;
    if (process.env.NODE_ENV === 'production') {
        throw new Error('GROUP_SURVEY_TOKEN_SECRET or AUTH_SESSION_SECRET is required in production.');
    }
    return 'dev-only-group-survey-token-secret';
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

function signTokenPayload(payload: string): string {
    return toBase64Url(crypto.createHmac('sha256', getSurveyTokenSecret()).update(payload).digest());
}

function safeEqual(a: string, b: string): boolean {
    const aBuffer = Buffer.from(a);
    const bBuffer = Buffer.from(b);
    return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function createGroupSurveySubmitToken(input: { sessionId: string; studentId: string }): string {
    const payload: GroupSurveySubmitTokenPayload = {
        sessionId: input.sessionId,
        studentId: input.studentId,
        expiresAt: Date.now() + 1000 * 60 * 20,
    };
    const encoded = toBase64Url(JSON.stringify(payload));
    return `${encoded}.${signTokenPayload(encoded)}`;
}

export function verifyGroupSurveySubmitToken(token?: string): GroupSurveySubmitTokenPayload | null {
    if (!token) return null;
    const [encoded, signature] = token.split('.');
    if (!encoded || !signature || !safeEqual(signature, signTokenPayload(encoded))) return null;

    try {
        const payload = JSON.parse(fromBase64Url(encoded)) as GroupSurveySubmitTokenPayload;
        if (!payload.sessionId || !payload.studentId || !payload.expiresAt || payload.expiresAt < Date.now()) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
}

export function createAccessCode(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = crypto.randomBytes(6);
    return Array.from(bytes)
        .map((byte) => alphabet[byte % alphabet.length])
        .join('');
}
