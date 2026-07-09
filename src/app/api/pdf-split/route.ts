export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { withTeacherAuth } from '@/lib/auth/guards';
import { getOpenAIClient, hasOpenAIApiKey } from '@/lib/openai-client';
import { getPromptCacheParams } from '@/lib/prompt-cache';

const DEFAULT_MODEL = 'gpt-5.4-mini';

/**
 * Splits a PDF into individual student answer sheets.
 * 
 * @description
 * Analyzes the PDF to find student information (Name, ID) on specific pages.
 * Maps identified pages to student records.
 * 
 * @param {NextRequest} request - JSON body containing:
 *   - pdfData: string (Base64 PDF)
 *   - pagesPerStudent: number
 *   - startPage?: number
 *   - students?: Array<{ id: string, name: string, number: number }>
 * 
 * @returns {NextResponse} JSON response containing:
 *   - success: boolean
 *   - result: object
 *     - totalPages: number
 *     - items: Array of mapped items (slotIndex, recognizedText, studentInfo, etc.)
 */
export const POST = withTeacherAuth(async (request) => {
    try {
        const body = await request.json();
        const { pdfData, pagesPerStudent, startPage = 1, students } = body;

        if (!pdfData) {
            return NextResponse.json(
                { success: false, error: 'PDF 데이터가 필요합니다.' },
                { status: 400 }
            );
        }

        if (!pagesPerStudent || pagesPerStudent < 1) {
            return NextResponse.json(
                { success: false, error: '학생당 페이지 수를 지정해 주세요.' },
                { status: 400 }
            );
        }

        if (!hasOpenAIApiKey()) {
            return NextResponse.json(
                { success: false, error: 'OPENAI_API_KEY가 설정되지 않았습니다.' },
                { status: 503 }
            );
        }

        const base64Data = pdfData.includes(',') ? pdfData.split(',')[1] : pdfData;
        const openai = getOpenAIClient();

        const prompt = `이 PDF는 여러 학생의 평가지를 스캔한 파일입니다.
각 학생의 평가지는 ${pagesPerStudent}페이지입니다.
${startPage}페이지부터 시작합니다.

각 학생의 첫 페이지에서 학생 정보(학번, 이름)를 찾아주세요.
다양한 형식을 인식해 주세요:
- "1-3-15" (학년-반-번호)
- "15번 김철수"
- "1학년 3반 15번"
- "김철수 / 15"
- 등

## 응답 형식 (JSON)
{
  "totalPages": 전체페이지수,
  "studentsFound": [
    {
      "slotIndex": 0,
      "pageStart": 1,
      "pageEnd": ${pagesPerStudent},
      "recognizedText": "원본에서 인식한 학생 정보 텍스트",
      "studentNumber": 1,
      "studentName": "김민수",
      "confidence": 0.95
    },
    ...
  ]
}

JSON 형식으로만 응답해 주세요.`;

        const cacheParams = getPromptCacheParams('pdf-split:v1', [
            pagesPerStudent,
            startPage,
        ]);

        const response = await openai.responses.create({
            model: DEFAULT_MODEL,
            input: [
                {
                    role: 'user',
                    content: [
                        { type: 'input_text', text: prompt },
                        { type: 'input_file', file_data: `data:application/pdf;base64,${base64Data}` },
                    ],
                },
            ],
            text: { format: { type: 'json_object' } },
            max_output_tokens: 4096,
            reasoning: { effort: 'low' },
            ...cacheParams,
        });

        const responseText = response.output_text || '{}';

        let parsedResult;
        try {
            parsedResult = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse PDF split response.');
            return NextResponse.json(
                { success: false, error: 'PDF 분석 결과를 파싱하는데 실패했습니다.' },
                { status: 500 }
            );
        }

        // Build mapping items with status
        const mappingItems = (parsedResult.studentsFound || []).map((found: {
            slotIndex: number;
            pageStart: number;
            pageEnd: number;
            recognizedText?: string;
            studentNumber?: number;
            studentName?: string;
            confidence?: number;
        }) => {
            // Try to match with provided students list
            let mappedStudent = null;
            let status: 'matched' | 'mismatch' | 'unrecognized' | 'empty' = 'unrecognized';

            if (students && students.length > 0 && found.studentNumber) {
                mappedStudent = students.find((s: { number: number }) => s.number === found.studentNumber);
                if (mappedStudent) {
                    // Check if names match (if both exist)
                    if (found.studentName && mappedStudent.name) {
                        status = found.studentName.includes(mappedStudent.name) ||
                            mappedStudent.name.includes(found.studentName)
                            ? 'matched'
                            : 'mismatch';
                    } else {
                        status = 'matched';
                    }
                }
            }

            return {
                slotIndex: found.slotIndex,
                pageStart: found.pageStart,
                pageEnd: found.pageEnd,
                ocrRecognized: {
                    studentNumber: found.studentNumber,
                    studentName: found.studentName,
                    confidence: found.confidence || 0.5,
                    rawText: found.recognizedText || '',
                },
                mappedStudentId: mappedStudent?.id,
                mappedStudentNumber: mappedStudent?.number || found.studentNumber,
                mappedStudentName: mappedStudent?.name || found.studentName,
                status,
                isSkipped: false,
            };
        });

        return NextResponse.json({
            success: true,
            result: {
                totalPages: parsedResult.totalPages || 0,
                pagesPerStudent,
                startPage,
                items: mappingItems,
            },
        });
    } catch (error) {
        console.error('PDF split error:', error);
        return NextResponse.json(
            { success: false, error: 'PDF 분석 중 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
});
