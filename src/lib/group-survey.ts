import type {
    GroupRecommendationGroup,
    GroupRecommendationMember,
    GroupRecommendationResult,
    GroupStudentSkillScore,
    GroupSurveyResponse,
    GroupSurveyStudentProfile,
    PartnerRecommendation,
    SkillScore,
    SurveyAnswerValue,
} from '@/types';
import type { ObservationBoardMentorAssignment } from '@/lib/observation-board-ai-context';

export const GROUP_SURVEY_QUESTIONS = [
    '모둠에서 내가 맡은 일은 끝까지 하려고 한다.',
    '활동에 필요한 준비물, 자료, 역할을 미리 확인한다.',
    '활동이 어려워도 바로 포기하지 않고 다시 해 본다.',
    '친구와 약속한 일이나 시간을 지키려고 한다.',
    '결과물을 내기 전에 빠진 것이 없는지 확인한다.',
    '활동 시간에는 내가 할 일에 집중하려고 한다.',
    '모르는 것이 있으면 혼자 멈춰 있기보다 친구나 선생님에게 도움을 요청한다.',
    '모둠 결과가 잘 나오도록 내 역할 밖의 일도 살펴본다.',
    '활동이 시작될 때 내가 먼저 의견을 내는 편이다.',
    '모둠이 무엇을 할지 멈춰 있을 때 다음 할 일을 제안하는 편이다.',
    '말하지 못한 친구에게 의견을 물어보는 편이다.',
    '발표, 진행, 정리의 방향을 잡는 데 먼저 참여하는 편이다.',
] as const;

export const GROUP_SURVEY_SCALE = [
    '전혀 그렇지 않다',
    '별로 그렇지 않다',
    '보통이다',
    '대체로 그렇다',
    '매우 그렇다',
] as const;

export function isSurveyAnswerValue(value: unknown): value is SurveyAnswerValue {
    return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

export function normalizeSurveyAnswers(value: unknown): SurveyAnswerValue[] | null {
    if (!Array.isArray(value) || value.length !== GROUP_SURVEY_QUESTIONS.length) return null;
    const answers = value.map((item) => Number(item));
    return answers.every(isSurveyAnswerValue) ? answers as SurveyAnswerValue[] : null;
}

function roundScore(value: number): number {
    return Math.round(value * 100) / 100;
}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function scoreSurveyAnswers(answers: SurveyAnswerValue[]) {
    return {
        willAvg: roundScore(average(answers.slice(0, 8))),
        agencyAvg: roundScore(average(answers.slice(8, 12))),
    };
}

export function getWillLevel(willAvg?: number): string {
    if (!willAvg) return '응답 없음';
    if (willAvg < 2.5) return '챙김 지원 필요';
    if (willAvg < 3.5) return '보통';
    return '책임감 높음';
}

export function getAgencySizeLabel(agencyAvg?: number): string {
    if (!agencyAvg) return '응답 없음';
    if (agencyAvg < 2.5) return '작은 점';
    if (agencyAvg < 3.5) return '중간 점';
    return '큰 점';
}

export function getSkillLabel(skillScore?: SkillScore): string {
    if (skillScore === 1) return '도움 필요';
    if (skillScore === 2) return '기본 가능';
    if (skillScore === 3) return '설명 가능';
    return '입력 대기';
}

export function getPointSize(agencyAvg?: number): number {
    if (!agencyAvg) return 0;
    if (agencyAvg < 2.5) return 18;
    if (agencyAvg < 3.5) return 27;
    return 38;
}

export function buildSurveyProfiles(input: {
    students: GroupSurveyStudentProfile['student'][];
    responses: GroupSurveyResponse[];
    skills: GroupStudentSkillScore[];
}): GroupSurveyStudentProfile[] {
    const responsesByStudent = new Map(input.responses.map((response) => [response.studentId, response]));
    const skillsByStudent = new Map(input.skills.map((skill) => [skill.studentId, skill]));

    return input.students
        .map((student) => {
            const response = responsesByStudent.get(student.id);
            const skill = skillsByStudent.get(student.id);
            return {
                student,
                response,
                skill,
                willAvg: response?.willAvg,
                agencyAvg: response?.agencyAvg,
                skillScore: skill?.skillScore,
            };
        })
        .sort((a, b) => a.student.number - b.student.number);
}

function isReadyProfile(profile: GroupSurveyStudentProfile): profile is GroupSurveyStudentProfile & {
    willAvg: number;
    agencyAvg: number;
    skillScore: SkillScore;
} {
    return Boolean(profile.response && profile.skillScore && profile.willAvg && profile.agencyAvg);
}

function toMember(profile: GroupSurveyStudentProfile & {
    willAvg: number;
    agencyAvg: number;
    skillScore: SkillScore;
}): GroupRecommendationMember {
    return {
        studentId: profile.student.id,
        name: profile.student.name,
        number: profile.student.number,
        skillScore: profile.skillScore,
        willAvg: profile.willAvg,
        agencyAvg: profile.agencyAvg,
    };
}

function groupPressure(group: GroupRecommendationMember[]): number {
    const skillSum = group.reduce((sum, member) => sum + member.skillScore, 0);
    const willSum = group.reduce((sum, member) => sum + member.willAvg, 0);
    const highWillCount = group.filter((member) => member.willAvg >= 3.5).length;
    const highAgencyCount = group.filter((member) => member.agencyAvg >= 3.5).length;
    return skillSum * 1.4 + willSum + highWillCount * 0.8 + highAgencyCount * 0.5 + group.length * 0.2;
}

export function analyzeGroupMembers(members: GroupRecommendationMember[]): string[] {
    if (members.length === 0) return ['아직 학생이 배치되지 않았습니다.'];

    const feedback: string[] = [];
    const skillThreeCount = members.filter((member) => member.skillScore === 3).length;
    const skillOneCount = members.filter((member) => member.skillScore === 1).length;
    const highWillCount = members.filter((member) => member.willAvg >= 3.5).length;
    const lowWillCount = members.filter((member) => member.willAvg < 2.5).length;
    const highAgencyCount = members.filter((member) => member.agencyAvg >= 3.5).length;
    const lowAgencyCount = members.filter((member) => member.agencyAvg < 2.5).length;

    if (skillThreeCount >= 2) {
        feedback.push('설명 가능한 학생이 몰려 있어 도움 역할 부담을 나누는 조정이 좋습니다.');
    }
    if (skillThreeCount === 0 && skillOneCount >= 2) {
        feedback.push('내용 도움을 받을 수 있는 구조나 가까운 확인 주기가 필요합니다.');
    }
    if (highWillCount >= Math.max(2, Math.ceil(members.length * 0.75))) {
        feedback.push('책임감 높은 학생이 많아 안정적이지만 특정 모둠에 힘이 몰리지 않는지 확인합니다.');
    }
    if (lowWillCount >= 2) {
        feedback.push('챙김 지원이 필요한 학생이 함께 있어 역할과 시간을 더 구체화해야 합니다.');
    }
    if (highAgencyCount >= 2) {
        feedback.push('먼저 이끄는 학생이 여러 명이라 진행 방향을 나누어 주도권 충돌을 줄입니다.');
    }
    if (lowAgencyCount === members.length) {
        feedback.push('조용히 참여하는 학생만 있어 첫 질문이나 역할 카드를 제공하면 좋습니다.');
    }
    if (feedback.length === 0) {
        feedback.push('Skill, Will, 참여 주도성이 비교적 고르게 섞인 모둠입니다.');
    }

    return feedback;
}

export function buildGroupRecommendation(
    profiles: GroupSurveyStudentProfile[],
    groupSize: number
): GroupRecommendationResult {
    const safeGroupSize = Math.min(5, Math.max(2, Math.round(groupSize || 4)));
    const readyProfiles = profiles
        .filter(isReadyProfile)
        .sort((a, b) =>
            b.skillScore - a.skillScore
            || b.willAvg - a.willAvg
            || b.agencyAvg - a.agencyAvg
            || a.student.number - b.student.number
        );
    const groupCount = Math.max(1, Math.ceil(readyProfiles.length / safeGroupSize));
    const buckets: GroupRecommendationMember[][] = Array.from({ length: groupCount }, () => []);

    readyProfiles.forEach((profile) => {
        const candidateIndex = buckets
            .map((group, index) => ({ index, group }))
            .filter(({ group }) => group.length < safeGroupSize)
            .sort((a, b) =>
                groupPressure(a.group) - groupPressure(b.group)
                || a.group.length - b.group.length
                || a.index - b.index
            )[0]?.index ?? 0;

        buckets[candidateIndex].push(toMember(profile));
    });

    const groups: GroupRecommendationGroup[] = buckets.map((members, index) => ({
        id: `recommended-group-${index + 1}`,
        title: `${index + 1}모둠`,
        members: members.sort((a, b) => a.number - b.number),
        feedback: analyzeGroupMembers(members),
    }));

    const excluded = profiles
        .filter((profile) => !isReadyProfile(profile))
        .map((profile) => ({
            studentId: profile.student.id,
            name: profile.student.name,
            reason: !profile.response ? '설문 미제출' : 'Skill 입력 대기',
        }));

    const summary = [
        `${readyProfiles.length}명을 ${groups.length}개 모둠으로 추천했습니다.`,
        excluded.length > 0
            ? `${excluded.length}명은 설문 또는 Skill 입력이 부족해 제외했습니다.`
            : '모든 응답 학생이 추천안에 포함되었습니다.',
    ];

    return {
        groups,
        excluded,
        summary,
        createdAt: new Date().toISOString(),
    };
}

export function recommendPartners(
    profiles: GroupSurveyStudentProfile[],
    selectedStudentId?: string
): PartnerRecommendation[] {
    if (!selectedStudentId) return [];
    const selected = profiles.find((profile) => profile.student.id === selectedStudentId);
    if (!selected || !isReadyProfile(selected)) return [];

    return profiles
        .filter((profile) => profile.student.id !== selectedStudentId && isReadyProfile(profile))
        .map((profile) => {
            const readyProfile = profile as GroupSurveyStudentProfile & {
                willAvg: number;
                agencyAvg: number;
                skillScore: SkillScore;
            };
            const reasons: string[] = [];
            let score = 0;

            if (selected.skillScore === 1 && readyProfile.skillScore >= 2) {
                score += 3;
                reasons.push('내용 확인을 함께하기 좋습니다.');
            } else if (selected.skillScore === 3 && readyProfile.skillScore <= 2) {
                score += 2;
                reasons.push('설명 역할과 연습 기회가 균형을 이룹니다.');
            } else if (Math.abs(selected.skillScore - readyProfile.skillScore) <= 1) {
                score += 1;
                reasons.push('학습 준비도 차이가 크지 않습니다.');
            }

            if (selected.willAvg < 2.5 && readyProfile.willAvg >= 3.5) {
                score += 3;
                reasons.push('역할과 시간을 챙기는 흐름을 보완할 수 있습니다.');
            } else if (selected.willAvg >= 3.5 && readyProfile.willAvg < 3.5) {
                score += 2;
                reasons.push('책임감 있는 참여 흐름을 나눌 수 있습니다.');
            } else {
                score += 1;
                reasons.push('활동 지속성의 리듬이 무난합니다.');
            }

            if (selected.agencyAvg >= 3.5 && readyProfile.agencyAvg >= 3.5) {
                score -= 1;
                reasons.push('둘 다 먼저 이끄는 편이라 역할 분담이 필요합니다.');
            } else if (selected.agencyAvg < 2.5 && readyProfile.agencyAvg >= 2.5) {
                score += 2;
                reasons.push('대화 시작을 도와줄 수 있습니다.');
            } else if (selected.agencyAvg >= 3.5 && readyProfile.agencyAvg < 3.5) {
                score += 2;
                reasons.push('말하기와 듣기 균형을 만들기 좋습니다.');
            } else {
                score += 1;
            }

            return {
                studentId: readyProfile.student.id,
                name: readyProfile.student.name,
                number: readyProfile.student.number,
                score,
                reasons,
            };
        })
        .sort((a, b) => b.score - a.score || a.number - b.number)
        .slice(0, 5);
}

export function analyzeCurrentAssignments(
    assignments: ObservationBoardMentorAssignment[],
    profiles: GroupSurveyStudentProfile[]
): GroupRecommendationGroup[] {
    const profileByStudentId = new Map(profiles.filter(isReadyProfile).map((profile) => [profile.student.id, profile]));

    return assignments.map((assignment, index) => {
        const studentIds = Array.isArray(assignment.members) && assignment.members.length > 0
            ? assignment.members.map((member) => member.studentId)
            : [assignment.mentorId, assignment.menteeId].filter(Boolean) as string[];
        const members = studentIds
            .map((studentId) => {
                const profile = profileByStudentId.get(studentId);
                return profile ? toMember(profile) : null;
            })
            .filter(Boolean) as GroupRecommendationMember[];

        return {
            id: assignment.id || `current-group-${index + 1}`,
            title: assignment.title || `${index + 1}모둠`,
            members,
            feedback: members.length > 0
                ? analyzeGroupMembers(members)
                : ['설문/Skill 자료가 있는 학생이 아직 없습니다.'],
        };
    });
}

export function recommendationGroupsToMentorAssignments(
    groups: GroupRecommendationGroup[]
): ObservationBoardMentorAssignment[] {
    return groups.map((group, groupIndex) => ({
        id: `group-${groupIndex + 1}`,
        title: `${groupIndex + 1}모둠`,
        mentorId: group.members[0]?.studentId,
        menteeId: group.members[1]?.studentId,
        members: group.members.map((member, memberIndex) => ({
            studentId: member.studentId,
            role: memberIndex === 0 ? 'mentor' : memberIndex === 1 ? 'mentee' : 'member',
            order: memberIndex,
        })),
    }));
}
