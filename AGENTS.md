# AGENTS.md

## Scope

This repository contains the shipped web application.
The source knowledge package still lives in `../student-record-knowledge`, but the GitHub-facing project docs must exist under `docs/student-record-knowledge/`.

## Source Of Truth

Use this order when making changes:

1. `docs/student-record-knowledge/PRD.md`
2. `docs/student-record-knowledge/IMPLEMENTATION.md`
3. `docs/student-record-knowledge/STATUS.md`
4. `docs/student-record-knowledge/SOURCE_AUDIT.md`
5. `src/app/api/counsel-chat/route.ts`
6. `src/app/api/record-review/route.ts`
7. `src/lib/knowledge-base.ts`
8. `src/lib/knowledge-rerank.ts`

## Mandatory Maintenance

### Product or scope changes

- Update `PRD.md`
- Update `IMPLEMENTATION.md`
- Update `STATUS.md`

### Retrieval or source-policy changes

- Update `SOURCE_AUDIT.md`
- Update `IMPLEMENTATION.md`
- Update `STATUS.md`

### API contract changes

- Update the route
- Update the relevant docs
- Keep `STATUS.md` current

## Doc Mirroring

The detailed planning docs in `../student-record-knowledge/docs/` should be mirrored into this repo.

Use:

```bash
npm run sync:knowledge-docs
```

This updates:

- `docs/student-record-knowledge/mirror/PRD.md`
- `docs/student-record-knowledge/mirror/IMPLEMENTATION.md`
- `docs/student-record-knowledge/mirror/SOURCE_AUDIT.md`
- `docs/student-record-knowledge/mirror/AGENT_CATALOG.md`
- `docs/student-record-knowledge/STATUS.md`

Keep the top-level docs in `docs/student-record-knowledge/` as curated, GitHub-friendly summaries.
Use `mirror/` for raw mirrored planning docs.

## End Of Task

1. Make sure code and docs agree.
2. Run `npx tsc --noEmit`.
3. Run a route smoke test when possible.
4. Refresh `docs/student-record-knowledge/STATUS.md`.
5. If mirrored docs changed, run `npm run sync:knowledge-docs`.
6. Commit and push when the repo is healthy.

## Git Rule

- Default flow: `git add -A` -> `git commit -m "<scope>: <summary>"` -> `git push origin HEAD`
- If push fails, record the reason.
- Do not force-push.
