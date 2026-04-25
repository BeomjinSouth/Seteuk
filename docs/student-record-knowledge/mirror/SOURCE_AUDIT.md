<!--
This file is mirrored from ../student-record-knowledge/docs.
Run `npm run sync:knowledge-docs` from the web repo to refresh it.
-->

# SOURCE_AUDIT
# Source Audit

## 1. 대상 소스

### 학생부 FAQ

- URL: `https://star.moe.go.kr/web/contents/m302001.do`
- 성격: 정책형/정리형 질의응답
- 구조: 목록 페이지에 질문만 있고 답변은 AJAX로 로드됨

### 학생부 Q&A > 일반

- URL: `https://star.moe.go.kr/web/contents/m30103.do`
- 성격: 사례형/상황형 질의응답
- 구조: 목록 페이지 + 상세 페이지 + 비밀글 혼재

## 2. 실제 수집 관찰 결과

2026-04-25 KST 전체 재수집 기준:

- FAQ 항목 수: 50
- Q&A 마지막 페이지: 278
- Q&A 전체 글 수: 3,330
- 공개 글 수: 1,502
- 비밀글 수: 1,828
- 답변 포함 공개 지식: 1,500
- title-based dedupe 후 canonical 지식: 1,488
- 공개 미답변/작성중: 52
- 접근 불가/비밀글 메타데이터: 1,828

## 3. 구조 관찰

### FAQ

- 목록에는 `.faq-item`이 노출된다.
- 질문 제목/학교급/구분은 목록 HTML에 있다.
- 실제 질문/답변 본문은 `/web/board/getQnaView.do`에서 불러온다.
- FAQ 항목별 날짜는 공개되지 않는다.

### 일반 Q&A

- 목록 카드는 `a.in_box` 단위로 구성된다.
- 상세 이동은 `fn_goView(id, ..., isSecret)` 패턴을 사용한다.
- 마지막 페이지는 `fn_egov_link_page(n)`로 판별 가능하다.
- 상세는 `schM=view&id=...` 파라미터로 접근한다.

## 4. 비밀글 처리 정책

- 목록 메타데이터는 수집 가능
- 상세 본문은 공개되지 않음
- 비밀글 상세 접근 시 경고 스크립트만 반환됨
- 따라서 `metadata only`로 유지하고 RAG 근거에서는 제외

## 5. 데이터 우선순위 결론

### FAQ

- 정책형 대표 근거
- RAG에서 우선 근거
- Q&A 충돌 시 우선 기준 후보

### 공개 Q&A

- 사례형 보조 근거
- FAQ를 보완
- 동일 질문의 연도별/상황별 차이를 확인하는 용도

### 비밀글

- 통계/운영 보조 메타데이터
- 검색 결과 근거에 직접 사용 금지

## 6. 중복 및 버전 관찰

2026-04-25 재수집 데이터 전체에서 title-based 기준으로 충돌 그룹 11건이 확인됐다.

- 봉사활동 실적 입력
- 개명
- 창의적 체험활동상황에서 '시간'이 삭제된다는 것의 의미
- 위탁학생 출결관리
- 정원 외 학적관리
- 창의적 체험활동 누가기록
- 전출학생
- 면제 처리 날짜
- 출결특기사항
- 출결 특기사항
- 진로활동 특기사항 기재

처리 원칙:

- 기본은 최신 날짜 우선
- 필요 시 운영 옵션으로 FAQ 우선 가능
- 학교급/연도 차이가 크면 version 유지
- 원천 라벨이 `초등`, `중등`, `고등`으로 짧게 내려오면 각각 `초등학교`, `중학교`, `고등학교`로 표준화

## 7. 구현 시 주의점

- 질문 제목만으로 과도한 통합 금지
- 인접 글 제목은 본문으로 저장하지 않음
- FAQ 날짜 부재를 설계에 반영해야 함
- 게시글 수는 실시간으로 변할 수 있으므로 관측 시점 기록 필요
- 최신화 재수집에는 기존 HTML 캐시가 새 글을 가리지 않도록 `--refreshCache`를 사용

## 8. 관련 파일

- 수집기: [`src/scrape-star-moe.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/src/scrape-star-moe.ts)
- 출력 JSON: [`output/star-moe-knowledge-2026.json`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/output/star-moe-knowledge-2026.json)
- 출력 Markdown: [`output/star-moe-knowledge-2026.md`](/Users/pbj95/Desktop/cursor/seteuk(2026)/student-record-knowledge/output/star-moe-knowledge-2026.md)
