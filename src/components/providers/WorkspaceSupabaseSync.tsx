'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';

type WorkspacePayload = Pick<ReturnType<typeof useAppStore.getState>,
    'classes'
    | 'students'
    | 'records'
    | 'exampleTemplate'
    | 'seteukPromptMode'
    | 'personalSeteukPrompt'
    | 'curriculumContents'
    | 'adminNotifications'
    | 'forbiddenWords'
    | 'keywords'
>;

export function WorkspaceSupabaseSync() {
    const teacher = useAppStore((state) => state.teacher);
    const hasHydrated = useAppStore((state) => state.hasHydrated);
    const replaceSyncedWorkspaceState = useAppStore((state) => state.replaceSyncedWorkspaceState);
    const classes = useAppStore((state) => state.classes);
    const students = useAppStore((state) => state.students);
    const records = useAppStore((state) => state.records);
    const exampleTemplate = useAppStore((state) => state.exampleTemplate);
    const seteukPromptMode = useAppStore((state) => state.seteukPromptMode);
    const personalSeteukPrompt = useAppStore((state) => state.personalSeteukPrompt);
    const curriculumContents = useAppStore((state) => state.curriculumContents);
    const adminNotifications = useAppStore((state) => state.adminNotifications);
    const forbiddenWords = useAppStore((state) => state.forbiddenWords);
    const keywords = useAppStore((state) => state.keywords);
    const [isRemoteLoaded, setIsRemoteLoaded] = useState(false);
    const lastSyncedPayloadRef = useRef('');
    const teacherKey = teacher?.teacherKey || '';

    const payload: WorkspacePayload = useMemo(() => ({
        classes,
        students,
        records,
        exampleTemplate,
        seteukPromptMode,
        personalSeteukPrompt,
        curriculumContents,
        adminNotifications,
        forbiddenWords,
        keywords,
    }), [
        classes,
        students,
        records,
        exampleTemplate,
        seteukPromptMode,
        personalSeteukPrompt,
        curriculumContents,
        adminNotifications,
        forbiddenWords,
        keywords,
    ]);

    const serializedPayload = useMemo(() => JSON.stringify(payload), [payload]);

    useEffect(() => {
        if (!hasHydrated || !teacherKey) return;

        const controller = new AbortController();
        setIsRemoteLoaded(false);

        const loadRemoteState = async () => {
            try {
                const response = await fetch('/api/workspace-state', {
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!response.ok) return;

                const body = await response.json() as {
                    configured?: boolean;
                    data?: Partial<WorkspacePayload> | null;
                };
                if (body.configured && body.data && Object.keys(body.data).length > 0) {
                    replaceSyncedWorkspaceState(body.data);
                    lastSyncedPayloadRef.current = JSON.stringify(body.data);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Workspace Supabase sync load failed:', error);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsRemoteLoaded(true);
                }
            }
        };

        void loadRemoteState();

        return () => controller.abort();
    }, [hasHydrated, replaceSyncedWorkspaceState, teacherKey]);

    useEffect(() => {
        if (!hasHydrated || !teacherKey || !isRemoteLoaded) return;
        if (serializedPayload === lastSyncedPayloadRef.current) return;

        const timeout = window.setTimeout(() => {
            lastSyncedPayloadRef.current = serializedPayload;
            void fetch('/api/workspace-state', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherKey,
                    data: JSON.parse(serializedPayload) as WorkspacePayload,
                }),
            }).catch((error) => {
                console.error('Workspace Supabase sync save failed:', error);
                lastSyncedPayloadRef.current = '';
            });
        }, 900);

        return () => window.clearTimeout(timeout);
    }, [hasHydrated, isRemoteLoaded, serializedPayload, teacherKey]);

    return null;
}
