# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 13
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 소인수분해
- priority tier: high
- workplan score: 81
- concepts: 15
- edges touching unit: 64
- cross-unit edges: 10
- low confidence concepts: 2
- low confidence edges: 11

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 2 |
| procedure | 2 |
| representation | 1 |
| sub_concept | 2 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 15 |
| contrasts_with | 7 |
| equivalent_to | 1 |
| often_confused_with | 6 |
| prerequisite_for | 20 |
| related_to | 1 |
| represented_by | 1 |
| used_in | 13 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_gcd_lcm_scope | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_mis_prime_one | 1을 소수나 합성수로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_domain__contains__m1_num_prime_factor_unit | 수와 연산 | contains | 소인수분해 | high | official_single_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factor_product | 거듭제곱 | prerequisite_for | 소인수의 곱으로 표현하기 | high | official_dual_source |
| m1_calc_power__prerequisite_for__m1_num_prime_factorization | 거듭제곱 | prerequisite_for | 소인수분해 | high | official_dual_source |
| m1_num_prime_factor_unit__prerequisite_for__m1_num_integer_rational_unit | 소인수분해 | prerequisite_for | 정수와 유리수 | medium | official_single_source |
| m1_calc_base__used_in__m1_num_prime_factor_product | 밑 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_exponent__used_in__m1_num_prime_factor_product | 지수 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_calc_power__used_in__m1_num_prime_factor_product | 거듭제곱 | used_in | 소인수의 곱으로 표현하기 | medium | official_dual_source |
| m1_num_prime_factor__contrasts_with__m1_factor_factor | 소인수 | contrasts_with | 인수 | medium | official_dual_source |
| m1_num_positive_integer__equivalent_to__m1_num_natural_number | 양의 정수 | equivalent_to | 자연수 | medium | official_dual_source |
| m1_num_prime_factor_unit__related_to__m1_calc_power | 소인수분해 | related_to | 거듭제곱 | medium | official_dual_source |
