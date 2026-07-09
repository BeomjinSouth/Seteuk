const PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/;

function cleanEnv(value?: string): string {
    return (value || '').trim();
}

function getSupabaseProjectId(): string {
    return cleanEnv(process.env.SUPABASE_PROJECT_ID || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID);
}

export function getSupabaseUrl(): string {
    const explicitUrl = cleanEnv(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (explicitUrl) return explicitUrl.replace(/\/+$/, '');

    const projectId = getSupabaseProjectId();
    return PROJECT_REF_PATTERN.test(projectId) ? `https://${projectId}.supabase.co` : '';
}

export function getSupabaseSecretKey(): string {
    return cleanEnv(
        process.env.SUPABASE_SECRET_KEY
        || process.env.SUPABASE_SERVICE_ROLE_KEY
        || process.env.SUPABASE_SERVICE_KEY
    );
}

export function isSupabaseConfigured(): boolean {
    return Boolean(getSupabaseUrl() && getSupabaseSecretKey());
}

export function isProductionRuntime(): boolean {
    return process.env.NODE_ENV === 'production';
}

export function isSupabaseRequiredButMissing(): boolean {
    return isProductionRuntime() && !isSupabaseConfigured();
}

