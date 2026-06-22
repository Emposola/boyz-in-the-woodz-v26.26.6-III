/* Impact counters — PAKA-inspired animated stats */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trees, Users, Scissors, Trophy } from 'lucide-react';

const STATS = [
  { icon: Users, value: 5284, suffix: '+', label: 'Brothers in the Brotherhood', color: 'text-primary' },
  { icon: Trees, value: 47, suffix: ' Retreats', label: 'Completed across 12 states', color: 'text-green-400' },
  { icon: Scissors, value: 12300, suffix: '+', label: 'Haircuts delivered', color: 'text-accent' },
  { icon: Trophy, value: 2100000, suffix: 'pts', label: 'Brotherhood Points earned', color: 'text-yellow-400' },
];

function Counter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = count >= 1000000
    ? (count / 1000000).toFixed(1) + 'M'
    : count >= 1000
    ? (count / 1000).toFixed(1) + 'K'
    : count.toLocaleString();

  return <span ref={ref}>{display}{suffix}</span>;
}

export default function ImpactCounters() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Numbers</span>
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Brotherhood In Action</h2>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
              <stat.icon className={`w-7 h-7 mx-auto mb-3 ${stat.color}`} />
              <div className={`font-heading text-3xl md:text-4xl ${stat.color}`}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}