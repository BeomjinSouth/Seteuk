# 수학 개념 위계 Map

이 폴더는 2022 개정 중학교 수학 교육과정과 이후 추가될 교과서 원본을 바탕으로, 단원명 수준을 넘어선 미시 개념 노드와 관계 edge를 누적하기 위한 작업 공간이다.

## 현재 범위

- 대상: 2022 개정 중학교 수학 1~3학년
- 파일럿 단원: 변화와 관계 > 문자의 사용과 식, 일차방정식, 좌표평면과 그래프, 식의 계산, 일차부등식, 연립일차방정식, 일차함수와 그 그래프, 일차함수와 일차방정식의 관계, 다항식의 곱셈과 인수분해, 이차방정식, 이차함수와 그 그래프
- 공식 근거: `9수02-01` ~ `9수02-22`
- 교과서 근거: `교과서_원본/` 폴더가 현재 비어 있어 아직 반영하지 못함

## 현재 데이터 규모

- 개념 노드: 203개
- 관계 edge: 340개
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
