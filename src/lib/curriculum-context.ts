import defaultCurriculumContext from '@/data/curriculum-context/default-middle-school-units.json';

export type CurriculumSemester = 1 | 2;

export interface CurriculumUnitContext {
    id: string;
    grade: number;
    semester: CurriculumSemester;
    subject: string;
    unit: string;
    concepts: string[];
    subUnits?: string[];
    learningFocus?: string;
    activities?: string[];
    achievementStandards?: string[];
    updatedAt?: string;
}

export interface CurriculumUnitOverride extends CurriculumUnitContext {
    isTeacherOverride?: true;
}

export interface ClassCurriculumSelection {
    id: string;
    classId: string;
    semester: CurriculumSemester;
    unitIds: string[];
    updatedAt: string;
}

export interface CurriculumContextFile {
    version: string;
    units: Array<Partial<CurriculumUnitContext> & {
        grade: number;
        semester: number;
        subject: string;
        unit: string;
        concepts: string[];
    }>;
}

export interface CurriculumGenerationUnit {
    id: string;
    unit: string;
    concepts: string[];
    subUnits?: string[];
    learningFocus?: string;
    activities?: string[];
    achievementStandards?: string[];
}

export interface CurriculumGenerationContext {
    grade: number;
    semester: CurriculumSemester;
    subjectName: string;
    selectedUnits: CurriculumGenerationUnit[];
}

export interface CurriculumValidationResult {
    version?: string;
    units: CurriculumUnitContext[];
    errors: string[];
}

const SUBJECT_ALIASES: Record<string, string> = {
    '기가': '기술가정',
    '기술가정': '기술가정',
    '기술가정과': '기술가정',
    '기술가정교과': '기술가정',
    '도덕과': '도덕',
    '국어과': '국어',
    '수학과': '수학',
    '사회과': '사회',
    '역사과': '역사',
    '과학과': '과학',
    '영어과': '영어',
    '정보과': '정보',
    '체육과': '체육',
    '음악과': '음악',
    '미술과': '미술',
};

const OPTIONAL_ARRAY_FIELDS = [
    'subUnits',
    'activities',
    'achievementStandards',
] as const;

export const DEFAULT_CURRICULUM_CONTEXT_VERSION =
    (defaultCurriculumContext as CurriculumContextFile).version;

const defaultValidation = validateCurriculumContextFile(defaultCurriculumContext);

if (defaultValidation.errors.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('Default curriculum context validation errors:', defaultValidation.errors);
}

export const DEFAULT_CURRICULUM_UNITS = defaultValidation.units;

export function normalizeSubjectKey(subject?: string): string {
    const compact = (subject || '')
        .trim()
        .toLowerCase()
        .replace(/[\s·ㆍ./\\\-_()[\]{}:;'"`~!@#$%^&*+=|?,<>]+/g, '');

    return SUBJECT_ALIASES[compact] || compact;
}

export function buildClassCurriculumSelectionId(classId: string, semester: CurriculumSemester): string {
    return `class-curriculum-${classId}-${semester}`;
}

export function buildCurriculumUnitId(input: {
    grade: number;
    semester: CurriculumSemester;
    subject: string;
    unit: string;
    concepts?: string[];
}): string {
    const hash = hashText([
        input.grade,
        input.semester,
        normalizeSubjectKey(input.subject),
        input.unit.trim(),
        ...(input.concepts || []),
    ].join('|'));

    return `curr-${input.grade}-${input.semester}-${hash}`;
}

export function validateCurriculumContextFile(raw: unknown): CurriculumValidationResult {
    const errors: string[] = [];

    if (!isPlainObject(raw)) {
        return { units: [], errors: ['JSON 최상위 값은 객체여야 합니다.'] };
    }

    const version = typeof raw.version === 'string' ? raw.version.trim() : undefined;
    const rawUnits = Array.isArray(raw.units) ? raw.units : null;

    if (!version) {
        errors.push('version 필드가 필요합니다.');
    }
    if (!rawUnits) {
        errors.push('units 배열이 필요합니다.');
        return { version, units: [], errors };
    }

    const seenIds = new Set<string>();
    const units: CurriculumUnitContext[] = [];

    rawUnits.forEach((item, index) => {
        if (!isPlainObject(item)) {
            errors.push(`units[${index}]은 객체여야 합니다.`);
            return;
        }

        const grade = normalizeGrade(item.grade);
        const semester = normalizeSemester(item.semester);
        const subject = normalizeRequiredString(item.subject);
        const unitName = normalizeRequiredString(item.unit);
        const concepts = normalizeStringArray(item.concepts);

        if (!grade) errors.push(`units[${index}].grade는 1, 2, 3 중 하나여야 합니다.`);
        if (!semester) errors.push(`units[${index}].semester는 1 또는 2여야 합니다.`);
        if (!subject) errors.push(`units[${index}].subject가 필요합니다.`);
        if (!unitName) errors.push(`units[${index}].unit이 필요합니다.`);
        if (concepts.length === 0) errors.push(`units[${index}].concepts는 비어 있을 수 없습니다.`);

        if (!grade || !semester || !subject || !unitName || concepts.length === 0) {
            return;
        }

        const id = normalizeRequiredString(item.id) || buildCurriculumUnitId({
            grade,
            semester,
            subject,
            unit: unitName,
            concepts,
        });

        if (seenIds.has(id)) {
            errors.push(`중복 단원 id가 있습니다: ${id}`);
            return;
        }
        seenIds.add(id);

        const sanitized: CurriculumUnitContext = {
            id,
            grade,
            semester,
            subject,
            unit: unitName,
            concepts,
        };

        OPTIONAL_ARRAY_FIELDS.forEach((field) => {
            const values = normalizeStringArray(item[field]);
            if (values.length > 0) {
                sanitized[field] = values;
            }
        });

        const learningFocus = normalizeOptionalString(item.learningFocus);
        if (learningFocus) {
            sanitized.learningFocus = learningFocus;
        }

        const updatedAt = normalizeOptionalString(item.updatedAt);
        if (updatedAt) {
            sanitized.updatedAt = updatedAt;
        }

        units.push(sanitized);
    });

    return { version, units, errors };
}

export function parseCurriculumContextJson(text: string): CurriculumValidationResult {
    try {
        return validateCurriculumContextFile(JSON.parse(text));
    } catch (error) {
        return {
            units: [],
            errors: [`JSON 파싱에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`],
        };
    }
}

export function mergeCurriculumUnits(
    defaultUnits: CurriculumUnitContext[],
    overrides: CurriculumUnitContext[] = []
): CurriculumUnitContext[] {
    const merged = new Map<string, CurriculumUnitContext>();
    const order: string[] = [];

    const add = (unit: CurriculumUnitContext) => {
        if (!unit.id) return;
        if (!merged.has(unit.id)) {
            order.push(unit.id);
        }
        merged.set(unit.id, unit);
    };

    defaultUnits.forEach(add);
    overrides.forEach((override) => {
        if (!override?.id) return;
        const current = merged.get(override.id);
        if (!current) {
            add(override);
            return;
        }
        merged.set(override.id, {
            ...current,
            ...override,
            concepts: override.concepts?.length ? override.concepts : current.concepts,
        });
    });

    return order
        .map((id) => merged.get(id))
        .filter((unit): unit is CurriculumUnitContext => !!unit);
}

export function getCurriculumUnitsForSubject({
    units,
    grade,
    semester,
    subjectName,
}: {
    units: CurriculumUnitContext[];
    grade: number;
    semester: CurriculumSemester;
    subjectName: string;
}): CurriculumUnitContext[] {
    const subjectKey = normalizeSubjectKey(subjectName);
    if (!subjectKey) return [];

    return units.filter((unit) =>
        unit.grade === grade
        && unit.semester === semester
        && normalizeSubjectKey(unit.subject) === subjectKey
    );
}

export function buildCurriculumGenerationContext({
    units,
    grade,
    semester,
    subjectName,
    selectedUnitIds,
}: {
    units: CurriculumUnitContext[];
    grade: number;
    semester: CurriculumSemester;
    subjectName: string;
    selectedUnitIds: string[];
}): CurriculumGenerationContext | undefined {
    const candidates = getCurriculumUnitsForSubject({ units, grade, semester, subjectName });
    const byId = new Map(candidates.map((unit) => [unit.id, unit]));
    const selectedUnits = selectedUnitIds
        .map((id) => byId.get(id))
        .filter((unit): unit is CurriculumUnitContext => !!unit)
        .map(toGenerationUnit);

    if (selectedUnits.length === 0) return undefined;

    return {
        grade,
        semester,
        subjectName,
        selectedUnits,
    };
}

export function formatCurriculumContextForPrompt(context?: CurriculumGenerationContext): string {
    if (!context?.selectedUnits?.length) return '';

    const lines = context.selectedUnits.slice(0, 8).map((unit, index) => {
        const parts = [
            `${index + 1}. ${unit.unit}`,
            `개념: ${unit.concepts.slice(0, 10).join(', ')}`,
        ];
        if (unit.subUnits?.length) {
            parts.push(`세부 내용: ${unit.subUnits.slice(0, 6).join(', ')}`);
        }
        if (unit.learningFocus) {
            parts.push(`학습 초점: ${unit.learningFocus}`);
        }
        if (unit.activities?.length) {
            parts.push(`가능 활동: ${unit.activities.slice(0, 5).join(', ')}`);
        }
        if (unit.achievementStandards?.length) {
            parts.push(`성취기준: ${unit.achievementStandards.slice(0, 4).join(' / ')}`);
        }
        return parts.join(' | ');
    });

    return [
        `대상: 중학교 ${context.grade}학년 ${context.semester}학기 ${context.subjectName}`,
        ...lines,
    ].join('\n');
}

export function summarizeCurriculumUnit(unit: CurriculumUnitContext): string {
    const conceptText = unit.concepts.slice(0, 4).join(', ');
    return unit.learningFocus ? `${unit.unit} - ${unit.learningFocus}` : `${unit.unit} - ${conceptText}`;
}

function toGenerationUnit(unit: CurriculumUnitContext): CurriculumGenerationUnit {
    return {
        id: unit.id,
        unit: unit.unit,
        concepts: unit.concepts,
        subUnits: unit.subUnits,
        learningFocus: unit.learningFocus,
        activities: unit.activities,
        achievementStandards: unit.achievementStandards,
    };
}

function normalizeGrade(value: unknown): number | undefined {
    const grade = typeof value === 'number' ? Math.floor(value) : Number(value);
    return grade === 1 || grade === 2 || grade === 3 ? grade : undefined;
}

function normalizeSemester(value: unknown): CurriculumSemester | undefined {
    return value === 1 || value === 2 || value === '1' || value === '2'
        ? Number(value) as CurriculumSemester
        : undefined;
}

function normalizeRequiredString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeOptionalString(value: unknown): string | undefined {
    const text = normalizeRequiredString(value);
    return text || undefined;
}

function normalizeStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(
        value
            .filter((item): item is string => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
    ));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function hashText(value: string): string {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
}
