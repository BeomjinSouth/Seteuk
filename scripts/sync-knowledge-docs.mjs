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
    '- counsel/review workspace page: implemented',
    '- /record-review compatibility redirect: implemented',
    '- write page integration: implemented',
    '- search inspector diagnostics route: implemented but hidden from the sidebar',
    '- main navigation integration: 학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검 -> 학습지 OCR 순서 적용',
    '- student workspace split: 학생 관리는 명부/학급 연결만 담당하고 학생 카드 보드는 /observation-board로 분리',
    '- shared roster sync: 학교 공용 명부를 /api/students + 시트 저장소로 동기화하고 같은 학교 사용자가 함께 사용하며, 중복 업로드는 학적 키 기준으로 병합',
    '- observation board interaction: 카드 클릭 선택 + 더블클릭 관찰 기록 작성 + 같은 학급 다중 선택 일괄 저장 지원',
    '- observation compose layout: 학생별 row editor + 선택형 태그 + 날짜 기본값 오늘',
    '- lexical retrieval: implemented',
    '- AI reranking: implemented',
    '- bundled knowledge snapshot for deployed runtime: implemented',
    '',
    '## Recent Changes',
    '',
    '- 2026-03-25: changed student roster upload to sync through shared school storage and merge overlapping uploads by roster key',
    '- 2026-03-25: renamed the counsel/review workspace label to `생기부 상담 점검` and removed the hero stat cards from the page header',
    '- 2026-03-25: made knowledge loading prefer `web/output/star-moe-knowledge-2026.json` and bundle that snapshot during sync so deployed routes stop looking for `/var/student-record-knowledge/...`',
    '- 2026-03-25: merged counsel chat and record review into one `/counsel-chat` workspace and removed the search inspector from the user sidebar',
    '- 2026-03-25: fixed OpenAI JSON mode validation failures in `record-review` and AI reranking by adding explicit `JSON` instructions to the request input context',
    '',
    '## Next',
    '',
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
