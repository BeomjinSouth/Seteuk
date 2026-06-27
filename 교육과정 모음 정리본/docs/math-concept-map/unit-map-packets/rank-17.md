# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 17
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 연립일차방정식
- priority tier: high
- workplan score: 104
- concepts: 13
- edges touching unit: 62
- cross-unit edges: 27
- low confidence concepts: 3
- low confidence edges: 13

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 5 |
| term | 2 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 14 |
| contrasts_with | 1 |
| often_confused_with | 7 |
| prerequisite_for | 24 |
| related_to | 3 |
| represented_by | 5 |
| used_in | 8 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_system_elimination_sign | 가감법에서 부호와 계수 처리를 잘못하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_system_one_equation_only | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_system_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_intersection_solution__often_confused_with__m1_system_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_mis_system_one_equation_only__often_confused_with__m1_eq_solution | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_mis_system_substitution__often_confused_with__m1_expr_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | often_confused_with | 대입 | low | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_system_unit | 식의 계산 | prerequisite_for | 연립일차방정식 | high | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_system_simultaneous_equations | 방정식 | prerequisite_for | 연립방정식 | high | official_dual_source |
| m1_eq_linear_equation__prerequisite_for__m1_system_two_variable_linear_equation | 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_system_solution | 해 | prerequisite_for | 연립일차방정식의 해 | high | official_dual_source |
| m1_eq_solving_linear_equation__prerequisite_for__m1_system_solving | 일차방정식 풀기 | prerequisite_for | 연립일차방정식 풀기 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_system_unit | 일차방정식 | prerequisite_for | 연립일차방정식 | high | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_system_two_variable_linear_equation | 미지수 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_system_modeling | 문자를 사용한 식 | prerequisite_for | 연립일차방정식 세우기 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_system_substitution_method | 대입 | prerequisite_for | 대입법 | high | official_dual_source |
| m1_system_simultaneous_linear_equations__prerequisite_for__m1_func_system_graph_relation | 연립일차방정식 | prerequisite_for | 두 일차함수의 그래프와 연립일차방정식의 관계 | high | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_system_solution_from_intersection | 연립일차방정식의 해 | prerequisite_for | 교점으로 연립일차방정식의 해 말하기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_system_unit__prerequisite_for__m1_coord_graph_unit | 연립일차방정식 | prerequisite_for | 좌표평면과 그래프 | medium | official_dual_source |
| m1_system_unit__prerequisite_for__m1_func_eq_relation_unit | 연립일차방정식 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_system_simultaneous_linear_equations__represented_by__m1_func_system_graph_relation | 연립일차방정식 | represented_by | 두 일차함수의 그래프와 연립일차방정식의 관계 | high | official_dual_source |
| m1_system_solution__represented_by__m1_coord_ordered_pair | 연립일차방정식의 해 | represented_by | 순서쌍 | medium | official_dual_source |
| m1_system_solution__represented_by__m1_func_intersection_point | 연립일차방정식의 해 | represented_by | 교점 | high | official_dual_source |
| m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | represented_by | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_func_system_solution_from_intersection__used_in__m1_system_solution | 교점으로 연립일차방정식의 해 말하기 | used_in | 연립일차방정식의 해 | high | official_dual_source |
| m1_func_two_variable_equation_as_graph__used_in__m1_system_solution | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | used_in | 연립일차방정식의 해 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__used_in__m1_func_equation_relation | 미지수가 2개인 일차방정식 | used_in | 일차함수와 미지수가 2개인 일차방정식의 관계 | medium | official_dual_source |
| m1_ineq_unit__related_to__m1_system_unit | 일차부등식 | related_to | 연립일차방정식 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__related_to__m1_coord_graph_unit | 미지수가 2개인 일차방정식 | related_to | 좌표평면과 그래프 | medium | official_dual_source |
| m1_system_unit__related_to__m1_func_unit | 연립일차방정식 | related_to | 일차함수와 그 그래프 | medium | official_dual_source |
