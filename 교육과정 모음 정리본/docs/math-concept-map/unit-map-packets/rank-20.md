# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 20
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 식의 계산
- priority tier: highest
- workplan score: 194
- concepts: 30
- edges touching unit: 174
- cross-unit edges: 76
- low confidence concepts: 4
- low confidence edges: 17

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 4 |
| procedure | 15 |
| property | 7 |
| term | 3 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 29 |
| contrasts_with | 4 |
| often_confused_with | 12 |
| prerequisite_for | 76 |
| related_to | 9 |
| used_in | 44 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_exponent_base | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | misconception_risk | official_dual_source | 성취수준에 '밑이 같은' 거듭제곱 계산이 드러나므로 잠정 오개념으로 기록했다. |
| m1_mis_polynomial_division_scope | 다항식을 단항식으로 나누는 범위 혼동 | misconception_risk | official_dual_source | 교육과정 해설의 제한 사항을 개념 지도에서 보존하기 위한 노드이다. |
| m1_mis_polynomial_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_polynomial_subtraction_sign | 다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류 | misconception_risk | official_dual_source | 성취기준/성취수준의 요구 조건에서 추론한 오개념 후보이다. 교과서 주의 문구, 오답 예, 반복 문제 패턴 확인 전까지 low로 유지한다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_mixed_calculation__used_in__m1_calc_simplify_expression | 정수와 유리수의 혼합계산 | used_in | 식을 간단히 하기 | low | official_dual_source |
| m1_mis_expansion_factorization_direction__often_confused_with__m1_calc_expansion | 전개와 인수분해 방향을 혼동하는 오류 | often_confused_with | 전개 | low | official_dual_source |
| m1_mis_polynomial_like_terms__often_confused_with__m1_expr_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | often_confused_with | 동류항 | low | official_dual_source |
| m1_mis_polynomial_subtraction_sign__often_confused_with__m1_mis_sign_operation | 다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류 | often_confused_with | 부호와 연산 기호를 혼동하는 오류 | low | official_dual_source |
| m1_mis_sign_operation__often_confused_with__m1_calc_polynomial_subtraction_sign_distribution | 부호와 연산 기호를 혼동하는 오류 | often_confused_with | 다항식의 뺄셈에서 부호 바꾸기 | low | official_dual_source |
| m1_calc_base__prerequisite_for__m1_num_prime_factorization_exponent_notation | 밑 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_expanded_form | 전개 | prerequisite_for | 전개식 | medium | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_expansion_factorization_inverse | 전개 | prerequisite_for | 전개와 인수분해의 역관계 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization | 전개 | prerequisite_for | 인수분해 | high | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization_result_check | 전개 | prerequisite_for | 인수분해 결과 전개로 확인하기 | medium | official_dual_source |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_multiplication | 전개 | prerequisite_for | 다항식의 곱셈 | high | official_single_source |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_product_expansion | 전개 | prerequisite_for | 다항식의 곱 전개하기 | high | official_dual_source |
| m1_calc_exponent__prerequisite_for__m1_num_prime_factorization_exponent_notation | 지수 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_factor_polynomial_multiplication | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 다항식의 곱셈 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_data_squared_deviation | 거듭제곱 | prerequisite_for | 편차의 제곱 | medium | official_dual_source |
| m1_calc_power__prerequisite_for__m1_factor_perfect_square_expression | 거듭제곱 | prerequisite_for | 완전제곱식 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_denominator_power_of_ten_conversion | 거듭제곱 | prerequisite_for | 분모를 10의 거듭제곱으로 만들기 | medium | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factor_product | 거듭제곱 | prerequisite_for | 소인수의 곱으로 표현하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization | 거듭제곱 | prerequisite_for | 소인수분해 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization_exponent_notation | 거듭제곱 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_repeating_decimal_equation_conversion | 거듭제곱 | prerequisite_for | 식을 세워 순환소수를 분수로 나타내기 | medium | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_square_number | 거듭제곱 | prerequisite_for | 제곱수 | medium | official_single_source |
| m1_calc_power__prerequisite_for__m1_num_square_root | 거듭제곱 | prerequisite_for | 제곱근 | medium | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_factor_unit | 식의 계산 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | official_single_source |
| m1_expr_coefficient__prerequisite_for__m1_calc_collect_like_terms_polynomial | 계수 | prerequisite_for | 다항식에서 동류항 모으기 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_calc_monomial_coefficient_calculation | 계수 | prerequisite_for | 단항식 계산에서 계수끼리 계산하기 | medium | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_calc_polynomial_term_structure_check | 계수 | prerequisite_for | 다항식의 항·계수·차수 확인하기 | medium | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_calc_polynomial_term_structure_check | 차수 | prerequisite_for | 다항식의 항·계수·차수 확인하기 | medium | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_collect_like_terms_polynomial | 동류항 | prerequisite_for | 다항식에서 동류항 모으기 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_polynomial_add_sub | 동류항 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_polynomial_add_sub_principle | 동류항 | prerequisite_for | 다항식의 덧셈과 뺄셈 원리 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_simplify_expression | 동류항 | prerequisite_for | 식을 간단히 하기 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_apply_exponent_laws_to_monomials | 단항식 | prerequisite_for | 지수법칙을 단항식 계산에 적용하기 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_coefficient_calculation | 단항식 | prerequisite_for | 단항식 계산에서 계수끼리 계산하기 | medium | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_literal_part_calculation | 단항식 | prerequisite_for | 단항식 계산에서 문자 부분 계산하기 | medium | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_mul_div | 단항식 | prerequisite_for | 단항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | 단항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_times_polynomial_distribution | 단항식 | prerequisite_for | 단항식을 다항식에 분배하기 | medium | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_unit | 단항식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_arithmetic_to_polynomial_extension | 다항식 | prerequisite_for | 수의 사칙연산에서 다항식 계산으로의 확장 | medium | official_single_source |
