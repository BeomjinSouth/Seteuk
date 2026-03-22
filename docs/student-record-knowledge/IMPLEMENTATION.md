# Student Record Knowledge Implementation

## 데이터 소스

- `../student-record-knowledge/output/star-moe-knowledge-2026.json`
- `../student-record-knowledge/output/star-moe-knowledge-units-2026.json`

## 현재 구현

### 로더

- `src/lib/knowledge-base.ts`
- knowledge JSON 로드
- school level / category / year 필터
- lexical retrieval + synonym boost
- concept constraint 기반 후처리

### API

- `src/app/api/knowledge/meta/route.ts`
- `src/app/api/search/route.ts`
- `src/app/api/counsel-chat/route.ts`
- `src/app/api/record-review/route.ts`

### UI

- `src/app/counsel-chat/page.tsx`
- `src/app/record-review/page.tsx`
- 각 페이지에서 raw match list 표시
- query string prefill 지원
- GNB / Sidebar / Dashboard quick action 연결

## 응답 정책

- 공개 근거가 없으면 추정 답변 대신 fallback 또는 manual review 반환
- 상담은 citations 포함
- 점검은 issue list, risk level, recommended rewrite 포함

## 다음 단계

1. lexical retrieval을 vector search로 고도화
2. 기존 네비게이션과 정식 연결
3. docs mirror 자동화
