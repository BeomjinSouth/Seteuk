import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();
const sourceRoot = path.resolve(repoRoot, '..', 'student-record-knowledge');
const docsSourceDir = path.join(sourceRoot, 'docs');
const outputSourcePath = path.join(sourceRoot, 'output', 'star-moe-knowledge-2026.json');
const targetDir = path.join(repoRoot, 'docs', 'student-record-knowledge');
const mirrorDir = path.join(targetDir, 'mirror');

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

async function syncStatus() {
  const targetPath = path.join(targetDir, 'STATUS.md');
  const outputRaw = await readFile(outputSourcePath, 'utf8');
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
    '- counsel chat page: implemented',
    '- record review page: implemented',
    '- write page integration: implemented',
    '- search inspector page: implemented',
    '- main navigation integration: implemented',
    '- lexical retrieval: implemented',
    '- AI reranking: implemented',
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
await syncStatus();
console.log('Knowledge docs synced into web/docs/student-record-knowledge/mirror');
