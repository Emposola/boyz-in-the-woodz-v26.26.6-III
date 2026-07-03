/* ============================================================
   HOME CRISIS — Clean Design
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Heart, ChevronRight, Shield, Activity, Brain, Leaf } from 'lucide-react';

const STATS = [
  { number: '1 in 3', label: 'men have no close friends', color: '#EF4444', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { number: '85%', label: 'of men bottle up emotions', color: '#F59E0B', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { number: '3x', label: 'higher suicide rate', color: '#EC4899', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  { number: '60%', label: 'feel disconnected', color: '#8B5CF6', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const TRUTH_PAIRS = [
  { mask: 'Looks like he has it all together.', reality: 'Hasn\'t slept properly in weeks.' },
  { mask: 'Strong. Silent. Unbreakable.', reality: 'Can\'t remember his last real conversation.' },
  { mask: 'Always grinding. Always available.', reality: 'Running on empty. Alone in a crowd.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomeCrisis() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-destructive/3 to-black/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/5 border border-destructive/20 mb-4">
            <AlertTriangle className="w-3 h-3 text-destructive" />
            <span className="text-[9px] font-heading tracking-[0.3em] text-destructive uppercase">The Crisis</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase text-foreground leading-[0.92]">
            Men Are <span className="text-destructive">Breaking</span>
            <span className="block">In Silence</span>
          </h2>

          <p className="text-muted-foreground text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
            The numbers are staggering. Men are suffering — but they've been taught to hide it.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={cardVariant}
              className={`${stat.bg} border ${stat.border} rounded-xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="font-heading text-2xl sm:text-3xl md:text-4xl" style={{ color: stat.color }}>
                {stat.number}
              </div>
              <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1 leading-snug max-w-[140px] mx-auto font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5 mb-12"
        >
          {TRUTH_PAIRS.map((pair, index) => (
            <motion.div
              key={index}
              variants={cardVariant}
              className="bg-card/50 border border-border rounded-xl p-5 hover:border-primary/20 transition-all duration-300"
            >
              <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/50 block mb-3">
                #{index + 1}
              </span>
              <div className="space-y-3">
                <div>
                  <span className="text-[8px] font-heading tracking-wider uppercase text-primary/60 block mb-1">The Mask</span>
                  <p className="text-sm text-foreground/70 leading-relaxed">"{pair.mask}"</p>
                </div>
                <div>
                  <span className="text-[8px] font-heading tracking-wider uppercase text-destructive/60 block mb-1">The Reality</span>
                  <p className="text-sm text-foreground/80 leading-relaxed font-medium">"{pair.reality}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-r from-destructive/5 via-primary/5 to-amber-400/5 border border-border rounded-xl p-6 text-center">
            <p className="text-sm text-foreground/70 max-w-lg mx-auto leading-relaxed">
              <span className="font-semibold text-foreground">62% of men</span> feel emotionally isolated. 
              But <span className="font-semibold text-primary">nature and brotherhood</span> can change that.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/the-problem"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group"
          >
            <span>Read the Full Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}