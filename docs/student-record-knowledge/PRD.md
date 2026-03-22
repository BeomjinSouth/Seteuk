# Student Record Knowledge PRD

## 목적

학생부 FAQ와 공개 Q&A를 구조화해서 다음 두 기능을 제공한다.

1. 학생부 관련 질문에 근거 기반으로 답하는 상담 챗봇
2. 생기부 초안을 근거와 함께 점검하는 리뷰 기능

## 핵심 원칙

- 비밀글은 답변 근거로 쓰지 않는다.
- 동일 질문에 답이 다르면 최신 답변을 기본으로 사용한다.
- FAQ와 공개 Q&A는 같은 무게가 아니라, 정책형/사례형 역할을 나눠서 사용한다.

## 사용자

- 담임교사
- 교과 담당교사
- 생활기록부 검토 담당자

## 기능 범위

### 1. 상담 챗봇

- 학교급/구분/연도 필터
- 공개 근거 기반 답변
- citation 포함

### 2. 생기부 점검

- 위험 항목 추출
- 근거 카드 표시
- 수정 방향 제안

### 3. 운영

- knowledge metadata 조회
- raw search API
- 이후 vector search 확장 가능

## 현재 상태

- `/api/counsel-chat` 구현됨
- `/api/record-review` 구현됨
- `/api/search` 구현됨
- `/counsel-chat` 페이지 구현됨
- `/record-review` 페이지 구현됨
