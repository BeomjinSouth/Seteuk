# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 5
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 일차함수와 그 그래프
- priority tier: highest
- workplan score: 347
- concepts: 33
- edges touching unit: 169
- cross-unit edges: 46
- low confidence concepts: 11
- low confidence edges: 52

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 7 |
| procedure | 6 |
| property | 3 |
| representation | 5 |
| sub_concept | 2 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 34 |
| contrasts_with | 5 |
| often_confused_with | 16 |
| prerequisite_for | 72 |
| related_to | 7 |
| represented_by | 6 |
| used_in | 29 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_func_slope_ratio_formula | 기울기 계산식 | representation | official_single_source | 성취수준 문서의 기울기 부호 판단과 그래프의 식 구하기 맥락에서 추출한 미시 표현이다. 증가량의 비 표현은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_input_value | 입력값 | term | official_dual_source | 공식 문서에는 함숫값을 구하는 수행이 확인되지만 '입력값' 용어 자체는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_x_increment | x의 증가량 | term | official_single_source | 성취수준 문서에는 기울기 부호와 그래프의 식 구하기가 확인된다. x의 증가량이라는 세부 계산 용어는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_func_y_increment | y의 증가량 | term | official_single_source | 성취수준 문서에는 기울기 부호와 그래프의 식 구하기가 확인된다. y의 증가량이라는 세부 계산 용어는 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_all_relations_are_functions | 모든 두 양의 관계를 함수로 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_function_linear_function | 함수와 일차함수 혼동 | misconception_risk | official_dual_source |  |
| m1_mis_function_value_input_output | 함숫값과 입력값 혼동 | misconception_risk | official_dual_source |  |
| m1_mis_multiple_outputs_same_input | 하나의 입력에 여러 출력이 대응하는 경우를 함수로 보는 오류 | misconception_risk | official_dual_source | 공식 문서의 '하나씩 정해지는 대응 관계'와 함수 판단 성취수준에서 추론한 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_slope_intercept | 기울기와 절편 혼동 | misconception_risk | official_dual_source |  |
| m1_mis_slope_sign | 기울기 부호와 그래프 방향 혼동 | misconception_risk | official_single_source |  |
| m1_mis_x_y_intercept | x절편과 y절편 혼동 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_coord_x_coordinate__prerequisite_for__m1_func_x_increment | x좌표 | prerequisite_for | x의 증가량 | low | official_dual_source |
| m1_coord_y_coordinate__prerequisite_for__m1_func_y_increment | y좌표 | prerequisite_for | y의 증가량 | low | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_func_slope_ratio_formula | 비 | prerequisite_for | 기울기 계산식 | low | official_single_source |
| m1_mis_function_value_input_output__often_confused_with__m1_expr_substitution | 함숫값과 입력값 혼동 | often_confused_with | 대입 | low | official_dual_source |
| m1_mis_slope_sign__often_confused_with__m1_graph_increase_decrease | 기울기 부호와 그래프 방향 혼동 | often_confused_with | 증가와 감소 | low | official_single_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_graph_drawing | 좌표평면 | prerequisite_for | 일차함수 그래프 그리기 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_linear_graph | 좌표평면 | prerequisite_for | 일차함수의 그래프 | high | official_dual_source |
| m1_coord_graph_unit__prerequisite_for__m1_func_unit | 좌표평면과 그래프 | prerequisite_for | 일차함수와 그 그래프 | high | official_dual_source |
| m1_coord_x_axis__prerequisite_for__m1_func_x_intercept | x축 | prerequisite_for | x절편 | high | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_func_y_intercept | y축 | prerequisite_for | y절편 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_func_unit | 일차방정식 | prerequisite_for | 일차함수와 그 그래프 | high | official_single_source |
| m1_expr_linear_expression__prerequisite_for__m1_func_linear_function | 일차식 | prerequisite_for | 일차함수 | high | official_dual_source |
| m1_expr_substitution__prerequisite_for__m1_func_value | 대입 | prerequisite_for | 함숫값 | high | official_dual_source |
| m1_expr_unit__prerequisite_for__m1_func_unit | 문자의 사용과 식 | prerequisite_for | 일차함수와 그 그래프 | high | official_dual_source |
| m1_func_function__prerequisite_for__m1_quad_func_quadratic_function | 함수 | prerequisite_for | 이차함수 | high | official_dual_source |
| m1_func_function__prerequisite_for__m1_quad_func_situation_to_formula | 함수 | prerequisite_for | 상황을 이차함수 식으로 나타내기 | high | official_dual_source |
| m1_func_linear_formula__prerequisite_for__m1_func_equation_function_form_conversion | 일차함수의 식 | prerequisite_for | 미지수가 2개인 일차방정식을 y=ax+b 꼴로 나타내기 | medium | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_linear_graphs | 일차함수의 그래프 | prerequisite_for | 두 일차함수의 그래프 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_equation_as_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 해를 그래프로 나타내기 | high | official_dual_source |
| m1_func_linear_graph__prerequisite_for__m1_func_two_variable_linear_equation_graph | 일차함수의 그래프 | prerequisite_for | 미지수가 2개인 일차방정식의 그래프 | high | official_dual_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_shifted_square_form | 평행이동 | prerequisite_for | y=a(x-p)^2 꼴 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_vertex_form | 평행이동 | prerequisite_for | y=a(x-p)^2+q 꼴 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_vertical_shift_form | 평행이동 | prerequisite_for | y=ax^2+q 꼴 | medium | official_single_source |
| m1_func_unit__prerequisite_for__m1_func_eq_relation_unit | 일차함수와 그 그래프 | prerequisite_for | 일차함수와 일차방정식의 관계 | high | official_dual_source |
| m1_func_unit__prerequisite_for__m1_quad_func_unit | 일차함수와 그 그래프 | prerequisite_for | 이차함수와 그 그래프 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_maximum | 함숫값 | prerequisite_for | 최댓값 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_minimum | 함숫값 | prerequisite_for | 최솟값 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_value_table | 함숫값 | prerequisite_for | 이차함수의 값의 표 | medium | official_single_source |
| m1_func_value__prerequisite_for__m1_quad_func_y_fx | 함숫값 | prerequisite_for | y=f(x) | high | official_single_source |
| m1_graph_graph__prerequisite_for__m1_func_linear_graph | 그래프 | prerequisite_for | 일차함수의 그래프 | high | official_dual_source |
| m1_prop_direct_proportion__prerequisite_for__m1_func_y_ax_graph | 정비례 | prerequisite_for | 일차함수 y=ax의 그래프 | medium | official_single_source |
| m1_repr_expression__prerequisite_for__m1_func_linear_formula | 식 | prerequisite_for | 일차함수의 식 | high | official_dual_source |
| m1_repr_expression__prerequisite_for__m1_func_two_quantity_relation | 식 | prerequisite_for | 두 양 사이의 관계 | high | official_dual_source |
| m1_repr_table__prerequisite_for__m1_func_two_quantity_relation | 표 | prerequisite_for | 두 양 사이의 관계 | high | official_dual_source |
| m1_coord_coordinate_plane__used_in__m1_func_linear_graph | 좌표평면 | used_in | 일차함수의 그래프 | high | official_dual_source |
| m1_expr_substitution__used_in__m1_func_value | 대입 | used_in | 함숫값 | high | official_dual_source |
| m1_func_linear_graph__used_in__m1_func_equation_relation | 일차함수의 그래프 | used_in | 일차함수와 미지수가 2개인 일차방정식의 관계 | high | official_dual_source |
| m1_func_parallel_translation__used_in__m1_quad_func_vertex_form | 평행이동 | used_in | y=a(x-p)^2+q 꼴 | medium | official_single_source |
| m1_func_tech_tool_graph__used_in__m1_quad_func_tech_tool_graph | 공학 도구로 함수 그래프 탐구하기 | used_in | 공학 도구로 이차함수 그래프 탐구하기 | medium | official_dual_source |
| m1_func_x_intercept__used_in__m1_coord_x_axis | x절편 | used_in | x축 | high | official_dual_source |
