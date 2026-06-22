/* ============================================================
   HOME CRISIS — Iceberg + key stats from brand deck
   SEO: Targets "men mental health crisis", "loneliness epidemic",
   "men stress statistics" long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Eye, ArrowRight } from 'lucide-react';

const VISIBLE = [
  '"Busy. Focused. Grinding."',
  'Working late. Always available.',
  'Looks in control.',
];

const HIDDEN = [
  "Hasn't slept properly in weeks",
  "Can't remember last real conversation",
  'Tired. Isolated. Overloaded.',
];

const STATS = [
  { value: '77%', label: 'of men experience high daily stress' },
  { value: '40%', label: 'never discuss their mental health' },
  { value: '62%', label: 'feel emotionally isolated' },
  { value: '70%', label: 'lost their best friend after age 30' },
];

export default function HomeCrisis() {
  return (
    <section className="py-16 md:py-24 bg-destructive/3">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-3" />
          <span className="text-xs font-heading tracking-[0.3em] text-destructive uppercase">The Crisis Is Real</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">
            What's Happening To Men Right Now
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
            The data is clear. Men are stressed, isolated, and running on empty.
            This isn't opinion — it's research.
          </p>
        </motion.div>

        {/* Iceberg */}
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-xs font-heading tracking-wider uppercase text-primary">What People See</span>
            </div>
            <ul className="space-y-3">
              {VISIBLE.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-heading tracking-wider uppercase text-destructive">What's Underneath</span>
            </div>
            <ul className="space-y-3">
              {HIDDEN.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground/70">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/50 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="font-heading text-3xl text-foreground">{s.value}</div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center">
          <Link to="/the-problem"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs text-foreground border border-border hover:bg-secondary transition-colors">
            See Full Breakdown <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
