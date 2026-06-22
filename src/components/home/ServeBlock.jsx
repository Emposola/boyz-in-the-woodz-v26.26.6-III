/* ============================================================
   SERVE BLOCK — "Who We Serve" section on homepage
   4 personas with stats + CTA
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Baby, Cloud, TreePine, ArrowRight } from 'lucide-react';

const PERSONAS = [
  {
    icon: Zap,
    title: 'The Hustler',
    desc: 'Always working. Never stopping.',
    stat: '58%',
    statLabel: 'say work defines identity',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    icon: Baby,
    title: 'The Father',
    desc: 'Wants to be present. Life moves too fast.',
    stat: '54%',
    statLabel: 'spend <1hr/day with kids',
    color: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/20',
  },
  {
    icon: Cloud,
    title: 'The Lost One',
    desc: "Feels off. Can't explain why.",
    stat: '1 in 3',
    statLabel: 'show undiagnosed depression',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  {
    icon: TreePine,
    title: 'The Nostalgic',
    desc: 'Misses who he was before.',
    stat: '70%',
    statLabel: 'lost best friend after 30',
    color: 'text-amber-600',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600/20',
  },
];

export default function ServeBlock() {
  return (
    <section className="py-16 md:py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Who We Serve</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">
            Every Man Who Has Ever<br />Said <span className="text-primary">"I'm Fine"</span>
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
            We don't serve a demographic. We serve a feeling.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERSONAS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-card border ${p.border} rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 group`}
            >
              <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                <p.icon className={`w-5 h-5 ${p.color}`} />
              </div>
              <h3 className="font-heading text-lg tracking-wider uppercase mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{p.desc}</p>
              <div className={`${p.bg} rounded-lg px-3 py-2 mb-4`}>
                <span className={`font-heading text-2xl ${p.color}`}>{p.stat}</span>
                <p className="text-[10px] text-muted-foreground">{p.statLabel}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/who-we-serve"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Meet All Four <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
