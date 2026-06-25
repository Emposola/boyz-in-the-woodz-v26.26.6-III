import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL
  || 'https://pgwcfazhwuzxcqbqbjat.supabase.co/functions/v1';

let stripePromise = null;

export function getStripe() {
  if (!stripePromise && STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export async function createPaymentIntent(amount, orderId, metadata = {}) {
  const url = `${EDGE_FUNCTION_URL}/create-payment-intent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, order_id: orderId, metadata }),
  });
  if (!res.ok) throw new Error('Failed to create payment intent');
  return res.json();
}

export { STRIPE_PUBLISHABLE_KEY, EDGE_FUNCTION_URL };
