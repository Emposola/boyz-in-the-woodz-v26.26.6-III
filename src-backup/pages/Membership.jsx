/* ============================================================
   MEMBERSHIP INFO — $29/month barber membership details
   Static page with benefits. "Join" collects email for Phase 2
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Scissors, Percent, CalendarCheck, Star, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BENEFITS = [
  { icon: Scissors, title: '1 Free Haircut / Month', desc: 'Your monthly cut is on us. No appointments wasted.' },
  { icon: Percent, title: '15% Off All Merch', desc: 'Pomade, aprons, combs, tees — everything from The Chair.' },
  { icon: CalendarCheck, title: 'Priority Booking', desc: 'Book 3 days before non-members. Never wait again.' },
  { icon: Star, title: 'Bonus Points', desc: '2x Brotherhood Points on all purchases.' },
];

export default function Membership() {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoin = (e) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      toast.success('You\'re on the membership waitlist!');
    }
  };

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-20 md:py-28 bg-secondary/30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <Crown className="w-10 h-10 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Membership</h1>
          <div className="mt-4 flex items-baseline justify-center gap-1">
            <span className="font-heading text-5xl md:text-7xl text-accent">$29</span>
            <span className="text-muted-foreground text-sm">/month</span>
          </div>
          <p className="text-muted-foreground text-sm mt-4 max-w-md mx-auto">
            The brotherhood's VIP tier. One haircut, lifetime perks, and priority access to everything.
          </p>
        </motion.div>
      </section>

      {/* --- Benefits --- */}
      <section className="max-w-4xl mx-auto px-4 py-16 grid sm:grid-cols-2 gap-6">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-border rounded-lg p-6 flex gap-4"
          >
            <div className="p-3 rounded-lg bg-accent/10 text-accent flex-shrink-0 h-fit">
              <b.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg tracking-wider uppercase">{b.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- Join Waitlist --- */}
      <section className="max-w-md mx-auto px-4 pb-20 text-center">
        {joined ? (
          <div className="bg-card border border-accent rounded-lg p-8">
            <Crown className="w-8 h-8 text-accent mx-auto mb-3" />
            <h3 className="font-heading text-xl tracking-wider uppercase">You're In</h3>
            <p className="text-sm text-muted-foreground mt-2">We'll notify you when membership checkout is live.</p>
          </div>
        ) : (
          <form onSubmit={handleJoin} className="space-y-4">
            <h3 className="font-heading text-xl tracking-wider uppercase">Join the Waitlist</h3>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary border-border text-center"
            />
            <Button type="submit" className="w-full font-heading tracking-wider uppercase bg-accent hover:bg-accent/90 text-accent-foreground">
              <Crown className="w-4 h-4 mr-2" /> Reserve My Spot
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}