'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot,
    Save,
    RotateCcw,
    Info,
    Sparkles,
    Lock,
    Send,
    X,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAppStore, isAdmin, ADMIN_CONFIG } from '@/lib/store';
import styles from './page.module.css';

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `당신은 한국 고등학교 교사를 도와 교과 세특(교과 세부능력 및 특기사항)을 작성하는 AI 어시스턴트입니다.

세특 작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 기술합니다.
2. 과정 중심 평가 내용을 포함합니다.
3. 객관적이고 긍정적인 서술을 사용합니다.
4. 350~500자 내외로 작성합니다.
5. 비교/서열화 표현, 단정적 표현을 피합니다.
6. "최고", "가장", "천재" 등의 금지어를 사용하지 않습니다.

입력받은 학생의 학습 데이터(수업 태도, 수행평가 등)를 바탕으로 세특을 생성해 주세요.`;

export default function AISettingsPage() {
    const { teacher, addNotification } = useAppStore();
    const isAdminUser = isAdmin(teacher);

    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
    const [model, setModel] = useState('gpt-5.2');
    const [temperature, setTemperature] = useState(0.7);
    const [maxTokens, setMaxTokens] = useState(1000);
    const [saved, setSaved] = useState(false);

    // Request modal state
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestDescription, setRequestDescription] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedPrompt = localStorage.getItem('ai_system_prompt');
        const savedModel = localStorage.getItem('ai_model');
        const savedTemp = localStorage.getItem('ai_temperature');
        const savedMaxTokens = localStorage.getItem('ai_max_tokens');

        if (savedPrompt) setSystemPrompt(savedPrompt);
        if (savedModel) setModel(savedModel);
        if (savedTemp) setTemperature(parseFloat(savedTemp));
        if (savedMaxTokens) setMaxTokens(parseInt(savedMaxTokens));
    }, []);

    // Save settings (admin only)
    const handleSave = () => {
        if (!isAdminUser) return;

        localStorage.setItem('ai_system_prompt', systemPrompt);
        localStorage.setItem('ai_model', model);
        localStorage.setItem('ai_temperature', String(temperature));
        localStorage.setItem('ai_max_tokens', String(maxTokens));

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Submit modification request
    const handleSubmitRequest = () => {
        if (!teacher || !requestDescription.trim()) return;

        addNotification({
            type: 'setting_request',
            requester: {
                name: teacher.name,
                school: teacher.school,
                subject: teacher.subject
            },
            content: requestDescription,
            originalValue: localStorage.getItem('ai_system_prompt') || DEFAULT_SYSTEM_PROMPT,
            newValue: requestDescription  // Store the description as the request
        });

        setShowRequestModal(false);
        setRequestDescription('');
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 3000);
    };

    // Reset to default
    const handleReset = () => {
        if (!isAdminUser) return;

        if (confirm('기본값으로 초기화하시겠습니까?')) {
            setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
            setModel('gpt-5.2');
            setTemperature(0.7);
            setMaxTokens(1000);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>인공지능 설정</h1>
                    <p className={styles.subtitle}>
                        AI 세특 생성에 사용되는 설정을 관리합니다.
                        {!isAdminUser && (
                            <span className={styles.adminNote}>
                                <Lock size={14} /> 관리자({ADMIN_CONFIG.name})만 수정 가능
                            </span>
                        )}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    {isAdminUser ? (
                        <>
                            <Button variant="secondary" onClick={handleReset}>
                                <RotateCcw size={16} /> 기본값
                            </Button>
                            <Button onClick={handleSave}>
                                <Save size={16} /> 저장
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setShowRequestModal(true)} disabled={requestSent}>
                            <MessageSquare size={16} /> {requestSent ? '요청 완료!' : '수정 요청'}
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
                                <h2><MessageSquare size={20} /> AI 설정 수정 요청</h2>
                                <button className={styles.closeBtn} onClick={() => setShowRequestModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <p className={styles.modalDesc}>
                                    어떤 내용을 어떻게 수정하고 싶은지 자세히 작성해 주세요.<br />
                                    관리자({ADMIN_CONFIG.name})가 검토 후 반영합니다.
                                </p>
                                <textarea
                                    className={styles.requestTextarea}
                                    value={requestDescription}
                                    onChange={(e) => setRequestDescription(e.target.value)}
                                    placeholder={`예시:\n- 시스템 프롬프트에 "~였음" 어미 대신 "~함" 어미 사용 지침 추가 요청\n- 세특 작성 시 수행평가 결과를 더 구체적으로 반영하도록 수정 요청\n- 글자 수 제한을 400자로 변경 요청`}
                                    rows={8}
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

            {/* Model Selection */}
            <section className={styles.section}>
                <h2><Sparkles size={20} /> 모델 선택</h2>
                <p className={styles.sectionDesc}>세특 생성에 사용할 GPT 모델을 선택하세요.</p>

                <div className={styles.modelGrid}>
                    {[
                        { id: 'gpt-5.2', name: 'GPT-5.2', desc: '기본 모델 (권장)' },
                        { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', desc: '최고 품질, 복잡한 작업용' },
                        { id: 'gpt-5.2-chat-latest', name: 'GPT-5.2 Latest', desc: '최신 버전' },
                    ].map(m => (
                        <button
                            key={m.id}
                            className={`${styles.modelCard} ${model === m.id ? styles.selected : ''}`}
                            onClick={() => isAdminUser && setModel(m.id)}
                            disabled={!isAdminUser}
                        >
                            <span className={styles.modelName}>{m.name}</span>
                            <span className={styles.modelDesc}>{m.desc}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* System Prompt */}
            <section className={styles.section}>
                <h2><Bot size={20} /> 시스템 프롬프트</h2>
                <p className={styles.sectionDesc}>
                    AI에게 전달되는 기본 지시사항입니다. 학교나 과목 특성에 맞게 수정하세요.
                </p>

                <div className={styles.infoBox}>
                    <Info size={16} />
                    <span>시스템 프롬프트는 모든 세특 생성 요청에 적용됩니다.</span>
                </div>

                <textarea
                    className={styles.promptTextarea}
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={15}
                    placeholder="시스템 프롬프트를 입력하세요..."
                    readOnly={!isAdminUser}
                />

                <div className={styles.charCount}>
                    {systemPrompt.length}자
                    {!isAdminUser && <span className={styles.readOnlyLabel}>읽기 전용</span>}
                </div>
            </section>

            {/* Advanced Settings */}
            <section className={styles.section}>
                <h2>고급 설정</h2>

                <div className={styles.settingsGrid}>
                    <div className={styles.settingItem}>
                        <label>Temperature (창의성)</label>
                        <div className={styles.sliderContainer}>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={temperature}
                                onChange={(e) => isAdminUser && setTemperature(parseFloat(e.target.value))}
                                className={styles.slider}
                                disabled={!isAdminUser}
                            />
                            <span className={styles.sliderValue}>{temperature}</span>
                        </div>
                        <p className={styles.settingHint}>
                            낮을수록 일관성 있고, 높을수록 창의적인 결과
                        </p>
                    </div>

                    <div className={styles.settingItem}>
                        <label>Max Tokens (최대 길이)</label>
                        <input
                            type="number"
                            value={maxTokens}
                            onChange={(e) => isAdminUser && setMaxTokens(parseInt(e.target.value) || 1000)}
                            className={styles.numberInput}
                            min={100}
                            max={4000}
                            disabled={!isAdminUser}
                        />
                        <p className={styles.settingHint}>
                            생성할 텍스트의 최대 토큰 수 (약 500자 = 250토큰)
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
