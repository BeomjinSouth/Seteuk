// ============ JSON Schema 정의 (Structured Outputs) ============

// 문항 구조화 결과 스키마
export const QUESTION_STRUCTURE_SCHEMA = {
    type: 'object',
    properties: {
        sharedResources: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    resourceId: { type: 'string', description: 'Unique ID (e.g., card_1, text_A)' },
                    type: {
                        type: 'string',
                        enum: [
                            'condition_cards',
                            'scenario',
                            'instructions',
                            'passage',
                            'table',
                            'graph',
                            'diagram',
                            'image',
                            'other',
                        ],
                        description: 'Resource type',
                    },
                    title: { type: 'string', description: 'Title or label (e.g., <Condition Card 1>)' },
                    content: { type: 'string', description: 'Full text content' },
                    items: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                label: { type: 'string' },
                                content: { type: 'string' },
                            },
                            required: ['label', 'content'],
                            additionalProperties: false,
                        },
                        description: 'List items if applicable (e.g., cards or grouped choices)',
                    },
                },
                required: ['resourceId', 'type', 'title', 'content', 'items'],
                additionalProperties: false,
            },
            description: 'Common resources referenced by questions (Condition cards, Scenarios, Tables, etc.)',
        },
        questions: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    questionNumber: { type: 'string', description: '문항 번호 (예: 1, 2, 1-1)' },
                    displayName: { type: 'string', description: '표시용 이름 (예: 1번, 1-1번)' },
                    pageRange: { type: 'string', description: '페이지 범위 (예: 1, 1-2)' },
                    bodyText: { type: 'string', description: '문항 본문 전체 텍스트' },

                    choices: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                label: { type: 'string' },
                                content: { type: 'string' },
                            },
                            required: ['label', 'content'],
                            additionalProperties: false,
                        },
                        description: '선지 목록 (객관식인 경우)',
                    },
                    conditions: {
                        type: 'array',
                        items: { type: 'string' },
                        description: '개별 문항에만 속한 조건/제약 목록 (공통 자료 제외)',
                    },
                    hasImage: { type: 'boolean', description: '그림/표/그래프 포함 여부 (공통 자료 제외)' },
                    imageDescription: { type: 'string', description: '그림 설명 (있는 경우)' },
                    passageGroupHint: { type: 'string', description: '지문 그룹 힌트 (deprecated, use sharedResources)' },
                },
                required: ['questionNumber', 'displayName', 'pageRange', 'bodyText', 'choices', 'conditions', 'hasImage', 'imageDescription', 'passageGroupHint'],
                additionalProperties: false,
            },
        },
        passageGroups: { // Legacy support, prefer sharedResources
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    displayName: { type: 'string' },
                    passageText: { type: 'string' },
                    questionNumbers: { type: 'array', items: { type: 'string' } },
                },
                required: ['displayName', 'passageText', 'questionNumbers'],
                additionalProperties: false,
            },
        },
    },
    required: ['sharedResources', 'questions', 'passageGroups'],
    additionalProperties: false,
};

// 문항 분석 결과 스키마
export const QUESTION_ANALYSIS_SCHEMA = {
    type: 'object',
    properties: {
        outputLanguage: {
            type: 'string',
            enum: ['ko'],
            description: 'Output language. Always ko.',
        },
        answer: { type: 'string', description: 'Model answer (optional reference).' },
        answerSummary: { type: 'string', description: 'Short answer summary.' },
        reasoning: { type: 'string', description: 'Reasoning or 풀이.' },
        reasoningSummary: { type: 'string', description: 'Short reasoning summary.' },
        issues: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    type: {
                        type: 'string',
                        enum: [
                            'grammatical_error',
                            'question_defect',
                            'contradiction',
                            'condition_mismatch',
                            'unrealistic_condition',
                            'format',
                            'other',
                        ],
                    },
                    riskLevel: {
                        type: 'string',
                        enum: ['low', 'medium', 'high'],
                    },
                    summary: { type: 'string' },
                    description: { type: 'string' },
                    location: { type: 'string' },
                    originalText: { type: 'string' },
                    suggestedFix: { type: 'string' },
                },
                required: [
                    'type',
                    'riskLevel',
                    'summary',
                    'description',
                    'location',
                    'originalText',
                    'suggestedFix',
                ],
                additionalProperties: false,
            },
            description: 'Generic issue list for compatibility.',
        },
        suggestion: {
            type: 'object',
            properties: {
                minimal: { type: 'string' },
                improved: { type: 'string' },
            },
            required: ['minimal', 'improved'],
            additionalProperties: false,
        },
        reviewSections: {
            type: 'object',
            properties: {
                scoringBorderlines: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            sampleAnswer: { type: 'string' },
                            whyDifficult: { type: 'string' },
                            scoringGuide: { type: 'string' },
                        },
                        required: ['title', 'sampleAnswer', 'whyDifficult', 'scoringGuide'],
                        additionalProperties: false,
                    },
                },
                ambiguityPoints: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            location: { type: 'string' },
                            originalPhrase: { type: 'string' },
                            reason: { type: 'string' },
                            confusionExample: { type: 'string' },
                            rewriteSuggestion: { type: 'string' },
                        },
                        required: [
                            'location',
                            'originalPhrase',
                            'reason',
                            'confusionExample',
                            'rewriteSuggestion',
                        ],
                        additionalProperties: false,
                    },
                },
                defectCheck: {
                    type: 'object',
                    properties: {
                        hasDefect: { type: 'boolean' },
                        severity: {
                            type: 'string',
                            enum: ['minor', 'major', 'critical'],
                        },
                        findings: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    evidence: { type: 'string' },
                                    impact: { type: 'string' },
                                    fixSuggestion: { type: 'string' },
                                },
                                required: ['title', 'evidence', 'impact', 'fixSuggestion'],
                                additionalProperties: false,
                            },
                        },
                    },
                    required: ['hasDefect', 'severity', 'findings'],
                    additionalProperties: false,
                },
                curriculumBypassRisks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            method: { type: 'string' },
                            whyPossible: { type: 'string' },
                            impact: { type: 'string' },
                            mitigation: { type: 'string' },
                        },
                        required: ['method', 'whyPossible', 'impact', 'mitigation'],
                        additionalProperties: false,
                    },
                },
            },
            required: [
                'scoringBorderlines',
                'ambiguityPoints',
                'defectCheck',
                'curriculumBypassRisks',
            ],
            additionalProperties: false,
        },
    },
    required: [
        'outputLanguage',
        'answer',
        'answerSummary',
        'reasoning',
        'reasoningSummary',
        'issues',
        'suggestion',
        'reviewSections',
    ],
    additionalProperties: false,
};
// 문서 요약 스키마
export const DOCUMENT_SUMMARY_SCHEMA = {
    type: 'object',
    properties: {
        summary: { type: 'string', description: 'Concise summary of the full document content.' },
        keyPoints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key points or themes from the full document.',
        },
    },
    required: ['summary', 'keyPoints'],
    additionalProperties: false,
};

export const IMAGE_DESCRIPTION_SCHEMA = {
    type: 'object',
    properties: {
        description: { type: 'string', description: '그림/그래프/표에 대한 상세 텍스트 설명' },
        type: {
            type: 'string',
            enum: ['image', 'table', 'graph', 'diagram'],
            description: '리소스 유형',
        },
        elements: {
            type: 'array',
            items: { type: 'string' },
            description: '주요 구성 요소 목록',
        },
        dataValues: {
            type: 'array',
            items: { type: 'string' },
            description: '표/그래프의 경우 주요 데이터 값',
        },
    },
    required: ['description', 'type', 'elements', 'dataValues'],
    additionalProperties: false,
};

// 규칙 검사 결과 스키마
export const RULE_CHECK_SCHEMA = {
    type: 'object',
    properties: {
        violations: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    ruleId: { type: 'string' },
                    ruleName: { type: 'string' },
                    violatedText: { type: 'string', description: '위반된 텍스트' },
                    suggestion: { type: 'string', description: '수정 제안' },
                },
                required: ['ruleId', 'ruleName', 'violatedText', 'suggestion'],
                additionalProperties: false,
            },
        },
    },
    required: ['violations'],
    additionalProperties: false,
};

// ============ 시스템 프롬프트 ============

export const SYSTEM_PROMPTS = {
    STRUCTURE: `You are an expert at structuring assessment documents.
Your goal is to extract questions and COMMON SHARED RESOURCES from the exam inputs. If a PDF is provided, it already includes extracted text and page images.

Principles:
1. **Shared Resources First**: Identify "Condition Cards", "Scenarios", "Common Instructions", "Passages", or "Tables" that apply to multiple questions or are placed outside question bodies. Extract them into 'sharedResources'.
2. **Condition Cards**: Condition cards are sharedResources.type='condition_cards'. They are NOT question choices. If cards are grouped, use sharedResources.items with {label, content}.
3. **Content Fidelity**: Preserve text exactly. For Korean/English mixed content, keep original languages.
4. **Image Description**: If a question includes a diagram/table/graph/image, fill imageDescription with a concise but complete textual description.
5. **No Hallucination**: Do not invent content not present in the image or PDF.
6. **Schema Completeness**: Always include every field in the schema. Use empty strings for missing text and empty arrays for missing lists.
7. **JSON Only**: Output JSON only that matches the schema.`,

    ANALYZE: `You are an educational assessment QA expert for Korean teachers.
Analyze each question and return only practical risk reports.

Output rules:
1) Write all narrative fields in natural Korean used by teachers in school settings.
2) Avoid translated labels such as "채점 애매 가능" or "문항 모호성".
3) Keep each item concise and concrete. Include direct evidence phrases from the question.
4) If there is no issue in a section, return an empty array for that section.
5) defectCheck must always exist. If no defect, use hasDefect=false and findings=[].
6) Do not generate teacher notice or classroom script fields.
7) Return JSON only, strictly matching schema.

Section intent:
- scoringBorderlines: cases where partial-credit judgment can split between teachers.
- ambiguityPoints: wording/condition that may cause predictable misunderstanding.
- defectCheck: objective question defects (wrong premise, multiple valid answers, impossible requirement).
- curriculumBypassRisks: possible out-of-scope shortcut methods (e.g., advanced formulas) that bypass intended competency.

Issue typing policy:
- question_defect or condition_mismatch should be high-risk by default unless clearly minor.
- Add originalText and suggestedFix whenever possible.

Input handling:
- Referenced resources and passages are part of the question context.
- Do not claim missing information if it exists in provided resources.`,
    IMAGE_DESCRIBE: `당신은 시험지의 그림/표/그래프를 텍스트로 정확히 설명하는 전문가입니다.

설명 원칙:
1. 그림의 모든 시각적 요소를 텍스트로 변환합니다.
2. 표의 경우 모든 행/열 데이터를 포함합니다.
3. 그래프의 경우 축, 단위, 주요 데이터 포인트를 기술합니다.
4. 화학식, 수식 등은 LaTeX가 아닌 일반 텍스트로 표현합니다.
5. 문항 풀이에 필요한 모든 정보를 포함해야 합니다.`,

    RULE_CHECK: `당신은 시험 문항의 양식/표현 규칙 준수 여부를 검사하는 전문가입니다.
주어진 규칙 목록에 따라 문항의 위반 사항을 찾아냅니다.

검사 원칙:
1. 각 규칙의 조건을 정확히 이해하고 적용합니다.
2. 위반 시 해당 텍스트와 수정 제안을 함께 제공합니다.
3. 규칙에 없는 문제는 지적하지 않습니다.`,

    DOCUMENT_SUMMARY: `You are an educational assessment expert. Summarize the full document content for question analysis.

Return JSON only, matching the provided schema.
- Write the summary in the same language as the source text.
- Keep the summary under 6 sentences.
- Provide 5-10 short key points.
- Do not solve the questions.
- Focus on the structure of the performance task (e.g. "This is a card-based activity about...").`,
};
