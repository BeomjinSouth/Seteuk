# AGENTS.md

## Scope

This folder stores official curriculum PDF downloads and their provenance.

## Source Rules

- Prefer official public sources such as NCIC and Ministry of Education / National Education Commission pages.
- Keep downloaded PDFs unchanged.
- Keep a manifest with source URLs, attachment identifiers, file sizes, and hashes whenever files are added or refreshed.

## Maintenance

- When PDFs are added, removed, or refreshed, update `README.md` and `2022_개정_중학교_교육과정_PDF/DOWNLOAD_MANIFEST.md`.
- If the download basis changes, record the new source and selection rule in the manifest.
- Verify that downloaded PDFs start with a valid PDF header and that the file count matches the stated collection scope.

## Math Concept Map Scope Rules (2026-07-06 사용자 결정)

`docs/math-concept-map/` 작업(시각화, 미시 concept 분해, 이후 보강) 전체에 적용한다. 다른 세션·다른 도구에서도 이 규칙을 따른다.

- 대상 범위는 초1~고3 중 **공통 교육과정(초1-2, 초3-4, 초5-6, 중1-3)과 고등학교 공통 과목(공통수학1·2, 기본수학1·2)**로 한정한다. **고등학교 선택 과목(일반·진로·융합: 대수, 미적분Ⅰ·Ⅱ, 확률과 통계, 기하, 경제 수학, 인공지능 수학, 직무 수학, 수학과 문화, 실용 통계, 수학과제 탐구)은 당분간 작업에서 제외한다.** `k12-spine-*`에 이미 추출된 선택 과목 노드는 참조용으로만 보존하고, 시각화·미시 분해·근거 보강 대상으로 삼지 않는다.
- 위계 그래프는 힘-방향(옵시디언식) 배치가 아니라 **학년군 진행이 축으로 드러나는 계층형 레이아웃**(학년군×영역 격자 등)으로 만든다. 누구나 선수 흐름을 읽을 수 있어야 한다.
- 개념·표현·용어는 모델의 사전 지식으로 채우지 않는다. **한국 공식 문서(별책8 교육과정, 성취수준 문서)와 이후 추가될 한국 교과서 원본에서 추출한 텍스트에 페이지 단위 출처를 붙여서만** 반영한다. 외국 교육과정 개념 혼입과 한국 교과서 내용 누락을 막기 위한 규칙이다. 교과서 근거가 아직 없는 항목은 기존 관행대로 `confidence`를 낮추고 notes에 남긴다.

## Git

- Commit only changes related to this curriculum collection unless the user explicitly asks for broader repository work.
