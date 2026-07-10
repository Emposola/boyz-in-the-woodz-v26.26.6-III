/* Marketing popup — shows after 8 seconds, once per session */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const EDGE_FN_URL = import.meta.env.VITE_SUPABASE_EDGE_FUNCTIONS_URL
  || 'https://pgwcfazhwuzxcqbqbjat.supabase.co/functions/v1';

async function sendWelcomeEmail(email) {
  try {
    await supabase.functions.invoke('send-newsletter', {
      body: { action: 'welcome', email },
    });
  } catch (e) {
    console.error('Welcome email send failed:', e);
  }
}

export default function MarketingPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('bitw_popup');
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => { sessionStorage.setItem('bitw_popup', '1'); setVisible(false); };

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('newsletter_subscribers')
        .insert({ email: email.trim(), source: 'popup' });
      if (error && error.code !== '23505') throw error;
      await sendWelcomeEmail(email.trim());
      setDone(true);
      toast.success('Welcome to the brotherhood! Check your inbox.');
      setTimeout(dismiss, 2000);
    } catch (err) {
      console.error('Popup subscribe error:', err);
      toast.error('Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="relative bg-card border border-border rounded-2xl overflow-hidden max-w-lg w-full shadow-2xl">
            <button onClick={dismiss} className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors bg-background/80 rounded-full p-1">
              <X className="w-4 h-4" />
            </button>
            {/* Image half */}
            <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: 'url(/images/unsplash/forest-campfire.webp)' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
              <div className="absolute bottom-4 left-6">
                <span className="bg-primary text-primary-foreground text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5" /> Welcome Offer
                </span>
              </div>
            </div>
            {/* Content */}
            <div className="p-6">
              {done ? (
                <div className="text-center py-4">
                  <div className="text-3xl mb-2">🎉</div>
                  <h3 className="font-heading text-xl uppercase">You're In, Brother</h3>
                  <p className="text-sm text-muted-foreground mt-1">Check your email for your 10% off code.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-heading text-2xl tracking-wide uppercase mb-1">Get 10% Off Your First Order</h3>
                  <p className="text-sm text-muted-foreground mb-5">Join the brotherhood. Get exclusive drops, retreat access, and 10% off — instantly.</p>
                  <form onSubmit={submit} className="flex gap-2">
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="bg-secondary border-border" required />
                    <Button type="submit" disabled={submitting} className="font-heading tracking-wider uppercase text-xs flex-shrink-0">
                      {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><ArrowRight className="w-3.5 h-3.5 ml-1" /> Join</>}
                    </Button>
                  </form>
                  <p className="text-[10px] text-muted-foreground mt-3 text-center">No spam. Unsubscribe anytime. We live The Code.</p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}