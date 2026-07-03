# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 2
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 경우의 수와 확률
- priority tier: highest
- workplan score: 397
- concepts: 45
- edges touching unit: 205
- cross-unit edges: 12
- low confidence concepts: 14
- low confidence edges: 60

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 4 |
| misconception_risk | 6 |
| procedure | 11 |
| property | 5 |
| representation | 3 |
| sub_concept | 15 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 47 |
| contrasts_with | 6 |
| often_confused_with | 22 |
| prerequisite_for | 73 |
| represented_by | 4 |
| used_in | 53 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_event_not_occur_cases_count | 사건이 일어나지 않는 경우의 수 | sub_concept | official_dual_source | 보수 사건 용어는 현 공식 근거에서 직접 확인되지 않아 낮은 신뢰도로 두고, '사건이 일어나지 않는 경우'라는 해석 노드로 보존한다. |
| m1_data_one_probability_event | 확률이 1인 사건 | sub_concept | official_dual_source | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_probability_value | 확률값 | sub_concept | official_dual_source | 공식 문서의 '가능성을 수로 나타낸 값' 맥락에서 분리한 미시 concept이다. 교과서 용어 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_zero_probability_event | 확률이 0인 사건 | sub_concept | official_dual_source | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_counting_table_tree_representation | 표/수형도로 경우의 수 나타내기 | representation | official_single_source | 표와 수형도는 교과서 본문에서 자주 분리될 수 있는 표현이므로, 현재 공식 문서 근거만으로는 낮은 신뢰도로 둔다. |
| m1_data_counting_without_omission_duplication | 빠짐없이 중복 없이 경우 세기 | procedure | official_single_source | 교육과정 문서에는 직접 용어로 제시되지 않으나, 모든 경우의 수를 구하는 평가 맥락에서 필요한 암묵 절차로 낮은 신뢰도로 둔다. |
| m1_data_probability_comparison | 확률 비교하기 | procedure | official_dual_source | 공식 문서의 확률의 개념과 기본 성질에서 추론한 적용 절차이며, 교과서 예제 근거가 추가될 때까지 낮은 신뢰도로 둔다. |
| m1_data_complement_probability | 사건이 일어나지 않을 확률 | property | official_dual_source | 교육과정의 '확률의 기본 성질'에서 파생한 하위 성질 후보이다. 교과서 본문에서 직접 표현을 확인할 때까지 낮은 신뢰도로 둔다. |
| m1_mis_or_and_counting_confusion | 또는과 동시에의 경우의 수를 혼동하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_or_overlap_double_counting | 또는의 경우를 중복 세는 오류 | misconception_risk | official_single_source | 공식 문서의 또는/동시에 구분과 경로 문항 맥락에서 추론한 오개념 위험이다. 포함-배제 법칙 노드로 확장하지 않는다. |
| m1_mis_permutation_combination_scope | 복잡한 순열·조합 문항을 중학교 경우의 수 범위에 포함하는 범위 오판 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_probability_no_equal_likely | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_probability_out_of_range | 확률을 0보다 작거나 1보다 크게 쓰는 오류 | misconception_risk | official_dual_source | 확률의 기본 성질에서 파생한 진단 노드이며, 교과서 문제 오류 사례가 추가되면 source_refs를 보강한다. |
| m1_mis_total_event_cases_swap | 전체 경우의 수와 사건이 일어나는 경우의 수를 바꾸는 오류 | misconception_risk | official_single_source | 연구보고서 p. 260의 분모·분자 역할 구분에서 파생한 진단 노드로, 확정 개념이 아니라 오개념 위험으로 둔다. |

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
| m1_num_ratio__prerequisite_for__m1_data_probability_formula | 비 | prerequisite_for | 확률의 계산식 | medium | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_data_probability_fraction_expression | 비 | prerequisite_for | 확률의 분수 표현 | medium | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability | 유리수 | prerequisite_for | 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_unit | 유리수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_data_experimental_probability__represented_by__m1_data_relative_frequency | 상대도수로서의 확률 | represented_by | 상대도수 | medium | official_single_source |
