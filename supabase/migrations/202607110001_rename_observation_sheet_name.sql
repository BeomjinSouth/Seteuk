-- 관찰 메모 시트 이름 정정: '관숰메모'(유니코드 이스케이프 오타) → '관찰메모'
-- 런타임에서도 sheet-store가 프로세스당 1회 같은 이전을 수행하므로
-- 이 마이그레이션은 이미 적용된 환경에서는 no-op이다.
update public.sheet_rows
set sheet_name = '관찰메모'
where sheet_name = '관숰메모';
