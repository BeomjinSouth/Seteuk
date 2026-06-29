# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 11
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 이차방정식
- priority tier: high
- workplan score: 115
- concepts: 14
- edges touching unit: 68
- cross-unit edges: 23
- low confidence concepts: 3
- low confidence edges: 15

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 3 |
| procedure | 3 |
| property | 1 |
| representation | 1 |
| term | 4 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 15 |
| contrasts_with | 1 |
| equivalent_to | 1 |
| often_confused_with | 8 |
| prerequisite_for | 24 |
| related_to | 3 |
| represented_by | 3 |
| used_in | 13 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_quadratic_expression_equation | 이차식과 이차방정식을 혼동하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_quadratic_factorization_solution | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | misconception_risk | official_single_source |  |
| m1_mis_root_coefficient_relation_scope | 근과 계수와의 관계를 중학교 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_factor_quadratic_expression__prerequisite_for__m1_mis_quadratic_expression_equation | 이차식 | prerequisite_for | 이차식과 이차방정식을 혼동하는 오류 | low | official_dual_source |
| m1_mis_quadratic_expression_equation__often_confused_with__m1_factor_quadratic_expression | 이차식과 이차방정식을 혼동하는 오류 | often_confused_with | 이차식 | low | official_dual_source |
| m1_mis_quadratic_factorization_solution__often_confused_with__m1_factor_factorization | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | often_confused_with | 인수분해 | low | official_single_source |
| m1_mis_quadratic_function_equation__often_confused_with__m1_quad_eq_quadratic_equation | 이차함수와 이차방정식을 혼동하는 오류 | often_confused_with | 이차방정식 | low | official_dual_source |
| m1_quad_eq_unit__contains__m1_factor_quadratic_expression | 이차방정식 | contains | 이차식 | medium | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_quad_eq_quadratic_equation | 방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_quad_eq_solution | 해 | prerequisite_for | 이차방정식의 해 | high | official_dual_source |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_modeling | 해의 확인 | prerequisite_for | 이차방정식 활용 문제 해결 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_quad_eq_unit | 일차방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_quad_eq_quadratic_term | 차수 | prerequisite_for | 이차항 | medium | official_dual_source |
| m1_expr_term__prerequisite_for__m1_quad_eq_quadratic_term | 항 | prerequisite_for | 이차항 | medium | official_dual_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_factorization_solving | 인수분해 | prerequisite_for | 인수분해를 이용한 이차방정식 풀이 | medium | official_single_source |
| m1_factor_factorization__prerequisite_for__m1_quad_eq_solving | 인수분해 | prerequisite_for | 이차방정식 풀기 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_eq_quadratic_equation | 이차식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_factor_unit__prerequisite_for__m1_quad_eq_unit | 다항식의 곱셈과 인수분해 | prerequisite_for | 이차방정식 | medium | official_dual_source |
| m1_quad_eq_unit__prerequisite_for__m1_quad_func_unit | 이차방정식 | prerequisite_for | 이차함수와 그 그래프 | medium | official_single_source |
| m1_factor_quadratic_expression__represented_by__m1_quad_eq_standard_form | 이차식 | represented_by | 이차방정식의 식 표현 | medium | official_dual_source |
| m1_factor_binomial_product_xab__used_in__m1_quad_eq_factorization_solving | (x+a)(x+b) 공식 | used_in | 인수분해를 이용한 이차방정식 풀이 | medium | official_dual_source |
| m1_factor_factorization__used_in__m1_quad_eq_unit | 인수분해 | used_in | 이차방정식 | medium | official_dual_source |
| m1_factor_quadratic_expression__used_in__m1_quad_eq_quadratic_equation | 이차식 | used_in | 이차방정식 | medium | official_dual_source |
| m1_quad_eq_solving__used_in__m1_eq_solution_check | 이차방정식 풀기 | used_in | 해의 확인 | high | official_dual_source |
| m1_factor_quadratic_expression__contrasts_with__m1_quad_eq_quadratic_term | 이차식 | contrasts_with | 이차항 | medium | official_dual_source |
| m1_quad_eq_solution__equivalent_to__m1_eq_root | 이차방정식의 해 | equivalent_to | 근 | medium | official_dual_source |
