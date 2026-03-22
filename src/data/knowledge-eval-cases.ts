import type { KnowledgeEvalCase } from '@/types/knowledge';

export const KNOWLEDGE_EVAL_CASES: KnowledgeEvalCase[] = [
    {
        id: 'name-in-seteuk',
        query: '세특에 학생 이름을 넣어도 되나요',
        schoolLevel: '고등학교',
        year: 2026,
        expectedTitleKeywords: ['성명'],
        notes: '학생 이름/성명 관련 FAQ를 우선 찾는지 본다.',
    },
    {
        id: 'certificate-in-record',
        query: '자격증 취득 사실을 세특에 넣어도 되나요',
        schoolLevel: '고등학교',
        year: 2026,
        expectedTitleKeywords: ['자격증'],
    },
    {
        id: 'attendance-bongsa-hours',
        query: '창체 봉사활동 결석 시 이수시간 인정되나요',
        schoolLevel: '고등학교',
        year: 2026,
        expectedTitleKeywords: ['창의적 체험활동', '결석', '이수시간'],
    },
    {
        id: 'attendance-proof',
        query: '출석인정 결석의 증빙 서류는 무엇이 필요한가요',
        schoolLevel: '초등학교',
        category: '출결상황',
        year: 2026,
        expectedTitleKeywords: ['출석', '증빙'],
    },
    {
        id: 'career-special-note',
        query: '진로활동 특기사항은 어떻게 기재하나요',
        schoolLevel: '고등학교',
        year: 2026,
        expectedTitleKeywords: ['진로활동'],
    },
    {
        id: 'correction-scope',
        query: '정정이 필요한 자료의 범위는 어디까지인가요',
        schoolLevel: '중학교',
        year: 2026,
        expectedTitleKeywords: ['정정'],
    },
];
