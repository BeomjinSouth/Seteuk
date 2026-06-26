import assert from 'node:assert/strict';

const {
  formatSeteukExpressionVariationForPrompt,
  resolveSeteukExpressionVariation,
} = await import('../src/lib/seteuk-expression-variation.ts');

const students = Array.from({ length: 12 }, (_, index) => ({
  studentName: `테스트학생${index + 1}`,
  studentId: `student-${index + 1}`,
  subjectName: '사회',
}));

const profiles = students.map(resolveSeteukExpressionVariation);
const profileIds = new Set(profiles.map((profile) => profile.id));
const promptSnippets = new Set(profiles.map(formatSeteukExpressionVariationForPrompt));

assert.ok(profileIds.size >= 5, `expected at least 5 profile ids, got ${profileIds.size}`);
assert.ok(promptSnippets.size >= 5, `expected at least 5 prompt snippets, got ${promptSnippets.size}`);

for (const profile of profiles) {
  assert.equal(typeof profile.id, 'string');
  assert.ok(profile.id.length > 0);
  assert.ok(profile.focus.length > 0);
  assert.ok(profile.sentenceStart.length > 0);
  assert.ok(profile.verbHints.length >= 3);
}

const formatted = formatSeteukExpressionVariationForPrompt(profiles[0]);
assert.match(formatted, /표현 다양화/);
assert.match(formatted, /입력에 없는 사실이나 행동은 추가하지 마세요/);
assert.doesNotMatch(formatted, /테스트학생|student-/);

const first = resolveSeteukExpressionVariation(students[0]);
const second = resolveSeteukExpressionVariation(students[0]);
assert.deepEqual(first, second, 'variation profile should be deterministic for the same student context');

console.log('Seteuk expression variation checks passed.');
