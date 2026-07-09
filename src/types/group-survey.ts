import type { Student } from './student';

export type GroupSurveyStatus = 'open' | 'closed';
export type SkillScore = 1 | 2 | 3;
export type SurveyAnswerValue = 1 | 2 | 3 | 4 | 5;

export interface GroupSurveySession {
    id: string;
    accessCode: string;
    school: string;
    teacherKey: string;
    teacherName: string;
    classId: string;
    grade: number;
    classNumber: number;
    title: string;
    status: GroupSurveyStatus;
    createdAt: string;
    updatedAt: string;
}

export interface GroupSurveyResponse {
    sessionId: string;
    studentId: string;
    school: string;
    grade: number;
    classNumber: number;
    number: number;
    name: string;
    answers: SurveyAnswerValue[];
    willAvg: number;
    agencyAvg: number;
    submittedAt: string;
}

export interface GroupStudentSkillScore {
    teacherKey: string;
    classId: string;
    studentId: string;
    skillScore: SkillScore;
    updatedAt: string;
}

export interface GroupSurveyStudentProfile {
    student: Pick<Student, 'id' | 'name' | 'number' | 'grade' | 'classNumber' | 'school'>;
    response?: GroupSurveyResponse;
    skill?: GroupStudentSkillScore;
    willAvg?: number;
    agencyAvg?: number;
    skillScore?: SkillScore;
}

export interface GroupRecommendationMember {
    studentId: string;
    name: string;
    number: number;
    skillScore: SkillScore;
    willAvg: number;
    agencyAvg: number;
}

export interface GroupRecommendationGroup {
    id: string;
    title: string;
    members: GroupRecommendationMember[];
    feedback: string[];
}

export interface GroupRecommendationResult {
    groups: GroupRecommendationGroup[];
    excluded: Array<{ studentId: string; name: string; reason: string }>;
    summary: string[];
    createdAt: string;
}

export interface GroupingRecommendationRun {
    id: string;
    teacherKey: string;
    classId: string;
    sessionId: string;
    groupSize: number;
    result: GroupRecommendationResult;
    createdAt: string;
}
