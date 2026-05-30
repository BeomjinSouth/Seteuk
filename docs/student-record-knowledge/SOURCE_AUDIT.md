# Student Record Knowledge Source Audit

## Source Pages

- FAQ: `https://star.moe.go.kr/web/contents/m302001.do`
- Public Q&A: `https://star.moe.go.kr/web/contents/m30103.do`

## Observations

- FAQ uses list HTML plus AJAX-loaded answers
- public Q&A mixes list pages, detail pages, and private posts
- private posts are metadata-only
- for 2026 data, the last Q&A page observed was `174`

## Current Policy

- chatbot and review use only canonical public knowledge
- Graph RAG mode uses the same canonical public knowledge only; ontology nodes, graph edges, highlighted answer spans, and source excerpts are generated from retrieved public FAQ/Q&A evidence
- Graph RAG highlights only answer spans that pass both a retrieved-source score threshold and a direct public-source text-overlap threshold; answer spans without enough source support are kept unhighlighted so the UI does not imply unsupported precision
- private posts are retained only for stats and operations
- conflict resolution defaults to latest answer first
- deployed web runtime reads a bundled knowledge snapshot from `web/output/star-moe-knowledge-2026.json`
- local development can fall back to `../student-record-knowledge/output/star-moe-knowledge-2026.json` or `KNOWLEDGE_JSON_PATH`
- hosted/vector retrieval exists as an optional path, but the default production answer flow is still lexical retrieval plus optional AI reranking
