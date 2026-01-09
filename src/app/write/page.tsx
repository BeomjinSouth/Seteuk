'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    Search,
    CheckSquare,
    Square,
    Loader2,
    AlertCircle,
    SpellCheck,
    ShieldAlert,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SpellCheckModal, SpellError } from '@/components/SpellCheckModal';
import { SubjectRecord } from '@/types';
import styles from './page.module.css';

// Get stored settings
function getAISettings() {
    if (typeof window === 'undefined') return { systemPrompt: '', model: 'gpt-5.2', temperature: 0.7 };

    return {
        systemPrompt: localStorage.getItem('ai_system_prompt') || '',
        model: localStorage.getItem('ai_model') || 'gpt-5.2',
        temperature: parseFloat(localStorage.getItem('ai_temperature') || '0.7'),
    };
}

// AI generation using GPT-5.2 API with settings
async function generateDraft(
    studentName: string,
    subjectName: string,
    learningData: Record<string, string>,
    exampleTemplate: string,
    curriculumContent?: string  // What students learn in this grade/semester
): Promise<string> {
    const settings = getAISettings();

    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName,
                subjectName,
                learningData,
                exampleTemplates: exampleTemplate ? [exampleTemplate] : [],
                curriculumContent,  // Include grade/semester curriculum
                model: settings.model,
                systemPrompt: settings.systemPrompt,
                temperature: settings.temperature,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.content;
        }
    } catch (error) {
        console.error('API call failed, using fallback:', error);
    }

    // Fallback for development or API failure
    await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

    // Build content from learning data
    const dataEntries = Object.entries(learningData)
        .filter(([_, v]) => v && v.trim())
        .map(([k, v]) => v)
        .join(' ');

    const baseContent = dataEntries || '수업에 성실하게 참여함';

    return `${studentName} 학생은 ${baseContent}. 특히 탐구 활동에서 적극적으로 참여하여 ${subjectName || '해당 과목'} 현상에 대한 깊은 이해를 보여주었습니다. 실험 과정에서 정확한 관찰력과 논리적인 분석 능력을 발휘하였고, 조별 활동에서는 동료들과 협력하여 문제를 해결하는 협동심을 보였습니다.`;
}

// Spell check using speller.town API
async function performSpellCheck(text: string): Promise<SpellError[]> {
    console.log('[Speller API] 요청 시작, 텍스트 길이:', text.length);
    
    try {
        const response = await fetch('/api/speller', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        console.log('[Speller API] 응답 상태:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('[Speller API] 응답 데이터:', JSON.stringify(data, null, 2));

            // API 에러 메시지가 있으면 표시
            if (data.error) {
                console.warn('[Speller API] 서버 에러:', data.error);
            }

            if (data.suggestions && data.suggestions.length > 0) {
                console.log('[Speller API] suggestions 원본:', JSON.stringify(data.suggestions, null, 2));
                
                const errors = data.suggestions
                    .filter((s: { token?: string; suggestions?: string[] }) => {
                        const hasToken = s && s.token;
                        if (!hasToken) {
                            console.warn('[Speller API] token 없는 항목 필터링됨:', s);
                        }
                        return hasToken;
                    })
                    .map((s: { id?: string; token: string; suggestions?: string[]; type?: string; position?: { start: number; end: number }; description?: string }, i: number) => ({
                        id: s.id || `err-${i}`,
                        original: s.token,
                        suggestions: s.suggestions || [],
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
                console.log('[Speller API] 변환된 오류:', errors.length, '개');
                return errors;
            } else {
                console.log('[Speller API] suggestions가 비어있음');
            }
        } else {
            console.error('[Speller API] 응답 실패:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('[Speller API] 요청 실패:', error);
    }

    return [];
}

// Forbidden word check
async function checkForbiddenWords(text: string): Promise<{ word: string; suggestion: string }[]> {
    try {
        const response = await fetch('/api/forbidden', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.issues || [];
        }
    } catch (error) {
        console.error('Forbidden check failed:', error);
    }

    // Fallback local check
    const forbidden = ['최고', '가장', '천재', '완벽', '1등'];
    const found: { word: string; suggestion: string }[] = [];

    for (const word of forbidden) {
        if (text.includes(word)) {
            found.push({ word, suggestion: '해당 표현 삭제 권장' });
        }
    }

    return found;
}

export default function WritePage() {
    const searchParams = useSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _classFilter = searchParams.get('classId');  // Kept for URL parameter support

    const { classes, students, records, updateRecord, updateStudentLearningData, exampleTemplate, teacher, getCurriculumContent } = useAppStore();

    const [selectedSemester, setSelectedSemester] = useState<'1' | '2'>('2');  // 학기 선택
    const [selectedGradeClass, setSelectedGradeClass] = useState<string>('all');  // 학년-반 선택
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
    const [generatingIds, setGeneratingIds] = useState<Set<string>>(new Set());
    const [editingCell, setEditingCell] = useState<{ studentId: string; field: 'data' | 'content' } | null>(null);
    const [editValue, setEditValue] = useState('');

    // Spell check modal state
    const [spellCheckTarget, setSpellCheckTarget] = useState<SubjectRecord | null>(null);
    const [spellErrors, setSpellErrors] = useState<SpellError[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Bulk check states
    const [isBulkChecking, setIsBulkChecking] = useState(false);
    const [bulkCheckType, setBulkCheckType] = useState<'spell' | 'forbidden' | null>(null);
    const [forbiddenResults, setForbiddenResults] = useState<Map<string, { word: string; suggestion: string }[]>>(new Map());

    // Get unique grade-class combinations from students, sorted
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

        // Sort by grade first, then by class number
        return Array.from(gradeClassSet).sort((a, b) => {
            const [gradeA, classA] = a.split('-').map(Number);
            const [gradeB, classB] = b.split('-').map(Number);
            if (gradeA !== gradeB) return gradeA - gradeB;
            return classA - classB;
        });
    }, [students, teacher]);

    // Filter students - only show students from the same school as logged-in teacher
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchSchool = !teacher?.school || s.school === teacher.school;
            // Filter by grade-class if selected
            let matchGradeClass = true;
            if (selectedGradeClass !== 'all') {
                const [targetGrade, targetClass] = selectedGradeClass.split('-').map(Number);
                matchGradeClass = s.grade === targetGrade && s.classNumber === targetClass;
            }
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSchool && matchGradeClass && matchSearch;
        }).sort((a, b) => {
            // Sort by grade, then class, then student number
            if ((a.grade || 0) !== (b.grade || 0)) {
                return (a.grade || 0) - (b.grade || 0);
            }
            if ((a.classNumber || 0) !== (b.classNumber || 0)) {
                return (a.classNumber || 0) - (b.classNumber || 0);
            }
            return a.number - b.number;
        });
    }, [students, selectedGradeClass, searchQuery, teacher]);

    // Toggle student selection
    const toggleStudent = (id: string) => {
        const newSet = new Set(selectedStudents);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedStudents(newSet);
    };

    // Select all
    const toggleSelectAll = () => {
        if (selectedStudents.size === filteredStudents.length) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
        }
    };

    // Generate drafts for selected students
    const handleGenerateDrafts = async () => {
        const toGenerate = Array.from(selectedStudents);
        setGeneratingIds(new Set(toGenerate));

        for (const studentId of toGenerate) {
            const student = students.find(s => s.id === studentId);
            if (!student) continue;

            try {
                const cls = classes.find(c => c.id === student.classId);

                // Get curriculum content for this student's grade and selected semester
                const studentGrade = student.grade || cls?.grade || 1;
                const semester: 1 | 2 = selectedSemester === '1' ? 1 : 2;
                const curriculumData = getCurriculumContent(studentGrade, semester);

                console.log(`Generating for ${student.name}: grade=${studentGrade}, semester=${semester}, curriculum=${curriculumData?.content?.substring(0, 50)}...`);

                const content = await generateDraft(
                    student.name,
                    cls?.subjectName || '',
                    student.learningData,
                    exampleTemplate,
                    curriculumData?.content  // Pass curriculum content for grade/semester
                );

                const newRecord: SubjectRecord = {
                    id: `r-${studentId}`,
                    studentId,
                    classId: student.classId,
                    content,
                    status: 'draft',
                    lastUpdated: new Date().toISOString()
                };

                updateRecord(newRecord);
            } catch (error) {
                console.error('Generation failed for', studentId, error);
            }

            setGeneratingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(studentId);
                return newSet;
            });
        }

        setSelectedStudents(new Set());
    };

    // Bulk spell check for selected students
    const handleBulkSpellCheck = async () => {
        const toCheck = Array.from(selectedStudents);
        if (toCheck.length === 0) {
            alert('맞춤법 검사할 학생을 선택해주세요.');
            return;
        }

        setIsBulkChecking(true);
        setBulkCheckType('spell');

        // Check the first student's record that has content
        for (const studentId of toCheck) {
            const record = records.find(r => r.studentId === studentId);
            if (record && record.content) {
                const errors = await performSpellCheck(record.content);
                if (errors.length > 0) {
                    setSpellCheckTarget(record);
                    setSpellErrors(errors);
                    break;
                }
            }
        }

        setIsBulkChecking(false);
        setBulkCheckType(null);
    };

    // Bulk forbidden word check
    const handleBulkForbiddenCheck = async () => {
        const toCheck = Array.from(selectedStudents);
        if (toCheck.length === 0) {
            alert('금지어 검사할 학생을 선택해주세요.');
            return;
        }

        setIsBulkChecking(true);
        setBulkCheckType('forbidden');

        const results = new Map<string, { word: string; suggestion: string }[]>();
        let foundCount = 0;

        for (const studentId of toCheck) {
            const record = records.find(r => r.studentId === studentId);
            if (record && record.content) {
                const issues = await checkForbiddenWords(record.content);
                if (issues.length > 0) {
                    results.set(studentId, issues);
                    foundCount += issues.length;
                }
            }
        }

        setForbiddenResults(results);
        setIsBulkChecking(false);
        setBulkCheckType(null);

        if (foundCount === 0) {
            alert('검사 완료: 금지어가 발견되지 않았습니다.');
        } else {
            alert(`검사 완료: ${results.size}명의 세특에서 총 ${foundCount}개의 금지어가 발견되었습니다.`);
        }
    };

    // Spell check for a single record
    const handleSpellCheck = async (record: SubjectRecord) => {
        console.log('[맞춤법 검사] 시작:', record.content.substring(0, 50) + '...');
        setIsChecking(true);
        setSpellCheckTarget(record);

        const errors = await performSpellCheck(record.content);
        console.log('[맞춤법 검사] 결과:', errors.length, '개 오류 발견', errors);
        setSpellErrors(errors);
        setIsChecking(false);

        if (errors.length === 0) {
            alert('맞춤법 오류가 없습니다!');
            setSpellCheckTarget(null);
        }
    };

    // Apply spell check changes
    const handleApplySpellChanges = (newText: string) => {
        if (spellCheckTarget) {
            updateRecord({
                ...spellCheckTarget,
                content: newText,
                lastUpdated: new Date().toISOString()
            });
        }
    };

    // Get record for student
    const getStudentRecord = (studentId: string) => {
        return records.find(r => r.studentId === studentId);
    };

    // Start editing
    const startEdit = (studentId: string, field: 'data' | 'content', value: string) => {
        setEditingCell({ studentId, field });
        setEditValue(value);
    };

    // Save edit
    const saveEdit = (studentId: string, field: 'data' | 'content') => {
        const student = students.find(s => s.id === studentId);
        if (!student) {
            setEditingCell(null);
            return;
        }

        if (field === 'data') {
            // Save learning data - parse as customData
            updateStudentLearningData(studentId, { customData: editValue });
        } else if (field === 'content') {
            const record = getStudentRecord(studentId);

            if (record) {
                updateRecord({
                    ...record,
                    content: editValue,
                    lastUpdated: new Date().toISOString()
                });
            } else {
                const newRecord: SubjectRecord = {
                    id: `r-${studentId}`,
                    studentId,
                    classId: student.classId,
                    content: editValue,
                    status: 'draft',
                    lastUpdated: new Date().toISOString()
                };
                updateRecord(newRecord);
            }
        }

        setEditingCell(null);
    };

    return (
        <div className={styles.page}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.schoolInfo}>
                    <span className={styles.schoolBadge} suppressHydrationWarning>{teacher?.school || '고등학교'}</span>
                    <span className={styles.teacherName} suppressHydrationWarning>{teacher?.name || '선생님'}</span>
                </div>
                <div className={styles.headerRight}>
                    {/* 학기 선택 */}
                    <select
                        className={styles.semesterSelect}
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(e.target.value as '1' | '2')}
                    >
                        <option value="1">1학기</option>
                        <option value="2">2학기</option>
                    </select>
                    <span className={styles.aiLabel}>AI 생성용 데이터 삭제</span>
                    <Button variant="secondary" size="sm">
                        <Trash2 size={14} />
                    </Button>
                </div>
            </header>

            {/* Grade-Class Tabs */}
            <div className={styles.subjectTabs}>
                <button
                    className={`${styles.subjectTab} ${selectedGradeClass === 'all' ? styles.active : ''}`}
                    onClick={() => setSelectedGradeClass('all')}
                >
                    전체 <span className={styles.tabCount}>{students.filter(s => !teacher?.school || s.school === teacher.school).length}</span>
                </button>
                {gradeClassTabs.map(gc => {
                    const [grade, classNum] = gc.split('-').map(Number);
                    const count = students.filter(s =>
                        (!teacher?.school || s.school === teacher.school) &&
                        s.grade === grade &&
                        s.classNumber === classNum
                    ).length;
                    return (
                        <button
                            key={gc}
                            className={`${styles.subjectTab} ${selectedGradeClass === gc ? styles.active : ''}`}
                            onClick={() => setSelectedGradeClass(gc)}
                        >
                            {grade}-{classNum} <span className={styles.tabCount}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {/* Action Bar */}
            <div className={styles.actionBar}>
                <div className={styles.actionLeft}>
                    <button
                        className={styles.selectAllBtn}
                        onClick={toggleSelectAll}
                    >
                        {selectedStudents.size === filteredStudents.length && filteredStudents.length > 0 ? (
                            <CheckSquare size={18} />
                        ) : (
                            <Square size={18} />
                        )}
                        전체 선택
                    </button>

                    <Button
                        onClick={handleGenerateDrafts}
                        disabled={selectedStudents.size === 0 || generatingIds.size > 0}
                        isLoading={generatingIds.size > 0}
                    >
                        <Sparkles size={16} /> AI 세특 생성
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleBulkSpellCheck}
                        disabled={isBulkChecking}
                        isLoading={isBulkChecking && bulkCheckType === 'spell'}
                    >
                        <SpellCheck size={16} /> 맞춤법 검사
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleBulkForbiddenCheck}
                        disabled={isBulkChecking}
                        isLoading={isBulkChecking && bulkCheckType === 'forbidden'}
                    >
                        <ShieldAlert size={16} /> 기재 금지어 검사
                    </Button>
                </div>

                <div className={styles.searchBox}>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="이름 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Progress indicator */}
            <AnimatePresence>
                {generatingIds.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className={styles.progressBar}
                    >
                        <Loader2 size={18} className={styles.spinning} />
                        <span>AI가 세특을 작성하고 있습니다... ({generatingIds.size}명 남음)</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Data Table */}
            {filteredStudents.length === 0 ? (
                <div className={styles.emptyState}>
                    <AlertCircle size={48} />
                    <h3>학생이 없습니다</h3>
                    <p>학생 관리 메뉴에서 학생을 추가해 주세요.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th className={styles.checkCol}></th>
                                <th className={styles.classCol}>반</th>
                                <th className={styles.numberCol}>번호</th>
                                <th className={styles.nameCol}>성명</th>
                                <th className={styles.subjectCol}>과목</th>
                                <th className={styles.dataCol}>AI 생성용 데이터</th>
                                <th className={styles.contentCol}>특기사항</th>
                                <th className={styles.actionCol}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student, i) => {
                                const cls = classes.find(c => c.id === student.classId);
                                const record = getStudentRecord(student.id);
                                const isSelected = selectedStudents.has(student.id);
                                const isGenerating = generatingIds.has(student.id);
                                const isEditingData = editingCell?.studentId === student.id && editingCell?.field === 'data';
                                const isEditingContent = editingCell?.studentId === student.id && editingCell?.field === 'content';
                                const hasForbidden = forbiddenResults.has(student.id);

                                // Format learning data for display
                                const dataText = Object.entries(student.learningData)
                                    .map(([_, v]) => v)
                                    .filter(v => v)
                                    .join(' | ') || '';

                                return (
                                    <motion.tr
                                        key={student.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className={`${isSelected ? styles.selectedRow : ''} ${isGenerating ? styles.generatingRow : ''} ${hasForbidden ? styles.warningRow : ''}`}
                                    >
                                        <td className={styles.checkCol}>
                                            <button
                                                className={styles.checkbox}
                                                onClick={() => toggleStudent(student.id)}
                                                disabled={isGenerating}
                                            >
                                                {isSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                                            </button>
                                        </td>
                                        <td className={styles.classCol}>{student.classNumber || cls?.classNumber || '-'}</td>
                                        <td className={styles.numberCol}>{student.number}</td>
                                        <td className={styles.nameCol}>{student.name}</td>
                                        <td className={styles.subjectCol}>
                                            <span className={styles.yearBadge}>2025 {selectedSemester}학기</span>
                                            <span>{cls?.subjectName || '-'}</span>
                                        </td>
                                        <td
                                            className={styles.dataCol}
                                            onClick={() => !isEditingData && startEdit(student.id, 'data', dataText)}
                                        >
                                            {isEditingData ? (
                                                <textarea
                                                    className={styles.editTextarea}
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => saveEdit(student.id, 'data')}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            saveEdit(student.id, 'data');
                                                        }
                                                    }}
                                                    autoFocus
                                                    placeholder="수업 태도, 수행평가 내용 등 입력..."
                                                />
                                            ) : (
                                                <div className={`${styles.dataPreview} ${!dataText ? styles.emptyData : ''}`}>
                                                    {dataText || '클릭하여 입력'}
                                                </div>
                                            )}
                                        </td>
                                        <td
                                            className={`${styles.contentCol} ${!record && !isGenerating ? styles.clickable : ''}`}
                                            onClick={() => !isEditingContent && !isGenerating && startEdit(student.id, 'content', record?.content || '')}
                                        >
                                            {isGenerating ? (
                                                <div className={styles.generatingText}>
                                                    <Loader2 size={16} className={styles.spinning} />
                                                    생성 중...
                                                </div>
                                            ) : isEditingContent ? (
                                                <textarea
                                                    className={styles.editTextarea}
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    onBlur={() => saveEdit(student.id, 'content')}
                                                    autoFocus
                                                    placeholder="세특 내용을 직접 입력..."
                                                />
                                            ) : record ? (
                                                <div className={styles.contentPreview}>
                                                    {record.content}
                                                    {hasForbidden && (
                                                        <span className={styles.warningBadge}>
                                                            <ShieldAlert size={12} /> 금지어
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className={styles.emptyContent}>클릭하여 입력</span>
                                            )}
                                        </td>
                                        <td className={styles.actionCol}>
                                            {record && (
                                                <button
                                                    className={styles.spellCheckBtn}
                                                    onClick={() => handleSpellCheck(record)}
                                                    title="맞춤법 검사"
                                                    disabled={isChecking}
                                                >
                                                    <SpellCheck size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Spell Check Modal */}
            <SpellCheckModal
                isOpen={spellCheckTarget !== null && !isChecking && spellErrors.length > 0}
                onClose={() => {
                    setSpellCheckTarget(null);
                    setSpellErrors([]);
                }}
                errors={spellErrors}
                originalText={spellCheckTarget?.content || ''}
                onApplyChanges={handleApplySpellChanges}
            />
        </div>
    );
}
