# Student Record Knowledge Implementation

## Data Sources

- `../student-record-knowledge/output/star-moe-knowledge-2026.json`
- `../student-record-knowledge/output/star-moe-knowledge-units-2026.json`

## Current Implementation

### Loader

- `src/lib/knowledge-base.ts`
- loads knowledge JSON
- applies school-level, category, and year filters
- uses lexical retrieval, synonym expansion, concept constraints, and scoring

### Reranking

- `src/lib/knowledge-rerank.ts`
- uses OpenAI Responses API when available
- reranks top lexical candidates before final answer or review generation

### Hosted Retrieval Preparation

- `src/lib/knowledge-hosted.ts`
- syncs canonical knowledge into an OpenAI vector store in batches
- searches the vector store and maps hosted hits back into app evidence objects

### APIs

- `src/app/api/knowledge/meta/route.ts`
- `src/app/api/knowledge/sync/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/search-eval/route.ts`
- `src/app/api/search-openai/route.ts`
- `src/app/api/counsel-chat/route.ts`
- `src/app/api/record-review/route.ts`

### UI

- `src/app/counsel-chat/page.tsx`
- `src/app/record-review/page.tsx`
- `src/app/search-inspector/page.tsx`
- raw match list shown in the pages
- local vs hosted search comparison available
- query-string prefill supported
- main navigation connected

## Response Policy

- If there is no public evidence, do not fabricate an answer
- counsel responses must include citations
- review responses must include issues, risk level, and rewrite guidance

## Quality Loop

- retrieval test set in `src/data/knowledge-eval-cases.ts`
- evaluation runner in `src/lib/knowledge-eval.ts`
- evaluation API in `/api/search-eval`

## Next Steps

1. improve difficult query ranking classes
2. decide when hosted retrieval is good enough to become the default provider
3. automate doc mirroring further if the workflow expands
