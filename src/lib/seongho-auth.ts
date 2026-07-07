import type { TeacherProfile } from '@/types';

export const SEONGHO_SCHOOL_NAME = '성호중학교';
const SEONGHO_LOGIN_PASSWORD = '123123';
export const SEONGHO_DEFAULT_SUBJECT = '담당 교과';
export const SEONGHO_AUTH_MODE = 'seongho-school';

function normalizeSchoolName(value: string): string {
    return value.trim().replace(/\s+/g, '');
}

export function isSeonghoSchool(value?: string): boolean {
    return normalizeSchoolName(value || '') === SEONGHO_SCHOOL_NAME;
}

export function isHangulTeacherName(value: string): boolean {
    return /^[가-힣]{2,10}$/.test(value.trim());
}

export function validateSeonghoLogin(input: {
    school: string;
    userId: string;
    password: string;
}): { ok: true; teacherName: string; school: string } | { ok: false; message: string } {
    const school = normalizeSchoolName(input.school);
    const teacherName = input.userId.trim();

    if (school !== SEONGHO_SCHOOL_NAME) {
        return { ok: false, message: '성호중학교 계정만 로그인할 수 있습니다.' };
    }

    if (!isHangulTeacherName(teacherName)) {
        return { ok: false, message: '아이디에는 본인 한글 이름만 입력하세요.' };
    }

    if (input.password !== SEONGHO_LOGIN_PASSWORD) {
        return { ok: false, message: '비밀번호가 올바르지 않습니다.' };
    }

    return { ok: true, teacherName, school: SEONGHO_SCHOOL_NAME };
}

export function isAuthorizedSeonghoTeacher(teacher: TeacherProfile | null): boolean {
    if (!teacher) return false;

    return teacher.authMode === SEONGHO_AUTH_MODE
        && isSeonghoSchool(teacher.school)
        && isHangulTeacherName(teacher.name);
}
