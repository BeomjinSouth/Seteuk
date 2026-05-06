'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Type,
    ShieldAlert,
    Plus,
    X,
    Save,
    AlertCircle,
    FileText,
    Sparkles,
    Lock,
    MessageSquare,
    Send,
    Highlighter,
    UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore, isAdmin, ADMIN_CONFIG } from '@/lib/store';
import styles from './page.module.css';

type AdminRoleUser = {
    school: string;
    teacherKey: string;
    teacherName: string;
    bootstrap: boolean;
    active: boolean;
    grantedAt: string | null;
};

/**
 * Settings Page Component
 * 
 * @description
 * Manages general application settings and policies.
 * 
 * Features:
 * - Forbidden Words: Manage list of words prohibited in Se-teuk
 * - Character Limits: Set min/max character counts and enforcement rules
 * - AI Options: Configure output sentence length style
 * - Keyword Highlighting: Manage keywords to highlight in review mode
 * - Review Guidelines: Set custom guidelines text for the review page
 */
export default function SettingsPage() {
    const {
        teacher,
        forbiddenWords,
        setForbiddenWords,
        addForbiddenWord,
        removeForbiddenWord,
        addNotification,
        keywords,
        addKeyword,
        removeKeyword,
        adminStatus
    } = useAppStore();
    const isAdminUser = adminStatus.isAdmin || isAdmin(teacher);

    const [settings, setSettings] = useState({
        maxCharacters: 500,
        recommendedMin: 350,
        recommendedMax: 500,
        exceedAction: 'warn' as 'warn' | 'block',
        sentenceLength: 'normal' as 'short' | 'normal' | 'long',
        autoSplit: true,
        autoRetry: true,
    });

    const [newWord, setNewWord] = useState('');
    const [newAlternative, setNewAlternative] = useState('');
    const [reviewMemo, setReviewMemo] = useState('');
    const [saved, setSaved] = useState(false);
    const [adminUsers, setAdminUsers] = useState<AdminRoleUser[]>([]);
    const [newAdminName, setNewAdminName] = useState('');
    const [adminMessage, setAdminMessage] = useState('');
    const [adminLoading, setAdminLoading] = useState(false);

    // Request modal state
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestDescription, setRequestDescription] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    // Local state for non-admin word suggestions
    const [localWordsDraft, setLocalWordsDraft] = useState<{ word: string; alternative: string }[] | null>(null);

    // Keyword state
    const [newKeyword, setNewKeyword] = useState('');

    useEffect(() => {
        if (!isAdminUser) {
            setAdminUsers([]);
            return;
        }

        const controller = new AbortController();

        const loadAdmins = async () => {
            try {
                const response = await fetch('/api/admin-users', {
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) return;

                const body = await response.json() as { admins?: AdminRoleUser[] };
                setAdminUsers(Array.isArray(body.admins) ? body.admins : []);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Admin users load failed:', error);
                }
            }
        };

        void loadAdmins();

        return () => controller.abort();
    }, [isAdminUser]);

    const localWords = localWordsDraft ?? forbiddenWords.map((word) => ({
        word,
        alternative: ''
    }));

    // Add forbidden word (admin only)
    const handleAddWord = () => {
        if (!newWord.trim()) return;

        if (isAdminUser) {
            const nextWord = newWord.trim();
            const nextLocalWords = [...localWords, { word: nextWord, alternative: newAlternative.trim() }];
            addForbiddenWord(nextWord);
            setLocalWordsDraft(nextLocalWords);
        }
        setNewWord('');
        setNewAlternative('');
    };

    // Remove forbidden word (admin only)
    const handleRemoveWord = (index: number) => {
        if (!isAdminUser) return;

        const wordToRemove = localWords[index].word;
        removeForbiddenWord(wordToRemove);
        setLocalWordsDraft(localWords.filter((_, i) => i !== index));
    };

    // Add keyword
    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return;
        addKeyword(newKeyword.trim());
        setNewKeyword('');
    };

    // Remove keyword
    const handleRemoveKeyword = (keyword: string) => {
        removeKeyword(keyword);
    };

    const handleAddAdmin = async () => {
        if (!isAdminUser || !newAdminName.trim()) return;

        setAdminLoading(true);
        setAdminMessage('');
        try {
            const response = await fetch('/api/admin-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherName: newAdminName.trim() }),
            });
            const body = await response.json() as { admins?: AdminRoleUser[]; error?: string };
            if (!response.ok) throw new Error(body.error || '관리자 추가에 실패했습니다.');

            setAdminUsers(Array.isArray(body.admins) ? body.admins : []);
            setNewAdminName('');
            setAdminMessage('관리자 권한을 추가했습니다.');
        } catch (error) {
            setAdminMessage(error instanceof Error ? error.message : '관리자 추가에 실패했습니다.');
        } finally {
            setAdminLoading(false);
        }
    };

    const handleRevokeAdmin = async (admin: AdminRoleUser) => {
        if (!isAdminUser || admin.bootstrap) return;
        if (!confirm(`${admin.teacherName} 교사의 관리자 권한을 해제할까요?`)) return;

        setAdminLoading(true);
        setAdminMessage('');
        try {
            const response = await fetch('/api/admin-users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teacherKey: admin.teacherKey }),
            });
            const body = await response.json() as { admins?: AdminRoleUser[]; error?: string };
            if (!response.ok) throw new Error(body.error || '관리자 해제에 실패했습니다.');

            setAdminUsers(Array.isArray(body.admins) ? body.admins : []);
            setAdminMessage('관리자 권한을 해제했습니다.');
        } catch (error) {
            setAdminMessage(error instanceof Error ? error.message : '관리자 해제에 실패했습니다.');
        } finally {
            setAdminLoading(false);
        }
    };

    // Submit modification request
    const handleSubmitRequest = () => {
        if (!teacher || !requestDescription.trim()) return;

        addNotification({
            type: 'forbidden_request',
            requester: {
                name: teacher.name,
                school: teacher.school,
                subject: teacher.subject
            },
            content: requestDescription,
            originalValue: forbiddenWords.join(', '),
            newValue: requestDescription
        });

        setShowRequestModal(false);
        setRequestDescription('');
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 3000);
    };

    // Save settings
    const handleSave = () => {
        if (!isAdminUser) return;

        // Save all current localWords to store
        const allWords = localWords.map(w => w.word);
        setForbiddenWords(allWords);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>설정</h1>
                    <p className={styles.subtitle}>
                        세특 작성 기준을 설정합니다.
                        {!isAdminUser && (
                            <span className={styles.adminNote}>
                                <Lock size={14} /> 금지어 관리는 관리자({ADMIN_CONFIG.name})만 수정 가능
                            </span>
                        )}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    {isAdminUser ? (
                        <Button onClick={handleSave}>
                            <Save size={18} /> 저장
                        </Button>
                    ) : (
                        <Button onClick={() => setShowRequestModal(true)} disabled={requestSent}>
                            <MessageSquare size={18} /> {requestSent ? '요청 완료!' : '금지어 수정 요청'}
                        </Button>
                    )}
                </div>
            </header>

            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={styles.savedToast}
                    >
                        ✓ 설정이 저장되었습니다.
                    </motion.div>
                )}
                {requestSent && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={styles.requestToast}
                    >
                        ✓ 수정 요청이 관리자에게 전송되었습니다.
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Request Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <motion.div
                        className={styles.modalBackdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowRequestModal(false)}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2><ShieldAlert size={20} /> 금지어 수정 요청</h2>
                                <button className={styles.closeBtn} onClick={() => setShowRequestModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <p className={styles.modalDesc}>
                                    변경할 금지어와 이유를 적어주세요. 관리자({ADMIN_CONFIG.name})가 검토합니다.
                                </p>

                                <div className={styles.currentWordsInfo}>
                                    <strong>현재 등록된 금지어:</strong>
                                    <div className={styles.wordTags}>
                                        {forbiddenWords.map((word, i) => (
                                            <span key={i} className={styles.wordTag}>{word}</span>
                                        ))}
                                    </div>
                                </div>

                                <textarea
                                    className={styles.requestTextarea}
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    placeholder={`예시:\n\n[추가 요청]\n- "1등" 추가 요청 (서열화 표현)\n- "못함" 추가 요청 (부정적 표현)\n\n[삭제 요청]\n- "가장" 삭제 요청 (문맥에 따라 사용 가능)\n\n[이유]\n학교 기준에 맞게 금지어 목록 조정이 필요합니다.`}
                                    rows={10}
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                                    취소
                                </Button>
                                <Button
                                    onClick={handleSubmitRequest}
                                    disabled={!requestDescription.trim()}
                                >
                                    <Send size={16} /> 요청 보내기
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.sections}>
                {isAdminUser && (
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2><UserCog size={20} /> 관리자 권한</h2>
                        </div>
                        <p className={styles.sectionHint}>
                            성호중학교 교사 이름으로 관리자 권한을 추가하거나 해제합니다.
                        </p>

                        <div className={styles.addWordForm}>
                            <Input
                                placeholder="교사 이름 입력"
                                value={newAdminName}
                                onChange={(event) => setNewAdminName(event.target.value)}
                                onKeyDown={(event) => event.key === 'Enter' && handleAddAdmin()}
                            />
                            <Button variant="secondary" onClick={handleAddAdmin} disabled={adminLoading || !newAdminName.trim()}>
                                <Plus size={18} /> 관리자 추가
                            </Button>
                        </div>

                        {adminMessage && (
                            <p className={styles.adminMessage}>{adminMessage}</p>
                        )}

                        <div className={styles.adminList}>
                            {adminUsers.map((admin) => (
                                <div key={admin.teacherKey} className={styles.adminItem}>
                                    <div>
                                        <strong>{admin.teacherName}</strong>
                                        <span>{admin.school}</span>
                                    </div>
                                    {admin.bootstrap ? (
                                        <span className={styles.bootstrapBadge}>해제 불가</span>
                                    ) : (
                                        <button
                                            type="button"
                                            className={styles.removeBtn}
                                            onClick={() => handleRevokeAdmin(admin)}
                                            disabled={adminLoading}
                                            aria-label={`${admin.teacherName} 관리자 해제`}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Character Limit Settings */}
                <section className={styles.section}>
                    <h2><Type size={20} /> 글자수 정책</h2>

                    <div className={styles.settingGrid}>
                        <div className={styles.settingItem}>
                            <label>최대 글자수</label>
                            <input
                                type="number"
                                value={settings.maxCharacters}
                                onChange={(e) => setSettings({ ...settings, maxCharacters: Number(e.target.value) })}
                                className={styles.numberInput}
                            />
                            <span className={styles.unit}>자</span>
                        </div>

                        <div className={styles.settingItem}>
                            <label>권장 글자수 범위</label>
                            <div className={styles.rangeInputs}>
                                <input
                                    type="number"
                                    value={settings.recommendedMin}
                                    onChange={(e) => setSettings({ ...settings, recommendedMin: Number(e.target.value) })}
                                    className={styles.numberInput}
                                />
                                <span>~</span>
                                <input
                                    type="number"
                                    value={settings.recommendedMax}
                                    onChange={(e) => setSettings({ ...settings, recommendedMax: Number(e.target.value) })}
                                    className={styles.numberInput}
                                />
                                <span className={styles.unit}>자</span>
                            </div>
                        </div>

                        <div className={styles.settingItem}>
                            <label>초과 시 동작</label>
                            <select
                                value={settings.exceedAction}
                                onChange={(e) => setSettings({ ...settings, exceedAction: e.target.value as 'warn' | 'block' })}
                                className={styles.select}
                            >
                                <option value="warn">경고만 표시</option>
                                <option value="block">저장 차단</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* AI Generation Settings */}
                <section className={styles.section}>
                    <h2><Sparkles size={20} /> AI 생성 설정</h2>

                    <div className={styles.settingGrid}>
                        <div className={styles.settingItem}>
                            <label>문장 길이</label>
                            <select
                                value={settings.sentenceLength}
                                onChange={(e) => setSettings({ ...settings, sentenceLength: e.target.value as 'short' | 'normal' | 'long' })}
                                className={styles.select}
                            >
                                <option value="short">짧게 (간결하게)</option>
                                <option value="normal">보통</option>
                                <option value="long">길게 (상세하게)</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Keyword Highlighting Settings */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><Highlighter size={20} /> 키워드 하이라이팅</h2>
                    </div>
                    <p className={styles.sectionHint}>
                        검토 화면 키워드입니다.
                    </p>

                    <div className={styles.addWordForm}>
                        <Input
                            placeholder="키워드 입력 (예: 탐구, 협력, 분석)"
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <Button variant="secondary" onClick={handleAddKeyword}>
                            <Plus size={18} /> 추가
                        </Button>
                    </div>

                    <div className={styles.wordList}>
                        {keywords.length === 0 ? (
                            <p className={styles.emptyMessage}>등록된 키워드가 없습니다.</p>
                        ) : (
                            keywords.map((keyword, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={styles.keywordItem}
                                >
                                    <span className={styles.keywordText}>{keyword}</span>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => handleRemoveKeyword(keyword)}
                                    >
                                        <X size={16} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Forbidden Words */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2><ShieldAlert size={20} /> 금지어 관리</h2>
                        {!isAdminUser && (
                            <span className={styles.readOnlyBadge}>
                                <Lock size={12} /> 읽기 전용
                            </span>
                        )}
                    </div>
                    <p className={styles.sectionHint}>
                        금지 표현을 관리합니다.
                    </p>

                    {isAdminUser && (
                        <div className={styles.addWordForm}>
                            <Input
                                placeholder="금지어"
                                value={newWord}
                                onChange={(e) => setNewWord(e.target.value)}
                            />
                            <Input
                                placeholder="대체 표현 (선택)"
                                value={newAlternative}
                                onChange={(e) => setNewAlternative(e.target.value)}
                            />
                            <Button variant="secondary" onClick={handleAddWord}>
                                <Plus size={18} /> 추가
                            </Button>
                        </div>
                    )}

                    <div className={styles.wordList}>
                        {localWords.length === 0 ? (
                            <p className={styles.emptyMessage}>등록된 금지어가 없습니다.</p>
                        ) : (
                            localWords.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={styles.wordItem}
                                >
                                    <div className={styles.wordContent}>
                                        <span className={styles.forbiddenWord}>{item.word}</span>
                                        {item.alternative && (
                                            <>
                                                <span className={styles.arrow}>→</span>
                                                <span className={styles.alternative}>{item.alternative}</span>
                                            </>
                                        )}
                                    </div>
                                    {isAdminUser && (
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => handleRemoveWord(index)}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Review Guidelines */}
                <section className={styles.section}>
                    <h2><FileText size={20} /> 검토 기준 메모</h2>
                    <p className={styles.sectionHint}>
                        학교별 검토 기준을 적어두세요.
                    </p>

                    <textarea
                        className={styles.memoArea}
                        placeholder="예: 과정 중심 평가 내용 필수 포함, 구체적 활동 사례 기술, 학생의 성장과 변화 기술..."
                        value={reviewMemo}
                        onChange={(e) => setReviewMemo(e.target.value)}
                        rows={5}
                    />
                </section>

                {/* Speller Settings */}
                <section className={styles.section}>
                    <h2><AlertCircle size={20} /> 맞춤법 검사 설정</h2>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={settings.autoSplit}
                                onChange={(e) => setSettings({ ...settings, autoSplit: e.target.checked })}
                            />
                            <span>긴 문장 자동 분할 검사</span>
                        </label>

                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={settings.autoRetry}
                                onChange={(e) => setSettings({ ...settings, autoRetry: e.target.checked })}
                            />
                            <span>검사 실패 시 자동 재시도</span>
                        </label>
                    </div>

                    <div className={styles.notice}>
                        <AlertCircle size={16} />
                        <p>
                            외부 서비스 사용으로 호출 수가 제한됩니다.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
