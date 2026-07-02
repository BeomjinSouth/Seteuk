# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 9
- grade: 중3(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 원의 성질
- priority tier: highest
- workplan score: 224
- concepts: 33
- edges touching unit: 188
- cross-unit edges: 61
- low confidence concepts: 6
- low confidence edges: 26

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 4 |
| procedure | 3 |
| property | 14 |
| sub_concept | 4 |
| term | 6 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 36 |
| contrasts_with | 3 |
| often_confused_with | 12 |
| prerequisite_for | 88 |
| related_to | 5 |
| represented_by | 5 |
| used_in | 39 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_geo_circle_auxiliary_radius_center | 원의 중심과 반지름 보조선 활용 | procedure | official_dual_source | 보조선 활용은 공식 문서의 정당화 요구에서 추론한 절차다. 교과서 증명 맥락 확인 전까지 낮은 신뢰도로 둔다. |
| m1_geo_semicircle_arc | 반원 | term | official_dual_source | 반원 표현은 원주각 성질의 대표 적용 맥락으로 추출한 잠정 용어다. 교과서 본문 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_circle_proportion_scope | 원과 비례에 관한 성질을 범위에 포함하는 오류 | misconception_risk | official_single_source | 교육과정 유의사항에 근거한 범위 관리 노드다. 교과서 또는 학생 오답 근거 확인 전까지 선수 관계 없이 오개념 위험으로만 둔다. |
| m1_mis_inscribed_central_angle_equal | 원주각과 중심각을 같은 크기로 보는 오류 | misconception_risk | official_dual_source | 원주각 성질에서 추론한 오개념 위험이다. 교과서 예제나 문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_same_chord_arc_scope | 같은 현과 같은 호의 조건을 넓게 적용하는 오류 | misconception_risk | official_dual_source | 공식 성취수준의 성질 적용 맥락에서 추론한 위험이다. 교과서 예제와 오답 근거로 보강한다. |
| m1_mis_tangent_radius | 접선과 반지름의 수직 관계를 놓치는 오류 | misconception_risk | official_dual_source | 교과서 예제나 오답 근거 확인 전까지 선수 관계 없이 오개념 위험으로만 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_geo_arc__prerequisite_for__m1_geo_semicircle_arc | 호 | prerequisite_for | 반원 | low | official_dual_source |
| m1_geo_central_angle__prerequisite_for__m1_geo_circle_auxiliary_radius_center | 중심각 | prerequisite_for | 원의 중심과 반지름 보조선 활용 | low | official_dual_source |
| m1_geo_chord__prerequisite_for__m1_geo_semicircle_arc | 현 | prerequisite_for | 반원 | low | official_dual_source |
| m1_geo_tangent_ratio__contrasts_with__m1_geo_tangent_line | 탄젠트 | contrasts_with | 접선 | low | official_single_source |
| m1_mis_inscribed_central_angle_equal__often_confused_with__m1_geo_central_angle | 원주각과 중심각을 같은 크기로 보는 오류 | often_confused_with | 중심각 | low | official_dual_source |
| m1_mis_proof_observation__often_confused_with__m1_geo_circle_justification | 관찰 결과와 증명을 같은 수준의 근거로 보는 오류 | often_confused_with | 원의 성질 정당화 | low | official_dual_source |
| m1_geo_circle_unit__contains__m1_geo_chord | 원의 성질 | contains | 현 | high | official_dual_source |
| m1_geo_domain__contains__m1_geo_circle_unit | 도형과 측정 | contains | 원의 성질 | high | official_dual_source |
| m1_geo_plane_properties_unit__contains__m1_geo_circle | 평면도형의 성질 | contains | 원 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_inscribed_angle | 각 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_central_inscribed_angle_relation | 호 | prerequisite_for | 중심각과 원주각의 관계 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle | 호 | prerequisite_for | 원주각 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_property | 호 | prerequisite_for | 원주각의 성질 | high | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_inscribed_angle_subtended_arc | 호 | prerequisite_for | 원주각이 보는 호 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_same_arc | 호 | prerequisite_for | 같은 호 | medium | official_dual_source |
| m1_geo_arc__prerequisite_for__m1_geo_same_arc_same_chord_relation | 호 | prerequisite_for | 같은 호와 같은 현의 대응 관계 | medium | official_dual_source |
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
| m1_geo_circle__prerequisite_for__m1_geo_circumcircle | 원 | prerequisite_for | 외접원 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_incircle | 원 | prerequisite_for | 내접원 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_secant | 원 | prerequisite_for | 할선 | high | official_single_source |
| m1_geo_circle__prerequisite_for__m1_geo_sector | 원 | prerequisite_for | 부채꼴 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_chord_center_distance | 두 점 사이의 거리 | prerequisite_for | 원 중심에서 현까지의 거리 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_circle_radius | 길이 | prerequisite_for | 원의 반지름 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_equal_tangent_lengths_from_point | 길이 | prerequisite_for | 한 점에서 그은 두 접선의 길이가 같음 | medium | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_tangent_line | 직선 | prerequisite_for | 접선 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_chord_center_perpendicular_bisects | 중점 | prerequisite_for | 원의 중심에서 현에 내린 수선은 현을 이등분 | medium | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_chord_midpoint_center_perpendicular | 중점 | prerequisite_for | 원 중심과 현의 중점을 이은 직선은 현에 수직 | medium | official_dual_source |
| m1_geo_perpendicular__prerequisite_for__m1_geo_chord_center_distance | 직교 | prerequisite_for | 원 중심에서 현까지의 거리 | medium | official_dual_source |
| m1_geo_perpendicular__prerequisite_for__m1_geo_chord_center_perpendicular_bisects | 직교 | prerequisite_for | 원의 중심에서 현에 내린 수선은 현을 이등분 | medium | official_dual_source |
