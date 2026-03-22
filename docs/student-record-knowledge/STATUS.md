# Student Record Knowledge Status

## Current State

- FAQ/Q&A source knowledge has been normalized outside the app and is consumed as JSON.
- `web` now exposes:
  - `/api/knowledge/meta`
  - `/api/search`
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

## In Progress

1. Retrieval quality tuning
2. Existing navigation integration with minimal risk to unrelated local changes

## Next

1. Improve ranking for name/성명, 세특, 창체/출결 queries
2. Connect new pages into stable product navigation
3. Replace lexical retrieval with vector/file-search strategy
4. Automate doc mirroring from `../student-record-knowledge`
