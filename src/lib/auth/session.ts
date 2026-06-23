import { isSupabaseConfigured } from '../supabaseClient';

export type AuthSessionStatus = 'guest' | 'not_configured' | 'configured_no_session';

export function getInitialAuthSessionStatus(): AuthSessionStatus {
  return isSupabaseConfigured ? 'configured_no_session' : 'not_configured';
}

export const guestAuthSessionStatus: AuthSessionStatus = 'guest';
