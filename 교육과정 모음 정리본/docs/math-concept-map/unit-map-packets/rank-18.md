# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 18
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 입체도형의 성질
- priority tier: highest
- workplan score: 128
- concepts: 29
- edges touching unit: 123
- cross-unit edges: 19
- low confidence concepts: 4
- low confidence edges: 14

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 9 |
| property | 1 |
| representation | 3 |
| sub_concept | 3 |
| term | 7 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 29 |
| contrasts_with | 4 |
| often_confused_with | 6 |
| prerequisite_for | 43 |
| related_to | 7 |
| used_in | 34 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_geo_orthographic_drawing | 겨냥도 | representation | official_single_source | 현재는 연구보고서 p.173의 보조 성취수준 맥락만 확인된다. 중학교 교과서 본문 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_complex_area_volume_scope | 지나치게 복잡한 넓이·부피 변형 문제 범위 혼동 | misconception_risk | official_single_source | 교수·학습 및 평가 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_solid_net_adjacency | 전개도에서 붙는 면의 이웃 관계를 잘못 판단하는 오류 | misconception_risk | official_single_source | 전개도 가능/불가능 구별 맥락에서 추론한 오개념 위험이다. 교과서 예제·문제·오답 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_surface_area_volume | 겉넓이와 부피를 같은 측정량으로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_domain__contains__m1_geo_solid_unit | 도형과 측정 | contains | 입체도형의 성질 | high | official_dual_source |
| m1_geo_area__prerequisite_for__m1_geo_net_surface_area_strategy | 넓이 | prerequisite_for | 전개도로 겉넓이 구하기 | medium | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_axis_of_rotation | 직선 | prerequisite_for | 회전축 | high | official_dual_source |
| m1_geo_line_segment__prerequisite_for__m1_geo_solid_edge | 선분 | prerequisite_for | 입체도형의 모서리 | medium | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_frustum_pyramid | 평행선 | prerequisite_for | 각뿔대 | high | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_solid_cross_section | 평면 | prerequisite_for | 입체도형의 단면 | medium | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_solid_cross_section_prediction | 평면 | prerequisite_for | 단면 모양 예상하기 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_rotation_generation | 평면도형의 성질 | prerequisite_for | 평면도형을 회전시켜 회전체 만들기 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_face | 평면도형의 성질 | prerequisite_for | 입체도형의 면 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_net | 평면도형의 성질 | prerequisite_for | 전개도 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_of_revolution | 평면도형의 성질 | prerequisite_for | 회전체 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_unit | 평면도형의 성질 | prerequisite_for | 입체도형의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_surface_area | 평면도형의 성질 | prerequisite_for | 겉넓이 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_solid_vertex | 점 | prerequisite_for | 입체도형의 꼭짓점 | medium | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_polyhedron | 다각형 | prerequisite_for | 다면체 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_regular_polyhedron | 다각형 | prerequisite_for | 정다면체 | high | official_dual_source |
| m1_geo_area__used_in__m1_geo_surface_area | 넓이 | used_in | 겉넓이 | medium | official_dual_source |
| m1_geo_figure__used_in__m1_geo_solid_unit | 도형 | used_in | 입체도형의 성질 | medium | official_dual_source |
| m1_geo_convex_polyhedron_scope__related_to__m1_geo_convex_polygon_scope | 볼록한 다면체 범위 | related_to | 볼록다각형 범위 | medium | official_single_source |
