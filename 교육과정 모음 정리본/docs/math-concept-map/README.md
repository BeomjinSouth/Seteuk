# 수학 개념 위계 Map

이 폴더는 2022 개정 중학교 수학 교육과정과 이후 추가될 교과서 원본을 바탕으로, 단원명 수준을 넘어선 미시 개념 노드와 관계 edge를 누적하기 위한 작업 공간이다.

## 현재 범위

- 대상: 2022 개정 중학교 수학 1~3학년
- 파일럿 단원: 수와 연산 전체, 변화와 관계 전체, 도형과 측정 전체
- 공식 근거: `9수01-01` ~ `9수01-10`, `9수02-01` ~ `9수02-22`, `9수03-01` ~ `9수03-19`
- 교과서 근거: `교과서_원본/` 폴더가 현재 비어 있어 아직 반영하지 못함

## 현재 데이터 규모

- 개념 노드: 392개
- 관계 edge: 918개
- 출처: 4개

## 산출물

- `SCHEMA.md`: 개념 노드와 관계 edge 스키마
- `source-audit.md`: 사용 가능한 자료, 누락 자료, 출처 우선순위
- `progress.md`: 진행 로그와 다음 작업
- `concepts.json`: 파일럿 개념과 관계의 원본 JSON
- `concepts.csv`: 개념 노드 CSV
- `edges.csv`: 관계 edge CSV
- `graph.mmd`: Mermaid 위계/관계 초안

## 갱신 방법

```powershell
python docs/math-concept-map/tools/build_pilot.py
python docs/math-concept-map/tools/validate_concept_map.py
```

교과서 PDF가 추가되면 단원별로 원문 전체를 전재하지 않고 개념명, 짧은 정의, 쪽수, 출처 파일 해시, 관계 근거만 반영한다.
