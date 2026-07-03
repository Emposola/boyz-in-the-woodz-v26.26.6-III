/* ============================================================
   HOME HERO — Cinematic hook + dual CTA — ULTRA CONVERTING
   SEO Optimized | Mobile-First | Premium Design
   Brand deck: "You don't need to escape your life..."
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ArrowRight, Leaf, Shield, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import HeroSlideshow from './HeroSlideshow';

// ============================================================
// HEADLINE — Premium cinematic reveal
// ============================================================
const headlineWords = [
  { text: 'You', delay: 0.3, mobile: true },
  { text: "Don't Need", delay: 0.6, mobile: true },
  { text: 'To Escape', delay: 0.9, mobile: true },
  { text: 'Your Life.', delay: 1.2, accent: true, mobile: true },
];

// ============================================================
// TRUST BADGES — Social proof data
// ============================================================
const TRUST_BADGES = [
  { label: 'Brothers Pledged', value: '12,800+', icon: Users },
  { label: 'Retreats Completed', value: '23+', icon: Shield },
  { label: 'Active Chapters', value: '5', icon: Star },
];

// ============================================================
// SEO STRUCTURED DATA
// ============================================================
const seoData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BOYZ IN THE WOODZ',
  description: 'Wilderness retreats for men. Brotherhood. Freedom. Nature. Outdoor clothing and barber shop for men who need space to breathe.',
  url: 'https://boyzinthewoodz.com',
  logo: 'https://boyzinthewoodz.com/images/logos/logo-navbar-about.jpg',
  sameAs: [
    'https://instagram.com/boyzinthewoodz',
    'https://tiktok.com/@boyzinthewoodz',
    'https://youtube.com/@boyzinthewoodz',
  ],
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.25 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 50, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function HomeHero() {
  return (
    <>
      {/* ─── SEO STRUCTURED DATA ─── */}
      <script type="application/ld+json">
        {JSON.stringify(seoData)}
      </script>

      <section 
        className="relative flex overflow-hidden"
        style={{ 
          height: 'calc(100vh - 90px)',
          maxHeight: '862px',
        }}
        aria-label="BOYZ IN THE WOODZ - Wilderness retreats for men"
        role="banner"
      >
        {/* ─── BACKGROUND ─── */}
        <HeroSlideshow />
        
        {/* ─── OVERLAY GRADIENT ─── */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
        
        {/* ─── AMBIENT GLOW ─── */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[30vw] h-[30vw] bg-amber-500/5 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        {/* ─── EMBER PARTICLES ─── */}
        <div className="hero-embers">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="hero-ember" />
          ))}
        </div>

        {/* ─── CONTENT ─── */}
        <div className="relative z-10 w-full flex flex-col justify-end px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto pb-8 sm:pb-12 md:pb-16">
          
          {/* ── WRAPPER WITH TRANSLATE ── */}
          <div className="w-full translate-y-[28px] sm:translate-y-[28px] md:translate-y-[28px] lg:translate-y-[28px]">
            
            {/* ── Tagline — Centered on mobile ── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
              className="flex items-center justify-center sm:justify-start gap-2 mb-3 sm:mb-4 md:mb-5"
            >
              <div className="p-1 rounded-full bg-primary/20 border border-primary/20">
                <Leaf className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              </div>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] font-heading tracking-[0.3em] sm:tracking-[0.35em] text-primary/90 uppercase text-center sm:text-left">
                Brotherhood. Freedom. Nature.
              </span>
              <span className="w-8 sm:w-12 h-px bg-primary/30 hidden sm:block" />
            </motion.div>

            {/* ── Headline ── */}
            <motion.h1
              variants={container}
              initial="hidden"
              animate="visible"
              className="font-heading text-white leading-[0.92] mb-3 sm:mb-4 md:mb-5 max-w-5xl text-center sm:text-left"
              style={{
                fontSize: 'clamp(1.4rem, 5.5vw, 5.5rem)',
                letterSpacing: '0.02em',
              }}
            >
              {headlineWords.map((w, i) => (
                <motion.span
                  key={i}
                  variants={wordVariant}
                  className={`inline-block mr-[0.25em] ${w.accent ? 'text-primary drop-shadow-[0_0_30px_rgba(45,90,39,0.3)]' : ''}`}
                >
                  {w.text}
                </motion.span>
              ))}
            </motion.h1>

            {/* ── Subheadline ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 1.6 }}
              className="max-w-xl mx-auto sm:mx-0"
            >
              {/* Desktop subheadline */}
              <p className="hidden sm:block text-white/70 text-sm sm:text-base md:text-lg leading-relaxed font-light tracking-wide text-center sm:text-left">
                You just need a place to breathe. Wilderness retreats for men who are great at
                taking care of everyone else and terrible at filling their own cup.
              </p>
              <p className="hidden sm:block text-white/40 text-xs sm:text-sm max-w-lg mt-1 sm:mt-2 leading-relaxed text-center sm:text-left">
                Brotherhood built through nature. Gear that proves you were there.
                A barber shop that opens men up.
              </p>
              
              {/* Mobile subheadline — centered */}
              <p className="sm:hidden text-white/70 text-xs leading-relaxed font-light tracking-wide max-w-sm mx-auto text-center">
                Wilderness retreats for men who are great at taking care of everyone else.
              </p>
              <p className="sm:hidden text-white/40 text-[10px] mt-0 leading-relaxed text-center">
                Brotherhood. Nature. Gear. A place to breathe.
              </p>
            </motion.div>

            {/* ── CTAs ── */}
            <motion.div
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.0 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-3 sm:mt-6"
              style={{
                paddingLeft: '20px',
                paddingRight: '20px',
                marginLeft: '-20px',
                marginRight: '-20px',
              }}
            >
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto flex-1 font-heading tracking-wider uppercase text-[9px] sm:text-xs md:text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 rounded-full shadow-[0_0_40px_rgba(45,90,39,0.3)] hover:shadow-[0_0_60px_rgba(45,90,39,0.5)] transition-all duration-300 group"
              >
                <Link to="/retreat/apply" className="flex items-center justify-center w-full">
                  <span className="hidden xs:inline">Apply for Retreat</span>
                  <span className="xs:hidden">Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto flex-1 font-heading tracking-wider uppercase text-[9px] sm:text-xs md:text-sm border-white/25 text-white hover:bg-white/10 hover:border-white/50 px-3 sm:px-6 md:px-8 py-2.5 sm:py-5 md:py-6 rounded-full transition-all duration-300 group"
              >
                <Link to="/shop/boyz" className="flex items-center justify-center w-full">
                  <span className="hidden xs:inline">Shop Survival Pack</span>
                  <span className="xs:hidden">Shop Gear</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            {/* ── Trust Badges ── */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.4 }}
              className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-white/5"
            >
              {TRUST_BADGES.map((badge, index) => (
                <div key={index} className="flex items-center gap-1.5 sm:gap-3">
                  <div className="p-1 sm:p-2 rounded-full bg-white/5 border border-white/5">
                    <badge.icon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-primary/70" />
                  </div>
                  <div>
                    <span className="text-white font-heading text-[10px] sm:text-sm tracking-wide block text-center sm:text-left">
                      {badge.value}
                    </span>
                    <span className="text-[6px] sm:text-[9px] text-white/30 font-heading tracking-wider uppercase text-center sm:text-left">
                      {badge.label}
                    </span>
                  </div>
                  {index < TRUST_BADGES.length - 1 && (
                    <span className="w-px h-5 sm:h-8 bg-white/5 hidden xs:block" />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* ─── DECORATIVE LINE ─── */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>

      {/* ─── MOBILE OVERRIDE ─── */}
      <style>{`
        @media (max-width: 640px) {
          section {
            height: 482px !important;
            min-height: 482px !important;
            max-height: 482px !important;
          }
          section > div:last-child > div:first-child {
            transform: translateY(0px) !important;
          }
        }
      `}</style>
    </>
  );
}