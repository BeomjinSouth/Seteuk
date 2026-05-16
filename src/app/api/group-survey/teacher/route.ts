import { NextRequest, NextResponse } from 'next/server';
import { requireTeacherSession } from '@/lib/auth/guards';
import {
    buildGroupRecommendation,
    buildSurveyProfiles,
} from '@/lib/group-survey';
import { getStudents } from '@/lib/sheets';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';
import {
    createGroupSurveySession,
    getGroupStudentSkillScores,
    getGroupSurveyResponses,
    getGroupSurveySessionById,
    listGroupSurveySessions,
    saveGroupingRecommendationRun,
    updateGroupSurveySessionStatus,
    upsertGroupStudentSkillScore,
} from '@/lib/supabase/group-survey-store';
import type { SkillScore } from '@/types';

function isSkillScore(value: unknown): value is SkillScore {
    return value === 1 || value === 2 || value === 3;
}

function parseGroupSize(value: unknown): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return 4;
    return Math.min(5, Math.max(2, Math.round(parsed)));
}

async function loadClassSurveyPayload(input: {
    teacherKey: string;
    classId: string;
    sessionId?: string;
}) {
    const sessions = await listGroupSurveySessions({
        teacherKey: input.teacherKey,
    });
    const activeSession = input.sessionId
        ? sessions.find((session) => session.id === input.sessionId)
        : sessions[0];
    const responses = activeSession ? await getGroupSurveyResponses(activeSession.id) : [];
    const skills = await getGroupStudentSkillScores({
        teacherKey: input.teacherKey,
        classId: input.classId,
    });

    return {
        sessions,
        activeSessionId: activeSession?.id || null,
        responses,
        skills,
    };
}

export async function GET(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const classId = request.nextUrl.searchParams.get('classId') || '';
        const sessionId = request.nextUrl.searchParams.get('sessionId') || undefined;
        if (!classId) {
            return NextResponse.json(
                { success: false, error: 'classId가 필요합니다.' },
                { status: 400 }
            );
        }

        const payload = await loadClassSurveyPayload({
            teacherKey: session.teacher.teacherKey,
            classId,
            sessionId,
        });

        return NextResponse.json({ success: true, ...payload });
    } catch (error) {
        console.error('Group survey teacher GET error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '모둠 설문 정보를 불러오지 못했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json() as {
            action?: string;
            classId?: string;
            grade?: number;
            classNumber?: number;
            sessionId?: string;
            status?: 'open' | 'closed';
            studentId?: string;
            skillScore?: unknown;
            groupSize?: unknown;
        };

        if (body.action === 'create_session') {
            const surveySession = await createGroupSurveySession({
                school: session.teacher.school,
                teacherKey: session.teacher.teacherKey,
                teacherName: session.teacher.name,
                classId: 'all',
                grade: 1,
                classNumber: 1,
                title: '전체 학급 함께 배우기 설문',
            });
            const payload = await loadClassSurveyPayload({
                teacherKey: session.teacher.teacherKey,
                classId: body.classId || 'all',
                sessionId: surveySession.id,
            });

            return NextResponse.json({ success: true, session: surveySession, ...payload });
        }

        if (body.action === 'set_status') {
            if (!body.sessionId || !body.status) {
                return NextResponse.json(
                    { success: false, error: '설문 ID와 상태가 필요합니다.' },
                    { status: 400 }
                );
            }
            const updated = await updateGroupSurveySessionStatus({
                sessionId: body.sessionId,
                teacherKey: session.teacher.teacherKey,
                status: body.status,
            });

            return NextResponse.json({ success: true, session: updated });
        }

        if (body.action === 'save_skill') {
            if (!body.classId || !body.studentId || !isSkillScore(body.skillScore)) {
                return NextResponse.json(
                    { success: false, error: '학생과 Skill 1~3 값이 필요합니다.' },
                    { status: 400 }
                );
            }

            const skill = await upsertGroupStudentSkillScore({
                teacherKey: session.teacher.teacherKey,
                classId: body.classId,
                studentId: body.studentId,
                skillScore: body.skillScore,
            });

            return NextResponse.json({ success: true, skill });
        }

        if (body.action === 'recommend') {
            if (!body.sessionId || !body.classId) {
                return NextResponse.json(
                    { success: false, error: '설문 ID와 학급 ID가 필요합니다.' },
                    { status: 400 }
                );
            }

            const surveySession = await getGroupSurveySessionById(body.sessionId);
            if (!surveySession || surveySession.teacherKey !== session.teacher.teacherKey) {
                return NextResponse.json(
                    { success: false, error: '설문을 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            const students = (await getStudents({
                school: surveySession.school,
                grade: surveySession.grade,
            })).filter((student) => student.classNumber === surveySession.classNumber);
            const [responses, skills] = await Promise.all([
                getGroupSurveyResponses(surveySession.id),
                getGroupStudentSkillScores({
                    teacherKey: session.teacher.teacherKey,
                    classId: body.classId,
                }),
            ]);
            const result = buildGroupRecommendation(
                buildSurveyProfiles({ students, responses, skills }),
                parseGroupSize(body.groupSize)
            );
            const run = await saveGroupingRecommendationRun({
                teacherKey: session.teacher.teacherKey,
                classId: body.classId,
                sessionId: surveySession.id,
                groupSize: parseGroupSize(body.groupSize),
                result,
            });

            return NextResponse.json({ success: true, result, run });
        }

        return NextResponse.json(
            { success: false, error: '지원하지 않는 작업입니다.' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Group survey teacher POST error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '모둠 설문 작업 중 오류가 발생했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}
