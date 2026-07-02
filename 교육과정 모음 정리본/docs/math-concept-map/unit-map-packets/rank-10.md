# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 10
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 산포도
- priority tier: highest
- workplan score: 218
- concepts: 25
- edges touching unit: 132
- cross-unit edges: 33
- low confidence concepts: 8
- low confidence edges: 32

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 4 |
| procedure | 7 |
| property | 2 |
| representation | 4 |
| sub_concept | 3 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 25 |
| often_confused_with | 11 |
| prerequisite_for | 46 |
| related_to | 8 |
| represented_by | 4 |
| used_in | 38 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_same_mean_different_spread | 평균이 같은 두 분포의 흩어진 정도 비교 | sub_concept | official_dual_source | 두 집단 분포 비교 성취수준에서 필요한 대표적인 비교 맥락으로 추론했다. 공식 문서의 직접 표현은 아니므로 교과서 예제 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_variability_calculation_table | 산포도 계산 표 | representation | official_dual_source | 교과서 예제에서 자주 쓰이는 계산 표 형식으로 추론했다. 공식 문서의 직접 표현은 아니므로 낮은 신뢰도로 둔다. |
| m1_data_deviation_sum_zero | 편차의 합은 0 | property | official_dual_source | 편차의 정의에서 파생되는 교과서 정리 성격의 성질이다. 공식 문서의 직접 용어는 아니므로 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_standard_deviation_unit | 표준편차의 단위 | property | official_dual_source | 표준편차를 분산의 제곱근으로 정의한 데서 파생되는 해석 성질이다. 공식 문서의 직접 용어는 아니므로 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_deviation_as_absolute_distance | 편차를 항상 양수 거리로 보는 오류 | misconception_risk | official_dual_source | 학생 반응에서 예상되는 오개념으로 추론했다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_same_mean_same_distribution | 평균이 같으면 분포도 같다고 보는 오류 | misconception_risk | official_dual_source | 두 집단 분포 비교에서 예상되는 오개념으로 추론했다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_sd_without_square_root | 표준편차에서 제곱근을 빠뜨리는 오류 | misconception_risk | official_dual_source | 표준편차 계산 절차에서 예상되는 오개념으로 추론했다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_variance_standard_deviation | 분산과 표준편차를 같은 값으로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_data_mean__prerequisite_for__m1_data_same_mean_different_spread | 평균 | prerequisite_for | 평균이 같은 두 분포의 흩어진 정도 비교 | low | official_dual_source |
| m1_data_domain__contains__m1_data_variability_unit | 자료와 가능성 | contains | 산포도 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_data_squared_deviation | 거듭제곱 | prerequisite_for | 편차의 제곱 | medium | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability | 자료의 분포 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability_magnitude_interpretation | 자료의 분포 | prerequisite_for | 산포도 값의 크기 해석 | medium | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability_unit | 자료의 분포 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_distribution_interpretation__prerequisite_for__m1_data_compare_distributions_variability | 자료의 분포 특징 해석 | prerequisite_for | 산포도로 두 집단의 분포 비교 | high | official_dual_source |
| m1_data_mean__prerequisite_for__m1_data_deviation | 평균 | prerequisite_for | 편차 | high | official_dual_source |
| m1_data_mean__prerequisite_for__m1_data_deviation_calculation | 평균 | prerequisite_for | 편차 구하기 | medium | official_dual_source |
| m1_data_representative_value__prerequisite_for__m1_data_variability | 대푯값 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_representative_value__prerequisite_for__m1_data_variability_unit | 대푯값 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_deviation | 변량 | prerequisite_for | 편차 | high | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_deviation_calculation | 변량 | prerequisite_for | 편차 구하기 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_sum_squared_deviation | 덧셈 | prerequisite_for | 편차의 제곱의 합 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_variance_calculation | 나눗셈 | prerequisite_for | 분산 구하기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_variance_formula | 나눗셈 | prerequisite_for | 분산 계산식 | medium | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_data_standard_deviation | 제곱근 | prerequisite_for | 표준편차 | high | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_data_standard_deviation_calculation | 제곱근 | prerequisite_for | 표준편차 구하기 | medium | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_data_standard_deviation_formula | 제곱근 | prerequisite_for | 표준편차 계산식 | medium | official_dual_source |
| m1_calc_power__used_in__m1_data_squared_deviation | 거듭제곱 | used_in | 편차의 제곱 | medium | official_dual_source |
| m1_data_distribution__used_in__m1_data_explain_distribution_with_variability | 자료의 분포 | used_in | 산포도로 자료의 분포 설명하기 | high | official_dual_source |
| m1_data_distribution__used_in__m1_data_variability | 자료의 분포 | used_in | 산포도 | high | official_dual_source |
| m1_data_mean__used_in__m1_data_deviation | 평균 | used_in | 편차 | medium | official_dual_source |
| m1_data_mean__used_in__m1_data_deviation_calculation | 평균 | used_in | 편차 구하기 | medium | official_dual_source |
| m1_data_representative_value__used_in__m1_data_variability | 대푯값 | used_in | 산포도 | medium | official_dual_source |
| m1_data_technology_tool_stats__used_in__m1_data_calculate_variance_sd | 공학 도구로 자료 수집·분석하기 | used_in | 분산과 표준편차 구하기 | medium | official_dual_source |
| m1_data_variable__used_in__m1_data_deviation_calculation | 변량 | used_in | 편차 구하기 | medium | official_dual_source |
| m1_num_division__used_in__m1_data_variance_calculation | 나눗셈 | used_in | 분산 구하기 | medium | official_dual_source |
| m1_num_square_root__used_in__m1_data_standard_deviation_calculation | 제곱근 | used_in | 표준편차 구하기 | medium | official_dual_source |
| m1_data_compare_distributions_variability__related_to__m1_data_box_plot_compare | 산포도로 두 집단의 분포 비교 | related_to | 상자그림으로 두 집단의 분포 비교 | medium | official_dual_source |
| m1_data_frequency_unit__related_to__m1_data_variability_unit | 도수분포표와 상대도수 | related_to | 산포도 | medium | official_dual_source |
| m1_data_representative_unit__related_to__m1_data_variability_unit | 대푯값 | related_to | 산포도 | medium | official_dual_source |
| m1_data_variability_unit__related_to__m1_data_box_scatter_unit | 산포도 | related_to | 상자그림과 산점도 | medium | official_dual_source |
