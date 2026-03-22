<!--
This file is mirrored from ../student-record-knowledge/docs.
Run `npm run sync:knowledge-docs` from the web repo to refresh it.
-->

# IMPLEMENTATION
# Implementation Plan: 학생부 지식 수집 + RAG 상담 + 생기부 점검

## 1. 구현 목표

현재 패키지의 실제 구현 대상은 두 층으로 나뉜다.

1. `student-record-knowledge`: 외부 게시판을 수집해 canonical knowledge를 만드는 오프라인 레이어
2. `web`: 이 지식을 검색/답변/점검 기능으로 제공하는 서비스 레이어

## 2. 현재 구현 상태

완료:

- FAQ/Q&A 수집 스크립트
- 캐시 저장
- 비밀글 분기
- Markdown/JSON 산출
- `web` 앱 지식 로더 구현
- `web` 앱 상담 API 구현
- `web` 앱 생기부 점검 API 구현
- `web` 앱 상담/점검 페이지 구현

다음 단계:

- 검색 품질 고도화
- citation/issue UI 세부 개선
- hosted vector search 또는 자체 vector DB 확장

## 3. 권장 아키텍처

```text
STAR FAQ/Q&A
  -> crawler
  -> raw cache
  -> parser
  -> access classifier
  -> normalizer
  -> duplicate/version resolver
  -> canonical knowledge JSON/MD
  -> index sync
  -> RAG chat / record review
```

## 4. 모듈 구성

## 4.1 오프라인 수집 레이어

현재 위치:

- [`student-record-knowledge/src/scrape-star-moe.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/src/scrape-star-moe.ts)

책임:

- FAQ 목록/상세 수집
- Q&A 목록/상세 수집
- 캐시 저장
- 접근권한 분기
- canonical / pending / inaccessible 산출

## 4.2 규칙/계약 레이어

위치:

- [`student-record-knowledge/skills`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills)
- [`student-record-knowledge/schemas`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/schemas)
- [`student-record-knowledge/docs/AGENT_CATALOG.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/docs/AGENT_CATALOG.md)

책임:

- 수집 규칙
- 정규화/중복 통합 규칙
- 챗봇 답변 규칙
- 생기부 점검 규칙
- JSON contract 정의

## 4.3 웹앱 서비스 레이어

권장 신규 위치:

- `web/src/app/api/knowledge/sync/route.ts`
- `web/src/app/api/search/route.ts`
- `web/src/app/api/counsel-chat/route.ts`
- `web/src/app/api/record-review/route.ts`
- `web/src/app/counsel-chat/page.tsx`
- `web/src/app/record-review/page.tsx`

현재 구현 완료:

- [`web/src/app/api/knowledge/meta/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/knowledge/meta/route.ts)
- [`web/src/app/api/search/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/search/route.ts)
- [`web/src/app/api/counsel-chat/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/counsel-chat/route.ts)
- [`web/src/app/api/record-review/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/record-review/route.ts)
- [`web/src/app/counsel-chat/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/counsel-chat/page.tsx)
- [`web/src/app/record-review/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/record-review/page.tsx)
- [`web/src/lib/knowledge-base.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/lib/knowledge-base.ts)

페이지 보조 기능:

- 상단 quick nav 추가
- URL query prefill 지원

## 5. 수집 파이프라인

## 5.1 FAQ

- URL: `m302001`
- 목록에 질문만 존재
- 답변은 `/web/board/getQnaView.do?id=...&schBcid=m302001`에서 AJAX로 조회

## 5.2 일반 Q&A

- URL: `m30103`
- 목록은 `schM=list`
- 상세는 `schM=view&id=...`
- 비밀글 상세는 본문 대신 경고 스크립트만 반환

## 5.3 캐시 정책

- URL 단위 HTML 캐시 저장
- 동일 URL 재요청 최소화
- 구조 변경 분석 시 캐시와 실응답 비교 가능

## 5.4 관찰 결과

2026-03-20 KST 전체 수집 기준:

- 마지막 페이지: 174
- 전체 글: 2,087
- 공개 글: 947
- 비밀글: 1,140

## 6. 정규화 및 중복 통합

## 6.1 정규화 원칙

- 원문 의미를 바꾸는 요약 금지
- 질문/답변/근거 분리
- 학교급/구분/상태/날짜 정규화
- 비밀글은 metadata only

## 6.2 중복 판단 기준

현재 구현 기본값:

- 제목 우선 매칭
- 제목이 비어 있으면 질문 본문 사용

대표 규칙:

- 동일 질문 + 동일 답변: 1건으로 통합
- 동일 질문 + 다른 답변: version conflict
- 기본은 최신 날짜 우선
- 필요 시 운영 옵션으로 FAQ 우선 가능

현재 2026 데이터에서는 title-based 기준으로 6개 충돌 그룹이 관찰됐다.

## 6.3 version 처리

다음을 무시하고 강제 통합하지 않는다.

- 연도 차이
- 학교급 차이
- 근거 문서 차이
- 답변 핵심 차이

## 7. 데이터 계약

## 7.1 canonical knowledge

기준 schema:

- [`schemas/knowledge-unit.schema.json`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/schemas/knowledge-unit.schema.json)

핵심 필드:

- `questionKey`
- `title`
- `question`
- `answer`
- `sourceType`
- `effectiveDate`
- `schoolLevels`
- `categories`
- `resolution`
- `duplicateCount`
- `variantCount`
- `sources[]`

별도 산출물:

- `output/star-moe-knowledge-units-YYYY.json`

## 7.2 review result

기준 schema:

- [`schemas/review-result.schema.json`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/schemas/review-result.schema.json)

핵심 필드:

- `schoolLevel`
- `category`
- `year`
- `status`
- `riskLevel`
- `issues[]`
- `citations[]`
- `recommendedRewrite`
- `summary`

## 8. 인덱싱 전략

## 8.1 권장 1안: OpenAI File Search

장점:

- Responses API와 결합이 단순함
- hosted retrieval 사용 가능
- `max_num_results`로 결과 수 조절 가능
- metadata filtering 가능
- `include=["file_search_call.results"]`로 검색 chunk 추적 가능

권장 용도:

- 빠른 MVP
- `web` 앱 연동

현재 구현 상태:

- 현재는 로컬 `knowledge JSON`을 읽어 lexical retrieval + OpenAI Responses API를 결합한 MVP를 구현했다.
- 추후 검색 품질과 운영 편의성이 더 중요해지면 File Search 또는 외부 vector DB로 전환 가능하다.

## 8.2 대안 2안: 자체 벡터 DB

후보:

- pgvector
- 외부 vector DB

장점:

- 세밀한 ranking 제어
- 대규모 검색 튜닝 용이

단점:

- 운영 복잡도 증가

## 9. 챗봇 구현 흐름

1. 사용자 질문 수신
2. 학교급/구분/연도 해석
3. canonical knowledge 검색
4. FAQ/정책 우선 재정렬
5. 상충 답변 여부 검사
6. 응답 생성
7. citations와 warnings 반환

응답 원칙은 [`skills/rag-answering.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/rag-answering.md)를 따른다.

## 10. 생기부 점검 구현 흐름

1. 텍스트 입력
2. 문장/절 단위 분해
3. 관련 근거 검색
4. 위험 항목 분류
5. 이유/근거/수정 방향 생성
6. structured review result 반환

점검 원칙은 [`skills/student-record-review.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/student-record-review.md)를 따른다.

## 11. 운영 도구

필수 운영 API:

- `POST /api/knowledge/sync`
- `POST /api/admin/crawl`
- `POST /api/admin/reindex`
- `GET /api/admin/crawl-status`
- `GET /api/admin/quality-report`

운영 책임:

- 재수집
- 실패 문서 재처리
- 인덱스 재생성
- 품질 리포트

## 12. 평가 체계

평가 축:

- 수집 성공률
- 비밀글 오사용률 0 유지
- duplicate resolution accuracy
- retrieval precision
- citation correctness
- review issue precision

자동 검증:

- `npm run validate:types`
- `npm run validate:knowledge-units -- --year=2026`

필수 샘플 점검:

- 최신 공개 Q&A 20건
- FAQ 10건
- 충돌 그룹 전수 확인

## 13. 구현 단계

### Phase 1. 오프라인 지식 레이어

- 수집기
- source audit
- schema
- canonical JSON/MD

### Phase 2. 검색/인덱싱

- chunking
- vector index sync
- search API

현재 상태:

- 로컬 JSON 기반 search helper 구현 완료
- metadata API 구현 완료
- raw search API 구현 완료

### Phase 3. RAG 상담 챗봇

- counsel-chat API
- UI
- citation cards

현재 상태:

- API/UI/citation card 1차 구현 완료

### Phase 4. 생기부 점검

- record-review API
- issue rendering
- rewrite guidance UI

현재 상태:

- API/UI/issue rendering 1차 구현 완료

## 14. 문서 유지 규칙

다음 변경 시 문서를 같이 갱신한다.

- 수집 구조 변경 -> SOURCE_AUDIT + board-crawling skill
- dedupe 변경 -> normalization-and-dedup skill + knowledge schema
- 답변 정책 변경 -> PRD + RAG skill
- review 정책 변경 -> PRD + review skill + review schema

이 규칙의 상위 기준은 루트 [`AGENTS.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/AGENTS.md)다.

## 15. 참고 링크

- FAQ: https://star.moe.go.kr/web/contents/m302001.do
- 일반 Q&A: https://star.moe.go.kr/web/contents/m30103.do
- OpenAI File Search: https://developers.openai.com/api/docs/guides/tools-file-search
