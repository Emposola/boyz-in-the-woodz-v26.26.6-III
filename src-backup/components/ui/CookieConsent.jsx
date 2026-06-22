/* Cookie consent banner */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('bitw_cookies');
    if (!accepted) setTimeout(() => setVisible(true), 2000);
  }, []);

  const accept = () => { localStorage.setItem('bitw_cookies', 'accepted'); setVisible(false); };
  const decline = () => { localStorage.setItem('bitw_cookies', 'declined'); setVisible(false); };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: 'spring', damping: 25 }}
          className="fixed bottom-20 lg:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-2xl">
            <div className="flex items-start gap-3">
              <Cookie className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-heading text-sm tracking-wider uppercase">Cookies & Privacy</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We use cookies to personalize your experience and remember your cart.
                  <Link to="/cookies" className="text-primary ml-1 hover:underline">Learn more</Link>
                </p>
              </div>
              <button onClick={decline} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={accept} className="flex-1 font-heading tracking-wider uppercase text-xs">Accept All</Button>
              <Button onClick={decline} variant="outline" className="flex-1 font-heading tracking-wider uppercase text-xs">Decline</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}