import { NextRequest, NextResponse } from 'next/server';
import { getRecords, saveRecord } from '@/lib/sheets';

export async function GET() {
    try {
        const records = await getRecords();
        return NextResponse.json({ success: true, records });
    } catch (error) {
        console.error('Get records error:', error);
        return NextResponse.json(
            { error: '세특 데이터를 불러오는 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, studentId, classId, content, status } = body;

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
}
