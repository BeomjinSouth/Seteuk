'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Lock, Search, ShieldAlert, SpellCheck, Unlock } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SpellCheckModal, SpellError } from '@/components/SpellCheckModal';
import { ForbiddenCheckModal } from '@/components/ForbiddenCheckModal';
import { HistoryModal } from '@/components/HistoryModal';
import { SubjectRecord } from '@/types';
import {
    applyCheckResultToRecord,
    checkForbiddenWordsRequest,
    performSpellCheckRequest,
} from '@/lib/check-utils';
import styles from './page.module.css';

type TabType = 'all' | 'draft' | 'checked' | 'confirmed';
const TAB_LABELS: Record<TabType, string> = {
    all: '전체',
    draft: '초안',
    checked: '검토완료',
    confirmed: '확정',
};

export default function ReviewPage() {
    const { classes, students, records, updateRecord, teacher, forbiddenWords } = useAppStore();

    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [selectedGradeClass, setSelectedGradeClass] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');

    const [spellCheckTarget, setSpellCheckTarget] = useState<SubjectRecord | null>(null);
    const [spellErrors, setSpellErrors] = useState<SpellError[]>([]);
    const [isChecking, setIsChecking] = useState(false);
    const [forbiddenTarget, setForbiddenTarget] = useState<{ studentId: string; issues: { word: string; suggestion: string; reason: string }[] } | null>(null);
    const [isForbiddenChecking, setIsForbiddenChecking] = useState<string | null>(null);
    const [historyTarget, setHistoryTarget] = useState<{ record: SubjectRecord; studentName: string } | null>(null);

    const gradeClassTabs = useMemo(() => {
        const countMap = new Map<string, number>();
        records.forEach((record) => {
            const student = students.find((item) => item.id === record.studentId);
            if (!student) return;
            if (teacher?.teacherKey && record.teacherKey && record.teacherKey !== teacher.teacherKey) return;
            if (teacher?.school && student.school !== teacher.school) return;
            const key = `${student.grade || 0}-${student.classNumber || 0}`;
            if (key === '0-0') return;
            countMap.set(key, (countMap.get(key) || 0) + 1);
        });

        return Array.from(countMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0], 'en'))
            .map(([value, count]) => ({ value, label: value, count }));
    }, [records, students, teacher]);

    const filteredRecords = useMemo(() => {
        return records
            .filter((record) => {
                const student = students.find((item) => item.id === record.studentId);
                if (!student) return false;
                if (teacher?.teacherKey && record.teacherKey && record.teacherKey !== teacher.teacherKey) return false;
                if (teacher?.school && student.school !== teacher.school) return false;
                if (activeTab !== 'all' && record.status !== activeTab) return false;
                if (selectedGradeClass !== 'all') {
                    const [grade, classNumber] = selectedGradeClass.split('-').map(Number);
                    if (student.grade !== grade || student.classNumber !== classNumber) return false;
                }
                if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => {
                const studentA = students.find((item) => item.id === a.studentId);
                const studentB = students.find((item) => item.id === b.studentId);
                if (!studentA || !studentB) return 0;
                if ((studentA.grade || 0) !== (studentB.grade || 0)) return (studentA.grade || 0) - (studentB.grade || 0);
                if ((studentA.classNumber || 0) !== (studentB.classNumber || 0)) return (studentA.classNumber || 0) - (studentB.classNumber || 0);
                return (studentA.number || 0) - (studentB.number || 0);
            });
    }, [records, students, teacher, activeTab, selectedGradeClass, searchQuery]);

    const tabCounts = useMemo(() => ({
        all: records.filter((record) => !teacher?.teacherKey || !record.teacherKey || record.teacherKey === teacher.teacherKey).length,
        draft: records.filter((record) => record.status === 'draft' && (!teacher?.teacherKey || !record.teacherKey || record.teacherKey === teacher.teacherKey)).length,
        checked: records.filter((record) => record.status === 'checked' && (!teacher?.teacherKey || !record.teacherKey || record.teacherKey === teacher.teacherKey)).length,
        confirmed: records.filter((record) => record.status === 'confirmed' && (!teacher?.teacherKey || !record.teacherKey || record.teacherKey === teacher.teacherKey)).length,
    }), [records, teacher?.teacherKey]);

    const handleRunSpellCheck = async (record: SubjectRecord) => {
        setIsChecking(true);
        try {
            const errors = await performSpellCheckRequest(record.content);
            const updatedRecord = applyCheckResultToRecord(record, { spellerErrors: errors.length });
            updateRecord(updatedRecord);
            setSpellErrors(errors);
            setSpellCheckTarget(updatedRecord);

            if (errors.length === 0) {
                alert('맞춤법 오류가 없습니다.');
                setSpellCheckTarget(null);
            }
        } catch (error) {
            console.error('Spell check failed:', error);
            alert('맞춤법 검사에 실패했습니다. 결과가 저장되지 않았으니 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsChecking(false);
        }
    };

    const handleApplySpellChanges = (newText: string) => {
        if (!spellCheckTarget) return;
        updateRecord(applyCheckResultToRecord(spellCheckTarget, { spellerErrors: 0 }, newText));
    };

    const handleForbiddenCheck = async (record: SubjectRecord) => {
        setIsForbiddenChecking(record.studentId);
        try {
            const issues = await checkForbiddenWordsRequest(record.content, forbiddenWords);
            const updatedRecord = applyCheckResultToRecord(record, { forbiddenWords: issues.length });
            updateRecord(updatedRecord);

            if (issues.length > 0) {
                setForbiddenTarget({ studentId: record.studentId, issues });
            } else {
                alert('금지어가 없습니다.');
            }
        } catch (error) {
            console.error('Forbidden check failed:', error);
            alert('금지어 검사에 실패했습니다. 결과가 저장되지 않았으니 잠시 후 다시 시도해 주세요.');
        } finally {
            setIsForbiddenChecking(null);
        }
    };

    const handleConfirm = (record: SubjectRecord) => {
        updateRecord({ ...record, status: 'confirmed', lastUpdated: new Date().toISOString() });
    };

    const handleUnlock = (record: SubjectRecord) => {
        updateRecord({ ...record, status: 'checked', lastUpdated: new Date().toISOString() });
    };

    const handleBulkConfirm = () => {
        const targets = filteredRecords.filter((record) => record.status !== 'confirmed');
        if (targets.length === 0) return;
        targets.forEach((record) => {
            updateRecord({ ...record, status: 'confirmed', lastUpdated: new Date().toISOString() });
        });
    };

    const handleSaveEdit = (record: SubjectRecord) => {
        updateRecord({
            ...record,
            content: editingContent,
            status: record.status === 'confirmed' ? 'checked' : record.status,
            lastUpdated: new Date().toISOString(),
        });
        setEditingId(null);
        setEditingContent('');
    };

    const getStudentInfo = (studentId: string) => {
        const student = students.find((item) => item.id === studentId);
        const cls = classes.find((item) => item.id === student?.classId);
        return { student, cls };
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>검토/확정</h1>
                    <p className={styles.subtitle}>맞춤법과 금지어를 확인해 확정합니다.</p>
                </div>
            </header>

            <div className={styles.gradeClassTabs}>
                <button className={`${styles.gradeClassTab} ${selectedGradeClass === 'all' ? styles.activeGradeClass : ''}`} onClick={() => setSelectedGradeClass('all')}>
                    전체
                </button>
                {gradeClassTabs.map((tab) => (
                    <button key={tab.value} className={`${styles.gradeClassTab} ${selectedGradeClass === tab.value ? styles.activeGradeClass : ''}`} onClick={() => setSelectedGradeClass(tab.value)}>
                        {tab.label} <span className={styles.tabCount}>{tab.count}</span>
                    </button>
                ))}
                <Button size="sm" onClick={handleBulkConfirm} style={{ marginLeft: 'auto' }}>
                    <CheckCircle2 size={14} /> 필터 대상 일괄 확정
                </Button>
            </div>

            <div className={styles.tabs}>
                {(['all', 'draft', 'checked', 'confirmed'] as TabType[]).map((tab) => (
                    <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`} onClick={() => setActiveTab(tab)}>
                        {TAB_LABELS[tab]} <span className={styles.tabCount}>{tabCounts[tab]}</span>
                    </button>
                ))}
            </div>

            <div className={styles.searchBar}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="학생 이름 검색..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />
            </div>

            {filteredRecords.length === 0 ? (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <h3>표시할 기록이 없습니다.</h3>
                </div>
            ) : (
                <div className={styles.recordsList}>
                    {filteredRecords.map((record, index) => {
                        const { student, cls } = getStudentInfo(record.studentId);
                        const isEditing = editingId === record.id;
                        const spellCount = record.checkResult?.spellerErrors || 0;
                        const forbiddenCount = record.checkResult?.forbiddenWords || 0;
                        return (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.02 }}
                                className={styles.recordCard}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.studentInfo}>
                                        <span className={styles.classInfo}>{student?.grade || '-'}-{student?.classNumber || cls?.classNumber || '-'}-{student?.number || '-'}</span>
                                        <span className={styles.studentName}>{student?.name || '이름 없음'}</span>
                                    </div>
                                    <div className={styles.badges}>
                                        {spellCount > 0 && <span className={styles.warningBadge}>맞춤법 {spellCount}</span>}
                                        {forbiddenCount > 0 && (
                                            <button className={styles.warningBadge} onClick={() => handleForbiddenCheck(record)} disabled={isForbiddenChecking === record.studentId}>
                                                <ShieldAlert size={14} /> 금지어 {forbiddenCount}
                                            </button>
                                        )}
                                        <span className={`${styles.statusBadge} ${styles[record.status]}`}>
                                            {record.status === 'confirmed'
                                                ? <><Lock size={12} /> 확정</>
                                                : TAB_LABELS[record.status as TabType]}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    {isEditing ? (
                                        <textarea
                                            className={styles.editArea}
                                            value={editingContent}
                                            onChange={(event) => setEditingContent(event.target.value)}
                                            rows={8}
                                            autoFocus
                                        />
                                    ) : (
                                        <div className={styles.preview} onClick={() => { setEditingId(record.id); setEditingContent(record.content); }}>
                                            {record.content}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    {isEditing ? (
                                        <>
                                            <Button variant="secondary" size="sm" onClick={() => { setEditingId(null); setEditingContent(''); }}>
                                                취소
                                            </Button>
                                            <Button size="sm" onClick={() => handleSaveEdit(record)}>
                                                저장
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button variant="secondary" size="sm" onClick={() => handleRunSpellCheck(record)} disabled={isChecking && spellCheckTarget?.id === record.id}>
                                                <SpellCheck size={14} /> 맞춤법
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => { setEditingId(record.id); setEditingContent(record.content); }}>
                                                수정
                                            </Button>
                                            {record.history && record.history.length > 0 && (
                                                <Button variant="ghost" size="sm" onClick={() => setHistoryTarget({ record, studentName: student?.name || '' })}>
                                                    이력
                                                </Button>
                                            )}
                                            {record.status !== 'confirmed' ? (
                                                <Button size="sm" onClick={() => handleConfirm(record)}>
                                                    <CheckCircle2 size={14} /> 확정
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" size="sm" onClick={() => handleUnlock(record)}>
                                                    <Unlock size={14} /> 확정 해제
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <SpellCheckModal
                isOpen={spellCheckTarget !== null && !isChecking && spellErrors.length > 0}
                onClose={() => { setSpellCheckTarget(null); setSpellErrors([]); }}
                errors={spellErrors}
                originalText={spellCheckTarget?.content || ''}
                onApplyChanges={handleApplySpellChanges}
            />

            <HistoryModal
                isOpen={historyTarget !== null}
                onClose={() => setHistoryTarget(null)}
                currentContent={historyTarget?.record.content || ''}
                history={historyTarget?.record.history || []}
                studentName={historyTarget?.studentName || ''}
                onRestore={(content) => {
                    if (!historyTarget) return;
                    updateRecord({ ...historyTarget.record, content, lastUpdated: new Date().toISOString() });
                }}
            />

            <ForbiddenCheckModal
                isOpen={!!forbiddenTarget}
                onClose={() => setForbiddenTarget(null)}
                results={forbiddenTarget ? new Map([[forbiddenTarget.studentId, forbiddenTarget.issues]]) : new Map()}
                studentNames={new Map(students.map((student) => [student.id, student.name]))}
            />
        </div>
    );
}
