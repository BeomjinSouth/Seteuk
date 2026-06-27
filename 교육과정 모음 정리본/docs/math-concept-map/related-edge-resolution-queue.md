# Related Edge Resolution Queue

This generated queue isolates unresolved `related_ids` entries and suggests candidate edge types for source-backed review.

## Summary

- related edge candidates: 18
- high priority: 0
- medium priority: 0

## Queue

| rank | tier | node_id | node | related_id | related | candidates | next action |
|---:|---|---|---|---|---|---|---|
| 1 | low | m1_geo_distance_between_two_points | 두 점 사이의 거리 | m1_num_absolute_value | 절댓값 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 2 | low | m1_geo_intersection_point | 교점 | m1_func_intersection_point | 교점 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 3 | low | m1_geo_domain | 도형과 측정 | m1_coord_graph_unit | 좌표평면과 그래프 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 4 | low | m1_geo_domain | 도형과 측정 | m1_num_domain | 수와 연산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 5 | low | m1_num_prime_factor | 소인수 | m1_factor_factor | 인수 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 6 | low | m1_num_domain | 수와 연산 | m1_calc_unit | 식의 계산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 7 | low | m1_num_domain | 수와 연산 | m1_expr_unit | 문자의 사용과 식 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 8 | low | m1_num_distributive_law | 분배법칙 | m1_factor_polynomial_multiplication | 다항식의 곱셈 | used_in; related_to | confirm_used_in_or_related_edge |
| 9 | low | m1_num_mixed_calculation | 정수와 유리수의 혼합계산 | m1_calc_simplify_expression | 식을 간단히 하기 | used_in; related_to | confirm_used_in_or_related_edge |
| 10 | low | m1_num_number_line | 수직선 | m1_coord_number_line | 수직선 | represented_by; related_to | confirm_representation_or_related_edge |
| 11 | low | m1_data_domain | 자료와 가능성 | m1_graph_graph | 그래프 | represented_by; related_to | confirm_representation_or_related_edge |
| 12 | low | m1_data_domain | 자료와 가능성 | m1_num_domain | 수와 연산 | contrasts_with; related_to | confirm_contrast_or_related_edge |
| 13 | low | m1_data_domain | 자료와 가능성 | m1_repr_table | 표 | represented_by; related_to | confirm_representation_or_related_edge |
| 14 | low | m1_geo_triangle_midpoint_theorem | 삼각형의 중점연결정리 | m1_geo_centroid | 무게중심 | related_to | confirm_related_to_edge |
| 15 | low | m1_expr_usefulness | 문자를 사용한 식의 유용성 | m1_term_variable | 변수 | related_to | confirm_related_to_edge |
| 16 | low | m1_ineq_inequality | 부등식 | m1_eq_equality | 등식 | related_to | confirm_related_to_edge |
| 17 | backlog | m1_geo_point | 점 | m1_coord_point_location | 점의 위치 | related_to | confirm_related_to_edge |
| 18 | backlog | m1_num_prime_factor_unit | 소인수분해 | m1_calc_power | 거듭제곱 | related_to | confirm_related_to_edge |

## Notes

- Candidate types are review hints, not final relationship assertions.
- Confirm official or textbook wording before adding `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, or `used_in` edges.
- Rows are sorted to surface same-unit, reciprocal, low-confidence, and misconception-risk links first.
