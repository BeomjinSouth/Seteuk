# Retrieval Improvement Plan

## Goal

Improve the student-record knowledge retrieval layer for counsel chat, Graph RAG, and record review without changing the public-only evidence policy.

This work focuses on:

- replacing raw-score hybrid merging with rank-based Reciprocal Rank Fusion (RRF)
- expanding retrieval evaluation so ranking changes can be checked numerically
- reducing repeated per-query work in local lexical search and Graph RAG grounding
- keeping graph-domain query detection and offline label generation on one shared rule source

## Baseline

- 2026-06-13: `cmd /c npx tsc --noEmit --pretty false` passed before implementation.
- 2026-06-13: no local Next server was listening on ports 3000-3035, and `OPENAI_API_KEY` / `OPENAI_VECTOR_STORE_ID` were not set in the shell, so hosted search is expected to fail open to lexical-only during local smoke tests.

## Retrieval Changes

- Hybrid counsel retrieval should call lexical and hosted search with a wider candidate pool, then fuse ranked lists with RRF instead of comparing lexical raw scores against hosted vector scores.
- If hosted search is unavailable or returns no results, lexical-only scoring and ordering should remain unchanged.
- Record review keeps sentence-level retrieval and AI reranking; only segment execution should become parallel and hybrid merging should use the same RRF behavior when hosted hits are present.
- Counsel chat and Graph RAG may skip AI reranking only for conservative, lexical-only high-confidence matches with a public citation URL.

## Evaluation Changes

- The evaluation set should cover at least 30 representative teacher questions across seteuk, attendance, creative experience, school register, correction, awards, behavior summary, reading, school violence, certificates, free-semester, special-school, and weak-evidence cases.
- `/api/search-eval` should accept `mode=lexical|hybrid` and `limit`.
- Reports should include provider, limit, hit@1, hit@3, recall@k, MRR, and failed cases with returned titles and unit ids.

## Performance Changes

- Cache merged knowledge records alongside the loaded dataset.
- Precompute Graph RAG match text once per retrieved match before scoring answer spans.
- Treat single newlines as answer-span boundaries when they separate generated Korean answer lines.
- Keep low-signal token lists separate by purpose: lexical scoring and grounding precision.

## Source Policy

- Answer evidence remains canonical public FAQ/Q&A only.
- Hosted/vector search is a secondary retrieval source. Files uploaded before `knowledge_unit_id` attributes were added can still fall back to title matching; a vector-store resync is required for complete graph-label joins.
