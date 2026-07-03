# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 6
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차함수와 일차방정식의 관계
- priority tier: highest
- workplan score: 264
- concepts: 41
- edges touching unit: 200
- cross-unit edges: 61
- low confidence concepts: 10
- low confidence edges: 29

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 6 |
| procedure | 12 |
| property | 13 |
| representation | 8 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 42 |
| contrasts_with | 6 |
| often_confused_with | 15 |
| prerequisite_for | 67 |
| related_to | 8 |
| represented_by | 7 |
| used_in | 55 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_func_coincident_graph_case | 두 그래프가 일치하는 경우 | property | official_dual_source | 공식 성취기준은 그래프와 해의 관계를 요구하지만 현재 근거 요약은 일치 사례를 직접 열거하지 않는다. 교과서 예제 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_parallel_graph_case | 두 그래프가 평행한 경우 | property | official_dual_source | 공식 성취기준은 그래프와 해의 관계를 요구하지만 현재 근거 요약은 평행 사례를 직접 열거하지 않는다. 교과서 예제 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_system_infinitely_many_solutions_graph_case | 일치하는 두 그래프와 해가 무수히 많은 경우 | property | official_dual_source | 공식 성취기준의 그래프와 해의 관계에서 추론한 사례다. 현재 출처 요약은 일치 사례를 직접 열거하지 않으므로 낮은 신뢰도로 둔다. |
| m1_func_system_no_solution_graph_case | 평행한 두 그래프와 해가 없는 경우 | property | official_dual_source | 공식 성취기준의 그래프와 해의 관계에서 추론한 사례다. 현재 출처 요약은 평행 사례를 직접 열거하지 않으므로 낮은 신뢰도로 둔다. |
| m1_mis_coincident_graph_single_solution | 일치하는 두 그래프의 해를 하나로 보는 오류 | misconception_risk | official_dual_source | 공식 문서가 직접 제시한 오류는 아니며, 그래프와 해의 관계에서 추론한 오개념 위험이다. 교과서 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_equation_intercepts_substitution_swap | x=0과 y=0 대입으로 구하는 축 교점을 바꾸어 생각하는 오류 | misconception_risk | official_dual_source | 공식 문서가 직접 제시한 오류는 아니며, 축과의 교점 구하기 절차를 세분하면서 추론한 오개념 위험이다. |
| m1_mis_intersection_count_solution_count | 교점의 개수와 해의 개수를 따로 보는 오류 | misconception_risk | official_dual_source | 성취수준의 교점과 해의 관계 설명에서 추론한 오개념 위험이다. 세부 사례별 오류는 교과서 예제 확인 후 분리한다. |
| m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_parallel_graphs_have_solution | 평행한 두 그래프에도 해가 있다고 보는 오류 | misconception_risk | official_dual_source | 공식 문서가 직접 제시한 오류는 아니며, 그래프와 해의 관계에서 추론한 오개념 위험이다. 교과서 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_single_equation_graph_as_system_solution | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | misconception_risk | official_dual_source | 한 식의 해 전체와 연립된 두 식의 공통 해를 구별해야 하는 관계 단원에서 추론한 오개념 위험이다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_intersection_solution__often_confused_with__m1_system_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_mis_single_equation_graph_as_system_solution__often_confused_with__m1_system_solution | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_func_equation_x_axis_intersection | 좌표 | prerequisite_for | 일차방정식 그래프의 x축과의 교점 | medium | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_func_equation_y_axis_intersection | 좌표 | prerequisite_for | 일차방정식 그래프의 y축과의 교점 | medium | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_func_intersection_point | 좌표 | prerequisite_for | 교점 | medium | official_single_source |
| m1_coord_coordinate__prerequisite_for__m1_func_intersection_point_coordinate | 좌표 | prerequisite_for | 교점의 좌표 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_equation_graph_from_two_solution_pairs | 좌표평면 | prerequisite_for | 두 해의 순서쌍으로 일차방정식 그래프 그리기 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_equation_two_intercepts_graph_drawing | 좌표평면 | prerequisite_for | 두 축과의 교점으로 일차방정식 그래프 그리기 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_system_graph_same_plane | 좌표평면 | prerequisite_for | 두 일차함수 그래프를 한 좌표평면에 나타내기 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_two_variable_linear_equation_graph | 좌표평면 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_func_read_solution_pair_from_equation_graph | 순서쌍 | prerequisite_for | 그래프에서 미지수가 2개인 일차방정식의 해 읽기 | medium | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_func_two_variable_equation_solution_pair | 순서쌍 | prerequisite_for | 미지수가 2개인 일차방정식 해의 순서쌍 | medium | official_dual_source |
| m1_coord_x_axis__prerequisite_for__m1_func_equation_x_axis_intersection | x축 | prerequisite_for | 일차방정식 그래프의 x축과의 교점 | medium | official_dual_source |
| m1_coord_x_axis__prerequisite_for__m1_func_equation_y_zero_substitution | x축 | prerequisite_for | y=0을 대입해 x축과의 교점 구하기 | medium | official_dual_source |
| m1_coord_x_coordinate__prerequisite_for__m1_func_intersection_coordinate_reading | x좌표 | prerequisite_for | 교점 좌표 읽기 | medium | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_func_equation_x_zero_substitution | y축 | prerequisite_for | x=0을 대입해 y축과의 교점 구하기 | medium | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_func_equation_y_axis_intersection | y축 | prerequisite_for | 일차방정식 그래프의 y축과의 교점 | medium | official_dual_source |
| m1_coord_y_coordinate__prerequisite_for__m1_func_intersection_coordinate_reading | y좌표 | prerequisite_for | 교점 좌표 읽기 | medium | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_func_equation_function_form_conversion | 등식의 성질 | prerequisite_for | 미지수가 2개인 일차방정식을 y=ax+b 꼴로 나타내기 | medium | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_func_eq_relation_unit | 일차방정식 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_func_equation_x_zero_substitution | 대입 | prerequisite_for | x=0을 대입해 y축과의 교점 구하기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_func_equation_y_zero_substitution | 대입 | prerequisite_for | y=0을 대입해 x축과의 교점 구하기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_func_solution_pair_check_by_substitution | 대입 | prerequisite_for | 순서쌍을 대입하여 방정식의 해인지 확인하기 | medium | official_dual_source |
| m1_func_linear_formula__prerequisite_for__m1_func_equation_function_form_conversion | 일차함수의 식 | prerequisite_for | 미지수가 2개인 일차방정식을 y=ax+b 꼴로 나타내기 | medium | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_linear_graphs | 일차함수의 그래프 | prerequisite_for | 두 일차함수의 그래프 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_equation_as_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_linear_equation_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_func_unit__prerequisite_for__m1_func_eq_relation_unit | 일차함수와 그 그래프 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_num_zero__prerequisite_for__m1_func_equation_x_zero_substitution | 0 | prerequisite_for | x=0을 대입해 y축과의 교점 구하기 | medium | official_dual_source |
| m1_num_zero__prerequisite_for__m1_func_equation_y_zero_substitution | 0 | prerequisite_for | y=0을 대입해 x축과의 교점 구하기 | medium | official_dual_source |
| m1_repr_table__prerequisite_for__m1_func_equation_solution_table | 표 | prerequisite_for | 미지수가 2개인 일차방정식 해의 대응표 | medium | official_dual_source |
| m1_system_common_solution_condition__prerequisite_for__m1_func_intersection_as_common_solution | 공통 해 조건 | prerequisite_for | 교점은 두 방정식의 공통해 | high | official_dual_source |
| m1_system_simultaneous_linear_equations__prerequisite_for__m1_func_system_graph_relation | 연립일차방정식 | prerequisite_for | 두 일차함수의 그래프와 연립일차방정식의 관계 | high | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_intersection_solution_count_relation | 연립일차방정식의 해 | prerequisite_for | 교점의 개수와 연립일차방정식 해의 개수의 관계 | medium | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_single_solution_set_vs_common_solution | 연립일차방정식의 해 | prerequisite_for | 한 방정식의 해 전체와 두 방정식의 공통해 구별하기 | medium | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_system_solution_from_intersection | 연립일차방정식의 해 | prerequisite_for | 교점으로 연립일차방정식의 해 말하기 | high | official_dual_source |
| m1_system_solution_ordered_pair__prerequisite_for__m1_func_intersection_coordinate_to_system_solution_pair | 해의 순서쌍 표현 | prerequisite_for | 교점의 좌표를 연립일차방정식의 해로 쓰기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_equation_function_form_conversion | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식을 y=ax+b 꼴로 나타내기 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_solution_pair | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 해의 순서쌍 | medium | official_dual_source |
