'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import {
  SEONGHO_DEFAULT_SUBJECT,
  SEONGHO_SCHOOL_NAME,
  validateSeonghoLogin,
} from '@/lib/seongho-auth';
import { Sparkles, ArrowRight, GraduationCap } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const [userId, setUserId] = useState('');
  const [school, setSchool] = useState(SEONGHO_SCHOOL_NAME);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateSeonghoLogin({ school, userId, password });
    if (!result.ok) {
      setLoginError(result.message);
      return;
    }

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 250));

    login(result.teacherName, SEONGHO_DEFAULT_SUBJECT, result.school);
    router.push('/students');
  };

  return (
    <main className={styles.container}>
      <div className={styles.bgGradient} />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className={styles.blobPurple}
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, -30, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className={styles.blobBlue}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`glass-panel p-8 ${styles.loginCard}`}
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.logoBox}
          >
            <GraduationCap size={32} color="white" />
          </motion.div>

          <h1 className={styles.title}>성호 AI</h1>
          <p className="text-muted text-sm">
            생성형 AI 기반 교과 세특 작성 서비스
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="학교명"
            placeholder="성호중학교"
            value={school}
            onChange={(e) => {
              setSchool(e.target.value);
              setLoginError('');
            }}
            required
          />
          <Input
            label="아이디"
            placeholder="한글 이름"
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setLoginError('');
            }}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError('');
            }}
            error={loginError}
            required
          />

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isLoading}
            style={{ height: '48px', fontSize: '1rem' }}
          >
            로그인 <ArrowRight size={18} />
          </Button>
        </form>

        <div className="mt-8 pt-6 text-center" style={{ borderTop: '1px solid hsl(var(--border))' }}>
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <Sparkles size={16} style={{ color: '#facc15' }} />
            <span>Powered by Generative AI</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
