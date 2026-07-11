## Overview

`web` is the Next.js application for the Seteuk service.

## Local Development

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Login

- 학교: `성호중학교`
- 아이디: 교사 본인 한글 이름
- 비밀번호: `SETEUK_LOGIN_PASSWORD` 환경변수 값 (프로덕션 필수. 이 저장소는 공개되어 있으므로 실제 비밀번호를 문서·코드에 적지 않는다. 로컬 개발은 미설정 시 기존 개발용 폴백을 사용)
- 로그인 성공 시 `/students`에서 2026 성호중학교 명렬표 기반 학급을 선택 등록한다.

## App Navigation

- top navigation order: `학교 정보` -> `학생 관찰 기록` -> `AI 세특 생성` -> `평가 점검 (개발중)`
- `/student-data` and the top-level `학생 데이터` tab are removed; write generation no longer loads student-data tab entries.
- `학생 관리` now handles roster upload and teaching-class connection only
- 성호중학교 교사는 업로드 없이 공용 2026 명렬표에서 학급만 선택한다
- `학생 관찰 기록` opens `/observation-board-2`; legacy `/observation-board` and `/observations` direct entries redirect there
- in `/observation-board-2`, the sidebar shows only `학생 관찰 기록`, `성장 기록`, and `통계 보기`; `홈`, `알림장`, and `설정` are hidden, and `성장 기록` shows all selected class/search filtered student cards with current cookie counts before opening a selected-student `성장 기록 작성` modal matching the provided reference UI with animal chips, cookie cards, optional memo, and bottom actions
- in `/observation-board-2`, the mentor/mentee activity screen uses a compact single-class selector instead of a long class-chip rail, shows one selected class at a time, and lets teachers optionally cap how many students are auto-paired/listed
- mentor/mentee drag changes are saved per teacher/class, group cards can be deleted, and `모둠 비우기` keeps the selected class explicitly empty without deleting △/○ activity marks
- when mentor/mentee pairing changes midway, marked sessions keep a pairing snapshot so `/write` interprets past sessions by the role/group that existed when they were recorded
- mentor/mentee activity marks automatically update the cookie ledger by delta: blank=0, △ 참여함=1, ○ 매우 잘함=2
- observation memo entry uses the internal `records` mode with per-student rows plus `수업 주제`, selected `태그`, and `기타 메모`
- `/write` uses the screenshot-style AI 세특 작성 workspace with class chips, AI/RAG/check action buttons, prompt-style editable AI input/content cells, and 10명씩 보기 pagination

## Environment Variables

Set these in local `.env.local` and in the Vercel project settings.

- `OPENAI_API_KEY`
- `ADMIN_API_TOKEN`
- `AUTH_SESSION_SECRET`
- `SETEUK_LOGIN_PASSWORD` (교사 로그인 비밀번호 — 프로덕션에서 미설정 시 로그인이 거부된다)
- `NEIS_API_KEY` (나이스 오픈API 키 — 소스에 있던 구 키는 공개 이력에 노출되어 재발급 후 이 변수로만 주입할 것)
- `SUPABASE_URL` or `SUPABASE_PROJECT_ID`
- `SUPABASE_SECRET_KEY`
- `EVAL_CHECK_ENABLED` (선택 — `true`일 때만 평가 점검 API가 열린다. 교사별 소유자 격리가 없어 기본은 404 차단)

Security defaults: teacher sessions expire after 12 hours (signed cookies cannot be revoked server-side), and login/survey endpoints are rate limited per instance (login 10/15min, survey identify 20/10min, survey submit 10/10min → HTTP 429 with `Retry-After`).

Production runtime is Supabase-primary. If Supabase is not configured in production, workspace/student/record storage APIs return a clear `503`. If Supabase is configured but a sheet read fails with a network/DNS error and Google Sheets credentials are present, read-only sheet APIs can fall back to Google Sheets; writes stay Supabase-only.

Google Sheets variables are optional and kept for roster import, Google-to-Supabase migration helpers, and read-only fallback during Supabase network/DNS incidents:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL`

Google Sheets keys may be pasted with `.env`-style wrapping quotes or escaped `\n` line breaks; migration/import helpers normalize those values before creating the Sheets client.

## Roster Import

To refresh the shared 성호중학교 roster from local workbook files placed one directory above `web`, run:

```bash
node scripts/import-seongho-roster.mjs
```

Expected source files:

- `2026 1학년 명렬표(Ver.2).xlsx`
- `2026 2학년 명렬표.xlsx`
- `2026 3학년 명렬표(수정).xlsx`

Notes:

- The app now avoids instantiating the OpenAI client during build, so Vercel builds do not fail just because the key is missing at build time.
- AI-powered routes still need `OPENAI_API_KEY` at runtime.
- Some routes fall back to demo/default responses without the key, while others return `503`.

## Supabase Migration

Apply the Supabase migrations to the project:

- `supabase/migrations/202604270001_initial_seteuk_storage.sql`
- `supabase/migrations/202605060001_admin_role_grants.sql`

Then migrate existing Google Sheets rows if needed:

```bash
node scripts/migrate-google-sheets-to-supabase.mjs
```

The shared project ref is `qobfezoqxgsedkpddhzs`. Do not commit Supabase secret keys or personal access tokens.

## Operations

- Bootstrap admin: `성호중학교 / 박범진`
- Admins manage additional admins in `/settings`; the bootstrap admin cannot be revoked.
- `/settings/ai` uses two prompt choices: `기본 설정` reads `cross-curricular-seteuk-v1`, and `내 프롬프트` stores a teacher-private prompt in workspace state.
- Model, max output tokens, and reasoning effort remain admin-only generation settings.
- Default forbidden words are shared from `src/lib/forbidden-words.ts` by the store and `/api/forbidden`.

See `docs/TEACHER_GUIDE.md` for teacher-facing operating steps.

## Verification

```bash
npx tsc --noEmit
npm run build
```

## Deploy on Vercel

Create the Vercel project from the `web` directory and add the runtime environment variables before testing AI features.
