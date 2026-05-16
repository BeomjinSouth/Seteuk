# Student Record Knowledge Implementation

## Data Sources

- `output/star-moe-knowledge-2026.json` bundled into the web app for deployed runtime reads
- `../student-record-knowledge/output/star-moe-knowledge-2026.json` used as the local fallback source during workspace development
- `../student-record-knowledge/output/star-moe-knowledge-units-2026.json` kept upstream as the detailed knowledge-unit artifact

## Current Implementation

### Loader

- `src/lib/knowledge-base.ts`
- prefers the bundled `web/output` snapshot, then falls back to the sibling knowledge repo or `KNOWLEDGE_JSON_PATH`
- loads knowledge JSON
- applies school-level, category, and year filters
- uses lexical retrieval, compact spacing-insensitive matching, synonym expansion, concept constraints, and scoring
- consumes canonical entries that already merge conservative similar-question groups from the crawler

### Reranking

- `src/lib/knowledge-rerank.ts`
- uses OpenAI Responses API when available
- reranks top lexical candidates before final answer or review generation

### Hosted Retrieval Preparation

- `src/lib/knowledge-hosted.ts`
- syncs canonical knowledge into an OpenAI vector store in batches
- searches the vector store and maps hosted hits back into app evidence objects

### APIs

- `src/app/api/knowledge/meta/route.ts`
- `src/app/api/knowledge/sync/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/search-eval/route.ts`
- `src/app/api/search-openai/route.ts`
- `src/app/api/counsel-chat/route.ts`
- `src/app/api/record-review/route.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/admin-users/route.ts`
- `src/app/api/admin-users/me/route.ts`
- `src/lib/prompts/seteuk.ts`
- `src/lib/admin-roles.ts`
- `src/lib/forbidden-words.ts`
- `src/app/api/admin/crawl/route.ts`
- `src/app/api/admin/reindex/route.ts`
- `src/app/api/admin/crawl-status/route.ts`
- `src/app/api/admin/quality-report/route.ts`
- `src/app/api/student-data/route.ts`
- `src/app/api/cookies/route.ts`
- `src/app/api/cookie-rewards/route.ts`
- `src/app/api/group-survey/identify/route.ts`
- `src/app/api/group-survey/submit/route.ts`
- `src/app/api/group-survey/teacher/route.ts`
- admin crawl copies the regenerated knowledge JSON into `web/output` and clears the in-process knowledge cache after success
- admin crawl uses `KNOWLEDGE_PACKAGE_DIR` when provided, otherwise `../student-record-knowledge`, and returns 503 if the package is unavailable
- admin routes use `ADMIN_API_TOKEN` in production and accept `Authorization: Bearer <token>` or `x-admin-token`

### UI

- `src/app/page.tsx`
- `src/app/counsel-chat/page.tsx`
- `src/app/record-review/page.tsx`
- `src/app/write/page.tsx`
- `src/app/search-inspector/page.tsx`
- `src/app/eval-check/page.tsx`
- `src/app/observation-board/page.tsx`
- `src/app/observation-board-2/page.tsx`
- `src/app/group-survey/[accessCode]/page.tsx`
- `src/app/group-survey/[accessCode]/GroupSurveyPageClient.tsx`
- `src/components/group-survey/GroupSurveyDashboard.tsx`
- `src/app/observations/page.tsx`
- `src/components/layout/AppShell.tsx`
- raw match list shown in the pages
- local vs hosted search comparison available
- query-string prefill supported
- the sidebar/workspace label is `생기부 상담 점검`
- counsel chat and record review now share one `/counsel-chat` workspace with a mode switch, and `/record-review` redirects into that workspace
- `search-inspector` remains available only as an internal diagnostics route and is no longer shown in the sidebar
- main navigation groups counsel/review tools under `AI 세특 생성`
- top navigation order is `학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검 (개발중)`
- `평가 점검 (개발중)` is rendered as a disabled nav item, and direct `/eval-check` access redirects to `/dashboard`
- `/ocr` stays available as a route, but `GlobalNav` currently filters the OCR tab out of the visible main navigation
- student management is limited to roster upload and teaching-class connection; the visible student observation tab now lives in `/observation-board-2`
- legacy `/observation-board` and `/observations` direct entry redirects to `/observation-board-2`
- `/observation-board-2` is the standalone visual `학생 관찰 기록` dashboard based on the provided classroom example; it uses an illustrated left rail, a simplified teacher chip, mentor/mentee group cards, a session table, and participation/strong-performance mark buttons while reusing teacher class/student data from the shared store
- `/observation-board-2` defaults to the PNG-like `학생 관찰 기록` screen and removes the earlier top eyebrow, class chips, and search bar from that first mentor/mentee view while preserving the PNG-style header buttons; the mentor view now uses two compact in-screen tabs, `멘토·멘티 구성` and `활동 기록`, so the group cards and wide activity table are not forced into a side-by-side split
- `/observation-board-2` manages internal board modes (`mentor`, `growth`, `stats`, `grouping`, `notice`, `settings`, `records`) without leaving the route; the visible sidebar exposes `학생 관찰 기록`, `성장 기록`, `통계 보기`, and `모둠 편성`, keeping the earlier `홈`, `알림장`, and `설정` entries hidden, and remains a left vertical rail instead of collapsing into a top strip at narrower desktop widths
- `/observation-board-2` uses an HTML/CSS left logo plus cropped raster assets for the lower sidebar illustration and activity-guide illustration while keeping text, cards, buttons, sidebar action icons, and tables as HTML/CSS
- `/observation-board-2` `growth` mode fetches `/api/observations` to build a student timeline from observation notes, then shows all selected class/search filtered student cards without a fixed eight-card cap, includes per-student record counts, current cookie count, △/○ activity reaction counts, and provides a selected-student `성장 기록 작성` modal
- the `성장 기록 작성` modal is styled to the provided reference image with a dimmed overlay, fixed desktop dialog sizing, title clipboard icon, 3-step progress row, selected-student animal chips, three neutral cookie option cards, activity-focused praise copy, optional memo field, and `이전`/`저장하기` footer actions
- `/observation-board-2` `stats` mode computes observation counts, student record counts, tag frequencies, latest record date, current △/○ marks, students needing records, and mentor-group activity balance from the loaded observations and local mark state
- `/observation-board-2` `grouping` mode renders a simplified Skill-Will class dashboard, including a shared survey link/code, session status, 제출률, 미응답 수, 좌표평면, and compact 학생별 Skill 입력
- `/observation-board-2` `stats` mode includes the same compact single-class selector pattern as the mentor board and defaults to one assigned class, so group-balance rows stay scoped by class instead of aggregating every assigned class
- `/observation-board-2` `notice` mode stores announcements in `localStorage` with the key `observation-board-2-notices:${teacherKey}` and supports create, complete, and delete internally, but is not exposed in the current sidebar
- `/observation-board-2` `records` mode ports the previous observation-record workflow into the same visual system, but the visible stats `최근 기록` CTA now switches to `growth` so it does not send teachers into the old compose screen
- `/observation-board-2` uses local font variables from `globals.css`: Noto Sans KR for body/table/form text, Gmarket Sans for headers and primary controls, PureunJeonnam for guidance/notice copy, and MapleStory only for playful classroom-board accents such as student tokens, sidebar menu text, numbered badges, and activity mark buttons
- `/observation-board-2` renders roster numbers, not name initials, inside the yellow circular student badges used by mentor cards, the roster tray, activity rows, growth timeline avatars, and observation draft rows; numeric badge text is centered with fixed circular dimensions
- `/observation-board-2` stores mentor/mentee group assignments in local React state, supports adding an empty group, deleting an existing group, editing only a selected group, and uses HTML5 drag/drop so student tokens can be placed into 2-4 member groups while preserving previous 2-slot saved data through normalization
- `/observation-board-2` mentor cards keep a visible `학생 추가` drop target while the group has fewer than four members; dropping a roster token there immediately moves/adds that student into the group, and each member token exposes a role selector for `멘토`, `멘티`, or `모둠원`. New additions default to first member as mentor and later members as mentees, but saved custom roles are preserved by normalization and AI context.
- `/observation-board-2` persists mentor/mentee edits explicitly per selected class when a teacher drops a student or adds a group, avoiding effect-driven overwrites of saved assignments
- `/observation-board-2` exposes a selected-class `모둠 비우기` action that saves an explicit empty assignment array for that teacher/class while preserving existing △/○ marks and historical session snapshots
- `/observation-board-2` stores marked-session pairing snapshots in `observation-board-2-mentor-assignment-snapshots:${teacherKey}` so mid-year pairing changes do not rewrite the role/group context of previously recorded sessions
- `/observation-board-2` shows a compact single-class selector inside the default mentor configuration tab instead of a long horizontal class-chip rail; changing the selected class filters the mentor pairs, activity table tab, and roster tray to that class only
- `/observation-board-2` defaults the mentor screen to one selected 담당 학급 rather than an all-assigned-classes aggregate; the visible-student count setting remains available as an optional cap for default mentor pair generation and the roster tray
- `/observation-board-2` filters mentor matching, observation compose, growth, and stats to the current teacher's assigned class students only; it does not display sample students when no assigned class roster exists
- `/observation-board-2` stores editable session headers in local React state and persists them to `observation-board-2-sessions:${teacherKey}`; teachers edit session date/content inline and add columns with the `+` button
- `/observation-board-2` persists teacher-clicked student △/○ activity marks to `observation-board-2-marks:${teacherKey}` and class-scoped mentor/mentee assignments to `observation-board-2-mentor-assignments:${teacherKey}` so `/write` can derive the selected student's mentor/mentee activity summary for `/api/generate`; mentor assignments and snapshots are read only from the logged-in teacher's key, so the same class can be configured differently by teacher
- `/group-survey/[accessCode]` is a public student-only page; one shared link can serve multiple classes, and it asks for grade/class/number, confirms the matched roster name, stores the response with the actual matched class, and submits the 12 Skill-Will package questions without exposing Skill, evaluation, ability, grade, or coordinate language
- `src/lib/group-survey.ts` centralizes the 12 questions, scoring, coordinate labels, and grouping helper functions; the current dashboard uses it only for scoring/profile construction and the Skill-Will coordinate view
- `src/lib/group-survey-token.ts` issues short-lived HMAC submit tokens after successful roster identification
- `src/lib/supabase/group-survey-store.ts` stores survey sessions, responses, Skill scores, and recommendation runs in Supabase; local development without Supabase uses an in-memory store for smoke tests, while production still requires Supabase
- `supabase/migrations/202605160001_group_survey.sql` creates `group_survey_sessions`, `group_survey_responses`, `group_student_skill_scores`, and `grouping_recommendation_runs`
- `/observation-board-2` treats blank activity cells as 0 cookies, △ 참여함 as 1 cookie, and ○ 매우 잘함 as 2 cookies; when a teacher changes a cell, the UI posts only the delta to `/api/cookies`, using `award` for increases and negative `adjust` for corrections
- manual observation entry remains in `/observation-board-2` internal `records` mode and uses common date/topic/tags at the top with per-student rows focused on individual tags plus observation memo
- the top-level `학생 데이터` tab and `/student-data` page are removed
- student data/cookie APIs remain as legacy storage compatibility endpoints, but current user navigation and write generation do not use them
- Google Sheets runtime credentials are normalized before client creation so Vercel values pasted with wrapping quotes or escaped newlines still produce a valid private key.
- read-only roster/student-data/cookie APIs skip sheet-creation initialization and read existing sheets directly; mutations still initialize missing sheets before writing.
- Supabase runtime storage is supported through `src/lib/supabase/*`; production requires `SUPABASE_URL`/`SUPABASE_PROJECT_ID` plus `SUPABASE_SECRET_KEY`, and `src/lib/sheets/base.ts` blocks Google Sheets runtime fallback in production.
- `/api/workspace-state` and `/api/observation-board-state` persist Zustand workspace state plus observation-board local state into `app_state_documents`, returning `503` when production Supabase storage is missing.
- Login now also creates a signed HTTP-only `seteuk-session` cookie, and storage APIs check the server session's school or teacher key before accepting data.
- Existing Google Sheets data can be migrated with `scripts/migrate-google-sheets-to-supabase.mjs` after applying `supabase/migrations/202604270001_initial_seteuk_storage.sql`; Google Sheets is otherwise retained for local dev/import/migration only.
- Admin grants are stored in `admin_role_grants` from `supabase/migrations/202605060001_admin_role_grants.sql`; server APIs verify the signed session with `isAdminTeacher` before listing, granting, or revoking admins, and the bootstrap `박범진` role cannot be revoked.
- `/write` does not fetch student-data tab entries before calling `/api/generate`
- `/write` reads the teacher-scoped observation-board session headers, student △/○ marks, current mentor/mentee assignments, and per-session assignment snapshots from localStorage, sends a derived `observationBoardContext`, and `/api/generate` adds it to the 세특 prompt as `멘토·멘티 활동 해석`
- `/api/generate`, `/settings/ai`, and `src/lib/write-logic.ts` share `SETEUK_DEFAULT_SYSTEM_PROMPT` from `src/lib/prompts/seteuk.ts`; the current prompt version is `cross-curricular-seteuk-v1`
- `/settings/ai` exposes two prompt choices: `기본 설정` uses read-only `cross-curricular-seteuk-v1`, while `내 프롬프트` stores `seteukPromptMode` and `personalSeteukPrompt` in teacher workspace state and Supabase sync payloads.
- Model, max output tokens, and reasoning effort remain admin-only settings stored in browser runtime settings.
- Default forbidden words are centralized in `src/lib/forbidden-words.ts` and used by both Zustand store defaults and `/api/forbidden`.
- `/api/generate` treats curriculum content as context only when tied to observed data and passes OCR context without raw score/grade totals, keeping score/rank/award/test-item wording out of generated drafts
- competency highlighting renders against the source text so invalid AI segment indexes cannot drop text from the display
- school roster data syncs through `/api/students` into shared sheet-backed storage, while teaching-class connections remain teacher-specific in local app state
- repeated uploads for the same school are merged server-side by roster key and return add/update/skip counts so overlapping students do not duplicate
- old `/observation-board` card-board and `/observations` compose routes are no longer user-facing and redirect to `/observation-board-2`
- `/api/record-review` can optionally return `improvedDraft` for the write-tab review-improve action
- `/write` renders the AI 세특 작성 tab as a screenshot-matched workspace: wider app sidebar, teacher/notification top chrome, class chip toolbar, AI/RAG/spell/forbidden/competency/delete actions, rounded table rows, editable AI input/content cells, and 10명씩 보기 pagination

### Login And Roster Onboarding

- `src/lib/seongho-auth.ts` centralizes the 성호중학교 login contract: `학교=성호중학교`, `아이디=한글 이름`, `비밀번호=123123`.
- `src/app/page.tsx` no longer accepts arbitrary school/subject logins or demo bypass from the login screen; successful login stores a `seongho-school` session and routes to `/students`.
- `src/components/layout/GlobalNav.tsx` waits for persisted auth hydration before checking authenticated pages, then redirects stale/invalid local sessions back to login.
- `src/app/students/page.tsx` detects 성호중학교 mode, hides the upload dropzone, loads `/api/students?school=성호중학교`, shows explicit loading/empty/error roster states, and lets the teacher register selected classes immediately.
- `scripts/import-seongho-roster.mjs` imports the local 2026 1/2/3학년 명렬표 workbooks into the shared sheet-backed `학생` roster without committing student names into the repo.

## Response Policy

- If there is no public evidence, do not fabricate an answer
- counsel responses must include citations
- review responses must include issues, risk level, and rewrite guidance
- improved drafts must stay inside the original facts plus public evidence
- record review first tries category-filtered matches and falls back to school-level public evidence when the category slice is empty
- similar Q&A grouping is conservative: spacing, `(재상담)`, and generic inquiry suffixes can merge; unrelated school levels or categories stay separate

## Quality Loop

- retrieval test set in `src/data/knowledge-eval-cases.ts`
- evaluation runner in `src/lib/knowledge-eval.ts`
- evaluation API in `/api/search-eval`
- operational quality summary in `/api/admin/quality-report`
- current crawl snapshot in `/api/admin/crawl-status`

## Next Steps

1. improve difficult query ranking classes
2. decide when hosted retrieval is good enough to become the default provider
3. automate doc mirroring further if the workflow expands
