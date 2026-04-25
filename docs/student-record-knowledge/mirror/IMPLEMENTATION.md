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
- 캐시 무시 최신 재수집 옵션(`--refreshCache`)
- 비밀글 분기
- Markdown/JSON 산출
- 최신 날짜 우선 dedupe와 선택적 FAQ 우선 옵션
- 대표 답변 기준 `sourceUrls[0]`/`sources[0]`/`source_documents.primary` 정렬
- 인사말/상투 문구를 제외한 `rule_summary` 추출
- `web` 앱 지식 로더 구현
- `web` 앱 상담 API 구현
- `web` 앱 생기부 점검 API 구현
- `web` 앱 상담/점검 통합 작업공간 구현
- `web` 앱 운영 API(`/api/admin/crawl`, `/api/admin/reindex`, `/api/admin/crawl-status`, `/api/admin/quality-report`) 구현

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
- [`web/src/app/api/admin/crawl/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/admin/crawl/route.ts)
- [`web/src/app/api/admin/reindex/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/admin/reindex/route.ts)
- [`web/src/app/api/admin/crawl-status/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/admin/crawl-status/route.ts)
- [`web/src/app/api/admin/quality-report/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/admin/quality-report/route.ts)
- [`web/src/app/counsel-chat/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/counsel-chat/page.tsx)
- [`web/src/app/record-review/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/record-review/page.tsx)
- [`web/src/app/write/page.tsx`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/write/page.tsx)
- [`web/src/lib/knowledge-base.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/lib/knowledge-base.ts)

운영 API 메모:

- `/api/admin/crawl`은 재수집 성공 후 `web/output/star-moe-knowledge-YYYY.json` 번들 스냅샷을 갱신하고 웹 프로세스의 지식 캐시를 초기화한다.
- `/api/admin/crawl`은 `KNOWLEDGE_PACKAGE_DIR`이 있으면 해당 경로를 쓰고, 없으면 기본 형제 폴더 `../student-record-knowledge`를 사용한다.

페이지 보조 기능:

- 상단 `GlobalNav`는 `학교 정보 -> 학생 관찰 기록 -> AI 세특 생성 -> 평가 점검` 순서로 고정한다.
- `평가 점검`은 탭에 `평가 점검 (개발중)`으로 표시하지만 비활성 상태로 렌더링하고, `/eval-check` 직접 접근은 `/dashboard`로 리다이렉트한다.
- 학습지 OCR route(`/ocr`)와 관련 코드는 유지하되, 현재는 `GlobalNav` 렌더링에서 제외해 화면 탭으로는 노출하지 않는다.
- `AI 세특 생성` 공통 앱 셸(`GlobalNav + Sidebar`) 안에서 `/write`, `/counsel-chat`, `/review`, `/export`를 사용자 탭으로 제공하고, 상담과 점검은 `/counsel-chat` 내부 모드 전환으로 통합한다.
- `/counsel-chat` 사용자 탭 라벨은 `생기부 상담 점검`으로 노출한다.
- 기존 `/record-review` 경로는 `/counsel-chat?mode=review`로 리다이렉트해 북마크와 기존 링크를 깨지 않게 유지한다.
- `/search-inspector`는 검색 품질 확인용 내부 진단 route로만 남기고 사용자 사이드바에서는 노출하지 않는다.
- URL query prefill 지원
- 세특 작성 탭의 `RAG 점검·개선` 버튼은 `/api/record-review`의 `includeImprovedDraft` 흐름을 재사용
- 세특 작성 탭의 `유사도` 버튼은 선택 학생 초안을 문장 단위로 비교하고, 다른 학생 간 90% 이상 동일한 문장만 모달에 노출한다.

## 4.4 교사 작업공간 컨텍스트 모델

웹앱에서 학생/수업/세특을 연결하는 기본 단위는 아래처럼 분리한다.

- 학생 명부: 학교/학년/반/번호/이름 기준의 학적 roster
- homeroom class: 명부 업로드 시 생성되는 학적 기준 반
- teaching class: 로그인한 교사의 `teacherKey + subject + semester + grade/class` 조합으로 생성되는 담당 수업 반
- observation: `studentId + teacherKey + teachingClassId`를 포함하는 수업 기록
- subject record: `studentId + teacherKey + teachingClassId + semester`를 포함하는 세특 초안/확정본

핵심 규칙:

- 학생은 학적 명부 기준으로 한 번만 등록하고 과목별로 중복 생성하지 않는다.
- 학교 전체 명부는 학교 단위 공유 저장소에 동기화하고, 같은 학교 사용자는 로그인 후 공용 명부를 자동으로 불러온다.
- 같은 학교에서 명부를 다시 업로드하면 기존 공용 명부와 `학교/학년/반/번호` 기준으로 병합하고, 동일 학생은 건너뛰며 이름 등 학적 정보가 달라진 경우만 갱신한다.
- 교사별 담당 학급은 명부에서 선택해 연결하며, 학생 목록은 teaching class의 학년/반 기준으로 동적으로 계산한다.
- 학생 관리 UI는 학교 명부 업로드와 teaching class 연결만 담당한다.
- 별도 `학생 관찰 기록` 섹션에서 학생 카드 보드(`/observation-board`)와 관찰 메모(`/observations`)를 제공한다.
- 학생 카드에서는 클릭으로 선택 상태를 토글하고, 더블클릭 시 `/observations`로 query prefill 이동한다.
- 여러 학생이 선택된 상태에서 선택된 카드 중 하나를 더블클릭하면 같은 teaching class 학생 ID들을 `studentIds` query로 넘겨 일괄 관찰 기록 작성 모드로 진입한다.
- `/observations`의 수동 입력 섹션은 선택된 학생별 row editor를 렌더링하고, 각 row는 학생명 헤더와 `date`, `lessonTopic`, 다중 선택 `tags`, `memo`를 관리한다.
- 수동 입력 row에서는 학년도/학년/반/번호 같은 중복 메타 필드를 다시 노출하지 않고, 태그는 버튼형 선택과 교사 직접 추가를 함께 제공한다.
- 학습 메모와 관찰 메모는 teaching class 단위로 저장한다.
- 세특 AI 생성 API는 현재 교사의 `teacherKey`와 `teachingClassId`를 전달하고, 같은 맥락의 관찰 메모만 불러온다.
- 로컬 개발 모드에서는 Google Sheets API 호출이 실패할 때 `.local-sheet-store.json`으로 자동 fallback해 웹앱 흐름을 중단하지 않는다.

## 4.5 OpenAI 모델/비전 기준

- 웹앱의 OpenAI 기반 생성, 점검, OCR, 채점 흐름은 모두 `gpt-5.4-mini`를 기본 모델로 사용한다.
- OCR, 루브릭 추출, 예비 채점, 일괄 채점, 평가 점검 구조 추출은 Responses API 멀티모달 입력을 사용하고, 이미지 파트는 `input_image`로 전달한다.
- `gpt-5.4-mini` 비전 입력은 공식 문서 기준 `low`, `high`, `auto` detail을 지원하므로, 현재 구현은 판독 안정성을 우선해 `detail: "high"`를 기본값으로 유지한다.
- 현재 웹앱의 관련 요청은 단일 Responses 호출 위주이며 assistant 메시지를 재주입하는 장기 에이전트 흐름이 아니므로 `phase` 필드는 적용하지 않는다. 추후 tool-heavy 장기 흐름으로 확장할 때만 `commentary` / `final_answer` round-trip을 검토한다.

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
- 최신 Q&A 반영 작업은 `--refreshCache`로 기존 캐시 읽기를 건너뛰고 같은 경로에 새 HTML을 덮어쓴다.

## 5.4 관찰 결과

2026-04-25 KST 전체 재수집 기준:

- 마지막 페이지: 278
- 전체 글: 3,330
- 공개 글: 1,502
- 비밀글: 1,828
- 답변 포함 공개 지식: 1,500
- canonical 지식/knowledge unit: 1,488
- 공개 미답변/작성중: 52

## 6. 정규화 및 중복 통합

## 6.1 정규화 원칙

- 원문 의미를 바꾸는 요약 금지
- 질문/답변/근거 분리
- 학교급/구분/상태/날짜 정규화
- `초등`, `중등`, `고등` 원천 라벨은 각각 `초등학교`, `중학교`, `고등학교`로 표준화
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
- 대표 답변으로 선택된 출처가 `sources[0]`, `sourceUrls[0]`, `source_documents`의 `primary: true` 항목에 일관되게 배치됨

현재 2026 데이터에서는 title-based 기준으로 11개 충돌 그룹이 관찰됐다.

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
- `sourceUrls[]` (`sourceUrls[0]`은 대표 답변 출처)

별도 산출물:

- `output/star-moe-knowledge-units-YYYY.json`

knowledge unit 핵심 필드:

- `knowledge_unit_id`
- `canonical_title`
- `canonical_question`
- `canonical_answer`
- `rule_summary`
- `school_level_scope`
- `category_scope`
- `policy_anchors[]`
- `source_documents[]` (`relation_type: "primary"` 항목은 `primary: true`)

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
- `improvedDraft` (optional when `includeImprovedDraft=true`)

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
- 배포된 `web` 앱은 `web/output/star-moe-knowledge-YYYY.json` 번들 스냅샷을 우선 읽고, 로컬 개발에서는 `../student-record-knowledge/output/...` 또는 `KNOWLEDGE_JSON_PATH`로 fallback한다.
- 모델 프롬프트에는 검색된 상위 근거만 넣고 전체 knowledge JSON 본문을 매 요청마다 그대로 주입하지 않는다.
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

UI 흐름:

- 교사는 `AI 세특 생성` 섹션에 머문 상태로 사이드바에서 `학생부 상담·점검` 탭을 선택한 뒤 `질문 답변` 모드로 들어간다.
- 별도 단독 레이아웃으로 이탈하지 않고 같은 앱 셸, 같은 세션, 같은 탐색 구조를 유지한다.

응답 원칙은 [`skills/rag-answering.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/rag-answering.md)를 따른다.

## 10. 생기부 점검 구현 흐름

1. 텍스트 입력
2. 문장/절 단위 분해
3. 관련 근거 검색
   - 먼저 학교급/영역 필터로 찾고, 결과가 없으면 같은 학교급 기준 전체 공개 근거로 한 번 더 검색
4. 위험 항목 분류
5. 이유/근거/수정 방향 생성
6. structured review result 반환
7. 호출자가 요청하면 같은 공개 근거로 `improvedDraft` 생성

## 10.1 세특 유사도 검사 흐름

1. `write` 탭에서 선택 학생 또는 현재 필터 학생의 세특 초안을 수집
2. 초안을 문장 단위로 분해하고 공백/문장부호를 정규화
3. 서로 다른 학생 쌍만 pairwise 비교
4. 문장 유사도를 계산해 0.90 이상인 문장만 중복 의심 문장으로 채택
5. 모달에는 학생 쌍별 최고 유사도와 매칭된 문장만 보여주고, 세특 전체 점수는 판단 기준으로 사용하지 않는다.

UI 흐름:

- 교사는 `AI 세특 생성` 섹션에 머문 상태로 사이드바에서 `학생부 상담·점검` 탭을 선택한 뒤 `문구 점검` 모드로 전환한다.
- 세특 작성과 학생부 상담·점검은 동일한 앱 셸을 공유해 기능 전환 시 다른 사이트처럼 보이지 않게 유지한다.
- 검색 점검은 같은 섹션의 내부 진단 route로만 유지하고, 일반 사용자에게는 탭으로 노출하지 않는다.

점검 원칙은 [`skills/student-record-review.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/skills/student-record-review.md)를 따른다.

## 10.2 세특 작성 컨텍스트 구현 흐름

1. 교사 로그인 시 `teacherKey` 생성
2. 선택적으로 데모 시드 버튼으로 샘플 roster/teaching class/student 데이터를 즉시 생성
3. 학생 명부 업로드 시 학적 roster와 homeroom class를 생성하고 학교 단위 공용 저장소에도 반영
4. 교사가 담당 학급을 선택하면 teaching class 생성
5. 관찰 메모 저장 시 `teacherKey`, `teachingClassId`, `lessonTopic`, `subjectName` 저장
6. 세특 생성 호출 시 `studentId`, `teacherKey`, `teachingClassId`로 관찰 메모 필터링
7. AI 프롬프트에 학습 메모 + 수업 기록 + OCR 평가 컨텍스트를 함께 주입
8. 작성된 세특은 `write` 탭에서 선택 후 `RAG 점검·개선`을 실행해 공개 근거 기반 개선본으로 갱신 가능

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

운영 보안:

- `/api/admin/*`는 `ADMIN_API_TOKEN`이 설정된 환경에서 `Authorization: Bearer <token>` 또는 `x-admin-token` 헤더를 요구한다.
- 로컬 개발(`NODE_ENV !== "production"`)에서는 토큰 없이도 호출할 수 있으나, 배포 환경에서는 `ADMIN_API_TOKEN` 미설정 시 admin API가 503을 반환한다.

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
