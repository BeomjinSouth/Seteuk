# Node Edge Consistency Audit

This generated audit compares node relationship arrays with explicit edge rows.

## Summary

- total issues: 950
- edge_without_parent_id: 27
- edge_without_prerequisite_id: 10
- missing_edge_for_parent_id: 102
- missing_edge_for_prerequisite_id: 342
- missing_edge_for_related_id: 469

## Priority Rows

| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |
|---|---|---|---|---|---|---|---|
| missing_edge_for_parent_id | m1_context_speed_distance | 속력과 거리 맥락 | parent_ids | m1_prop_proportion_relation | 정비례·반비례 관계 판단 | contains |  |
| missing_edge_for_parent_id | m1_context_speed_time | 속력과 시간 맥락 | parent_ids | m1_prop_proportion_relation | 정비례·반비례 관계 판단 | contains |  |
| missing_edge_for_parent_id | m1_coord_axis_point | 축 위의 점 | parent_ids | m1_coord_point_location | 점의 위치 | contains |  |
| missing_edge_for_parent_id | m1_coord_number_line | 수직선 | parent_ids | m1_coord_graph_unit | 좌표평면과 그래프 | contains |  |
| missing_edge_for_parent_id | m1_coord_point_location | 점의 위치 | parent_ids | m1_coord_coordinate | 좌표 | contains |  |
| missing_edge_for_parent_id | m1_eq_both_sides | 양변 | parent_ids | m1_eq_equality | 등식 | contains |  |
| missing_edge_for_parent_id | m1_eq_identity | 항등식 | parent_ids | m1_eq_unit | 일차방정식 | contains |  |
| missing_edge_for_parent_id | m1_eq_left_side | 좌변 | parent_ids | m1_eq_equality | 등식 | contains |  |
| missing_edge_for_parent_id | m1_eq_modeling_linear_equation | 일차방정식 세우기 | parent_ids | m1_eq_unit | 일차방정식 | contains |  |
| missing_edge_for_parent_id | m1_eq_right_side | 우변 | parent_ids | m1_eq_equality | 등식 | contains |  |
| missing_edge_for_parent_id | m1_eq_root | 근 | parent_ids | m1_eq_solution | 해 | contains |  |
| missing_edge_for_parent_id | m1_eq_solution_check | 해의 확인 | parent_ids | m1_eq_unit | 일차방정식 | contains |  |
| missing_edge_for_parent_id | m1_eq_transposition | 이항 | parent_ids | m1_eq_solving_linear_equation | 일차방정식 풀기 | contains |  |
| missing_edge_for_parent_id | m1_eq_unknown | 미지수 | parent_ids | m1_eq_equation | 방정식 | contains |  |
| missing_edge_for_parent_id | m1_expr_degree | 차수 | parent_ids | m1_expr_term | 항 | contains |  |
| missing_edge_for_parent_id | m1_expr_usefulness | 문자를 사용한 식의 유용성 | parent_ids | m1_expr_unit | 문자의 사용과 식 | contains |  |
| missing_edge_for_parent_id | m1_factor_quadratic_expression | 이차식 | parent_ids | m1_quad_eq_unit | 이차방정식 | contains |  |
| missing_edge_for_parent_id | m1_func_correspondence | 대응 관계 | parent_ids | m1_func_function | 함수 | contains |  |
| missing_edge_for_parent_id | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_function_judgement | 함수인지 판단하기 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_graph_drawing | 일차함수 그래프 그리기 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_intersection_count | 교점의 개수 | parent_ids | m1_func_eq_relation_unit | 일차함수와 일차방정식의 관계 | contains |  |
| missing_edge_for_parent_id | m1_func_intersection_point | 교점 | parent_ids | m1_func_eq_relation_unit | 일차함수와 일차방정식의 관계 | contains |  |
| missing_edge_for_parent_id | m1_func_linear_formula | 일차함수의 식 | parent_ids | m1_func_linear_function | 일차함수 | contains |  |
| missing_edge_for_parent_id | m1_func_parallel_translation | 평행이동 | parent_ids | m1_func_graph_drawing | 일차함수 그래프 그리기 | contains |  |
| missing_edge_for_parent_id | m1_func_problem_solving | 일차함수 활용 문제 해결 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_system_solution_from_intersection | 교점으로 연립일차방정식의 해 말하기 | parent_ids | m1_func_eq_relation_unit | 일차함수와 일차방정식의 관계 | contains |  |
| missing_edge_for_parent_id | m1_func_tech_tool_graph | 공학 도구로 함수 그래프 탐구하기 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | parent_ids | m1_func_linear_graph | 일차함수의 그래프 | contains |  |
| missing_edge_for_parent_id | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | parent_ids | m1_func_linear_graph | 일차함수의 그래프 | contains |  |
| missing_edge_for_parent_id | m1_graph_change_state | 변화 상태 | parent_ids | m1_graph_graph_interpretation | 그래프 해석 | contains |  |
| missing_edge_for_parent_id | m1_graph_graph_interpretation | 그래프 해석 | parent_ids | m1_graph_graph | 그래프 | contains |  |
| missing_edge_for_parent_id | m1_graph_situation_graphing | 상황을 그래프로 나타내기 | parent_ids | m1_graph_graph | 그래프 | contains |  |
| missing_edge_for_parent_id | m1_ineq_compare_equality_properties | 등식의 성질과 부등식의 성질 비교 | parent_ids | m1_ineq_unit | 일차부등식 | contains |  |
| missing_edge_for_parent_id | m1_ineq_solution_check | 부등식 해의 확인 | parent_ids | m1_ineq_unit | 일차부등식 | contains |  |
| missing_edge_for_parent_id | m1_mis_absolute_value_positive | 절댓값을 항상 양수로만 말하는 오류 | parent_ids | m1_num_integer_rational_unit | 정수와 유리수 | contains |  |
| missing_edge_for_parent_id | m1_mis_all_relations_are_functions | 모든 두 양의 관계를 함수로 보는 오류 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_axis_quadrant | 축 위의 점을 사분면에 포함하는 오류 | parent_ids | m1_coord_graph_unit | 좌표평면과 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_axis_vertex | 포물선의 축과 꼭짓점을 혼동하는 오류 | parent_ids | m1_quad_func_unit | 이차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_coefficient_constant_degree | 계수·상수항·차수 혼동 | parent_ids | m1_expr_unit | 문자의 사용과 식 | contains |  |
| missing_edge_for_parent_id | m1_mis_direct_inverse_generalization | 증가·감소만으로 정비례·반비례 판단 | parent_ids | m1_coord_graph_unit | 좌표평면과 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_expansion_factorization_direction | 전개와 인수분해 방향을 혼동하는 오류 | parent_ids | m1_factor_unit | 다항식의 곱셈과 인수분해 | contains |  |
| missing_edge_for_parent_id | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | parent_ids | m1_calc_unit | 식의 계산 | contains |  |
| missing_edge_for_parent_id | m1_mis_expression_equation | 식과 방정식 혼동 | parent_ids | m1_eq_unit | 일차방정식 | contains |  |
| missing_edge_for_parent_id | m1_mis_factor_common_factor_missing | 공통인수를 빠뜨리는 오류 | parent_ids | m1_factor_unit | 다항식의 곱셈과 인수분해 | contains |  |
| missing_edge_for_parent_id | m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | parent_ids | m1_factor_unit | 다항식의 곱셈과 인수분해 | contains |  |
| missing_edge_for_parent_id | m1_mis_finite_to_repeating_scope | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | parent_ids | m1_num_repeating_decimal_unit | 유리수와 순환소수 | contains |  |
| missing_edge_for_parent_id | m1_mis_function_linear_function | 함수와 일차함수 혼동 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_function_value_input_output | 함숫값과 입력값 혼동 | parent_ids | m1_func_unit | 일차함수와 그 그래프 | contains |  |
| missing_edge_for_parent_id | m1_mis_gcd_lcm_scope | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | parent_ids | m1_num_prime_factor_unit | 소인수분해 | contains |  |

## Notes

- Rows are review items, not automatic data corrections.
- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.
- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.
