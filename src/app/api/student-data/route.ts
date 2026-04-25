import { NextRequest, NextResponse } from 'next/server';
import {
    deleteStudentDataEntry,
    getStudentDataEntries,
    saveStudentDataEntry,
} from '@/lib/sheets';
import { initializeSheets } from '@/lib/sheets/base';
import { StudentDataKind, StudentDataPayload } from '@/types';

function parseKind(value: unknown): StudentDataKind | null {
    return value === 'note' || value === 'grade' || value === 'mentor_match'
        ? value
        : null;
}

export async function GET(request: NextRequest) {
    try {
        await initializeSheets();
        const { searchParams } = new URL(request.url);
        const includeInAiParam = searchParams.get('includeInAi');
        const includeInAi = includeInAiParam === null
            ? undefined
            : includeInAiParam === 'true';

        const entries = await getStudentDataEntries({
            school: searchParams.get('school') || undefined,
            teacherKey: searchParams.get('teacherKey') || undefined,
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
        await initializeSheets();
        const body = await request.json();
        const kind = parseKind(body.kind);

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
