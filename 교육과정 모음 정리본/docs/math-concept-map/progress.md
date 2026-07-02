# 진행 로그

## 2026-06-26

- AGENTS.md를 확인하고, 현재 저장소가 공식 교육과정 PDF와 출처 보존을 중심으로 운영됨을 확인했다.
- 기존 `수학_개념_위계도/` 산출물은 초1~중3 공식 내용 요소 골격이며, 이번 goal의 미시 개념 스키마와 별도임을 확인했다.
- `교과서_원본/` 폴더가 비어 있어 교과서 본문 세부 개념은 아직 확정할 수 없음을 기록했다.
- `docs/math-concept-map/` 작업 공간을 만들고, 스키마·출처 감사·파일럿 생성/검증 흐름을 추가했다.
- 파일럿 범위는 `변화와 관계 > 좌표평면과 그래프`로 설정했다.
- 파일럿 산출물로 개념 노드 40개와 관계 edge 53개를 생성했다.

## 2026-06-26 추가 확장

- 파일럿 범위를 `변화와 관계 > 문자의 사용과 식`, `일차방정식`, `좌표평면과 그래프`로 확장했다.
- `문자`, `문자를 사용한 식`, `식의 값`, `대입`, `항`, `단항식`, `다항식`, `계수`, `상수항`, `차수`, `일차식`, `동류항`, `등식`, `방정식`, `미지수`, `해`, `근`, `항등식`, `등식의 성질`, `이항`, `일차방정식 풀기`, `일차방정식 세우기`, `해의 확인` 등을 노드화했다.
- `문자의 사용과 식 -> 일차방정식 -> 좌표평면과 그래프`로 이어지는 선수 관계를 추가했다.
- `해`와 `근`처럼 동치에 가까운 표현을 기록하기 위해 edge 타입 `equivalent_to`, `related_to`를 스키마와 검증기에 추가했다.
- 산출물 규모는 개념 노드 77개, 관계 edge 109개로 확장되었다.

## 2026-06-26 추가 확장 2

- 파일럿 범위를 `식의 계산`, `일차부등식`, `연립일차방정식`까지 확장했다.
- `거듭제곱`, `밑`, `지수`, `지수법칙`, `식을 간단히 하기`, `다항식의 덧셈과 뺄셈`, `단항식의 곱셈과 나눗셈`, `단항식과 다항식의 곱셈과 나눗셈`, `전개`, `부등식`, `부등식의 해`, `부등식의 성질`, `일차부등식 풀기`, `일차부등식 세우기`, `미지수가 2개인 일차방정식`, `연립방정식`, `연립일차방정식`, `소거`, `가감법`, `대입법` 등을 노드화했다.
- `문자의 사용과 식 -> 식의 계산 -> 일차부등식/연립일차방정식` 선수 관계와 `연립일차방정식의 해 -> 순서쌍` 표현 관계를 추가했다.
- 산출물 규모는 개념 노드 115개, 관계 edge 176개로 확장되었다.

## 2026-06-26 추가 확장 3

- 파일럿 범위를 `일차함수와 그 그래프`, `일차함수와 일차방정식의 관계`까지 확장했다.
- `함수`, `두 양 사이의 관계`, `대응 관계`, `함수인지 판단하기`, `함숫값`, `일차함수`, `일차함수의 식`, `일차함수의 그래프`, `일차함수 그래프 그리기`, `기울기`, `기울기의 부호`, `x절편`, `y절편`, `평행이동`, `일차함수 그래프의 식 구하기`, `미지수가 2개인 일차방정식의 해를 그래프로 나타내기`, `두 일차함수의 그래프`, `교점`, `교점의 개수`, `교점으로 연립일차방정식의 해 말하기` 등을 노드화했다.
- `좌표평면과 그래프 -> 일차함수와 그 그래프`, `연립일차방정식 -> 일차함수와 일차방정식의 관계`, `연립일차방정식의 해 -> 교점` 관계를 추가했다.
- 산출물 규모는 개념 노드 151개, 관계 edge 234개로 확장되었다.

## 2026-06-26 추가 확장 4

- 파일럿 범위를 `다항식의 곱셈과 인수분해`, `이차방정식`, `이차함수와 그 그래프`까지 확장하여 변화와 관계 영역의 공식 성취기준 `9수02-01`~`9수02-22`를 모두 1차 반영했다.
- `인수`, `인수분해`, `전개와 인수분해의 역관계`, `공통인수`, `완전제곱식`, `(a+b)^2`, `(a-b)^2`, `(a+b)(a-b)`, `(x+a)(x+b)`, `(ax+b)(cx+d)`, `이차식`, `이차방정식`, `이차항`, `이차방정식의 해`, `인수분해를 이용한 이차방정식 풀이`, `근의 공식`, `중근`, `이차함수`, `이차함수의 식`, `y=f(x)`, `이차함수의 그래프`, `포물선`, `축`, `꼭짓점`, `y=ax^2 그래프`, `y=a(x-p)^2+q 꼴`, `y=ax^2+bx+c 꼴`, `최댓값`, `최솟값` 등을 노드화했다.
- `식의 계산 -> 다항식의 곱셈과 인수분해 -> 이차방정식 -> 이차함수와 그 그래프` 선수 관계와, 이차함수의 식·그래프·포물선·축·꼭짓점·최대최소 관계를 추가했다.
- 공식 문서의 제외·범위 조건인 `이차방정식은 해가 실수인 경우만 다룸`, `근과 계수와의 관계는 다루지 않음`, `이차함수 최댓값과 최솟값은 x의 범위가 실수 전체인 경우만 다룸`을 범위 관리 노드로 기록했다.
- 산출물 규모는 개념 노드 203개, 관계 edge 340개로 확장되었다.

## 2026-06-26 추가 확장 5

- 파일럿 범위를 `수와 연산` 영역 전체로 확장하여 공식 성취기준 `9수01-01`~`9수01-10`을 1차 반영했다.
- `소수`, `합성수`, `소인수`, `소인수분해`, `소인수의 곱으로 표현하기`, `서로소`, `최대공약수`, `최소공배수`, `음수의 필요성`, `양수`, `음수`, `정수`, `유리수`, `수직선`, `절댓값`, `양의 부호`, `음의 부호`, `정수와 유리수의 대소 관계`, `정수와 유리수의 사칙계산`, `교환법칙`, `결합법칙`, `분배법칙`, `역수`, `유한소수`, `무한소수`, `순환소수`, `순환마디`, `순환소수 표현`, `유리수와 순환소수의 관계`, `순환소수를 분수로 나타내기`, `제곱근`, `근호`, `무리수`, `실수`, `실수의 대소 관계`, `근호를 포함한 식`, `근호를 포함한 식의 사칙계산`, `분모의 유리화` 등을 노드화했다.
- 기존 `거듭제곱`, `밑`, `지수`, `전개`, `식의 계산` 노드는 중복 생성하지 않고 수와 연산 노드와 edge로 연결했다.
- 공식 문서의 제외·범위 조건인 `최대공약수와 최소공배수 활용 문제는 다루지 않음`, `유한소수를 순환소수로 나타내는 것은 다루지 않음`, `정수와 유리수의 지나치게 복잡한 계산과 사칙계산 이외의 이항연산은 다루지 않음`을 범위 관리 노드 또는 notes로 기록했다.
- 산출물 규모는 개념 노드 271개, 관계 edge 462개로 확장되었다.

## 2026-06-26 추가 확장 6

- 파일럿 범위를 `도형과 측정` 영역 전체로 확장하여 공식 성취기준 `9수03-01`~`9수03-19`를 1차 반영했다.
- `점`, `직선`, `평면`, `각`, `교점`, `교선`, `두 점 사이의 거리`, `중점`, `수직이등분선`, `꼬인 위치`, `맞꼭지각`, `평각`, `직교`, `수선의 발`, `평행선`, `동위각`, `엇각`, `평행선의 각의 성질` 등을 노드화했다.
- `작도`, `삼각형의 작도`, `합동`, `삼각형의 합동 조건`, `삼각형의 합동 판별`, `대변`, `대각`, `다각형`, `내각`, `외각`, `대각선`, `부채꼴`, `중심각`, `호`, `현`, `활꼴`, `할선`, `부채꼴의 호의 길이와 넓이 구하기` 등을 노드화했다.
- `다면체`, `정다면체`, `각뿔대`, `회전체`, `회전축`, `원뿔대`, `입체도형의 단면`, `전개도`, `겉넓이`, `부피`, `모형과 공학 도구로 입체도형 탐구` 등을 노드화했다.
- `정당화`, `증명`, `이등변삼각형`, `이등변삼각형의 성질`, `외심`, `외접원`, `내심`, `내접원`, `중선`, `무게중심`, `사각형`, `사각형의 대각선에 관한 성질`, `여러 가지 사각형 사이의 관계` 등을 노드화했다.
- `닮음`, `닮은 도형`, `도형의 대응`, `닮음비`, `삼각형의 닮음 조건`, `삼각형의 닮음 판별`, `평행선 사이의 선분의 길이의 비`, `삼각형의 중점연결정리`, `피타고라스 정리`, `피타고라스 정리의 역`, `세 변의 길이로 직각삼각형 판별` 등을 노드화했다.
- `삼각비`, `사인`, `코사인`, `탄젠트`, `30도·45도·60도의 삼각비`, `삼각비로 거리와 높이 구하기`, `삼각비를 이용한 삼각형의 넓이`, `원`, `원의 현에 관한 성질`, `접선`, `접점`, `접한다`, `접선의 길이`, `원주각`, `원주각의 성질` 등을 노드화했다.
- `동위각과 엇각 혼동`, `꼬인 위치와 평행 혼동`, `호와 현 혼동`, `겉넓이와 부피 혼동`, `관찰과 증명 혼동`, `외심과 내심 혼동`, `합동과 닮음 혼동`, `삼각비 범위 혼동`, `원과 비례 범위 혼동`, `접선과 반지름 관계 오류`를 잠정 오개념 위험 노드로 기록했다.
- `parent_ids`와 `prerequisite_ids`에서 도형 영역의 기본 포함·선수 edge를 자동 생성하고, 표현·활용·대조·오개념 edge를 수동 보강했다.
- 산출물 규모는 개념 노드 392개, 관계 edge 918개로 확장되었다.

## 2026-06-26 추가 확장 7

- 파일럿 범위를 `자료와 가능성` 영역 전체로 확장하여 공식 성취기준 `9수04-01`~`9수04-09`를 1차 반영했다.
- `자료`, `변량`, `대푯값`, `평균`, `중앙값`, `최빈값`, `자료의 특성에 맞는 대푯값 선택`을 노드화하고, 평균만 대푯값으로 보는 위험을 잠정 오개념 노드로 기록했다.
- `자료의 분포`, `줄기와 잎 그림`, `계급`, `계급의 크기`, `계급값`, `도수`, `도수분포표`, `히스토그램`, `도수분포다각형`, `자료의 분포 특징 해석`, `상대도수`, `상대도수의 분포`, `상대도수의 분포를 표나 그래프로 나타내기`를 노드화했다.
- `통계적 탐구 문제`, `자료 수집 계획`, `자료 수집`, `자료 분석`, `분석 결과 해석`, `통계적 근거로 토론하기`, `공학 도구로 자료 수집·분석하기`, `표와 그래프의 오류 비판적으로 읽기`를 노드화했다.
- `사건`, `경우의 수`, `사건 A 또는 사건 B가 일어나는 경우의 수`, `사건 A와 사건 B가 동시에 일어나는 경우의 수`, `두 경우의 수를 합하는 상황`, `두 경우의 수를 곱하는 상황`, `확률`, `확률의 기본 성질`, `상대도수로서의 확률`, `경우의 수의 비율로서의 확률`, `동등 가능성 가정`을 노드화했다.
- `산포도`, `편차`, `분산`, `표준편차`, `분산과 표준편차 구하기`, `산포도로 두 집단의 분포 비교`, `사분위수`, `상자그림`, `상자그림으로 두 집단의 분포 비교`, `산점도`, `상관관계`, `양의 상관관계`, `음의 상관관계`, `상관관계가 없는 경우`, `산점도로 상관관계 말하기`를 노드화했다.
- `히스토그램과 막대그래프 혼동`, `도수와 상대도수 혼동`, `눈금 왜곡 그래프 해석`, `또는과 동시에의 경우의 수 혼동`, `동등 가능성 조건 누락`, `복잡한 순열·조합 범위 혼동`, `분산과 표준편차 혼동`, `상관관계와 인과관계 혼동`을 잠정 오개념 위험 노드로 기록했다.
- 기존 `표`, `그래프`, `좌표평면`, `수와 연산` 노드와 자료 표현·확률·산점도 노드를 연결해 중복을 피했다.
- 산출물 규모는 개념 노드 465개, 관계 edge 1215개로 확장되었다.

## 2026-06-26 검증 보강

- `validate_concept_map.py`에 공식 성취기준 커버리지 검증을 추가했다.
- 기대 성취기준 목록은 `9수01-01`~`9수01-10`, `9수02-01`~`9수02-22`, `9수03-01`~`9수03-19`, `9수04-01`~`9수04-09`의 총 60개다.
- `source_refs`의 locator와 summary에서 성취기준 코드를 추출하고, `[9수04-02]~[9수04-04]`처럼 범위로 적힌 근거도 개별 코드로 확장해 검사한다.
- `test_validate_concept_map.py`를 추가하여 성취기준 목록, 누락 코드 탐지, 범위 코드 확장 동작을 자동 테스트한다.

## 2026-06-26 커버리지 산출물 보강

- `build_coverage_report.py`를 추가하여 `concepts.json`의 성취기준 근거를 `achievement-coverage.md`와 `achievement-coverage.csv`로 재생성하게 했다.
- `achievement-coverage.md`에는 영역별 성취기준 수, concept 연결 수, 성취기준별 연결 concept 목록과 신뢰도 분포를 기록한다.
- `achievement-coverage.csv`에는 같은 내용을 기계 판독 가능한 행 단위로 저장한다.
- 현재 커버리지 산출물 기준 공식 성취기준 60개가 모두 concept 노드와 연결되어 있으며, 성취기준-concept 연결 수는 681개다.
- 이번 작업은 기존 공식 교육과정 근거를 재가공한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 low 신뢰도 검토 큐 보강

- `build_review_queue.py`를 추가하여 `confidence: low`인 concept을 `review-queue.md`와 `review-queue.csv`로 재생성하게 했다.
- 현재 검토 대상은 66개이며, 유형별로는 `misconception_risk` 65개와 `sub_concept` 1개다.
- 영역별 검토 대상은 수와 연산 9개, 변화와 관계 36개, 도형과 측정 12개, 자료와 가능성 9개다.
- `misconception_risk` 노드는 `textbook_evidence_needed`로 표시하여 교과서 예제·오답·문항 근거가 확보되면 우선 보강하도록 했다.
- `validate_concept_map.py`가 `review-queue.csv` 행 수와 `confidence: low` concept 수의 일치를 검사하도록 보강했다.
- 이번 작업은 기존 concept의 신뢰도와 notes를 재가공한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 공식 용어·기호 커버리지 보강

- `build_terminology_coverage.py`를 추가하여 공식 문서에서 확인한 중학교 수학 용어·기호 168개를 `official-term-coverage.md`와 `official-term-coverage.csv`로 재생성하게 했다.
- `근호 기호`가 별도 concept 없이 `근호` concept의 alias로 연결되도록 `m1_num_radical_sign`의 aliases에 추가했다.
- 현재 공식 용어·기호 커버리지는 직접 연결 162개, alias 연결 4개, 교육과정 범위 제외 2개, concept 추가 검토 필요 0개다.
- `validate_concept_map.py`가 공식 용어·기호 커버리지 행 수와 `needs_concept` 0개 조건을 검사하도록 보강했다.
- 이번 작업은 공식 문서 용어·기호 목록에 대한 추적성을 보강한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 단원별 커버리지 보강

- `build_unit_coverage.py`를 추가하여 concept과 edge를 학년·영역·단원 단위로 `unit-coverage.md`와 `unit-coverage.csv`에 요약하게 했다.
- 현재 단원 그룹은 33개이며, 영역별로 수와 연산 5개, 변화와 관계 11개, 도형과 측정 10개, 자료와 가능성 7개다.
- 단원별 산출물은 concept 수, 신뢰도 분포, concept type 분포, 연결 성취기준, 내부·유입·유출 edge 수를 포함한다.
- `validate_concept_map.py`가 `unit-coverage.csv` 행 수와 `concept_count` 합계가 `concepts.json`과 일치하는지 검사하도록 보강했다.
- 이번 작업은 기존 concept/edge를 재가공한 현황판 추가이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 관계 감사 보강

- `build_relationship_audit.py`를 추가하여 edge를 관계 유형별로 `relationship-audit.md`와 `relationship-audit.csv`에 요약하게 했다.
- `m1_coord_usefulness`가 고립 concept으로 남아 있어, `좌표평면과 그래프 -> 좌표 표현의 편리함` 포함 관계와 `좌표평면 -> 좌표 표현의 편리함` 활용 관계를 추가했다.
- 현재 edge는 1217개이며, 목표 필수 관계 유형인 `contains`, `prerequisite_for`, `represented_by`, `used_in`, `contrasts_with`, `often_confused_with`가 모두 존재한다.
- 현재 고립 concept은 0개다.
- `validate_concept_map.py`가 관계 감사 CSV의 edge 합계, 필수 관계 유형 존재, 고립 concept 0개 조건을 검사하도록 보강했다.
- 이번 작업은 기존 공식 교육과정 기반 concept을 더 잘 연결한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 출처 inventory 보강

- `build_source_inventory.py`를 추가하여 현재 로컬 출처 파일 가용성을 `source-inventory.md`와 `source-inventory.csv`로 재생성하게 했다.
- 현재 공식 수학과 교육과정 PDF, 성취수준 PDF, 수학 단원 정리 JSON은 `available`로 확인했다.
- 현재 `교과서_원본/`은 `README.md`만 있고 교과서 PDF가 없어 `empty`로 확인했다.
- `validate_concept_map.py`가 source inventory의 필수 source group과 상태값, Markdown 산출물 존재 여부를 검사하도록 보강했다.
- 이번 작업은 출처 현황 기록만 보강한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 source ref 감사 보강

- `build_source_ref_audit.py`를 추가하여 concept/edge의 `source_refs`를 출처와 근거 유형별로 `source-ref-audit.md`와 `source-ref-audit.csv`에 요약하게 했다.
- 현재 source ref는 concept 1191개와 edge 2918개, 총 4109개이며 `locator`와 `summary` 누락은 0개로 확인했다.
- `validate_concept_map.py`가 source ref audit의 행 수, source ref 총계, locator/summary 누락 0개, Markdown 산출물 존재 여부를 검사하도록 보강했다.
- 이번 작업은 기존 concept/edge의 출처 추적성 검증을 보강한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 concept evidence depth 보강

- `build_concept_evidence_depth.py`를 추가하여 concept별 공식/교과서 근거 깊이를 `concept-evidence-depth.md`와 `concept-evidence-depth.csv`에 요약하게 했다.
- 현재 465개 concept 중 `official_dual_source`는 387개, `official_single_source`는 78개이며 `textbook_supported`는 0개이다.
- 현재 465개 concept 모두 `needs_textbook_evidence: yes`로 확인되어, 교과서 PDF가 추가되면 이 지표를 줄이는 방식으로 보강 진행률을 추적한다.
- `validate_concept_map.py`가 concept evidence depth 행 수, concept id 누락, concept source ref 총계, 교과서 원본 폴더 empty 상태와 textbook evidence의 일관성을 검사하도록 보강했다.
- 이번 작업은 기존 공식 문서 기반 concept의 근거 깊이 추적성을 보강한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 textbook extraction queue 보강

- `build_textbook_extraction_queue.py`를 추가하여 교과서 PDF가 추가된 뒤 단원별 원문 추출 우선순위를 `textbook-extraction-queue.md`와 `textbook-extraction-queue.csv`에 요약하게 했다.
- 현재 큐는 33개 단원 그룹, 교과서 근거 보강 필요 concept 465개, `low` 신뢰도 concept 66개를 포함한다.
- 현재 최상위 우선 단원은 `좌표평면과 그래프`, `일차함수와 그 그래프`, `경우의 수와 확률`, `이차함수와 그 그래프`, `도수분포표와 상대도수`이다.
- `validate_concept_map.py`가 queue 행 수, 단원 그룹 수, 교과서 근거 필요 concept 총계, Markdown 산출물 존재 여부를 검사하도록 보강했다.
- 이번 작업은 교과서 원문 보강 순서를 정한 것이므로 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 textbook evidence packet 보강

- `build_textbook_evidence_packet.py`를 추가하고 `--all` 생성을 지원하여 `textbook-extraction-queue.csv`의 전체 33개 단원을 `textbook-evidence-packets/` 아래 패킷 묶음으로 분리했다.
- `index.md`와 `index.csv`가 `rank-01`~`rank-33` 패킷의 단원, concept 수, pending row 수, low 신뢰도 concept 수, 파일명을 추적한다.
- 전체 패킷은 concept 465개를 포함하며, `low` 신뢰도 concept 66개를 단원 안에서 먼저 정렬한다.
- 각 row에 목차, 학습목표, 본문 정의, 정리, 예제, 용어 설명, 문제 반복 패턴, 교과서 쪽수, 추출 메모 슬롯을 두어 교과서 PDF가 추가된 뒤 단원 단위로 근거를 채울 수 있게 했다.
- 현재 `교과서_원본/`에 PDF가 없으므로 465개 row 모두 `pending_textbook_pdf` 상태로 유지했다.
- `validate_concept_map.py`가 전체 33개 패킷과 인덱스의 row 수, schema, concept 순서, 대상 단원 범위, 누락 concept, 교과서 원본 부재 시 pending 상태를 검증하도록 보강했다.

## 2026-06-29 문자의 사용과 식 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept/edge 보강과 파생 산출물 정비로 제한했다.
- Peirce, Gibbs, Pascal subagent를 병렬로 사용해 rank 7 `문자의 사용과 식`의 누락 미시 concept, noisy edge, 연구보고서 source ref 적용 가능성을 분리 감사했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_expression_microconcepts.py"`가 새 미시 concept과 연구보고서 p. 214 보조 source ref 부재, 오개념 대상 noisy prerequisite edge 존재로 실패하는 것을 확인했다.
- `상황 속 수량 관계`, `문자가 나타내는 수량 정하기`, `상황을 문자를 사용한 식으로 나타내기`, `식의 값 구하기`, `일차식의 덧셈과 뺄셈 원리`, `일차식 계산 과정 설명하기`를 새 concept으로 추가했다.
- 연구보고서 p. 214의 `문자의 사용과 식` 성취기준별 성취수준을 `m1_expr_unit`, `m1_expr_letter`, `m1_expr_literal_expression`, `m1_expr_value`, `m1_expr_usefulness`, `m1_expr_linear_expression`, `m1_expr_add_sub_linear_expression` 및 새 절차/성질 concept의 보조 source ref로 반영했다.
- p. 214는 교과서 본문 근거가 아니므로 `m1_mis_letter_as_label_only`, `m1_mis_like_terms`, `m1_mis_coefficient_constant_degree`의 confidence는 `low`로 유지하고 p. 214 source ref를 붙이지 않았다.
- 오개념 위험 노드로 들어가던 `prerequisite_for` edge를 제거하기 위해 `m1_mis_letter_as_label_only`, `m1_mis_like_terms`, `m1_mis_coefficient_constant_degree`, `m1_mis_polynomial_like_terms`의 선수 배열을 정리했다.
- `수량 관계 -> 문자 정하기 -> 문자식 세우기 -> 식의 값 구하기`와 `일차식 원리 -> 일차식 계산 -> 계산 과정 설명`의 `used_in` edge를 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 526개, edge는 2236개가 되었다. source ref 총계는 concept 1458개, edge 5776개, 총 7234개이며 source catalogue는 5개이다.
- `review-queue.*`는 81개 low-confidence concept, `concept-evidence-depth.*`는 concept 526개, `edge-evidence-depth.*`는 edge 2236개, `prerequisite-map.*`는 811개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 526개, edge evidence row 2697개, pending textbook evidence row 3223개, low-confidence concept/edge row 563개를 기록한다. rank 7 `문자의 사용과 식`은 24개 concept과 137개 edge row, 총 161개 row이다.
- `test_build_pilot_expression_microconcepts.py`를 추가해 새 문자의 사용과 식 미시 concept, p. 214 보조 source ref, 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_expression_microconcepts.py"` 4개, `test_build_pilot_edge_sync.py` 21개 통과.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.

## 남은 작업

- 2022 개정 중학교 수학 공식 교육과정 4개 영역은 모두 1차 반영되었다.
- 중1~중3 수학 교과서 PDF가 추가되면 목차, 학습 목표, 본문 정의, 정리, 예제, 용어 설명 순서로 모든 영역의 노드를 보강한다.
- 교과서 쪽수 근거가 확보되면 `low` 신뢰도 노드를 재검토하고 병합 또는 승격한다.

## 검증

- 완료: `python docs/math-concept-map/tools/build_pilot.py`
- 완료: `python docs/math-concept-map/tools/validate_concept_map.py`
- 1차 검증 결과: 40개 concept, 53개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 확장 후 검증 결과: 77개 concept, 109개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 2 검증 결과: 115개 concept, 176개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 3 검증 결과: 151개 concept, 234개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 4 검증 결과: 203개 concept, 340개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 5 검증 결과: 271개 concept, 462개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 6 검증 결과: 392개 concept, 918개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 추가 확장 7 검증 결과: 465개 concept, 1215개 edge, 4개 source 참조가 정상이며 중복 id와 깨진 참조가 없다.
- 검증 보강 결과: 465개 concept, 1215개 edge, 4개 source 참조와 공식 성취기준 60개 concept 근거 커버리지가 정상이며, validator 단위 테스트 3개가 통과한다.
- 커버리지 산출물 보강 결과: report 단위 테스트 2개가 통과하고, `achievement-coverage.md`와 `achievement-coverage.csv`가 공식 성취기준 60개 전체를 포함한다.
- low 신뢰도 검토 큐 보강 결과: review queue 단위 테스트 2개와 validator 단위 테스트 4개가 통과하고, `review-queue.md`와 `review-queue.csv`가 `confidence: low` concept 66개를 포함한다.
- 공식 용어·기호 커버리지 보강 결과: terminology coverage 단위 테스트 2개와 validator 단위 테스트 5개가 통과하고, `official-term-coverage.md`와 `official-term-coverage.csv`가 공식 용어·기호 168개 전체를 포함하며 `needs_concept` 항목은 0개다.
- 단원별 커버리지 보강 결과: unit coverage 단위 테스트 2개와 validator 단위 테스트 6개가 통과하고, `unit-coverage.md`와 `unit-coverage.csv`가 학년·영역·단원 그룹 33개와 concept 총계 465개를 포함한다.
- 관계 감사 보강 결과: relationship audit 단위 테스트 3개와 validator 단위 테스트 7개가 통과하고, `relationship-audit.md`와 `relationship-audit.csv`가 edge 1217개 전체와 고립 concept 0개 상태를 포함한다.
- 출처 inventory 보강 결과: source inventory 단위 테스트 3개와 validator 단위 테스트 9개가 통과하고, `source-inventory.md`와 `source-inventory.csv`가 공식 출처 3개 `available`, 교과서 원본 1개 `empty` 상태를 포함한다.
- source ref 감사 보강 결과: source ref audit 단위 테스트 3개와 validator 단위 테스트 11개가 통과하고, `source-ref-audit.md`와 `source-ref-audit.csv`가 source ref 4109개와 locator/summary 누락 0개 상태를 포함한다.
- concept evidence depth 보강 결과: concept evidence depth 단위 테스트 3개와 validator 단위 테스트 14개가 통과하고, `concept-evidence-depth.md`와 `concept-evidence-depth.csv`가 concept 465개 전체와 교과서 근거 보강 필요 465개 상태를 포함한다.
- textbook extraction queue 보강 결과: textbook extraction queue 단위 테스트 3개와 validator 단위 테스트 16개가 통과하고, `textbook-extraction-queue.md`와 `textbook-extraction-queue.csv`가 33개 단원 그룹과 교과서 근거 보강 필요 concept 465개를 포함한다.
- textbook evidence packet 보강 결과: textbook evidence packet 단위 테스트 6개와 validator 단위 테스트 21개가 통과하고, `textbook-evidence-packets/index.*` 및 `rank-01`~`rank-33` 패킷이 전체 33개 단원 concept 465개를 모두 포함하며 현재 모두 `pending_textbook_pdf` 상태임을 확인했다.

## 2026-06-26 legacy gap audit 보강

- `build_legacy_gap_audit.py`를 추가해 기존 로컬 `수학_개념_위계도/data/math_concept_hierarchy.json`의 중학교 후보와 현재 `concepts.json`의 `label_ko`/`aliases`를 비교한다.
- 성취기준 문장 전체는 concept 후보로 쓰지 않고, 기존 위계도에 기록된 `conceptTags`와 중학교 `curriculum_nodes`, `textbook_concepts`만 감사 대상으로 삼았다.
- `legacy-gap-audit.md`와 `legacy-gap-audit.csv`를 생성했으며, 현재 감사 대상 163개 중 129개는 `covered_by_label`, 34개는 `needs_review`, 0개는 `covered_by_alias`다.
- `needs_review` 항목은 공식 교육과정 또는 교과서 근거 확인 전까지 concept으로 확정하지 않고, 다음 반복의 후보 목록으로만 유지한다.
- `validate_concept_map.py`가 legacy gap audit row 수, schema, 중복 legacy id, 생성 순서, `needs_review` 수, Markdown 산출물 존재 여부를 검증하도록 보강했다.
- 이번 작업은 보조 감사 산출물과 검증만 추가했으므로 PDF 원본, 다운로드 manifest, 공식 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 legacy gap audit 검증 결과

- legacy gap audit 단위 테스트 3개와 validator 단위 테스트 23개가 통과했다.
- `legacy-gap-audit.md`와 `legacy-gap-audit.csv`는 기존 로컬 위계도 후보 163개 중 `needs_review` 34개를 보조 후보로 분리한다.

## 2026-06-26 legacy gap resolution 보강

- `build_legacy_gap_resolution.py`를 추가해 `legacy-gap-audit.csv`의 `needs_review` 34개 row를 고유 label 12개로 접었다.
- 현재 12개 후보 중 11개는 `foundational_prerequisite_candidate`, 1개는 `alias_candidate_for_existing_concept`로 분류했다.
- 기초 선수개념 후보는 공식 근거 확인 후 낮은 신뢰도의 선수개념 노드 또는 기존 개념의 상위/관련 관계로 처리할 수 있도록 보류했다.
- `피타고라스`는 독립 노드가 아니라 `피타고라스 정리` 계열 기존 concept의 alias 후보로 검토하도록 분리했다.
- `validate_concept_map.py`가 resolution audit row 수, schema, 중복 candidate label, 생성 순서, Markdown 산출물 존재 여부를 검증하도록 보강했다.
- 이번 작업은 보조 감사 산출물과 검증만 추가했으므로 PDF 원본, 다운로드 manifest, 공식 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 legacy gap resolution 검증 결과

- legacy gap resolution 단위 테스트 4개와 validator 단위 테스트 25개가 통과했다.
- `legacy-gap-resolution.md`와 `legacy-gap-resolution.csv`는 `needs_review` 34개 row를 고유 후보 12개로 축약하고, 다음 공식 근거 확인 대상을 분리한다.

## 2026-06-26 legacy gap integration plan 보강

- `build_legacy_gap_integration_plan.py`를 추가해 `legacy-gap-resolution.csv`의 고유 후보 12개를 통합 전 staging 액션으로 변환했다.
- 11개 `foundational_prerequisite_candidate`는 `stage_prerequisite_node`로 두고, `prerequisite_for` 대상 기존 concept 목록을 보존했다.
- 기초 선수개념 후보의 제안 id는 `prereq_multiplication`, `prereq_ratio`, `prereq_triangle`처럼 ASCII id로 안정화했다.
- `피타고라스`는 새 독립 노드가 아니라 `stage_alias_review`와 `alias_on_existing_concept` 액션으로 유지했다.
- `validate_concept_map.py`가 integration plan row 수, schema, 중복 candidate label, 생성 순서, resolution 후보 수와의 일치, Markdown 산출물 존재 여부를 검증하도록 보강했다.
- 이번 작업은 보조 감사 산출물과 검증만 추가했으므로 PDF 원본, 다운로드 manifest, 공식 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 legacy gap integration plan 검증 결과

- legacy gap integration plan 단위 테스트 5개와 validator 단위 테스트 27개가 통과했다.
- `legacy-gap-integration-plan.md`와 `legacy-gap-integration-plan.csv`는 고유 후보 12개를 `stage_prerequisite_node` 11개와 `stage_alias_review` 1개로 분리한다.

## 2026-06-26 legacy gap source review 보강

- `build_legacy_gap_source_review.py`를 추가해 `legacy-gap-integration-plan.csv`의 12개 후보를 공식 근거 확인 queue로 변환했다.
- target concept이 있는 후보는 기존 concept의 `source_refs`를 압축해 `target_source_refs`에 모아, 새 prerequisite node 또는 alias 확정 전 확인할 공식 문서 위치를 좁혔다.
- `비` 후보는 현재 target concept id가 없어 `target_source_ref_count: 0`으로 남기고, 관련 성취기준을 직접 확인해야 한다는 notes를 기록했다.
- 검토 상태는 `needs_official_prerequisite_confirmation` 11개와 `needs_alias_confirmation` 1개로 분리했다.
- `validate_concept_map.py`가 source review row 수, schema, 중복 candidate label, 생성 순서, integration plan 후보 수와의 일치, Markdown 산출물 존재 여부를 검증하도록 보강했다.
- 이번 작업은 보조 검토 산출물과 검증만 추가했으므로 PDF 원본, 다운로드 manifest, 공식 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 legacy gap source review 검증 결과

- legacy gap source review 단위 테스트 4개와 validator 단위 테스트 29개가 통과했다.
- `legacy-gap-source-review.md`와 `legacy-gap-source-review.csv`는 integration 후보 12개의 공식 근거 확인 queue를 보존한다.

## 2026-06-26 legacy gap evidence scan 보강

- `build_legacy_gap_evidence_scan.py`를 추가해 `legacy-gap-source-review.csv`의 target source refs 안에 후보 label이 직접 등장하는지 점검했다.
- 현재 10개 prerequisite 후보는 `target_source_refs_mention_candidate`, `피타고라스`는 `alias_source_refs_mention_candidate`, `비`는 `direct_legacy_unit_review_needed`로 분류된다.
- 후보 label이 등장한 target source ref만 `matching_target_source_refs`에 따로 모아, 다음 공식 근거 확인 때 바로 대조할 수 있게 했다.
- 이번 스캔은 증거 신호일 뿐 concept 자동 추가가 아니며, `concepts.json` 반영은 공식 문서 원문 또는 교과서 근거 확인 후 수행한다.
- `validate_concept_map.py`가 evidence scan row 수, schema, 중복 candidate label, 생성 순서, source review 후보 수와의 일치, Markdown 산출물 존재 여부를 검증하도록 보강했다.
- 이번 작업은 보조 증거 신호 산출물과 검증만 추가했으므로 PDF 원본, 다운로드 manifest, 공식 출처 선택 규칙은 변경하지 않았다.

## 2026-06-26 legacy gap evidence scan 검증 결과

- legacy gap evidence scan 단위 테스트 4개와 validator 단위 테스트 31개가 통과했다.
- `legacy-gap-evidence-scan.md`와 `legacy-gap-evidence-scan.csv`는 source review 후보 12개의 증거 신호를 보존한다.

## 2026-06-27 기초 선수개념 노드 반영

- AGENTS.md를 다시 확인하고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 범위의 산출물 보강으로 제한했다.
- legacy gap evidence scan에서 공식 target source refs에 직접 등장하던 후보 중 약수, 배수, 덧셈, 뺄셈, 곱셈, 나눗셈을 실제 concept map 노드로 반영했다.
- `m1_num_divisor`, `m1_num_multiple`은 `소인수분해` 단원의 `term` 노드로 두고, 최대공약수·최소공배수와 `used_in` 관계를 연결했다.
- `m1_num_addition`, `m1_num_subtraction`, `m1_num_multiplication`, `m1_num_division`은 `정수와 유리수의 사칙계산` 아래 `procedure` 노드로 두고, 덧셈과 뺄셈/곱셈과 나눗셈 절차에 `used_in` 관계를 연결했다.
- 여섯 노드는 교과서 쪽수 근거가 아직 없으므로 `confidence: medium`으로 두고, notes에 교과서 근거 보강 필요를 남겼다.
- `test_build_pilot_foundational_prerequisites.py`를 추가해 위 여섯 노드와 포함·활용 edge가 생성 원본에서 유지되는지 검증한다.
- 전체 파생 산출물을 재생성해 개념 노드는 471개, edge는 1231개, source ref는 4155개가 되었다.
- legacy gap audit의 `needs_review`는 34개에서 24개로 줄었고, resolution/source review/evidence scan 후보는 12개에서 6개로 줄었다.
- 남은 legacy 후보는 길이, 넓이, 도형, 삼각형, 피타고라스(alias), 비이며, `비`는 target source refs가 없어 직접 성취기준 단위 검토가 계속 필요하다.
- 이번 작업은 공식 문서에 이미 연결된 source refs를 세분화한 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 기초 선수개념 검증 결과

- `python docs/math-concept-map/tools/test_build_pilot_foundational_prerequisites.py`: 2개 통과.
- `python -m unittest discover -s docs/math-concept-map/tools -p 'test_*.py'`: 82개 통과.
- `python docs/math-concept-map/tools/validate_concept_map.py`: 471개 concept, 1231개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-29 다항식의 곱셈과 인수분해 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 9 `다항식의 곱셈과 인수분해`의 누락 미시 concept, edge 의미 품질, 연구보고서 보조 출처 적용 범위를 독립 감사했다.
- 연구보고서 p. 219의 `[9수02-19]` 성취기준별 성취수준 맥락을 직접 확인해 `다항식의 곱셈과 인수분해`, `다항식의 곱셈`, `인수분해`, `전개와 인수분해의 역관계`, `이차식`, `이차식 인수분해`의 보조 source ref로 반영했다.
- `m(a+b) 공식`과 `이차식 인수분해`를 새 concept으로 추가했다. `a^2-b^2 공식`은 기존 `(a+b)(a-b) 공식`의 alias로 보존해 중복 노드를 만들지 않았다.
- 곱셈 공식들이 `다항식의 곱셈`과 `인수분해` 양방향 절차에 쓰이는 `used_in` edge를 보강하고, `(x+a)(x+b)` 및 `(ax+b)(cx+d)` 공식은 `이차식 인수분해`에도 직접 연결했다.
- 기존 `공식 -> 이차식` 방향의 `represented_by` edge를 `이차식 -> 공식` 방향으로 정리했다. 합의 제곱/차의 제곱, 합과 차의 곱/차의 제곱 공식은 혼동 방지를 위해 대조 edge를 보강했다.
- `전개와 인수분해 방향을 혼동하는 오류`, `공통인수를 빠뜨리는 오류`, `곱셈·인수분해 공식을 기계적으로 끼워 맞추는 오류`, `완전제곱식의 가운데 항 부호를 혼동하는 오류`, `이차식과 이차방정식을 혼동하는 오류`, `인수분해한 식에서 해 조건을 빠뜨리는 오류`로 들어가던 noisy `prerequisite_for` edge를 제거하고, 오개념 위험 연결은 `often_confused_with`로 유지했다.
- 전체 파생 산출물을 재생성한 결과 concept은 540개, edge는 2319개가 되었다. source ref 총계는 concept 1522개, edge 6076개, 총 7598개이며 source catalogue는 5개이다.
- `review-queue.*`는 81개 low-confidence concept, `concept-evidence-depth.*`는 concept 540개, `edge-evidence-depth.*`는 edge 2319개, `prerequisite-map.*`는 829개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 540개, edge evidence row 2792개, pending textbook evidence row 3332개, low-confidence concept/edge row 548개를 기록한다. 이번 보강 대상 `다항식의 곱셈과 인수분해`는 rank 9이며 20개 concept과 114개 edge row, 총 134개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_factor_microconcepts.py`를 추가해 새 다항식의 곱셈과 인수분해 미시 concept, p. 219 보조 source ref 적용 범위, 곱셈/인수분해 공식 edge 방향, 오개념 confidence 유지와 noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_factor_microconcepts.py test_build_pilot_edge_sync.py`: 26개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 234개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 540개 concept, 2319개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 제곱근과 실수 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 재생성, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 rank 후보 `제곱근과 실수`의 누락 미시 concept, edge 품질, source ref 적용 범위를 병렬 감사했다. 감사 결과에 따라 오개념 노드는 선수 관계에서 제거하고 `often_confused_with` 중심의 진단 관계로 남겼으며, 연구보고서 p. 213은 교과서 근거 대체가 아닌 보조 source ref로만 적용했다.
- 연구보고서 p. 213의 `[9수01-07]`~`[9수01-10]` 성취기준별 성취수준 맥락을 직접 확인해 `제곱수`, `제곱근 구하기`, `제곱근을 근호로 나타내기`, `근호 안의 수`, `근호를 포함한 식 간단히 하기`, `제곱근의 곱셈과 나눗셈`, `근호 안의 수가 같은 제곱근의 덧셈과 뺄셈`, `실수의 수 체계`를 추가했다.
- 기존 `제곱근`, `제곱근의 성질`, `제곱근의 대소 관계`, `무리수`, `실수`, `실수의 대소 관계`, `근호를 포함한 식`, `근호를 포함한 식의 사칙계산`에도 p. 213 보조 source ref를 추가했다. 단, `근호가 나타내는 제곱근의 부호를 혼동하는 오류`, `무한소수와 무리수를 같은 말로 보는 오류`, `근호 안의 수가 다른 제곱근을 동류항처럼 더하는 오류`에는 p. 213을 붙이지 않았고 confidence도 `low`로 유지했다.
- edge 품질 보강으로 단위정사각형 대각선 표현 방향을 `무리수 -> 한 변의 길이가 1인 정사각형의 대각선`의 `represented_by`로 바로잡고, `제곱수`, `제곱근 구하기`, 근호 표현, 근호식 간단히 하기, 제곱근의 곱셈·나눗셈, 같은 근호 덧셈·뺄셈, 실수 수 체계, 수직선 기반 실수 대소 관계, 순환소수와 무리수 대비 관계를 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 548개, edge는 2365개가 되었다. source ref 총계는 concept 1553개, edge 6215개, 총 7768개이며 source catalogue는 5개이다.
- `review-queue.*`는 81개 low-confidence concept, `concept-evidence-depth.*`는 concept 548개, `edge-evidence-depth.*`는 edge 2365개, `prerequisite-map.*`는 838개 선수 관계 edge로 갱신되었다. `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 548개, edge evidence row 2847개, pending textbook evidence row 3395개, low-confidence concept/edge row 546개를 기록한다. 이번 보강 뒤 `제곱근과 실수`는 현재 workplan rank 9이며 25개 concept과 120개 edge row, 총 145개 row가 모두 `pending_textbook_pdf` 상태이다. 이전 rank 9였던 `다항식의 곱셈과 인수분해`는 rank 10으로 재정렬되었다.
- `test_build_pilot_square_root_microconcepts.py`를 추가해 제곱근·근호 미시 절차, p. 213 source ref 범위, 오개념 prerequisite 제거, 새 edge 방향을 고정했다.
- 표적 테스트: `python -m unittest test_build_pilot_square_root_microconcepts.py` 5개, `python -m unittest test_build_pilot_edge_sync.py` 21개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`: 239개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 548개 concept, 2365개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-01 일차함수와 일차방정식의 관계 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 재생성, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `일차함수와 일차방정식의 관계`의 그래프 표현, 대수-그래프 연결, 오개념/noisy edge 후보를 병렬 감사했다. `Poincare`는 그래프 표현 gaps, `Planck`는 방정식 해와 그래프 절차 연결, `Russell`은 교점·해·해의 개수 오개념과 broad prerequisite 소음을 검토했다.
- `미지수가 2개인 일차방정식 해의 순서쌍`, `미지수가 2개인 일차방정식의 그래프`, `미지수가 2개인 일차방정식 해 전체의 그래프`, `교점의 좌표`, `교점의 개수와 연립일차방정식 해의 개수의 관계`, `교점의 개수와 해의 개수를 따로 보는 오류`, `한 일차방정식의 그래프를 연립일차방정식의 해로 보는 오류`를 추가했다.
- `미지수가 2개인 일차방정식 하나의 해 전체 그래프`와 `연립일차방정식을 나타내는 두 그래프`를 `contrasts_with`로 구별하고, `해의 순서쌍 -> 좌표평면의 점 -> 해 전체의 그래프 -> 일차함수와 방정식의 관계`, `교점 -> 교점의 좌표 -> 연립일차방정식의 해`, `교점의 개수 -> 해의 개수 관계` 흐름을 edge로 연결했다.
- broad prerequisite 소음은 줄였다. `m1_system_unit -> m1_func_eq_relation_unit`은 `prerequisite_for`에서 `related_to`로 낮추고, 오개념 노드인 `m1_mis_intersection_solution`에는 선수 관계를 두지 않았다. 기울기·x절편·y절편이 이번 단원의 새 그래프 노드에 직접 prerequisite로 붙지 않도록 테스트로 고정했다.
- 전체 파생 산출물을 재생성한 결과 concept은 740개, edge는 3351개가 되었다. source ref audit은 10794개 ref를 기록하고, source catalogue는 5개를 유지한다.
- `review-queue.*`는 111개 low-confidence concept, `concept-evidence-depth.*`는 concept 740개, `edge-evidence-depth.*`는 edge 3351개, `prerequisite-map.*`은 1219개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹을 유지한다. 재생성 후 `일차함수와 일차방정식의 관계`는 rank 22이며 concept 16개, edge evidence row 81개, 총 97개 evidence row가 모두 `pending_textbook_pdf` 상태이고 low-confidence concept/edge row는 14개다.
- `test_build_pilot_function_equation_relation_microconcepts.py`를 추가해 새 미시 concept, `[9수02-17]`·`[9수02-18]`·`[9수02-05]` source locator, 해의 순서쌍/해 전체 그래프/교점 좌표 edge, 단일 방정식 그래프와 두 그래프의 구별, 오개념 confidence 유지, noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_function_equation_relation_microconcepts.py` 4개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 294개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 740개 concept, 3351개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 다음 작업

- 중1~중3 수학 교과서 PDF가 추가되면 목차, 학습 목표, 본문 정의, 정리, 예제, 용어 설명 순서로 모든 영역의 노드를 보강한다.
- 교과서 쪽수 근거가 확보되면 `low` 신뢰도 노드와 이번에 `medium`으로 둔 기초 선수개념 노드를 재검토하고 병합 또는 승격한다.
- 남은 legacy 후보 6개는 공식 성취기준 원문과 교과서 본문 근거를 확인한 뒤 concept 추가, alias 추가, 또는 기존 concept의 관계 보강으로 처리한다.

## 2026-06-27 도형·측정 기초 노드 반영

- 남은 legacy 후보 중 target source refs에 직접 등장하던 도형, 삼각형, 길이, 넓이를 실제 concept map 노드로 반영했다.
- `m1_geo_figure`는 `도형과 측정` 영역 아래의 넓은 `core_concept`로 두고, 기본 도형·평면도형·입체도형·도형의 닮음 단원과 `used_in` 관계를 연결했다.
- `m1_geo_triangle`은 `도형` 아래의 `core_concept`로 두고, 삼각형의 작도·합동 조건·닮음 조건·직각삼각형으로 이어지는 관계를 연결했다.
- `m1_geo_length`, `m1_geo_area`는 도형과 측정 영역의 `term` 노드로 두고, 부채꼴의 호의 길이와 넓이, 세 변의 길이로 직각삼각형 판별, 겉넓이, 삼각비를 이용한 삼각형의 넓이와 연결했다.
- `피타고라스`는 새 독립 노드로 만들지 않고 기존 `피타고라스 정리` 단원/정리 concept의 alias로 반영했다.
- 네 개의 새 노드는 교과서 쪽수 근거가 아직 없으므로 `confidence: medium`으로 두고, notes에 교과서 근거 보강 필요를 남겼다.
- `test_build_pilot_geometry_foundations.py`를 추가해 위 네 노드와 피타고라스 alias, 핵심 `used_in` edge가 생성 원본에서 유지되는지 검증한다.
- 전체 파생 산출물을 재생성해 개념 노드는 475개, edge는 1253개, source ref는 4262개가 되었다.
- legacy gap audit의 `needs_review`는 24개에서 7개로 줄었고, resolution/source review/evidence scan 후보는 `비` 1개만 남았다.
- 이번 작업도 공식 문서에 이미 연결된 source refs를 세분화한 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 도형·측정 기초 노드 검증 결과

- `python docs/math-concept-map/tools/test_build_pilot_geometry_foundations.py`: 3개 통과.
- `python -m unittest discover -s docs/math-concept-map/tools -p 'test_*.py'`: 85개 통과.
- `python docs/math-concept-map/tools/validate_concept_map.py`: 475개 concept, 1253개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-27 비 공통 선수개념 반영

- 남은 legacy 후보 `비`를 단독 확정 용어가 아니라 여러 단원에서 반복되는 공통 선수개념으로 분리했다.
- `m1_num_ratio`는 `수와 연산 > 공통 선수개념`의 `term` 노드로 두고, `비율`, `두 양의 비`, `ratio`를 alias로 보존했다.
- 정비례·반비례, 닮음비, 평행선 사이의 선분 길이의 비, 삼각비, 상대도수, 경우의 수의 비율로서의 확률과 `used_in` 관계를 연결했다.
- 공식 문서에는 `비` 단독 용어 근거가 약하고 교과서 본문 및 초등 연계 근거가 아직 없으므로 `confidence: low`와 notes에 보강 필요를 남겼다.
- `test_build_pilot_ratio_foundation.py`를 추가해 `비` 노드의 낮은 신뢰도 상태와 cross-domain 연결 edge가 생성 원본에서 유지되는지 검증한다.
- 전체 파생 산출물을 재생성해 개념 노드는 476개, edge는 1262개, source ref는 4298개가 되었다.
- legacy gap audit의 `needs_review`는 7개에서 0개로 줄었고, resolution/source review/evidence scan 후보도 0개가 되었다.
- `review-queue`는 67개 low-confidence concept으로 갱신되었으며, `비`는 이 큐에서 교과서·초등 연계 근거 보강 대상으로 추적한다.
- 이번 작업도 공식 문서에 이미 연결된 source refs를 세분화한 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 비 공통 선수개념 검증 결과

- `python docs/math-concept-map/tools/test_build_pilot_ratio_foundation.py`: 2개 통과.
- `python -m unittest discover -s docs/math-concept-map/tools -p 'test_*.py'`: 87개 통과.
- `python docs/math-concept-map/tools/validate_concept_map.py`: 476개 concept, 1262개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-27 교과서 근거 패킷 슬롯 보강

- `textbook-evidence-packets/rank-01`~`rank-34`의 각 concept row에 `required_evidence_fields`와 `evidence_focus`를 추가했다.
- `required_evidence_fields`는 concept 유형별로 먼저 채워야 할 교과서 근거 슬롯을 구분한다. `term`은 `term_explanation_ref`, `definition_ref`, `textbook_page_refs`를 우선 요구하고, `misconception_risk`는 `example_ref`, `problem_pattern_ref`, `textbook_page_refs`를 우선 요구한다.
- `confidence: low`인 concept은 교과서 근거 판단 메모가 필요하므로 `extraction_notes`를 필수 슬롯에 추가했다.
- Markdown 패킷 표에도 `required evidence`와 `focus` 열을 추가해, 교과서 PDF가 들어온 뒤 단원별로 어떤 근거를 먼저 찾아야 하는지 바로 볼 수 있게 했다.
- `test_build_textbook_evidence_packet.py`를 보강해 오개념 위험 노드와 용어 노드의 필수 근거 슬롯이 다르게 생성되는지 검증한다.
- 이번 작업도 패킷 구조와 문서만 갱신했으므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 교과서 근거 패킷 슬롯 검증 결과

- `python docs/math-concept-map/tools/test_build_textbook_evidence_packet.py`: 6개 통과.
- `python -m unittest discover -s docs/math-concept-map/tools -p 'test_*.py'`: 87개 통과.
- `python docs/math-concept-map/tools/validate_concept_map.py`: 476개 concept, 1262개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 다음 작업

- 중1~중3 수학 교과서 PDF가 추가되면 목차, 학습 목표, 본문 정의, 정리, 예제, 용어 설명 순서로 모든 영역의 노드를 보강한다.
- 교과서 쪽수 근거가 확보되면 `low` 신뢰도 노드와 이번에 `medium`으로 둔 기초 선수개념 노드를 재검토하고 병합 또는 승격한다.
- `비`는 교과서 본문, 용어 설명, 초등 연계 문서에서 단독 정의 또는 활용 맥락 근거를 확인해 `m1_num_ratio`의 confidence 승격 여부를 판단한다.

## 2026-06-27 선수 관계 지도 산출물 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 범위의 산출물 보강으로 제한했다.
- `build_prerequisite_map.py`를 추가해 `concepts.json`의 `prerequisite_for` edge를 concept 쌍 단위로 펼친 `prerequisite-map.csv`와 사람이 읽는 `prerequisite-map.md`를 생성하게 했다.
- `prerequisite-map.csv`는 원본 edge id, 선수/후속 concept id와 label, 학년·영역·단원, 전이 범위, 신뢰도, source ref 요약을 보존한다.
- `prerequisite-map.md`는 383개 선수 관계 edge를 `same_unit`, `cross_unit_same_domain`, `cross_domain_same_grade`, `cross_grade_same_domain`, `cross_grade_cross_domain`으로 나누어 단원 전이 흐름을 검토할 수 있게 했다.
- 현재 선수 관계 edge는 383개이며, source concept 152개와 target concept 220개가 참여한다. 신뢰도 분포는 high 283개, medium 60개, low 40개다.
- `validate_concept_map.py`가 `prerequisite-map.csv`의 행 수, 필드, edge id 누락, 생성 순서를 `concepts.json`의 `prerequisite_for` edge와 대조하도록 보강했다.
- `README.md`와 `SCHEMA.md`에 새 산출물, 생성 명령, 검증 범위, CSV 필드 설명을 반영했다.
- 이번 작업은 기존 edge를 재가공해 선수 관계 추적성을 높인 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 선수 관계 지도 검증 결과

- TDD red: `python .\docs\math-concept-map\tools\test_build_prerequisite_map.py`가 `ModuleNotFoundError: No module named 'build_prerequisite_map'`로 실패하는 것을 확인했다.
- TDD green: `python .\docs\math-concept-map\tools\test_build_prerequisite_map.py`: 4개 통과.
- Validator 보강 red: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`가 새 prerequisite helper 부재로 2개 error를 내는 것을 확인했다.
- Validator 보강 green: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`: 33개 통과.
- 전체 검증: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 93개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1262개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 다음 작업

- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`와 `prerequisite-map.csv`를 함께 사용해 concept별 본문·예제 근거와 선수 edge별 쪽수 근거를 누적한다.
- 교과서 쪽수 근거가 확보되면 `low` 신뢰도 노드, `medium` 기초 선수개념, `low` 선수 edge 40개를 우선 재검토한다.
- `비`는 교과서 본문, 용어 설명, 초등 연계 문서에서 단독 정의 또는 활용 맥락 근거를 확인해 `m1_num_ratio`의 confidence 승격 여부를 판단한다.

## 2026-06-27 선수 단원 전이 Graphviz 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 범위의 산출물 보강으로 제한했다.
- `build_prerequisite_map.py`가 `prerequisite-map.csv`, `prerequisite-map.md`와 함께 `prerequisite-unit-graph.dot`를 생성하도록 확장했다.
- `prerequisite-unit-graph.dot`는 383개 `prerequisite_for` edge를 81개 학년·영역·단원 전이 edge로 압축한다.
- DOT node는 학년·영역·단원 조합이며, edge label은 해당 전이의 선수 관계 수와 high/medium/low 신뢰도 분포를 기록한다.
- `low` 신뢰도 선수가 포함된 단원 전이는 붉은 edge로 표시해, 교과서 근거가 들어왔을 때 우선 재검토할 흐름을 찾기 쉽게 했다.
- `validate_concept_map.py`가 DOT 파일의 graph id, LR 방향, edge line 수가 `prerequisite-map.csv`에서 생성한 단원 전이 수와 일치하는지 확인하도록 보강했다.
- `README.md`와 `SCHEMA.md`에 새 DOT 산출물과 검증 범위, DOT 구조 설명을 반영했다.
- 이번 작업은 기존 선수 관계를 시각화한 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 선수 단원 전이 Graphviz 검증 결과

- TDD red: `python .\docs\math-concept-map\tools\test_build_prerequisite_map.py`가 `AttributeError: module 'build_prerequisite_map' has no attribute 'render_unit_graph_dot'`로 실패하는 것을 확인했다.
- TDD green: `python .\docs\math-concept-map\tools\test_build_prerequisite_map.py`: 5개 통과.
- Validator 보강 red: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`가 새 DOT helper 부재로 2개 error를 내는 것을 확인했다.
- Validator 보강 green: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`: 35개 통과.
- 전체 검증: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 96개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1262개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`를 함께 사용해 concept별 본문·예제 근거와 선수 edge별 쪽수 근거를 누적한다.
- 교과서 쪽수 근거가 확보되면 `low` 신뢰도 노드, `medium` 기초 선수개념, `low` 선수 edge 40개, `low` 포함 단원 전이를 우선 재검토한다.
- `비`는 교과서 본문, 용어 설명, 초등 연계 문서에서 단독 정의 또는 활용 맥락 근거를 확인해 `m1_num_ratio`의 confidence 승격 여부를 판단한다.

## 2026-06-27 노드 배열-edge 일관성 감사 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 범위의 산출물 보강으로 제한했다.
- `build_node_edge_consistency_audit.py`를 추가해 concept 노드의 `parent_ids`, `prerequisite_ids`, `related_ids` 배열과 명시적 edge row 사이의 비동기 항목을 `node-edge-consistency-audit.csv`와 `node-edge-consistency-audit.md`로 생성하게 했다.
- 현재 감사 row는 950개이며, `missing_edge_for_parent_id` 102개, `missing_edge_for_prerequisite_id` 342개, `missing_edge_for_related_id` 469개, `edge_without_parent_id` 27개, `edge_without_prerequisite_id` 10개다.
- 이 row들은 즉시 실패 처리할 오류가 아니라 검토 큐다. `related_ids`는 넓은 의미 관계를 보존하는 경우가 있어, 공식 근거 또는 교과서 근거를 확인한 뒤 edge 추가, 배열 정리, 관계 유형 조정 중 하나로 처리한다.
- `validate_concept_map.py`가 `node-edge-consistency-audit.csv`의 필드, row 수, issue key 누락, 생성 순서를 현재 `concepts.json`에서 재생성한 감사 row와 대조하도록 보강했다.
- `README.md`와 `SCHEMA.md`에 새 산출물, 생성 명령, 검증 범위, CSV 필드 설명을 반영했다.
- 이번 작업은 기존 concept/edge 구조의 정합성 검토층을 추가한 것이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 노드 배열-edge 일관성 감사 검증 결과

- TDD red: `python .\docs\math-concept-map\tools\test_build_node_edge_consistency_audit.py`가 `ModuleNotFoundError: No module named 'build_node_edge_consistency_audit'`로 실패하는 것을 확인했다.
- TDD green: `python .\docs\math-concept-map\tools\test_build_node_edge_consistency_audit.py`: 5개 통과.
- Validator 보강 red: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`가 새 consistency helper 부재로 2개 error를 내는 것을 확인했다.
- Validator 보강 green: `python .\docs\math-concept-map\tools\test_validate_concept_map.py`: 37개 통과.
- 전체 검증: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 103개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1262개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 노드 배열-edge 자동 동기화 보강

- AGENTS.md를 다시 확인하고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 진행했다.
- `build_pilot.py`에 `append_missing_edges_from_concept_array`를 추가해 모든 수동 edge가 정의된 뒤 `parent_ids`는 `contains`, `prerequisite_ids`는 `prerequisite_for` edge로 자동 보강되게 했다.
- `related_ids`는 `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, `used_in` 중 어느 관계인지 출처 확인이 필요하므로 자동 확정하지 않고 감사 큐에 남겼다.
- `test_build_pilot_edge_sync.py`를 추가해 모든 `parent_ids`와 `prerequisite_ids`가 명시적 edge로 내려오는지 생성 원본에서 고정했다.
- 전체 파생 산출물을 재생성해 개념 노드는 476개, edge는 1706개, source ref는 5330개가 되었다.
- `prerequisite-map.csv`는 725개 선수 관계 edge를 보존하고, `prerequisite-unit-graph.dot`는 112개 단원 전이 edge를 포함한다.
- `node-edge-consistency-audit.csv`는 506개 검토 row로 줄었고, `missing_edge_for_parent_id`와 `missing_edge_for_prerequisite_id`는 0개가 되었다. 남은 항목은 `missing_edge_for_related_id` 469개, `edge_without_parent_id` 27개, `edge_without_prerequisite_id` 10개다.
- 이번 작업은 기존 concept/edge 동기화와 파생 감사 정비이므로 기존 PDF 원본, 다운로드 manifest, 출처 선택 규칙은 변경하지 않았다.

## 2026-06-27 노드 배열-edge 자동 동기화 검증 결과

- TDD red 1: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 `parent_ids`에 대응하는 `contains` edge 누락으로 실패하는 것을 확인했다.
- TDD green 1: 누락된 `contains` edge를 자동 보강한 뒤 같은 테스트가 통과했다.
- TDD red 2: 같은 테스트 파일에 `prerequisite_ids` 검증을 추가하자 `prerequisite_for` edge 누락으로 실패하는 것을 확인했다.
- TDD green 2: `prerequisite_ids`도 자동 보강한 뒤 `test_build_pilot_edge_sync.py`의 2개 테스트가 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 105개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1706개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 edge 기반 노드 배열 역동기화 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 진행했다.
- `build_pilot.py`에 `append_missing_concept_array_entries_from_edges`를 추가해 `contains` edge는 target concept의 `parent_ids`, `prerequisite_for` edge는 target concept의 `prerequisite_ids`에 누락 없이 반영되게 했다.
- `test_build_pilot_edge_sync.py`에 역방향 검증 2개를 추가해 edge와 노드 배열의 양방향 동기화를 고정했다.
- 전체 파생 산출물을 재생성했으며 개념 노드는 476개, edge는 1706개로 유지된다.
- `node-edge-consistency-audit.csv`는 469개 검토 row로 줄었고, 남은 항목은 모두 `missing_edge_for_related_id`다. `edge_without_parent_id`와 `edge_without_prerequisite_id`는 0개가 되었다.
- `related_ids`는 관계 유형이 `related_to`, `contrasts_with`, `often_confused_with`, `represented_by`, `used_in` 중 무엇인지 공식·교과서 근거 확인이 필요하므로 자동 확정하지 않았다.

## 2026-06-27 edge 기반 노드 배열 역동기화 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 `contains` edge 27개와 `prerequisite_for` edge 10개가 노드 배열에 반영되지 않아 실패하는 것을 확인했다.
- TDD green: edge 기반 배열 보강을 추가한 뒤 같은 테스트 파일의 4개 테스트가 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 107개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1706개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 related edge 해소 큐 보강

- AGENTS.md를 다시 확인하고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 파생 산출물 보강으로 진행했다.
- `build_related_edge_resolution_queue.py`를 추가해 `node-edge-consistency-audit.csv`에 남은 `missing_edge_for_related_id` 469개를 후보 관계 유형과 처리 우선순위로 펼치게 했다.
- 후보 관계 유형은 `often_confused_with`, `represented_by; related_to`, `used_in; related_to`, `contrasts_with; related_to`, `related_to` 중 하나이며, 확정 edge가 아니라 공식 문서 또는 교과서 본문 근거를 확인하기 위한 검토 힌트로 기록한다.
- `related-edge-resolution-queue.csv`와 `related-edge-resolution-queue.md`를 생성했다. 현재 후보는 469개이며, 이 중 high priority 90개, medium priority 1개다.
- `validate_concept_map.py`가 새 큐의 row 수, 필드, key 누락, 생성 순서를 현재 concept map과 node-edge 감사 결과에서 재생성한 값과 대조하도록 보강했다.
- `README.md`, `SCHEMA.md`, `source-audit.md`에 새 산출물의 목적, 생성 명령, 검증 범위, CSV 필드를 반영했다.

## 2026-06-27 related edge 해소 큐 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_related_edge_resolution_queue.py`가 `ModuleNotFoundError: No module named 'build_related_edge_resolution_queue'`로 실패하는 것을 확인했다.
- TDD green: `build_related_edge_resolution_queue.py` 구현 후 같은 테스트 파일의 2개 테스트가 통과했다.
- Validator 보강 red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_validate_concept_map.py`가 related edge resolution helper 2개 부재로 실패하는 것을 확인했다.
- Validator 보강 green: related edge resolution helper와 main 검증을 추가한 뒤 `test_validate_concept_map.py` 39개 테스트가 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 111개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1706개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 오개념 related edge 보강

- AGENTS.md를 다시 확인하고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 진행했다.
- `build_pilot.py`에 `append_missing_misconception_related_edges`를 추가해, `related_ids` 양끝 중 하나가 `misconception_risk`인 경우 낮은 신뢰도의 `often_confused_with` edge를 자동 보강하게 했다.
- 새 edge는 오개념 위험 concept을 source로 삼고, source refs는 오개념 위험 concept 또는 상대 concept의 기존 source refs를 보존한다. notes에는 교과서 근거 확인 후 유지 또는 조정해야 한다는 단서를 남겼다.
- `test_build_pilot_edge_sync.py`에 오개념 위험 `related_ids`가 `often_confused_with` edge로 연결되는지 검증하는 테스트를 추가했다.
- 전체 파생 산출물을 재생성해 개념 노드는 476개, edge는 1784개, source ref는 5488개가 되었다.
- `often_confused_with` edge는 99개에서 177개로 늘었고, `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 469개에서 379개로 줄었다.
- `related-edge-resolution-queue.csv`에는 이제 high priority 항목이 없고, medium 1개, low 376개, backlog 2개가 남았다.

## 2026-06-27 오개념 related edge 보강 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 오개념 위험 `related_ids`에 대응하는 `often_confused_with` edge 누락으로 실패하는 것을 확인했다.
- TDD green: 오개념 related edge 자동 보강 후 같은 테스트 파일의 5개 테스트가 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 112개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1784개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 medium 1개와 low 376개, backlog 2개를 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 이차함수·일차방정식·일차함수 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 이차함수 그래프 그리기/그래프 성질, 꼭짓점형/축·꼭짓점, `y=ax^2` 그래프/꼭짓점형, 일차방정식·일차부등식 모델링과 풀이·해 확인, 일차함수 그래프식·그래프 그리기와 기울기·절편, 함수 판별 관련 20개 pair를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로, 새 edge는 `confidence: medium`과 짧은 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 이차함수·일차방정식·일차함수 상단 묶음의 reviewed edge가 재생성 후 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1875개, source ref는 concept 1239개와 edge 4469개를 합쳐 총 5708개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 114건에서 94건으로 줄었고, 남은 항목은 low 92건과 backlog 2건이다.

## 2026-06-27 이차함수·일차방정식·일차함수 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 reviewed edge 20개 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 13개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 120개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1875개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 92건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 `y=ax+b` 그래프/기울기·y절편, `y=ax` 그래프/기울기, 교점 개수/연립방정식 그래프 관계, 상황 그래프화/표현 변환, 일상 언어/식·표·그래프 표현 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 추적한다.

## 2026-06-27 구조 중복 related_ids 정리와 좌표 semantic edge 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 산출물·생성 로직 정비로 제한했다.
- `related_ids`가 `contains` 또는 `prerequisite_for`만 반복하는 경우에는 `related_ids`에서 제거하도록 `build_pilot.py`에 구조 중복 정리 단계를 추가했다.
- `related_ids`는 이제 parent/prerequisite 구조 관계의 중복 저장소가 아니라 `related_to`, `contrasts_with`, `represented_by`, `used_in`, `often_confused_with` 같은 semantic 관계 후보를 담는 배열로 유지한다.
- 좌표평면과 그래프 단원에서는 `x축`-`y축` 대조, `원점`-두 축 연결, `축 위의 점`-`x축/y축` 연결, `좌표`-`순서쌍/수직선` 표현, `좌표`-`좌표 표현의 편리함` 활용 관계를 명시 edge로 보강했다.
- 새 테스트는 구조 관계만 중복하는 `related_ids`가 남지 않는지, 좌표 단원의 핵심 semantic related pair가 검토된 edge로 보존되는지 확인한다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1792개가 되었으며, source ref는 concept 1239개, edge 4264개, 총 5503개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 379건에서 214건으로 줄었다. 남은 항목은 low 212개와 backlog 2개이며 high/medium priority 항목은 없다.

## 2026-06-27 구조 중복 related_ids 정리 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 구조 관계만 중복하는 `related_ids` 157건과 좌표 semantic edge 8건 누락으로 실패하는 것을 확인했다.
- TDD green: 구조 중복 정리와 좌표 semantic edge 보강 후 같은 테스트 파일의 7개 테스트가 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 114개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1792개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`에 남은 low 212개와 backlog 2개를 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue의 최상단은 도형과 측정 영역의 기본 도형·삼각비·원/입체도형 관련 reciprocal related pair이므로, 다음 반복에서는 이 묶음을 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 도형·측정 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 산출물·생성 로직 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 도형·측정 reciprocal related pair를 검토해 교점/교선, 점/직선/평면, 사인/코사인/탄젠트 누락 쌍, 외접원/내접원, 각뿔대/원뿔대, 모형·공학 도구와 단면, 대변/대각, 호/중심각, 내각/외각 관계를 명시 edge 12개로 보강했다.
- 공식 교육과정의 같은 성취기준 또는 용어·기호 목록에서 함께 확인되는 관계를 근거로 삼되, 교과서 본문·예제 근거가 아직 없으므로 새 edge는 `confidence: medium`으로 두었다.
- `test_build_pilot_edge_sync.py`에 도형·측정 상단 묶음의 semantic related edge가 재생성 과정에서 유지되는지 고정하는 회귀 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1804개, source ref는 concept 1239개와 edge 4295개를 합쳐 총 5534개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 214건에서 190건으로 줄었고, 남은 큐는 low 188건과 backlog 2건이다.

## 2026-06-27 도형·측정 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 도형·측정 semantic edge 12개 누락으로 실패하는 것을 확인했다.
- TDD green: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`: 8개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 115개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1804개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 188건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 볼록다각형 범위와 대각선 개수·다각형 내각합, 인수분해 공식의 제곱합/제곱차, 계수/상수항, 밑/지수, 이차함수 일반형/꼭짓점형 관련 reciprocal pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 다각형·대수·함수 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 산출물·생성 로직 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 10개 고유 쌍을 검토해 볼록다각형 범위와 대각선 개수·다각형 내각합, `(a+b)^2`/`(a-b)^2` 공식, 계수/상수항, 밑/지수, 이차함수 일반형/꼭짓점형, 양변과 좌변·우변, x절편/y절편, 속력 맥락의 거리/시간 관계를 명시 edge로 보강했다.
- 양변은 좌변·우변을 포함하는 용어로 보아 `contains` edge를 두고, 나머지는 공식 근거의 의미에 따라 `related_to` 또는 `contrasts_with`로 확정했다.
- `test_build_pilot_edge_sync.py`에 다각형·대수·함수 상단 묶음의 reviewed edge가 재생성 과정에서 유지되는지 고정하는 회귀 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1814개, source ref는 concept 1239개와 edge 4316개를 합쳐 총 5555개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 190건에서 170건으로 줄었고, 남은 큐는 low 168건과 backlog 2건이다.

## 2026-06-27 다각형·대수·함수 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 다각형·대수·함수 reviewed edge 10개 누락으로 실패하는 것을 확인했다.
- TDD green: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`: 9개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 116개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1814개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 168건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 식/표 표현, 유리수와 순환소수 관계와 순환소수를 분수로 나타내기, 덧셈/뺄셈, 교환법칙/결합법칙, 곱셈/나눗셈, 양·음의 부호와 양수·음수 관련 reciprocal pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 수와 연산·자료 표현 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 산출물·생성 로직 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 10개 고유 쌍을 검토해 식/표, 유리수와 순환소수의 관계/순환소수를 분수로 나타내기, 덧셈/뺄셈, 교환법칙/결합법칙, 곱셈/나눗셈, 양·음의 부호와 양수·음수, 근호를 포함한 식/분모의 유리화, 또는/동시에 확률, 평균/최빈값 관계를 명시 edge로 보강했다.
- 식/표와 사칙연산 쌍은 같은 상황을 함께 표현하거나 대응되는 절차로 다루므로 `related_to`, 순환소수 관계와 근호식은 절차의 근거 또는 대상이므로 `used_in`, 법칙·부호·확률·대푯값 쌍은 구별이 필요해 `contrasts_with`로 확정했다.
- `test_build_pilot_edge_sync.py`에 수와 연산·자료 표현 상단 묶음의 reviewed edge가 재생성 과정에서 유지되는지 고정하는 회귀 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1824개, source ref는 concept 1239개와 edge 4342개를 합쳐 총 5581개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 170건에서 150건으로 줄었고, 남은 큐는 low 148건과 backlog 2건이다.

## 2026-06-27 수와 연산·자료 표현 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 수와 연산·자료 표현 reviewed edge 10개 누락으로 실패하는 것을 확인했다.
- TDD green: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`: 10개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 117개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1824개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 148건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 상관관계 없음/양의 상관관계, 평각/맞꼭지각, 삼각형 닮음 판별/평행선 사이 선분 길이의 비, 사각형 사이 관계/증명, 원의 성질/평면도형의 성질, 입체도형 모형 탐구/전개도 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 자료·도형 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 자료·도형 관련 pair를 검토해 상관관계 없음/양의 상관관계, 평각/맞꼭지각, 평행선 사이 선분 길이의 비/삼각형 닮음 판별, 사각형 사이 관계/증명, 원의 성질/평면도형의 성질, 입체도형 모형 탐구/전개도, 각기둥·각뿔·구와 겉넓이·부피, 단면/전개도, 삼각형 작도/삼각형의 합동 조건, 할선/현, 직각삼각형/직각삼각형 판별 관계를 명시 edge 16개로 보강했다.
- 공식 교육과정과 성취수준 문서에서 같은 단원·성취기준·용어 흐름으로 확인되는 관계를 근거로 삼되, 교과서 본문·예제 쪽수 근거가 아직 없으므로 새 edge는 `confidence: medium`으로 두었다.
- `test_build_pilot_edge_sync.py`에 자료·도형 상단 묶음의 reviewed edge가 재생성 과정에서 유지되는지 고정하는 회귀 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1840개, source ref는 concept 1239개와 edge 4384개를 합쳐 총 5623개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 150건에서 132건으로 줄었고, 남은 큐는 low 130건과 backlog 2건이다.

## 2026-06-27 자료·도형 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 자료·도형 reviewed edge 16개 누락으로 실패하는 것을 확인했다.
- TDD green: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`: 11개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 118개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1840개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 130건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 이차식/이차항, 계수/차수, 문자식/식, 다항식 계산 확장/다항식의 덧셈·뺄셈·단항식과 다항식의 곱셈·나눗셈, 식의 간단히 하기, 식의 계산/방정식, 연립방정식 모델링/해·풀이, 이차방정식의 중근/근의 공식 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 문자식·방정식 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 문자식·방정식 관련 15개 고유 pair를 검토해 이차식/이차항, 계수/차수, 문자를 사용한 식/식, 사칙연산 원리의 다항식 계산 확장과 다항식 덧셈·뺄셈/단항식과 다항식 곱셈·나눗셈, 식 간단히 하기와 다항식 계산, 식의 계산/방정식, 연립방정식 모델링과 해·풀이, 이차방정식의 중근/근의 공식, 활용 문제 해결/표준형, 근의 공식/해, 이차방정식 풀이/인수분해 풀이, 표준형/풀이 관계를 명시 edge로 보강했다.
- 공식 교육과정과 성취수준 문서에서 같은 단원·성취기준·용어 흐름으로 확인되는 관계를 근거로 삼되, 교과서 본문·예제 쪽수 근거가 아직 없으므로 새 edge는 `confidence: medium`으로 두었다.
- `test_build_pilot_edge_sync.py`에 문자식·방정식 상단 묶음의 reviewed edge가 재생성 과정에서 유지되는지 고정하는 회귀 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1855개, source ref는 concept 1239개와 edge 4432개를 합쳐 총 5671개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 132건에서 114건으로 줄었고, 남은 큐는 low 112건과 backlog 2건이다.

## 2026-06-27 문자식·방정식 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 문자식·방정식 reviewed edge 15개 누락으로 실패하는 것을 확인했다.
- TDD green: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`: 12개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 119개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1855개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 112건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 이차함수 그래프 그리기/그래프 성질, 꼭짓점형/축·꼭짓점, `y=ax^2` 그래프/꼭짓점형, 일차방정식 모델링/해 확인·풀이, 미지수/해, 일차부등식 모델링/해 확인·풀이, 일차함수 그래프 식 구하기/기울기·y절편 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 누적한다.

## 2026-06-27 표현 변환·수와 연산 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 `y=ax`, `y=ax+b` 그래프와 기울기·y절편, 두 일차함수 그래프의 교점 개수, 상황 그래프화와 표현 변환, 일상 언어·표·식·그래프 표현, 소인수분해·서로소·합성수, 유리수와 순환소수, 역수와 나눗셈, 음수와 수직선, 제곱근 비교 관련 20개 pair를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로, 새 edge는 `confidence: medium`과 짧은 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 표현 변환·수와 연산 상단 묶음의 reviewed edge가 재생성 후 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1895개, source ref는 concept 1239개와 edge 4526개를 합쳐 총 5765개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 94건에서 73건으로 줄었고, 남은 항목은 low 71건과 backlog 2건이다.

## 2026-06-27 표현 변환·수와 연산 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 reviewed edge 20개 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 14개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 121개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1895개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 71건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 대표값 선택, 계급값·계급의 크기와 도수분포표/히스토그램, 도수분포표와 도수분포다각형·상대도수, 상대도수 표·그래프와 분포 해석, 통계적 근거 토론과 비판적 그래프 읽기, 도형의 각·평행선 각 성질 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 추적한다.

## 2026-06-27 자료·가능성 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 대표값 선택, 계급값·계급의 크기와 도수분포표/히스토그램, 도수분포표와 도수분포다각형·상대도수, 상대도수 표·그래프와 분포 해석, 통계적 근거 토론과 비판적 그래프 읽기, 공학 도구 자료 분석, 상자그림 비교, 편차·표준편차 관련 12개 queue row를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로, 새 edge는 `confidence: medium`과 짧은 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 자료·가능성 상단 묶음의 reviewed edge가 재생성 후 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1906개, source ref는 concept 1239개와 edge 4557개를 합쳐 총 5796개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 73건에서 61건으로 줄었고, 남은 항목은 low 59건과 backlog 2건이다.

## 2026-06-27 자료·가능성 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 reviewed edge 묶음 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 15개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 122개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1906개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 59건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 각과 평행선 각 성질, 평행선 각 성질과 평행선 사이 선분 길이의 비, 맞꼭지각과 평행선 각 성질, 무게중심 찾기와 중선, 닮은 도형과 대응, 삼각비 단원과 삼각형·사각형 단원 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 추적한다.

## 2026-06-27 도형 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 각과 평행선 각 성질, 평행선 각 성질과 평행선 사이 선분 길이의 비, 맞꼭지각과 평행선 각 성질, 평행선과 선분의 비로 무게중심 찾기와 중선, 닮은 도형과 대응, 삼각비 단원과 삼각형·사각형 단원, 원의 성질 정당화와 정당화, 접선의 길이와 접선, 접한다와 접선 성질, 삼각형 합동 판별과 정당화, 부채꼴 호의 길이·넓이와 원, 피타고라스 정리 정당화와 증명 관련 12개 queue row를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로, 새 edge는 필요한 곳에 `confidence: medium`과 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 도형 상단 묶음의 reviewed edge가 재생성 후 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1918개, source ref는 concept 1239개와 edge 4601개를 합쳐 총 5840개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 61건에서 49건으로 줄었고, 남은 항목은 low 47건과 backlog 2건이다.

## 2026-06-27 도형 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 도형 reviewed edge 묶음 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 16개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 123개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1918개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 다음 작업

- `related-edge-resolution-queue.csv`의 남은 low 47건과 backlog 2건을 공식 근거와 교과서 근거 기준으로 검토해 `represented_by`, `used_in`, `contrasts_with`, `related_to` edge 중 하나로 확정한다.
- 현재 queue 최상단은 `(x+a)(x+b)` 공식과 인수분해를 이용한 이차방정식 풀이, 인수와 항, 문자와 식, 단항식과 항, 문자의 사용과 식 단원과 좌표평면과 그래프 단원, 다항식의 덧셈·뺄셈과 일차식의 덧셈·뺄셈 관련 pair이므로 다음 반복에서 우선 처리한다.
- 중1~중3 수학 교과서 PDF가 추가되면 `textbook-evidence-packets/`, `prerequisite-map.csv`, `prerequisite-unit-graph.dot`, `related-edge-resolution-queue.csv`를 함께 사용해 concept별 본문·예제 근거와 관계 edge별 쪽수 근거를 추적한다.

## 2026-06-27 대수 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 `(x+a)(x+b)` 공식과 인수분해를 이용한 이차방정식 풀이, 인수와 항, 문자와 식, 단항식과 항, 문자의 사용과 식 단원과 좌표평면과 그래프 단원, 다항식의 덧셈·뺄셈과 일차식의 덧셈·뺄셈, 미지수가 2개인 일차방정식과 좌표평면·일차함수 관계, 중근과 실수 해 범위, 실수 해 범위와 근의 공식, 이차방정식과 인수분해, 공학 도구 그래프 탐구 관련 12개 queue row를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로, 새 edge는 필요한 곳에 `confidence: medium`과 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 대수 상단 묶음의 reviewed edge가 재생성 후 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1930개, source ref는 concept 1239개와 edge 4649개를 합쳐 총 5888개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 49건에서 36건으로 줄었다. 추가 edge 12개가 reciprocal related row 1개도 함께 해소해 남은 항목은 low 34건과 backlog 2건이다.

## 2026-06-27 대수 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 대수 reviewed edge 묶음 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 17개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 124개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1930개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 함수·방정식 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 미지수와 변수, 부등식의 해와 방정식의 해, 일차부등식과 연립일차방정식 단원, 일차함수와 연립일차방정식 단원, 함숫값과 식의 값, 일차함수·일차방정식 관계 단원과 좌표평면·그래프 단원, 문자·식·정비례·반비례 관련 12개 queue row를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로 새 edge는 `confidence: medium`과 설명 notes를 붙였다.
- `test_build_pilot_edge_sync.py`에 함수·방정식 상단 묶음 reviewed edge가 재생성 후에도 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1942개가 되었으며, source ref는 concept 1239개와 edge 4709개를 합쳐 총 5948개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 36건에서 24건으로 줄었고, 남은 항목은 low 22건과 backlog 2건이다.

## 2026-06-27 함수·방정식 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 함수·방정식 reviewed edge 묶음 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 18개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 125개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1942개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 자료·산포도 related edge 상단 묶음 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv` 최상단의 대푯값 단원과 산포도 단원, 도수분포표·상대도수 단원과 산포도 단원, 산포도와 편차·표준편차·분산, 자료와 자료 수집 관련 6개 queue row를 검토했다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 연결하되 교과서 본문·예제 쪽수 근거가 아직 없으므로 새 edge는 `confidence: medium`과 설명 notes를 붙인 `related_to`로만 확정했다.
- `test_build_pilot_edge_sync.py`에 자료·산포도 상단 묶음 reviewed edge가 재생성 후에도 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1948개가 되었으며, source ref는 concept 1239개와 edge 4731개를 합쳐 총 5970개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 24건에서 18건으로 줄었고, 남은 항목은 low 16건과 backlog 2건이다.

## 2026-06-27 자료·산포도 related edge 상단 묶음 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 자료·산포도 reviewed edge 묶음 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 19개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 126개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1948개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 잔여 related edge 큐 전체 해소

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `related-edge-resolution-queue.csv`에 남아 있던 18개 row를 모두 검토했다. 대상은 두 점 사이의 거리와 절댓값, 도형 교점과 함수 그래프 교점, 영역·단원 간 broad bridge, 소인수와 대수적 인수, 분배법칙과 다항식의 곱셈, 혼합계산과 식의 정리, 수직선 표현, 자료 영역의 표·그래프 표현, 삼각형의 중점연결정리와 무게중심, 문자의 사용과 변수, 부등식과 등식, 점과 좌표평면 위 점의 위치, 소인수분해와 거듭제곱 관련 pair이다.
- 공식 교육과정 성취기준과 용어·기호 근거만으로 확정하되, 교과서 본문·예제 쪽수 근거가 필요한 broad bridge는 `confidence: low`와 notes를 유지했다.
- `test_build_pilot_edge_sync.py`에 잔여 18개 pair의 reviewed edge가 재생성 후에도 보존되는지 고정하는 테스트를 추가했다.
- 전체 산출물을 재생성한 결과 concept은 476개로 유지되고 edge는 1966개가 되었으며, source ref는 concept 1239개와 edge 4839개를 합쳐 총 6078개가 되었다.
- `node-edge-consistency-audit.csv`와 `related-edge-resolution-queue.csv`는 18건에서 0건으로 줄었다.

## 2026-06-27 잔여 related edge 큐 전체 해소 검증 결과

- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_pilot_edge_sync.py`가 새 잔여 pair reviewed edge 18개 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 20개 테스트 통과로 전환되는 것을 확인했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 127개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 교과서 edge evidence packet 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 기존 `textbook-evidence-packets/*`는 concept별 교과서 근거 슬롯만 제공했으므로, 목표의 관계 근거 추적 요구에 맞춰 `textbook-edge-evidence-packets/*`를 새로 추가했다.
- `build_textbook_edge_evidence_packet.py`는 `textbook-extraction-queue.csv`의 34개 단원별로 해당 단원 concept에 닿는 edge를 모아 관계 유형별 근거 슬롯을 부여한다. cross-unit edge는 양쪽 단원에서 교과서 근거를 확인할 수 있도록 관련 단원 패킷에 중복 배치한다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_textbook_edge_evidence_packet.py`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 3개 테스트 통과로 전환되는 것을 확인했다.
- 전체 edge 패킷을 생성한 결과 34개 패킷, 2411개 row가 만들어졌다. 이 중 intra-unit edge row는 1521개, cross-unit edge row는 890개, `low` 신뢰도 edge row는 416개이다.
- 현재 `교과서_원본/`에는 PDF가 없으므로 2411개 row 모두 `pending_textbook_pdf` 상태로 둔다.
- `validate_concept_map.py`가 edge 패킷 인덱스와 rank별 CSV/Markdown, row count, schema, edge order, pending 상태, intra/cross/low count를 함께 검증하도록 확장했다.

## 2026-06-27 교과서 edge evidence packet 검증 결과

- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 130개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 edge evidence depth 감사 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 기존에는 concept별 근거 깊이만 `concept-evidence-depth.*`로 추적했으므로, 관계 edge의 공식/교과서 근거 깊이를 별도 추적하는 `edge-evidence-depth.*`를 추가했다.
- `build_edge_evidence_depth.py`는 1966개 edge별 source/target concept 메타데이터, 관계 유형, edge scope, source ref 수, source/evidence kind 분포, `official_dual_source`/`official_single_source`/`textbook_supported`/`source_gap` 분류, 교과서 근거 보강 필요 여부를 기록한다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_edge_evidence_depth.py`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 3개 테스트 통과로 전환되는 것을 확인했다.
- 실제 산출물 생성 결과 edge 1966개 중 `official_dual_source`는 1681개, `official_single_source`는 285개이며, 현재 교과서 PDF 부재로 1966개 모두 교과서 근거 보강 대상으로 남았다.
- edge scope 분포는 `same_unit` 1521개, `cross_unit_same_domain` 198개, `cross_domain_same_grade` 41개, `cross_grade_same_domain` 185개, `cross_grade_cross_domain` 21개이다.
- `validate_concept_map.py`가 `edge-evidence-depth.csv`의 row count, edge id 누락, source ref 합계, schema, row order, 교과서 원본 부재 시 textbook evidence 0건 조건, Markdown 존재 여부를 함께 검증하도록 확장했다.

## 2026-06-27 edge evidence depth 감사 검증 결과

- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 136개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.

## 2026-06-27 textbook evidence workplan 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- concept 근거 패킷과 관계 edge 근거 패킷을 단원 rank 기준으로 합친 `textbook-evidence-workplan.*`를 추가했다.
- `build_textbook_evidence_workplan.py`는 `textbook-evidence-packets/index.csv`와 `textbook-edge-evidence-packets/index.csv`를 결합하고, rank별 edge packet의 `extraction_status`를 읽어 pending edge 근거 row 수를 계산한다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_textbook_evidence_workplan.py`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 3개 테스트 통과로 전환되는 것을 확인했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `textbook-evidence-workplan.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- 실제 산출물 생성 결과 34개 단원 그룹, concept evidence row 476개, edge evidence row 2411개, pending textbook evidence row 2887개, low-confidence concept/edge row 483개가 기록되었다.
- 최상위 단원 `좌표평면과 그래프`는 concept 40개, edge row 202개, 총 242개 근거 row가 모두 `pending_textbook_pdf` 상태로 남아 있다.
- `validate_concept_map.py`가 workplan row count, schema, rank 누락, 재생성 결과와의 일치, concept/edge packet pending 총계와의 일치, Markdown 존재 여부를 검증하도록 확장했다.

## 2026-06-27 textbook evidence workplan 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_textbook_evidence_workplan.py`: 3개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_validate_concept_map.py`: 44개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-27 textbook source audit 추가

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본을 변경하지 않고 `교과서_원본/`에 PDF가 들어올 때의 사전 검증 게이트를 추가하는 것으로 제한했다.
- `build_textbook_source_audit.py`를 추가해 교과서 PDF 후보의 `%PDF-` 헤더, 파일명 규칙, SHA-256 해시, `TEXTBOOK_SOURCE_MANIFEST.csv` 출처 URL·attachment id·expected hash를 검사하게 했다.
- `textbook-source-audit.*`는 현재 PDF 0개 상태를 `waiting_for_textbook_pdf`로 기록한다. PDF가 추가되면 모든 항목이 맞는 파일만 `ready_for_textbook_extraction`이 된다.
- `교과서_원본/README.md`에 `TEXTBOOK_SOURCE_MANIFEST.csv` 필드와 해시/출처 기록 규칙을 추가했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_textbook_source_audit.py`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 4개 테스트 통과로 전환되는 것을 확인했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `textbook-source-audit.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- `validate_concept_map.py`가 source audit CSV field, PDF count 일치, 재생성 결과 일치, 교과서 PDF가 있을 때 ready 상태, Markdown 존재 여부를 검증하도록 확장했다.

## 2026-06-27 textbook source audit 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_build_textbook_source_audit.py`: 4개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p test_validate_concept_map.py`: 46개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-27 pilot unit map 추가

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `textbook-evidence-workplan.csv`의 최상위 단원 `좌표평면과 그래프`를 사람이 검토하기 쉬운 compact map으로 접는 `pilot-unit-map.*`를 추가했다.
- `build_pilot_unit_map.py`는 rank 1 단원의 concept 40개를 `pilot-unit-map-nodes.csv`로, 이 단원에 닿는 관계 edge 202개를 `pilot-unit-map-edges.csv`로 만들고, 같은 관계를 `pilot-unit-map.dot` Graphviz 시각화와 `pilot-unit-map.md` 요약으로 기록한다.
- DOT에서는 내부 edge를 실선, cross-unit edge를 점선으로 구분하고, `low` 신뢰도 concept은 별도 색으로 표시한다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_pilot_unit_map.py'`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 4개 테스트 통과로 전환되는 것을 확인했다.
- DOT 외부 node가 edge마다 중복 선언되는 결함을 추가 테스트로 먼저 재현했고, 같은 테스트 명령이 5개 테스트 통과로 전환되는 것을 확인했다.
- 실제 산출물 생성 결과 `좌표평면과 그래프`는 concept 40개, edge 202개, cross-unit edge 71개, low-confidence concept 6개, low-confidence edge 44개로 요약되었다.
- `validate_concept_map.py`가 `pilot-unit-map-nodes.csv`, `pilot-unit-map-edges.csv`, `pilot-unit-map.md`, `pilot-unit-map.dot`의 schema, row count, workplan count, 재생성 결과 일치, low/cross count를 함께 검증하도록 확장했다.

## 2026-06-27 pilot unit map 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_pilot_unit_map.py'`: 5개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 49개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 155개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-27 전체 unit map packet 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- rank 1 전용 `pilot-unit-map.*` 형식을 전체 34개 workplan 단원으로 확장해 `unit-map-packets/*`를 추가했다.
- `build_pilot_unit_map.py --all`은 `unit-map-packets/index.*`와 rank별 `rank-XX-nodes.csv`, `rank-XX-edges.csv`, `rank-XX.md`, `rank-XX.dot` 파일을 만든다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_pilot_unit_map.py'`가 전체 packet set API 누락으로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 8개 테스트 통과로 전환되는 것을 확인했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `unit-map-packets/index.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- 실제 산출물 생성 결과 전체 34개 단원 map, 파일 138개, concept row 476개, 단원 접점 edge row 2411개, cross-unit edge row 890개가 기록되었다.
- `validate_concept_map.py`가 `unit-map-packets/index.csv`, `index.md`, rank별 node/edge CSV, Markdown, DOT의 schema, row count, workplan rank, 재생성 결과 일치, concept/edge 총계를 함께 검증하도록 확장했다.

## 2026-06-27 전체 unit map packet 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_pilot_unit_map.py'`: 8개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 51개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 160개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-27 equivalence alias audit 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 감사 산출물과 검증 도구 정비로 제한했다.
- alias와 동치 관계를 한 파일에서 섞어 확정하지 않도록, concept 노드의 `aliases`, 명시적 `equivalent_to` edge, 같은 `label_ko`를 공유하는 concept, 공식 용어가 여러 concept에 매칭되는 항목을 분리한 `equivalence-alias-audit.*`를 추가했다.
- `build_equivalence_alias_audit.py`는 `concepts.json`, edge, `official-term-coverage.csv`를 읽어 `concept_alias`, `equivalent_edge`, `duplicate_label`, `official_term_multi_match` row를 만든다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_equivalence_alias_audit.py'`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 3개 테스트 통과로 전환되는 것을 확인했다.
- 실제 산출물 생성 결과 audit row 499개가 기록되었다. 유형별로는 `concept_alias` 476개, `duplicate_label` 11개, `equivalent_edge` 3개, `official_term_multi_match` 9개이다.
- `duplicate_label`과 `official_term_multi_match`는 자동 병합 대상이 아니라, 단원 범위 차이와 미시 개념 분리 필요성을 확인한 뒤 alias 보존, 동치 edge 추가, 또는 별도 concept 유지 중 하나를 결정하는 검토 큐로 남겼다.
- `validate_concept_map.py`가 `equivalence-alias-audit.csv`의 schema, row count, 재생성 결과 일치, concept alias row 수, 명시적 `equivalent_to` edge row 수, Markdown 존재 여부를 함께 검증하도록 확장했다.

## 2026-06-27 equivalence alias audit 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_equivalence_alias_audit.py'`: 3개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 53개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 165개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-28 research report concept signal 추가

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 파생 산출물과 검증 도구 정비로 제한했다.
- `source-inventory.*`에 `achievement_research_report_pdf`를 추가해 `2022_개정_중학교_성취수준_PDF/연구보고서/02_수학_성취수준_개발_연구보고서.pdf`를 보조 공식 연구보고서 후보 출처로 추적하게 했다.
- 연구보고서 원문을 자동 source ref로 승격하지 않고, 현재 concept의 `label_ko`와 2자 이상 alias가 연구보고서 PDF 몇 쪽에 출현하는지 잡는 `research-report-concept-signal.*`를 추가했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_concept_signal.py'`가 새 모듈 부재로 실패하고, `test_build_source_inventory.py`가 새 source group 부재로 실패하는 것을 확인했다.
- TDD green: 연구보고서 signal 생성기 테스트 2개와 source inventory 테스트 3개가 통과하도록 구현했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `research-report-concept-signal.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- 실제 산출물 생성 결과 연구보고서 신호는 239개 concept row를 기록했다. 신뢰도별로는 `high` 207개, `medium` 31개, `low` 1개이며, low 후보는 `비`(`m1_num_ratio`)이다.
- `validate_concept_map.py`가 research report signal CSV field, row count, 재생성 결과 일치, low-confidence 검토 후보 존재, Markdown 존재 여부를 검증하도록 확장했다.
- 이번 산출물은 교과서 page-level 근거를 대체하지 않고, 연구보고서 page 후보를 좁혀 다음 원문 맥락 확인과 source ref 보강 검토에 사용한다.

## 2026-06-28 research report concept signal 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_concept_signal.py'`: 2개 통과.
- 좁은 source inventory 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_source_inventory.py'`: 3개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 55개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 169개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 `concepts.json` source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-28 research report context packet 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 파생 산출물과 검증 도구 정비로 제한했다.
- `research-report-concept-signal.*`의 후보 신호를 바로 source ref로 승격하지 않도록, 상위 후보만 page 단위로 좁힌 `research-report-context-packet.*`를 추가했다.
- 패킷은 low-confidence 후보 `비`(`m1_num_ratio`)의 앞쪽 8개 page와 상위 medium 후보 20개의 앞쪽 2개 page를 합쳐 48개 row를 만든다.
- 각 row는 `matched_term`, `page_number`, `match_count_on_page`, `context_signal`, 90자 이하 `context_excerpt`, `source_locator_candidate`, `review_status: pending_context_review`, `source_ref_upgrade_allowed: no`를 기록한다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_context_packet.py'`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 2개 통과로 전환되는 것을 확인한 뒤, PDF 추출문에 섞인 NUL 문자를 제거하는 테스트를 추가해 3개 통과 상태로 보강했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `research-report-context-packet.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- `validate_concept_map.py`가 context packet CSV field, row count, key 누락, 재생성 결과 일치, 전체 row의 `pending_context_review` 상태와 `source_ref_upgrade_allowed: no`, Markdown 존재 여부를 검증하도록 확장했다.
- 이번 산출물은 연구보고서 원문 검토를 빠르게 하기 위한 패킷이며, 교과서 page-level 근거를 대체하지 않고 concept source ref 또는 confidence를 자동 변경하지 않는다.

## 2026-06-28 research report context packet 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_context_packet.py'`: 3개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 57개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 174개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-28 research report source review 추가

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 파생 산출물과 검증 도구 정비로 제한했다.
- `research-report-context-packet.*`의 page 맥락을 바로 source ref로 승격하지 않고, source ref 후보와 제외 대상을 분리한 `research-report-source-review.*`를 추가했다.
- `research-report-source-review.csv`는 48개 context row를 `candidate_prerequisite_evidence` 3개, `candidate_assessment_item_evidence` 8개, `candidate_achievement_level_evidence` 25개, `broad_report_context_only` 6개, `weak_occurrence_only` 6개로 분류한다.
- high priority row는 `비`(`m1_num_ratio`)의 연구보고서 page 172, 180, 181이며, source ref 추가 후보로 두되 `confidence_action`은 `keep_low_until_textbook_or_middle_course_evidence`로 남겼다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_source_review.py'`가 새 모듈 부재로 실패하는 것을 확인했다.
- TDD green: 같은 테스트 명령이 2개 통과로 전환되는 것을 확인했다.
- validator red: `python .\docs\math-concept-map\tools\validate_concept_map.py`가 `research-report-source-review.csv missing`으로 실패하는 것을 확인한 뒤 산출물을 생성했다.
- `validate_concept_map.py`가 source review CSV field, row count, key 누락, 재생성 결과 일치, source ref 후보 존재, 전체 row의 `source_ref_upgrade_allowed: no`, Markdown 존재 여부를 검증하도록 확장했다.
- 이번 산출물도 `concepts.json`을 직접 바꾸지 않으며, 교과서 page-level 근거를 대체하지 않는다.

## 2026-06-28 research report source review 검증 결과

- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_build_research_report_source_review.py'`: 2개 통과.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_validate_concept_map.py'`: 59개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p 'test_*.py'`: 178개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 4개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report ratio source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `achievement_research_report_2022`를 `concepts.json` source catalogue에 추가하고, `m1_num_ratio`에 연구보고서 p. 172, p. 180, p. 181의 `research_report_prerequisite_context` source ref 3개를 수동 적용했다.
- `m1_num_ratio`의 confidence는 계속 `low`로 유지했다. 연구보고서 page들은 비와 비율의 선수 맥락 보조 근거일 뿐, 교과서 본문 또는 중학교 과정 직접 근거 확인 전까지 confidence 승격 근거로 쓰지 않는다.
- `research-report-source-review.*`에 `source_ref_application_status`를 추가해 source ref 후보와 이미 반영된 row를 분리했다. 현재 적용 상태는 `applied_after_manual_review` 3개, `pending_manual_review` 33개, `not_applicable_from_this_row` 12개이다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `textbook-evidence-packets/rank-31.*`, `unit-map-packets/rank-31.*`를 재생성했다.
- source ref 총계는 concept 1242개, edge 4839개, 총 6081개이며 source catalogue는 5개이다.
- `SCHEMA.md`, `README.md`, `source-audit.md`를 새 source review 적용 상태와 `비`의 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_ratio_foundation.py"`와 `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_research_report_source_review.py"`가 각각 3개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 180개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report source review 보수화

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- `research-report-source-review.*`가 짧은 `context_excerpt`만 보지 않고 연구보고서 전체 page 텍스트도 확인하도록 보강했다.
- 연구보고서 p. 26은 `수와 연산 영역 내용 체계` 표이므로 덧셈, 뺄셈, 곱셈, 나눗셈, 약수, 배수 행을 source ref 후보에서 제외하고 `broad_report_context_only`로 분류했다.
- 연구보고서 p. 91은 `성취 결과 산출 및 보고` 맥락이므로 평균과 비율 관련 행을 source ref 후보에서 제외하고 `broad_report_context_only`로 분류했다.
- 재생성 결과 48개 row 분포는 `candidate_prerequisite_evidence` 3개, `candidate_assessment_item_evidence` 5개, `candidate_achievement_level_evidence` 15개, `broad_report_context_only` 24개, `weak_occurrence_only` 1개가 되었다.
- source ref 적용 상태는 `applied_after_manual_review` 3개, `pending_manual_review` 20개, `not_applicable_from_this_row` 25개로 정리되었다.
- `SCHEMA.md`, `README.md`, `source-audit.md`를 전체 page 텍스트 기반 source-review 분류와 최신 분포에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s docs/math-concept-map/tools -p "test_build_research_report_source_review.py"`: 5개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 182개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 경우의 수 source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_data_probability.py"`가 `m1_data_or_cases`의 `research_report_achievement_level_context` source ref 부재로 실패하는 것을 확인했다.
- `m1_data_or_cases`에 연구보고서 p. 228 `경우의 수와 확률 성취기준별 성취수준`과 p. 240 `자료와 가능성 영역별 성취수준` source ref를 수동 적용했다.
- `m1_data_or_cases`의 confidence는 계속 `medium`으로 유지했다. 두 page는 사건 A 또는 사건 B가 일어나는 경우의 수와 사건 A와 사건 B가 동시에 일어나는 경우의 수를 다루는 성취수준 맥락 보조 근거이며, 교과서 본문 근거를 대체하지 않는다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- source ref 적용 상태는 `applied_after_manual_review` 5개, `pending_manual_review` 18개, `not_applicable_from_this_row` 25개로 정리되었다.
- source ref 총계는 concept 1244개, edge 4845개, 총 6089개이며 source catalogue는 5개이다.
- `README.md`와 `source-audit.md`를 새 source review 적용 상태와 `사건 A 또는 사건 B가 일어나는 경우의 수`의 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_data_probability.py"`가 1개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 183개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 변화와 관계 source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 연구보고서 PDF p. 58 원문을 확인해 변화와 관계 영역별 성취수준 본문에서 `정비례 관계와 반비례 관계를 말하고, 그 관계를 표, 식, 그래프로 나타낼 수 있다`와 `두 일차함수의 그래프의 교점과 연립일차방정식의 해 사이의 관계를 말할 수 있다` 맥락을 확인했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_change_relationships.py"`가 `m1_prop_inverse_proportion`과 `m1_func_intersection_point`의 `research_report_achievement_level_context` source ref 부재로 실패하는 것을 확인했다.
- `m1_prop_inverse_proportion`과 `m1_func_intersection_point`에 연구보고서 p. 58 `변화와 관계 영역별 성취수준` source ref를 수동 적용했다.
- 두 concept의 confidence는 계속 `medium`으로 유지했다. p. 58은 성취수준 맥락 보조 근거이며, 교과서 본문 근거를 대체하지 않는다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- source ref 적용 상태는 `applied_after_manual_review` 7개, `pending_manual_review` 16개, `not_applicable_from_this_row` 25개로 정리되었다.
- source ref 총계는 concept 1246개, edge 4851개, 총 6097개이며 source catalogue는 5개이다.
- `README.md`와 `source-audit.md`를 새 source review 적용 상태와 변화와 관계 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_change_relationships.py"`가 2개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 185개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 입체도형 source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 연구보고서 PDF p. 173 원문에서 직육면체와 정육면체의 겨냥도와 전개도 성취수준, p. 174 원문에서 각기둥과 각뿔의 구성요소·성질 및 각기둥/원기둥 전개도 성취수준을 확인했다.
- p. 173과 p. 174의 `전개` 매칭은 대수적 `m1_calc_expansion`이 아니라 입체도형의 `전개도` 맥락이므로 대수적 전개에는 source ref를 적용하지 않기로 했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_solid_geometry_research_refs.py"`가 `m1_geo_solid_net`과 `m1_geo_pyramid`의 `research_report_achievement_level_context` source ref 부재로 실패하는 것을 확인했다.
- `m1_geo_solid_net`에 연구보고서 p. 173, p. 174 source ref를, `m1_geo_pyramid`에 연구보고서 p. 174 source ref를 수동 적용했다.
- 두 concept의 confidence는 계속 `medium`으로 유지했다. p. 173-174는 초등 연계 입체도형 성취수준 맥락 보조 근거이며, 교과서 본문 근거를 대체하지 않는다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- source ref 적용 상태는 `applied_after_manual_review` 10개, `pending_manual_review` 13개, `not_applicable_from_this_row` 25개로 정리되었다.
- source ref 총계는 concept 1249개, edge 4859개, 총 6108개이며 source catalogue는 5개이다.
- `README.md`와 `source-audit.md`를 새 source review 적용 상태와 입체도형 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_solid_geometry_research_refs.py"`가 3개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 188개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report source review 전개 오탐 제외

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` source-review 생성 로직과 파생 산출물 정비로 제한했다.
- 연구보고서 p. 173, p. 174의 `전개` 매칭은 대수적 `m1_calc_expansion`이 아니라 입체도형의 `전개도` 맥락임을 이전 원문 확인 결과에 따라 source review 제외 규칙으로 고정했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_research_report_source_review.py"`가 `m1_calc_expansion`의 입체도형 전개도 page를 `candidate_achievement_level_evidence`로 분류해 실패하는 것을 확인했다.
- `build_research_report_source_review.py`에 `m1_calc_expansion`과 입체도형 `전개도` 문맥의 용어 충돌 제외 규칙을 추가했다.
- `research-report-source-review.*`를 재생성해 `m1_calc_expansion` p. 173, p. 174 row를 `broad_report_context_only`와 `not_applicable_from_this_row`로 정리했다.
- source review 분포는 `candidate_prerequisite_evidence` 3개, `candidate_assessment_item_evidence` 5개, `candidate_achievement_level_evidence` 13개, `broad_report_context_only` 26개, `weak_occurrence_only` 1개가 되었다.
- source ref 적용 상태는 `applied_after_manual_review` 10개, `pending_manual_review` 11개, `not_applicable_from_this_row` 27개로 정리되었다.
- source ref 총계는 변하지 않았으며 concept 1249개, edge 4859개, 총 6108개이다.
- `README.md`와 `source-audit.md`를 새 source review 분포와 적용 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_research_report_source_review.py"`가 6개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 189개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 도형 평가문항 source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept source ref와 파생 산출물 정비로 제한했다.
- 연구보고서 p. 62의 도형과 측정 융합 세트 평가 과제 맥락을 검토해 `삼각형`, `길이`, `넓이`가 실제 중학교 도형 평가문항 맥락에 직접 등장한다고 판단했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_geometry_foundations.py"`가 세 concept의 연구보고서 p. 62 source ref 부재로 실패하는 것을 확인했다.
- `build_pilot.py`에 `research_report_assessment_item_context` source ref 3개를 추가하고, `m1_geo_triangle`, `m1_geo_length`, `m1_geo_area`에 수동 적용했다.
- `research-report-source-review.*`를 재생성해 p. 62의 세 row를 `applied_after_manual_review`로 정리했다.
- source review 분포는 `candidate_prerequisite_evidence` 3개, `candidate_assessment_item_evidence` 5개, `candidate_achievement_level_evidence` 13개, `broad_report_context_only` 26개, `weak_occurrence_only` 1개로 유지되었다.
- source ref 적용 상태는 `applied_after_manual_review` 13개, `pending_manual_review` 8개, `not_applicable_from_this_row` 27개로 정리되었다.
- source ref 총계는 concept 1252개, edge 4865개, 총 6117개이며 source catalogue는 5개이다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- `README.md`와 `source-audit.md`를 새 source review 적용 상태와 p. 62 도형 평가문항 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_geometry_foundations.py"`가 4개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 190개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1966개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 대각선 source refs 적용

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept/edge source ref와 파생 산출물 정비로 제한했다.
- 연구보고서 PDF p. 213의 제곱근과 실수 성취기준별 성취수준 맥락에서 `한 변의 길이가 1인 정사각형의 대각선의 길이 등 유리수가 아닌 예`를 통해 무리수 개념을 다루는 것을 확인했다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_geometry_foundations.py"`가 `m1_geo_diagonal`, `m1_num_unit_square_diagonal`, 두 concept 사이 `used_in` edge의 연구보고서 p. 213 source ref 부재로 실패하는 것을 확인했다.
- `build_pilot.py`에 `ACH_RESEARCH_UNIT_SQUARE_DIAGONAL_213` source ref를 추가하고, `m1_geo_diagonal`과 `m1_num_unit_square_diagonal`에 수동 적용했다. 두 concept의 confidence는 기존 상태를 유지하고, p. 213은 성취수준 맥락 보조 근거로만 사용한다.
- `m1_geo_diagonal -> m1_num_unit_square_diagonal` `used_in` edge를 추가해 도형의 대각선이 한 변의 길이가 1인 정사각형의 대각선 표현을 거쳐 무리수 도입 맥락에 쓰이는 cross-grade/cross-domain 연결을 보존했다.
- `research-report-source-review.*`를 재생성해 p. 213 row를 `applied_after_manual_review`로 정리했다.
- source ref 적용 상태는 `applied_after_manual_review` 14개, `pending_manual_review` 7개, `not_applicable_from_this_row` 27개로 정리되었다.
- source ref 총계는 concept 1254개, edge 4872개, 총 6126개이며 source catalogue는 5개이다. 전체 산출물은 concept 476개, edge 1967개이다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- `README.md`, `source-audit.md`, `progress.md`를 새 source review 적용 상태, edge/source-ref 총계, p. 213 대각선 보조 출처 반영 상태에 맞게 갱신했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_geometry_foundations.py"`가 5개 통과했다.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 191개 통과.
- 전체 validator 1차 실행에서 `unit-map-packets/index.csv`의 rank 10 `제곱근과 실수` 행이 workplan보다 한 단계 전 상태인 것을 확인했다. 원인은 새 cross-unit edge가 `textbook-evidence-workplan.*`에는 반영됐지만 unit-map packet index가 덜 갱신된 상태였기 때문이다.
- `python docs/math-concept-map/tools/build_pilot_unit_map.py --all`로 unit-map packet을 다시 생성한 뒤, 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1967개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 research report 남은 source review 후보 처리

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept source ref, source-review 생성 규칙, 파생 산출물 정비로 제한했다.
- 남은 `pending_manual_review` 7개 row의 연구보고서 원문을 확인했다. p. 61과 p. 184는 초등 5~6 `[6수02-03]` 비율 예시 평가도구, p. 103과 p. 108은 초등 입체도형의 모양 및 도형과 측정 영역별 성취수준, p. 177은 초등 평균 성취기준별 성취수준, p. 181은 초등 도형과 측정 영역별 성취수준, p. 183은 자료와 가능성 영역별 성취수준의 `비율그래프` 문맥이다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_ratio_foundation.py"`, `test_build_pilot_solid_geometry_research_refs.py`, `test_build_pilot_data_representative_refs.py`, `test_build_research_report_source_review.py`가 각각 누락된 p. 61·184, p. 103·108·181, p. 177 source ref 또는 p. 183 `비율그래프` 제외 규칙 부재로 실패하는 것을 확인했다.
- `m1_num_ratio`에는 연구보고서 p. 61, p. 184를 `research_report_assessment_item_context`로 추가했다. 단, p. 61과 p. 184도 초등 연계 평가도구 맥락이므로 `confidence: low`를 유지하고, 교과서 본문 또는 중학교 과정 직접 근거 확인 전까지 승격하지 않는다.
- `m1_geo_prism`에는 연구보고서 p. 103, p. 108을, `m1_geo_pyramid`에는 p. 181을, `m1_data_mean`에는 p. 177을 보조 source ref로 추가했다. 이들은 초등 연계 또는 영역별 성취수준 맥락이므로 각 concept의 기존 `confidence: medium`을 유지했다.
- `build_research_report_source_review.py`에 `m1_num_ratio`와 `비율그래프` 문맥 충돌 제외 규칙을 추가해 p. 183 row를 `broad_report_context_only`와 `not_applicable_from_this_row`로 정리했다.
- source review 분포는 `candidate_prerequisite_evidence` 3개, `candidate_assessment_item_evidence` 5개, `candidate_achievement_level_evidence` 12개, `broad_report_context_only` 28개가 되었다.
- source ref 적용 상태는 `applied_after_manual_review` 20개, `not_applicable_from_this_row` 28개이며 `pending_manual_review`는 0개로 정리되었다.
- source ref 총계는 concept 1260개, edge 4880개, 총 6140개이며 source catalogue는 5개이다. 전체 산출물은 concept 476개, edge 1967개로 유지된다.
- `research-report-concept-signal.*`, `research-report-context-packet.*`, `research-report-source-review.*`, `review-queue.*`, `source-ref-audit.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`, `equivalence-alias-audit.*`, `textbook-evidence-packets/*`, `textbook-edge-evidence-packets/*`, `textbook-evidence-workplan.*`, `pilot-unit-map.*`, `unit-map-packets/*`를 재생성했다.
- `README.md`, `source-audit.md`, `progress.md`를 새 source review 적용 상태, source-ref 총계, p. 183 제외 판단에 맞게 갱신했다.
- 멀티에이전트 explorer 2개를 병렬로 사용해 문서 숫자와 기계 판독 산출물 적용 상태를 독립 감사했고, 메인 스레드에서 결과를 재확인했다.
- 문서 숫자 감사 subagent는 최신 README/source-audit/progress의 현재 상태 숫자 불일치가 없다고 확인했다. 기계 판독 산출물 감사 subagent는 `m1_num_ratio` p. 61/172/180/181/184, `m1_geo_prism` p. 103/108, `m1_geo_pyramid` p. 174/181, `m1_data_mean` p. 177 source ref 적용과 p. 183 제외 상태, prism source ref가 `m1_geo_surface_area`/`m1_geo_volume`으로 새지 않았음을 확인했다.
- 좁은 생성기 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_ratio_foundation.py"` 3개, `test_build_pilot_solid_geometry_research_refs.py` 4개, `test_build_pilot_data_representative_refs.py` 1개, `test_build_research_report_source_review.py` 7개 통과.
- 전체 validator 1차 실행에서 `research-report-source-review.csv has no source-ref review candidates` 오류가 발생했다. 원인은 이전 validator가 source review에 `candidate_add_after_manual_review` row가 반드시 남아 있어야 한다고 가정했기 때문이다.
- TDD red: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_validate_concept_map.py"`가 `research_report_source_review_has_source_ref_work` helper 부재로 실패하는 것을 확인했다.
- `validate_concept_map.py`를 수정해 `candidate_add_after_manual_review`뿐 아니라 이미 수동 반영된 `applied_to_concepts_json` row도 source-review 작업 흔적으로 인정하게 했다. 전부 적용/제외된 현재 상태에서는 `pending_manual_review`가 0이어도 정상이다.
- 좁은 validator 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_validate_concept_map.py"`: 60개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 195개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 476개 concept, 1967개 edge, 5개 source, 60개 공식 성취기준 검증 통과.

## 2026-06-29 좌표평면 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 1 `좌표평면과 그래프`의 미시 concept 누락, `official_single_source`/`low` 후보, edge 의미 품질을 독립 감사했다.
- 좌표 단원의 공식 용어표와 성취수준 맥락을 근거로 `x축 위의 점`, `y축 위의 점`, `사분면별 좌표 부호`를 `confidence: low` concept으로 추가했다. 축 위 점의 0좌표 조건과 사분면별 부호 패턴은 교과서 본문 확인 전까지 낮은 신뢰도로 유지한다.
- `좌표축`, `x축`, `y축`, `원점`, `순서쌍`, `x좌표`, `y좌표`, `사분면`, `축 위의 점`, `점의 위치` 사이의 `contains`, `prerequisite_for`, `contrasts_with`, `related_to` edge를 명시해 `related-edge-resolution-queue.*`를 0건으로 유지했다.
- `해`와 `근`이 `equivalent_to`와 `contains`로 동시에 연결되던 충돌을 정리했다. `근`은 `해`의 하위 concept이 아니라 `방정식` 맥락의 동치 용어로 보존하고, `equivalent_to` 쌍은 `contains`를 중복 사용하지 않도록 테스트로 고정했다.
- 전체 파생 산출물을 재생성한 결과 concept은 479개, edge는 2000개가 되었다. source ref 총계는 concept 1266개, edge 4946개, 총 6212개이며 source catalogue는 5개이다.
- `review-queue.*`는 70개 low-confidence concept, `concept-evidence-depth.*`는 concept 479개, `edge-evidence-depth.*`는 edge 2000개, `prerequisite-map.*`는 736개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 479개, edge evidence row 2448개, pending textbook evidence row 2927개, low-confidence concept/edge row 518개를 기록한다.
- 최상위 단원 `좌표평면과 그래프`는 concept 43개, edge row 235개, 총 278개 근거 row가 모두 `pending_textbook_pdf` 상태로 남아 있다.
- `test_build_pilot_coordinate_microconcepts.py`를 추가해 좌표 단원의 새 미시 concept과 축·원점·순서쌍·사분면 관계 edge를 고정했다. `test_build_pilot_edge_sync.py`에는 `equivalent_to` 쌍이 동시에 `contains`로 중복되지 않는 검사를 추가했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_coordinate_microconcepts.py"` 3개 통과, `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_edge_sync.py"` 21개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 199개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 479개 concept, 2000개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 일차함수 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, source-review 생성 규칙, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 2 `일차함수와 그 그래프`의 누락 미시 concept, edge 의미 품질, low-confidence·source-review 후보를 독립 감사했다.
- 공식 교육과정과 성취수준의 함수·일차함수 맥락을 근거로 `하나씩 정해지는 대응`을 `property` concept으로 추가하고, `대응 관계`, `함수인지 판단하기`, `함수와 일차함수 혼동`, `하나의 입력에 여러 출력이 대응하는 경우를 함수로 보는 오류`와 연결했다.
- `입력값`, `x의 증가량`, `y의 증가량`, `기울기 계산식`은 교과서 본문 확인이 필요한 미시 concept으로 `confidence: low`를 유지했다. `입력값`은 `함숫값`과 대조하고, `x의 증가량`·`y의 증가량`은 `기울기 계산식`, `기울기`, `일차함수 그래프 그리기`, `일차함수 그래프의 식 구하기`와 연결했다.
- `y=ax` 그래프와 `y=ax+b` 그래프의 대조, `기울기`와 `y절편`의 대조, `기울기의 부호`가 그래프 그리기에 쓰이는 관계를 명시해 일차함수 단원의 구조 edge를 보강했다.
- 대응표, 독립변수·종속변수, 초깃값, 두 점으로 그래프 그리기, 그래프 위의 점 판별 등은 공식 문서 근거만으로 확정하기보다 교과서 본문·예제 확인 후 처리할 후보로 보류했다.
- 연구보고서 source review에서 자료·좌표·수식을 도구에 `입력`하는 맥락을 함수의 `입력값` 직접 근거로 보지 않도록 제외 규칙과 테스트를 추가했다.
- 전체 파생 산출물을 재생성한 결과 concept은 485개, edge는 2030개가 되었다. source ref 총계는 concept 1275개, edge 5000개, 총 6275개이며 source catalogue는 5개이다.
- `research-report-context-packet.*`는 53개 row, `research-report-source-review.*`는 `applied_after_manual_review` 20개와 `not_applicable_from_this_row` 33개를 기록하며 `pending_manual_review`는 0개이다.
- `review-queue.*`는 75개 low-confidence concept, `concept-evidence-depth.*`는 concept 485개, `edge-evidence-depth.*`는 edge 2030개, `prerequisite-map.*`는 747개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 485개, edge evidence row 2481개, pending textbook evidence row 2966개, low-confidence concept/edge row 550개를 기록한다. rank 1 `좌표평면과 그래프`는 43개 concept과 237개 edge row, 총 280개 row이고, rank 2 `일차함수와 그 그래프`는 33개 concept과 161개 edge row, 총 194개 row이다.
- `test_build_pilot_linear_function_microconcepts.py`를 추가해 새 일차함수 미시 concept과 함수 판별·함숫값·기울기·절편·그래프 그리기 관계 edge를 고정했다. `test_build_research_report_source_review.py`에는 도구·자료 입력 맥락을 `입력값` source ref 후보에서 제외하는 검사를 추가했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_linear_function_microconcepts.py"` 3개, `test_build_pilot_edge_sync.py` 21개, `test_build_research_report_source_review.py` 8개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 203개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 485개 concept, 2030개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 경우의 수와 확률 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 3 `경우의 수와 확률`의 누락 미시 concept, edge 방향성, 연구보고서 보조 출처 후보를 독립 감사했다.
- 연구보고서 p. 228과 p. 240의 OR/AND 경우의 수 성취수준 맥락, p. 260의 확률 평가 문항, p. 266~268의 이동 경로 평가 문항을 직접 확인해 경우의 수와 확률 미시 concept의 source ref로 반영했다. p. 260과 p. 266~268은 이번 수동 페이지 확인으로 반영했으며, 기존 `research-report-source-review.*` 53개 row의 적용 개수에는 더하지 않았다.
- `전체 경우의 수`, `사건이 일어나는 경우의 수`, `경우의 수의 비율로 확률 구하기`, `확률값`, `확률의 범위`, `확률이 0인 사건`, `확률이 1인 사건`, `상대도수와 경우의 수의 비율 연결`을 추가했다. 이 중 `확률값`, `확률이 0인 사건`, `확률이 1인 사건`은 교과서 본문 확인 전까지 `confidence: low`로 유지한다.
- `경우의 수`가 OR/AND 경우의 수를 포함하도록 `contains` edge를 정리하고, `합의 법칙`과 `곱의 법칙`은 각각 OR/AND 경우의 수에 `used_in`으로 쓰이도록 방향을 바로잡았다. `전체 경우의 수`와 `사건이 일어나는 경우의 수`는 경우의 수의 비율로 확률을 구하는 절차에 쓰이도록 연결했다.
- `상대도수`와 `상대도수로서의 확률`의 `represented_by` 방향을 `상대도수로서의 확률 -> 상대도수`로 고정하고, OR/AND 경우의 수 대조 edge와 오개념 위험 노드의 noisy prerequisite edge를 정리해 `related-edge-resolution-queue.*`를 0건으로 유지했다.
- 전체 파생 산출물을 재생성한 결과 concept은 493개, edge는 2064개가 되었다. source ref 총계는 concept 1307개, edge 5133개, 총 6440개이며 source catalogue는 5개이다.
- `review-queue.*`는 78개 low-confidence concept, `concept-evidence-depth.*`는 concept 493개, `edge-evidence-depth.*`는 edge 2064개, `prerequisite-map.*`는 761개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 493개, edge evidence row 2518개, pending textbook evidence row 3011개, low-confidence concept/edge row 559개를 기록한다. rank 1 `좌표평면과 그래프`는 43개 concept과 237개 edge row, 총 280개 row이고, rank 2 `일차함수와 그 그래프`는 33개 concept과 161개 edge row, 총 194개 row이며, rank 3 `경우의 수와 확률`은 26개 concept과 112개 edge row, 총 138개 row이다.
- `test_build_pilot_data_probability_microconcepts.py`를 추가해 새 확률 미시 concept, OR/AND 경우의 수 edge 방향, 상대도수 표현 관계, p. 260 및 p. 266~268 보조 source ref를 고정했다. 기존 `test_build_pilot_data_probability.py`는 `사건 A 또는 사건 B가 일어나는 경우의 수`의 p. 228, p. 240, p. 266 보조 출처까지 확인하도록 갱신했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_data_probability_microconcepts.py"` 4개, `test_build_pilot_edge_sync.py` 21개, `test_build_pilot_data_probability.py` 1개, `test_build_pilot_data_representative_refs.py` 1개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 207개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 493개 concept, 2064개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 정수와 유리수 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 4 `정수와 유리수`의 누락 미시 concept, edge 의미 품질, 연구보고서 보조 출처 후보를 독립 감사했다.
- `0`, `유리수의 분수 꼴 표현`, `수직선에서 오른쪽에 있는 수가 더 큼`, `절댓값이 같고 부호가 다른 두 수`, `부호가 같은 수의 덧셈`, `부호가 다른 수의 덧셈`, `뺄셈을 반대 부호의 덧셈으로 바꾸기`, `곱셈과 나눗셈의 부호 결정`, `나눗셈을 역수의 곱셈으로 바꾸기`, `혼합계산의 계산 순서`를 추가했다.
- 연구보고서 p. 211의 음수·양수·정수·유리수 성취수준 맥락과 p. 212의 대소 관계·수직선·사칙계산 성취수준 맥락을 보조 source ref로 반영했다. 이 두 page는 교과서 본문 근거가 아니므로 concept confidence 승격 근거로 쓰지 않는다.
- 오개념 위험 노드로 들어가던 noisy prerequisite edge를 제거하고, `절댓값 -> 수직선` 표현 관계, 양수·음수와 양의 부호·음의 부호 표현 관계, 같은/다른 부호 덧셈 대조 관계, 유리수 분수 꼴 표현과 역수·유리수-순환소수 관계를 명시해 `related-edge-resolution-queue.*`를 0건으로 유지했다.
- 전체 파생 산출물을 재생성한 결과 concept은 503개, edge는 2120개가 되었다. source ref 총계는 concept 1355개, edge 5326개, 총 6681개이며 source catalogue는 5개이다.
- `review-queue.*`는 80개 low-confidence concept, `concept-evidence-depth.*`는 concept 503개, `edge-evidence-depth.*`는 edge 2120개, `prerequisite-map.*`는 782개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 503개, edge evidence row 2575개, pending textbook evidence row 3078개, low-confidence concept/edge row 575개를 기록한다. rank 4 `정수와 유리수`는 41개 concept과 191개 edge row, 총 232개 row이다.
- `test_build_pilot_integer_rational_microconcepts.py`를 추가해 새 정수와 유리수 미시 concept, noisy prerequisite 제거, p. 211~212 보조 source ref, 중간/낮은 confidence 유지 조건을 고정했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_integer_rational_microconcepts.py"` 4개, `test_build_pilot_edge_sync.py` 21개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 211개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 503개 concept, 2120개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 이차함수와 그 그래프 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 `이차함수와 그 그래프`의 누락 미시 concept, edge 의미 품질, 연구보고서 보조 출처 후보를 독립 감사했다.
- 연구보고서 p. 220의 이차함수 성취수준 맥락을 직접 확인해 `이차함수 판별하기`, `상황을 이차함수 식으로 나타내기`, `y=ax^2 꼴`, `y=a(x-p)^2 꼴`, `y=ax^2+q 꼴`, `이차함수의 값의 표`, `꼭짓점 좌표`, `축의 방정식`, `위로 열린 그래프와 아래로 열린 그래프`, `꼭짓점형에서 그래프 성질 읽기`를 보강했다.
- `y=ax^2 그래프`가 `이차함수의 식` 아래에 포함되던 혼합 구조를 `y=ax^2 꼴` 식 표현과 그래프 표현으로 분리하고, `represented_by` edge로 연결했다.
- 오개념 위험 노드로 들어가던 noisy prerequisite edge를 제거하고 `often_confused_with`, `contrasts_with`, `used_in`, `represented_by` edge로 방향을 정리했다. `포물선의 축`과 `꼭짓점`은 선과 점의 차이를 `contrasts_with`로 명시했다.
- p. 220은 교과서 본문 근거가 아니므로 `포물선의 축과 꼭짓점을 혼동하는 오류`, `최댓값·최솟값의 범위를 임의로 확장하는 오류`, `이차함수와 이차방정식을 혼동하는 오류`의 `confidence: low`는 유지했다.
- 전체 파생 산출물을 재생성한 결과 concept은 513개, edge는 2176개가 되었다. source ref 총계는 concept 1390개, edge 5495개, 총 6885개이며 source catalogue는 5개이다.
- `review-queue.*`는 80개 low-confidence concept, `concept-evidence-depth.*`는 concept 513개, `edge-evidence-depth.*`는 edge 2176개, `prerequisite-map.*`는 796개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 513개, edge evidence row 2636개, pending textbook evidence row 3149개, low-confidence concept/edge row 570개를 기록한다. workplan 재정렬 후 `이차함수와 그 그래프`는 rank 4이며 30개 concept과 143개 edge row, 총 173개 row이다.
- `test_build_pilot_quadratic_function_microconcepts.py`를 추가해 새 이차함수 미시 concept, 식 표현과 그래프 표현 분리, p. 220 보조 source ref, low confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_quadratic_function_microconcepts.py"` 5개, `test_build_pilot_edge_sync.py` 21개 통과.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 도수분포표와 상대도수 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 6 `도수분포표와 상대도수`의 누락 미시 concept, edge 의미 품질, 연구보고서 p. 227~228 보조 출처 후보를 독립 감사했다.
- 연구보고서 p. 227~228의 도수분포표와 상대도수 성취수준 맥락을 직접 확인해 `도수분포표로 나타내기`, `히스토그램으로 나타내기`, `도수분포다각형으로 나타내기`, `총도수`, `상대도수 구하기`, `상대도수로 두 집단의 분포 비교하기`, `상대도수의 합`을 보강했다.
- `상대도수의 합`은 공식 문서의 상대도수 구하기와 도수의 총합 표현에서 추론한 성질이므로 `confidence: low`로 유지하고, 교과서 본문이나 정리 근거 확인 전까지 확정 성질로 승격하지 않는다.
- 오개념 위험 노드로 들어가던 `prerequisite_for` edge를 제거하고, `도수분포표로 나타내기 -> 도수분포표`, `히스토그램으로 나타내기 -> 히스토그램`, `도수분포다각형으로 나타내기 -> 도수분포다각형`, `도수/총도수/비 -> 상대도수 구하기`, `상대도수의 분포 -> 두 집단 분포 비교`의 `used_in` edge를 명시했다.
- 연구보고서 p. 227~228은 교과서 본문 근거가 아니므로 `히스토그램과 막대그래프 혼동`, `도수와 상대도수 혼동`, `눈금 왜곡 그래프 해석`의 confidence는 올리지 않았고, `m1_mis_histogram_bar_graph`에는 p. 227 source ref를 추가하지 않았다.
- 전체 파생 산출물을 재생성한 결과 concept은 520개, edge는 2212개가 되었다. source ref 총계는 concept 1431개, edge 5677개, 총 7108개이며 source catalogue는 5개이다.
- `review-queue.*`는 81개 low-confidence concept, `concept-evidence-depth.*`는 concept 520개, `edge-evidence-depth.*`는 edge 2212개, `prerequisite-map.*`는 807개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 520개, edge evidence row 2670개, pending textbook evidence row 3190개, low-confidence concept/edge row 571개를 기록한다. rank 6 `도수분포표와 상대도수`는 33개 concept과 180개 edge row, 총 213개 row이다.
- `test_build_pilot_data_frequency_microconcepts.py`를 추가해 새 도수분포표와 상대도수 미시 concept, p. 227~228 보조 source ref, 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_data_frequency_microconcepts.py"` 4개, `test_build_pilot_edge_sync.py` 21개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 220개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 520개 concept, 2212개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-29 일차방정식 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 병렬로 사용해 rank 8 후보였던 `일차방정식`의 누락 미시 concept 후보, edge 품질, 연구보고서 보조 출처 적용 범위를 독립 감사했다.
- `해인지 판단하기`, `대입값에 따른 등식의 참거짓`, `방정식과 항등식 구별하기`, `양변에 같은 수를 더하거나 빼기`, `양변에 같은 수를 곱하거나 나누기`, `등식의 성질을 이용해 방정식 변형하기`, `미지수항 모으기`, `상수항 모으기`, `방정식의 여러 풀이 방법`, `문제 상황에서 미지수 정하기`, `일차방정식 활용 문제 해결`, `해를 문제 상황에 맞게 해석하기`를 추가했다.
- 연구보고서 p. 214의 일차방정식 성취기준별 성취수준 맥락을 직접 확인해 방정식·해·등식의 성질·일차방정식 풀이·세우기·활용 문제 해결 관련 concept과 핵심 edge의 보조 source ref로 반영했다. 같은 p. 214라도 `양변`과 `이항` 자체를 직접 설명하는 근거로는 쓰지 않고, 해당 용어는 교육과정 p. 36 용어·교수학습 용어 근거와 추후 교과서 본문 확인 대상으로 유지했다.
- `m1_mis_expression_equation`, `m1_mis_transposition_sign`, `m1_mis_solution_check`, `m1_mis_ineq_solution_single_value`, `m1_mis_ineq_negative`로 들어가던 noisy `prerequisite_for` edge를 제거하고, 오개념 위험 연결은 `often_confused_with`로 유지했다.
- `방정식 -> 해인지 판단하기`, `대입 -> 해인지 판단하기`, `해인지 판단하기 -> 해`, `등식의 세부 성질 -> 등식의 성질을 이용한 방정식 변형`, `방정식 변형 -> 일차방정식 풀기`, `미지수항/상수항 모으기 -> 일차방정식 풀기`, `문제 상황에서 미지수 정하기 -> 일차방정식 세우기`, `해의 확인 -> 해를 문제 상황에 맞게 해석하기`의 `used_in` 흐름을 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 538개, edge는 2297개가 되었다. source ref 총계는 concept 1511개, edge 6008개, 총 7519개이며 source catalogue는 5개이다.
- `review-queue.*`는 81개 low-confidence concept, `concept-evidence-depth.*`는 concept 538개, `edge-evidence-depth.*`는 edge 2297개, `prerequisite-map.*`는 831개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 538개, edge evidence row 2768개, pending textbook evidence row 3306개, low-confidence concept/edge row 554개를 기록한다. 이번 보강 대상 `일차방정식`은 rank 7로 재정렬되었고 31개 concept과 159개 edge row, 총 190개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_linear_equation_microconcepts.py`를 추가해 새 일차방정식 미시 concept, p. 214 보조 source ref 적용 범위, `양변`·`이항`에는 p. 214를 직접 붙이지 않는 제한, 오개념 confidence 유지와 noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_build_pilot_linear_equation_microconcepts.py"` 5개, `test_build_pilot_edge_sync.py` 21개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 229개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 538개 concept, 2297개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 이차방정식 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 rank 11 후보였던 `이차방정식`의 누락 미시 concept 후보, edge 품질, source ref 적용 범위를 병렬 감사했다.
- `이차항의 계수가 1인 이차방정식`, `이차방정식의 계수`, `이차방정식의 인수분해된 식 표현`, `각 인수가 0이 되는 조건`, `이차방정식 풀이 과정 설명하기`, `문제 상황을 이차방정식으로 나타내기`, `해가 문제 상황에 적합한지 확인하기`, `근의 공식에 계수 대입하기`를 추가했다.
- 연구보고서 p. 220의 `[9수02-20]` 이차방정식 성취기준별 성취수준 맥락을 직접 확인해 이차방정식 풀이, 풀이 과정 설명, 문제 상황을 이차방정식으로 나타내기, 이차항의 계수가 1인 이차방정식 관련 concept의 보조 source ref로 반영했다. 같은 p. 220이라도 `근의 공식`, `중근`, 실수 해 범위, 근과 계수와의 관계 제외, 오개념 노드에는 직접 source ref로 붙이지 않았다.
- `m1_quad_eq_root_formula -> m1_mis_root_coefficient_relation_scope` 선수 edge를 제거하고, `중근`이 `해`를 포함하던 방향을 `해 -> 중근`으로 바로잡았다. `이차식 -> 이차방정식의 식 표현` represented_by edge는 `이차방정식 -> 이차방정식의 식 표현`으로 바꾸고, 이차식과 이차방정식은 `contrasts_with`로 구별했다.
- `해의 확인 -> 이차방정식 활용 문제 해결`, `문제 상황을 이차방정식으로 나타내기 <-> 해가 문제 상황에 적합한지 확인하기`, `이차방정식의 계수 -> 근의 공식`, `근의 공식에 계수 대입하기 -> 이차방정식의 해` 등 수행 흐름을 `used_in` 또는 `related_to` edge로 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 556개, edge는 2402개가 되었다. source ref 총계는 concept 1580개, edge 6323개, 총 7903개이며 source catalogue는 5개이다.
- `review-queue.*`는 83개 low-confidence concept, `concept-evidence-depth.*`는 concept 556개, `edge-evidence-depth.*`는 edge 2402개, `prerequisite-map.*`는 855개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 556개, edge evidence row 2891개, pending textbook evidence row 3447개, low-confidence concept/edge row 560개를 기록한다. 이번 보강 대상 `이차방정식`은 rank 7로 재정렬되었고 22개 concept과 103개 edge row, 총 125개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_quadratic_equation_microconcepts.py`를 추가해 새 이차방정식 미시 concept, 연구보고서 p. 220 보조 source ref 적용 범위, 오개념 confidence 유지, noisy prerequisite/contains/represented_by/used_in edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_quadratic_equation_microconcepts` 5개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 244개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 556개 concept, 2402개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map 교과서_원본`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 기본 도형 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 rank 12 후보였던 `기본 도형`의 누락 미시 concept 후보, edge 의미 품질, source ref 적용 범위를 병렬 감사했다.
- `점·선·면·각의 용어와 기호`, `점·직선·평면의 위치 관계 설명하기`, `동위각과 엇각 찾기`, `평행선에서 각의 크기 구하기`, `평행선에서 동위각과 엇각의 성질 설명하기`, `두 직선을 만나는 한 직선`, `각의 크기`, `평행선에서 동위각의 크기가 같음`, `평행선에서 엇각의 크기가 같음`, `선분`, `반직선`, `한 평면 위에 있음`을 추가했다.
- `선분`, `반직선`, `한 평면 위에 있음`은 공식 문서의 용어·성취수준 구조에서 필요한 하위 개념으로 추론했지만 공식 용어표 직접 근거가 약하므로 `confidence: low`로 유지했다.
- 연구보고서 p. 221은 기본 도형 성취수준 후보 근거로 확인했지만, 이번 보강에서는 자동 source ref로 승격하지 않았다. p. 221은 교과서 본문 근거가 아니므로 오개념 confidence 승격이나 교과서 근거 대체에 쓰지 않는다.
- `위치 관계 -> 교점/교선/꼬인 위치`로 향하던 `used_in` edge를 `교점/교선/꼬인 위치 -> 위치 관계` 방향으로 바로잡고, `평행선 -> 동위각/엇각`의 과도한 직접 edge를 `두 직선을 만나는 한 직선`, `평행선에서 동위각과 엇각의 성질`, `동위각/엇각 찾기`, `각의 크기 구하기` 절차 흐름으로 분해했다.
- `동위각과 엇각 위치 혼동`, `꼬인 위치와 평행 혼동`, `접선과 반지름 관계 오류`로 들어가던 noisy `prerequisite_for` edge를 제거하고, 오개념 위험 연결은 `often_confused_with`로 유지했다.
- 전체 파생 산출물을 재생성한 결과 concept은 568개, edge는 2478개가 되었다. source ref 총계는 concept 1605개, edge 6485개, 총 8090개이며 source catalogue는 5개이다.
- `review-queue.*`는 86개 low-confidence concept, `concept-evidence-depth.*`는 concept 568개, `edge-evidence-depth.*`는 edge 2478개, `prerequisite-map.*`는 879개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 568개, edge evidence row 2967개, pending textbook evidence row 3535개, low-confidence concept/edge row 576개를 기록한다. 이번 보강 대상 `기본 도형`은 rank 8로 재정렬되었고 34개 concept과 209개 edge row, 총 243개 row가 모두 `pending_textbook_pdf` 상태이다.
- `research-report-context-packet.*`와 `research-report-source-review.*`는 64개 row로 갱신되었다. `선분`·`반직선` 후보 때문에 `pending_manual_review` 7개가 생겼고, 이 row들은 교과서 본문 또는 직접 중학교 기본 도형 근거 확인 전까지 source ref로 자동 반영하지 않는다.
- `test_build_pilot_basic_geometry_microconcepts.py`를 추가해 새 기본 도형 미시 concept, 수행 절차와 성질 edge 방향, 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_basic_geometry_microconcepts.py test_build_pilot_edge_sync.py` 24개 통과.
- 전체 단위 테스트: `python -m unittest discover -s .\docs\math-concept-map\tools -p "test_*.py"`: 247개 통과.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 568개 concept, 2478개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 소인수분해 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `소인수분해`의 누락 미시 concept 후보, source ref 적용 경계, edge 방향과 noisy prerequisite 후보를 병렬 감사했다.
- `소인수분해의 뜻 설명하기`, `안내된 절차에 따라 소인수분해하기`, `소수와 합성수 판별하기`, `나눗셈을 이용한 소인수분해`, `소인수분해 결과를 거듭제곱으로 정리하기`, `소인수분해의 유일성`, `1은 소수도 합성수도 아님`, `공약수`, `공배수`, `공통 소인수`, `공통 소인수 선택하기`, `필요한 모든 소인수 선택하기`, `최대공약수를 공통 소인수의 곱으로 나타내기`, `최소공배수를 필요한 모든 소인수의 곱으로 나타내기`, `최대공약수와 최소공배수의 원리 설명하기`, `소인수분해로 서로소 판별하기`를 추가했다.
- 이번 보강의 source ref는 교육과정 수와 연산 성취기준, 용어·기호, 교수학습 유의사항, 성취수준 문서에 한정했다. 연구보고서 row는 새 source ref로 붙이지 않았고, 다항식 인수분해 근거인 연구보고서 p. 219는 소인수분해 근거로 전용하지 않는다.
- `1은 소수도 합성수도 아님`과 `소인수분해의 유일성`은 교과서 본문 확인 전까지 각각 `medium`, `low` 근거로 유지한다. `공약수`, `공배수`, `공통 소인수`, 소인수 선택 절차는 공식 문서의 최대공약수·최소공배수 진술에서 추론한 하위 개념이므로 교과서 본문·정리·예제 근거 보강 대상으로 둔다.
- 오개념 위험 노드로 들어가던 noisy `prerequisite_for` edge를 제거했고, `소수 -> 합성수` 직접 선수 edge, `소인수분해 -> 최대공약수/최소공배수` 직접 선수 edge, 단원 간 broad 선수/관련 edge를 정리했다. `서로소 -> 최대공약수` 흐름은 `최대공약수 -> 서로소`의 `used_in` 방향으로 바로잡았다.
- `공약수 -> 최대공약수`, `공배수 -> 최소공배수`, `공통 소인수 -> 최대공약수를 공통 소인수의 곱으로 나타내기`, `공통 소인수 선택하기 -> 최대공약수`, `필요한 모든 소인수 선택하기 -> 최소공배수`, `최대공약수/최소공배수 원리 설명하기 -> 소인수분해를 이용한 최대공약수·최소공배수 구하기`의 수행 흐름을 `used_in` edge로 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 585개, edge는 2551개가 되었다. source ref 총계는 concept 1654개, edge 6698개, 총 8352개이며 source catalogue는 5개이다.
- `review-queue.*`는 88개 low-confidence concept, `concept-evidence-depth.*`는 concept 585개, `edge-evidence-depth.*`는 edge 2551개, `prerequisite-map.*`는 907개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 585개, edge evidence row 3041개, pending textbook evidence row 3626개, low-confidence concept/edge row 583개를 기록한다. 이번 보강 대상 `소인수분해`는 rank 10이며 32개 concept과 137개 edge row, 총 169개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_prime_factor_microconcepts.py`를 추가해 새 소인수분해 미시 concept, 최대공약수·최소공배수 선택 절차 edge, 소수/합성수/1 관련 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_prime_factor_microconcepts.py test_build_pilot_edge_sync.py` 25개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 251개 통과.
- 전체 validator 1차 실행에서 rank 10 textbook edge evidence packet이 이전 생성 상태로 남아 있음을 확인했다. `build_textbook_evidence_packet.py --all`, `build_textbook_edge_evidence_packet.py --all`, `build_textbook_evidence_workplan.py`, `build_pilot_unit_map.py --all`을 다시 실행해 전체 rank 패킷과 workplan을 현재 데이터로 맞췄다.
- 전체 validator: `python .\docs\math-concept-map\tools\validate_concept_map.py`: 585개 concept, 2551개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 입체도형의 성질 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `입체도형의 성질`의 누락 미시 concept 후보, source ref 적용 경계, edge 방향과 noisy prerequisite 후보를 병렬 감사했다.
- `입체도형의 면`, `입체도형의 모서리`, `입체도형의 꼭짓점`, `면·모서리·꼭짓점 찾기`, `겨냥도`, `전개도 그리기`, `전개도가 될 수 있는지 판단하기`, `단면 모양 예상하기`, `평면도형을 회전시켜 회전체 만들기`, `전개도로 겉넓이 구하기`, `볼록한 다면체 범위`, `전개도에서 붙는 면의 이웃 관계를 잘못 판단하는 오류`를 추가했다.
- 공식 교육과정의 `[9수03-07]`, `[9수03-08]`, 도형과 측정 용어·기호, 다각형·다면체 볼록 범위 및 회전체 단면 유의사항을 기본 근거로 사용했다. 연구보고서 p. 173, p. 174, p. 181은 전개도, 겨냥도, 면·모서리·꼭짓점 구성 요소 맥락의 보조 근거로만 사용하고 confidence 승격 근거로 쓰지 않았다.
- `겨냥도`는 현재 연구보고서 p. 173 보조 맥락만 확인되므로 `confidence: low`로 두었다. 전개도 가능 여부 판단과 면·모서리·꼭짓점 찾기는 공식 입체도형 탐구 맥락과 연구보고서 보조 맥락이 함께 있어 `confidence: medium`으로 두고 교과서 본문 확인 대상으로 유지했다.
- `겉넓이와 부피를 같은 측정량으로 보는 오류`, `지나치게 복잡한 넓이·부피 변형 문제 범위 혼동`으로 들어가던 noisy `prerequisite_for` edge를 제거했다. `입체도형의 성질 -> 전개도/단면 represented_by`처럼 단원 전체를 표현물로 보던 broad edge와 `회전체 -> 회전축 represented_by` edge도 제거했다.
- `전개도 -> 전개도 그리기/전개도 판별/전개도로 겉넓이 구하기`, `단면 -> 단면 모양 예상하기`, `회전축 -> 회전체 만들기`, `회전체 만들기 -> 회전체`, `볼록한 다면체 범위 -> 다면체`, `전개도 이웃 관계 오류 -> 전개도 판별`의 수행·범위·오개념 edge를 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 597개, edge는 2600개가 되었다. source ref 총계는 concept 1691개, edge 6865개, 총 8556개이며 source catalogue는 5개이다.
- `review-queue.*`는 90개 low-confidence concept, `concept-evidence-depth.*`는 concept 597개, `edge-evidence-depth.*`는 edge 2600개, `prerequisite-map.*`는 925개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 597개, edge evidence row 3096개, pending textbook evidence row 3693개, low-confidence concept/edge row 586개를 기록한다. 이번 보강 대상 `입체도형의 성질`은 rank 9로 재정렬되었고 29개 concept과 123개 edge row, 총 152개 row가 모두 `pending_textbook_pdf` 상태이다.
- `research-report-context-packet.*`와 `research-report-source-review.*`는 67개 row로 갱신되었다. 모든 row의 `source_ref_upgrade_allowed`는 계속 `no`이며, 교과서 본문 또는 직접 중학교 근거 확인 전까지 자동 confidence 승격을 하지 않는다.
- `test_build_pilot_solid_geometry_microconcepts.py`를 추가해 새 입체도형 미시 concept, 연구보고서 p. 173/174 보조 source ref 적용 범위, 오개념 confidence 유지, noisy prerequisite/represented_by edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_solid_geometry_microconcepts.py` 3개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 254개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 597개 concept, 2600개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 식의 계산 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `식의 계산`의 누락 미시 concept 후보, source ref 적용 경계, edge 방향과 noisy prerequisite 후보를 병렬 감사했다.
- `지수법칙 적용 조건: 밑이 같음`, `같은 밑의 거듭제곱의 곱셈`, `같은 밑의 거듭제곱의 나눗셈`, `거듭제곱의 거듭제곱`, `다항식의 덧셈과 뺄셈 원리`, `다항식의 항·계수·차수 확인하기`, `다항식에서 동류항 모으기`, `다항식의 괄호 풀기`, `다항식의 뺄셈에서 부호 바꾸기`, `지수법칙을 단항식 계산에 적용하기`, `단항식 계산에서 계수끼리 계산하기`, `단항식 계산에서 문자 부분 계산하기`, `단항식을 다항식에 분배하기`, `다항식의 각 항을 단항식으로 나누기`, `몫이 다항식인지 확인하기`, `다항식 뺄셈에서 괄호 앞 음수를 분배하지 않는 오류`를 추가했다.
- 이번 보강의 source ref는 `CURR_08`, `CURR_09`, `CURR_10`, `CURR_CALC_NOTE`, `ACH_EXPONENT`, `ACH_POLY_ADD_SUB`, `ACH_POLY_MUL_DIV`, 공식 용어·기호와 정수·유리수 사칙연산 근거에 한정했다. 연구보고서 자동 매칭 row와 교과서 원본 근거는 새 source ref로 붙이지 않았고, 교과서 본문·정리·예제·문제 패턴 확인 전까지 세부 법칙·절차와 오개념 후보의 confidence를 보수적으로 유지했다.
- `밑/지수/지수법칙 -> 오개념`과 `단항식과 다항식의 곱셈과 나눗셈 -> 다항식 나눗셈 범위 혼동`으로 들어가던 noisy `prerequisite_for` edge를 제거하고, 오개념 위험은 `지수법칙 적용 조건: 밑이 같음`, `몫이 다항식인지 확인하기`, `다항식의 뺄셈에서 부호 바꾸기`에 대한 `often_confused_with` edge로 연결했다.
- `식의 계산 -> 일차부등식/연립일차방정식`의 broad prerequisite edge를 `related_to`로 낮추고, 실제 선수 흐름은 `일차식의 덧셈과 뺄셈 -> 일차부등식 풀기`, `일차식의 덧셈과 뺄셈 -> 가감법`의 더 작은 `used_in` edge로 보존했다.
- 전체 파생 산출물을 재생성한 결과 concept은 613개, edge는 2688개가 되었다. source ref 총계는 concept 1742개, edge 7150개, 총 8892개이며 source catalogue는 5개이다.
- `review-queue.*`는 92개 low-confidence concept, `concept-evidence-depth.*`는 concept 613개, `edge-evidence-depth.*`는 edge 2688개, `prerequisite-map.*`는 957개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 613개, edge evidence row 3213개, pending textbook evidence row 3826개, low-confidence concept/edge row 596개를 기록한다. 이번 보강 대상 `식의 계산`은 rank 12로 재정렬되었고 30개 concept과 165개 edge row, 총 195개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_calculation_microconcepts.py`를 추가해 새 식의 계산 미시 concept, 지수법칙·단항식·다항식 계산 절차 edge, 오개념 confidence 유지, noisy prerequisite edge 제거, 연구보고서 직접 source ref 미사용을 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_calculation_microconcepts.py` 5개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 28개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 259개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 613개 concept, 2688개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 평면도형의 성질 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `평면도형의 성질`의 누락 미시 concept 후보, source ref 적용 경계, edge 의미 품질과 noisy prerequisite 후보를 병렬 감사했다.
- `다각형의 꼭짓점 수`, `다각형의 내각의 합`, `다각형의 외각의 합`, `다각형의 각의 성질 일반화하기`, `다각형의 내각의 합 구하기`, `다각형의 외각의 크기 구하기`, `다각형의 대각선 개수 구하기`, `부채꼴의 중심각과 호의 관계`, `부채꼴의 호의 길이 구하기`, `부채꼴의 넓이 구하기`, `중심각에 따른 부채꼴 비례 추론`, `내각과 외각을 같은 각으로 보는 오류`, `중심각 비례 관계를 호의 길이와 넓이에 적용하지 않는 오류`를 추가했다.
- 공식 교육과정의 `[9수03-05]`, `[9수03-06]`, 도형과 측정 용어·기호, 볼록다각형 범위 유의사항을 기본 근거로 사용했다. `정다각형`, 대각선으로 삼각형 분할, 반지름 별도 노드, 평면도형 별도 공통 노드 등은 교과서 본문 또는 더 직접적인 근거 확인 전까지 이번 보강에서 보류했다.
- `호와 현을 같은 대상으로 보는 오류`로 들어가던 noisy `prerequisite_for` edge를 제거하고, 새 오개념 위험 노드도 선수 관계 없이 `often_confused_with` edge로만 연결했다. `원/호/현/할선`처럼 `평면도형의 성질`과 `원의 성질` 사이에 걸치는 공유 용어 edge는 이번 범위에서 구조 변경하지 않고 다음 semantic edge cleanup 후보로 남겼다.
- `다각형의 내각의 합/외각의 합 -> 각의 크기 구하기`, `꼭짓점 수/대각선 -> 대각선 개수 구하기`, `중심각/호 -> 부채꼴의 중심각과 호의 관계`, `중심각과 호의 관계 -> 부채꼴 호의 길이/넓이 구하기`, `중심각 비례 추론 -> 부채꼴의 호의 길이와 넓이 구하기`의 수행 흐름을 `used_in` edge로 명시했다.
- 전체 파생 산출물을 재생성한 결과 concept은 626개, edge는 2761개가 되었다. source ref 총계는 concept 1770개, edge 7303개, 총 9073개이며 source catalogue는 5개이다.
- `review-queue.*`는 94개 low-confidence concept, `concept-evidence-depth.*`는 concept 626개, `edge-evidence-depth.*`는 edge 2761개, `prerequisite-map.*`는 990개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 626개, edge evidence row 3291개, pending textbook evidence row 3917개, low-confidence concept/edge row 601개를 기록한다. 이번 보강 대상 `평면도형의 성질`은 rank 14로 재정렬되었고 29개 concept과 176개 edge row, 총 205개 row가 모두 `pending_textbook_pdf` 상태이다.
- `research-report-context-packet.*`와 `research-report-source-review.*`는 67개 row를 유지한다. 모든 row의 `source_ref_upgrade_allowed`는 계속 `no`이며, 이번 보강에서는 연구보고서 자동 매칭 row를 새 source ref로 승격하지 않았다.
- `test_build_pilot_plane_geometry_microconcepts.py`를 추가해 새 평면도형 미시 concept, 다각형·부채꼴 수행 edge 방향, 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_plane_geometry_microconcepts.py` 4개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_plane_geometry_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 32개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 263개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 626개 concept, 2761개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 다항식의 곱셈과 인수분해 절차 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `다항식의 곱셈과 인수분해`의 누락 절차 concept 후보, source ref 적용 경계, edge 품질과 noisy prerequisite 후보를 병렬 감사했다.
- `전개식`, `다항식의 곱 전개하기`, `곱셈·인수분해 공식 선택하기`, `공통인수로 묶기`, `공식을 이용한 인수분해`, `합과 곱이 맞는 수 찾기`, `교차항 계수 확인하기`, `완전제곱식의 가운데 항 확인하기`, `인수분해 결과 전개로 확인하기`, `인수분해 결과를 확인하지 않는 오류`를 추가했다.
- 이번 보강의 source ref는 `CURR_19`, `CURR_FACTOR_NOTE`, `ACH_POLY_FACTOR`, `CURR_INSTRUCTIONAL_TERMS`를 중심으로 제한했다. 연구보고서 p. 219는 교과서 본문 근거가 아니므로 새 절차 concept이나 오개념 risk의 직접 source ref로 승격하지 않았다.
- `공통인수`와 `동류항`의 직접 선수 관계, `formula_scope`에서 공식·절차 노드로 뻗는 broad prerequisite edge, 곱셈/인수분해 단원 노드에서 공식 적용 범위로 향하는 noisy prerequisite edge를 제거했다. 대신 전개와 인수분해, 공통인수와 동류항, `(x+a)(x+b)`형과 `(ax+b)(cx+d)`형의 구별을 `contrasts_with` edge로 명시했다.
- `전개식`은 표현 노드로 두고, 다항식의 곱 전개, 공식 선택, 공통인수 추출, 공식 기반 인수분해, 합·곱 조건 탐색, 교차항 계수 확인, 완전제곱식 가운데 항 확인, 전개 검산은 `procedure` 노드로 연결했다.
- 전체 파생 산출물을 재생성한 결과 concept은 636개, edge는 2813개가 되었다. source ref 총계는 concept 1792개, edge 7414개, 총 9206개이며 source catalogue는 5개이다.
- `review-queue.*`는 95개 low-confidence concept, `concept-evidence-depth.*`는 concept 636개, `edge-evidence-depth.*`는 edge 2813개, `prerequisite-map.*`는 996개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 636개, edge evidence row 3355개, pending textbook evidence row 3991개, low-confidence concept/edge row 610개를 기록한다. 이번 보강 대상 `다항식의 곱셈과 인수분해`는 rank 8로 재정렬되었고 30개 concept과 169개 edge row, 총 199개 row가 모두 `pending_textbook_pdf` 상태이다.
- `test_build_pilot_factor_procedure_microconcepts.py`를 추가해 새 절차 concept, `[9수02-19]` source locator, 절차 edge, 오개념 confidence 유지, noisy prerequisite edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_factor_procedure_microconcepts.py test_build_pilot_factor_microconcepts.py` 8개 통과.
- edge/queue 테스트: `python -m unittest test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py test_build_pilot_factor_procedure_microconcepts.py` 11개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 267개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 636개 concept, 2813개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 연립일차방정식 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `연립일차방정식`의 누락 미시 concept 후보, source ref 적용 경계, edge 품질과 noisy prerequisite 후보를 병렬 감사했다.
- `공통 해 조건`, `해의 순서쌍 표현`, `연립일차방정식 해의 확인`, `소거할 미지수의 계수 맞추기`, `두 방정식 더하거나 빼기`, `한 미지수 값을 대입해 다른 미지수 구하기`, `한 미지수를 다른 미지수의 식으로 나타내기`, `다른 방정식에 식 전체 대입하기`, `두 미지수 정하기`, `두 조건을 두 방정식으로 나타내기`, `연립일차방정식 활용 문제 해결`, `연립일차방정식 풀이 과정 설명하기`, `해를 문제 상황에 맞게 해석하기`, `해의 순서쌍에서 두 미지수 값을 바꾸는 오류`를 추가했다.
- 이번 보강의 source ref는 `CURR_13`, `ACH_SYSTEM`, `CURR_INSTRUCTIONAL_TERMS`를 중심으로 제한했다. 좌표·그래프 연결 edge에는 해당 그래프 근거만 보조로 붙였고, 교과서 PDF나 직접 본문 근거가 없으므로 새 절차와 오개념 일부는 `confidence: medium` 또는 `low`를 유지했다.
- `연립일차방정식 -> 좌표평면과 그래프` broad prerequisite edge를 `related_to`로 낮추고, 오개념 risk 노드의 noisy prerequisite를 제거했다. 두 미지수 일차방정식의 그래프, 두 직선 그래프, 교점과 해의 관계도 graph relation 단원 안에서 쓰이도록 edge 방향을 재지정했다.
- 전체 파생 산출물을 재생성한 결과 concept은 650개, edge는 2893개가 되었다. source ref 총계는 concept 1820개, edge 7577개, 총 9397개이며 source catalogue는 5개이다.
- `review-queue.*`는 96개 low-confidence concept, `concept-evidence-depth.*`는 concept 650개, `edge-evidence-depth.*`는 edge 2893개, `prerequisite-map.*`는 1024개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 650개, edge evidence row 3449개, pending textbook evidence row 4099개, low-confidence concept/edge row 619개를 기록한다. 이번 보강 대상 `연립일차방정식`은 rank 17이며 27개 concept과 141개 edge row, 총 168개 row가 모두 `pending_textbook_pdf` 상태이고 low-confidence concept/edge row는 24개이다.
- `test_build_pilot_system_microconcepts.py`를 추가해 새 미시 concept, `[9수02-13]` source locator, 가감법·대입법 절차 edge, 해 확인과 활용 문제 흐름, 오개념 confidence 유지, noisy prerequisite와 graph relation edge 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_system_microconcepts.py` 5개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_system_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 33개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 272개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 650개 concept, 2893개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 삼각비 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `삼각비`의 누락 미시 concept 후보, source ref 적용 경계, edge 품질과 noisy prerequisite 후보를 병렬 감사했다.
- `삼각비의 기준각`, `삼각비에서의 빗변`, `기준각의 대변`, `기준각의 이웃변`, `삼각비 값의 각도 범위`, `사인의 비 표현`, `코사인의 비 표현`, `탄젠트의 비 표현`, `삼각비의 값 표`, `특수각 삼각비 값 찾기`, `구하려는 길이에 맞는 삼각비 선택하기`, `거리와 높이 문제를 직각삼각형으로 나타내기`, `기준각에 따라 대변과 이웃변을 바꾸는 오류`를 추가했다.
- 이번 보강의 source ref는 `CURR_GEO_16`, `CURR_GEO_17`, `CURR_GEO_TERMS`, `CURR_GEO_SCOPE_NOTE`, `ACH_GEO_TRIG`를 중심으로 제한했다. 연구보고서 context row는 직접 source ref로 승격하지 않았고, 교과서 PDF가 없으므로 새 절차와 표현 일부는 `confidence: medium`, 오개념 risk는 `confidence: low`를 유지했다.
- `삼각비 -> 직각삼각형` contains edge와 `피타고라스 정리 -> 삼각비` broad prerequisite edge를 약화했다. 직각삼각형은 삼각비의 선수 입력으로, 피타고라스 정리 단원은 관련 단원으로 두고, 실제 관계는 기준각·변 역할·삼각비 공식·값 표·거리/높이 모델링 edge로 세분화했다.
- `삼각비 사이의 관계 범위 혼동`, `삼각비 각도 범위 혼동`, `대변·이웃변 혼동` 오개념 risk에는 prerequisite를 두지 않고 `often_confused_with` edge만 남겼다.
- 전체 파생 산출물을 재생성한 결과 concept은 663개, edge는 2956개가 되었다. source ref 총계는 concept 1849개, edge 7724개, 총 9573개이며 source catalogue는 5개이다.
- `review-queue.*`는 97개 low-confidence concept, `concept-evidence-depth.*`는 concept 663개, `edge-evidence-depth.*`는 edge 2956개, `prerequisite-map.*`는 1046개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 663개, edge evidence row 3520개, pending textbook evidence row 4183개, low-confidence concept/edge row 621개를 기록한다. 이번 보강 대상 `삼각비`는 rank 18이며 24개 concept과 110개 edge row, 총 134개 row가 모두 `pending_textbook_pdf` 상태이고 low-confidence concept/edge row는 15개이다.
- `test_build_pilot_trig_microconcepts.py`를 추가해 새 미시 concept, `[9수03-16]`·`[9수03-17]` source locator, 사인·코사인·탄젠트 비 표현 edge, 삼각비 값 표와 특수각 값 찾기, 거리·높이 모델링, 오개념 confidence 유지, noisy prerequisite 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_trig_microconcepts.py` 4개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_trig_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 32개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 276개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 663개 concept, 2956개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-06-30 삼각형과 사각형의 성질 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 정비, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `삼각형과 사각형의 성질`의 이등변삼각형·직각삼각형 합동, 외심·내심, 사각형 분류와 포함 관계 후보를 병렬 감사했다.
- `이등변삼각형의 두 같은 변`, `이등변삼각형의 밑변`, `이등변삼각형의 꼭지각`, `이등변삼각형의 두 밑각`, `이등변삼각형의 두 밑각의 크기가 같음`, `이등변삼각형의 꼭지각 이등분선 성질`, `이등변삼각형 성질 정당화하기`, `직각삼각형의 합동 조건`, `직각삼각형 합동 판별하기`, `외심과 세 변의 수직이등분선`, `외심에서 세 꼭짓점까지의 거리`, `외접원의 반지름`, `외심 찾기`, `각의 이등분선`, `내심과 세 내각의 이등분선`, `내심에서 세 변까지의 거리`, `내접원의 반지름`, `내심 찾기`, `평행사변형`, `직사각형`, `마름모`, `정사각형`, `사다리꼴`, 사각형 성질과 분류 절차, 새 오개념 위험 노드를 추가했다.
- 이번 보강의 source ref는 `CURR_GEO_09`, `CURR_GEO_10`, `CURR_GEO_11`, `CURR_GEO_TERMS`, `CURR_GEO_PROOF_NOTE`, `ACH_GEO_TRI_QUAD`를 중심으로 제한했다. 교과서 PDF가 없으므로 새 오개념 risk는 `confidence: low`를 유지했고, `관찰 결과와 증명 혼동`, `외심과 내심 혼동`의 noisy prerequisite도 제거했다.
- 외심·내심은 수직이등분선/각의 이등분선, 꼭짓점까지의 거리/변까지의 거리, 외접원/내접원 반지름을 분리해 `represented_by`, `contains`, `used_in`, `contrasts_with` edge로 연결했다. 사각형은 평행사변형-직사각형-마름모-정사각형의 포함 관계와 대각선 성질을 분리해 broad relation을 줄였다.
- 전체 파생 산출물을 재생성한 결과 concept은 694개, edge는 3090개가 되었다. source ref 총계는 concept 1923개, edge 8041개, 총 9964개이며 source catalogue는 5개이다.
- `review-queue.*`는 99개 low-confidence concept, `concept-evidence-depth.*`는 concept 694개, `edge-evidence-depth.*`는 edge 3090개, `prerequisite-map.*`는 1108개 선수 관계 edge로 갱신되었다.
- `textbook-evidence-workplan.*`는 34개 단원 그룹, concept evidence row 694개, edge evidence row 3680개, pending textbook evidence row 4374개, low-confidence concept/edge row 627개를 기록한다. 이번 보강 대상 `삼각형과 사각형의 성질`은 rank 6이며 47개 concept과 215개 edge row, 총 262개 row가 모두 `pending_textbook_pdf` 상태이고 low-confidence concept/edge row는 22개이다.
- `test_build_pilot_triangle_quadrilateral_microconcepts.py`를 추가해 새 이등변삼각형·직각삼각형·외심·내심·사각형 미시 concept, 성질/절차 edge, 사각형 포함 관계, 오개념 confidence 유지, noisy prerequisite 제거를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_triangle_quadrilateral_microconcepts.py` 5개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 28개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 281개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 694개 concept, 3090개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 파생 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-01 원의 성질 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 재생성, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `원의 성질`의 현, 접선, 원주각 세 갈래를 병렬 감사했다. 각 agent의 후보를 합쳐 중복을 정리하고, 교과서 원문 근거가 아직 없는 항목은 `confidence: medium` 또는 `low`와 notes로 근거 한계를 남겼다.
- `원의 반지름`, `원 중심에서 현까지의 거리`, `원의 중심에서 현에 내린 수선은 현을 이등분`, `원 중심과 현의 중점을 이은 직선은 현에 수직`, `같은 원에서 길이가 같은 현은 중심에서 같은 거리에 있음`, `같은 원에서 중심거리가 같은 현의 길이가 같음`, `접점에서의 접선과 반지름의 수직 관계`, `한 점에서 그은 두 접선의 길이가 같음`, `원주각이 보는 호`, `같은 호`, `같은 현`, `같은 호에 대한 원주각의 크기가 같음`, `같은 호와 같은 현의 대응 관계`, `중심각과 원주각의 관계`, `반원`, `반원에 대한 원주각은 직각`, `원의 성질 정당화에서 근거 선택하기`, `원의 중심과 반지름 보조선 활용`, `원주각과 중심각을 같은 크기로 보는 오류`, `같은 현과 같은 호의 조건을 넓게 적용하는 오류`를 추가했다.
- `원과 비례에 관한 성질을 범위에 포함하는 오류`와 `접선과 반지름의 수직 관계를 놓치는 오류`는 선수 관계 없이 오개념 위험으로만 유지했다. 새 오개념 위험 노드도 `often_confused_with` edge로만 연결하고, 공식 문서에서 직접 말하지 않는 학생 오류 추론은 낮은 신뢰도로 표시했다.
- 현·접선·원주각 세부 성질을 `contains`, `prerequisite_for`, `represented_by`, `used_in`, `related_to`, `often_confused_with` edge로 연결했다. 특히 `원의 반지름`과 외심/내심 반지름, `중심각과 원주각의 관계`와 부채꼴 중심각-호 관계는 관련은 있지만 단원 맥락이 다르므로 `related_to`로만 두었다.
- 전체 산출물을 재생성한 결과 concept은 714개, edge는 3204개가 되었다. source ref 총계는 concept 1979개, edge 8375개, 총 10354개이며 source catalogue는 5개이다.
- `review-queue.*`는 103개 low-confidence concept, `concept-evidence-depth.*`는 concept 714개, `edge-evidence-depth.*`는 edge 3204개, `prerequisite-map.*`은 1163개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 714개, edge evidence row 3824개, pending textbook evidence row 4538개, low-confidence concept/edge row 652개를 기록한다. 재생성 후 `원의 성질`은 rank 7이며 concept 33개, edge 188개, 총 221개 evidence row가 모두 `pending_textbook_pdf` 상태다.
- `test_build_pilot_circle_microconcepts.py`를 추가해 원의 성질 미시 concept, `[9수03-18]`·`[9수03-19]` source locator, 현/접선/원주각 edge, 오개념 confidence 유지, noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_circle_microconcepts.py` 5개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 286개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 714개 concept, 3204개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-01 일차부등식 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 재생성, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `일차부등식`의 용어·기호, 풀이 절차, 수직선 표현·오개념 후보를 병렬 감사했다. 각 agent의 결과를 통합하면서 공식 문서 직접 근거가 약한 항목은 `confidence: low`와 notes에 추론 근거를 남겼다.
- `부등호`, `부등호의 방향`, `부등식 해의 범위`, `부등식 해의 수직선 표현`, `부등식 해의 경계값`, `부등식 해의 끝점 포함 표시`, `부등식 양변에 같은 수 더하기·빼기`, `부등식 양변에 양수를 곱하거나 나누기`, `부등식 양변에 음수를 곱하거나 나눌 때 부등호 방향 바꾸기`, `부등식의 동치 변형`, `미지수를 한쪽으로 모으기`, `일차부등식의 해를 범위로 나타내기`, `문제 상황에서 미지수 정하기`, `문제 조건을 부등식으로 옮기기`, `부등식의 해를 문제 상황에 맞게 해석하기`, `부등식의 해인지 판단하기`, `일차부등식 활용 문제 해결`, `부등식 해의 끝점 포함 여부를 잘못 표시하는 오류`, `부등호 방향을 항상 바꾸는 오류`를 추가했다.
- 이번 보강의 source ref는 `CURR_11`, `CURR_12`, `CURR_INEQ_NOTE`, `ACH_INEQ`, `ACH_LINEAR_INEQ`, 필요한 경우 `CURR_INSTRUCTIONAL_TERMS`와 수직선 관련 수와 연산 근거로 제한했다. `부등호`, 수직선 끝점 표시, 경계값 같은 교과서 관례 기반 항목은 교과서 PDF 확인 전까지 낮은 신뢰도를 유지했다.
- `수직선`, `수직선에서의 위치와 대소`, `부등호 방향`, `양변`, `대입`, `미지수 정하기`, `해 확인`을 일차부등식 절차와 연결했다. 오개념 위험 노드는 선수 관계 없이 `often_confused_with` edge로만 연결하고, `일차방정식의 해`, `그래프`, `좌표 단원의 수직선`, `식의 계산 단원`에서 뻗는 noisy prerequisite edge는 만들지 않았다.
- 전체 파생 산출물을 재생성한 결과 concept은 733개, edge는 3313개가 되었다. source ref audit은 10659개 ref를 기록하고, source catalogue는 5개를 유지한다.
- `review-queue.*`는 109개 low-confidence concept, `concept-evidence-depth.*`는 concept 733개, `edge-evidence-depth.*`는 edge 3313개, `prerequisite-map.*`은 1208개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 733개, edge evidence row 3960개, pending textbook evidence row 4693개, low-confidence concept/edge row 692개를 기록한다. 재생성 후 `일차부등식`은 rank 6이며 concept 30개, edge 158개, 총 188개 evidence row가 모두 `pending_textbook_pdf` 상태다.
- `test_build_pilot_inequality_microconcepts.py`를 추가해 새 일차부등식 미시 concept, `[9수02-11]`·`[9수02-12]` source locator, 수직선 표현 edge, 부등식 성질과 풀이 절차 edge, 활용 문제 해결 흐름, 오개념 confidence 유지, noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_inequality_microconcepts.py` 4개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 290개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 733개 concept, 3313개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 도형의 닮음 미시 concept 병렬 보강

- AGENTS.md를 다시 확인했고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` concept map 보강, 파생 산출물 재생성, 검증 보강으로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `도형의 닮음`을 병렬 감사했다. Pauli는 닮은 도형·대응·닮음비, Halley는 삼각형 닮음 조건·평행선 선분비·무게중심, Lovelace는 오개념 risk와 noisy prerequisite edge를 점검했다.
- `닮은 도형의 성질`, `대응하는 꼭짓점`, `대응하는 변`, `대응하는 각`, `닮은 도형의 대응각의 크기가 같음`, `닮은 도형의 대응변의 길이의 비가 일정함`, `닮음비의 순서`, `닮음비 구하기`, `닮음비로 대응변 길이 구하기`, `닮음비의 순서를 거꾸로 놓는 오류`, `대응하지 않는 변끼리 닮음비를 세우는 오류`를 추가했다.
- `두 쌍의 대응각이 같은 삼각형 닮음 조건`, `두 쌍의 대응변의 길이의 비와 그 끼인각이 같은 삼각형 닮음 조건`, `세 쌍의 대응변의 길이의 비가 같은 삼각형 닮음 조건`, `삼각형 닮음 조건 선택하기`를 추가해 `삼각형의 닮음 조건`을 세 조건과 판별 절차로 분해했다.
- `삼각형에서 한 변에 평행한 직선이 만드는 선분의 비`, `여러 평행선이 두 직선에서 만드는 선분의 비`, `평행선 선분비 식 세우기`, `세 중선은 한 점에서 만남`, `무게중심은 중선을 2:1로 나눔`, `중선 위 2:1 비로 무게중심 위치 찾기`를 추가했다.
- 이번 보강의 source ref는 `CURR_GEO_12`, `CURR_GEO_13`, `CURR_GEO_14`, `CURR_GEO_TERMS`, `CURR_GEO_INSTRUCTIONAL_TERMS`, `ACH_GEO_SIMILARITY`와 필요한 경우 기존 합동·피타고라스·삼각비 근거에 제한했다. 교과서 본문이나 문항 근거가 아직 없는 세부 절차·오개념 risk는 `confidence: medium` 또는 `low`와 notes로 한계를 남겼다.
- 기존 `m1_geo_corresponding_angles`는 평행선의 동위각 맥락이므로 닮음 단원의 `대응하는 각`은 `m1_geo_corresponding_angles_in_similarity`로 분리했다.
- `합동/닮음 -> 합동과 닮음을 같은 관계로 보는 오류`, `도형의 닮음 -> 피타고라스 정리`, `닮음비 -> 삼각비`, `평행선 사이의 선분의 길이의 비 -> 무게중심`처럼 너무 강했던 broad prerequisite edge를 제거하거나 `related_to`/`used_in`으로 낮췄다. 오개념 risk 노드는 선수 관계 없이 `often_confused_with` edge로만 연결했다.
- 전체 산출물을 재생성한 결과 concept은 761개, edge는 3435개가 되었다. source ref 총계는 concept 2095개, edge 8949개, 총 11044개이며 source catalogue는 5개이다.
- `review-queue.*`는 114개 low-confidence concept, `concept-evidence-depth.*`는 concept 761개, `edge-evidence-depth.*`는 edge 3435개, `prerequisite-map.*`은 1250개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 761개, edge evidence row 4103개, pending textbook evidence row 4864개, low-confidence concept/edge row 709개를 기록한다. 재생성 후 `도형의 닮음`은 rank 17이며 concept 32개, edge 142개, 총 174개 evidence row가 모두 `pending_textbook_pdf` 상태다.
- `unit-coverage.*` 기준 `도형의 닮음`은 concept 32개, 내부 edge 107개, incoming edge 28개, outgoing edge 7개이며, concept confidence 분포는 high 10개, medium 18개, low 4개이다.
- `test_build_pilot_similarity_microconcepts.py`를 추가해 닮은 도형·대응·닮음비, 삼각형 닮음 조건, 평행선 선분비, 무게중심 미시 concept과 edge 방향, 오개념 confidence 유지, noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_similarity_microconcepts.py` 5개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 299개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 761개 concept, 3435개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 유리수와 순환소수 미시 concept 병렬 보강

- AGENTS.md를 다시 확인하고, 이번 작업은 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 진행했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `유리수와 순환소수`를 병렬 감사했다. Parfit은 분수-소수 변환과 분모 조건 후보, Raman은 오개념 risk와 low-confidence 경계, Russell은 edge 방향과 noisy prerequisite 제거 대상을 점검했다.
- `기약분수`, `기약분수로 고치기`, `분수를 소수로 나타내기`, `나머지의 반복`, `유한소수가 되는 분모 조건`, `순환소수가 되는 분모 조건`, `분모를 10의 거듭제곱으로 고치기`, `유한소수를 분수로 나타내기`를 추가해 분수-소수 판별 흐름을 미시 concept으로 분해했다.
- `순환마디 찾기`, `순환소수의 점 표기`, `식을 세워 순환소수를 분수로 나타내기`를 추가해 순환소수 표기와 분수 변환 절차를 별도 노드로 분리했다.
- `기약분수로 나타내지 않고 분모 조건을 판단하는 오류`, `분모의 소인수가 2 또는 5이면 순환소수라고 판단하는 오류`, `순환소수 점 표기의 범위를 잘못 읽는 오류`, `순환소수를 분수로 나타낼 때 자리 이동 수를 잘못 맞추는 오류`를 오개념 risk로 추가했다. 기존 `유한소수를 순환소수로 나타내기 범위 오해`는 선수 관계 없이 오개념 관계만 유지했다.
- Russell의 감사 결과에 따라 `유리수 -> 유한소수/무한소수` broad prerequisite, `유리수와 순환소수의 관계 -> 유한소수를 순환소수로 나타내기 범위 오해` prerequisite, `분수와 소수의 분류 -> 유한소수/순환소수` reverse `used_in`, `유리수와 순환소수의 관계 -> 순환소수를 분수로 나타내기` 방향 edge를 정리했다.
- `순환소수를 분수로 나타내기 -> 유리수` represented_by edge는 `순환소수 -> 유리수의 분수 표현` represented_by로 바꾸고, `순환소수를 분수로 나타내기 -> 유리수와 순환소수의 관계`는 `used_in`으로 연결했다. `유리수와 순환소수` 단원에서 `제곱근과 실수`로 이어지던 prerequisite는 `related_to`로 낮췄다.
- 전체 산출물을 재생성한 결과 concept은 776개, edge는 3502개가 되었다. source ref 총계는 concept 2134개, edge 9126개, 총 11260개이며 source catalogue는 5개이다.
- `review-queue.*`는 118개 low-confidence concept, `concept-evidence-depth.*`는 concept 776개, `edge-evidence-depth.*`는 edge 3502개, `prerequisite-map.*`은 1274개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 776개, edge evidence row 4178개, pending textbook evidence row 4954개, low-confidence concept/edge row 722개를 기록한다. 재생성 후 `유리수와 순환소수`는 rank 13이며 concept 25개, edge 114개, 총 139개 evidence row가 모두 `pending_textbook_pdf` 상태다.
- `unit-coverage.*` 기준 `유리수와 순환소수`는 concept 25개, 내부 edge 89개, incoming edge 19개, outgoing edge 6개이며, concept confidence 분포는 high 8개, medium 12개, low 5개이다.
- `test_build_pilot_repeating_decimal_microconcepts.py`를 추가해 분수-소수 분류 미시 concept, 순환마디·점 표기·분수 변환 절차, edge 방향, 오개념 confidence 유지, noisy edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_repeating_decimal_microconcepts.py` 5개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 304개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 776개 concept, 3502개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 산출물 파이프라인을 재실행했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 상자그림과 산점도 미시 concept 병렬 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `상자그림과 산점도`를 병렬 감사했다. Hilbert는 기존 노드·edge와 누락 후보, Sagan은 상자그림·산점도 표현/절차/오개념과 noisy edge, McClintock은 테스트 구조와 insertion point를 점검했다.
- `사분위수를 구하기 위한 자료 정렬`, `사분위수 구하기`, `제1사분위수`, `제2사분위수`, `제3사분위수`, `최솟값`, `최댓값`, `상자그림의 다섯 값`, `사분위범위`, `상자그림의 상자`, `상자그림의 수염`, `공학 도구로 상자그림 나타내기`, `상자그림에서 중심과 퍼짐 읽기`를 추가해 상자그림의 구성 요소와 읽기 절차를 분해했다.
- `두 변량의 대응값`, `산점도의 두 축과 변량`, `산점도의 점`, `산점도로 나타내기`, `산점도의 경향`을 추가해 산점도 표현과 상관관계 판단 전 단계를 분리했다.
- `자료를 정렬하지 않고 사분위수를 구하는 오류`, `상자그림 구간의 길이를 자료 수로 해석하는 오류`, `산점도의 두 변량을 축에 바꾸어 나타내는 오류`를 오개념 risk로 추가했다. 기존 `상관관계를 원인과 결과로 단정하는 오류`는 선수 관계를 제거하고 `often_confused_with` 관계만 유지했다.
- `산포도 -> 상자그림과 산점도`, `공학 도구 -> 상자그림과 산점도`, `공학 도구 -> 상자그림`, `그래프 -> 산점도`처럼 너무 넓은 prerequisite edge를 제거하거나 `related_to`/`used_in`으로 낮췄다. `좌표평면 represented_by 산점도`는 방향이 어색해 `좌표평면 used_in 산점도/산점도로 나타내기`로 바꿨다.
- `사분위범위`, `최솟값`, `최댓값`, `상자그림의 상자`, `상자그림의 수염`은 공식 문서에서 직접 용어로 열거되지 않은 미시 개념이므로 `confidence: low`와 notes로 교과서 본문 확인 필요를 남겼다. `이상치`, `상관계수`, `추세선`, `회귀`, `1.5 IQR 규칙`은 현재 공식 근거로는 추가하지 않았다.
- 전체 산출물을 재생성한 결과 concept은 797개, base edge는 3622개가 되었다. source ref audit은 총 11572개 ref를 기록하고 source catalogue는 5개를 유지한다.
- `review-queue.*`는 126개 low-confidence concept, `concept-evidence-depth.*`는 concept 797개, `edge-evidence-depth.*`는 edge 3622개, `prerequisite-map.*`은 1319개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 797개, edge evidence row 4321개, pending textbook evidence row 5118개, low-confidence concept/edge row 775개를 기록한다.
- 재생성 후 `상자그림과 산점도`는 rank 4, priority tier `highest`이며 concept 32개, edge 168개, 총 200개 evidence row가 모두 `pending_textbook_pdf` 상태다. 이 단원의 low-confidence concept은 9개, low-confidence edge는 43개이다.
- `unit-coverage.*` 기준 `상자그림과 산점도`는 concept 32개, 내부 edge 129개, incoming edge 35개, outgoing edge 4개이며, confidence 분포는 high 12개, medium 11개, low 9개이다. concept type 분포는 core 2개, sub_concept 7개, representation 5개, procedure 7개, term 7개, misconception_risk 4개이다.
- `test_build_pilot_data_box_scatter_microconcepts.py`를 추가해 상자그림 구성 요소, 산점도 표현 절차, edge 방향, 오개념 confidence 유지, broad/noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_data_box_scatter_microconcepts.py` 5개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_data_box_scatter_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 33개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 309개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 797개 concept, 3622개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 직접 파생 산출물과 research-report/legacy 보조 산출물을 재생성했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 산포도 미시 concept 병렬 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `산포도`를 병렬 감사했다. Herschel은 기존 8개 노드와 누락 후보, Wegener는 `[9수04-07]`의 공식 근거 경계와 low-confidence 유지 항목, Schrodinger는 테스트 구조와 noisy edge 부재 조건을 점검했다.
- `편차 구하기`, `편차 계산식`, `편차의 합은 0`, `편차의 제곱`, `편차의 제곱의 합`, `분산 구하기`, `분산 계산식`, `표준편차 구하기`, `표준편차 계산식`, `산포도 계산 표`, `표준편차의 단위`, `산포도 값의 크기 해석`, `산포도로 자료의 분포 설명하기`, `평균이 같은 두 분포의 흩어진 정도 비교`를 추가해 `편차 -> 편차의 제곱 -> 분산 -> 표준편차 -> 분포 설명/비교` 흐름을 미시 concept으로 분해했다.
- `편차를 항상 양수 거리로 보는 오류`, `표준편차에서 제곱근을 빠뜨리는 오류`, `평균이 같으면 분포도 같다고 보는 오류`를 오개념 risk로 추가했다. 기존 `분산과 표준편차를 같은 값으로 보는 오류`는 선수 관계를 제거하고 `often_confused_with` 관계만 유지했다.
- 이번 보강의 source ref는 `CURR_DATA_07`, `CURR_DATA_TERMS`, `ACH_DATA_VARIABILITY`로 제한했다. 공식 문서에 직접 등장하는 `산포도`, `편차`, `분산`, `표준편차`, `분산과 표준편차 구하기`, `자료의 분포 설명하기`는 high 또는 medium으로 두고, `편차의 합은 0`, `산포도 계산 표`, `표준편차의 단위`, 같은 평균의 두 분포 비교 맥락, 오개념 risk는 교과서 본문·예제·문항 근거 확인 전까지 `confidence: low`와 notes를 남겼다.
- `범위`, `사분위범위`, `최솟값/최댓값`, `다섯 수 요약`, `이상치`, `1.5 IQR 규칙`, `표본분산(n-1)`, 평균절대편차, 변동계수, 표준점수, 정규분포, 공분산, 상관계수, 회귀·추세선은 현재 산포도 공식 근거 경계를 벗어나므로 추가하지 않았다.
- `분산 구하기 -> 산포도 계산 표` represented_by, `자료의 분포 -> 산포도로 자료의 분포 설명하기` used_in, `편차의 합은 0 -> 편차의 제곱` related_to edge를 추가해 `related_ids`와 semantic edge의 정합성을 맞췄다. 최종 재생성 후 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- 전체 산출물을 재생성한 결과 concept은 814개, edge는 3708개가 되었다. source ref audit은 총 11780개 ref를 기록하고 source catalogue는 5개를 유지한다.
- `review-queue.*`는 133개 low-confidence concept, `concept-evidence-depth.*`는 concept 814개, `edge-evidence-depth.*`는 edge 3708개, `prerequisite-map.*`은 1348개 선수 관계 edge로 갱신했다.
- `textbook-evidence-workplan.*`은 34개 단원 그룹, concept evidence row 814개, edge evidence row 4422개, pending textbook evidence row 5236개, low-confidence concept/edge row 809개를 기록한다.
- 재생성 후 `산포도`는 rank 10, priority tier `highest`이며 concept 25개, edge 132개, 총 157개 evidence row가 모두 `pending_textbook_pdf` 상태다. 이 단원의 low-confidence concept은 8개, low-confidence edge는 32개이다.
- `unit-coverage.*` 기준 `산포도`는 concept 25개, 내부 edge 99개, incoming edge 31개, outgoing edge 2개이며, confidence 분포는 high 8개, medium 9개, low 8개이다. concept type 분포는 core 2개, sub_concept 3개, representation 4개, procedure 7개, property 2개, term 3개, misconception_risk 4개이다.
- `test_build_pilot_data_variability_microconcepts.py`를 추가해 산포도 계산 미시 concept, `[9수04-07]` source locator, 계산 흐름 edge, 공식 근거가 약한 항목의 confidence 경계, 오개념 risk의 선수 관계 부재, broad/noisy prerequisite edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_data_variability_microconcepts.py` 4개 통과.
- edge/queue 테스트: `python -m unittest test_build_pilot_data_variability_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py` 32개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 313개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 814개 concept, 3708개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- 전체 직접 파생 산출물과 research-report/legacy 보조 산출물을 재생성했다. 교과서 evidence packet을 만든 뒤 `textbook-evidence-workplan.*`을 다시 생성해 rank/count가 최신 packet index를 보도록 했다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 작도와 합동 미시 concept 병렬 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `작도와 합동`을 병렬 감사했다. Arendt는 기존 노드·edge와 noisy prerequisite 후보, Ampere는 공식 성취기준과 성취수준 문서의 source boundary, Nietzsche는 테스트 구조와 edge 방향 고정 조건을 점검했다.
- `눈금 없는 자와 컴퍼스`, `주어진 선분과 길이가 같은 선분 작도`, `주어진 각과 크기가 같은 각 작도`, `세 변이 주어진 삼각형 작도`, `두 변과 그 끼인각이 주어진 삼각형 작도`, `한 변과 그 양 끝각이 주어진 삼각형 작도`, `주어진 삼각형과 합동인 삼각형 작도`, `작도 과정 설명하기`를 추가해 작도 도구·기본 작도·삼각형 작도 유형을 미시 concept으로 분해했다.
- `합동에서의 대응 관계`, `합동에서의 대응하는 꼭짓점`, `합동에서의 대응하는 변`, `합동에서의 대응하는 각`, `합동인 도형의 대응변의 길이가 같음`, `합동인 도형의 대응각의 크기가 같음`을 추가해 합동 판별 전에 필요한 대응 요소 확인을 별도 노드로 분리했다.
- `세 쌍의 대응변의 길이가 각각 같은 삼각형 합동 조건`, `두 쌍의 대응변의 길이와 그 끼인각의 크기가 각각 같은 삼각형 합동 조건`, `한 쌍의 대응변의 길이와 그 양 끝각의 크기가 각각 같은 삼각형 합동 조건`, `삼각형 합동 조건 선택하기`를 추가해 기존 `삼각형의 합동 조건`을 교과서형 세부 조건과 판별 절차로 나누었다.
- `작도에서 측정 도구를 쓰는 오류`, `두 변과 끼이지 않은 각을 SAS 조건으로 보는 오류`, `합동 판별에서 대응 순서를 맞추지 않는 오류`를 오개념 risk로 추가했다. 오개념 노드는 `confidence: low`, 선수 관계 없음, `often_confused_with` 중심으로만 연결했다.
- 이번 보강의 source ref는 `CURR_GEO_03`, `ACH_GEO_CONSTRUCTION`, `CURR_GEO_04`, `ACH_GEO_TRI_CONGRUENCE`, `CURR_GEO_TERMS`로 제한했다. 공식 문서가 직접 요구하는 작도·합동 판별은 high로 두고, SSS/SAS/ASA 개별 조건명과 작도 세부 유형은 교과서 본문 확인 전까지 `confidence: medium`, 오개념 risk는 `confidence: low`로 유지했다.
- Arendt의 감사 결과에 따라 기존 `삼각형의 작도 -> 합동` `prerequisite_for` edge를 제거하고 `used_in` 맥락만 남겼다. 도구는 `represented_by`가 아니라 `used_in`으로, 대응 관계는 합동의 표현·판별에 쓰이는 관계로 연결했다.
- 전체 산출물을 재생성한 결과 concept은 835개, edge는 3800개가 되었다. source ref audit은 12015개 ref를 기록하고 source catalogue는 5개를 유지한다.
- `review-queue.*`는 136개 low-confidence concept, `concept-evidence-depth.*`는 concept 835개, `edge-evidence-depth.*`는 edge 3800개, `prerequisite-map.*`은 1376개 선수 관계 edge로 갱신했다.
- `unit-coverage.*` 기준 `작도와 합동`은 concept 29개, 내부 edge 104개, incoming edge 23개, outgoing edge 13개이며, confidence 분포는 high 10개, medium 16개, low 3개이다. concept type 분포는 core 2개, sub_concept 1개, procedure 11개, property 6개, term 6개, misconception_risk 3개이다.
- `textbook-evidence-workplan.*`에서 `작도와 합동`은 rank 26, priority tier `highest`이며 concept 29개, edge 140개, 총 169개 evidence row가 모두 `pending_textbook_pdf` 상태다. 이 단원의 low-confidence concept은 3개, low-confidence edge는 12개이다.
- `test_build_pilot_construction_congruence_microconcepts.py`를 추가해 작도 도구·작도 유형·합동 대응 관계·SSS/SAS/ASA 조건·오개념 risk·noisy edge 부재를 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_construction_congruence_microconcepts.py` 5개 통과.
- edge/queue 회귀 테스트: `python -m unittest test_build_pilot_construction_congruence_microconcepts.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py test_build_pilot_similarity_microconcepts.py test_build_pilot_triangle_quadrilateral_microconcepts.py` 43개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 318개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 835개 concept, 3800개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 직접 파생 산출물과 research-report/legacy 보조 산출물을 재생성했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 2026-07-02 대푯값 미시 concept 병렬 보강

- AGENTS.md를 다시 확인하고, 이번 작업도 PDF 원본이나 다운로드 manifest를 변경하지 않는 `docs/math-concept-map/` 생성 로직과 파생 산출물 정비로 제한했다.
- 멀티에이전트 explorer 3개를 읽기 전용으로 사용해 `대푯값`을 병렬 감사했다. Nash는 기존 7개 노드와 후보 concept, Erdos는 `[9수04-01]`·용어 목록·성취수준·평균 보조 근거의 source boundary, Volta는 새 테스트 구조와 noisy edge 부재 조건을 점검했다.
- `자료값의 합`, `자료의 개수`, `평균 계산식`, `평균 구하기`를 추가해 평균을 “합 -> 자료 수 -> 계산식 -> 계산 절차”로 분해했다. 평균은 공식 용어 목록의 직접 핵심어가 아니므로 `CURR_DATA_REP_NOTE`, `ACH_DATA_REPRESENTATIVE`, `ACH_RESEARCH_MEAN_177`에 기반한 `confidence: medium`으로 유지했다.
- `중앙값을 구하기 위한 자료 정렬`, `가운데 위치`, `자료의 개수가 홀수일 때 중앙값`, `자료의 개수가 짝수일 때 중앙값`을 추가해 중앙값 정의와 실제 계산 절차를 분리했다.
- `자료값의 도수 세기`, `최빈값 찾기`, `최빈값이 없는 경우`, `최빈값이 여러 개인 경우`를 추가해 최빈값의 빈도 세기 절차와 예외 상황을 노드화했다. 예외 상황은 교과서 본문·예제 근거 확인 전까지 `confidence: low`로 둔다.
- `자료의 특성 살펴보기`, `대푯값의 유용성 토론하기`, `극단적인 값`, `평균은 극단적인 값의 영향을 받음`, `극단적인 값이 있는 자료에서 중앙값 고려하기`를 추가해 “자료의 특성에 따라 적절한 대푯값 선택”을 수업에서 실제로 판단하는 절차로 분해했다.
- `자료를 정렬하지 않고 중앙값을 찾는 오류`, `최빈값을 가장 큰 값으로 보는 오류`, `짝수 개 자료에서 두 가운데 값 중 하나만 중앙값으로 보는 오류`, `극단적인 값이 있는 자료에서 평균만 선택하는 오류`를 오개념 risk로 추가했다. 기존 `대푯값을 평균으로만 보는 오류`도 선수 관계 없이 `often_confused_with` 관계 중심으로 정리했다.
- Erdos의 source boundary에 따라 가중평균, 기하평균, 기대값, 표본/모집단 표기, 백분위수 알고리즘, 1.5 IQR 규칙, 왜도·첨도, 사분위수·상자그림·분산·표준편차는 이번 `대푯값` slice에 추가하지 않았다.
- 전체 산출물을 재생성한 결과 concept은 856개, edge는 3906개가 되었다. source ref audit은 12375개 ref를 기록하고 source catalogue는 5개를 유지한다.
- `review-queue.*`는 145개 low-confidence concept, `concept-evidence-depth.*`는 concept 856개, `edge-evidence-depth.*`는 edge 3906개, `prerequisite-map.*`은 1416개 선수 관계 edge로 갱신했다.
- `unit-coverage.*` 기준 `대푯값`은 concept 28개, 내부 edge 115개, incoming edge 26개, outgoing edge 14개이며, confidence 분포는 high 8개, medium 10개, low 10개이다. concept type 분포는 core 2개, representation 1개, procedure 10개, property 3개, term 7개, misconception_risk 5개이다.
- `textbook-evidence-workplan.*`에서 `대푯값`은 rank 4, priority tier `highest`이며 concept 28개, edge 155개, 총 183개 evidence row가 모두 `pending_textbook_pdf` 상태다. 이 단원의 low-confidence concept은 10개, low-confidence edge는 43개이다.
- `test_build_pilot_data_representative_microconcepts.py`를 추가해 평균 계산, 중앙값 홀수/짝수 처리, 최빈값 예외, 대푯값 선택 맥락, 오개념 risk의 confidence와 prerequisite 부재, 표현 edge 방향을 고정했다.
- 좁은 테스트: `python -m unittest test_build_pilot_data_representative_microconcepts.py` 6개 통과.
- edge/queue 회귀 테스트: `python -m unittest test_build_pilot_data_representative_microconcepts.py test_build_pilot_data_representative_refs.py test_build_pilot_edge_sync.py test_build_related_edge_resolution_queue.py test_build_node_edge_consistency_audit.py test_build_pilot_data_frequency_microconcepts.py test_build_pilot_data_variability_microconcepts.py test_build_pilot_data_box_scatter_microconcepts.py` 48개 통과.
- 전체 단위 테스트: `python -m unittest discover -s . -p "test_*.py"`를 `docs/math-concept-map/tools`에서 실행해 324개 통과.
- 전체 validator: `python docs/math-concept-map/tools/validate_concept_map.py`: 856개 concept, 3906개 edge, 5개 source, 60개 공식 성취기준 검증 통과.
- diff check: `git diff --check -- docs/math-concept-map`: 종료 코드 0, CRLF 변환 경고만 확인.
- 전체 직접 파생 산출물과 research-report/legacy 보조 산출물을 재생성했고 `node-edge-consistency-audit.*`와 `related-edge-resolution-queue.*`는 모두 0건이다.
- PDF 원본과 `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`, `2022_개정_중학교_성취수준_PDF/DOWNLOAD_MANIFEST.md`는 변경하지 않았다.

## 다음 작업

- 교과서 PDF가 추가되면 먼저 `TEXTBOOK_SOURCE_MANIFEST.csv`를 작성하고 `textbook-source-audit.*`가 `ready_for_textbook_extraction`을 기록하는지 확인한다.
- 교과서 PDF가 추가되기 전에는 `research-report-source-review.*`의 `not_applicable_from_this_row` 41개가 broad context, 용어 충돌, 도구·자료 입력, 또는 약한 출현으로 유지되는지 주기적으로 감사한다. 현재 `pending_manual_review`는 8개이며, 주로 `선분`·`반직선` 후보이므로 교과서 본문 또는 중학교 기본 도형 직접 근거 확인 후 source ref 반영 여부를 판단한다.
- 그 다음 `textbook-evidence-workplan.*`, `concept-evidence-depth.*`, `edge-evidence-depth.*`를 함께 사용해 concept 근거 보강률과 edge 근거 보강률을 분리해서 추적한다.
- 현재 교과서 원본 PDF가 없으므로, 추출 시작 단원은 `좌표평면과 그래프`의 concept 43개와 edge packet row 253개, 총 296개 row로 유지한다. 공식·보조 문서 기반 미시 concept 보강을 계속한다면 이미 보강한 상위 단원을 제외하고 `피타고라스 정리`, `일차함수와 일차방정식의 관계`, `삼각비`처럼 미시 concept이 덜 분해된 단원을 우선 검토한다.
- 새 concept, alias, `related_ids`, 또는 `equivalent_to` 후보가 추가되면 `equivalence-alias-audit.*`, `related-edge-resolution-queue.*`, `textbook-edge-evidence-packets/*`, `edge-evidence-depth.*`를 함께 재생성한다.
