# 짝모둠(멘토·멘티) 활동 반영 완화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관찰 메모·학습 데이터가 없고 짝모둠(멘토·멘티) 활동판 기록만 있을 때, 조 번호·역할·활동명이 세특 문장의 중심 소재가 되지 않고 일반적인 수업 참여 태도 문장으로 대체되도록 기본 프롬프트를 완화한다.

**Architecture:** 프롬프트 텍스트만 수정한다. 규칙의 원천은 시스템 프롬프트(`src/lib/prompts/seteuk.ts`)이고, `src/app/api/generate/route.ts`의 `[멘토·멘티 활동 해석]` 섹션 삽입 지시문은 활동판 데이터 바로 옆에서 같은 규칙을 재확인한다. 코드 로직·타입·데이터 흐름·localStorage 스키마는 변경하지 않는다.

**Tech Stack:** Next.js 16 (App Router), TypeScript, OpenAI Responses API. 테스트 프레임워크 없음 — 검증은 `eslint`, `next build`, `tsc --noEmit`, 그리고 `/api/generate` 런타임 호출로 수행한다.

## Global Constraints

- 기본 시스템 프롬프트(`SETEUK_DEFAULT_SYSTEM_PROMPT`)만 수정한다. 레거시 프롬프트 상수(`LEGACY_*`)와 커스텀 프롬프트 경로는 건드리지 않는다.
- 결정 방향은 "거의 배제": 상위 근거(관찰 메모·학습 데이터)가 없으면 조 번호·역할("멘토"/"멘티"/"n조")·활동명("서로 알아가기"/"관계 형성" 등)·차시 구체 정보를 최종 문장에 쓰지 않는다.
- 상위 근거가 하나라도 있으면 기존 동작(활동판 해석을 태도 보조 근거로 반영)을 유지한다 — 회귀 금지.
- route.ts 지시문과 시스템 프롬프트 규칙은 서로 모순되지 않게 같은 표현을 쓴다.
- 프롬프트 캐시·추적 일관성을 위해 `SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION`을 `cross-curricular-seteuk-v2.4` → `cross-curricular-seteuk-v2.5`로 올린다.

## File Structure

- `src/lib/prompts/seteuk.ts` — 기본 시스템 프롬프트. `[핵심 목표]`·`[근거 우선순위]` 수정, 버전 상수 bump. (규칙의 단일 원천)
- `src/app/api/generate/route.ts:276-280` — `[멘토·멘티 활동 해석]` 섹션 삽입 지시문 교체. (활동판 데이터 옆 재확인)

---

### Task 1: 시스템 프롬프트 규칙 완화 + 버전 bump

**Files:**
- Modify: `src/lib/prompts/seteuk.ts:1` (버전 상수)
- Modify: `src/lib/prompts/seteuk.ts:54-68` (`[핵심 목표]`, `[근거 우선순위]`)

**Interfaces:**
- Consumes: 없음 (기존 상수 텍스트 수정)
- Produces: 수정된 `SETEUK_DEFAULT_SYSTEM_PROMPT` (내용만 변경, export 시그니처 불변), `SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION = 'cross-curricular-seteuk-v2.5'`

- [ ] **Step 1: 버전 상수 bump**

`src/lib/prompts/seteuk.ts:1` 을 교체한다.

기존:
```ts
export const SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION = 'cross-curricular-seteuk-v2.4';
```

변경:
```ts
export const SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION = 'cross-curricular-seteuk-v2.5';
```

- [ ] **Step 2: `[핵심 목표]` 적용 대상 명시**

`src/lib/prompts/seteuk.ts:54-56` 의 `[핵심 목표]` 블록을 교체한다.

기존:
```
[핵심 목표]

학생별 관찰 근거가 짧더라도 "수업에 열심히 참여함" 수준으로 축소하지 않는다. 학년, 학기, 교과, 선택 단원 context가 있으면 이를 수업 배경으로 삼아 무엇을 읽고, 구분하고, 계산하고, 관찰하고, 비교하고, 설명했는지 교과 내용이 보이게 쓴다. 다만 context는 성취 근거가 아니므로, 학생별 행동이 입력된 범위 안에서만 연결한다.
```

변경:
```
[핵심 목표]

관찰 메모, 학생별 입력 자료, 수행 결과가 짧더라도 "수업에 열심히 참여함" 수준으로 축소하지 않는다. 이 "축소하지 않는다" 규칙은 위 세 자료(우선순위 1~2)에만 적용하며, 멘토·멘티 활동 해석에는 확장하지 않는다. 학년, 학기, 교과, 선택 단원 context가 있으면 이를 수업 배경으로 삼아 무엇을 읽고, 구분하고, 계산하고, 관찰하고, 비교하고, 설명했는지 교과 내용이 보이게 쓴다. 다만 context는 성취 근거가 아니므로, 학생별 행동이 입력된 범위 안에서만 연결한다.
```

- [ ] **Step 3: `[근거 우선순위]`에 멘토·멘티 3순위 대체 규칙 추가**

`src/lib/prompts/seteuk.ts:64` 의 3순위 줄을 교체한다.

기존:
```
3. 멘토·멘티 활동 해석처럼 활동 흐름에서 추출된 참여 양상
```

변경:
```
3. 멘토·멘티 활동 해석처럼 활동 흐름에서 추출된 참여 양상 (보조 근거)
```

이어서 `src/lib/prompts/seteuk.ts:68` 의 문단 바로 앞(우선순위 목록과 기존 문단 사이)에 다음 문단을 새로 추가한다.

추가할 문단:
```
멘토·멘티 활동 해석은 그 자체만으로 문장의 중심 소재가 될 수 없다. 1~2순위 근거(관찰 메모, 학생별 입력 자료, 수행 결과)가 하나라도 있으면 활동 해석을 성실성·책임감·협력 태도 같은 태도를 뒷받침하는 짧은 보조 표현으로만 쓴다. 1~2순위 근거가 전혀 없으면 조 번호, 역할("멘토", "멘티", "n조"), 활동명("서로 알아가기", "관계 형성" 등), 차시 구체 정보를 최종 문장에 쓰지 말고, "수업 활동에 꾸준히 참여함", "제시된 활동에 성실히 임함"처럼 일반적인 수업 참여 태도 문장으로만 짧게 서술한다.
```

- [ ] **Step 4: lint + typecheck**

Run: `npx eslint src/lib/prompts/seteuk.ts && npx tsc --noEmit`
Expected: 오류 없음 (텍스트 상수 변경이므로 타입/린트 영향 없음)

- [ ] **Step 5: Commit**

```bash
git add src/lib/prompts/seteuk.ts
git commit -m "feat(prompt): limit mentor-mentee activity to supporting evidence only"
```

---

### Task 2: route.ts 삽입 지시문 교체

**Files:**
- Modify: `src/app/api/generate/route.ts:278-280`

**Interfaces:**
- Consumes: Task 1의 규칙(같은 표현으로 맞춤). `observationBoardText`, `userPrompt` 는 기존 변수 그대로 사용.
- Produces: 없음 (프롬프트 문자열 조립부 내부 변경)

- [ ] **Step 1: `[멘토·멘티 활동 해석]` 삽입 지시문 교체**

`src/app/api/generate/route.ts:278-280` 의 `if (observationBoardText) { ... }` 블록을 교체한다.

기존:
```ts
    if (observationBoardText) {
        userPrompt += `\n\n[멘토·멘티 활동 해석]\n${observationBoardText}\n\n// 이 섹션은 교사가 차시별 활동 표에 남긴 △/○ 기록을 해석한 요약입니다.\n// 차시명이나 △/○를 그대로 나열하지 말고, 관계 기반 활동에서 드러난 성실성·책임감·협력 태도·활동 지속성·성장 흐름으로 자연스럽게 반영하세요.\n// 활동판 기록만으로 교과 지식 성취나 리더십을 단정하지 말고, 관찰 메모와 학습 데이터가 있으면 그 구체 장면을 우선하세요.`;
    }
```

변경:
```ts
    if (observationBoardText) {
        userPrompt += `\n\n[멘토·멘티 활동 해석]\n${observationBoardText}\n\n// 이 섹션은 교사가 차시별 활동 표에 남긴 △/○ 기록을 해석한 요약이며, 보조 근거입니다.\n// 관찰 메모나 학습 데이터가 있으면 그 구체 장면을 문장의 중심에 두고, 활동 해석은 성실성·책임감·협력 태도를 뒷받침하는 짧은 표현으로만 보조하세요.\n// 관찰 메모와 학습 데이터가 모두 없으면 조 번호, 역할("멘토"/"멘티"/"n조"), 활동명("서로 알아가기"/"관계 형성" 등), 차시 구체 정보를 문장에 쓰지 말고, "수업 활동에 꾸준히 참여함"처럼 일반적인 수업 참여 태도 문장으로만 짧게 서술하세요.\n// 활동판 기록만으로 교과 지식 성취나 리더십을 단정하지 마세요.`;
    }
```

- [ ] **Step 2: lint + typecheck**

Run: `npx eslint src/app/api/generate/route.ts && npx tsc --noEmit`
Expected: 오류 없음

- [ ] **Step 3: Commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat(generate): drop activity specifics when no observation memo present"
```

---

### Task 3: 검증 (빌드 + 런타임 회귀 확인)

**Files:**
- 없음 (검증 전용, 코드 변경 없음)

**Interfaces:**
- Consumes: Task 1·2의 변경이 적용된 상태
- Produces: 없음

- [ ] **Step 1: 전체 lint + build**

Run: `npm run lint && npm run build`
Expected: lint·build 모두 성공 (프롬프트 텍스트 변경이라 실패 요인 없음)

- [ ] **Step 2: 활동판 단독 케이스 런타임 확인**

개발 서버를 띄우고(`npm run dev`) preview 도구 또는 로그인된 세션에서, 관찰 메모·학습 데이터 없이 짝모둠 활동판 기록만 있는 학생으로 세특을 생성한다.

확인: 생성된 문장에 아래가 **없어야** 한다.
- 조 번호 (예: "11조")
- 역할 명칭 ("멘토", "멘티")
- 활동명 ("서로 알아가기", "관계 형성")

대신 "수업 활동에 꾸준히 참여함"류의 일반 태도 문장이 나와야 한다.

주의: `/api/generate`는 `withTeacherAuth`로 보호되고 활동판 데이터는 클라이언트 localStorage에서 `observationBoardContext`로 전달되므로, curl 단독 호출보다 실제 write 화면(로그인 상태)에서 생성 버튼으로 확인하는 것이 정확하다. OpenAI API 키가 없으면 fallback 템플릿이 반환되므로 키가 설정된 환경에서 확인한다.

- [ ] **Step 3: 관찰 메모 병존 케이스 회귀 확인**

관찰 메모가 있는 학생으로 세특을 생성한다.

확인: 관찰 메모의 구체 장면이 문장의 중심이고, 활동판 해석은 태도(성실성·협력 등) 보조 표현으로만 반영되는지 — 기존 동작이 유지되는지 확인한다.

- [ ] **Step 4: 검증 결과 기록 후 마무리**

두 케이스 결과를 사용자에게 보고한다. 이상 없으면 완료, 활동판 언급이 여전히 남으면 Task 1·2의 표현을 강화한다(예: `[표현 제한]` 목록에 조 번호·역할명 추가).

---

## 2026-07-10 구현 범위 보완

실제 구현에서는 활동판 상세 데이터의 입력 비중과 일괄 생성 경로 누락을 해결하기 위해 공통 context 포맷터 축약, `/api/generate-batch` 동일 적용, Node 회귀 테스트를 추가한다. localStorage 스키마와 클라이언트 payload는 유지한다.