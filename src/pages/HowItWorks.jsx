/* ============================================================
   HOW IT WORKS — The 4-phase experience journey
   Arrive → Unplug → Connect → Return
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { DoorOpen, WifiOff, Users, ArrowUp, ArrowRight, Shield, TreePine, Flame, Droplets } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/shared/SEO';

const PHASES = [
  {
    number: '01',
    icon: DoorOpen,
    title: 'Arrive',
    tagline: 'No pressure. No expectations.',
    description: 'You show up. That\'s it. No resume. No small talk about your job. No performance. Just walk through the door — or onto the trail — and be here. The woods don\'t care about your title. Neither do we.',
    details: [
      'Arrive whenever you want — no rush',
      'No preparation needed',
      'Leave your status at the gate',
      'Just bring yourself',
    ],
    color: 'text-primary',
    bg: 'bg-primary/10',
    borderColor: 'border-primary/30',
    iconBg: 'bg-primary/20',
  },
  {
    number: '02',
    icon: WifiOff,
    title: 'Unplug',
    tagline: 'No phones. Just presence.',
    description: 'Cameras are allowed to capture moments. But the phone stays away. This is the rarest thing you can give another human being: your full attention. For the first time in months, you\'ll actually be somewhere.',
    details: [
      'Phones stowed during activities',
      'Cameras OK for capturing moments',
      'Be present with your brothers',
      'The world can wait — you can\'t',
    ],
    color: 'text-accent',
    bg: 'bg-accent/10',
    borderColor: 'border-accent/30',
    iconBg: 'bg-accent/20',
  },
  {
    number: '03',
    icon: Users,
    title: 'Connect',
    tagline: 'Fire. Food. Honest conversation.',
    description: 'Fishing. Hiking. Swimming. Campfire talks that last until 3am. This is where the walls come down. Where strangers become brothers. Where you say what you\'ve been holding in — and someone actually listens.',
    details: [
      'Campfire conversations',
      'Hiking, fishing, swimming',
      'Honest, unfiltered dialogue',
      'Brotherhood built through doing',
    ],
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30',
    iconBg: 'bg-orange-400/20',
  },
  {
    number: '04',
    icon: ArrowUp,
    title: 'Return',
    tagline: 'Lighter. Clearer. Stronger.',
    description: 'You go back to your life — but you\'re different. You\'ve been reminded who you are outside of your role. You have proof: the gear you wear, the bonds you\'ve formed, the memories that no algorithm can touch.',
    details: [
      'Lighter than when you arrived',
      'Clearer about what matters',
      'Connected to real brothers',
      'Proof you were there — gear, photos, bonds',
    ],
    color: 'text-primary',
    bg: 'bg-primary/10',
    borderColor: 'border-primary/30',
    iconBg: 'bg-primary/20',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SEO
        title="How It Works — The Experience Journey"
        description="Arrive. Unplug. Connect. Return. The 4-phase wilderness experience that helps men reset, reconnect, and return stronger. Backed by science."
        canonical="/how-it-works"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How The BITW Experience Works',
          description: 'A 4-phase wilderness experience: Arrive, Unplug, Connect, Return.',
          step: [
            { '@type': 'HowToStep', name: 'Arrive', text: 'Show up. No pressure. No expectations.' },
            { '@type': 'HowToStep', name: 'Unplug', text: 'Put the phone away. Be fully present.' },
            { '@type': 'HowToStep', name: 'Connect', text: 'Campfire, food, honest conversation, outdoor activities.' },
            { '@type': 'HowToStep', name: 'Return', text: 'Go back lighter, clearer, and stronger.' },
          ],
        }}
      />

      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Experience</span>
            <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mt-3">
              How It Works
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
              Four phases. One transformation. Like stepping out of the maze — just long enough to catch your breath.
            </p>
            <p className="text-foreground/60 text-sm mt-4 italic">
              Then you go back in. Stronger.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 4 Phases */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-16 md:space-y-24">
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Connector line */}
                {i < PHASES.length - 1 && (
                  <div className="absolute left-8 md:left-12 top-full w-px h-16 md:h-24 bg-border z-0" />
                )}

                <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
                  {/* Phase Number + Icon */}
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-5xl md:text-7xl text-border">{phase.number}</span>
                    <div className={`w-14 h-14 rounded-2xl ${phase.iconBg} flex items-center justify-center`}>
                      <phase.icon className={`w-6 h-6 ${phase.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-2">{phase.title}</h2>
                    <p className={`font-accent text-lg italic ${phase.color} mb-4`}>{phase.tagline}</p>
                    <p className="text-foreground/70 leading-relaxed mb-6 max-w-2xl">{phase.description}</p>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {phase.details.map((detail, j) => (
                        <div key={j} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                          <div className={`w-1.5 h-1.5 rounded-full ${phase.bg} flex-shrink-0`} style={{ background: `currentColor` }} />
                          <span className="text-sm text-foreground/70">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What Happens in the Woods */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">In The Woods</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">What Happens</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Flame, title: 'Fire', desc: 'Brotherhood. Warmth. Ancient human ritual.', color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { icon: TreePine, title: 'Movement', desc: 'Hiking. Camping. Walking. Rebuilding the body.', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Droplets, title: 'Silence', desc: 'The rarest resource. The most powerful reset.', color: 'text-blue-400', bg: 'bg-blue-400/10' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center">
                <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-4`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <h3 className="font-heading text-2xl tracking-wider uppercase mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Code Reminder */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card border border-primary/20 rounded-2xl p-8 text-center">
            <Shield className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="font-heading text-2xl tracking-wider uppercase mb-3">Remember The Code</h3>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['No Phones', 'Show Up', 'Respect', 'No Ego', 'Leave Better'].map(rule => (
                <span key={rule} className="text-xs font-heading tracking-wider uppercase px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                  {rule}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Follow the code → Create Trust → Build Safety → Brotherhood grows.
            </p>
            <Link to="/the-code"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Read The Code <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mb-4">
              Ready To Step Outside?
            </h2>
            <p className="text-muted-foreground text-base mb-8 max-w-xl mx-auto">
              You don't need to escape your life. You just need a place to breathe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/retreat/apply"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">
                Apply for Retreat <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link to="/retreat-calendar"
                className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-heading tracking-wider uppercase text-sm text-foreground border border-border hover:bg-secondary transition-colors">
                View Retreat Calendar
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
