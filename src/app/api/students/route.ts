import { NextRequest, NextResponse } from 'next/server';
import { addStudent, getStudents, mergeStudentsForSchool, updateStudent } from '@/lib/sheets';
import { initializeSheets } from '@/lib/sheets/base';
import { rejectWhenDifferentSchool, requireTeacherSession } from '@/lib/auth/guards';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';

/**
 * Retrieves student list.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - grade?: string (Optional filter by grade)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - students: Array of Student objects
 */
export async function GET(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const { searchParams } = new URL(request.url);
        const school = searchParams.get('school') || undefined;
        const grade = searchParams.get('grade');
        const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, school);
        if (schoolGuard) return schoolGuard;

        const students = await getStudents({
            school,
            grade: grade ? Number.parseInt(grade, 10) : undefined,
        });

        return NextResponse.json({ success: true, students, data: students });
    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json(
            { error: '학생 데이터를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * Adds a new student record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - classId: string
 *   - number: number
 *   - name: string
 *   - learningData?: object
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - id: string
 */
export async function POST(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json();
        await initializeSheets();

        if (body.mode === 'merge_school_roster') {
            const school = typeof body.school === 'string' ? body.school.trim() : '';
            const students = Array.isArray(body.students) ? body.students : [];
            const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, school);
            if (schoolGuard) return schoolGuard;

            if (!school || students.length === 0) {
                return NextResponse.json(
                    { error: '학교명과 학생 명부가 필요합니다.' },
                    { status: 400 }
                );
            }

            const result = await mergeStudentsForSchool(school, students);
            return NextResponse.json({ success: true, ...result });
        }

        const { classId, number, name, learningData, grade, school, classNumber, classLearningData } = body;
        const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, school);
        if (schoolGuard) return schoolGuard;

        if (!classId || !number || !name) {
            return NextResponse.json(
                { error: '반, 번호, 이름은 필수입니다.' },
                { status: 400 }
            );
        }

        const id = await addStudent({
            classId,
            number,
            name,
            grade,
            school,
            classNumber,
            learningData: learningData || {},
            classLearningData: classLearningData || {},
        });

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('Add student error:', error);
        return NextResponse.json(
            { error: '학생 추가 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

/**
 * Updates an existing student record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - id: string (Required)
 *   - ...fields to update (learningData, etc.)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 */
export async function PUT(request: NextRequest) {
    try {
        const session = await requireTeacherSession();
        if (!session.ok) return session.response;
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json();
        const { id, ...data } = body;
        const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, data.school);
        if (schoolGuard) return schoolGuard;
        await initializeSheets();

        if (!id) {
            return NextResponse.json(
                { error: '학생 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await updateStudent(id, data);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update student error:', error);
        return NextResponse.json(
            { error: '학생 정보 수정 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
