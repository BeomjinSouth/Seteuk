# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 7
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 정수와 유리수
- priority tier: highest
- workplan score: 345
- concepts: 41
- edges touching unit: 248
- cross-unit edges: 96
- low confidence concepts: 5
- low confidence edges: 46

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
| often_confused_with | 17 |
| prerequisite_for | 124 |
| related_to | 9 |
| represented_by | 8 |
| used_in | 34 |

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
| m1_num_number_line__prerequisite_for__m1_ineq_number_line_solution_representation | 수직선 | prerequisite_for | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_number_line_position_order__prerequisite_for__m1_ineq_number_line_solution_representation | 수직선에서 오른쪽에 있는 수가 더 큼 | prerequisite_for | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_maximum_value | 정수와 유리수의 대소 관계 | prerequisite_for | 최댓값 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_minimum_value | 정수와 유리수의 대소 관계 | prerequisite_for | 최솟값 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_ineq_boundary_value | 정수와 유리수의 대소 관계 | prerequisite_for | 부등식 해의 경계값 | low | official_dual_source |
| m1_num_positive_number__prerequisite_for__m1_coord_quadrant_signs | 양수 | prerequisite_for | 사분면별 좌표 부호 | low | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_probability_value | 유리수 | prerequisite_for | 확률값 | low | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_ratio | 유리수 | prerequisite_for | 비 | low | official_single_source |
| m1_num_subtraction__prerequisite_for__m1_data_interquartile_range | 뺄셈 | prerequisite_for | 사분위범위 | low | official_dual_source |
| m1_num_mixed_calculation__used_in__m1_calc_simplify_expression | 정수와 유리수의 혼합계산 | used_in | 식을 간단히 하기 | low | official_dual_source |
| m1_num_number_line__used_in__m1_ineq_number_line_solution_representation | 수직선 | used_in | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_number_line_position_order__used_in__m1_ineq_number_line_solution_representation | 수직선에서 오른쪽에 있는 수가 더 큼 | used_in | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_mis_polynomial_subtraction_sign__often_confused_with__m1_mis_sign_operation | 다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류 | often_confused_with | 부호와 연산 기호를 혼동하는 오류 | low | official_dual_source |
| m1_mis_sign_operation__often_confused_with__m1_calc_polynomial_subtraction_sign_distribution | 부호와 연산 기호를 혼동하는 오류 | often_confused_with | 다항식의 뺄셈에서 부호 바꾸기 | low | official_dual_source |
| m1_num_absolute_value__related_to__m1_geo_distance_between_two_points | 절댓값 | related_to | 두 점 사이의 거리 | low | official_dual_source |
| m1_num_domain__contains__m1_num_integer_rational_unit | 수와 연산 | contains | 정수와 유리수 | high | official_single_source |
| m1_num_real_number__contains__m1_num_rational_number | 실수 | contains | 유리수 | high | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_mean_calculation | 덧셈 | prerequisite_for | 평균 구하기 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_sum_of_values | 덧셈 | prerequisite_for | 자료값의 합 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_data_sum_squared_deviation | 덧셈 | prerequisite_for | 편차의 제곱의 합 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_eq_equal_add_subtract_property | 덧셈 | prerequisite_for | 양변에 같은 수를 더하거나 빼기 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_ineq_add_sub_same_number_property | 덧셈 | prerequisite_for | 부등식 양변에 같은 수 더하기·빼기 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_system_add_or_subtract_equations | 덧셈 | prerequisite_for | 두 방정식 더하거나 빼기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_calc_expansion | 분배법칙 | prerequisite_for | 전개 | medium | official_single_source |
| m1_num_distributive_law__prerequisite_for__m1_calc_monomial_times_polynomial_distribution | 분배법칙 | prerequisite_for | 단항식을 다항식에 분배하기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_calc_polynomial_parentheses_removal | 분배법칙 | prerequisite_for | 다항식의 괄호 풀기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_factor_common_factor_extraction | 분배법칙 | prerequisite_for | 공통인수로 묶기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_factor_common_factor_formula | 분배법칙 | prerequisite_for | m(a+b) 공식 | high | official_single_source |
| m1_num_division__prerequisite_for__m1_data_mean_calculation | 나눗셈 | prerequisite_for | 평균 구하기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_mean_formula | 나눗셈 | prerequisite_for | 평균 계산식 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_variance_calculation | 나눗셈 | prerequisite_for | 분산 구하기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_data_variance_formula | 나눗셈 | prerequisite_for | 분산 계산식 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_eq_equal_multiply_divide_property | 나눗셈 | prerequisite_for | 양변에 같은 수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_ineq_multiply_divide_negative_reverses_sign | 나눗셈 | prerequisite_for | 부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_ineq_multiply_divide_positive_property | 나눗셈 | prerequisite_for | 부등식 양변에 양수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_num_fraction_to_decimal_division | 나눗셈 | prerequisite_for | 분수를 소수로 나타내기 | medium | official_dual_source |
| m1_num_four_operations__prerequisite_for__m1_calc_monomial_coefficient_calculation | 정수와 유리수의 사칙계산 | prerequisite_for | 단항식 계산에서 계수끼리 계산하기 | medium | official_dual_source |
| m1_num_four_operations__prerequisite_for__m1_calc_unit | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 계산 | medium | official_single_source |
| m1_num_four_operations__prerequisite_for__m1_expr_evaluate_expression_value | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 값 구하기 | high | official_dual_source |
