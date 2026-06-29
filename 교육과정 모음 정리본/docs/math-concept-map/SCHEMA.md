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
| `related_ids` | 비교, 혼동, 표현 변환 등 연관 개념 id 목록. `parent_ids`/`prerequisite_ids`만으로 표현되는 구조 관계는 이 배열에 중복 보존하지 않는다. |
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

## Equivalence Alias Audit CSV

`equivalence-alias-audit.csv`는 concept 노드의 alias, 명시적 `equivalent_to` edge, 중복 `label_ko`, 공식 용어 다중 매칭을 분리해 점검하는 파생 산출물이다. 이 파일의 `duplicate_label`과 `official_term_multi_match` row는 자동 병합 지시가 아니라, 교과서 표현과 단원 범위 근거를 확인하기 위한 검토 큐이다.

| 필드 | 설명 |
| --- | --- |
| `record_type` | `concept_alias`, `equivalent_edge`, `duplicate_label`, `official_term_multi_match` |
| `record_id` | 감사 row의 안정적 식별자 |
| `label_ko` | 대표 label 또는 검토 term |
| `alias_or_term` | alias 문자열, 공식 용어, 또는 중복 label |
| `concept_ids` | 관련 concept id 목록. 세미콜론으로 구분한다. |
| `concept_labels` | 관련 concept 대표 한국어명 목록. 세미콜론으로 구분한다. |
| `grade_domain_unit` | 관련 concept의 학년·영역·단원 요약 |
| `relationship_status` | 현재 map에서의 처리 상태. 예: `alias_on_concept`, `explicit_equivalent_edge`, `same_label_multiple_concepts`, `official_term_matches_multiple_concepts` |
| `recommended_action` | 다음 검토 액션. 예: alias 보존, 동치 edge 유지 확인, 단원/미시 개념 분리 검토 |
| `confidence` | 현재 row 판단 신뢰도 |
| `source_ref_count` | 관련 concept 또는 edge의 출처 근거 수 |
| `notes` | 병합 보류 사유, 검토 근거, 교과서 확인 필요 사항 |

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

## Node Edge Consistency Audit CSV

`node-edge-consistency-audit.csv`는 concept 노드의 `parent_ids`, `prerequisite_ids`, `related_ids` 배열과 명시적 edge row 사이의 비동기 항목을 검토하기 위한 파생 산출물이다. 이 파일의 row는 자동 오류가 아니라 검토 큐이며, 공식 근거 또는 교과서 근거 확인 후 edge 추가, 배열 정리, 관계 유형 조정 중 하나로 처리한다.

| 필드 | 설명 |
| --- | --- |
| `issue_type` | `missing_edge_for_parent_id`, `missing_edge_for_prerequisite_id`, `missing_edge_for_related_id`, `edge_without_parent_id`, `edge_without_prerequisite_id` |
| `node_id` | 배열 또는 edge target 기준으로 검토할 concept id |
| `node_label_ko` | 검토 concept 한국어 이름 |
| `array_field` | 검토 대상 배열 필드. `parent_ids`, `prerequisite_ids`, `related_ids` 중 하나 |
| `related_id` | 배열 항목 또는 edge source에 해당하는 상대 concept id |
| `related_label_ko` | 상대 concept 한국어 이름 |
| `expected_relationship_type` | 기대되는 edge 관계 유형. `related_ids`는 `related_edge`로 묶어 표시 |
| `matching_edge_ids` | edge는 있으나 배열에 없는 경우의 원본 edge id 목록 |
| `issue_status` | 현재는 모두 `review_needed` |
| `notes` | 검토 사유와 처리 유의점 |

## Related Edge Resolution Queue CSV

`related-edge-resolution-queue.csv`는 `node-edge-consistency-audit.csv`에 남은 `missing_edge_for_related_id` row를 후보 관계 유형과 처리 우선순위로 펼친 파생 산출물이다. 이 파일의 `candidate_relationship_types`는 확정 관계가 아니라 검토 힌트이며, 공식 문서 또는 교과서 근거 확인 후 edge로 반영한다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 우선순위 정렬 순번 |
| `node_id` | `related_ids`를 가진 concept id |
| `node_label_ko` | 기준 concept 한글 이름 |
| `related_id` | 연결 후보 concept id |
| `related_label_ko` | 연결 후보 concept 한글 이름 |
| `node_domain` | 기준 concept 영역 |
| `node_unit` | 기준 concept 단원 |
| `related_domain` | 연결 후보 concept 영역 |
| `related_unit` | 연결 후보 concept 단원 |
| `node_concept_type` | 기준 concept 유형 |
| `related_concept_type` | 연결 후보 concept 유형 |
| `same_domain` | 두 concept이 같은 영역이면 `yes` |
| `same_unit` | 두 concept이 같은 학년·영역·단원이면 `yes` |
| `reciprocal_related_id` | 상대 concept도 기준 concept을 `related_ids`에 가지면 `yes` |
| `candidate_relationship_types` | `often_confused_with`, `represented_by; related_to`, `used_in; related_to`, `contrasts_with; related_to`, `related_to` 중 검토 후보 |
| `priority_score` | 같은 단원, 상호 related, 낮은 신뢰도, 오개념 위험 여부 등을 반영한 검토 점수 |
| `priority_tier` | `high`, `medium`, `low`, `backlog` |
| `next_action` | 다음 검토 행동. 예: `confirm_often_confused_with_evidence` |
| `source_refs` | 기준 concept 또는 연결 후보 concept의 대표 출처 요약 |

## Prerequisite Map CSV

`prerequisite-map.csv`는 `concepts.json`의 `prerequisite_for` edge를 개념쌍 단위로 펼쳐, 선수 개념 흐름을 단원 전이 기준으로 검토하기 위한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `edge_id` | 원본 `prerequisite_for` edge id |
| `source_id` | 선수 개념 concept id |
| `source_label_ko` | 선수 개념 한국어 이름 |
| `source_grade` | 선수 개념 학년 또는 학년군 |
| `source_domain` | 선수 개념 영역 |
| `source_unit` | 선수 개념 단원 |
| `target_id` | 후속 개념 concept id |
| `target_label_ko` | 후속 개념 한국어 이름 |
| `target_grade` | 후속 개념 학년 또는 학년군 |
| `target_domain` | 후속 개념 영역 |
| `target_unit` | 후속 개념 단원 |
| `transition_scope` | `same_unit`, `cross_unit_same_domain`, `cross_domain_same_grade`, `cross_grade_same_domain`, `cross_grade_cross_domain` 중 하나 |
| `confidence` | 원본 edge 신뢰도 |
| `source_ref_count` | 원본 edge에 연결된 근거 수 |
| `source_refs` | 원본 edge의 출처 id, locator, 요약을 압축한 문자열 |
| `notes` | 원본 edge notes |

## Prerequisite Unit Graph DOT

`prerequisite-unit-graph.dot`는 `prerequisite-map.csv`의 선수 관계를 학년·영역·단원 전이 단위로 압축한 Graphviz DOT 시각화 파일이다.

| 요소 | 설명 |
| --- | --- |
| graph id | `prerequisite_unit_graph` |
| node | 학년·영역·단원 조합 |
| edge | source 단원에서 target 단원으로 이어지는 `prerequisite_for` 전이 묶음 |
| edge label | 해당 전이의 선수 관계 edge 수와 high/medium/low 신뢰도 분포 |
| edge color | `low` 신뢰도 관계가 포함된 전이는 붉은색, 그 외 전이는 회색 |
| edge penwidth | 전이 edge 수에 따라 1~5 범위로 조정 |

## Source Inventory CSV

`source-inventory.csv`는 현재 저장소에서 수학 개념 Map에 사용할 수 있는 로컬 출처 파일의 가용성을 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `source_group` | 출처 묶음 식별자. 예: `curriculum_pdf`, `achievement_pdf`, `achievement_research_report_pdf`, `unit_summary_json`, `textbook_originals` |
| `title` | 사람이 읽는 출처 이름 |
| `path` | 저장소 루트 기준 상대 경로 |
| `file_count` | 해당 경로에서 확인한 전체 파일 수 |
| `pdf_count` | 해당 경로에서 확인한 PDF 파일 수 |
| `json_count` | 해당 경로에서 확인한 JSON 파일 수 |
| `status` | `available`, `empty`, `missing` |
| `use_for_concept_map` | 개념 Map 구축에서의 사용 목적 |
| `notes` | 현재 상태에 대한 운영 메모 |

## Research Report Concept Signal CSV

`research-report-concept-signal.csv`는 한국교육과정평가원의 수학과 성취수준 개발 연구보고서 PDF에서 현재 concept의 `label_ko`와 2자 이상 alias가 출현하는 페이지 후보를 기록한 파생 산출물이다. 이 파일은 연구보고서 원문 맥락을 검토하기 위한 신호이며, row가 있다고 해서 `concepts.json`의 `source_refs`나 `confidence`를 자동 변경하지 않는다.

| 필드 | 설명 |
| --- | --- |
| `concept_id` | 연구보고서에서 label 또는 alias 출현 신호가 잡힌 concept id |
| `label_ko` | concept 한국어 이름 |
| `grade` | concept 학년 또는 학년군 |
| `domain` | concept 영역 |
| `unit` | concept 단원 |
| `concept_type` | concept 유형 |
| `confidence` | 현재 concept 신뢰도 |
| `source_ref_count` | 현재 concept에 연결된 source ref 수 |
| `current_sources` | 현재 concept source id 목록. 세미콜론으로 구분한다. |
| `match_count` | 연구보고서 전체에서 label/alias가 출현한 횟수 |
| `matched_terms` | 실제 매칭된 label 또는 alias 목록 |
| `matched_pages` | 매칭이 확인된 연구보고서 PDF page 번호 목록. 길어질 경우 앞쪽 page만 보존한다. |
| `first_matched_page` | 첫 매칭 page 번호 |
| `candidate_status` | 현재는 `research_report_signal` |
| `recommended_action` | `inspect_research_report_context_before_confidence_change`, `inspect_research_report_context_before_source_ref_upgrade`, `use_as_supplemental_trace_only` 중 하나 |
| `notes` | 자동 승격 금지와 원문 맥락 확인 필요 메모 |

## Research Report Context Packet CSV

`research-report-context-packet.csv`는 `research-report-concept-signal.csv`의 상위 검토 후보를 연구보고서 page 단위 맥락으로 좁힌 파생 산출물이다. 이 파일은 짧은 발췌와 맥락 신호를 남기는 수동 검토 패킷이며, row가 있다고 해서 `concepts.json`의 `source_refs`나 `confidence`를 자동 변경하지 않는다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 패킷 내부 검토 순서 |
| `concept_id` | 원본 concept id |
| `label_ko` | concept 한국어 이름 |
| `matched_term` | 해당 page에서 실제로 확인된 label 또는 alias |
| `grade` | concept 학년 또는 학년군 |
| `domain` | concept 영역 |
| `unit` | concept 단원 |
| `concept_type` | concept 유형 |
| `confidence` | 현재 concept 신뢰도 |
| `recommended_action` | 원본 signal의 검토 권장 동작 |
| `page_number` | 연구보고서 PDF page 번호 |
| `match_count_on_page` | 해당 page에서 `matched_term`이 출현한 횟수 |
| `context_signal` | `achievement_level_context`, `example_assessment_tool_context`, `assessment_context`, `teaching_learning_context`, `curriculum_context`, `general_report_context` 중 page 맥락 신호 |
| `context_excerpt` | 수동 검토를 위한 90자 이하의 짧은 page 맥락 발췌 |
| `review_status` | 현재는 `pending_context_review` |
| `source_candidate_id` | 후보 출처 id. 현재는 `achievement_research_report_2022` |
| `source_locator_candidate` | 후보 출처 위치. 예: `연구보고서 p. 184` |
| `source_ref_upgrade_allowed` | 검토 전 자동 승격 금지 표시. 현재는 `no` |
| `notes` | 수동 검토 전 source ref 또는 confidence를 바꾸지 말라는 메모 |

## Research Report Source Review CSV

`research-report-source-review.csv`는 `research-report-context-packet.csv`의 page 맥락을 source ref 보강 후보, 평가도구 근거 후보, 넓은 보고서 맥락, 약한 출현으로 분류한 파생 검토 큐다. 분류할 때 짧은 excerpt뿐 아니라 연구보고서의 전체 page 텍스트도 확인해 내용 체계 표, 목차성 page, 평가 결과 산출·보고 page가 source ref 후보로 남지 않게 한다. 이 파일은 자동으로 `concepts.json`을 수정하지 않으며, 이미 수동 검토 후 반영된 연구보고서 source ref가 있으면 적용 상태만 표시한다. 모든 row는 수동 검토 전 자동 source ref 또는 confidence 승격을 금지한다.

| 필드 | 설명 |
| --- | --- |
| `rank` | source review 내부 검토 순서 |
| `context_packet_rank` | 원본 context packet row 순서 |
| `concept_id` | 원본 concept id |
| `label_ko` | concept 한국어 이름 |
| `matched_term` | 연구보고서 page에서 매칭된 용어 |
| `grade` | concept 학년 또는 학년군 |
| `domain` | concept 영역 |
| `unit` | concept 단원 |
| `confidence` | 현재 concept 신뢰도 |
| `page_number` | 연구보고서 PDF page 번호 |
| `source_locator_candidate` | 후보 출처 위치 |
| `context_signal` | 원본 context packet의 page 맥락 신호 |
| `evidence_candidate_type` | `candidate_prerequisite_evidence`, `candidate_assessment_item_evidence`, `candidate_achievement_level_evidence`, `broad_report_context_only`, `weak_occurrence_only` 중 하나 |
| `review_decision` | `manual_review_required` 또는 `applied_after_manual_review` |
| `review_priority` | `high`, `medium`, `low` 중 하나 |
| `source_ref_action` | `candidate_add_after_manual_review`, `applied_to_concepts_json`, `do_not_add_from_this_row` 중 하나 |
| `source_ref_application_status` | `pending_manual_review`, `applied_after_manual_review`, `not_applicable_from_this_row` 중 하나 |
| `confidence_action` | 신뢰도 유지 또는 low 유지 사유 |
| `source_ref_upgrade_allowed` | 검토 전 자동 승격 금지 표시. 적용된 row도 confidence 자동 승격은 금지하므로 현재는 `no` |
| `review_reason` | 분류와 다음 행동의 간단한 이유 |
| `notes` | `concepts.json` 변경 전 page 원문 검토 필요 또는 이미 반영된 source ref의 confidence 보류 메모 |

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

## Edge Evidence Depth CSV

`edge-evidence-depth.csv`는 edge별 출처 근거 깊이와 교과서 근거 보강 필요 여부를 요약한 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `edge_id` | edge id |
| `source_id` | source concept id |
| `source_label_ko` | source concept 한국어 이름 |
| `source_grade` | source concept 학년 또는 학년군 |
| `source_domain` | source concept 영역 |
| `source_unit` | source concept 단원 |
| `target_id` | target concept id |
| `target_label_ko` | target concept 한국어 이름 |
| `target_grade` | target concept 학년 또는 학년군 |
| `target_domain` | target concept 영역 |
| `target_unit` | target concept 단원 |
| `relationship_type` | edge 관계 유형 |
| `edge_scope` | `same_unit`, `cross_unit_same_domain`, `cross_domain_same_grade`, `cross_grade_same_domain`, `cross_grade_cross_domain` |
| `confidence` | 현재 edge 신뢰도 |
| `source_ref_count` | edge에 연결된 source ref 수 |
| `source_count` | edge에 연결된 고유 source id 수 |
| `evidence_kind_count` | edge에 연결된 고유 evidence kind 수 |
| `sources` | 고유 source id 목록. 세미콜론으로 구분한다. |
| `evidence_kinds` | 고유 evidence kind 목록. 세미콜론으로 구분한다. |
| `has_curriculum_evidence` | `curriculum_math_2022` 근거 존재 여부 |
| `has_achievement_evidence` | `achievement_math_2022` 근거 존재 여부 |
| `has_textbook_evidence` | `textbook_originals` 근거 존재 여부 |
| `evidence_depth` | `textbook_supported`, `official_dual_source`, `official_single_source`, `source_gap` |
| `needs_textbook_evidence` | 관계 edge의 교과서 본문·예제·문제 근거 보강 필요 여부 |
| `notes` | 원본 edge notes |

## Textbook Source Audit CSV

`textbook-source-audit.csv`는 `교과서_원본/`에 들어온 교과서 PDF 원본이 page-level 개념 추출에 들어가기 전 준비되었는지 검사하는 파생 산출물이다. 현재 PDF가 없으면 header만 있는 CSV와 `waiting_for_textbook_pdf` Markdown 요약을 유지한다.

| 필드 | 설명 |
| --- | --- |
| `file_name` | 교과서 PDF 파일명 |
| `relative_path` | 저장소 루트 기준 상대 경로 |
| `file_size_bytes` | 파일 크기 |
| `sha256` | 실제 파일의 SHA-256 해시 |
| `pdf_header_valid` | 파일 시작이 `%PDF-`인지 여부. `yes` 또는 `no` |
| `filename_parse_status` | 파일명이 `교육과정_학년_출판사_책종_권.pdf` 규칙을 만족하는지 여부 |
| `curriculum` | 파일명에서 파싱한 교육과정 |
| `grade` | 파일명에서 파싱한 학년 |
| `publisher` | 파일명에서 파싱한 출판사 |
| `book_type` | `교과서`, `익힘책`, `지도서` 중 하나 |
| `volume` | 파일명에서 파싱한 권/학기 정보 |
| `manifest_status` | `matched`, `missing_manifest`, `missing_source_metadata`, `missing_expected_sha256`, `hash_mismatch` |
| `source_url` | `교과서_원본/TEXTBOOK_SOURCE_MANIFEST.csv`에서 온 원천 URL |
| `attachment_id` | 같은 manifest에서 온 첨부 식별자 또는 게시물 내부 식별자 |
| `expected_sha256` | manifest에 기록한 기대 SHA-256 해시 |
| `intake_status` | `ready_for_textbook_extraction`, `needs_manifest_metadata`, `invalid_pdf_header`, `invalid_filename` |
| `notes` | 파일명, PDF 헤더, manifest 보강 필요 사항 |

## Textbook Source Manifest CSV

`교과서_원본/TEXTBOOK_SOURCE_MANIFEST.csv`는 PDF 원본이 추가될 때 함께 작성해야 하는 출처 manifest이다. 이 파일은 PDF 원본 자체가 아니라 원본 provenance를 기록하는 운영 파일이며, `textbook-source-audit.csv`가 이를 읽어 교과서 추출 가능 여부를 판정한다.

| 필드 | 설명 |
| --- | --- |
| `relative_path` | 저장소 루트 기준 PDF 상대 경로 |
| `source_url` | 공식 공개 페이지 또는 다운로드 근거 URL |
| `attachment_id` | 원 출처의 첨부 식별자, 게시물 식별자, 또는 다운로드 항목 식별자 |
| `expected_sha256` | 원본 PDF 추가 시 계산해 기록한 SHA-256 해시 |
| `license_note` | 공개/사용 근거, 열람 범위, 저작권 주의 메모 |
| `downloaded_at` | 다운로드 또는 수집 날짜 |

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

`textbook-evidence-packets/rank-01.csv`~`rank-34.csv`는 `textbook-extraction-queue.csv`의 전체 34개 단원에 대해 교과서 목차·학습목표·본문 정의·정리·예제·용어 설명·문제 반복 패턴 근거를 채우기 위한 단원별 작업 패킷이다. 현재 `교과서_원본/`에 PDF가 없으므로 모든 row의 `extraction_status`는 `pending_textbook_pdf`이다.

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
| `required_evidence_fields` | concept 유형과 신뢰도에 따라 우선 채워야 할 교과서 근거 슬롯 |
| `evidence_focus` | 해당 concept의 교과서 근거를 찾을 때 우선 확인할 관찰 초점 |
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

## Textbook Edge Evidence Packet CSV

`textbook-edge-evidence-packets/rank-01.csv`~`rank-34.csv`는 `textbook-extraction-queue.csv`의 전체 34개 단원에 대해 교과서 본문에서 관계 edge 근거를 채우기 위한 단원별 작업 패킷이다. 한 edge가 두 단원의 concept을 잇는 경우 양쪽 단원 패킷에 모두 포함될 수 있다. 현재 `교과서_원본/`에 PDF가 없으므로 모든 row의 `extraction_status`는 `pending_textbook_pdf`이다.

| 필드 | 설명 |
| --- | --- |
| `packet_rank` | 참조한 교과서 추출 queue 순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 패킷 대상 단원 |
| `edge_id` | 근거를 보강할 edge id |
| `edge_scope` | `intra_unit` 또는 `cross_unit` |
| `source_id` | source concept id |
| `source_label_ko` | source concept 한국어 이름 |
| `source_unit` | source concept 단원 |
| `target_id` | target concept id |
| `target_label_ko` | target concept 한국어 이름 |
| `target_unit` | target concept 단원 |
| `relationship_type` | 원본 edge 관계 유형 |
| `confidence` | 현재 edge 신뢰도 |
| `source_ref_count` | 현재 edge에 연결된 공식 근거 수 |
| `current_source_refs` | 기존 공식 근거 요약 |
| `notes` | 원본 edge notes |
| `required_evidence_fields` | 관계 유형과 신뢰도에 따라 우선 채워야 할 교과서 근거 슬롯 |
| `evidence_focus` | 해당 edge의 교과서 근거를 찾을 때 우선 확인할 관찰 초점 |
| `extraction_status` | `pending_textbook_pdf` 또는 `textbook_evidence_linked` |
| `structure_ref` | 포함 관계 또는 위계 구조 근거 슬롯 |
| `prerequisite_ref` | 선수 순서 또는 선행 지식 근거 슬롯 |
| `representation_ref` | 표·그래프·식·그림 등 표현 근거 슬롯 |
| `procedure_ref` | 절차나 문제 해결 활용 근거 슬롯 |
| `contrast_ref` | 구별해야 할 개념의 대조 근거 슬롯 |
| `misconception_ref` | 오개념 위험 설명 근거 슬롯 |
| `problem_pattern_ref` | 문제에서 반복 출현하는 관계 근거 슬롯 |
| `related_ref` | 넓은 연관 관계 근거 슬롯 |
| `textbook_page_refs` | 교과서 파일명과 쪽수 근거 슬롯 |
| `extraction_notes` | 관계 유형 조정, 병합 후보, 신뢰도 조정 메모 |

## Textbook Edge Evidence Packet Index CSV

`textbook-edge-evidence-packets/index.csv`는 생성된 단원별 관계 edge 교과서 근거 패킷을 추적하는 인덱스이다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 교과서 추출 queue 순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 패킷 대상 단원 |
| `edge_count` | 해당 패킷에 포함된 edge row 수 |
| `intra_unit_edge_count` | 같은 단원 내부 edge row 수 |
| `cross_unit_edge_count` | 다른 단원 concept과 이어지는 edge row 수 |
| `low_confidence_count` | 해당 패킷 안의 `low` 신뢰도 edge row 수 |
| `priority_tier` | queue의 우선순위 등급 |
| `priority_score` | queue의 우선순위 점수 |
| `next_action` | 다음 교과서 추출 작업 유형 |
| `packet_csv` | 단원별 패킷 CSV 파일명 |
| `packet_md` | 단원별 패킷 Markdown 파일명 |

## Textbook Evidence Workplan CSV

`textbook-evidence-workplan.csv`는 concept 교과서 근거 패킷 인덱스와 관계 edge 교과서 근거 패킷 인덱스를 같은 rank 단위로 결합한 파생 작업 계획이다. 교과서 PDF가 추가되면 이 파일을 보고 단원별 concept 근거 보강과 edge 근거 보강을 함께 처리한다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 교과서 추출 queue 순위 |
| `grade` | 학년 또는 교육과정 학년군 |
| `domain` | 교육과정 영역 |
| `unit` | 패킷 대상 단원 |
| `priority_tier` | concept queue의 우선순위 등급 |
| `priority_score` | concept queue의 우선순위 점수 |
| `workplan_score` | `priority_score + low_confidence_edge_count*4 + cross_unit_edge_count` |
| `concept_count` | concept 근거 패킷 row 수 |
| `pending_concept_evidence_count` | 아직 교과서 근거가 연결되지 않은 concept row 수 |
| `low_confidence_concept_count` | 해당 단원의 `low` 신뢰도 concept row 수 |
| `edge_count` | 관계 edge 근거 패킷 row 수 |
| `pending_edge_evidence_count` | 아직 교과서 근거가 연결되지 않은 edge row 수 |
| `intra_unit_edge_count` | 같은 단원 내부 edge row 수 |
| `cross_unit_edge_count` | 다른 단원 concept과 이어지는 edge row 수 |
| `low_confidence_edge_count` | 해당 단원의 `low` 신뢰도 edge row 수 |
| `total_evidence_rows` | concept row와 edge row의 합계 |
| `total_pending_evidence_count` | pending concept row와 pending edge row의 합계 |
| `total_low_confidence_count` | low-confidence concept row와 edge row의 합계 |
| `next_action` | concept/edge 근거 보강을 함께 고려한 다음 작업 유형 |
| `concept_next_action` | concept queue에서 온 원래 다음 작업 유형 |
| `concept_packet_csv` | concept 근거 패킷 CSV 파일명 |
| `concept_packet_md` | concept 근거 패킷 Markdown 파일명 |
| `edge_packet_csv` | edge 근거 패킷 CSV 파일명 |
| `edge_packet_md` | edge 근거 패킷 Markdown 파일명 |

## Pilot Unit Map Node CSV

`pilot-unit-map-nodes.csv`는 `textbook-evidence-workplan.csv` rank 1 단원을 사람이 검토하기 쉬운 compact map으로 접은 concept node 목록이다. 현재 대상은 `좌표평면과 그래프`이며, 전체 concept map의 원본 노드를 변경하지 않는 파생 산출물이다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 workplan 순위 |
| `grade` | concept 학년 또는 교육과정 학년군 |
| `domain` | concept 영역 |
| `unit` | concept 단원 |
| `concept_id` | 원본 concept id |
| `label_ko` | concept 한국어 이름 |
| `concept_type` | 원본 concept 유형 |
| `confidence` | 현재 concept 신뢰도 |
| `evidence_depth` | `concept-evidence-depth.csv`의 공식/교과서 근거 깊이 |
| `needs_textbook_evidence` | 교과서 본문·정리·예제·문제 근거 보강 필요 여부 |
| `source_ref_count` | 현재 concept에 연결된 source ref 수 |
| `parent_ids` | 세미콜론으로 결합한 포함 상위 concept id 목록 |
| `prerequisite_ids` | 세미콜론으로 결합한 직접 선수 concept id 목록 |
| `related_ids` | 세미콜론으로 결합한 연관 concept id 목록 |
| `short_definition` | 원본 concept의 짧은 정의 |
| `notes` | 원본 concept notes |

## Pilot Unit Map Edge CSV

`pilot-unit-map-edges.csv`는 rank 1 단원 concept에 닿는 관계 edge를 compact map 검토용으로 펼친 목록이다. 같은 단원 내부 edge는 `intra_unit`, 다른 단원 concept과 이어지는 edge는 `cross_unit`으로 표시한다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 workplan 순위 |
| `unit` | 파일럿 대상 단원 |
| `edge_id` | 원본 edge id |
| `source_id` | source concept id |
| `source_label_ko` | source concept 한국어 이름 |
| `source_unit` | source concept 단원 |
| `target_id` | target concept id |
| `target_label_ko` | target concept 한국어 이름 |
| `target_unit` | target concept 단원 |
| `relationship_type` | 원본 edge 관계 유형 |
| `edge_scope` | `intra_unit` 또는 `cross_unit` |
| `confidence` | 현재 edge 신뢰도 |
| `evidence_depth` | `edge-evidence-depth.csv`의 공식/교과서 근거 깊이 |
| `needs_textbook_evidence` | 관계 edge의 교과서 본문·예제·문제 근거 보강 필요 여부 |
| `source_ref_count` | 현재 edge에 연결된 source ref 수 |
| `notes` | 원본 edge notes |

## Pilot Unit Map DOT

`pilot-unit-map.dot`는 rank 1 단원의 compact Graphviz DOT 시각화이다.

| 요소 | 설명 |
| --- | --- |
| graph id | `pilot_unit_map` |
| node | rank 1 단원 concept node와 cross-unit edge endpoint로 등장하는 외부 node |
| edge | `pilot-unit-map-edges.csv`의 관계 edge |
| edge label | 원본 `relationship_type` |
| edge style | `intra_unit`은 실선, `cross_unit`은 점선 |
| node color | `low` 신뢰도 concept은 강조색, 외부 node는 회색 |

## Unit Map Packet Index CSV

`unit-map-packets/index.csv`는 `textbook-evidence-workplan.csv` 전체 34개 rank를 compact concept hierarchy map으로 변환한 단원별 지도 인덱스이다. 각 rank별 node/edge CSV는 `pilot-unit-map-nodes.csv`, `pilot-unit-map-edges.csv`와 같은 필드 구조를 사용한다.

| 필드 | 설명 |
| --- | --- |
| `rank` | 참조한 workplan 순위 |
| `grade` | 단원 학년 또는 교육과정 학년군 |
| `domain` | 단원 영역 |
| `unit` | 단원명 |
| `priority_tier` | workplan 우선순위 등급 |
| `workplan_score` | workplan 종합 점수 |
| `concept_count` | 해당 rank의 node CSV concept row 수 |
| `edge_count` | 해당 rank 단원에 닿는 edge row 수 |
| `intra_unit_edge_count` | 같은 단원 내부 edge row 수 |
| `cross_unit_edge_count` | 다른 단원 concept과 이어지는 edge row 수 |
| `low_confidence_concept_count` | 해당 rank의 `low` 신뢰도 concept row 수 |
| `low_confidence_edge_count` | 해당 rank의 `low` 신뢰도 edge row 수 |
| `total_pending_evidence_count` | workplan의 pending concept/edge evidence row 수 |
| `next_action` | workplan의 다음 근거 보강 행동 |
| `node_csv` | rank별 concept node CSV 파일명 |
| `edge_csv` | rank별 edge CSV 파일명 |
| `map_md` | rank별 Markdown 지도 파일명 |
| `map_dot` | rank별 Graphviz DOT 파일명 |

## Unit Map Packet Files

`unit-map-packets/rank-01.md`~`rank-34.md`와 `rank-01.dot`~`rank-34.dot`는 전체 단원을 같은 compact map 형식으로 펼친 산출물이다.

| 파일 | 설명 |
| --- | --- |
| `rank-XX-nodes.csv` | 해당 rank 단원의 concept node 목록. 필드는 `Pilot Unit Map Node CSV`와 같다. |
| `rank-XX-edges.csv` | 해당 rank 단원 concept에 닿는 edge 목록. 필드는 `Pilot Unit Map Edge CSV`와 같다. |
| `rank-XX.md` | concept type 분포, 관계 유형 분포, low-confidence concept, cross-unit edge 요약 |
| `rank-XX.dot` | 내부 edge는 실선, cross-unit edge는 점선으로 나타낸 Graphviz DOT 지도 |

## Legacy Gap Audit CSV

`legacy-gap-audit.csv`는 기존 로컬 `수학_개념_위계도/data/math_concept_hierarchy.json`에서 중학교 범위 후보를 뽑아 현재 `concepts.json`의 `label_ko` 및 `aliases`와 비교한 파생 감사 산출물이다. 기존 위계도는 공식 근거가 아니므로, 이 파일의 `needs_review` 항목은 concept 추가 후보일 뿐이며 공식 교육과정 또는 교과서 근거 확인 전에는 확정하지 않는다.

| 필드 | 설명 |
| --- | --- |
| `legacy_record_type` | `curriculum_node`, `achievement_concept_tag`, `textbook_concept` 중 하나 |
| `legacy_id` | 기존 위계도 record 또는 성취기준 tag에서 만든 안정 식별자 |
| `legacy_label_ko` | 비교 대상 후보 label |
| `legacy_grade` | 기존 위계도에 기록된 학년군 |
| `legacy_domain` | 기존 위계도에 기록된 영역 |
| `legacy_unit` | 기존 위계도에 기록된 단원 또는 성취기준 코드 |
| `coverage_status` | `covered_by_label`, `covered_by_alias`, `needs_review` |
| `matched_concept_ids` | 매칭된 현재 concept id 목록. 세미콜론으로 구분한다. |
| `matched_concept_labels` | 매칭된 현재 concept label 목록. 세미콜론으로 구분한다. |
| `candidate_action` | `no_action_existing_concept` 또는 `review_against_official_sources` |
| `confidence` | 감사 판단 신뢰도. `needs_review`는 `low`로 둔다. |
| `source_note` | 기존 위계도 출처 메모와 비공식 보조 자료라는 주의 문구 |
| `notes` | label/alias 매칭 방식 또는 미매칭 사유 |

## Legacy Gap Resolution CSV

`legacy-gap-resolution.csv`는 `legacy-gap-audit.csv`의 `needs_review` row를 고유 label 단위로 묶고, 다음 조치를 보수적으로 분류한 파생 감사 산출물이다. 이 산출물은 concept 자동 추가가 아니라 다음 공식 근거 확인 순서를 정하기 위한 검토층이다.

| 필드 | 설명 |
| --- | --- |
| `candidate_label` | 중복을 접은 후보 label |
| `occurrence_count` | `legacy-gap-audit.csv`에서 같은 label로 나온 `needs_review` row 수 |
| `legacy_domains` | 해당 후보가 등장한 기존 위계도 영역 목록. 세미콜론으로 구분한다. |
| `legacy_units` | 해당 후보가 등장한 기존 성취기준 또는 단원 목록. 세미콜론으로 구분한다. |
| `resolution_status` | `foundational_prerequisite_candidate`, `alias_candidate_for_existing_concept`, `source_detail_needed` |
| `resolution_action` | `review_for_low_confidence_prerequisite_node`, `review_alias_on_existing_concept`, `inspect_official_source_before_decision` |
| `candidate_concept_type` | 추가 검토 시 예상 concept type |
| `candidate_confidence` | 추가 또는 alias 병합 검토 전 기본 신뢰도 |
| `possible_existing_concept_ids` | label 부분 일치로 찾은 기존 concept 후보 id 목록. 세미콜론으로 구분한다. |
| `possible_existing_concept_labels` | label 부분 일치로 찾은 기존 concept 후보 label 목록. 세미콜론으로 구분한다. |
| `evidence_basis` | 현재 판단의 근거와 공식 근거 확인 필요성 |
| `notes` | 분류 사유와 다음 작업 메모 |

## Legacy Gap Integration Plan CSV

`legacy-gap-integration-plan.csv`는 `legacy-gap-resolution.csv`의 후보를 실제 반영 전 staging 액션으로 변환한 파생 산출물이다. 이 파일은 low-confidence 선수개념 노드 또는 alias 검토의 실행 순서를 정하지만, 공식 근거 확인 전에는 `concepts.json`을 갱신하지 않는다.

| 필드 | 설명 |
| --- | --- |
| `candidate_label` | resolution 후보 label |
| `proposed_concept_id` | 새 선수개념 노드가 필요한 경우의 제안 id. alias 검토나 보류 항목은 비워 둔다. |
| `proposed_concept_type` | 제안 노드의 예상 concept type |
| `proposed_confidence` | 공식 근거 확인 전 기본 신뢰도 |
| `integration_status` | `stage_prerequisite_node`, `stage_alias_review`, `wait_for_source_detail` |
| `target_relationship_type` | `prerequisite_for`, `alias_on_existing_concept`, 또는 빈 값 |
| `target_concept_ids` | 연결 또는 alias 검토 대상 기존 concept id 목록. 세미콜론으로 구분한다. |
| `target_concept_labels` | 연결 또는 alias 검토 대상 기존 concept label 목록. 세미콜론으로 구분한다. |
| `legacy_units` | 후보가 등장한 기존 성취기준 또는 단원 목록. 세미콜론으로 구분한다. |
| `source_ref_plan` | 공식 교육과정 또는 교과서 근거 확인 계획 |
| `notes` | 통합 판단 전제와 보류 사유 |

## Legacy Gap Source Review CSV

`legacy-gap-source-review.csv`는 `legacy-gap-integration-plan.csv`의 후보를 공식 근거 확인 queue로 바꾼 파생 산출물이다. 후보별로 확인할 성취기준, 검색어, 기존 target concept의 source ref를 모아, 새 노드나 alias를 확정하기 전의 검토 경로를 추적한다.

| 필드 | 설명 |
| --- | --- |
| `candidate_label` | 검토 후보 label |
| `integration_status` | integration plan의 staging 상태 |
| `proposed_concept_id` | 새 선수개념 노드가 필요한 경우의 제안 id |
| `target_relationship_type` | 제안된 관계 또는 alias 검토 유형 |
| `review_status` | `needs_official_prerequisite_confirmation`, `needs_alias_confirmation`, `needs_source_detail` |
| `review_priority` | `official_source_first`, `alias_review`, `source_detail_first` |
| `legacy_units` | 확인할 기존 성취기준 또는 단원 목록. 세미콜론으로 구분한다. |
| `search_terms` | 후보 label, 성취기준 코드, target concept label을 합친 검토 검색어 |
| `target_concept_ids` | 기존 target concept id 목록. 세미콜론으로 구분한다. |
| `target_source_ref_count` | target concept에서 수집한 source ref 수 |
| `target_source_refs` | target concept id, source id, locator, summary를 압축한 근거 목록 |
| `recommended_next_step` | `concepts.json` 갱신 전 수행할 확인 작업 |
| `notes` | target concept 누락, 직접 성취기준 검토 필요 등 운영 메모 |

## Legacy Gap Evidence Scan CSV

`legacy-gap-evidence-scan.csv`는 `legacy-gap-source-review.csv`의 target source refs 안에 후보 label이 직접 등장하는지 점검한 파생 산출물이다. 이 파일은 새 concept이나 alias를 확정하지 않고, 다음 공식 근거 확인에서 어떤 후보를 먼저 확인할지 신호를 남긴다.

| 필드 | 설명 |
| --- | --- |
| `candidate_label` | 검토 후보 label |
| `integration_status` | integration plan의 staging 상태 |
| `proposed_concept_id` | 새 선수개념 노드가 필요한 경우의 제안 id |
| `review_status` | source review의 검토 상태 |
| `evidence_signal` | `target_source_refs_mention_candidate`, `alias_source_refs_mention_candidate`, `target_source_refs_do_not_mention_candidate`, `direct_legacy_unit_review_needed` |
| `candidate_mention_count` | target source refs 중 후보 label이 등장한 ref 수 |
| `legacy_units` | 확인할 기존 성취기준 또는 단원 목록 |
| `target_source_ref_count` | source review에서 수집한 target source ref 수 |
| `matching_target_source_refs` | 후보 label이 직접 등장한 target source ref 목록 |
| `recommended_action` | evidence signal에 따른 다음 검토 작업 |
| `notes` | 신호 해석과 보류 사유 |

## 신뢰도 기준

- `high`: 공식 교육과정 또는 성취수준 문서에서 직접 확인되는 개념·관계
- `medium`: 공식 문서 표현을 바탕으로 수업·교과서에서 자연스럽게 분해되는 하위 개념
- `low`: 교과서 본문 확인이 필요하거나, 개념지도 운영을 위해 잠정 분리한 개념

## 중복 병합 원칙

- 같은 수학 개념은 하나의 `id`로 병합한다.
- 표현 차이는 `aliases`에 보존한다.
- 단원별 의미 차이가 크면 같은 대표어라도 별도 id를 만들고 `notes`에 차이를 남긴다.
- 출처가 다른 경우 같은 노드의 `source_refs`에 누적한다.
