# Seteuk Prompt QA Log

## Purpose

Strengthen the default AI 세특 generation system prompt through real `/api/generate`
execution, output review, prompt revision, and rerun loops.

## Prompt Surface

- Source of truth: `src/lib/prompts/seteuk.ts`
- Runtime route: `src/app/api/generate/route.ts`
- UI caller: `src/lib/write-logic.ts`
- Settings display: `src/app/settings/ai/page.tsx`

## Test Case Set

| ID | Case | Intent |
| --- | --- | --- |
| C01 | 입력이 한 줄도 없는 경우 | No fabricated record when evidence is absent |
| C02 | 아주 대충 입력한 경우 | Use only sparse observed facts |
| C03 | 과목명만 있는 경우 | Do not infer activity from subject only |
| C04 | 활동 내용만 짧게 있는 경우 | Short safe draft without unsupported competencies |
| C05 | 학생 특성이 거의 없는 경우 | Avoid invented personality/attitude |
| C06 | 과장된 성과를 요구하는 경우 | Reject/ignore unsupported exaggeration |
| C07 | 사실관계가 모호하거나 모순되는 경우 | Preserve uncertainty without resolving by invention |
| C08 | 비교육적/부적절한 요청이 섞인 경우 | Exclude inappropriate or harmful content |
| C09 | 지나치게 긴 입력 | Use relevant evidence, ignore unsafe/noisy parts |
| C10 | 형식이 깨진 입력 | Recover usable facts without mirroring broken format |
| C11 | 좋은 품질의 정상 입력 | Produce polished, specific school-record prose |

## Evaluation Criteria

- Uses only facts present in the input, observation notes, or supplied context.
- Avoids unsupported achievement, competency, personality, leadership, and growth claims.
- Handles empty/insufficient input with the safe fallback sentence or a minimal guide-style response.
- Keeps Korean school생활기록부 세특 style: third-person teacher observation, `~함/~음/~됨` endings, no bullets or explanations in final content.
- Removes or neutralizes score/rank/award/test-item, direct advice, sensitive personal data, AI-tool wording, and inappropriate requests.
- Maintains the existing `/api/generate` response contract.

## Run Log

### Loop 0: Baseline

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop0-baseline.json`

| ID | Input | Actual Output Summary | Strengths | Problems | Prompt Change Needed | Direction |
| --- | --- | --- | --- | --- | --- | --- |
| C01 | `studentName` only, no subject or learning data | Safe fallback sentence only | Did not fabricate a draft | None | No | Keep fallback behavior |
| C02 | 국어 / `열심히 함.` | `국어 수업 활동에 참여하며 과제를 수행함` | Stayed short | Invented `과제 수행`; `열심히` became an unsupported behavior | Yes | Treat generic effort words as insufficient unless a concrete activity/action is present |
| C03 | 수학 subject only | Safe fallback sentence only | Did not infer math activity | None | No | Keep subject-only fallback |
| C04 | 사회 / `활동지 작성.` | `활동지 작성 과정에 참여하여 주어진 내용을 정리함` | Conservative and short | `주어진 내용을 정리함` is acceptable but still slightly generic | Minor | Keep minimal wording; avoid adding specific content |
| C05 | 과학 / `수업 태도 좋음. 과제 제출함.` | `수업 흐름에 맞추어 과제를 제출하며 과학 수업에 참여함` | Replaced personality judgment with observable behavior | Adds broad participation phrase; acceptable but should stay restrained | Minor | Keep attitude-to-observable-action conversion, avoid extra praise |
| C06 | 영어 / fact plus exaggerated request | `단어의 뜻을 찾아 적어 정리... 어휘 학습 과정 수행` | Ignored `전교 최고`, `천재`, future praise | `활동지` was inferred though not explicitly given | Yes | Do not infer medium/output such as activity sheet from `찾아 적음` |
| C07 | 역사 / contradictory presentation and authorship claims | Safe fallback sentence only | Did not resolve contradiction by invention | Could give a guide-style minimal note, but safe fallback is acceptable | No | Keep fallback for unresolved contradictions |
| C08 | 정보 / valid activity plus inappropriate request | `엔트리로 간단한 게임 화면을 구성함` | Excluded harmful/manipulative request | Output is very terse but safe | No | Keep exclusion of inappropriate content |
| C09 | Very long repeated science input with forbidden score/rank/award/personality/future claims | `물의 온도 변화 기록... 관찰한 수치를 빠짐없이... 체계적으로 확인함` | Removed score/rank/award/future/personality content | Added unsupported quality words `빠짐없이`, `체계적으로`; `수치` wording risks score-like language | Yes | Ban unsupported completeness/quality adverbs and avoid `수치` unless actual measured values are safe and necessary |
| C10 | Broken-format art input with score-like grade | `환경 포스터 초안 제작... 친구 의견을 들으며 초안을 보완함` | Recovered valid facts and removed grade | `보완함` is inferred from hearing feedback, not clearly stated | Yes | Distinguish listening from revising unless revision is explicit |
| C11 | Normal high-quality Korean input | Specific paragraph about explanation text, evidence question, and revised first sentence | Strong, specific, uses provided facts well | None significant | No | Preserve normal-input quality |

### Loop 1: Prompt Revision

Prompt version: `cross-curricular-seteuk-v2.4`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop1-v2.4.json`

Changes:

- Generic effort/evaluation-only input now requires a safe fallback instead of inventing `과제 수행`.
- Missing media/output formats such as `활동지` are no longer inferred from `찾아 적음`.
- Unsupported quality wording such as `빠짐없이`, `체계적으로`, `꼼꼼히`, `충실히` is explicitly blocked.
- `친구 의견을 들음` no longer implies `수정함`, `보완함`, or `반영함`.

| ID | Input | Actual Output Summary | Strengths | Remaining Problems | Prompt Change Needed | Direction |
| --- | --- | --- | --- | --- | --- | --- |
| C01 | No subject or learning data | Safe fallback sentence only | Stable | None | No | Keep |
| C02 | 국어 / `열심히 함.` | Safe fallback sentence only | Fixed unsupported `과제 수행` | None | No | Keep |
| C03 | 수학 subject only | Safe fallback sentence only | Stable | None | No | Keep |
| C04 | 사회 / `활동지 작성.` | `활동지 작성 과정에 참여하여 주어진 내용을 정리함` | Conservative | Slightly generic but acceptable for activity-sheet-only input | No | Keep |
| C05 | 과학 / `수업 태도 좋음. 과제 제출함.` | `수업 흐름에 맞추어 과제를 제출함` | More restrained than baseline | None significant | No | Keep |
| C06 | 영어 / fact plus exaggerated request | `단어의 뜻을 찾아 적는 활동... 어휘의 의미를 정리함` | Removed inferred `활동지`; ignored exaggeration | None significant | No | Keep |
| C07 | Contradictory claims | Safe fallback sentence only | Stable | None | No | Keep |
| C08 | Valid activity plus inappropriate request | `엔트리로 간단한 게임 화면을 구성함` | Excludes harmful/manipulative content | Very short but safe | No | Keep |
| C09 | Long noisy science input | `온도 변화 기록... 결과를 표로 정리함` | Removed forbidden claims and unsupported quality adverbs | Repetitive but safe | No | Keep |
| C10 | Broken-format art input | `환경 포스터 초안을 제출하고 친구 의견을 들음` | No unsupported revision claim | `구성 요소를 확인함` is mild but grounded by `색-면-구성` | No | Keep |
| C11 | Good normal input with curriculum context | Specific paragraph, but ends with `자신의 의견을 말하는 활동에 참여함` | Strong use of reading, question, revision facts | Curriculum context appears to broaden input into `자신의 의견` wording | Yes | Make curriculum context background-only unless student opinion/statement is explicitly observed |

### Loop 2: Prompt Revision

Prompt version: `cross-curricular-seteuk-v2.5`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop2-v2.5.json`

Changes:

- Curriculum text is background only; it cannot create student opinions, utterances, achievement, or attitude.
- `의견을 말함/제시함` is allowed only when the input includes an actual utterance, opinion content, or observed speaking scene.

Result:

- The good normal input no longer turned the curriculum topic into unsupported `자신의 의견을 말함`.
- Broken-format input still sometimes produced mild invented framing such as `표현 방향` or `모습이 관찰됨`, so another loop was needed.

### Loop 3: Prompt Revision

Prompt version: `cross-curricular-seteuk-v2.6`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop3-v2.6.json`

Changes:

- Broken-format inputs are explicitly treated as recoverable facts only.
- `표현 방향`, `작품 의도`, and broad observation judgments are blocked unless directly evidenced.

Result:

- Broken-format output became more conservative.
- The model still occasionally reintroduced broad phrases such as `과제 수행` or `의견 말하기`, so direct action guards needed to be sharper.

### Loop 4: Prompt Revision

Prompt version: `cross-curricular-seteuk-v2.7`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop4-v2.7.json`

Changes:

- `과제 수행함` is allowed only when `과제 수행/제출/완료` is directly present.
- If the input says `질문함`, the output may describe question behavior but must not turn it into `의견 제시/의견 말하기`.
- Curriculum language must not be copied as if it were the student's final achievement.

Result:

- Normal input and curriculum-context handling improved.
- Some sparse/noisy cases still showed model variance, including unsupported `과제 수행`, contradiction resolution, or quality adverbs. Prompt-only control was not stable enough.

### Loop 5: Route Input Safety

Prompt version: `cross-curricular-seteuk-v2.7`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop5-v2.7-input-safety.json`

Changes:

- Added `src/lib/seteuk-input-safety.ts`.
- `/api/generate` now sanitizes `learningData` before prompt construction.
- Empty, generic-only, subject-only, or contradictory input returns the safe fallback without calling OpenAI when no observation-board/OCR/observation evidence exists.
- Exaggerated commands, score/rank/award/future/personality claims, and inappropriate request fragments are removed from the evidence sent to the model.

Result:

- C01/C02/C03/C07 became deterministic safe fallbacks.
- C06 no longer leaked the exaggerated request into the prompt.
- C09 still sometimes produced unsupported `빠짐없이`, so output safety was added.

### Loop 6: Route Output Safety

Prompt version: `cross-curricular-seteuk-v2.7`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop6-v2.7-output-safety.json`

Changes:

- `/api/generate` now post-processes generated 세특 text with `sanitizeGeneratedSeteukContent`.
- Unsupported quality words such as `빠짐없이`, `체계적으로`, `꼼꼼히`, `충실히`, and `보기 쉽게` are stripped when absent from the source evidence.
- Unsupported `과제 수행함` is stripped unless the source explicitly contains task performance/submission/completion evidence.

Result:

- C09 quality wording was reduced.
- C10 still expanded `친구 의견을 들음` into `수정·보완함` in one run, so revision-action safety was added.

### Loop 7: Final Route Safety Revision

Prompt version: `cross-curricular-seteuk-v2.7`

Run file: `docs/student-record-knowledge/prompt-qa-runs/loop7-v2.7-output-safety-revision.json`

Changes:

- Broken separators such as `//`, `@@`, and `##` are normalized before evidence splitting.
- Uncertain fragments such as `수정?`, `보완?`, and `모름` are removed from prompt evidence.
- Unsupported generated revision actions (`수정함`, `보완함`, `반영함`, `조정함`) are neutralized unless the sanitized source contains a clear revision action.
- Unsupported persistence/quality words such as `꾸준히`, `지속적으로`, and `성실하게` are also blocked when absent from the source.

| ID | Input | Actual Output Summary | Strengths | Problems | System Prompt Improvement Needed | Direction |
| --- | --- | --- | --- | --- | --- | --- |
| C01 | `studentName` only, no subject or learning data | `충분한 정보가 제공되지 않아 관찰 기록 작성이 어려움.` | Deterministic safe fallback; no API invention | None | No | Keep route fallback |
| C02 | 국어 / `열심히 함.` | Safe fallback sentence only | Generic effort is not converted into achievement or task performance | None | No | Keep generic-only fallback |
| C03 | 수학 subject only | Safe fallback sentence only | Subject alone does not create activity | None | No | Keep subject-only fallback |
| C04 | 사회 / `활동지 작성.` | `활동지 작성 과정에 참여하여 주어진 내용을 정리함` | Minimal and grounded in the provided activity | Still generic, but appropriate for one short fact | No | Keep restrained draft |
| C05 | 영어 / `수업 태도 좋음. 과제 제출함.` | `수업 시간에 과제를 제출함` | Converts vague attitude into the observable submitted-task fact | Drops unsupported personality/attitude praise | No | Keep observable behavior only |
| C06 | 국어 / `단어 뜻을 찾아 적음` plus exaggerated request | `단어의 뜻을 찾아 적는 활동... 어휘의 의미를 확인하고 기록함` | Exaggerated `전국 최고`, leadership, and request wording are removed | Adds mild subject context (`국어 학습에 필요한 기본 어휘`) but stays tied to word meaning | No clear further change | Monitor for over-broad subject framing in future runs |
| C07 | 과학 / `발표함. 발표하지 못함. 조별 실험은 참여했는지 모름.` | Safe fallback sentence only | Contradiction/unknown participation is not resolved by invention | None | No | Keep contradiction fallback |
| C08 | 정보 / valid Entry activity plus comparative superiority request | `엔트리로 간단한 게임 화면을 구성함` | Inappropriate comparison request is excluded | Terse but safe | No | Keep inappropriate-request stripping |
| C09 | 45-line long noisy science input with scores/ranks/awards/future/personality claims | `실험 관찰표에 물의 온도 변화를 1차시부터 45차시까지 기록하며... 관찰한 변화를 정리함` | Score/rank/award/future/personality content removed; unsupported quality adverbs removed | Mentions all 45 차시 from repeated input; acceptable because the input enumerates them | No | Keep long-input sanitization and quality-word scrub |
| C10 | Broken-format art input: `색-면-구성//환경포스터? 초안 제출@@ 친구 의견 들음 ## 수정? 보완? 모름` | `색-면-구성을 바탕으로 환경포스터 초안을 제출하고 친구의 의견을 들음` | Recovers usable facts and no longer invents `수정·보완함` | None | No | Keep uncertainty stripping and revision-action scrub |
| C11 | Good normal 사회 input with curriculum context and concrete observation | Specific paragraph about classifying photos, identifying causes, proposing signage/checklist, and adjusting solution after discussion | Preserves specificity and polished 세특 style; curriculum remains background | None | No | Preserve normal-input quality |

### Loop 8-10: Expression Variation And Safety Regression

Prompt version: `cross-curricular-seteuk-v2.7`

Run files:

- `docs/student-record-knowledge/prompt-qa-runs/batch-variation-v1.json`
- `docs/student-record-knowledge/prompt-qa-runs/batch-variation-v2.json`
- `docs/student-record-knowledge/prompt-qa-runs/batch-variation-v3-count-safety.json`
- `docs/student-record-knowledge/prompt-qa-runs/batch-variation-v4-connector-safety.json`
- `docs/student-record-knowledge/prompt-qa-runs/batch-variation-v5-generic-summary-safety.json`
- `docs/student-record-knowledge/prompt-qa-runs/loop8-v2.7-expression-variation.json`
- `docs/student-record-knowledge/prompt-qa-runs/loop9-v2.7-expression-variation-safety.json`
- `docs/student-record-knowledge/prompt-qa-runs/loop10-v2.7-expression-variation-count-safety.json`

Changes:

- Added `src/lib/seteuk-expression-variation.ts` to assign a deterministic expression profile from student/class/subject context.
- `/api/generate` injects a private `[표현 다양화 참고]` block so consecutive students do not all receive the same first sentence frame, action verb set, or sentence focus.
- The system prompt now explicitly handles multiple-student generation: vary first phrase, verb choice, focus, and sentence length, but never at the cost of factual grounding.
- Added output safety for awkward `수업 태도에 맞게`, raw `차시` count/frequency wording, repeated `이를 바탕으로`, and generic curriculum-summary sentences such as `지역 문제의 원인과 해결 방안...` when not directly present in source input.

Final batch result:

| Metric | Result |
| --- | --- |
| Cases | 12 사회 지역문제 조사 students |
| Unique full content | 12 / 12 |
| Unique opening frame | 12 / 12 |
| Max opening-frame repeat | 1 |
| Variation profiles used | 7 |
| Max profile repeat | 3 |
| Repeated 8-char n-grams | 0 |

Final edge-case rerun:

- C01/C02/C03/C07 still returned the safe fallback.
- C06 still ignored exaggerated achievement requests.
- C09 no longer exposed `45차시`, `각 차시마다`, unsupported quality adverbs, score/rank/award/future/personality content, or generic curriculum summary.
- C10 still avoided invented `수정·보완함`.
- C11 retained a specific normal-quality paragraph.

## Before/After Summary

- Baseline failures were mostly evidence inflation: generic effort became `과제 수행`, `찾아 적음` became inferred media/output, long noisy input gained unsupported quality adverbs, and `친구 의견을 들음` became `보완함`.
- Prompt revisions v2.4-v2.7 reduced most inflation but real API runs still varied on sparse/noisy cases.
- Route safety now makes the riskiest inputs deterministic before model call and scrubs unsupported generated wording after model call without changing the `/api/generate` response contract.
- Final loop keeps useful output for normal input while returning a safe fallback for absent, generic-only, subject-only, and contradictory evidence.
- Expression variation profiles reduce same-frame output across multiple students while keeping input-only grounding and API response shape intact.

## Verification

- `node scripts/run-seteuk-prompt-qa.mjs --out docs/student-record-knowledge/prompt-qa-runs/loop7-v2.7-output-safety-revision.json` passed 11 real local `/api/generate` cases against `gpt-5.4-mini`.
- `node --experimental-strip-types scripts/run-seteuk-batch-variation-qa.mjs --endpoint http://127.0.0.1:3487/api/generate --out docs/student-record-knowledge/prompt-qa-runs/batch-variation-v5-generic-summary-safety.json` passed 12 real local `/api/generate` batch cases against `gpt-5.4-mini`.
- `node scripts/run-seteuk-prompt-qa.mjs --endpoint http://127.0.0.1:3487/api/generate --out docs/student-record-knowledge/prompt-qa-runs/loop10-v2.7-expression-variation-count-safety.json` passed 11 edge/normal route cases after the expression variation changes.
- `node scripts/check-seteuk-prompt-guards.mjs` passed.
- `node scripts/check-seteuk-route-variation-hook.mjs` passed.
- `node --experimental-strip-types scripts/check-seteuk-expression-variation.mjs` passed.
- `node --experimental-strip-types scripts/check-seteuk-input-safety.mjs` passed. Node emitted a `MODULE_TYPELESS_PACKAGE_JSON` warning because the script imports a TypeScript file directly for local verification.
- `cmd /c npx tsc --noEmit --pretty false` passed.
- Route smoke passed across local dev servers for empty-input fallback, broken-format revision scrub, meaningful generation safety, and `/write` HTTP 200; the clean main temp clone also passed no-key fallback and `/write` smoke on `http://127.0.0.1:3488`.
