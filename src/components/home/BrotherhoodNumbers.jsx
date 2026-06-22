/* ============================================================
   BROTHERHOOD BY NUMBERS — Animated counters
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const STATS = [
  { value: 12847, label: 'Brothers Pledged', suffix: '', prefix: '' },
  { value: 23, label: 'Retreats Held', suffix: '+', prefix: '' },
  { value: 4891, label: 'Proofs Shared', suffix: '', prefix: '' },
  { value: 12, label: 'Active Chapters', suffix: '', prefix: '' },
  { value: 2400000, label: 'Points Earned', suffix: '', prefix: '', short: '2.4M' },
  { value: 89, label: 'Feel Better After Retreat', suffix: '%', prefix: '' },
];

function Counter({ target, suffix, prefix, short, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (short) { setCount(target); return; }
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(t); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(t);
  }, [inView, target, duration, short]);

  const display = short || count.toLocaleString();

  return (
    <span ref={ref} className="font-heading text-4xl md:text-5xl" style={{ color: FG }}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function BrotherhoodNumbers() {
  return (
    <section className="py-16 border-y border-border overflow-hidden relative" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.05) 0%, transparent 60%)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Real Numbers</span>
          <h2 className="font-heading text-3xl tracking-wide uppercase mt-2">Brotherhood by the Numbers</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="group">
              <Counter target={stat.value} suffix={stat.suffix} prefix={stat.prefix} short={stat.short} />
              <p className="text-xs text-muted-foreground mt-1 font-heading tracking-wider uppercase leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}