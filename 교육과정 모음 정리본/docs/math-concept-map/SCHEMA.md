# 수학 개념 위계 Map 스키마

## Concept Node

각 개념 노드는 다음 필드를 가진다.

| 필드 | 설명 |
| --- | --- |
| `id` | 영문 소문자, 숫자, 밑줄로 된 안정적 식별자 |
| `label_ko` | 대표 한국어 개념명 |
| `aliases` | 교과서, 교육과정, 수업 상황에서 쓰이는 동의어·표현 차이 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 단원 또는 성취기준 묶음 |
| `concept_type` | `core_concept`, `sub_concept`, `representation`, `procedure`, `property`, `term`, `misconception_risk` |
| `short_definition` | 원문을 길게 옮기지 않은 짧은 정의 |
| `source_refs` | 출처 id, 위치, 근거 유형, 근거 요약 |
| `prerequisite_ids` | 직접 선수 개념 id 목록 |
| `parent_ids` | 포함 상위 개념 id 목록 |
| `related_ids` | 비교, 혼동, 표현 변환 등 연관 개념 id 목록 |
| `notes` | 추론 근거, 범위 제한, 교과서 확인 필요 사항 |
| `confidence` | `high`, `medium`, `low` |

## Edge

각 관계 edge는 다음 필드를 가진다.

| 필드 | 설명 |
| --- | --- |
| `id` | 관계 식별자 |
| `source_id` | 출발 개념 id |
| `target_id` | 도착 개념 id |
| `relationship_type` | `contains`, `prerequisite_for`, `represented_by`, `used_in`, `contrasts_with`, `often_confused_with`, `equivalent_to`, `related_to` |
| `source_refs` | 관계 판단 근거 |
| `notes` | 관계 해석 메모 |
| `confidence` | `high`, `medium`, `low` |

## 신뢰도 기준

- `high`: 공식 교육과정 또는 성취수준 문서에서 직접 확인되는 개념·관계
- `medium`: 공식 문서 표현을 바탕으로 수업·교과서에서 자연스럽게 분해되는 하위 개념
- `low`: 교과서 본문 확인이 필요하거나, 개념지도 운영을 위해 잠정 분리한 개념

## 중복 병합 원칙

- 같은 수학 개념은 하나의 `id`로 병합한다.
- 표현 차이는 `aliases`에 보존한다.
- 단원별 의미 차이가 크면 같은 대표어라도 별도 id를 만들고 `notes`에 차이를 남긴다.
- 출처가 다른 경우 같은 노드의 `source_refs`에 누적한다.
