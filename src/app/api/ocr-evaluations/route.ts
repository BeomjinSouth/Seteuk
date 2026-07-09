import { NextRequest, NextResponse } from 'next/server';
import {
    getOCREvaluations,
    getOCREvaluationById,
    getOCREvaluationsByFilter,
    addOCREvaluation,
    updateOCREvaluation,
    deleteOCREvaluation,
    type OCREvaluationRow,
} from '@/lib/sheets/ocr';
import { initializeSheets } from '@/lib/sheets/base';

// Helper to ensure sheets exist
async function ensureSheetsExist() {
    try {
        const result = await initializeSheets();
        if (result.created.length > 0) {
            console.log('Created sheets:', result.created);
        }
        if (result.errors.length > 0) {
            console.error('Sheet initialization errors:', result.errors);
        }
    } catch (error) {
        console.error('Sheet initialization error:', error);
        throw error; // Re-throw to see the full error
    }
}

const parseJsonValue = <T,>(value: unknown, fallback: T): T => {
    if (value === null || value === undefined) return fallback;
    if (typeof value !== 'string') return value as T;
    if (!value.trim()) return fallback;
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

const parseEvaluationRow = (evaluation: OCREvaluationRow) => ({
    ...evaluation,
    attachedFiles: parseJsonValue(evaluation.attachedFiles, []),
    achievementStandards: parseJsonValue(evaluation.achievementStandards, []),
    scoringCriteria: parseJsonValue(evaluation.scoringCriteria, []),
    ocrResults: parseJsonValue(evaluation.ocrResults, []),
    modelAnswer: parseJsonValue(evaluation.modelAnswer, null),
    preliminaryGradings: parseJsonValue(evaluation.preliminaryGradings, []),
    teacherFeedback: parseJsonValue(evaluation.teacherFeedback, null),
    batchGradingResult: parseJsonValue(evaluation.batchGradingResult, null),
});

// GET - OCR evaluations
/**
 * Retrieves OCR evaluations.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - id?: string (Specific ID)
 *   - year?: string
 *   - semester?: '1' | '2'
 *   - grade?: string
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - data: Evaluation object(s)
 */
export async function GET(request: NextRequest) {
    try {
        await ensureSheetsExist();

        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        const year = searchParams.get('year');
        const semester = searchParams.get('semester') as '1' | '2' | null;
        const grade = searchParams.get('grade');

        // ID로 단일 조회
        if (id) {
            const evaluation = await getOCREvaluationById(id);
            if (!evaluation) {
                return NextResponse.json(
                    { success: false, error: '평가를 찾을 수 없습니다.' },
                    { status: 404 }
                );
            }

            // JSON 파싱
            return NextResponse.json({
                success: true,
                data: parseEvaluationRow(evaluation),
            });
        }

        // 필터 조회
        let evaluations;
        if (year || semester || grade) {
            evaluations = await getOCREvaluationsByFilter(
                year ? parseInt(year) : undefined,
                semester || undefined,
                grade ? parseInt(grade) : undefined
            );
        } else {
            evaluations = await getOCREvaluations();
        }

        // JSON 파싱
        const parsedEvaluations = evaluations.map(parseEvaluationRow);

        return NextResponse.json({
            success: true,
            data: parsedEvaluations,
        });
    } catch (error) {
        console.error('Failed to get OCR evaluations:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, error: `OCR 평가 조회에 실패했습니다: ${errorMessage}` },
            { status: 500 }
        );
    }
}

// POST - OCR 평가 추가
/**
 * Creates a new OCR evaluation record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - year: number
 *   - semester: number
 *   - grade: number
 *   - title: string
 *   - attachedFiles: string (JSON string)
 *   - ...other evaluation fields
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - id: string
 *   - message: string
 */
export async function POST(request: NextRequest) {
    try {
        await ensureSheetsExist();

        const body = await request.json();
        const {
            year,
            semester,
            grade,
            title,
            description,
            attachedFiles,
            achievementStandards,
            scoringCriteria,
            ocrResults,
            memo,
        } = body;

        if (!year || !semester || !grade || !title) {
            return NextResponse.json(
                { success: false, error: '학년도, 학기, 학년, 평가명은 필수입니다.' },
                { status: 400 }
            );
        }

        const id = await addOCREvaluation({
            year,
            semester,
            grade,
            title,
            description,
            attachedFiles,
            achievementStandards,
            scoringCriteria,
            ocrResults,
            memo,
        });

        return NextResponse.json({
            success: true,
            id,
            message: 'OCR 평가가 등록되었습니다.',
        });
    } catch (error) {
        console.error('Failed to add OCR evaluation:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { success: false, error: `OCR 평가 등록에 실패했습니다: ${errorMessage}` },
            { status: 500 }
        );
    }
}

// PUT - OCR 평가 수정
/**
 * Updates an existing OCR evaluation record.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - id: string (Required)
 *   - ...fields to update
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'ID가 필요합니다.' },
                { status: 400 }
            );
        }

        await updateOCREvaluation(id, data);

        return NextResponse.json({
            success: true,
            message: 'OCR 평가가 수정되었습니다.',
        });
    } catch (error) {
        console.error('Failed to update OCR evaluation:', error);
        return NextResponse.json(
            { success: false, error: 'OCR 평가 수정에 실패했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE - OCR 평가 삭제
/**
 * Deletes an OCR evaluation record.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - id: string (Required)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - message: string
 */
export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { success: false, error: 'ID가 필요합니다.' },
            { status: 400 }
        );
    }

    try {
        await deleteOCREvaluation(id);

        return NextResponse.json({
            success: true,
            message: 'OCR 평가가 삭제되었습니다.',
        });
    } catch (error) {
        console.error('Failed to delete OCR evaluation:', error);
        return NextResponse.json(
            { success: false, error: 'OCR 평가 삭제에 실패했습니다.' },
            { status: 500 }
        );
    }
}
