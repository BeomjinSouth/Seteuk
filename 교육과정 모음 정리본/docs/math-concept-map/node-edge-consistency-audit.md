# Node Edge Consistency Audit

This generated audit compares node relationship arrays with explicit edge rows.

## Summary

- total issues: 506
- edge_without_parent_id: 27
- edge_without_prerequisite_id: 10
- missing_edge_for_related_id: 469

## Priority Rows

| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |
|---|---|---|---|---|---|---|---|
| missing_edge_for_related_id | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | related_ids | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | related_ids | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_base | 밑 | related_ids | m1_calc_exponent | 지수 | related_edge |  |
| missing_edge_for_related_id | m1_calc_base | 밑 | related_ids | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | related_edge |  |
| missing_edge_for_related_id | m1_calc_exponent | 지수 | related_ids | m1_calc_base | 밑 | related_edge |  |
| missing_edge_for_related_id | m1_calc_exponent | 지수 | related_ids | m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | related_edge |  |
| missing_edge_for_related_id | m1_calc_monomial_mul_div | 단항식의 곱셈과 나눗셈 | related_ids | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_ids | m1_expr_add_sub_linear_expression | 일차식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_power | 거듭제곱 | related_ids | m1_calc_base | 밑 | related_edge |  |
| missing_edge_for_related_id | m1_calc_power | 거듭제곱 | related_ids | m1_calc_exponent | 지수 | related_edge |  |
| missing_edge_for_related_id | m1_calc_power | 거듭제곱 | related_ids | m1_calc_exponent_laws | 지수법칙 | related_edge |  |
| missing_edge_for_related_id | m1_calc_simplify_expression | 식을 간단히 하기 | related_ids | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_simplify_expression | 식을 간단히 하기 | related_ids | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_unit | 식의 계산 | related_ids | m1_eq_unit | 일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_calc_unit | 식의 계산 | related_ids | m1_ineq_unit | 일차부등식 | related_edge |  |
| missing_edge_for_related_id | m1_calc_unit | 식의 계산 | related_ids | m1_system_unit | 연립일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_context_speed_distance | 속력과 거리 맥락 | related_ids | m1_context_speed_time | 속력과 시간 맥락 | related_edge |  |
| missing_edge_for_related_id | m1_context_speed_time | 속력과 시간 맥락 | related_ids | m1_context_speed_distance | 속력과 거리 맥락 | related_edge |  |
| missing_edge_for_related_id | m1_coord_axis | 좌표축 | related_ids | m1_coord_axis_point | 축 위의 점 | related_edge |  |
| missing_edge_for_related_id | m1_coord_axis | 좌표축 | related_ids | m1_coord_x_axis | x축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_axis | 좌표축 | related_ids | m1_coord_y_axis | y축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_coordinate | 좌표 | related_ids | m1_coord_x_coordinate | x좌표 | related_edge |  |
| missing_edge_for_related_id | m1_coord_coordinate | 좌표 | related_ids | m1_coord_y_coordinate | y좌표 | related_edge |  |
| missing_edge_for_related_id | m1_coord_coordinate_plane | 좌표평면 | related_ids | m1_coord_axis | 좌표축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_coordinate_plane | 좌표평면 | related_ids | m1_coord_origin | 원점 | related_edge |  |
| missing_edge_for_related_id | m1_coord_coordinate_plane | 좌표평면 | related_ids | m1_coord_quadrant | 사분면 | related_edge |  |
| missing_edge_for_related_id | m1_coord_number_line | 수직선 | related_ids | m1_coord_coordinate | 좌표 | related_edge |  |
| missing_edge_for_related_id | m1_coord_number_line | 수직선 | related_ids | m1_coord_coordinate_plane | 좌표평면 | related_edge |  |
| missing_edge_for_related_id | m1_coord_ordered_pair | 순서쌍 | related_ids | m1_coord_coordinate | 좌표 | related_edge |  |
| missing_edge_for_related_id | m1_coord_origin | 원점 | related_ids | m1_coord_x_axis | x축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_origin | 원점 | related_ids | m1_coord_y_axis | y축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_point_location | 점의 위치 | related_ids | m1_coord_axis_point | 축 위의 점 | related_edge |  |
| missing_edge_for_related_id | m1_coord_usefulness | 좌표 표현의 편리함 | related_ids | m1_coord_coordinate | 좌표 | related_edge |  |
| missing_edge_for_related_id | m1_coord_x_axis | x축 | related_ids | m1_coord_axis_point | 축 위의 점 | related_edge |  |
| missing_edge_for_related_id | m1_coord_x_axis | x축 | related_ids | m1_coord_y_axis | y축 | related_edge |  |
| missing_edge_for_related_id | m1_coord_y_axis | y축 | related_ids | m1_coord_axis_point | 축 위의 점 | related_edge |  |
| missing_edge_for_related_id | m1_coord_y_axis | y축 | related_ids | m1_coord_x_axis | x축 | related_edge |  |
| missing_edge_for_related_id | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | related_ids | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | related_edge |  |
| missing_edge_for_related_id | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | related_ids | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | related_edge |  |
| missing_edge_for_related_id | m1_data_box_scatter_unit | 상자그림과 산점도 | related_ids | m1_data_box_plot | 상자그림 | related_edge |  |
| missing_edge_for_related_id | m1_data_box_scatter_unit | 상자그림과 산점도 | related_ids | m1_data_scatter_plot | 산점도 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_mark | 계급값 | related_ids | m1_data_frequency_table | 도수분포표 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_width | 계급의 크기 | related_ids | m1_data_frequency_table | 도수분포표 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_width | 계급의 크기 | related_ids | m1_data_histogram | 히스토그램 | related_edge |  |
| missing_edge_for_related_id | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | related_ids | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | related_edge |  |
| missing_edge_for_related_id | m1_data_correlation | 상관관계 | related_ids | m1_data_negative_correlation | 음의 상관관계 | related_edge |  |
| missing_edge_for_related_id | m1_data_correlation | 상관관계 | related_ids | m1_data_no_correlation | 상관관계가 없는 경우 | related_edge |  |
| missing_edge_for_related_id | m1_data_correlation | 상관관계 | related_ids | m1_data_positive_correlation | 양의 상관관계 | related_edge |  |
| missing_edge_for_related_id | m1_data_counting_cases | 경우의 수 | related_ids | m1_data_probability | 확률 | related_edge |  |
| missing_edge_for_related_id | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | related_ids | m1_mis_graph_scale_distortion | 눈금 왜곡 그래프를 그대로 해석하는 오류 | related_edge |  |

## Notes

- Rows are review items, not automatic data corrections.
- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.
- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.
