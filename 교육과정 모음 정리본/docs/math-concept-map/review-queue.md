# 검토 큐

이 문서는 `concepts.json`에서 `confidence: low`인 concept을 모아 다음 출처 보강 때 먼저 확인할 대상을 정리한다.

- 검토 대상 concept: 145개

## 영역별 검토 대상

| 영역 | concept 수 |
|---|---:|
| 수와 연산 | 18 |
| 변화와 관계 | 58 |
| 도형과 측정 | 32 |
| 자료와 가능성 | 37 |

## 유형별 검토 대상

| concept_type | concept 수 |
|---|---:|
| misconception_risk | 102 |
| procedure | 4 |
| property | 11 |
| representation | 7 |
| sub_concept | 9 |
| term | 12 |

## 검토 항목

| concept_id | 영역 | 단원 | 유형 | 우선순위 | label_ko | notes |
|---|---|---|---|---|---|---|
| m1_num_ratio | 수와 연산 | 공통 선수개념 | term | source_detail_needed | 비 | 단독 용어로서의 직접 출처는 아직 약하지만 정비례·반비례, 닮음비, 평행선 사이의 선분 길이의 비, 삼각비, 상대도수와 확률의 비율 표현에서 반복되는 공통 선수개념으로 분리했다. 연구보고서 p. 61, p. 172, p. 180, p. 181, p. 184는 비와 비율의 선수·평가 맥락을 보조하지만, 교과서 본문 또는 중학교 과정의 직접 근거 확인 전까지 낮은 신뢰도로 유지한다. |
| m1_mis_gcd_lcm_common_all_prime_factor | 수와 연산 | 소인수분해 | misconception_risk | textbook_evidence_needed | 최대공약수와 최소공배수에서 공통 소인수와 모든 소인수를 뒤바꾸는 오류 | 공식 성취기준의 원리 설명 요구에서 추론한 오개념 위험이다. 교과서 문제나 오답 예시 근거가 확인될 때까지 low로 둔다. |
| m1_mis_gcd_lcm_scope | 수와 연산 | 소인수분해 | misconception_risk | textbook_evidence_needed | 최대공약수·최소공배수 활용 문제를 범위로 오인하는 오류 | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_mis_prime_one | 수와 연산 | 소인수분해 | misconception_risk | textbook_evidence_needed | 1을 소수나 합성수로 보는 오류 |  |
| m1_num_prime_factorization_uniqueness | 수와 연산 | 소인수분해 | property | source_detail_needed | 소인수분해의 유일성 | 중학교 소인수분해 학습에서 자연스럽게 쓰이는 성질이나 공식 문서 직접 용어 근거는 약하므로 교과서 본문 확인 전까지 low로 둔다. |
| m1_mis_denominator_condition_2_5 | 수와 연산 | 유리수와 순환소수 | misconception_risk | textbook_evidence_needed | 분모의 소인수 2와 5 조건을 반대로 적용하는 오류 | 분모 조건의 대조 관계에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_finite_to_repeating_scope | 수와 연산 | 유리수와 순환소수 | misconception_risk | textbook_evidence_needed | 유한소수를 순환소수로 나타내는 활동을 범위로 오인하는 오류 | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_mis_fraction_decimal_denominator_not_reduced | 수와 연산 | 유리수와 순환소수 | misconception_risk | textbook_evidence_needed | 기약분수로 고치지 않고 분모 조건을 판단하는 오류 | 성취수준의 분수 특징 판별에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_repeating_decimal_shift_digits | 수와 연산 | 유리수와 순환소수 | misconception_risk | textbook_evidence_needed | 순환마디 자리수를 맞추지 않고 식을 빼는 오류 | 순환소수를 분수로 고치는 절차에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_repetend_dot_notation_scope | 수와 연산 | 유리수와 순환소수 | misconception_risk | textbook_evidence_needed | 순환마디 점 표시 범위를 잘못 잡는 오류 | 순환마디와 점 표기에서 추론한 오개념 위험이다. 교과서 예제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_absolute_value_positive | 수와 연산 | 정수와 유리수 | misconception_risk | textbook_evidence_needed | 절댓값을 항상 양수로만 말하는 오류 |  |
| m1_mis_negative_order | 수와 연산 | 정수와 유리수 | misconception_risk | textbook_evidence_needed | 음수의 대소를 절댓값 크기로 판단하는 오류 |  |
| m1_mis_sign_operation | 수와 연산 | 정수와 유리수 | misconception_risk | textbook_evidence_needed | 부호와 연산 기호를 혼동하는 오류 |  |
| m1_num_subtraction_as_add_opposite | 수와 연산 | 정수와 유리수 | procedure | source_detail_needed | 뺄셈을 반대 부호의 덧셈으로 바꾸기 | 공식 성취기준의 사칙계산 원리에서 추론한 대표 절차이며, 교과서 본문 표현과 예제 근거를 확인하기 전까지 낮은 신뢰도로 둔다. |
| m1_num_opposite_numbers | 수와 연산 | 정수와 유리수 | property | source_detail_needed | 절댓값이 같고 부호가 다른 두 수 | 공식 문서의 절댓값·부호·대소 관계에서 추론한 교과서 확인 필요 미시 concept이다. 교과서 본문 표현을 확인하기 전까지 낮은 신뢰도로 둔다. |
| m1_mis_irrational_decimal | 수와 연산 | 제곱근과 실수 | misconception_risk | textbook_evidence_needed | 무한소수와 무리수를 같은 말로 보는 오류 |  |
| m1_mis_radical_like_terms | 수와 연산 | 제곱근과 실수 | misconception_risk | textbook_evidence_needed | 근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류 |  |
| m1_mis_radical_principal_root | 수와 연산 | 제곱근과 실수 | misconception_risk | textbook_evidence_needed | 근호가 나타내는 제곱근의 부호를 혼동하는 오류 |  |
| m1_mis_expansion_factorization_direction | 변화와 관계 | 다항식의 곱셈과 인수분해 | misconception_risk | textbook_evidence_needed | 전개와 인수분해 방향을 혼동하는 오류 |  |
| m1_mis_factor_common_factor_missing | 변화와 관계 | 다항식의 곱셈과 인수분해 | misconception_risk | textbook_evidence_needed | 공통인수를 빠뜨리는 오류 | 공식 문서의 공식 범위에서 추론한 오개념 위험이다. 교과서 예제와 문항 근거 확인이 필요하다. |
| m1_mis_factor_formula_pattern | 변화와 관계 | 다항식의 곱셈과 인수분해 | misconception_risk | textbook_evidence_needed | 곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류 | 공식 문서의 공식 범위와 성취수준의 과정 설명 요구에서 추론한 오개념 위험이다. |
| m1_mis_factorization_unchecked_result | 변화와 관계 | 다항식의 곱셈과 인수분해 | misconception_risk | textbook_evidence_needed | 인수분해 결과를 확인하지 않는 오류 | 전개와 인수분해의 역관계에서 추론한 오개념 위험이다. 실제 교과서 예제와 문항 근거 확인이 필요하다. |
| m1_mis_perfect_square_sign | 변화와 관계 | 다항식의 곱셈과 인수분해 | misconception_risk | textbook_evidence_needed | 완전제곱식의 가운데 항 부호를 혼동하는 오류 |  |
| m1_mis_coefficient_constant_degree | 변화와 관계 | 문자의 사용과 식 | misconception_risk | textbook_evidence_needed | 계수·상수항·차수 혼동 | 용어 목록과 일차식 계산 성취수준을 바탕으로 둔 잠정 오개념 노드이다. |
| m1_mis_letter_as_label_only | 변화와 관계 | 문자의 사용과 식 | misconception_risk | textbook_evidence_needed | 문자를 이름표로만 해석하는 오류 | 공식 문서의 문자와 일상 언어 비교 지도 유의점에서 추론한 위험이다. 교과서 도입 활동으로 보강 필요. |
| m1_mis_like_terms | 변화와 관계 | 문자의 사용과 식 | misconception_risk | textbook_evidence_needed | 동류항이 아닌 항을 합치는 오류 | 성취수준의 일차식 계산 수행에서 발생할 수 있는 위험으로 추론했다. 교과서 예제와 오답 분석으로 보강 필요. |
| m1_mis_exponent_base | 변화와 관계 | 식의 계산 | misconception_risk | textbook_evidence_needed | 밑이 다른 거듭제곱에 지수법칙을 잘못 적용하는 오류 | 성취수준에 '밑이 같은' 거듭제곱 계산이 드러나므로 잠정 오개념으로 기록했다. |
| m1_mis_polynomial_division_scope | 변화와 관계 | 식의 계산 | misconception_risk | textbook_evidence_needed | 다항식을 단항식으로 나누는 범위 혼동 | 교육과정 해설의 제한 사항을 개념 지도에서 보존하기 위한 노드이다. |
| m1_mis_polynomial_like_terms | 변화와 관계 | 식의 계산 | misconception_risk | textbook_evidence_needed | 다항식에서 동류항 처리를 누락하는 오류 |  |
| m1_mis_polynomial_subtraction_sign | 변화와 관계 | 식의 계산 | misconception_risk | textbook_evidence_needed | 다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류 | 성취기준/성취수준의 요구 조건에서 추론한 오개념 후보이다. 교과서 주의 문구, 오답 예, 반복 문제 패턴 확인 전까지 low로 유지한다. |
| m1_mis_system_elimination_sign | 변화와 관계 | 연립일차방정식 | misconception_risk | textbook_evidence_needed | 가감법에서 부호와 계수 처리를 잘못하는 오류 | 소거·가감법 용어에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_system_one_equation_only | 변화와 관계 | 연립일차방정식 | misconception_risk | textbook_evidence_needed | 연립방정식의 해를 한 방정식만 만족해도 된다고 보는 오류 | 공식 문서는 해 맥락만 제공하므로 교과서 예제·오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_system_ordered_pair_swap | 변화와 관계 | 연립일차방정식 | misconception_risk | textbook_evidence_needed | 해의 순서쌍에서 두 미지수 값을 바꾸는 오류 | 미지수가 2개인 해를 순서쌍으로 표현할 때 생길 수 있는 위험으로 추론했다. 교과서 표기와 오답 근거가 필요하다. |
| m1_mis_system_substitution | 변화와 관계 | 연립일차방정식 | misconception_risk | textbook_evidence_needed | 대입법에서 식 전체를 대입하지 않는 오류 | 대입법 용어에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_quadratic_expression_equation | 변화와 관계 | 이차방정식 | misconception_risk | textbook_evidence_needed | 이차식과 이차방정식을 혼동하는 오류 |  |
| m1_mis_quadratic_factorization_solution | 변화와 관계 | 이차방정식 | misconception_risk | textbook_evidence_needed | 인수분해한 식에서 해 조건을 빠뜨리는 오류 |  |
| m1_mis_root_coefficient_relation_scope | 변화와 관계 | 이차방정식 | misconception_risk | textbook_evidence_needed | 근과 계수와의 관계를 중학교 범위로 오인하는 오류 | 공식 문서의 제외 범위를 학습 범위 관리용 오개념 위험으로 기록했다. |
| m1_quad_eq_root_formula_substitution | 변화와 관계 | 이차방정식 | procedure | source_detail_needed | 근의 공식에 계수 대입하기 | 근의 공식 용어와 이차방정식 풀이 맥락을 바탕으로 둔 미시 절차이며, 교과서 예제 근거 확보 전까지 낮은 신뢰도로 둔다. |
| m1_quad_eq_zero_product_condition | 변화와 관계 | 이차방정식 | property | source_detail_needed | 각 인수가 0이 되는 조건 | 공식 문서에는 풀이 방법의 세부 문구가 직접 제시되지 않아, 인수분해 풀이와 오개념 위험에서 추론한 미시 조건으로 낮은 신뢰도로 둔다. |
| m1_mis_axis_vertex | 변화와 관계 | 이차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 포물선의 축과 꼭짓점을 혼동하는 오류 |  |
| m1_mis_max_min_scope | 변화와 관계 | 이차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 최댓값·최솟값의 범위를 임의로 확장하는 오류 |  |
| m1_mis_quadratic_function_equation | 변화와 관계 | 이차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 이차함수와 이차방정식을 혼동하는 오류 |  |
| m1_mis_expression_equation | 변화와 관계 | 일차방정식 | misconception_risk | textbook_evidence_needed | 식과 방정식 혼동 | 성취수준의 방정식·항등식·다항식 구별 요구에서 추론한 오개념 위험이다. |
| m1_mis_solution_check | 변화와 관계 | 일차방정식 | misconception_risk | textbook_evidence_needed | 구한 해의 상황 적합성 확인 누락 |  |
| m1_mis_transposition_sign | 변화와 관계 | 일차방정식 | misconception_risk | textbook_evidence_needed | 이항할 때 부호를 잘못 바꾸는 오류 | 이항 용어와 방정식 풀이 성취수준에서 추론했다. 실제 빈도는 교과서 문제와 학생 오답 자료 확인 필요. |
| m1_mis_ineq_endpoint_inclusion | 변화와 관계 | 일차부등식 | misconception_risk | textbook_evidence_needed | 부등식 해의 끝점 포함 여부를 잘못 표시하는 오류 | 수직선 표현에서 추론한 오개념 위험이다. 교과서 예제와 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_ineq_negative | 변화와 관계 | 일차부등식 | misconception_risk | textbook_evidence_needed | 음수를 곱하거나 나눌 때 부등호 방향을 바꾸지 않는 오류 | 공식 성취수준은 낮은 수준에서 양수 곱나눔을 언급한다. 음수 처리 오류는 교과서 본문과 예제로 보강해야 한다. |
| m1_mis_ineq_sign_reversal_overgeneralization | 변화와 관계 | 일차부등식 | misconception_risk | textbook_evidence_needed | 부등호 방향을 항상 바꾸는 오류 | 기존 음수 처리 오류의 반대 방향 오개념으로 추론했다. 교과서나 학생 오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_ineq_solution_single_value | 변화와 관계 | 일차부등식 | misconception_risk | textbook_evidence_needed | 부등식의 해를 한 값으로만 이해하는 오류 | 부등식의 해와 방정식의 해를 대조해야 하는 수행에서 추론했다. |
| m1_ineq_endpoint_inclusion_representation | 변화와 관계 | 일차부등식 | representation | source_detail_needed | 부등식 해의 끝점 포함 표시 | 교과서 수직선 표현 관례에서 추출한 표현 노드다. 교과서 PDF 확인 전까지 낮은 신뢰도로 둔다. |
| m1_ineq_number_line_solution_representation | 변화와 관계 | 일차부등식 | representation | source_detail_needed | 부등식 해의 수직선 표현 | 공식 문서는 여러 방법으로 풀고 확인하게 한다. 수직선 표시는 교과서 본문 근거가 필요하므로 낮은 신뢰도로 둔다. |
| m1_ineq_boundary_value | 변화와 관계 | 일차부등식 | sub_concept | source_detail_needed | 부등식 해의 경계값 | 교과서에서 해를 수직선에 나타낼 때 반복되는 암묵 개념으로 추출했다. 공식 용어 직접 근거는 약하므로 낮은 신뢰도로 둔다. |
| m1_ineq_inequality_sign | 변화와 관계 | 일차부등식 | term | source_detail_needed | 부등호 | 부등식 표현에서 추론한 기호 노드다. 교과서 본문·용어 설명 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_all_relations_are_functions | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 모든 두 양의 관계를 함수로 보는 오류 |  |
| m1_mis_function_linear_function | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 함수와 일차함수 혼동 |  |
| m1_mis_function_value_input_output | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 함숫값과 입력값 혼동 |  |
| m1_mis_multiple_outputs_same_input | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 하나의 입력에 여러 출력이 대응하는 경우를 함수로 보는 오류 | 공식 문서의 '하나씩 정해지는 대응 관계'와 함수 판단 성취수준에서 추론한 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_slope_intercept | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 기울기와 절편 혼동 |  |
| m1_mis_slope_sign | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | 기울기 부호와 그래프 방향 혼동 |  |
| m1_mis_x_y_intercept | 변화와 관계 | 일차함수와 그 그래프 | misconception_risk | textbook_evidence_needed | x절편과 y절편 혼동 |  |
| m1_func_slope_ratio_formula | 변화와 관계 | 일차함수와 그 그래프 | representation | source_detail_needed | 기울기 계산식 | 성취수준 문서의 기울기 부호 판단과 그래프의 식 구하기 맥락에서 추출한 미시 표현이다. 증가량의 비 표현은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_input_value | 변화와 관계 | 일차함수와 그 그래프 | term | source_detail_needed | 입력값 | 공식 문서에는 함숫값을 구하는 수행이 확인되지만 '입력값' 용어 자체는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_x_increment | 변화와 관계 | 일차함수와 그 그래프 | term | source_detail_needed | x의 증가량 | 성취수준 문서에는 기울기 부호와 그래프의 식 구하기가 확인된다. x의 증가량이라는 세부 계산 용어는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_y_increment | 변화와 관계 | 일차함수와 그 그래프 | term | source_detail_needed | y의 증가량 | 성취수준 문서에는 기울기 부호와 그래프의 식 구하기가 확인된다. y의 증가량이라는 세부 계산 용어는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_intersection_count_solution_count | 변화와 관계 | 일차함수와 일차방정식의 관계 | misconception_risk | textbook_evidence_needed | 교점의 개수와 해의 개수를 따로 보는 오류 | 성취수준의 교점과 해의 관계 설명에서 추론한 오개념 위험이다. 세부 사례별 오류는 교과서 예제 확인 후 분리한다. |
| m1_mis_intersection_solution | 변화와 관계 | 일차함수와 일차방정식의 관계 | misconception_risk | textbook_evidence_needed | 그래프의 교점과 연립방정식의 해를 분리해서 보는 오류 |  |
| m1_mis_single_equation_graph_as_system_solution | 변화와 관계 | 일차함수와 일차방정식의 관계 | misconception_risk | textbook_evidence_needed | 한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류 | 한 식의 해 전체와 연립된 두 식의 공통 해를 구별해야 하는 관계 단원에서 추론한 오개념 위험이다. |
| m1_mis_axis_quadrant | 변화와 관계 | 좌표평면과 그래프 | misconception_risk | textbook_evidence_needed | 축 위의 점을 사분면에 포함하는 오류 | 공식 문서에서 좌표축과 사분면 용어는 확인되지만, 오류 자체는 교과서·문항 근거 확인 전 잠정 노드이다. |
| m1_mis_direct_inverse_generalization | 변화와 관계 | 좌표평면과 그래프 | misconception_risk | textbook_evidence_needed | 증가·감소만으로 정비례·반비례 판단 | 공식 문서의 정비례·반비례 관계 판단 요구와 변화 상태 해석 요구를 함께 본 추론이다. |
| m1_mis_graph_picture | 변화와 관계 | 좌표평면과 그래프 | misconception_risk | textbook_evidence_needed | 그래프를 상황 그림으로만 보는 오류 | 그래프가 나타내는 상황을 설명하게 한다는 공식 문서 근거에서 추론한 오개념 위험이다. |
| m1_mis_order_swap | 변화와 관계 | 좌표평면과 그래프 | misconception_risk | textbook_evidence_needed | 순서쌍의 순서 혼동 | 성취수준 문서의 '주어진 좌표를 점으로 나타내기' 수행에서 드러날 수 있는 위험으로 추론했다. 교과서 오개념 코너 확인 필요. |
| m1_mis_representation_conversion | 변화와 관계 | 좌표평면과 그래프 | misconception_risk | textbook_evidence_needed | 표·식·그래프 변환 오류 | 상호 변환 활동과 표·식·그래프 성취수준에서 추론한 위험이다. 교과서 예제와 문항으로 보강 필요. |
| m1_coord_quadrant_signs | 변화와 관계 | 좌표평면과 그래프 | property | source_detail_needed | 사분면별 좌표 부호 | 공식 문서에는 사분면, x좌표, y좌표, 양수, 음수 용어가 확인된다. 각 사분면의 부호 패턴은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_coord_axis_point | 변화와 관계 | 좌표평면과 그래프 | sub_concept | source_detail_needed | 축 위의 점 | 공식 문서에는 좌표축과 좌표평면 위의 점이 확인된다. '축 위의 점' 명명과 세부 처리는 교과서 본문 확인이 필요하다. |
| m1_coord_x_axis_point | 변화와 관계 | 좌표평면과 그래프 | sub_concept | source_detail_needed | x축 위의 점 | 공식 문서에는 x축, 좌표, 좌표평면 위의 점이 확인된다. y좌표가 0인 점이라는 세부 조건은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_coord_y_axis_point | 변화와 관계 | 좌표평면과 그래프 | sub_concept | source_detail_needed | y축 위의 점 | 공식 문서에는 y축, 좌표, 좌표평면 위의 점이 확인된다. x좌표가 0인 점이라는 세부 조건은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_corresponding_alternate_angles | 도형과 측정 | 기본 도형 | misconception_risk | textbook_evidence_needed | 동위각과 엇각의 위치를 혼동하는 오류 | 성취수준의 각 찾기와 크기 구하기 수행에서 추론한 위험이다. 교과서 오개념 코너 확인 필요. |
| m1_mis_skew_parallel_lines | 도형과 측정 | 기본 도형 | misconception_risk | textbook_evidence_needed | 꼬인 위치와 평행을 같은 관계로 보는 오류 |  |
| m1_geo_coplanar_condition | 도형과 측정 | 기본 도형 | property | source_detail_needed | 한 평면 위에 있음 | 평행선과 꼬인 위치의 구별에 쓰이는 조건이지만 공식 독립 용어로 확인되지는 않아 낮은 신뢰도로 둔다. |
| m1_geo_line_segment | 도형과 측정 | 기본 도형 | term | source_detail_needed | 선분 | 공식 용어표의 직접 열거가 아니라 중점, 수직이등분선, 두 점 사이의 거리 설명에서 필요한 하위 용어로 분리했다. 교과서 본문 근거가 필요하다. |
| m1_geo_ray | 도형과 측정 | 기본 도형 | term | source_detail_needed | 반직선 | 각의 정의에 필요한 하위 용어지만 공식 용어표 직접 근거는 아직 확인되지 않아 낮은 신뢰도로 둔다. |
| m1_mis_congruence_similarity | 도형과 측정 | 도형의 닮음 | misconception_risk | textbook_evidence_needed | 합동과 닮음을 같은 관계로 보는 오류 |  |
| m1_mis_similarity_ratio_noncorresponding_sides | 도형과 측정 | 도형의 닮음 | misconception_risk | textbook_evidence_needed | 대응하지 않는 변끼리 닮음비를 세우는 오류 | 도형의 대응과 닮음비 계산에서 추론한 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_similarity_ratio_reversal | 도형과 측정 | 도형의 닮음 | misconception_risk | textbook_evidence_needed | 닮음비의 순서를 거꾸로 놓는 오류 | 교과서의 반복 문제 또는 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |
| m1_geo_similarity_ratio_order | 도형과 측정 | 도형의 닮음 | sub_concept | source_detail_needed | 닮음비의 순서 | 공식 성취기준의 닮음비 구하기에서 추론한 세부 주의점이다. 교과서 예제 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_trig_angle_scope | 도형과 측정 | 삼각비 | misconception_risk | textbook_evidence_needed | 삼각비 각의 범위를 0도~90도 밖으로 확장하는 오류 | 교육과정 유의사항에 근거한 범위 관리 노드다. 교과서 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_trig_opposite_adjacent_swap | 도형과 측정 | 삼각비 | misconception_risk | textbook_evidence_needed | 기준각에 따라 대변과 이웃변을 바꾸는 오류 | 삼각비 정의와 값 구하기 절차에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_trig_relation_scope | 도형과 측정 | 삼각비 | misconception_risk | textbook_evidence_needed | 삼각비 사이의 관계를 교육과정 범위로 오해하는 오류 | 교육과정 유의사항은 삼각비 사이의 관계는 다루지 않는다고 명시한다. 교과서 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_circumcenter_incenter | 도형과 측정 | 삼각형과 사각형의 성질 | misconception_risk | textbook_evidence_needed | 외심과 내심을 혼동하는 오류 | 공식 문서의 외심·내심 대비에서 설정한 오개념 위험 노드다. 교과서 문제나 학생 답안 근거로 보강해야 한다. |
| m1_mis_isosceles_base_vertex_angle_confusion | 도형과 측정 | 삼각형과 사각형의 성질 | misconception_risk | textbook_evidence_needed | 이등변삼각형의 밑각과 꼭지각을 혼동하는 오류 | 교과서 그림, 예제, 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |
| m1_mis_proof_observation | 도형과 측정 | 삼각형과 사각형의 성질 | misconception_risk | textbook_evidence_needed | 관찰 결과와 증명을 같은 수준의 근거로 보는 오류 | 교과서 예제, 학생 답안, 문제 해설에서 반복되는 오류 근거가 들어오면 세부 유형으로 나눈다. |
| m1_mis_quadrilateral_inclusion_relation | 도형과 측정 | 삼각형과 사각형의 성질 | misconception_risk | textbook_evidence_needed | 사각형 포함 관계를 반대로 이해하는 오류 | 교과서 분류 문제와 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |
| m1_mis_circle_proportion_scope | 도형과 측정 | 원의 성질 | misconception_risk | textbook_evidence_needed | 원과 비례에 관한 성질을 범위에 포함하는 오류 | 교육과정 유의사항에 근거한 범위 관리 노드다. 교과서 또는 학생 오답 근거 확인 전까지 선수 관계 없이 오개념 위험으로만 둔다. |
| m1_mis_inscribed_central_angle_equal | 도형과 측정 | 원의 성질 | misconception_risk | textbook_evidence_needed | 원주각과 중심각을 같은 크기로 보는 오류 | 원주각 성질에서 추론한 오개념 위험이다. 교과서 예제나 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_same_chord_arc_scope | 도형과 측정 | 원의 성질 | misconception_risk | textbook_evidence_needed | 같은 현과 같은 호의 조건을 넓게 적용하는 오류 | 공식 성취수준의 성질 적용 맥락에서 추론한 위험이다. 교과서 예제와 오답 근거로 보강한다. |
| m1_mis_tangent_radius | 도형과 측정 | 원의 성질 | misconception_risk | textbook_evidence_needed | 접선과 반지름의 수직 관계를 놓치는 오류 | 교과서 예제나 오답 근거 확인 전까지 선수 관계 없이 오개념 위험으로만 둔다. |
| m1_geo_circle_auxiliary_radius_center | 도형과 측정 | 원의 성질 | procedure | source_detail_needed | 원의 중심과 반지름 보조선 활용 | 보조선 활용은 공식 문서의 정당화 요구에서 추론한 절차다. 교과서 증명 맥락 확인 전까지 낮은 신뢰도로 둔다. |
| m1_geo_semicircle_arc | 도형과 측정 | 원의 성질 | term | source_detail_needed | 반원 | 반원 표현은 원주각 성질의 대표 적용 맥락으로 추출한 잠정 용어다. 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_complex_area_volume_scope | 도형과 측정 | 입체도형의 성질 | misconception_risk | textbook_evidence_needed | 지나치게 복잡한 넓이·부피 변형 문제 범위 혼동 | 교수·학습 및 평가 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_solid_net_adjacency | 도형과 측정 | 입체도형의 성질 | misconception_risk | textbook_evidence_needed | 전개도에서 붙는 면의 이웃 관계를 잘못 판단하는 오류 | 전개도 가능/불가능 구별 맥락에서 추론한 오개념 위험이다. 교과서 예제·문제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_surface_area_volume | 도형과 측정 | 입체도형의 성질 | misconception_risk | textbook_evidence_needed | 겉넓이와 부피를 같은 측정량으로 보는 오류 |  |
| m1_geo_orthographic_drawing | 도형과 측정 | 입체도형의 성질 | representation | source_detail_needed | 겨냥도 | 현재는 연구보고서 p.173의 보조 성취수준 맥락만 확인된다. 중학교 교과서 본문 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_congruence_correspondence_order | 도형과 측정 | 작도와 합동 | misconception_risk | textbook_evidence_needed | 합동 판별에서 대응 순서를 무시하는 오류 | 공식 성취기준에서 직접 명명되지 않은 합동 판별 오개념이다. 교과서 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_construction_measurement_tools | 도형과 측정 | 작도와 합동 | misconception_risk | textbook_evidence_needed | 눈금자나 각도기로 재서 작도하는 오류 | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_sas_nonincluded_angle | 도형과 측정 | 작도와 합동 | misconception_risk | textbook_evidence_needed | 끼인각이 아닌 각을 SAS 조건에 쓰는 오류 | 공식 성취기준에서 직접 명명되지 않은 합동 조건 판별 오개념이다. 교과서 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_arc_chord | 도형과 측정 | 평면도형의 성질 | misconception_risk | textbook_evidence_needed | 호와 현을 같은 대상으로 보는 오류 | 공식 용어 분리와 호 관계 성취수준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_polygon_interior_exterior_angle | 도형과 측정 | 평면도형의 성질 | misconception_risk | textbook_evidence_needed | 내각과 외각을 같은 각으로 보는 오류 | 내각과 외각을 구별해 다루는 공식 용어와 성취기준에서 추론했다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_sector_angle_proportion | 도형과 측정 | 평면도형의 성질 | misconception_risk | textbook_evidence_needed | 중심각 비례 관계를 호의 길이와 넓이에 적용하지 않는 오류 | 부채꼴의 중심각과 호 관계 성취기준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_or_and_counting_confusion | 자료와 가능성 | 경우의 수와 확률 | misconception_risk | textbook_evidence_needed | 또는과 동시에의 경우의 수를 혼동하는 오류 |  |
| m1_mis_permutation_combination_scope | 자료와 가능성 | 경우의 수와 확률 | misconception_risk | textbook_evidence_needed | 복잡한 순열·조합 문항을 중학교 경우의 수 범위에 포함하는 범위 오판 | 교육과정 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_probability_no_equal_likely | 자료와 가능성 | 경우의 수와 확률 | misconception_risk | textbook_evidence_needed | 동등 가능성 가정 없이 경우의 수 비율을 적용하는 오류 |  |
| m1_data_one_probability_event | 자료와 가능성 | 경우의 수와 확률 | sub_concept | source_detail_needed | 확률이 1인 사건 | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_probability_value | 자료와 가능성 | 경우의 수와 확률 | sub_concept | source_detail_needed | 확률값 | 공식 문서의 '가능성을 수로 나타낸 값' 맥락에서 분리한 미시 concept이다. 교과서 용어 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_zero_probability_event | 자료와 가능성 | 경우의 수와 확률 | sub_concept | source_detail_needed | 확률이 0인 사건 | 확률의 기본 성질에서 분리한 끝값 해석 concept이다. 교과서 본문 표현 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_even_median_no_average | 자료와 가능성 | 대푯값 | misconception_risk | textbook_evidence_needed | 짝수 개 자료에서 두 가운데 값 중 하나만 중앙값으로 보는 오류 | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_extreme_value_mean_choice | 자료와 가능성 | 대푯값 | misconception_risk | textbook_evidence_needed | 극단적인 값이 있는 자료에서 평균만 선택하는 오류 | 공식 문서의 '자료의 특성'을 오개념 위험으로 분해한 추론 노드이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_mean_only_representative | 자료와 가능성 | 대푯값 | misconception_risk | textbook_evidence_needed | 대푯값을 평균으로만 보는 오류 | 오개념 위험은 선수 관계로 확정하지 않고, 자료의 특성에 맞는 대푯값 선택과 혼동 관계로만 둔다. |
| m1_mis_median_without_ordering | 자료와 가능성 | 대푯값 | misconception_risk | textbook_evidence_needed | 자료를 정렬하지 않고 중앙값을 찾는 오류 | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_mode_largest_value | 자료와 가능성 | 대푯값 | misconception_risk | textbook_evidence_needed | 최빈값을 가장 큰 값으로 보는 오류 | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_data_median_extreme_value_context | 자료와 가능성 | 대푯값 | procedure | source_detail_needed | 극단적인 값이 있는 자료에서 중앙값 고려하기 | 공식 문서의 '자료의 특성에 따라 적절한 대푯값 선택'을 교과서형 판단 사례로 분해한 추론 노드이다. 교과서 예제 근거 확인 전까지 low로 둔다. |
| m1_data_mean_sensitive_to_extreme_value | 자료와 가능성 | 대푯값 | property | source_detail_needed | 평균은 극단적인 값의 영향을 받음 | 공식 문서의 '자료의 특성에 따라 적절한 대푯값 선택'을 평균의 민감성 맥락으로 분해한 추론 노드이다. 교과서 예제 근거 확인 전까지 low로 둔다. |
| m1_data_multiple_modes | 자료와 가능성 | 대푯값 | property | source_detail_needed | 최빈값이 여러 개인 경우 | 공식 문서에서 직접 명명되지 않은 교과서형 예외 처리이다. 교과서 본문·예제 근거 확인 전까지 low로 둔다. |
| m1_data_no_mode | 자료와 가능성 | 대푯값 | property | source_detail_needed | 최빈값이 없는 경우 | 공식 문서에서 직접 명명되지 않은 교과서형 예외 처리이다. 교과서 본문·예제 근거 확인 전까지 low로 둔다. |
| m1_data_extreme_value | 자료와 가능성 | 대푯값 | term | source_detail_needed | 극단적인 값 | 공식 문서의 '자료의 특성'을 교과서 예제 맥락으로 분해한 추론 노드이다. 교과서 본문 확인 전까지 low로 둔다. |
| m1_mis_graph_scale_distortion | 자료와 가능성 | 도수분포표와 상대도수 | misconception_risk | textbook_evidence_needed | 눈금 왜곡 그래프를 그대로 해석하는 오류 | 교육과정의 '부적절한 눈금으로 자료를 부정확하게 나타낸 표나 그래프 오류 찾기'에 근거한 노드다. |
| m1_mis_histogram_bar_graph | 자료와 가능성 | 도수분포표와 상대도수 | misconception_risk | textbook_evidence_needed | 히스토그램과 막대그래프를 같은 표현으로 보는 오류 | 공식 문서의 히스토그램 표현 요구에서 추론한 오개념 위험이다. 교과서 예제와 문항 근거 보강 필요. |
| m1_mis_relative_frequency_frequency | 자료와 가능성 | 도수분포표와 상대도수 | misconception_risk | textbook_evidence_needed | 도수와 상대도수를 혼동하는 오류 |  |
| m1_data_relative_frequency_sum | 자료와 가능성 | 도수분포표와 상대도수 | property | source_detail_needed | 상대도수의 합 | 공식 문서의 상대도수 구하기와 도수의 총합 표현에서 추론한 성질이다. 교과서 본문이나 정리 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_deviation_as_absolute_distance | 자료와 가능성 | 산포도 | misconception_risk | textbook_evidence_needed | 편차를 항상 양수 거리로 보는 오류 | 학생 반응에서 예상되는 오개념으로 추론했다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_same_mean_same_distribution | 자료와 가능성 | 산포도 | misconception_risk | textbook_evidence_needed | 평균이 같으면 분포도 같다고 보는 오류 | 두 집단 분포 비교에서 예상되는 오개념으로 추론했다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_sd_without_square_root | 자료와 가능성 | 산포도 | misconception_risk | textbook_evidence_needed | 표준편차에서 제곱근을 빠뜨리는 오류 | 표준편차 계산 절차에서 예상되는 오개념으로 추론했다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_variance_standard_deviation | 자료와 가능성 | 산포도 | misconception_risk | textbook_evidence_needed | 분산과 표준편차를 같은 값으로 보는 오류 |  |
| m1_data_deviation_sum_zero | 자료와 가능성 | 산포도 | property | source_detail_needed | 편차의 합은 0 | 편차의 정의에서 파생되는 교과서 정리 성격의 성질이다. 공식 문서의 직접 용어는 아니므로 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_standard_deviation_unit | 자료와 가능성 | 산포도 | property | source_detail_needed | 표준편차의 단위 | 표준편차를 분산의 제곱근으로 정의한 데서 파생되는 해석 성질이다. 공식 문서의 직접 용어는 아니므로 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_variability_calculation_table | 자료와 가능성 | 산포도 | representation | source_detail_needed | 산포도 계산 표 | 교과서 예제에서 자주 쓰이는 계산 표 형식으로 추론했다. 공식 문서의 직접 표현은 아니므로 낮은 신뢰도로 둔다. |
| m1_data_same_mean_different_spread | 자료와 가능성 | 산포도 | sub_concept | source_detail_needed | 평균이 같은 두 분포의 흩어진 정도 비교 | 두 집단 분포 비교 성취수준에서 필요한 대표적인 비교 맥락으로 추론했다. 공식 문서의 직접 표현은 아니므로 교과서 예제 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_box_plot_length_frequency | 자료와 가능성 | 상자그림과 산점도 | misconception_risk | textbook_evidence_needed | 상자그림 구간의 길이를 자료 수로 해석하는 오류 | 상자그림 분포 비교 맥락에서 추론한 오개념 위험이다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_correlation_causation | 자료와 가능성 | 상자그림과 산점도 | misconception_risk | textbook_evidence_needed | 상관관계를 원인과 결과로 단정하는 오류 | 공식 문서는 상관관계를 말하는 수준을 다룬다. 인과 판단 오류는 교과서 본문이나 문항 근거 보강 전까지 잠정 노드로 둔다. |
| m1_mis_quartile_without_ordering | 자료와 가능성 | 상자그림과 산점도 | misconception_risk | textbook_evidence_needed | 자료를 정렬하지 않고 사분위수를 구하는 오류 | 사분위수 계산 절차에서 추론한 오개념 위험이다. 교과서 예제·오답 근거로 보강한다. |
| m1_mis_scatter_axis_swap | 자료와 가능성 | 상자그림과 산점도 | misconception_risk | textbook_evidence_needed | 산점도의 두 변량을 축에 바꾸어 나타내는 오류 | 산점도 표현 절차에서 추론한 오개념 위험이다. 교과서 예제와 오답 근거로 보강한다. |
| m1_data_box_plot_box | 자료와 가능성 | 상자그림과 산점도 | representation | source_detail_needed | 상자그림의 상자 | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_box_plot_whisker | 자료와 가능성 | 상자그림과 산점도 | representation | source_detail_needed | 상자그림의 수염 | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_interquartile_range | 자료와 가능성 | 상자그림과 산점도 | term | source_detail_needed | 사분위범위 | 상자그림으로 분포를 비교할 때 사용하는 세부 해석 값으로 추론했다. 공식 용어 목록에는 없으므로 교과서 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_maximum_value | 자료와 가능성 | 상자그림과 산점도 | term | source_detail_needed | 최댓값 | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
| m1_data_minimum_value | 자료와 가능성 | 상자그림과 산점도 | term | source_detail_needed | 최솟값 | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
