# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 15
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 제곱근과 실수
- priority tier: highest
- workplan score: 134
- concepts: 25
- edges touching unit: 121
- cross-unit edges: 29
- low confidence concepts: 3
- low confidence edges: 15

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 4 |
| misconception_risk | 3 |
| procedure | 10 |
| property | 2 |
| representation | 3 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 28 |
| contrasts_with | 4 |
| often_confused_with | 11 |
| prerequisite_for | 39 |
| related_to | 2 |
| represented_by | 4 |
| used_in | 33 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_irrational_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_radical_like_terms | 근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_radical_principal_root | 근호가 나타내는 제곱근의 부호를 혼동하는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_radical_expression__prerequisite_for__m1_quad_eq_root_formula_substitution | 근호를 포함한 식 | prerequisite_for | 근의 공식에 계수 대입하기 | low | official_single_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_infinite_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 무한소수 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_rational_repeating_relation | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 유리수와 순환소수의 관계 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_repeating_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 순환소수 | low | official_dual_source |
| m1_mis_radical_like_terms__often_confused_with__m1_expr_like_terms | 근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류 | often_confused_with | 동류항 | low | official_single_source |
| m1_num_domain__contains__m1_num_square_root_real_unit | 수와 연산 | contains | 제곱근과 실수 | high | official_single_source |
| m1_num_real_number__contains__m1_num_rational_number | 실수 | contains | 유리수 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_square_number | 거듭제곱 | prerequisite_for | 제곱수 | medium | official_single_source |
| m1_calc_power__prerequisite_for__m1_num_square_root | 거듭제곱 | prerequisite_for | 제곱근 | medium | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_num_real_order | 정수와 유리수의 대소 관계 | prerequisite_for | 실수의 대소 관계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_irrational_number | 유리수 | prerequisite_for | 무리수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_rational_irrational_classification | 유리수 | prerequisite_for | 유리수와 무리수의 구분 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_real_number | 유리수 | prerequisite_for | 실수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_real_number_system | 유리수 | prerequisite_for | 실수의 수 체계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_square_root_real_unit | 유리수 | prerequisite_for | 제곱근과 실수 | high | official_dual_source |
| m1_num_repeating_decimal_unit__prerequisite_for__m1_num_square_root_real_unit | 유리수와 순환소수 | prerequisite_for | 제곱근과 실수 | medium | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_data_standard_deviation | 제곱근 | prerequisite_for | 표준편차 | high | official_dual_source |
| m1_num_square_root__prerequisite_for__m1_geo_pythagorean_theorem | 제곱근 | prerequisite_for | 피타고라스 정리 | high | official_dual_source |
| m1_num_real_number__represented_by__m1_num_number_line | 실수 | represented_by | 수직선 | medium | official_dual_source |
| m1_calc_power__used_in__m1_num_square_number | 거듭제곱 | used_in | 제곱수 | medium | official_single_source |
| m1_geo_diagonal__used_in__m1_num_unit_square_diagonal | 대각선 | used_in | 한 변의 길이가 1인 정사각형의 대각선 | medium | official_dual_source |
| m1_num_number_line__used_in__m1_num_real_order | 수직선 | used_in | 실수의 대소 관계 | medium | official_dual_source |
| m1_num_rational_number__used_in__m1_num_rational_irrational_classification | 유리수 | used_in | 유리수와 무리수의 구분 | high | official_dual_source |
| m1_num_rational_repeating_relation__used_in__m1_num_rational_irrational_classification | 유리수와 순환소수의 관계 | used_in | 유리수와 무리수의 구분 | medium | official_dual_source |
| m1_num_irrational_number__contrasts_with__m1_num_rational_number | 무리수 | contrasts_with | 유리수 | high | official_dual_source |
| m1_num_irrational_number__contrasts_with__m1_num_repeating_decimal | 무리수 | contrasts_with | 순환소수 | medium | official_dual_source |
| m1_num_rational_number__contrasts_with__m1_num_irrational_number | 유리수 | contrasts_with | 무리수 | high | official_dual_source |
| m1_num_repeating_decimal__contrasts_with__m1_num_irrational_number | 순환소수 | contrasts_with | 무리수 | medium | official_dual_source |
| m1_num_integer_rational_unit__related_to__m1_num_square_root_real_unit | 정수와 유리수 | related_to | 제곱근과 실수 | medium | official_dual_source |
