# Node Edge Consistency Audit

This generated audit compares node relationship arrays with explicit edge rows.

## Summary

- total issues: 190
- missing_edge_for_related_id: 190

## Priority Rows

| issue_type | node_id | node | array_field | related_id | related label | expected relationship | matching edge ids |
|---|---|---|---|---|---|---|---|
| missing_edge_for_related_id | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | related_ids | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_arithmetic_to_polynomial_extension | 수의 사칙연산에서 다항식 계산으로의 확장 | related_ids | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_base | 밑 | related_ids | m1_calc_exponent | 지수 | related_edge |  |
| missing_edge_for_related_id | m1_calc_exponent | 지수 | related_ids | m1_calc_base | 밑 | related_edge |  |
| missing_edge_for_related_id | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_ids | m1_expr_add_sub_linear_expression | 일차식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_simplify_expression | 식을 간단히 하기 | related_ids | m1_calc_monomial_polynomial_mul_div | 단항식과 다항식의 곱셈과 나눗셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_simplify_expression | 식을 간단히 하기 | related_ids | m1_calc_polynomial_add_sub | 다항식의 덧셈과 뺄셈 | related_edge |  |
| missing_edge_for_related_id | m1_calc_unit | 식의 계산 | related_ids | m1_eq_unit | 일차방정식 | related_edge |  |
| missing_edge_for_related_id | m1_context_speed_distance | 속력과 거리 맥락 | related_ids | m1_context_speed_time | 속력과 시간 맥락 | related_edge |  |
| missing_edge_for_related_id | m1_context_speed_time | 속력과 시간 맥락 | related_ids | m1_context_speed_distance | 속력과 거리 맥락 | related_edge |  |
| missing_edge_for_related_id | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | related_ids | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | related_edge |  |
| missing_edge_for_related_id | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | related_ids | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_mark | 계급값 | related_ids | m1_data_frequency_table | 도수분포표 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_width | 계급의 크기 | related_ids | m1_data_frequency_table | 도수분포표 | related_edge |  |
| missing_edge_for_related_id | m1_data_class_width | 계급의 크기 | related_ids | m1_data_histogram | 히스토그램 | related_edge |  |
| missing_edge_for_related_id | m1_data_compare_distributions_variability | 산포도로 두 집단의 분포 비교 | related_ids | m1_data_box_plot_compare | 상자그림으로 두 집단의 분포 비교 | related_edge |  |
| missing_edge_for_related_id | m1_data_dataset | 자료 | related_ids | m1_data_data_collection | 자료 수집 | related_edge |  |
| missing_edge_for_related_id | m1_data_deviation | 편차 | related_ids | m1_data_standard_deviation | 표준편차 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_graph_graph | 그래프 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_num_domain | 수와 연산 | related_edge |  |
| missing_edge_for_related_id | m1_data_domain | 자료와 가능성 | related_ids | m1_repr_table | 표 | related_edge |  |
| missing_edge_for_related_id | m1_data_frequency_table | 도수분포표 | related_ids | m1_data_frequency_polygon | 도수분포다각형 | related_edge |  |
| missing_edge_for_related_id | m1_data_frequency_table | 도수분포표 | related_ids | m1_data_relative_frequency | 상대도수 | related_edge |  |
| missing_edge_for_related_id | m1_data_frequency_unit | 도수분포표와 상대도수 | related_ids | m1_data_variability_unit | 산포도 | related_edge |  |
| missing_edge_for_related_id | m1_data_mean | 평균 | related_ids | m1_data_mode | 최빈값 | related_edge |  |
| missing_edge_for_related_id | m1_data_mode | 최빈값 | related_ids | m1_data_mean | 평균 | related_edge |  |
| missing_edge_for_related_id | m1_data_no_correlation | 상관관계가 없는 경우 | related_ids | m1_data_positive_correlation | 양의 상관관계 | related_edge |  |
| missing_edge_for_related_id | m1_data_or_probability | 사건 A 또는 사건 B가 일어날 확률 | related_ids | m1_data_and_probability | 사건 A와 사건 B가 동시에 일어날 확률 | related_edge |  |
| missing_edge_for_related_id | m1_data_positive_correlation | 양의 상관관계 | related_ids | m1_data_no_correlation | 상관관계가 없는 경우 | related_edge |  |
| missing_edge_for_related_id | m1_data_relative_frequency_table_graph | 상대도수의 분포를 표나 그래프로 나타내기 | related_ids | m1_data_distribution_interpretation | 자료의 분포 특징 해석 | related_edge |  |
| missing_edge_for_related_id | m1_data_representative_unit | 대푯값 | related_ids | m1_data_variability_unit | 산포도 | related_edge |  |
| missing_edge_for_related_id | m1_data_representative_value | 대푯값 | related_ids | m1_data_choose_representative_value | 자료의 특성에 맞는 대푯값 선택 | related_edge |  |
| missing_edge_for_related_id | m1_data_statistical_evidence_discussion | 통계적 근거로 토론하기 | related_ids | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | related_edge |  |
| missing_edge_for_related_id | m1_data_technology_tool_stats | 공학 도구로 자료 수집·분석하기 | related_ids | m1_data_critical_graph_reading | 표와 그래프의 오류 비판적으로 읽기 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_deviation | 편차 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_standard_deviation | 표준편차 | related_edge |  |
| missing_edge_for_related_id | m1_data_variability | 산포도 | related_ids | m1_data_variance | 분산 | related_edge |  |
| missing_edge_for_related_id | m1_eq_both_sides | 양변 | related_ids | m1_eq_left_side | 좌변 | related_edge |  |
| missing_edge_for_related_id | m1_eq_both_sides | 양변 | related_ids | m1_eq_right_side | 우변 | related_edge |  |
| missing_edge_for_related_id | m1_eq_left_side | 좌변 | related_ids | m1_eq_both_sides | 양변 | related_edge |  |
| missing_edge_for_related_id | m1_eq_modeling_linear_equation | 일차방정식 세우기 | related_ids | m1_eq_solution_check | 해의 확인 | related_edge |  |
| missing_edge_for_related_id | m1_eq_modeling_linear_equation | 일차방정식 세우기 | related_ids | m1_eq_solving_linear_equation | 일차방정식 풀기 | related_edge |  |
| missing_edge_for_related_id | m1_eq_right_side | 우변 | related_ids | m1_eq_both_sides | 양변 | related_edge |  |
| missing_edge_for_related_id | m1_eq_unit | 일차방정식 | related_ids | m1_calc_unit | 식의 계산 | related_edge |  |
| missing_edge_for_related_id | m1_eq_unknown | 미지수 | related_ids | m1_eq_solution | 해 | related_edge |  |
| missing_edge_for_related_id | m1_eq_unknown | 미지수 | related_ids | m1_term_variable | 변수 | related_edge |  |
| missing_edge_for_related_id | m1_expr_coefficient | 계수 | related_ids | m1_expr_constant_term | 상수항 | related_edge |  |
| missing_edge_for_related_id | m1_expr_coefficient | 계수 | related_ids | m1_expr_degree | 차수 | related_edge |  |
| missing_edge_for_related_id | m1_expr_constant_term | 상수항 | related_ids | m1_expr_coefficient | 계수 | related_edge |  |
| missing_edge_for_related_id | m1_expr_letter | 문자 | related_ids | m1_repr_expression | 식 | related_edge |  |

## Notes

- Rows are review items, not automatic data corrections.
- Some `related_ids` entries are broad semantic links; confirm source wording before adding or removing edges.
- Use this audit before editing `concepts.json` so node fields and edge rows stay traceable.
