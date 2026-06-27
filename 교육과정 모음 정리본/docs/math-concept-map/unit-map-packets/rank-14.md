# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 14
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 입체도형의 성질
- priority tier: high
- workplan score: 88
- concepts: 17
- edges touching unit: 74
- cross-unit edges: 13
- low confidence concepts: 2
- low confidence edges: 12

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 2 |
| procedure | 3 |
| representation | 2 |
| sub_concept | 3 |
| term | 4 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 17 |
| contrasts_with | 3 |
| often_confused_with | 6 |
| prerequisite_for | 25 |
| related_to | 2 |
| represented_by | 3 |
| used_in | 18 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_complex_area_volume_scope | 지나치게 복잡한 넓이·부피 변형 문제 범위 혼동 | misconception_risk | official_single_source | 교수·학습 및 평가 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_surface_area_volume | 겉넓이와 부피를 같은 측정량으로 보는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_complex_area_volume_scope__often_confused_with__m1_geo_plane_properties_unit | 지나치게 복잡한 넓이·부피 변형 문제 범위 혼동 | often_confused_with | 평면도형의 성질 | low | official_single_source |
| m1_geo_domain__contains__m1_geo_solid_unit | 도형과 측정 | contains | 입체도형의 성질 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_axis_of_rotation | 직선 | prerequisite_for | 회전축 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_frustum_pyramid | 평행선 | prerequisite_for | 각뿔대 | high | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_solid_cross_section | 평면 | prerequisite_for | 입체도형의 단면 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_net | 평면도형의 성질 | prerequisite_for | 전개도 | medium | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_of_revolution | 평면도형의 성질 | prerequisite_for | 회전체 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_solid_unit | 평면도형의 성질 | prerequisite_for | 입체도형의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__prerequisite_for__m1_geo_surface_area | 평면도형의 성질 | prerequisite_for | 겉넓이 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_polyhedron | 다각형 | prerequisite_for | 다면체 | high | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_regular_polyhedron | 다각형 | prerequisite_for | 정다면체 | high | official_dual_source |
| m1_geo_area__used_in__m1_geo_surface_area | 넓이 | used_in | 겉넓이 | medium | official_dual_source |
| m1_geo_figure__used_in__m1_geo_solid_unit | 도형 | used_in | 입체도형의 성질 | medium | official_dual_source |
