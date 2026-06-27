# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 190
- high priority: 0
- medium priority: 0

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | low | m1_geo_convex_polygon_scope | 볼록다각형 범위 | m1_geo_diagonal_count | 다각형의 대각선 개수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 2 | low | m1_geo_convex_polygon_scope | 볼록다각형 범위 | m1_geo_polygon_angle_sum | 다각형의 내각과 외각의 크기 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 3 | low | m1_geo_diagonal_count | 다각형의 대각선 개수 | m1_geo_convex_polygon_scope | 볼록다각형 범위 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 4 | low | m1_geo_polygon_angle_sum | 다각형의 내각과 외각의 크기 | m1_geo_convex_polygon_scope | 볼록다각형 범위 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 5 | low | m1_factor_square_difference_formula | (a-b)^2 공식 | m1_factor_square_sum_formula | (a+b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 6 | low | m1_factor_square_sum_formula | (a+b)^2 공식 | m1_factor_square_difference_formula | (a-b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 7 | low | m1_expr_coefficient | 계수 | m1_expr_constant_term | 상수항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 8 | low | m1_expr_constant_term | 상수항 | m1_expr_coefficient | 계수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 9 | low | m1_calc_base | 밑 | m1_calc_exponent | 지수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 10 | low | m1_calc_exponent | 지수 | m1_calc_base | 밑 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 11 | low | m1_quad_func_general_form | y=ax^2+bx+c 꼴 | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 12 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_general_form | y=ax^2+bx+c 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 13 | low | m1_eq_both_sides | 양변 | m1_eq_left_side | 좌변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 14 | low | m1_eq_both_sides | 양변 | m1_eq_right_side | 우변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 15 | low | m1_eq_left_side | 좌변 | m1_eq_both_sides | 양변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 16 | low | m1_eq_right_side | 우변 | m1_eq_both_sides | 양변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 17 | low | m1_func_x_intercept | x절편 | m1_func_y_intercept | y절편 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 18 | low | m1_func_y_intercept | y절편 | m1_func_x_intercept | x절편 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 19 | low | m1_context_speed_distance | 속력과 거리 맥락 | m1_context_speed_time | 속력과 시간 맥락 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 20 | low | m1_context_speed_time | 속력과 시간 맥락 | m1_context_speed_distance | 속력과 거리 맥락 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 21 | low | m1_repr_expression | 식 | m1_repr_table | 표 | represented_by; related_to | confirm_representation_or_related_edge |
| 22 | low | m1_repr_table | 표 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 23 | low | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | m1_num_repeating_decimal_to_fraction | 순환소수를 분수로 나타내기 | used_in; related_to | confirm_used_in_or_related_edge |
| 24 | low | m1_num_repeating_decimal_to_fraction | 순환소수를 분수로 나타내기 | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | used_in; related_to | confirm_used_in_or_related_edge |
| 25 | low | m1_num_addition | 덧셈 | m1_num_subtraction | 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 26 | low | m1_num_associative_law | 결합법칙 | m1_num_commutative_law | 교환법칙 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 27 | low | m1_num_commutative_law | 교환법칙 | m1_num_associative_law | 결합법칙 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 28 | low | m1_num_division | 나눗셈 | m1_num_multiplication | 곱셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 29 | low | m1_num_minus_sign | 음의 부호 | m1_num_negative_number | 음수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 30 | low | m1_num_multiplication | 곱셈 | m1_num_division | 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 31 | low | m1_num_negative_number | 음수 | m1_num_minus_sign | 음의 부호 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 32 | low | m1_num_plus_sign | 양의 부호 | m1_num_positive_number | 양수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 33 | low | m1_num_positive_number | 양수 | m1_num_plus_sign | 양의 부호 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 34 | low | m1_num_subtraction | 뺄셈 | m1_num_addition | 덧셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 35 | low | m1_num_radical_expression | 근호를 포함한 식 | m1_num_rationalize_denominator | 분모의 유리화 | represented_by; related_to | confirm_representation_or_related_edge |
| 36 | low | m1_num_rationalize_denominator | 분모의 유리화 | m1_num_radical_expression | 근호를 포함한 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 37 | low | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 38 | low | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 39 | low | m1_data_mean | 평균 | m1_data_mode | 최빈값 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 40 | low | m1_data_mode | 최빈값 | m1_data_mean | 평균 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 41 | low | m1_data_no_correlation | 상관관계가 없는 경우 | m1_data_positive_correlation | 양의 상관관계 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 42 | low | m1_data_positive_correlation | 양의 상관관계 | m1_data_no_correlation | 상관관계가 없는 경우 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 43 | low | m1_geo_straight_angle | 평각 | m1_geo_vertical_angles | 맞꼭지각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 44 | low | m1_geo_similarity_judgement | 삼각형의 닮음 판별 | m1_geo_parallel_segment_ratio | 평행선 사이의 선분의 길이의 비 | used_in; related_to | confirm_used_in_or_related_edge |
| 45 | low | m1_geo_quadrilateral_relationship | 여러 가지 사각형 사이의 관계 | m1_geo_proof | 증명 | used_in; related_to | confirm_used_in_or_related_edge |
| 46 | low | m1_geo_circle_unit | 원의 성질 | m1_geo_plane_properties_unit | 평면도형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 47 | low | m1_geo_model_tool_solid | 모형과 공학 도구로 입체도형 탐구 | m1_geo_solid_net | 전개도 | represented_by; related_to | confirm_representation_or_related_edge |
| 48 | low | m1_geo_prism | 기둥 모양 입체도형 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 49 | low | m1_geo_prism | 기둥 모양 입체도형 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 50 | low | m1_geo_pyramid | 뿔 모양 입체도형 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 51 | low | m1_geo_pyramid | 뿔 모양 입체도형 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 52 | low | m1_geo_solid_cross_section | 입체도형의 단면 | m1_geo_solid_net | 전개도 | represented_by; related_to | confirm_representation_or_related_edge |
| 53 | low | m1_geo_sphere | 구 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 54 | low | m1_geo_sphere | 구 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 55 | low | m1_geo_triangle_construction | 삼각형의 작도 | m1_geo_triangle_congruence_conditions | 삼각형의 합동 조건 | used_in; related_to | confirm_used_in_or_related_edge |
| 56 | low | m1_geo_plane_properties_unit | 평면도형의 성질 | m1_geo_circle_unit | 원의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 57 | low | m1_geo_secant | 할선 | m1_geo_chord | 현 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 58 | low | m1_geo_right_triangle_judgement | 세 변의 길이로 직각삼각형 판별 | m1_geo_right_triangle | 직각삼각형 | used_in; related_to | confirm_used_in_or_related_edge |
| 59 | low | m1_factor_quadratic_expression | 이차식 | m1_quad_eq_quadratic_term | 이차항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 60 | low | m1_expr_coefficient | 계수 | m1_expr_degree | 차수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 61 | low | m1_expr_literal_expression | 문자를 사용한 식 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 62 | low | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 63 | low | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 64 | low | m1_calc_simplify_expression | 식을 간단히 하기 | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 65 | low | m1_calc_simplify_expression | 식을 간단히 하기 | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 66 | low | m1_calc_unit | 식의 계산 | m1_eq_unit | 일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 67 | low | m1_system_modeling | 연립일차방정식 세우기 | m1_system_solution | 연립일차방정식의 해 | used_in; related_to | confirm_used_in_or_related_edge |
| 68 | low | m1_system_modeling | 연립일차방정식 세우기 | m1_system_solving | 연립일차방정식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 69 | low | m1_quad_eq_double_root | 중근 | m1_quad_eq_root_formula | 근의 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 70 | low | m1_quad_eq_modeling | 이차방정식 활용 문제 해결 | m1_quad_eq_standard_form | 이차방정식의 식 표현 | represented_by; related_to | confirm_representation_or_related_edge |
| 71 | low | m1_quad_eq_quadratic_term | 이차항 | m1_factor_quadratic_expression | 이차식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 72 | low | m1_quad_eq_root_formula | 근의 공식 | m1_quad_eq_solution | 이차방정식의 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 73 | low | m1_quad_eq_solving | 이차방정식 풀기 | m1_quad_eq_factorization_solving | 인수분해를 이용한 이차방정식 풀이 | used_in; related_to | confirm_used_in_or_related_edge |
| 74 | low | m1_quad_eq_standard_form | 이차방정식의 식 표현 | m1_quad_eq_solving | 이차방정식 풀기 | represented_by; related_to | confirm_representation_or_related_edge |
| 75 | low | m1_quad_func_graph_drawing | 이차함수 그래프 그리기 | m1_quad_func_graph_properties | 이차함수 그래프의 성질 | used_in; related_to | confirm_used_in_or_related_edge |
| 76 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_axis | 축 | represented_by; related_to | confirm_representation_or_related_edge |
| 77 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_vertex | 꼭짓점 | represented_by; related_to | confirm_representation_or_related_edge |
| 78 | low | m1_quad_func_y_ax2_graph | y=ax^2 그래프 | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 79 | low | m1_eq_modeling_linear_equation | 일차방정식 세우기 | m1_eq_solution_check | 해의 확인 | used_in; related_to | confirm_used_in_or_related_edge |
| 80 | low | m1_eq_modeling_linear_equation | 일차방정식 세우기 | m1_eq_solving_linear_equation | 일차방정식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 81 | low | m1_eq_unit | 일차방정식 | m1_calc_unit | 식의 계산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 82 | low | m1_eq_unknown | 미지수 | m1_eq_solution | 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 83 | low | m1_ineq_modeling_linear_inequality | 일차부등식 세우기 | m1_ineq_solution_check | 부등식 해의 확인 | used_in; related_to | confirm_used_in_or_related_edge |
| 84 | low | m1_ineq_modeling_linear_inequality | 일차부등식 세우기 | m1_ineq_solving_linear_inequality | 일차부등식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 85 | low | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | m1_func_slope | 기울기 | used_in; related_to | confirm_used_in_or_related_edge |
| 86 | low | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | m1_func_y_intercept | y절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 87 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_slope | 기울기 | used_in; related_to | confirm_used_in_or_related_edge |
| 88 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_x_intercept | x절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 89 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_y_intercept | y절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 90 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_linear_graph | 일차함수의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 91 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 92 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 93 | low | m1_func_parallel_translation | 평행이동 | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 94 | low | m1_func_problem_solving | 일차함수 활용 문제 해결 | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 95 | low | m1_func_two_quantity_relation | 두 양 사이의 관계 | m1_func_function_judgement | 함수인지 판단하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 96 | low | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | m1_func_slope | 기울기 | represented_by; related_to | confirm_representation_or_related_edge |
| 97 | low | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | m1_func_y_intercept | y절편 | represented_by; related_to | confirm_representation_or_related_edge |
| 98 | low | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | m1_func_slope | 기울기 | represented_by; related_to | confirm_representation_or_related_edge |
| 99 | low | m1_func_intersection_count | 교점의 개수 | m1_func_system_graph_relation | 두 일차함수의 그래프와 연립일차방정식의 관계 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 100 | low | m1_graph_situation_graphing | 상황을 그래프로 나타내기 | m1_repr_conversion | 표·식·그래프 상호 변환 | used_in; related_to | confirm_used_in_or_related_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
