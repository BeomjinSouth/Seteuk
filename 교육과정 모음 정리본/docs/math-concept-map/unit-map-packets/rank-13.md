# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 13
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차방정식
- priority tier: highest
- workplan score: 164
- concepts: 31
- edges touching unit: 164
- cross-unit edges: 55
- low confidence concepts: 3
- low confidence edges: 14

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 12 |
| property | 3 |
| sub_concept | 2 |
| term | 8 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 32 |
| contrasts_with | 9 |
| equivalent_to | 2 |
| often_confused_with | 11 |
| prerequisite_for | 71 |
| related_to | 3 |
| represented_by | 1 |
| used_in | 35 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_expression_equation | 식과 방정식 혼동 | misconception_risk | official_dual_source | 성취수준의 방정식·항등식·다항식 구별 요구에서 추론한 오개념 위험이다. |
| m1_mis_solution_check | 구한 해의 상황 적합성 확인 누락 | misconception_risk | official_dual_source |  |
| m1_mis_transposition_sign | 이항할 때 부호를 잘못 바꾸는 오류 | misconception_risk | official_dual_source | 이항 용어와 방정식 풀이 성취수준에서 추론했다. 실제 빈도는 교과서 문제와 학생 오답 자료 확인 필요. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_expression_equation__often_confused_with__m1_repr_expression | 식과 방정식 혼동 | often_confused_with | 식 | low | official_dual_source |
| m1_mis_ineq_solution_single_value__often_confused_with__m1_eq_solution | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_mis_system_one_equation_only__often_confused_with__m1_eq_solution | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_compare_equality_properties | 등식의 성질 | prerequisite_for | 등식의 성질과 부등식의 성질 비교 | high | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_properties | 등식의 성질 | prerequisite_for | 부등식의 성질 | high | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_system_add_or_subtract_equations | 등식의 성질 | prerequisite_for | 두 방정식 더하거나 빼기 | medium | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_system_substitution_isolate_variable | 등식의 성질 | prerequisite_for | 한 미지수를 다른 미지수의 식으로 나타내기 | medium | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_quad_eq_quadratic_equation | 방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_system_simultaneous_equations | 방정식 | prerequisite_for | 연립방정식 | high | official_dual_source |
| m1_eq_linear_equation__prerequisite_for__m1_system_two_variable_linear_equation | 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_quad_eq_solution | 해 | prerequisite_for | 이차방정식의 해 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_system_common_solution_condition | 해 | prerequisite_for | 공통 해 조건 | medium | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_system_solution | 해 | prerequisite_for | 연립일차방정식의 해 | high | official_dual_source |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_context_solution_check | 해의 확인 | prerequisite_for | 해가 문제 상황에 적합한지 확인하기 | high | official_dual_source |
| m1_eq_solution_check__prerequisite_for__m1_quad_eq_modeling | 해의 확인 | prerequisite_for | 이차방정식 활용 문제 해결 | high | official_dual_source |
| m1_eq_solving_linear_equation__prerequisite_for__m1_system_solving | 일차방정식 풀기 | prerequisite_for | 연립일차방정식 풀기 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_coord_graph_unit | 일차방정식 | prerequisite_for | 좌표평면과 그래프 | medium | official_single_source |
| m1_eq_unit__prerequisite_for__m1_func_eq_relation_unit | 일차방정식 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_func_unit | 일차방정식 | prerequisite_for | 일차함수와 그 그래프 | high | official_single_source |
| m1_eq_unit__prerequisite_for__m1_ineq_unit | 일차방정식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_quad_eq_unit | 일차방정식 | prerequisite_for | 이차방정식 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_system_unit | 일차방정식 | prerequisite_for | 연립일차방정식 | high | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_system_modeling_variable_assignment | 미지수 | prerequisite_for | 두 미지수 정하기 | medium | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_system_two_variable_linear_equation | 미지수 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_expr_constant_term__prerequisite_for__m1_eq_collect_constant_terms | 상수항 | prerequisite_for | 상수항 모으기 | medium | official_dual_source |
| m1_expr_letter__prerequisite_for__m1_eq_unknown | 문자 | prerequisite_for | 미지수 | high | official_dual_source |
| m1_expr_letter_quantity__prerequisite_for__m1_eq_choose_unknown_from_context | 문자가 나타내는 수량 정하기 | prerequisite_for | 문제 상황에서 미지수 정하기 | medium | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_eq_linear_equation | 일차식 | prerequisite_for | 일차방정식 | high | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_eq_unit | 일차식 | prerequisite_for | 일차방정식 | high | official_single_source |
| m1_expr_literal_expression__prerequisite_for__m1_eq_modeling_linear_equation | 문자를 사용한 식 | prerequisite_for | 일차방정식 세우기 | high | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_eq_equation | 다항식 | prerequisite_for | 방정식 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_judge_solution | 대입 | prerequisite_for | 해인지 판단하기 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_solution | 대입 | prerequisite_for | 해 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_solution_check | 대입 | prerequisite_for | 해의 확인 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_truth_value_by_substitution | 대입 | prerequisite_for | 대입값에 따른 등식의 참거짓 | medium | official_dual_source |
| m1_expr_term__prerequisite_for__m1_eq_collect_unknown_terms | 항 | prerequisite_for | 미지수항 모으기 | medium | official_dual_source |
| m1_expr_term__prerequisite_for__m1_eq_transposition | 항 | prerequisite_for | 이항 | high | official_single_source |
| m1_expr_unit__prerequisite_for__m1_eq_unit | 문자의 사용과 식 | prerequisite_for | 일차방정식 | high | official_dual_source |
| m1_num_addition__prerequisite_for__m1_eq_equal_add_subtract_property | 덧셈 | prerequisite_for | 양변에 같은 수를 더하거나 빼기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_eq_equal_multiply_divide_property | 나눗셈 | prerequisite_for | 양변에 같은 수를 곱하거나 나누기 | medium | official_dual_source |
