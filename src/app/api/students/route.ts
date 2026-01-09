import { NextRequest, NextResponse } from 'next/server';
import { getStudents, addStudent, updateStudent } from '@/lib/sheets';

export async function GET() {
    try {
        const students = await getStudents();
        return NextResponse.json({ success: true, students });
    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json(
            { error: '학생 데이터를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { classId, number, name, learningData } = body;

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
            learningData: learningData || {},
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

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

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
