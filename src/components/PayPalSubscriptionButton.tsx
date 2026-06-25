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

export function PayPalSubscriptionButton() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<PayPalButtonsInstance | null>(null);
  const [message, setMessage] = useState('PayPal sandbox checkout is enabled for signed-in tester accounts.');
  const [errorMessage, setErrorMessage] = useState('');

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
          onApprove: (data) => {
            const subscriptionId = data.subscriptionID ? ` PayPal subscription ID: ${data.subscriptionID}.` : '';
            setErrorMessage('');
            setMessage(`Subscription created in PayPal. Cartographer unlock will be connected in the next milestone.${subscriptionId}`);
          },
          onCancel: () => {
            setErrorMessage('');
            setMessage('PayPal checkout was cancelled. No subscription changes were applied in Dungeon Dossier.');
          },
          onError: () => {
            setErrorMessage('PayPal checkout could not be completed. Please try again or use Account & Help to contact support.');
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
  }, []);

  return (
    <div className="space-y-3">
      <div ref={containerRef} />
      <p className="text-xs font-semibold leading-5 text-ink/58">{message}</p>
      {errorMessage && <p className="rounded-md border border-red-900/20 bg-red-900/[0.06] p-2 text-xs font-semibold leading-5 text-red-900">{errorMessage}</p>}
    </div>
  );
}
