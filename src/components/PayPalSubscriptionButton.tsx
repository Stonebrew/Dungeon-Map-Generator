import { useEffect, useRef, useState } from 'react';
import { paypalConfig } from '../lib/paypalConfig';

type PayPalApproveData = {
  subscriptionID?: string;
};

type PayPalButtonsActions = {
  subscription: {
    create: (details: { plan_id: string }) => Promise<string>;
  };
};

type PayPalButtonsInstance = {
  render: (container: HTMLElement) => Promise<void>;
  close?: () => void;
};

type PayPalNamespace = {
  Buttons: (options: {
    style?: Record<string, string | number | boolean>;
    createSubscription: (_data: unknown, actions: PayPalButtonsActions) => Promise<string>;
    onApprove: (data: PayPalApproveData) => void;
    onCancel: () => void;
    onError: (error: unknown) => void;
  }) => PayPalButtonsInstance;
};

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

const PAYPAL_SCRIPT_ID = 'paypal-subscription-sdk';

function loadPayPalSdk() {
  const existingScript = document.getElementById(PAYPAL_SCRIPT_ID) as HTMLScriptElement | null;

  if (window.paypal) {
    return Promise.resolve(window.paypal);
  }

  if (existingScript) {
    return new Promise<PayPalNamespace>((resolve, reject) => {
      existingScript.addEventListener('load', () => {
        if (window.paypal) {
          resolve(window.paypal);
        } else {
          reject(new Error('PayPal SDK loaded without buttons.'));
        }
      });
      existingScript.addEventListener('error', () => reject(new Error('PayPal SDK failed to load.')));
    });
  }

  return new Promise<PayPalNamespace>((resolve, reject) => {
    const script = document.createElement('script');
    const sdkParams = new URLSearchParams({
      'client-id': paypalConfig.clientId,
      vault: 'true',
      intent: 'subscription',
      components: 'buttons',
      currency: 'USD',
    });

    script.id = PAYPAL_SCRIPT_ID;
    script.src = `https://www.paypal.com/sdk/js?${sdkParams.toString()}`;
    script.async = true;
    script.onload = () => {
      if (window.paypal) {
        resolve(window.paypal);
      } else {
        reject(new Error('PayPal SDK loaded without buttons.'));
      }
    };
    script.onerror = () => reject(new Error('PayPal SDK failed to load.'));

    document.body.appendChild(script);
  });
}

type PayPalVerificationResponse = {
  verified?: boolean;
  granted?: boolean;
  subscriptionStatus?: string;
  tier?: string | null;
  error?: string;
};

export function PayPalSubscriptionButton({
  accessToken,
  onSubscriptionVerified,
}: {
  accessToken: string;
  onSubscriptionVerified: () => Promise<void>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [message, setMessage] = useState('PayPal sandbox checkout is enabled for signed-in tester accounts.');
  const [errorMessage, setErrorMessage] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    let mounted = true;
    const container = containerRef.current;

    async function renderButton() {
      if (!container) {
        return;
      }

      try {
        const paypal = await loadPayPalSdk();

        if (!mounted) {
          return;
        }

        container.innerHTML = '';
        buttonsRef.current = paypal.Buttons({
          style: {
            layout: 'vertical',
            shape: 'rect',
            label: 'subscribe',
          },
          createSubscription: (_data, actions) =>
            actions.subscription.create({
              plan_id: paypalConfig.cartographerPlanId,
            }),
          onApprove: async (data) => {
            if (!data.subscriptionID) {
              setErrorMessage('PayPal created a subscription, but no subscription ID was returned.');
              return;
            }

            setErrorMessage('');
            setVerifying(true);
            setMessage('Subscription created in PayPal. Verifying Cartographer access...');

            try {
              const response = await fetch('/api/paypal/verify-subscription', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionID: data.subscriptionID }),
              });
              const payload = (await response.json()) as PayPalVerificationResponse;

              if (!response.ok || !payload.verified || !payload.granted) {
                throw new Error(payload.error ?? 'Subscription verification failed.');
              }

              await onSubscriptionVerified();
              setMessage(`Subscription verified. Cartographer access is now active. PayPal subscription ID: ${data.subscriptionID}.`);
            } catch {
              setErrorMessage('Subscription was created, but Cartographer access could not be verified yet. Please contact support.');
              setMessage(`PayPal subscription ID: ${data.subscriptionID}.`);
            } finally {
              setVerifying(false);
            }
          },
          onCancel: () => {
            setErrorMessage('');
            setMessage('PayPal checkout was cancelled. No subscription changes were applied in Dungeon Dossier.');
          },
          onError: () => {
            setErrorMessage('PayPal checkout could not be completed. Please try again or use Account to contact support.');
          },
        });

        await buttonsRef.current.render(container);
      } catch {
        if (mounted) {
          setErrorMessage('PayPal checkout is temporarily unavailable. Please try again later.');
        }
      }
    }

    void renderButton();

    return () => {
      mounted = false;
      buttonsRef.current?.close?.();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [accessToken, onSubscriptionVerified]);

  return (
    <div className="space-y-3">
      <div ref={containerRef} />
      {verifying && <p className="rounded-md border border-brass/20 bg-brass/[0.08] p-2 text-xs font-bold leading-5 text-ink/70">Verifying subscription with PayPal...</p>}
      <p className="text-xs font-semibold leading-5 text-ink/58">{message}</p>
      {errorMessage && <p className="rounded-md border border-red-900/20 bg-red-900/[0.06] p-2 text-xs font-semibold leading-5 text-red-900">{errorMessage}</p>}
    </div>
  );
}
