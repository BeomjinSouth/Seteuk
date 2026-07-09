# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 2
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 이차함수와 그 그래프
- priority tier: highest
- workplan score: 414
- concepts: 49
- edges touching unit: 254
- cross-unit edges: 37
- low confidence concepts: 11
- low confidence edges: 57

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 5 |
| procedure | 13 |
| property | 10 |
| representation | 12 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 50 |
| contrasts_with | 4 |
| often_confused_with | 14 |
| prerequisite_for | 92 |
| related_to | 13 |
| represented_by | 16 |
| used_in | 65 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_quad_func_symmetric_points | 축을 기준으로 대칭인 두 점 | representation | official_single_source | 값의 표와 좌표평면으로 그래프를 그릴 때 쓰이는 교과서형 표현이다. 직접 용어 근거 확인 전까지 low로 둔다. |
| m1_quad_func_choose_symmetric_x_values | 축을 기준으로 대칭인 x값 고르기 | procedure | official_single_source | 교과서의 표 작성 활동에서 자주 쓰이는 절차로 추론했으므로 직접 본문 근거 확인 전까지 low로 둔다. |
| m1_quad_func_complete_square_for_vertex | 완전제곱식으로 고쳐 꼭짓점 찾기 | procedure | official_single_source | 성취수준 A의 일반형 그래프 성질 설명에서 추론한 절차다. 교과서 예제 근거 확인 전까지 low로 둔다. |
| m1_quad_func_general_to_vertex_form | 일반형을 꼭짓점형으로 고치기 | procedure | official_single_source | 중학교 공식 문서가 직접 절차명을 제시하지 않으므로 low로 두고, 교과서 예제에서 실제 처리 수준을 확인한다. |
| m1_quad_func_plot_points_and_connect | 점 찍고 포물선으로 연결하기 | procedure | official_single_source | 교과서의 실제 그래프 그리기 예제에서 확인이 필요한 미시 절차이므로 low로 둔다. |
| m1_quad_func_a_abs_width | a의 절댓값과 그래프의 폭 | property | official_single_source | 교과서 그래프 비교 활동에서 자주 다루는 성질이지만 공식 문서가 직접 명명하지 않으므로 low로 둔다. |
| m1_mis_axis_vertex | 포물선의 축과 꼭짓점을 혼동하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_max_min_scope | 최댓값·최솟값의 범위를 임의로 확장하는 오류 | misconception_risk | official_single_source |  |
| m1_mis_quadratic_a_sign_opening_direction | a의 부호와 열린 방향을 반대로 해석하는 오류 | misconception_risk | official_single_source | 공식 문서는 해당 오개념을 직접 제시하지 않는다. 교과서 예제·오답 근거 확인 전까지 low로 둔다. |
| m1_mis_quadratic_function_equation | 이차함수와 이차방정식을 혼동하는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_quadratic_general_form_vertex_reading | 일반형에서 꼭짓점을 바로 읽는 오류 | misconception_risk | official_single_source | 일반형과 꼭짓점형의 표현 차이에서 예상되는 지도상 위험이다. 교과서 문항 근거 확인 전까지 low로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_coord_coordinate_plane__prerequisite_for__m1_quad_func_plot_points_and_connect | 좌표평면 | prerequisite_for | 점 찍고 포물선으로 연결하기 | low | official_single_source |
| m1_coord_ordered_pair__prerequisite_for__m1_quad_func_symmetric_points | 순서쌍 | prerequisite_for | 축을 기준으로 대칭인 두 점 | low | official_single_source |
| m1_factor_perfect_square_expression__prerequisite_for__m1_quad_func_complete_square_for_vertex | 완전제곱식 | prerequisite_for | 완전제곱식으로 고쳐 꼭짓점 찾기 | low | official_single_source |
| m1_num_absolute_value__prerequisite_for__m1_quad_func_a_abs_width | 절댓값 | prerequisite_for | a의 절댓값과 그래프의 폭 | low | official_single_source |
| m1_mis_quadratic_function_equation__often_confused_with__m1_quad_eq_quadratic_equation | 이차함수와 이차방정식을 혼동하는 오류 | often_confused_with | 이차방정식 | low | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_quad_func_vertex_coordinates | 좌표 | prerequisite_for | 꼭짓점 좌표 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_quad_func_graph | 좌표평면 | prerequisite_for | 이차함수의 그래프 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_quad_func_graph_drawing | 좌표평면 | prerequisite_for | 이차함수 그래프 그리기 | high | official_dual_source |
| m1_coord_graph_unit__prerequisite_for__m1_quad_func_unit | 좌표평면과 그래프 | prerequisite_for | 이차함수와 그 그래프 | high | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_quad_func_value_table_ordered_pairs | 순서쌍 | prerequisite_for | 값의 표에서 순서쌍 만들기 | medium | official_single_source |
| m1_expr_coefficient__prerequisite_for__m1_quad_func_coefficient_a | 계수 | prerequisite_for | 이차함수의 계수 a | medium | official_single_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_formula | 이차식 | prerequisite_for | 이차함수의 식 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_general_form | 이차식 | prerequisite_for | y=ax^2+bx+c 꼴 | medium | official_single_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_quadratic_function | 이차식 | prerequisite_for | 이차함수 | high | official_dual_source |
| m1_factor_quadratic_expression__prerequisite_for__m1_quad_func_situation_to_formula | 이차식 | prerequisite_for | 상황을 이차함수 식으로 나타내기 | high | official_dual_source |
| m1_func_function__prerequisite_for__m1_quad_func_quadratic_function | 함수 | prerequisite_for | 이차함수 | high | official_dual_source |
| m1_func_function__prerequisite_for__m1_quad_func_situation_to_formula | 함수 | prerequisite_for | 상황을 이차함수 식으로 나타내기 | high | official_dual_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_p_parameter_horizontal_shift | 평행이동 | prerequisite_for | p 값과 좌우 평행이동 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_q_parameter_vertical_shift | 평행이동 | prerequisite_for | q 값과 상하 평행이동 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_shifted_square_form | 평행이동 | prerequisite_for | y=a(x-p)^2 꼴 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_vertex_form | 평행이동 | prerequisite_for | y=a(x-p)^2+q 꼴 | medium | official_single_source |
| m1_func_parallel_translation__prerequisite_for__m1_quad_func_vertical_shift_form | 평행이동 | prerequisite_for | y=ax^2+q 꼴 | medium | official_single_source |
| m1_func_unit__prerequisite_for__m1_quad_func_unit | 일차함수와 그 그래프 | prerequisite_for | 이차함수와 그 그래프 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_maximum | 함숫값 | prerequisite_for | 최댓값 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_minimum | 함숫값 | prerequisite_for | 최솟값 | high | official_dual_source |
| m1_func_value__prerequisite_for__m1_quad_func_value_table | 함숫값 | prerequisite_for | 이차함수의 값의 표 | medium | official_single_source |
| m1_func_value__prerequisite_for__m1_quad_func_value_table_ordered_pairs | 함숫값 | prerequisite_for | 값의 표에서 순서쌍 만들기 | medium | official_single_source |
| m1_func_value__prerequisite_for__m1_quad_func_y_fx | 함숫값 | prerequisite_for | y=f(x) | high | official_single_source |
| m1_graph_graph__prerequisite_for__m1_quad_func_graph | 그래프 | prerequisite_for | 이차함수의 그래프 | medium | official_dual_source |
| m1_num_negative_number__prerequisite_for__m1_quad_func_a_sign_opening | 음수 | prerequisite_for | a의 부호로 열린 방향 판단하기 | medium | official_single_source |
| m1_num_positive_number__prerequisite_for__m1_quad_func_a_sign_opening | 양수 | prerequisite_for | a의 부호로 열린 방향 판단하기 | medium | official_single_source |
| m1_num_zero__prerequisite_for__m1_quad_func_nonzero_a_condition | 0 | prerequisite_for | a≠0 조건 | medium | official_dual_source |
| m1_quad_eq_unit__prerequisite_for__m1_quad_func_unit | 이차방정식 | prerequisite_for | 이차함수와 그 그래프 | medium | official_single_source |
| m1_coord_coordinate_plane__used_in__m1_quad_func_graph | 좌표평면 | used_in | 이차함수의 그래프 | high | official_dual_source |
| m1_factor_quadratic_expression__used_in__m1_quad_func_formula | 이차식 | used_in | 이차함수의 식 | medium | official_dual_source |
| m1_func_parallel_translation__used_in__m1_quad_func_vertex_form | 평행이동 | used_in | y=a(x-p)^2+q 꼴 | medium | official_single_source |
| m1_func_tech_tool_graph__used_in__m1_quad_func_tech_tool_graph | 공학 도구로 함수 그래프 탐구하기 | used_in | 공학 도구로 이차함수 그래프 탐구하기 | medium | official_dual_source |
