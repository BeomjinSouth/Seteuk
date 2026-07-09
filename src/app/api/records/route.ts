import { NextResponse } from 'next/server';
import { getRecords, saveRecord } from '@/lib/sheets';
import { rejectWhenDifferentTeacher, withTeacherAuth } from '@/lib/auth/guards';
import { isSupabaseRequiredButMissing } from '@/lib/supabase/config';
import { supabaseRequiredResponse } from '@/lib/supabase/required-response';

/**
 * Retrieves all student records (drafts/completed).
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - records: Array of Record objects
 */
export const GET = withTeacherAuth(async (_request, { teacher }) => {
    try {
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const records = (await getRecords()).filter((record) =>
            !record.teacherKey || record.teacherKey === teacher.teacherKey
        );
        return NextResponse.json({ success: true, records });
    } catch (error) {
        console.error('Get records error:', error);
        return NextResponse.json(
            { error: '세특 데이터를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
});

/**
 * Saves or updates a student record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - studentId: string
 *   - classId: string
 *   - content: string
 *   - status: 'draft' | 'completed'
 *   - id?: string
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 */
export const POST = withTeacherAuth(async (request, { teacher }) => {
    try {
        if (isSupabaseRequiredButMissing()) return supabaseRequiredResponse();

        const body = await request.json();
        const { id, studentId, classId, teacherKey, content, status } = body;
        const teacherGuard = rejectWhenDifferentTeacher(teacher.teacherKey, teacherKey);
        if (teacherGuard) return teacherGuard;

        if (!studentId || !classId) {
            return NextResponse.json(
                { error: '학생 ID와 반 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await saveRecord({
            id: id || `r-${Date.now()}`,
            studentId,
            classId,
            teacherKey: teacherKey || teacher.teacherKey,
            content: content || '',
            status: status || 'draft',
            lastUpdated: new Date().toISOString(),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Save record error:', error);
        return NextResponse.json(
            { error: '세특 저장 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
});
