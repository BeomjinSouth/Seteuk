'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    CheckCircle2,
    ClipboardCopy,
    Link2,
    Loader2,
    Lock,
    RefreshCw,
    Unlock,
    Users,
} from 'lucide-react';
import {
    buildSurveyProfiles,
    getAgencySizeLabel,
    getPointSize,
    getSkillLabel,
    getWillLevel,
} from '@/lib/group-survey';
import { getStudentsInTeachingClass } from '@/lib/teacher-context';
import type {
    ClassGroup,
    GroupStudentSkillScore,
    GroupSurveyResponse,
    GroupSurveySession,
    GroupSurveyStudentProfile,
    SkillScore,
    Student,
} from '@/types';
import styles from './GroupSurveyDashboard.module.css';

interface GroupSurveyDashboardProps {
    teacherClasses: ClassGroup[];
    teacherStudents: Student[];
    selectedClassId: string;
    onClassChange: (classId: string) => void;
}

interface TeacherPayload {
    success?: boolean;
    sessions?: GroupSurveySession[];
    activeSessionId?: string | null;
    responses?: GroupSurveyResponse[];
    skills?: GroupStudentSkillScore[];
    session?: GroupSurveySession;
    skill?: GroupStudentSkillScore;
    error?: string;
}

const skillOptions: SkillScore[] = [1, 2, 3];

function formatAvg(value?: number) {
    return value ? value.toFixed(2) : '-';
}

function getSurveyLink(accessCode?: string) {
    if (!accessCode || typeof window === 'undefined') return '';
    return `${window.location.origin}/group-survey/${accessCode}`;
}

function getCoordinate(profile: GroupSurveyStudentProfile) {
    if (!profile.skillScore || !profile.willAvg || !profile.agencyAvg) return null;
    const x = ((profile.skillScore - 1) / 2) * 78 + 11;
    const y = 91 - ((profile.willAvg - 1) / 4) * 82;
    const size = getPointSize(profile.agencyAvg);
    return { x, y, size };
}

export function GroupSurveyDashboard({
    teacherClasses,
    teacherStudents,
    selectedClassId,
    onClassChange,
}: GroupSurveyDashboardProps) {
    const selectedClass = teacherClasses.find((cls) => cls.id === selectedClassId) ?? teacherClasses[0];
    const classStudents = useMemo(
        () => selectedClass ? getStudentsInTeachingClass(teacherStudents, selectedClass) : [],
        [selectedClass, teacherStudents]
    );
    const [sessions, setSessions] = useState<GroupSurveySession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [responses, setResponses] = useState<GroupSurveyResponse[]>([]);
    const [skills, setSkills] = useState<GroupStudentSkillScore[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [message, setMessage] = useState('');

    const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
    const surveyLink = getSurveyLink(activeSession?.accessCode);
    const profiles = useMemo(
        () => buildSurveyProfiles({ students: classStudents, responses, skills }),
        [classStudents, responses, skills]
    );
    const plottedProfiles = profiles.filter((profile) => getCoordinate(profile));
    const submittedCount = profiles.filter((profile) => profile.response).length;
    const missingResponseCount = profiles.length - submittedCount;
    const missingSkillProfiles = profiles.filter((profile) => profile.response && !profile.skillScore);
    const meanWill = responses.length > 0
        ? responses.reduce((sum, response) => sum + response.willAvg, 0) / responses.length
        : 0;
    const selectedProfile = profiles.find((profile) => profile.student.id === selectedStudentId);

    useEffect(() => {
        const firstPlotted = plottedProfiles[0]?.student.id || '';
        if (!selectedStudentId || !plottedProfiles.some((profile) => profile.student.id === selectedStudentId)) {
            setSelectedStudentId(firstPlotted);
        }
    }, [plottedProfiles, selectedStudentId]);

    const loadSurveyState = async (sessionId?: string) => {
        if (!selectedClass) return;
        setIsLoading(true);
        setMessage('');

        try {
            const params = new URLSearchParams({ classId: selectedClass.id });
            if (sessionId) params.set('sessionId', sessionId);
            const response = await fetch(`/api/group-survey/teacher?${params.toString()}`, {
                cache: 'no-store',
            });
            const payload = await response.json() as TeacherPayload;
            if (!response.ok || !payload.success) {
                setMessage(payload.error || '설문 정보를 불러오지 못했습니다.');
                return;
            }

            setSessions(payload.sessions || []);
            setActiveSessionId(payload.activeSessionId || null);
            setResponses(payload.responses || []);
            setSkills(payload.skills || []);
        } catch (error) {
            console.error('Load group survey dashboard failed:', error);
            setMessage('설문 정보를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadSurveyState();
    }, [selectedClass?.id]);

    const runTeacherAction = async (body: Record<string, unknown>) => {
        setIsWorking(true);
        setMessage('');

        try {
            const response = await fetch('/api/group-survey/teacher', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const payload = await response.json() as TeacherPayload;
            if (!response.ok || !payload.success) {
                setMessage(payload.error || '작업을 처리하지 못했습니다.');
                return null;
            }
            return payload;
        } catch (error) {
            console.error('Group survey teacher action failed:', error);
            setMessage('작업을 처리하지 못했습니다.');
            return null;
        } finally {
            setIsWorking(false);
        }
    };

    const handleCreateSession = async () => {
        if (!selectedClass) return;
        const payload = await runTeacherAction({
            action: 'create_session',
            classId: selectedClass.id,
            grade: selectedClass.grade,
            classNumber: selectedClass.classNumber,
        });
        if (!payload) return;
        setSessions(payload.sessions || []);
        setActiveSessionId(payload.activeSessionId || payload.session?.id || null);
        setResponses(payload.responses || []);
        setSkills(payload.skills || []);
        setMessage('새 설문 링크를 만들었습니다.');
    };

    const handleStatusChange = async (status: 'open' | 'closed') => {
        if (!activeSession) return;
        const payload = await runTeacherAction({
            action: 'set_status',
            sessionId: activeSession.id,
            status,
        });
        if (!payload?.session) return;
        setSessions((prev) => prev.map((session) => (
            session.id === payload.session?.id ? payload.session : session
        )));
    };

    const handleSkillChange = async (studentId: string, skillScore: SkillScore) => {
        if (!selectedClass) return;
        const payload = await runTeacherAction({
            action: 'save_skill',
            classId: selectedClass.id,
            studentId,
            skillScore,
        });
        if (!payload?.skill) return;
        setSkills((prev) => {
            const next = prev.filter((skill) => skill.studentId !== studentId);
            return [...next, payload.skill as GroupStudentSkillScore];
        });
    };

    const handleCopyLink = async () => {
        if (!surveyLink) return;
        await navigator.clipboard?.writeText(surveyLink);
        setMessage('설문 링크를 복사했습니다.');
    };

    if (!selectedClass) {
        return (
            <section className={styles.emptyState}>
                <Users size={42} />
                <h2>먼저 담당 학급을 등록해 주세요</h2>
                <p>학생 관리에서 담당 학급을 연결하면 학급별 좌표평면을 볼 수 있습니다.</p>
            </section>
        );
    }

    return (
        <section className={styles.dashboard}>
            <div className={styles.topBar}>
                <div>
                    <h2>학급별 Skill-Will 좌표</h2>
                    <p>선택한 학급 학생들을 좌표평면 위의 점으로 확인합니다.</p>
                </div>
                <label className={styles.classSelect}>
                    학급
                    <select
                        value={selectedClass.id}
                        onChange={(event) => onClassChange(event.target.value)}
                    >
                        {teacherClasses.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                                {cls.grade}학년 {cls.classNumber}반
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className={styles.linkPanel}>
                <div>
                    <span className={styles.panelIcon}><Link2 size={22} /></span>
                    <div>
                        <strong>{activeSession ? activeSession.accessCode : '설문 링크 없음'}</strong>
                        <p>{surveyLink || '학급용 설문 링크를 먼저 만들어 주세요.'}</p>
                    </div>
                </div>
                <div className={styles.linkActions}>
                    <button type="button" onClick={handleCreateSession} disabled={isWorking}>
                        {isWorking ? <Loader2 size={17} className={styles.spin} /> : <Link2 size={17} />}
                        새 링크
                    </button>
                    <button type="button" onClick={handleCopyLink} disabled={!surveyLink}>
                        <ClipboardCopy size={17} />
                        복사
                    </button>
                    {activeSession?.status === 'open' ? (
                        <button type="button" onClick={() => handleStatusChange('closed')} disabled={isWorking}>
                            <Lock size={17} />
                            마감
                        </button>
                    ) : (
                        <button type="button" onClick={() => handleStatusChange('open')} disabled={!activeSession || isWorking}>
                            <Unlock size={17} />
                            열기
                        </button>
                    )}
                </div>
            </div>

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.summaryGrid}>
                <SummaryTile label="전체 학생" value={`${profiles.length}명`} detail={`${selectedClass.grade}학년 ${selectedClass.classNumber}반`} />
                <SummaryTile label="좌표 표시" value={`${plottedProfiles.length}명`} detail="설문+Skill 완료" />
                <SummaryTile label="미응답" value={`${missingResponseCount}명`} detail="학생 설문 대기" />
                <SummaryTile label="Will 평균" value={meanWill ? meanWill.toFixed(2) : '-'} detail={getWillLevel(meanWill || undefined)} />
            </div>

            <div className={styles.mainGrid}>
                <article className={styles.planePanel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h3>좌표평면</h3>
                            <p>X축 Skill, Y축 Will, 점 크기는 참여 주도성입니다.</p>
                        </div>
                        <button type="button" onClick={() => loadSurveyState(activeSessionId || undefined)} disabled={isLoading}>
                            <RefreshCw size={16} className={isLoading ? styles.spin : ''} />
                        </button>
                    </div>

                    <div className={styles.coordinatePlane}>
                        <span className={styles.yAxisLabel}>Will 높음</span>
                        <span className={styles.yAxisLow}>Will 낮음</span>
                        <span className={styles.xAxisLow}>도움 필요</span>
                        <span className={styles.xAxisMid}>기본 가능</span>
                        <span className={styles.xAxisHigh}>설명 가능</span>
                        <div className={styles.midLineX} />
                        <div className={styles.midLineY} />
                        {plottedProfiles.length === 0 && (
                            <div className={styles.planeEmpty}>
                                설문 제출과 Skill 입력이 완료되면 학생 점이 표시됩니다.
                            </div>
                        )}
                        {plottedProfiles.map((profile) => {
                            const coordinate = getCoordinate(profile);
                            if (!coordinate) return null;
                            const selected = selectedStudentId === profile.student.id;
                            return (
                                <button
                                    key={profile.student.id}
                                    type="button"
                                    className={`${styles.point} ${selected ? styles.pointSelected : ''}`}
                                    style={{
                                        left: `${coordinate.x}%`,
                                        top: `${coordinate.y}%`,
                                        width: coordinate.size,
                                        height: coordinate.size,
                                    }}
                                    title={`${profile.student.number}번 ${profile.student.name} / ${getSkillLabel(profile.skillScore)} / Will ${formatAvg(profile.willAvg)} / ${getAgencySizeLabel(profile.agencyAvg)}`}
                                    onClick={() => setSelectedStudentId(profile.student.id)}
                                >
                                    {profile.student.number}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles.legend}>
                        <span><i className={styles.dotSmall} />참여 주도성 낮음</span>
                        <span><i className={styles.dotMedium} />참여 주도성 보통</span>
                        <span><i className={styles.dotLarge} />참여 주도성 높음</span>
                    </div>

                    {selectedProfile && (
                        <div className={styles.selectedCard}>
                            <strong>{selectedProfile.student.number}번 {selectedProfile.student.name}</strong>
                            <span>{getSkillLabel(selectedProfile.skillScore)} · Will {formatAvg(selectedProfile.willAvg)} · {getAgencySizeLabel(selectedProfile.agencyAvg)}</span>
                        </div>
                    )}
                </article>

                <aside className={styles.tablePanel}>
                    <div className={styles.panelHeader}>
                        <div>
                            <h3>학생 표시 상태</h3>
                            <p>학급 전체 학생을 확인하고, 좌표에 필요한 Skill만 빠르게 입력합니다.</p>
                        </div>
                    </div>

                    <div className={styles.statusList}>
                        {profiles.map((profile) => {
                            const isPlotted = Boolean(getCoordinate(profile));
                            return (
                                <div key={profile.student.id} className={styles.statusRow}>
                                    <button
                                        type="button"
                                        className={styles.statusName}
                                        onClick={() => isPlotted && setSelectedStudentId(profile.student.id)}
                                        disabled={!isPlotted}
                                    >
                                        <strong>{profile.student.number}번 {profile.student.name}</strong>
                                        <span>
                                            {profile.response ? (
                                                <>
                                                    <CheckCircle2 size={14} />
                                                    Will {formatAvg(profile.willAvg)}
                                                </>
                                            ) : '미응답'}
                                        </span>
                                    </button>
                                    <div className={styles.skillButtons}>
                                        {skillOptions.map((score) => (
                                            <button
                                                key={score}
                                                type="button"
                                                className={profile.skillScore === score ? styles.skillActive : ''}
                                                onClick={() => handleSkillChange(profile.student.id, score)}
                                                title={getSkillLabel(score)}
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {missingSkillProfiles.length > 0 && (
                        <div className={styles.excludedBox}>
                            <strong>Skill 입력 대기</strong>
                            <span>{missingSkillProfiles.map((profile) => `${profile.student.number}번 ${profile.student.name}`).join(', ')}</span>
                        </div>
                    )}
                </aside>
            </div>
        </section>
    );
}

function SummaryTile({ label, value, detail }: { label: string; value: string; detail: string }) {
    return (
        <article className={styles.summaryTile}>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>{detail}</em>
        </article>
    );
}
