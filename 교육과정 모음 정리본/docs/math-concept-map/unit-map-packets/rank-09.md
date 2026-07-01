# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 9
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 이차방정식
- priority tier: highest
- workplan score: 170
- concepts: 22
- edges touching unit: 103
- cross-unit edges: 30
- low confidence concepts: 5
- low confidence edges: 21

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 3 |
| procedure | 7 |
| property | 2 |
| representation | 2 |
| sub_concept | 1 |
| term | 5 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 22 |
| contrasts_with | 2 |
| equivalent_to | 1 |
| often_confused_with | 8 |
| prerequisite_for | 38 |
| related_to | 10 |
| represented_by | 3 |
| used_in | 19 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_quad_eq_root_formula_substitution | 근의 공식에 계수 대입하기 | procedure | official_single_source | 근의 공식 용어와 이차방정식 풀이 맥락을 바탕으로 둔 미시 절차이며, 교과서 예제 근거 확보 전까지 낮은 신뢰도로 둔다. |
| m1_quad_eq_zero_product_condition | 각 인수가 0이 되는 조건 | property | official_single_source | 공식 문서에는 풀이 방법의 세부 문구가 직접 제시되지 않아, 인수분해 풀이와 오개념 위험에서 추론한 미시 조건으로 낮은 신뢰도로 둔다. |
| m1_mis_quadratic_expression_equation | 이차식과 이차방정식을 혼동하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_quadratic_factorization_solution | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | misconception_risk | official_single_source |  |
| m1_mis_root_coefficient_relation_scope | 근과 계수와의 관계를 중학교 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_factor_factorization__prerequisite_for__m1_quad_eq_zero_product_condition | 인수분해 | prerequisite_for | 각 인수가 0이 되는 조건 | low | official_single_source |
| m1_num_radical_expression__prerequisite_for__m1_quad_eq_root_formula_substitution | 근호를 포함한 식 | prerequisite_for | 근의 공식에 계수 대입하기 | low | official_single_source |
| m1_mis_quadratic_expression_equation__often_confused_with__m1_factor_quadratic_expression | 이차식과 이차방정식을 혼동하는 오류 | often_confused_with | 이차식 | low | official_dual_source |
| m1_mis_quadratic_factorization_solution__often_confused_with__m1_factor_factorization | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | often_confused_with | 인수분해 | low | official_single_source |
| m1_mis_quadratic_function_equation__often_confused_with__m1_quad_eq_quadratic_equation | 이차함수와 이차방정식을 혼동하는 오류 | often_confused_with | 이차방정식 | low | official_dual_source |
| m1_quad_eq_leading_coefficient_one_case__related_to__m1_factor_binomial_product_xab | 이차항의 계수가 1인 이차방정식 | related_to | (x+a)(x+b) 공식 | low | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_quad_eq_quadratic_equation | 방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_quad_eq_solution | 해 | prerequisite_for | 이차방정식의 해 | high | official_dual_source |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_context_solution_check | 해의 확인 | prerequisite_for | 해가 문제 상황에 적합한지 확인하기 | high | official_dual_source |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_modeling | 해의 확인 | prerequisite_for | 이차방정식 활용 문제 해결 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_quad_eq_unit | 일차방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_quad_eq_coefficients_in_standard_form | 계수 | prerequisite_for | 이차방정식의 계수 | medium | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_quad_eq_leading_coefficient_one_case | 계수 | prerequisite_for | 이차항의 계수가 1인 이차방정식 | high | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_quad_eq_quadratic_term | 차수 | prerequisite_for | 이차항 | medium | official_single_source |
| m1_expr_term__prerequisite_for__m1_quad_eq_quadratic_term | 항 | prerequisite_for | 이차항 | medium | official_single_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_factorization_solving | 인수분해 | prerequisite_for | 인수분해를 이용한 이차방정식 풀이 | medium | official_single_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_solving | 인수분해 | prerequisite_for | 이차방정식 풀기 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_eq_quadratic_equation | 이차식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_factor_quadratic_factorization__prerequisite_for__m1_quad_eq_factorized_form | 이차식 인수분해 | prerequisite_for | 이차방정식의 인수분해된 식 표현 | medium | official_single_source |
| m1_factor_unit__prerequisite_for__m1_quad_eq_unit | 다항식의 곱셈과 인수분해 | prerequisite_for | 이차방정식 | medium | official_dual_source |
| m1_quad_eq_unit__prerequisite_for__m1_quad_func_unit | 이차방정식 | prerequisite_for | 이차함수와 그 그래프 | medium | official_single_source |
| m1_eq_solution_check__used_in__m1_quad_eq_modeling | 해의 확인 | used_in | 이차방정식 활용 문제 해결 | high | official_dual_source |
| m1_factor_binomial_product_xab__used_in__m1_quad_eq_factorization_solving | (x+a)(x+b) 공식 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_dual_source |
| m1_factor_factorization__used_in__m1_quad_eq_unit | 인수분해 | used_in | 이차방정식 | medium | official_dual_source |
| m1_factor_linear_product_axb_cxd__used_in__m1_quad_eq_factorization_solving | (ax+b)(cx+d) 공식 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_dual_source |
| m1_factor_quadratic_expression__used_in__m1_quad_eq_quadratic_equation | 이차식 | used_in | 이차방정식 | medium | official_dual_source |
| m1_factor_quadratic_factorization__used_in__m1_quad_eq_factorization_solving | 이차식 인수분해 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_single_source |
| m1_factor_quadratic_expression__contrasts_with__m1_quad_eq_quadratic_equation | 이차식 | contrasts_with | 이차방정식 | medium | official_dual_source |
| m1_factor_quadratic_expression__contrasts_with__m1_quad_eq_quadratic_term | 이차식 | contrasts_with | 이차항 | medium | official_dual_source |
| m1_quad_eq_solution__equivalent_to__m1_eq_root | 이차방정식의 해 | equivalent_to | 근 | medium | official_dual_source |
