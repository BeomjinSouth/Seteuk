# Cross-Curricular Seteuk Prompt Design

## Goal

Improve the default 세특 generation prompt so it handles any subject more consistently when evidence is sparse, uneven, or strong enough to justify a longer comment.

## Design

The prompt keeps its existing teacher-review draft posture, safety restrictions, and source-grounding rules. A new cross-curricular quality calibration block is added after the length-control section so the model decides comment density from evidence quality before composing sentences.

The new block covers six general rules:

- Adjust density to the amount of observed evidence.
- Allow longer output only when multiple concrete learning behaviors are present.
- Rewrite low-level administrative phrases such as activity-sheet copying into observable learning behaviors.
- Avoid inventing subject-specific concepts not present in the input.
- Differentiate lower-performing but diligent students from strong students without labeling ability.
- Run a final silent self-check for fabrication, exaggeration, repetition, and blank-student handling.

## Documentation And Verification

The prompt version is bumped from `cross-curricular-seteuk-v2.8` to `cross-curricular-seteuk-v2.9`. Product and implementation docs are updated so `/write`, `/settings/ai`, and the status snapshot describe the same default prompt. Verification uses TypeScript compilation because the change is in a shared TypeScript prompt module.

