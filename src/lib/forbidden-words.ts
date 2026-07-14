export const DEFAULT_FORBIDDEN_WORDS = [
    '최고',
    '최상',
    '가장',
    '천재',
    '완벽',
    '완전',
    '압도적',
    '우월',
    '부족',
    '미흡',
    '낮음',
    '못함',
    '실패',
    '산만',
    '소극적',
    '꼴찌',
    '1등',
    '등수',
    '석차',
    '백분위',
    '점수',
    '원점수',
    '평균',
    '등급',
    '수상',
    '상훈',
    '대회',
    '미래가 기대',
    '향후 발전 가능성',
    '더 노력해야',
    '보완할 필요',
    '개선해야',
];
export type ForbiddenTermIssue = { word: string; reason: string; suggestion: string };
type ReferenceForbiddenTermRule = { term: string; suggestion: string };
const REFERENCE_ISSUE_REASON = '상호명·영문 기재 유의어';

// 2023 기재 금지어 및 대체어 참고 자료에서 확인한 상호명·영문/약어 예시.
const REFERENCE_FORBIDDEN_TERM_RULES: ReferenceForbiddenTermRule[] = [
    ['구글|네이버|다음', '포털사이트'], ['네이버 밴드|온라인 클래스|구글 클래스룸', '교육 플랫폼'], ['틱톡|TikTok', '엔터테인먼트 플랫폼'], ['TED', '온라인 강연회 영상'], ['OTT', '동영상 플랫폼 또는 동영상 공유 서비스'], ['ESG', '지속가능 경영'], ['ETF', '상장지수펀드'], ['NFT', '대체 불가능한 토큰'], ['CCD', '전하 결합 소자'], ['파이썬', '프로그래밍 언어'],
    ['Gather Town|개더타운|ZEPETO|제페토', '메타버스 플랫폼'], ['미리캔버스|miricanvas|망고보드|mangoboard|캔바|canva', '디자인 제작 플랫폼'], ['구글 티비|Google TV|유튜브|YouTube|티빙|TVING|웨이브|wavve|넷플릭스|netflix|왓챠|watcha|디즈니플러스|disneyplus', '동영상 플랫폼 또는 동영상 공유 서비스'], ['블로|Vllo|프리미어 프로|Premiere Pro|파이널 컷 프로|Final Cut Pro', '영상 제작 프로그램 또는 영상 편집 프로그램'], ['클래스팅|classting', '학습 플랫폼 또는 클래스 관리 도구'],
    ['유튜버|YouTuber', '동영상 크리에이터, 동영상 제공자 또는 개인 미디어 제작자'], ['카카오톡|카톡|KakaoTalk', '메신저 또는 메신저 서비스'], ['인스타그램|Instagram|라인|LINE|트위터|Twitter|메타|Meta|페이스북|Facebook', '소셜네트워크 서비스'], ['이프랜드|ifland', '메타버스 소셜커뮤니케이션서비스'], ['패들렛|Padlet|띵커벨|ThinkerBell|알로|Allo', '온라인 협업 툴 또는 협업 플랫폼'],
    ['구글 문서|Google Docs', '온라인 문서 편집기'], ['커리어넷|careernet|메이저맵|majormap', '진로정보망 또는 진로 정보 사이트'], ['홀랜드 검사|Holland', '직업선호도 검사'], ['KTX|SRT', '초고속 열차 또는 고속 열차'], ['MBTI', '성격유형 검사'], ['줌|Zoom', '화상 회의'], ['VR', '가상현실'], ['AR', '증강현실'], ['HTML', '하이퍼텍스트 마크업 언어 또는 웹 페이지 제작 언어'], ['CSS', '스타일 시트 언어'], ['아이패드|iPad|갤럭시탭|Galaxy Tab', '태블릿PC'], ['크롬북|chromebook', '휴대용 컴퓨터'],
    ['유엔|UN|유럽연합|EU|세계 보건 기구|WHO|세계무역기구|WTO|경제협력개발기구|OECD|국제통화기금|IMF|유네스코|UNESCO|국제원자력기구|IAEA|북대서양조약기구|NATO', '국제기구'],
].flatMap(([terms, suggestion]) => terms.split('|').map((term) => ({ term, suggestion })));

export function findReferenceForbiddenTermIssues(text: string): ForbiddenTermIssue[] {
    const normalizedText = text.toLocaleLowerCase();
    return REFERENCE_FORBIDDEN_TERM_RULES
        .filter((rule) => normalizedText.includes(rule.term.toLocaleLowerCase()))
        .sort((left, right) => normalizedText.indexOf(left.term.toLocaleLowerCase()) - normalizedText.indexOf(right.term.toLocaleLowerCase()))
        .map((rule) => ({ word: rule.term, reason: REFERENCE_ISSUE_REASON, suggestion: rule.suggestion }));
}