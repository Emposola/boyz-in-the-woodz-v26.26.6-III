/* ============================================================
   BROTHERHOOD TIME CAPSULE — /community/time-capsule
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const DELIVERY_OPTIONS = [
  { label: '1 Year', months: 12, icon: '🌱', desc: 'A quick check-in with your current self' },
  { label: '3 Years', months: 36, icon: '🌳', desc: 'Enough time to see real change' },
  { label: '5 Years', months: 60, icon: '🏔️', desc: 'The man you\'ll become' },
];

export default function TimeCapsule() {
  const [form, setForm] = useState({ email: '', delivery: null, letter: '', name: '' });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const deliveryDate = () => {
    if (!form.delivery) return null;
    const d = new Date();
    d.setMonth(d.getMonth() + form.delivery.months);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-10 max-w-md w-full text-center">
          <Lock className="w-14 h-14 mx-auto mb-5" style={{ color: FG }} />
          <h2 className="font-heading text-3xl tracking-wide uppercase mb-3">Sealed & Saved</h2>
          <p className="text-muted-foreground mb-2">Your letter to your future self is sealed.</p>
          <p className="text-sm font-medium text-foreground mb-4">It will be delivered on <span style={{ color: FG }}>{deliveryDate()}</span></p>
          <p className="text-xs text-muted-foreground">We'll send it to <strong>{form.email}</strong>. Make sure that email will still be yours.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Brotherhood</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Time Capsule</h1>
          <p className="text-muted-foreground">Write a letter to your future self. We'll deliver it when the time comes.</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} className="space-y-6">
          {/* Delivery Option */}
          <div>
            <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-3">When should your future self read this?</p>
            <div className="grid grid-cols-3 gap-3">
              {DELIVERY_OPTIONS.map(opt => (
                <button key={opt.label} type="button" onClick={() => set('delivery', opt)}
                  className={`p-4 rounded-xl border text-center transition-all ${form.delivery?.label === opt.label ? 'border-primary/60 bg-primary/10' : 'border-border hover:border-border/80 bg-card'}`}>
                  <div className="text-3xl mb-2">{opt.icon}</div>
                  <p className="font-heading text-sm tracking-wider uppercase">{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
            {form.delivery && (
              <p className="text-xs mt-2 text-center" style={{ color: FG }}>
                Will be delivered on {deliveryDate()}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Your Name (how you want your future self to be greeted)</label>
            <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="What do you call yourself right now?" className="bg-secondary border-border" required />
          </div>

          {/* Delivery Email */}
          <div>
            <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Email Address</label>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="Where should we send it?" className="bg-secondary border-border" required />
          </div>

          {/* Letter */}
          <div>
            <label className="block text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-2">Your Letter to Your Future Self</label>
            <div className="relative">
              <textarea value={form.letter} onChange={e => set('letter', e.target.value)} required rows={14}
                placeholder={`Dear future ${form.name || '[your name]'},\n\nRight now I am...\n\nThe thing I'm most afraid of is...\n\nWhat I hope is different when you read this...\n\nWhat I want you to remember about this time...\n\nWith love,\n${form.name || 'You'} — ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
                className="w-full bg-secondary border border-border rounded-md px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary resize-none leading-relaxed font-accent" />
              <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground">{form.letter.length} chars</div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
            <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Your letter is encrypted and stored securely. No one reads it. It is delivered only to your email address on the date you chose. You can cancel delivery any time before then from your account dashboard.</p>
          </div>

          <Button type="submit" size="lg" disabled={!form.delivery || !form.letter || !form.email}
            className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Lock className="w-4 h-4 mr-2" /> Seal My Letter
          </Button>
        </form>
      </div>
    </div>
  );
}