import { NextRequest, NextResponse } from 'next/server';

export function requireAdminRequest(request: NextRequest) {
    const expectedToken = process.env.ADMIN_API_TOKEN;
    const allowLocalWithoutToken =
        process.env.NODE_ENV !== 'production' ||
        process.env.ALLOW_UNAUTHENTICATED_ADMIN === 'true';

    if (!expectedToken) {
        if (allowLocalWithoutToken) return null;

        return NextResponse.json(
            {
                success: false,
                error: 'ADMIN_API_TOKEN is required for admin API access.',
            },
            { status: 503 },
        );
    }

    const authHeader = request.headers.get('authorization') ?? '';
    const bearerToken = authHeader.replace(/^Bearer\s+/i, '').trim();
    const headerToken = request.headers.get('x-admin-token')?.trim() ?? '';

    if (bearerToken === expectedToken || headerToken === expectedToken) {
        return null;
    }

    return NextResponse.json(
        {
            success: false,
            error: 'Unauthorized admin API request.',
        },
        { status: 401 },
    );
}
