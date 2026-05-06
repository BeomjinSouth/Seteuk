'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Bot,
    Info,
    Lock,
    RotateCcw,
    Save,
    Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { OPENAI_STANDARD_MODEL, normalizeOpenAIModel } from '@/lib/openai-models';
import {
    SETEUK_DEFAULT_SYSTEM_PROMPT,
} from '@/lib/prompts/seteuk';
import { ADMIN_CONFIG, isAdmin, SeteukPromptMode, useAppStore } from '@/lib/store';
import styles from './page.module.css';

type ReasoningEffort = 'none' | 'low' | 'medium' | 'high' | 'xhigh';

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
    const savedModel = localStorage.getItem('ai_model');
    const savedMaxTokens = Number.parseInt(localStorage.getItem('ai_max_tokens') || '', 10);
    const savedReasoningEffort = localStorage.getItem('ai_reasoning_effort') as ReasoningEffort | null;

    return {
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
    const {
        teacher,
        adminStatus,
        seteukPromptMode,
        personalSeteukPrompt,
        setSeteukPromptMode,
        setPersonalSeteukPrompt,
    } = useAppStore();
    const isAdminUser = adminStatus.isAdmin || isAdmin(teacher);

    const [promptMode, setPromptMode] = useState<SeteukPromptMode>(seteukPromptMode);
    const [personalPromptDraft, setPersonalPromptDraft] = useState(personalSeteukPrompt);
    const [model, setModel] = useState(DEFAULT_MODEL);
    const [maxTokens, setMaxTokens] = useState(DEFAULT_MAX_TOKENS);
    const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>(DEFAULT_REASONING_EFFORT);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const nextSettings = loadStoredSettings();
        const frameId = window.requestAnimationFrame(() => {
            setModel(nextSettings.model);
            setMaxTokens(nextSettings.maxTokens);
            setReasoningEffort(nextSettings.reasoningEffort);
        });

        return () => window.cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
        setPromptMode(seteukPromptMode);
        setPersonalPromptDraft(personalSeteukPrompt);
    }, [personalSeteukPrompt, seteukPromptMode]);

    const reasoningDescription = useMemo(
        () => REASONING_OPTIONS.find((option) => option.value === reasoningEffort)?.description || '',
        [reasoningEffort]
    );

    const activePrompt = promptMode === 'personal'
        ? personalPromptDraft
        : SETEUK_DEFAULT_SYSTEM_PROMPT;

    const handleSave = () => {
        setSeteukPromptMode(promptMode);
        setPersonalSeteukPrompt(personalPromptDraft);

        if (isAdminUser) {
            localStorage.setItem('ai_model', normalizeOpenAIModel(model));
            localStorage.setItem('ai_max_tokens', String(Math.min(3000, Math.max(200, maxTokens || DEFAULT_MAX_TOKENS))));
            localStorage.setItem('ai_reasoning_effort', reasoningEffort);
        }

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleReset = () => {
        if (!confirm('AI 설정을 기본값으로 초기화할까요?')) return;

        setPromptMode('default');
        setPersonalPromptDraft('');
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
                                <Lock size={14} /> 생성 파라미터는 관리자({ADMIN_CONFIG.name})만 수정 가능
                            </span>
                        )}
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="secondary" onClick={handleReset}>
                        <RotateCcw size={16} /> 기본값
                    </Button>
                    <Button onClick={handleSave}>
                        <Save size={16} /> 저장
                    </Button>
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
                <p className={styles.sectionDesc}>세특 생성에 사용할 기준을 선택합니다.</p>

                <div className={styles.promptModeGroup} role="group" aria-label="세특 프롬프트 선택">
                    <button
                        type="button"
                        className={`${styles.promptModeButton} ${promptMode === 'default' ? styles.promptModeButtonActive : ''}`}
                        onClick={() => setPromptMode('default')}
                    >
                        기본 설정
                    </button>
                    <button
                        type="button"
                        className={`${styles.promptModeButton} ${promptMode === 'personal' ? styles.promptModeButtonActive : ''}`}
                        onClick={() => setPromptMode('personal')}
                    >
                        내 프롬프트
                    </button>
                </div>

                <div className={styles.infoBox}>
                    <Info size={16} />
                    <span>
                        {promptMode === 'default'
                            ? 'strict-observation-v1 기본 설정을 읽기 전용으로 사용합니다.'
                            : '저장한 개인 프롬프트는 본인 계정의 세특 생성에만 사용됩니다.'}
                    </span>
                </div>

                <textarea
                    className={styles.promptTextarea}
                    value={activePrompt}
                    onChange={(event) => setPersonalPromptDraft(event.target.value)}
                    rows={15}
                    placeholder="본인이 사용할 세특 작성 프롬프트를 입력하세요."
                    readOnly={promptMode === 'default'}
                />

                <div className={styles.charCount}>
                    {activePrompt.length}자
                    {promptMode === 'default' && <span className={styles.readOnlyLabel}>읽기 전용</span>}
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
