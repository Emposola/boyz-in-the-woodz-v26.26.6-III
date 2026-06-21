/* ============================================================
   WALK-IN WAITLIST — Info page explaining how walk-ins work
   Phase 1: static info + email capture. Phase 2: live queue
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, UserCheck, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function WalkInWaitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      toast.success('You\'re on the early access list!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-20 md:py-28 bg-secondary/30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <Clock className="w-8 h-8 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Walk-In Waitlist</h1>
          <p className="text-muted-foreground text-sm mt-3">
            No appointment? No problem. Join the digital queue and get a text when we're ready.
          </p>
        </motion.div>
      </section>

      {/* --- How It Works --- */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl tracking-wider uppercase text-center mb-10">How It Works</h2>
        <div className="space-y-8">
          {[
            { icon: UserCheck, step: '01', title: 'Join the Queue', desc: 'Walk in or join digitally. Tell us your name and phone number.' },
            { icon: Clock, step: '02', title: 'Wait Comfortably', desc: 'See your real-time position. Grab a drink, browse gear, or step out briefly.' },
            { icon: MessageSquare, step: '03', title: 'Get Notified', desc: 'We text you when your barber is ready. 5-minute window to claim your spot.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0">
                <span className="font-heading text-4xl text-border">{item.step}</span>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg tracking-wider uppercase">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Email Capture --- */}
        <div className="mt-16 bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="font-heading text-xl tracking-wider uppercase">Coming Soon — Live Queue</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Get notified when the digital walk-in waitlist goes live.
          </p>
          {submitted ? (
            <p className="text-primary text-sm">You're on the list. We'll text you when it's live.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border"
              />
              <Button type="submit" className="font-heading tracking-wider uppercase flex-shrink-0">
                Notify Me
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}