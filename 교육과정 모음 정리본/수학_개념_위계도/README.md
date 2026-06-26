# 수학 개념 위계도

2022 개정 수학과 교육과정의 초1-중3 공식 위계를 바탕으로, 사용자가 제공한 교과서·익힘책·지도서 세부개념을 연결하는 산출물입니다.

## 열기

- 인터랙티브 HTML: `index.html`
- 원천 데이터: `data/math_concept_hierarchy.json`
- 문서 요약: `수학_개념_위계도.md`
- PDF 요약: `수학_개념_위계도.pdf`
- 출처 매니페스트: `SOURCE_MANIFEST.md`

## 갱신

`교과서_원본/`에 원본 파일을 넣은 뒤 아래 명령을 실행합니다.

```powershell
& "C:\Users\pbj95\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" "수학_개념_위계도\tools\build_math_hierarchy.py"
```
