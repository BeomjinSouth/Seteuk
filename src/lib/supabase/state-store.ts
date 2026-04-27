import { getSupabaseAdminClient } from './server';

export type AppStateScope = 'workspace' | 'observation-board';

export interface AppStateDocument<TPayload = unknown> {
    scope: AppStateScope;
    ownerKey: string;
    documentKey: string;
    payload: TPayload;
    updatedAt: string;
}

type AppStateRow = {
    scope: AppStateScope;
    owner_key: string;
    document_key: string;
    payload: unknown;
    updated_at: string;
};

function toDocument<TPayload>(row: AppStateRow): AppStateDocument<TPayload> {
    return {
        scope: row.scope,
        ownerKey: row.owner_key,
        documentKey: row.document_key,
        payload: row.payload as TPayload,
        updatedAt: row.updated_at,
    };
}

function assertNoStateError(error: unknown, operation: string): void {
    if (!error) return;
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Supabase state store ${operation} failed: ${message}`);
}

export async function getAppStateDocument<TPayload>(
    scope: AppStateScope,
    ownerKey: string,
    documentKey = 'default'
): Promise<AppStateDocument<TPayload> | null> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('app_state_documents')
        .select('scope,owner_key,document_key,payload,updated_at')
        .eq('scope', scope)
        .eq('owner_key', ownerKey)
        .eq('document_key', documentKey)
        .maybeSingle();

    assertNoStateError(error, `read ${scope}/${ownerKey}/${documentKey}`);
    return data ? toDocument<TPayload>(data as AppStateRow) : null;
}

export async function upsertAppStateDocument<TPayload>(
    scope: AppStateScope,
    ownerKey: string,
    payload: TPayload,
    documentKey = 'default'
): Promise<AppStateDocument<TPayload>> {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
        .from('app_state_documents')
        .upsert({
            scope,
            owner_key: ownerKey,
            document_key: documentKey,
            payload,
            updated_at: new Date().toISOString(),
        }, {
            onConflict: 'scope,owner_key,document_key',
        })
        .select('scope,owner_key,document_key,payload,updated_at')
        .single();

    assertNoStateError(error, `upsert ${scope}/${ownerKey}/${documentKey}`);
    return toDocument<TPayload>(data as AppStateRow);
}
