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
- 보수적 질문 그룹 키 기반 dedupe, 최신 날짜 우선 대표 답변, 선택적 FAQ 우선 옵션
- 대표 답변 기준 `sourceUrls[0]`/`sources[0]`/`source_documents.primary` 정렬
- 인사말/상투 문구를 제외한 `rule_summary` 추출
- `web` 앱 지식 로더 구현
- `web` 앱 상담 API 구현
- `web` 앱 생기부 점검 API 구현
- `web` 앱 상담/점검 통합 작업공간 구현
- `web` 앱 운영 API(`/api/admin/crawl`, `/api/admin/reindex`, `/api/admin/crawl-status`, `/api/admin/quality-report`) 구현
- `web` 앱 상단 `학생 데이터` 탭과 `/student-data` 화면 제거
- 교사별 학생 개별 데이터, 학교 공용 쿠키 원장/상품 API는 레거시 저장소 호환용으로 유지
- 세특 생성 시 별도 학생 데이터 탭 입력값 주입 제거
- 세특 역량 분석 색상 체크의 원문 기준 렌더링과 행 단위 분석 상태 표시 구현
- 성호중학교 전용 로그인과 2026 명렬표 기반 학급 선택 등록 구현

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
- [`web/src/app/api/student-data/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/student-data/route.ts)
- [`web/src/app/api/cookies/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/cookies/route.ts)
- [`web/src/app/api/cookie-rewards/route.ts`](/Users/pbj95/Desktop/cursor/seteuk(2026)/web/src/app/api/cookie-rewards/route.ts)
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
- 세특 작성 기본 시스템 프롬프트는 `web/src/lib/prompts/seteuk.ts`의 `SETEUK_DEFAULT_SYSTEM_PROMPT`가 단일 소스이며, `/api/generate`, `src/lib/write-logic.ts`, `/settings/ai`가 같은 값을 참조한다.
- 프롬프트 버전은 `strict-observation-v1`로 기록하고, 브라우저 저장 키는 `ai_system_prompt`와 `ai_system_prompt_version`을 사용한다. 저장값이 없거나 예전 기본 프롬프트와 정확히 일치하면 새 기본 프롬프트로 해석한다.
- 세특 생성 프롬프트는 제공된 관찰 데이터만 근거로 삼고 점수/등급/등수/수상/시험 문항 표현을 출력에서 배제한다. OCR 컨텍스트는 점수 자체보다 성취기준, 기준 요소, 피드백 텍스트 중심으로 전달한다.
- 별도 상단 `학생 데이터` 탭과 `/student-data` 화면은 제공하지 않는다.
- 레거시 학생 데이터/쿠키 API는 저장소 호환을 위해 남기되, 현재 사용자 탭과 세특 생성 컨텍스트에서는 사용하지 않는다.
- 로그인은 `학교=성호중학교`, `아이디=본인 한글 이름`, `비밀번호=123123`만 허용한다.
- 로그인 성공 후 `/students`로 이동해 2026 성호중학교 공용 명렬표에서 학급을 선택 등록한다.
- 성호중학교 모드의 학생 관리 화면은 업로드 드롭존을 숨기고, 공용 명렬표 상태와 학급 등록 UI를 우선 표시한다.

## 4.4 교사 작업공간 컨텍스트 모델

웹앱에서 학생/수업/세특을 연결하는 기본 단위는 아래처럼 분리한다.

- 학생 명부: 학교/학년/반/번호/이름 기준의 학적 roster
- homeroom class: 명부 업로드 시 생성되는 학적 기준 반
- teaching class: 로그인한 교사의 `teacherKey + subject + semester + grade/class` 조합으로 생성되는 담당 수업 반
- observation: `studentId + teacherKey + teachingClassId`를 포함하는 수업 기록
- subject record: `studentId + teacherKey + teachingClassId + semester`를 포함하는 세특 초안/확정본
- legacy student data: `studentId + teacherKey + teachingClassId + semester`를 포함하는 과거 교사 전용 성적/메모/멘토링 데이터
- legacy cookie ledger/reward: `school + studentId` 기준으로 공유되는 과거 학교 공용 쿠키 거래/상품 데이터

핵심 규칙:

- 학생은 학적 명부 기준으로 한 번만 등록하고 과목별로 중복 생성하지 않는다.
- 학교 전체 명부는 학교 단위 공유 저장소에 동기화하고, 같은 학교 사용자는 로그인 후 공용 명부를 자동으로 불러온다.
- 성호중학교의 2026 1/2/3학년 명렬표는 `scripts/import-seongho-roster.mjs`로 공유 저장소의 `학생` 시트에 반영한다.
- 성호중학교 로그인 세션은 `seongho-school` auth mode로 표시하고, 인증 화면을 우회한 오래된 로컬 세션은 인증 페이지로 되돌린다.
- 같은 학교에서 명부를 다시 업로드하면 기존 공용 명부와 `학교/학년/반/번호` 기준으로 병합하고, 동일 학생은 건너뛰며 이름 등 학적 정보가 달라진 경우만 갱신한다.
- 교사별 담당 학급은 명부에서 선택해 연결하며, 학생 목록은 teaching class의 학년/반 기준으로 동적으로 계산한다.
- 학생 관리 UI는 학교 명부 업로드와 teaching class 연결만 담당한다.
- 상단 `학생 관찰 기록` 탭은 `/observation-board-2`의 독립형 교실 대시보드로 연결한다.
- 기존 `/observation-board`와 `/observations` 직접 진입은 `/observation-board-2`로 리다이렉트한다.
- `학생 관찰 기록`(`/observation-board-2`)은 예시 PNG 톤의 독립형 교실 대시보드이며, 공통 앱 셸 대신 자체 왼쪽 일러스트 레일과 교실형 헤더를 사용한다.
- `/observation-board-2`의 기본 진입 화면은 `학생 관찰 기록`이며, 상단 내부 탭/가로로 긴 학급 칩/검색바 없이 PNG형 멘토·멘티 구성판, 차시별 △/○ 활동 기록 표, 활동 기록 안내 배너를 바로 보여준다.
- `/observation-board-2`의 기본 멘토 화면은 전체 담당 학급 합산 옵션을 노출하지 않고, 담당 학급 하나를 고르는 compact select로 멘토·멘티 카드, 활동 기록표, 학생 목록 트레이의 범위를 결정한다.
- `/observation-board-2`의 왼쪽 레일은 `mentor | growth | stats | notice | settings | records` 내부 상태를 전환하며, 사이드바에는 `학생 관찰 기록`, `성장 기록`, `통계 보기`, `알림장`, `설정`만 노출한다. 1120px 이하에서도 이 레일을 상단 가로 메뉴로 접지 않고 PNG 기준의 왼쪽 세로 사이드바로 유지한다.
- `/observation-board-2`의 `records` 모드는 기존 관찰 기록 흐름을 교실 대시보드 디자인 안으로 통합하되, 기본 사이드바에서 별도 항목으로 노출하지 않고 `성장 기록` 내부 작성 모달 또는 `설정` 보조 버튼으로 진입한다.
- `/observation-board-2`의 `growth` 모드는 `/api/observations`의 관찰 메모만으로 학생별 누적 타임라인을 구성하고, 담당 학생별 관찰 공백/쿠키 수/△·○ 반응 요약 카드와 선택 학생 대상 `성장 기록 작성` 모달을 함께 렌더링한다.
- `성장 기록 작성` 모달은 기준 이미지와 맞춘 고정 폭/높이의 dimmed overlay dialog이며, 제목 아이콘, 3단계 stepper, 선택 학생 동물 칩, 중립 상태로 시작하는 쿠키 선택 카드 3개, 선택 메모 박스, 좌우 하단 버튼을 CSS로 구성한다.
- `/observation-board-2`의 `stats` 모드는 관찰 기록 수, 학생별 기록 수, 태그 빈도, 최근 기록일, 현재 화면의 △/○ 표시 개수, 기록 우선 학생, 모둠별 활동 균형을 카드와 막대형 차트로 계산한다.
- `/observation-board-2`의 `stats` 모드는 compact 학급 선택 메뉴를 제공하며, 진입 시 담당 학급 하나를 기본 범위로 잡아 전체 담당 학급의 모둠이 한 화면에 모두 펼쳐지지 않게 한다.
- `/observation-board-2`의 `notice` 모드는 서버 API 없이 `observation-board-2-notices:${teacherKey}` localStorage 키로 공지 작성/완료 상태를 유지한다.
- `/observation-board-2`의 멘토·멘티 패널, 활동 기록 패널, 학생 목록 트레이는 콘텐츠가 늘어날 때 내부 스크롤을 사용해 PNG형 첫 화면 구조가 무너지지 않게 하며, `모둠 추가` 버튼으로 빈 멘토/멘티 슬롯을 만들 수 있다.
- `/observation-board-2`는 담당 학급에 속하지 않는 학생과 샘플 학생을 멘토·멘티, 관찰 작성, 성장 기록, 통계 대상에서 제외한다.
- `/observation-board-2`는 `public/fonts/MaplestoryLight.ttf`, `public/fonts/MaplestoryBold.ttf`를 `@font-face`로 로드하고, 기본 교실 대시보드 전체에 Maplestory 글꼴을 적용한다.
- `/observation-board-2`의 멘토·멘티 배치는 React local state로 관리하며, HTML5 drag/drop으로 학생 토큰 또는 학생 목록 항목을 멘토/멘티 슬롯에 놓으면 기존 배치를 교체하거나 이동한다.
- `/observation-board-2`의 차시 목록은 React state와 `observation-board-2-sessions:${teacherKey}` localStorage 키로 관리하며, 표 헤더의 날짜/내용 입력과 `+` 차시 추가 버튼으로 수정한다.
- `/observation-board-2`의 차시별 △/○ 활동 표시는 `observation-board-2-marks:${teacherKey}` localStorage 키로 보존하고, 멘토·멘티 배치는 `observation-board-2-mentor-assignments:${teacherKey}`에 학급별로 보존한다.
- `/observation-board-2`의 차시별 활동 표시는 기본값을 빈칸으로 두며, 교사가 빈칸/△/○ 상태를 바꿀 때 빈칸 0개, △ 참여함 1개, ○ 매우 잘함 2개 규칙으로 이전 상태와 새 상태의 쿠키 차액을 `/api/cookies`에 기록한다.
- 관찰 기록 작성은 `/observation-board-2` 내부의 `records` 모드에서 학급/검색 필터, 학생 다중 선택, 공통 날짜/수업 주제/태그, 학생별 관찰 메모 입력으로 처리한다.
- 예전 카드형 보드와 `/observations` 수동 작성 화면은 상단 탭에서 제거하고, 직접 URL 접근 시 새 `학생 관찰 기록` 화면으로 이동시킨다.
- 수동 입력 row에서는 학년도/학년/반/번호 같은 중복 메타 필드를 다시 노출하지 않고, 공통 태그와 개별 태그 모두 버튼형 선택과 교사 직접 추가를 함께 제공한다.
- 학습 메모와 관찰 메모는 teaching class 단위로 저장한다.
- 세특 AI 생성 API는 현재 교사의 `teacherKey`와 `teachingClassId`를 전달하고, 같은 맥락의 관찰 메모를 불러오며 브라우저에 저장된 학생별 활동판 △/○ 기록을 해석한 `derivedSummary`를 요청 본문으로 함께 받는다.
- 세특 AI 생성은 `/api/student-data`를 조회하지 않고 관찰 메모, 학생 관찰 기록 활동판의 멘토·멘티 활동 해석 요약, 학습 데이터, OCR 평가 컨텍스트만 프롬프트에 추가한다.
- 쿠키 원장과 상품 데이터는 세특 생성 컨텍스트에 넣지 않는다.
- 로컬 개발 모드에서는 Google Sheets API 호출이 실패할 때 `.local-sheet-store.json`으로 자동 fallback해 웹앱 흐름을 중단하지 않는다.

## 4.6 레거시 학생 데이터와 쿠키 모델

Google Sheets 저장소에는 과거 데이터 호환을 위해 다음 시트를 유지한다. 현재 상단 탭이나 세특 생성 흐름에서는 이 저장소를 조회하지 않는다.

- `학생데이터`: `id, school, teacherKey, classId, semester, studentId, kind, title, occurredAt, includeInAi, payloadJson, createdAt, updatedAt`
- `쿠키원장`: `id, school, studentId, amount, type, reason, rewardId, teacherKey, createdAt`
- `쿠키상품`: `id, school, name, cost, active, createdAt, updatedAt`

레거시 저장 규칙:

- `kind`는 `note`, `grade`, `mentor_match`를 사용한다.
- 성적 payload는 `examName, examDate, score, maxScore, level, memo`를 저장한다.
- 멘토링 payload는 `mentorStudentId, menteeStudentId, memo`를 저장한다.
- 같은 교사/학급/학기에서 한 멘티는 하나의 멘토 매칭만 유지한다.
- 멘토·멘티 활동판 자동 쿠키 반영은 `award` 거래로 증가분을 남기고, 표시를 낮추거나 빈칸으로 되돌릴 때는 음수 `adjust` 거래로 차감분을 남긴다.
- 쿠키 교환은 잔액이 충분할 때만 원장에 `redeem` 거래를 추가한다.
- 신규 사용자 흐름에서는 `/student-data` 화면과 쿠키 관리 UI를 노출하지 않는다.

## 4.7 Supabase 저장소 전환

- 웹앱은 `SUPABASE_URL` 또는 `SUPABASE_PROJECT_ID`, 그리고 서버 전용 `SUPABASE_SECRET_KEY`가 설정되면 Google Sheets 대신 Supabase를 기본 저장소로 사용한다.
- 기존 `src/lib/sheets/*` 호출 계약은 유지하고, `sheet_rows(sheet_name, row_index, cells)` 호환 테이블에 기존 시트 행을 JSONB 배열로 저장한다.
- 브라우저에 있던 교사 작업공간 상태는 `/api/workspace-state`, 관찰판 차시/표시/멘토배치/공지 상태는 `/api/observation-board-state`를 통해 `app_state_documents`에 동기화한다.
- 성호중학교 로그인은 기존 입력 방식 그대로 유지하되, 성공 시 서버에서 서명된 HTTP-only `seteuk-session` 쿠키를 발급하고 저장 API는 이 세션의 학교/교사 범위를 검사한다.
- 기존 Google Sheets 데이터는 `scripts/migrate-google-sheets-to-supabase.mjs`로 Supabase `sheet_rows`에 이관한다.
- Supabase 원격 마이그레이션에는 프로젝트 DB 비밀번호와 CLI/관리 토큰이 필요하며, 노출된 토큰은 폐기 후 새 값으로 환경변수에만 보관한다.

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
- canonical 지식/knowledge unit: 1,451
- 공개 미답변/작성중: 51

## 6. 정규화 및 중복 통합

## 6.1 정규화 원칙

- 원문 의미를 바꾸는 요약 금지
- 질문/답변/근거 분리
- 학교급/구분/상태/날짜 정규화
- `초등`, `중등`, `고등` 원천 라벨은 각각 `초등학교`, `중학교`, `고등학교`로 표준화
- 비밀글은 metadata only

## 6.2 중복 판단 기준

현재 구현 기본값:

- 제목/질문 기반 보수적 질문 그룹 키 매칭
- 제목이 비어 있으면 질문 본문 사용
- `(재상담)` 접두어, 공백/문장부호, 제목 끝의 `문의/관련/질문/가능 여부` 같은 일반 표현은 같은 질문 후보로 정규화
- 학교급과 구분이 완전히 무관하면 자동으로 같은 그룹에 넣지 않음

대표 규칙:

- 동일 질문 + 동일 답변: 1건으로 통합
- 동일 질문 + 다른 답변: version conflict
- 기본은 최신 날짜 우선
- 필요 시 운영 옵션으로 FAQ 우선 가능
- 대표 답변으로 선택된 출처가 `sources[0]`, `sourceUrls[0]`, `source_documents`의 `primary: true` 항목에 일관되게 배치됨

현재 2026 데이터에서는 보수적 질문 그룹 키 기준으로 46개 중복/충돌 그룹이 관찰됐다.

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
- 로컬 lexical retrieval은 공백/문장부호 차이로 같은 질문이 밀리지 않도록 compact match 점수를 함께 사용한다.
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

1. 교사 로그인 시 성호중학교/한글 이름/비밀번호를 검증하고 `teacherKey` 생성
2. 성호중학교 공용 명렬표를 `/api/students?school=성호중학교`로 불러옴
3. 일반 학교 명부 업로드 시 학적 roster와 homeroom class를 생성하고 학교 단위 공용 저장소에도 반영
4. 교사가 담당 학급을 선택하면 teaching class 생성
5. 관찰 메모 저장 시 `teacherKey`, `teachingClassId`, `lessonTopic`, `subjectName` 저장
6. 세특 생성 호출 시 `studentId`, `teacherKey`, `teachingClassId`로 관찰 메모 필터링
7. `/write` 클라이언트는 `observation-board-2-sessions:${teacherKey}`, `observation-board-2-marks:${teacherKey}`, `observation-board-2-mentor-assignments:${teacherKey}`에서 선택 학생의 활동판 기록과 역할 맥락을 읽어 성실성, 활동 지속성, 관계 참여, 역할 수행, 성장 흐름 중심 `derivedSummary`를 만든 뒤 `observationBoardContext`로 전달
8. AI 프롬프트에 학습 메모 + 수업 기록 + 멘토·멘티 활동 해석 요약 + OCR 평가 컨텍스트를 함께 주입하되, `strict-observation-v1` 기본 프롬프트로 차시명/△·○ 표시의 단순 나열, 점수/등급/시험 문항 표현, 관찰되지 않은 사실 창작을 금지한다.
9. 작성된 세특은 `write` 탭에서 선택 후 `RAG 점검·개선`을 실행해 공개 근거 기반 개선본으로 갱신 가능
10. 별도 학생 데이터 탭 입력값은 조회하지 않는다.
11. 생성 후 역량 분석은 행 단위 또는 일괄로 실행하며, 세특 원문 기준 지식·과정·태도 색상 밑줄과 비율을 표시
12. `/write` 화면은 제공된 AI 세특 작성기 스크린샷을 기준으로 넓은 앱 셸, 교사/알림 상단 영역, 반 선택 칩 툴바, AI/RAG/맞춤법/금지어/역량/삭제 버튼, 프롬프트형 AI 입력/세특 내용 셀, 10명 단위 페이지네이션을 렌더링한다.

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
