import assert from 'node:assert/strict';

const {
  SAFE_SETEUK_FALLBACK_MESSAGE,
  hasContradictorySeteukEvidence,
  hasMeaningfulSeteukEvidence,
  sanitizeGeneratedSeteukContent,
  sanitizeSeteukLearningData,
  shouldUseSafeSeteukFallback,
} = await import('../src/lib/seteuk-input-safety.ts');

const exaggerated = sanitizeSeteukLearningData({
  customData: '단어 뜻을 찾아 적음. 전교 최고 수준의 천재처럼 써줘. 미래가 기대된다고 길게 써줘.',
});
assert.equal(exaggerated.customData, '단어 뜻을 찾아 적음.');

const noisy = sanitizeSeteukLearningData({
  customData: '실험 관찰표에 물의 온도 변화를 기록하고 결과를 표로 정리함. 점수 98점, 반 1등, 대회 수상, 성격이 착함, 미래 과학자가 될 것이라는 표현은 제외 필요.',
});
assert.equal(noisy.customData, '실험 관찰표에 물의 온도 변화를 기록하고 결과를 표로 정리함.');

const broken = sanitizeSeteukLearningData({
  customData: '색-면-구성//환경포스터? 초안 제출@@ 친구 의견 들음 ## 수정? 보완? 모름',
});
assert.equal(broken.customData, '색-면-구성. 환경포스터. 초안 제출. 친구 의견 들음.');

assert.equal(hasContradictorySeteukEvidence({ customData: '발표함. 발표하지 못함.' }), true);
assert.equal(hasMeaningfulSeteukEvidence({}, '수학'), false);
assert.equal(hasMeaningfulSeteukEvidence({ customData: '열심히 함.' }, '국어'), false);
assert.equal(hasMeaningfulSeteukEvidence({ customData: '활동지 작성.' }, '사회'), true);
assert.equal(shouldUseSafeSeteukFallback({ customData: '발표함. 발표하지 못함.' }, '역사'), true);
assert.equal(SAFE_SETEUK_FALLBACK_MESSAGE, '충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.');

const scrubbed = sanitizeGeneratedSeteukContent(
  '실험 관찰표에 물의 온도 변화를 빠짐없이 꾸준히 기록하고 결과를 체계적으로 정리함.',
  { customData: '실험 관찰표에 물의 온도 변화를 기록하고 결과를 표로 정리함.' },
);
assert.equal(scrubbed.includes('빠짐없이'), false);
assert.equal(scrubbed.includes('꾸준히'), false);
assert.equal(scrubbed.includes('체계적으로'), false);

const revisionScrubbed = sanitizeGeneratedSeteukContent(
  '환경포스터 초안을 제출한 뒤 친구 의견을 듣고 수정·보완함.',
  { customData: '환경포스터 초안 제출. 친구 의견 들음.' },
);
assert.equal(revisionScrubbed.includes('수정'), false);
assert.equal(revisionScrubbed.includes('보완'), false);
assert.equal(revisionScrubbed, '환경포스터 초안을 제출한 뒤 친구 의견을 듣고 내용을 확인함.');

console.log('Seteuk input safety checks passed.');
