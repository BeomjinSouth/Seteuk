import type { TeacherProfile } from '@/types';

export const SEONGHO_SCHOOL_NAME = '성호중학교';
export const SEONGHO_DEFAULT_SUBJECT = '담당 교과';
export const SEONGHO_AUTH_MODE = 'seongho-school';

// 서버 전용: 프로덕션에서는 SETEUK_LOGIN_PASSWORD 환경변수가 없으면 로그인을 거부한다.
// 이 저장소는 공개되어 있으므로 비밀번호를 소스에 하드코딩하면 안 된다.
function getLoginPassword(): string | null {
    const configured = (process.env.SETEUK_LOGIN_PASSWORD || '').trim();
    if (configured) return configured;
    if (process.env.NODE_ENV === 'production') return null;
    return '123123';
}

function normalizeSchoolName(value: string): string {
    return value.trim().replace(/\s+/g, '');
}

export function isSeonghoSchool(value?: string): boolean {
    return normalizeSchoolName(value || '') === SEONGHO_SCHOOL_NAME;
}

export function isHangulTeacherName(value: string): boolean {
    return /^[가-힣]{2,10}$/.test(value.trim());
}

/** 학교·이름 형식만 검증한다. 비밀번호 확인이 없으므로 클라이언트에서도 사용할 수 있다. */
export function validateSeonghoLoginFields(input: {
    school: string;
    userId: string;
}): { ok: true; teacherName: string; school: string } | { ok: false; message: string } {
    const school = normalizeSchoolName(input.school);
    const teacherName = input.userId.trim();

    if (school !== SEONGHO_SCHOOL_NAME) {
        return { ok: false, message: '성호중학교 계정만 로그인할 수 있습니다.' };
    }

    if (!isHangulTeacherName(teacherName)) {
        return { ok: false, message: '아이디에는 본인 한글 이름만 입력하세요.' };
    }

    return { ok: true, teacherName, school: SEONGHO_SCHOOL_NAME };
}

/** 서버 전용: 필드 검증에 더해 비밀번호까지 확인한다. */
export function validateSeonghoLogin(input: {
    school: string;
    userId: string;
    password: string;
}): { ok: true; teacherName: string; school: string } | { ok: false; message: string } {
    const fields = validateSeonghoLoginFields(input);
    if (!fields.ok) return fields;

    const expectedPassword = getLoginPassword();
    if (!expectedPassword) {
        return { ok: false, message: '로그인 설정(SETEUK_LOGIN_PASSWORD)이 아직 완료되지 않았습니다. 관리자에게 문의하세요.' };
    }

    if (input.password !== expectedPassword) {
        return { ok: false, message: '비밀번호가 올바르지 않습니다.' };
    }

    return { ok: true, teacherName: fields.teacherName, school: fields.school };
}

export function isAuthorizedSeonghoTeacher(teacher: TeacherProfile | null): boolean {
    if (!teacher) return false;

    return teacher.authMode === SEONGHO_AUTH_MODE
        && isSeonghoSchool(teacher.school)
        && isHangulTeacherName(teacher.name);
}
