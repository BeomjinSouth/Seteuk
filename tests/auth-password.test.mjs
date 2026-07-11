import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import ts from 'typescript';

const sourceUrl = new URL('../src/lib/auth/password.ts', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
    },
});
const moduleUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`;
const { hashPassword, verifyPassword } = await import(moduleUrl);

test('올바른 비밀번호는 검증을 통과하고 틀린 비밀번호는 실패한다', async () => {
    const hash = await hashPassword('correct horse battery');
    assert.equal(await verifyPassword('correct horse battery', hash), true);
    assert.equal(await verifyPassword('wrong password here', hash), false);
});

test('같은 비밀번호라도 매번 다른 해시(랜덤 솔트)가 나온다', async () => {
    const first = await hashPassword('same-password-12');
    const second = await hashPassword('same-password-12');
    assert.notEqual(first, second);
    assert.equal(await verifyPassword('same-password-12', first), true);
    assert.equal(await verifyPassword('same-password-12', second), true);
});

test('형식이 깨졌거나 다른 버전의 해시는 조용히 거부한다', async () => {
    assert.equal(await verifyPassword('anything', 'not-a-hash'), false);
    assert.equal(await verifyPassword('anything', 'scrypt$v2$abc$def'), false);
    assert.equal(await verifyPassword('anything', 'scrypt$v1$$'), false);
    assert.equal(await verifyPassword('anything', 'scrypt$v1$abc$def$extra'), false);
});

test('해시 형식은 scrypt$v1$<salt>$<key> 를 따른다', async () => {
    const hash = await hashPassword('format-check-123');
    const parts = hash.split('$');
    assert.equal(parts.length, 4);
    assert.equal(parts[0], 'scrypt');
    assert.equal(parts[1], 'v1');
    assert.equal(Buffer.from(parts[2], 'base64url').length, 16);
    assert.equal(Buffer.from(parts[3], 'base64url').length, 64);
});
