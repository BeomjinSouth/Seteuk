# Student Record Knowledge Status

## Current State

- FAQ/Q&A source knowledge has been normalized outside the app and is consumed as JSON.
- `web` now exposes:
  - `/api/knowledge/meta`
  - `/api/search`
  - `/api/search-eval`
  - `/api/counsel-chat`
  - `/api/record-review`
- `web` now provides:
  - `/counsel-chat`
  - `/record-review`
  - `/search-inspector`

## Completed

1. Public FAQ/Q&A retrieval and canonical knowledge generation
2. Knowledge loader in `web`
3. Counsel chatbot API + UI
4. Record review API + UI
5. Search inspection API + UI
6. GitHub-mirrored docs under `docs/student-record-knowledge/`
7. OpenAI-based reranking hook added on top of lexical retrieval
8. Retrieval eval dataset and API added

## In Progress

1. Retrieval quality tuning and evaluation

## Next

1. Improve ranking for name/성명, 세특, 창체/출결 queries
2. Replace lexical retrieval with vector/file-search strategy
3. Automate doc mirroring from `../student-record-knowledge`
