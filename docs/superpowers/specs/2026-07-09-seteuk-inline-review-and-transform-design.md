# 세특 생성 인라인 점검·수정 + 기존 세특 업로드/변형 설계

- 작성일: 2026-07-09
- 상태: 설계 확정(구현 계획 대기)
- 관련 기존 자산: 바탕화면 `AIEDAP/생기부도구개발`(FastAPI 세특 검수 도구, `app/analyzer.py`)

## 1. 배경과 목표

Seteuk의 세특 생성 탭에서 세특 텍스트를 만든 직후(또는 기존에 써둔 세특을 올린 직후)에,
바탕화면 `생기부도구개발` 검수 도구가 하던 **세특 전용 기재 점검을 인라인으로 수행**하고,
안전한 오류는 자동 수정, 판단이 필요한 항목은 표시(플래그)한다.
추가로 **AI 다듬기/변형** 버튼으로 교사가 세특을 손질할 수 있게 한다.

핵심 관점: 점검·자동수정·플래그·다듬기·변형은 모두 **세특 텍스트 1건**에 대해 도는 파이프라인이다.
따라서 텍스트가 어디서 왔든(생성 결과 / 업로드) **같은 파이프라인**에 태운다.

### 성공 기준
- 세특 생성 탭에서 생성 직후 자동으로 점검 결과가 보이고, 기계적 오류는 자동 반영된다.
- 기존 세특 학급 엑셀(.xlsx)을 드래그/클릭으로 올리면 학생별 칸에 적재되고 같은 점검을 받는다.
- 학생별로 여러 버전(원본/업로드본/다듬기본/변형본)을 `< >`로 오가며 보고 원하는 버전을 적용할 수 있다(유실 없음).
- AI 다듬기/변형은 **없는 사실을 새로 만들지 않는다**(사실·수치·성취 무추가). 교사가 버전을 골라야 반영된다.

## 2. 확정된 설계 결정

| 항목 | 결정 |
| --- | --- |
| 점검 시점·단위 | 생성 직후 **인라인(학생별)**, 세특 생성 탭 내부 |
| 수정 자동화 수위 | **안전(기계적) 오류만 자동 수정** + 나머지는 표시(플래그) + 교사 확인형 AI 버튼 |
| 연결 방식 | 규칙을 **Seteuk(TS)로 이식**(analyzer.py 미러). Python 서비스 호출 안 함 |
| 기존 세특 입력 | 세특 생성 탭에서 **학급 엑셀(.xlsx)** 드래그&드롭 + 클릭 업로드 |
| 업로드 충돌 처리 | 덮어쓰기 안 함 — **버전으로 추가**, `< n/m >` 네비게이터로 토글·적용 |
| AI 버튼 | **다듬기(polish)** = 표시 문제 반영 / **변형(transform)** = 표현만 바꾼 변형본 1개 |
| 맞춤법 | 재이식 안 함 — 기존 `/api/speller`(hanspell) 재사용 |

### 스코프 컷(제외/연기)
- **자치 임원 기간** 검사: 회장/부회장 날짜 설정 의존 + 교과세특 맥락 아님 → v1 제외.
- **중복 문장** 검사: 학생 간 비교라 인라인에 안 맞음 → **2단계(학급 단위 보조 점검)**로 연기.
- Python `생기부도구개발` 도구는 계속 **엑셀 일괄 검수** 용도로 별도 유지(대체하지 않음).

## 3. 이식 대상 규칙 (analyzer.py → TS)

원본: `app/analyzer.py`의 `analyze_cell_text(text, options, ...)`. 검사 순서와 동작을 그대로 옮긴다.

### 3-1. 자동 수정(기계적·결정적·안전) — 자동 반영
1. **연속 공백**: 2칸 이상 공백 → 1칸.
2. **마침표 뒤 띄어쓰기**: 마침표 뒤 다음 문장이 바로 붙으면 한 칸 삽입.
   - 예외: `2026.3.2.` 같은 **숫자/날짜 표기의 마침표는 문장 끝으로 보지 않음**.
3. **끝 마침표**: 문장 끝에 마침표가 없으면 추가.

### 3-2. 플래그(판단 필요·자동 수정 안 함) — 표시만
1. **글자수/NEIS byte**: 세부능력 및 특기사항 **500자 / 1500Byte** 초과 시 표시.
   - NEIS byte 계산: `\r`,`\n` = 1, ASCII(≤0x7F) = 1, 그 외(한글 등) = 3. 한도 byte = 글자수한도 × 3.
   - 필드 판별은 원본 `_field_character_limit` 규칙 이식(세부능력/세특 → 500, 행동특성/종합의견/행특 → 300).
2. **문장 길이**: 한 문장이 **120자** 초과 시 표시(자동 분리 안 함).
3. **기재 유의**: `SETUK_CAUTION_PATTERNS` + `POLICY_CAUTION_PATTERNS`를 **정규식+분류 라벨 데이터로 그대로 이식**.
   - 범주 예: 대회/수상·교외상, 외부 기업·업체·기관·상호명, 특정 대학명·강사명, 인증시험·자격증,
     논문·소논문, 도서출간, 지식재산권, 해외활동, 장학금, 부모 신상/직업, K-MOOC/MOOC/KOCW,
     방과후학교, 플랫폼·서비스명, 정부·공공기관, 모의고사·전국연합 성적 등.
   - `SETUK_CAUTION_PATTERNS`는 세특 열일 때만 적용(원본 `_is_setuk_column` 동일).
4. **관찰/개별성**: `GENERIC_OBSERVATION_PATTERNS` 이식(1인칭 표현, `나의`,`내가`,`이해함`,`할 수 있음`,`열심히 함` 등).
   - `소개함`,`발표함`,`태도를 보임`,`모습을 보임` 등 관찰 가능한 서술은 제외(원본과 동일).

> 규칙 **데이터(정규식·한도)**는 `patterns.ts` 한 곳에 모아 이식하고, 병렬 픽스처 테스트로 원본과 동치성을 강제한다.
> 이렇게 분리해 두면 이후 Python 도구와 데이터를 공유(하이브리드)하는 방향으로 확장하기 쉽다.

## 4. 아키텍처 / 컴포넌트

거의 순수 **추가(additive)**로 구성해 현재 다른 세션이 수정 중인 `M` 파일(`api/generate/route.ts`, `lib/auth/guards.ts` 등)을 건드리지 않는다.

### 신규 파일
- `src/lib/seteuk-rules/patterns.ts` — analyzer.py의 정규식·한도·라벨 상수 이식.
- `src/lib/seteuk-rules/analyze.ts` — `analyzeSeteukText(text, opts) → SeteukAnalysis`.
- `src/lib/seteuk-rules/types.ts` — `SeteukIssue`, `SeteukAutoFix`, `SeteukAnalysis`.
- `src/lib/seteuk-check.ts` — 규칙 검사 + 기존 speller를 묶어 레코드/상태 갱신(오케스트레이션).
- `src/lib/seteuk-excel-import.ts` — 업로드 .xlsx 파싱(`XLSX.read`→`sheet_to_json`) → `{ studentNo, name, content }[]`.
- `src/app/api/seteuk-refine/route.ts` — AI 다듬기/변형 엔드포인트(신규, `withTeacherAuth`).
- `src/components/VersionNavigator.tsx` — 학생별 `< n/m >` 버전 브라우징·적용.
- `src/components/SeteukUploadDropzone.tsx` — 드래그&드롭 + 클릭 업로드 영역.
- `src/components/SeteukReviewPanel.tsx` — 자동수정 요약·플래그 하이라이트·AI 버튼(생성 탭에 삽입).

### 변경 파일
- `src/app/write/page.tsx`(세특 생성 탭, `M` 아님) — 업로드 드롭존 + 점검 패널 + 버전 네비게이터 연결.
- `src/types/record.ts` — 아래 데이터 모델 확장.

### 재사용
- `src/lib/check-utils.ts`(불변식: **검사 실패를 '이상 없음'으로 기록 금지**), `performSpellCheckRequest`.
- `src/components/KeywordHighlighter.tsx`(플래그 하이라이트), `students/page.tsx`의 XLSX 임포트 패턴.
- OpenAI 인프라: `getOpenAIClient`, `OPENAI_STANDARD_MODEL`, `resolveSeteukSystemPrompt`, `getPromptCacheParams`.

## 5. 데이터 모델

`SubjectRecord`(`src/types/record.ts`) 확장:

```ts
export type SubjectRecordHistorySource =
  | 'ai' | 'manual' | 'expand' | 'shorten' | 'improve'
  | 'transform'   // AI 변형(표현 리라이트)
  | 'upload';     // 엑셀 업로드본

export interface SeteukVersion {
  id: string;
  content: string;
  source: SubjectRecordHistorySource;
  label: string;        // 표시용: '원본', '업로드본', 'AI 다듬기', 'AI 변형' 등
  timestamp: string;    // ISO
}

// SubjectRecord에 추가
versions?: SeteukVersion[];         // 버전 네비게이터의 원본 소스
activeVersionId?: string;           // 현재 적용 버전(= content와 일치)
checkResult?: {
  spellerErrors: number;            // 기존 필드
  forbiddenWords: number;           // 기존 필드
  cautionFlags?: number;            // 기재 유의 건수 (신규·선택)
  observationFlags?: number;        // 관찰/개별성 건수 (신규·선택)
  longSentences?: number;           // 120자 초과 문장 수 (신규·선택)
  charOverflow?: boolean;           // 500자/1500B 초과 여부 (신규·선택)
};
```

- `content`는 항상 **활성 버전의 내용**을 미러한다. `originalContent`/`history`는 하위호환 유지.
- 기존 레코드(`versions` 없음)는 로드 시 `content`로부터 단일 버전을 합성한다(마이그레이션).
- `checkResult`의 새 필드는 선택적(optional)이라 기존 데이터와 호환된다.

## 6. 데이터 흐름

### 6-1. 생성 → 점검 (인라인, 학생 1명)
1. 기존 `/api/generate`로 세특 생성 → `content`.
2. 도착 즉시 `analyzeSeteukText(content, { field: 'setuk' })` 실행(클라이언트, 네트워크 무관).
3. **자동수정(fixedText)**을 활성 버전 `content`에 반영, 적용 내역을 요약 표시.
4. **플래그**를 하이라이트로 표시 + 기존 `/api/speller` 맞춤법 검사.
5. `checkResult`/상태 갱신(모두 clean이면 '검토완료'). 원문은 버전으로 보존.

### 6-2. 엑셀 업로드 → 적재
1. 생성 탭 드롭존에 .xlsx 드롭/선택 → `seteuk-excel-import`가 파싱.
2. '세부능력 및 특기사항' 열 + '번호'/'이름' 헤더 인식 → 행별 `{ studentNo, name, content }`.
3. **번호/이름으로 명부 학생 매칭**.
   - 빈 칸 학생: 업로드 내용을 첫 버전으로 채움.
   - 이미 세특이 있는 학생: **덮어쓰지 않고** `source:'upload'` 버전 추가.
4. 각 적재분에 6-1의 점검 파이프라인 적용.

### 6-3. 버전 네비게이터
- 학생별 버전 목록을 `< n/m >`로 브라우징(라벨·시각 표시). 인접 버전 간 하이라이트 비교 가능.
- **[이 버전 적용]** → 해당 버전이 활성(`activeVersionId`,`content`)이 됨. 되돌리기는 화살표로 이전 버전 복귀(유실 없음).

### 6-4. AI 다듬기 / 변형
1. 교사가 [AI 다듬기] 또는 [AI 변형] 클릭.
2. `/api/seteuk-refine`에 `{ content(활성), mode, flags? }` 전달.
   - `mode:'polish'`: 전달된 플래그(기재유의 표현/초과분량/약한 관찰표현)만 최소 수정 — 삭제·일반화·압축·관찰가능 서술 치환. **새 사실·수치·성취·활동 추가 금지**. 500자/1500B 이내.
   - `mode:'transform'`: 의미·사실 불변, **어투·문장 구성만** 패러프레이즈. 새 정보 금지. 길이 유사 유지, 500자/1500B 이내.
3. 결과를 **새 버전으로 추가**(`source:'improve'` 또는 `'transform'`). 교사가 네비게이터에서 확인 후 적용.

## 7. AI 리파인 엔드포인트 (`/api/seteuk-refine`)

- `withTeacherAuth`로 감싼 신규 라우트(기존 `/api/generate` 미변경).
- 입력: `{ content: string; mode: 'polish' | 'transform'; flags?: SeteukIssue[]; maxOutputTokens?; reasoningEffort? }`.
- 시스템 지시(공통): 한국어 중학교 교과 세특, **입력에 없는 사실/수치/성취/활동/고유명 생성 절대 금지**, 결과는 세특 본문만 반환.
- 실패 시: 원문 유지, 에러 메시지 반환(새 버전 만들지 않음). API 키 없으면 안내.
- 모델/캐시: `OPENAI_STANDARD_MODEL` + `getPromptCacheParams` 재사용.

## 8. 오류 처리
- 규칙 검사는 로컬이라 네트워크 무관하되 방어적으로 래핑(예외 시 해당 학생만 건너뛰고 로그).
- 맞춤법/리파인 네트워크 실패: 기존 재시도·폴백 사용. **검사 실패를 '이상 없음'으로 기록하지 않는다**.
- 엑셀 파싱 실패/열 미인식: 서버 오류 대신 "필수 열(세부능력 및 특기사항, 번호/이름) 확인 후 다시 업로드" 안내.
- 명부에 없는 번호/이름: 매칭 실패 목록을 보여주고 무시(임의 학생에 잘못 적재 방지).

## 9. 검증 (4종 세트)
1. **단위 테스트**: `analyzeSeteukText`를 Python `analyzer.py`와 **병렬 픽스처**로 동치 검증.
   - 날짜 마침표 예외, NEIS byte 계산, 500/1500 한도, 문장 120자, 기재유의/관찰 패턴 히트, 자동수정 전/후 텍스트.
2. **빌드**: `next build` 통과.
3. **린트**: `eslint` 통과.
4. **런타임 스모크**(dev): 생성→점검 표시·자동수정 / 엑셀 업로드→매칭·버전 추가 / `< >` 토글·적용 / 다듬기·변형 왕복.

## 10. 제약 / 조율
- 구현은 **additive** 우선 — 현재 `M`(auth 가드 HOF 리팩터) 파일 미접촉. 그 작업이 머지된 뒤 재검증.
- 개인정보: 세특은 민감정보. 규칙 검사는 로컬에서 수행. 리파인은 기존 OpenAI 경로만 사용(추가 외부 전송 없음).

## 11. 향후(Phase 2, 이 스펙 범위 밖)
- 중복 문장(학급 단위) 보조 점검.
- 규칙 데이터의 Python↔TS 공유(하이브리드)로 사전 단일화.
- 자치 임원 기간 등 창체/자율활동용 점검(필요 시).
