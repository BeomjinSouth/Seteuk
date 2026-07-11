import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const {
  resolveSeteukExpressionVariation,
} = await import('../src/lib/seteuk-expression-variation.ts');

const DEFAULT_ENDPOINT = 'http://127.0.0.1:3487/api/generate';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (!arg.startsWith('--')) continue;
  const key = arg.slice(2);
  const value = process.argv[i + 1]?.startsWith('--') ? undefined : process.argv[i + 1];
  args.set(key, value ?? 'true');
  if (value !== undefined) i += 1;
}

const endpoint = args.get('endpoint') || DEFAULT_ENDPOINT;
const outPath = args.get('out') || 'docs/student-record-knowledge/prompt-qa-runs/batch-variation-latest.json';

const curriculumContent = '지역 문제를 조사하고 원인을 분류한 뒤 해결 방안을 제안하는 활동';

const cases = [
  ['batch-01', '테스트학생01', '하천 쓰레기 문제를 조사하며 현장 사진을 생활 쓰레기, 배수구 주변 쓰레기, 캠페인 부족으로 나누어 정리함. 해결 방안으로 분리배출 안내판 설치를 제안함.'],
  ['batch-02', '테스트학생02', '통학로 안전 문제를 조사하며 위험 지점을 지도에 표시하고 원인을 차량 통행, 횡단보도 위치, 시야 확보 문제로 구분함. 해결 방안으로 안내 표지와 등굣길 캠페인을 제안함.'],
  ['batch-03', '테스트학생03', '학교 주변 소음 문제를 조사하며 시간대별 소음 발생 장소를 표로 정리하고 원인을 공사, 차량, 운동장 사용으로 나눔. 해결 방안으로 시간 조정 안내와 주의 표지를 제안함.'],
  ['batch-04', '테스트학생04', '급식 잔반 문제를 조사하며 잔반이 많이 남는 메뉴와 배식 과정을 구분해 기록함. 원인을 선호도 차이, 배식량, 안내 부족으로 정리하고 선택 배식 안내를 제안함.'],
  ['batch-05', '테스트학생05', '마을버스 배차 문제를 조사하며 등하교 시간 대기 사례를 모아 표로 정리함. 원인을 배차 간격, 정류장 혼잡, 환승 시간으로 나누고 시간표 안내 개선을 제안함.'],
  ['batch-06', '테스트학생06', '분리수거 실천 문제를 조사하며 교실과 복도 쓰레기통 사용 모습을 관찰해 잘못 분류된 사례를 정리함. 해결 방안으로 분류 기준 카드와 점검표를 제안함.'],
  ['batch-07', '테스트학생07', '공원 이용 문제를 조사하며 이용자 불편 사례를 사진 자료로 모아 휴식 공간, 쓰레기, 야간 조명 문제로 구분함. 해결 방안으로 이용 안내판과 청결 캠페인을 제안함.'],
  ['batch-08', '테스트학생08', '골목길 조명 문제를 조사하며 어두운 구간을 지도에 표시하고 보행 불편 사례를 정리함. 원인을 가로등 간격, 건물 그림자, 안내 부족으로 나누고 조명 점검 요청을 제안함.'],
  ['batch-09', '테스트학생09', '자전거 보관 문제를 조사하며 등교 시간 보관대 이용 모습을 관찰하고 혼잡 구간을 기록함. 원인을 보관 공간 부족, 동선 겹침, 안내 부족으로 분류하고 이용 구역 표시를 제안함.'],
  ['batch-10', '테스트학생10', '도서관 이용 문제를 조사하며 대출 시간과 좌석 이용 사례를 모아 불편 내용을 정리함. 원인을 이용 시간, 좌석 배치, 안내 방식으로 나누고 이용 규칙 안내 개선을 제안함.'],
  ['batch-11', '테스트학생11', '비 오는 날 빗물 배수 문제를 조사하며 물이 고이는 장소를 사진으로 기록하고 원인을 배수구 막힘, 경사, 낙엽으로 분류함. 해결 방안으로 배수구 점검표를 제안함.'],
  ['batch-12', '테스트학생12', '학교 앞 불법 주정차 문제를 조사하며 등교 시간 차량 흐름을 관찰하고 위험 장면을 유형별로 정리함. 원인을 정차 공간 부족, 안내 부족, 보행 동선 겹침으로 나누고 안전 안내 캠페인을 제안함.'],
];

function firstSentence(content) {
  return (content || '').split(/[.!?。]/u).map((item) => item.trim()).find(Boolean) || '';
}

function firstWords(content, count = 3) {
  return firstSentence(content).split(/\s+/u).slice(0, count).join(' ');
}

function charNgrams(text, size = 8) {
  const compact = text.replace(/\s+/gu, '');
  const grams = [];
  for (let index = 0; index <= compact.length - size; index += 1) {
    grams.push(compact.slice(index, index + size));
  }
  return grams;
}

function summarizeMetrics(results) {
  const fullContents = results.map((result) => result.content).filter(Boolean);
  const openingFrames = results.map((result) => firstWords(result.content)).filter(Boolean);
  const profileIds = results.map((result) => result.variationProfileId).filter(Boolean);
  const frameCounts = Map.groupBy(openingFrames, (item) => item);
  const profileCounts = Map.groupBy(profileIds, (item) => item);
  const ngramCounts = new Map();

  for (const content of fullContents) {
    for (const gram of new Set(charNgrams(content))) {
      ngramCounts.set(gram, (ngramCounts.get(gram) || 0) + 1);
    }
  }

  const repeatedNgrams = [...ngramCounts.entries()]
    .filter(([, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([phrase, count]) => ({ phrase, count }));

  return {
    total: results.length,
    uniqueContentCount: new Set(fullContents).size,
    uniqueOpeningFrameCount: new Set(openingFrames).size,
    maxOpeningFrameRepeat: Math.max(0, ...[...frameCounts.values()].map((items) => items.length)),
    uniqueVariationProfileCount: new Set(profileIds).size,
    maxVariationProfileRepeat: Math.max(0, ...[...profileCounts.values()].map((items) => items.length)),
    repeatedNgrams,
  };
}

const results = [];
for (const [studentId, studentName, customData] of cases) {
  const variationProfile = resolveSeteukExpressionVariation({ studentId, studentName, subjectName: '사회', classId: 'batch-variation' });
  const request = {
    studentId,
    studentName,
    classId: 'batch-variation',
    subjectName: '사회',
    curriculumContent,
    includeObservations: false,
    maxOutputTokens: 800,
    reasoningEffort: 'low',
    learningData: { customData },
  };

  const startedAt = new Date().toISOString();
  let httpStatus = null;
  let body = null;
  let rawError = null;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(request),
    });
    httpStatus = response.status;
    body = await response.json();
  } catch (error) {
    rawError = error instanceof Error ? error.message : String(error);
  }

  const content = body?.content || '';
  results.push({
    id: studentId,
    studentName,
    variationProfileId: variationProfile.id,
    httpStatus,
    success: body?.success ?? false,
    fallback: body?.fallback ?? false,
    model: body?.model ?? null,
    content,
    firstSentence: firstSentence(content),
    openingFrame: firstWords(content),
    tokenUsage: body?.tokenUsage ?? null,
    rawError,
    startedAt,
    finishedAt: new Date().toISOString(),
  });

  console.log(`${studentId} ${variationProfile.id}: ${firstSentence(content)}`);
}

const output = {
  endpoint,
  generatedAt: new Date().toISOString(),
  caseCount: cases.length,
  metrics: summarizeMetrics(results),
  results,
};

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(output.metrics, null, 2));
console.log(`Saved ${results.length} results to ${outPath}`);
