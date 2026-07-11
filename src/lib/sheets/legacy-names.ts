/**
 * 과거 오타로 만들어진 시트 이름 → 현재 이름 매핑.
 *
 * '관숰메모'는 '관찰메모'를 의도한 유니코드 이스케이프 오타(숰 ← 찰)로
 * 생성·저장돼 온 이름이다. 저장소별 자가 이전(Supabase sheet_name update,
 * Google Sheets 탭 rename, 로컬 스토어 키 이전)에 이 매핑을 사용한다.
 */
export const LEGACY_SHEET_RENAMES: Record<string, string> = {
    '관숰메모': '관찰메모', // 관숰메모 → 관찰메모
};
