# Skill-Will Group Survey

## Purpose

`/group-survey/[accessCode]` is a public student-only survey link for group formation. Students do not enter the main 세특 or observation board workspace. They identify themselves with grade, class, and number, confirm the matched name, and submit the 12 survey items. Teachers use `/observation-board-2` > `모둠 편성` to review class-level status, enter Skill scores, and inspect the class Skill-Will plane.

## Student Flow

1. The teacher creates a class survey session and receives an `accessCode`.
2. The student opens `/group-survey/[accessCode]`.
3. The student enters grade, class, and number.
4. The server checks the 성호중학교 roster and returns only name-confirmation data plus a short-lived submit token.
5. The student confirms the name and submits the 12 items on a 1-5 scale.

The student page must not expose Skill, evaluation, ability, grade/rank, or coordinate dashboard language.

## Teacher Flow

Teachers can use the `모둠 편성` screen to:

- create, copy, open, and close survey sessions
- see submission rate and missing-response count
- enter Skill 1-3 for each student as needed
- view all plottable students as points on the class Skill-Will coordinate plane
- see which students are still missing survey responses or Skill input

## Coordinate Rules

- Coordinate screen labels the horizontal axis as `도움이 더 필요해요` to `친구에게 설명할 수 있어요`
- Coordinate screen labels the vertical axis as `끝까지 해보려는 마음 낮음` to `끝까지 해보려는 마음 높음`
- Teacher Skill input uses 1 `도움 필요`, 2 `기본 가능`, 3 `설명 가능`
- Will average is calculated from 1.0 to 5.0 but shown in the UI as `참여 의지`
- Dot size: participation agency average
- Small dot: 1.0-2.4
- Medium dot: 2.5-3.4
- Large dot: 3.5-5.0
- Dot color is not used as a semantic value. Selection state should use borders or labels.
- Students without Skill input are not placed on the plane and appear in `학습 준비도 입력 대기`.

## Storage

Migration: `supabase/migrations/202605160001_group_survey.sql`

- `group_survey_sessions`: survey links, classes, teacher ownership, and status
- `group_survey_responses`: 12 answers, `will_avg`, `agency_avg`, and submit timestamps
- `group_student_skill_scores`: teacher-entered Skill 1-3
- `grouping_recommendation_runs`: recommendation results and run history

Development without Supabase uses an in-memory store for local smoke tests. Production still requires Supabase, following the existing runtime storage policy.

## APIs

Public:

- `POST /api/group-survey/identify`
- `POST /api/group-survey/submit`

Teacher session required:

- `GET /api/group-survey/teacher?classId=...`
- `POST /api/group-survey/teacher` with `create_session`
- `POST /api/group-survey/teacher` with `set_status`
- `POST /api/group-survey/teacher` with `save_skill`

Public APIs do not return roster lists or class response lists.

## Dashboard Scope

The current teacher dashboard is intentionally simple: it shows the selected class as a coordinate plane and a compact student status list. It does not expose automatic group generation, partner recommendations, current-group feedback, or apply-to-observation-board controls.

## Verification

- `cmd /c npx tsc --noEmit --pretty false`: passed on 2026-05-16.
- Local route smoke: passed on 2026-05-16 for login, survey session creation, student identify, survey submit, Skill save, and recommendation generation with a temporary local roster fixture. The visible dashboard scope was later simplified to the class coordinate view.
- Browser visual smoke: not executed because the Browser tool was not exposed by tool discovery and Playwright is not installed in this project.
