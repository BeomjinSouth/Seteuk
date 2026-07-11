import { NextRequest, NextResponse } from 'next/server';
import {
    getEvalCheckSettings,
    saveEvalCheckSettings,
} from '@/lib/sheets/eval-check';
import { initializeSheets } from '@/lib/sheets/base';
import { verifyRootFolder } from '@/lib/drive';
import type { EvalCheckSettings } from '@/types';
import { requireTeacherSession } from '@/lib/auth/guards';
import { evalCheckDisabledResponse, isEvalCheckEnabled } from '@/lib/api-feature-flags';

/**
 * 평가 점검 설정 API
 * 
 * GET: 현재 설정 조회
 * POST: 설정 저장 및 연결 테스트
 */

// GET: 설정 조회
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
        throw error;
    }
}

function parseBoolean(value?: string): boolean {
    if (!value) return false;
    const normalized = value.trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

function normalizeSettings(raw: Record<string, string>): EvalCheckSettings {
    return {
        rootFolderId: raw.rootFolderId || '',
        spreadsheetId: raw.spreadsheetId || '',
        serviceAccountEmail:
            process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL ||
            process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            '',
        ruleSetId: raw.ruleSetId || 'DEFAULT',
        isConnected: parseBoolean(raw.isConnected),
        lastTestedAt: raw.lastTestedAt || '',
    };
}

// GET: 설정 조회
/**
 * Retrieves current evaluation check settings.
 * 
 * @description
 * Ensures sheets are initialized before returning settings.
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - settings: Settings object or null
 */
export async function GET() {
    if (!isEvalCheckEnabled()) return evalCheckDisabledResponse();
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        await ensureSheetsExist();
        const rawSettings = await getEvalCheckSettings();
        const settings = normalizeSettings(rawSettings);
        const hasConfiguredValue = Boolean(
            settings.rootFolderId ||
            settings.spreadsheetId ||
            rawSettings.isConnected ||
            rawSettings.lastTestedAt
        );

        if (!hasConfiguredValue) {
            return NextResponse.json({
                success: true,
                settings: null,
                message: '설정이 없습니다. 온보딩을 완료해 주세요.',
            });
        }

        return NextResponse.json({
            success: true,
            settings,
        });
    } catch (error) {
        console.error('설정 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '설정 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}

// POST: 설정 저장 및 연결 테스트
/**
 * Saves settings or tests connection to Google Drive.
 * 
 * @description
 * If `testConnection` is true, verifies the provided `rootFolderId`.
 * Otherwise, saves the provided settings (`rootFolderId`, `spreadsheetId`).
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - rootFolderId?: string
 *   - spreadsheetId?: string
 *   - testConnection?: boolean
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - connectionStatus?: 'connected' | 'failed'
 *   - message?: string
 */
export async function POST(request: NextRequest) {
    if (!isEvalCheckEnabled()) return evalCheckDisabledResponse();
    const auth = await requireTeacherSession();
    if (!auth.ok) return auth.response;
    try {
        await ensureSheetsExist();
        const body = await request.json();
        const { rootFolderId, spreadsheetId, testConnection } = body as {
            rootFolderId?: string;
            spreadsheetId?: string;
            testConnection?: boolean;
        };

        // 연결 테스트 요청인 경우
        if (testConnection && rootFolderId) {
            const result = await verifyRootFolder(rootFolderId);

            if (!result.success) {
                return NextResponse.json({
                    success: false,
                    error: result.error,
                    connectionStatus: 'failed',
                });
            }

            // 테스트 성공 시 설정 업데이트
            await saveEvalCheckSettings({
                rootFolderId,
                spreadsheetId: spreadsheetId || '',
                isConnected: 'true',
                lastTestedAt: new Date().toISOString(),
            });

            return NextResponse.json({
                success: true,
                connectionStatus: 'connected',
                folderName: result.folderName,
                message: `폴더 "${result.folderName}"에 연결되었습니다.`,
            });
        }

        // 일반 설정 저장
        if (rootFolderId || spreadsheetId) {
            await saveEvalCheckSettings({
                ...(rootFolderId && { rootFolderId }),
                ...(spreadsheetId && { spreadsheetId }),
            });

            return NextResponse.json({
                success: true,
                message: '설정이 저장되었습니다.',
            });
        }

        return NextResponse.json(
            {
                success: false,
                error: '저장할 설정이 없습니다.',
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('설정 저장 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '설정 저장 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
