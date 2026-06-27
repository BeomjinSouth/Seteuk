# 수학 개념 위계 Map

이 폴더는 2022 개정 중학교 수학 교육과정과 이후 추가될 교과서 원본을 바탕으로, 단원명 수준을 넘어선 미시 개념 노드와 관계 edge를 누적하기 위한 작업 공간이다.

## 현재 범위

- 대상: 2022 개정 중학교 수학 1~3학년
- 파일럿 단원: 수와 연산 전체, 변화와 관계 전체, 도형과 측정 전체, 자료와 가능성 전체
- 공식 근거: `9수01-01` ~ `9수01-10`, `9수02-01` ~ `9수02-22`, `9수03-01` ~ `9수03-19`, `9수04-01` ~ `9수04-09`
- 교과서 근거: `교과서_원본/` 폴더가 현재 비어 있어 아직 반영하지 못함

## 현재 데이터 규모

- 개념 노드: 476개
- 관계 edge: 1262개
- 출처: 4개

## 산출물

- `SCHEMA.md`: 개념 노드와 관계 edge 스키마
- `source-audit.md`: 사용 가능한 자료, 누락 자료, 출처 우선순위
- `progress.md`: 진행 로그와 다음 작업
- `concepts.json`: 파일럿 개념과 관계의 원본 JSON
- `concepts.csv`: 개념 노드 CSV
- `edges.csv`: 관계 edge CSV
- `graph.mmd`: Mermaid 위계/관계 초안
- `achievement-coverage.md`: 공식 성취기준별 연결 concept 요약
- `achievement-coverage.csv`: 공식 성취기준별 연결 concept 기계 판독용 CSV
- `review-queue.md`: `low` 신뢰도 concept의 교과서/출처 보강 검토 목록
- `review-queue.csv`: 검토 목록 기계 판독용 CSV
- `official-term-coverage.md`: 공식 용어·기호가 concept label/alias로 연결되는지 점검한 요약
- `official-term-coverage.csv`: 공식 용어·기호 커버리지 기계 판독용 CSV
- `unit-coverage.md`: 학년·영역·단원별 concept/edge/신뢰도 요약
- `unit-coverage.csv`: 단원별 커버리지 기계 판독용 CSV
- `relationship-audit.md`: edge 관계 유형과 고립 concept 여부 감사 요약
- `relationship-audit.csv`: 관계 유형별 edge 분포 기계 판독용 CSV
- `prerequisite-map.md`: 선수 관계 edge를 단원 전이 기준으로 펼친 요약
- `prerequisite-map.csv`: 선수 관계 edge의 concept 쌍과 출처 근거 기계 판독용 CSV
- `source-inventory.md`: 현재 로컬 출처 파일 가용성 요약
- `source-inventory.csv`: 현재 로컬 출처 파일 가용성 기계 판독용 CSV
- `source-ref-audit.md`: concept/edge 출처 근거의 출처·근거 유형별 감사 요약
- `source-ref-audit.csv`: concept/edge 출처 근거의 출처·근거 유형별 기계 판독용 CSV
- `concept-evidence-depth.md`: concept별 공식/교과서 근거 깊이와 교과서 보강 필요 상태 요약
- `concept-evidence-depth.csv`: concept별 근거 깊이 기계 판독용 CSV
- `textbook-extraction-queue.md`: 교과서 PDF 추가 후 단원별 원문 추출 우선순위
- `textbook-extraction-queue.csv`: 교과서 원문 추출 우선순위 기계 판독용 CSV
- `textbook-evidence-packets/index.md`: 전체 단원 교과서 근거 패킷 인덱스
- `textbook-evidence-packets/index.csv`: 같은 인덱스의 기계 판독용 CSV
- `textbook-evidence-packets/rank-01.md`~`rank-34.md`: 전체 34개 단원 교과서 근거 채움용 작업 패킷
- `textbook-evidence-packets/rank-01.csv`~`rank-34.csv`: 같은 패킷의 기계 판독용 CSV
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
python docs/math-concept-map/tools/build_coverage_report.py
python docs/math-concept-map/tools/build_relationship_audit.py
python docs/math-concept-map/tools/build_prerequisite_map.py
python docs/math-concept-map/tools/build_source_inventory.py
python docs/math-concept-map/tools/build_source_ref_audit.py
python docs/math-concept-map/tools/build_concept_evidence_depth.py
python docs/math-concept-map/tools/build_textbook_extraction_queue.py
python docs/math-concept-map/tools/build_textbook_evidence_packet.py --all
python docs/math-concept-map/tools/build_legacy_gap_audit.py
python docs/math-concept-map/tools/build_legacy_gap_resolution.py
python docs/math-concept-map/tools/build_legacy_gap_integration_plan.py
python docs/math-concept-map/tools/build_legacy_gap_source_review.py
python docs/math-concept-map/tools/build_legacy_gap_evidence_scan.py
python docs/math-concept-map/tools/build_review_queue.py
python docs/math-concept-map/tools/build_terminology_coverage.py
python docs/math-concept-map/tools/build_unit_coverage.py
python docs/math-concept-map/tools/validate_concept_map.py
python docs/math-concept-map/tools/test_build_coverage_report.py
python docs/math-concept-map/tools/test_build_relationship_audit.py
python docs/math-concept-map/tools/test_build_prerequisite_map.py
python docs/math-concept-map/tools/test_build_source_inventory.py
python docs/math-concept-map/tools/test_build_source_ref_audit.py
python docs/math-concept-map/tools/test_build_concept_evidence_depth.py
python docs/math-concept-map/tools/test_build_pilot_geometry_foundations.py
python docs/math-concept-map/tools/test_build_pilot_foundational_prerequisites.py
python docs/math-concept-map/tools/test_build_pilot_ratio_foundation.py
python docs/math-concept-map/tools/test_build_textbook_extraction_queue.py
python docs/math-concept-map/tools/test_build_textbook_evidence_packet.py
python docs/math-concept-map/tools/test_build_legacy_gap_audit.py
python docs/math-concept-map/tools/test_build_legacy_gap_resolution.py
python docs/math-concept-map/tools/test_build_legacy_gap_integration_plan.py
python docs/math-concept-map/tools/test_build_legacy_gap_source_review.py
python docs/math-concept-map/tools/test_build_legacy_gap_evidence_scan.py
python docs/math-concept-map/tools/test_build_review_queue.py
python docs/math-concept-map/tools/test_build_terminology_coverage.py
python docs/math-concept-map/tools/test_build_unit_coverage.py
python docs/math-concept-map/tools/test_validate_concept_map.py
```

검증기는 필수 필드, id 중복, source/ref 무결성, CSV 행 수, Mermaid 파일, 2022 개정 중학교 수학 공식 성취기준 60개(`9수01-01`~`9수04-09`)의 concept 근거 커버리지, `review-queue.csv`와 `low` 신뢰도 concept 수의 일치, 공식 용어·기호 168개 중 concept 추가 검토 필요 항목이 없는지, `unit-coverage.csv`가 학년·영역·단원 그룹과 concept 총계를 보존하는지, `relationship-audit.csv`가 edge 총계와 필수 관계 유형을 보존하는지, `prerequisite-map.csv`가 `prerequisite_for` edge 383개를 모두 보존하는지, 고립 concept이 없는지, `textbook-evidence-packets/index.csv`와 `rank-01.csv`~`rank-34.csv`가 전체 34개 단원 concept 476개를 모두 포함하고 현재 교과서 PDF 부재 상태에서는 모두 `pending_textbook_pdf`인지, legacy gap audit/resolution/source-review/evidence-scan에 남은 검토 후보가 0개인지 확인한다. `test_build_pilot_foundational_prerequisites.py`는 약수·배수·덧셈·뺄셈·곱셈·나눗셈이 실제 concept과 edge로 연결되어 있는지 별도로 고정한다. `test_build_pilot_geometry_foundations.py`는 도형·삼각형·길이·넓이 및 피타고라스 alias가 기존 단원/절차에 연결되어 있는지 고정한다. `test_build_pilot_ratio_foundation.py`는 `비`가 낮은 신뢰도의 공통 선수개념으로 분리되고 정비례·반비례·닮음비·삼각비·상대도수·확률 계열로 연결되는지 고정한다. `achievement-coverage.*`는 같은 성취기준 추출 로직을 사용해 사람용/기계용 검토 표로 재생성한다.

`review-queue.*`는 아직 교과서 본문·예제·오답 근거로 확정하지 못한 `low` 신뢰도 concept을 모아 다음 출처 보강 순서를 정한다.

`official-term-coverage.*`는 공식 문서 용어·기호가 `concepts.json`의 `label_ko` 또는 `aliases`로 연결되는지 점검한다.

`unit-coverage.*`는 다음 교과서 보강을 학년·영역·단원 단위로 반복하기 위한 현황판이다.

`relationship-audit.*`는 포함·선수·표현·활용·대조·오개념 관계가 실제 edge로 연결되었는지와 고립 concept 여부를 점검한다.

`prerequisite-map.*`는 `prerequisite_for` 관계를 concept 쌍, 단원 전이 범위, 공식 근거 요약으로 펼쳐 선수 개념 흐름을 사람이 검토할 수 있게 한다.

`textbook-evidence-packets/*`는 단원별 concept을 교과서 근거 채움용 worksheet로 나눈다. 각 row는 빈 근거 슬롯뿐 아니라 `required_evidence_fields`와 `evidence_focus`를 포함해, 용어·절차·표현·성질·오개념 위험마다 먼저 확인해야 할 교과서 근거 유형을 구분한다.

`legacy-gap-audit.*`는 기존 `수학_개념_위계도/data/math_concept_hierarchy.json`의 중학교 후보가 현재 공식 근거 기반 concept map의 `label_ko` 또는 `aliases`로 포괄되는지 점검한다. 이 파일은 보조 감사 자료이며, `needs_review` 항목은 공식 교육과정 또는 교과서 근거가 확인되기 전까지 concept으로 확정하지 않는다.

`legacy-gap-resolution.*`는 현재 남은 `needs_review` 후보가 없음을 보존한다. 이전 후보 중 약수, 배수, 덧셈, 뺄셈, 곱셈, 나눗셈, 도형, 삼각형, 길이, 넓이는 공식 source ref에 직접 등장하는 기초 개념으로 확인해 `medium` 신뢰도 concept과 edge로 반영했고, 피타고라스는 기존 피타고라스 정리 concept의 alias로 반영했다. `비`는 정비례·반비례, 닮음비, 평행선 사이의 선분 길이의 비, 삼각비, 상대도수와 확률의 비율 표현에서 반복되는 공통 선수개념으로 분리하되, 단독 용어 근거가 약하므로 `confidence: low`와 보강 notes를 유지했다.

`legacy-gap-integration-plan.*`는 현재 staging 대상 후보 0개를 기록한다.

`legacy-gap-source-review.*`는 현재 공식 근거 확인 queue 대상 후보 0개를 기록한다.

`legacy-gap-evidence-scan.*`는 현재 증거 신호 재검토 대상 후보 0개를 기록한다.

교과서 PDF가 추가되면 단원별로 원문 전체를 전재하지 않고 개념명, 짧은 정의, 쪽수, 출처 파일 해시, 관계 근거만 반영한다.
