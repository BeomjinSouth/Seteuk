# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 3
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 경우의 수와 확률
- priority tier: highest
- workplan score: 133
- concepts: 18
- edges touching unit: 78
- cross-unit edges: 7
- low confidence concepts: 3
- low confidence edges: 19

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 4 |
| misconception_risk | 3 |
| procedure | 3 |
| property | 2 |
| sub_concept | 5 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 18 |
| contrasts_with | 5 |
| often_confused_with | 10 |
| prerequisite_for | 29 |
| represented_by | 1 |
| used_in | 15 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_or_and_counting_confusion | 또는과 동시에의 경우의 수를 혼동하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_permutation_combination_scope | 복잡한 순열·조합 문제를 중학교 범위로 확정하는 오류 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_probability_no_equal_likely | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 | misconception_risk | official_single_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_ratio__used_in__m1_data_theoretical_probability | 비 | used_in | 경우의 수의 비율로서의 확률 | low | official_dual_source |
| m1_data_domain__contains__m1_data_probability_unit | 자료와 가능성 | contains | 경우의 수와 확률 | high | official_dual_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_experimental_probability | 상대도수 | prerequisite_for | 상대도수로서의 확률 | medium | official_single_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_probability_unit | 상대도수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability | 유리수 | prerequisite_for | 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_unit | 유리수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_data_relative_frequency__represented_by__m1_data_experimental_probability | 상대도수 | represented_by | 상대도수로서의 확률 | medium | official_single_source |
