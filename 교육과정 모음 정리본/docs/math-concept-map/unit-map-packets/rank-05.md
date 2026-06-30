# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 5
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 정수와 유리수
- priority tier: highest
- workplan score: 260
- concepts: 41
- edges touching unit: 203
- cross-unit edges: 51
- low confidence concepts: 5
- low confidence edges: 36

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 14 |
| property | 8 |
| representation | 2 |
| term | 11 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 44 |
| contrasts_with | 11 |
| equivalent_to | 1 |
| often_confused_with | 15 |
| prerequisite_for | 86 |
| related_to | 10 |
| represented_by | 7 |
| used_in | 29 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_num_subtraction_as_add_opposite | 뺄셈을 반대 부호의 덧셈으로 바꾸기 | procedure | official_dual_source | 공식 성취기준의 사칙계산 원리에서 추론한 대표 절차이며, 교과서 본문 표현과 예제 근거를 확인하기 전까지 낮은 신뢰도로 둔다. |
| m1_num_opposite_numbers | 절댓값이 같고 부호가 다른 두 수 | property | official_dual_source | 공식 문서의 절댓값·부호·대소 관계에서 추론한 교과서 확인 필요 미시 concept이다. 교과서 본문 표현을 확인하기 전까지 낮은 신뢰도로 둔다. |
| m1_mis_absolute_value_positive | 절댓값을 항상 양수로만 말하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_negative_order | 음수의 대소를 절댓값 크기로 판단하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_sign_operation | 부호와 연산 기호를 혼동하는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_negative_number__prerequisite_for__m1_coord_quadrant_signs | 음수 | prerequisite_for | 사분면별 좌표 부호 | low | official_dual_source |
| m1_num_positive_number__prerequisite_for__m1_coord_quadrant_signs | 양수 | prerequisite_for | 사분면별 좌표 부호 | low | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_value | 유리수 | prerequisite_for | 확률값 | low | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_ratio | 유리수 | prerequisite_for | 비 | low | official_single_source |
| m1_num_mixed_calculation__used_in__m1_calc_simplify_expression | 정수와 유리수의 혼합계산 | used_in | 식을 간단히 하기 | low | official_dual_source |
| m1_num_absolute_value__related_to__m1_geo_distance_between_two_points | 절댓값 | related_to | 두 점 사이의 거리 | low | official_dual_source |
| m1_num_domain__contains__m1_num_integer_rational_unit | 수와 연산 | contains | 정수와 유리수 | high | official_single_source |
| m1_num_real_number__contains__m1_num_rational_number | 실수 | contains | 유리수 | high | official_dual_source |
| m1_num_addition__prerequisite_for__m1_eq_equal_add_subtract_property | 덧셈 | prerequisite_for | 양변에 같은 수를 더하거나 빼기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_calc_expansion | 분배법칙 | prerequisite_for | 전개 | medium | official_single_source |
| m1_num_distributive_law__prerequisite_for__m1_factor_common_factor_formula | 분배법칙 | prerequisite_for | m(a+b) 공식 | high | official_single_source |
| m1_num_division__prerequisite_for__m1_eq_equal_multiply_divide_property | 나눗셈 | prerequisite_for | 양변에 같은 수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_four_operations__prerequisite_for__m1_calc_unit | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 계산 | medium | official_single_source |
| m1_num_four_operations__prerequisite_for__m1_expr_evaluate_expression_value | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 값 구하기 | high | official_dual_source |
| m1_num_integer_rational_unit__prerequisite_for__m1_num_repeating_decimal_unit | 정수와 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_multiplication__prerequisite_for__m1_eq_equal_multiply_divide_property | 곱셈 | prerequisite_for | 양변에 같은 수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_class | 정수와 유리수의 대소 관계 | prerequisite_for | 계급 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_median | 정수와 유리수의 대소 관계 | prerequisite_for | 중앙값 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_quartile | 정수와 유리수의 대소 관계 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_stem_leaf_plot | 정수와 유리수의 대소 관계 | prerequisite_for | 줄기와 잎 그림 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_num_real_order | 정수와 유리수의 대소 관계 | prerequisite_for | 실수의 대소 관계 | high | official_dual_source |
| m1_num_prime_factor_unit__prerequisite_for__m1_num_integer_rational_unit | 소인수분해 | prerequisite_for | 정수와 유리수 | medium | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_data_mean | 유리수 | prerequisite_for | 평균 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability | 유리수 | prerequisite_for | 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_unit | 유리수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_relative_frequency | 유리수 | prerequisite_for | 상대도수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_finite_decimal | 유리수 | prerequisite_for | 유한소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_fraction_decimal_classification | 유리수 | prerequisite_for | 분수가 유한소수 또는 순환소수로 나타나는지 구분하기 | medium | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_num_infinite_decimal | 유리수 | prerequisite_for | 무한소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_irrational_number | 유리수 | prerequisite_for | 무리수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_rational_irrational_classification | 유리수 | prerequisite_for | 유리수와 무리수의 구분 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_rational_repeating_relation | 유리수 | prerequisite_for | 유리수와 순환소수의 관계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_real_number | 유리수 | prerequisite_for | 실수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_real_number_system | 유리수 | prerequisite_for | 실수의 수 체계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_repeating_decimal_unit | 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_square_root_real_unit | 유리수 | prerequisite_for | 제곱근과 실수 | high | official_dual_source |
| m1_num_subtraction__prerequisite_for__m1_eq_equal_add_subtract_property | 뺄셈 | prerequisite_for | 양변에 같은 수를 더하거나 빼기 | medium | official_dual_source |
| m1_num_real_number__represented_by__m1_num_number_line | 실수 | represented_by | 수직선 | medium | official_dual_source |
| m1_num_repeating_decimal_to_fraction__represented_by__m1_num_rational_number | 순환소수를 분수로 나타내기 | represented_by | 유리수 | high | official_dual_source |
| m1_num_distributive_law__used_in__m1_factor_common_factor_formula | 분배법칙 | used_in | m(a+b) 공식 | medium | official_single_source |
