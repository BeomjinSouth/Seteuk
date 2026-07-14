# 기재 유의어 참고 규칙 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 자료 기반 기재 유의어를 금지어 검사에서 대체표현과 함께 안내한다.

**Architecture:** `src/lib/forbidden-words.ts`에 자료 기반 규칙과 순수 탐색 함수를 둔다. `/api/forbidden`은 이 함수의 결과를 기존 검사 결과에 합쳐 반환하고, 영문 일반 검사에서는 이미 안내한 용어를 제외한다.

**Tech Stack:** TypeScript, Next.js route handler, Node test runner

## Global Constraints

- API 응답 형식은 `word`, `reason`, `suggestion`을 유지한다.
- 자료 기반 결과의 사유는 `상호명·영문 기재 유의어`로 고정한다.
- 기존 기본 금지어와 관리자 추가 금지어 처리는 변경하지 않는다.

---

### Task 1: 자료 기반 규칙과 탐색 함수

**Files:**
- Modify: `src/lib/forbidden-words.ts`
- Test: `tests/forbidden-term-rules.test.mjs`

**Interfaces:**
- Produces: `findReferenceForbiddenTermIssues(text: string): ForbiddenTermIssue[]`

- [ ] **Step 1: Write the failing test**

`tests/forbidden-term-rules.test.mjs`에서 `유튜브`, `Zoom`, `TED`, `ESG`, `UN` 입력이 각각의 일반화한 대체표현을 반환한다고 검증한다.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/forbidden-term-rules.test.mjs`

Expected: FAIL because `findReferenceForbiddenTermIssues` is not exported.

- [ ] **Step 3: Write minimal implementation**

`src/lib/forbidden-words.ts`에 자료 기반 규칙 배열과 문자열 포함 여부를 검사하는 순수 함수를 추가한다.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/forbidden-term-rules.test.mjs`

Expected: PASS with two passing tests.

### Task 2: API 결합과 문서화

**Files:**
- Modify: `src/app/api/forbidden/route.ts`
- Modify: `docs/student-record-knowledge/PRD.md`
- Modify: `docs/student-record-knowledge/IMPLEMENTATION.md`
- Modify: `docs/student-record-knowledge/STATUS.md`

**Interfaces:**
- Consumes: `findReferenceForbiddenTermIssues(text: string)`
- Produces: existing forbidden-check response with reference issues included once.

- [ ] **Step 1: Merge reference issues**

Import `findReferenceForbiddenTermIssues`, append its return value before deduplication, and filter reference terms from generic English detection.

- [ ] **Step 2: Document behavior**

Describe the hardcoded reference list, replacement guidance, and fixed response contract in the project documentation and status log.

- [ ] **Step 3: Verify**

Run: `node --test tests/forbidden-term-rules.test.mjs && npx tsc --noEmit`

Expected: both commands exit with code 0.
