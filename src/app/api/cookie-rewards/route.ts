import { NextResponse } from 'next/server';
import { getCookieRewards, saveCookieReward } from '@/lib/sheets';
import { initializeSheets } from '@/lib/sheets/base';
import { rejectWhenDifferentSchool, withTeacherAuth } from '@/lib/auth/guards';

export const GET = withTeacherAuth(async (request, { teacher }) => {
    try {
        const { searchParams } = new URL(request.url);
        const activeOnlyParam = searchParams.get('activeOnly');
        const school = searchParams.get('school') || undefined;
        const schoolGuard = rejectWhenDifferentSchool(teacher.school, school);
        if (schoolGuard) return schoolGuard;
        const rewards = await getCookieRewards({
            school,
            activeOnly: activeOnlyParam === 'true',
        });

        return NextResponse.json({ success: true, data: rewards, rewards });
    } catch (error) {
        console.error('Get cookie rewards error:', error);
        return NextResponse.json(
            { success: false, error: '쿠키 상품을 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
});

export const POST = withTeacherAuth(async (request, { teacher }) => {
    try {
        await initializeSheets();
        const body = await request.json();
        const cost = Number(body.cost);
        const schoolGuard = rejectWhenDifferentSchool(teacher.school, body.school ? String(body.school) : undefined);
        if (schoolGuard) return schoolGuard;

        if (!body.school || !body.name || !Number.isFinite(cost) || cost <= 0) {
            return NextResponse.json(
                { success: false, error: '상품명과 쿠키 가격이 필요합니다.' },
                { status: 400 }
            );
        }

        const reward = await saveCookieReward({
            id: body.id || undefined,
            school: String(body.school),
            name: String(body.name),
            cost,
            active: body.active !== false,
        });

        return NextResponse.json({ success: true, data: reward, reward });
    } catch (error) {
        console.error('Save cookie reward error:', error);
        return NextResponse.json(
            { success: false, error: '쿠키 상품을 저장하지 못했습니다.' },
            { status: 500 }
        );
    }
});

export const PUT = POST;
