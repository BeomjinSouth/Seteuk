import { scoreSurveyAnswers } from '@/lib/group-survey';
import { createAccessCode } from '@/lib/group-survey-token';
import {
    getSupabaseAdminClient,
} from '@/lib/supabase/server';
import {
    isProductionRuntime,
    isSupabaseConfigured,
} from '@/lib/supabase/config';
import type {
    GroupingRecommendationRun,
    GroupRecommendationResult,
    GroupStudentSkillScore,
    GroupSurveyResponse,
    GroupSurveySession,
    GroupSurveyStatus,
    SkillScore,
    SurveyAnswerValue,
} from '@/types';

type SessionRow = {
    id: string;
    access_code: string;
    school: string;
    teacher_key: string;
    teacher_name: string | null;
    class_id: string;
    grade: number;
    class_number: number;
    title: string | null;
    status: GroupSurveyStatus;
    created_at: string;
    updated_at: string;
};

type ResponseRow = {
    session_id: string;
    student_id: string;
    school: string;
    grade: number;
    class_number: number;
    number: number;
    name: string;
    answers: unknown;
    will_avg: number;
    agency_avg: number;
    submitted_at: string;
};

type SkillRow = {
    teacher_key: string;
    class_id: string;
    student_id: string;
    skill_score: SkillScore;
    updated_at: string;
};

type RunRow = {
    id: string;
    teacher_key: string;
    class_id: string;
    session_id: string;
    group_size: number;
    result: unknown;
    created_at: string;
};

const memoryStore = {
    sessions: [] as GroupSurveySession[],
    responses: [] as GroupSurveyResponse[],
    skills: [] as GroupStudentSkillScore[],
    runs: [] as GroupingRecommendationRun[],
};

function assertStorageAvailable(operation: string) {
    if (isProductionRuntime() && !isSupabaseConfigured()) {
        throw new Error(`Supabase group survey store ${operation} failed: Supabase is required in production.`);
    }
}

function toSession(row: SessionRow): GroupSurveySession {
    return {
        id: row.id,
        accessCode: row.access_code,
        school: row.school,
        teacherKey: row.teacher_key,
        teacherName: row.teacher_name || '',
        classId: row.class_id,
        grade: row.grade,
        classNumber: row.class_number,
        title: row.title || '',
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function toResponse(row: ResponseRow): GroupSurveyResponse {
    return {
        sessionId: row.session_id,
        studentId: row.student_id,
        school: row.school,
        grade: row.grade,
        classNumber: row.class_number,
        number: row.number,
        name: row.name,
        answers: Array.isArray(row.answers) ? row.answers.map(Number) as SurveyAnswerValue[] : [],
        willAvg: Number(row.will_avg),
        agencyAvg: Number(row.agency_avg),
        submittedAt: row.submitted_at,
    };
}

function toSkill(row: SkillRow): GroupStudentSkillScore {
    return {
        teacherKey: row.teacher_key,
        classId: row.class_id,
        studentId: row.student_id,
        skillScore: row.skill_score,
        updatedAt: row.updated_at,
    };
}

function toRun(row: RunRow): GroupingRecommendationRun {
    return {
        id: row.id,
        teacherKey: row.teacher_key,
        classId: row.class_id,
        sessionId: row.session_id,
        groupSize: row.group_size,
        result: row.result as GroupRecommendationResult,
        createdAt: row.created_at,
    };
}

function assertNoError(error: unknown, operation: string): void {
    if (!error) return;
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Supabase group survey store ${operation} failed: ${message}`);
}

export async function createGroupSurveySession(input: {
    school: string;
    teacherKey: string;
    teacherName: string;
    classId: string;
    grade: number;
    classNumber: number;
    title?: string;
}): Promise<GroupSurveySession> {
    assertStorageAvailable('create session');
    const now = new Date().toISOString();

    if (!isSupabaseConfigured()) {
        let accessCode = createAccessCode();
        while (memoryStore.sessions.some((session) => session.accessCode === accessCode)) {
            accessCode = createAccessCode();
        }

        const session: GroupSurveySession = {
            id: `survey-${Date.now()}-${Math.round(Math.random() * 10000)}`,
            accessCode,
            school: input.school,
            teacherKey: input.teacherKey,
            teacherName: input.teacherName,
            classId: input.classId,
            grade: input.grade,
            classNumber: input.classNumber,
            title: input.title || `${input.grade}학년 ${input.classNumber}반 함께 배우기 설문`,
            status: 'open',
            createdAt: now,
            updatedAt: now,
        };
        memoryStore.sessions.unshift(session);
        return session;
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const accessCode = createAccessCode();
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
            .from('group_survey_sessions')
            .insert({
                access_code: accessCode,
                school: input.school,
                teacher_key: input.teacherKey,
                teacher_name: input.teacherName,
                class_id: input.classId,
                grade: input.grade,
                class_number: input.classNumber,
                title: input.title || `${input.grade}학년 ${input.classNumber}반 함께 배우기 설문`,
                status: 'open',
            })
            .select('id,access_code,school,teacher_key,teacher_name,class_id,grade,class_number,title,status,created_at,updated_at')
            .single();

        if (!error && data) return toSession(data as SessionRow);
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        if (!message.includes('duplicate') && !message.includes('unique')) {
            assertNoError(error, 'create session');
        }
    }

    throw new Error('Unable to create a unique survey access code.');
}

export async function listGroupSurveySessions(input: {
    teacherKey: string;
    classId?: string;
}): Promise<GroupSurveySession[]> {
    assertStorageAvailable('list sessions');

    if (!isSupabaseConfigured()) {
        return memoryStore.sessions
            .filter((session) => session.teacherKey === input.teacherKey)
            .filter((session) => !input.classId || session.classId === input.classId)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    let query = getSupabaseAdminClient()
        .from('group_survey_sessions')
        .select('id,access_code,school,teacher_key,teacher_name,class_id,grade,class_number,title,status,created_at,updated_at')
        .eq('teacher_key', input.teacherKey)
        .order('created_at', { ascending: false });

    if (input.classId) query = query.eq('class_id', input.classId);

    const { data, error } = await query;
    assertNoError(error, 'list sessions');
    return ((data || []) as SessionRow[]).map(toSession);
}

export async function getGroupSurveySessionByAccessCode(accessCode: string): Promise<GroupSurveySession | null> {
    assertStorageAvailable('read session by access code');
    const normalizedCode = accessCode.trim().toUpperCase();

    if (!isSupabaseConfigured()) {
        return memoryStore.sessions.find((session) => session.accessCode === normalizedCode) || null;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_sessions')
        .select('id,access_code,school,teacher_key,teacher_name,class_id,grade,class_number,title,status,created_at,updated_at')
        .eq('access_code', normalizedCode)
        .maybeSingle();

    assertNoError(error, 'read session by access code');
    return data ? toSession(data as SessionRow) : null;
}

export async function getGroupSurveySessionById(sessionId: string): Promise<GroupSurveySession | null> {
    assertStorageAvailable('read session by id');

    if (!isSupabaseConfigured()) {
        return memoryStore.sessions.find((session) => session.id === sessionId) || null;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_sessions')
        .select('id,access_code,school,teacher_key,teacher_name,class_id,grade,class_number,title,status,created_at,updated_at')
        .eq('id', sessionId)
        .maybeSingle();

    assertNoError(error, 'read session by id');
    return data ? toSession(data as SessionRow) : null;
}

export async function updateGroupSurveySessionStatus(input: {
    sessionId: string;
    teacherKey: string;
    status: GroupSurveyStatus;
}): Promise<GroupSurveySession> {
    assertStorageAvailable('update session status');
    const now = new Date().toISOString();

    if (!isSupabaseConfigured()) {
        const index = memoryStore.sessions.findIndex((session) =>
            session.id === input.sessionId && session.teacherKey === input.teacherKey
        );
        if (index < 0) throw new Error('Survey session not found.');
        memoryStore.sessions[index] = { ...memoryStore.sessions[index], status: input.status, updatedAt: now };
        return memoryStore.sessions[index];
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_sessions')
        .update({ status: input.status, updated_at: now })
        .eq('id', input.sessionId)
        .eq('teacher_key', input.teacherKey)
        .select('id,access_code,school,teacher_key,teacher_name,class_id,grade,class_number,title,status,created_at,updated_at')
        .single();

    assertNoError(error, 'update session status');
    return toSession(data as SessionRow);
}

export async function upsertGroupSurveyResponse(input: {
    session: GroupSurveySession;
    studentId: string;
    number: number;
    name: string;
    answers: SurveyAnswerValue[];
}): Promise<GroupSurveyResponse> {
    assertStorageAvailable('upsert response');
    const now = new Date().toISOString();
    const scores = scoreSurveyAnswers(input.answers);
    const response: GroupSurveyResponse = {
        sessionId: input.session.id,
        studentId: input.studentId,
        school: input.session.school,
        grade: input.session.grade,
        classNumber: input.session.classNumber,
        number: input.number,
        name: input.name,
        answers: input.answers,
        willAvg: scores.willAvg,
        agencyAvg: scores.agencyAvg,
        submittedAt: now,
    };

    if (!isSupabaseConfigured()) {
        const index = memoryStore.responses.findIndex((item) =>
            item.sessionId === response.sessionId && item.studentId === response.studentId
        );
        if (index >= 0) memoryStore.responses[index] = response;
        else memoryStore.responses.push(response);
        return response;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_responses')
        .upsert({
            session_id: response.sessionId,
            student_id: response.studentId,
            school: response.school,
            grade: response.grade,
            class_number: response.classNumber,
            number: response.number,
            name: response.name,
            answers: response.answers,
            will_avg: response.willAvg,
            agency_avg: response.agencyAvg,
            submitted_at: response.submittedAt,
        }, {
            onConflict: 'session_id,student_id',
        })
        .select('session_id,student_id,school,grade,class_number,number,name,answers,will_avg,agency_avg,submitted_at')
        .single();

    assertNoError(error, 'upsert response');
    return toResponse(data as ResponseRow);
}

export async function getGroupSurveyResponses(sessionId: string): Promise<GroupSurveyResponse[]> {
    assertStorageAvailable('list responses');

    if (!isSupabaseConfigured()) {
        return memoryStore.responses
            .filter((response) => response.sessionId === sessionId)
            .sort((a, b) => a.number - b.number);
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_responses')
        .select('session_id,student_id,school,grade,class_number,number,name,answers,will_avg,agency_avg,submitted_at')
        .eq('session_id', sessionId)
        .order('number', { ascending: true });

    assertNoError(error, 'list responses');
    return ((data || []) as ResponseRow[]).map(toResponse);
}

export async function getGroupSurveyResponse(input: {
    sessionId: string;
    studentId: string;
}): Promise<GroupSurveyResponse | null> {
    assertStorageAvailable('read response');

    if (!isSupabaseConfigured()) {
        return memoryStore.responses.find((response) =>
            response.sessionId === input.sessionId && response.studentId === input.studentId
        ) || null;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_survey_responses')
        .select('session_id,student_id,school,grade,class_number,number,name,answers,will_avg,agency_avg,submitted_at')
        .eq('session_id', input.sessionId)
        .eq('student_id', input.studentId)
        .maybeSingle();

    assertNoError(error, 'read response');
    return data ? toResponse(data as ResponseRow) : null;
}

export async function getGroupStudentSkillScores(input: {
    teacherKey: string;
    classId: string;
}): Promise<GroupStudentSkillScore[]> {
    assertStorageAvailable('list skill scores');

    if (!isSupabaseConfigured()) {
        return memoryStore.skills
            .filter((skill) => skill.teacherKey === input.teacherKey && skill.classId === input.classId);
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_student_skill_scores')
        .select('teacher_key,class_id,student_id,skill_score,updated_at')
        .eq('teacher_key', input.teacherKey)
        .eq('class_id', input.classId);

    assertNoError(error, 'list skill scores');
    return ((data || []) as SkillRow[]).map(toSkill);
}

export async function upsertGroupStudentSkillScore(input: {
    teacherKey: string;
    classId: string;
    studentId: string;
    skillScore: SkillScore;
}): Promise<GroupStudentSkillScore> {
    assertStorageAvailable('upsert skill score');
    const now = new Date().toISOString();
    const skill: GroupStudentSkillScore = {
        teacherKey: input.teacherKey,
        classId: input.classId,
        studentId: input.studentId,
        skillScore: input.skillScore,
        updatedAt: now,
    };

    if (!isSupabaseConfigured()) {
        const index = memoryStore.skills.findIndex((item) =>
            item.teacherKey === input.teacherKey
            && item.classId === input.classId
            && item.studentId === input.studentId
        );
        if (index >= 0) memoryStore.skills[index] = skill;
        else memoryStore.skills.push(skill);
        return skill;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('group_student_skill_scores')
        .upsert({
            teacher_key: skill.teacherKey,
            class_id: skill.classId,
            student_id: skill.studentId,
            skill_score: skill.skillScore,
            updated_at: skill.updatedAt,
        }, {
            onConflict: 'teacher_key,class_id,student_id',
        })
        .select('teacher_key,class_id,student_id,skill_score,updated_at')
        .single();

    assertNoError(error, 'upsert skill score');
    return toSkill(data as SkillRow);
}

export async function saveGroupingRecommendationRun(input: {
    teacherKey: string;
    classId: string;
    sessionId: string;
    groupSize: number;
    result: GroupRecommendationResult;
}): Promise<GroupingRecommendationRun> {
    assertStorageAvailable('save recommendation run');
    const now = new Date().toISOString();

    if (!isSupabaseConfigured()) {
        const run: GroupingRecommendationRun = {
            id: `run-${Date.now()}`,
            teacherKey: input.teacherKey,
            classId: input.classId,
            sessionId: input.sessionId,
            groupSize: input.groupSize,
            result: input.result,
            createdAt: now,
        };
        memoryStore.runs.unshift(run);
        return run;
    }

    const { data, error } = await getSupabaseAdminClient()
        .from('grouping_recommendation_runs')
        .insert({
            teacher_key: input.teacherKey,
            class_id: input.classId,
            session_id: input.sessionId,
            group_size: input.groupSize,
            result: input.result,
        })
        .select('id,teacher_key,class_id,session_id,group_size,result,created_at')
        .single();

    assertNoError(error, 'save recommendation run');
    return toRun(data as RunRow);
}
