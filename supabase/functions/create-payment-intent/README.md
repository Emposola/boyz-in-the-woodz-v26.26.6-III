# Supabase Edge Function: `create-payment-intent`

Creates a Stripe PaymentIntent so the frontend can accept card payments.

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) installed (`npm install -g supabase`)
- Stripe account with a secret key

## Setup

### 1. Link your Supabase project

```bash
supabase link --project-ref pgwcfazhwuzxcqbqbjat
```

### 2. Set the Stripe secret key

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
```

Get your secret key from https://dashboard.stripe.com/apikeys

### 3. Deploy the function

```bash
supabase functions deploy create-payment-intent
```

### 4. Set frontend env vars

Copy `.env.example` to `.env` and fill in:

| Variable | Value |
|----------|-------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` from Stripe Dashboard |
| `VITE_SUPABASE_EDGE_FUNCTIONS_URL` | `https://pgwcfazhwuzxcqbqbjat.supabase.co/functions/v1` |

## How to Test

### Frontend flow

1. `npm run dev` to start the dev server
2. Go to `/cart`, add items, proceed through checkout:
   - **Cart** → review items
   - **Shipping** → enter address
   - **Payment** → enter Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC
   - **Review** → confirms payment was successful
   - **Place Order** → creates order in Supabase with `payment_status: 'paid'`

### Test cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 3220` | 3D Secure required |
| `4000 0000 0000 0002` | Declined |

### Retreat deposit

1. Go to `/retreat/apply`, fill steps 1–4
2. **Step 5** (Secure Your Spot) → enter test card details
3. Deposit is processed via Stripe before the application is submitted
