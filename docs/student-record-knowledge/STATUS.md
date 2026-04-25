# STATUS

## Source Snapshot

- generatedAt: 2026-04-25T01:04:06.576Z
- year: 2026
- qnaLastPage: 278
- qnaListed: 3330
- qnaPublic: 1502
- qnaSecret: 1828
- canonicalEntries: 1451
- knowledgeUnits: 1451
- pendingPublicEntries: 51
- inaccessibleEntries: 1828

## Web Status

- counsel chat API: implemented
- record review API: implemented
- write review-improve action: implemented
- raw search API: implemented
- search eval API: implemented
- admin crawl API: implemented
- admin reindex API: implemented
- admin crawl-status API: implemented
- admin quality-report API: implemented
- admin API guard: production calls require `ADMIN_API_TOKEN` via bearer or `x-admin-token` header
- counsel/review workspace page: implemented
- /record-review compatibility redirect: implemented
- /eval-check route: redirects to /dashboard while the feature is in development
- write page integration: implemented
- search inspector diagnostics route: implemented but hidden from the sidebar
- main navigation integration: 학교 정보 -> 학생 관찰 기록 -> 학생 데이터 -> AI 세특 생성 -> 평가 점검 (개발중) 순서 적용
- student data tab: implemented with teacher-owned notes/grades/mentor matches and school-shared cookies/rewards
- student data APIs: `/api/student-data`, `/api/cookies`, `/api/cookie-rewards` implemented with Google Sheets/local fallback storage
- write generation context: current teacher `AI 반영` student data is injected into `/api/generate`; cookie data is excluded by default
- competency color check: source-text-safe rendering, per-row analysis button/status, and stale analysis clearing implemented
- eval-check tab visibility: visible as disabled `평가 점검 (개발중)` and excluded from active/click handling
- OCR route visibility: /ocr route remains implemented, but the tab is hidden from the top navigation
- student workspace split: 학생 관리는 명부/학급 연결만 담당하고 학생 카드 보드는 /observation-board로 분리
- shared roster sync: 학교 공용 명부를 /api/students + 시트 저장소로 동기화하고 같은 학교 사용자가 함께 사용하며, 중복 업로드는 학적 키 기준으로 병합
- observation board interaction: 카드 클릭 선택 + 더블클릭 관찰 기록 작성 + 같은 학급 다중 선택 일괄 저장 지원
- observation compose layout: 학생별 row editor + 선택형 태그 + 날짜 기본값 오늘
- lexical retrieval: implemented
- AI reranking: implemented
- bundled knowledge snapshot for deployed runtime: implemented

## Recent Changes

- 2026-04-25: refreshed the 2026 STAR snapshot with cache refresh; Q&A now has 278 pages, 3,330 listed posts, and 1,451 knowledge units
- 2026-04-25: added conservative similar-question grouping for spacing, `(재상담)`, and generic inquiry suffix variants
- 2026-04-25: changed conflict resolution to default to the latest public answer, with FAQ priority only when explicitly requested
- 2026-04-25: aligned representative citations so `sources[0]`, `sourceUrls[0]`, and `source_documents.primary` point to the selected answer source
- 2026-04-25: added admin recrawl, reindex, crawl-status, and quality-report APIs
- 2026-04-25: added production token guard for `/api/admin/*` routes
- 2026-04-25: kept `평가 점검` visible as `평가 점검 (개발중)` but blocked tab navigation and direct `/eval-check` access
- 2026-04-25: added `학생 데이터` tab, student-data/cookie APIs, teacher-scoped AI context injection, and safer competency color highlighting
- 2026-03-25: changed student roster upload to sync through shared school storage and merge overlapping uploads by roster key
- 2026-03-25: renamed the counsel/review workspace label to `생기부 상담 점검` and removed the hero stat cards from the page header
- 2026-03-25: made knowledge loading prefer `web/output/star-moe-knowledge-2026.json` and bundle that snapshot during sync so deployed routes stop looking for `/var/student-record-knowledge/...`
- 2026-03-25: merged counsel chat and record review into one `/counsel-chat` workspace and removed the search inspector from the user sidebar
- 2026-03-25: fixed OpenAI JSON mode validation failures in `record-review` and AI reranking by adding explicit `JSON` instructions to the request input context
- 2026-03-25: kept the OCR route implemented but hid the `학습지 OCR` tab from the top navigation

## Next

- smoke test the admin APIs behind the deployed runtime configuration
- improve retrieval ranking for difficult query classes
- replace lexical-first retrieval with vector or hosted file search
- automate more of the doc mirror workflow if needed
