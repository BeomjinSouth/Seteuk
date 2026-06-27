# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 379
- high priority: 0
- medium priority: 1

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | medium | m1_coord_point_location | 점의 위치 | m1_coord_axis_point | 축 위의 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 2 | low | m1_geo_intersection_line | 교선 | m1_geo_intersection_point | 교점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 3 | low | m1_geo_intersection_point | 교점 | m1_geo_intersection_line | 교선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 4 | low | m1_geo_line | 직선 | m1_geo_plane | 평면 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 5 | low | m1_geo_line | 직선 | m1_geo_point | 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 6 | low | m1_geo_plane | 평면 | m1_geo_line | 직선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 7 | low | m1_geo_plane | 평면 | m1_geo_point | 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 8 | low | m1_geo_point | 점 | m1_geo_line | 직선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 9 | low | m1_geo_point | 점 | m1_geo_plane | 평면 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 10 | low | m1_geo_cosine | 코사인 | m1_geo_tangent_ratio | 탄젠트 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 11 | low | m1_geo_sine | 사인 | m1_geo_tangent_ratio | 탄젠트 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 12 | low | m1_geo_tangent_ratio | 탄젠트 | m1_geo_cosine | 코사인 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 13 | low | m1_geo_tangent_ratio | 탄젠트 | m1_geo_sine | 사인 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 14 | low | m1_geo_circumcircle | 외접원 | m1_geo_incircle | 내접원 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 15 | low | m1_geo_incircle | 내접원 | m1_geo_circumcircle | 외접원 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 16 | low | m1_geo_frustum_cone | 원뿔대 | m1_geo_frustum_pyramid | 각뿔대 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 17 | low | m1_geo_frustum_pyramid | 각뿔대 | m1_geo_frustum_cone | 원뿔대 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 18 | low | m1_geo_model_tool_solid | 모형과 공학 도구로 입체도형 탐구 | m1_geo_solid_cross_section | 입체도형의 단면 | represented_by; related_to | confirm_representation_or_related_edge |
| 19 | low | m1_geo_solid_cross_section | 입체도형의 단면 | m1_geo_model_tool_solid | 모형과 공학 도구로 입체도형 탐구 | represented_by; related_to | confirm_representation_or_related_edge |
| 20 | low | m1_geo_opposite_angle | 대각 | m1_geo_opposite_side | 대변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 21 | low | m1_geo_opposite_side | 대변 | m1_geo_opposite_angle | 대각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 22 | low | m1_geo_arc | 호 | m1_geo_central_angle | 중심각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 23 | low | m1_geo_central_angle | 중심각 | m1_geo_arc | 호 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 24 | low | m1_geo_convex_polygon_scope | 볼록다각형 범위 | m1_geo_diagonal_count | 다각형의 대각선 개수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 25 | low | m1_geo_convex_polygon_scope | 볼록다각형 범위 | m1_geo_polygon_angle_sum | 다각형의 내각과 외각의 크기 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 26 | low | m1_geo_diagonal_count | 다각형의 대각선 개수 | m1_geo_convex_polygon_scope | 볼록다각형 범위 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 27 | low | m1_geo_exterior_angle | 외각 | m1_geo_interior_angle | 내각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 28 | low | m1_geo_interior_angle | 내각 | m1_geo_exterior_angle | 외각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 29 | low | m1_geo_polygon_angle_sum | 다각형의 내각과 외각의 크기 | m1_geo_convex_polygon_scope | 볼록다각형 범위 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 30 | low | m1_factor_square_difference_formula | (a-b)^2 공식 | m1_factor_square_sum_formula | (a+b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 31 | low | m1_factor_square_sum_formula | (a+b)^2 공식 | m1_factor_square_difference_formula | (a-b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 32 | low | m1_expr_coefficient | 계수 | m1_expr_constant_term | 상수항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 33 | low | m1_expr_constant_term | 상수항 | m1_expr_coefficient | 계수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 34 | low | m1_calc_base | 밑 | m1_calc_exponent | 지수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 35 | low | m1_calc_exponent | 지수 | m1_calc_base | 밑 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 36 | low | m1_quad_func_general_form | y=ax^2+bx+c 꼴 | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 37 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_general_form | y=ax^2+bx+c 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 38 | low | m1_eq_both_sides | 양변 | m1_eq_left_side | 좌변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 39 | low | m1_eq_both_sides | 양변 | m1_eq_right_side | 우변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 40 | low | m1_eq_left_side | 좌변 | m1_eq_both_sides | 양변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 41 | low | m1_eq_right_side | 우변 | m1_eq_both_sides | 양변 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 42 | low | m1_func_x_intercept | x절편 | m1_func_y_intercept | y절편 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 43 | low | m1_func_y_intercept | y절편 | m1_func_x_intercept | x절편 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 44 | low | m1_context_speed_distance | 속력과 거리 맥락 | m1_context_speed_time | 속력과 시간 맥락 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 45 | low | m1_context_speed_time | 속력과 시간 맥락 | m1_context_speed_distance | 속력과 거리 맥락 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 46 | low | m1_coord_x_axis | x축 | m1_coord_y_axis | y축 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 47 | low | m1_coord_y_axis | y축 | m1_coord_x_axis | x축 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 48 | low | m1_repr_expression | 식 | m1_repr_table | 표 | represented_by; related_to | confirm_representation_or_related_edge |
| 49 | low | m1_repr_table | 표 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 50 | low | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | m1_num_repeating_decimal_to_fraction | 순환소수를 분수로 나타내기 | used_in; related_to | confirm_used_in_or_related_edge |
| 51 | low | m1_num_repeating_decimal_to_fraction | 순환소수를 분수로 나타내기 | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | used_in; related_to | confirm_used_in_or_related_edge |
| 52 | low | m1_num_addition | 덧셈 | m1_num_subtraction | 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 53 | low | m1_num_associative_law | 결합법칙 | m1_num_commutative_law | 교환법칙 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 54 | low | m1_num_commutative_law | 교환법칙 | m1_num_associative_law | 결합법칙 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 55 | low | m1_num_division | 나눗셈 | m1_num_multiplication | 곱셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 56 | low | m1_num_minus_sign | 음의 부호 | m1_num_negative_number | 음수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 57 | low | m1_num_multiplication | 곱셈 | m1_num_division | 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 58 | low | m1_num_negative_number | 음수 | m1_num_minus_sign | 음의 부호 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 59 | low | m1_num_plus_sign | 양의 부호 | m1_num_positive_number | 양수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 60 | low | m1_num_positive_number | 양수 | m1_num_plus_sign | 양의 부호 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 61 | low | m1_num_subtraction | 뺄셈 | m1_num_addition | 덧셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 62 | low | m1_num_radical_expression | 근호를 포함한 식 | m1_num_rationalize_denominator | 분모의 유리화 | represented_by; related_to | confirm_representation_or_related_edge |
| 63 | low | m1_num_rationalize_denominator | 분모의 유리화 | m1_num_radical_expression | 근호를 포함한 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 64 | low | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 65 | low | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 66 | low | m1_data_mean | 평균 | m1_data_mode | 최빈값 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 67 | low | m1_data_mode | 최빈값 | m1_data_mean | 평균 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 68 | low | m1_data_no_correlation | 상관관계가 없는 경우 | m1_data_positive_correlation | 양의 상관관계 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 69 | low | m1_data_positive_correlation | 양의 상관관계 | m1_data_no_correlation | 상관관계가 없는 경우 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 70 | low | m1_coord_axis | 좌표축 | m1_coord_axis_point | 축 위의 점 | related_to | confirm_related_to_edge |
| 71 | low | m1_coord_x_axis | x축 | m1_coord_axis_point | 축 위의 점 | related_to | confirm_related_to_edge |
| 72 | low | m1_coord_y_axis | y축 | m1_coord_axis_point | 축 위의 점 | related_to | confirm_related_to_edge |
| 73 | low | m1_geo_perpendicular | 직교 | m1_geo_perpendicular_bisector | 수직이등분선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 74 | low | m1_geo_straight_angle | 평각 | m1_geo_vertical_angles | 맞꼭지각 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 75 | low | m1_geo_correspondence | 도형의 대응 | m1_geo_similarity_ratio | 닮음비 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 76 | low | m1_geo_similarity_judgement | 삼각형의 닮음 판별 | m1_geo_parallel_segment_ratio | 평행선 사이의 선분의 길이의 비 | used_in; related_to | confirm_used_in_or_related_edge |
| 77 | low | m1_geo_quadrilateral_relationship | 여러 가지 사각형 사이의 관계 | m1_geo_proof | 증명 | used_in; related_to | confirm_used_in_or_related_edge |
| 78 | low | m1_geo_circle_unit | 원의 성질 | m1_geo_plane_properties_unit | 평면도형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 79 | low | m1_geo_tangent_point | 접점 | m1_geo_tangent_relation | 접한다 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 80 | low | m1_geo_model_tool_solid | 모형과 공학 도구로 입체도형 탐구 | m1_geo_solid_net | 전개도 | represented_by; related_to | confirm_representation_or_related_edge |
| 81 | low | m1_geo_prism | 기둥 모양 입체도형 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 82 | low | m1_geo_prism | 기둥 모양 입체도형 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 83 | low | m1_geo_pyramid | 뿔 모양 입체도형 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 84 | low | m1_geo_pyramid | 뿔 모양 입체도형 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 85 | low | m1_geo_solid_cross_section | 입체도형의 단면 | m1_geo_solid_net | 전개도 | represented_by; related_to | confirm_representation_or_related_edge |
| 86 | low | m1_geo_solid_unit | 입체도형의 성질 | m1_geo_plane_properties_unit | 평면도형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 87 | low | m1_geo_sphere | 구 | m1_geo_surface_area | 겉넓이 | used_in; related_to | confirm_used_in_or_related_edge |
| 88 | low | m1_geo_sphere | 구 | m1_geo_volume | 부피 | used_in; related_to | confirm_used_in_or_related_edge |
| 89 | low | m1_geo_triangle_construction | 삼각형의 작도 | m1_geo_triangle_congruence_conditions | 삼각형의 합동 조건 | used_in; related_to | confirm_used_in_or_related_edge |
| 90 | low | m1_geo_plane_properties_unit | 평면도형의 성질 | m1_geo_circle_unit | 원의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 91 | low | m1_geo_plane_properties_unit | 평면도형의 성질 | m1_geo_solid_unit | 입체도형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 92 | low | m1_geo_secant | 할선 | m1_geo_chord | 현 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 93 | low | m1_geo_sector | 부채꼴 | m1_geo_sector_arc_length_area | 부채꼴의 호의 길이와 넓이 구하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 94 | low | m1_geo_right_triangle_judgement | 세 변의 길이로 직각삼각형 판별 | m1_geo_right_triangle | 직각삼각형 | used_in; related_to | confirm_used_in_or_related_edge |
| 95 | low | m1_factor_formula_scope | 다항식의 곱셈과 인수분해 공식 범위 | m1_factor_binomial_product_xab | (x+a)(x+b) 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 96 | low | m1_factor_formula_scope | 다항식의 곱셈과 인수분해 공식 범위 | m1_factor_linear_product_axb_cxd | (ax+b)(cx+d) 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 97 | low | m1_factor_formula_scope | 다항식의 곱셈과 인수분해 공식 범위 | m1_factor_square_difference_formula | (a-b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 98 | low | m1_factor_formula_scope | 다항식의 곱셈과 인수분해 공식 범위 | m1_factor_square_sum_formula | (a+b)^2 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 99 | low | m1_factor_formula_scope | 다항식의 곱셈과 인수분해 공식 범위 | m1_factor_sum_difference_product_formula | (a+b)(a-b) 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 100 | low | m1_factor_quadratic_expression | 이차식 | m1_quad_eq_quadratic_term | 이차항 | contrasts_with; related_to | confirm_contrast_or_related_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
