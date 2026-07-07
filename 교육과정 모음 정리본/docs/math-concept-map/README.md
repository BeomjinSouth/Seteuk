# 수학 개념 위계 Map

이 폴더는 2022 개정 중학교 수학 교육과정과 이후 추가될 교과서 원본을 바탕으로, 단원명 수준을 넘어선 미시 개념 노드와 관계 edge를 누적하기 위한 작업 공간이다.

## 현재 범위

- 미시 concept map 대상: 2022 개정 중학교 수학 1~3학년
- 파일럿 단원: 수와 연산 전체, 변화와 관계 전체, 도형과 측정 전체, 자료와 가능성 전체
- 공식 근거: `9수01-01` ~ `9수01-10`, `9수02-01` ~ `9수02-22`, `9수03-01` ~ `9수03-19`, `9수04-01` ~ `9수04-09`
- 교과서 근거: `교과서_원본/` 폴더가 현재 비어 있어 아직 반영하지 못함
- 초1~고3 거시 위계: `k12-spine-*`가 별책8 원문에서 추출한 공통 교육과정 학년군(초1-2, 초3-4, 초5-6, 중1-3) 성취기준 181개와 고등학교 15개 과목 성취기준 254개를 학년군·영역·과목 노드와 선수 관계 edge로 연결한다.
- 작업 범위(2026-07-06 사용자 결정, `../../AGENTS.md`의 Math Concept Map Scope Rules): 시각화·미시 분해·근거 보강은 공통 교육과정(초1~중3)과 고등학교 공통 과목(공통수학1·2, 기본수학1·2)까지만 진행한다. 고등학교 선택 과목은 spine 추출 데이터로만 보존한다. 개념·용어는 공식 원문 추출 텍스트와 페이지 출처로만 반영한다.
- 초등 미시 concept: `elementary-*`가 초등 전체 학년군(초1-2, 초3-4, 초5-6)의 4개 영역 성취기준 121개를 분해한 concept 330개·edge 345개를 담는다.
- 고등 공통 과목 미시 concept: `hs-common-*`가 공통수학1·2 성취기준 39개를 분해한 concept 61개·edge 56개를 담는다. 기본수학1·2는 대체 이수 경로이므로 분해에서 제외했다.

## 현재 데이터 규모

- 개념 노드: 977개
- 관계 edge: 4571개
- source ref: 14509개
- `concepts.json` 출처: 5개
- 로컬 출처 inventory: 5개 그룹

## 산출물

- `SCHEMA.md`: 개념 노드와 관계 edge 스키마
- `source-audit.md`: 사용 가능한 자료, 누락 자료, 출처 우선순위
- `progress.md`: 진행 로그와 다음 작업
- `concepts.json`: 파일럿 개념과 관계의 원본 JSON
- `concepts.csv`: 개념 노드 CSV
- `edges.csv`: 관계 edge CSV
- `graph.mmd`: Mermaid 위계/관계 초안
- `k12-spine-nodes.csv`: 초1~고3 거시 위계 spine의 학년군·영역·과목·성취기준 노드 CSV
- `k12-spine-edges.csv`: 같은 spine의 포함·선수·연계 edge CSV
- `k12-spine.dot`: 학년군·영역 블록·고등 과목 수준의 Graphviz DOT 시각화
- `k12-spine.md`: spine 데이터 규모, 과목별 성취기준 수, 과목 위계 edge 근거 요약
- `k12-spine.html`: 학년군 진행이 가로축, 영역이 세로축인 계층형 위계 그래프. 블록 클릭 시 성취기준 원문 표시. 선택 과목 제외
- `elementary-concepts.json`: 초등 전체 학년군 미시 concept의 원본 JSON
- `elementary-concepts.csv`: 같은 데이터셋의 concept 노드 CSV
- `elementary-edges.csv`: 같은 데이터셋의 관계 edge CSV
- `elementary-pilot.md`: 초등 범위, 출처 규칙, 데이터 규모, 추출 한계 요약
- `hs-common-concepts.json`: 공통수학1·2 미시 concept의 원본 JSON
- `hs-common-concepts.csv`: 같은 데이터셋의 concept 노드 CSV
- `hs-common-edges.csv`: 같은 데이터셋의 관계 edge CSV
- `hs-common-pilot.md`: 공통수학1·2 범위, 출처 규칙, 데이터 규모, 추출 한계 요약
- `achievement-coverage.md`: 공식 성취기준별 연결 concept 요약
- `achievement-coverage.csv`: 공식 성취기준별 연결 concept 기계 판독용 CSV
- `review-queue.md`: `low` 신뢰도 concept의 교과서/출처 보강 검토 목록
- `review-queue.csv`: 검토 목록 기계 판독용 CSV
- `official-term-coverage.md`: 공식 용어·기호가 concept label/alias로 연결되는지 점검한 요약
- `official-term-coverage.csv`: 공식 용어·기호 커버리지 기계 판독용 CSV
- `equivalence-alias-audit.md`: alias, 명시적 동치 edge, 중복 label, 공식 용어 다중 매칭 검토 요약
- `equivalence-alias-audit.csv`: alias·동치·중복 후보 감사의 기계 판독용 CSV
- `research-report-concept-signal.md`: 수학과 성취수준 개발 연구보고서에서 concept label/alias가 출현하는 페이지 후보 요약
- `research-report-concept-signal.csv`: 연구보고서 concept 출현 신호의 기계 판독용 CSV
- `research-report-context-packet.md`: 연구보고서 출현 신호 상위 후보의 page-level 맥락 검토 패킷
- `research-report-context-packet.csv`: 같은 맥락 검토 패킷의 기계 판독용 CSV
- `research-report-source-review.md`: 연구보고서 page 맥락의 source ref 보강 가능성과 제외 대상을 분리한 검토 큐
- `research-report-source-review.csv`: 같은 source review 큐의 기계 판독용 CSV
- `unit-coverage.md`: 학년·영역·단원별 concept/edge/신뢰도 요약
- `unit-coverage.csv`: 단원별 커버리지 기계 판독용 CSV
- `relationship-audit.md`: edge 관계 유형과 고립 concept 여부 감사 요약
- `relationship-audit.csv`: 관계 유형별 edge 분포 기계 판독용 CSV
- `node-edge-consistency-audit.md`: 노드 관계 배열과 edge row 사이의 동기화 검토 큐
- `node-edge-consistency-audit.csv`: 같은 검토 큐의 기계 판독용 CSV
- `related-edge-resolution-queue.md`: `related_ids` 항목의 후보 edge 유형과 처리 우선순위 큐
- `related-edge-resolution-queue.csv`: 같은 해소 큐의 기계 판독용 CSV
- `prerequisite-map.md`: 선수 관계 edge를 단원 전이 기준으로 펼친 요약
- `prerequisite-map.csv`: 선수 관계 edge의 concept 쌍과 출처 근거 기계 판독용 CSV
- `prerequisite-unit-graph.dot`: 선수 관계를 단원 전이 단위로 압축한 Graphviz DOT 시각화
- `source-inventory.md`: 현재 로컬 출처 파일 가용성 요약
- `source-inventory.csv`: 현재 로컬 출처 파일 가용성 기계 판독용 CSV
- `source-ref-audit.md`: concept/edge 출처 근거의 출처·근거 유형별 감사 요약
- `source-ref-audit.csv`: concept/edge 출처 근거의 출처·근거 유형별 기계 판독용 CSV
- `concept-evidence-depth.md`: concept별 공식/교과서 근거 깊이와 교과서 보강 필요 상태 요약
- `concept-evidence-depth.csv`: concept별 근거 깊이 기계 판독용 CSV
- `edge-evidence-depth.md`: edge별 공식/교과서 근거 깊이와 교과서 보강 필요 상태 요약
- `edge-evidence-depth.csv`: edge별 근거 깊이 기계 판독용 CSV
- `textbook-source-audit.md`: 교과서 PDF 원본의 헤더·파일명·해시·출처 manifest 준비 상태 감사 요약
- `textbook-source-audit.csv`: 같은 교과서 원본 준비 상태의 기계 판독용 CSV
- `textbook-extraction-queue.md`: 교과서 PDF 추가 후 단원별 원문 추출 우선순위
- `textbook-extraction-queue.csv`: 교과서 원문 추출 우선순위 기계 판독용 CSV
- `textbook-evidence-packets/index.md`: 전체 단원 교과서 근거 패킷 인덱스
- `textbook-evidence-packets/index.csv`: 같은 인덱스의 기계 판독용 CSV
- `textbook-evidence-packets/rank-01.md`~`rank-34.md`: 전체 34개 단원 교과서 근거 채움용 작업 패킷
- `textbook-evidence-packets/rank-01.csv`~`rank-34.csv`: 같은 패킷의 기계 판독용 CSV
- `textbook-edge-evidence-packets/index.md`: 전체 단원 관계 edge 교과서 근거 패킷 인덱스
- `textbook-edge-evidence-packets/index.csv`: 같은 인덱스의 기계 판독용 CSV
- `textbook-edge-evidence-packets/rank-01.md`~`rank-34.md`: 전체 34개 단원 관계 edge 근거 채움용 작업 패킷
- `textbook-edge-evidence-packets/rank-01.csv`~`rank-34.csv`: 같은 패킷의 기계 판독용 CSV
- `textbook-evidence-workplan.md`: concept 근거 패킷과 관계 edge 근거 패킷을 단원별로 합친 교과서 보강 작업 계획
- `textbook-evidence-workplan.csv`: 같은 작업 계획의 기계 판독용 CSV
- `pilot-unit-map.md`: 최상위 보강 단원 `상자그림과 산점도`의 compact concept hierarchy 검토 지도
- `pilot-unit-map-nodes.csv`: 같은 파일럿 단원의 concept node 검토 CSV
- `pilot-unit-map-edges.csv`: 같은 파일럿 단원에 닿는 관계 edge 검토 CSV
- `pilot-unit-map.dot`: 같은 파일럿 단원의 Graphviz DOT 시각화
- `unit-map-packets/index.md`: 전체 34개 단원의 compact concept hierarchy map 인덱스
- `unit-map-packets/index.csv`: 같은 인덱스의 기계 판독용 CSV
- `unit-map-packets/rank-01.md`~`rank-34.md`: 전체 34개 단원별 compact concept hierarchy 검토 지도
- `unit-map-packets/rank-01-nodes.csv`~`rank-34-nodes.csv`: 단원별 concept node 검토 CSV
- `unit-map-packets/rank-01-edges.csv`~`rank-34-edges.csv`: 단원별 관계 edge 검토 CSV
- `unit-map-packets/rank-01.dot`~`rank-34.dot`: 단원별 Graphviz DOT 시각화
- `legacy-gap-audit.md`: 기존 로컬 위계도와 현재 공식 근거 concept map의 커버리지 비교 요약
- `legacy-gap-audit.csv`: 기존 로컬 위계도 후보의 커버리지 감사 기계 판독용 CSV
- `legacy-gap-resolution.md`: `legacy-gap-audit`의 `needs_review` 후보를 고유 label 단위로 접은 후속 검토 요약
- `legacy-gap-resolution.csv`: 후속 검토 결과의 기계 판독용 CSV
- `legacy-gap-integration-plan.md`: legacy gap resolution 후보를 보수적 통합 액션으로 바꾼 staging 계획
- `legacy-gap-integration-plan.csv`: 같은 통합 계획의 기계 판독용 CSV
- `legacy-gap-source-review.md`: legacy gap 통합 후보별 공식 근거 확인 위치와 검색어 검토 패킷
- `legacy-gap-source-review.csv`: 같은 근거 확인 패킷의 기계 판독용 CSV
- `legacy-gap-evidence-scan.md`: 통합 후보 label이 기존 target source_refs에 직접 보이는지 점검한 증거 신호 요약
- `legacy-gap-evidence-scan.csv`: 같은 증거 신호의 기계 판독용 CSV

## 갱신 방법

```powershell
python docs/math-concept-map/tools/build_pilot.py
python docs/math-concept-map/tools/build_k12_spine.py
python docs/math-concept-map/tools/build_k12_spine_viz.py
python docs/math-concept-map/tools/build_elementary_pilot.py
python docs/math-concept-map/tools/build_hs_common_pilot.py
python docs/math-concept-map/tools/build_coverage_report.py
python docs/math-concept-map/tools/build_relationship_audit.py
python docs/math-concept-map/tools/build_node_edge_consistency_audit.py
python docs/math-concept-map/tools/build_related_edge_resolution_queue.py
python docs/math-concept-map/tools/build_prerequisite_map.py
python docs/math-concept-map/tools/build_source_inventory.py
python docs/math-concept-map/tools/build_source_ref_audit.py
python docs/math-concept-map/tools/build_concept_evidence_depth.py
python docs/math-concept-map/tools/build_edge_evidence_depth.py
python docs/math-concept-map/tools/build_textbook_source_audit.py
python docs/math-concept-map/tools/build_textbook_extraction_queue.py
python docs/math-concept-map/tools/build_textbook_evidence_packet.py --all
python docs/math-concept-map/tools/build_textbook_edge_evidence_packet.py --all
python docs/math-concept-map/tools/build_textbook_evidence_workplan.py
python docs/math-concept-map/tools/build_pilot_unit_map.py --rank 1
python docs/math-concept-map/tools/build_pilot_unit_map.py --all
python docs/math-concept-map/tools/build_legacy_gap_audit.py
python docs/math-concept-map/tools/build_legacy_gap_resolution.py
python docs/math-concept-map/tools/build_legacy_gap_integration_plan.py
python docs/math-concept-map/tools/build_legacy_gap_source_review.py
python docs/math-concept-map/tools/build_legacy_gap_evidence_scan.py
python docs/math-concept-map/tools/build_review_queue.py
python docs/math-concept-map/tools/build_terminology_coverage.py
python docs/math-concept-map/tools/build_equivalence_alias_audit.py
python docs/math-concept-map/tools/build_research_report_concept_signal.py
python docs/math-concept-map/tools/build_research_report_context_packet.py
python docs/math-concept-map/tools/build_research_report_source_review.py
python docs/math-concept-map/tools/build_unit_coverage.py
python docs/math-concept-map/tools/validate_concept_map.py
python docs/math-concept-map/tools/test_build_coverage_report.py
python docs/math-concept-map/tools/test_build_relationship_audit.py
python docs/math-concept-map/tools/test_build_node_edge_consistency_audit.py
python docs/math-concept-map/tools/test_build_related_edge_resolution_queue.py
python docs/math-concept-map/tools/test_build_prerequisite_map.py
python docs/math-concept-map/tools/test_build_source_inventory.py
python docs/math-concept-map/tools/test_build_source_ref_audit.py
python docs/math-concept-map/tools/test_build_concept_evidence_depth.py
python docs/math-concept-map/tools/test_build_edge_evidence_depth.py
python docs/math-concept-map/tools/test_build_textbook_source_audit.py
python docs/math-concept-map/tools/test_build_pilot_edge_sync.py
python docs/math-concept-map/tools/test_build_pilot_coordinate_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_linear_function_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_geometry_foundations.py
python docs/math-concept-map/tools/test_build_pilot_foundational_prerequisites.py
python docs/math-concept-map/tools/test_build_pilot_change_relationships.py
python docs/math-concept-map/tools/test_build_pilot_solid_geometry_research_refs.py
python docs/math-concept-map/tools/test_build_pilot_solid_geometry_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_ratio_foundation.py
python docs/math-concept-map/tools/test_build_pilot_data_representative_refs.py
python docs/math-concept-map/tools/test_build_pilot_data_probability.py
python docs/math-concept-map/tools/test_build_pilot_data_probability_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_integer_rational_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_quadratic_function_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_data_frequency_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_expression_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_linear_equation_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_system_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_calculation_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_factor_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_factor_procedure_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_plane_geometry_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_trig_microconcepts.py
python docs/math-concept-map/tools/test_build_pilot_triangle_quadrilateral_microconcepts.py
python docs/math-concept-map/tools/test_build_textbook_extraction_queue.py
python docs/math-concept-map/tools/test_build_textbook_evidence_packet.py
python docs/math-concept-map/tools/test_build_textbook_edge_evidence_packet.py
python docs/math-concept-map/tools/test_build_textbook_evidence_workplan.py
python docs/math-concept-map/tools/test_build_pilot_unit_map.py
python docs/math-concept-map/tools/test_build_legacy_gap_audit.py
python docs/math-concept-map/tools/test_build_legacy_gap_resolution.py
python docs/math-concept-map/tools/test_build_legacy_gap_integration_plan.py
python docs/math-concept-map/tools/test_build_legacy_gap_source_review.py
python docs/math-concept-map/tools/test_build_legacy_gap_evidence_scan.py
python docs/math-concept-map/tools/test_build_review_queue.py
python docs/math-concept-map/tools/test_build_terminology_coverage.py
python docs/math-concept-map/tools/test_build_equivalence_alias_audit.py
python docs/math-concept-map/tools/test_build_research_report_concept_signal.py
python docs/math-concept-map/tools/test_build_research_report_context_packet.py
python docs/math-concept-map/tools/test_build_research_report_source_review.py
python docs/math-concept-map/tools/test_build_unit_coverage.py
python docs/math-concept-map/tools/test_build_k12_spine.py
python docs/math-concept-map/tools/test_build_k12_spine_viz.py
python docs/math-concept-map/tools/test_build_elementary_pilot.py
python docs/math-concept-map/tools/test_build_hs_common_pilot.py
python docs/math-concept-map/tools/test_validate_concept_map.py
```

검증기는 필수 필드, id 중복, source/ref 무결성, CSV 행 수, Mermaid 파일, 공식 성취기준 60개(`9수01-01`~`9수04-09`)의 concept 근거 커버리지, `review-queue.csv`와 `low` 신뢰도 concept 수 201개의 일치, 공식 용어·기호 168개 커버리지, concept alias 감사 row 1007개, 연구보고서 concept 출현 후보 277개, 연구보고서 context packet 75개 row와 source-review 75개 row, `related-edge-resolution-queue.csv` 0개, `node-edge-consistency-audit.csv` 0개, `prerequisite-map.csv`의 `prerequisite_for` edge 1673개, 고립 concept 0개, concept 977개와 edge 4571개의 근거 깊이, 교과서 PDF 부재 상태의 concept evidence row 977개와 단원 접점 edge row 5394개, workplan pending 6371개, 전체 unit-map concept 977개와 단원 접점 edge row 5394개를 재생성 결과와 일치하게 보존하는지 확인한다.

단원별 고정 테스트는 좌표평면, 일차함수, 도형 기초, 기본 도형, 평면도형, 입체도형, 변화와 관계, 비, 대푯값, 경우의 수와 확률, 상자그림과 산점도, 정수와 유리수, 소인수분해, 이차함수와 그 그래프, 도수분포표와 상대도수, 문자의 사용과 식, 일차방정식, 연립일차방정식, 삼각비, 삼각형과 사각형의 성질, 식의 계산, 다항식의 곱셈과 인수분해, 이차방정식의 보조 출처와 edge 방향을 함께 확인한다. `test_build_pilot_data_box_scatter_microconcepts.py`는 사분위수 계산, 상자그림 구성 요소와 구간 해석, 같은 눈금 비교, 두 변량 대응표, 산점도 점·축·경향·상관관계 강약 해석, 오개념 prerequisite 제거를 고정한다. `test_build_pilot_plane_geometry_microconcepts.py`는 다각형의 내각·외각의 합, 각의 성질 일반화, 대각선 개수 구하기, 부채꼴의 중심각과 호의 관계, 호의 길이·넓이 구하기, 부채꼴 비례 추론, 오개념 prerequisite 제거를 고정한다. `test_build_pilot_calculation_microconcepts.py`는 같은 밑의 거듭제곱 계산, 단항식의 계수·문자 부분 분해, 다항식 동류항 모으기, 괄호와 부호 처리, 단항식의 분배, 다항식÷단항식의 항별 나눗셈과 범위 확인, 오개념 prerequisite 제거를 고정한다. `test_build_pilot_factor_procedure_microconcepts.py`는 전개식, 다항식의 곱 전개하기, 공식 선택, 공통인수로 묶기, 공식을 이용한 인수분해, 합과 곱이 맞는 수 찾기, 교차항 계수 확인, 완전제곱식의 가운데 항 확인, 전개로 인수분해 결과 확인, `formula_scope` 중심 noisy prerequisite 제거를 고정한다. `test_build_pilot_system_microconcepts.py`는 공통 해 조건, 해의 순서쌍 표현, 해 확인, 소거할 미지수의 계수 맞추기, 두 방정식 더하거나 빼기, 되대입, 대입법 세부 절차, 두 미지수 정하기, 두 조건을 두 방정식으로 나타내기, 활용 문제 해결, 풀이 과정 설명, 문제 상황 해석, 오개념 prerequisite 제거, 좌표·그래프 relation edge 재지정을 고정한다. `test_build_pilot_trig_microconcepts.py`는 기준각, 빗변, 기준각의 대변·이웃변, 사인·코사인·탄젠트의 비 표현, 삼각비 값의 각도 범위, 삼각비의 값 표, 특수각 값 찾기, 거리·높이 직각삼각형 모델링, 삼각비 선택 절차, 오개념 prerequisite 제거와 broad 단원 prerequisite 약화를 고정한다. `test_build_pilot_triangle_quadrilateral_microconcepts.py`는 이등변삼각형의 같은 변·밑변·꼭지각·밑각, 밑각 성질과 꼭지각 이등분선 성질, 직각삼각형 합동 조건, 외심·내심의 구성 성질, 외접원·내접원 반지름, 평행사변형·직사각형·마름모·정사각형·사다리꼴의 성질과 포함 관계, 오개념 prerequisite 제거를 고정한다. `test_build_pilot_solid_geometry_microconcepts.py`는 면·모서리·꼭짓점 찾기, 겨냥도, 전개도 그리기와 판별, 단면 모양 예상, 회전체 생성, 전개도 기반 겉넓이 전략, 볼록한 다면체 범위, 전개도 이웃 관계 오개념과 noisy prerequisite/representation edge 제거를 고정한다. `test_build_pilot_prime_factor_microconcepts.py`는 소인수분해 뜻 설명, 안내된 절차, 소수·합성수 판별, 나눗셈을 이용한 소인수분해, 거듭제곱 정리, 1의 소수/합성수 제외, 공약수·공배수·공통 소인수, 최대공약수/최소공배수 소인수 선택 절차, 서로소 판별, 오개념 노드 confidence 유지와 noisy prerequisite edge 제거를 고정한다. `test_build_pilot_square_root_microconcepts.py`는 제곱수, 제곱근 구하기, 근호 표현, 근호 안의 수, 근호식 계산 세분화와 오개념 prerequisite 제거를 별도로 고정한다. `achievement-coverage.*`는 같은 성취기준 추출 로직을 사용해 사람용/기계용 검토 표로 재생성한다.

`test_build_pilot_inequality_microconcepts.py`는 일차부등식의 부등호·해 범위·수직선 표현, 대입값에 따른 참거짓, 이상·이하·초과·미만 언어 표현, 양변 일차식 정리, 미지수항·상수항 정리, 계수 부호 확인, 상황 가능한 값 범위, 오개념 prerequisite 제거를 고정한다.

`research-report-source-review.*`는 `research-report-context-packet.*`의 후보 중 검토 대상 67개 row를 source ref 후보, 이미 반영한 source ref, 제외 대상으로 다시 분류하고, 모든 row의 `source_ref_upgrade_allowed: no` 상태를 보존하는지 검증한다.

`review-queue.*`는 아직 교과서 본문·예제·오답 근거로 확정하지 못한 `low` 신뢰도 concept을 모아 다음 출처 보강 순서를 정한다.

`official-term-coverage.*`는 공식 문서 용어·기호가 `concepts.json`의 `label_ko` 또는 `aliases`로 연결되는지 점검한다.

`equivalence-alias-audit.*`는 concept 노드에 보존된 alias, 명시적 `equivalent_to` edge, 같은 `label_ko`를 공유하는 concept, 공식 용어가 여러 concept에 매칭되는 경우를 분리해 감사한다. 이 산출물의 중복 label과 다중 매칭 row는 자동 병합 대상이 아니라, 단원 범위 차이와 미시 개념 분리 필요성을 확인한 뒤 alias 보존, 동치 edge 추가, 또는 별도 concept 유지 중 하나를 결정하기 위한 검토 큐이다.

`research-report-concept-signal.*`는 한국교육과정평가원의 수학과 성취수준 개발 연구보고서 PDF를 페이지 단위로 읽고, 현재 concept의 `label_ko`와 2자 이상 alias가 출현하는 페이지 후보를 기록한다. 이 산출물은 원문 맥락 확인 전 자동 source_ref 승격이나 confidence 변경을 하지 않으며, 교과서 PDF가 없는 상태에서 보조 공식 문서로 검토할 후보만 좁힌다.

`unit-coverage.*`는 다음 교과서 보강을 학년·영역·단원 단위로 반복하기 위한 현황판이다.

`relationship-audit.*`는 포함·선수·표현·활용·대조·오개념 관계가 실제 edge로 연결되었는지와 고립 concept 여부를 점검한다.

`node-edge-consistency-audit.*`는 `parent_ids`, `prerequisite_ids`, `related_ids` 배열과 명시적 edge row 사이의 비동기 항목을 검토 큐로 만든다. 이 산출물의 row는 자동 수정 대상이 아니라, 공식 문서와 교과서 근거를 보며 edge 추가·배열 정리·관계 유형 조정을 결정하기 위한 작업 목록이다.

`related-edge-resolution-queue.*`는 `node-edge-consistency-audit.*`에 남은 `missing_edge_for_related_id` row를 별도로 펼쳐, 후보 관계 유형과 우선순위를 붙인다. 후보 유형은 확정 edge가 아니라 검토 힌트이며, 공식 문서 또는 교과서 본문 근거를 확인한 뒤 `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, `used_in` 중 하나로 처리한다.

현재 `related-edge-resolution-queue.*`는 0건이며, 새 concept 또는 `related_ids`가 추가될 때 같은 방식으로 다시 채운다.

`prerequisite-map.*`는 `prerequisite_for` 관계를 concept 쌍, 단원 전이 범위, 공식 근거 요약으로 펼쳐 선수 개념 흐름을 사람이 검토할 수 있게 한다. `prerequisite-unit-graph.dot`는 같은 정보를 단원 전이 그래프로 압축해 선수 흐름을 시각적으로 확인하게 한다.

`textbook-evidence-packets/*`는 단원별 concept을 교과서 근거 채움용 worksheet로 나눈다. 각 row는 빈 근거 슬롯뿐 아니라 `required_evidence_fields`와 `evidence_focus`를 포함해, 용어·절차·표현·성질·오개념 위험마다 먼저 확인해야 할 교과서 근거 유형을 구분한다.

`textbook-edge-evidence-packets/*`는 단원별 concept에 닿는 관계 edge를 교과서 근거 채움용 worksheet로 나눈다. 각 row는 `contains`, `prerequisite_for`, `represented_by`, `used_in`, `contrasts_with`, `often_confused_with`, `related_to` 관계 유형에 맞춰 구조 근거, 선수 순서 근거, 표현 근거, 절차 활용 근거, 대조·오개념 근거, 쪽수 근거 슬롯을 구분한다.

`textbook-evidence-workplan.*`는 concept 근거 패킷과 edge 근거 패킷을 rank별로 합쳐, 단원마다 채워야 할 concept row, edge row, pending row, low-confidence row, cross-unit edge row를 한 번에 보여준다. 현재 최상위 단원 `상자그림과 산점도`는 concept 52개와 edge row 285개, 총 337개 교과서 근거 row가 모두 `pending_textbook_pdf` 상태이다.

`pilot-unit-map.*`는 현재 최상위 단원 `상자그림과 산점도`를 사람이 검토하기 쉬운 compact map으로 접은 산출물이다. `pilot-unit-map-nodes.csv`는 52개 concept을, `pilot-unit-map-edges.csv`는 이 단원에 닿는 285개 edge를 담고, `pilot-unit-map.dot`는 내부 edge를 실선, cross-unit edge를 점선으로 나타낸다.

`unit-map-packets/*`는 같은 compact map 형식을 전체 34개 단원으로 확장한 산출물이다. 각 rank별 `*-nodes.csv`, `*-edges.csv`, `.md`, `.dot` 파일은 단원 단위로 미시 concept, 포함/선수/표현/활용/대조/오개념 edge, cross-unit 연결을 함께 검토하도록 만든다.

`edge-evidence-depth.*`는 각 관계 edge가 공식 교육과정, 성취수준, 교과서 근거 중 어디까지 연결되어 있는지와 교과서 page-level 근거 보강 필요 여부를 추적한다.

`textbook-source-audit.*`는 `교과서_원본/`의 PDF 후보를 원본 파일 단위로 검사한다. PDF 헤더, 파일명 규칙, SHA-256 해시, `TEXTBOOK_SOURCE_MANIFEST.csv`의 source URL·attachment id·expected hash를 확인하고, 모든 항목이 준비된 파일만 교과서 본문 추출 대상으로 본다. 현재는 PDF가 없어 `waiting_for_textbook_pdf` 상태이다.

`legacy-gap-audit.*`는 기존 `수학_개념_위계도/data/math_concept_hierarchy.json`의 중학교 후보가 현재 공식 근거 기반 concept map의 `label_ko` 또는 `aliases`로 포괄되는지 점검한다. 이 파일은 보조 감사 자료이며, `needs_review` 항목은 공식 교육과정 또는 교과서 근거가 확인되기 전까지 concept으로 확정하지 않는다.

`legacy-gap-resolution.*`는 현재 남은 `needs_review` 후보가 없음을 보존한다. 이전 후보 중 약수, 배수, 덧셈, 뺄셈, 곱셈, 나눗셈, 도형, 삼각형, 길이, 넓이는 공식 source ref에 직접 등장하는 기초 개념으로 확인해 `medium` 신뢰도 concept과 edge로 반영했고, 피타고라스는 기존 피타고라스 정리 concept의 alias로 반영했다. `비`는 정비례·반비례, 닮음비, 평행선 사이의 선분 길이의 비, 삼각비, 상대도수와 확률의 비율 표현에서 반복되는 공통 선수개념으로 분리하고 연구보고서 p. 61, p. 172, p. 180, p. 181, p. 184를 보조 source ref로 적용했지만, 단독 용어 근거와 교과서 본문 근거가 아직 약하므로 `confidence: low`와 보강 notes를 유지했다.

`legacy-gap-integration-plan.*`는 현재 staging 대상 후보 0개를 기록한다.

`legacy-gap-source-review.*`는 현재 공식 근거 확인 queue 대상 후보 0개를 기록한다.

`legacy-gap-evidence-scan.*`는 현재 증거 신호 재검토 대상 후보 0개를 기록한다.

`k12-spine-*`는 별책8 수학과 교육과정 원문에서 초1~고3 전 구간의 성취기준을 추출해 학년군·영역·과목 수준의 거시 위계 그래프로 잇는 산출물이다. 학년군 진행과 편제 구조, 문서의 직접 서술(p.74, p.164, p.178, p.193)에 근거한 edge는 `high`, 내용 체계 기반 추론 edge(공통수학1→2, 기본수학1→2, 대수/미적분Ⅰ→미적분Ⅱ)는 `medium`으로 표시한다. 중1-3 성취기준 노드의 `achievement_code`는 `achievement-coverage.csv`와 같은 코드 체계이므로, spine에서 미시 concept 수준으로 조인해 내려갈 수 있다.

교과서 PDF가 추가되면 단원별로 원문 전체를 전재하지 않고 개념명, 짧은 정의, 쪽수, 출처 파일 해시, 관계 근거만 반영한다.
