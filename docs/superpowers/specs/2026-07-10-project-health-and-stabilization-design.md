# Seteuk Project Health And Stabilization Design

## Purpose

Seteuk has reached the point where adding features without first stabilizing the repository, identity boundary, tests, and deployment packaging would increase operational risk faster than product value. This design defines the target state for a stabilization program that preserves shipped behavior while making later feature work safer.

The evidence for this design was collected on 2026-07-10 from the current checkout, local production build, route smoke tests, dependency metadata, Git history, and generated Next.js trace files.

## Evidence Summary

- The app has 17 pages, 51 API routes, about 52,000 source lines, and one tracked test file containing three tests.
- `npx tsc --noEmit` passes.
- ESLint passes with 14 warnings and no errors.
- The existing three tests pass when the Node test worker is allowed to spawn.
- `next build` passes but emits repeated `@napi-rs/canvas`/`Path2D` warnings.
- `npm audit` reports no known dependency advisories; this does not cover application authorization flaws.
- The current checkout tracks about 406 MB. It contains the shipped web app, 600 curriculum archive files, generated knowledge outputs, math concept-map work, fonts, and one-off spreadsheet artifacts.
- The current branch has 14 commits not in `origin/main` and is 7 commits behind `origin/main`. PR #1 has already been merged to `origin/main`.
- The working tree has two modified files and 82 untracked entries. Many untracked entries are output workbooks, previews, or inspection files.
- A shared password in source code can issue a session for any valid-looking Korean teacher name. Bootstrap admin status is granted by matching a teacher name.
- The hidden eval-check API family has no teacher/admin guard and no per-document owner.
- A valid public group-survey link can be used to probe grade/class/number combinations and receive a student's name. No distributed rate limit exists.
- A NEIS API key is committed in source.
- `next.config.ts` applies all knowledge JSON files to `/api/**`; 52 API trace manifests each reference the same three knowledge artifacts.
- `observation-board-2/page.tsx` is 3,668 lines with 36 state values and 19 effects. `ocr/page.tsx` is 2,911 lines with 38 state values.
- Production configuration is linked locally to Vercel project `seteuk-zgyj`, but remote status could not be verified because the local Vercel CLI has no active credentials.

## Goal

Produce an app-only, secure, test-gated Seteuk repository where:

1. every teacher has an individual, revocable identity;
2. every API route has an explicit access policy and owner check;
3. public survey flows disclose no roster data and are rate limited;
4. generated/student artifacts cannot enter Git accidentally;
5. production functions include only the runtime data they use;
6. core behavior is covered by unit, route-contract, and browser smoke tests;
7. large screens are decomposed behind tested feature boundaries; and
8. code, current-status docs, GitHub, Supabase, and Vercel tell the same operational story.

## Non-Goals

- Do not rewrite the product from scratch.
- Do not redesign shipped UI during security or structural extraction tasks.
- Do not replace the retrieval algorithm while the stabilization branch is being assembled.
- Do not rewrite Git history or force-push large-file cleanup.
- Do not move teacher/student data to another provider merely for architectural uniformity.
- Do not enable the unfinished eval-check UI until identity ownership and route tests exist.

## Chosen Approach

Use a security-first, incremental stabilization branch created from the latest `origin/main`.

This is preferred over parallel cleanup because the active checkout and the existing refactor worktree have different ancestry. It is preferred over a rewrite because the current application builds, the main flows work, and most risk comes from boundaries rather than missing product capability.

Each stabilization task must be independently testable and independently reviewable. Security fixes land before code-size refactors. The existing `worktree-refactor-opus-groundwork` logic extraction is reused only after the latest production branch and the post-PR commits have been reconciled.

## Repository Boundary

`AGENTS.md` defines this repository as the shipped web application. The target layout therefore treats other material as referenced sources or generated artifacts, not application source.

```text
Seteuk/
├── src/                         # shipped application source
├── public/                      # shipped static assets only
├── runtime-data/knowledge/      # minimal immutable runtime snapshots
├── supabase/migrations/         # database contract
├── tests/                       # unit, route, and e2e tests
├── scripts/                     # build, migration, and verification tools
├── docs/                        # curated product and operations docs
├── package.json
└── vercel.json

../Seteuk-resources/             # curriculum PDFs, source archives, large maps
../Seteuk-artifacts/             # one-off spreadsheets, previews, inspection output
../student-record-knowledge/     # source knowledge package, as already documented
```

The first cleanup commit stops new growth with ignore and boundary checks. Moving already tracked archives happens in a later, explicit commit after manifests and checksums are recorded. Historical size reduction would require a separate approved history-rewrite project and is outside this design.

## Identity And Authorization

The current shared-password/name session is replaced with individual teacher accounts stored in Supabase.

### Account model

- `teacher_accounts.id`: immutable UUID used for authorization.
- `teacher_accounts.login_id`: unique school-scoped login identifier.
- `teacher_accounts.teacher_key`: compatibility key for current data partitioning.
- `teacher_accounts.password_hash`: versioned scrypt hash; no plaintext or default password in source.
- `teacher_accounts.role`: `teacher` or `admin`.
- `teacher_accounts.active`: revocation switch.
- `teacher_sessions.token_hash`: server-side session token hash.
- `teacher_sessions.account_id`: immutable owner.
- `teacher_sessions.expires_at`: eight-hour expiry.

The browser receives only a random HTTP-only session token. The server hashes it and loads the active account for each protected request. Logout and account disablement can therefore revoke access immediately.

Bootstrap administration is provisioned by a one-time local script using environment-supplied credentials. No teacher name automatically grants admin rights.

### API policy

Every route belongs to exactly one policy:

- `public`: login, logout, session status, knowledge metadata, survey identify/submit, and intentionally public NEIS reads.
- `teacher`: student, record, observation, generation, review, search, OCR, and teacher survey APIs.
- `admin`: account/role management, crawl/reindex/quality operations, eval rule/settings mutations.
- `disabled`: unfinished eval-check execution/results routes until owner fields and feature activation are complete.

Public does not mean unrestricted. Login, survey, NEIS, and cost-bearing routes receive atomic database-backed rate limits. Rate-limit keys use an HMAC of scope plus account/IP so raw IP addresses are not stored.

## Eval-Check Containment

The UI is already disabled, so the safe rollout is:

1. immediately return 404 unless `EVAL_CHECK_ENABLED=true`;
2. require a teacher session for document creation/progress/results/deletion;
3. add `ownerTeacherKey` to documents and logs before enabling;
4. require admin for shared rule/settings mutation; and
5. add route tests proving cross-teacher document IDs return 404.

This prevents a hidden feature from remaining an unowned public data surface.

## Public Survey Privacy

The identify request changes from grade/class/number only to grade/class/number plus the student's entered name. The server performs an exact normalized match and returns only `verified: true`, a short-lived submit token, session title, and submission state. It does not return roster names.

Identify and submit are rate limited by access code plus hashed client identity. Repeated failures receive `429` with `Retry-After`. Audit logs store the survey session id and outcome, not the entered name.

## Data And State Ownership

Zustand remains the interactive client store, but persisted data receives an explicit schema version and migration function. Supabase remains the production source of truth.

The synchronization contract becomes:

1. hydrate versioned local state;
2. validate the server session;
3. load the remote document with `updatedAt` and `schemaVersion`;
4. merge entity collections by id and timestamps;
5. save with an expected remote revision;
6. return `409` on stale writes; and
7. surface pending, saved, offline, and conflict states in the UI.

This prevents silent last-writer-wins overwrites and gives future store changes a migration path.

## Feature Boundaries

Large pages are decomposed only after security and test gates are green.

```text
src/features/observation-board/
├── api/
├── components/
├── hooks/
├── model/
├── storage/
└── tests/

src/features/ocr/
├── api/
├── components/
├── model/
└── tests/

src/features/eval-check/
├── application/
├── domain/
├── infrastructure/
└── tests/
```

The page files become composition shells. Pure normalization, grouping, prompt-context, and parsing logic is moved first and covered by characterization tests. UI extraction follows in small groups without changing markup or behavior.

## Test Strategy

The target verification pyramid is:

- Unit: state migrations, auth password/session functions, survey normalization/token behavior, observation-board logic, OCR parsers, retrieval and prompt invariants.
- Route contract: policy, status codes, malformed bodies, owner isolation, rate limits, and missing-environment behavior.
- Browser smoke: login, class selection, observation save/reload, single/batch generation fallback, survey submit, and export.
- Build/deployment: TypeScript, lint, unit/route tests, Next build, output-trace budget, and repository-boundary check.

CI uses Node 22 and runs on every pull request. New warnings are rejected; the current 14 warnings are fixed during stabilization rather than grandfathered indefinitely.

## Deployment Packaging

Only two runtime artifacts are expected for knowledge features:

- `star-moe-knowledge-2026.json`
- `graph-rag-labels-2026.json`

The JSONL file and Obsidian review vault are build/maintenance artifacts, not runtime dependencies. `outputFileTracingIncludes` is scoped only to routes that import the knowledge layer. The success criterion is fewer than 12 route trace manifests referencing knowledge data, down from 52.

One-off outputs, resource archives, docs, local worktrees, logs, and local stores are excluded from Vercel upload context.

## Performance And Operations

- Load `xlsx` only inside upload/export actions.
- Review broad Framer Motion usage after route-level bundle measurement.
- Resolve the PDF canvas warning with a real multi-page PDF fixture before changing dependencies.
- Add request IDs and structured redacted logs.
- Add `/api/health` for configuration and dependency readiness without exposing secrets.
- Pin Node 22 locally and in CI/Vercel.
- Upgrade patch/minor dependency groups after baseline tests; major upgrades remain separate reviews.

## Documentation Model

- `README.md`: setup, environment names, verification, deployment entry points.
- `PRD.md`: intended product behavior only.
- `IMPLEMENTATION.md`: current architecture and contracts.
- `STATUS.md`: concise current status and last 30 days of changes.
- `docs/student-record-knowledge/history/`: archived older status entries.
- `docs/security/api-auth-matrix.md`: route policy and data owner.
- `docs/operations/`: account provisioning, incident response, Vercel, Supabase, and backup/restore.

Mirrored upstream knowledge docs remain raw mirrors and must not be edited to simulate newer top-level product state.

## Rollout Order

1. Create a clean stabilization worktree and stop artifact leakage.
2. Reconcile post-PR code without regressing the v2.7 prompt; the combined prompt becomes v2.8.
3. Replace shared authentication and remove name-based admin bootstrap.
4. Contain eval-check and harden public survey/NEIS/database boundaries.
5. Add CI, unit tests, route policy tests, and browser smoke tests.
6. Reduce repository and Vercel packaging scope.
7. Integrate tested observation-board logic extraction and split large pages.
8. Version persisted state and add conflict-aware synchronization.
9. Optimize client bundles, PDF runtime, logging, and dependencies.
10. Update docs, verify Vercel/Supabase, deploy, and monitor.

## Success Criteria

- No shared password, embedded operational key, or name-based admin grant remains in tracked source.
- All 51 API routes appear in the auth matrix and automated policy test.
- Cross-teacher access tests pass for every student/record/document resource family.
- Public survey identify returns no roster name and rate-limit tests pass.
- No `outputs/`, local store, dev log, or resource-archive file can pass the repository boundary check.
- `npm run verify` passes from a clean checkout.
- The two largest page files are each below 1,000 lines, with behavior covered by tests.
- Fewer than 12 API route traces reference runtime knowledge JSON.
- Vercel production deployment is Ready and the documented smoke matrix passes.
- `README.md`, PRD, implementation, status, GitHub branch, Supabase migrations, and Vercel settings agree.

## Self-Review

- No implementation step depends on a destructive history rewrite.
- Security fixes precede feature refactors.
- The unfinished eval-check feature is contained before ownership work.
- Existing post-PR work is preserved semantically without treating a lower prompt version number as newer.
- The design preserves Supabase, Next.js, Zustand, OpenAI, and the existing UI rather than introducing an unrelated platform rewrite.
- Every success criterion is measurable by a command, test, manifest, or deployment observation.
