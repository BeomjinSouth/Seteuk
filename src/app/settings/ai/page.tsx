'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bot,
    Info,
    Lock,
    MessageSquare,
    RotateCcw,
    Save,
    Send,
    Sparkles,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OPENAI_STANDARD_MODEL, normalizeOpenAIModel } from '@/lib/openai-models';
import { ADMIN_CONFIG, isAdmin, useAppStore } from '@/lib/store';
import styles from './page.module.css';

type ReasoningEffort = 'none' | 'low' | 'medium' | 'high' | 'xhigh';

const DEFAULT_SYSTEM_PROMPT = `당신은 중등 교사 업무를 지원하는 교과 세특 작성 도우미입니다.

작성 원칙:
1. 학생의 학습 과정과 성장을 구체적으로 서술합니다.
2. 관찰 근거가 드러나는 표현을 사용합니다.
3. 비교/서열/과장 표현은 피합니다.
4. 분량은 350~500자 내외를 권장합니다.
5. 단정적 표현 대신 과정 중심의 문장을 우선합니다.`;

const DEFAULT_MODEL = OPENAI_STANDARD_MODEL;
const DEFAULT_MAX_TOKENS = 1000;
const DEFAULT_REASONING_EFFORT: ReasoningEffort = 'low';

const REASONING_OPTIONS: Array<{ value: ReasoningEffort; label: string; description: string }> = [
    { value: 'low', label: 'Low', description: '기본 권장값. 속도와 품질의 균형.' },
    { value: 'none', label: 'None', description: '추론 단계 최소화. 응답 속도 우선.' },
    { value: 'medium', label: 'Medium', description: '난이도 있는 문장 구성에 유리.' },
    { value: 'high', label: 'High', description: '복잡한 판단 품질 우선.' },
    { value: 'xhigh', label: 'XHigh', description: '가장 높은 추론 강도. 지연 증가 가능.' },
];

function loadStoredSettings() {
    const savedPrompt = localStorage.getItem('ai_system_prompt');
    const savedModel = localStorage.getItem('ai_model');
    const savedMaxTokens = Number.parseInt(localStorage.getItem('ai_max_tokens') || '', 10);
    const savedReasoningEffort = localStorage.getItem('ai_reasoning_effort') as ReasoningEffort | null;

    return {
        systemPrompt: savedPrompt || DEFAULT_SYSTEM_PROMPT,
        model: normalizeOpenAIModel(savedModel),
        maxTokens: Number.isFinite(savedMaxTokens)
            ? Math.min(3000, Math.max(200, savedMaxTokens))
            : DEFAULT_MAX_TOKENS,
        reasoningEffort: savedReasoningEffort && REASONING_OPTIONS.some((option) => option.value === savedReasoningEffort)
            ? savedReasoningEffort
            : DEFAULT_REASONING_EFFORT,
    };
}

export default function AISettingsPage() {
    const { teacher, addNotification } = useAppStore();
    const isAdminUser = isAdmin(teacher);

    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
    const [model, setModel] = useState(DEFAULT_MODEL);
    const [maxTokens, setMaxTokens] = useState(DEFAULT_MAX_TOKENS);
    const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(DEFAULT_REASONING_EFFORT);
    const [saved, setSaved] = useState(false);

    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestDescription, setRequestDescription] = useState('');
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        const nextSettings = loadStoredSettings();
        const frameId = window.requestAnimationFrame(() => {
            setSystemPrompt(nextSettings.systemPrompt);
            setModel(nextSettings.model);
            setMaxTokens(nextSettings.maxTokens);
            setReasoningEffort(nextSettings.reasoningEffort);
        });

        return () => window.cancelAnimationFrame(frameId);
    }, []);

    const reasoningDescription = useMemo(
        () => REASONING_OPTIONS.find((option) => option.value === reasoningEffort)?.description || '',
        [reasoningEffort]
    );

    const handleSave = () => {
        if (!isAdminUser) return;

        localStorage.setItem('ai_system_prompt', systemPrompt);
        localStorage.setItem('ai_model', normalizeOpenAIModel(model));
        localStorage.setItem('ai_max_tokens', String(Math.min(3000, Math.max(200, maxTokens || DEFAULT_MAX_TOKENS))));
        localStorage.setItem('ai_reasoning_effort', reasoningEffort);

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSubmitRequest = () => {
        if (!teacher || !requestDescription.trim()) return;

        addNotification({
            type: 'setting_request',
            requester: {
                name: teacher.name,
                school: teacher.school,
                subject: teacher.subject,
            },
            content: requestDescription,
            originalValue: [
                `model=${normalizeOpenAIModel(localStorage.getItem('ai_model'))}`,
                `maxOutputTokens=${localStorage.getItem('ai_max_tokens') || DEFAULT_MAX_TOKENS}`,
                `reasoningEffort=${localStorage.getItem('ai_reasoning_effort') || DEFAULT_REASONING_EFFORT}`,
            ].join(', '),
            newValue: requestDescription,
        });

        setShowRequestModal(false);
        setRequestDescription('');
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 3000);
    };

    const handleReset = () => {
        if (!isAdminUser) return;
        if (!confirm('AI 설정을 기본값으로 초기화할까요?')) return;

        setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
        setModel(DEFAULT_MODEL);
        setMaxTokens(DEFAULT_MAX_TOKENS);
        setReasoningEffort(DEFAULT_REASONING_EFFORT);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>AI 설정</h1>
                    <p className={styles.subtitle}>
                        세특 생성 AI 설정입니다.
                        {!isAdminUser && (
                            <span className={styles.adminNote}>
                                <Lock size={14} /> 관리자({ADMIN_CONFIG.name})만 수정 가능합니다.
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
                            <MessageSquare size={16} /> {requestSent ? '요청 완료' : '수정 요청'}
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
                        설정이 저장되었습니다.
                    </motion.div>
                )}
                {requestSent && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={styles.requestToast}
                    >
                        설정 변경 요청을 관리자에게 전송했습니다.
                    </motion.div>
                )}
            </AnimatePresence>

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
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2><MessageSquare size={20} /> AI 설정 수정 요청</h2>
                                <button className={styles.closeBtn} onClick={() => setShowRequestModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <p className={styles.modalDesc}>
                                    어떤 항목을 어떻게 바꾸고 싶은지 적어주세요.
                                </p>
                                <textarea
                                    className={styles.requestTextarea}
                                    value={requestDescription}
                                    onChange={(event) => setRequestDescription(event.target.value)}
                                    placeholder={'예시:\n- maxOutputTokens를 1200으로 조정\n- reasoningEffort를 medium으로 변경\n- 프롬프트에 금지 표현 지침 추가'}
                                    rows={8}
                                />
                            </div>
                            <div className={styles.modalFooter}>
                                <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
                                    취소
                                </Button>
                                <Button onClick={handleSubmitRequest} disabled={!requestDescription.trim()}>
                                    <Send size={16} /> 요청 보내기
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <section className={styles.section}>
                <h2><Sparkles size={20} /> 모델 선택</h2>
                <p className={styles.sectionDesc}>운영 모델은 `gpt-5.4-mini`입니다.</p>

                <div className={styles.modelGrid}>
                    {[
                        { id: OPENAI_STANDARD_MODEL, name: 'GPT-5.4 Mini', desc: '평가 점검·비전 포함 공통 운영 모델' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            className={`${styles.modelCard} ${model === item.id ? styles.selected : ''}`}
                            onClick={() => isAdminUser && setModel(item.id)}
                            disabled={!isAdminUser}
                        >
                            <span className={styles.modelName}>{item.name}</span>
                            <span className={styles.modelDesc}>{item.desc}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <h2><Bot size={20} /> 시스템 프롬프트</h2>
                <p className={styles.sectionDesc}>생성 기준을 설정합니다.</p>

                <div className={styles.infoBox}>
                    <Info size={16} />
                    <span>모든 세특 생성에 공통 적용됩니다.</span>
                </div>

                <textarea
                    className={styles.promptTextarea}
                    value={systemPrompt}
                    onChange={(event) => setSystemPrompt(event.target.value)}
                    rows={15}
                    placeholder="시스템 프롬프트를 입력하세요."
                    readOnly={!isAdminUser}
                />

                <div className={styles.charCount}>
                    {systemPrompt.length}자
                    {!isAdminUser && <span className={styles.readOnlyLabel}>읽기 전용</span>}
                </div>
            </section>

            <section className={styles.section}>
                <h2>생성 파라미터</h2>
                <p className={styles.sectionDesc}>이 세 항목만 생성 API에 반영됩니다.</p>

                <div className={styles.settingsGrid}>
                    <div className={styles.settingItem}>
                        <label htmlFor="max-output-tokens">Max Output Tokens</label>
                        <input
                            id="max-output-tokens"
                            type="number"
                            className={styles.numberInput}
                            value={maxTokens}
                            onChange={(event) => {
                                const value = Number.parseInt(event.target.value || '', 10);
                                if (!Number.isFinite(value)) {
                                    setMaxTokens(DEFAULT_MAX_TOKENS);
                                    return;
                                }
                                setMaxTokens(Math.min(3000, Math.max(200, value)));
                            }}
                            min={200}
                            max={3000}
                            disabled={!isAdminUser}
                        />
                        <p className={styles.settingHint}>권장 범위: 200 ~ 3000</p>
                    </div>

                    <div className={styles.settingItem}>
                        <label htmlFor="reasoning-effort">Reasoning Effort</label>
                        <select
                            id="reasoning-effort"
                            className={styles.numberInput}
                            value={reasoningEffort}
                            onChange={(event) => setReasoningEffort(event.target.value as ReasoningEffort)}
                            disabled={!isAdminUser}
                        >
                            {REASONING_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <p className={styles.settingHint}>{reasoningDescription}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
