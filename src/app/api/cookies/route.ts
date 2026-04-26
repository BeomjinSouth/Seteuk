import { NextRequest, NextResponse } from 'next/server';
import {
    addCookieTransaction,
    calculateCookieBalances,
    getCookieRewards,
    getCookieTransactions,
} from '@/lib/sheets';
import { initializeSheets } from '@/lib/sheets/base';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const school = searchParams.get('school') || undefined;
        const studentId = searchParams.get('studentId') || undefined;
        const transactions = await getCookieTransactions({ school, studentId });
        const balances = calculateCookieBalances(transactions);

        return NextResponse.json({ success: true, data: transactions, transactions, balances });
    } catch (error) {
        console.error('Get cookies error:', error);
        return NextResponse.json(
            { success: false, error: '쿠키 내역을 불러오지 못했습니다.' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await initializeSheets();
        const body = await request.json();
        const type = body.type;

        if (!body.school || !body.studentId || !body.teacherKey || (type !== 'award' && type !== 'redeem' && type !== 'adjust')) {
            return NextResponse.json(
                { success: false, error: '필수 항목이 누락되었습니다.' },
                { status: 400 }
            );
        }

        let amount = Number(body.amount);
        if (!Number.isFinite(amount) || amount === 0) {
            return NextResponse.json(
                { success: false, error: '쿠키 수량이 올바르지 않습니다.' },
                { status: 400 }
            );
        }

        let rewardName = '';
        if (type === 'redeem') {
            const rewardId = String(body.rewardId || '');
            const rewards = await getCookieRewards({ school: String(body.school) });
            const reward = rewards.find((item) => item.id === rewardId && item.active);
            if (!reward) {
                return NextResponse.json(
                    { success: false, error: '사용 가능한 상품을 찾지 못했습니다.' },
                    { status: 400 }
                );
            }

            const transactions = await getCookieTransactions({ school: String(body.school), studentId: String(body.studentId) });
            const balance = calculateCookieBalances(transactions)[0]?.balance || 0;
            if (balance < reward.cost) {
                return NextResponse.json(
                    { success: false, error: '쿠키 잔액이 부족합니다.' },
                    { status: 400 }
                );
            }

            amount = reward.cost;
            rewardName = reward.name;
        }

        const transaction = await addCookieTransaction({
            school: String(body.school),
            studentId: String(body.studentId),
            amount: Math.abs(amount),
            type,
            reason: String(body.reason || rewardName || '쿠키 처리'),
            rewardId: body.rewardId ? String(body.rewardId) : undefined,
            teacherKey: String(body.teacherKey),
        });

        const transactions = await getCookieTransactions({ school: String(body.school) });
        const balances = calculateCookieBalances(transactions);
        return NextResponse.json({ success: true, data: transaction, transaction, balances });
    } catch (error) {
        console.error('Save cookie transaction error:', error);
        return NextResponse.json(
            { success: false, error: '쿠키 내역을 저장하지 못했습니다.' },
            { status: 500 }
        );
    }
}
