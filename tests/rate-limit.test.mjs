import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import ts from 'typescript';

const sourceUrl = new URL('../src/lib/rate-limit.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
    },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { checkRateLimit, resetRateLimits, getClientAddress } = await import(moduleUrl);

test('한도 안에서는 허용하고 한도를 넘으면 차단한다', () => {
    resetRateLimits();
    const base = 1_000_000;

    for (let i = 0; i < 3; i += 1) {
        const result = checkRateLimit({ scope: 's', identity: 'a', limit: 3, windowSeconds: 60, now: base + i });
        assert.equal(result.allowed, true);
    }

    const blocked = checkRateLimit({ scope: 's', identity: 'a', limit: 3, windowSeconds: 60, now: base + 10 });
    assert.equal(blocked.allowed, false);
    assert.ok(blocked.retryAfterSeconds >= 1);
});

test('윈도가 지나면 다시 허용한다', () => {
    resetRateLimits();
    const base = 2_000_000;

    checkRateLimit({ scope: 's', identity: 'a', limit: 1, windowSeconds: 60, now: base });
    const blocked = checkRateLimit({ scope: 's', identity: 'a', limit: 1, windowSeconds: 60, now: base + 1_000 });
    assert.equal(blocked.allowed, false);

    const afterWindow = checkRateLimit({ scope: 's', identity: 'a', limit: 1, windowSeconds: 60, now: base + 61_000 });
    assert.equal(afterWindow.allowed, true);
});

test('scope와 identity가 다르면 버킷이 분리된다', () => {
    resetRateLimits();
    const base = 3_000_000;

    checkRateLimit({ scope: 's', identity: 'a', limit: 1, windowSeconds: 60, now: base });
    const otherIdentity = checkRateLimit({ scope: 's', identity: 'b', limit: 1, windowSeconds: 60, now: base });
    const otherScope = checkRateLimit({ scope: 't', identity: 'a', limit: 1, windowSeconds: 60, now: base });

    assert.equal(otherIdentity.allowed, true);
    assert.equal(otherScope.allowed, true);
});

test('getClientAddress는 프록시 헤더의 첫 주소를 읽는다', () => {
    const makeRequest = (headers) => ({
        headers: { get: (name) => headers[name.toLowerCase()] ?? null },
    });

    assert.equal(
        getClientAddress(makeRequest({ 'x-vercel-forwarded-for': '1.2.3.4' })),
        '1.2.3.4',
    );
    assert.equal(
        getClientAddress(makeRequest({ 'x-forwarded-for': '5.6.7.8, 9.9.9.9' })),
        '5.6.7.8',
    );
    assert.equal(getClientAddress(makeRequest({})), 'unknown');
});
