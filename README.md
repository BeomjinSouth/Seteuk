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
- 비밀번호: `123123`
- 로그인 성공 시 `/students`에서 2026 성호중학교 명렬표 기반 학급을 선택 등록한다.

## App Navigation

- top navigation order: `학교 정보` -> `학생 관찰 기록` -> `학생 기록 관찰 2` -> `학생 데이터` -> `AI 세특 생성` -> `평가 점검 (개발중)`
- `학생 관리` now handles roster upload and teaching-class connection only
- 성호중학교 교사는 업로드 없이 공용 2026 명렬표에서 학급만 선택한다
- the student card board moved to `/observation-board`, and observation notes stay in `/observations`
- in `/observation-board`, single click selects a student and double click opens observation writing; if multiple same-class students are selected, double click opens batch observation entry
- in `/observation-board-2`, the mentor/mentee activity screen can be scoped to all assigned classes or one selected class, shows all scoped students by default, and lets teachers optionally cap how many students are auto-paired/listed
- `/observations` manual entry uses per-student rows with roster/date fields plus `수업 주제`, selected `태그`, and `기타 메모`
- `/write` uses the screenshot-style AI 세특 작성 workspace with class chips, AI/RAG/check action buttons, prompt-style editable AI input/content cells, and 10명씩 보기 pagination

## Environment Variables

Set these in local `.env.local` and in the Vercel project settings.

- `OPENAI_API_KEY`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SPREADSHEET_ID`
- `NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL`

Google Sheets keys may be pasted with `.env`-style wrapping quotes or escaped `\n` line breaks; the server normalizes those values at runtime before creating the Sheets client.

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

## Verification

```bash
npx tsc --noEmit
npm run build
```

## Deploy on Vercel

Create the Vercel project from the `web` directory and add the runtime environment variables before testing AI features.
