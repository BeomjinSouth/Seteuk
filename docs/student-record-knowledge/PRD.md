# Student Record Knowledge PRD

## Goal

Turn the STAR FAQ and public Q&A data into a usable knowledge layer for:

1. A counsel chatbot that answers student-record questions with citations
2. A record-review tool that checks draft wording against public guidance

## Product Rules

- Never use private posts as answer evidence
- Prefer the latest public answer when the same question has conflicting answers
- Treat FAQ as policy-shaped guidance and public Q&A as case-shaped support

## User Types

- homeroom teachers
- subject teachers
- record-review staff

## Scope

### Counsel chatbot

- lives inside the shared `학생부 상담·점검` workspace entry
- school-level filter
- category filter
- year filter
- citation-backed answer
- visible raw search results

### Record review

- lives inside the same `학생부 상담·점검` workspace as a mode switch
- issue extraction
- evidence cards
- rewrite guidance
- one-click improve action from `/write`
- visible raw search results

### Operations

- metadata endpoint
- raw search endpoint
- search evaluation endpoint

## Current State

- `/api/counsel-chat`: implemented
- `/api/record-review`: implemented
- `/api/search`: implemented
- `/api/search-eval`: implemented
- `/counsel-chat`: implemented as the combined counsel/review workspace
- `/record-review`: implemented as a compatibility redirect to `/counsel-chat?mode=review`
- `/write`: RAG review-improve action implemented
- `/search-inspector`: retained as an internal diagnostics page and removed from the sidebar
- top navigation order: `학교 정보` -> `학생 관찰 기록` -> `AI 세특 생성` -> `평가 점검` -> `학습지 OCR`
- student management scope: roster upload + teaching-class connection only
- student board location: `/observation-board`
- observation board interaction: single click selects, double click opens observation writing, and same-class multi-selection supports batch entry
- manual observation entry uses per-student rows with roster/date fields plus lesson topic, selected tag, and free memo
