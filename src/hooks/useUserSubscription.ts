import { useCallback, useEffect, useState } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';
import type { TierId } from '../types';
import type { SupabaseSessionState } from './useSupabaseSession';

type UserSubscriptionRow = {
  tier: string;
  status: string;
  provider: string;
  provider_subscription_id: string;
  last_verified_at: string;
};

export type UserSubscriptionState = {
  loading: boolean;
  errorMessage?: string;
  hasActiveCartographer: boolean;
  effectiveTier: TierId;
  subscriptionStatus?: string;
  refetch: () => Promise<void>;
};

export function useUserSubscription(authSession: SupabaseSessionState & { signedIn: boolean }): UserSubscriptionState {
  const [loading, setLoading] = useState(authSession.loading);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [subscription, setSubscription] = useState<UserSubscriptionRow | undefined>();

  const refetch = useCallback(async () => {
    const client = getSupabaseClient();

    if (!authSession.configured || !authSession.signedIn || !authSession.user || !client) {
      setLoading(false);
      setErrorMessage(undefined);
      setSubscription(undefined);
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);

    const { data, error } = await client
      .from('user_subscriptions')
      .select('tier,status,provider,provider_subscription_id,last_verified_at')
      .eq('user_id', authSession.user.id)
      .eq('provider', 'paypal')
      .eq('tier', 'cartographer')
      .order('last_verified_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      setErrorMessage('Subscription status could not be loaded yet.');
      setSubscription(undefined);
      setLoading(false);
      return;
    }

    setSubscription(data ?? undefined);
    setLoading(false);
  }, [authSession.configured, authSession.signedIn, authSession.user]);

  useEffect(() => {
    if (authSession.loading) {
      setLoading(true);
      return;
    }

    void refetch();
  }, [authSession.loading, refetch]);

  const hasActiveCartographer = subscription?.tier === 'cartographer' && subscription.status === 'ACTIVE';

  return {
    loading,
    errorMessage,
    hasActiveCartographer,
    effectiveTier: hasActiveCartographer ? 'adventurer' : 'lantern',
    subscriptionStatus: subscription?.status,
    refetch,
  };
}
