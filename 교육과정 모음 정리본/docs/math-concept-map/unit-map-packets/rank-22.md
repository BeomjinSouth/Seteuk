# Pilot Unit Map

This generated packet turns the highest-priority textbook evidence unit into a compact concept hierarchy review map.

## Target Unit

- rank: 22
- grade: 중2(교육과정 학년군: 중1-3)
- domain: 도형과 측정
- unit: 도형의 닮음
- priority tier: highest
- workplan score: 147
- concepts: 32
- edges touching unit: 142
- cross-unit edges: 35
- low confidence concepts: 4
- low confidence edges: 16

## Concept Type Distribution

| concept_type | count |
|---|---:|
| core_concept | 3 |
| misconception_risk | 3 |
| procedure | 7 |
| property | 13 |
| sub_concept | 1 |
| term | 5 |

## Relationship Distribution

| relationship_type | count |
|---|---:|
| contains | 34 |
| contrasts_with | 3 |
| often_confused_with | 6 |
| prerequisite_for | 53 |
| related_to | 3 |
| represented_by | 7 |
| used_in | 36 |

## Low Confidence Concepts

| concept_id | label_ko | type | evidence_depth | notes |
|---|---|---|---|---|
| m1_geo_similarity_ratio_order | 닮음비의 순서 | sub_concept | official_dual_source | 공식 성취기준의 닮음비 구하기에서 추론한 세부 주의점이다. 교과서 예제 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_congruence_similarity | 합동과 닮음을 같은 관계로 보는 오류 | misconception_risk | official_dual_source |  |
| m1_mis_similarity_ratio_noncorresponding_sides | 대응하지 않는 변끼리 닮음비를 세우는 오류 | misconception_risk | official_dual_source | 도형의 대응과 닮음비 계산에서 추론한 오개념 위험이다. 교과서 예제·문항 근거 확인 전까지 낮은 신뢰도로 둔다. |
| m1_mis_similarity_ratio_reversal | 닮음비의 순서를 거꾸로 놓는 오류 | misconception_risk | official_dual_source | 교과서의 반복 문제 또는 학생 답안 근거가 들어오기 전까지 낮은 신뢰도로 둔다. |

## Cross-Unit Edges

| edge_id | source | relationship | target | confidence | evidence_depth |
|---|---|---|---|---|---|
| m1_num_ratio__used_in__m1_geo_parallel_segment_ratio | 비 | used_in | 평행선 사이의 선분의 길이의 비 | low | official_dual_source |
| m1_num_ratio__used_in__m1_geo_similarity_ratio | 비 | used_in | 닮음비 | low | official_dual_source |
| m1_mis_congruence_similarity__often_confused_with__m1_geo_congruence | 합동과 닮음을 같은 관계로 보는 오류 | often_confused_with | 합동 | low | official_dual_source |
| m1_geo_similarity_ratio__related_to__m1_geo_trigonometric_ratio | 닮음비 | related_to | 삼각비 | low | official_dual_source |
| m1_geo_triangle_midpoint_theorem__related_to__m1_geo_centroid | 삼각형의 중점연결정리 | related_to | 무게중심 | low | official_dual_source |
| m1_geo_centroid__contains__m1_geo_centroid_median_concurrency | 무게중심 | contains | 세 중선은 한 점에서 만남 | medium | official_dual_source |
| m1_geo_centroid__contains__m1_geo_centroid_two_to_one_ratio | 무게중심 | contains | 무게중심은 중선을 2:1로 나눔 | medium | official_dual_source |
| m1_geo_domain__contains__m1_geo_similarity_unit | 도형과 측정 | contains | 도형의 닮음 | high | official_dual_source |
| m1_geo_similarity_unit__contains__m1_geo_centroid | 도형의 닮음 | contains | 무게중심 | high | official_dual_source |
| m1_geo_similarity_unit__contains__m1_geo_median | 도형의 닮음 | contains | 중선 | high | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_correspondence | 각 | prerequisite_for | 도형의 대응 | medium | official_dual_source |
| m1_geo_angle__prerequisite_for__m1_geo_corresponding_angles_in_similarity | 각 | prerequisite_for | 대응하는 각 | medium | official_dual_source |
| m1_geo_centroid__prerequisite_for__m1_geo_centroid_from_parallel_ratio | 무게중심 | prerequisite_for | 평행선과 선분의 비로 무게중심 찾기 | high | official_dual_source |
| m1_geo_congruence__prerequisite_for__m1_geo_similarity | 합동 | prerequisite_for | 닮음 | high | official_dual_source |
| m1_geo_line_segment__prerequisite_for__m1_geo_corresponding_sides_in_similarity | 선분 | prerequisite_for | 대응하는 변 | medium | official_dual_source |
| m1_geo_median__prerequisite_for__m1_geo_centroid_location_by_median_ratio | 중선 | prerequisite_for | 중선 위 2:1 비로 무게중심 위치 찾기 | medium | official_dual_source |
| m1_geo_median__prerequisite_for__m1_geo_centroid_median_concurrency | 중선 | prerequisite_for | 세 중선은 한 점에서 만남 | medium | official_dual_source |
| m1_geo_midpoint__prerequisite_for__m1_geo_triangle_midpoint_theorem | 중점 | prerequisite_for | 삼각형의 중점연결정리 | medium | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_parallel_segment_ratio | 평행선 | prerequisite_for | 평행선 사이의 선분의 길이의 비 | high | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_three_parallel_lines_segment_ratio | 평행선 | prerequisite_for | 여러 평행선이 두 직선에서 만드는 선분의 비 | medium | official_dual_source |
| m1_geo_parallel_lines__prerequisite_for__m1_geo_triangle_parallel_segment_ratio | 평행선 | prerequisite_for | 삼각형에서 한 변에 평행한 직선이 만드는 선분의 비 | medium | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_correspondence | 점 | prerequisite_for | 도형의 대응 | medium | official_dual_source |
| m1_geo_point__prerequisite_for__m1_geo_corresponding_vertices | 점 | prerequisite_for | 대응하는 꼭짓점 | medium | official_dual_source |
| m1_geo_triangle__prerequisite_for__m1_geo_triangle_parallel_segment_ratio | 삼각형 | prerequisite_for | 삼각형에서 한 변에 평행한 직선이 만드는 선분의 비 | medium | official_dual_source |
| m1_geo_triangle_quadrilateral_unit__prerequisite_for__m1_geo_similarity_unit | 삼각형과 사각형의 성질 | prerequisite_for | 도형의 닮음 | high | official_dual_source |
| m1_geo_centroid__used_in__m1_geo_centroid_from_parallel_ratio | 무게중심 | used_in | 평행선과 선분의 비로 무게중심 찾기 | high | official_dual_source |
| m1_geo_figure__used_in__m1_geo_similarity_unit | 도형 | used_in | 도형의 닮음 | medium | official_dual_source |
| m1_geo_length__used_in__m1_geo_parallel_segment_ratio | 길이 | used_in | 평행선 사이의 선분의 길이의 비 | medium | official_dual_source |
| m1_geo_median__used_in__m1_geo_centroid_from_parallel_ratio | 중선 | used_in | 평행선과 선분의 비로 무게중심 찾기 | medium | official_dual_source |
| m1_geo_median__used_in__m1_geo_centroid_median_concurrency | 중선 | used_in | 세 중선은 한 점에서 만남 | medium | official_dual_source |
| m1_geo_triangle__used_in__m1_geo_triangle_similarity_conditions | 삼각형 | used_in | 삼각형의 닮음 조건 | medium | official_dual_source |
| m1_geo_congruence__contrasts_with__m1_geo_similarity | 합동 | contrasts_with | 닮음 | high | official_dual_source |
| m1_geo_parallel_angle_properties__contrasts_with__m1_geo_parallel_segment_ratio | 평행선에서 동위각과 엇각의 성질 | contrasts_with | 평행선 사이의 선분의 길이의 비 | medium | official_dual_source |
| m1_geo_similarity__contrasts_with__m1_geo_congruence | 닮음 | contrasts_with | 합동 | high | official_dual_source |
| m1_geo_similarity_unit__related_to__m1_geo_pythagorean_unit | 도형의 닮음 | related_to | 피타고라스 정리 | medium | official_dual_source |
