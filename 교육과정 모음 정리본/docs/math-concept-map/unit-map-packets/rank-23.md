# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 23
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 연립일차방정식
- priority tier: highest
- workplan score: 176
- concepts: 27
- edges touching unit: 148
- cross-unit edges: 49
- low confidence concepts: 4
- low confidence edges: 21

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 4 |
| procedure | 16 |
| property | 1 |
| representation | 1 |
| term | 2 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 28 |
| contrasts_with | 2 |
| often_confused_with | 17 |
| prerequisite_for | 53 |
| related_to | 10 |
| represented_by | 9 |
| used_in | 29 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_system_elimination_sign | 가감법에서 부호와 계수 처리를 잘못하는 오류 | misconception_risk | official_dual_source | 소거·가감법 용어에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_system_one_equation_only | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | misconception_risk | official_dual_source | 공식 문서는 해 맥락만 제공하므로 교과서 예제·오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_system_ordered_pair_swap | 해의 순서쌍에서 두 미지수 값을 바꾸는 오류 | misconception_risk | official_dual_source | 미지수가 2개인 해를 순서쌍으로 표현할 때 생길 수 있는 위험으로 추론했다. 교과서 표기와 오답 근거가 필요하다. |
| m1_mis_system_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | misconception_risk | official_dual_source | 대입법 용어에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_intersection_solution__often_confused_with__m1_system_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_mis_single_equation_graph_as_system_solution__often_confused_with__m1_system_solution | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_mis_system_one_equation_only__often_confused_with__m1_eq_solution | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_mis_system_ordered_pair_swap__often_confused_with__m1_coord_ordered_pair | 해의 순서쌍에서 두 미지수 값을 바꾸는 오류 | often_confused_with | 순서쌍 | low | official_dual_source |
| m1_mis_system_substitution__often_confused_with__m1_expr_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | often_confused_with | 대입 | low | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_system_solution_ordered_pair | 순서쌍 | prerequisite_for | 해의 순서쌍 표현 | medium | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_system_add_or_subtract_equations | 등식의 성질 | prerequisite_for | 두 방정식 더하거나 빼기 | medium | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_system_substitution_isolate_variable | 등식의 성질 | prerequisite_for | 한 미지수를 다른 미지수의 식으로 나타내기 | medium | official_dual_source |
| m1_eq_equation__prerequisite_for__m1_system_simultaneous_equations | 방정식 | prerequisite_for | 연립방정식 | high | official_dual_source |
| m1_eq_linear_equation__prerequisite_for__m1_system_two_variable_linear_equation | 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_system_common_solution_condition | 해 | prerequisite_for | 공통 해 조건 | medium | official_dual_source |
| m1_eq_solution__prerequisite_for__m1_system_solution | 해 | prerequisite_for | 연립일차방정식의 해 | high | official_dual_source |
| m1_eq_solving_linear_equation__prerequisite_for__m1_system_solving | 일차방정식 풀기 | prerequisite_for | 연립일차방정식 풀기 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_system_unit | 일차방정식 | prerequisite_for | 연립일차방정식 | high | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_system_modeling_variable_assignment | 미지수 | prerequisite_for | 두 미지수 정하기 | medium | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_system_two_variable_linear_equation | 미지수 | prerequisite_for | 미지수가 2개인 일차방정식 | high | official_dual_source |
| m1_expr_add_sub_linear_expression__prerequisite_for__m1_system_elimination_coefficient_matching | 일차식의 덧셈과 뺄셈 | prerequisite_for | 소거할 미지수의 계수 맞추기 | medium | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_system_modeling | 문자를 사용한 식 | prerequisite_for | 연립일차방정식 세우기 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_system_modeling_variable_assignment | 문자를 사용한 식 | prerequisite_for | 두 미지수 정하기 | medium | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_system_substitution_isolate_variable | 문자를 사용한 식 | prerequisite_for | 한 미지수를 다른 미지수의 식으로 나타내기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_system_back_substitution | 대입 | prerequisite_for | 한 미지수 값을 대입해 다른 미지수 구하기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_system_solution_check | 대입 | prerequisite_for | 연립일차방정식 해의 확인 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_system_substitution_into_other_equation | 대입 | prerequisite_for | 다른 방정식에 식 전체 대입하기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_system_substitution_method | 대입 | prerequisite_for | 대입법 | high | official_dual_source |
| m1_num_addition__prerequisite_for__m1_system_add_or_subtract_equations | 덧셈 | prerequisite_for | 두 방정식 더하거나 빼기 | medium | official_dual_source |
| m1_num_subtraction__prerequisite_for__m1_system_add_or_subtract_equations | 뺄셈 | prerequisite_for | 두 방정식 더하거나 빼기 | medium | official_dual_source |
| m1_system_simultaneous_linear_equations__prerequisite_for__m1_func_system_graph_relation | 연립일차방정식 | prerequisite_for | 두 일차함수의 그래프와 연립일차방정식의 관계 | high | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_intersection_solution_count_relation | 연립일차방정식의 해 | prerequisite_for | 교점의 개수와 연립일차방정식 해의 개수의 관계 | medium | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_system_solution_from_intersection | 연립일차방정식의 해 | prerequisite_for | 교점으로 연립일차방정식의 해 말하기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_solution_pair | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 해의 순서쌍 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_linear_equation_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_system_simultaneous_linear_equations__represented_by__m1_func_two_linear_graphs | 연립일차방정식 | represented_by | 두 일차함수의 그래프 | high | official_dual_source |
| m1_system_solution__represented_by__m1_coord_ordered_pair | 연립일차방정식의 해 | represented_by | 순서쌍 | medium | official_dual_source |
| m1_system_solution__represented_by__m1_func_intersection_point | 연립일차방정식의 해 | represented_by | 교점 | high | official_dual_source |
| m1_system_solution__represented_by__m1_func_intersection_point_coordinate | 연립일차방정식의 해 | represented_by | 교점의 좌표 | high | official_dual_source |
| m1_system_solution_ordered_pair__represented_by__m1_coord_ordered_pair | 해의 순서쌍 표현 | represented_by | 순서쌍 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_linear_equation_graph | 미지수가 2개인 일차방정식 | represented_by | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_expr_add_sub_linear_expression__used_in__m1_system_addition_subtraction_method | 일차식의 덧셈과 뺄셈 | used_in | 가감법 | medium | official_dual_source |
| m1_expr_substitution__used_in__m1_system_solution_check | 대입 | used_in | 연립일차방정식 해의 확인 | medium | official_dual_source |
