# 교과서 원본

이 폴더에 분석할 교과서, 익힘책, 지도서 PDF 또는 이미지 파일을 넣습니다.

## 파일명 규칙

`교육과정_학년_출판사_책종_권.pdf`

예:

- `2022_초3_미래엔_교과서_1학기.pdf`
- `2022_초3_미래엔_익힘책_1학기.pdf`
- `2015_중3_천재교육_지도서.pdf`

지원 책종: `교과서`, `익힘책`, `지도서`

## 출처 manifest

PDF를 추가할 때는 같은 폴더의 `TEXTBOOK_SOURCE_MANIFEST.csv`에 출처와 해시를 함께 기록합니다.

필수 열:

- `relative_path`: 저장소 루트 기준 PDF 상대 경로
- `source_url`: 공식 공개 페이지 또는 다운로드 근거 URL
- `attachment_id`: 원 출처의 첨부 식별자, 게시물 식별자, 또는 다운로드 항목 식별자
- `expected_sha256`: 추가한 PDF의 SHA-256 해시
- `license_note`: 공개/사용 근거와 저작권 주의 메모
- `downloaded_at`: 다운로드 또는 수집 날짜

`docs/math-concept-map/tools/build_textbook_source_audit.py`는 PDF 헤더, 파일명 규칙, manifest 메타데이터, 해시 일치를 검사합니다. 이 감사가 `ready_for_textbook_extraction`을 기록한 PDF만 교과서 본문·예제·문제 근거 추출에 사용합니다.

저작권 보호를 위해 산출물에는 원문 전체가 아니라 개념명, 짧은 요약, 페이지 참조, 위계 관계만 기록합니다.
