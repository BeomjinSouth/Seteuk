# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 20
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 원의 성질
- priority tier: high
- workplan score: 90
- concepts: 13
- edges touching unit: 74
- cross-unit edges: 31
- low confidence concepts: 2
- low confidence edges: 9

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 2 |
| procedure | 1 |
| property | 4 |
| term | 4 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 15 |
| contrasts_with | 3 |
| often_confused_with | 4 |
| prerequisite_for | 33 |
| related_to | 1 |
| represented_by | 4 |
| used_in | 14 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_circle_proportion_scope | 원과 비례에 관한 성질을 범위에 포함하는 오류 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. |
| m1_mis_tangent_radius | 접선과 반지름의 수직 관계를 놓치는 오류 | misconception_risk | official_dual_source |  |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_similarity_ratio__prerequisite_for__m1_mis_circle_proportion_scope | 닮음비 | prerequisite_for | 원과 비례에 관한 성질을 범위에 포함하는 오류 | low | official_single_source |
| m1_geo_tangent_ratio__contrasts_with__m1_geo_tangent_line | 탄젠트 | contrasts_with | 접선 | low | official_single_source |
| m1_geo_circle_unit__contains__m1_geo_chord | 원의 성질 | contains | 현 | high | official_dual_source |
| m1_geo_domain__contains__m1_geo_circle_unit | 도형과 측정 | contains | 원의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__contains__m1_geo_circle | 평면도형의 성질 | contains | 원 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_inscribed_angle | 각 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle | 호 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_property | 호 | prerequisite_for | 원주각의 성질 | high | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_circle_chord_property | 현 | prerequisite_for | 원의 현에 관한 성질 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_arc | 원 | prerequisite_for | 호 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_central_angle | 원 | prerequisite_for | 중심각 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_chord | 원 | prerequisite_for | 현 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_circumcircle | 원 | prerequisite_for | 외접원 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_incircle | 원 | prerequisite_for | 내접원 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_secant | 원 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_circle__prerequisite_for__m1_geo_sector | 원 | prerequisite_for | 부채꼴 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_tangent_line | 직선 | prerequisite_for | 접선 | high | official_dual_source |
| m1_geo_plane__prerequisite_for__m1_geo_circle | 평면 | prerequisite_for | 원 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_circle | 점 | prerequisite_for | 원 | high | official_dual_source |
| m1_geo_proof__prerequisite_for__m1_geo_circle_justification | 증명 | prerequisite_for | 원의 성질 정당화 | high | official_dual_source |
| m1_geo_tangent_line__prerequisite_for__m1_geo_incircle | 접선 | prerequisite_for | 내접원 | high | official_dual_source |
| m1_geo_triangle_quadrilateral_unit__prerequisite_for__m1_geo_circle_unit | 삼각형과 사각형의 성질 | prerequisite_for | 원의 성질 | high | official_dual_source |
| m1_geo_circle__represented_by__m1_geo_arc | 원 | represented_by | 호 | high | official_dual_source |
| m1_geo_circle__represented_by__m1_geo_chord | 원 | represented_by | 현 | high | official_dual_source |
| m1_geo_arc__used_in__m1_geo_inscribed_angle_property | 호 | used_in | 원주각의 성질 | high | official_dual_source |
| m1_geo_chord__used_in__m1_geo_circle_chord_property | 현 | used_in | 원의 현에 관한 성질 | high | official_dual_source |
| m1_geo_circle__used_in__m1_geo_sector_arc_length_area | 원 | used_in | 부채꼴의 호의 길이와 넓이 구하기 | medium | official_dual_source |
| m1_geo_justification__used_in__m1_geo_circle_justification | 정당화 | used_in | 원의 성질 정당화 | medium | official_dual_source |
| m1_geo_secant__contrasts_with__m1_geo_tangent_line | 할선 | contrasts_with | 접선 | medium | official_dual_source |
| m1_geo_tangent_line__contrasts_with__m1_geo_secant | 접선 | contrasts_with | 할선 | medium | official_dual_source |
| m1_geo_plane_properties_unit__related_to__m1_geo_circle_unit | 평면도형의 성질 | related_to | 원의 성질 | medium | official_dual_source |
