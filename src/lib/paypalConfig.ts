export type PayPalEnvironment = 'sandbox' | 'live';

const checkoutEnabled = import.meta.env.VITE_ENABLE_PAYPAL_CHECKOUT === 'true';
const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID?.trim() ?? '';
const cartographerPlanId = import.meta.env.VITE_PAYPAL_CARTOGRAPHER_PLAN_ID?.trim() ?? '';
const configuredEnvironment = import.meta.env.VITE_PAYPAL_ENV === 'live' ? 'live' : 'sandbox';

export const paypalConfig = {
  checkoutEnabled,
  clientId,
  cartographerPlanId,
  environment: configuredEnvironment as PayPalEnvironment,
  configured: checkoutEnabled && Boolean(clientId && cartographerPlanId),
};
