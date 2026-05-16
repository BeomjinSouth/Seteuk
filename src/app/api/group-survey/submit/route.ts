import { NextRequest, NextResponse } from 'next/server';
import {
    normalizeSurveyAnswers,
} from '@/lib/group-survey';
import { verifyGroupSurveySubmitToken } from '@/lib/group-survey-token';
import { getStudents } from '@/lib/sheets';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';
import {
    getGroupSurveySessionById,
    upsertGroupSurveyResponse,
} from '@/lib/supabase/group-survey-store';

export async function POST(request: NextRequest) {
    try {
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json() as {
            token?: string;
            answers?: unknown;
        };
        const tokenPayload = verifyGroupSurveySubmitToken(body.token);
        if (!tokenPayload) {
            return NextResponse.json(
                { success: false, error: '설문 제출 시간이 만료되었습니다. 다시 학생 확인을 해 주세요.' },
                { status: 401 }
            );
        }

        const answers = normalizeSurveyAnswers(body.answers);
        if (!answers) {
            return NextResponse.json(
                { success: false, error: '12개 문항에 모두 1~5번으로 응답해 주세요.' },
                { status: 400 }
            );
        }

        const session = await getGroupSurveySessionById(tokenPayload.sessionId);
        if (!session) {
            return NextResponse.json(
                { success: false, error: '설문을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        if (session.status !== 'open') {
            return NextResponse.json(
                { success: false, error: '마감된 설문입니다.' },
                { status: 409 }
            );
        }

        const students = await getStudents({ school: session.school });
        const student = students.find((item) => item.id === tokenPayload.studentId);
        if (!student) {
            return NextResponse.json(
                { success: false, error: '설문 대상 학생을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const response = await upsertGroupSurveyResponse({
            session,
            studentId: student.id,
            grade: student.grade || session.grade,
            classNumber: student.classNumber || session.classNumber,
            number: student.number,
            name: student.name,
            answers,
        });

        return NextResponse.json({
            success: true,
            response: {
                willAvg: response.willAvg,
                agencyAvg: response.agencyAvg,
                submittedAt: response.submittedAt,
            },
        });
    } catch (error) {
        console.error('Group survey submit error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '설문 제출 중 오류가 발생했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}
