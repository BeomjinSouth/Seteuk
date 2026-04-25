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
- `src/app/api/admin/crawl/route.ts`
- `src/app/api/admin/reindex/route.ts`
- `src/app/api/admin/crawl-status/route.ts`
- `src/app/api/admin/quality-report/route.ts`
- admin crawl copies the regenerated knowledge JSON into `web/output` and clears the in-process knowledge cache after success
- admin crawl uses `KNOWLEDGE_PACKAGE_DIR` when provided, otherwise `../student-record-knowledge`, and returns 503 if the package is unavailable
- admin routes use `ADMIN_API_TOKEN` in production and accept `Authorization: Bearer <token>` or `x-admin-token`

### UI

- `src/app/counsel-chat/page.tsx`
- `src/app/record-review/page.tsx`
- `src/app/write/page.tsx`
- `src/app/search-inspector/page.tsx`
- `src/app/eval-check/page.tsx`
- `src/app/observation-board/page.tsx`
- `src/app/observations/page.tsx`
- `src/components/layout/AppShell.tsx`
- raw match list shown in the pages
- local vs hosted search comparison available
- query-string prefill supported
- the sidebar/workspace label is `생기부 상담 점검`
- counsel chat and record review now share one `/counsel-chat` workspace with a mode switch, and `/record-review` redirects into that workspace
- `search-inspector` remains available only as an internal diagnostics route and is no longer shown in the sidebar
- main navigation groups those tools under `AI 세특 생성`
- top navigation order is `학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검 (개발중)`
- `평가 점검 (개발중)` is rendered as a disabled nav item, and direct `/eval-check` access redirects to `/dashboard`
- `/ocr` stays available as a route, but `GlobalNav` currently filters the OCR tab out of the visible main navigation
- student management is limited to roster upload and teaching-class connection; the student board now lives in `/observation-board`
- school roster data syncs through `/api/students` into shared sheet-backed storage, while teaching-class connections remain teacher-specific in local app state
- repeated uploads for the same school are merged server-side by roster key and return add/update/skip counts so overlapping students do not duplicate
- in `/observation-board`, single click selects students and double click opens observation writing; same-class multi-selection enters batch observation entry
- `/observations` manual compose renders one editable row per selected student and stores row-specific date, lesson topic, selected tag, and memo
- `/api/record-review` can optionally return `improvedDraft` for the write-tab review-improve action

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
