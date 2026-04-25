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
- main navigation integration: 학교 정보 -> 학생 관찰 기록 -> 학생 기록 관찰 2 -> 학생 데이터 -> AI 세특 생성 -> 평가 점검 (개발중) 순서 적용
- student data tab: implemented with teacher-owned notes/grades/mentor matches and school-shared cookies/rewards
- student data APIs: `/api/student-data`, `/api/cookies`, `/api/cookie-rewards` implemented with Google Sheets/local fallback storage
- write generation context: current teacher `AI 반영` student data is injected into `/api/generate`; cookie data is excluded by default
- competency color check: source-text-safe rendering, per-row analysis button/status, and stale analysis clearing implemented
- eval-check tab visibility: visible as disabled `평가 점검 (개발중)` and excluded from active/click handling
- OCR route visibility: /ocr route remains implemented, but the tab is hidden from the top navigation
- student workspace split: 학생 관리는 명부/학급 연결만 담당하고 학생 카드 보드는 /observation-board로 분리
- shared roster sync: 학교 공용 명부를 /api/students + 시트 저장소로 동기화하고 같은 학교 사용자가 함께 사용하며, 중복 업로드는 학적 키 기준으로 병합
- 성호중학교 login: 학교/한글 이름/비밀번호 `123123`만 허용하고 성공 시 /students 학급 등록으로 진입
- 성호중학교 roster onboarding: 2026 1/2/3학년 명렬표를 공용 학생 명부에 반영했고 성호중학교 교사는 업로드 없이 학급을 선택 등록
- observation board interaction: 고밀도 보드(1440px+에서 약 6열) + 카드 클릭 선택 + 더블클릭 관찰 기록 작성 + 같은 학급 다중 선택 일괄 저장 지원
- observation board card state: 번호/이름, 최근 대표 태그, 마지막 기록일, 관찰 메모 수, 선택 상태 표시
- observation board 2 tab: `/observation-board-2`에서 예시 PNG에 맞춘 독립형 교실 대시보드, 기본 `학생 관찰 기록` 활동판, 모둠 추가, 차시별 활동 기록 표, 참여/매우 잘함 클릭 표시 지원
- observation board 2 internal dashboards: 왼쪽 메뉴가 URL 이동 없이 `홈`, `학생 관찰 기록`, `성장 기록`, `통계 보기`, `알림장`, `설정` 화면을 전환하며, 성장 기록/통계/알림장/설정 대시보드 구현
- observation board 2 data scope: 멘토·멘티, 관찰 작성, 성장 기록, 통계는 현재 교사의 담당 학급 학생만 표시하고 담당 학생이 없을 때 샘플 학생으로 대체하지 않음
- observation board 2 growth/stats usefulness: 성장 기록은 학생별 관찰 공백/최근 메모/△·○ 반응을 보여주고, 통계 보기는 기록 우선 학생과 모둠별 활동 균형을 함께 표시
- observation board 2 editable sessions: 차시 표 헤더에서 날짜/활동 내용을 직접 입력하고 `+` 버튼으로 차시 열을 추가하며, 교사별 localStorage에 유지
- observation board 2 records mode: 기존 관찰 기록 기능은 사이드바에서 숨긴 내부 `records` 모드로 유지하고, 홈/설정 빠른 이동에서 학급/검색 필터, 학생 다중 선택, 공통 날짜/주제/태그, 학생별 메모 입력, 최근 기록 목록, 상세 보기, 삭제 지원
- observation board 2 drag matching/font: Maplestory TTF 적용, 학생 토큰/학생 목록 드래그로 멘토·멘티 조와 역할 재배치 지원
- observation compose layout: 상단 공통 날짜/수업 주제/공통 태그 + 학생별 개별 태그/관찰 메모 row editor
- lexical retrieval: implemented
- AI reranking: implemented
- bundled knowledge snapshot for deployed runtime: implemented

## Recent Changes

- 2026-04-25: restricted login to 성호중학교 teacher-name/password credentials and redirected successful login to class registration
- 2026-04-25: imported the 2026 성호중학교 1/2/3학년 명렬표 into the shared roster store for no-upload class registration
- 2026-04-25: refreshed the 2026 STAR snapshot with cache refresh; Q&A now has 278 pages, 3,330 listed posts, and 1,451 knowledge units
- 2026-04-25: added conservative similar-question grouping for spacing, `(재상담)`, and generic inquiry suffix variants
- 2026-04-25: changed conflict resolution to default to the latest public answer, with FAQ priority only when explicitly requested
- 2026-04-25: aligned representative citations so `sources[0]`, `sourceUrls[0]`, and `source_documents.primary` point to the selected answer source
- 2026-04-25: added admin recrawl, reindex, crawl-status, and quality-report APIs
- 2026-04-25: added production token guard for `/api/admin/*` routes
- 2026-04-25: kept `평가 점검` visible as `평가 점검 (개발중)` but blocked tab navigation and direct `/eval-check` access
- 2026-04-25: added `학생 데이터` tab, student-data/cookie APIs, teacher-scoped AI context injection, and safer competency color highlighting
- 2026-04-25: added `학생 기록 관찰 2` next to the observation tab with a mentor/mentee activity-board design based on the provided dashboard example
- 2026-04-25: rebuilt `학생 기록 관찰 2` around the PNG-like default mentor/mentee screen, internal-only sidebar dashboards, localStorage notice board, growth timeline, stats view, and hidden observation compose mode
- 2026-04-25: applied Maplestory fonts to `학생 기록 관찰 2`, fixed cropped/wrapped dashboard areas, and added drag/drop mentor-mentee matching
- 2026-04-25: restored the PNG-style `학생 관찰 기록` sidebar/header chrome, added group creation, restricted displays to assigned class students, and made growth/stats show actionable student and group signals
- 2026-04-25: made observation-board-2 session headers editable for date/activity content and connected the `+` header button to add persisted session columns
- 2026-04-25: redesigned `학생 관찰 기록` into a dense classroom board with batch observation entry and common-context manual compose
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
