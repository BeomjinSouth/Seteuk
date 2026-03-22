# AGENTS.md

## Scope

이 저장소에서 학생부 상담 챗봇과 생기부 점검 AI의 GitHub 기준 문서는 `docs/student-record-knowledge/` 아래 파일들이다.

로컬 워크스페이스의 `../student-record-knowledge/` 문서는 상세 원본이고, 이 저장소에 들어오는 변경은 요약/미러 형태로 동기화한다.

## Source Of Truth

1. `docs/student-record-knowledge/PRD.md`
2. `docs/student-record-knowledge/IMPLEMENTATION.md`
3. `docs/student-record-knowledge/SOURCE_AUDIT.md`
4. `src/app/api/counsel-chat/route.ts`
5. `src/app/api/record-review/route.ts`
6. `src/lib/knowledge-base.ts`

## Mandatory Maintenance

### 기능 범위 변경

- PRD와 IMPLEMENTATION을 같이 갱신한다.

### 수집/검색 규칙 변경

- SOURCE_AUDIT와 IMPLEMENTATION을 같이 갱신한다.

### API 계약 변경

- 관련 route와 문서를 같이 갱신한다.

## End Of Task

1. 구현 파일과 문서 파일이 서로 모순되지 않는지 확인
2. `npx tsc --noEmit` 실행
3. 가능하면 route 스모크 테스트 실행
4. Git 저장소와 remote가 정상이면 commit/push

## Git Rule

- 기본 순서: `git add -A` -> `git commit -m "<scope>: <summary>"` -> `git push origin HEAD`
- push가 실패하면 원인까지 기록한다.
- force-push는 사용하지 않는다.
