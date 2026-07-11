import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const route = readFileSync('src/app/api/generate/route.ts', 'utf8');
const prompt = readFileSync('src/lib/prompts/seteuk.ts', 'utf8');

assert.match(route, /formatSeteukExpressionVariationForPrompt/);
assert.match(route, /resolveSeteukExpressionVariation/);
assert.match(route, /expressionVariationPrompt/);
assert.match(route, /studentId/);
assert.match(prompt, /여러 학생/);
assert.match(prompt, /같은 첫머리/);
assert.match(prompt, /다양화보다 사실성과 근거/);
assert.match(prompt, /이를 바탕으로/);
assert.match(prompt, /같은 연결어/);

console.log('Seteuk route variation hook checks passed.');
