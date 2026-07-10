# Seteuk Project Health Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current growing multi-purpose checkout into a secure, app-only, test-gated Seteuk production repository without losing the post-PR behavior already implemented locally.

**Architecture:** Start from the latest `origin/main` in an isolated worktree, port only the desired post-PR changes, and establish repository/security gates before structural refactoring. Replace shared-name authentication with revocable server-side accounts/sessions, assign an explicit access policy to every API route, then modularize observation/OCR/state code behind characterization tests. Keep Next.js, Supabase, Zustand, OpenAI, and the current user interface.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Supabase Postgres, Zustand 5, OpenAI SDK 6, Vitest 4, Playwright, GitHub Actions, Vercel.

## Global Constraints

- Preserve all current user files in `C:\Users\pbj95\Desktop\Seteuk`; never clean, reset, delete, or stage unrelated modified/untracked files.
- Implement from a new worktree based on the latest `origin/main`; do not continue committing on the already-merged PR branch.
- Never use `git push --force`, history rewriting, or a destructive large-file migration in this plan.
- Product behavior remains unchanged unless a task explicitly changes a security, privacy, failure, or synchronization contract.
- The unfinished eval-check UI remains disabled until owner isolation and tests are complete.
- Keep `cross-curricular-seteuk-v2.7` behavior from `origin/main` and add the observation-evidence minimization semantics from `a5af5bd`; publish the combined prompt as `cross-curricular-seteuk-v2.8`.
- No plaintext password, API key, student workbook, local store, or generated inspection output may be committed.
- Each task must end with its focused tests plus `npm run verify`; do not batch unverified tasks.
- Every behavior-changing task updates PRD, implementation, status, and the applicable operations/security document in the same commit.
- Use Node 22 in local version files and CI.
- Production writes remain Supabase-only. Google Sheets remains read-only fallback/import/migration support.

---

## Target File Map

### Repository and verification

- Create: `.vercelignore`
- Create: `.nvmrc`
- Create: `scripts/check-repo-boundaries.mjs`
- Create: `scripts/check-api-auth-matrix.mjs`
- Create: `scripts/check-output-traces.mjs`
- Create: `.github/workflows/verify.yml`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `next.config.ts`

### Identity, security, and operations

- Create: `supabase/migrations/202607100001_teacher_accounts_and_sessions.sql`
- Create: `supabase/migrations/202607100002_rate_limits_and_function_grants.sql`
- Create: `scripts/provision-teacher-account.mjs`
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/accounts.ts`
- Replace: `src/lib/auth/session.ts`
- Modify: `src/lib/auth/guards.ts`
- Modify: `src/app/api/auth/login/route.ts`
- Modify: `src/app/api/auth/logout/route.ts`
- Modify: `src/app/api/auth/session/route.ts`
- Modify: `src/lib/admin-roles.ts`
- Modify: `src/app/api/admin-users/route.ts`
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/request-context.ts`
- Create: `src/lib/api-feature-flags.ts`
- Create: `docs/security/api-auth-matrix.md`
- Create: `docs/operations/account-provisioning.md`
- Create: `docs/operations/security-response.md`

### Tests

- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Create: `src/lib/auth/password.test.ts`
- Create: `src/lib/auth/session.test.ts`
- Create: `src/lib/rate-limit.test.ts`
- Create: `src/lib/store-migrations.test.ts`
- Create: `tests/routes/api-auth-policy.test.ts`
- Create: `tests/routes/eval-check-access.test.ts`
- Create: `tests/routes/group-survey-privacy.test.ts`
- Create: `tests/routes/resource-ownership.test.ts`
- Create: `tests/e2e/core-flows.spec.ts`
- Create: `tests/fixtures/sample-two-page.pdf`

### Modularization

- Create: `src/features/observation-board/{api,components,hooks,model,storage}/`
- Create: `src/features/ocr/{api,components,model}/`
- Create: `src/features/eval-check/{application,domain,infrastructure}/`
- Modify: `src/app/observation-board-2/page.tsx`
- Modify: `src/app/ocr/page.tsx`
- Modify: `src/app/api/eval-check/**/route.ts`
- Modify: `src/lib/store.ts`
- Modify: `src/components/providers/WorkspaceSupabaseSync.tsx`
- Modify: `src/app/api/workspace-state/route.ts`
- Modify: `src/app/api/observation-board-state/route.ts`

### Documentation

- Modify: `README.md`
- Modify: `docs/student-record-knowledge/PRD.md`
- Modify: `docs/student-record-knowledge/IMPLEMENTATION.md`
- Modify: `docs/student-record-knowledge/STATUS.md`
- Create: `docs/student-record-knowledge/history/STATUS-through-2026-06.md`

---

### Task 1: Create A Clean Stabilization Line And Preserve Desired Post-PR Work

**Files:**
- Create worktree: `C:\Users\pbj95\Desktop\Seteuk-stabilization`
- Modify in later steps: files touched by selected post-PR commits

**Interfaces:**
- Consumes: `origin/main`, local commits `885e2f0..0d2c55a`, and `worktree-refactor-opus-groundwork`
- Produces: branch `codex/project-stabilization-20260710` with a green baseline and no unrelated workspace files

- [ ] **Step 1: Record the source checkout without changing it**

Run:

```powershell
cd C:\Users\pbj95\Desktop\Seteuk
git status --short --branch
git worktree list
git rev-list --left-right --count HEAD...origin/main
git log --reverse --format='%h %s' origin/main..HEAD
```

Expected: current checkout shows two modified files, untracked artifacts, and `14 7` divergence relative to `origin/main`.

- [ ] **Step 2: Create the stabilization worktree from current remote main**

Run:

```powershell
git fetch origin
git worktree add C:\Users\pbj95\Desktop\Seteuk-stabilization -b codex/project-stabilization-20260710 origin/main
cd C:\Users\pbj95\Desktop\Seteuk-stabilization
npm ci
```

Expected: the new worktree is clean and `git rev-list --left-right --count HEAD...origin/main` prints `0 0`.

- [ ] **Step 3: Verify the untouched `origin/main` baseline**

Run:

```powershell
npx tsc --noEmit --pretty false
npm run lint
npm run build
```

Expected: TypeScript and build exit 0. Save all lint/build warnings in the task log; do not fix them in this step.

- [ ] **Step 4: Port non-conflicting desired commits in semantic groups**

Run one group at a time:

```powershell
git cherry-pick -x 885e2f0
git cherry-pick -x a8890f3 0208517 d1a4a2e
git cherry-pick -x c91703e a9a8f5e
git cherry-pick -x 1940e68 3591496
git cherry-pick -x b995322 a579ac6
```

Expected: each group applies or stops at a visible conflict. Do not cherry-pick `e7cb782`, `1b4f60e`, or `0d2c55a`; they are push-status-only commits that will be replaced by one current status entry.

- [ ] **Step 5: Port observation-evidence minimization without prompt regression**

Inspect the source change:

```powershell
git show --stat a5af5bd
git show a5af5bd -- src/lib/observation-board-ai-context.ts src/lib/write-logic.ts src/app/api/generate/route.ts src/app/api/generate-batch/route.ts src/app/write/page.tsx tests/observation-board-ai-context.test.mjs
```

Apply those semantic changes manually or cherry-pick `a5af5bd` and resolve `src/lib/prompts/seteuk.ts` with these invariants:

```typescript
export const SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION = 'cross-curricular-seteuk-v2.8';
```

The resulting prompt must contain all v2.7 storage/version constants and safety rules from `origin/main`, plus all of the following:

- observation-board marks are supporting attitude evidence only;
- group numbers, roles, activity names, dates, topics, and raw marks never enter the model prompt;
- board-only input produces at most one general participation-attitude sentence; and
- direct teacher observations and meaningful learning data remain primary.

- [ ] **Step 6: Integrate the existing Vitest/observation logic groundwork after the production changes**

Run:

```powershell
git cherry-pick -x f629ec5
git cherry-pick -x b8e76a8
```

If `b8e76a8` conflicts, keep the current production component body and manually apply only:

- `src/lib/observation-board-logic.ts`
- `src/lib/observation-board-logic.test.ts`
- corresponding imports and removal of identical pure helpers from the page

Expected: no UI JSX or current session-default behavior is lost.

- [ ] **Step 7: Verify and commit the reconciled baseline**

Run:

```powershell
npm test
npx tsc --noEmit --pretty false
npm run lint
npm run build
git diff --check
git status --short
```

Expected: tests, typecheck, and build pass; only deliberate reconciliation changes remain.

Commit:

```powershell
git add package.json package-lock.json src tests docs eslint.config.mjs
git commit -m "chore: reconcile post-PR Seteuk work on current main"
```

---

### Task 2: Stop Repository And Deployment Artifact Leakage

**Files:**
- Modify: `.gitignore`
- Create: `.vercelignore`
- Create: `scripts/check-repo-boundaries.mjs`
- Modify: `package.json`
- Test: `scripts/check-repo-boundaries.mjs` executed against Git index

**Interfaces:**
- Produces: `npm run check:repo-boundaries`
- Blocks: local worktrees, logs, local sheet data, one-off outputs, and resource archives from the app repository/deployment context

- [ ] **Step 1: Write the failing repository-boundary checker**

Create `scripts/check-repo-boundaries.mjs` with these exact blocked prefixes/files:

```javascript
import { execFileSync } from 'node:child_process';

const blocked = [
  /^outputs\//,
  /^\.claude\//,
  /^\.local-sheet-store\.json$/,
  /^\.next-dev-.*\.log$/,
  /^글꼴\//,
  /^교육과정 모음 정리본\//,
];

const tracked = execFileSync('git', ['-c', 'core.quotepath=false', 'ls-files'], {
  encoding: 'utf8',
}).split(/\r?\n/).filter(Boolean);

const violations = tracked.filter((file) => blocked.some((rule) => rule.test(file)));
if (violations.length > 0) {
  console.error(`Repository boundary violations:\n${violations.join('\n')}`);
  process.exit(1);
}

console.log('Repository boundary check passed.');
```

Add to `package.json`:

```json
"check:repo-boundaries": "node scripts/check-repo-boundaries.mjs"
```

Run `npm run check:repo-boundaries` and expect failure listing current tracked archives/generated artifacts.

- [ ] **Step 2: Add ignore rules that stop new local artifacts immediately**

Append to `.gitignore`:

```gitignore
/.claude/
/outputs/
/.local-sheet-store.json
/.next-dev-*.log
/.next-dev-*.err.log
```

Create `.vercelignore`:

```gitignore
.claude
outputs
교육과정 모음 정리본
Skill-Will_모둠편성_설문_패키지
글꼴
docs
*.log
.local-sheet-store.json
```

- [ ] **Step 3: Record and relocate tracked non-app resources**

Before removing anything from the app branch, create `docs/data-sources/resource-relocation-manifest.md` containing each top-level source directory, destination repository, file count, byte count, and SHA-256 manifest path. Generate checksums in the resource repository, not in application runtime source.

Move these tracked scopes to a separately reviewed `Seteuk-resources` repository:

```text
교육과정 모음 정리본/
글꼴/
Skill-Will_모둠편성_설문_패키지/
```

Move one-off tracked `outputs/` content to `Seteuk-artifacts`. Keep only shipped assets under `public/` and runtime knowledge under `runtime-data/knowledge/`.

Expected: `npm run check:repo-boundaries` passes and `git diff --cached --name-status` contains only intentional removals plus manifests/ignore rules. Do not rewrite history.

- [ ] **Step 4: Commit the boundary**

```powershell
git add .gitignore .vercelignore package.json scripts/check-repo-boundaries.mjs docs/data-sources runtime-data
git add -u
git commit -m "chore: enforce app-only repository boundaries"
```

---

### Task 3: Add Individual Teacher Accounts And Revocable Sessions

**Files:**
- Create: `supabase/migrations/202607100001_teacher_accounts_and_sessions.sql`
- Create: `src/lib/auth/password.ts`
- Create: `src/lib/auth/accounts.ts`
- Replace: `src/lib/auth/session.ts`
- Modify: `src/lib/auth/guards.ts`
- Modify: auth routes and admin role code
- Create: `scripts/provision-teacher-account.mjs`
- Test: `src/lib/auth/password.test.ts`, `src/lib/auth/session.test.ts`

**Interfaces:**
- Produces: `verifyTeacherLogin(school, loginId, password)`, `createTeacherSession(account)`, `getTeacherSession()`, `revokeTeacherSession()`
- Session owner: immutable `accountId`, not teacher name

- [ ] **Step 1: Add the database contract**

Create the migration with these tables and constraints:

```sql
create table public.teacher_accounts (
    id uuid primary key default gen_random_uuid(),
    school text not null,
    login_id text not null,
    teacher_key text not null unique,
    teacher_name text not null,
    subject text not null default '담당 교과',
    password_hash text not null,
    role text not null default 'teacher' check (role in ('teacher', 'admin')),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (school, login_id)
);

create table public.teacher_sessions (
    token_hash text primary key,
    account_id uuid not null references public.teacher_accounts(id) on delete cascade,
    expires_at timestamptz not null,
    created_at timestamptz not null default now(),
    last_seen_at timestamptz not null default now()
);

create index teacher_sessions_account_expiry_idx
    on public.teacher_sessions (account_id, expires_at);

alter table public.teacher_accounts enable row level security;
alter table public.teacher_sessions enable row level security;
revoke all on public.teacher_accounts from anon, authenticated;
revoke all on public.teacher_sessions from anon, authenticated;
```

Do not insert a bootstrap account or password in SQL.

- [ ] **Step 2: Write password tests before implementation**

Tests must prove:

```typescript
expect(await verifyPassword('correct horse', await hashPassword('correct horse'))).toBe(true);
expect(await verifyPassword('wrong', await hashPassword('correct horse'))).toBe(false);
expect((await hashPassword('same'))).not.toBe(await hashPassword('same'));
```

Run `npm test -- src/lib/auth/password.test.ts` and expect module-not-found failure.

- [ ] **Step 3: Implement a versioned built-in scrypt password format**

`src/lib/auth/password.ts` exports:

```typescript
export async function hashPassword(password: string): Promise<string>;
export async function verifyPassword(password: string, encodedHash: string): Promise<boolean>;
```

Encoding format:

```text
scrypt$v1$<16-byte-base64url-salt>$<64-byte-base64url-derived-key>
```

Reject passwords shorter than 12 characters in provisioning, use `crypto.scrypt`, and compare derived keys with `crypto.timingSafeEqual`.

- [ ] **Step 4: Implement account lookup and server-side opaque sessions**

`src/lib/auth/accounts.ts` exports:

```typescript
export interface AuthenticatedTeacherAccount {
  accountId: string;
  teacherKey: string;
  name: string;
  school: string;
  subject: string;
  role: 'teacher' | 'admin';
}

export async function verifyTeacherLogin(input: {
  school: string;
  loginId: string;
  password: string;
}): Promise<AuthenticatedTeacherAccount | null>;
```

Replace signed self-contained session payloads with a 32-byte random token cookie. Store only SHA-256(token) in `teacher_sessions`, use eight-hour expiry, `httpOnly`, `secure` in production, `sameSite: 'lax'`, and `path: '/'`.

- [ ] **Step 5: Remove shared/name-based authority**

Delete `SEONGHO_LOGIN_PASSWORD` and make `validateSeonghoLogin` a syntax-only normalization helper or remove it. Change `isAdminTeacher` to read `role === 'admin'` from the active account. Delete the `BOOTSTRAP_ADMIN` name shortcut.

The login route must return the same public error for unknown login id and wrong password:

```json
{ "success": false, "error": "로그인 정보를 확인해 주세요." }
```

- [ ] **Step 6: Add the provisioning command**

`scripts/provision-teacher-account.mjs` must require these environment variables and never print the password/hash:

```text
TEACHER_LOGIN_ID
TEACHER_NAME
TEACHER_PASSWORD
TEACHER_ROLE=teacher|admin
SUPABASE_URL or SUPABASE_PROJECT_ID
SUPABASE_SECRET_KEY
```

Add:

```json
"provision:teacher": "node scripts/provision-teacher-account.mjs"
```

- [ ] **Step 7: Verify account/session behavior**

Tests must cover successful login, uniform failure, expired session, logout revocation, inactive account, teacher/admin roles, and cookie flags. Run focused tests, then `npm run verify`.

Commit:

```powershell
git add supabase/migrations/202607100001_teacher_accounts_and_sessions.sql src/lib/auth src/app/api/auth src/lib/admin-roles.ts src/app/api/admin-users scripts/provision-teacher-account.mjs package.json package-lock.json docs/operations/account-provisioning.md docs/student-record-knowledge
git commit -m "security: replace shared teacher login with revocable accounts"
```

---

### Task 4: Declare And Enforce An API Authorization Matrix

**Files:**
- Create: `docs/security/api-auth-matrix.md`
- Create: `scripts/check-api-auth-matrix.mjs`
- Modify: `src/lib/auth/guards.ts`
- Modify: all API route exports as required
- Test: `tests/routes/api-auth-policy.test.ts`

**Interfaces:**
- Produces: `withPublicRoute`, `withTeacherAuth`, `withAdminAuth`, `withDisabledRoute`
- Produces: machine-readable `src/lib/auth/api-policy.ts`

- [ ] **Step 1: Generate the current 51-route inventory and make the test fail**

Create `src/lib/auth/api-policy.ts` with an explicit object keyed by route path. Each entry contains:

```typescript
type ApiPolicy = {
  access: 'public' | 'teacher' | 'admin' | 'disabled';
  owner: 'none' | 'school' | 'teacher' | 'student' | 'eval-document';
  costBearing: boolean;
};
```

The initial test walks `src/app/api/**/route.ts` and fails when a route has no matching policy entry or an entry references a nonexistent route.

- [ ] **Step 2: Assign the intended policy**

Use these exact families:

```text
public:   /api/auth/login, /api/auth/logout, /api/auth/session,
          /api/group-survey/identify, /api/group-survey/submit,
          /api/knowledge/meta, /api/neis
teacher:  generation, search/review, student, record, observation,
          OCR/grading, cookies, workspace state, teacher survey
admin:    /api/admin/**, /api/admin-users/**,
          eval-check shared rules/settings mutation
disabled: eval-check execution/progress/results until Task 6 owner migration
```

Add the same matrix as a table in `docs/security/api-auth-matrix.md`, including HTTP methods and owner scope.

- [ ] **Step 3: Enforce wrappers and owner checks**

All teacher handlers receive `ctx.account`. Resource routes compare session school/teacher/student scope before reads and writes. Return `404`, not `403`, when a resource id belongs to another teacher so object existence is not disclosed.

- [ ] **Step 4: Run the policy checker**

Add:

```json
"check:api-auth": "node scripts/check-api-auth-matrix.mjs"
```

Expected:

```text
API auth matrix complete: 51/51 routes declared.
```

Commit after `npm run verify`:

```powershell
git commit -am "security: enforce explicit API authorization policies"
```

---

### Task 5: Contain Eval-Check Until Per-Teacher Ownership Exists

**Files:**
- Create: `src/lib/api-feature-flags.ts`
- Modify: all `src/app/api/eval-check/**/route.ts`
- Modify: `src/types/eval-check.ts`
- Modify: `src/lib/sheets/eval-check.ts`
- Test: `tests/routes/eval-check-access.test.ts`

**Interfaces:**
- Produces: `isEvalCheckEnabled(): boolean`
- Adds: `ownerTeacherKey` to eval documents and logs

- [ ] **Step 1: Add disabled-by-default route tests**

Without `EVAL_CHECK_ENABLED=true`, every eval-check method must return 404 before storage or OpenAI is called. The test must mock storage/OpenAI and assert zero calls.

- [ ] **Step 2: Implement the feature flag**

```typescript
export function isEvalCheckEnabled(): boolean {
  return process.env.EVAL_CHECK_ENABLED === 'true';
}
```

Wrap execution, progress, and results routes with `withDisabledRoute` plus teacher auth.

- [ ] **Step 3: Add ownership before re-enabling**

Append `ownerTeacherKey` to persisted eval document/log rows. Creation writes `ctx.account.teacherKey`; list/get/progress/results/delete require the same owner. Shared rule/settings GET may be teacher-readable, but mutation is admin-only.

- [ ] **Step 4: Prove cross-teacher isolation**

Create one document for teacher A. Tests for teacher B must return 404 for GET progress, GET results, and DELETE, with no document content in the response.

- [ ] **Step 5: Keep production disabled**

Do not add `EVAL_CHECK_ENABLED=true` to Vercel in this task. Update docs to state that server APIs, not just navigation, are disabled.

Commit after verification:

```powershell
git commit -m "security: contain eval-check behind ownership and feature gates"
```

---

### Task 6: Add Atomic Rate Limits And Public Survey Privacy

**Files:**
- Create: `supabase/migrations/202607100002_rate_limits_and_function_grants.sql`
- Create: `src/lib/rate-limit.ts`
- Create: `src/lib/request-context.ts`
- Modify: login, survey, NEIS, and cost-bearing AI routes
- Modify: `src/app/group-survey/[accessCode]/GroupSurveyPageClient.tsx`
- Test: rate-limit and survey privacy tests

**Interfaces:**
- Produces: `enforceRateLimit(request, { scope, identity, limit, windowSeconds })`
- Survey identify consumes: access code, grade, class, number, entered name
- Survey identify produces: verification/token/session metadata without roster name

- [ ] **Step 1: Add an atomic Supabase rate-limit function**

Create a table keyed by `bucket_key` and `window_start`, and an RPC that inserts or atomically increments the count. Revoke access from `anon` and `authenticated`; server service-role access only.

Required limits:

```text
login:             10 attempts / 15 minutes / hashed IP+login id
survey identify:   20 attempts / 10 minutes / hashed IP+access code
survey submit:     10 attempts / 10 minutes / hashed IP+access code
NEIS:              60 requests / minute / hashed IP
AI teacher routes: 30 requests / minute / account id, with stricter batch limit 5/minute
```

- [ ] **Step 2: Hash client identity without storing raw IP**

`src/lib/request-context.ts` reads the first trusted address from `x-vercel-forwarded-for`/`x-forwarded-for` and returns:

```typescript
HMAC_SHA256(RATE_LIMIT_HASH_SECRET, `${scope}:${ip}:${identity}`)
```

Production must fail closed for public login/survey when `RATE_LIMIT_HASH_SECRET` or Supabase is missing.

- [ ] **Step 3: Change survey identify contract**

Request:

```json
{
  "accessCode": "ABC234",
  "grade": 3,
  "classNumber": 1,
  "number": 7,
  "name": "entered-by-student"
}
```

Success response:

```json
{
  "success": true,
  "verified": true,
  "token": "short-lived-token",
  "alreadySubmitted": false,
  "student": { "grade": 3, "classNumber": 1, "number": 7 },
  "session": { "title": "survey title", "accessCode": "ABC234" }
}
```

Never return `student.name`. Failure responses for wrong name and nonexistent roster coordinates must be identical.

- [ ] **Step 4: Test privacy and throttling**

Tests must assert no response contains another student's name, failure messages are indistinguishable, the 21st identify request returns 429, and `Retry-After` is present.

- [ ] **Step 5: Move and rotate the NEIS key**

Replace the literal with `process.env.NEIS_API_KEY`. Return 503 when missing, rotate the committed credential, and document only the variable name.

Commit after verification:

```powershell
git commit -m "security: rate limit public APIs and protect survey identity"
```

---

### Task 7: Establish The Full Verification Gate And CI

**Files:**
- Create: `.nvmrc`, `vitest.config.ts`, `tests/setup.ts`, `.github/workflows/verify.yml`
- Modify: `package.json`
- Create: route and e2e tests listed in the target map

**Interfaces:**
- Produces: `npm run verify`
- CI artifact: Playwright report on failure

- [ ] **Step 1: Pin runtime and scripts**

`.nvmrc`:

```text
22
```

`package.json` scripts:

```json
"test": "vitest run",
"test:unit": "vitest run src",
"test:routes": "vitest run tests/routes",
"test:e2e": "playwright test",
"check:types": "tsc --noEmit --pretty false",
"verify": "npm run check:repo-boundaries && npm run check:api-auth && npm run check:types && npm run lint && npm test && npm run build"
```

Add `engines.node` as `>=22 <23`.

- [ ] **Step 2: Add route-contract coverage**

For every route family, test unauthenticated status, malformed JSON, missing env, owner mismatch, and success with mocked dependencies. `tests/routes/api-auth-policy.test.ts` is the coverage gate; no new route can merge without a matrix entry and test family.

- [ ] **Step 3: Add core browser flows**

Playwright covers:

1. teacher login and logout;
2. class selection and reload;
3. observation mark/save/reload;
4. single generation fallback without OpenAI billing;
5. batch generation fallback;
6. public survey identify and submit; and
7. XLSX export trigger.

Use seeded local Supabase/test adapters and fake OpenAI responses. Never run billable model calls in CI.

- [ ] **Step 4: Create GitHub Actions verification**

The workflow uses `actions/checkout`, `actions/setup-node` with Node 22 and npm cache, `npm ci`, Playwright browser install, `npm run verify`, then `npm run test:e2e`.

- [ ] **Step 5: Eliminate all current lint warnings**

Fix the 14 recorded warnings. Run `npm run lint -- --max-warnings=0`; make that the permanent script behavior.

Commit:

```powershell
git commit -m "test: add CI verification and route contract coverage"
```

---

### Task 8: Reduce Runtime Knowledge Packaging From 52 Routes To The Actual Consumers

**Files:**
- Move: `output/star-moe-knowledge-2026.json` to `runtime-data/knowledge/`
- Move: graph JSON to `runtime-data/knowledge/`
- Modify: knowledge loaders and `next.config.ts`
- Create: `scripts/check-output-traces.mjs`

**Interfaces:**
- Produces: `npm run check:output-traces`
- Runtime artifacts: exactly two JSON files

- [ ] **Step 1: Prove runtime consumers**

Run:

```powershell
rg -n "star-moe-knowledge|graph-rag-labels-2026|graph-rag-labels-2026.jsonl" src scripts next.config.ts
```

Expected: runtime source reads the canonical knowledge JSON and graph JSON; no runtime source requires the JSONL/vault.

- [ ] **Step 2: Move minimal runtime data and update loaders**

Use `runtime-data/knowledge/` as the first production path. Keep the documented upstream development fallback. Update the sync script to copy only the two runtime files.

- [ ] **Step 3: Scope output traces**

Replace the global `/api/**` include with explicit knowledge consumers. Include graph JSON only for the graph route, and canonical knowledge for counsel/review/search/meta/eval routes that import it.

- [ ] **Step 4: Add the build-trace budget test**

`scripts/check-output-traces.mjs` scans `.next/**/*.nft.json`, counts manifests containing `runtime-data/knowledge`, and fails above 12 or when a non-knowledge route such as `/api/students` references it.

Expected after `npm run build`:

```text
Knowledge trace check passed: <=12 route manifests; students route clean.
```

- [ ] **Step 5: Commit**

```powershell
git commit -m "perf: scope runtime knowledge data to consuming routes"
```

---

### Task 9: Version Persisted State And Make Synchronization Conflict-Aware

**Files:**
- Create: `src/lib/store-migrations.ts`
- Modify: `src/lib/store.ts`
- Modify: workspace/observation state routes and sync clients
- Modify: app-state migration to add `schema_version` and `revision`
- Test: `src/lib/store-migrations.test.ts`

**Interfaces:**
- Produces: `CURRENT_STORE_VERSION`, `migratePersistedStore(state, version)`
- PUT consumes: `{ data, schemaVersion, expectedRevision }`
- PUT produces: `{ updatedAt, revision }` or HTTP 409

- [ ] **Step 1: Characterize current persisted payloads**

Create fixtures for an empty state, the current state, and a legacy state missing curriculum/prompt fields. Tests must assert migration keeps teacher records and fills only absent defaults.

- [ ] **Step 2: Add Zustand persist version/migrate**

Set an explicit version and pass a deterministic migration function. Do not perform network access or current-time writes inside migration.

- [ ] **Step 3: Add optimistic revisions to Supabase documents**

The server update succeeds only when `expectedRevision` matches. Increment revision atomically; return 409 with current revision on conflict.

- [ ] **Step 4: Surface sync state**

Expose `loading`, `saved`, `offline`, `error`, and `conflict` states. Never mark a payload as synced before the PUT succeeds. On 409, retain both local and remote payloads and require an explicit merge/retry path.

- [ ] **Step 5: Test two-client conflict behavior**

Simulate clients A/B loading revision 4. A saves revision 5; B's revision-4 save must return 409 and must not overwrite A.

Commit:

```powershell
git commit -m "fix: version client state and prevent silent sync overwrites"
```

---

### Task 10: Split Observation Board And OCR Behind Characterization Tests

**Files:**
- Create feature directories listed in Target File Map
- Modify the two large pages
- Reuse and extend `observation-board-logic.test.ts`

**Interfaces:**
- Page components become composition shells under 1,000 lines
- Pure logic modules have no React/browser imports

- [ ] **Step 1: Freeze behavior with tests**

Cover session normalization, mark transitions, cookie deltas, group membership/roles, assignment snapshots, board-to-prompt minimization, OCR JSON normalization, guideline parsing, and grading payload assembly.

- [ ] **Step 2: Move observation pure model/storage code**

Move one responsibility per commit:

```text
model/session-normalization.ts
model/grouping.ts
model/marks.ts
model/prompt-context.ts
storage/local-board-store.ts
api/observation-client.ts
```

Run focused tests and build after every move.

- [ ] **Step 3: Move observation UI by screen**

Extract sidebar/filter primitives, mentor activity, growth, stats, grouping, and records in separate commits. Preserve JSX and CSS class names. Keep `page.module.css` until component extraction is complete; CSS reorganization is a later optional task.

- [ ] **Step 4: Extract OCR model and UI**

Move parsers/normalizers first, then upload, evaluation list, detail, and grading modal components. Dynamically import heavy PDF/XLSX helpers only inside actions.

- [ ] **Step 5: Meet size and behavior gates**

Expected:

```text
observation-board-2/page.tsx < 1000 lines
ocr/page.tsx < 1000 lines
npm run verify passes
Playwright core flows pass with no console errors
```

Use multiple commits named `refactor: extract <feature> from <page>`.

---

### Task 11: Resolve Client Bundle And PDF Runtime Warnings

**Files:**
- Modify: students/export pages using XLSX
- Modify: PDF converter/package dependencies
- Add: bundle and PDF smoke tests

- [ ] **Step 1: Record production client chunk baseline**

After a clean build, record the largest 20 `.next/static/chunks/*.js` sizes and identify the XLSX/Framer chunks. Current evidence includes an approximately 422 KB XLSX-bearing chunk.

- [ ] **Step 2: Dynamically load XLSX on user action**

Remove top-level `import * as XLSX from 'xlsx'`. Inside upload/export handlers use:

```typescript
const XLSX = await import('xlsx');
```

Tests must verify the students/export route loads without XLSX and the module is requested only after the action.

- [ ] **Step 3: Verify PDF conversion with the fixture**

The two-page fixture must successfully extract text and render two PNG buffers in the Node/Vercel-compatible runtime. Resolve the `@napi-rs/canvas` warning by adding/configuring the supported package only if the fixture proves it is necessary; do not merely suppress the warning.

- [ ] **Step 4: Review Framer Motion after measurement**

Replace simple opacity/translate decoration with CSS only where it removes route-specific motion chunks without changing interaction or accessibility.

Commit after bundle/PDF measurements and `npm run verify`:

```powershell
git commit -m "perf: defer heavy client modules and verify PDF runtime"
```

---

### Task 12: Add Operations Visibility And Safe Dependency Updates

**Files:**
- Create: `src/lib/logger.ts`, `src/app/api/health/route.ts`
- Create: `docs/operations/health-and-logging.md`
- Modify: package versions in reviewed groups

- [ ] **Step 1: Add redacted structured logging**

Log JSON with request id, route, status, duration, account id hash, and error code. Never log student names, record text, prompts, answers, cookies, tokens, keys, or request bodies.

- [ ] **Step 2: Add a non-secret health endpoint**

Return component readiness booleans and version identifiers without URLs/keys:

```json
{
  "status": "ok|degraded",
  "version": "git-sha",
  "checks": {
    "supabaseConfigured": true,
    "openaiConfigured": true,
    "knowledgeSnapshot": true
  }
}
```

- [ ] **Step 3: Upgrade patch/minor groups first**

Review and update in separate commits:

```text
@supabase/supabase-js 2.104.1 -> 2.110.x
canvas 3.2.1 -> 3.2.x
framer-motion 12.23.26 -> 12.42.x
openai 6.15.0 -> 6.46.x
zustand 5.0.9 -> 5.0.14
React 19.2.3 -> 19.2.x with Next 16.2.x
```

Defer ESLint 10, TypeScript 7, pdfjs 6, Lucide 1, and hanspell 1 to dedicated compatibility reviews.

- [ ] **Step 4: Verify each dependency group**

Run `npm audit`, `npm run verify`, PDF smoke, core Playwright flows, and a Vercel preview before merging each group.

---

### Task 13: Reconcile Documentation, Deploy, And Close The Stabilization Program

**Files:**
- Modify all top-level product/implementation/status docs
- Archive old status entries
- Update operations documents

- [ ] **Step 1: Repair current-state documentation**

Update README prompt version from v1 to v2.8, list all required environment variable names, document Node 22 and `npm run verify`, and remove the shared password instructions.

Keep `STATUS.md` to current status plus the last 30 days. Move older entries verbatim to `docs/student-record-knowledge/history/STATUS-through-2026-06.md`.

- [ ] **Step 2: Run mirror only when upstream source docs changed**

If `../student-record-knowledge/docs/` changed, run `npm run sync:knowledge-docs`; otherwise record that no mirrored source changed.

- [ ] **Step 3: Run final local verification**

```powershell
npm ci
npm run verify
npm run test:e2e
npm audit
git diff --check
git status --short
```

Expected: all commands pass, audit reports zero known vulnerabilities or documented accepted advisories, and the worktree is clean after commit.

- [ ] **Step 4: Create and inspect a Vercel preview**

After authenticating the CLI and confirming project `seteuk-zgyj`:

```powershell
vercel link --yes --project seteuk-zgyj --scope beomjinsouths-projects
vercel --yes
vercel inspect <preview-url> --scope beomjinsouths-projects
```

Smoke:

```text
/                              200
/write                         200 after login
/observation-board-2           200 after login
/api/generate unauthenticated  401
/api/eval-check                404 while disabled
/api/health                    200 or documented degraded
survey wrong identity          no name disclosure
```

- [ ] **Step 5: Commit, push, and open a pull request**

```powershell
git add -A
git commit -m "docs: complete Seteuk stabilization verification"
git push -u origin codex/project-stabilization-20260710
```

Open a PR to `main` with the verification matrix, migration order, account-provisioning prerequisite, Vercel preview, and rollback plan. Never force-push.

- [ ] **Step 6: Production rollout**

Apply Supabase migrations, provision the first admin account from a secure environment, configure environment variables, invalidate old shared sessions, deploy, and run the same smoke matrix. Monitor 401/403/429/5xx rates and Supabase errors for at least one school day before enabling further feature work.

---

## Dependency Order

```text
Task 1 clean integration
  -> Task 2 repository boundary
  -> Task 3 individual identity
  -> Task 4 API policy
  -> Task 5 eval containment
  -> Task 6 rate limits/survey/privacy
  -> Task 7 CI and contract tests
  -> Task 8 deployment data scope
  -> Task 9 state version/conflicts
  -> Task 10 modularization
  -> Task 11 performance/PDF
  -> Task 12 operations/dependencies
  -> Task 13 release/docs
```

Tasks 8 and 9 may proceed in parallel only after Task 7 is green and their files do not overlap. Task 10 must not begin before Tasks 1-7 are merged.

## Estimated Delivery

- Phase A, Tasks 1-2: 1-2 working days
- Phase B, Tasks 3-6: 3-5 working days
- Phase C, Task 7: 2-3 working days
- Phase D, Tasks 8-9: 2-4 working days
- Phase E, Tasks 10-11: 4-7 working days
- Phase F, Tasks 12-13: 2-3 working days

Expected total: approximately 14-24 working days for one engineer, with security/account provisioning decisions and resource-repository coordination as the main schedule variables.

## Plan Self-Review

- Spec coverage: all design success criteria map to Tasks 1-13.
- Placeholder scan: no `TBD`, `TODO`, “handle appropriately,” or unspecified verification step remains.
- Type consistency: account/session/policy/rate-limit interfaces are introduced before dependent route tasks.
- Safety: the plan never cleans the dirty source checkout, force-pushes, rewrites history, or runs billable OpenAI tests in CI.
- Rollout: identity/session changes include migrations, provisioning, old-session invalidation, preview verification, and production monitoring.
- Existing work: post-PR commits and the refactor worktree are reconciled explicitly rather than discarded or blindly merged.
