# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 22
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 평면도형의 성질
- priority tier: highest
- workplan score: 180
- concepts: 29
- edges touching unit: 197
- cross-unit edges: 73
- low confidence concepts: 3
- low confidence edges: 15

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 8 |
| property | 6 |
| sub_concept | 1 |
| term | 8 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 31 |
| contrasts_with | 8 |
| often_confused_with | 8 |
| prerequisite_for | 97 |
| related_to | 8 |
| represented_by | 4 |
| used_in | 41 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_arc_chord | 호와 현을 같은 대상으로 보는 오류 | misconception_risk | official_dual_source | 공식 용어 분리와 호 관계 성취수준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_polygon_interior_exterior_angle | 내각과 외각을 같은 각으로 보는 오류 | misconception_risk | official_dual_source | 내각과 외각을 구별해 다루는 공식 용어와 성취기준에서 추론했다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_sector_angle_proportion | 중심각 비례 관계를 호의 길이와 넓이에 적용하지 않는 오류 | misconception_risk | official_dual_source | 부채꼴의 중심각과 호 관계 성취기준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_arc__prerequisite_for__m1_geo_semicircle_arc | 호 | prerequisite_for | 반원 | low | official_dual_source |
| m1_geo_central_angle__prerequisite_for__m1_geo_circle_auxiliary_radius_center | 중심각 | prerequisite_for | 원의 중심과 반지름 보조선 활용 | low | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_semicircle_arc | 현 | prerequisite_for | 반원 | low | official_dual_source |
| m1_mis_inscribed_central_angle_equal__often_confused_with__m1_geo_central_angle | 원주각과 중심각을 같은 크기로 보는 오류 | often_confused_with | 중심각 | low | official_dual_source |
| m1_geo_parallel_angle_property_explanation__related_to__m1_geo_polygon_angle_sum | 평행선에서 동위각과 엇각의 성질 설명하기 | related_to | 다각형의 내각과 외각의 크기 | low | official_dual_source |
| m1_geo_circle_unit__contains__m1_geo_chord | 원의 성질 | contains | 현 | high | official_dual_source |
| m1_geo_domain__contains__m1_geo_plane_properties_unit | 도형과 측정 | contains | 평면도형의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__contains__m1_geo_circle | 평면도형의 성질 | contains | 원 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_central_angle | 각 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_exterior_angle | 각 | prerequisite_for | 외각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_interior_angle | 각 | prerequisite_for | 내각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_polygon | 각 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_central_inscribed_angle_relation | 호 | prerequisite_for | 중심각과 원주각의 관계 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle | 호 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_property | 호 | prerequisite_for | 원주각의 성질 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_subtended_arc | 호 | prerequisite_for | 원주각이 보는 호 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_same_arc | 호 | prerequisite_for | 같은 호 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_same_arc_same_chord_relation | 호 | prerequisite_for | 같은 호와 같은 현의 대응 관계 | medium | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_sector_area_calculation | 넓이 | prerequisite_for | 부채꼴의 넓이 구하기 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_plane_properties_unit | 기본 도형 | prerequisite_for | 평면도형의 성질 | high | official_dual_source |
| m1_geo_central_angle__prerequisite_for__m1_geo_central_inscribed_angle_relation | 중심각 | prerequisite_for | 중심각과 원주각의 관계 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_chord_center_distance | 현 | prerequisite_for | 원 중심에서 현까지의 거리 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_chord_center_perpendicular_bisects | 현 | prerequisite_for | 원의 중심에서 현에 내린 수선은 현을 이등분 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_chord_midpoint_center_perpendicular | 현 | prerequisite_for | 원 중심과 현의 중점을 이은 직선은 현에 수직 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_circle_chord_property | 현 | prerequisite_for | 원의 현에 관한 성질 | high | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_equal_center_distance_equal_chords | 현 | prerequisite_for | 같은 원에서 중심거리가 같은 현의 길이가 같음 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_equal_chords_equal_center_distance | 현 | prerequisite_for | 같은 원에서 길이가 같은 현은 중심에서 같은 거리에 있음 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_same_arc_same_chord_relation | 현 | prerequisite_for | 같은 호와 같은 현의 대응 관계 | medium | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_same_chord | 현 | prerequisite_for | 같은 현 | medium | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_arc | 원 | prerequisite_for | 호 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_central_angle | 원 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_chord | 원 | prerequisite_for | 현 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_secant | 원 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_circle__prerequisite_for__m1_geo_sector | 원 | prerequisite_for | 부채꼴 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_parallelogram_diagonals_bisect | 대각선 | prerequisite_for | 평행사변형의 대각선이 서로를 이등분 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_quadrilateral_diagonal_properties | 대각선 | prerequisite_for | 사각형의 대각선에 관한 성질 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_rectangle_diagonals_equal | 대각선 | prerequisite_for | 직사각형의 대각선의 길이가 같음 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_rhombus_diagonals_perpendicular | 대각선 | prerequisite_for | 마름모의 대각선이 서로 수직 | high | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_sector_arc_length_calculation | 길이 | prerequisite_for | 부채꼴의 호의 길이 구하기 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_polygon | 직선 | prerequisite_for | 다각형 | high | official_dual_source |
