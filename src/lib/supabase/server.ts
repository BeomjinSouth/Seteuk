import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseSecretKey, getSupabaseUrl, isSupabaseConfigured } from './config';

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.');
    }

    if (!adminClient) {
        adminClient = createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
            global: {
                headers: {
                    'X-Client-Info': 'seteuk-next-server',
                },
            },
        });
    }

    return adminClient;
}
