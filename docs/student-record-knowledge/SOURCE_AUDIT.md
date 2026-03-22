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
- private posts are retained only for stats and operations
- conflict resolution defaults to latest answer first
