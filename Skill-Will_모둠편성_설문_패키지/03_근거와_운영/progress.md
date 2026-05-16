# Progress Log

## 2026-05-15

- `AGENTS.md`를 생성해 프로젝트 운영 규칙, 참고 문서 순서, 검증 기준을 기록했다.
- `docs/context.md`에 Skill-Will 기반 모둠 편성 모델의 목적, 좌표 구조, 비사용 범위를 정리했다.
- `docs/research_basis.md`에 Skill-Will Matrix, Big Five 성실성/IPIP/BFI-2, MSLQ, Interpersonal Circumplex 기반을 기록했다.
- `survey/student_survey.md`에 중학생용 12문항 설문을 작성했다.
- `survey/teacher_guide.md`에 교사용 점수화, 좌표 해석, 모둠 편성 원칙, 학생용 피드백 문구를 작성했다.
- `survey/scoring_template.csv`에 교사용 점수화 템플릿을 작성했다.
- 검증: 학생용 설문 문항 수, 학생용 금지 표현, CSV 헤더/수식 구조를 점검했다. CSV 수식 셀의 쉼표가 열 구분자로 읽히는 문제를 발견해 수식 셀을 따옴표로 감싸 수정했다.
- Git/GitHub: 빈 폴더를 Git 저장소로 초기화했다. 첫 커밋 시 Git 사용자 정보가 없어 실패했으므로, 이 저장소에만 `Codex <codex@local>`을 설정했다. `git push`를 시도했지만 원격 저장소가 설정되어 있지 않아 실패했다. 다음 조치는 GitHub 원격 저장소를 추가한 뒤 `git push -u origin <branch>`를 실행하는 것이다.

## 2026-05-16

- 바탕화면 배포용 폴더를 만들기 위해 `docs/desktop_package_readme.md`를 추가했다.
- 바탕화면에 `C:\Users\pbj95\Desktop\Skill-Will_모둠편성_설문_패키지` 폴더를 만들고 자료를 복사했다.
- 폴더 구조는 `01_학생용`, `02_교사용`, `03_근거와_운영`으로 정리했다.
- 포함 파일 검증 결과: `README.md`, 학생용 설문, 교사용 가이드, CSV 템플릿, context, research_basis, progress, AGENTS 파일이 모두 존재함을 확인했다.
- Git/GitHub: `Add desktop package index` 커밋을 만들었다. `git push`를 다시 시도했지만 원격 저장소가 설정되어 있지 않아 실패했다. 다음 조치는 `git remote add origin <GitHub 저장소 URL>` 후 `git push -u origin master`를 실행하는 것이다.
- 세특 웹앱 `C:\Users\pbj95\Desktop\Seteuk-main`에 Skill-Will 설문 연계를 구현했다. 학생용 공개 경로는 `/group-survey/[accessCode]`이고, 교사용 화면은 `/observation-board-2`의 `모둠 편성` 메뉴이다.
- Supabase 마이그레이션 `supabase/migrations/202605160001_group_survey.sql`을 추가해 설문 세션, 응답, 교사 Skill 입력, 추천 실행 기록을 저장하도록 했다.
- 학생용 API는 명부 대조 후 이름 확인과 짧은 제출 토큰만 제공하고, 공개 API에서 명부 목록이나 학급 응답 목록을 반환하지 않도록 했다.
- 교사용 대시보드는 X축 Skill, Y축 Will, 점 크기 참여 주도성 원칙을 따르고, Skill 미입력 학생은 좌표에 배치하지 않고 대기 목록에 표시하도록 했다.
- 교사용 대시보드 범위를 다시 줄여 학급별 전체 학생을 좌표평면 위 점으로 보는 화면과 간단한 Skill/응답 상태 확인에 집중하도록 했다. 추천 모둠, 잘 어울릴 학생, 현재 모둠 피드백, 관찰판 적용 UI는 현재 화면에서 노출하지 않는다.
- 좌표평면 화면의 보이는 문구를 한글 중심으로 정리했다. 가로축 양 끝은 `도움이 더 필요해요`와 `친구에게 설명할 수 있어요`, 세로축 양 끝은 `끝까지 해보려는 마음 낮음/높음`으로 표시하고, 학생 표시 상태의 1/2/3 버튼은 각각 `도움 필요`, `기본 가능`, `설명 가능` 뜻이 함께 보이도록 했다.
- 검증: `cmd /c npx tsc --noEmit --pretty false` 통과. 로컬 dev 서버에서 임시 명부 fixture로 로그인, 설문 세션 생성, 학생 식별, 설문 제출, Skill 저장, 추천 생성 smoke test 통과. 브라우저 시각 검증은 현재 환경에서 Browser 도구가 노출되지 않았고 Playwright가 설치되어 있지 않아 실행하지 못했다.
- Git/GitHub: 최초 구현 폴더인 `C:\Users\pbj95\Desktop\Seteuk-main`은 `.git` 저장소가 아니어서 직접 커밋/push할 수 없었다. 이후 변경 파일을 실제 Git checkout인 `C:\Users\pbj95\Desktop\Seteuk`으로 옮겨 커밋/push 대상으로 삼았다.
