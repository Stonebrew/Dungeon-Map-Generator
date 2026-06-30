import { createClient } from '@supabase/supabase-js';
import { getRequiredEnv } from './paypalServer.js';

export function getSupabaseAdminClient() {
  return createClient(getRequiredEnv('SUPABASE_URL'), getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
