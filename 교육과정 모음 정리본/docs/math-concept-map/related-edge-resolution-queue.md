# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 132
- high priority: 0
- medium priority: 0

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | low | m1_factor_quadratic_expression | 이차식 | m1_quad_eq_quadratic_term | 이차항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 2 | low | m1_expr_coefficient | 계수 | m1_expr_degree | 차수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 3 | low | m1_expr_literal_expression | 문자를 사용한 식 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 4 | low | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 5 | low | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 6 | low | m1_calc_simplify_expression | 식을 간단히 하기 | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 7 | low | m1_calc_simplify_expression | 식을 간단히 하기 | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 8 | low | m1_calc_unit | 식의 계산 | m1_eq_unit | 일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 9 | low | m1_system_modeling | 연립일차방정식 세우기 | m1_system_solution | 연립일차방정식의 해 | used_in; related_to | confirm_used_in_or_related_edge |
| 10 | low | m1_system_modeling | 연립일차방정식 세우기 | m1_system_solving | 연립일차방정식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 11 | low | m1_quad_eq_double_root | 중근 | m1_quad_eq_root_formula | 근의 공식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 12 | low | m1_quad_eq_modeling | 이차방정식 활용 문제 해결 | m1_quad_eq_standard_form | 이차방정식의 식 표현 | represented_by; related_to | confirm_representation_or_related_edge |
| 13 | low | m1_quad_eq_quadratic_term | 이차항 | m1_factor_quadratic_expression | 이차식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 14 | low | m1_quad_eq_root_formula | 근의 공식 | m1_quad_eq_solution | 이차방정식의 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 15 | low | m1_quad_eq_solving | 이차방정식 풀기 | m1_quad_eq_factorization_solving | 인수분해를 이용한 이차방정식 풀이 | used_in; related_to | confirm_used_in_or_related_edge |
| 16 | low | m1_quad_eq_standard_form | 이차방정식의 식 표현 | m1_quad_eq_solving | 이차방정식 풀기 | represented_by; related_to | confirm_representation_or_related_edge |
| 17 | low | m1_quad_func_graph_drawing | 이차함수 그래프 그리기 | m1_quad_func_graph_properties | 이차함수 그래프의 성질 | used_in; related_to | confirm_used_in_or_related_edge |
| 18 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_axis | 축 | represented_by; related_to | confirm_representation_or_related_edge |
| 19 | low | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | m1_quad_func_vertex | 꼭짓점 | represented_by; related_to | confirm_representation_or_related_edge |
| 20 | low | m1_quad_func_y_ax2_graph | y=ax^2 그래프 | m1_quad_func_vertex_form | y=a(x-p)^2+q 꼴 | represented_by; related_to | confirm_representation_or_related_edge |
| 21 | low | m1_eq_modeling_linear_equation | 일차방정식 세우기 | m1_eq_solution_check | 해의 확인 | used_in; related_to | confirm_used_in_or_related_edge |
| 22 | low | m1_eq_modeling_linear_equation | 일차방정식 세우기 | m1_eq_solving_linear_equation | 일차방정식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 23 | low | m1_eq_unit | 일차방정식 | m1_calc_unit | 식의 계산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 24 | low | m1_eq_unknown | 미지수 | m1_eq_solution | 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 25 | low | m1_ineq_modeling_linear_inequality | 일차부등식 세우기 | m1_ineq_solution_check | 부등식 해의 확인 | used_in; related_to | confirm_used_in_or_related_edge |
| 26 | low | m1_ineq_modeling_linear_inequality | 일차부등식 세우기 | m1_ineq_solving_linear_inequality | 일차부등식 풀기 | used_in; related_to | confirm_used_in_or_related_edge |
| 27 | low | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | m1_func_slope | 기울기 | used_in; related_to | confirm_used_in_or_related_edge |
| 28 | low | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | m1_func_y_intercept | y절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 29 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_slope | 기울기 | used_in; related_to | confirm_used_in_or_related_edge |
| 30 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_x_intercept | x절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 31 | low | m1_func_graph_drawing | 일차함수 그래프 그리기 | m1_func_y_intercept | y절편 | used_in; related_to | confirm_used_in_or_related_edge |
| 32 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_linear_graph | 일차함수의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 33 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 34 | low | m1_func_linear_formula | 일차함수의 식 | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 35 | low | m1_func_parallel_translation | 평행이동 | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 36 | low | m1_func_problem_solving | 일차함수 활용 문제 해결 | m1_func_find_graph_equation | 일차함수 그래프의 식 구하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 37 | low | m1_func_two_quantity_relation | 두 양 사이의 관계 | m1_func_function_judgement | 함수인지 판단하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 38 | low | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | m1_func_slope | 기울기 | represented_by; related_to | confirm_representation_or_related_edge |
| 39 | low | m1_func_y_ax_b_graph | 일차함수 y=ax+b의 그래프 | m1_func_y_intercept | y절편 | represented_by; related_to | confirm_representation_or_related_edge |
| 40 | low | m1_func_y_ax_graph | 일차함수 y=ax의 그래프 | m1_func_slope | 기울기 | represented_by; related_to | confirm_representation_or_related_edge |
| 41 | low | m1_func_intersection_count | 교점의 개수 | m1_func_system_graph_relation | 두 일차함수의 그래프와 연립일차방정식의 관계 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 42 | low | m1_graph_situation_graphing | 상황을 그래프로 나타내기 | m1_repr_conversion | 표·식·그래프 상호 변환 | used_in; related_to | confirm_used_in_or_related_edge |
| 43 | low | m1_repr_everyday_language | 일상 언어 | m1_graph_graph | 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 44 | low | m1_repr_everyday_language | 일상 언어 | m1_repr_conversion | 표·식·그래프 상호 변환 | represented_by; related_to | confirm_representation_or_related_edge |
| 45 | low | m1_repr_everyday_language | 일상 언어 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 46 | low | m1_repr_everyday_language | 일상 언어 | m1_repr_table | 표 | represented_by; related_to | confirm_representation_or_related_edge |
| 47 | low | m1_repr_expression | 식 | m1_expr_literal_expression | 문자를 사용한 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 48 | low | m1_repr_expression | 식 | m1_graph_graph | 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 49 | low | m1_repr_table | 표 | m1_graph_graph | 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 50 | low | m1_num_composite_number | 합성수 | m1_num_prime_factorization | 소인수분해 | used_in; related_to | confirm_used_in_or_related_edge |
| 51 | low | m1_num_coprime | 서로소 | m1_num_prime_factorization | 소인수분해 | used_in; related_to | confirm_used_in_or_related_edge |
| 52 | low | m1_num_fraction_decimal_classification | 분수가 유한소수 또는 순환소수로 나타나는지 구분하기 | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | used_in; related_to | confirm_used_in_or_related_edge |
| 53 | low | m1_num_division | 나눗셈 | m1_num_reciprocal | 역수 | used_in; related_to | confirm_used_in_or_related_edge |
| 54 | low | m1_num_integer_rational_unit | 정수와 유리수 | m1_num_square_root_real_unit | 제곱근과 실수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 55 | low | m1_num_negative_need | 음수의 필요성 | m1_num_number_line | 수직선 | represented_by; related_to | confirm_representation_or_related_edge |
| 56 | low | m1_num_negative_rational | 음의 유리수 | m1_num_negative_number | 음수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 57 | low | m1_num_positive_rational | 양의 유리수 | m1_num_positive_number | 양수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 58 | low | m1_num_square_root_calculator | 계산기로 제곱근 값 구하기 | m1_num_compare_square_roots | 제곱근의 대소 관계 | used_in; related_to | confirm_used_in_or_related_edge |
| 59 | low | m1_num_square_root_real_unit | 제곱근과 실수 | m1_num_integer_rational_unit | 정수와 유리수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 60 | low | m1_data_representative_value | 대푯값 | m1_data_choose_representative_value | 자료의 특성에 맞는 대푯값 선택 | used_in; related_to | confirm_used_in_or_related_edge |
| 61 | low | m1_data_class_mark | 계급값 | m1_data_frequency_table | 도수분포표 | represented_by; related_to | confirm_representation_or_related_edge |
| 62 | low | m1_data_class_width | 계급의 크기 | m1_data_frequency_table | 도수분포표 | represented_by; related_to | confirm_representation_or_related_edge |
| 63 | low | m1_data_class_width | 계급의 크기 | m1_data_histogram | 히스토그램 | represented_by; related_to | confirm_representation_or_related_edge |
| 64 | low | m1_data_frequency_table | 도수분포표 | m1_data_frequency_polygon | 도수분포다각형 | represented_by; related_to | confirm_representation_or_related_edge |
| 65 | low | m1_data_frequency_table | 도수분포표 | m1_data_relative_frequency | 상대도수 | represented_by; related_to | confirm_representation_or_related_edge |
| 66 | low | m1_data_relative_frequency_table_graph | 상대도수의 분포를 표나 그래프로 나타내기 | m1_data_distribution_interpretation | 자료의 분포 특징 해석 | used_in; related_to | confirm_used_in_or_related_edge |
| 67 | low | m1_data_statistical_evidence_discussion | 통계적 근거로 토론하기 | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | used_in; related_to | confirm_used_in_or_related_edge |
| 68 | low | m1_data_technology_tool_stats | 공학 도구로 자료 수집·분석하기 | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | used_in; related_to | confirm_used_in_or_related_edge |
| 69 | low | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | used_in; related_to | confirm_used_in_or_related_edge |
| 70 | low | m1_data_deviation | 편차 | m1_data_standard_deviation | 표준편차 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 71 | low | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | used_in; related_to | confirm_used_in_or_related_edge |
| 72 | low | m1_geo_angle | 각 | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_to | confirm_related_to_edge |
| 73 | low | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | m1_geo_parallel_segment_ratio | 평행선 사이의 선분의 길이의 비 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 74 | low | m1_geo_vertical_angles | 맞꼭지각 | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_to | confirm_related_to_edge |
| 75 | low | m1_geo_centroid_from_parallel_ratio | 평행선과 선분의 비로 무게중심 찾기 | m1_geo_median | 중선 | used_in; related_to | confirm_used_in_or_related_edge |
| 76 | low | m1_geo_similar_figures | 닮은 도형 | m1_geo_correspondence | 도형의 대응 | related_to | confirm_related_to_edge |
| 77 | low | m1_geo_trig_unit | 삼각비 | m1_geo_triangle_quadrilateral_unit | 삼각형과 사각형의 성질 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 78 | low | m1_geo_circle_justification | 원의 성질 정당화 | m1_geo_justification | 정당화 | used_in; related_to | confirm_used_in_or_related_edge |
| 79 | low | m1_geo_tangent_length | 접선의 길이 | m1_geo_tangent_line | 접선 | related_to | confirm_related_to_edge |
| 80 | low | m1_geo_tangent_relation | 접한다 | m1_geo_tangent_property | 원의 접선에 관한 성질 | related_to | confirm_related_to_edge |
| 81 | low | m1_geo_triangle_congruence_judgement | 삼각형의 합동 판별 | m1_geo_justification | 정당화 | used_in; related_to | confirm_used_in_or_related_edge |
| 82 | low | m1_geo_sector_arc_length_area | 부채꼴의 호의 길이와 넓이 구하기 | m1_geo_circle | 원 | used_in; related_to | confirm_used_in_or_related_edge |
| 83 | low | m1_geo_pythagorean_justification | 피타고라스 정리의 정당화 | m1_geo_proof | 증명 | used_in; related_to | confirm_used_in_or_related_edge |
| 84 | low | m1_factor_binomial_product_xab | (x+a)(x+b) 공식 | m1_quad_eq_factorization_solving | 인수분해를 이용한 이차방정식 풀이 | used_in; related_to | confirm_used_in_or_related_edge |
| 85 | low | m1_factor_factor | 인수 | m1_expr_term | 항 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 86 | low | m1_expr_letter | 문자 | m1_repr_expression | 식 | represented_by; related_to | confirm_representation_or_related_edge |
| 87 | low | m1_expr_monomial | 단항식 | m1_expr_term | 항 | related_to | confirm_related_to_edge |
| 88 | low | m1_expr_unit | 문자의 사용과 식 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 89 | low | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | m1_expr_add_sub_linear_expression | 일차식의 덧셈과 뺄셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 90 | low | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 91 | low | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | m1_func_equation_relation | 일차함수와 미지수가 2개인 일차방정식의 관계 | related_to | confirm_related_to_edge |
| 92 | low | m1_quad_eq_double_root | 중근 | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | related_to | confirm_related_to_edge |
| 93 | low | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | m1_quad_eq_root_formula | 근의 공식 | related_to | confirm_related_to_edge |
| 94 | low | m1_quad_eq_unit | 이차방정식 | m1_factor_factorization | 인수분해 | used_in; related_to | confirm_used_in_or_related_edge |
| 95 | low | m1_quad_func_tech_tool_graph | 공학 도구로 이차함수 그래프 탐구하기 | m1_func_tech_tool_graph | 공학 도구로 함수 그래프 탐구하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 96 | low | m1_eq_unknown | 미지수 | m1_term_variable | 변수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 97 | low | m1_ineq_solution | 부등식의 해 | m1_eq_solution | 해 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 98 | low | m1_ineq_unit | 일차부등식 | m1_system_unit | 연립일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 99 | low | m1_func_unit | 일차함수와 그 그래프 | m1_system_unit | 연립일차방정식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 100 | low | m1_func_value | 함숫값 | m1_expr_value | 식의 값 | contrasts_with; related_to | confirm_contrast_or_related_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
