# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 3
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 경우의 수와 확률
- priority tier: highest
- workplan score: 178
- concepts: 26
- edges touching unit: 112
- cross-unit edges: 10
- low confidence concepts: 6
- low confidence edges: 24

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 4 |
| misconception_risk | 3 |
| procedure | 4 |
| property | 3 |
| sub_concept | 11 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 28 |
| contrasts_with | 6 |
| often_confused_with | 10 |
| prerequisite_for | 43 |
| represented_by | 1 |
| used_in | 24 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_one_probability_event | 확률이 1인 사건 | sub_concept | official_dual_source | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_probability_value | 확률값 | sub_concept | official_dual_source | 공식 문서의 '가능성을 수로 나타낸 값' 맥락에서 분리한 미시 concept이다. 교과서 용어 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_zero_probability_event | 확률이 0인 사건 | sub_concept | official_dual_source | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_or_and_counting_confusion | 또는과 동시에의 경우의 수를 혼동하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_permutation_combination_scope | 복잡한 순열·조합 문항을 중학교 경우의 수 범위에 포함하는 범위 오판 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_probability_no_equal_likely | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 | misconception_risk | official_single_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_rational_number__prerequisite_for__m1_data_probability_value | 유리수 | prerequisite_for | 확률값 | low | official_dual_source |
| m1_num_ratio__used_in__m1_data_theoretical_probability | 비 | used_in | 경우의 수의 비율로서의 확률 | low | official_dual_source |
| m1_data_domain__contains__m1_data_probability_unit | 자료와 가능성 | contains | 경우의 수와 확률 | high | official_dual_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_experimental_probability | 상대도수 | prerequisite_for | 상대도수로서의 확률 | medium | official_single_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_probability_unit | 상대도수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_relative_frequency_case_ratio_link | 상대도수 | prerequisite_for | 상대도수와 경우의 수의 비율 연결 | medium | official_single_source |
| m1_num_ratio__prerequisite_for__m1_data_probability_by_case_ratio | 비 | prerequisite_for | 경우의 수의 비율로 확률 구하기 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability | 유리수 | prerequisite_for | 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_unit | 유리수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_data_experimental_probability__represented_by__m1_data_relative_frequency | 상대도수로서의 확률 | represented_by | 상대도수 | medium | official_single_source |
