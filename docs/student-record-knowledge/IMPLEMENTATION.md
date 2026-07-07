# Student Record Knowledge Implementation

## Data Sources

- `output/star-moe-knowledge-2026.json` bundled into the web app for deployed runtime reads
- `output/graph-rag-labels/graph-rag-labels-2026.json` generated offline from the bundled public knowledge snapshot for Graph RAG node/edge labels
- `output/graph-rag-labels/obsidian-vault/` generated as a compact Obsidian-style review seed
- `../student-record-knowledge/output/star-moe-knowledge-2026.json` used as the local fallback source during workspace development
- `../student-record-knowledge/output/star-moe-knowledge-units-2026.json` kept upstream as the detailed knowledge-unit artifact

## Current Implementation

### Curriculum Unit Context

- `src/data/curriculum-context/default-middle-school-units.json` bundles the developer-provided unit catalog with `version` and `units`.
- `src/lib/curriculum-context.ts` validates imported JSON, normalizes subject matching, generates ids for units without ids, rejects duplicate ids, merges default units with teacher overrides, filters units by grade/semester/subject, and compresses selected units for AI prompt context.
- `src/lib/store.ts` persists `curriculumUnitOverrides` and `classCurriculumSelections` alongside the legacy `curriculumContents`. Class selections are keyed by `classId + semester`, while teacher edits are stored only as overrides so the bundled defaults remain immutable.
- `src/components/providers/WorkspaceSupabaseSync.tsx` includes unit overrides and class selections in the workspace sync payload.
- `/examples` exposes unit context management: JSON paste/upload validation, grade/semester/subject browsing, per-unit concept/focus/activity/standard edits, default restoration, and the old grade/semester memo as fallback context.
- `/write` shows a unit context panel for the selected teaching class. Selected unit ids are saved per class/semester and passed to generation for each student in that class.
- `/api/generate` accepts optional `curriculumContent`, observation-board context, OCR context, and teacher AI settings. Curriculum/unit context is explicitly framed as lesson background, not student evidence.
- `/api/generate` accepts a batch request with `students: [...]` plus shared class, teacher, model, prompt, example, and curriculum context. Eligible students are sent in one OpenAI Responses call with one system prompt and one shared class context; per-student safety fallbacks are returned without calling OpenAI. The existing single-student response contract remains supported.

### Loader

- `src/lib/knowledge-base.ts`
- prefers the bundled `web/output` snapshot, then falls back to the sibling knowledge repo or `KNOWLEDGE_JSON_PATH`
- loads knowledge JSON
- caches the merged evidence records with the dataset so per-query search does not rebuild all knowledge-unit ids
- applies school-level, category, and year filters
- uses lexical retrieval, compact spacing-insensitive matching, synonym expansion, concept constraints, and scoring
- consumes canonical entries that already merge conservative similar-question groups from the crawler

### Reranking

- `src/lib/knowledge-rerank.ts`
- uses OpenAI Responses API when available
- reranks top lexical candidates before final answer or review generation
- counsel chat and Graph RAG skip AI reranking only for lexical-only high-confidence matches with a public citation URL; record review keeps reranking

### Hosted Retrieval Preparation

- `src/lib/knowledge-hosted.ts`
- syncs canonical knowledge into an OpenAI vector store in batches
- searches the vector store and maps hosted hits back into app evidence objects
- hosted hits include `knowledge_unit_id` attributes for stable joins back to local evidence and graph labels; older uploaded files can still fall back to title matching
- answer-generating routes use RRF-based hybrid fusion when hosted results are available, so vector and lexical candidates are merged by rank rather than raw score scale

### Graph RAG Labeling

- `scripts/generate-graph-rag-labels.mjs`
- package script: `npm run label:graph-rag`
- shares query/domain rules with runtime detection through `src/data/knowledge-domain-rules.json`
- reads `output/star-moe-knowledge-2026.json`
- labels every canonical public knowledge unit with deterministic Obsidian-style metadata: source board, access level, school levels, categories, effective year, aliases, public source URLs, policy anchors, graph-priority score, and auto-generated domain/policy/risk/workflow tags
- emits typed graph nodes and edges for `knowledge_unit`, `category`, `school_level`, `source_board`, `source_document`, `policy_anchor`, domain/policy/risk/workflow tags, and duplicate/version families
- writes machine-readable full outputs to `output/graph-rag-labels/graph-rag-labels-2026.json` and `output/graph-rag-labels/graph-rag-labels-2026.jsonl`
- writes `output/graph-rag-labels/STATS.md` with label, node, edge, source, category, and priority-review counts
- writes a 120-note review seed vault under `output/graph-rag-labels/obsidian-vault/`; the full label set remains in JSON so the repo does not depend on manually maintaining thousands of Markdown notes
- current labels are `source_public_auto_labeled`; high-risk or conflicting policy clusters should be manually reviewed before using them as hard retrieval gates

### APIs

- `src/app/api/knowledge/meta/route.ts`
- `src/app/api/knowledge/sync/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/search-eval/route.ts`
- `src/app/api/search-openai/route.ts`
- `src/app/api/counsel-chat/route.ts`
- `src/app/api/counsel-chat/graph/route.ts`
- `src/app/api/record-review/route.ts`
- `src/app/api/generate/route.ts`
- `src/app/api/admin-users/route.ts`
- `src/app/api/admin-users/me/route.ts`
- `src/lib/prompts/seteuk.ts`
- `src/lib/seteuk-input-safety.ts`
- `src/lib/seteuk-expression-variation.ts`
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
- `/counsel-chat` includes a `Graph RAG` mode that calls `/api/counsel-chat/graph`, renders the generated answer first, then shows a supplementary Obsidian-like knowledge map from school level, category, year, policy anchors, retrieved knowledge units, public source documents, and client-derived keyword satellite nodes
- Graph RAG answers are split into answer spans; only spans whose retrieved source score and stricter lexical overlap both pass the grounding threshold are rendered as clickable citation-style highlights with compact inline citation markers, while ungrounded spans remain plain text
- Graph RAG grounding filters low-signal meta terms such as public/source/evidence/check phrasing so generic advice sentences are less likely to be highlighted as if they had exact source support
- Graph RAG answer highlights and selected source excerpts use cloned line-fragment text decoration with a near-full-height fill so wrapped Korean text appears as separate highlighter strokes instead of one large rectangle or a half-height underline
- Clicking a highlighted answer span opens the mapped source title, public excerpt, confidence level, and source URL in a right-side viewer
- The right-side viewer also lists the answer annotations separately from the raw search candidates, and raw candidates are tucked behind a disclosure control
- After a Graph RAG answer is generated, the long question composer collapses to a current-question summary with a `질문 수정` action so the answer and source viewer are immediately visible
- Graph RAG mode includes a native range slider for answer font size so teachers can enlarge or shrink the grounded answer without changing the browser zoom
- Graph RAG supplementary graph now renders as a dark Obsidian-style SVG network: central question/answer hubs, small circular ontology/knowledge/source nodes, derived keyword satellites, fine straight links, active source highlighting, compact counts, and a restrained blue/slate/amber legend instead of rectangular flowchart node cards
- The Obsidian-style graph layout uses wider radial rings, node-radius-aware bounds expansion, and post-layout recentering so the visible node cloud fills the canvas more evenly instead of collapsing into the middle; the mobile graph stage uses viewport-width-based height to avoid excess vertical dead space
- Graph RAG page-level tokens define dark graph canvas, node colors, edge colors, and highlight opacity, while `globals.css` sets explicit `color-scheme` for manual and system theme states
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
- `/observation-board-2` `grouping` mode renders a simplified Skill-Will class dashboard, including a shared survey link/code, session status, 제출률, 미응답 수, an x/y-axis-only 좌표평면 with endpoint labels, and compact 학생별 Skill 입력
- `/observation-board-2` `stats` mode includes the same compact single-class selector pattern as the mentor board and defaults to one assigned class, so group-balance rows stay scoped by class instead of aggregating every assigned class
- `/observation-board-2` `notice` mode stores announcements in `localStorage` with the key `observation-board-2-notices:${teacherKey}` and supports create, complete, and delete internally, but is not exposed in the current sidebar
- `/observation-board-2` `records` mode ports the previous observation-record workflow into the same visual system, but the visible stats `최근 기록` CTA now switches to `growth` so it does not send teachers into the old compose screen
- `globals.css` loads the local MapleStory font with `MaplestoryLight.ttf` for weights `100` through `699` and `MaplestoryBold.ttf` for weights `700` through `900`, maps `--font-body`, `--font-display`, `--font-soft`, and compatibility Korean font variables to MapleStory, and applies it as the default body/control font across the app
- `/observation-board-2` inherits the global MapleStory font stack for its classroom dashboard shell while keeping emoji-only glyph styling isolated where needed
- `/observation-board-2` renders roster numbers, not name initials, inside the yellow circular student badges used by mentor cards, the roster tray, activity rows, growth timeline avatars, and observation draft rows; numeric badge text is centered with fixed circular dimensions
- `/observation-board-2` stores mentor/mentee group assignments in local React state, supports adding an empty group, deleting an existing group, editing only a selected group, and uses HTML5 drag/drop so student tokens can be placed into 2-4 member groups while preserving previous 2-slot saved data through normalization
- `/observation-board-2` mentor cards are direct HTML5 drop targets without a separate `학생 추가` slot; dropping a roster or group token onto a card immediately moves/adds that student into the group, and each member token exposes a role selector for `멘토`, `멘티`, or `모둠원`. New additions default to first member as mentor and later members as mentees, but saved custom roles are preserved by normalization and AI context.
- `/observation-board-2` filters the bottom mentor roster tray against the current group member set, so any student already assigned to a group is hidden from the addable roster list and the tray count reflects only unassigned students.
- `/observation-board-2` persists mentor/mentee edits explicitly per selected class when a teacher drops a student or adds a group, avoiding effect-driven overwrites of saved assignments
- `/observation-board-2` exposes a selected-class `모둠 비우기` action that saves an explicit empty assignment array for that teacher/class while preserving existing △/○ marks and historical session snapshots
- `/observation-board-2` stores marked-session pairing snapshots in `observation-board-2-mentor-assignment-snapshots:${teacherKey}` so mid-year pairing changes do not rewrite the role/group context of previously recorded sessions
- `/observation-board-2` shows a compact single-class selector inside the default mentor configuration tab instead of a long horizontal class-chip rail; changing the selected class filters the mentor pairs, activity table tab, and roster tray to that class only
- `/observation-board-2` defaults the mentor screen to one selected 담당 학급 rather than an all-assigned-classes aggregate; the visible-student count setting remains available as an optional cap for default mentor pair generation and the roster tray
- `/observation-board-2` filters mentor matching, observation compose, growth, and stats to the current teacher's assigned class students only; it does not display sample students when no assigned class roster exists
- `/observation-board-2` stores editable session headers as `classId -> sessions` under `observation-board-2-sessions:${teacherKey}`; teachers edit session date/content inline, add columns with the `+` button for only the selected class, and legacy teacher-wide session arrays are migrated to the first assigned class for compatibility
- `/observation-board-2` stores rolling local safety snapshots under `observation-board-2-backups:${teacherKey}`. Settings shows current record counts, a manual backup button, and the latest backups with restore buttons; restore first creates a pre-restore backup, then rewrites sessions, marks, mentor assignments, snapshots, and notices.
- `/observation-board-2` blocks suspicious automatic remote sync attempts that would reduce previously meaningful session headers, activity marks, or mentor assignments to zero. Explicit teacher actions such as reset or backup restore set a one-time allow flag and still create a backup before the destructive change.
- `/observation-board-2` activity-record group rows alternate between soft green and soft blue table bands with stronger group start/end borders, making odd/even mentor groups visually distinct while keeping the classroom-board style.
- `/observation-board-2` persists teacher-clicked student △/○ activity marks to `observation-board-2-marks:${teacherKey}` and class-scoped mentor/mentee assignments to `observation-board-2-mentor-assignments:${teacherKey}` so `/write` can derive the selected student's mentor/mentee activity summary for `/api/generate`; session headers, mentor assignments, and snapshots are read only from the logged-in teacher's key and selected class, so the same class can be configured differently by teacher.
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
- Workspace and observation-board state sync preserves non-empty browser-local records when loading Supabase state: subject records are merged by id using the newest `lastUpdated`, and observation-board sessions/marks/mentor assignments are merged so an empty or stale remote payload does not erase existing local classroom records.
- Login now also creates a signed HTTP-only `seteuk-session` cookie, and storage APIs check the server session's school or teacher key before accepting data.
- Existing Google Sheets data can be migrated with `scripts/migrate-google-sheets-to-supabase.mjs` after applying `supabase/migrations/202604270001_initial_seteuk_storage.sql`; Google Sheets is otherwise retained for local dev/import/migration only.
- Admin grants are stored in `admin_role_grants` from `supabase/migrations/202605060001_admin_role_grants.sql`; server APIs verify the signed session with `isAdminTeacher` before listing, granting, or revoking admins, and the bootstrap `박범진` role cannot be revoked.
- `/write` does not fetch student-data tab entries before calling `/api/generate`
- `/write` reads the teacher-scoped, class-specific observation-board session headers, student △/○ marks, current mentor/mentee assignments, and per-session assignment snapshots from localStorage, sends a derived `observationBoardContext`, and `/api/generate` adds it to the 세특 prompt as `멘토·멘티 활동 해석`
- `/api/generate`, `/settings/ai`, and `src/lib/write-logic.ts` share `SETEUK_DEFAULT_SYSTEM_PROMPT` from `src/lib/prompts/seteuk.ts`; the current prompt version is `cross-curricular-seteuk-v2.9`, which frames output as a teacher-review draft, prioritizes direct observations and student-specific evidence, treats curriculum content as background only, blocks unsupported achievement/attitude/competency/media/output-format claims, prevents `친구 의견을 들음` from becoming `수정/보완/반영`, calibrates length/detail by evidence amount, allows sparse but diligent students to be described concisely without exaggeration, keeps strong-student longer comments evidence-bound, rewrites low-level artifact-processing phrases into observable learning behaviors, avoids invented subject concepts, varies first phrase/focus/verb choices across multiple students, retains cross-curricular large-batch guards against exact duplicate comments/internal repetition/length outliers, and avoids unsupported quality wording such as `빠짐없이`, `체계적으로`, `꼼꼼히`, `충실히`, `꾸준히`, or `지속적으로`.
- `/api/generate` adds a deterministic expression-variation profile from `src/lib/seteuk-expression-variation.ts` using student/class/subject context. The profile is prompt guidance only: it nudges sentence focus, first phrase, and verb candidates so batch-generated 세특 are not overly uniform, while forbidding new facts or unsupported behaviors.
- `/write` uses the batch generation contract when multiple selected students are generated together. If the batch request fails, the client falls back to the existing single-student generation path.
- `/api/generate` sanitizes submitted `learningData` with `src/lib/seteuk-input-safety.ts` before prompt construction. When no observation-board/OCR/observation evidence exists, empty input, generic-only input, subject-only input, and contradictory evidence return the safe fallback `충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.` without calling OpenAI.
- `/api/generate` removes exaggerated/non-evidence request fragments such as score, rank, award, future prediction, personality praise, direct writing commands, and inappropriate comparative requests before sending the prompt. Generated content is post-processed to neutralize unsupported quality words, unsupported `과제 수행함`, unsupported revision actions such as `수정함/보완함/반영함/조정함`, raw 차시/횟수 wording, awkward attitude phrasing, repeated generic connectors, and generic curriculum-summary sentences while keeping the existing JSON response shape.
- `/settings/ai` exposes two prompt choices: `기본 설정` uses read-only `cross-curricular-seteuk-v2.9`, while `내 프롬프트` stores `seteukPromptMode` and `personalSeteukPrompt` in teacher workspace state and Supabase sync payloads.
- `src/lib/prompts/seteuk.ts` also exports `SETEUK_DEFAULT_EXAMPLE_TEMPLATE`; `src/lib/store.ts` and `/examples` share that neutral short-input example set across different subjects, and stored legacy/default templates are migrated to the v2.9 template without overwriting teacher-edited templates.
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
- Graph RAG responses must use the same public-only evidence policy as counsel chat; graph nodes and highlighted excerpts are an explanation layer over retrieved public FAQ/Q&A evidence, not a separate private source
- Graph RAG answer spans must not be highlighted merely because a retrieved source exists; the span must pass the source-match threshold after low-signal terms are filtered, otherwise it renders as normal answer text without an inline source annotation
- review responses must include issues, risk level, and rewrite guidance
- improved drafts must stay inside the original facts plus public evidence
- record review first tries category-filtered matches and falls back to school-level public evidence when the category slice is empty
- similar Q&A grouping is conservative: spacing, `(재상담)`, and generic inquiry suffixes can merge; unrelated school levels or categories stay separate

## Quality Loop

- retrieval test set in `src/data/knowledge-eval-cases.ts`
- evaluation runner in `src/lib/knowledge-eval.ts`
- evaluation API in `/api/search-eval`
- `/api/search-eval?mode=lexical|hybrid&limit=8` compares local lexical search with the hybrid RRF path and reports hit@1, hit@3, recall@k, MRR, failures, matched titles, unit ids, and source URLs
- operational quality summary in `/api/admin/quality-report`
- current crawl snapshot in `/api/admin/crawl-status`
- graph-label generation smoke via `npm run label:graph-rag`

## Next Steps

1. manually review high-risk Graph RAG label clusters and promote reviewed labels from `source_public_auto_labeled`
2. monitor the expanded retrieval eval set before further scoring changes
3. decide when hosted retrieval is good enough to become the default provider
4. automate doc mirroring further if the workflow expands
