/* ============================================================
   HOME HERO — Cinematic hook + dual CTA
   Brand deck: "You don't need to escape your life..."
   Upgrades: staggered text reveal, floating ember particles,
   crossfading video slideshow background
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroSlideshow from './HeroSlideshow';

const headlineWords = [
  { text: 'You', delay: 0.4 },
  { text: "Don't Need", delay: 0.7 },
  { text: 'To Escape', delay: 1.0 },
  { text: 'Your Life.', delay: 1.3, accent: true },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.25, delayChildren: 0.3 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HomeHero() {
  return (
    <section className="relative h-[90vh] min-h-[480px] md:h-[95vh] flex overflow-hidden">
      {/* Background — crossfading video/image slideshow */}
      <HeroSlideshow />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      {/* Ember particles */}
      <div className="hero-embers">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="hero-ember" />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-6xl">
        {/* Tagline chip */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-2 mb-6"
        >
          <Trees className="w-4 h-4 text-primary" />
          <span className="text-[11px] font-heading tracking-[0.35em] text-primary uppercase">
            Brotherhood. Freedom. Nature.
          </span>
        </motion.div>

        {/* Headline — staggered word reveal */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="visible"
          className="font-heading text-3xl sm:text-5xl md:text-7xl lg:text-[5.5rem] tracking-wide uppercase text-white leading-[0.95] mb-6"
        >
          {headlineWords.map((w, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className={`inline-block mr-[0.3em] ${w.accent ? 'text-primary' : ''}`}
            >
              {w.text}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subheadline — fade in after headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <p className="text-white/60 text-base md:text-lg max-w-xl mb-3 leading-relaxed">
            You just need a place to breathe. Wilderness retreats for men who are great at
            taking care of everyone else and terrible at filling their own cup.
          </p>
          <p className="text-white/40 text-sm max-w-lg mb-8 leading-relaxed">
            Brotherhood built through nature. Gear that proves you were there.
            A barber shop that opens men up. One ecosystem — two businesses — one code.
          </p>
        </motion.div>

        {/* CTAs — slide up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <Button asChild size="lg" className="font-heading tracking-wider uppercase text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-8">
            <Link to="/retreat/apply">
              Apply for Retreat <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-sm border-white/25 text-white hover:bg-white/10 px-8">
            <Link to="/shop/boyz">
              Shop Survival Pack <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Trust badges — fade in last */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 0.8 }}
          className="flex flex-wrap items-center gap-4 mt-10 text-[10px] text-white/30 font-heading tracking-wider uppercase"
        >
          <span>12,800+ Brothers Pledged</span>
          <span className="w-px h-3 bg-white/15" />
          <span>23+ Retreats Completed</span>
          <span className="w-px h-3 bg-white/15" />
          <span>5 Chapters Active</span>
        </motion.div>
      </div>

      {/* Scroll indicator — improved */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] font-heading tracking-[0.3em] uppercase text-white/30">
          The data is below
        </span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex justify-center pt-1.5">
          <motion.div
            className="w-1 h-2 rounded-full bg-primary/60"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
