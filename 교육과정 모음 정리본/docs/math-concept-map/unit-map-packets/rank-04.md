# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 4
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 상자그림과 산점도
- priority tier: highest
- workplan score: 279
- concepts: 32
- edges touching unit: 168
- cross-unit edges: 39
- low confidence concepts: 9
- low confidence edges: 43

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 4 |
| procedure | 7 |
| representation | 5 |
| sub_concept | 7 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 35 |
| contrasts_with | 4 |
| equivalent_to | 1 |
| often_confused_with | 10 |
| prerequisite_for | 63 |
| related_to | 3 |
| represented_by | 6 |
| used_in | 46 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_box_plot_box | 상자그림의 상자 | representation | official_dual_source | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_box_plot_whisker | 상자그림의 수염 | representation | official_dual_source | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_interquartile_range | 사분위범위 | term | official_dual_source | 상자그림으로 분포를 비교할 때 사용하는 세부 해석 값으로 추론했다. 공식 용어 목록에는 없으므로 교과서 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_maximum_value | 최댓값 | term | official_dual_source | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
| m1_data_minimum_value | 최솟값 | term | official_dual_source | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
| m1_mis_box_plot_length_frequency | 상자그림 구간의 길이를 자료 수로 해석하는 오류 | misconception_risk | official_dual_source | 상자그림 분포 비교 맥락에서 추론한 오개념 위험이다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_correlation_causation | 상관관계를 원인과 결과로 단정하는 오류 | misconception_risk | official_dual_source | 공식 문서는 상관관계를 말하는 수준을 다룬다. 인과 판단 오류는 교과서 본문이나 문항 근거 보강 전까지 잠정 노드로 둔다. |
| m1_mis_quartile_without_ordering | 자료를 정렬하지 않고 사분위수를 구하는 오류 | misconception_risk | official_dual_source | 사분위수 계산 절차에서 추론한 오개념 위험이다. 교과서 예제·오답 근거로 보강한다. |
| m1_mis_scatter_axis_swap | 산점도의 두 변량을 축에 바꾸어 나타내는 오류 | misconception_risk | official_dual_source | 산점도 표현 절차에서 추론한 오개념 위험이다. 교과서 예제와 오답 근거로 보강한다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_data_dataset__prerequisite_for__m1_data_maximum_value | 자료 | prerequisite_for | 최댓값 | low | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_minimum_value | 자료 | prerequisite_for | 최솟값 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_maximum_value | 정수와 유리수의 대소 관계 | prerequisite_for | 최댓값 | low | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_minimum_value | 정수와 유리수의 대소 관계 | prerequisite_for | 최솟값 | low | official_dual_source |
| m1_num_subtraction__prerequisite_for__m1_data_interquartile_range | 뺄셈 | prerequisite_for | 사분위범위 | low | official_dual_source |
| m1_mis_scatter_axis_swap__often_confused_with__m1_coord_ordered_pair | 산점도의 두 변량을 축에 바꾸어 나타내는 오류 | often_confused_with | 순서쌍 | low | official_dual_source |
| m1_data_domain__contains__m1_data_box_scatter_unit | 자료와 가능성 | contains | 상자그림과 산점도 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_data_scatter_plot | 좌표평면 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_data_scatter_plot_drawing | 좌표평면 | prerequisite_for | 산점도로 나타내기 | high | official_dual_source |
| m1_coord_ordered_pair__prerequisite_for__m1_data_scatter_plot_point | 순서쌍 | prerequisite_for | 산점도의 점 | medium | official_dual_source |
| m1_coord_x_axis__prerequisite_for__m1_data_scatter_plot_axes_variables | x축 | prerequisite_for | 산점도의 두 축과 변량 | medium | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_data_scatter_plot_axes_variables | y축 | prerequisite_for | 산점도의 두 축과 변량 | medium | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_bivariate_pair | 자료 | prerequisite_for | 두 변량의 대응값 | medium | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_ordered_data_for_quartiles | 자료 | prerequisite_for | 사분위수를 구하기 위한 자료 정렬 | medium | official_dual_source |
| m1_data_distribution_interpretation__prerequisite_for__m1_data_box_plot_compare | 자료의 분포 특징 해석 | prerequisite_for | 상자그림으로 두 집단의 분포 비교 | high | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_quartile | 중앙값 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_quartile_calculation | 중앙값 | prerequisite_for | 사분위수 구하기 | medium | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_second_quartile | 중앙값 | prerequisite_for | 제2사분위수 | medium | official_dual_source |
| m1_data_technology_tool_stats__prerequisite_for__m1_data_box_plot_construction_tool | 공학 도구로 자료 수집·분석하기 | prerequisite_for | 공학 도구로 상자그림 나타내기 | high | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_bivariate_pair | 변량 | prerequisite_for | 두 변량의 대응값 | medium | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_scatter_plot | 변량 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_scatter_plot_axes_variables | 변량 | prerequisite_for | 산점도의 두 축과 변량 | medium | official_dual_source |
| m1_graph_increase_decrease__prerequisite_for__m1_data_scatter_plot_trend | 증가와 감소 | prerequisite_for | 산점도의 경향 | medium | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_ordered_data_for_quartiles | 정수와 유리수의 대소 관계 | prerequisite_for | 사분위수를 구하기 위한 자료 정렬 | medium | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_quartile | 정수와 유리수의 대소 관계 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_data_bivariate_pair__represented_by__m1_coord_ordered_pair | 두 변량의 대응값 | represented_by | 순서쌍 | medium | official_dual_source |
| m1_coord_coordinate_plane__used_in__m1_data_scatter_plot | 좌표평면 | used_in | 산점도 | medium | official_dual_source |
| m1_coord_coordinate_plane__used_in__m1_data_scatter_plot_drawing | 좌표평면 | used_in | 산점도로 나타내기 | medium | official_dual_source |
| m1_coord_ordered_pair__used_in__m1_data_scatter_plot_point | 순서쌍 | used_in | 산점도의 점 | medium | official_dual_source |
| m1_data_distribution_interpretation__used_in__m1_data_box_plot_compare | 자료의 분포 특징 해석 | used_in | 상자그림으로 두 집단의 분포 비교 | medium | official_dual_source |
| m1_data_median__used_in__m1_data_quartile_calculation | 중앙값 | used_in | 사분위수 구하기 | medium | official_dual_source |
| m1_data_technology_tool_stats__used_in__m1_data_box_plot | 공학 도구로 자료 수집·분석하기 | used_in | 상자그림 | high | official_dual_source |
| m1_data_technology_tool_stats__used_in__m1_data_box_scatter_unit | 공학 도구로 자료 수집·분석하기 | used_in | 상자그림과 산점도 | medium | official_dual_source |
| m1_data_variable__used_in__m1_data_bivariate_pair | 변량 | used_in | 두 변량의 대응값 | medium | official_dual_source |
| m1_data_variable__used_in__m1_data_scatter_plot | 변량 | used_in | 산점도 | high | official_dual_source |
| m1_data_second_quartile__equivalent_to__m1_data_median | 제2사분위수 | equivalent_to | 중앙값 | medium | official_dual_source |
| m1_data_compare_distributions_variability__related_to__m1_data_box_plot_compare | 산포도로 두 집단의 분포 비교 | related_to | 상자그림으로 두 집단의 분포 비교 | medium | official_dual_source |
| m1_data_scatter_plot__related_to__m1_graph_graph | 산점도 | related_to | 그래프 | medium | official_dual_source |
| m1_data_variability_unit__related_to__m1_data_box_scatter_unit | 산포도 | related_to | 상자그림과 산점도 | medium | official_dual_source |
