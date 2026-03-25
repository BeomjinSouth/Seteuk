'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Student } from '@/types';

export function SharedRosterSync() {
    const teacher = useAppStore((state) => state.teacher);
    const replaceRosterStudentsForSchool = useAppStore((state) => state.replaceRosterStudentsForSchool);

    useEffect(() => {
        if (!teacher?.school) return;

        const controller = new AbortController();

        const loadSharedRoster = async () => {
            try {
                const params = new URLSearchParams({ school: teacher.school });
                const response = await fetch(`/api/students?${params.toString()}`, {
                    cache: 'no-store',
                    signal: controller.signal,
                });

                if (!response.ok) {
                    return;
                }

                const payload = await response.json() as { students?: Student[] };
                if (!Array.isArray(payload.students) || payload.students.length === 0) {
                    return;
                }

                replaceRosterStudentsForSchool(teacher.school, payload.students);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Shared roster sync failed:', error);
                }
            }
        };

        void loadSharedRoster();

        return () => controller.abort();
    }, [replaceRosterStudentsForSchool, teacher?.school]);

    return null;
}
