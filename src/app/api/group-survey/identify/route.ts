import { NextRequest, NextResponse } from 'next/server';
import { createGroupSurveySubmitToken } from '@/lib/group-survey-token';
import { checkRateLimit, getClientAddress } from '@/lib/rate-limit';
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

function normalizeStudentName(value: unknown): string {
    return typeof value === 'string' ? value.replace(/\s+/g, '') : '';
}

// 이름 불일치와 좌표 불일치를 구분할 수 없게 동일한 실패 응답을 사용한다.
// 명렬표 실명은 어떤 경우에도 응답에 싣지 않는다.
function identifyFailedResponse() {
    return NextResponse.json(
        { success: false, error: '입력한 학년·반·번호·이름과 일치하는 학생을 찾지 못했습니다.' },
        { status: 404 }
    );
}

export async function POST(request: NextRequest) {
    try {
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json() as {
            accessCode?: string;
            grade?: unknown;
            classNumber?: unknown;
            number?: unknown;
            name?: unknown;
        };

        const accessCode = (body.accessCode || '').trim().toUpperCase();
        const grade = parsePositiveInt(body.grade);
        const classNumber = parsePositiveInt(body.classNumber);
        const number = parsePositiveInt(body.number);
        const enteredName = normalizeStudentName(body.name);

        if (!accessCode || !grade || !classNumber || !number || !enteredName) {
            return NextResponse.json(
                { success: false, error: '학년, 반, 번호, 이름을 모두 입력해 주세요.' },
                { status: 400 }
            );
        }

        const rate = checkRateLimit({
            scope: 'survey-identify',
            identity: `${getClientAddress(request)}:${accessCode}`,
            limit: 20,
            windowSeconds: 10 * 60,
        });
        if (!rate.allowed) {
            return NextResponse.json(
                { success: false, error: '확인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.' },
                { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds) } },
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

        const students = await getStudents({ school: session.school, grade });
        const student = students.find((item) =>
            item.classNumber === classNumber
            && item.number === number
        );

        if (!student || normalizeStudentName(student.name) !== enteredName) {
            return identifyFailedResponse();
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
