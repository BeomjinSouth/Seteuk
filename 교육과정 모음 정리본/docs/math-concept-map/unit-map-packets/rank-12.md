# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 12
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 기본 도형
- priority tier: high
- workplan score: 138
- concepts: 22
- edges touching unit: 132
- cross-unit edges: 48
- low confidence concepts: 2
- low confidence edges: 15

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 2 |
| property | 1 |
| term | 17 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 22 |
| contrasts_with | 10 |
| often_confused_with | 6 |
| prerequisite_for | 73 |
| related_to | 4 |
| used_in | 17 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_corresponding_alternate_angles | 동위각과 엇각의 위치를 혼동하는 오류 | misconception_risk | official_dual_source | 성취수준의 각 찾기와 크기 구하기 수행에서 추론한 위험이다. 교과서 오개념 코너 확인 필요. |
| m1_mis_skew_parallel_lines | 꼬인 위치와 평행을 같은 관계로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_perpendicular__prerequisite_for__m1_mis_tangent_radius | 직교 | prerequisite_for | 접선과 반지름의 수직 관계를 놓치는 오류 | low | official_dual_source |
| m1_geo_point__related_to__m1_coord_point_location | 점 | related_to | 점의 위치 | low | official_dual_source |
| m1_num_absolute_value__related_to__m1_geo_distance_between_two_points | 절댓값 | related_to | 두 점 사이의 거리 | low | official_dual_source |
| m1_geo_domain__contains__m1_geo_basic_unit | 도형과 측정 | contains | 기본 도형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_central_angle | 각 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_construction | 각 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_correspondence | 각 | prerequisite_for | 도형의 대응 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_exterior_angle | 각 | prerequisite_for | 외각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_incenter | 각 | prerequisite_for | 내심 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_inscribed_angle | 각 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_interior_angle | 각 | prerequisite_for | 내각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_angle | 각 | prerequisite_for | 대각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_side | 각 | prerequisite_for | 대변 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_polygon | 각 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_right_triangle | 각 | prerequisite_for | 직각삼각형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_triangle | 각 | prerequisite_for | 삼각형 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_triangle_construction | 각 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_construction_congruence_unit | 기본 도형 | prerequisite_for | 작도와 합동 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_justification | 기본 도형 | prerequisite_for | 정당화 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_plane_properties_unit | 기본 도형 | prerequisite_for | 평면도형의 성질 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_triangle_construction | 두 점 사이의 거리 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_trig_distance_height | 수선의 발 | prerequisite_for | 삼각비로 거리와 높이 구하기 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_axis_of_rotation | 직선 | prerequisite_for | 회전축 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_construction | 직선 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_polygon | 직선 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_secant | 직선 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_line__prerequisite_for__m1_geo_tangent_line | 직선 | prerequisite_for | 접선 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_triangle | 직선 | prerequisite_for | 삼각형 | medium | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_median | 중점 | prerequisite_for | 중선 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_triangle_midpoint_theorem | 중점 | prerequisite_for | 삼각형의 중점연결정리 | medium | official_dual_source |
| m1_geo_parallel_angle_properties__prerequisite_for__m1_geo_polygon_angle_sum | 평행선에서 동위각과 엇각의 성질 | prerequisite_for | 다각형의 내각과 외각의 크기 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_frustum_pyramid | 평행선 | prerequisite_for | 각뿔대 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_parallel_segment_ratio | 평행선 | prerequisite_for | 평행선 사이의 선분의 길이의 비 | high | official_dual_source |
| m1_geo_perpendicular_bisector__prerequisite_for__m1_geo_circumcenter | 수직이등분선 | prerequisite_for | 외심 | high | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_circle | 평면 | prerequisite_for | 원 | high | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_solid_cross_section | 평면 | prerequisite_for | 입체도형의 단면 | medium | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_chord | 점 | prerequisite_for | 현 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_circle | 점 | prerequisite_for | 원 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_construction | 점 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_correspondence | 점 | prerequisite_for | 도형의 대응 | medium | official_dual_source |
