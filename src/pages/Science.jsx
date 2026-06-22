/* ============================================================
   SCIENCE SNAPSHOT — Animated stats on nature's impact
   Cornell cortisol study, PLOS Medicine mortality, depression
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Brain, HeartPulse, Smile, ExternalLink } from 'lucide-react';
import SEO from '@/components/shared/SEO';

/* --- Science data --- */
const STATS = [
  {
    icon: Brain,
    stat: '21%',
    label: 'Cortisol Drop',
    detail: '20 minutes in nature reduces stress hormone cortisol by 21%.',
    source: 'Cornell University, 2019',
    sourceUrl: 'https://doi.org/10.3389/fpsyg.2019.00722',
    color: 'hsl(82, 60%, 45%)',
    value: 21,
  },
  {
    icon: HeartPulse,
    stat: '45%',
    label: 'Lower Mortality',
    detail: 'Strong social connections reduce all-cause mortality risk by up to 45%.',
    source: 'PLOS Medicine, 2010',
    sourceUrl: 'https://doi.org/10.1371/journal.pmed.1000316',
    color: 'hsl(28, 70%, 50%)',
    value: 45,
  },
  {
    icon: Smile,
    stat: '-50%',
    label: 'Depression Risk',
    detail: 'Regular nature exposure and male bonding reduces depression risk by half.',
    source: 'Social Psychiatry & Psychiatric Epidemiology',
    sourceUrl: 'https://doi.org/10.1007/s00127-018-1501-2',
    color: 'hsl(150, 40%, 45%)',
    value: 50,
  },
];

/* --- Chart data for the bar chart --- */
const chartData = STATS.map(s => ({ name: s.label, value: s.value, color: s.color }));

export default function Science() {
  return (
    <div className="min-h-screen">
      <SEO
        title="Science — Why Nature Saves Lives"
        description="Peer-reviewed research proves nature reduces cortisol by 21%, cuts depression risk by 50%, and lowers mortality by 45%. The science behind Boyz In The Woodz."
        canonical="/science"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Science — Why Nature Saves Lives',
          description: 'Scientific evidence behind wilderness retreats and brotherhood for men\'s health.',
          publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
        }}
      />

      {/* --- Hero --- */}
      <section className="relative py-20 md:py-28 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Evidence</span>
            <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mt-2">
              Science Snapshot
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mt-4 max-w-lg mx-auto">
              This isn't hippie talk. Peer-reviewed studies prove what we already know: 
              getting outside and building bonds literally saves lives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- Stats Cards --- */}
      <section className="max-w-5xl mx-auto px-4 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${s.color}20` }}>
                <s.icon className="w-6 h-6" style={{ color: s.color }} />
              </div>
              <div className="font-heading text-5xl tracking-wide" style={{ color: s.color }}>
                {s.stat}
              </div>
              <h3 className="font-heading text-lg tracking-wider uppercase mt-2">{s.label}</h3>
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.detail}</p>
              <a
                href={s.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3"
              >
                {s.source} <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* --- Bar Chart --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-card border border-border rounded-lg p-6"
        >
          <h3 className="font-heading text-xl tracking-wider uppercase text-center mb-6">Impact At A Glance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 6%, 18%)" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(40, 10%, 55%)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(40, 10%, 55%)', fontSize: 12 }} unit="%" />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>
    </div>
  );
}