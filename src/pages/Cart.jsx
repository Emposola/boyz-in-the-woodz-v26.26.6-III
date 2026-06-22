/* ============================================================
   UNIFIED CART & CHECKOUT — Secure checkout design
   Payment methods displayed, trust badges, order summary
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingBag, Minus, Plus, X, ArrowLeft, Coins,
  Trees, Scissors, Shield, Lock, CreditCard, RotateCcw, Tag, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const PAYMENT_ICONS = [
  { name: 'Visa', bg: '#1A1F71', text: 'VISA' },
  { name: 'MC', bg: '#EB001B', text: '●●' },
  { name: 'Amex', bg: '#007BC1', text: 'AMEX' },
  { name: 'Shop Pay', bg: '#5A31F4', text: 'Shop' },
  { name: 'Apple Pay', bg: '#000', text: '🍎' },
  { name: 'Google Pay', bg: '#fff', text: 'G Pay', dark: true },
];

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, itemCount } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const discount = discountApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal >= 99 ? 0 : 9.99;
  const total = subtotal - discount + shipping;
  const pointsEarned = Math.floor(subtotal * 10);

  const hasBoyz = items.some(i => i.business === 'boyz');
  const hasBarber = items.some(i => i.business === 'barber');

  const handleApplyCode = () => {
    if (discountCode.toUpperCase() === 'BROTHER10') {
      setDiscountApplied(true);
      toast.success('Code applied! 10% off your order.');
    } else {
      toast.error('Invalid discount code.');
    }
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      toast.success(`Order placed! You earned ${pointsEarned} Brotherhood Points.`);
      clearCart();
      setCheckingOut(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h1 className="font-heading text-3xl tracking-wide uppercase">Cart Is Empty</h1>
        <p className="text-sm text-muted-foreground mt-2 mb-6">Time to gear up, brother.</p>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
            <Link to="/shop/boyz"><Trees className="w-3.5 h-3.5 mr-1.5" /> Shop Woodz</Link>
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
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Continue Shopping
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase">Your Cart</h1>
        <span className="bg-primary/10 text-primary font-heading text-sm px-3 py-1 rounded-full">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3">
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
                          {item.business === 'boyz' ? '🌲 Woodz' : '✂️ Barber'}
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

          {/* Cross-sell */}
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

          {/* Discount Code */}
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
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
            {/* Secure badge */}
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
                <span>{shipping === 0 ? <span className="text-primary font-medium">Free 🎉</span> : `$${shipping.toFixed(2)}`}</span>
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

            {/* Points preview */}
            <div className="mt-4 bg-primary/10 rounded-lg p-3 flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-primary">Earn <strong>{pointsEarned.toLocaleString()} Brotherhood Points</strong> with this order</span>
            </div>

            <Button onClick={handleCheckout} disabled={checkingOut} className="w-full mt-4 font-heading tracking-wider uppercase py-5 text-base">
              {checkingOut ? (
                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Processing...</span>
              ) : (
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Secure Checkout — ${total.toFixed(2)}</span>
              )}
            </Button>

            {/* Trust badges */}
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

            {/* Payment methods */}
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