# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 11
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 도수분포표와 상대도수
- priority tier: highest
- workplan score: 179
- concepts: 33
- edges touching unit: 182
- cross-unit edges: 50
- low confidence concepts: 4
- low confidence edges: 18

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 4 |
| misconception_risk | 3 |
| procedure | 14 |
| property | 1 |
| representation | 5 |
| term | 6 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 33 |
| often_confused_with | 10 |
| prerequisite_for | 71 |
| related_to | 2 |
| represented_by | 9 |
| used_in | 57 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_data_relative_frequency_sum | 상대도수의 합 | property | official_single_source | 공식 문서의 상대도수 구하기와 도수의 총합 표현에서 추론한 성질이다. 교과서 본문이나 정리 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_graph_scale_distortion | 눈금 왜곡 그래프를 그대로 해석하는 오류 | misconception_risk | official_single_source | 교육과정의 '부적절한 눈금으로 자료를 부정확하게 나타낸 표나 그래프 오류 찾기'에 근거한 노드다. |
| m1_mis_histogram_bar_graph | 히스토그램과 막대그래프를 같은 표현으로 보는 오류 | misconception_risk | official_dual_source | 공식 문서의 히스토그램 표현 요구에서 추론한 오개념 위험이다. 교과서 예제와 문항 근거 보강 필요. |
| m1_mis_relative_frequency_frequency | 도수와 상대도수를 혼동하는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_ratio__used_in__m1_data_relative_frequency | 비 | used_in | 상대도수 | low | official_dual_source |
| m1_num_ratio__used_in__m1_data_relative_frequency_calculation | 비 | used_in | 상대도수 구하기 | low | official_single_source |
| m1_mis_graph_scale_distortion__often_confused_with__m1_graph_graph_interpretation | 눈금 왜곡 그래프를 그대로 해석하는 오류 | often_confused_with | 그래프 해석 | low | official_single_source |
| m1_mis_representation_conversion__often_confused_with__m1_data_critical_graph_reading | 표·식·그래프 변환 오류 | often_confused_with | 표와 그래프의 오류 비판적으로 읽기 | low | official_dual_source |
| m1_data_domain__contains__m1_data_frequency_unit | 자료와 가능성 | contains | 도수분포표와 상대도수 | high | official_dual_source |
| m1_data_domain__contains__m1_data_statistical_inquiry_unit | 자료와 가능성 | contains | 통계적 탐구 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_class | 자료 | prerequisite_for | 계급 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_distribution | 자료 | prerequisite_for | 자료의 분포 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_frequency | 자료 | prerequisite_for | 도수 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_statistical_inquiry_problem | 자료 | prerequisite_for | 통계적 탐구 문제 | high | official_dual_source |
| m1_data_dataset__prerequisite_for__m1_data_stem_leaf_plot | 자료 | prerequisite_for | 줄기와 잎 그림 | high | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_choose_representative_value | 자료의 분포 | prerequisite_for | 자료의 특성에 맞는 대푯값 선택 | high | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability | 자료의 분포 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability_magnitude_interpretation | 자료의 분포 | prerequisite_for | 산포도 값의 크기 해석 | medium | official_dual_source |
| m1_data_distribution__prerequisite_for__m1_data_variability_unit | 자료의 분포 | prerequisite_for | 산포도 | high | official_dual_source |
| m1_data_distribution_interpretation__prerequisite_for__m1_data_box_plot_compare | 자료의 분포 특징 해석 | prerequisite_for | 상자그림으로 두 집단의 분포 비교 | high | official_dual_source |
| m1_data_distribution_interpretation__prerequisite_for__m1_data_compare_distributions_variability | 자료의 분포 특징 해석 | prerequisite_for | 산포도로 두 집단의 분포 비교 | high | official_dual_source |
| m1_data_frequency__prerequisite_for__m1_data_mode | 도수 | prerequisite_for | 최빈값 | high | official_dual_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_experimental_probability | 상대도수 | prerequisite_for | 상대도수로서의 확률 | medium | official_single_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_probability_unit | 상대도수 | prerequisite_for | 경우의 수와 확률 | high | official_dual_source |
| m1_data_relative_frequency__prerequisite_for__m1_data_relative_frequency_case_ratio_link | 상대도수 | prerequisite_for | 상대도수와 경우의 수의 비율 연결 | medium | official_single_source |
| m1_data_representative_unit__prerequisite_for__m1_data_frequency_unit | 대푯값 | prerequisite_for | 도수분포표와 상대도수 | high | official_dual_source |
| m1_data_technology_tool_stats__prerequisite_for__m1_data_box_plot_construction_tool | 공학 도구로 자료 수집·분석하기 | prerequisite_for | 공학 도구로 상자그림 나타내기 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_critical_graph_reading | 그래프 | prerequisite_for | 표와 그래프의 오류 비판적으로 읽기 | medium | official_single_source |
| m1_graph_graph__prerequisite_for__m1_data_frequency_unit | 그래프 | prerequisite_for | 도수분포표와 상대도수 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_histogram | 그래프 | prerequisite_for | 히스토그램 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_histogram_drawing | 그래프 | prerequisite_for | 히스토그램으로 나타내기 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_relative_frequency_table_graph | 그래프 | prerequisite_for | 상대도수의 분포를 표나 그래프로 나타내기 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_class | 정수와 유리수의 대소 관계 | prerequisite_for | 계급 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_stem_leaf_plot | 정수와 유리수의 대소 관계 | prerequisite_for | 줄기와 잎 그림 | high | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_data_relative_frequency_calculation | 비 | prerequisite_for | 상대도수 구하기 | high | official_dual_source |
| m1_num_rational_number__prerequisite_for__m1_data_relative_frequency | 유리수 | prerequisite_for | 상대도수 | high | official_dual_source |
| m1_repr_table__prerequisite_for__m1_data_critical_graph_reading | 표 | prerequisite_for | 표와 그래프의 오류 비판적으로 읽기 | medium | official_single_source |
| m1_repr_table__prerequisite_for__m1_data_frequency_table | 표 | prerequisite_for | 도수분포표 | high | official_dual_source |
| m1_repr_table__prerequisite_for__m1_data_frequency_table_construction | 표 | prerequisite_for | 도수분포표로 나타내기 | high | official_dual_source |
| m1_repr_table__prerequisite_for__m1_data_frequency_unit | 표 | prerequisite_for | 도수분포표와 상대도수 | high | official_dual_source |
| m1_repr_table__prerequisite_for__m1_data_relative_frequency_table_graph | 표 | prerequisite_for | 상대도수의 분포를 표나 그래프로 나타내기 | high | official_dual_source |
| m1_data_dataset__represented_by__m1_data_frequency_table | 자료 | represented_by | 도수분포표 | high | official_dual_source |
| m1_data_dataset__represented_by__m1_data_stem_leaf_plot | 자료 | represented_by | 줄기와 잎 그림 | high | official_dual_source |
| m1_data_experimental_probability__represented_by__m1_data_relative_frequency | 상대도수로서의 확률 | represented_by | 상대도수 | medium | official_single_source |
