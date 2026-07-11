/**
 * 고정 윈도(fixed-window) 인메모리 레이트 리미터.
 *
 * 한계: 프로세스 메모리에만 기록되므로 Vercel 서버리스에서는 람다 인스턴스별로
 * 따로 계수된다. 즉 완전한 방어가 아니라 단일 인스턴스 안의 버스트를 막는
 * 임시 방어선이다. 인스턴스 간 공유가 필요해지면
 * docs/superpowers/plans/2026-07-10-project-health-stabilization.md Task 6의
 * Supabase 원자 RPC 방식으로 교체한다.
 */

type Bucket = {
    resetAt: number;
    count: number;
};

const buckets = new Map<string, Bucket>();
const MAX_BUCKETS = 10_000;

export interface RateLimitResult {
    allowed: boolean;
    /** 차단된 경우 재시도까지 남은 초. 허용이면 0. */
    retryAfterSeconds: number;
}

export function checkRateLimit(input: {
    scope: string;
    identity: string;
    limit: number;
    windowSeconds: number;
    now?: number;
}): RateLimitResult {
    const now = input.now ?? Date.now();
    const key = `${input.scope}:${input.identity}`;
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        if (buckets.size >= MAX_BUCKETS) {
            for (const [staleKey, staleBucket] of buckets) {
                if (staleBucket.resetAt <= now) buckets.delete(staleKey);
            }
            if (buckets.size >= MAX_BUCKETS) buckets.clear();
        }
        buckets.set(key, { resetAt: now + input.windowSeconds * 1000, count: 1 });
        return { allowed: true, retryAfterSeconds: 0 };
    }

    if (bucket.count < input.limit) {
        bucket.count += 1;
        return { allowed: true, retryAfterSeconds: 0 };
    }

    return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
}

/** 테스트에서 윈도 상태를 초기화할 때만 사용한다. */
export function resetRateLimits(): void {
    buckets.clear();
}

/**
 * 프록시 헤더에서 클라이언트 주소를 읽는다. Vercel이 채우는
 * x-vercel-forwarded-for를 우선하고, 없으면 x-forwarded-for의 첫 항목을 쓴다.
 * 신뢰할 수 없는 환경에서는 'unknown'으로 묶여 전체 버킷 하나를 공유한다.
 */
export function getClientAddress(request: { headers: { get(name: string): string | null } }): string {
    const forwarded = request.headers.get('x-vercel-forwarded-for')
        || request.headers.get('x-forwarded-for')
        || '';
    const first = forwarded.split(',')[0]?.trim();
    return first || 'unknown';
}
