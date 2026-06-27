# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 61
- high priority: 0
- medium priority: 0

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | low | m1_geo_angle | 각 | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_to | confirm_related_to_edge |
| 2 | low | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | m1_geo_parallel_segment_ratio | 평행선 사이의 선분의 길이의 비 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 3 | low | m1_geo_vertical_angles | 맞꼭지각 | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_to | confirm_related_to_edge |
| 4 | low | m1_geo_centroid_from_parallel_ratio | 평행선과 선분의 비로 무게중심 찾기 | m1_geo_median | 중선 | used_in; related_to | confirm_used_in_or_related_edge |
| 5 | low | m1_geo_similar_figures | 닮은 도형 | m1_geo_correspondence | 도형의 대응 | related_to | confirm_related_to_edge |
| 6 | low | m1_geo_trig_unit | 삼각비 | m1_geo_triangle_quadrilateral_unit | 삼각형과 사각형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 7 | low | m1_geo_circle_justification | 원의 성질 정당화 | m1_geo_justification | 정당화 | used_in; related_to | confirm_used_in_or_related_edge |
| 8 | low | m1_geo_tangent_length | 접선의 길이 | m1_geo_tangent_line | 접선 | related_to | confirm_related_to_edge |
| 9 | low | m1_geo_tangent_relation | 접한다 | m1_geo_tangent_property | 원의 접선에 관한 성질 | related_to | confirm_related_to_edge |
| 10 | low | m1_geo_triangle_congruence_judgement | 삼각형의 합동 판별 | m1_geo_justification | 정당화 | used_in; related_to | confirm_used_in_or_related_edge |
| 11 | low | m1_geo_sector_arc_length_area | 부채꼴의 호의 길이와 넓이 구하기 | m1_geo_circle | 원 | used_in; related_to | confirm_used_in_or_related_edge |
| 12 | low | m1_geo_pythagorean_justification | 피타고라스 정리의 정당화 | m1_geo_proof | 증명 | used_in; related_to | confirm_used_in_or_related_edge |
| 13 | low | m1_factor_binomial_product_xab | (x+a)(x+b) 공식 | m1_quad_eq_factorization_solving | 인수분해를 이용한 이차방정식 풀이 | used_in; related_to | confirm_used_in_or_related_edge |
| 14 | low | m1_factor_factor | 인수 | m1_expr_term | 항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 15 | low | m1_expr_letter | 문자 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 16 | low | m1_expr_monomial | 단항식 | m1_expr_term | 항 | related_to | confirm_related_to_edge |
| 17 | low | m1_expr_unit | 문자의 사용과 식 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 18 | low | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | m1_expr_add_sub_linear_expression | 일차식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 19 | low | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 20 | low | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | m1_func_equation_relation | 일차함수와 미지수가 2개인 일차방정식의 관계 | related_to | confirm_related_to_edge |
| 21 | low | m1_quad_eq_double_root | 중근 | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | related_to | confirm_related_to_edge |
| 22 | low | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | m1_quad_eq_root_formula | 근의 공식 | related_to | confirm_related_to_edge |
| 23 | low | m1_quad_eq_unit | 이차방정식 | m1_factor_factorization | 인수분해 | used_in; related_to | confirm_used_in_or_related_edge |
| 24 | low | m1_quad_func_tech_tool_graph | 공학 도구로 이차함수 그래프 탐구하기 | m1_func_tech_tool_graph | 공학 도구로 함수 그래프 탐구하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 25 | low | m1_eq_unknown | 미지수 | m1_term_variable | 변수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 26 | low | m1_ineq_solution | 부등식의 해 | m1_eq_solution | 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 27 | low | m1_ineq_unit | 일차부등식 | m1_system_unit | 연립일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 28 | low | m1_func_unit | 일차함수와 그 그래프 | m1_system_unit | 연립일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 29 | low | m1_func_value | 함숫값 | m1_expr_value | 식의 값 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 30 | low | m1_func_eq_relation_unit | 일차함수와 일차방정식의 관계 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 31 | low | m1_func_equation_relation | 일차함수와 미지수가 2개인 일차방정식의 관계 | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | related_to | confirm_related_to_edge |
| 32 | low | m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | m1_system_solution | 연립일차방정식의 해 | used_in; related_to | confirm_used_in_or_related_edge |
| 33 | low | m1_repr_everyday_language | 일상 언어 | m1_expr_letter | 문자 | represented_by; related_to | confirm_representation_or_related_edge |
| 34 | low | m1_repr_expression | 식 | m1_expr_value | 식의 값 | represented_by; related_to | confirm_representation_or_related_edge |
| 35 | low | m1_term_variable | 변수 | m1_prop_direct_proportion | 정비례 | related_to | confirm_related_to_edge |
| 36 | low | m1_term_variable | 변수 | m1_prop_inverse_proportion | 반비례 | related_to | confirm_related_to_edge |
| 37 | low | m1_num_positive_integer | 양의 정수 | m1_num_natural_number | 자연수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 38 | low | m1_data_representative_unit | 대푯값 | m1_data_variability_unit | 산포도 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 39 | low | m1_data_frequency_unit | 도수분포표와 상대도수 | m1_data_variability_unit | 산포도 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 40 | low | m1_data_variability | 산포도 | m1_data_deviation | 편차 | related_to | confirm_related_to_edge |
| 41 | low | m1_data_variability | 산포도 | m1_data_standard_deviation | 표준편차 | related_to | confirm_related_to_edge |
| 42 | low | m1_data_variability | 산포도 | m1_data_variance | 분산 | related_to | confirm_related_to_edge |
| 43 | low | m1_data_dataset | 자료 | m1_data_data_collection | 자료 수집 | used_in; related_to | confirm_used_in_or_related_edge |
| 44 | low | m1_geo_distance_between_two_points | 두 점 사이의 거리 | m1_num_absolute_value | 절댓값 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 45 | low | m1_geo_intersection_point | 교점 | m1_func_intersection_point | 교점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 46 | low | m1_geo_domain | 도형과 측정 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 47 | low | m1_geo_domain | 도형과 측정 | m1_num_domain | 수와 연산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 48 | low | m1_num_prime_factor | 소인수 | m1_factor_factor | 인수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 49 | low | m1_num_domain | 수와 연산 | m1_calc_unit | 식의 계산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 50 | low | m1_num_domain | 수와 연산 | m1_expr_unit | 문자의 사용과 식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 51 | low | m1_num_distributive_law | 분배법칙 | m1_factor_polynomial_multiplication | 다항식의 곱셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 52 | low | m1_num_mixed_calculation | 정수와 유리수의 혼합계산 | m1_calc_simplify_expression | 식을 간단히 하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 53 | low | m1_num_number_line | 수직선 | m1_coord_number_line | 수직선 | represented_by; related_to | confirm_representation_or_related_edge |
| 54 | low | m1_data_domain | 자료와 가능성 | m1_graph_graph | 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 55 | low | m1_data_domain | 자료와 가능성 | m1_num_domain | 수와 연산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 56 | low | m1_data_domain | 자료와 가능성 | m1_repr_table | 표 | represented_by; related_to | confirm_representation_or_related_edge |
| 57 | low | m1_geo_triangle_midpoint_theorem | 삼각형의 중점연결정리 | m1_geo_centroid | 무게중심 | related_to | confirm_related_to_edge |
| 58 | low | m1_expr_usefulness | 문자를 사용한 식의 유용성 | m1_term_variable | 변수 | related_to | confirm_related_to_edge |
| 59 | low | m1_ineq_inequality | 부등식 | m1_eq_equality | 등식 | related_to | confirm_related_to_edge |
| 60 | backlog | m1_geo_point | 점 | m1_coord_point_location | 점의 위치 | related_to | confirm_related_to_edge |
| 61 | backlog | m1_num_prime_factor_unit | 소인수분해 | m1_calc_power | 거듭제곱 | related_to | confirm_related_to_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
