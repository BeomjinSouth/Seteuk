# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 6
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차부등식
- priority tier: highest
- workplan score: 405
- concepts: 41
- edges touching unit: 224
- cross-unit edges: 58
- low confidence concepts: 13
- low confidence edges: 63

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 6 |
| procedure | 17 |
| property | 4 |
| representation | 4 |
| sub_concept | 5 |
| term | 2 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 42 |
| contrasts_with | 3 |
| often_confused_with | 22 |
| prerequisite_for | 83 |
| related_to | 4 |
| represented_by | 6 |
| used_in | 64 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_ineq_boundary_value | 부등식 해의 경계값 | sub_concept | official_dual_source | 교과서에서 해를 수직선에 나타낼 때 반복되는 암묵 개념으로 추출했다. 공식 용어 직접 근거는 약하므로 낮은 신뢰도로 둔다. |
| m1_ineq_strict_inclusive_sign_distinction | 초과·미만과 이상·이하 구별 | sub_concept | official_dual_source | 수직선 끝점 표시와 문장 조건 번역에서 반복되는 미시 concept이다. 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_ineq_endpoint_inclusion_representation | 부등식 해의 끝점 포함 표시 | representation | official_dual_source | 교과서 수직선 표현 관례에서 추출한 표현 노드다. 교과서 PDF 확인 전까지 낮은 신뢰도로 둔다. |
| m1_ineq_number_line_solution_representation | 부등식 해의 수직선 표현 | representation | official_dual_source | 공식 문서는 여러 방법으로 풀고 확인하게 한다. 수직선 표시는 교과서 본문 근거가 필요하므로 낮은 신뢰도로 둔다. |
| m1_ineq_rewrite_solution_unknown_left | 미지수를 왼쪽에 두어 해 쓰기 | representation | official_dual_source | 부등호 방향을 읽을 때 학생이 자주 혼동하는 표현 관례다. 교과서 예제 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_ineq_verbal_comparison_terms | 이상·이하·초과·미만 표현 | representation | official_dual_source | 공식 문서의 문제 상황 기반 도입과 활용에서 추론한 표현 노드다. 교과서 용어 설명 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_ineq_inequality_sign | 부등호 | term | official_dual_source | 부등식 표현에서 추론한 기호 노드다. 교과서 본문·용어 설명 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_ineq_context_domain_ignored | 문제 상황의 자연수·정수 조건을 무시하는 오류 | misconception_risk | official_dual_source | 공식 문서의 해가 문제 상황에 적합한지 확인한다는 요구에서 추론한 오개념 위험이다. |
| m1_mis_ineq_endpoint_inclusion | 부등식 해의 끝점 포함 여부를 잘못 표시하는 오류 | misconception_risk | official_dual_source | 수직선 표현에서 추론한 오개념 위험이다. 교과서 예제와 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_ineq_negative | 음수를 곱하거나 나눌 때 부등호 방향을 바꾸지 않는 오류 | misconception_risk | official_dual_source | 공식 성취수준은 낮은 수준에서 양수 곱나눔을 언급한다. 음수 처리 오류는 교과서 본문과 예제로 보강해야 한다. |
| m1_mis_ineq_sign_reversal_overgeneralization | 부등호 방향을 항상 바꾸는 오류 | misconception_risk | official_dual_source | 기존 음수 처리 오류의 반대 방향 오개념으로 추론했다. 교과서나 학생 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_ineq_solution_single_value | 부등식의 해를 한 값으로만 이해하는 오류 | misconception_risk | official_dual_source | 부등식의 해와 방정식의 해를 대조해야 하는 수행에서 추론했다. |
| m1_mis_ineq_strict_inclusive_language | 이상·이하와 초과·미만을 뒤바꾸는 오류 | misconception_risk | official_dual_source | 문장 조건 번역과 수직선 끝점 표시에서 추론한 오개념 위험이다. 교과서 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_number_line__prerequisite_for__m1_ineq_number_line_solution_representation | 수직선 | prerequisite_for | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_number_line_position_order__prerequisite_for__m1_ineq_number_line_solution_representation | 수직선에서 오른쪽에 있는 수가 더 큼 | prerequisite_for | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_ineq_boundary_value | 정수와 유리수의 대소 관계 | prerequisite_for | 부등식 해의 경계값 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_ineq_verbal_comparison_terms | 정수와 유리수의 대소 관계 | prerequisite_for | 이상·이하·초과·미만 표현 | low | official_dual_source |
| m1_num_integer__used_in__m1_ineq_context_domain_restriction | 정수 | used_in | 문제 상황에서 가능한 값의 범위 확인하기 | low | official_dual_source |
| m1_num_natural_number__used_in__m1_ineq_context_domain_restriction | 자연수 | used_in | 문제 상황에서 가능한 값의 범위 확인하기 | low | official_dual_source |
| m1_num_number_line__used_in__m1_ineq_number_line_solution_representation | 수직선 | used_in | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_num_number_line_position_order__used_in__m1_ineq_number_line_solution_representation | 수직선에서 오른쪽에 있는 수가 더 큼 | used_in | 부등식 해의 수직선 표현 | low | official_dual_source |
| m1_mis_ineq_solution_single_value__often_confused_with__m1_eq_solution | 부등식의 해를 한 값으로만 이해하는 오류 | often_confused_with | 해 | low | official_dual_source |
| m1_eq_both_sides__prerequisite_for__m1_ineq_add_sub_same_number_property | 양변 | prerequisite_for | 부등식 양변에 같은 수 더하기·빼기 | medium | official_dual_source |
| m1_eq_both_sides__prerequisite_for__m1_ineq_multiply_divide_negative_reverses_sign | 양변 | prerequisite_for | 부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기 | medium | official_dual_source |
| m1_eq_both_sides__prerequisite_for__m1_ineq_multiply_divide_positive_property | 양변 | prerequisite_for | 부등식 양변에 양수를 곱하거나 나누기 | medium | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_compare_equality_properties | 등식의 성질 | prerequisite_for | 등식의 성질과 부등식의 성질 비교 | high | official_dual_source |
| m1_eq_equality_properties__prerequisite_for__m1_ineq_properties | 등식의 성질 | prerequisite_for | 부등식의 성질 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_ineq_unit | 일차방정식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_ineq_choose_unknown_from_context | 미지수 | prerequisite_for | 문제 상황에서 미지수 정하기 | medium | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_ineq_collect_unknown_terms | 미지수 | prerequisite_for | 부등식에서 미지수항 모으기 | medium | official_dual_source |
| m1_eq_unknown__prerequisite_for__m1_ineq_isolate_unknown | 미지수 | prerequisite_for | 미지수를 한쪽으로 모으기 | medium | official_dual_source |
| m1_expr_add_sub_linear_expression__prerequisite_for__m1_ineq_isolate_unknown | 일차식의 덧셈과 뺄셈 | prerequisite_for | 미지수를 한쪽으로 모으기 | medium | official_dual_source |
| m1_expr_add_sub_linear_expression__prerequisite_for__m1_ineq_simplify_both_sides_linear_terms | 일차식의 덧셈과 뺄셈 | prerequisite_for | 일차부등식 양변의 일차식 정리하기 | medium | official_dual_source |
| m1_expr_add_sub_linear_expression__prerequisite_for__m1_ineq_solving_linear_inequality | 일차식의 덧셈과 뺄셈 | prerequisite_for | 일차부등식 풀기 | high | official_dual_source |
| m1_expr_coefficient__prerequisite_for__m1_ineq_coefficient_sign_before_division | 계수 | prerequisite_for | 계수의 부호 확인 후 나누기 | medium | official_dual_source |
| m1_expr_constant_term__prerequisite_for__m1_ineq_collect_constant_terms | 상수항 | prerequisite_for | 부등식에서 상수항 모으기 | medium | official_dual_source |
| m1_expr_letter_quantity__prerequisite_for__m1_ineq_choose_unknown_from_context | 문자가 나타내는 수량 정하기 | prerequisite_for | 문제 상황에서 미지수 정하기 | medium | official_dual_source |
| m1_expr_like_terms__prerequisite_for__m1_ineq_collect_unknown_terms | 동류항 | prerequisite_for | 부등식에서 미지수항 모으기 | medium | official_dual_source |
| m1_expr_linear_expression__prerequisite_for__m1_ineq_linear_inequality | 일차식 | prerequisite_for | 일차부등식 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_ineq_modeling_linear_inequality | 문자를 사용한 식 | prerequisite_for | 일차부등식 세우기 | high | official_dual_source |
| m1_expr_literal_expression__prerequisite_for__m1_ineq_translate_condition | 문자를 사용한 식 | prerequisite_for | 문제 조건을 부등식으로 옮기기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_judge_solution | 대입 | prerequisite_for | 부등식의 해인지 판단하기 | medium | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_solution | 대입 | prerequisite_for | 부등식의 해 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_solution_check | 대입 | prerequisite_for | 부등식 해의 확인 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_ineq_truth_value_by_substitution | 대입 | prerequisite_for | 대입값에 따른 부등식의 참거짓 | medium | official_dual_source |
| m1_num_addition__prerequisite_for__m1_ineq_add_sub_same_number_property | 덧셈 | prerequisite_for | 부등식 양변에 같은 수 더하기·빼기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_ineq_multiply_divide_negative_reverses_sign | 나눗셈 | prerequisite_for | 부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기 | medium | official_dual_source |
| m1_num_division__prerequisite_for__m1_ineq_multiply_divide_positive_property | 나눗셈 | prerequisite_for | 부등식 양변에 양수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_integer__prerequisite_for__m1_ineq_context_domain_restriction | 정수 | prerequisite_for | 문제 상황에서 가능한 값의 범위 확인하기 | medium | official_dual_source |
| m1_num_multiplication__prerequisite_for__m1_ineq_multiply_divide_negative_reverses_sign | 곱셈 | prerequisite_for | 부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기 | medium | official_dual_source |
| m1_num_multiplication__prerequisite_for__m1_ineq_multiply_divide_positive_property | 곱셈 | prerequisite_for | 부등식 양변에 양수를 곱하거나 나누기 | medium | official_dual_source |
| m1_num_natural_number__prerequisite_for__m1_ineq_context_domain_restriction | 자연수 | prerequisite_for | 문제 상황에서 가능한 값의 범위 확인하기 | medium | official_dual_source |
| m1_num_negative_number__prerequisite_for__m1_ineq_multiply_divide_negative_reverses_sign | 음수 | prerequisite_for | 부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기 | medium | official_dual_source |
