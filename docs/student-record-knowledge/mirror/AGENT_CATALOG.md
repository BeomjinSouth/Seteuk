<!--
This file is mirrored from ../student-record-knowledge/docs.
Run `npm run sync:knowledge-docs` from the web repo to refresh it.
-->

# AGENT_CATALOG
# Agent Catalog

이 문서는 `GPT/student-record-ai-project/Agents.md`의 구조를 현재 패키지 기준으로 흡수한 운영 카탈로그다.

## 1. Source Discovery Agent

역할:

- FAQ/Q&A 시작 URL, 페이지네이션 규칙, 상세 접근 규칙을 파악한다.

현재 대응 파일:

- [`docs/SOURCE_AUDIT.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/docs/SOURCE_AUDIT.md)
- [`skills/board-crawling.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/board-crawling.md)

## 2. Board Crawling Agent

역할:

- 목록/상세 페이지를 실제로 수집하고 캐시한다.

현재 대응 파일:

- [`src/scrape-star-moe.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/src/scrape-star-moe.ts)
- [`skills/board-crawling.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/board-crawling.md)

## 3. Access Control Classification Agent

역할:

- 공개 문서, 비밀글, metadata-only 문서를 구분한다.

현재 대응 방식:

- 비밀글은 `inaccessibleEntries`
- 공개 미답변/작성중은 `pendingPublicEntries`
- canonical knowledge는 공개 답변 문서만 포함

## 4. Content Normalization Agent

역할:

- 제목/질문/답변/근거/메타데이터를 정규화한다.

현재 대응 파일:

- [`skills/normalization-and-dedup.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/normalization-and-dedup.md)
- [`src/scrape-star-moe.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/src/scrape-star-moe.ts)

## 5. Duplicate Resolution Agent

역할:

- 동일 질문을 통합하고 상이 답변을 version conflict로 분리한다.

현재 대응 방식:

- 제목 우선 중복 판정
- 기본은 최신 날짜 우선
- 운영 옵션으로 FAQ 우선 가능
- `duplicateCount`, `variantCount`, `resolution`, `answer_consistency_label`

## 6. Policy Anchor Extraction Agent

역할:

- 답변 본문에서 관련 근거/기재요령/법령 앵커를 추출한다.

현재 대응 방식:

- `knowledgeUnits[].policy_anchors`
- 초기 버전은 answer 텍스트의 `[관련 근거]` 구역을 기반으로 경량 추출

## 7. Retrieval Answer Agent

역할:

- RAG 검색 결과를 바탕으로 citation 포함 답변을 생성한다.

현재 대응 기준:

- [`skills/rag-answering.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/rag-answering.md)
- [`docs/PRD.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/docs/PRD.md)
- [`web/src/app/api/counsel-chat/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/counsel-chat/route.ts)
- [`web/src/app/counsel-chat/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/counsel-chat/page.tsx)

## 8. Student Record Review Agent

역할:

- 생기부 초안에서 위험 항목과 근거를 도출한다.

현재 대응 기준:

- [`skills/student-record-review.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/student-record-review.md)
- [`schemas/review-result.schema.json`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/schemas/review-result.schema.json)
- [`web/src/app/api/record-review/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/record-review/route.ts)
- [`web/src/app/record-review/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/record-review/page.tsx)

## 9. Evaluation Agent

역할:

- 수집/검색/점검 품질을 샘플 기반으로 검증한다.

현재 대응 기준:

- `validate:types`
- `validate:knowledge-units`
- 수동 샘플 리뷰

## 10. Admin Ops Agent

역할:

- 재수집, 재인덱싱, 실패 문서 복구, 품질 점검을 담당한다.

향후 구현 위치:

- `web/src/app/api/admin/*`
- `web` 관리 화면

## 오케스트레이션

1. Source Discovery
2. Crawling
3. Access Classification
4. Normalization
5. Dedup / Versioning
6. Policy Anchor Extraction
7. Retrieval / Review
8. Evaluation
9. Admin Ops
