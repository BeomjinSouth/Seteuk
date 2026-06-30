# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 11
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 소인수분해
- priority tier: highest
- workplan score: 127
- concepts: 32
- edges touching unit: 137
- cross-unit edges: 11
- low confidence concepts: 4
- low confidence edges: 16

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 3 |
| procedure | 13 |
| property | 2 |
| representation | 1 |
| sub_concept | 3 |
| term | 9 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 32 |
| contrasts_with | 13 |
| equivalent_to | 1 |
| often_confused_with | 10 |
| prerequisite_for | 48 |
| represented_by | 1 |
| used_in | 32 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_num_prime_factorization_uniqueness | 소인수분해의 유일성 | property | official_dual_source | 중학교 소인수분해 학습에서 자연스럽게 쓰이는 성질이나 공식 문서 직접 용어 근거는 약하므로 교과서 본문 확인 전까지 low로 둔다. |
| m1_mis_gcd_lcm_common_all_prime_factor | 최대공약수와 최소공배수에서 공통 소인수와 모든 소인수를 뒤바꾸는 오류 | misconception_risk | official_dual_source | 공식 성취기준의 원리 설명 요구에서 추론한 오개념 위험이다. 교과서 문제나 오답 예시 근거가 확인될 때까지 low로 둔다. |
| m1_mis_gcd_lcm_scope | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_mis_prime_one | 1을 소수나 합성수로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_domain__contains__m1_num_prime_factor_unit | 수와 연산 | contains | 소인수분해 | high | official_single_source |
| m1_calc_base__prerequisite_for__m1_num_prime_factorization_exponent_notation | 밑 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_exponent__prerequisite_for__m1_num_prime_factorization_exponent_notation | 지수 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factor_product | 거듭제곱 | prerequisite_for | 소인수의 곱으로 표현하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization | 거듭제곱 | prerequisite_for | 소인수분해 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization_exponent_notation | 거듭제곱 | prerequisite_for | 소인수분해 결과를 거듭제곱으로 정리하기 | high | official_dual_source |
| m1_calc_base__used_in__m1_num_prime_factor_product | 밑 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_exponent__used_in__m1_num_prime_factor_product | 지수 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_power__used_in__m1_num_prime_factor_product | 거듭제곱 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_num_prime_factor__contrasts_with__m1_factor_factor | 소인수 | contrasts_with | 인수 | medium | official_dual_source |
| m1_num_positive_integer__equivalent_to__m1_num_natural_number | 양의 정수 | equivalent_to | 자연수 | medium | official_dual_source |
