# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 1
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 변화와 관계
- unit: 좌표평면과 그래프
- priority tier: highest
- workplan score: 476
- concepts: 43
- edges touching unit: 237
- cross-unit edges: 75
- low confidence concepts: 9
- low confidence edges: 74

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 5 |
| procedure | 4 |
| property | 4 |
| representation | 6 |
| sub_concept | 8 |
| term | 13 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 51 |
| contrasts_with | 11 |
| often_confused_with | 24 |
| prerequisite_for | 80 |
| related_to | 21 |
| represented_by | 19 |
| used_in | 31 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_coord_axis_point | 축 위의 점 | sub_concept | official_dual_source | 공식 문서에는 좌표축과 좌표평면 위의 점이 확인된다. '축 위의 점' 명명과 세부 처리는 교과서 본문 확인이 필요하다. |
| m1_coord_x_axis_point | x축 위의 점 | sub_concept | official_dual_source | 공식 문서에는 x축, 좌표, 좌표평면 위의 점이 확인된다. y좌표가 0인 점이라는 세부 조건은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_coord_y_axis_point | y축 위의 점 | sub_concept | official_dual_source | 공식 문서에는 y축, 좌표, 좌표평면 위의 점이 확인된다. x좌표가 0인 점이라는 세부 조건은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_coord_quadrant_signs | 사분면별 좌표 부호 | property | official_dual_source | 공식 문서에는 사분면, x좌표, y좌표, 양수, 음수 용어가 확인된다. 각 사분면의 부호 패턴은 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_axis_quadrant | 축 위의 점을 사분면에 포함하는 오류 | misconception_risk | official_dual_source | 공식 문서에서 좌표축과 사분면 용어는 확인되지만, 오류 자체는 교과서·문항 근거 확인 전 잠정 노드이다. |
| m1_mis_direct_inverse_generalization | 증가·감소만으로 정비례·반비례 판단 | misconception_risk | official_dual_source | 공식 문서의 정비례·반비례 관계 판단 요구와 변화 상태 해석 요구를 함께 본 추론이다. |
| m1_mis_graph_picture | 그래프를 상황 그림으로만 보는 오류 | misconception_risk | official_dual_source | 그래프가 나타내는 상황을 설명하게 한다는 공식 문서 근거에서 추론한 오개념 위험이다. |
| m1_mis_order_swap | 순서쌍의 순서 혼동 | misconception_risk | official_dual_source | 성취수준 문서의 '주어진 좌표를 점으로 나타내기' 수행에서 드러날 수 있는 위험으로 추론했다. 교과서 오개념 코너 확인 필요. |
| m1_mis_representation_conversion | 표·식·그래프 변환 오류 | misconception_risk | official_dual_source | 상호 변환 활동과 표·식·그래프 성취수준에서 추론한 위험이다. 교과서 예제와 문항으로 보강 필요. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_coord_x_coordinate__prerequisite_for__m1_func_x_increment | x좌표 | prerequisite_for | x의 증가량 | low | official_dual_source |
| m1_coord_y_coordinate__prerequisite_for__m1_func_y_increment | y좌표 | prerequisite_for | y의 증가량 | low | official_dual_source |
| m1_num_negative_number__prerequisite_for__m1_coord_quadrant_signs | 음수 | prerequisite_for | 사분면별 좌표 부호 | low | official_dual_source |
| m1_num_positive_number__prerequisite_for__m1_coord_quadrant_signs | 양수 | prerequisite_for | 사분면별 좌표 부호 | low | official_dual_source |
| m1_num_ratio__used_in__m1_prop_direct_proportion | 비 | used_in | 정비례 | low | official_dual_source |
| m1_num_ratio__used_in__m1_prop_inverse_proportion | 비 | used_in | 반비례 | low | official_dual_source |
| m1_mis_expression_equation__often_confused_with__m1_repr_expression | 식과 방정식 혼동 | often_confused_with | 식 | low | official_dual_source |
| m1_mis_graph_scale_distortion__often_confused_with__m1_graph_graph_interpretation | 눈금 왜곡 그래프를 그대로 해석하는 오류 | often_confused_with | 그래프 해석 | low | official_single_source |
| m1_mis_letter_as_label_only__often_confused_with__m1_term_variable | 문자를 이름표로만 해석하는 오류 | often_confused_with | 변수 | low | official_dual_source |
| m1_mis_representation_conversion__often_confused_with__m1_data_critical_graph_reading | 표·식·그래프 변환 오류 | often_confused_with | 표와 그래프의 오류 비판적으로 읽기 | low | official_dual_source |
| m1_mis_slope_sign__often_confused_with__m1_graph_increase_decrease | 기울기 부호와 그래프 방향 혼동 | often_confused_with | 증가와 감소 | low | official_single_source |
| m1_geo_domain__related_to__m1_coord_graph_unit | 도형과 측정 | related_to | 좌표평면과 그래프 | low | official_dual_source |
| m1_geo_point__related_to__m1_coord_point_location | 점 | related_to | 점의 위치 | low | official_dual_source |
| m1_expr_unit__contains__m1_repr_everyday_language | 문자의 사용과 식 | contains | 일상 언어 | high | official_single_source |
| m1_expr_unit__contains__m1_repr_expression | 문자의 사용과 식 | contains | 식 | high | official_dual_source |
| m1_expr_unit__contains__m1_term_variable | 문자의 사용과 식 | contains | 변수 | high | official_dual_source |
| m1_coord_coordinate__prerequisite_for__m1_func_intersection_point | 좌표 | prerequisite_for | 교점 | medium | official_single_source |
| m1_coord_coordinate__prerequisite_for__m1_quad_func_vertex_coordinates | 좌표 | prerequisite_for | 꼭짓점 좌표 | medium | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_data_scatter_plot | 좌표평면 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_graph_drawing | 좌표평면 | prerequisite_for | 일차함수 그래프 그리기 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_func_linear_graph | 좌표평면 | prerequisite_for | 일차함수의 그래프 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_quad_func_graph | 좌표평면 | prerequisite_for | 이차함수의 그래프 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_quad_func_graph_drawing | 좌표평면 | prerequisite_for | 이차함수 그래프 그리기 | high | official_dual_source |
| m1_coord_graph_unit__prerequisite_for__m1_func_unit | 좌표평면과 그래프 | prerequisite_for | 일차함수와 그 그래프 | high | official_dual_source |
| m1_coord_graph_unit__prerequisite_for__m1_quad_func_unit | 좌표평면과 그래프 | prerequisite_for | 이차함수와 그 그래프 | high | official_dual_source |
| m1_coord_x_axis__prerequisite_for__m1_func_x_intercept | x축 | prerequisite_for | x절편 | high | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_func_y_intercept | y축 | prerequisite_for | y절편 | high | official_dual_source |
| m1_eq_unit__prerequisite_for__m1_coord_graph_unit | 일차방정식 | prerequisite_for | 좌표평면과 그래프 | medium | official_single_source |
| m1_graph_graph__prerequisite_for__m1_data_critical_graph_reading | 그래프 | prerequisite_for | 표와 그래프의 오류 비판적으로 읽기 | medium | official_single_source |
| m1_graph_graph__prerequisite_for__m1_data_frequency_unit | 그래프 | prerequisite_for | 도수분포표와 상대도수 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_histogram | 그래프 | prerequisite_for | 히스토그램 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_histogram_drawing | 그래프 | prerequisite_for | 히스토그램으로 나타내기 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_relative_frequency_table_graph | 그래프 | prerequisite_for | 상대도수의 분포를 표나 그래프로 나타내기 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_scatter_plot | 그래프 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_func_linear_graph | 그래프 | prerequisite_for | 일차함수의 그래프 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_quad_func_graph | 그래프 | prerequisite_for | 이차함수의 그래프 | medium | official_dual_source |
| m1_prop_direct_proportion__prerequisite_for__m1_func_y_ax_graph | 정비례 | prerequisite_for | 일차함수 y=ax의 그래프 | medium | official_single_source |
| m1_repr_everyday_language__prerequisite_for__m1_expr_situation_to_literal_expression | 일상 언어 | prerequisite_for | 상황을 문자를 사용한 식으로 나타내기 | high | official_dual_source |
| m1_repr_expression__prerequisite_for__m1_eq_equality | 식 | prerequisite_for | 등식 | high | official_dual_source |
| m1_repr_expression__prerequisite_for__m1_func_linear_formula | 식 | prerequisite_for | 일차함수의 식 | high | official_dual_source |
