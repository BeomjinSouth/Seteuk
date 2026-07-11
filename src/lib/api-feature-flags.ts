import { NextResponse } from 'next/server';

/**
 * 평가 점검(eval-check) API 기능 플래그.
 *
 * 평가 점검 UI는 `평가 점검 (개발중)`으로 내비게이션이 막혀 있지만
 * 서버 라우트는 배포에 포함된다. 교사별 소유자 격리가 완성되기 전까지는
 * 환경변수 `EVAL_CHECK_ENABLED=true`를 명시한 환경에서만 라우트를 연다.
 * 비활성 상태에서는 존재 여부를 드러내지 않도록 404를 반환한다.
 */
export function isEvalCheckEnabled(): boolean {
    return process.env.EVAL_CHECK_ENABLED === 'true';
}

export function evalCheckDisabledResponse(): NextResponse {
    return NextResponse.json(
        { success: false, error: '요청한 리소스를 찾을 수 없습니다.' },
        { status: 404 },
    );
}
