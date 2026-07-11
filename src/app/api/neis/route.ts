import { NextRequest, NextResponse } from 'next/server';

// NEIS 오픈API 키는 환경변수 우선. 아래 폴백 키는 이미 공개 이력에 노출된 값이므로
// NEIS_API_KEY 설정 후 나이스 포털에서 재발급·교체할 것.
const API_KEY = (process.env.NEIS_API_KEY || '').trim() || '2308873a1ac04ea6813f34222481887e';
const BASE_URL = 'https://open.neis.go.kr/hub';

// 시도교육청 코드 매핑
const OFFICE_CODES: Record<string, string> = {
    '서울': 'B10',
    '서울특별시': 'B10',
    '부산': 'C10',
    '부산광역시': 'C10',
    '대구': 'D10',
    '대구광역시': 'D10',
    '인천': 'E10',
    '인천광역시': 'E10',
    '광주': 'F10',
    '광주광역시': 'F10',
    '대전': 'G10',
    '대전광역시': 'G10',
    '울산': 'H10',
    '울산광역시': 'H10',
    '세종': 'I10',
    '세종특별자치시': 'I10',
    '경기': 'J10',
    '경기도': 'J10',
    '강원': 'K10',
    '강원도': 'K10',
    '충북': 'M10',
    '충청북도': 'M10',
    '충남': 'N10',
    '충청남도': 'N10',
    '전북': 'P10',
    '전라북도': 'P10',
    '전남': 'Q10',
    '전라남도': 'Q10',
    '경북': 'R10',
    '경상북도': 'R10',
    '경남': 'S10',
    '경상남도': 'S10',
    '제주': 'T10',
    '제주특별자치도': 'T10',
};

// 교육청 코드 추출 (학교명에서 교육청명을 찾거나, 기본값 사용)
function getOfficeCode(region?: string): string {
    if (!region) return 'J10'; // 기본값: 경기도

    for (const [key, code] of Object.entries(OFFICE_CODES)) {
        if (region.includes(key)) {
            return code;
        }
    }

    return 'J10'; // 기본값: 경기도
}

// 학교 정보 조회 (학교 코드 얻기)
async function getSchoolInfo(schoolName: string, officeCode: string) {
    const url = `${BASE_URL}/schoolInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SCHUL_NM=${encodeURIComponent(schoolName)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.schoolInfo && data.schoolInfo[1]?.row) {
            return data.schoolInfo[1].row[0];
        }

        // 만약 못 찾았으면 전체 교육청에서 검색
        const allUrl = `${BASE_URL}/schoolInfo?KEY=${API_KEY}&Type=json&SCHUL_NM=${encodeURIComponent(schoolName)}`;
        const allResponse = await fetch(allUrl);
        const allData = await allResponse.json();

        if (allData.schoolInfo && allData.schoolInfo[1]?.row) {
            return allData.schoolInfo[1].row[0];
        }

        return null;
    } catch (error) {
        console.error('School info API error:', error);
        return null;
    }
}

// 중학교 시간표 조회
async function getTimetable(officeCode: string, schoolCode: string, grade?: string, classNm?: string) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const schoolYear = month < 3 ? year - 1 : year;
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    let url = `${BASE_URL}/misTimetable?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${schoolYear}&ALL_TI_YMD=${dateStr}`;

    if (grade) url += `&GRADE=${grade}`;
    if (classNm) url += `&CLASS_NM=${classNm}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.misTimetable && data.misTimetable[1]?.row) {
            return data.misTimetable[1].row;
        }
        return [];
    } catch (error) {
        console.error('Timetable API error:', error);
        return [];
    }
}

// 급식 식단 정보 조회
async function getMealInfo(officeCode: string, schoolCode: string, date?: string) {
    const today = new Date();
    const dateStr = date || today.toISOString().slice(0, 10).replace(/-/g, '');

    const url = `${BASE_URL}/mealServiceDietInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${dateStr}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
            return data.mealServiceDietInfo[1].row;
        }
        return [];
    } catch (error) {
        console.error('Meal info API error:', error);
        return [];
    }
}

// 학급 정보 조회
async function getClassInfo(officeCode: string, schoolCode: string) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const schoolYear = month < 3 ? today.getFullYear() - 1 : today.getFullYear();

    const url = `${BASE_URL}/classInfo?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${schoolYear}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.classInfo && data.classInfo[1]?.row) {
            return data.classInfo[1].row;
        }
        return [];
    } catch (error) {
        console.error('Class info API error:', error);
        return [];
    }
}

// 학사일정 조회
async function getSchedule(officeCode: string, schoolCode: string, fromDate?: string, toDate?: string) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const schoolYear = month < 3 ? today.getFullYear() - 1 : today.getFullYear();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const fromStr = fromDate || startOfMonth.toISOString().slice(0, 10).replace(/-/g, '');
    const toStr = toDate || endOfMonth.toISOString().slice(0, 10).replace(/-/g, '');

    const url = `${BASE_URL}/SchoolSchedule?KEY=${API_KEY}&Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&AY=${schoolYear}&AA_FROM_YMD=${fromStr}&AA_TO_YMD=${toStr}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.SchoolSchedule && data.SchoolSchedule[1]?.row) {
            return data.SchoolSchedule[1].row;
        }
        return [];
    } catch (error) {
        console.error('Schedule API error:', error);
        return [];
    }
}

/**
 * Proxy API for NEIS (National Education Information System) open data.
 * 
 * @description
 * Provides access to school information, timetables, meal plans, and schedules.
 * Handles API key management and response formatting.
 * 
 * @param {NextRequest} request - URL searchParams containing:
 *   - type: 'school' | 'timetable' | 'meal' | 'class' | 'schedule' | 'all'
 *   - school: string (School name)
 *   - region: string (Region name, e.g., '경기도')
 *   - grade?: string
 *   - class?: string
 *   - date?: string (YYYYMMDD)
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - data: object (The requested NEIS data)
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const schoolName = searchParams.get('school') || '성호중학교';
    const region = searchParams.get('region') || '경기도';
    const grade = searchParams.get('grade') || undefined;
    const classNm = searchParams.get('class') || undefined;
    const date = searchParams.get('date') || undefined;
    const fromDate = searchParams.get('from') || undefined;
    const toDate = searchParams.get('to') || undefined;

    try {
        // Get office code from region
        const officeCode = getOfficeCode(region);

        // Get school info to get school code
        const schoolInfo = await getSchoolInfo(schoolName, officeCode);

        if (!schoolInfo) {
            return NextResponse.json({
                error: `'${schoolName}' 학교 정보를 찾을 수 없습니다.`,
                success: false
            }, { status: 404 });
        }

        const schoolCode = schoolInfo.SD_SCHUL_CODE;
        const actualOfficeCode = schoolInfo.ATPT_OFCDC_SC_CODE;

        let result: unknown;

        switch (type) {
            case 'school':
                result = schoolInfo;
                break;
            case 'timetable':
                result = await getTimetable(actualOfficeCode, schoolCode, grade, classNm);
                break;
            case 'meal':
                result = await getMealInfo(actualOfficeCode, schoolCode, date);
                break;
            case 'class':
                result = await getClassInfo(actualOfficeCode, schoolCode);
                break;
            case 'schedule':
                result = await getSchedule(actualOfficeCode, schoolCode, fromDate, toDate);
                break;
            case 'all':
                const [timetable, meal, classInfo, schedule] = await Promise.all([
                    getTimetable(actualOfficeCode, schoolCode, grade, classNm),
                    getMealInfo(actualOfficeCode, schoolCode, date),
                    getClassInfo(actualOfficeCode, schoolCode),
                    getSchedule(actualOfficeCode, schoolCode, fromDate, toDate),
                ]);
                result = {
                    school: schoolInfo,
                    timetable,
                    meal,
                    classInfo,
                    schedule,
                };
                break;
            default:
                return NextResponse.json({ error: '유효하지 않은 type 파라미터입니다.' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            schoolName: schoolInfo.SCHUL_NM,
            schoolCode,
            officeCode: actualOfficeCode,
            data: result,
        });
    } catch (error) {
        console.error('NEIS API error:', error);
        return NextResponse.json({ error: 'API 호출 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
