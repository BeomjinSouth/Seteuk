# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 5
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 대푯값
- priority tier: highest
- workplan score: 280
- concepts: 28
- edges touching unit: 155
- cross-unit edges: 40
- low confidence concepts: 10
- low confidence edges: 43

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 5 |
| procedure | 10 |
| property | 3 |
| representation | 1 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 45 |
| contrasts_with | 6 |
| equivalent_to | 1 |
| often_confused_with | 14 |
| prerequisite_for | 61 |
| related_to | 2 |
| represented_by | 1 |
| used_in | 25 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_median_extreme_value_context | 극단적인 값이 있는 자료에서 중앙값 고려하기 | procedure | official_dual_source | 공식 문서의 '자료의 특성에 따라 적절한 대푯값 선택'을 교과서형 판단 사례로 분해한 추론 노드이다. 교과서 예제 근거 확인 전까지 low로 둔다. |
| m1_data_mean_sensitive_to_extreme_value | 평균은 극단적인 값의 영향을 받음 | property | official_dual_source | 공식 문서의 '자료의 특성에 따라 적절한 대푯값 선택'을 평균의 민감성 맥락으로 분해한 추론 노드이다. 교과서 예제 근거 확인 전까지 low로 둔다. |
| m1_data_multiple_modes | 최빈값이 여러 개인 경우 | property | official_dual_source | 공식 문서에서 직접 명명되지 않은 교과서형 예외 처리이다. 교과서 본문·예제 근거 확인 전까지 low로 둔다. |
| m1_data_no_mode | 최빈값이 없는 경우 | property | official_dual_source | 공식 문서에서 직접 명명되지 않은 교과서형 예외 처리이다. 교과서 본문·예제 근거 확인 전까지 low로 둔다. |
| m1_data_extreme_value | 극단적인 값 | term | official_dual_source | 공식 문서의 '자료의 특성'을 교과서 예제 맥락으로 분해한 추론 노드이다. 교과서 본문 확인 전까지 low로 둔다. |
| m1_mis_even_median_no_average | 짝수 개 자료에서 두 가운데 값 중 하나만 중앙값으로 보는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_extreme_value_mean_choice | 극단적인 값이 있는 자료에서 평균만 선택하는 오류 | misconception_risk | official_dual_source | 공식 문서의 '자료의 특성'을 오개념 위험으로 분해한 추론 노드이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_mean_only_representative | 대푯값을 평균으로만 보는 오류 | misconception_risk | official_dual_source | 오개념 위험은 선수 관계로 확정하지 않고, 자료의 특성에 맞는 대푯값 선택과 혼동 관계로만 둔다. |
| m1_mis_median_without_ordering | 자료를 정렬하지 않고 중앙값을 찾는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_mode_largest_value | 최빈값을 가장 큰 값으로 보는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_data_mean__prerequisite_for__m1_data_same_mean_different_spread | 평균 | prerequisite_for | 평균이 같은 두 분포의 흩어진 정도 비교 | low | official_dual_source |
| m1_data_domain__contains__m1_data_representative_unit | 자료와 가능성 | contains | 대푯값 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_median | 자료 | prerequisite_for | 중앙값 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_mode | 자료 | prerequisite_for | 최빈값 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_number_of_values | 자료 | prerequisite_for | 자료의 개수 | medium | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_ordered_data_for_median | 자료 | prerequisite_for | 중앙값을 구하기 위한 자료 정렬 | medium | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_representative_value | 자료 | prerequisite_for | 대푯값 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_representative_value_context | 자료 | prerequisite_for | 자료의 특성 살펴보기 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_sum_of_values | 자료 | prerequisite_for | 자료값의 합 | medium | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_value_frequency_count | 자료 | prerequisite_for | 자료값의 도수 세기 | medium | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_choose_representative_value | 자료의 분포 | prerequisite_for | 자료의 특성에 맞는 대푯값 선택 | high | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_representative_value_context | 자료의 분포 | prerequisite_for | 자료의 특성 살펴보기 | high | official_dual_source |
| m1_data_frequency__prerequisite_for__m1_data_mode | 도수 | prerequisite_for | 최빈값 | high | official_dual_source |
| m1_data_frequency__prerequisite_for__m1_data_mode_selection | 도수 | prerequisite_for | 최빈값 찾기 | high | official_dual_source |
| m1_data_frequency__prerequisite_for__m1_data_value_frequency_count | 도수 | prerequisite_for | 자료값의 도수 세기 | medium | official_dual_source |
| m1_data_mean__prerequisite_for__m1_data_deviation | 평균 | prerequisite_for | 편차 | high | official_dual_source |
| m1_data_mean__prerequisite_for__m1_data_deviation_calculation | 평균 | prerequisite_for | 편차 구하기 | medium | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_quartile | 중앙값 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_quartile_calculation | 중앙값 | prerequisite_for | 사분위수 구하기 | medium | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_second_quartile | 중앙값 | prerequisite_for | 제2사분위수 | medium | official_dual_source |
| m1_data_representative_unit__prerequisite_for__m1_data_frequency_unit | 대푯값 | prerequisite_for | 도수분포표와 상대도수 | high | official_dual_source |
| m1_data_representative_value__prerequisite_for__m1_data_variability | 대푯값 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_representative_value__prerequisite_for__m1_data_variability_unit | 대푯값 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_mean_calculation | 덧셈 | prerequisite_for | 평균 구하기 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_sum_of_values | 덧셈 | prerequisite_for | 자료값의 합 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_mean_calculation | 나눗셈 | prerequisite_for | 평균 구하기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_mean_formula | 나눗셈 | prerequisite_for | 평균 계산식 | medium | official_dual_source |
| m1_num_natural_number__prerequisite_for__m1_data_number_of_values | 자연수 | prerequisite_for | 자료의 개수 | medium | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_median | 정수와 유리수의 대소 관계 | prerequisite_for | 중앙값 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_ordered_data_for_median | 정수와 유리수의 대소 관계 | prerequisite_for | 중앙값을 구하기 위한 자료 정렬 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_mean | 유리수 | prerequisite_for | 평균 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_mean_calculation | 유리수 | prerequisite_for | 평균 구하기 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_mean_formula | 유리수 | prerequisite_for | 평균 계산식 | medium | official_dual_source |
| m1_data_distribution__used_in__m1_data_choose_representative_value | 자료의 분포 | used_in | 자료의 특성에 맞는 대푯값 선택 | high | official_dual_source |
| m1_data_mean__used_in__m1_data_deviation | 평균 | used_in | 편차 | medium | official_dual_source |
| m1_data_mean__used_in__m1_data_deviation_calculation | 평균 | used_in | 편차 구하기 | medium | official_dual_source |
| m1_data_median__used_in__m1_data_quartile_calculation | 중앙값 | used_in | 사분위수 구하기 | medium | official_dual_source |
| m1_data_representative_value__used_in__m1_data_variability | 대푯값 | used_in | 산포도 | medium | official_dual_source |
| m1_data_second_quartile__equivalent_to__m1_data_median | 제2사분위수 | equivalent_to | 중앙값 | medium | official_dual_source |
| m1_data_representative_unit__related_to__m1_data_variability_unit | 대푯값 | related_to | 산포도 | medium | official_dual_source |
