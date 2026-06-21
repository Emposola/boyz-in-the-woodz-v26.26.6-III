/* ============================================================
   THE CODE — The 5 non-negotiables displayed as hero icons
   No Phones, Show Up, Respect, No Ego, Leave Better
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Footprints, Heart, Eye, ArrowUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePledge } from '@/lib/pledgeContext';
import PledgeModal from '../components/shared/PledgeModal';

const CODE_RULES = [
  {
    icon: Smartphone,
    title: 'No Phones',
    number: '01',
    desc: 'When you enter the wilderness or sit in the chair, your phone stays away. Be present. Be here. The world can wait — you can\'t.',
  },
  {
    icon: Footprints,
    title: 'Show Up Physically',
    number: '02',
    desc: 'There are no shortcuts. Your body in the room. Your feet on the trail. Your ass in the chair. Presence is non-negotiable.',
  },
  {
    icon: Heart,
    title: 'Respect Everyone',
    number: '03',
    desc: 'Every man who walks through that door or steps on that trail earns dignity by default. Titles stay outside.',
  },
  {
    icon: Eye,
    title: 'No Ego',
    number: '04',
    desc: 'Check it at the door. The forest doesn\'t care about your car. The barber doesn\'t care about your job. Growth requires humility.',
  },
  {
    icon: ArrowUp,
    title: 'Leave Better',
    number: '05',
    desc: 'Than when you arrived. Better groomed, better rested, better connected, better human. This is the only rule that matters.',
  },
];

export default function TheCode() {
  const { pledgeAccepted } = usePledge();
  const [pledgeOpen, setPledgeOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section
        className="relative h-72 md:h-96 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1533577116850-9cc66cad8a9b?w=1400&q=80)' }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase">The Code</h1>
          <p className="text-muted-foreground text-sm mt-2">Five non-negotiables. One brotherhood.</p>
        </motion.div>
      </section>

      {/* --- Rules Grid --- */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-24 space-y-12 md:space-y-20">
        {CODE_RULES.map((rule, i) => (
          <motion.div
            key={rule.number}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`flex flex-col md:flex-row items-start gap-6 md:gap-10 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Number + Icon */}
            <div className="flex-shrink-0 flex items-center gap-4">
              <span className="font-heading text-6xl md:text-8xl text-border">{rule.number}</span>
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <rule.icon className="w-7 h-7" />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="font-heading text-2xl md:text-3xl tracking-wider uppercase">{rule.title}</h3>
              <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed max-w-lg">
                {rule.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* --- Accept Pledge CTA --- */}
      {!pledgeAccepted && (
        <section className="py-16 bg-secondary/50 text-center">
          <h2 className="font-heading text-3xl tracking-wide uppercase">Ready to Join?</h2>
          <p className="text-sm text-muted-foreground mt-2 mb-6">Accept The Code to unlock shopping and the brotherhood.</p>
          <Button onClick={() => setPledgeOpen(true)} className="font-heading tracking-wider uppercase">
            Take The Pledge
          </Button>
          <PledgeModal open={pledgeOpen} onOpenChange={setPledgeOpen} />
        </section>
      )}
    </div>
  );
}