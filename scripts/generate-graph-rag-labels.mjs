import crypto from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, '').split('=');
    return [key, rest.length > 0 ? rest.join('=') : 'true'];
  }),
);

const year = String(args.get('year') || process.env.KNOWLEDGE_YEAR || '2026');
const vaultLimit = Number(args.get('vault-limit') || 120);
const writeAllVaultNotes = args.get('all-vault') === 'true';
const inputPath = path.resolve(
  repoRoot,
  String(args.get('input') || path.join('output', `star-moe-knowledge-${year}.json`)),
);
const outputRoot = path.resolve(repoRoot, String(args.get('output') || path.join('output', 'graph-rag-labels')));
const vaultRoot = path.join(outputRoot, 'obsidian-vault');

const DOMAIN_RULES = [
  ['domain/창체', ['창의적 체험활동상황', '창체', '자율활동', '동아리', '봉사활동', '진로활동']],
  ['domain/출결', ['출결상황', '출결', '결석', '지각', '조퇴', '개근', '정근', '미인정']],
  ['domain/세특', ['교과학습발달상황', '세부능력', '특기사항', '세특', '성취도', '과목별']],
  ['domain/학적', ['인적·학적사항', '학적', '전입', '전출', '재취학', '편입', '주민등록번호', '성명']],
  ['domain/정정', ['자료의 정정', '정정', '정정대장', '증빙', '오류', '나이스']],
  ['domain/수상', ['수상경력', '수상', '교과우수상', '표창', '상장']],
  ['domain/행특', ['행동특성 및 종합의견', '행특', '행동특성', '종합의견']],
  ['domain/독서', ['독서활동상황', '독서', '도서명', '저자']],
  ['domain/학교폭력', ['학교폭력 조치상황 관리', '학교폭력', '학폭', '조치사항']],
  ['domain/자격증', ['자격증', '국가직무능력표준', 'NCS', '직무능력']],
  ['domain/자유학기', ['자유학기활동상황', '자유학기', '자유학년']],
  ['domain/특수학교', ['일상생활 활동상황', '특수학교']],
];

const POLICY_RULES = [
  ['policy/금지', ['기재할 수 없습니다', '기재 불가', '입력할 수 없습니다', '입력 불가', '미기재', '삭제', '제외', '금지', '불가']],
  ['policy/허용', ['기재할 수 있습니다', '입력할 수 있습니다', '가능합니다', '입력 가능', '기재 가능']],
  ['policy/예외', ['다만', '예외', '한하여']],
  ['policy/증빙필요', ['증빙', '근거자료', '확인서', '공문', '서류', '보관']],
  ['policy/최신기준확인', ['최신', '현행', '개정', '기재요령 적용']],
];

const RISK_RULES = [
  ['risk/개인정보', ['성명', '주민등록번호', '개명', '주소', '개인정보']],
  ['risk/정정', ['정정', '정정대장', '오류', '증빙']],
  ['risk/수상', ['수상', '상장', '교과우수상', '표창']],
  ['risk/출결', ['출결', '결석', '지각', '조퇴', '개근', '정근']],
  ['risk/학교폭력', ['학교폭력', '학폭', '조치사항']],
  ['risk/자격증', ['자격증', 'NCS', '국가직무능력표준']],
  ['risk/근거부족', ['확인 필요', '증빙 부족', '자료 없음', '공개 근거 없음']],
  ['risk/충돌가능', ['재상담', '다른 답변', '차이']],
];

function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactText(value) {
  return normalizeText(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
}

function hashId(value, length = 16) {
  return crypto.createHash('sha1').update(String(value)).digest('hex').slice(0, length);
}

function buildKnowledgeUnitId(entry) {
  return hashId(`${entry.sourceType}:${entry.questionKey}:${entry.title}`, 16);
}

function slug(value, maxLength = 80) {
  const normalized = normalizeText(value)
    .replace(/[\\/:*?"<>|#^[\]]+/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
  return (normalized || 'untitled').slice(0, maxLength);
}

function yamlScalar(value) {
  const escaped = String(value ?? '').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function yamlList(values, indent = '') {
  if (!values || values.length === 0) return `${indent}[]`;
  return values.map((value) => `${indent}- ${yamlScalar(value)}`).join('\n');
}

function truncate(value, maxLength) {
  const text = normalizeText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

function includesAny(text, needles) {
  const normalized = compactText(text);
  return needles.some((needle) => normalized.includes(compactText(needle)));
}

function collectRuleTags(entry, unit, rules) {
  const haystack = [
    entry.title,
    entry.question,
    entry.answer,
    entry.resolution,
    entry.categories?.join(' '),
    unit?.rule_summary,
    unit?.policy_anchors?.map((anchor) => `${anchor.rule} ${anchor.exception || ''}`).join(' '),
  ].join(' ');

  return rules
    .filter(([, keywords]) => includesAny(haystack, keywords))
    .map(([tag]) => tag);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function priorityScore(entry, unit, labels) {
  const anchorCount = unit?.policy_anchors?.length || 0;
  const sourceCount = unit?.source_documents?.length || entry.sources?.length || 0;
  const highRisk = labels.riskTags.length;
  const reviewBonus = entry.variantCount > 1 || entry.duplicateCount > 1 ? 16 : 0;
  const faqBonus = entry.sourceType === 'faq' ? 10 : 0;
  const anchorBonus = Math.min(anchorCount * 4, 32);
  const riskBonus = Math.min(highRisk * 4, 20);
  return anchorBonus + reviewBonus + faqBonus + riskBonus + Math.min(sourceCount * 2, 10);
}

function addNode(nodes, node) {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}

function addEdge(edges, edge) {
  edges.set(edge.id, edge);
}

function sourceDocumentId(source, fallback) {
  if (source?.sourceId) return `source:${source.sourceType || 'star'}:${source.sourceId}`;
  if (source?.url) return `source:url:${hashId(source.url, 12)}`;
  return `source:unknown:${fallback}`;
}

function conceptId(type, value) {
  return `${type}:${hashId(value, 12)}`;
}

function makeLabel(entry, unit) {
  const domainTags = collectRuleTags(entry, unit, DOMAIN_RULES);
  const policyTags = collectRuleTags(entry, unit, POLICY_RULES);
  const riskTags = collectRuleTags(entry, unit, RISK_RULES);
  if (entry.variantCount > 1 || entry.duplicateCount > 1) {
    riskTags.push('risk/충돌가능');
  }

  const workflowTags = [];
  if ((unit?.policy_anchors?.length || 0) >= 5) workflowTags.push('workflow/인용핵심');
  if (entry.variantCount > 1 || entry.duplicateCount > 1) workflowTags.push('workflow/수동검수우선');
  if (entry.sourceType === 'faq') workflowTags.push('workflow/FAQ우선검토');
  if (riskTags.length >= 2) workflowTags.push('workflow/고위험검토');

  const labels = {
    domainTags: unique(domainTags),
    policyTags: unique(policyTags),
    riskTags: unique(riskTags),
    workflowTags: unique(workflowTags),
  };

  const id = `ku:${buildKnowledgeUnitId(entry)}`;
  const sourceUrls = unique([...(entry.sourceUrls || []), ...(entry.sources || []).map((source) => source.url)]);
  const normalizedQuestion = normalizeText(entry.question);
  const aliases = unique([
    entry.title,
    unit?.canonical_title && unit.canonical_title !== entry.title ? unit.canonical_title : null,
    normalizedQuestion && normalizedQuestion !== entry.title && normalizedQuestion.length <= 120 ? normalizedQuestion : null,
  ]).slice(0, 5);
  const graphPriority = priorityScore(entry, unit, labels);

  return {
    id,
    knowledgeUnitId: id.replace(/^ku:/, ''),
    nodeType: 'knowledge_unit',
    title: entry.title,
    aliases,
    sourceBoard: entry.sourceType === 'faq' ? 'faq' : 'qna',
    accessLevel: unit?.access_level || 'public',
    schoolLevels: entry.schoolLevels || [],
    categories: entry.categories || [],
    effectiveYear: unit?.effective_year_from || (entry.effectiveDate ? Number(String(entry.effectiveDate).slice(0, 4)) : null),
    answerConsistencyLabel: unit?.answer_consistency_label || 'unique',
    duplicateCount: entry.duplicateCount || 1,
    variantCount: entry.variantCount || 1,
    sourceUrls,
    sourceDocuments: (unit?.source_documents || []).map((doc) => ({
      id: `source-document:${doc.document_id}`,
      documentId: doc.document_id,
      relationType: doc.relation_type,
      primary: Boolean(doc.primary),
    })),
    policyAnchors: (unit?.policy_anchors || []).map((anchor) => ({
      id: `policy-anchor:${hashId(anchor.rule, 12)}`,
      rule: anchor.rule,
      exception: anchor.exception,
      source: anchor.source,
    })),
    graphLabels: labels,
    graphPriority,
    tags: unique([
      'seteuk/knowledge',
      `source/${entry.sourceType === 'faq' ? 'faq' : 'qna'}`,
      ...labels.domainTags,
      ...labels.policyTags,
      ...labels.riskTags,
      ...labels.workflowTags,
    ]),
    confidence: 'source_public_auto_labeled',
    question: entry.question,
    answerExcerpt: truncate(entry.answer, 900),
    ruleSummary: unit?.rule_summary || null,
    resolution: entry.resolution,
  };
}

function buildGraph(dataset, labelsByEntry) {
  const nodes = new Map();
  const edges = new Map();

  addNode(nodes, {
    id: 'dataset:star-moe-2026',
    nodeType: 'dataset',
    label: 'STAR 학생부 2026 public knowledge',
    count: dataset.canonicalEntries.length,
  });

  for (const { entry, unit, label } of labelsByEntry) {
    addNode(nodes, {
      id: label.id,
      nodeType: 'knowledge_unit',
      label: label.title,
      graphPriority: label.graphPriority,
      accessLevel: label.accessLevel,
    });
    addEdge(edges, {
      id: `dataset:contains:${label.id}`,
      from: 'dataset:star-moe-2026',
      to: label.id,
      relation: 'contains',
      weight: 1,
    });

    for (const category of label.categories) {
      const id = conceptId('category', category);
      addNode(nodes, { id, nodeType: 'category', label: category });
      addEdge(edges, {
        id: `${label.id}:in_category:${id}`,
        from: label.id,
        to: id,
        relation: 'in_category',
        weight: 2,
      });
    }

    for (const schoolLevel of label.schoolLevels) {
      const id = conceptId('school_level', schoolLevel);
      addNode(nodes, { id, nodeType: 'school_level', label: schoolLevel });
      addEdge(edges, {
        id: `${label.id}:applies_to_school_level:${id}`,
        from: label.id,
        to: id,
        relation: 'applies_to_school_level',
        weight: 2,
      });
    }

    const sourceBoardId = `source_board:${label.sourceBoard}`;
    addNode(nodes, { id: sourceBoardId, nodeType: 'source_board', label: label.sourceBoard });
    addEdge(edges, {
      id: `${label.id}:from_source_board:${sourceBoardId}`,
      from: label.id,
      to: sourceBoardId,
      relation: 'from_source_board',
      weight: 1,
    });

    for (const [index, source] of (entry.sources || []).entries()) {
      const sourceId = sourceDocumentId(source, `${label.knowledgeUnitId}:${index}`);
      addNode(nodes, {
        id: sourceId,
        nodeType: 'source_document',
        label: source.title || source.url || sourceId,
        url: source.url || null,
        sourceType: source.sourceType || label.sourceBoard,
      });
      addEdge(edges, {
        id: `${label.id}:evidenced_by:${sourceId}`,
        from: label.id,
        to: sourceId,
        relation: 'evidenced_by',
        weight: index === 0 ? 3 : 1,
        primary: index === 0,
      });
    }

    for (const anchor of label.policyAnchors) {
      addNode(nodes, {
        id: anchor.id,
        nodeType: 'policy_anchor',
        label: truncate(anchor.rule, 120),
      });
      addEdge(edges, {
        id: `${label.id}:has_policy_anchor:${anchor.id}`,
        from: label.id,
        to: anchor.id,
        relation: 'has_policy_anchor',
        weight: 3,
      });
    }

    for (const tag of label.graphLabels.domainTags) addTagNodeAndEdge(nodes, edges, label.id, tag, 'domain_tag', 'has_domain_tag');
    for (const tag of label.graphLabels.policyTags) addTagNodeAndEdge(nodes, edges, label.id, tag, 'policy_tag', 'has_policy_tag');
    for (const tag of label.graphLabels.riskTags) addTagNodeAndEdge(nodes, edges, label.id, tag, 'risk_tag', 'has_risk_tag');
    for (const tag of label.graphLabels.workflowTags) addTagNodeAndEdge(nodes, edges, label.id, tag, 'workflow_tag', 'has_workflow_tag');

    if (entry.variantCount > 1 || entry.duplicateCount > 1) {
      const familyId = `variant-family:${hashId(`${entry.questionKey}:${entry.title}`, 12)}`;
      addNode(nodes, {
        id: familyId,
        nodeType: 'variant_family',
        label: truncate(entry.title, 120),
        duplicateCount: entry.duplicateCount,
        variantCount: entry.variantCount,
      });
      addEdge(edges, {
        id: `${label.id}:same_question_variant:${familyId}`,
        from: label.id,
        to: familyId,
        relation: 'same_question_variant',
        weight: 4,
      });
    }
  }

  return {
    nodes: [...nodes.values()],
    edges: [...edges.values()],
  };
}

function addTagNodeAndEdge(nodes, edges, labelId, tag, nodeType, relation) {
  const id = `${nodeType}:${hashId(tag, 12)}`;
  addNode(nodes, { id, nodeType, label: tag });
  addEdge(edges, {
    id: `${labelId}:${relation}:${id}`,
    from: labelId,
    to: id,
    relation,
    weight: 2,
  });
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'ko'));
}

function frontmatter(label) {
  const relationCategory = label.categories.map((category) => `category:${category}`);
  const relationSchool = label.schoolLevels.map((schoolLevel) => `school_level:${schoolLevel}`);
  const relationSources = label.sourceDocuments.map((source) => source.id);
  const relationAnchors = label.policyAnchors.map((anchor) => anchor.id);
  return [
    '---',
    `id: ${yamlScalar(label.id)}`,
    'node_type: "knowledge_unit"',
    `source_board: ${yamlScalar(label.sourceBoard)}`,
    `access_level: ${yamlScalar(label.accessLevel)}`,
    'school_levels:',
    yamlList(label.schoolLevels, '  '),
    'categories:',
    yamlList(label.categories, '  '),
    `effective_year: ${label.effectiveYear ?? 'null'}`,
    `graph_priority: ${label.graphPriority}`,
    'tags:',
    yamlList(label.tags, '  '),
    'aliases:',
    yamlList(label.aliases, '  '),
    'relations:',
    '  in_category:',
    yamlList(relationCategory, '    '),
    '  applies_to_school_level:',
    yamlList(relationSchool, '    '),
    '  evidenced_by:',
    yamlList(relationSources, '    '),
    '  has_policy_anchor:',
    yamlList(relationAnchors, '    '),
    `confidence: ${yamlScalar(label.confidence)}`,
    '---',
  ].join('\n');
}

function wikiConcept(type, value) {
  return `[[${type} - ${value}]]`;
}

function cleanMarkdown(value) {
  return value.split('\n').map((line) => line.trimEnd()).join('\n');
}

function knowledgeNote(label) {
  return cleanMarkdown([
    frontmatter(label),
    '',
    `# ${label.title}`,
    '',
    label.ruleSummary ? `> ${label.ruleSummary}` : '',
    '',
    '## Graph Labels',
    '',
    `- Categories: ${label.categories.map((item) => wikiConcept('Category', item)).join(', ') || '-'}`,
    `- School levels: ${label.schoolLevels.map((item) => wikiConcept('School Level', item)).join(', ') || '-'}`,
    `- Domain tags: ${label.graphLabels.domainTags.map((item) => wikiConcept('Domain', item)).join(', ') || '-'}`,
    `- Policy tags: ${label.graphLabels.policyTags.map((item) => wikiConcept('Policy', item)).join(', ') || '-'}`,
    `- Risk tags: ${label.graphLabels.riskTags.map((item) => wikiConcept('Risk', item)).join(', ') || '-'}`,
    `- Workflow tags: ${label.graphLabels.workflowTags.map((item) => wikiConcept('Workflow', item)).join(', ') || '-'}`,
    '',
    '## Question',
    '',
    label.question || '-',
    '',
    '## Answer Excerpt',
    '',
    label.answerExcerpt || '-',
    '',
    '## Sources',
    '',
    ...(label.sourceUrls.length > 0 ? label.sourceUrls.map((url) => `- ${url}`) : ['- No public URL recorded']),
    '',
    '## Policy Anchors',
    '',
    ...(label.policyAnchors.length > 0
      ? label.policyAnchors.slice(0, 8).map((anchor) => `- ${anchor.rule}${anchor.exception ? ` / exception: ${anchor.exception}` : ''}`)
      : ['- No policy anchors recorded']),
    '',
  ].filter((line) => line !== '').join('\n'));
}

function conceptNote(title, nodeType, linkedLabels) {
  return cleanMarkdown([
    '---',
    `node_type: ${yamlScalar(nodeType)}`,
    `id: ${yamlScalar(`${nodeType}:${title}`)}`,
    'tags:',
    '  - seteuk/concept',
    `  - graph/${nodeType}`,
    '---',
    '',
    `# ${title}`,
    '',
    `Linked knowledge units: ${linkedLabels.length}`,
    '',
    '## Seed Links',
    '',
    ...linkedLabels.slice(0, 30).map((label) => `- [[${label.noteBaseName}]]`),
    '',
  ].join('\n'));
}

async function writeVault(labels) {
  const sorted = [...labels].sort((a, b) => b.graphPriority - a.graphPriority || a.title.localeCompare(b.title, 'ko'));
  const selected = writeAllVaultNotes ? sorted : sorted.slice(0, Math.max(0, vaultLimit));
  const knowledgeDir = path.join(vaultRoot, 'Knowledge');
  const conceptDir = path.join(vaultRoot, 'Concepts');
  await mkdir(knowledgeDir, { recursive: true });
  await mkdir(conceptDir, { recursive: true });

  for (const [index, label] of selected.entries()) {
    const noteBaseName = `${String(index + 1).padStart(4, '0')} ${slug(label.title, 64)}`;
    label.noteBaseName = noteBaseName;
    label.notePath = path.relative(outputRoot, path.join(knowledgeDir, `${noteBaseName}.md`)).replace(/\\/g, '/');
    await writeFile(path.join(knowledgeDir, `${noteBaseName}.md`), knowledgeNote(label), 'utf8');
  }

  const conceptBuckets = new Map();
  for (const label of selected) {
    const concepts = [
      ...label.categories.map((value) => [`Category - ${value}`, 'category']),
      ...label.schoolLevels.map((value) => [`School Level - ${value}`, 'school_level']),
      ...label.graphLabels.domainTags.map((value) => [`Domain - ${value}`, 'domain_tag']),
      ...label.graphLabels.policyTags.map((value) => [`Policy - ${value}`, 'policy_tag']),
      ...label.graphLabels.riskTags.map((value) => [`Risk - ${value}`, 'risk_tag']),
      ...label.graphLabels.workflowTags.map((value) => [`Workflow - ${value}`, 'workflow_tag']),
    ];
    for (const [title, nodeType] of concepts) {
      const existing = conceptBuckets.get(title) || { title, nodeType, labels: [] };
      existing.labels.push(label);
      conceptBuckets.set(title, existing);
    }
  }

  for (const bucket of [...conceptBuckets.values()].sort((a, b) => a.title.localeCompare(b.title, 'ko'))) {
    await writeFile(
      path.join(conceptDir, `${slug(bucket.title, 90)}.md`),
      conceptNote(bucket.title, bucket.nodeType, bucket.labels),
      'utf8',
    );
  }

  await writeFile(
    path.join(vaultRoot, 'README.md'),
    [
      '# Graph RAG Obsidian Seed Vault',
      '',
      `Generated from \`star-moe-knowledge-${year}.json\`.`,
      '',
      `- Knowledge notes: ${selected.length}`,
      `- Full labeled knowledge units in JSON: ${labels.length}`,
      '- This vault is a review seed. The JSON graph label file remains the complete machine-readable label set.',
      '',
      'Start with high-priority notes in `Knowledge/`, then inspect linked concept notes in `Concepts/`.',
      '',
    ].join('\n'),
    'utf8',
  );

  return selected.length;
}

function statsMarkdown(dataset, labels, graph, vaultCount, labelGeneratedAt) {
  const categoryCounts = countBy(labels.flatMap((label) => label.categories), (item) => item).slice(0, 20);
  const schoolCounts = countBy(labels.flatMap((label) => label.schoolLevels), (item) => item);
  const sourceCounts = countBy(labels, (label) => label.sourceBoard);
  const domainCounts = countBy(labels.flatMap((label) => label.graphLabels.domainTags), (item) => item);
  const policyCounts = countBy(labels.flatMap((label) => label.graphLabels.policyTags), (item) => item);
  const riskCounts = countBy(labels.flatMap((label) => label.graphLabels.riskTags), (item) => item);
  const edgeCounts = countBy(graph.edges, (edge) => edge.relation);
  const highPriority = [...labels].sort((a, b) => b.graphPriority - a.graphPriority).slice(0, 20);

  const table = (rows) => rows.map(([key, value]) => `| ${key} | ${value} |`).join('\n');
  return [
    '# Graph RAG Labeling Stats',
    '',
    `- generatedAt: ${labelGeneratedAt}`,
    `- sourceGeneratedAt: ${dataset.generatedAt}`,
    `- year: ${dataset.year}`,
    `- labeledKnowledgeUnits: ${labels.length}`,
    `- graphNodes: ${graph.nodes.length}`,
    `- graphEdges: ${graph.edges.length}`,
    `- obsidianSeedNotes: ${vaultCount}`,
    '',
    '## Source Boards',
    '',
    '| source | count |',
    '| --- | ---: |',
    table(sourceCounts),
    '',
    '## School Levels',
    '',
    '| school level | count |',
    '| --- | ---: |',
    table(schoolCounts),
    '',
    '## Top Categories',
    '',
    '| category | count |',
    '| --- | ---: |',
    table(categoryCounts),
    '',
    '## Domain Tags',
    '',
    '| tag | count |',
    '| --- | ---: |',
    table(domainCounts),
    '',
    '## Policy Tags',
    '',
    '| tag | count |',
    '| --- | ---: |',
    table(policyCounts),
    '',
    '## Risk Tags',
    '',
    '| tag | count |',
    '| --- | ---: |',
    table(riskCounts),
    '',
    '## Edge Types',
    '',
    '| relation | count |',
    '| --- | ---: |',
    table(edgeCounts),
    '',
    '## Highest Priority Review Seeds',
    '',
    '| priority | title | categories | tags |',
    '| ---: | --- | --- | --- |',
    ...highPriority.map((label) => `| ${label.graphPriority} | ${label.title.replace(/\|/g, '/')} | ${label.categories.join(', ')} | ${label.tags.join(', ')} |`),
    '',
  ].join('\n');
}

async function main() {
  const raw = await readFile(inputPath, 'utf8');
  const dataset = JSON.parse(raw);
  const labelGeneratedAt = String(args.get('generated-at') || dataset.generatedAt);
  const unitMap = new Map(dataset.knowledgeUnits.map((unit) => [unit.knowledge_unit_id, unit]));
  const labelsByEntry = dataset.canonicalEntries.map((entry) => {
    const unit = unitMap.get(buildKnowledgeUnitId(entry));
    return {
      entry,
      unit,
      label: makeLabel(entry, unit),
    };
  });
  const labels = labelsByEntry.map((item) => item.label);
  const graph = buildGraph(dataset, labelsByEntry);

  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  const vaultCount = await writeVault(labels);
  const payload = {
    generatedAt: labelGeneratedAt,
    sourcePath: path.relative(repoRoot, inputPath).replace(/\\/g, '/'),
    year,
    labelSchemaVersion: 'graph-rag-labels-v1',
    stats: dataset.stats,
    labels,
    graph,
  };

  await writeFile(
    path.join(outputRoot, `graph-rag-labels-${year}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    path.join(outputRoot, `graph-rag-labels-${year}.jsonl`),
    `${labels.map((label) => JSON.stringify(label)).join('\n')}\n`,
    'utf8',
  );
  await writeFile(path.join(outputRoot, 'STATS.md'), statsMarkdown(dataset, labels, graph, vaultCount, labelGeneratedAt), 'utf8');

  console.log(JSON.stringify({
    year,
    labels: labels.length,
    graphNodes: graph.nodes.length,
    graphEdges: graph.edges.length,
    obsidianSeedNotes: vaultCount,
    output: path.relative(repoRoot, outputRoot).replace(/\\/g, '/'),
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
