/* ============================================================
   HOME SCIENCE — Why Nature Works (3 stats from brand deck)
   SEO: Targets "nature reduces cortisol", "outdoor therapy men",
   "science behind wilderness retreats" long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, HeartPulse, Shield, ExternalLink, ArrowRight } from 'lucide-react';

const SCIENCE = [
  {
    icon: Brain,
    value: '21%',
    title: 'Cortisol Drops',
    desc: 'Just 20 minutes in nature reduces cortisol — the stress hormone — by 21%. That\'s a biological reset no supplement can match.',
    source: 'Cornell University, 2019',
    url: 'https://doi.org/10.3389/fpsyg.2019.00722',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: HeartPulse,
    value: '50%',
    title: 'Depression Risk Cut',
    desc: 'Regular nature exposure and face-to-face male bonding reduces depression risk by half. Real connection is medicine.',
    source: 'Social Psychiatry Journal, 2021',
    url: 'https://doi.org/10.1007/s00127-018-1501-2',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Shield,
    value: '45%',
    title: 'Longer Life',
    desc: 'Men with strong social ties have 45% lower mortality risk. We\'re not just building brotherhood — we\'re extending lives.',
    source: 'PLOS Medicine, 2022',
    url: 'https://doi.org/10.1371/journal.pmed.1000316',
    color: 'text-green-400',
    bg: 'bg-green-400/10',
  },
];

export default function HomeScience() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Evidence</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">
            Why Nature Works
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
            This isn't hippie talk. Peer-reviewed studies prove what we already know:
            getting outside and building bonds literally saves lives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {SCIENCE.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-4`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className={`font-heading text-4xl ${s.color}`}>{s.value}</div>
              <h3 className="font-heading text-lg tracking-wider uppercase mt-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.desc}</p>
              <a href={s.url} target="_blank" rel="noopener noreferrer"
                className={`inline-flex items-center gap-1 text-[10px] ${s.color} hover:underline mt-3`}>
                {s.source} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-10">
          <Link to="/science"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs text-primary hover:text-primary/80 transition-colors">
            Full Research <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
