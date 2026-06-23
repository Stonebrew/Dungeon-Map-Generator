import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';

export type SupabaseSessionState = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  email?: string;
};

export function useSupabaseSession() {
  const [state, setState] = useState<SupabaseSessionState>({
    configured: isSupabaseConfigured,
    loading: isSupabaseConfigured,
    user: null,
  });

  useEffect(() => {
    const client = getSupabaseClient();

    if (!client) {
      setState({ configured: false, loading: false, user: null });
      return undefined;
    }

    let mounted = true;

    void client.auth.getSession().then(({ data }) => {
      if (!mounted) {
        return;
      }

      const user = data.session?.user ?? null;
      setState({
        configured: true,
        loading: false,
        user,
        email: user?.email,
      });
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        configured: true,
        loading: false,
        user,
        email: user?.email,
      });
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const sendSignInLink = useCallback(async (email: string) => {
    const client = getSupabaseClient();

    if (!client) {
      throw new Error('Sign in is not configured yet.');
    }

    const { error } = await client.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    const client = getSupabaseClient();

    if (!client) {
      return;
    }

    const { error } = await client.auth.signOut();

    if (error) {
      throw error;
    }
  }, []);

  return {
    ...state,
    signedIn: Boolean(state.user),
    sendSignInLink,
    signOut,
  };
}
