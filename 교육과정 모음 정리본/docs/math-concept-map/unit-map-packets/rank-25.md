# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 25
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 자료와 가능성
- unit: 상자그림과 산점도
- priority tier: medium
- workplan score: 47
- concepts: 11
- edges touching unit: 48
- cross-unit edges: 16
- low confidence concepts: 1
- low confidence edges: 4

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 1 |
| procedure | 2 |
| representation | 2 |
| sub_concept | 3 |
| term | 1 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 14 |
| contrasts_with | 3 |
| often_confused_with | 2 |
| prerequisite_for | 18 |
| related_to | 1 |
| represented_by | 2 |
| used_in | 8 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_correlation_causation | 상관관계를 원인과 결과로 단정하는 오류 | misconception_risk | official_dual_source | 공식 문서는 상관관계를 말하는 수준을 다룬다. 인과 판단 오류는 교과서 본문이나 문항 근거 보강 전까지 잠정 노드로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_data_domain__contains__m1_data_box_scatter_unit | 자료와 가능성 | contains | 상자그림과 산점도 | high | official_dual_source |
| m1_coord_coordinate_plane__prerequisite_for__m1_data_scatter_plot | 좌표평면 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_data_distribution_interpretation__prerequisite_for__m1_data_box_plot_compare | 자료의 분포 특징 해석 | prerequisite_for | 상자그림으로 두 집단의 분포 비교 | high | official_dual_source |
| m1_data_median__prerequisite_for__m1_data_quartile | 중앙값 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_data_technology_tool_stats__prerequisite_for__m1_data_box_plot | 공학 도구로 자료 수집·분석하기 | prerequisite_for | 상자그림 | high | official_dual_source |
| m1_data_technology_tool_stats__prerequisite_for__m1_data_box_scatter_unit | 공학 도구로 자료 수집·분석하기 | prerequisite_for | 상자그림과 산점도 | high | official_dual_source |
| m1_data_variability_unit__prerequisite_for__m1_data_box_scatter_unit | 산포도 | prerequisite_for | 상자그림과 산점도 | high | official_dual_source |
| m1_data_variable__prerequisite_for__m1_data_scatter_plot | 변량 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_graph_graph__prerequisite_for__m1_data_scatter_plot | 그래프 | prerequisite_for | 산점도 | high | official_dual_source |
| m1_num_order_relation__prerequisite_for__m1_data_quartile | 정수와 유리수의 대소 관계 | prerequisite_for | 사분위수 | high | official_dual_source |
| m1_coord_coordinate_plane__represented_by__m1_data_scatter_plot | 좌표평면 | represented_by | 산점도 | medium | official_dual_source |
| m1_graph_graph__represented_by__m1_data_scatter_plot | 그래프 | represented_by | 산점도 | medium | official_dual_source |
| m1_data_distribution_interpretation__used_in__m1_data_box_plot_compare | 자료의 분포 특징 해석 | used_in | 상자그림으로 두 집단의 분포 비교 | medium | official_dual_source |
| m1_data_technology_tool_stats__used_in__m1_data_box_plot | 공학 도구로 자료 수집·분석하기 | used_in | 상자그림 | high | official_dual_source |
| m1_data_variable__used_in__m1_data_scatter_plot | 변량 | used_in | 산점도 | high | official_dual_source |
| m1_data_compare_distributions_variability__related_to__m1_data_box_plot_compare | 산포도로 두 집단의 분포 비교 | related_to | 상자그림으로 두 집단의 분포 비교 | medium | official_dual_source |
