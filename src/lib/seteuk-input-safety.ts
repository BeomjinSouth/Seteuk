export const SAFE_SETEUK_FALLBACK_MESSAGE = '충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.';

const UNSAFE_OR_NON_EVIDENCE_PATTERNS = [
    /써\s*줘/u,
    /넣어\s*줘/u,
    /작성해/u,
    /길게/u,
    /처럼/u,
    /전교/u,
    /최고/u,
    /천재/u,
    /미래/u,
    /기대/u,
    /점수/u,
    /총점/u,
    /원점수/u,
    /평균/u,
    /성취율/u,
    /등급/u,
    /등수/u,
    /석차/u,
    /백분위/u,
    /1등/u,
    /반\s*1등/u,
    /수상/u,
    /상훈/u,
    /대회/u,
    /성격/u,
    /착함/u,
    /인성/u,
];

const MEANINGFUL_ACTION_PATTERNS = [
    /작성/u,
    /제출/u,
    /기록/u,
    /발표/u,
    /질문/u,
    /토의/u,
    /토론/u,
    /읽/u,
    /구분/u,
    /정리/u,
    /만들/u,
    /구성/u,
    /조사/u,
    /비교/u,
    /분석/u,
    /관찰/u,
    /제작/u,
    /설명/u,
    /수정/u,
    /반영/u,
    /찾아\s*적/u,
    /의견을\s*들/u,
];

const GENERIC_ONLY_PATTERNS = [
    /^[\s.。!?]*$/u,
    /^열심히\s*함[.\s。!?]*$/u,
    /^성실함[.\s。!?]*$/u,
    /^좋음[.\s。!?]*$/u,
    /^잘함[.\s。!?]*$/u,
    /^적극적임[.\s。!?]*$/u,
    /^수업\s*태도\s*좋음[.\s。!?]*$/u,
    /^태도\s*양호[.\s。!?]*$/u,
];

const UNSUPPORTED_QUALITY_WORDS = [
    '빠짐없이',
    '체계적으로',
    '꼼꼼히',
    '충실히',
    '보기 쉽게',
    '꾸준히',
    '지속적으로',
    '성실하게',
];

function splitEvidenceSentences(value: string): string[] {
    return value
        .replace(/\/\//g, '.')
        .replace(/[@#]+/g, '.')
        .replace(/(수정|보완|반영|조정)\s*\?/gu, '')
        .replace(/[^.\n\r;。!?]*?(모름|불명|불확실|확실하지\s*않|미정)[^.\n\r;。!?]*/gu, '')
        .split(/[\n\r.;。!?]+/u)
        .map((item) => item.replace(/\s+/g, ' ').trim())
        .filter(Boolean);
}

function isUnsafeOrNonEvidenceSentence(sentence: string): boolean {
    return UNSAFE_OR_NON_EVIDENCE_PATTERNS.some((pattern) => pattern.test(sentence));
}

function normalizeEvidenceSentence(sentence: string): string {
    return sentence
        .replace(/^[#@*\-\s/]+/u, '')
        .replace(/\s+/g, ' ')
        .trim();
}

export function sanitizeSeteukLearningData(
    learningData?: Record<string, string>,
): Record<string, string> {
    if (!learningData) return {};

    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(learningData)) {
        if (!value?.trim()) continue;

        const safeSentences = splitEvidenceSentences(value)
            .map(normalizeEvidenceSentence)
            .filter(Boolean)
            .filter((sentence) => !isUnsafeOrNonEvidenceSentence(sentence));

        if (safeSentences.length > 0) {
            sanitized[key] = `${safeSentences.join('. ')}.`;
        }
    }

    return sanitized;
}

export function hasContradictorySeteukEvidence(
    learningData?: Record<string, string>,
): boolean {
    const text = Object.values(learningData || {}).join(' ');
    if (!text.trim()) return false;

    const hasPresentationDone = /발표\s*(함|에\s*참여|를\s*함|함)/u.test(text);
    const hasPresentationNotDone = /발표\s*(하지\s*못|못함|안\s*함|하지\s*않)/u.test(text);

    return hasPresentationDone && hasPresentationNotDone;
}

export function hasMeaningfulSeteukEvidence(
    learningData?: Record<string, string>,
    subjectName?: string,
): boolean {
    const sanitized = sanitizeSeteukLearningData(learningData);
    const text = Object.values(sanitized).join(' ').trim();

    if (!text) return false;
    if (subjectName?.trim() && Object.keys(sanitized).length === 0) return false;
    if (GENERIC_ONLY_PATTERNS.some((pattern) => pattern.test(text))) return false;

    return MEANINGFUL_ACTION_PATTERNS.some((pattern) => pattern.test(text));
}

export function shouldUseSafeSeteukFallback(
    learningData?: Record<string, string>,
    subjectName?: string,
): boolean {
    const sanitized = sanitizeSeteukLearningData(learningData);
    return hasContradictorySeteukEvidence(sanitized)
        || !hasMeaningfulSeteukEvidence(sanitized, subjectName);
}

export function sanitizeGeneratedSeteukContent(
    content: string,
    sourceLearningData?: Record<string, string>,
): string {
    const sourceText = Object.values(sanitizeSeteukLearningData(sourceLearningData)).join(' ');
    let sanitized = content;

    for (const word of UNSUPPORTED_QUALITY_WORDS) {
        if (!sourceText.includes(word)) {
            sanitized = sanitized.replaceAll(word, '');
        }
    }

    if (!/과제\s*(수행|제출|완료)/u.test(sourceText)) {
        sanitized = sanitized
            .replace(/수업\s*흐름에\s*맞추어\s*과제를?\s*수행함[.]?/gu, '')
            .replace(/과제를?\s*수행함[.]?/gu, '');
    }

    if (!/(수정|보완|반영|조정)\s*(함|하였|했|하여|하고|하며|한\s*뒤|한\s*후)/u.test(sourceText)) {
        sanitized = sanitized
            .replace(/수정\s*[·ㆍ및과,\s]+\s*보완함/gu, '내용을 확인함')
            .replace(/수정하고\s*보완함/gu, '내용을 확인함')
            .replace(/수정함/gu, '확인함')
            .replace(/보완함/gu, '확인함')
            .replace(/반영함/gu, '확인함')
            .replace(/조정함/gu, '확인함');
    }

    sanitized = sanitized.replace(/수업\s*태도에\s*맞게\s*/gu, '');
    sanitized = sanitized
        .replace(/[0-9０-９]+\s*차시\s*부터\s*[0-9０-９]+\s*차시\s*까지\s*/gu, '')
        .replace(/[0-9０-９]+\s*차시\s*(동안|에\s*걸쳐|까지)?\s*/gu, '')
        .replace(/각\s*차시마다\s*/gu, '');
    sanitized = sanitized.replace(/이를\s*바탕으로\s*/gu, '');

    if (!/지역\s*문제의\s*원인/u.test(sourceText)) {
        sanitized = sanitized.replace(
            /(?:^|[.]\s*)지역\s*문제의\s*원인(?:과|을)[^.。]*(?:정리|살펴|참여)함[.]?/gu,
            '',
        );
    }

    return sanitized
        .replace(/\s{2,}/gu, ' ')
        .replace(/\s+([,.])/gu, '$1')
        .replace(/,\s*\./gu, '.')
        .replace(/。\s*/gu, '. ')
        .trim();
}
