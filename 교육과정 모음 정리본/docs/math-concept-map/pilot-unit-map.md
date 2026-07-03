# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 1
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 상자그림과 산점도
- priority tier: highest
- workplan score: 695
- concepts: 52
- edges touching unit: 285
- cross-unit edges: 43
- low confidence concepts: 25
- low confidence edges: 125

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 6 |
| procedure | 13 |
| property | 1 |
| representation | 12 |
| sub_concept | 11 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 55 |
| contrasts_with | 5 |
| equivalent_to | 1 |
| often_confused_with | 16 |
| prerequisite_for | 117 |
| related_to | 3 |
| represented_by | 8 |
| used_in | 80 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_correlation_strength | 상관관계의 강하고 약한 정도 | sub_concept | official_dual_source | 중학교 교육과정에서는 상관계수나 회귀식까지 다루지 않으므로 산점도 모양의 정성적 강약 해석으로 제한한다. |
| m1_data_lower_half_for_quartiles | 아래쪽 절반의 자료 | sub_concept | official_dual_source | 제1사분위수를 구할 때 사용하는 교과서형 부분 자료 개념이다. 공식 문서가 직접 명명하지 않으므로 low로 둔다. |
| m1_data_upper_half_for_quartiles | 위쪽 절반의 자료 | sub_concept | official_dual_source | 제3사분위수를 구할 때 사용하는 교과서형 부분 자료 개념이다. 공식 문서가 직접 명명하지 않으므로 low로 둔다. |
| m1_data_box_plot_box | 상자그림의 상자 | representation | official_dual_source | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_box_plot_median_line | 상자그림의 중앙값 선 | representation | official_dual_source | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거 확인 전까지 low로 둔다. |
| m1_data_box_plot_quartile_intervals | 상자그림의 네 구간 | representation | official_dual_source | 상자그림의 구간별 해석을 위한 미시 표현 노드다. 공식 문서가 직접 명명하지 않으므로 교과서 그림 설명 확인 전까지 low로 둔다. |
| m1_data_box_plot_whisker | 상자그림의 수염 | representation | official_dual_source | 상자그림 구성 부분으로 추론한 미시 표현 노드다. 교과서 그림 설명 근거로 보강한다. |
| m1_data_scatter_negative_trend_shape | 오른쪽 아래로 향하는 산점도 경향 | representation | official_dual_source | 음의 상관관계를 산점도 모양으로 읽는 교과서형 표현이다. 교과서 그림 근거 확인 전까지 low로 둔다. |
| m1_data_scatter_no_clear_trend_shape | 뚜렷한 경향이 없는 산점도 모양 | representation | official_dual_source | 상관관계가 없는 경우를 산점도 모양으로 읽는 교과서형 표현이다. 교과서 그림 근거 확인 전까지 low로 둔다. |
| m1_data_scatter_plot_linear_pattern | 직선에 가까운 산점도 경향 | representation | official_dual_source | 상관관계의 강약을 산점도 모양으로 읽는 수준까지만 둔다. 상관계수, 회귀직선, 기울기 해석으로 확장하지 않는다. |
| m1_data_scatter_positive_trend_shape | 오른쪽 위로 향하는 산점도 경향 | representation | official_dual_source | 양의 상관관계를 산점도 모양으로 읽는 교과서형 표현이다. 교과서 그림 근거 확인 전까지 low로 둔다. |
| m1_data_box_plot_compare_iqr | 상자 길이로 사분위범위 비교하기 | procedure | official_dual_source | 상자 길이와 사분위범위의 연결은 교과서 그림 설명 근거 확인 전까지 low로 둔다. |
| m1_data_box_plot_compare_whiskers | 수염 길이로 양쪽 퍼짐 비교하기 | procedure | official_dual_source | 수염 길이를 해석하는 교과서형 비교 절차다. 공식 문서가 직접 명명하지 않으므로 low로 둔다. |
| m1_data_box_plot_same_scale_comparison | 같은 눈금에서 두 상자그림 비교하기 | procedure | official_dual_source | 상자그림 비교에서 눈금이 같아야 길이와 위치를 해석할 수 있다는 교과서형 확인 절차다. 직접 용어가 아니므로 low로 둔다. |
| m1_data_scatter_plot_axis_label_reading | 산점도 축 이름 확인하기 | procedure | official_dual_source | 산점도 읽기에서 반복되는 교과서형 확인 절차다. 공식 문서가 직접 명명하지 않으므로 low로 둔다. |
| m1_data_box_plot_interval_data_ratio | 상자그림 구간별 자료 비율 | property | official_dual_source | 상자그림 구간을 자료 수가 아니라 위치 비율로 읽는 해석이다. 동점과 교과서별 사분위수 계산 방식 확인 전까지 low로 둔다. |
| m1_data_interquartile_range | 사분위범위 | term | official_dual_source | 상자그림으로 분포를 비교할 때 사용하는 세부 해석 값으로 추론했다. 공식 용어 목록에는 없으므로 교과서 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_data_maximum_value | 최댓값 | term | official_dual_source | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
| m1_data_minimum_value | 최솟값 | term | official_dual_source | 상자그림의 끝값으로 필요한 개념이지만 공식 용어 목록에는 별도 열거되지 않았다. 교과서 본문 근거로 보강한다. |
| m1_mis_box_plot_length_frequency | 상자그림 구간의 길이를 자료 수로 해석하는 오류 | misconception_risk | official_dual_source | 상자그림 분포 비교 맥락에서 추론한 오개념 위험이다. 교과서 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_coord_x_axis__prerequisite_for__m1_data_scatter_plot_axis_label_reading | x축 | prerequisite_for | 산점도 축 이름 확인하기 | low | official_dual_source |
| m1_coord_y_axis__prerequisite_for__m1_data_scatter_plot_axis_label_reading | y축 | prerequisite_for | 산점도 축 이름 확인하기 | low | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_maximum_value | 자료 | prerequisite_for | 최댓값 | low | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_minimum_value | 자료 | prerequisite_for | 최솟값 | low | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_lower_half_for_quartiles | 중앙값 | prerequisite_for | 아래쪽 절반의 자료 | low | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_upper_half_for_quartiles | 중앙값 | prerequisite_for | 위쪽 절반의 자료 | low | official_dual_source |
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
