/* ============================================================
   HOME CRISIS — Clean Rectangular Design with Top Text
   Professional Layout | Ultra SEO | High Conversion
   Perfect sync with Hero & Science sections
   ============================================================ */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  AlertTriangle, Eye, ArrowRight, Users, Heart, 
  ChevronRight, Shield, Activity, Moon, Cloud, 
  Wind, Sparkles, Compass, Flame, Leaf, 
  Brain, Coffee, Mic, Music, TreePine, Mountain, Waves,
  Camera, Pen, BookOpen, Star, Circle
} from 'lucide-react';

// ============================================================
// DATA — Clean and impactful
// ============================================================

// The Stats — Rectangular cards
const STATS = [
  {
    number: '1 in 3',
    label: 'men have no close friends',
    icon: Users,
    color: '#EF4444',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
  {
    number: '85%',
    label: 'of men bottle up emotions',
    icon: Brain,
    color: '#F59E0B',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    number: '3x',
    label: 'higher suicide rate',
    icon: Heart,
    color: '#EC4899',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    number: '60%',
    label: 'feel disconnected from community',
    icon: Users,
    color: '#8B5CF6',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
  },
];

// The Truth — Mask vs Reality
const TRUTH_PAIRS = [
  {
    mask: 'Looks like he has it all together.',
    reality: 'Hasn\'t slept properly in weeks.',
    icon: Eye,
  },
  {
    mask: 'Strong. Silent. Unbreakable.',
    reality: 'Can\'t remember his last real conversation.',
    icon: Shield,
  },
  {
    mask: 'Always grinding. Always available.',
    reality: 'Running on empty. Alone in a crowd.',
    icon: Activity,
  },
];

// ============================================================
// SEO STRUCTURED DATA
// ============================================================
const seoData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Men\'s Mental Health Crisis: Shocking Statistics & Solutions',
  description: '1 in 3 men have no close friends. 85% bottle up emotions. Men\'s suicide rate is 3x higher. The data demands action.',
  author: {
    '@type': 'Organization',
    name: 'BOYZ IN THE WOODZ',
  },
  datePublished: '2024-01-15',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://boyzinthewoodz.com/the-problem',
  },
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function HomeCrisis() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.97, 1]);

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(seoData)}
      </script>

      <section 
        ref={sectionRef}
        className="relative py-[28px] md:py-[28px] overflow-hidden"
        style={{ opacity, scale }}
        aria-label="Men's mental health crisis statistics"
      >
        {/* ─── BACKGROUND ─── */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-destructive/3 to-black/5" />
        
        {/* ─── AMBIENT GLOWS ─── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-destructive/5 rounded-full blur-[200px] -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] bg-amber-500/5 rounded-full blur-[150px] translate-y-1/2" />
        <div className="absolute top-1/2 left-1/4 w-[30vw] h-[30vw] bg-primary/5 rounded-full blur-[120px]" />

        {/* ─── DECORATIVE LINES ─── */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ─── HEADER ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="text-center max-w-3xl mx-auto mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/5 border border-destructive/20 backdrop-blur-sm mb-4">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-[9px] font-heading tracking-[0.3em] text-destructive uppercase">
                The Crisis
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase text-foreground leading-[0.92]">
              Men Are{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-destructive">Breaking</span>
                <span className="absolute bottom-0 left-0 w-full h-2 sm:h-2.5 bg-destructive/10 -z-0" />
              </span>
              <span className="block">In Silence</span>
            </h2>

            <p className="text-muted-foreground text-sm mt-3 max-w-2xl mx-auto leading-relaxed">
              The numbers are staggering. Men are suffering — but they've been taught to hide it.
            </p>
          </motion.div>

          {/* ─── STATS ROW ─── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={cardVariant}
                className={`group relative ${stat.bg} border ${stat.border} rounded-xl p-4 md:p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${stat.color}10, transparent 70%)` }}
                />
                
                <div className="relative">
                  <div className="font-heading text-2xl sm:text-3xl md:text-4xl" style={{ color: stat.color }}>
                    {stat.number}
                  </div>
                  <p className="text-[10px] md:text-[11px] text-muted-foreground mt-1 leading-snug max-w-[140px] mx-auto font-medium">
                    {stat.label}
                  </p>
                  <div className="w-8 h-0.5 rounded-full mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: stat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ─── TRUTH PAIRS — Mask vs Reality ─── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid md:grid-cols-3 gap-4 md:gap-5 mb-8 md:mb-10"
          >
            {TRUTH_PAIRS.map((pair, index) => {
              const Icon = pair.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariant}
                  className="group relative bg-card/50 border border-border rounded-xl p-5 hover:border-primary/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/50">
                        #{index + 1}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[8px] font-heading tracking-wider uppercase text-primary/60 block mb-1">
                          The Mask
                        </span>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                          "{pair.mask}"
                        </p>
                      </div>

                      <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-6 bg-destructive/20" />
                        <div className="pl-4">
                          <span className="text-[8px] font-heading tracking-wider uppercase text-destructive/60 block mb-1">
                            The Reality
                          </span>
                          <p className="text-sm text-foreground/80 leading-relaxed font-medium">
                            "{pair.reality}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ─── URGENCY BANNER ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="bg-gradient-to-r from-destructive/5 via-primary/5 to-amber-400/5 border border-border rounded-xl p-5 md:p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute top-1/2 left-1/4 w-32 h-32 border border-white/10 rounded-full" />
                <div className="absolute bottom-1/2 right-1/4 w-48 h-48 border border-white/10 rounded-full" />
              </div>
              
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-[9px] font-heading tracking-wider uppercase text-muted-foreground/50">
                    The Data is Clear
                  </span>
                </div>
                <p className="text-sm text-foreground/70 max-w-lg mx-auto leading-relaxed">
                  <span className="font-semibold text-foreground">62% of men</span> feel emotionally isolated. 
                  But <span className="font-semibold text-primary">nature and brotherhood</span> can change that.
                </p>
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="text-[8px] text-muted-foreground/30 tracking-widest uppercase">— evidence based —</span>
                  <Leaf className="w-2.5 h-2.5 text-primary/30" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── CTA ─── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-6"
          >
            <Link
              to="/the-problem"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group"
            >
              <span>Read the Full Breakdown</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="flex items-center justify-center gap-4 mt-3">
              <span className="text-[8px] text-muted-foreground/30 font-heading tracking-widest uppercase">
                Data sourced from peer-reviewed research
              </span>
              <span className="w-px h-2 bg-muted-foreground/10" />
              <span className="text-[8px] text-muted-foreground/30 font-heading tracking-widest uppercase">
                12,800+ brothers served
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}