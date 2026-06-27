# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 469
- high priority: 90
- medium priority: 1

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | high | m1_factor_linear_product_axb_cxd | (ax+b)(cx+d) 공식 | m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 2 | high | m1_factor_square_difference_formula | (a-b)^2 공식 | m1_mis_perfect_square_sign | 완전제곱식의 가운데 항 부호를 혼동하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 3 | high | m1_factor_sum_difference_product_formula | (a+b)(a-b) 공식 | m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 4 | high | m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | m1_factor_linear_product_axb_cxd | (ax+b)(cx+d) 공식 | often_confused_with | confirm_often_confused_with_evidence |
| 5 | high | m1_mis_factor_formula_pattern | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | m1_factor_sum_difference_product_formula | (a+b)(a-b) 공식 | often_confused_with | confirm_often_confused_with_evidence |
| 6 | high | m1_mis_perfect_square_sign | 완전제곱식의 가운데 항 부호를 혼동하는 오류 | m1_factor_square_difference_formula | (a-b)^2 공식 | often_confused_with | confirm_often_confused_with_evidence |
| 7 | high | m1_calc_base | 밑 | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 8 | high | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | m1_calc_base | 밑 | often_confused_with | confirm_often_confused_with_evidence |
| 9 | high | m1_mis_system_elimination_sign | 가감법에서 부호와 계수 처리를 잘못하는 오류 | m1_system_elimination | 소거 | often_confused_with | confirm_often_confused_with_evidence |
| 10 | high | m1_system_elimination | 소거 | m1_mis_system_elimination_sign | 가감법에서 부호와 계수 처리를 잘못하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 11 | high | m1_mis_root_coefficient_relation_scope | 근과 계수와의 관계를 중학교 범위로 오인하는 오류 | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | often_confused_with | confirm_often_confused_with_evidence |
| 12 | high | m1_quad_eq_real_solution_scope | 이차방정식의 실수 해 범위 | m1_mis_root_coefficient_relation_scope | 근과 계수와의 관계를 중학교 범위로 오인하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 13 | high | m1_eq_equality | 등식 | m1_mis_expression_equation | 식과 방정식 혼동 | often_confused_with | confirm_often_confused_with_evidence |
| 14 | high | m1_eq_solving_linear_equation | 일차방정식 풀기 | m1_mis_transposition_sign | 이항할 때 부호를 잘못 바꾸는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 15 | high | m1_mis_expression_equation | 식과 방정식 혼동 | m1_eq_equality | 등식 | often_confused_with | confirm_often_confused_with_evidence |
| 16 | high | m1_mis_transposition_sign | 이항할 때 부호를 잘못 바꾸는 오류 | m1_eq_solving_linear_equation | 일차방정식 풀기 | often_confused_with | confirm_often_confused_with_evidence |
| 17 | high | m1_func_function | 함수 | m1_mis_all_relations_are_functions | 모든 두 양의 관계를 함수로 보는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 18 | high | m1_mis_all_relations_are_functions | 모든 두 양의 관계를 함수로 보는 오류 | m1_func_function | 함수 | often_confused_with | confirm_often_confused_with_evidence |
| 19 | high | m1_mis_negative_order | 음수의 대소를 절댓값 크기로 판단하는 오류 | m1_num_negative_number | 음수 | often_confused_with | confirm_often_confused_with_evidence |
| 20 | high | m1_mis_sign_operation | 부호와 연산 기호를 혼동하는 오류 | m1_num_integer_rational_add_sub | 정수와 유리수의 덧셈과 뺄셈 | often_confused_with | confirm_often_confused_with_evidence |
| 21 | high | m1_mis_sign_operation | 부호와 연산 기호를 혼동하는 오류 | m1_num_integer_rational_mul_div | 정수와 유리수의 곱셈과 나눗셈 | often_confused_with | confirm_often_confused_with_evidence |
| 22 | high | m1_num_integer_rational_add_sub | 정수와 유리수의 덧셈과 뺄셈 | m1_mis_sign_operation | 부호와 연산 기호를 혼동하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 23 | high | m1_num_integer_rational_mul_div | 정수와 유리수의 곱셈과 나눗셈 | m1_mis_sign_operation | 부호와 연산 기호를 혼동하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 24 | high | m1_num_negative_number | 음수 | m1_mis_negative_order | 음수의 대소를 절댓값 크기로 판단하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 25 | high | m1_mis_corresponding_alternate_angles | 동위각과 엇각의 위치를 혼동하는 오류 | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | often_confused_with | confirm_often_confused_with_evidence |
| 26 | high | m1_mis_skew_parallel_lines | 꼬인 위치와 평행을 같은 관계로 보는 오류 | m1_geo_position_relation | 점, 직선, 평면의 위치 관계 | often_confused_with | confirm_often_confused_with_evidence |
| 27 | high | m1_mis_congruence_similarity | 합동과 닮음을 같은 관계로 보는 오류 | m1_geo_similarity_ratio | 닮음비 | often_confused_with | confirm_often_confused_with_evidence |
| 28 | high | m1_mis_trig_angle_scope | 삼각비 각의 범위를 0도~90도 밖으로 확장하는 오류 | m1_geo_special_angles_30_45_60 | 30도, 45도, 60도의 삼각비 | often_confused_with | confirm_often_confused_with_evidence |
| 29 | high | m1_mis_circumcenter_incenter | 외심과 내심을 혼동하는 오류 | m1_geo_circumcircle | 외접원 | often_confused_with | confirm_often_confused_with_evidence |
| 30 | high | m1_mis_circumcenter_incenter | 외심과 내심을 혼동하는 오류 | m1_geo_incircle | 내접원 | often_confused_with | confirm_often_confused_with_evidence |
| 31 | high | m1_mis_proof_observation | 관찰 결과와 증명을 같은 수준의 근거로 보는 오류 | m1_geo_isosceles_properties | 이등변삼각형의 성질 | often_confused_with | confirm_often_confused_with_evidence |
| 32 | high | m1_mis_tangent_radius | 접선과 반지름의 수직 관계를 놓치는 오류 | m1_geo_tangent_line | 접선 | often_confused_with | confirm_often_confused_with_evidence |
| 33 | high | m1_mis_tangent_radius | 접선과 반지름의 수직 관계를 놓치는 오류 | m1_geo_tangent_point | 접점 | often_confused_with | confirm_often_confused_with_evidence |
| 34 | high | m1_mis_surface_area_volume | 겉넓이와 부피를 같은 측정량으로 보는 오류 | m1_geo_solid_net | 전개도 | often_confused_with | confirm_often_confused_with_evidence |
| 35 | high | m1_mis_arc_chord | 호와 현을 같은 대상으로 보는 오류 | m1_geo_circular_segment | 활꼴 | often_confused_with | confirm_often_confused_with_evidence |
| 36 | high | m1_mis_arc_chord | 호와 현을 같은 대상으로 보는 오류 | m1_geo_sector | 부채꼴 | often_confused_with | confirm_often_confused_with_evidence |
| 37 | high | m1_mis_expansion_factorization_direction | 전개와 인수분해 방향을 혼동하는 오류 | m1_factor_factorization | 인수분해 | often_confused_with | confirm_often_confused_with_evidence |
| 38 | high | m1_mis_factor_common_factor_missing | 공통인수를 빠뜨리는 오류 | m1_factor_factorization | 인수분해 | often_confused_with | confirm_often_confused_with_evidence |
| 39 | high | m1_mis_perfect_square_sign | 완전제곱식의 가운데 항 부호를 혼동하는 오류 | m1_factor_square_sum_formula | (a+b)^2 공식 | often_confused_with | confirm_often_confused_with_evidence |
| 40 | high | m1_calc_exponent | 지수 | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 41 | high | m1_mis_quadratic_factorization_solution | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | m1_quad_eq_solution | 이차방정식의 해 | often_confused_with | confirm_often_confused_with_evidence |
| 42 | high | m1_mis_max_min_scope | 최댓값·최솟값의 범위를 임의로 확장하는 오류 | m1_quad_func_maximum | 최댓값 | often_confused_with | confirm_often_confused_with_evidence |
| 43 | high | m1_mis_max_min_scope | 최댓값·최솟값의 범위를 임의로 확장하는 오류 | m1_quad_func_minimum | 최솟값 | often_confused_with | confirm_often_confused_with_evidence |
| 44 | high | m1_mis_solution_check | 구한 해의 상황 적합성 확인 누락 | m1_eq_modeling_linear_equation | 일차방정식 세우기 | often_confused_with | confirm_often_confused_with_evidence |
| 45 | high | m1_ineq_inequality | 부등식 | m1_mis_ineq_solution_single_value | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 46 | high | m1_ineq_solution_check | 부등식 해의 확인 | m1_mis_ineq_solution_single_value | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 47 | high | m1_mis_all_relations_are_functions | 모든 두 양의 관계를 함수로 보는 오류 | m1_func_correspondence | 대응 관계 | often_confused_with | confirm_often_confused_with_evidence |
| 48 | high | m1_func_intersection_count | 교점의 개수 | m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 49 | high | m1_func_system_solution_from_intersection | 교점으로 연립일차방정식의 해 말하기 | m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 50 | high | m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | m1_func_intersection_point | 교점 | often_confused_with | confirm_often_confused_with_evidence |
| 51 | high | m1_graph_graph | 그래프 | m1_mis_graph_picture | 그래프를 상황 그림으로만 보는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 52 | high | m1_mis_direct_inverse_generalization | 증가·감소만으로 정비례·반비례 판단 | m1_prop_direct_proportion | 정비례 | often_confused_with | confirm_often_confused_with_evidence |
| 53 | high | m1_mis_direct_inverse_generalization | 증가·감소만으로 정비례·반비례 판단 | m1_prop_inverse_proportion | 반비례 | often_confused_with | confirm_often_confused_with_evidence |
| 54 | high | m1_mis_representation_conversion | 표·식·그래프 변환 오류 | m1_graph_graph | 그래프 | often_confused_with | confirm_often_confused_with_evidence |
| 55 | high | m1_mis_representation_conversion | 표·식·그래프 변환 오류 | m1_repr_expression | 식 | often_confused_with | confirm_often_confused_with_evidence |
| 56 | high | m1_mis_representation_conversion | 표·식·그래프 변환 오류 | m1_repr_table | 표 | often_confused_with | confirm_often_confused_with_evidence |
| 57 | high | m1_mis_gcd_lcm_scope | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | m1_num_gcd | 최대공약수 | often_confused_with | confirm_often_confused_with_evidence |
| 58 | high | m1_mis_gcd_lcm_scope | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | m1_num_lcm | 최소공배수 | often_confused_with | confirm_often_confused_with_evidence |
| 59 | high | m1_mis_prime_one | 1을 소수나 합성수로 보는 오류 | m1_num_natural_number | 자연수 | often_confused_with | confirm_often_confused_with_evidence |
| 60 | high | m1_mis_finite_to_repeating_scope | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | m1_num_finite_decimal | 유한소수 | often_confused_with | confirm_often_confused_with_evidence |
| 61 | high | m1_mis_finite_to_repeating_scope | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | m1_num_repeating_decimal | 순환소수 | often_confused_with | confirm_often_confused_with_evidence |
| 62 | high | m1_mis_absolute_value_positive | 절댓값을 항상 양수로만 말하는 오류 | m1_num_number_line | 수직선 | often_confused_with | confirm_often_confused_with_evidence |
| 63 | high | m1_mis_radical_like_terms | 근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류 | m1_num_radical_expression | 근호를 포함한 식 | often_confused_with | confirm_often_confused_with_evidence |
| 64 | high | m1_mis_radical_principal_root | 근호가 나타내는 제곱근의 부호를 혼동하는 오류 | m1_num_square_root_property | 제곱근의 성질 | often_confused_with | confirm_often_confused_with_evidence |
| 65 | high | m1_data_equally_likely_assumption | 각 경우가 발생할 가능성이 동등하다는 가정 | m1_mis_probability_no_equal_likely | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 66 | high | m1_mis_or_and_counting_confusion | 또는과 동시에의 경우의 수를 혼동하는 오류 | m1_data_addition_counting | 두 경우의 수를 합하는 상황 | often_confused_with | confirm_often_confused_with_evidence |
| 67 | high | m1_mis_or_and_counting_confusion | 또는과 동시에의 경우의 수를 혼동하는 오류 | m1_data_multiplication_counting | 두 경우의 수를 곱하는 상황 | often_confused_with | confirm_often_confused_with_evidence |
| 68 | high | m1_mis_permutation_combination_scope | 복잡한 순열·조합 문제를 중학교 범위로 확정하는 오류 | m1_data_addition_counting | 두 경우의 수를 합하는 상황 | often_confused_with | confirm_often_confused_with_evidence |
| 69 | high | m1_mis_permutation_combination_scope | 복잡한 순열·조합 문제를 중학교 범위로 확정하는 오류 | m1_data_multiplication_counting | 두 경우의 수를 곱하는 상황 | often_confused_with | confirm_often_confused_with_evidence |
| 70 | high | m1_mis_probability_no_equal_likely | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 | m1_data_probability | 확률 | often_confused_with | confirm_often_confused_with_evidence |
| 71 | high | m1_mis_mean_only_representative | 대푯값을 평균으로만 보는 오류 | m1_data_median | 중앙값 | often_confused_with | confirm_often_confused_with_evidence |
| 72 | high | m1_mis_mean_only_representative | 대푯값을 평균으로만 보는 오류 | m1_data_mode | 최빈값 | often_confused_with | confirm_often_confused_with_evidence |
| 73 | high | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | m1_mis_graph_scale_distortion | 눈금 왜곡 그래프를 그대로 해석하는 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 74 | high | m1_mis_histogram_bar_graph | 히스토그램과 막대그래프를 같은 표현으로 보는 오류 | m1_data_class | 계급 | often_confused_with | confirm_often_confused_with_evidence |
| 75 | high | m1_mis_histogram_bar_graph | 히스토그램과 막대그래프를 같은 표현으로 보는 오류 | m1_data_frequency | 도수 | often_confused_with | confirm_often_confused_with_evidence |
| 76 | high | m1_mis_relative_frequency_frequency | 도수와 상대도수를 혼동하는 오류 | m1_data_relative_frequency_distribution | 상대도수의 분포 | often_confused_with | confirm_often_confused_with_evidence |
| 77 | high | m1_mis_variance_standard_deviation | 분산과 표준편차를 같은 값으로 보는 오류 | m1_data_calculate_variance_sd | 분산과 표준편차 구하기 | often_confused_with | confirm_often_confused_with_evidence |
| 78 | high | m1_mis_complex_area_volume_scope | 지나치게 복잡한 넓이·부피 변형 문제 범위 혼동 | m1_geo_plane_properties_unit | 평면도형의 성질 | often_confused_with | confirm_often_confused_with_evidence |
| 79 | high | m1_mis_expansion_factorization_direction | 전개와 인수분해 방향을 혼동하는 오류 | m1_calc_expansion | 전개 | often_confused_with | confirm_often_confused_with_evidence |
| 80 | high | m1_mis_letter_as_label_only | 문자를 이름표로만 해석하는 오류 | m1_term_variable | 변수 | often_confused_with | confirm_often_confused_with_evidence |
| 81 | high | m1_mis_polynomial_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | m1_expr_like_terms | 동류항 | often_confused_with | confirm_often_confused_with_evidence |
| 82 | high | m1_mis_system_one_equation_only | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | m1_eq_solution | 해 | often_confused_with | confirm_often_confused_with_evidence |
| 83 | high | m1_mis_system_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | m1_expr_substitution | 대입 | often_confused_with | confirm_often_confused_with_evidence |
| 84 | high | m1_mis_quadratic_factorization_solution | 인수분해한 식에서 해 조건을 빠뜨리는 오류 | m1_factor_factorization | 인수분해 | often_confused_with | confirm_often_confused_with_evidence |
| 85 | high | m1_mis_function_value_input_output | 함숫값과 입력값 혼동 | m1_expr_substitution | 대입 | often_confused_with | confirm_often_confused_with_evidence |
| 86 | high | m1_mis_slope_sign | 기울기 부호와 그래프 방향 혼동 | m1_graph_increase_decrease | 증가와 감소 | often_confused_with | confirm_often_confused_with_evidence |
| 87 | high | m1_mis_intersection_solution | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 | m1_system_solution | 연립일차방정식의 해 | often_confused_with | confirm_often_confused_with_evidence |
| 88 | high | m1_mis_irrational_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | m1_num_rational_repeating_relation | 유리수와 순환소수의 관계 | often_confused_with | confirm_often_confused_with_evidence |
| 89 | high | m1_mis_irrational_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | m1_num_repeating_decimal | 순환소수 | often_confused_with | confirm_often_confused_with_evidence |
| 90 | high | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | m1_mis_representation_conversion | 표·식·그래프 변환 오류 | often_confused_with | confirm_often_confused_with_evidence |
| 91 | medium | m1_coord_point_location | 점의 위치 | m1_coord_axis_point | 축 위의 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 92 | low | m1_geo_intersection_line | 교선 | m1_geo_intersection_point | 교점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 93 | low | m1_geo_intersection_point | 교점 | m1_geo_intersection_line | 교선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 94 | low | m1_geo_line | 직선 | m1_geo_plane | 평면 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 95 | low | m1_geo_line | 직선 | m1_geo_point | 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 96 | low | m1_geo_plane | 평면 | m1_geo_line | 직선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 97 | low | m1_geo_plane | 평면 | m1_geo_point | 점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 98 | low | m1_geo_point | 점 | m1_geo_line | 직선 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 99 | low | m1_geo_point | 점 | m1_geo_plane | 평면 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 100 | low | m1_geo_cosine | 코사인 | m1_geo_tangent_ratio | 탄젠트 | contrasts_with; related_to | confirm_contrast_or_related_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
