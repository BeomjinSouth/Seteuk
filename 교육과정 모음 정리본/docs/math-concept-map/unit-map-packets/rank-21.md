# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 21
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차부등식
- priority tier: high
- workplan score: 69
- concepts: 11
- edges touching unit: 48
- cross-unit edges: 16
- low confidence concepts: 2
- low confidence edges: 8

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 2 |
| procedure | 4 |
| property | 1 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 12 |
| contrasts_with | 3 |
| often_confused_with | 6 |
| prerequisite_for | 18 |
| related_to | 1 |
| represented_by | 1 |
| used_in | 7 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_ineq_negative | 음수를 곱하거나 나눌 때 부등호 방향을 바꾸지 않는 오류 | misconception_risk | official_dual_source | 공식 성취수준은 낮은 수준에서 양수 곱나눔을 언급한다. 음수 처리 오류는 교과서 본문과 예제로 보강해야 한다. |
| m1_mis_ineq_solution_single_value | 부등식의 해를 한 값으로만 이해하는 오류 | misconception_risk | official_dual_source | 부등식의 해와 방정식의 해를 대조해야 하는 수행에서 추론했다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_ineq_solution_single_value__often_confused_with__m1_eq_solution | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_ineq_solving_linear_inequality | 식의 계산 | prerequisite_for | 일차부등식 풀기 | high | official_dual_source |
| m1_calc_unit__prerequisite_for__m1_ineq_unit | 식의 계산 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_compare_equality_properties | 등식의 성질 | prerequisite_for | 등식의 성질과 부등식의 성질 비교 | high | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_properties | 등식의 성질 | prerequisite_for | 부등식의 성질 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_ineq_unit | 일차방정식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_ineq_linear_inequality | 일차식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_ineq_modeling_linear_inequality | 문자를 사용한 식 | prerequisite_for | 일차부등식 세우기 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_solution | 대입 | prerequisite_for | 부등식의 해 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_solution_check | 대입 | prerequisite_for | 부등식 해의 확인 | high | official_dual_source |
| m1_repr_expression__prerequisite_for__m1_ineq_inequality | 식 | prerequisite_for | 부등식 | high | official_dual_source |
| m1_eq_equality_properties__used_in__m1_ineq_compare_equality_properties | 등식의 성질 | used_in | 등식의 성질과 부등식의 성질 비교 | high | official_dual_source |
| m1_ineq_inequality__contrasts_with__m1_eq_equality | 부등식 | contrasts_with | 등식 | medium | official_dual_source |
| m1_ineq_inequality__contrasts_with__m1_eq_equation | 부등식 | contrasts_with | 방정식 | high | official_dual_source |
| m1_ineq_solution__contrasts_with__m1_eq_solution | 부등식의 해 | contrasts_with | 해 | medium | official_dual_source |
| m1_ineq_unit__related_to__m1_system_unit | 일차부등식 | related_to | 연립일차방정식 | medium | official_dual_source |
