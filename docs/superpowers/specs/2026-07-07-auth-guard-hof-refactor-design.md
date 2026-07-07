# 인증 가드 HOF 래퍼 통합 리팩토링

- **날짜:** 2026-07-07
- **브랜치:** codex/math-concept-hierarchy
- **상태:** 설계 승인 대기

## 배경 / 문제

API 라우트 35개 파일에 인증 보일러플레이트가 반복된다. 이번 워킹 트리 변경분(23개
라우트)만 봐도 아래 3줄이 그대로 복붙돼 있다.

```ts
const auth = await requireTeacherSession();
if (!auth.ok) return auth.response;
```

여기에 더해 기존 라우트는 가드 호출 위치(try 안/밖)와 teacher 객체 사용 여부가
제각각이라 실질적으로 4가지 변형이 존재한다. 결과적으로:

- 새 라우트를 추가할 때마다 가드를 잊거나 위치를 틀릴 여지가 있다.
- 인증 실패 응답 형식이 파일마다 미세하게 달라질 수 있다.
- 가드가 try 안에 있는 라우트는 인증 인프라 오류가 도메인 500 메시지로 뭉개진다.

## 목표

- 인증 가드 보일러플레이트를 고차 함수(HOF) 래퍼 2개로 통합한다.
- 교사 세션 가드를 쓰는 라우트를 단일 패턴으로 통일한다.
- 관리자 토큰 가드를 쓰는 라우트를 단일 패턴으로 통일한다.
- 기존 동작(상태 코드, 응답 본문, 권한 판정)을 바꾸지 않는다. 순수 구조 리팩토링.

## 비목표 (YAGNI)

- 미들웨어 기반 중앙 게이트로의 전환 (HMAC 세션 검증을 edge 런타임용으로 재작성해야
  하는 부담).
- `requireTeacherSession` / `requireAdminRequest`의 내부 로직 변경.
- 에러 핸들링·응답 형식(success/error 셰이프) 통일 같은 별도 리팩토링.
- `admin-users`의 역할 기반 `requireAdmin()` 정리 (아래 "제외 대상" 참고).

## 아키텍처

`src/lib/auth/guards.ts`에 HOF 2개를 추가한다. 기존 export는 그대로 둔다.

```ts
import type { NextRequest } from 'next/server';
import type { TeacherProfile } from '@/types';

type RouteHandler = (request: NextRequest) => Promise<Response> | Response;
type TeacherRouteHandler = (
  request: NextRequest,
  ctx: { teacher: TeacherProfile },
) => Promise<Response> | Response;

// 교사 세션 가드
export function withTeacherAuth(handler: TeacherRouteHandler): RouteHandler {
  return async (request) => {
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    return handler(request, { teacher: auth.teacher });
  };
}

// 관리자 토큰 가드
export function withAdminAuth(handler: RouteHandler): RouteHandler {
  return async (request) => {
    const unauthorized = requireAdminRequest(request);
    if (unauthorized) return unauthorized;
    return handler(request);
  };
}
```

`requireAdminRequest`는 현재 `@/lib/admin-auth`에 있다. `withAdminAuth`는 거기서
import하거나, guards.ts에서 re-export 없이 admin-auth를 직접 참조한다. (구현 시
import 사이클이 없는 방향으로 결정.)

### 근거

- **동적 라우트 세그먼트(`[id]`)가 없고**, 2번째 context 파라미터를 쓰는 핸들러도
  없다(코드베이스 확인 완료). 따라서 래퍼 시그니처는 `request` 하나만 받으면
  충분하며, params 전달 복잡도를 감수할 필요가 없다.
- Next.js 16은 `export const POST = withTeacherAuth(...)` 형태의 화살표 함수
  라우트 핸들러를 정상 인식한다.

## 라우트 변환 패턴

### 패턴 A — teacher 객체 불필요 (신규 23개 다수)

```ts
// before
export async function POST(request: NextRequest) {
  const auth = await requireTeacherSession();
  if (!auth.ok) return auth.response;
  let body = ...
}

// after
export const POST = withTeacherAuth(async (request) => {
  let body = ...
});
```

### 패턴 B — teacher 객체 사용 (students, student-data, cookie-rewards 등)

```ts
// before
export async function GET(request: NextRequest) {
  try {
    const session = await requireTeacherSession();
    if (!session.ok) return session.response;
    const schoolGuard = rejectWhenDifferentSchool(session.teacher.school, school);
    ...
  } catch (error) { ... }
}

// after
export const GET = withTeacherAuth(async (request, { teacher }) => {
  try {
    const schoolGuard = rejectWhenDifferentSchool(teacher.school, school);
    ...
  } catch (error) { ... }
});
```

- `session.teacher.school` → `teacher.school`, `session.teacher.teacherKey` →
  `teacher.teacherKey` 로 기계적 치환.
- 가드가 try 밖으로 이동하면서 인증 인프라 실패가 도메인 500 메시지로 뭉개지지
  않는다(동작 개선, 회귀 아님).

### 위임 핸들러는 건드리지 않음

`cookie-rewards`의 `export async function PUT(request) { return POST(request); }`
처럼 이미 가드된 핸들러에 위임하는 경우는 그대로 둔다. 이런 핸들러가 가드를 "빠뜨린"
것이 아니라 위임을 통해 이미 커버되고 있다.

### 관리자 라우트

```ts
// before
export async function POST(request: NextRequest) {
  const unauthorized = requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  ...
}

// after
export const POST = withAdminAuth(async (request) => {
  ...
});
```

## 범위

### withTeacherAuth 적용 (30개 파일)

기존 8개 (가드 이미 존재, 이번 변경분 아님):
`records`, `students`, `observations`, `student-data`, `group-survey/teacher`,
`cookies`, `cookie-rewards`, `assessments`

신규 22개 (이번 워킹 트리 변경분 중 교사 가드):
`adjust`, `batch-grading`, `competency`, `counsel-chat`, `counsel-chat/graph`,
`forbidden`, `generate`, `generate-batch`, `generate-grading-prompt`,
`model-answer`, `ocr`, `ocr-evaluations`, `pdf-split`, `preliminary-grading`,
`record-review`, `rubric-extract`, `search`, `search-eval`, `search-openai`,
`similarity`, `similarity-suggest`, `speller`

(이번 워킹 트리 변경분 23개 = 위 교사 가드 22개 + 관리자 가드 `knowledge/sync` 1개.)

### withAdminAuth 적용 (5개 파일)

`admin/reindex`, `admin/crawl`, `admin/quality-report`, `admin/crawl-status`,
`knowledge/sync`

### 제외 대상

- `admin-users`: 역할 기반 `requireAdmin()`이 이미 파일 내부 로컬 헬퍼로 DRY하고,
  Supabase 역할 조회 기반이라 teacher/admin 토큰 가드와 인증 모델이 다르다. 단일
  파일이라 파일 간 중복도 없다. (사용자 확정 2026-07-07)
- `group-survey/submit`, `group-survey/identify`: 학생 공개 엔드포인트로 가드 없음.
- 위 목록의 각 파일별 정확한 대상 핸들러는 구현 계획에서 확정한다.

## 검증

프로젝트에 테스트 스크립트가 없으므로:

1. `npx tsc --noEmit` — 타입 무결성 (래퍼 시그니처, 화살표 핸들러 반환 타입).
2. `npm run lint` — ESLint 통과.
3. `npm run build` — Next.js 라우트 핸들러 export 인식 및 프로덕션 빌드 성공.

각 단계는 리팩토링 전/후 동일 결과여야 한다(회귀 없음).

## 리스크

- **낮음.** 순수 기계적 변환이며 로직·응답 형식을 바꾸지 않는다.
- 유일한 동작 변화는 패턴 B에서 가드가 try 밖으로 이동하는 것인데, 이는 회귀가 아닌
  개선이다(인증 인프라 예외가 도메인 500으로 오분류되지 않음).
- Next.js가 화살표 함수 export를 인식하지 못할 위험은 `npm run build`로 조기 검출된다.
