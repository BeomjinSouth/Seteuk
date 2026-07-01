# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 22
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차함수와 일차방정식의 관계
- priority tier: high
- workplan score: 107
- concepts: 16
- edges touching unit: 81
- cross-unit edges: 29
- low confidence concepts: 3
- low confidence edges: 11

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 3 |
| procedure | 2 |
| property | 4 |
| representation | 5 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 17 |
| contrasts_with | 3 |
| often_confused_with | 8 |
| prerequisite_for | 26 |
| related_to | 4 |
| represented_by | 7 |
| used_in | 16 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_intersection_count_solution_count | 교점의 개수와 해의 개수를 따로 보는 오류 | misconception_risk | official_dual_source | 성취수준의 교점과 해의 관계 설명에서 추론한 오개념 위험이다. 세부 사례별 오류는 교과서 예제 확인 후 분리한다. |
| m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_single_equation_graph_as_system_solution | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | misconception_risk | official_dual_source | 한 식의 해 전체와 연립된 두 식의 공통 해를 구별해야 하는 관계 단원에서 추론한 오개념 위험이다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_intersection_solution__often_confused_with__m1_system_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_mis_single_equation_graph_as_system_solution__often_confused_with__m1_system_solution | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | often_confused_with | 연립일차방정식의 해 | low | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_func_intersection_point | 좌표 | prerequisite_for | 교점 | medium | official_single_source |
| m1_coord_coordinate__prerequisite_for__m1_func_intersection_point_coordinate | 좌표 | prerequisite_for | 교점의 좌표 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_two_variable_linear_equation_graph | 좌표평면 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_func_two_variable_equation_solution_pair | 순서쌍 | prerequisite_for | 미지수가 2개인 일차방정식 해의 순서쌍 | medium | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_func_eq_relation_unit | 일차방정식 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_linear_graphs | 일차함수의 그래프 | prerequisite_for | 두 일차함수의 그래프 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_equation_as_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_linear_equation_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_func_unit__prerequisite_for__m1_func_eq_relation_unit | 일차함수와 그 그래프 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_system_simultaneous_linear_equations__prerequisite_for__m1_func_system_graph_relation | 연립일차방정식 | prerequisite_for | 두 일차함수의 그래프와 연립일차방정식의 관계 | high | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_intersection_solution_count_relation | 연립일차방정식의 해 | prerequisite_for | 교점의 개수와 연립일차방정식 해의 개수의 관계 | medium | official_dual_source |
| m1_system_solution__prerequisite_for__m1_func_system_solution_from_intersection | 연립일차방정식의 해 | prerequisite_for | 교점으로 연립일차방정식의 해 말하기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_equation_solution_pair | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식 해의 순서쌍 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__prerequisite_for__m1_func_two_variable_linear_equation_graph | 미지수가 2개인 일차방정식 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_func_two_variable_equation_solution_pair__represented_by__m1_coord_ordered_pair | 미지수가 2개인 일차방정식 해의 순서쌍 | represented_by | 순서쌍 | medium | official_dual_source |
| m1_system_simultaneous_linear_equations__represented_by__m1_func_two_linear_graphs | 연립일차방정식 | represented_by | 두 일차함수의 그래프 | high | official_dual_source |
| m1_system_solution__represented_by__m1_func_intersection_point | 연립일차방정식의 해 | represented_by | 교점 | high | official_dual_source |
| m1_system_solution__represented_by__m1_func_intersection_point_coordinate | 연립일차방정식의 해 | represented_by | 교점의 좌표 | high | official_dual_source |
| m1_system_two_variable_linear_equation__represented_by__m1_func_two_variable_linear_equation_graph | 미지수가 2개인 일차방정식 | represented_by | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_func_linear_graph__used_in__m1_func_equation_relation | 일차함수의 그래프 | used_in | 일차함수와 미지수가 2개인 일차방정식의 관계 | high | official_dual_source |
| m1_system_two_variable_linear_equation__used_in__m1_func_equation_relation | 미지수가 2개인 일차방정식 | used_in | 일차함수와 미지수가 2개인 일차방정식의 관계 | medium | official_dual_source |
| m1_system_two_variable_linear_equation__used_in__m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식 | used_in | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_geo_intersection_point__contrasts_with__m1_func_intersection_point | 교점 | contrasts_with | 교점 | medium | official_dual_source |
| m1_coord_graph_unit__related_to__m1_func_eq_relation_unit | 좌표평면과 그래프 | related_to | 일차함수와 일차방정식의 관계 | medium | official_dual_source |
| m1_func_two_variable_equation_solution_pair__related_to__m1_system_solution_ordered_pair | 미지수가 2개인 일차방정식 해의 순서쌍 | related_to | 해의 순서쌍 표현 | medium | official_dual_source |
| m1_system_unit__related_to__m1_func_eq_relation_unit | 연립일차방정식 | related_to | 일차함수와 일차방정식의 관계 | medium | official_dual_source |
