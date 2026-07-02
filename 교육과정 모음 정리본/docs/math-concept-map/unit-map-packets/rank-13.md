# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 13
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 유리수와 순환소수
- priority tier: highest
- workplan score: 150
- concepts: 25
- edges touching unit: 114
- cross-unit edges: 25
- low confidence concepts: 5
- low confidence edges: 18

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 5 |
| procedure | 8 |
| property | 4 |
| representation | 2 |
| term | 5 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 27 |
| contrasts_with | 5 |
| often_confused_with | 13 |
| prerequisite_for | 40 |
| related_to | 3 |
| represented_by | 5 |
| used_in | 21 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_denominator_condition_2_5 | 분모의 소인수 2와 5 조건을 반대로 적용하는 오류 | misconception_risk | official_single_source | 분모 조건의 대조 관계에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_finite_to_repeating_scope | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_mis_fraction_decimal_denominator_not_reduced | 기약분수로 고치지 않고 분모 조건을 판단하는 오류 | misconception_risk | official_single_source | 성취수준의 분수 특징 판별에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_repeating_decimal_shift_digits | 순환마디 자리수를 맞추지 않고 식을 빼는 오류 | misconception_risk | official_dual_source | 순환소수를 분수로 고치는 절차에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_repetend_dot_notation_scope | 순환마디 점 표시 범위를 잘못 잡는 오류 | misconception_risk | official_dual_source | 순환마디와 점 표기에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_irrational_decimal__often_confused_with__m1_num_infinite_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 무한소수 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_repeating_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 순환소수 | low | official_dual_source |
| m1_num_domain__contains__m1_num_repeating_decimal_unit | 수와 연산 | contains | 유리수와 순환소수 | high | official_single_source |
| m1_calc_power__prerequisite_for__m1_num_denominator_power_of_ten_conversion | 거듭제곱 | prerequisite_for | 분모를 10의 거듭제곱으로 만들기 | medium | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_repeating_decimal_equation_conversion | 거듭제곱 | prerequisite_for | 식을 세워 순환소수를 분수로 나타내기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_num_fraction_to_decimal_division | 나눗셈 | prerequisite_for | 분수를 소수로 나타내기 | medium | official_dual_source |
| m1_num_gcd__prerequisite_for__m1_num_irreducible_fraction | 최대공약수 | prerequisite_for | 기약분수 | medium | official_dual_source |
| m1_num_gcd__prerequisite_for__m1_num_reduce_fraction_lowest_terms | 최대공약수 | prerequisite_for | 분수를 기약분수로 고치기 | medium | official_dual_source |
| m1_num_integer_rational_unit__prerequisite_for__m1_num_repeating_decimal_unit | 정수와 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_prime_factorization__prerequisite_for__m1_num_repeating_decimal_denominator_condition | 소인수분해 | prerequisite_for | 순환소수가 되는 분모 조건 | medium | official_dual_source |
| m1_num_prime_factorization__prerequisite_for__m1_num_terminating_decimal_denominator_condition | 소인수분해 | prerequisite_for | 유한소수가 되는 분모 조건 | medium | official_dual_source |
| m1_num_rational_fraction_form__prerequisite_for__m1_num_finite_decimal_to_fraction | 유리수의 분수 꼴 표현 | prerequisite_for | 유한소수를 분수로 나타내기 | medium | official_dual_source |
| m1_num_rational_fraction_form__prerequisite_for__m1_num_fraction_to_decimal_division | 유리수의 분수 꼴 표현 | prerequisite_for | 분수를 소수로 나타내기 | medium | official_dual_source |
| m1_num_rational_fraction_form__prerequisite_for__m1_num_irreducible_fraction | 유리수의 분수 꼴 표현 | prerequisite_for | 기약분수 | medium | official_dual_source |
| m1_num_rational_fraction_form__prerequisite_for__m1_num_reduce_fraction_lowest_terms | 유리수의 분수 꼴 표현 | prerequisite_for | 분수를 기약분수로 고치기 | medium | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_fraction_decimal_classification | 유리수 | prerequisite_for | 분수가 유한소수 또는 순환소수로 나타나는지 구분하기 | medium | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_num_rational_repeating_relation | 유리수 | prerequisite_for | 유리수와 순환소수의 관계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_repeating_decimal_unit | 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_finite_decimal_to_fraction__represented_by__m1_num_rational_fraction_form | 유한소수를 분수로 나타내기 | represented_by | 유리수의 분수 꼴 표현 | medium | official_dual_source |
| m1_num_repeating_decimal__represented_by__m1_num_rational_fraction_form | 순환소수 | represented_by | 유리수의 분수 꼴 표현 | medium | official_dual_source |
| m1_num_rational_fraction_form__used_in__m1_num_rational_repeating_relation | 유리수의 분수 꼴 표현 | used_in | 유리수와 순환소수의 관계 | medium | official_dual_source |
| m1_num_rational_repeating_relation__used_in__m1_num_rational_irrational_classification | 유리수와 순환소수의 관계 | used_in | 유리수와 무리수의 구분 | medium | official_dual_source |
| m1_num_repeating_decimal__contrasts_with__m1_num_irrational_number | 순환소수 | contrasts_with | 무리수 | medium | official_dual_source |
| m1_num_irreducible_fraction__related_to__m1_num_coprime | 기약분수 | related_to | 서로소 | medium | official_dual_source |
| m1_num_repeating_decimal_unit__related_to__m1_num_square_root_real_unit | 유리수와 순환소수 | related_to | 제곱근과 실수 | medium | official_dual_source |
