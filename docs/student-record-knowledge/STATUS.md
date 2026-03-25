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
- counsel/review workspace page: implemented
- /record-review compatibility redirect: implemented
- write page integration: implemented
- search inspector diagnostics route: implemented but hidden from the sidebar
- main navigation integration: 학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검 -> 학습지 OCR 순서 적용
- student workspace split: 학생 관리는 명부/학급 연결만 담당하고 학생 카드 보드는 /observation-board로 분리
- shared roster sync: 학교 공용 명부를 /api/students + 시트 저장소로 동기화하고 같은 학교 사용자가 함께 사용하며, 중복 업로드는 학적 키 기준으로 병합
- observation board interaction: 카드 클릭 선택 + 더블클릭 관찰 기록 작성 + 같은 학급 다중 선택 일괄 저장 지원
- observation compose layout: 학생별 row editor + 선택형 태그 + 날짜 기본값 오늘
- lexical retrieval: implemented
- AI reranking: implemented
- bundled knowledge snapshot for deployed runtime: implemented

## Recent Changes

- 2026-03-25: changed student roster upload to sync through shared school storage and merge overlapping uploads by roster key
- 2026-03-25: renamed the counsel/review workspace label to `생기부 상담 점검` and removed the hero stat cards from the page header
- 2026-03-25: made knowledge loading prefer `web/output/star-moe-knowledge-2026.json` and bundle that snapshot during sync so deployed routes stop looking for `/var/student-record-knowledge/...`
- 2026-03-25: merged counsel chat and record review into one `/counsel-chat` workspace and removed the search inspector from the user sidebar
- 2026-03-25: fixed OpenAI JSON mode validation failures in `record-review` and AI reranking by adding explicit `JSON` instructions to the request input context

## Next

- improve retrieval ranking for difficult query classes
- replace lexical-first retrieval with vector or hosted file search
- automate more of the doc mirror workflow if needed
