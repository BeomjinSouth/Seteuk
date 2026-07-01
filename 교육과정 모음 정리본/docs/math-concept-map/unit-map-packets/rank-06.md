# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 6
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 삼각형과 사각형의 성질
- priority tier: highest
- workplan score: 204
- concepts: 47
- edges touching unit: 219
- cross-unit edges: 65
- low confidence concepts: 4
- low confidence edges: 19

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 11 |
| misconception_risk | 4 |
| procedure | 7 |
| property | 15 |
| sub_concept | 1 |
| term | 9 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 56 |
| contrasts_with | 9 |
| often_confused_with | 14 |
| prerequisite_for | 98 |
| related_to | 4 |
| represented_by | 2 |
| used_in | 36 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_mis_circumcenter_incenter | 외심과 내심을 혼동하는 오류 | misconception_risk | official_dual_source | 공식 문서의 외심·내심 대비에서 설정한 오개념 위험 노드다. 교과서 문제나 학생 답안 근거로 보강해야 한다. |
| m1_mis_isosceles_base_vertex_angle_confusion | 이등변삼각형의 밑각과 꼭지각을 혼동하는 오류 | misconception_risk | official_dual_source | 교과서 그림, 예제, 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |
| m1_mis_proof_observation | 관찰 결과와 증명을 같은 수준의 근거로 보는 오류 | misconception_risk | official_dual_source | 교과서 예제, 학생 답안, 문제 해설에서 반복되는 오류 근거가 들어오면 세부 유형으로 나눈다. |
| m1_mis_quadrilateral_inclusion_relation | 사각형 포함 관계를 반대로 이해하는 오류 | misconception_risk | official_dual_source | 교과서 분류 문제와 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_mis_proof_observation__often_confused_with__m1_geo_circle_justification | 관찰 결과와 증명을 같은 수준의 근거로 보는 오류 | often_confused_with | 원의 성질 정당화 | low | official_dual_source |
| m1_geo_triangle_midpoint_theorem__related_to__m1_geo_centroid | 삼각형의 중점연결정리 | related_to | 무게중심 | low | official_dual_source |
| m1_geo_domain__contains__m1_geo_triangle_quadrilateral_unit | 도형과 측정 | contains | 삼각형과 사각형의 성질 | high | official_dual_source |
| m1_geo_similarity_unit__contains__m1_geo_centroid | 도형의 닮음 | contains | 무게중심 | high | official_dual_source |
| m1_geo_similarity_unit__contains__m1_geo_median | 도형의 닮음 | contains | 중선 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_angle_bisector | 각 | prerequisite_for | 각의 이등분선 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_isosceles_base_angles | 각 | prerequisite_for | 이등변삼각형의 두 밑각 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_isosceles_vertex_angle | 각 | prerequisite_for | 이등변삼각형의 꼭지각 | medium | official_dual_source |
| m1_geo_angle_measure__prerequisite_for__m1_geo_angle_bisector | 각의 크기 | prerequisite_for | 각의 이등분선 | medium | official_dual_source |
| m1_geo_basic_unit__prerequisite_for__m1_geo_justification | 기본 도형 | prerequisite_for | 정당화 | high | official_dual_source |
| m1_geo_centroid__prerequisite_for__m1_geo_centroid_from_parallel_ratio | 무게중심 | prerequisite_for | 평행선과 선분의 비로 무게중심 찾기 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_circumcircle | 원 | prerequisite_for | 외접원 | high | official_dual_source |
| m1_geo_circle__prerequisite_for__m1_geo_incircle | 원 | prerequisite_for | 내접원 | high | official_dual_source |
| m1_geo_construction_congruence_unit__prerequisite_for__m1_geo_triangle_quadrilateral_unit | 작도와 합동 | prerequisite_for | 삼각형과 사각형의 성질 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_parallelogram_diagonals_bisect | 대각선 | prerequisite_for | 평행사변형의 대각선이 서로를 이등분 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_quadrilateral_diagonal_properties | 대각선 | prerequisite_for | 사각형의 대각선에 관한 성질 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_rectangle_diagonals_equal | 대각선 | prerequisite_for | 직사각형의 대각선의 길이가 같음 | high | official_dual_source |
| m1_geo_diagonal__prerequisite_for__m1_geo_rhombus_diagonals_perpendicular | 대각선 | prerequisite_for | 마름모의 대각선이 서로 수직 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_circumcenter_equal_vertex_distance | 두 점 사이의 거리 | prerequisite_for | 외심에서 세 꼭짓점까지의 거리 | high | official_dual_source |
| m1_geo_distance_between_two_points__prerequisite_for__m1_geo_incenter_equal_side_distance | 두 점 사이의 거리 | prerequisite_for | 내심에서 세 변까지의 거리 | high | official_dual_source |
| m1_geo_foot_of_perpendicular__prerequisite_for__m1_geo_incenter_equal_side_distance | 수선의 발 | prerequisite_for | 내심에서 세 변까지의 거리 | high | official_dual_source |
| m1_geo_justification__prerequisite_for__m1_geo_pythagorean_justification | 정당화 | prerequisite_for | 피타고라스 정리의 정당화 | high | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_isosceles_equal_sides | 길이 | prerequisite_for | 이등변삼각형의 두 같은 변 | medium | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_rectangle_diagonals_equal | 길이 | prerequisite_for | 직사각형의 대각선의 길이가 같음 | high | official_dual_source |
| m1_geo_length__prerequisite_for__m1_geo_rhombus | 길이 | prerequisite_for | 마름모 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_median | 중점 | prerequisite_for | 중선 | high | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_parallelogram_diagonals_bisect | 중점 | prerequisite_for | 평행사변형의 대각선이 서로를 이등분 | high | official_dual_source |
| m1_geo_opposite_angle__prerequisite_for__m1_geo_parallelogram_opposite_sides_angles | 대각 | prerequisite_for | 평행사변형의 마주 보는 변과 각 | high | official_dual_source |
| m1_geo_opposite_side__prerequisite_for__m1_geo_parallelogram_opposite_sides_angles | 대변 | prerequisite_for | 평행사변형의 마주 보는 변과 각 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_parallelogram | 평행선 | prerequisite_for | 평행사변형 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_trapezoid | 평행선 | prerequisite_for | 사다리꼴 | medium | official_dual_source |
| m1_geo_parallel_segment_ratio__prerequisite_for__m1_geo_centroid | 평행선 사이의 선분의 길이의 비 | prerequisite_for | 무게중심 | high | official_dual_source |
| m1_geo_perpendicular__prerequisite_for__m1_geo_rectangle | 직교 | prerequisite_for | 직사각형 | high | official_dual_source |
| m1_geo_perpendicular__prerequisite_for__m1_geo_rhombus_diagonals_perpendicular | 직교 | prerequisite_for | 마름모의 대각선이 서로 수직 | high | official_dual_source |
| m1_geo_perpendicular_bisector__prerequisite_for__m1_geo_circumcenter | 수직이등분선 | prerequisite_for | 외심 | high | official_dual_source |
| m1_geo_perpendicular_bisector__prerequisite_for__m1_geo_circumcenter_perpendicular_bisectors | 수직이등분선 | prerequisite_for | 외심과 세 변의 수직이등분선 | high | official_dual_source |
| m1_geo_perpendicular_bisector__prerequisite_for__m1_geo_construct_circumcenter | 수직이등분선 | prerequisite_for | 외심 찾기 | high | official_dual_source |
| m1_geo_perpendicular_bisector__prerequisite_for__m1_geo_isosceles_vertex_angle_bisector_property | 수직이등분선 | prerequisite_for | 이등변삼각형의 꼭지각 이등분선 성질 | medium | official_dual_source |
| m1_geo_polygon__prerequisite_for__m1_geo_quadrilateral | 다각형 | prerequisite_for | 사각형 | high | official_dual_source |
| m1_geo_proof__prerequisite_for__m1_geo_circle_justification | 증명 | prerequisite_for | 원의 성질 정당화 | high | official_dual_source |
