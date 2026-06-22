/* ============================================================
   HOME EXPERIENCE — 4-phase journey visual
   SEO: Targets "wilderness retreat experience for men",
   "how men's retreat works", "outdoor brotherhood experience"
   long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoorOpen, WifiOff, Users, ArrowUp, ArrowRight, Flame, TreePine, Droplets } from 'lucide-react';

const PHASES = [
  { icon: DoorOpen, num: '01', title: 'Arrive', desc: 'No pressure. No expectations. Just show up.', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: WifiOff, num: '02', title: 'Unplug', desc: 'No phones. Cameras OK. Be fully present.', color: 'text-accent', bg: 'bg-accent/10' },
  { icon: Users, num: '03', title: 'Connect', desc: 'Fire. Food. Honest conversation until 3am.', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  { icon: ArrowUp, num: '04', title: 'Return', desc: 'Lighter. Clearer. Stronger. With proof.', color: 'text-primary', bg: 'bg-primary/10' },
];

const ACTIVITIES = [
  { icon: Flame, label: 'Campfire' },
  { icon: TreePine, label: 'Hiking' },
  { icon: Droplets, label: 'Swimming' },
];

export default function HomeExperience() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Experience</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">
            How It Works
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
            Four phases. One transformation. Like stepping out of the maze — just long enough to catch your breath.
          </p>
        </motion.div>

        {/* 4 Phases */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {PHASES.map((p, i) => (
            <motion.div key={p.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 text-center relative">
              {/* Connector line */}
              {i < PHASES.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-border z-10" />
              )}
              <span className="font-heading text-3xl text-border">{p.num}</span>
              <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center mx-auto my-3`}>
                <p.icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <h3 className="font-heading text-lg tracking-wider uppercase">{p.title}</h3>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Activities */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex items-center justify-center gap-6 mb-8">
          {ACTIVITIES.map(a => (
            <div key={a.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <a.icon className="w-4 h-4 text-primary" />
              <span>{a.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
          <Link to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs text-primary hover:text-primary/80 transition-colors">
            Full Journey <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
