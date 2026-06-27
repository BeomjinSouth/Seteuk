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
