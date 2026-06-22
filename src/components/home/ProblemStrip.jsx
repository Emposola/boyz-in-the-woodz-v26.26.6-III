/* ============================================================
   PROBLEM STRIP — Key stats from "The Problem" on homepage
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const STRIP_STATS = [
  { value: '77%', label: 'high stress' },
  { value: '40%', label: 'never talk' },
  { value: '62%', label: 'feel isolated' },
  { value: '70%', label: 'lost friends' },
];

export default function ProblemStrip() {
  return (
    <section className="py-12 md:py-16 border-y border-border bg-destructive/3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
            <h2 className="font-heading text-2xl md:text-3xl tracking-wide uppercase">The Crisis Is Real</h2>
            <p className="text-xs text-muted-foreground mt-1">The data is clear. Men need a reset.</p>
          </motion.div>

          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {STRIP_STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="font-heading text-3xl md:text-4xl text-foreground">{s.value}</div>
                <p className="text-[10px] md:text-xs text-muted-foreground font-heading tracking-wider uppercase mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex-shrink-0"
          >
            <Link
              to="/the-problem"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl font-heading tracking-wider uppercase text-xs text-foreground border border-border hover:bg-secondary transition-colors"
            >
              See The Data <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
