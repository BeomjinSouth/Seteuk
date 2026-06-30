# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 15
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 식의 계산
- priority tier: high
- workplan score: 111
- concepts: 14
- edges touching unit: 80
- cross-unit edges: 41
- low confidence concepts: 2
- low confidence edges: 11

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 3 |
| procedure | 5 |
| property | 2 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 13 |
| contrasts_with | 1 |
| often_confused_with | 7 |
| prerequisite_for | 40 |
| related_to | 2 |
| used_in | 17 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | misconception_risk | official_dual_source | 성취수준에 '밑이 같은' 거듭제곱 계산이 드러나므로 잠정 오개념으로 기록했다. |
| m1_mis_polynomial_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_mixed_calculation__used_in__m1_calc_simplify_expression | 정수와 유리수의 혼합계산 | used_in | 식을 간단히 하기 | low | official_dual_source |
| m1_mis_expansion_factorization_direction__often_confused_with__m1_calc_expansion | 전개와 인수분해 방향을 혼동하는 오류 | often_confused_with | 전개 | low | official_dual_source |
| m1_mis_polynomial_like_terms__often_confused_with__m1_expr_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | often_confused_with | 동류항 | low | official_dual_source |
| m1_calc_base__prerequisite_for__m1_num_prime_factorization_exponent_notation | 밑 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_expansion_factorization_inverse | 전개 | prerequisite_for | 전개와 인수분해의 역관계 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization | 전개 | prerequisite_for | 인수분해 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_multiplication | 전개 | prerequisite_for | 다항식의 곱셈 | high | official_single_source |
| m1_calc_exponent__prerequisite_for__m1_num_prime_factorization_exponent_notation | 지수 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_factor_polynomial_multiplication | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 다항식의 곱셈 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_data_variance | 거듭제곱 | prerequisite_for | 분산 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_factor_perfect_square_expression | 거듭제곱 | prerequisite_for | 완전제곱식 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factor_product | 거듭제곱 | prerequisite_for | 소인수의 곱으로 표현하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization | 거듭제곱 | prerequisite_for | 소인수분해 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization_exponent_notation | 거듭제곱 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_square_number | 거듭제곱 | prerequisite_for | 제곱수 | medium | official_single_source |
| m1_calc_power__prerequisite_for__m1_num_square_root | 거듭제곱 | prerequisite_for | 제곱근 | medium | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_factor_unit | 식의 계산 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | official_single_source |
| m1_calc_unit__prerequisite_for__m1_ineq_solving_linear_inequality | 식의 계산 | prerequisite_for | 일차부등식 풀기 | high | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_ineq_unit | 식의 계산 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_system_unit | 식의 계산 | prerequisite_for | 연립일차방정식 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_polynomial_add_sub | 동류항 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_simplify_expression | 동류항 | prerequisite_for | 식을 간단히 하기 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_mul_div | 단항식 | prerequisite_for | 단항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | 단항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_unit | 단항식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_arithmetic_to_polynomial_extension | 다항식 | prerequisite_for | 수의 사칙연산에서 다항식 계산으로의 확장 | medium | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | 다항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_polynomial_add_sub | 다항식 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_unit | 다항식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_expr_unit__prerequisite_for__m1_calc_unit | 문자의 사용과 식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_num_distributive_law__prerequisite_for__m1_calc_expansion | 분배법칙 | prerequisite_for | 전개 | medium | official_single_source |
| m1_num_four_operations__prerequisite_for__m1_calc_unit | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 계산 | medium | official_single_source |
| m1_calc_base__used_in__m1_num_prime_factor_product | 밑 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_exponent__used_in__m1_num_prime_factor_product | 지수 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_power__used_in__m1_num_prime_factor_product | 거듭제곱 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_power__used_in__m1_num_square_number | 거듭제곱 | used_in | 제곱수 | medium | official_single_source |
| m1_expr_add_sub_linear_expression__used_in__m1_calc_polynomial_add_sub | 일차식의 덧셈과 뺄셈 | used_in | 다항식의 덧셈과 뺄셈 | medium | official_dual_source |
| m1_expr_like_terms__used_in__m1_calc_polynomial_add_sub | 동류항 | used_in | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_polynomial__used_in__m1_calc_polynomial_add_sub | 다항식 | used_in | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_calc_unit__related_to__m1_eq_unit | 식의 계산 | related_to | 일차방정식 | medium | official_dual_source |
