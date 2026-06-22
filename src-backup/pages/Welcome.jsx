/* ============================================================
   WELCOME — Cinematic onboarding: auto-advancing slides,
   particle overlay, destination chooser
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trees, Scissors, ArrowRight, ChevronRight, Shield, Trophy, MapPin } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/user_698665958200b3f7c38a9102/20dcc144c_logo_main.png';

const SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=90',
    overline: 'The Woodz',
    headline: 'A Man Needs\nA Reset',
    sub: 'The forest strips away everything that doesn\'t matter. We built a retreat to give you that back.',
    accent: '#7CB342',
    gradFrom: 'from-green-900/80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=90',
    overline: 'The Chair',
    headline: 'A Man Needs\nA Cut',
    sub: 'Precision, ritual, and silence. The chair makes you sharp — inside and out.',
    accent: '#E07B30',
    gradFrom: 'from-amber-900/80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1920&q=90',
    overline: 'The Brotherhood',
    headline: 'A Man Needs\nBrotherhood',
    sub: 'Two businesses. One wallet. One code. One family that holds the standard.',
    accent: '#FBBF24',
    gradFrom: 'from-yellow-900/80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=90',
    overline: 'Welcome',
    headline: 'You Found\nYour People',
    sub: 'The ecosystem awaits. Where will you go first?',
    accent: '#7CB342',
    gradFrom: 'from-black/80',
  },
];

const DESTINATIONS = [
  {
    icon: Trees, label: 'Into the Woodz', sub: 'Gear, retreats & brotherhood', path: '/shop/boyz',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=700&q=80',
    accent: '#7CB342', border: 'border-green-500/50 hover:border-green-500',
    badge: 'New Arrivals',
  },
  {
    icon: Scissors, label: 'To the Chair', sub: 'Book a cut, shop grooming', path: '/barber/services',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=700&q=80',
    accent: '#E07B30', border: 'border-amber-500/50 hover:border-amber-500',
    badge: 'Same-Day Slots',
  },
  {
    icon: ArrowRight, label: 'Explore All', sub: 'Take me to the home page', path: '/',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
    accent: '#FFFFFF', border: 'border-white/20 hover:border-white/60',
    badge: 'Full Ecosystem',
  },
];

export default function Welcome() {
  const [slide, setSlide] = useState(0);
  const [choosing, setChoosing] = useState(false);
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!choosing) {
      timerRef.current = setTimeout(() => {
        if (slide < SLIDES.length - 1) setSlide(s => s + 1);
        else setChoosing(true);
      }, 3400);
    }
    return () => clearTimeout(timerRef.current);
  }, [slide, choosing]);

  const goTo = (i) => { clearTimeout(timerRef.current); setSlide(i); };

  const enter = (path) => {
    localStorage.setItem('bitw_welcomed', 'true');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!choosing ? (
          /* ── SLIDE SHOW ── */
          <motion.div key={`slide-${slide}`}
            initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-0">

            {/* Background image */}
            <div className="absolute inset-0 bg-cover bg-center transition-none" style={{ backgroundImage: `url(${SLIDES[slide].bg})` }} />

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r ${SLIDES[slide].gradFrom} to-black/40`} />
            <div className="absolute inset-0 bg-black/30" />

            {/* Animated colour glow at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-25"
              style={{ background: `radial-gradient(ellipse at 30% 100%, ${SLIDES[slide].accent}80 0%, transparent 70%)` }} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 max-w-5xl">
              <motion.img src={LOGO_URL} alt="BITW"
                initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="h-12 md:h-16 w-auto mb-8" style={{ filter: 'brightness(0) invert(1)' }} />

              <motion.span
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
                className="text-xs font-heading tracking-[0.35em] uppercase mb-3 px-3 py-1.5 rounded-full border"
                style={{ color: SLIDES[slide].accent, borderColor: `${SLIDES[slide].accent}50`, background: `${SLIDES[slide].accent}15` }}>
                {SLIDES[slide].overline}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="font-heading text-5xl sm:text-7xl md:text-8xl tracking-wide uppercase text-white leading-none mb-5"
                style={{ whiteSpace: 'pre-line' }}>
                {SLIDES[slide].headline}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
                className="text-white/65 text-base md:text-lg max-w-md leading-relaxed mb-8">
                {SLIDES[slide].sub}
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                onClick={() => setChoosing(true)}
                className="flex items-center gap-2 text-sm font-heading tracking-widest uppercase transition-colors group"
                style={{ color: SLIDES[slide].accent }}>
                Enter the Brotherhood
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-8 left-8 md:left-16 flex items-center gap-4">
              <div className="flex gap-2">
                {SLIDES.map((_, i) => (
                  <button key={i} onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-500 ${i === slide ? 'w-10 h-2' : 'w-2 h-2 bg-white/25 hover:bg-white/50'}`}
                    style={i === slide ? { background: SLIDES[slide].accent } : {}} />
                ))}
              </div>
              <span className="text-white/30 text-xs font-heading tracking-widest">{slide + 1} / {SLIDES.length}</span>
            </div>

            {/* Skip */}
            <button onClick={() => setChoosing(true)}
              className="absolute top-6 right-6 text-white/40 hover:text-white text-xs font-heading tracking-widest uppercase transition-colors flex items-center gap-1">
              Skip <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          /* ── DESTINATION CHOOSER ── */
          <motion.div key="choose"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto py-8">

            {/* Background */}
            <div className="absolute inset-0 bg-background" />
            <div className="absolute inset-0 opacity-5 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=40)' }} />

            <div className="relative max-w-4xl w-full mx-auto px-6">
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-center mb-10">
                <img src={LOGO_URL} alt="BITW" className="h-12 w-auto mx-auto mb-6" style={{ filter: 'brightness(0) invert(1)' }} />
                <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase mb-2">Where Are You Going?</h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">Choose your path. You can always switch between both worlds.</p>
              </motion.div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {[
                  { icon: Shield, label: 'The Code — 5 Rules' },
                  { icon: Trophy, label: '1,200+ Brotherhood Members' },
                  { icon: MapPin, label: '8+ Retreat Locations' },
                ].map((b, i) => (
                  <motion.div key={b.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-full text-xs text-muted-foreground">
                    <b.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="font-heading tracking-wider uppercase">{b.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Destination cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {DESTINATIONS.map((dest, i) => (
                  <motion.button key={dest.label}
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.12 }}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                    onClick={() => enter(dest.path)}
                    className={`group relative rounded-2xl overflow-hidden border-2 transition-all duration-400 ${dest.border} ${hovered === i ? 'scale-105 shadow-2xl' : 'scale-100'}`}>

                    <div className="aspect-[3/4] relative">
                      <img src={dest.img} alt={dest.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                      {/* Animated colour glow on hover */}
                      <AnimatePresence>
                        {hovered === i && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            style={{ background: `radial-gradient(ellipse at 50% 100%, ${dest.accent}40 0%, transparent 70%)` }} />
                        )}
                      </AnimatePresence>

                      {/* Badge */}
                      <div className="absolute top-4 right-4 text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full"
                        style={{ background: `${dest.accent}25`, color: dest.accent, border: `1px solid ${dest.accent}50` }}>
                        {dest.badge}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
                          style={{ background: `${dest.accent}20`, border: `1px solid ${dest.accent}40` }}>
                          <dest.icon className="w-5 h-5" style={{ color: dest.accent }} />
                        </div>
                        <p className="font-heading text-xl uppercase text-white tracking-wider leading-tight">{dest.label}</p>
                        <p className="text-white/55 text-xs mt-1">{dest.sub}</p>
                        <div className="flex items-center gap-1 mt-3 transition-all duration-300 group-hover:gap-2" style={{ color: dest.accent }}>
                          <span className="text-xs font-heading tracking-wider uppercase">Enter</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="text-center text-xs text-muted-foreground/40 mt-8 font-heading tracking-widest uppercase">
                Boyz In The Woodz © {new Date().getFullYear()} · Two Businesses. One Code.
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}