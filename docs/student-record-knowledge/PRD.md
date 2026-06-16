# Student Record Knowledge PRD

## Goal

Turn the STAR FAQ and public Q&A data into a usable knowledge layer for:

1. A counsel chatbot that answers student-record questions with citations
2. A record-review tool that checks draft wording against public guidance

## Product Rules

- Never use private posts as answer evidence
- Prefer the latest public answer when the same question has conflicting answers
- Treat FAQ as policy-shaped guidance and public Q&A as case-shaped support
- Group near-duplicate public Q&A titles conservatively when only spacing, `(재상담)`, or generic inquiry suffixes differ

## User Types

- homeroom teachers
- subject teachers
- record-review staff
- students who only need to submit a public group survey

## Login And Roster Flow

- The shipped school login is limited to `성호중학교`.
- A teacher logs in with `학교=성호중학교`, `아이디=본인 한글 이름`, `비밀번호=123123`.
- Successful login opens student management directly so the teacher can select 담당 학급 without uploading a roster.
- The 2026 성호중학교 1/2/3학년 명렬표 is managed as a school-shared roster; teachers register their own teaching classes from that roster.

## Scope

### Counsel chatbot

- lives inside the shared `학생부 상담·점검` workspace entry
- school-level filter
- category filter
- year filter
- citation-backed answer
- visible raw search results
- Graph RAG mode that answers the teacher question first, then adds citation-style highlights only to answer spans with a direct public source match
- supplementary Obsidian-like knowledge map that visualizes the question, ontology concepts, retrieved knowledge units, public source documents, answer grounding path, and derived keyword satellites without replacing the answer
- offline Graph RAG labeling layer that converts the full public knowledge snapshot into Obsidian-style tags, aliases, concept nodes, source nodes, policy-anchor nodes, and typed edges for later retrieval expansion
- answer highlighting that opens the exact supporting source excerpt and source link in a right-side viewer; answer spans without a strong public-source match remain plain text
- highlighted answer and source-excerpt text should render as line-fragment highlighter marks, not as one large rectangular block around wrapped text
- highlighted answer and source-excerpt text should use a near-full-height highlighter fill so the mark does not cut through only the lower half of Korean text
- after a source-annotated answer is generated, the long question composer collapses to the current-question summary so the answer and source viewer become the primary workspace
- highlighted answer spans use compact citation markers and a right-side "answer annotations" list so teachers can move between cited answer parts without reading raw search results first
- answer font-size slider for classroom display and accessibility
- the supplementary graph should read like a compact Obsidian network: dark canvas, small circular nodes, fine links, central question/answer hubs, restrained blue/slate/amber labels/legend, and balanced canvas coverage instead of saturated flowchart colors, large rectangular cards, a center-collapsed cluster, or large dead zones

### Record review

- lives inside the same `학생부 상담·점검` workspace as a mode switch
- issue extraction
- evidence cards
- rewrite guidance
- one-click improve action from `/write`
- visible raw search results

### Operations

- metadata endpoint
- raw search endpoint
- search evaluation endpoint
- admin recrawl endpoint
- admin reindex endpoint
- admin crawl-status endpoint
- admin quality-report endpoint
- graph labeling generation command and review seed vault for data-maintenance workflows

### Skill-Will group survey

- public student survey at `/group-survey/[accessCode]`
- student identification by grade, class, and number against the 성호중학교 roster
- one shared survey link can collect responses from multiple classes; responses are stored with the matched roster grade/class/number
- name confirmation before submission
- 12-question Will/participation-agency survey based on `Skill-Will_모둠편성_설문_패키지/01_학생용/student_survey.md`
- teacher-only grouping dashboard inside `/observation-board-2`
- class-level dashboard filtering, submission status, quick Skill input, and a Skill-Will coordinate plane showing students as points with only x/y axes and clear endpoint labels

## Current State

- `/api/counsel-chat`: implemented
- `/api/record-review`: implemented
- `/api/search`: implemented
- `/api/search-eval`: implemented with lexical/hybrid provider comparison, configurable top-k limit, hit@1, hit@3, recall@k, MRR, and failed-case details
- conservative similar-question dedupe: implemented for canonical and pending Q&A outputs
- `/counsel-chat`: implemented as the combined counsel/review workspace
- `/counsel-chat`: Graph RAG mode implemented with answer-first citation annotations, highlighted grounded answer spans only when a direct public source match exists, near-full-height line-fragment highlighter rendering for wrapped answer/source text, compact citation markers, source excerpt viewer, answer annotation list, answer font-size slider, collapsed current-question state after generation, and a supplementary Obsidian-like knowledge map with bounds-based spread/recentering so the graph uses the canvas more evenly
- Graph RAG offline labeling: `npm run label:graph-rag` generates deterministic labels for all 1,451 public canonical knowledge units, a typed graph JSON/JSONL, stats, and a 120-note Obsidian seed vault for manual review
- counsel and Graph RAG retrieval use RRF-based hybrid fusion when hosted vector search is configured; if hosted search is unavailable, lexical retrieval remains the fail-open default
- `/record-review`: implemented as a compatibility redirect to `/counsel-chat?mode=review`
- `/write`: RAG review-improve action implemented
- `/write`: AI 세특 작성 화면 is aligned to the provided table workspace design with class chips, screenshot-style action toolbar, 10-row pagination, top teacher/notification chrome, and the AI 세특 guide card in the sidebar
- `/write`: default seteuk generation prompt uses the `cross-curricular-seteuk-v2.3` teacher-review draft policy; it prioritizes direct teacher observations and student-specific evidence, uses grade/subject/curriculum context to choose a plausible subject background for short inputs even when no unit name is entered, removes raw count/frequency wording such as `1회`, avoids repeated `정리함/작성함/발표에 참여함` frames, varies sentence structure and subject-specific action verbs, adjusts length and competency wording to the amount of evidence, improves sentence flow without fabricating student-specific facts, and excludes score/rank/award/test-item/student-level/unsupported achievement/AI-tool wording
- `/settings/ai`: teachers choose exactly one of `기본 설정` and `내 프롬프트`; the default is read-only `cross-curricular-seteuk-v2.3`, while the personal prompt is teacher-private and synced in workspace state
- `/settings`: admins can grant/revoke additional 성호중학교 admins by teacher name; bootstrap admin `박범진` is non-revocable
- `/api/admin-users`: implemented for admin list, grant, revoke, and server-loaded admin status
- `/search-inspector`: retained as an internal diagnostics page and removed from the sidebar
- top navigation order: `학교 정보` -> `학생 관찰 기록` -> `AI 세특 생성` -> `평가 점검 (개발중)`
- `평가 점검 (개발중)` remains visible but is disabled and does not link to `/eval-check`
- `/eval-check`: redirects to `/dashboard` when entered directly
- `/ocr` remains implemented, but the tab is currently hidden from the top navigation
- `/api/admin/crawl`: implemented for knowledge recrawls, defaulting to refreshed cache
- `/api/admin/reindex`: implemented for hosted vector store sync
- `/api/admin/crawl-status`: implemented for source snapshot/status checks
- `/api/admin/quality-report`: implemented for knowledge quality checks
- `/api/admin/*`: protected by `ADMIN_API_TOKEN` in production
- student management scope: roster upload + teaching-class connection only
- top-level student data tab: removed, including the `/student-data` page
- seteuk generation does not load student-data tab entries; it uses observation notes, interpreted mentor/mentee activity summaries derived from observation-board △/○ marks, learning data, and OCR evaluation context
- AI settings stores admin overrides in browser storage, while empty or legacy default values resolve back to the shared `cross-curricular-seteuk-v2.3` default prompt; legacy default example templates are migrated to the new neutral short-input example set while teacher-edited templates are preserved
- competency color analysis: implemented as source-text-safe highlighting with per-row analysis status
- school roster uploads are shared per school, so other teachers at the same school can reuse the uploaded roster without uploading again
- 성호중학교 login is password-gated and opens the roster/class registration flow directly
- 성호중학교 teachers use the preloaded 2026 grade rosters and do not need the upload step
- repeated roster uploads for the same school are merged by roster key, so overlapping students are skipped instead of duplicated
- student observation tab location: `/observation-board-2`
- legacy `/observation-board` and `/observations` direct entry redirects to `/observation-board-2`
- student observation interaction: example-image-matched classroom dashboard shell with its own illustrated left rail, default `학생 관찰 기록` mentor/mentee activity screen, and clickable session status cells for participation and strong performance marks
- student observation navigation: the left rail switches internal screens only (`학생 관찰 기록`, `성장 기록`, `통계 보기`), hides the earlier `홈`, `알림장`, and `설정` entries, does not route out of `/observation-board-2`, and stays as the PNG-style vertical sidebar even in narrower browser windows
- student observation data scope: mentor matching, observation compose, growth, and stats show only students from the current teacher's assigned classes; the board no longer backfills sample students when no assigned roster exists
- student observation mentor workflow: the default screen is `학생 관찰 기록`, splits `멘토·멘티 구성` and `활동 기록` into two in-screen tabs to avoid side-by-side clipping, uses a compact single-class selector instead of a long horizontal class-chip row, shows roster numbers centered inside circular student badges, supports adding empty groups, deleting existing groups, and lets teachers drag student tokens directly between group cards
- student observation group workflow: mentor/mentee groups support 2-4 students per group, allow editing only a selected group without rebuilding the whole board, and preserve existing activity marks when groups are emptied or regrouped
- student observation group workflow: teachers can drag a student from the roster or another group directly onto the target group card to add or move one member at a time; each member role can be set manually as mentor, mentee, or group member, while newly added members default to first=mentor and later members=mentee
- student observation group workflow: the roster tray shows only students who are not already assigned to a mentor/mentee group, so assigned students disappear from the addable student list until they are removed from a group
- student observation mentor display scope: the selected class controls the mentor/mentee cards, activity table tab, and roster tray; the default mentor screen does not expose an all-assigned-classes aggregate view, while the visible-student count setting can optionally cap the auto-paired/listed students
- student observation mentor editing: teachers can drag students between group cards, persist the edited grouping per teacher/class, and clear the selected class to an explicit empty group state without deleting △/○ activity marks; the same grade/class may have different mentor/mentee assignments for each teacher
- student observation mentor history: when pairing changes after activity marks exist, marked sessions keep the pairing snapshot from the time of recording so later `/write` generation interprets past sessions by the original role/group and later sessions by the new role/group
- student observation sessions: each selected class keeps its own session headers; teachers can enter class-specific dates and activity content, the `+` header button adds another session column only for that class, and teacher-clicked student △/○ marks are converted into attitude/participation summaries for `/write` generation
- student observation cookie automation: mentor/mentee session marks start blank and use blank=0, △=1, ○=2 cookies; changing a mark writes only the balance delta to the cookie ledger
- student observation growth/stats: growth opens with the selected class/search filtered student card grid, shows every matching 담당 학생 without a fixed eight-student cap, surfaces per-student record gaps, current cookie count, △/○ activity reactions, and a screenshot-matched in-tab `성장 기록 작성` modal for selected students with animal chips, neutral cookie cards, optional memo, and bottom action buttons; stats surfaces record-priority students and group activity balance in addition to counts and tag bars, and the `최근 기록` CTA switches to `성장 기록`
- student observation stats scope: stats uses a compact class selector and defaults to one assigned class instead of opening all assigned class groups at once
- student observation growth dashboard: builds the student timeline from `/api/observations` with class and search filters
- student observation stats dashboard: summarizes observation counts, student counts, tag frequency, latest record date, and current △/○ activity marks with cards and compact bars
- student observation notice dashboard: announcement storage remains implemented under `observation-board-2-notices:${teacherKey}`, but the notice board is not exposed in the current sidebar
- student observation compose: the existing observation-record workflow remains an internal `records` mode rather than a visible sidebar tab; visible stats quick actions route teachers back to `성장 기록`
- app typography: uses the local MapleStory font as the default interface font across the shipped web app, including student observation screens and roster/class management
- app typography: uses the local MapleStory font as the default interface font across the shipped web app, including student observation screens and roster/class management
- student observation mentor matching: uses local Korean fonts, limits MapleStory to playful classroom-board accents, and supports dragging student names from existing group cards or the roster directly onto target group cards
- group survey: `/group-survey/[accessCode]` public student survey implemented with shared-link grade/class/number identification, name confirmation, and 12-question submission
- group survey dashboard: `/observation-board-2` exposes `모둠 편성` as a class-scoped Skill-Will coordinate plane with survey session controls, submission status, quick Skill input, x/y axes only, and endpoint labels
- group survey storage: Supabase migration added for survey sessions, responses, teacher Skill scores, and recommendation run history
- manual observation entry uses common date/topic/tags at the top and per-student rows for individual tags plus observation memo
- runtime storage: production is Supabase-only and returns `503` when Supabase env is missing; Google Sheets is retained only for local fallback and import/migration helpers
- browser state sync: workspace state, teacher prompt mode/body, and observation-board sessions/marks/mentor assignments/notices sync to Supabase after login through signed server sessions
- forbidden expression defaults: the store and `/api/forbidden` share the same default list covering 과장, 서열/점수, 부정 낙인, 미래 예측, and 직접 조언 표현
