import { NextRequest, NextResponse } from 'next/server';
import {
    getEvalCheckRules,
    addEvalCheckRule,
    updateEvalCheckRule,
    deleteEvalCheckRule,
} from '@/lib/sheets/eval-check';
import { DEFAULT_RULES } from '@/types';
import { requireTeacherSession } from '@/lib/auth/guards';

/**
 * 평가 점검 규칙 API
 * 
 * GET: 모든 규칙 조회
 * POST: 새 규칙 추가
 * PUT: 규칙 수정
 * DELETE: 규칙 삭제
 */

// GET: 모든 규칙 조회
/**
 * Retrieves all defined evaluation rules.
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - rules: Array of Rule objects
 *   - isDefault: boolean (True if returning default built-in rules)
 */
export async function GET() {
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        const rules = await getEvalCheckRules();

        // 규칙이 없으면 기본 규칙 반환 (저장은 하지 않음)
        if (rules.length === 0) {
            return NextResponse.json({
                success: true,
                rules: DEFAULT_RULES.map((rule, idx) => ({
                    ...rule,
                    ruleId: `default-${idx}`,
                })),
                isDefault: true,
                message: '기본 규칙을 표시합니다. 저장하면 사용자 규칙으로 등록됩니다.',
            });
        }

        return NextResponse.json({
            success: true,
            rules,
            isDefault: false,
        });
    } catch (error) {
        console.error('규칙 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '규칙 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// POST: 새 규칙 추가
/**
 * Adds a new evaluation rule.
 * 
 * @description
 * Can add a single rule or initialize default rules if requested.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - name: string
 *   - condition: string
 *   - target?: string
 *   - enabled?: boolean
 *   - initializeDefaults?: boolean (If true, adds a set of default rules)
 *   - ...other rule fields
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - ruleId?: string
 *   - createdIds?: string[] (If initializing defaults)
 */
export async function POST(request: NextRequest) {
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        const body = await request.json();
        const { name, enabled, target, condition, correctionGuide, exampleWrong, exampleCorrect, initializeDefaults } = body as {
            name?: string;
            enabled?: boolean;
            target?: string;
            condition?: string;
            correctionGuide?: string;
            exampleWrong?: string;
            exampleCorrect?: string;
            initializeDefaults?: boolean;
        };

        // 기본 규칙 초기화 요청
        if (initializeDefaults) {
            const existingRules = await getEvalCheckRules();
            if (existingRules.length > 0) {
                return NextResponse.json({
                    success: false,
                    error: '이미 규칙이 존재합니다. 기본 규칙 초기화를 할 수 없습니다.',
                }, { status: 400 });
            }

            const createdIds: string[] = [];
            for (const rule of DEFAULT_RULES) {
                const id = await addEvalCheckRule({
                    name: rule.name,
                    enabled: rule.enabled,
                    target: rule.target,
                    condition: rule.condition,
                    correctionGuide: rule.correctionGuide,
                    exampleWrong: rule.exampleWrong || '',
                    exampleCorrect: rule.exampleCorrect || '',
                });
                createdIds.push(id);
            }

            return NextResponse.json({
                success: true,
                createdIds,
                message: `${createdIds.length}개의 기본 규칙이 추가되었습니다.`,
            });
        }

        // 일반 규칙 추가
        if (!name || !condition) {
            return NextResponse.json(
                {
                    success: false,
                    error: '규칙 이름과 조건은 필수입니다.',
                },
                { status: 400 }
            );
        }

        const ruleId = await addEvalCheckRule({
            name,
            enabled: enabled ?? true,
            target: target || 'all',
            condition,
            correctionGuide: correctionGuide || '',
            exampleWrong: exampleWrong || '',
            exampleCorrect: exampleCorrect || '',
        });

        return NextResponse.json({
            success: true,
            ruleId,
            message: '규칙이 추가되었습니다.',
        });
    } catch (error) {
        console.error('규칙 추가 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '규칙 추가 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// PUT: 규칙 수정
/**
 * Updates an existing evaluation rule.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - ruleId: string (Required)
 *   - ...fields to update (name, enabled, etc.)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function PUT(request: NextRequest) {
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        const body = await request.json();
        const { ruleId, ...data } = body as {
            ruleId: string;
            name?: string;
            enabled?: boolean;
            target?: string;
            condition?: string;
            correctionGuide?: string;
            exampleWrong?: string;
            exampleCorrect?: string;
        };

        if (!ruleId) {
            return NextResponse.json(
                {
                    success: false,
                    error: '규칙 ID가 필요합니다.',
                },
                { status: 400 }
            );
        }

        const updated = await updateEvalCheckRule(ruleId, data);
        if (!updated) {
            return NextResponse.json(
                {
                    success: false,
                    error: '규칙을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '규칙이 수정되었습니다.',
        });
    } catch (error) {
        console.error('규칙 수정 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '규칙 수정 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// DELETE: 규칙 삭제
/**
 * Deletes an evaluation rule.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - ruleId: string (Required)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function DELETE(request: NextRequest) {
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        const { searchParams } = new URL(request.url);
        const ruleId = searchParams.get('ruleId');

        if (!ruleId) {
            return NextResponse.json(
                {
                    success: false,
                    error: '규칙 ID가 필요합니다.',
                },
                { status: 400 }
            );
        }

        const deleted = await deleteEvalCheckRule(ruleId);
        if (!deleted) {
            return NextResponse.json(
                {
                    success: false,
                    error: '규칙을 찾을 수 없습니다.',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: '규칙이 삭제되었습니다.',
        });
    } catch (error) {
        console.error('규칙 삭제 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '규칙 삭제 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
