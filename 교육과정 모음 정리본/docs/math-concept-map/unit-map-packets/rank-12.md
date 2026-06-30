# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 12
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 문자의 사용과 식
- priority tier: highest
- workplan score: 180
- concepts: 24
- edges touching unit: 146
- cross-unit edges: 72
- low confidence concepts: 3
- low confidence edges: 15

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 6 |
| property | 2 |
| representation | 1 |
| sub_concept | 2 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 27 |
| contrasts_with | 4 |
| often_confused_with | 11 |
| prerequisite_for | 68 |
| related_to | 4 |
| represented_by | 2 |
| used_in | 30 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_coefficient_constant_degree | 계수·상수항·차수 혼동 | misconception_risk | official_dual_source | 용어 목록과 일차식 계산 성취수준을 바탕으로 둔 잠정 오개념 노드이다. |
| m1_mis_letter_as_label_only | 문자를 이름표로만 해석하는 오류 | misconception_risk | official_dual_source | 공식 문서의 문자와 일상 언어 비교 지도 유의점에서 추론한 위험이다. 교과서 도입 활동으로 보강 필요. |
| m1_mis_like_terms | 동류항이 아닌 항을 합치는 오류 | misconception_risk | official_dual_source | 성취수준의 일차식 계산 수행에서 발생할 수 있는 위험으로 추론했다. 교과서 예제와 오답 분석으로 보강 필요. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_function_value_input_output__often_confused_with__m1_expr_substitution | 함숫값과 입력값 혼동 | often_confused_with | 대입 | low | official_dual_source |
| m1_mis_letter_as_label_only__often_confused_with__m1_term_variable | 문자를 이름표로만 해석하는 오류 | often_confused_with | 변수 | low | official_dual_source |
| m1_mis_polynomial_like_terms__often_confused_with__m1_expr_like_terms | 다항식에서 동류항 처리를 누락하는 오류 | often_confused_with | 동류항 | low | official_dual_source |
| m1_mis_radical_like_terms__often_confused_with__m1_expr_like_terms | 근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류 | often_confused_with | 동류항 | low | official_single_source |
| m1_mis_system_substitution__often_confused_with__m1_expr_substitution | 대입법에서 식 전체를 대입하지 않는 오류 | often_confused_with | 대입 | low | official_dual_source |
| m1_num_domain__related_to__m1_expr_unit | 수와 연산 | related_to | 문자의 사용과 식 | low | official_dual_source |
| m1_expr_unit__contains__m1_repr_everyday_language | 문자의 사용과 식 | contains | 일상 언어 | high | official_single_source |
| m1_expr_unit__contains__m1_repr_expression | 문자의 사용과 식 | contains | 식 | high | official_dual_source |
| m1_expr_unit__contains__m1_term_variable | 문자의 사용과 식 | contains | 변수 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_binomial_product_xab | 계수 | prerequisite_for | (x+a)(x+b) 공식 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_factor_linear_product_axb_cxd | 계수 | prerequisite_for | (ax+b)(cx+d) 공식 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_quad_eq_coefficients_in_standard_form | 계수 | prerequisite_for | 이차방정식의 계수 | medium | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_quad_eq_leading_coefficient_one_case | 계수 | prerequisite_for | 이차항의 계수가 1인 이차방정식 | high | official_dual_source |
| m1_expr_constant_term__prerequisite_for__m1_eq_collect_constant_terms | 상수항 | prerequisite_for | 상수항 모으기 | medium | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_factor_quadratic_expression | 차수 | prerequisite_for | 이차식 | medium | official_dual_source |
| m1_expr_degree__prerequisite_for__m1_quad_eq_quadratic_term | 차수 | prerequisite_for | 이차항 | medium | official_single_source |
| m1_expr_letter__prerequisite_for__m1_eq_unknown | 문자 | prerequisite_for | 미지수 | high | official_dual_source |
| m1_expr_letter_quantity__prerequisite_for__m1_eq_choose_unknown_from_context | 문자가 나타내는 수량 정하기 | prerequisite_for | 문제 상황에서 미지수 정하기 | medium | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_polynomial_add_sub | 동류항 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_calc_simplify_expression | 동류항 | prerequisite_for | 식을 간단히 하기 | high | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_factor_common_factor | 동류항 | prerequisite_for | 공통인수 | medium | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_eq_linear_equation | 일차식 | prerequisite_for | 일차방정식 | high | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_eq_unit | 일차식 | prerequisite_for | 일차방정식 | high | official_single_source |
| m1_expr_linear_expression__prerequisite_for__m1_func_linear_function | 일차식 | prerequisite_for | 일차함수 | high | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_ineq_linear_inequality | 일차식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_eq_modeling_linear_equation | 문자를 사용한 식 | prerequisite_for | 일차방정식 세우기 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_ineq_modeling_linear_inequality | 문자를 사용한 식 | prerequisite_for | 일차부등식 세우기 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_system_modeling | 문자를 사용한 식 | prerequisite_for | 연립일차방정식 세우기 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_mul_div | 단항식 | prerequisite_for | 단항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | 단항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_monomial__prerequisite_for__m1_calc_unit | 단항식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_arithmetic_to_polynomial_extension | 다항식 | prerequisite_for | 수의 사칙연산에서 다항식 계산으로의 확장 | medium | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | 다항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_polynomial_add_sub | 다항식 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_calc_unit | 다항식 | prerequisite_for | 식의 계산 | high | official_single_source |
| m1_expr_polynomial__prerequisite_for__m1_eq_equation | 다항식 | prerequisite_for | 방정식 | medium | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_factor_quadratic_expression | 다항식 | prerequisite_for | 이차식 | medium | official_dual_source |
| m1_expr_polynomial__prerequisite_for__m1_factor_unit | 다항식 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_judge_solution | 대입 | prerequisite_for | 해인지 판단하기 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_eq_solution | 대입 | prerequisite_for | 해 | high | official_dual_source |
