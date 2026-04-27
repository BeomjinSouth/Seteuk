import { NextRequest, NextResponse } from 'next/server';
import {
    getAssessments,
    addAssessment,
    updateAssessment,
    deleteAssessment,
} from '@/lib/sheets';
import { requireTeacherSession } from '@/lib/auth/guards';

// GET - 평가 과제 조회
// GET - 평가 과제 조회
/**
 * Retrieves all assessment tasks.
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - data: Array of Assessment objects
 */
export async function GET() {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;

        const assessments = await getAssessments();

        return NextResponse.json({
            success: true,
            data: assessments,
        });
    } catch (error) {
        console.error('Failed to get assessments:', error);
        return NextResponse.json(
            { success: false, error: '평가 과제 조회에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// POST - 평가 과제 추가
// POST - 평가 과제 추가
/**
 * Creates a new assessment task.
 * 
 * @param {NextRequest} request - The request object containing:
 *   - title: string (Required)
 *   - unit: string
 *   - achievementStandard: string
 *   - assessmentDate: string (YYYY-MM-DD)
 *   - competencyTags: string[]
 *   - description: string
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - id: string (The ID of the created assessment)
 *   - message: string
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;

        const body = await request.json();
        const {
            title,
            unit,
            achievementStandard,
            assessmentDate,
            competencyTags,
            description,
        } = body;

        if (!title) {
            return NextResponse.json(
                { success: false, error: '과제명은 필수입니다.' },
                { status: 400 }
            );
        }

        const id = await addAssessment({
            title,
            unit: unit || '',
            achievementStandard: achievementStandard || '',
            assessmentDate: assessmentDate || new Date().toISOString().split('T')[0],
            competencyTags: competencyTags || [],
            description: description || '',
        });

        return NextResponse.json({
            success: true,
            id,
            message: '평가 과제가 등록되었습니다.',
        });
    } catch (error) {
        console.error('Failed to add assessment:', error);
        return NextResponse.json(
            { success: false, error: '평가 과제 등록에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// PUT - 평가 과제 수정
// PUT - 평가 과제 수정
/**
 * Updates an existing assessment task.
 * 
 * @param {NextRequest} request - The request object containing:
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

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await updateAssessment(id, data);

        return NextResponse.json({
            success: true,
            message: '평가 과제가 수정되었습니다.',
        });
    } catch (error) {
        console.error('Failed to update assessment:', error);
        return NextResponse.json(
            { success: false, error: '평가 과제 수정에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE - 평가 과제 삭제
// DELETE - 평가 과제 삭제
/**
 * Deletes an assessment task by ID.
 * 
 * @param {NextRequest} request - The request object containing 'id' in searchParams.
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
        await deleteAssessment(id);

        return NextResponse.json({
            success: true,
            message: '평가 과제가 삭제되었습니다.',
        });
    } catch (error) {
        console.error('Failed to delete assessment:', error);
        return NextResponse.json(
            { success: false, error: '평가 과제 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
}
