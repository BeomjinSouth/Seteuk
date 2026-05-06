'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export function AdminStatusSync() {
    const teacherKey = useAppStore((state) => state.teacher?.teacherKey || '');
    const hasHydrated = useAppStore((state) => state.hasHydrated);
    const setAdminStatus = useAppStore((state) => state.setAdminStatus);

    useEffect(() => {
        if (!hasHydrated || !teacherKey) return;

        const controller = new AbortController();
        setAdminStatus({ loaded: false, isAdmin: false });

        const loadAdminStatus = async () => {
            try {
                const response = await fetch('/api/admin-users/me', {
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) {
                    setAdminStatus({ loaded: true, isAdmin: false });
                    return;
                }

                const body = await response.json() as { isAdmin?: boolean };
                setAdminStatus({ loaded: true, isAdmin: Boolean(body.isAdmin) });
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Admin status sync failed:', error);
                    setAdminStatus({ loaded: true, isAdmin: false });
                }
            }
        };

        void loadAdminStatus();

        return () => controller.abort();
    }, [hasHydrated, setAdminStatus, teacherKey]);

    return null;
}
