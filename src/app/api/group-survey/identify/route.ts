import { NextRequest, NextResponse } from 'next/server';
import { createGroupSurveySubmitToken } from '@/lib/group-survey-token';
import { getStudents } from '@/lib/sheets';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';
import {
    getGroupSurveyResponse,
    getGroupSurveySessionByAccessCode,
} from '@/lib/supabase/group-survey-store';

function parsePositiveInt(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function POST(request: NextRequest) {
    try {
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json() as {
            accessCode?: string;
            grade?: unknown;
            classNumber?: unknown;
            number?: unknown;
        };

        const accessCode = (body.accessCode || '').trim().toUpperCase();
        const grade = parsePositiveInt(body.grade);
        const classNumber = parsePositiveInt(body.classNumber);
        const number = parsePositiveInt(body.number);

        if (!accessCode || !grade || !classNumber || !number) {
            return NextResponse.json(
                { success: false, error: '학년, 반, 번호를 모두 입력해 주세요.' },
                { status: 400 }
            );
        }

        const session = await getGroupSurveySessionByAccessCode(accessCode);
        if (!session) {
            return NextResponse.json(
                { success: false, error: '설문 링크를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        if (session.status !== 'open') {
            return NextResponse.json(
                { success: false, error: '마감된 설문입니다.' },
                { status: 409 }
            );
        }

        if (session.grade !== grade || session.classNumber !== classNumber) {
            return NextResponse.json(
                { success: false, error: '이 설문은 입력한 학급용 설문이 아닙니다.' },
                { status: 403 }
            );
        }

        const students = await getStudents({ school: session.school, grade });
        const student = students.find((item) =>
            item.classNumber === classNumber
            && item.number === number
        );

        if (!student) {
            return NextResponse.json(
                { success: false, error: '입력한 학년·반·번호와 일치하는 학생을 찾지 못했습니다.' },
                { status: 404 }
            );
        }

        const existingResponse = await getGroupSurveyResponse({
            sessionId: session.id,
            studentId: student.id,
        });
        const token = createGroupSurveySubmitToken({
            sessionId: session.id,
            studentId: student.id,
        });

        return NextResponse.json({
            success: true,
            token,
            alreadySubmitted: Boolean(existingResponse),
            student: {
                name: student.name,
                grade: student.grade,
                classNumber: student.classNumber,
                number: student.number,
            },
            session: {
                title: session.title,
                accessCode: session.accessCode,
            },
        });
    } catch (error) {
        console.error('Group survey identify error:', error);
        return NextResponse.json(
            {
                success: false,
                error: '학생 확인 중 오류가 발생했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? String(error) : undefined,
            },
            { status: 500 }
        );
    }
}
