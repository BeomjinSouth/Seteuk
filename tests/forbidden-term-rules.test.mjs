import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import ts from 'typescript';

const sourceUrl = new URL('../src/lib/forbidden-words.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
    },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { findReferenceForbiddenTermIssues } = await import(moduleUrl);

test('상호명과 영문 기재 유의어는 권장 대체표현으로 안내한다', () => {
    assert.deepEqual(
        findReferenceForbiddenTermIssues('유튜브와 Zoom에서 TED 영상을 시청함'),
        [
            { word: '유튜브', reason: '상호명·영문 기재 유의어', suggestion: '동영상 플랫폼 또는 동영상 공유 서비스' },
            { word: 'Zoom', reason: '상호명·영문 기재 유의어', suggestion: '화상 회의' },
            { word: 'TED', reason: '상호명·영문 기재 유의어', suggestion: '온라인 강연회 영상' },
        ],
    );
});

test('약어와 국제기구 영문 표기는 지정된 일반 표현으로 안내한다', () => {
    assert.deepEqual(
        findReferenceForbiddenTermIssues('ESG와 UN의 역할을 조사함'),
        [
            { word: 'ESG', reason: '상호명·영문 기재 유의어', suggestion: '지속가능 경영' },
            { word: 'UN', reason: '상호명·영문 기재 유의어', suggestion: '국제기구' },
        ],
    );
});
