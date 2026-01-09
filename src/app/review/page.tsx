'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Clock,
    FileText,
    Lock,
    Unlock,
    AlertTriangle,
    Search,
    Loader2,
    SpellCheck,
    ShieldAlert,
    Edit3,
    Save,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpellCheckModal, SpellError } from '@/components/SpellCheckModal';
import { SubjectRecord } from '@/types';
import styles from './page.module.css';

// Spell check using speller.town API
async function checkSpelling(text: string): Promise<SpellError[]> {
    try {
        const response = await fetch('/api/speller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();

            if (data.suggestions && data.suggestions.length > 0) {
                return data.suggestions.map((s: { id?: string; token: string; suggestions: string[]; type?: string; position?: { start: number; end: number } }, i: number) => ({
                    id: s.id || `err-${i}`,
                    original: s.token,
                    suggestions: s.suggestions,
                    context: text.slice(
                        Math.max(0, (s.position?.start || text.indexOf(s.token)) - 30),
                        Math.min(text.length, (s.position?.end || text.indexOf(s.token) + s.token.length) + 30)
                    ),
                    position: s.position || {
                        start: text.indexOf(s.token),
                        end: text.indexOf(s.token) + s.token.length
                    },
                    type: (s.type || 'spelling') as SpellError['type']
                }));
            }
        }
    } catch (error) {
        console.error('Speller API failed:', error);
    }

    return [];
}

// Forbidden word check
async function checkForbiddenWords(text: string): Promise<{ found: string[] }> {
    try {
        const response = await fetch('/api/forbidden', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();
            return { found: (data.issues || []).map((i: { word: string }) => i.word) };
        }
    } catch (error) {
        console.error('Forbidden check failed:', error);
    }

    // Fallback
    const maybeForbidden = ['최고', '가장', '천재', '완벽'];
    const found = maybeForbidden.filter(w => text.includes(w));
    return { found };
}

type TabType = 'all' | 'draft' | 'checked' | 'confirmed';

export default function ReviewPage() {
    const { classes, students, records, updateRecord, teacher } = useAppStore();

    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [selectedGradeClass, setSelectedGradeClass] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<string>('');

    // Spell check modal state
    const [spellCheckTarget, setSpellCheckTarget] = useState<SubjectRecord | null>(null);
    const [spellErrors, setSpellErrors] = useState<SpellError[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Get unique grade-class combinations from students
    const gradeClassTabs = useMemo(() => {
        const gradeClassSet = new Set<string>();
        students
            .filter(s => !teacher?.school || s.school === teacher.school)
            .forEach(s => {
                const grade = s.grade || 0;
                const classNum = s.classNumber || 0;
                if (grade > 0 && classNum > 0) {
                    gradeClassSet.add(`${grade}-${classNum}`);
                }
            });

        return Array.from(gradeClassSet).sort((a, b) => {
            const [gradeA, classA] = a.split('-').map(Number);
            const [gradeB, classB] = b.split('-').map(Number);
            if (gradeA !== gradeB) return gradeA - gradeB;
            return classA - classB;
        });
    }, [students, teacher]);

    // Filter records
    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchTab = activeTab === 'all' || r.status === activeTab;
            const student = students.find(s => s.id === r.studentId);

            // Filter by school
            const matchSchool = !teacher?.school || student?.school === teacher.school;

            // Filter by grade-class
            let matchGradeClass = true;
            if (selectedGradeClass !== 'all') {
                const [targetGrade, targetClass] = selectedGradeClass.split('-').map(Number);
                matchGradeClass = student?.grade === targetGrade && student?.classNumber === targetClass;
            }

            const matchSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
            return matchTab && matchSchool && matchGradeClass && (searchQuery === '' || matchSearch);
        }).sort((a, b) => {
            const studentA = students.find(s => s.id === a.studentId);
            const studentB = students.find(s => s.id === b.studentId);
            if ((studentA?.grade || 0) !== (studentB?.grade || 0)) {
                return (studentA?.grade || 0) - (studentB?.grade || 0);
            }
            if ((studentA?.classNumber || 0) !== (studentB?.classNumber || 0)) {
                return (studentA?.classNumber || 0) - (studentB?.classNumber || 0);
            }
            return (studentA?.number || 0) - (studentB?.number || 0);
        });
    }, [records, activeTab, searchQuery, students, teacher, selectedGradeClass]);

    // Tab counts
    const tabCounts = useMemo(() => ({
        all: records.filter(r => {
            const student = students.find(s => s.id === r.studentId);
            return !teacher?.school || student?.school === teacher.school;
        }).length,
        draft: records.filter(r => {
            const student = students.find(s => s.id === r.studentId);
            return r.status === 'draft' && (!teacher?.school || student?.school === teacher.school);
        }).length,
        checked: records.filter(r => {
            const student = students.find(s => s.id === r.studentId);
            return r.status === 'checked' && (!teacher?.school || student?.school === teacher.school);
        }).length,
        confirmed: records.filter(r => {
            const student = students.find(s => s.id === r.studentId);
            return r.status === 'confirmed' && (!teacher?.school || student?.school === teacher.school);
        }).length,
    }), [records, students, teacher]);

    // Run spell check
    const handleRunSpellCheck = async (record: SubjectRecord) => {
        setIsChecking(true);
        setSpellCheckTarget(record);

        const errors = await checkSpelling(record.content);
        setSpellErrors(errors);
        setIsChecking(false);

        if (errors.length === 0) {
            alert('맞춤법 오류가 발견되지 않았습니다.');
            setSpellCheckTarget(null);
        }
    };

    // Apply spell check changes
    const handleApplySpellChanges = (newText: string) => {
        if (spellCheckTarget) {
            updateRecord({
                ...spellCheckTarget,
                content: newText,
                status: 'checked',
                lastUpdated: new Date().toISOString(),
                checkResult: {
                    spellerErrors: 0,
                    forbiddenWords: spellCheckTarget.checkResult?.forbiddenWords || 0
                }
            });
        }
    };

    // Close spell check modal
    const closeSpellCheck = () => {
        setSpellCheckTarget(null);
        setSpellErrors([]);
    };

    // Confirm record
    const handleConfirm = (record: SubjectRecord) => {
        updateRecord({
            ...record,
            status: 'confirmed',
            lastUpdated: new Date().toISOString()
        });
    };

    // Bulk confirm for selected grade-class
    const handleBulkConfirm = () => {
        const toConfirm = filteredRecords.filter(r => r.status !== 'confirmed');
        if (toConfirm.length === 0) {
            alert('확정할 세특이 없습니다.');
            return;
        }

        if (!confirm(`${toConfirm.length}건의 세특을 일괄 확정하시겠습니까?`)) {
            return;
        }

        toConfirm.forEach(record => {
            updateRecord({
                ...record,
                status: 'confirmed',
                lastUpdated: new Date().toISOString()
            });
        });

        alert(`${toConfirm.length}건이 확정되었습니다.`);
    };

    // Unlock record
    const handleUnlock = (record: SubjectRecord) => {
        updateRecord({
            ...record,
            status: 'checked',
            lastUpdated: new Date().toISOString()
        });
    };

    // Start editing
    const handleStartEdit = (record: SubjectRecord) => {
        setEditingId(record.id);
        setEditingContent(record.content);
    };

    // Save edit
    const handleSaveEdit = (record: SubjectRecord) => {
        updateRecord({
            ...record,
            content: editingContent,
            status: record.status === 'confirmed' ? 'checked' : record.status,
            lastUpdated: new Date().toISOString()
        });
        setEditingId(null);
    };

    // Cancel edit
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingContent('');
    };

    // Get student info
    const getStudentInfo = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        const cls = classes.find(c => c.id === student?.classId);
        return { student, cls };
    };

    const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'all', label: '전체', icon: <FileText size={16} /> },
        { key: 'draft', label: '초안', icon: <Clock size={16} /> },
        { key: 'checked', label: '검사완료', icon: <SpellCheck size={16} /> },
        { key: 'confirmed', label: '확정', icon: <Lock size={16} /> },
    ];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>검토 및 확정</h1>
                    <p className={styles.subtitle}>세특 초안을 검토하고 최종 확정하세요.</p>
                </div>
            </header>

            {/* Grade-Class Tabs */}
            <div className={styles.gradeClassTabs}>
                <button
                    className={`${styles.gradeClassTab} ${selectedGradeClass === 'all' ? styles.activeGradeClass : ''}`}
                    onClick={() => setSelectedGradeClass('all')}
                >
                    전체
                </button>
                {gradeClassTabs.map(gc => {
                    const [grade, classNum] = gc.split('-').map(Number);
                    return (
                        <button
                            key={gc}
                            className={`${styles.gradeClassTab} ${selectedGradeClass === gc ? styles.activeGradeClass : ''}`}
                            onClick={() => setSelectedGradeClass(gc)}
                        >
                            {grade}-{classNum}
                        </button>
                    );
                })}

                {/* Bulk Confirm Button */}
                <Button
                    size="sm"
                    onClick={handleBulkConfirm}
                    style={{ marginLeft: 'auto' }}
                >
                    <CheckCircle2 size={14} />
                    {selectedGradeClass === 'all' ? '전체' : selectedGradeClass} 일괄 확정
                </Button>
            </div>

            {/* Status Tabs */}
            <div className={styles.tabs}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.icon}
                        {tab.label}
                        <span className={styles.tabCount}>{tabCounts[tab.key]}</span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className={styles.searchBar}>
                <Search size={18} />
                <input
                    type="text"
                    placeholder="학생 이름으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Records list */}
            {filteredRecords.length === 0 ? (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <h3>검토할 세특이 없습니다</h3>
                    <p>세특 작성 메뉴에서 AI 세특을 생성해 주세요.</p>
                </div>
            ) : (
                <div className={styles.recordsList}>
                    {filteredRecords.map((record, i) => {
                        const { student, cls } = getStudentInfo(record.studentId);
                        const isEditing = editingId === record.id;
                        const hasWarnings = (record.checkResult?.spellerErrors || 0) > 0 ||
                            (record.checkResult?.forbiddenWords || 0) > 0;

                        return (
                            <motion.div
                                key={record.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`${styles.recordCard} ${isEditing ? styles.editing : ''}`}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.studentInfo}>
                                        <span className={styles.classInfo}>
                                            {student?.grade || '-'}학년 {student?.classNumber || cls?.classNumber || '-'}반 {student?.number || '-'}번
                                        </span>
                                        <span className={styles.studentName}>{student?.name || '알 수 없음'}</span>
                                    </div>

                                    <div className={styles.badges}>
                                        {hasWarnings && record.status !== 'confirmed' && (
                                            <span className={styles.warningBadge}>
                                                <AlertTriangle size={14} />
                                                {record.checkResult?.spellerErrors || 0}개 맞춤법 /
                                                {record.checkResult?.forbiddenWords || 0}개 금지어
                                            </span>
                                        )}
                                        <span className={`${styles.statusBadge} ${styles[record.status]}`}>
                                            {record.status === 'draft' && '초안'}
                                            {record.status === 'checked' && '검사완료'}
                                            {record.status === 'confirmed' && (
                                                <><Lock size={12} /> 확정</>
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardContent}>
                                    {isEditing ? (
                                        <textarea
                                            className={styles.editArea}
                                            value={editingContent}
                                            onChange={(e) => setEditingContent(e.target.value)}
                                            rows={8}
                                            autoFocus
                                        />
                                    ) : (
                                        <p
                                            className={styles.preview}
                                            onClick={() => handleStartEdit(record)}
                                            title="클릭하여 수정"
                                        >
                                            {record.content}
                                        </p>
                                    )}
                                </div>

                                <div className={styles.cardActions}>
                                    {isEditing ? (
                                        <>
                                            <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                                                <X size={14} /> 취소
                                            </Button>
                                            <Button size="sm" onClick={() => handleSaveEdit(record)}>
                                                <Save size={14} /> 저장
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleRunSpellCheck(record)}
                                                disabled={isChecking && spellCheckTarget?.id === record.id}
                                            >
                                                {isChecking && spellCheckTarget?.id === record.id ? (
                                                    <><Loader2 size={14} className={styles.spinning} /> 검사 중</>
                                                ) : (
                                                    <><SpellCheck size={14} /> 맞춤법</>
                                                )}
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleStartEdit(record)}>
                                                <Edit3 size={14} /> 수정
                                            </Button>

                                            {record.status !== 'confirmed' ? (
                                                <Button size="sm" onClick={() => handleConfirm(record)}>
                                                    <CheckCircle2 size={14} /> 확정
                                                </Button>
                                            ) : (
                                                <Button variant="secondary" size="sm" onClick={() => handleUnlock(record)}>
                                                    <Unlock size={14} /> 해제
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

            {/* Spell Check Modal */}
            <SpellCheckModal
                isOpen={spellCheckTarget !== null && !isChecking && spellErrors.length > 0}
                onClose={closeSpellCheck}
                errors={spellErrors}
                originalText={spellCheckTarget?.content || ''}
                onApplyChanges={handleApplySpellChanges}
            />
        </div>
    );
}
