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

## Current State

- `/api/counsel-chat`: implemented
- `/api/record-review`: implemented
- `/api/search`: implemented
- `/api/search-eval`: implemented
- conservative similar-question dedupe: implemented for canonical and pending Q&A outputs
- `/counsel-chat`: implemented as the combined counsel/review workspace
- `/record-review`: implemented as a compatibility redirect to `/counsel-chat?mode=review`
- `/write`: RAG review-improve action implemented
- `/search-inspector`: retained as an internal diagnostics page and removed from the sidebar
- top navigation order: `학교 정보` -> `학생 관찰 기록` -> `학생 기록 관찰 2` -> `학생 데이터` -> `AI 세특 생성` -> `평가 점검 (개발중)`
- `평가 점검 (개발중)` remains visible but is disabled and does not link to `/eval-check`
- `/eval-check`: redirects to `/dashboard` when entered directly
- `/ocr` remains implemented, but the tab is currently hidden from the top navigation
- `/api/admin/crawl`: implemented for knowledge recrawls, defaulting to refreshed cache
- `/api/admin/reindex`: implemented for hosted vector store sync
- `/api/admin/crawl-status`: implemented for source snapshot/status checks
- `/api/admin/quality-report`: implemented for knowledge quality checks
- `/api/admin/*`: protected by `ADMIN_API_TOKEN` in production
- student management scope: roster upload + teaching-class connection only
- top-level student data tab: implemented for teacher-owned notes, grades, mentor matches, and school-shared cookies/rewards
- `AI 반영` student data from the current teacher/class/semester is included in seteuk generation; cookie data is excluded by default
- competency color analysis: implemented as source-text-safe highlighting with per-row analysis status
- school roster uploads are shared per school, so other teachers at the same school can reuse the uploaded roster without uploading again
- 성호중학교 login is password-gated and opens the roster/class registration flow directly
- 성호중학교 teachers use the preloaded 2026 grade rosters and do not need the upload step
- repeated roster uploads for the same school are merged by roster key, so overlapping students are skipped instead of duplicated
- student board location: `/observation-board`
- observation board interaction: dense desktop board targeting roughly 6 columns x 3~4 rows at 1440px+, single click selects, double click opens observation writing, and same-class multi-selection supports batch entry
- observation board cards show student number/name, latest representative tag, last observation date, memo count, and selected state while keeping destructive actions out of the primary card flow
- observation board 2 location: `/observation-board-2`
- observation board 2 interaction: example-image-matched classroom dashboard shell with its own illustrated left rail, default `학생 관찰 기록` mentor/mentee activity screen, and clickable session status cells for participation and strong performance marks
- observation board 2 navigation: the left rail switches internal screens only (`홈`, `멘토 멘티 활동 기록`, `성장 기록`, `통계 보기`, `알림장`, `설정`) and does not route out of `/observation-board-2`
- observation board 2 data scope: mentor matching, observation compose, growth, and stats show only students from the current teacher's assigned classes; the board no longer backfills sample students when no assigned roster exists
- observation board 2 mentor workflow: the default screen is `멘토 멘티 활동 기록`, supports adding empty groups, and lets teachers drag student tokens between mentor/mentee slots
- observation board 2 growth/stats: growth surfaces per-student record gaps, latest notes, and △/○ activity reactions; stats surfaces record-priority students and group activity balance in addition to counts and tag bars
- observation board 2 growth dashboard: merges `/api/observations` and `/api/student-data` note/grade/mentor_match rows into a student timeline with class and search filters
- observation board 2 stats dashboard: summarizes observation counts, student counts, tag frequency, latest record date, and current △/○ activity marks with cards and compact bars
- observation board 2 notice dashboard: stores announcements and completion state in browser localStorage under `observation-board-2-notices:${teacherKey}`
- observation board 2 observation compose: the existing observation-record workflow remains available from home/settings quick actions as an internal `records` mode rather than a visible sidebar tab
- observation board 2 mentor matching: uses the provided Maplestory TTF and supports dragging student names from mentor/mentee cards or the roster into mentor/mentee slots
- manual observation entry uses common date/topic/tags at the top and per-student rows for individual tags plus observation memo
