# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 16
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 평면도형의 성질
- priority tier: highest
- workplan score: 146
- concepts: 29
- edges touching unit: 179
- cross-unit edges: 55
- low confidence concepts: 3
- low confidence edges: 11

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
| often_confused_with | 7 |
| prerequisite_for | 82 |
| related_to | 7 |
| represented_by | 4 |
| used_in | 40 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_arc_chord | 호와 현을 같은 대상으로 보는 오류 | misconception_risk | official_dual_source | 공식 용어 분리와 호 관계 성취수준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_polygon_interior_exterior_angle | 내각과 외각을 같은 각으로 보는 오류 | misconception_risk | official_dual_source | 내각과 외각을 구별해 다루는 공식 용어와 성취기준에서 추론했다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |
| m1_mis_sector_angle_proportion | 중심각 비례 관계를 호의 길이와 넓이에 적용하지 않는 오류 | misconception_risk | official_dual_source | 부채꼴의 중심각과 호 관계 성취기준에서 추론한 위험이다. 실제 오개념 근거는 교과서 예제와 문항으로 보강한다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_parallel_angle_property_explanation__related_to__m1_geo_polygon_angle_sum | 평행선에서 동위각과 엇각의 성질 설명하기 | related_to | 다각형의 내각과 외각의 크기 | low | official_dual_source |
| m1_geo_circle_unit__contains__m1_geo_chord | 원의 성질 | contains | 현 | high | official_dual_source |
| m1_geo_domain__contains__m1_geo_plane_properties_unit | 도형과 측정 | contains | 평면도형의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__contains__m1_geo_circle | 평면도형의 성질 | contains | 원 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_central_angle | 각 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_exterior_angle | 각 | prerequisite_for | 외각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_interior_angle | 각 | prerequisite_for | 내각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_polygon | 각 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle | 호 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_property | 호 | prerequisite_for | 원주각의 성질 | high | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_sector_area_calculation | 넓이 | prerequisite_for | 부채꼴의 넓이 구하기 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_plane_properties_unit | 기본 도형 | prerequisite_for | 평면도형의 성질 | high | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_circle_chord_property | 현 | prerequisite_for | 원의 현에 관한 성질 | high | official_dual_source |
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
| m1_geo_line__prerequisite_for__m1_geo_secant | 직선 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_parallel_angle_properties__prerequisite_for__m1_geo_polygon_angle_sum | 평행선에서 동위각과 엇각의 성질 | prerequisite_for | 다각형의 내각과 외각의 크기 | high | official_dual_source |
| m1_geo_parallel_angle_properties__prerequisite_for__m1_geo_polygon_angle_sum_generalization | 평행선에서 동위각과 엇각의 성질 | prerequisite_for | 다각형의 각의 성질 일반화하기 | high | official_dual_source |
| m1_geo_parallel_angle_properties__prerequisite_for__m1_geo_polygon_interior_angle_sum | 평행선에서 동위각과 엇각의 성질 | prerequisite_for | 다각형의 내각의 합 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_rotation_generation | 평면도형의 성질 | prerequisite_for | 평면도형을 회전시켜 회전체 만들기 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_face | 평면도형의 성질 | prerequisite_for | 입체도형의 면 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_net | 평면도형의 성질 | prerequisite_for | 전개도 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_of_revolution | 평면도형의 성질 | prerequisite_for | 회전체 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_unit | 평면도형의 성질 | prerequisite_for | 입체도형의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_surface_area | 평면도형의 성질 | prerequisite_for | 겉넓이 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_chord | 점 | prerequisite_for | 현 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_polygon | 점 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_polyhedron | 다각형 | prerequisite_for | 다면체 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_quadrilateral | 다각형 | prerequisite_for | 사각형 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_regular_polyhedron | 다각형 | prerequisite_for | 정다면체 | high | official_dual_source |
| m1_num_ratio__prerequisite_for__m1_geo_sector_proportional_reasoning | 비 | prerequisite_for | 중심각에 따른 부채꼴 비례 추론 | medium | official_dual_source |
