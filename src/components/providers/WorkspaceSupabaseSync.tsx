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
    | 'curriculumUnitOverrides'
    | 'classCurriculumSelections'
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
    const curriculumUnitOverrides = useAppStore((state) => state.curriculumUnitOverrides);
    const classCurriculumSelections = useAppStore((state) => state.classCurriculumSelections);
    const adminNotifications = useAppStore((state) => state.adminNotifications);
    const forbiddenWords = useAppStore((state) => state.forbiddenWords);
    const keywords = useAppStore((state) => state.keywords);
    const [isRemoteLoaded, setIsRemoteLoaded] = useState(false);
    const lastSyncedPayloadRef = useRef('');
    // 서버 문서의 updatedAt. PUT 시 expectedUpdatedAt으로 보내 다른 기기의
    // 더 최신 저장본을 조용히 덮어쓰지 않게 한다 (서버가 409로 알려줌).
    const lastRemoteUpdatedAtRef = useRef<string | null>(null);
    const teacherKey = teacher?.teacherKey || '';

    const payload: WorkspacePayload = useMemo(() => ({
        classes,
        students,
        records,
        exampleTemplate,
        seteukPromptMode,
        personalSeteukPrompt,
        curriculumContents,
        curriculumUnitOverrides,
        classCurriculumSelections,
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
        curriculumUnitOverrides,
        classCurriculumSelections,
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
                    updatedAt?: string | null;
                };
                if (body.configured) {
                    lastRemoteUpdatedAtRef.current = body.updatedAt ?? null;
                }
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
            void (async () => {
                try {
                    const response = await fetch('/api/workspace-state', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            teacherKey,
                            data: JSON.parse(serializedPayload) as WorkspacePayload,
                            expectedUpdatedAt: lastRemoteUpdatedAtRef.current,
                        }),
                    });

                    if (response.status === 409) {
                        // 다른 기기/탭이 먼저 저장했다. 그쪽 기록을 지우지 않도록
                        // 서버의 최신본을 받아들인다 (이 탭의 미전송 변경은 화면에서
                        // 되돌아가므로 사용자에게 즉시 보인다).
                        const conflictBody = await response.json() as {
                            updatedAt?: string | null;
                            data?: Partial<WorkspacePayload> | null;
                        };
                        console.warn('Workspace state conflict: adopting the newer remote copy.');
                        lastRemoteUpdatedAtRef.current = conflictBody.updatedAt ?? null;
                        if (conflictBody.data && Object.keys(conflictBody.data).length > 0) {
                            replaceSyncedWorkspaceState(conflictBody.data);
                            lastSyncedPayloadRef.current = JSON.stringify(conflictBody.data);
                        } else {
                            lastSyncedPayloadRef.current = '';
                        }
                        return;
                    }

                    if (!response.ok) {
                        lastSyncedPayloadRef.current = '';
                        return;
                    }

                    const okBody = await response.json() as { updatedAt?: string | null };
                    if (okBody.updatedAt) {
                        lastRemoteUpdatedAtRef.current = okBody.updatedAt;
                    }
                } catch (error) {
                    console.error('Workspace Supabase sync save failed:', error);
                    lastSyncedPayloadRef.current = '';
                }
            })();
        }, 900);

        return () => window.clearTimeout(timeout);
    }, [hasHydrated, isRemoteLoaded, replaceSyncedWorkspaceState, serializedPayload, teacherKey]);

    return null;
}
