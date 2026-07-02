# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 13
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 다항식의 곱셈과 인수분해
- priority tier: highest
- workplan score: 221
- concepts: 30
- edges touching unit: 169
- cross-unit edges: 51
- low confidence concepts: 5
- low confidence edges: 29

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 5 |
| procedure | 11 |
| property | 8 |
| representation | 1 |
| sub_concept | 1 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 29 |
| contrasts_with | 17 |
| often_confused_with | 22 |
| prerequisite_for | 44 |
| related_to | 2 |
| represented_by | 6 |
| used_in | 49 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_expansion_factorization_direction | 전개와 인수분해 방향을 혼동하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_factor_common_factor_missing | 공통인수를 빠뜨리는 오류 | misconception_risk | official_dual_source | 공식 문서의 공식 범위에서 추론한 오개념 위험이다. 교과서 예제와 문항 근거 확인이 필요하다. |
| m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | misconception_risk | official_dual_source | 공식 문서의 공식 범위와 성취수준의 과정 설명 요구에서 추론한 오개념 위험이다. |
| m1_mis_factorization_unchecked_result | 인수분해 결과를 확인하지 않는 오류 | misconception_risk | official_dual_source | 전개와 인수분해의 역관계에서 추론한 오개념 위험이다. 실제 교과서 예제와 문항 근거 확인이 필요하다. |
| m1_mis_perfect_square_sign | 완전제곱식의 가운데 항 부호를 혼동하는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_factor_factorization__prerequisite_for__m1_quad_eq_zero_product_condition | 인수분해 | prerequisite_for | 각 인수가 0이 되는 조건 | low | official_single_source |
| m1_mis_expansion_factorization_direction__often_confused_with__m1_calc_expansion | 전개와 인수분해 방향을 혼동하는 오류 | often_confused_with | 전개 | low | official_dual_source |
| m1_mis_quadratic_expression_equation__often_confused_with__m1_factor_quadratic_expression | 이차식과 이차방정식을 혼동하는 오류 | often_confused_with | 이차식 | low | official_dual_source |
| m1_mis_quadratic_factorization_solution__often_confused_with__m1_factor_factorization | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | often_confused_with | 인수분해 | low | official_single_source |
| m1_quad_eq_leading_coefficient_one_case__related_to__m1_factor_binomial_product_xab | 이차항의 계수가 1인 이차방정식 | related_to | (x+a)(x+b) 공식 | low | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_expanded_form | 전개 | prerequisite_for | 전개식 | medium | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_expansion_factorization_inverse | 전개 | prerequisite_for | 전개와 인수분해의 역관계 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization | 전개 | prerequisite_for | 인수분해 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization_result_check | 전개 | prerequisite_for | 인수분해 결과 전개로 확인하기 | medium | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_multiplication | 전개 | prerequisite_for | 다항식의 곱셈 | high | official_single_source |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_product_expansion | 전개 | prerequisite_for | 다항식의 곱 전개하기 | high | official_dual_source |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_factor_polynomial_multiplication | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 다항식의 곱셈 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_factor_perfect_square_expression | 거듭제곱 | prerequisite_for | 완전제곱식 | high | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_factor_unit | 식의 계산 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | official_single_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_binomial_product_xab | 계수 | prerequisite_for | (x+a)(x+b) 공식 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_cross_term_coefficient_check | 계수 | prerequisite_for | 교차항 계수 확인하기 | medium | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_linear_product_axb_cxd | 계수 | prerequisite_for | (ax+b)(cx+d) 공식 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_perfect_square_middle_term_check | 계수 | prerequisite_for | 완전제곱식의 가운데 항 확인하기 | medium | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_sum_product_pair_search | 계수 | prerequisite_for | 합과 곱이 맞는 수 찾기 | medium | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_factor_quadratic_expression | 차수 | prerequisite_for | 이차식 | medium | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_factor_quadratic_expression | 다항식 | prerequisite_for | 이차식 | medium | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_factor_unit | 다항식 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | official_dual_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_factorization_solving | 인수분해 | prerequisite_for | 인수분해를 이용한 이차방정식 풀이 | medium | official_single_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_solving | 인수분해 | prerequisite_for | 이차방정식 풀기 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_eq_quadratic_equation | 이차식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_formula | 이차식 | prerequisite_for | 이차함수의 식 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_general_form | 이차식 | prerequisite_for | y=ax^2+bx+c 꼴 | medium | official_single_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_quadratic_function | 이차식 | prerequisite_for | 이차함수 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_situation_to_formula | 이차식 | prerequisite_for | 상황을 이차함수 식으로 나타내기 | high | official_dual_source |
| m1_factor_quadratic_factorization__prerequisite_for__m1_quad_eq_factorized_form | 이차식 인수분해 | prerequisite_for | 이차방정식의 인수분해된 식 표현 | medium | official_single_source |
| m1_factor_unit__prerequisite_for__m1_quad_eq_unit | 다항식의 곱셈과 인수분해 | prerequisite_for | 이차방정식 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_factor_common_factor_extraction | 분배법칙 | prerequisite_for | 공통인수로 묶기 | medium | official_dual_source |
| m1_num_distributive_law__prerequisite_for__m1_factor_common_factor_formula | 분배법칙 | prerequisite_for | m(a+b) 공식 | high | official_single_source |
| m1_calc_expansion__used_in__m1_factor_polynomial_product_expansion | 전개 | used_in | 다항식의 곱 전개하기 | high | official_dual_source |
| m1_factor_binomial_product_xab__used_in__m1_quad_eq_factorization_solving | (x+a)(x+b) 공식 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_dual_source |
| m1_factor_factorization__used_in__m1_quad_eq_unit | 인수분해 | used_in | 이차방정식 | medium | official_dual_source |
| m1_factor_linear_product_axb_cxd__used_in__m1_quad_eq_factorization_solving | (ax+b)(cx+d) 공식 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_dual_source |
| m1_factor_quadratic_expression__used_in__m1_quad_eq_quadratic_equation | 이차식 | used_in | 이차방정식 | medium | official_dual_source |
| m1_factor_quadratic_expression__used_in__m1_quad_func_formula | 이차식 | used_in | 이차함수의 식 | medium | official_dual_source |
| m1_factor_quadratic_factorization__used_in__m1_quad_eq_factorization_solving | 이차식 인수분해 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_single_source |
