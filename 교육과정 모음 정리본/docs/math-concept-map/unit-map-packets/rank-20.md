# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 20
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 삼각비
- priority tier: highest
- workplan score: 110
- concepts: 24
- edges touching unit: 110
- cross-unit edges: 20
- low confidence concepts: 3
- low confidence edges: 12

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 3 |
| procedure | 6 |
| property | 2 |
| representation | 4 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 24 |
| contrasts_with | 5 |
| often_confused_with | 7 |
| prerequisite_for | 40 |
| related_to | 6 |
| represented_by | 7 |
| used_in | 21 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_trig_angle_scope | 삼각비 각의 범위를 0도~90도 밖으로 확장하는 오류 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. 교과서 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_trig_opposite_adjacent_swap | 기준각에 따라 대변과 이웃변을 바꾸는 오류 | misconception_risk | official_dual_source | 삼각비 정의와 값 구하기 절차에서 추론한 오개념 위험이다. 교과서 예제나 오답 근거 확인 전 낮은 신뢰도로 둔다. |
| m1_mis_trig_relation_scope | 삼각비 사이의 관계를 교육과정 범위로 오해하는 오류 | misconception_risk | official_single_source | 교육과정 유의사항은 삼각비 사이의 관계는 다루지 않는다고 명시한다. 교과서 오답 근거 확인 전 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_ratio__used_in__m1_geo_trigonometric_ratio | 비 | used_in | 삼각비 | low | official_dual_source |
| m1_geo_tangent_ratio__contrasts_with__m1_geo_tangent_line | 탄젠트 | contrasts_with | 접선 | low | official_single_source |
| m1_geo_domain__contains__m1_geo_trig_unit | 도형과 측정 | contains | 삼각비 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_trig_reference_angle | 각 | prerequisite_for | 삼각비의 기준각 | medium | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_trig_distance_height | 수선의 발 | prerequisite_for | 삼각비로 거리와 높이 구하기 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_trig_distance_height_modeling | 수선의 발 | prerequisite_for | 거리와 높이 문제를 직각삼각형으로 나타내기 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_trig_hypotenuse | 길이 | prerequisite_for | 삼각비에서의 빗변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_special_angles_30_45_60 | 직각삼각형 | prerequisite_for | 30도, 45도, 60도의 삼각비 | high | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_adjacent_side | 직각삼각형 | prerequisite_for | 기준각의 이웃변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_distance_height_modeling | 직각삼각형 | prerequisite_for | 거리와 높이 문제를 직각삼각형으로 나타내기 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_hypotenuse | 직각삼각형 | prerequisite_for | 삼각비에서의 빗변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_opposite_side | 직각삼각형 | prerequisite_for | 기준각의 대변 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trig_reference_angle | 직각삼각형 | prerequisite_for | 삼각비의 기준각 | medium | official_dual_source |
| m1_geo_right_triangle__prerequisite_for__m1_geo_trigonometric_ratio | 직각삼각형 | prerequisite_for | 삼각비 | high | official_dual_source |
| m1_geo_similarity_ratio__prerequisite_for__m1_geo_trigonometric_ratio | 닮음비 | prerequisite_for | 삼각비 | high | official_dual_source |
| m1_geo_area__used_in__m1_geo_trig_triangle_area | 넓이 | used_in | 삼각비를 이용한 삼각형의 넓이 | medium | official_single_source |
| m1_geo_pythagorean_unit__related_to__m1_geo_trig_unit | 피타고라스 정리 | related_to | 삼각비 | medium | official_dual_source |
| m1_geo_triangle_quadrilateral_unit__related_to__m1_geo_trig_unit | 삼각형과 사각형의 성질 | related_to | 삼각비 | medium | official_dual_source |
| m1_geo_trig_opposite_side__related_to__m1_geo_opposite_side | 기준각의 대변 | related_to | 대변 | medium | official_dual_source |
| m1_geo_trig_value_table__related_to__m1_repr_table | 삼각비의 값 표 | related_to | 표 | medium | official_dual_source |
