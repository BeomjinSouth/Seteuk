export type SeteukExpressionVariationInput = {
    studentName?: string;
    studentId?: string;
    subjectName?: string;
    classId?: string;
};

export type SeteukExpressionVariationProfile = {
    id: string;
    focus: string;
    sentenceStart: string;
    verbHints: string[];
};

const EXPRESSION_VARIATION_PROFILES: SeteukExpressionVariationProfile[] = [
    {
        id: 'activity-context-first',
        focus: '활동 맥락을 먼저 제시하되 같은 표현으로 반복하지 않기',
        sentenceStart: '단원명, 자료명, 활동 대상을 첫머리에 둘 수 있음',
        verbHints: ['확인함', '기록함', '정리함', '살펴봄'],
    },
    {
        id: 'observable-action-first',
        focus: '학생의 관찰 행동을 먼저 제시하기',
        sentenceStart: '읽음, 찾음, 작성함, 질문함 등 실제 행동을 첫머리에 둘 수 있음',
        verbHints: ['찾아봄', '구분함', '작성함', '질문함'],
    },
    {
        id: 'artifact-first',
        focus: '산출물이나 작성 결과를 먼저 제시하기',
        sentenceStart: '활동지, 초안, 표, 발표 자료 등 입력된 산출물을 첫머리에 둘 수 있음',
        verbHints: ['구성함', '완성함', '제출함', '나타냄'],
    },
    {
        id: 'evidence-basis-first',
        focus: '자료, 근거, 기준을 먼저 제시하기',
        sentenceStart: '자료의 기준, 분류 근거, 관찰 대상을 첫머리에 둘 수 있음',
        verbHints: ['비교함', '분류함', '연결함', '확인함'],
    },
    {
        id: 'process-sequence-first',
        focus: '수행 과정을 순서 있게 보여주기',
        sentenceStart: '활동 전개 과정이나 단계가 입력된 경우 그 흐름을 첫머리에 둘 수 있음',
        verbHints: ['살펴봄', '이어감', '정리함', '검토함'],
    },
    {
        id: 'communication-first',
        focus: '발표, 질문, 설명, 경청 장면이 있으면 의사소통 행동을 먼저 제시하기',
        sentenceStart: '질문, 설명, 발표, 친구 의견 경청 등 입력된 발화 장면을 첫머리에 둘 수 있음',
        verbHints: ['질문함', '설명함', '응답함', '들음'],
    },
    {
        id: 'comparison-first',
        focus: '비교, 차이, 원인, 기준이 있으면 그것을 중심으로 제시하기',
        sentenceStart: '비교 기준이나 원인 분류가 입력된 경우 그 내용을 첫머리에 둘 수 있음',
        verbHints: ['견줌', '나눔', '분석함', '정리함'],
    },
    {
        id: 'concise-observation-first',
        focus: '짧은 입력에서는 관찰 가능한 사실만 짧게 제시하기',
        sentenceStart: '활동명보다 확인된 행동을 간결하게 첫머리에 둘 수 있음',
        verbHints: ['참여함', '확인함', '기록함', '제출함'],
    },
];

function hashText(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index) + (index * 31);
        hash = Math.imul(hash, 16777619);
        hash ^= hash >>> 13;
    }
    return hash >>> 0;
}

export function resolveSeteukExpressionVariation(
    input: SeteukExpressionVariationInput,
): SeteukExpressionVariationProfile {
    const seed = [
        input.studentId?.trim(),
        input.studentName?.trim(),
        input.classId?.trim(),
        input.subjectName?.trim(),
    ].filter(Boolean).join('|') || 'default';
    const profile = EXPRESSION_VARIATION_PROFILES[hashText(seed) % EXPRESSION_VARIATION_PROFILES.length];
    return {
        ...profile,
        verbHints: [...profile.verbHints],
    };
}

export function formatSeteukExpressionVariationForPrompt(
    profile: SeteukExpressionVariationProfile,
): string {
    return `[표현 다양화 참고]
- 이번 학생 표현 프로필: ${profile.id}
- 문장 초점: ${profile.focus}
- 시작 방식: ${profile.sentenceStart}
- 동사 후보: ${profile.verbHints.join(', ')}
// 같은 학급 여러 학생의 세특이 같은 첫머리, 같은 동사, 같은 연결 구조로 반복되지 않도록 참고하세요.
// 단, 입력에 없는 사실이나 행동은 추가하지 마세요. 후보 표현은 입력 근거와 맞을 때만 사용하세요.`;
}
