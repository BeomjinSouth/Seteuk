# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 23
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 수와 연산
- unit: 유리수와 순환소수
- priority tier: medium
- workplan score: 68
- concepts: 10
- edges touching unit: 44
- cross-unit edges: 14
- low confidence concepts: 1
- low confidence edges: 9

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 1 |
| misconception_risk | 1 |
| procedure | 2 |
| property | 1 |
| representation | 1 |
| term | 4 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 12 |
| contrasts_with | 1 |
| often_confused_with | 6 |
| prerequisite_for | 17 |
| represented_by | 2 |
| used_in | 6 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_finite_to_repeating_scope | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | misconception_risk | official_single_source | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_infinite_decimal__prerequisite_for__m1_mis_irrational_decimal | 무한소수 | prerequisite_for | 무한소수와 무리수를 같은 말로 보는 오류 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_infinite_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 무한소수 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_rational_repeating_relation | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 유리수와 순환소수의 관계 | low | official_dual_source |
| m1_mis_irrational_decimal__often_confused_with__m1_num_repeating_decimal | 무한소수와 무리수를 같은 말로 보는 오류 | often_confused_with | 순환소수 | low | official_dual_source |
| m1_num_domain__contains__m1_num_repeating_decimal_unit | 수와 연산 | contains | 유리수와 순환소수 | high | official_single_source |
| m1_num_integer_rational_unit__prerequisite_for__m1_num_repeating_decimal_unit | 정수와 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_finite_decimal | 유리수 | prerequisite_for | 유한소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_fraction_decimal_classification | 유리수 | prerequisite_for | 분수가 유한소수 또는 순환소수로 나타나는지 구분하기 | medium | official_single_source |
| m1_num_rational_number__prerequisite_for__m1_num_infinite_decimal | 유리수 | prerequisite_for | 무한소수 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_rational_repeating_relation | 유리수 | prerequisite_for | 유리수와 순환소수의 관계 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_num_repeating_decimal_unit | 유리수 | prerequisite_for | 유리수와 순환소수 | high | official_dual_source |
| m1_num_repeating_decimal_unit__prerequisite_for__m1_num_square_root_real_unit | 유리수와 순환소수 | prerequisite_for | 제곱근과 실수 | medium | official_dual_source |
| m1_num_repeating_decimal_to_fraction__represented_by__m1_num_rational_number | 순환소수를 분수로 나타내기 | represented_by | 유리수 | high | official_dual_source |
| m1_num_rational_number__used_in__m1_num_rational_repeating_relation | 유리수 | used_in | 유리수와 순환소수의 관계 | high | official_dual_source |
