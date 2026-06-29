# Textbook Edge Evidence Packet

This generated packet is the unit-level worksheet for adding textbook-grounded relationship evidence.

## Target Unit

- rank: 15
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 식의 계산
- priority tier: high
- priority score: 26
- edges in packet: 76
- cross-unit edges: 37
- low confidence edges: 11

## Relationship Evidence Slots

| edge_id | scope | source | relationship | target | confidence | required evidence | focus | source refs |
|---|---|---|---|---|---|---|---|---:|
| m1_calc_unit__contains__m1_mis_exponent_base | intra_unit | 식의 계산 | contains | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | low | structure_ref;textbook_page_refs;extraction_notes | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_mis_polynomial_like_terms | intra_unit | 식의 계산 | contains | 다항식에서 동류항 처리를 누락하는 오류 | low | structure_ref;textbook_page_refs;extraction_notes | Find textbook structure evidence for the containment relation. | 2 |
| m1_calc_base__prerequisite_for__m1_mis_exponent_base | intra_unit | 밑 | prerequisite_for | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_exponent_laws__prerequisite_for__m1_mis_exponent_base | intra_unit | 지수법칙 | prerequisite_for | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | low | prerequisite_ref;textbook_page_refs;extraction_notes | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_mis_exponent_base__often_confused_with__m1_calc_base | intra_unit | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | often_confused_with | 밑 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_mis_exponent_base__often_confused_with__m1_calc_exponent | intra_unit | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | often_confused_with | 지수 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_mis_exponent_base__often_confused_with__m1_calc_exponent_laws | intra_unit | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | often_confused_with | 지수법칙 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_mis_polynomial_like_terms__often_confused_with__m1_calc_polynomial_add_sub | intra_unit | 다항식에서 동류항 처리를 누락하는 오류 | often_confused_with | 다항식의 덧셈과 뺄셈 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_num_mixed_calculation__used_in__m1_calc_simplify_expression | cross_unit | 정수와 유리수의 혼합계산 | used_in | 식을 간단히 하기 | low | procedure_ref;textbook_page_refs;extraction_notes | Find a worked example, procedure, or application where this source concept is used. | 5 |
| m1_mis_expansion_factorization_direction__often_confused_with__m1_calc_expansion | cross_unit | 전개와 인수분해 방향을 혼동하는 오류 | often_confused_with | 전개 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_mis_polynomial_like_terms__often_confused_with__m1_expr_like_terms | cross_unit | 다항식에서 동류항 처리를 누락하는 오류 | often_confused_with | 동류항 | low | misconception_ref;problem_pattern_ref;textbook_page_refs;extraction_notes | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 2 |
| m1_calc_power__contains__m1_calc_base | intra_unit | 거듭제곱 | contains | 밑 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_calc_power__contains__m1_calc_exponent | intra_unit | 거듭제곱 | contains | 지수 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_arithmetic_to_polynomial_extension | intra_unit | 식의 계산 | contains | 수의 사칙연산에서 다항식 계산으로의 확장 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 1 |
| m1_calc_unit__contains__m1_calc_expansion | intra_unit | 식의 계산 | contains | 전개 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_exponent_laws | intra_unit | 식의 계산 | contains | 지수법칙 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_monomial_mul_div | intra_unit | 식의 계산 | contains | 단항식의 곱셈과 나눗셈 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_monomial_polynomial_mul_div | intra_unit | 식의 계산 | contains | 단항식과 다항식의 곱셈과 나눗셈 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_polynomial_add_sub | intra_unit | 식의 계산 | contains | 다항식의 덧셈과 뺄셈 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_calc_unit__contains__m1_calc_power | intra_unit | 식의 계산 | contains | 거듭제곱 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_unit__contains__m1_calc_simplify_expression | intra_unit | 식의 계산 | contains | 식을 간단히 하기 | high | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 2 |
| m1_calc_unit__contains__m1_mis_polynomial_division_scope | intra_unit | 식의 계산 | contains | 다항식을 단항식으로 나누는 범위 혼동 | medium | structure_ref;textbook_page_refs | Find textbook structure evidence for the containment relation. | 3 |
| m1_calc_base__prerequisite_for__m1_calc_exponent_laws | intra_unit | 밑 | prerequisite_for | 지수법칙 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_exponent__prerequisite_for__m1_calc_exponent_laws | intra_unit | 지수 | prerequisite_for | 지수법칙 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_exponent_laws__prerequisite_for__m1_calc_monomial_mul_div | intra_unit | 지수법칙 | prerequisite_for | 단항식의 곱셈과 나눗셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_exponent_laws__prerequisite_for__m1_calc_monomial_polynomial_mul_div | intra_unit | 지수법칙 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_exponent_laws__prerequisite_for__m1_calc_simplify_expression | intra_unit | 지수법칙 | prerequisite_for | 식을 간단히 하기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_calc_monomial_mul_div__prerequisite_for__m1_calc_monomial_polynomial_mul_div | intra_unit | 단항식의 곱셈과 나눗셈 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_calc_expansion | intra_unit | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 전개 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_mis_polynomial_division_scope | intra_unit | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 다항식을 단항식으로 나누는 범위 혼동 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_power__prerequisite_for__m1_calc_exponent_laws | intra_unit | 거듭제곱 | prerequisite_for | 지수법칙 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_arithmetic_to_polynomial_extension__used_in__m1_calc_monomial_polynomial_mul_div | intra_unit | 수의 사칙연산에서 다항식 계산으로의 확장 | used_in | 단항식과 다항식의 곱셈과 나눗셈 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_calc_arithmetic_to_polynomial_extension__used_in__m1_calc_polynomial_add_sub | intra_unit | 수의 사칙연산에서 다항식 계산으로의 확장 | used_in | 다항식의 덧셈과 뺄셈 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_calc_base__used_in__m1_calc_exponent_laws | intra_unit | 밑 | used_in | 지수법칙 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_exponent__used_in__m1_calc_exponent_laws | intra_unit | 지수 | used_in | 지수법칙 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_exponent_laws__used_in__m1_calc_monomial_mul_div | intra_unit | 지수법칙 | used_in | 단항식의 곱셈과 나눗셈 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_calc_exponent_laws__used_in__m1_calc_simplify_expression | intra_unit | 지수법칙 | used_in | 식을 간단히 하기 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_monomial_polynomial_mul_div__used_in__m1_calc_expansion | intra_unit | 단항식과 다항식의 곱셈과 나눗셈 | used_in | 전개 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_calc_simplify_expression__used_in__m1_calc_monomial_polynomial_mul_div | intra_unit | 식을 간단히 하기 | used_in | 단항식과 다항식의 곱셈과 나눗셈 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 4 |
| m1_calc_simplify_expression__used_in__m1_calc_polynomial_add_sub | intra_unit | 식을 간단히 하기 | used_in | 다항식의 덧셈과 뺄셈 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 4 |
| m1_calc_base__contrasts_with__m1_calc_exponent | intra_unit | 밑 | contrasts_with | 지수 | medium | contrast_ref;textbook_page_refs | Find textbook wording or examples that distinguish the two concepts. | 3 |
| m1_mis_polynomial_division_scope__often_confused_with__m1_calc_monomial_polynomial_mul_div | intra_unit | 다항식을 단항식으로 나누는 범위 혼동 | often_confused_with | 단항식과 다항식의 곱셈과 나눗셈 | medium | misconception_ref;problem_pattern_ref;textbook_page_refs | Find misconception, caution, example, or problem-pattern evidence for the confusion risk. | 3 |
| m1_calc_expansion__prerequisite_for__m1_factor_expansion_factorization_inverse | cross_unit | 전개 | prerequisite_for | 전개와 인수분해의 역관계 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_calc_expansion__prerequisite_for__m1_factor_factorization | cross_unit | 전개 | prerequisite_for | 인수분해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_calc_expansion__prerequisite_for__m1_factor_polynomial_multiplication | cross_unit | 전개 | prerequisite_for | 다항식의 곱셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_monomial_polynomial_mul_div__prerequisite_for__m1_factor_polynomial_multiplication | cross_unit | 단항식과 다항식의 곱셈과 나눗셈 | prerequisite_for | 다항식의 곱셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_power__prerequisite_for__m1_data_variance | cross_unit | 거듭제곱 | prerequisite_for | 분산 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_power__prerequisite_for__m1_factor_perfect_square_expression | cross_unit | 거듭제곱 | prerequisite_for | 완전제곱식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_power__prerequisite_for__m1_num_prime_factor_product | cross_unit | 거듭제곱 | prerequisite_for | 소인수의 곱으로 표현하기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization | cross_unit | 거듭제곱 | prerequisite_for | 소인수분해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_power__prerequisite_for__m1_num_square_root | cross_unit | 거듭제곱 | prerequisite_for | 제곱근 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_unit__prerequisite_for__m1_factor_unit | cross_unit | 식의 계산 | prerequisite_for | 다항식의 곱셈과 인수분해 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_calc_unit__prerequisite_for__m1_ineq_solving_linear_inequality | cross_unit | 식의 계산 | prerequisite_for | 일차부등식 풀기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_calc_unit__prerequisite_for__m1_ineq_unit | cross_unit | 식의 계산 | prerequisite_for | 일차부등식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_calc_unit__prerequisite_for__m1_system_unit | cross_unit | 식의 계산 | prerequisite_for | 연립일차방정식 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_like_terms__prerequisite_for__m1_calc_polynomial_add_sub | cross_unit | 동류항 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_like_terms__prerequisite_for__m1_calc_simplify_expression | cross_unit | 동류항 | prerequisite_for | 식을 간단히 하기 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_mul_div | cross_unit | 단항식 | prerequisite_for | 단항식의 곱셈과 나눗셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_monomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | cross_unit | 단항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_monomial__prerequisite_for__m1_calc_unit | cross_unit | 단항식 | prerequisite_for | 식의 계산 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_polynomial__prerequisite_for__m1_calc_arithmetic_to_polynomial_extension | cross_unit | 다항식 | prerequisite_for | 수의 사칙연산에서 다항식 계산으로의 확장 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 1 |
| m1_expr_polynomial__prerequisite_for__m1_calc_monomial_polynomial_mul_div | cross_unit | 다항식 | prerequisite_for | 단항식과 다항식의 곱셈과 나눗셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_polynomial__prerequisite_for__m1_calc_polynomial_add_sub | cross_unit | 다항식 | prerequisite_for | 다항식의 덧셈과 뺄셈 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_expr_polynomial__prerequisite_for__m1_calc_unit | cross_unit | 다항식 | prerequisite_for | 식의 계산 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_expr_unit__prerequisite_for__m1_calc_unit | cross_unit | 문자의 사용과 식 | prerequisite_for | 식의 계산 | high | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 4 |
| m1_num_distributive_law__prerequisite_for__m1_calc_expansion | cross_unit | 분배법칙 | prerequisite_for | 전개 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 3 |
| m1_num_four_operations__prerequisite_for__m1_calc_unit | cross_unit | 정수와 유리수의 사칙계산 | prerequisite_for | 식의 계산 | medium | prerequisite_ref;textbook_page_refs | Find textbook sequencing or prior-knowledge evidence for the prerequisite relation. | 2 |
| m1_calc_base__used_in__m1_num_prime_factor_product | cross_unit | 밑 | used_in | 소인수의 곱으로 표현하기 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_exponent__used_in__m1_num_prime_factor_product | cross_unit | 지수 | used_in | 소인수의 곱으로 표현하기 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_power__used_in__m1_num_prime_factor_product | cross_unit | 거듭제곱 | used_in | 소인수의 곱으로 표현하기 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 3 |
| m1_expr_add_sub_linear_expression__used_in__m1_calc_polynomial_add_sub | cross_unit | 일차식의 덧셈과 뺄셈 | used_in | 다항식의 덧셈과 뺄셈 | medium | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 4 |
| m1_expr_like_terms__used_in__m1_calc_polynomial_add_sub | cross_unit | 동류항 | used_in | 다항식의 덧셈과 뺄셈 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_expr_polynomial__used_in__m1_calc_polynomial_add_sub | cross_unit | 다항식 | used_in | 다항식의 덧셈과 뺄셈 | high | procedure_ref;textbook_page_refs | Find a worked example, procedure, or application where this source concept is used. | 2 |
| m1_calc_unit__related_to__m1_eq_unit | cross_unit | 식의 계산 | related_to | 일차방정식 | medium | related_ref;textbook_page_refs | Find textbook wording or examples that justify keeping these concepts linked. | 10 |
| m1_num_domain__related_to__m1_calc_unit | cross_unit | 수와 연산 | related_to | 식의 계산 | medium | related_ref;textbook_page_refs | Find textbook wording or examples that justify keeping these concepts linked. | 8 |
| m1_num_prime_factor_unit__related_to__m1_calc_power | cross_unit | 소인수분해 | related_to | 거듭제곱 | medium | related_ref;textbook_page_refs | Find textbook wording or examples that justify keeping these concepts linked. | 6 |

## Textbook Edge Evidence Fields

- structure_ref
- prerequisite_ref
- representation_ref
- procedure_ref
- contrast_ref
- misconception_ref
- problem_pattern_ref
- related_ref
- textbook_page_refs
- extraction_notes
