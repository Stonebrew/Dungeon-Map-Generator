import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabaseClient';

export type SupabaseSessionState = {
  configured: boolean;
  loading: boolean;
  user: User | null;
  email?: string;
  accessToken?: string;
};

function getAuthErrorMessage(error: unknown, fallback = 'Could not send sign-in link.') {
  const message = error instanceof Error ? error.message : String(error);
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes('rate limit') || normalizedMessage.includes('too many') || normalizedMessage.includes('email rate limit')) {
    return 'Too many sign-in emails were requested. Please wait a few minutes and use the newest link.';
  }

  return message || fallback;
}

function getRedirectUrl() {
  return `${window.location.origin}/`;
}

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
        accessToken: data.session?.access_token,
      });
    });

    const { data } = client.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setState({
        configured: true,
        loading: false,
        user,
        email: user?.email,
        accessToken: session?.access_token,
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
        emailRedirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      throw new Error(getAuthErrorMessage(error, 'Could not send sign-in link.'));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const client = getSupabaseClient();

    if (!client) {
      throw new Error('Sign in is not configured yet.');
    }

    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getRedirectUrl(),
      },
    });

    if (error) {
      throw new Error(getAuthErrorMessage(error, 'Could not start Google sign-in.'));
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
    signInWithGoogle,
    signOut,
  };
}
