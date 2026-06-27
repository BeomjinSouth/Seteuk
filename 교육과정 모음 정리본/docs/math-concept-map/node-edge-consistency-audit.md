# Node Edge Consistency Audit

This generated audit compares node relationship arrays with explicit edge rows.

## Summary

- total issues: 18
- missing_edge_for_related_id: 18

## Priority Rows

| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |
|---|---|---|---|---|---|---|---|
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_graph_graph | 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_num_domain | 수와 연산 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_repr_table | 표 | related_edge |  |
| missing_edge_for_related_id | m1_expr_usefulness | 문자를 사용한 식의 유용성 | related_ids | m1_term_variable | 변수 | related_edge |  |
| missing_edge_for_related_id | m1_geo_distance_between_two_points | 두 점 사이의 거리 | related_ids | m1_num_absolute_value | 절댓값 | related_edge |  |
| missing_edge_for_related_id | m1_geo_domain | 도형과 측정 | related_ids | m1_coord_graph_unit | 좌표평면과 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_geo_domain | 도형과 측정 | related_ids | m1_num_domain | 수와 연산 | related_edge |  |
| missing_edge_for_related_id | m1_geo_intersection_point | 교점 | related_ids | m1_func_intersection_point | 교점 | related_edge |  |
| missing_edge_for_related_id | m1_geo_point | 점 | related_ids | m1_coord_point_location | 점의 위치 | related_edge |  |
| missing_edge_for_related_id | m1_geo_triangle_midpoint_theorem | 삼각형의 중점연결정리 | related_ids | m1_geo_centroid | 무게중심 | related_edge |  |
| missing_edge_for_related_id | m1_ineq_inequality | 부등식 | related_ids | m1_eq_equality | 등식 | related_edge |  |
| missing_edge_for_related_id | m1_num_distributive_law | 분배법칙 | related_ids | m1_factor_polynomial_multiplication | 다항식의 곱셈 | related_edge |  |
| missing_edge_for_related_id | m1_num_domain | 수와 연산 | related_ids | m1_calc_unit | 식의 계산 | related_edge |  |
| missing_edge_for_related_id | m1_num_domain | 수와 연산 | related_ids | m1_expr_unit | 문자의 사용과 식 | related_edge |  |
| missing_edge_for_related_id | m1_num_mixed_calculation | 정수와 유리수의 혼합계산 | related_ids | m1_calc_simplify_expression | 식을 간단히 하기 | related_edge |  |
| missing_edge_for_related_id | m1_num_number_line | 수직선 | related_ids | m1_coord_number_line | 수직선 | related_edge |  |
| missing_edge_for_related_id | m1_num_prime_factor | 소인수 | related_ids | m1_factor_factor | 인수 | related_edge |  |
| missing_edge_for_related_id | m1_num_prime_factor_unit | 소인수분해 | related_ids | m1_calc_power | 거듭제곱 | related_edge |  |

## Notes

- Rows are review items, not automatic data corrections.
- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.
- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.
