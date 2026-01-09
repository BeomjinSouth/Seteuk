import { NextRequest, NextResponse } from 'next/server';
import { checkForbiddenExpressions } from '@/lib/openai';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text } = body;

        if (!text) {
            return NextResponse.json(
                { error: '검사할 텍스트가 필요합니다.' },
                { status: 400 }
            );
        }

        const result = await checkForbiddenExpressions(text);

        return NextResponse.json({
            success: true,
            issues: result.issues,
        });
    } catch (error) {
        console.error('Forbidden check error:', error);
        return NextResponse.json(
            { error: '금지어 검사 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
