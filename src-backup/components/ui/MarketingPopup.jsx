/* Marketing popup — shows after 8 seconds, once per session */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function MarketingPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('bitw_popup');
    if (!dismissed) {
      const t = setTimeout(() => setVisible(true), 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => { sessionStorage.setItem('bitw_popup', '1'); setVisible(false); };

  const submit = (e) => {
    e.preventDefault();
    setDone(true);
    toast.success('Welcome to the brotherhood! Check your inbox.');
    setTimeout(dismiss, 2000);
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
            <div className="relative h-44 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80)' }}>
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
                    <Button type="submit" className="font-heading tracking-wider uppercase text-xs flex-shrink-0">
                      Join <ArrowRight className="w-3.5 h-3.5 ml-1" />
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