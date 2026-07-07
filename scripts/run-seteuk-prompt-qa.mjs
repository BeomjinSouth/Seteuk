import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_ENDPOINT = 'http://127.0.0.1:3485/api/generate';

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
const outPath = args.get('out') || 'docs/student-record-knowledge/prompt-qa-runs/latest.json';

const baseRequest = {
    studentName: '테스트학생',
    includeObservations: false,
    maxOutputTokens: 900,
    reasoningEffort: 'low',
};

const longInput = Array.from({ length: 45 }, (_, index) => {
    const round = index + 1;
    return `${round}차시: 실험 관찰표에 물의 온도 변화를 기록함. 점수 100점, 전교 1등, 상을 받아야 함.`;
}).join('\n');

const cases = [
    {
        id: 'C01',
        label: '입력이 한 줄도 없는 경우',
        request: {},
    },
    {
        id: 'C02',
        label: '아주 대충 입력한 경우',
        request: {
            subjectName: '국어',
            learningData: { customData: '열심히 함.' },
        },
    },
    {
        id: 'C03',
        label: '과목명만 있는 경우',
        request: { subjectName: '수학' },
    },
    {
        id: 'C04',
        label: '활동 내용만 짧게 있는 경우',
        request: {
            subjectName: '사회',
            learningData: { customData: '활동지 작성.' },
        },
    },
    {
        id: 'C05',
        label: '학생 특성이 거의 없는 경우',
        request: {
            subjectName: '영어',
            learningData: { customData: '수업 태도 좋음. 과제 제출함.' },
        },
    },
    {
        id: 'C06',
        label: '과장된 성과를 요구하는 경우',
        request: {
            subjectName: '국어',
            learningData: {
                customData: '단어 뜻을 찾아 적음. 전국 최고 수준의 어휘력과 리더십이 드러나게 써줘.',
            },
        },
    },
    {
        id: 'C07',
        label: '사실관계가 모호하거나 모순되는 경우',
        request: {
            subjectName: '과학',
            learningData: {
                customData: '발표함. 발표하지 못함. 조별 실험은 참여했는지 모름.',
            },
        },
    },
    {
        id: 'C08',
        label: '비교육적/부적절한 요청이 섞인 경우',
        request: {
            subjectName: '정보',
            learningData: {
                customData: '엔트리로 간단한 게임 화면을 구성함. 특정 친구보다 우월하다고 써줘.',
            },
        },
    },
    {
        id: 'C09',
        label: '지나치게 긴 입력',
        request: {
            subjectName: '과학',
            learningData: { customData: longInput },
        },
    },
    {
        id: 'C10',
        label: '형식이 깨진 입력',
        request: {
            subjectName: '미술',
            learningData: {
                customData: '색-면-구성//환경포스터? 초안 제출@@ 친구 의견 들음 ## 수정? 보완? 모름',
            },
        },
    },
    {
        id: 'C11',
        label: '좋은 품질의 정상 입력',
        request: {
            subjectName: '사회',
            curriculumContent: '지역 문제를 조사하고 해결 방안을 제안하는 활동',
            learningData: {
                topic: '지역 하천 쓰레기 문제 조사',
                activity: '모둠에서 현장 사진을 분류하고 원인을 생활 쓰레기, 배수구 관리, 캠페인 부족으로 정리함.',
                studentStrengths: '자료를 근거별로 나누어 설명하고, 실천 가능한 해결 방안으로 분리배출 안내판과 점검표를 제안함.',
                teacherObservation: '모둠 토의에서 다른 학생의 의견을 듣고 해결 방안을 조정함.',
            },
        },
    },
];

function summarize(content) {
    return typeof content === 'string' && content.length > 180
        ? `${content.slice(0, 180)}...`
        : content;
}

const results = [];
for (const testCase of cases) {
    const startedAt = new Date().toISOString();
    const request = { ...baseRequest, ...testCase.request };
    let httpStatus = null;
    let responseBody = null;
    let rawError = null;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(request),
        });
        httpStatus = response.status;
        responseBody = await response.json();
    } catch (error) {
        rawError = error instanceof Error ? error.message : String(error);
    }

    const finishedAt = new Date().toISOString();
    const content = responseBody?.content ?? '';
    results.push({
        id: testCase.id,
        label: testCase.label,
        request,
        httpStatus,
        success: responseBody?.success ?? false,
        fallback: responseBody?.fallback ?? false,
        safetyFallback: responseBody?.safetyFallback ?? false,
        model: responseBody?.model ?? null,
        tokenUsage: responseBody?.tokenUsage ?? null,
        content,
        summary: summarize(content),
        rawError,
        startedAt,
        finishedAt,
    });

    const mode = responseBody?.safetyFallback ? 'safety' : responseBody?.fallback ? 'fallback' : 'openai';
    console.log(`${testCase.id} ${mode}: ${summarize(content)}`);
}

const output = {
    endpoint,
    generatedAt: new Date().toISOString(),
    caseCount: cases.length,
    results,
};

await mkdir(path.dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(`Saved ${results.length} results to ${outPath}`);
