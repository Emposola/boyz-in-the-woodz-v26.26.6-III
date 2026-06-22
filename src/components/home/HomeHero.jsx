/* ============================================================
   HOME HERO — Emotional hook + dual CTA
   Brand deck: "You don't need to escape your life..."
   SEO: Primary landing target for all head terms
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HomeHero() {
  return (
    <section className="relative h-[90vh] md:h-[95vh] flex overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: 'url(/images/unsplash/forest-campfire.webp)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-6xl"
      >
        {/* Tagline chip */}
        <div className="flex items-center gap-2 mb-4">
          <Trees className="w-4 h-4 text-primary" />
          <span className="text-[11px] font-heading tracking-[0.35em] text-primary uppercase">
            Brotherhood. Freedom. Nature.
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] tracking-wide uppercase text-white leading-[0.95] mb-5">
          You Don't Need<br />
          To Escape<br />
          <span className="text-primary">Your Life.</span>
        </h1>

        {/* Subheadline — SEO-rich */}
        <p className="text-white/60 text-base md:text-lg max-w-xl mb-3 leading-relaxed">
          You just need a place to breathe. Wilderness retreats for men who are great at
          taking care of everyone else and terrible at filling their own cup.
        </p>
        <p className="text-white/40 text-sm max-w-lg mb-8 leading-relaxed">
          Brotherhood built through nature. Gear that proves you were there.
          A barber shop that opens men up. One ecosystem — two businesses — one code.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
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
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-4 mt-10 text-[10px] text-white/30 font-heading tracking-wider uppercase">
          <span>12,800+ Brothers Pledged</span>
          <span className="w-px h-3 bg-white/15" />
          <span>23+ Retreats Completed</span>
          <span className="w-px h-3 bg-white/15" />
          <span>5 Chapters Active</span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25">
        <span className="text-[9px] font-heading tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/15 animate-pulse" />
      </div>
    </section>
  );
}
