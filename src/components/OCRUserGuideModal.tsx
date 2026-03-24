'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, FileText, Scan, CheckCircle2, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './OCRUserGuideModal.module.css';

interface OCRUserGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * OCR User Guide Modal Component
 * 
 * @description
 * Displays a step-by-step guide for using the OCR feature.
 * Explains formatting requirements and best practices for uploading files.
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is visible
 * @param {() => void} props.onClose - Handler to close the modal
 */
export function OCRUserGuideModal({ isOpen, onClose }: OCRUserGuideModalProps) {
    if (!isOpen) return null;

    const steps = [
        {
            icon: FileText,
            title: '1. 파일 업로드',
            desc: '학생의 학습지나 시험지 이미지를 업로드하세요. PDF, JPG, PNG 파일 형식을 지원합니다.'
        },
        {
            icon: Scan,
            title: '2. OCR 분석',
            desc: '업로드된 파일에서 텍스트를 자동으로 추출하고 분석합니다. 수기 작성된 내용도 인식할 수 있습니다.'
        },
        {
            icon: CheckCircle2,
            title: '3. 결과 확인 및 평가',
            desc: '분석된 내용을 바탕으로 학생의 성취도를 평가하세요. 상/중/하 등급을 매기거나 점수를 입력할 수 있습니다.'
        },
        {
            icon: PenLine,
            title: '4. 관찰 기록 저장',
            desc: '특이사항이나 학생에 대한 코멘트를 관찰 기록으로 저장하여 나중에 세특 작성 시 참고할 수 있습니다.'
        }
    ];

    return (
        <AnimatePresence>
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className={styles.modal}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        <h2><HelpCircle size={24} className="text-primary" /> 학습지 OCR 사용 가이드</h2>
                        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                            <X size={20} />
                        </button>
                    </div>

                    <div className={styles.body}>
                        <div className={styles.guideList}>
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                return (
                                    <div key={index} className={styles.guideItem}>
                                        <div className={styles.stepNumber}>
                                            {index + 1}
                                        </div>
                                        <div className={styles.stepContent}>
                                            <h3 className={styles.stepTitle}>
                                                <span className="flex items-center gap-2">
                                                    {step.title}
                                                </span>
                                            </h3>
                                            <p className={styles.stepDesc}>{step.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Button onClick={onClose} variant="primary">
                            확인했습니다
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
