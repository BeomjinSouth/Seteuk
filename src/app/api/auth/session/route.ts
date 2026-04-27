import { NextResponse } from 'next/server';
import { getTeacherSession } from '@/lib/auth/session';

export async function GET() {
    const teacher = await getTeacherSession();
    return NextResponse.json({ success: true, teacher });
}
