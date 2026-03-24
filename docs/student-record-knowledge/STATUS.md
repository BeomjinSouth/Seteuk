# STATUS

## Source Snapshot

- generatedAt: 2026-03-22T07:53:13.538Z
- year: 2026
- qnaLastPage: 174
- qnaListed: 2087
- qnaPublic: 947
- qnaSecret: 1140
- canonicalEntries: 928
- knowledgeUnits: 928
- pendingPublicEntries: 63
- inaccessibleEntries: 1140

## Web Status

- counsel chat API: implemented
- record review API: implemented
- write review-improve action: implemented
- raw search API: implemented
- search eval API: implemented
- counsel chat page: implemented
- record review page: implemented
- write page integration: implemented
- search inspector page: implemented
- main navigation integration: implemented
- lexical retrieval: implemented
- AI reranking: implemented
- OpenAI routes: lazy client init applied to avoid Vercel build failures without runtime credentials

## Next

- improve retrieval ranking for difficult query classes
- replace lexical-first retrieval with vector or hosted file search
- automate more of the doc mirror workflow if needed
