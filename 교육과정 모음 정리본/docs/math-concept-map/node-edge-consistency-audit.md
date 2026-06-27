# Node Edge Consistency Audit

This generated audit compares node relationship arrays with explicit edge rows.

## Summary

- total issues: 61
- missing_edge_for_related_id: 61

## Priority Rows

| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |
|---|---|---|---|---|---|---|---|
| missing_edge_for_related_id | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_ids | m1_expr_add_sub_linear_expression | 일차식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_data_dataset | 자료 | related_ids | m1_data_data_collection | 자료 수집 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_graph_graph | 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_num_domain | 수와 연산 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_repr_table | 표 | related_edge |  |
| missing_edge_for_related_id | m1_data_frequency_unit | 도수분포표와 상대도수 | related_ids | m1_data_variability_unit | 산포도 | related_edge |  |
| missing_edge_for_related_id | m1_data_representative_unit | 대푯값 | related_ids | m1_data_variability_unit | 산포도 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_deviation | 편차 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_standard_deviation | 표준편차 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_variance | 분산 | related_edge |  |
| missing_edge_for_related_id | m1_eq_unknown | 미지수 | related_ids | m1_term_variable | 변수 | related_edge |  |
| missing_edge_for_related_id | m1_expr_letter | 문자 | related_ids | m1_repr_expression | 식 | related_edge |  |
| missing_edge_for_related_id | m1_expr_monomial | 단항식 | related_ids | m1_expr_term | 항 | related_edge |  |
| missing_edge_for_related_id | m1_expr_unit | 문자의 사용과 식 | related_ids | m1_coord_graph_unit | 좌표평면과 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_expr_usefulness | 문자를 사용한 식의 유용성 | related_ids | m1_term_variable | 변수 | related_edge |  |
| missing_edge_for_related_id | m1_factor_binomial_product_xab | (x+a)(x+b) 공식 | related_ids | m1_quad_eq_factorization_solving | 인수분해를 이용한 이차방정식 풀이 | related_edge |  |
| missing_edge_for_related_id | m1_factor_factor | 인수 | related_ids | m1_expr_term | 항 | related_edge |  |
| missing_edge_for_related_id | m1_func_eq_relation_unit | 일차함수와 일차방정식의 관계 | related_ids | m1_coord_graph_unit | 좌표평면과 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_func_equation_relation | 일차함수와 미지수가 2개인 일차방정식의 관계 | related_ids | m1_system_two_variable_linear_equation | 미지수가 2개인 일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_func_two_variable_equation_as_graph | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | related_ids | m1_system_solution | 연립일차방정식의 해 | related_edge |  |
| missing_edge_for_related_id | m1_func_unit | 일차함수와 그 그래프 | related_ids | m1_system_unit | 연립일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_func_value | 함숫값 | related_ids | m1_expr_value | 식의 값 | related_edge |  |
| missing_edge_for_related_id | m1_geo_angle | 각 | related_ids | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_edge |  |
| missing_edge_for_related_id | m1_geo_centroid_from_parallel_ratio | 평행선과 선분의 비로 무게중심 찾기 | related_ids | m1_geo_median | 중선 | related_edge |  |
| missing_edge_for_related_id | m1_geo_circle_justification | 원의 성질 정당화 | related_ids | m1_geo_justification | 정당화 | related_edge |  |
| missing_edge_for_related_id | m1_geo_distance_between_two_points | 두 점 사이의 거리 | related_ids | m1_num_absolute_value | 절댓값 | related_edge |  |
| missing_edge_for_related_id | m1_geo_domain | 도형과 측정 | related_ids | m1_coord_graph_unit | 좌표평면과 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_geo_domain | 도형과 측정 | related_ids | m1_num_domain | 수와 연산 | related_edge |  |
| missing_edge_for_related_id | m1_geo_intersection_point | 교점 | related_ids | m1_func_intersection_point | 교점 | related_edge |  |
| missing_edge_for_related_id | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_ids | m1_geo_parallel_segment_ratio | 평행선 사이의 선분의 길이의 비 | related_edge |  |
| missing_edge_for_related_id | m1_geo_point | 점 | related_ids | m1_coord_point_location | 점의 위치 | related_edge |  |
| missing_edge_for_related_id | m1_geo_pythagorean_justification | 피타고라스 정리의 정당화 | related_ids | m1_geo_proof | 증명 | related_edge |  |
| missing_edge_for_related_id | m1_geo_sector_arc_length_area | 부채꼴의 호의 길이와 넓이 구하기 | related_ids | m1_geo_circle | 원 | related_edge |  |
| missing_edge_for_related_id | m1_geo_similar_figures | 닮은 도형 | related_ids | m1_geo_correspondence | 도형의 대응 | related_edge |  |
| missing_edge_for_related_id | m1_geo_tangent_length | 접선의 길이 | related_ids | m1_geo_tangent_line | 접선 | related_edge |  |
| missing_edge_for_related_id | m1_geo_tangent_relation | 접한다 | related_ids | m1_geo_tangent_property | 원의 접선에 관한 성질 | related_edge |  |
| missing_edge_for_related_id | m1_geo_triangle_congruence_judgement | 삼각형의 합동 판별 | related_ids | m1_geo_justification | 정당화 | related_edge |  |
| missing_edge_for_related_id | m1_geo_triangle_midpoint_theorem | 삼각형의 중점연결정리 | related_ids | m1_geo_centroid | 무게중심 | related_edge |  |
| missing_edge_for_related_id | m1_geo_trig_unit | 삼각비 | related_ids | m1_geo_triangle_quadrilateral_unit | 삼각형과 사각형의 성질 | related_edge |  |
| missing_edge_for_related_id | m1_geo_vertical_angles | 맞꼭지각 | related_ids | m1_geo_parallel_angle_properties | 평행선에서 동위각과 엇각의 성질 | related_edge |  |
| missing_edge_for_related_id | m1_ineq_inequality | 부등식 | related_ids | m1_eq_equality | 등식 | related_edge |  |
| missing_edge_for_related_id | m1_ineq_solution | 부등식의 해 | related_ids | m1_eq_solution | 해 | related_edge |  |
| missing_edge_for_related_id | m1_ineq_unit | 일차부등식 | related_ids | m1_system_unit | 연립일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_num_distributive_law | 분배법칙 | related_ids | m1_factor_polynomial_multiplication | 다항식의 곱셈 | related_edge |  |
| missing_edge_for_related_id | m1_num_domain | 수와 연산 | related_ids | m1_calc_unit | 식의 계산 | related_edge |  |
| missing_edge_for_related_id | m1_num_domain | 수와 연산 | related_ids | m1_expr_unit | 문자의 사용과 식 | related_edge |  |
| missing_edge_for_related_id | m1_num_mixed_calculation | 정수와 유리수의 혼합계산 | related_ids | m1_calc_simplify_expression | 식을 간단히 하기 | related_edge |  |
| missing_edge_for_related_id | m1_num_number_line | 수직선 | related_ids | m1_coord_number_line | 수직선 | related_edge |  |
| missing_edge_for_related_id | m1_num_positive_integer | 양의 정수 | related_ids | m1_num_natural_number | 자연수 | related_edge |  |
| missing_edge_for_related_id | m1_num_prime_factor | 소인수 | related_ids | m1_factor_factor | 인수 | related_edge |  |

## Notes

- Rows are review items, not automatic data corrections.
- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.
- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.
