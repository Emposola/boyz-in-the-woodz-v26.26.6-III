import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, createPaymentIntent } from '@/lib/stripe';
import { Button } from '@/components/ui/button';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      color: '#f1f5f9',
      fontFamily: '"Inter", system-ui, sans-serif',
      '::placeholder': { color: '#64748b' },
    },
    invalid: { color: '#f87171' },
  },
};

function PaymentFormInner({ amount, onSuccess, onError, buttonText }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
      if (methodError) { throw methodError; }

      const { clientSecret } = await createPaymentIntent(
        Math.round(amount * 100),
        paymentMethod.id
      );

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });
      if (confirmError) { throw confirmError; }

      if (paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      toast({ variant: 'destructive', title: err?.message || 'Payment failed. Please try again.' });
      onError?.(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-secondary border border-border rounded-lg p-3">
        <CardElement options={CARD_OPTIONS} />
      </div>
      <Button type="submit" disabled={!stripe || processing || !amount}
        className="w-full font-heading tracking-wider uppercase py-5 text-base">
        {processing ? (
          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>
        ) : (
          <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> {buttonText || `Pay $${amount?.toFixed(2)}`}</span>
        )}
      </Button>
    </form>
  );
}

export default function StripePaymentForm({ amount, onSuccess, onError, buttonText }) {
  const stripe = getStripe();

  if (!stripe) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border bg-secondary/50 p-6 text-center">
        <Lock className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-heading tracking-wider uppercase text-muted-foreground mb-1">
          Payment Not Configured
        </p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Set <code className="text-primary">VITE_STRIPE_PUBLISHABLE_KEY</code> in your environment.
        </p>
      </div>
    );
  }

  return (
    <Elements stripe={stripe}>
      <PaymentFormInner amount={amount} onSuccess={onSuccess} onError={onError} buttonText={buttonText} />
    </Elements>
  );
}
