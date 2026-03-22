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

- school-level filter
- category filter
- year filter
- citation-backed answer
- visible raw search results

### Record review

- issue extraction
- evidence cards
- rewrite guidance
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
- `/counsel-chat`: implemented
- `/record-review`: implemented
- `/search-inspector`: implemented
