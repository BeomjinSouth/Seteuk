import { NextRequest, NextResponse } from 'next/server';
import {
    getObservations,
    getObservationsByStudent,
    getObservationsForContext,
    addObservation,
    updateObservation,
    deleteObservation,
} from '@/lib/sheets';
import { rejectWhenDifferentTeacher, requireTeacherSession } from '@/lib/auth/guards';

// GET - 관찰 메모 조회
/**
 * Retrieves student observation records.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - studentId?: string (Optional, to filter by student)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - data: Array of Observation objects
 */
export async function GET(request: NextRequest) {
    const session = await requireTeacherSession();
    if (!session.ok) return session.response;

    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const teacherKey = searchParams.get('teacherKey') || undefined;
    const classId = searchParams.get('classId') || undefined;
    const teacherGuard = rejectWhenDifferentTeacher(session.teacher.teacherKey, teacherKey);
    if (teacherGuard) return teacherGuard;

    try {
        let observations;

        if (studentId && (teacherKey || classId)) {
            observations = await getObservationsForContext({ studentId, teacherKey, classId });
        } else if (studentId) {
            observations = await getObservationsByStudent(studentId);
        } else {
            observations = await getObservations();
        }
        const visibleObservations = observations.filter((observation) =>
            !observation.teacherKey || observation.teacherKey === session.teacher.teacherKey
        );

        return NextResponse.json({
            success: true,
            data: visibleObservations,
        });
    } catch (error) {
        console.error('Failed to get observations:', error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            {
                success: false,
                error: '관찰 메모 조회에 실패했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? detail : undefined,
            },
            { status: 500 }
        );
    }
}

// POST - 관찰 메모 추가
/**
 * Creates a new observation record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - studentId: string (Required)
 *   - date: string (YYYY-MM-DD, Required)
 *   - memo: string (Required)
 *   - assessmentId?: string
 *   - evidenceType?: 'process' | 'outcome'
 *   - tags?: string[]
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - id: string
 *   - message: string
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;

        const body = await request.json();
        const {
            studentId,
            classId,
            teacherKey,
            assessmentId,
            subjectName,
            lessonTopic,
            date,
            memo,
            evidenceType,
            tags,
            sourceType,
            ocrData,
            imageUrl,
        } = body;
        const teacherGuard = rejectWhenDifferentTeacher(session.teacher.teacherKey, teacherKey);
        if (teacherGuard) return teacherGuard;

        if (!studentId || !classId || !teacherKey || !date || !memo) {
            return NextResponse.json(
                { success: false, error: '필수 항목이 누락되었습니다. (학생ID, 수업ID, 교사키, 날짜, 메모)' },
                { status: 400 }
            );
        }

        const id = await addObservation({
            studentId,
            classId,
            teacherKey,
            assessmentId: assessmentId || undefined,
            subjectName: subjectName || undefined,
            lessonTopic: lessonTopic || undefined,
            date,
            memo,
            evidenceType: evidenceType || 'process',
            tags: tags || [],
            sourceType: sourceType || 'manual',
            ocrData: ocrData || undefined,
            imageUrl: imageUrl || undefined,
        });

        return NextResponse.json({
            success: true,
            id,
            message: '관찰 메모가 저장되었습니다.',
        });
    } catch (error) {
        console.error('Failed to add observation:', error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            {
                success: false,
                error: '관찰 메모 저장에 실패했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? detail : undefined,
            },
            { status: 500 }
        );
    }
}

// PUT - 관찰 메모 수정
/**
 * Updates an existing observation record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - id: string (Required)
 *   - ...other fields to update
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;

        const body = await request.json();
        const { id, ...data } = body;
        const teacherGuard = rejectWhenDifferentTeacher(session.teacher.teacherKey, data.teacherKey);
        if (teacherGuard) return teacherGuard;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await updateObservation(id, data);

        return NextResponse.json({
            success: true,
            message: '관찰 메모가 수정되었습니다.',
        });
    } catch (error) {
        console.error('Failed to update observation:', error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            {
                success: false,
                error: '관찰 메모 수정에 실패했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? detail : undefined,
            },
            { status: 500 }
        );
    }
}

// DELETE - 관찰 메모 삭제
/**
 * Deletes an observation record.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - id: string (Required)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function DELETE(request: NextRequest) {
    const session = await requireTeacherSession();
    if (!session.ok) return session.response;

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { success: false, error: 'ID가 필요합니다.' },
            { status: 400 }
        );
    }

    try {
        await deleteObservation(id);

        return NextResponse.json({
            success: true,
            message: '관찰 메모가 삭제되었습니다.',
        });
    } catch (error) {
        console.error('Failed to delete observation:', error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            {
                success: false,
                error: '관찰 메모 삭제에 실패했습니다.',
                detail: process.env.NODE_ENV !== 'production' ? detail : undefined,
            },
            { status: 500 }
        );
    }
}
