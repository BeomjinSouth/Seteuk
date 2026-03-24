'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';
import { Sparkles, ArrowRight, GraduationCap, FlaskConical } from 'lucide-react';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const login = useAppStore((state) => state.login);
  const seedDemoWorkspace = useAppStore((state) => state.seedDemoWorkspace);
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [school, setSchool] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !school) return;

    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    login(name, subject, school);
    router.push('/dashboard');
  };

  const handleDemoStart = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));

    login('박범진', '생명과학I', '성호중학교');
    seedDemoWorkspace();
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

          <h1 className={styles.title}>세특 AI 도우미</h1>
          <p className="text-muted text-sm">
            생성형 AI 기반 교과 세특 작성 서비스
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="학교명"
            placeholder="예: 서울고등학교"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
          <Input
            label="이름"
            placeholder="예: 김선생"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="담당 과목"
            placeholder="예: 생명과학I"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <Button
            type="submit"
            className="w-full mt-4"
            isLoading={isLoading}
            style={{ height: '48px', fontSize: '1rem' }}
          >
            작업공간 시작하기 <ArrowRight size={18} />
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={handleDemoStart}
            disabled={isLoading}
            style={{ height: '48px', fontSize: '0.95rem' }}
          >
            <FlaskConical size={18} /> 데모 체험 바로 시작
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
