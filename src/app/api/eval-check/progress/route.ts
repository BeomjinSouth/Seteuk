import { NextRequest, NextResponse } from 'next/server';
import { getEvalCheckDocumentById } from '@/lib/sheets';
import { getAnalysisProgress } from '../route';

/**
 * 평가 점검 진행률 API
 * 
 * GET: 분석 진행 상황 조회
 */

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const documentId = searchParams.get('documentId');

        if (!documentId) {
            return NextResponse.json(
                { success: false, error: '문서 ID가 필요합니다.' },
                { status: 400 }
            );
        }

        // 메모리에서 실시간 진행 상태 조회
        const memoryProgress = getAnalysisProgress(documentId);

        if (memoryProgress) {
            return NextResponse.json({
                success: true,
                documentId,
                status: memoryProgress.status,
                progress: memoryProgress.progress,
                currentStep: memoryProgress.currentStep,
                error: memoryProgress.error,
                source: 'realtime',
            });
        }

        // DB에서 상태 조회
        const document = await getEvalCheckDocumentById(documentId);

        if (!document) {
            return NextResponse.json(
                { success: false, error: '문서를 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 진행률에 따른 currentStep 결정
        let currentStep = '';
        switch (document.status) {
            case 'pending':
                currentStep = '분석 대기 중...';
                break;
            case 'extracting':
                currentStep = '텍스트 추출 중...';
                break;
            case 'structuring':
                currentStep = '문항 구조화 중...';
                break;
            case 'analyzing':
                currentStep = '문항 분석 중...';
                break;
            case 'completed':
                currentStep = `분석 완료 (고위험 ${document.highRiskCount}문항)`;
                break;
            case 'error':
                currentStep = '분석 실패';
                break;
            default:
                currentStep = '';
        }

        return NextResponse.json({
            success: true,
            documentId,
            status: document.status,
            progress: document.progress,
            currentStep,
            highRiskCount: document.highRiskCount,
            error: document.status === 'error' ? document.errorMessage || '' : undefined,
            source: 'database',
        });
    } catch (error) {
        console.error('진행률 조회 오류:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : '진행률 조회 중 오류가 발생했습니다.',
            },
            { status: 500 }
        );
    }
}
