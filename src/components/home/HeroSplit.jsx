/* ============================================================
   HERO — Full-bleed Boyz In The Woodz hero
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function HeroSplit() {
  return (
    <section className="relative h-[85vh] md:h-[90vh] flex overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{ backgroundImage: 'url(/images/unsplash/forest-campfire.webp)' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="relative w-full flex flex-col justify-end p-8 md:p-16 lg:p-24 max-w-5xl"
      >
        <div className="flex items-center gap-2 mb-3">
          <Trees className="w-5 h-5 text-primary" />
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Brotherhood. Freedom. Nature.</span>
        </div>
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-wide uppercase text-white leading-none mb-4">
          You Don't Need<br />To Escape<br /><span className="text-primary">Your Life.</span>
        </h1>
        <p className="text-white/70 text-base md:text-lg max-w-xl mb-8">
          You just need a place to breathe. Survival Pack 01. Wilderness retreats for men. Brotherhood.
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="btn-animated-border">
            <Button asChild size="lg" className="font-heading tracking-wider uppercase text-sm relative">
              <Link to="/shop/boyz">Shop Survival Pack <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </span>
          <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-sm border-white/30 text-white hover:bg-white/10">
            <Link to="/retreat/apply">Apply for Retreat</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}