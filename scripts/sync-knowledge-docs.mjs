import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceRoot = path.resolve(repoRoot, '..', 'student-record-knowledge');
const docsSourceDir = path.join(sourceRoot, 'docs');
const targetDir = path.join(repoRoot, 'docs', 'student-record-knowledge');
const mirrorDir = path.join(targetDir, 'mirror');
const outputSourceDir = path.join(sourceRoot, 'output');
const outputTargetDir = path.join(repoRoot, 'output');
const bundledOutputFiles = [
  'star-moe-knowledge-2026.json',
];

const sourceDocs = [
  { source: 'PRD.md', target: 'PRD.md' },
  { source: 'IMPLEMENTATION.md', target: 'IMPLEMENTATION.md' },
  { source: 'SOURCE_AUDIT.md', target: 'SOURCE_AUDIT.md' },
  { source: 'AGENT_CATALOG.md', target: 'AGENT_CATALOG.md' },
];

function buildHeader(title) {
  return [
    '<!--',
    'This file is mirrored from ../student-record-knowledge/docs.',
    'Run `npm run sync:knowledge-docs` from the web repo to refresh it.',
    '-->',
    '',
    `# ${title}`,
    '',
  ].join('\n');
}

async function syncDocs() {
  await mkdir(mirrorDir, { recursive: true });

  for (const item of sourceDocs) {
    const sourcePath = path.join(docsSourceDir, item.source);
    const targetPath = path.join(mirrorDir, item.target);
    const raw = await readFile(sourcePath, 'utf8');
    const title = item.target.replace(/\.md$/, '');
    await writeFile(targetPath, `${buildHeader(title)}${raw}`, 'utf8');
  }
}

async function syncOutput() {
  await mkdir(outputTargetDir, { recursive: true });

  for (const filename of bundledOutputFiles) {
    const sourcePath = path.join(outputSourceDir, filename);
    const targetPath = path.join(outputTargetDir, filename);
    await copyFile(sourcePath, targetPath);
  }
}

async function syncStatus() {
  const targetPath = path.join(targetDir, 'STATUS.md');
  const bundledKnowledgePath = path.join(outputTargetDir, 'star-moe-knowledge-2026.json');
  const outputRaw = await readFile(bundledKnowledgePath, 'utf8');
  const output = JSON.parse(outputRaw);
  const stats = output.stats;

  const body = [
    '# STATUS',
    '',
    '## Source Snapshot',
    '',
    `- generatedAt: ${output.generatedAt}`,
    `- year: ${output.year}`,
    `- qnaLastPage: ${stats.qnaLastPage}`,
    `- qnaListed: ${stats.qnaListed}`,
    `- qnaPublic: ${stats.qnaPublic}`,
    `- qnaSecret: ${stats.qnaSecret}`,
    `- canonicalEntries: ${stats.canonicalEntries}`,
    `- knowledgeUnits: ${stats.knowledgeUnits}`,
    `- pendingPublicEntries: ${stats.pendingPublicEntries}`,
    `- inaccessibleEntries: ${stats.inaccessibleEntries}`,
    '',
    '## Web Status',
    '',
    '- counsel chat API: implemented',
    '- record review API: implemented',
    '- write review-improve action: implemented',
    '- raw search API: implemented',
    '- search eval API: implemented',
    '- admin crawl API: implemented',
    '- admin reindex API: implemented',
    '- admin crawl-status API: implemented',
    '- admin quality-report API: implemented',
    '- admin API guard: production calls require `ADMIN_API_TOKEN` via bearer or `x-admin-token` header',
    '- counsel/review workspace page: implemented',
    '- /record-review compatibility redirect: implemented',
    '- /eval-check route: redirects to /dashboard while the feature is in development',
    '- write page integration: implemented',
    '- write page screenshot UI: implemented with class chips, 10-row pagination, rounded AI input/content table rows, AI 세특 guide sidebar card, and top teacher/notification chrome',
    '- search inspector diagnostics route: implemented but hidden from the sidebar',
    '- main navigation integration: 학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검 (개발중) 순서 적용',
    '- student data tab: removed along with `/student-data`; write generation no longer loads student-data tab entries',
    '- student data APIs: `/api/student-data`, `/api/cookies`, `/api/cookie-rewards` retained as legacy Google Sheets/local fallback storage endpoints',
    '- Supabase runtime store: implemented behind `SUPABASE_URL`/`SUPABASE_PROJECT_ID` + `SUPABASE_SECRET_KEY`, with `sheet_rows` preserving existing API contracts and Google Sheets as fallback when Supabase is not configured',
    '- workspace/observation-board state sync: implemented via `/api/workspace-state`, `/api/observation-board-state`, `WorkspaceSupabaseSync`, and observation-board save/load hooks',
    '- server session guard: login issues a signed HTTP-only `seteuk-session` cookie and key storage APIs validate school/teacher scope before writes',
    '- Google Sheets auth resilience: service account email/spreadsheet id are trimmed, private keys tolerate wrapping quotes, escaped newlines, and base64 PEM values, and read-only roster/student-data/cookie APIs no longer run sheet creation first',
    '- write generation context: observation notes, interpreted mentor/mentee activity summaries derived from observation-board △/○ marks, learning data, and OCR evaluation context are injected into `/api/generate`; student-data tab entries are not loaded',
    '- competency color check: source-text-safe rendering, per-row analysis button/status, and stale analysis clearing implemented',
    '- eval-check tab visibility: visible as disabled `평가 점검 (개발중)` and excluded from active/click handling',
    '- OCR route visibility: /ocr route remains implemented, but the tab is hidden from the top navigation',
    '- student workspace split: 학생 관리는 명부/학급 연결만 담당하고 학생 관찰 기록은 /observation-board-2로 제공',
    '- legacy observation routes: `/observation-board` and `/observations` redirect to `/observation-board-2`',
    '- shared roster sync: 학교 공용 명부를 /api/students + 시트 저장소로 동기화하고 같은 학교 사용자가 함께 사용하며, 중복 업로드는 학적 키 기준으로 병합',
    '- 성호중학교 login: 학교/한글 이름/비밀번호 `123123`만 허용하고 성공 시 /students 학급 등록으로 진입',
    '- 성호중학교 roster onboarding: 2026 1/2/3학년 명렬표를 공용 학생 명부에 반영했고 성호중학교 교사는 업로드 없이 학급을 선택 등록',
    '- 성호중학교 roster load resilience: /students 명렬표 로딩/빈 데이터/오류 상태를 명확히 표시하고, 학교명 비교는 정규화된 값으로 처리',
    '- auth hydration: authenticated pages wait for persisted store hydration before redirecting, so /students refresh keeps the logged-in session',
    '- student observation tab: `/observation-board-2`에서 예시 PNG에 맞춘 독립형 교실 대시보드, 기본 `학생 관찰 기록` 활동판, 모둠 추가, 차시별 활동 기록 표, 참여/매우 잘함 클릭 표시 지원',
    '- observation board 2 internal dashboards: 왼쪽 메뉴가 URL 이동 없이 `학생 관찰 기록`, `성장 기록`, `통계 보기` 화면만 전환하며, `홈`, `알림장`, `설정` 항목은 현재 사이드바에서 숨김',
    '- observation board 2 responsive sidebar: 1120px 이하에서도 PNG 기준의 왼쪽 세로 사이드바를 유지하고 상단 가로 메뉴로 접지 않음',
    '- observation board 2 data scope: 멘토·멘티, 관찰 작성, 성장 기록, 통계는 현재 교사의 담당 학급 학생만 표시하고 담당 학생이 없을 때 샘플 학생으로 대체하지 않음',
    '- observation board 2 growth/stats usefulness: 성장 기록은 학생별 관찰 공백/쿠키 수/△·○ 반응을 보여주고, 통계 보기는 기록 우선 학생과 모둠별 활동 균형을 함께 표시',
    '- observation board 2 growth modal: `성장 기록 작성`은 기준 이미지형 dimmed overlay, 선택 학생 동물 칩, 중립 쿠키 카드 3개, 선택 메모, `이전`/`저장하기` 버튼을 제공',
    '- observation board 2 stats class scope: 통계 보기는 compact 학급 선택 메뉴를 제공하고 담당 학급 하나를 기본 범위로 사용해 모둠별 활동 균형을 학급별로 확인함',
    '- observation board 2 editable sessions: 차시 표 헤더에서 날짜/활동 내용을 직접 입력하고 `+` 버튼으로 차시 열을 추가하며, 교사별 localStorage에 유지',
    '- observation board 2 AI input link: 차시별 학생 △/○ 클릭 기록은 `observation-board-2-marks:${teacherKey}`에, 멘토·멘티 배치는 `observation-board-2-mentor-assignments:${teacherKey}`에 유지되고 `/write` 세특 생성 시 해석 요약으로 전달됨',
    '- observation board 2 cookie automation: 차시별 활동 칸은 빈칸 0개, △ 참여함 1개, ○ 매우 잘함 2개 기준으로 쿠키 원장에 자동 반영되며, 상태 수정 시 차액만 기록함',
    '- observation board 2 records mode: 기존 관찰 기록 기능은 사이드바에서 숨긴 내부 `records` 모드로 유지하고, 통계 보기 빠른 이동에서 학급/검색 필터, 학생 다중 선택, 공통 날짜/주제/태그, 학생별 메모 입력, 최근 기록 목록, 상세 보기, 삭제 지원',
    '- observation board 2 drag matching/font: Maplestory TTF 적용, 학생 토큰/학생 목록 드래그로 멘토·멘티 조와 역할 재배치 지원',
    '- observation board 2 mentor scope/display: 기본 멘토 화면은 가로로 긴 학급 칩 대신 compact 단일 학급 선택 메뉴를 사용하고, 전체 담당 학급 합산 대신 선택 학급 학생만 멘토·멘티 조와 학생 목록에 표시함',
    '- observation board 2 sidebar icons: 사이드바 메뉴 아이콘을 잘림/흰 배경이 있는 PNG 조각 대신 HTML/CSS 렌더링 아이콘으로 표시',
    '- observation board 2 header icons: 헤더 액션 아이콘을 잘림/글자 조각이 섞인 PNG 대신 lucide SVG 아이콘으로 표시',
    '- observation compose layout: 상단 공통 날짜/수업 주제/공통 태그 + 학생별 개별 태그/관찰 메모 row editor',
    '- lexical retrieval: implemented',
    '- AI reranking: implemented',
    '- bundled knowledge snapshot for deployed runtime: implemented',
    '',
    '## Recent Changes',
    '',
    '- 2026-04-27: added Supabase-backed runtime storage, workspace/observation-board state sync, signed server sessions, and a Google Sheets to Supabase migration script',
    '- 2026-04-26: moved the observation-board-2 growth record action dock above the student grid so selected students can be saved without scrolling past the roster',
    '- 2026-04-26: changed observation-board-2 △/○ activity marks from raw prompt entries into interpreted mentor/mentee activity summaries for `/write` and `/api/generate`',
    '- 2026-04-26: connected observation-board-2 mentor/mentee activity marks to automatic cookie ledger deltas using blank=0, △=1, and ○=2',
    '- 2026-04-26: changed observation-board-2 growth student cards to show compact per-student cookie counts from growth records and current activity marks',
    '- 2026-04-26: replaced clipped observation-board-2 header PNG icons with clean lucide SVG icons so header buttons do not show stray lines or overlapping text fragments',
    '- 2026-04-26: removed the observation-board-2 growth summary hero section and lifted the eight-card cap so all filtered 담당 학생 cards render',
    '- 2026-04-26: matched the observation-board-2 `성장 기록 작성` modal to the provided reference UI, including centered dialog sizing, selected-student animal chips, neutral cookie cards, optional memo, and footer actions',
    '- 2026-04-26: removed the old top-level `학생 관찰 기록` card-board tab, renamed the classroom dashboard tab to `학생 관찰 기록`, and redirected `/observation-board` and `/observations` to `/observation-board-2`',
    '- 2026-04-26: restyled the `/write` AI 세특 작성 tab to match the provided screenshot, including the wider app shell, class chip toolbar, paginated table, and prompt-style AI input/content cells',
    '- 2026-04-26: removed the top-level `학생 데이터` tab and `/student-data` page, and stopped write/growth flows from loading student-data tab entries',
    '- 2026-04-26: removed the observation-board-2 sidebar home item and added a screenshot-guided `성장 기록 작성` modal to the `성장 기록` tab',
    '- 2026-04-26: hid the observation-board-2 sidebar `알림장` and `설정` items so the visible left rail is limited to `학생 관찰 기록`, `성장 기록`, and `통계 보기`',
    '- 2026-04-26: changed the observation-board-2 mentor class scope from a horizontal all-class chip rail to a compact single-class selector',
    '- 2026-04-26: added a compact class selector to observation-board-2 stats so group activity balance can be viewed by class instead of as one long all-class list',
    '- 2026-04-26: fixed observation-board-2 mentor display expansion beyond six students, moved class scope buttons into the mentor panel, defaulted the mentor roster to all scoped students, and replaced sidebar menu raster icons with unclipped rendered icons',
    '- 2026-04-26: fixed deployed Google Sheets private-key parsing for roster loading and made read-only Sheets APIs avoid unnecessary sheet initialization before reads',
    '- 2026-04-26: restored Vercel production environment variables for Google Sheets/OpenAI from the local runtime config, redeployed production, and verified the 성호중학교 roster API returns 847 students',
    '- 2026-04-25: made 성호중학교 roster loading errors visible, normalized school matching for shared rosters, and prevented authenticated pages from redirecting before local session hydration',
    '- 2026-04-25: restricted login to 성호중학교 teacher-name/password credentials and redirected successful login to class registration',
    '- 2026-04-25: imported the 2026 성호중학교 1/2/3학년 명렬표 into the shared roster store for no-upload class registration',
    `- 2026-04-25: refreshed the 2026 STAR snapshot with cache refresh; Q&A now has ${stats.qnaLastPage} pages, ${stats.qnaListed.toLocaleString('en-US')} listed posts, and ${stats.knowledgeUnits.toLocaleString('en-US')} knowledge units`,
    '- 2026-04-25: added conservative similar-question grouping for spacing, `(재상담)`, and generic inquiry suffix variants',
    '- 2026-04-25: changed conflict resolution to default to the latest public answer, with FAQ priority only when explicitly requested',
    '- 2026-04-25: aligned representative citations so `sources[0]`, `sourceUrls[0]`, and `source_documents.primary` point to the selected answer source',
    '- 2026-04-25: added admin recrawl, reindex, crawl-status, and quality-report APIs',
    '- 2026-04-25: added production token guard for `/api/admin/*` routes',
    '- 2026-04-25: kept `평가 점검` visible as `평가 점검 (개발중)` but blocked tab navigation and direct `/eval-check` access',
    '- 2026-04-25: added student-data/cookie APIs, teacher-scoped AI context injection, and safer competency color highlighting',
    '- 2026-04-25: added the classroom observation dashboard next to the original observation tab with a mentor/mentee activity-board design based on the provided dashboard example',
    '- 2026-04-25: rebuilt the classroom observation dashboard around the PNG-like default mentor/mentee screen, internal-only sidebar dashboards, localStorage notice board, growth timeline, stats view, and hidden observation compose mode',
    '- 2026-04-25: applied Maplestory fonts to the classroom observation dashboard, fixed cropped/wrapped dashboard areas, and added drag/drop mentor-mentee matching',
    '- 2026-04-25: restored the PNG-style `학생 관찰 기록` sidebar/header chrome, added group creation, restricted displays to assigned class students, and made growth/stats show actionable student and group signals',
    '- 2026-04-25: made observation-board-2 session headers editable for date/activity content and connected the `+` header button to add persisted session columns',
    '- 2026-04-25: kept the observation-board-2 sidebar as a left vertical rail at narrower desktop widths instead of collapsing it into a top strip',
    '- 2026-04-25: redesigned `학생 관찰 기록` into a dense classroom board with batch observation entry and common-context manual compose',
    '- 2026-03-25: changed student roster upload to sync through shared school storage and merge overlapping uploads by roster key',
    '- 2026-03-25: renamed the counsel/review workspace label to `생기부 상담 점검` and removed the hero stat cards from the page header',
    '- 2026-03-25: made knowledge loading prefer `web/output/star-moe-knowledge-2026.json` and bundle that snapshot during sync so deployed routes stop looking for `/var/student-record-knowledge/...`',
    '- 2026-03-25: merged counsel chat and record review into one `/counsel-chat` workspace and removed the search inspector from the user sidebar',
    '- 2026-03-25: fixed OpenAI JSON mode validation failures in `record-review` and AI reranking by adding explicit `JSON` instructions to the request input context',
    '- 2026-03-25: kept the OCR route implemented but hid the `학습지 OCR` tab from the top navigation',
    '',
    '## Next',
    '',
    '- smoke test the admin APIs behind the deployed runtime configuration',
    '- improve retrieval ranking for difficult query classes',
    '- replace lexical-first retrieval with vector or hosted file search',
    '- automate more of the doc mirror workflow if needed',
    '',
  ].join('\n');

  await writeFile(targetPath, body, 'utf8');
}

await syncDocs();
await syncOutput();
await syncStatus();
console.log('Knowledge docs and bundled dataset synced into web/docs/student-record-knowledge and web/output');
