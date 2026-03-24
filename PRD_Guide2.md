
아래 내용은 **바로 구현에 쓰는 개발 지시서 수준**으로 정리한 산출물입니다.  
구성은 요청하신 순서대로 **(1) 새 스키마 완성본 → (2) 프롬프트 최종안 → (3) 스프레드시트 컬럼 설계 → (4) 기존 코드 교체 체크리스트(함수 단위)** 입니다.

---

# 1) 새 스키마 완성본

## 1-1. 문서 구조화(Structure) 스키마 v2

### 목적
- 수행평가 문서에서 핵심인 **공통 자료(sharedResources)** 를 1급 객체로 추출
- 문항은 **resourceRefs** 로 공통 자료를 참조
- 문항 유형을 **taskType** 으로 분류(개방형/증명형/정리형/조건선택형 등)

### JSON Schema (개념 설계)
- `sharedResources[]`: 조건 카드, 상황 글, 활동 지시문, 공통 지문, 표/그림 등
- `questions[]`: 문항 정보 + 참조 + 문항 유형
- `passageGroups[]`: 기존 유지(단, 가능하면 sharedResources와 연결)

#### 필수 필드 정의
**SharedResource**
- `resourceId` (string) : 예 `"res-condcards-1"`
- `type` (enum):  
  - `condition_cards` (조건 카드 묶음)  
  - `scenario` (문제상황 글/사진 설명 등)  
  - `instructions` (활동 지시문, 답안 작성 틀)  
  - `passage` (국/영 지문)  
  - `table` / `graph` / `diagram` / `image` (시각 자료)
- `title` (string)
- `content` (string) : 원문 텍스트(가능하면 그대로)
- `items` (ChoiceItem[]): 조건 카드/선택지 묶음일 때만 사용, 아니면 빈 배열

**Question**
- `questionNumber`, `displayName`, `pageRange`, `bodyText`
- `taskType` (enum):
  - `single_answer`
  - `multiple_answer`
  - `open_ended` (예측/서술/작성)
  - `proof` (증명)
  - `drawing` (작도/그리기)
  - `reflection` (활동 정리/성찰)
  - `conditional` (조건 카드 선택으로 분기)
- `resourceRefs` (string[]): 참조 리소스 ID들
- `choices` (ChoiceItem[]) : 객관식/선택형 문항 자체 선지(있는 경우만)
- `conditions` (string[]) : 문항 자체 조건(있는 경우만)
- `hasImage`, `imageDescription`, `passageGroupHint`

> 핵심: “조건 카드”는 문항의 choices가 아니라 **sharedResources.type=condition_cards** 로 들어가야 합니다. (이번 PDF처럼 상단에 카드가 있는 경우가 매우 흔합니다.)

---

## 1-2. 문항 분석(Analyze) 스키마 v2

### 목적
- 수행평가 문항에서 “정답 단정”을 강제하지 않음
- 문항 유형에 맞는 출력(예시답안/루브릭/증명 개요 등)을 강제
- `issues`는 **진짜 결함**일 때만, `suggestion`은 **옵션**

### JSON Schema (개념 설계)

**공통**
- `answerType` (enum): `single | multiple | open_ended | conditional`
- `outputLanguage`: `"ko"` 고정
- `subject` (string | optional)
- `issues` (IssueDetail[])
- `suggestion` (optional)

**정답형**
- `answer` (string)
- `answerSummary` (≤ 50자 권장)
- `reasoning` (string)
- `reasoningSummary` (≤ 100자 권장)

**개방형(수행평가)**
- `rubric` (string[]) : 채점 요소(최소 3개)
- `sampleResponses` (string[]) : 예시 답안(최소 2개)
- `teacherNotes` (string) : 지도 포인트/유의점
- `commonMisconceptions` (string[]) : 오해 포인트

**증명형**
- `proofOutline` (string) : 최소 4단계 개요
- `requiredProperties` (string[]) : 사용 성질 목록
- (선택) `diagramHints` (string[]) : 보조선/표기 제안

**조건선택형(conditional)**
- `conditionalOutcomes` (array):
  - `conditionLabel` (예: “조건 카드 1”)
  - `predictedConclusion`
  - `proofOutline` 또는 `reasoningGuide`
  - `rubric` (선택: 공통 또는 카드별)

> 핵심: 수행평가형 문항에서는 “answer”를 억지로 만들지 말고 **루브릭/예시답안** 중심으로 작성하도록 스키마가 유도해야 합니다.

---

# 2) 프롬프트 최종안(구조화/분류/분석)

## 2-1. 구조화 프롬프트 v2 (SYSTEM_PROMPTS.STRUCTURE 대체)

**핵심 지침**
1) 문항을 뽑기 전에 **공통 자료 박스**(조건 카드/지문/상황 글/활동 지시문/표/그림)를 먼저 찾아 `sharedResources`로 만든다.  
2) 각 문항은 자신이 참조하는 공통 자료를 `resourceRefs`로 반드시 연결한다.  
3) 문항 유형을 `taskType`으로 분류한다.  
4) “해당 조건/선택한 카드” 같은 지시어가 있으면, 그 지시 대상이 되는 리소스를 resourceRefs에 포함시킨다.  
5) 출력은 반드시 JSON만.

> 이번 PDF에서는 “조건 카드 1~3”이 `condition_cards` 리소스가 되어야 하고, 1~4번 문항은 그 리소스를 참조해야 합니다.

---

## 2-2. 문항 유형 분류 프롬프트 v1 (옵션: 별도 호출 또는 구조화에 포함)

**목적**
- 애매한 경우 taskType을 안정적으로 잡기 위한 보조 모듈(선택)

**규칙**
- “예상/적어봅시다/나의 예측/문장으로 작성” → `open_ended`  
- “증명해봅시다” → `proof`  
- “정리해봅시다/활동에서 알아낸 내용” → `reflection`  
- “조건 카드 선택” + 카드별 결론이 달라질 수 있음 → `conditional`

---

## 2-3. 분석 프롬프트 v2 (SYSTEM_PROMPTS.ANALYZE 대체)

**핵심 변화**
- “시험 문항 검증”이 아니라 “수행평가/시험 혼합 문서의 **교사용 분석 지원**”으로 목적 변경
- **정답형이 아니면 정답 단정 금지**
- `issues` 남발 금지: 참조 리소스가 제공된 지시어는 불명확으로 잡지 않음
- 이슈가 없으면 `issues=[]`, `suggestion` 생략 가능

**분석 원칙(필수 문구로 포함)**
- 문항의 `taskType`이 `open_ended/proof/reflection/conditional`인 경우:
  - answerType을 `open_ended` 또는 `conditional`로 설정
  - `rubric`(≥3), `sampleResponses`(≥2), `teacherNotes`를 우선 생성
- `conditional`이면 조건 카드별 `conditionalOutcomes`를 반드시 생성
- `suggestion`은 “실제 결함이 있을 때만”

---

# 3) 스프레드시트 컬럼 설계(구글 시트)

당신이 “긴 내용 저장 괜찮다”고 했으니, **초기 운영/개발 편의상 ‘제이슨을 한 셀에 저장’ 방식**이 가장 좋습니다.

## 3-1. 문서(Document) 시트 (EvalCheckDocuments)
추가/변경 권장 컬럼
- `documentId` (기존)
- `originalFileName` (기존)
- `fileHash` (기존)
- `status`, `progress` (기존)
- `analysisVersion` (신규) : 예 `"v2"`
- `manifestDriveFileId` (신규) : 드라이브에 저장한 전체 manifest.json
- `resourcesExtracted` (신규, boolean 또는 count)
- `taskTypeDistributionJson` (신규) : 문항 유형 분포 요약 제이슨
- `consistencyReportJson` (신규, 선택) : PDF텍스트 vs 비전 결과 비교 리포트

## 3-2. 리소스(Resources) 시트 (EvalCheckResources) — **신규 탭 추천**
- `documentId`
- `resourceId`
- `type`
- `title`
- `content`
- `itemsJson` (선택)
- `pageRange` (가능하면)
- `rawJson` (선택: 전체 리소스 객체)

> 리소스를 Questions 시트에 모두 때려넣는 것보다, 이 탭을 두는 편이 디버깅/운영이 훨씬 쉽습니다.

## 3-3. 문항(Questions) 시트 (EvalCheckQuestions)
추가/변경 권장 컬럼
- `taskType` (신규)
- `resourceRefsJson` (신규)
- `answerType` (신규)
- `analysisJson` (신규) : analyze 결과 전체 제이슨(긴 내용 OK)
- `rubricJson` (신규, 선택) : 분석 결과 중 rubric만 따로
- `sampleResponsesJson` (신규, 선택)
- `teacherNotes` (신규, 선택)
- `answerSummary`, `reasoningSummary` (기존 유지하되 v2에서는 정답형만 채움)
- `highRiskReason` 로직은 유지하되, v2에서는 “진짜 결함(issue)” 기준으로만 highRisk 처리

## 3-4. 이슈(Issues) 시트 (EvalCheckIssues)
유지 + 변경 권장
- `issueType`, `issueSummary`, `issueLocation` (기존)
- `isFalsePositiveFlag` (선택) : 교사가 “헛지적” 표시할 수 있게
- `issueDetailJson` (선택)

---

# 4) 기존 코드 전면 수정 체크리스트(함수 단위 교체 절차)

아래는 “어디를 바꿔야 하는지”를 **현재 코드 구조에 1:1로 대응**시킨 교체 리스트입니다.

---

## 4-1. 입력 전처리: PDF → 페이지 이미지 + PDF 텍스트

### (A) 현재 문제
- `pageImages`를 만들 때 PDF도 `data:application/pdf;base64,...`로 만들어 `image_url`로 넣을 가능성이 큽니다.
- 멀티모달은 보통 이미지 입력이 안정적이라 **PDF는 반드시 페이지 이미지로 변환**해야 합니다.

### (B) 수정 요구
- `startAnalysis()` 시작 시:
  1) 업로드된 파일이 PDF면 페이지별 PNG/JPEG로 변환
  2) 동시에 PDF 텍스트 추출(가능하면)
  3) `extractQuestionStructure()`에는 **항상 이미지 배열**만 넘기기
  4) `pdfText`는 구조화/분석에 “보조 컨텍스트”로 전달

### (C) 코드 변경 지점
- `POST()`에서 `pageImages = Promise.all(analysisFiles.map(...))` 부분 교체
  - 파일 타입이 PDF면 변환 함수 호출 → 여러 페이지 이미지 반환
  - 이미지면 기존 로직 유지

---

## 4-2. `extractQuestionStructure()` 전면 수정

### (A) 변경 내용
- 출력 스키마를 v2로 교체(`sharedResources`, `resourceRefs`, `taskType` 포함)
- 구조화 시스템 프롬프트를 v2로 교체(공통 자료 우선 추출/연결 강제)

### (B) 추가 입력
- `pdfText`가 있다면 user 메시지에 “보조 텍스트”로 제공  
  단, **레이아웃 판단은 이미지 기반을 우선**하고, 텍스트는 누락 보정에만 사용.

---

## 4-3. `generateImageDescription()` 개선(선택)

### (A) 현재 문제
- `getPageImage(q.pageRange)`가 대충 첫 페이지만 쓰는 주석이 있고, 실제로 문항 페이지를 정확히 못 잡을 수 있습니다.
- 수행평가에서는 사진/도형이 핵심 정보일 수 있으므로 **정확한 페이지 이미지**를 넣어야 합니다.

### (B) 수정 요구
- `pageRange`에서 숫자를 파싱하여 해당 페이지 이미지를 선택하되,
- 문항이 페이지 내 특정 영역이면(가능하면) 추후 크롭까지 고려(당장은 페이지 매칭만).

---

## 4-4. 문서 컨텍스트 생성(`buildDocumentOutline` / `summarizeDocumentOutline`) 개편

### 목표
- v2에서는 “문항 본문 320자 잘라서”가 아니라,
  - `sharedResources`는 가능한 한 보존
  - 문항은 요약하되, 참조 관계(resourceRefs)와 taskType이 포함되게

### 변경 요구
- `buildDocumentOutline(structure)`가 v2 구조(sharedResources 포함)를 반영하도록 수정
- `DOCUMENT_CONTEXT_LIMITS`는 수행평가 친화적으로 상향 또는 우선순위 보존(리소스는 덜 자름)

---

## 4-5. `analyzeQuestion()` 전면 수정(가장 중요)

### (A) 입력 텍스트 구성 변경
현재는 `[문제] bodyText` 중심입니다. v2에서는 반드시:

1) `[공통 자료]` : resourceRefs에 해당하는 리소스 원문(또는 요약)
2) `[문항]` : bodyText
3) `문항 유형(taskType)`, 과목(subject)
4) (선택) `consistencyReport` 요약

형태로 전달해야 합니다.

### (B) 출력 스키마 변경
- `QUESTION_ANALYSIS_SCHEMA`를 v2로 교체
- `suggestion` required 제거(옵션)
- `issues=[]` 허용

### (C) 프롬프트 분기
- `taskType`에 따라 분석 프롬프트를 조금 달리 쓰거나,
- 하나의 프롬프트에서 “taskType을 반드시 따르라”를 강제

**추천 방식(단순/안정)**  
- 프롬프트는 하나로 유지하되, `taskType` 규칙을 강하게 명시
- 스키마가 자연스럽게 분기된 필드를 요구하게 설계

---

## 4-6. 저장 로직 수정(`addEvalCheckQuestion`, `addEvalCheckIssue`, 신규 addEvalCheckResource)

### (A) resources 저장
- 구조화 결과의 `sharedResources`를 EvalCheckResources 탭에 저장
- 문항은 `resourceRefsJson` 저장

### (B) analysis 저장
- `analysisJson`(전체)을 Questions 탭에 저장(긴 텍스트 OK)
- 필요하면 `rubricJson`, `sampleResponsesJson` 따로 뽑아 저장

### (C) highRisk 기준 변경
- 기존: `analysis.issues.length > 0`면 고위험
- v2: `issues` 중 `error`나 “실제 결함”만 고위험으로 카운팅
  - 예: format/misunderstanding이 단독이면 고위험 제외(정책으로)

---

## 4-7. 드라이브 manifest 저장(권장)
- 문서 단위로:
  - structure v2 전체
  - sharedResources
  - questions
  - analyses 결과
  - consistencyReport
  를 하나의 `manifest.json`으로 저장
- 스프레드시트에는 `manifestDriveFileId`만 저장

---

# 5) 바로 적용 가능한 “개발 순서” (실행 계획)

1) **스키마/프롬프트 교체**
   - STRUCTURE v2
   - ANALYZE v2
2) **PDF 전처리(페이지 이미지 변환 + pdfText 추출)**
3) **sharedResources 저장 탭 추가**
4) **analyzeQuestion 입력을 “리소스 포함”으로 개편**
5) **이슈 정책 적용(issues 남발 방지 + suggestion 옵션화)**
6) **테스트: 수행평가 5종 + 정답형 5종**
   - 조건 카드형(이번 타입), 서술형, 보고서형, 혼합형 포함

---
