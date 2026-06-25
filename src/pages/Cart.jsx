import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingBag, Minus, Plus, X, ArrowLeft, Coins,
  Trees, Scissors, Shield, Lock, CreditCard, RotateCcw, Tag, ChevronRight,
  MapPin, Check, ChevronLeft, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import SEO from '@/components/shared/SEO';
import StripePaymentForm from '@/components/shared/StripePaymentForm';

const FG = '#2D5A27';

const PAYMENT_ICONS = [
  { name: 'Visa', bg: '#1A1F71', text: 'VISA' },
  { name: 'MC', bg: '#EB001B', text: '●●' },
  { name: 'Amex', bg: '#007BC1', text: 'AMEX' },
  { name: 'Shop Pay', bg: '#5A31F4', text: 'Shop' },
  { name: 'Apple Pay', bg: '#000', text: '🍎' },
  { name: 'Google Pay', bg: '#fff', text: 'G Pay', dark: true },
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
  'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
  'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const STEPS = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState('cart');
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [shipping, setShipping] = useState({
    name: '', line1: '', line2: '', city: '', state: '', zip: '',
  });

  const discount = discountApplied ? subtotal * 0.1 : 0;
  const shippingCost = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal - discount + shippingCost;
  const pointsEarned = Math.floor(subtotal * 10);

  const hasBoyz = items.some(i => i.business === 'boyz');
  const hasBarber = items.some(i => i.business === 'barber');

  const stepIndex = STEPS.findIndex(s => s.key === step);

  const set = (k, v) => setShipping(f => ({ ...f, [k]: v }));

  const handleApplyCode = () => {
    if (discountCode.toUpperCase() === 'BROTHER10') {
      setDiscountApplied(true);
      toast({ title: 'Code applied! 10% off your order.' });
    } else {
      toast({ variant: 'destructive', title: 'Invalid discount code.' });
    }
  };

  const validateShipping = () => {
    if (!shipping.name.trim()) { toast({ variant: 'destructive', title: 'Please enter your full name.' }); return false; }
    if (!shipping.line1.trim()) { toast({ variant: 'destructive', title: 'Please enter your street address.' }); return false; }
    if (!shipping.city.trim()) { toast({ variant: 'destructive', title: 'Please enter your city.' }); return false; }
    if (!shipping.state) { toast({ variant: 'destructive', title: 'Please select your state.' }); return false; }
    if (!shipping.zip.trim()) { toast({ variant: 'destructive', title: 'Please enter your ZIP code.' }); return false; }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please sign in to place an order.' });
      return;
    }
    setCheckingOut(true);
    try {
      const orderData = {
        user_id: user.id,
        order_number: 'BITW-' + Date.now().toString(36).toUpperCase(),
        items: items.map(i => ({
          product_id: i.product_id,
          product_name: i.product_name,
          price: i.price,
          quantity: i.quantity,
          size: i.size || null,
          business: i.business,
          image_url: i.image_url || null,
        })),
        subtotal,
        discount: discountApplied ? discount : 0,
        shipping_cost: shippingCost,
        total_amount: total,
        shipping_address: shipping,
        status: 'pending',
        payment_status: paymentSuccess ? 'paid' : 'pending',
        created_date: new Date().toISOString(),
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError || !orderResult) {
        console.error('Order insert error:', orderError);
        toast({ variant: 'destructive', title: 'Failed to place order. Please try again.' });
        return;
      }

      await supabase.from('loyalty_transactions').insert({
        user_id: user.id,
        points_amount: pointsEarned,
        type: 'credit',
        source: 'purchase',
        description: `Order #${orderResult.id.slice(0, 8)}`,
      });

      const { data: profile } = await supabase
        .from('profiles')
        .select('loyalty_points')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({ loyalty_points: (profile?.loyalty_points || 0) + pointsEarned })
        .eq('id', user.id);

      setPlacedOrder(orderResult);
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      toast({ variant: 'destructive', title: err?.message || 'Something went wrong. Please try again.' });
    } finally {
      setCheckingOut(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          <SEO title="Order Placed — BOYZ IN THE WOODZ" canonical="/order/confirmed" />
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: FG }}>
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-heading text-3xl tracking-wide uppercase mb-2">Order Placed!</h1>
          <p className="text-muted-foreground mb-1">
            Order <span className="text-foreground font-mono text-sm">{placedOrder.order_number}</span>
          </p>
          <p className="text-muted-foreground text-sm mb-2">
            We'll send a confirmation to <strong className="text-foreground">{user?.email}</strong>
          </p>
          <div className="bg-primary/10 rounded-xl p-4 mb-6 inline-flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="text-sm">You earned <strong className="text-foreground">{pointsEarned.toLocaleString()} Brotherhood Points</strong></span>
          </div>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
              <Link to="/account">My Orders</Link>
            </Button>
            <Button asChild className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <SEO title="Cart — BOYZ IN THE WOODZ" description="Your cart is ready. Complete your order and earn Brotherhood Points." canonical="/cart" />
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h1 className="font-heading text-3xl tracking-wide uppercase">Cart Is Empty</h1>
        <p className="text-sm text-muted-foreground mt-2 mb-6">Time to gear up, brother.</p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
            <Link to="/shop"><Trees className="w-3.5 h-3.5 mr-1.5" /> Shop Woodz</Link>
          </Button>
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
            <Link to="/shop/barber"><Scissors className="w-3.5 h-3.5 mr-1.5" /> Shop Barber</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <SEO title="Checkout — BOYZ IN THE WOODZ" description="Complete your order and earn Brotherhood Points." canonical="/cart" />

      {step === 'cart' ? (
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      ) : (
        <button onClick={() => setStep(STEPS[stepIndex - 1]?.key || 'cart')}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                i < stepIndex ? 'bg-primary text-white' :
                i === stepIndex ? 'border-2 border-primary text-primary' :
                'bg-secondary text-muted-foreground'
              }`}>
                {i < stepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="text-xs font-heading tracking-wider uppercase hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px min-w-6 ${i < stepIndex ? 'bg-primary' : 'bg-border'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Step 1: Cart Items */}
          {step === 'cart' && (
            <>
              <h2 className="font-heading text-lg tracking-wider uppercase mb-2">Cart Items ({itemCount})</h2>
              <AnimatePresence>
                {items.map(item => (
                  <motion.div key={item.key} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                    className="bg-card border border-border rounded-xl p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-6 h-6 opacity-20 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold">{item.product_name}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-heading tracking-wider uppercase px-1.5 py-0.5 rounded ${item.business === 'boyz' ? 'bg-green-900/40 text-green-400' : 'bg-amber-900/40 text-amber-400'}`}>
                              {item.business === 'boyz' ? 'Woodz' : 'Barber'}
                            </span>
                            {item.size && <span className="text-[10px] text-muted-foreground border border-border px-1.5 py-0.5 rounded">Size: {item.size}</span>}
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.key)} className="text-muted-foreground hover:text-destructive p-1 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 border border-border rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="p-1.5 hover:bg-secondary transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="p-1.5 hover:bg-secondary transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {hasBoyz && !hasBarber && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-accent/10 border border-accent/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent">Add barber merch for 20% off</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pomade, oils, and combs from The Chair</p>
                  </div>
                  <Button asChild size="sm" className="font-heading tracking-wider uppercase text-xs bg-accent text-accent-foreground hover:bg-accent/90">
                    <Link to="/shop/barber">Shop <ChevronRight className="w-3 h-3 ml-1" /></Link>
                  </Button>
                </motion.div>
              )}

              <div className="bg-card border border-border rounded-xl p-4">
                <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5" /> Discount Code
                </label>
                <div className="flex gap-2">
                  <Input value={discountCode} onChange={e => setDiscountCode(e.target.value)} placeholder="e.g. BROTHER10"
                    className="bg-secondary border-border text-sm" disabled={discountApplied} />
                  <Button variant="outline" onClick={handleApplyCode} disabled={discountApplied || !discountCode} className="font-heading tracking-wider uppercase text-xs">
                    {discountApplied ? '✓ Applied' : 'Apply'}
                  </Button>
                </div>
              </div>

              <Button onClick={() => setStep('shipping')} size="lg" className="w-full font-heading tracking-wider uppercase text-base">
                Continue to Shipping <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </>
          )}

          {/* Step 2: Shipping */}
          {step === 'shipping' && (
            <>
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Shipping Address
              </h2>
              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div>
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Full Name *</label>
                  <Input value={shipping.name} onChange={e => set('name', e.target.value)}
                    placeholder="John Doe" className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Street Address *</label>
                  <Input value={shipping.line1} onChange={e => set('line1', e.target.value)}
                    placeholder="123 Main St" className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">Apt / Suite (optional)</label>
                  <Input value={shipping.line2} onChange={e => set('line2', e.target.value)}
                    placeholder="Apt 4B" className="bg-secondary border-border" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">City *</label>
                    <Input value={shipping.city} onChange={e => set('city', e.target.value)}
                      placeholder="Portland" className="bg-secondary border-border" />
                  </div>
                  <div>
                    <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">State *</label>
                    <select value={shipping.state} onChange={e => set('state', e.target.value)}
                      className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground">
                      <option value="">Select</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="sm:w-1/3">
                  <label className="text-xs font-heading tracking-wider uppercase text-muted-foreground mb-1 block">ZIP Code *</label>
                  <Input value={shipping.zip} onChange={e => set('zip', e.target.value)}
                    placeholder="97201" className="bg-secondary border-border" />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('cart')} className="font-heading tracking-wider uppercase text-xs">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Cart
                </Button>
                <Button onClick={() => { if (validateShipping()) setStep('payment'); }} size="lg" className="flex-1 font-heading tracking-wider uppercase text-base">
                  Continue to Payment <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && (
            <>
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment
              </h2>

              {paymentSuccess ? (
                <div className="bg-card border border-border rounded-xl p-6 text-center">
                  <Check className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="font-heading text-base tracking-wider uppercase text-foreground mb-1">Payment Successful</p>
                  <p className="text-sm text-muted-foreground">${total.toFixed(2)} charged to your card</p>
                </div>
              ) : (
                <>
                  <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-heading tracking-wider uppercase">Card Details</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Secured by Stripe
                      </span>
                    </div>
                    <StripePaymentForm
                      amount={total}
                      onSuccess={() => setPaymentSuccess(true)}
                      buttonText={`Pay $${total.toFixed(2)}`}
                    />
                    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
                      <Shield className="w-3.5 h-3.5" />
                      Your card info is encrypted and never stored on our servers.
                    </div>
                  </div>
                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center"><span className="bg-background px-3 text-xs text-muted-foreground">OR</span></div>
                  </div>
                  <Button variant="outline" onClick={() => setPaymentSuccess(true)} className="w-full font-heading tracking-wider uppercase text-xs">
                    Pay on Delivery — ${total.toFixed(2)}
                  </Button>
                </>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('shipping')} className="font-heading tracking-wider uppercase text-xs">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Shipping
                </Button>
                {paymentSuccess && (
                  <Button onClick={() => setStep('review')} size="lg" className="flex-1 font-heading tracking-wider uppercase text-base">
                    Review Order <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Step 4: Review */}
          {step === 'review' && (
            <>
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4">Review Your Order</h2>

              <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" /> Shipping To
                  </h3>
                  <button onClick={() => setStep('shipping')} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {shipping.name}<br />
                  {shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ''}<br />
                  {shipping.city}, {shipping.state} {shipping.zip}
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-green-400" /> Payment
                  </h3>
                  <button onClick={() => setStep('payment')} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {paymentSuccess ? (
                    <span className="text-green-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Paid — ${total.toFixed(2)}</span>
                  ) : (
                    <span className="text-yellow-400">Pay on Delivery</span>
                  )}
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Items ({itemCount})</h3>
                  <button onClick={() => setStep('cart')} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                {items.map(item => (
                  <div key={item.key} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product_name}{item.size ? ` (${item.size})` : ''} <span className="text-foreground">×{item.quantity}</span>
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('payment')} className="font-heading tracking-wider uppercase text-xs">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Payment
                </Button>
                <Button onClick={handlePlaceOrder} disabled={checkingOut || !paymentSuccess}
                  size="lg" className="flex-1 font-heading tracking-wider uppercase text-base" style={{ background: FG }}>
                  {checkingOut ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Place Order — ${total.toFixed(2)}</span>
                  )}
                </Button>
              </div>
            </>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <Lock className="w-4 h-4 text-primary" />
              <span className="text-xs font-heading tracking-wider uppercase text-primary">Secure Checkout</span>
            </div>

            <h3 className="font-heading text-lg tracking-wider uppercase mb-4">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-primary">
                  <span>Discount (BROTHER10)</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? <span className="text-primary font-medium">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {subtotal < 99 && (
                <div className="bg-secondary rounded-lg p-2 text-xs text-muted-foreground">
                  Add <span className="text-primary font-medium">${(99 - subtotal).toFixed(2)}</span> more for free shipping
                  <div className="mt-1.5 bg-border rounded-full h-1.5"><div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal / 99) * 100)}%` }} /></div>
                </div>
              )}
              <div className="border-t border-border pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-primary">Earn <strong>{pointsEarned.toLocaleString()} Brotherhood Points</strong> with this order</span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Shield, label: '30-Day Returns' },
                { icon: Lock, label: 'SSL Secure' },
                { icon: RotateCcw, label: 'Free Returns' },
              ].map(b => (
                <div key={b.label} className="flex flex-col items-center gap-1">
                  <b.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-[9px] text-muted-foreground">{b.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] text-muted-foreground text-center mb-2 font-heading tracking-wider uppercase">We Accept</p>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENT_ICONS.map(p => (
                  <div key={p.name} title={p.name}
                    className="h-6 px-2 rounded text-[10px] font-bold flex items-center"
                    style={{ backgroundColor: p.bg, color: p.dark ? '#333' : '#fff', border: p.dark ? '1px solid #ddd' : 'none' }}>
                    {p.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
