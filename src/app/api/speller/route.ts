/**
 * Speller API - 맞춤법 검사 API
 * 
 * 이 파일은 hanspell 라이브러리를 사용하여 한국어 맞춤법 검사를 수행합니다.
 * 다음(Daum) 맞춤법 검사기와 부산대학교(PNU) 맞춤법 검사기를 지원합니다.
 * 
 * 주요 기능:
 * - 재시도 로직: 서버 연결 실패 시 최대 2회 재시도
 * - 대체 서비스: 다음 서버 실패 시 부산대 서버로 자동 전환
 * - Rate Limiting: 분당 20회 요청 제한
 * 
 * 사용되는 외부 서비스:
 * - DAUM: 더 빠르고 안정적 (기본값)
 * - PNU (부산대): 더 상세한 교정 제안
 */

import { NextRequest, NextResponse } from 'next/server';
import * as hanspell from 'hanspell';

// 맞춤법 검사 결과 인터페이스
// hanspell은 suggestions를 단일 문자열(|로 구분) 또는 배열로 반환할 수 있음
interface SpellCheckResult {
    type: string;      // 오류 유형 (맞춤법, 띄어쓰기 등)
    token: string;     // 오류가 있는 원본 단어
    suggestions: string | string[]; // 수정 제안 (문자열 또는 배열)
    context: string;   // 오류가 발생한 문맥
    info: string;      // 오류에 대한 설명
}

// ============================================================
// Rate Limiter (요청 제한)
// - 과도한 요청으로 외부 서비스가 차단되는 것을 방지
// ============================================================
const requestLog: number[] = [];
const RATE_LIMIT = 20; // 분당 최대 요청 수
const RATE_WINDOW = 60000; // 1분 (밀리초)

/**
 * 현재 요청이 Rate Limit을 초과하는지 확인
 * @returns true = 요청 가능, false = 제한 초과
 */
function checkRateLimit(): boolean {
    const now = Date.now();
    // 오래된 요청 기록 제거 (1분 이상 된 것들)
    while (requestLog.length > 0 && requestLog[0] < now - RATE_WINDOW) {
        requestLog.shift();
    }
    return requestLog.length < RATE_LIMIT;
}

/**
 * 현재 요청을 로그에 기록
 */
function recordRequest() {
    requestLog.push(Date.now());
}

// ============================================================
// 맞춤법 검사 핵심 함수
// ============================================================

/**
 * hanspell 라이브러리를 Promise로 감싸는 래퍼 함수
 * 
 * @param text 검사할 텍스트
 * @param service 사용할 서비스 ('daum' 또는 'pnu')
 * @returns 맞춤법 검사 결과 배열
 */
function spellCheckAsync(text: string, service: 'daum' | 'pnu' = 'daum'): Promise<SpellCheckResult[]> {
    return new Promise((resolve, reject) => {
        const results: SpellCheckResult[] = [];
        const timeout = 15000; // 15초 (타임아웃을 10초에서 15초로 증가)

        // 결과가 도착할 때마다 호출되는 콜백
        // hanspell은 단일 객체 또는 배열을 전달할 수 있음
        const callback = (result: SpellCheckResult | SpellCheckResult[]) => {
            if (Array.isArray(result)) {
                results.push(...result);
            } else {
                results.push(result);
            }
        };

        // 모든 검사가 완료되었을 때 호출되는 콜백
        const endCallback = () => {
            resolve(results);
        };

        // 오류 발생 시 호출되는 콜백
        const errorCallback = (err: Error | null) => {
            // hanspell은 때때로 null 에러를 전달함
            if (err === null) {
                // null 에러는 서버 연결 문제 - 빈 결과 반환하지 않고 reject
                reject(new Error(`${service.toUpperCase()} 서버 연결 실패`));
            } else {
                reject(err);
            }
        };

        // 서비스에 따라 적절한 함수 호출
        if (service === 'pnu') {
            hanspell.spellCheckByPNU(text, timeout, callback, endCallback, errorCallback);
        } else {
            hanspell.spellCheckByDAUM(text, timeout, callback, endCallback, errorCallback);
        }
    });
}

/**
 * 재시도 로직이 포함된 맞춤법 검사 함수
 * 
 * @param text 검사할 텍스트
 * @param service 사용할 서비스
 * @param maxRetries 최대 재시도 횟수
 * @returns 맞춤법 검사 결과
 */
async function spellCheckWithRetry(
    text: string,
    service: 'daum' | 'pnu' = 'daum',
    maxRetries: number = 2
): Promise<{ results: SpellCheckResult[], usedService: string }> {
    let lastError: Error | null = null;

    // 1단계: 요청한 서비스로 시도 (재시도 포함)
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // 재시도 시 잠시 대기 (지수 백오프)
            if (attempt > 0) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 3000);
                await new Promise(resolve => setTimeout(resolve, delay));
                console.log(`[Speller] ${service.toUpperCase()} 재시도 ${attempt}/${maxRetries}`);
            }

            const results = await spellCheckAsync(text, service);
            return { results, usedService: service };
        } catch (error) {
            lastError = error as Error;
            console.warn(`[Speller] ${service.toUpperCase()} 시도 ${attempt + 1} 실패:`,
                (error as Error).message || error);
        }
    }

    // 2단계: 대체 서비스로 시도 (원래 서비스가 완전히 실패한 경우)
    const fallbackService = service === 'daum' ? 'pnu' : 'daum';
    console.log(`[Speller] ${fallbackService.toUpperCase()} 대체 서비스로 전환 시도`);

    try {
        const results = await spellCheckAsync(text, fallbackService);
        console.log(`[Speller] ${fallbackService.toUpperCase()} 대체 서비스 성공`);
        return { results, usedService: fallbackService };
    } catch (fallbackError) {
        console.warn(`[Speller] 대체 서비스도 실패:`, (fallbackError as Error).message);
        // 모든 시도 실패 - 마지막 에러 throw
        throw lastError || new Error('맞춤법 검사 서비스 연결 실패');
    }
}

/**
 * POST /api/speller
 * 
 * 맞춤법 검사 API 엔드포인트
 * 
 * 요청 본문:
 * - text: 검사할 텍스트 (필수)
 * - service: 'daum' 또는 'pnu' (선택, 기본값: 'daum')
 * 
 * 응답:
 * - success: 성공 여부
 * - service: 실제 사용된 서비스 (대체 서비스 사용 시 다를 수 있음)
 * - suggestions: 맞춤법 오류 및 수정 제안 배열
 * - original: 원본 텍스트
 * - errorCount: 발견된 오류 개수
 */
export async function POST(request: NextRequest) {
    try {
        // Rate Limit 확인 - 과도한 요청 방지
        if (!checkRateLimit()) {
            return NextResponse.json(
                {
                    error: '맞춤법 검사 요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.',
                    retryAfter: 60
                },
                { status: 429 }
            );
        }

        // 요청 본문 파싱
        const body = await request.json();
        const { text, service = 'daum' } = body;

        // 텍스트 유효성 검사
        if (!text) {
            return NextResponse.json(
                { error: '검사할 텍스트가 필요합니다.' },
                { status: 400 }
            );
        }

        // 텍스트 길이 제한 확인 (DAUM: 1000자, PNU: 500자)
        // 대체 서비스 사용을 고려해 더 넉넉한 1000자 기준으로 통일
        const maxLength = 1000;
        if (text.length > maxLength) {
            return NextResponse.json(
                { error: `텍스트가 너무 깁니다. ${maxLength}자 이하로 작성해 주세요.` },
                { status: 400 }
            );
        }

        // 요청 기록 (Rate Limit 추적용)
        recordRequest();

        // 재시도 로직이 포함된 맞춤법 검사 실행
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Speller] 검사 시작, 텍스트 길이:', text.length, '서비스:', service);
        }
        const { results: rawResults, usedService } = await spellCheckWithRetry(
            text,
            service as 'daum' | 'pnu'
        );
        if (process.env.NODE_ENV !== 'production') {
            console.log('[Speller] 검사 완료, 원본 결과 수:', rawResults.length, '사용 서비스:', usedService);
        }

        // 원본 결과 상세 로그
        if (process.env.NODE_ENV !== 'production' && rawResults.length > 0) {
            console.log('[Speller] 원본 결과:', JSON.stringify(rawResults, null, 2));
        }

        // 결과를 클라이언트 형식으로 변환
        // hanspell의 suggestions 필드 처리:
        // - 문자열인 경우: 교정된 결과 (예: "안녕하세요")
        // - 배열인 경우: 여러 제안 목록
        const suggestions = rawResults.map((r, i) => {
            // suggestions 필드 정규화
            let suggestionList: string[];

            if (typeof r.suggestions === 'string') {
                // 문자열인 경우 - 하나의 제안 또는 '|'로 구분된 여러 제안
                suggestionList = r.suggestions.split('|').map(s => s.trim()).filter(s => s);
            } else if (Array.isArray(r.suggestions)) {
                suggestionList = r.suggestions;
            } else {
                suggestionList = [];
            }

            // 원본과 동일한 제안 제거
            suggestionList = suggestionList.filter(s => s !== r.token);

            // 제안이 없으면 description에서 힌트 찾기
            if (suggestionList.length === 0 && r.info) {
                // info에서 교정 제안 추출 시도 (예: "'안녕하세요'로 고쳐야 합니다")
                const match = r.info.match(/'([^']+)'/);
                if (match && match[1] !== r.token) {
                    suggestionList = [match[1]];
                }
            }

            return {
                id: `spell-${i}`,
                token: r.token,
                suggestions: suggestionList,
                type: r.type || 'spelling',
                description: r.info || '',
                context: r.context || ''
            };
        }).filter(s => s.suggestions.length > 0); // 제안이 없는 항목은 제거

        if (process.env.NODE_ENV !== 'production') {
            console.log('[Speller] 변환된 suggestions 수:', suggestions.length);
        }

        // 대체 서비스 사용 시 알림 메시지 포함
        const response: {
            success: boolean;
            service: string;
            requestedService?: string;
            suggestions: typeof suggestions;
            original: string;
            errorCount: number;
            notice?: string;
        } = {
            success: true,
            service: usedService,
            suggestions,
            original: text,
            errorCount: suggestions.length
        };

        // 원래 요청한 서비스와 다른 서비스가 사용된 경우 알림
        if (usedService !== service) {
            response.requestedService = service;
            response.notice = `${service.toUpperCase()} 서버 연결 문제로 ${usedService.toUpperCase()} 서비스를 사용했습니다.`;
        }

        return NextResponse.json(response);
    } catch (error) {
        // 모든 서비스가 실패한 경우
        console.error('[Speller] 모든 서비스 실패:', (error as Error).message || error);

        // 사용자 경험을 위해 빈 결과 반환 (오류로 작업이 중단되지 않도록)
        return NextResponse.json({
            success: true,
            suggestions: [],
            error: '맞춤법 검사 서비스에 일시적인 문제가 있습니다. 잠시 후 다시 시도해 주세요.',
            errorCount: 0
        });
    }
}
