# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 27
- grade: 중1(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 작도와 합동
- priority tier: highest
- workplan score: 125
- concepts: 29
- edges touching unit: 140
- cross-unit edges: 36
- low confidence concepts: 3
- low confidence edges: 12

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 2 |
| misconception_risk | 3 |
| procedure | 11 |
| property | 6 |
| sub_concept | 1 |
| term | 6 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 29 |
| contrasts_with | 3 |
| often_confused_with | 9 |
| prerequisite_for | 52 |
| related_to | 6 |
| represented_by | 4 |
| used_in | 37 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_congruence_correspondence_order | 합동 판별에서 대응 순서를 무시하는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 합동 판별 오개념이다. 교과서 문항 근거 확인 전까지 low로 둔다. |
| m1_mis_construction_measurement_tools | 눈금자나 각도기로 재서 작도하는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 교과서형 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 low로 둔다. |
| m1_mis_sas_nonincluded_angle | 끼인각이 아닌 각을 SAS 조건에 쓰는 오류 | misconception_risk | official_dual_source | 공식 성취기준에서 직접 명명되지 않은 합동 조건 판별 오개념이다. 교과서 문항 근거 확인 전까지 low로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_congruence_similarity__often_confused_with__m1_geo_congruence | 합동과 닮음을 같은 관계로 보는 오류 | often_confused_with | 합동 | low | official_dual_source |
| m1_geo_domain__contains__m1_geo_construction_congruence_unit | 도형과 측정 | contains | 작도와 합동 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_construction | 각 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_copy_angle_construction | 각 | prerequisite_for | 주어진 각과 크기가 같은 각 작도 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_corresponding_angles_in_congruence | 각 | prerequisite_for | 합동에서의 대응하는 각 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_angle | 각 | prerequisite_for | 대각 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_opposite_side | 각 | prerequisite_for | 대변 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_triangle_construction | 각 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_construction_congruence_unit | 기본 도형 | prerequisite_for | 작도와 합동 | high | official_dual_source |
| m1_geo_congruence__prerequisite_for__m1_geo_similarity | 합동 | prerequisite_for | 닮음 | high | official_dual_source |
| m1_geo_construction_congruence_unit__prerequisite_for__m1_geo_triangle_quadrilateral_unit | 작도와 합동 | prerequisite_for | 삼각형과 사각형의 성질 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_copy_segment_construction | 두 점 사이의 거리 | prerequisite_for | 주어진 선분과 길이가 같은 선분 작도 | medium | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_triangle_construction | 두 점 사이의 거리 | prerequisite_for | 삼각형의 작도 | high | official_dual_source |
| m1_geo_line__prerequisite_for__m1_geo_construction | 직선 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_line_segment__prerequisite_for__m1_geo_copy_segment_construction | 선분 | prerequisite_for | 주어진 선분과 길이가 같은 선분 작도 | medium | official_dual_source |
| m1_geo_line_segment__prerequisite_for__m1_geo_corresponding_sides_in_congruence | 선분 | prerequisite_for | 합동에서의 대응하는 변 | medium | official_dual_source |
| m1_geo_opposite_angle__prerequisite_for__m1_geo_parallelogram_opposite_sides_angles | 대각 | prerequisite_for | 평행사변형의 마주 보는 변과 각 | high | official_dual_source |
| m1_geo_opposite_side__prerequisite_for__m1_geo_parallelogram_opposite_sides_angles | 대변 | prerequisite_for | 평행사변형의 마주 보는 변과 각 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_construction | 점 | prerequisite_for | 작도 | high | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_corresponding_vertices_in_congruence | 점 | prerequisite_for | 합동에서의 대응하는 꼭짓점 | medium | official_dual_source |
| m1_geo_triangle__prerequisite_for__m1_geo_triangle_construction_asa | 삼각형 | prerequisite_for | 한 변과 그 양 끝각이 주어진 삼각형 작도 | medium | official_dual_source |
| m1_geo_triangle__prerequisite_for__m1_geo_triangle_construction_sas | 삼각형 | prerequisite_for | 두 변과 그 끼인각이 주어진 삼각형 작도 | medium | official_dual_source |
| m1_geo_triangle__prerequisite_for__m1_geo_triangle_construction_sss | 삼각형 | prerequisite_for | 세 변이 주어진 삼각형 작도 | medium | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_incenter | 삼각형의 합동 조건 | prerequisite_for | 내심 | high | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_isosceles_properties | 삼각형의 합동 조건 | prerequisite_for | 이등변삼각형의 성질 | high | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_isosceles_property_proof | 삼각형의 합동 조건 | prerequisite_for | 이등변삼각형 성질 정당화하기 | high | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_isosceles_triangle | 삼각형의 합동 조건 | prerequisite_for | 이등변삼각형 | high | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_proof | 삼각형의 합동 조건 | prerequisite_for | 증명 | high | official_dual_source |
| m1_geo_triangle_congruence_conditions__prerequisite_for__m1_geo_right_triangle_congruence_conditions | 삼각형의 합동 조건 | prerequisite_for | 직각삼각형의 합동 조건 | medium | official_dual_source |
| m1_geo_triangle__used_in__m1_geo_triangle_congruence_conditions | 삼각형 | used_in | 삼각형의 합동 조건 | medium | official_dual_source |
| m1_geo_triangle__used_in__m1_geo_triangle_construction | 삼각형 | used_in | 삼각형의 작도 | medium | official_dual_source |
| m1_geo_triangle_congruence_conditions__used_in__m1_geo_proof | 삼각형의 합동 조건 | used_in | 증명 | high | official_dual_source |
| m1_geo_triangle_congruence_judgement__used_in__m1_geo_justification | 삼각형의 합동 판별 | used_in | 정당화 | medium | official_dual_source |
| m1_geo_congruence__contrasts_with__m1_geo_similarity | 합동 | contrasts_with | 닮음 | high | official_dual_source |
| m1_geo_similarity__contrasts_with__m1_geo_congruence | 닮음 | contrasts_with | 합동 | high | official_dual_source |
| m1_geo_trig_opposite_side__related_to__m1_geo_opposite_side | 기준각의 대변 | related_to | 대변 | medium | official_dual_source |
