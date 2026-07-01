# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 10
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 기본 도형
- priority tier: highest
- workplan score: 240
- concepts: 34
- edges touching unit: 231
- cross-unit edges: 70
- low confidence concepts: 5
- low confidence edges: 29

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 2 |
| procedure | 4 |
| property | 4 |
| representation | 1 |
| sub_concept | 1 |
| term | 20 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 36 |
| contrasts_with | 11 |
| often_confused_with | 8 |
| prerequisite_for | 119 |
| related_to | 5 |
| represented_by | 2 |
| used_in | 50 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_geo_coplanar_condition | 한 평면 위에 있음 | property | official_dual_source | 평행선과 꼬인 위치의 구별에 쓰이는 조건이지만 공식 독립 용어로 확인되지는 않아 낮은 신뢰도로 둔다. |
| m1_geo_line_segment | 선분 | term | official_dual_source | 공식 용어표의 직접 열거가 아니라 중점, 수직이등분선, 두 점 사이의 거리 설명에서 필요한 하위 용어로 분리했다. 교과서 본문 근거가 필요하다. |
| m1_geo_ray | 반직선 | term | official_dual_source | 각의 정의에 필요한 하위 용어지만 공식 용어표 직접 근거는 아직 확인되지 않아 낮은 신뢰도로 둔다. |
| m1_mis_corresponding_alternate_angles | 동위각과 엇각의 위치를 혼동하는 오류 | misconception_risk | official_dual_source | 성취수준의 각 찾기와 크기 구하기 수행에서 추론한 위험이다. 교과서 오개념 코너 확인 필요. |
| m1_mis_skew_parallel_lines | 꼬인 위치와 평행을 같은 관계로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_parallel_angle_property_explanation__related_to__m1_geo_polygon_angle_sum | 평행선에서 동위각과 엇각의 성질 설명하기 | related_to | 다각형의 내각과 외각의 크기 | low | official_dual_source |
| m1_geo_point__related_to__m1_coord_point_location | 점 | related_to | 점의 위치 | low | official_dual_source |
| m1_num_absolute_value__related_to__m1_geo_distance_between_two_points | 절댓값 | related_to | 두 점 사이의 거리 | low | official_dual_source |
| m1_geo_domain__contains__m1_geo_basic_unit | 도형과 측정 | contains | 기본 도형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_angle_bisector | 각 | prerequisite_for | 각의 이등분선 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_central_angle | 각 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_construction | 각 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_correspondence | 각 | prerequisite_for | 도형의 대응 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_exterior_angle | 각 | prerequisite_for | 외각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_inscribed_angle | 각 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_interior_angle | 각 | prerequisite_for | 내각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_isosceles_base_angles | 각 | prerequisite_for | 이등변삼각형의 두 밑각 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_isosceles_vertex_angle | 각 | prerequisite_for | 이등변삼각형의 꼭지각 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_angle | 각 | prerequisite_for | 대각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_side | 각 | prerequisite_for | 대변 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_polygon | 각 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_right_triangle | 각 | prerequisite_for | 직각삼각형 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_triangle | 각 | prerequisite_for | 삼각형 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_triangle_construction | 각 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_trig_reference_angle | 각 | prerequisite_for | 삼각비의 기준각 | medium | official_dual_source |
| m1_geo_angle_measure__prerequisite_for__m1_geo_angle_bisector | 각의 크기 | prerequisite_for | 각의 이등분선 | medium | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_construction_congruence_unit | 기본 도형 | prerequisite_for | 작도와 합동 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_justification | 기본 도형 | prerequisite_for | 정당화 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_plane_properties_unit | 기본 도형 | prerequisite_for | 평면도형의 성질 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_circumcenter_equal_vertex_distance | 두 점 사이의 거리 | prerequisite_for | 외심에서 세 꼭짓점까지의 거리 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_incenter_equal_side_distance | 두 점 사이의 거리 | prerequisite_for | 내심에서 세 변까지의 거리 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_triangle_construction | 두 점 사이의 거리 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_incenter_equal_side_distance | 수선의 발 | prerequisite_for | 내심에서 세 변까지의 거리 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_trig_distance_height | 수선의 발 | prerequisite_for | 삼각비로 거리와 높이 구하기 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_trig_distance_height_modeling | 수선의 발 | prerequisite_for | 거리와 높이 문제를 직각삼각형으로 나타내기 | medium | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_axis_of_rotation | 직선 | prerequisite_for | 회전축 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_construction | 직선 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_polygon | 직선 | prerequisite_for | 다각형 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_secant | 직선 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_line__prerequisite_for__m1_geo_tangent_line | 직선 | prerequisite_for | 접선 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_triangle | 직선 | prerequisite_for | 삼각형 | medium | official_dual_source |
| m1_geo_line_segment__prerequisite_for__m1_geo_solid_edge | 선분 | prerequisite_for | 입체도형의 모서리 | medium | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_median | 중점 | prerequisite_for | 중선 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_parallelogram_diagonals_bisect | 중점 | prerequisite_for | 평행사변형의 대각선이 서로를 이등분 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_triangle_midpoint_theorem | 중점 | prerequisite_for | 삼각형의 중점연결정리 | medium | official_dual_source |
