/* ============================================================
   SERVE BLOCK — "Who We Serve" with Premium Carousel
   Desktop: Grid with images | Mobile: Carousel
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Baby, Cloud, TreePine, ArrowRight, 
  ChevronLeft, ChevronRight, Users, Heart, 
  Compass, Leaf, Mountain, Waves, Camera,
  Sparkles, Sun, Moon, Star, Circle
} from 'lucide-react';

// ============================================================
// PERSONAS DATA
// ============================================================
const PERSONAS = [
  {
    icon: Zap,
    title: 'The Hustler',
    desc: 'Always working. Never stopping.',
    stat: '58%',
    statLabel: 'say work defines identity',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    gradient: 'from-amber-400/5',
  },
  {
    icon: Baby,
    title: 'The Father',
    desc: 'Wants to be present. Life moves too fast.',
    stat: '54%',
    statLabel: 'spend <1hr/day with kids',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    gradient: 'from-blue-400/5',
  },
  {
    icon: Cloud,
    title: 'The Lost One',
    desc: "Feels off. Can't explain why.",
    stat: '1 in 3',
    statLabel: 'show undiagnosed depression',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    gradient: 'from-purple-400/5',
  },
  {
    icon: TreePine,
    title: 'The Nostalgic',
    desc: 'Misses who he was before.',
    stat: '70%',
    statLabel: 'lost best friend after 30',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    gradient: 'from-emerald-400/5',
  },
];

// ============================================================
// CAROUSEL IMAGES
// ============================================================
const CAROUSEL_IMAGES = [
  {
    src: '/images/unsplash/landscape-1.webp',
    alt: 'Serene mountain landscape - freedom in nature',
    caption: 'Find Your Reset',
    location: 'Wilderness',
  },
  {
    src: '/images/unsplash/camp-stove.webp',
    alt: 'Campfire cooking and brotherhood',
    caption: 'Share a Meal',
    location: 'Campfire',
  },
  {
    src: '/images/unsplash/desert-landscape.webp',
    alt: 'Desert landscape - open space and clarity',
    caption: 'Find Clarity',
    location: 'Desert',
  },
  {
    src: '/images/unsplash/forest-campfire.webp',
    alt: 'Forest campfire - brotherhood around the fire',
    caption: 'Brotherhood',
    location: 'Forest',
  },
  {
    src: '/images/unsplash/hiking-backpack.webp',
    alt: 'Hiking through the wilderness',
    caption: 'The Journey',
    location: 'Trail',
  },
  {
    src: '/images/unsplash/sleeping-bag.webp',
    alt: 'Sleeping under the stars',
    caption: 'Rest & Recharge',
    location: 'Camp',
  },
];

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

const slideVariant = {
  enter: (direction) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 60 : -60,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ServeBlock() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef(null);

  // ============================================================
  // AUTOPLAY — 5 second interval
  // ============================================================
  useEffect(() => {
    if (!isAutoPlaying) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  // ============================================================
  // NAVIGATION
  // ============================================================
  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setTimeout(() => setIsAutoPlaying(true), 6000);
  };

  const currentImage = CAROUSEL_IMAGES[currentIndex];

  return (
    <section className="relative py-5 md:py-5 overflow-hidden">
      {/* ─── BACKGROUND ─── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-secondary/20 to-black/5" />
      
      {/* ─── DECORATIVE LINES ─── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── HEADER ─── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-6 md:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-sm mb-4">
            <Users className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-heading tracking-[0.3em] text-primary uppercase">
              Who We Serve
            </span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase text-foreground leading-[0.92]">
            Every Man Who Has Ever<br />
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">Said "I'm Fine"</span>
              <span className="absolute bottom-0 left-0 w-full h-2 sm:h-2.5 bg-primary/10 -z-0" />
            </span>
          </h2>

          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto leading-relaxed">
            We don't serve a demographic. We serve a feeling — the one you can't quite name.
          </p>
        </motion.div>

        {/* ─── CAROUSEL + PERSONAS ─── */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          
          {/* ─── LEFT: CAROUSEL ─── */}
          <div className="lg:col-span-3 relative">
            <div className="relative overflow-hidden rounded-2xl bg-card border border-border" style={{ height: '380px' }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariant}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={currentImage.src}
                    alt={currentImage.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[8px] font-heading tracking-wider uppercase text-primary/70">
                        {currentImage.location}
                      </span>
                      <span className="w-4 h-px bg-primary/30" />
                      <span className="text-[8px] text-white/40">
                        {currentIndex + 1} / {CAROUSEL_IMAGES.length}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl text-white tracking-wide">
                      {currentImage.caption}
                    </h3>
                    <p className="text-sm text-white/50 max-w-sm">
                      {currentImage.alt}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 transition-all duration-300 flex items-center justify-center"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-black/60 transition-all duration-300 flex items-center justify-center"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                {CAROUSEL_IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-500 rounded-full ${
                      index === currentIndex
                        ? 'w-6 h-1.5 bg-white/80'
                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT: PERSONAS ─── */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div className="space-y-3">
              {PERSONAS.map((persona, index) => (
                <motion.div
                  key={persona.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className={`group relative bg-card border ${persona.border} rounded-xl p-3 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${persona.gradient} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${persona.bg} border ${persona.border} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <persona.icon className={`w-3.5 h-3.5 ${persona.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-heading text-xs tracking-wider uppercase text-foreground">
                          {persona.title}
                        </h3>
                        <span className={`font-heading text-xs ${persona.color}`}>
                          {persona.stat}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground">{persona.desc}</p>
                      <p className="text-[7px] text-muted-foreground/50">{persona.statLabel}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button - Bottom aligned with carousel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-3"
            >
              <Link
                to="/who-we-serve"
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group"
              >
                <span>Meet All Four</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}