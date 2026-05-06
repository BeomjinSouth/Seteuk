import { NextRequest, NextResponse } from 'next/server';
import {
    deleteStudentDataEntry,
    getStudentDataEntries,
    saveStudentDataEntry,
} from '@/lib/sheets';
import { initializeSheets } from '@/lib/sheets/base';
import { StudentDataKind, StudentDataPayload } from '@/types';
import { rejectWhenDifferentSchool, rejectWhenDifferentTeacher, requireTeacherSession } from '@/lib/auth/guards';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';

function parseKind(value: unknown): StudentDataKind | null {
    return value === 'note' || value === 'grade' || value === 'mentor_match'
        ? value
        : null;
}

export async function GET(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const { searchParams } = new URL(request.url);
        const includeInAiParam = searchParams.get('includeInAi');
        const includeInAi = includeInAiParam === null
            ? undefined
            : includeInAiParam === 'true';

        const school = searchParams.get('school') || undefined;
        const teacherKey = searchParams.get('teacherKey') || undefined;
        const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, school);
        if (schoolGuard) return schoolGuard;
        const teacherGuard = rejectWhenDifferentTeacher(session.teacher.teacherKey, teacherKey);
        if (teacherGuard) return teacherGuard;

        const entries = await getStudentDataEntries({
            school,
            teacherKey: teacherKey || session.teacher.teacherKey,
            classId: searchParams.get('classId') || undefined,
            semester: searchParams.get('semester') === '1' || searchParams.get('semester') === '2'
                ? searchParams.get('semester') as '1' | '2'
                : undefined,
            studentId: searchParams.get('studentId') || undefined,
            includeInAi,
        });

        return NextResponse.json({ success: true, data: entries, entries });
    } catch (error) {
        console.error('Get student data error:', error);
        return NextResponse.json(
            { success: false, error: '학생 개별 데이터를 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        await initializeSheets();
        const body = await request.json();
        const kind = parseKind(body.kind);
        const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, body.school ? String(body.school) : undefined);
        if (schoolGuard) return schoolGuard;
        const teacherGuard = rejectWhenDifferentTeacher(session.teacher.teacherKey, body.teacherKey ? String(body.teacherKey) : undefined);
        if (teacherGuard) return teacherGuard;

        if (!kind || !body.school || !body.teacherKey || !body.classId || !body.studentId) {
            return NextResponse.json(
                { success: false, error: '필수 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        if (body.semester !== '1' && body.semester !== '2') {
            return NextResponse.json(
                { success: false, error: '학기 값이 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        const entry = await saveStudentDataEntry({
            id: body.id || undefined,
            school: String(body.school),
            teacherKey: String(body.teacherKey),
            classId: String(body.classId),
            semester: body.semester,
            studentId: String(body.studentId),
            kind,
            title: String(body.title || ''),
            occurredAt: String(body.occurredAt || new Date().toISOString().slice(0, 10)),
            includeInAi: body.includeInAi !== false,
            payload: (body.payload || {}) as StudentDataPayload,
        });

        return NextResponse.json({ success: true, data: entry, entry });
    } catch (error) {
        console.error('Save student data error:', error);
        return NextResponse.json(
            { success: false, error: '학생 개별 데이터를 저장하지 못했습니다.' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    return POST(request);
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        await initializeSheets();
        const id = request.nextUrl.searchParams.get('id');
        if (!id) {
            return NextResponse.json(
                { success: false, error: '삭제할 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await deleteStudentDataEntry(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete student data error:', error);
        return NextResponse.json(
            { success: false, error: '학생 개별 데이터를 삭제하지 못했습니다.' },
            { status: 500 }
        );
    }
}
