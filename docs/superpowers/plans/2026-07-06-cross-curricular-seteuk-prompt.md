# Cross-Curricular Seteuk Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cross-curricular quality calibration section to the default 세특 prompt and keep code/docs aligned.

**Architecture:** The default prompt remains a single exported shared constant in `src/lib/prompts/seteuk.ts`. The change adds rules inside the existing template literal, bumps the prompt version, and updates curated project docs that describe the default prompt behavior.

**Tech Stack:** Next.js, TypeScript, Markdown documentation.

---

### Task 1: Update Default Prompt

**Files:**
- Modify: `src/lib/prompts/seteuk.ts`

- [x] **Step 1: Bump prompt version**

Change `SETEUK_DEFAULT_SYSTEM_PROMPT_VERSION` from `cross-curricular-seteuk-v2.8` to `cross-curricular-seteuk-v2.9`.

- [x] **Step 2: Add cross-curricular quality calibration**

Insert a `[범교과 세특 품질 보정 원칙]` section immediately after `[분량 조절 원칙]`. The section must cover evidence-based density, strong-evidence longer comments, low-level phrase rewriting, no invented subject concepts, non-stigmatizing level differentiation, and silent final self-checks.

### Task 2: Update Project Documentation

**Files:**
- Modify: `docs/student-record-knowledge/PRD.md`
- Modify: `docs/student-record-knowledge/IMPLEMENTATION.md`
- Modify: `docs/student-record-knowledge/STATUS.md`

- [x] **Step 1: Update version references**

Replace current default prompt references in curated docs with `cross-curricular-seteuk-v2.9` where they describe the live default.

- [x] **Step 2: Document behavior change**

Add concise wording that the default prompt now calibrates density by evidence amount, avoids low-level artifact-processing phrasing, and keeps strong-student longer comments evidence-bound.

- [x] **Step 3: Refresh status**

Add a dated status entry for the prompt update and note verification results or any skipped smoke test reason.

### Task 3: Verify

**Files:**
- No code edits beyond Tasks 1 and 2.

- [x] **Step 1: Run TypeScript verification**

Run `npx tsc --noEmit`.

- [x] **Step 2: Check repository state**

Attempt to inspect git status. If this checkout is not a Git repository, record that commit/push cannot be completed from here.

