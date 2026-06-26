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

## Achievement Coverage CSV

`achievement-coverage.csv`는 `concepts.json`의 `source_refs`에서 성취기준 코드를 추출해 만든 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `achievement_code` | 공식 성취기준 코드 |
| `domain` | 성취기준이 속한 교육과정 영역 |
| `concept_count` | 해당 성취기준 코드가 근거로 연결된 concept 수 |
| `high_confidence_count` | 연결 concept 중 `high` 신뢰도 수 |
| `medium_confidence_count` | 연결 concept 중 `medium` 신뢰도 수 |
| `low_confidence_count` | 연결 concept 중 `low` 신뢰도 수 |
| `concept_ids` | 연결 concept id 목록. 세미콜론으로 구분한다. |
| `concept_labels` | 연결 concept 대표 한국어명 목록. 세미콜론으로 구분한다. |

## Review Queue CSV

`review-queue.csv`는 `concepts.json`에서 `confidence: low`인 concept을 모아 다음 교과서·출처 보강 때 먼저 확인할 항목을 정리한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `concept_id` | 검토 대상 concept id |
| `label_ko` | 대표 한국어 개념명 |
| `domain` | 교육과정 영역 |
| `unit` | 단원 또는 성취기준 묶음 |
| `concept_type` | concept 유형 |
| `confidence` | 현재 신뢰도. 이 파일에서는 `low`만 포함한다. |
| `review_priority` | `textbook_evidence_needed` 또는 `source_detail_needed` |
| `notes` | 기존 concept notes |
| `source_refs` | 현재 연결된 출처 id와 위치 요약 |

## Official Term Coverage CSV

`official-term-coverage.csv`는 공식 교육과정과 성취수준 문서에서 확인한 용어·기호가 `concepts.json`의 `label_ko` 또는 `aliases`로 연결되는지 확인한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `term` | 공식 문서에서 확인한 용어 또는 기호 |
| `domain` | 교육과정 영역 |
| `source_locator` | 해당 용어·기호를 확인한 공식 문서 위치 요약 |
| `coverage_status` | `covered`, `covered_by_alias`, `excluded_by_curriculum_scope`, `needs_concept` |
| `concept_count` | 연결 concept 수 |
| `concept_ids` | 연결 concept id 목록. 세미콜론으로 구분한다. |
| `concept_labels` | 연결 concept 대표 한국어명 목록. 세미콜론으로 구분한다. |
| `notes` | 범위 제외 또는 검토 메모 |

## Unit Coverage CSV

`unit-coverage.csv`는 `concepts.json`과 edge 데이터를 학년·영역·단원 단위로 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 단원 또는 성취기준 묶음 |
| `concept_count` | 해당 단원에 속한 concept 수 |
| `high_confidence_count` | `high` 신뢰도 concept 수 |
| `medium_confidence_count` | `medium` 신뢰도 concept 수 |
| `low_confidence_count` | `low` 신뢰도 concept 수 |
| `*_count` | concept type별 concept 수 |
| `achievement_codes` | 해당 단원 concept 근거에서 추출한 성취기준 코드 목록 |
| `internal_edge_count` | 같은 단원 안에서 연결된 edge 수 |
| `incoming_edge_count` | 다른 단원에서 이 단원으로 들어오는 edge 수 |
| `outgoing_edge_count` | 이 단원에서 다른 단원으로 나가는 edge 수 |

## Relationship Audit CSV

`relationship-audit.csv`는 `concepts.json`의 edge를 관계 유형별로 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `relationship_type` | 관계 유형 |
| `edge_count` | 해당 유형 edge 수 |
| `high_confidence_count` | `high` 신뢰도 edge 수 |
| `medium_confidence_count` | `medium` 신뢰도 edge 수 |
| `low_confidence_count` | `low` 신뢰도 edge 수 |
| `source_concept_count` | 해당 관계 유형에서 source로 등장하는 concept 수 |
| `target_concept_count` | 해당 관계 유형에서 target으로 등장하는 concept 수 |

## Source Inventory CSV

`source-inventory.csv`는 현재 저장소에서 수학 개념 Map에 사용할 수 있는 로컬 출처 파일의 가용성을 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `source_group` | 출처 묶음 식별자. 예: `curriculum_pdf`, `achievement_pdf`, `unit_summary_json`, `textbook_originals` |
| `title` | 사람이 읽는 출처 이름 |
| `path` | 저장소 루트 기준 상대 경로 |
| `file_count` | 해당 경로에서 확인한 전체 파일 수 |
| `pdf_count` | 해당 경로에서 확인한 PDF 파일 수 |
| `json_count` | 해당 경로에서 확인한 JSON 파일 수 |
| `status` | `available`, `empty`, `missing` |
| `use_for_concept_map` | 개념 Map 구축에서의 사용 목적 |
| `notes` | 현재 상태에 대한 운영 메모 |

## Source Reference Audit CSV

`source-ref-audit.csv`는 `concepts.json`의 concept/edge `source_refs`를 출처와 근거 유형별로 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `record_kind` | `concept` 또는 `edge` |
| `source_id` | `concepts.json`의 `sources`에 정의된 출처 id |
| `evidence_kind` | `achievement_standard`, `achievement_level`, `term_list`, `teaching_note`, `assessment_item` 등 근거 유형 |
| `source_ref_count` | 해당 묶음에 속한 source ref 수 |
| `record_count` | 해당 묶음의 source ref를 가진 고유 concept 또는 edge 수 |
| `high_confidence_record_count` | 해당 묶음에 속한 `high` 신뢰도 record 수 |
| `medium_confidence_record_count` | 해당 묶음에 속한 `medium` 신뢰도 record 수 |
| `low_confidence_record_count` | 해당 묶음에 속한 `low` 신뢰도 record 수 |
| `missing_locator_count` | `locator`가 비어 있는 source ref 수 |
| `missing_summary_count` | `summary`가 비어 있는 source ref 수 |

## Concept Evidence Depth CSV

`concept-evidence-depth.csv`는 concept별 출처 근거 깊이와 교과서 근거 보강 필요 여부를 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `concept_id` | concept id |
| `label_ko` | concept 한국어 이름 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 단원 또는 성취기준 묶음 |
| `confidence` | 현재 concept 신뢰도 |
| `source_ref_count` | concept에 연결된 source ref 수 |
| `source_count` | concept에 연결된 고유 source id 수 |
| `evidence_kind_count` | concept에 연결된 고유 evidence kind 수 |
| `sources` | 고유 source id 목록. 세미콜론으로 구분한다. |
| `evidence_kinds` | 고유 evidence kind 목록. 세미콜론으로 구분한다. |
| `has_curriculum_evidence` | `curriculum_math_2022` 근거 존재 여부 |
| `has_achievement_evidence` | `achievement_math_2022` 근거 존재 여부 |
| `has_textbook_evidence` | `textbook_originals` 근거 존재 여부 |
| `evidence_depth` | `textbook_supported`, `official_dual_source`, `official_single_source`, `source_gap` |
| `needs_textbook_evidence` | 교과서 본문·정리·예제·문제 근거 보강 필요 여부 |

## Textbook Extraction Queue CSV

`textbook-extraction-queue.csv`는 교과서 PDF가 추가되었을 때 단원별로 어떤 범위를 먼저 추출할지 정하는 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 교과서 원문 추출 우선순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 단원 또는 성취기준 묶음 |
| `concept_count` | 해당 단원 concept 수 |
| `needs_textbook_evidence_count` | 교과서 근거 보강이 필요한 concept 수 |
| `low_confidence_count` | 해당 단원 `low` 신뢰도 concept 수 |
| `official_single_source_count` | 공식 단일 출처에만 기대는 concept 수 |
| `official_dual_source_count` | 교육과정과 성취수준 양쪽 공식 근거를 가진 concept 수 |
| `textbook_supported_count` | 교과서 원문 근거가 연결된 concept 수 |
| `priority_score` | `needs_textbook_evidence + low_confidence*4 + official_single_source*2` |
| `priority_tier` | `highest`, `high`, `medium`, `low`, `complete` |
| `next_action` | 다음 교과서 추출 작업 유형 |

## Textbook Evidence Packet CSV

`textbook-evidence-packets/rank-01.csv`~`rank-33.csv`는 `textbook-extraction-queue.csv`의 전체 33개 단원에 대해 교과서 목차·학습목표·본문 정의·정리·예제·용어 설명·문제 반복 패턴 근거를 채우기 위한 단원별 작업 패킷이다. 현재 `교과서_원본/`에 PDF가 없으므로 모든 row의 `extraction_status`는 `pending_textbook_pdf`이다.

| 필드 | 설명 |
| --- | --- |
| `packet_rank` | 참조한 교과서 추출 queue 순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 패킷 대상 단원 |
| `concept_id` | 근거를 보강할 concept id |
| `label_ko` | concept 한국어 이름 |
| `concept_type` | concept 유형 |
| `confidence` | 현재 concept 신뢰도 |
| `evidence_depth` | 현재 공식/교과서 근거 깊이 |
| `needs_textbook_evidence` | 교과서 본문·정리·예제·문제 근거 보강 필요 여부 |
| `source_ref_count` | 현재 concept에 연결된 공식 근거 수 |
| `current_source_refs` | 기존 공식 근거 요약 |
| `extraction_status` | `pending_textbook_pdf` 또는 `textbook_evidence_linked` |
| `toc_ref` | 교과서 목차 근거 슬롯 |
| `learning_objective_ref` | 학습목표 근거 슬롯 |
| `definition_ref` | 본문 정의 근거 슬롯 |
| `summary_ref` | 정리/핵심 요약 근거 슬롯 |
| `example_ref` | 예제 근거 슬롯 |
| `term_explanation_ref` | 용어 설명 근거 슬롯 |
| `problem_pattern_ref` | 문제에서 반복 출현하는 암묵 개념 근거 슬롯 |
| `textbook_page_refs` | 교과서 파일명과 쪽수 근거 슬롯 |
| `extraction_notes` | 추출 판단, 병합 후보, 신뢰도 조정 메모 |

## Textbook Evidence Packet Index CSV

`textbook-evidence-packets/index.csv`는 생성된 단원별 교과서 근거 패킷을 추적하는 인덱스이다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 교과서 추출 queue 순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 패킷 대상 단원 |
| `concept_count` | 해당 패킷에 포함된 concept 수 |
| `pending_textbook_evidence_count` | 아직 교과서 근거가 연결되지 않은 row 수 |
| `low_confidence_count` | 해당 패킷 안의 `low` 신뢰도 concept 수 |
| `priority_tier` | queue의 우선순위 등급 |
| `priority_score` | queue의 우선순위 점수 |
| `next_action` | 다음 교과서 추출 작업 유형 |
| `packet_csv` | 단원별 패킷 CSV 파일명 |
| `packet_md` | 단원별 패킷 Markdown 파일명 |

## 신뢰도 기준

- `high`: 공식 교육과정 또는 성취수준 문서에서 직접 확인되는 개념·관계
- `medium`: 공식 문서 표현을 바탕으로 수업·교과서에서 자연스럽게 분해되는 하위 개념
- `low`: 교과서 본문 확인이 필요하거나, 개념지도 운영을 위해 잠정 분리한 개념

## 중복 병합 원칙

- 같은 수학 개념은 하나의 `id`로 병합한다.
- 표현 차이는 `aliases`에 보존한다.
- 단원별 의미 차이가 크면 같은 대표어라도 별도 id를 만들고 `notes`에 차이를 남긴다.
- 출처가 다른 경우 같은 노드의 `source_refs`에 누적한다.
