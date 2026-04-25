import { Semester } from './common';

export type StudentDataKind = 'note' | 'grade' | 'mentor_match';

export interface StudentDataBasePayload {
    [key: string]: string | undefined;
    memo?: string;
}

export interface StudentNotePayload extends StudentDataBasePayload {
    memo: string;
}

export interface StudentGradePayload extends StudentDataBasePayload {
    examName: string;
    examDate: string;
    score: string;
    maxScore: string;
    level?: string;
}

export interface StudentMentorPayload extends StudentDataBasePayload {
    mentorStudentId: string;
    menteeStudentId: string;
}

export type StudentDataPayload =
    | StudentNotePayload
    | StudentGradePayload
    | StudentMentorPayload
    | Record<string, string | undefined>;

export interface StudentDataEntry {
    id: string;
    school: string;
    teacherKey: string;
    classId: string;
    semester: Semester;
    studentId: string;
    kind: StudentDataKind;
    title: string;
    occurredAt: string;
    includeInAi: boolean;
    payload: StudentDataPayload;
    createdAt: string;
    updatedAt: string;
}

export type CookieTransactionType = 'award' | 'redeem' | 'adjust';

export interface CookieTransaction {
    id: string;
    school: string;
    studentId: string;
    amount: number;
    type: CookieTransactionType;
    reason: string;
    rewardId?: string;
    teacherKey: string;
    createdAt: string;
}

export interface CookieReward {
    id: string;
    school: string;
    name: string;
    cost: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CookieBalance {
    studentId: string;
    balance: number;
    awarded: number;
    redeemed: number;
    adjusted: number;
}
