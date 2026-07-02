/* ============================================================
   ABOUT PAGE — BOYZ IN THE WOODZ — ULTRA PREMIUM
   SEO Optimized | Carousel Hero | E-E-A-T Signals
   Content starts 20px from page top
   ============================================================ */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trees, Heart, Shield, Zap, Trophy, ArrowRight,
  Users, Star, ChevronDown, Quote, ShoppingBag,
  Compass, Leaf, Award, Clock, MapPin, Camera,
  Sparkles, Crown, Gem, Mountain, Waves, Play,
  Pause, Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

// ============================================================
// CAROUSEL IMAGES
// ============================================================
const CAROUSEL_IMAGES = [
  {
    src: '/images/unsplash/forest-campfire.webp',
    alt: 'Men gathered around a campfire - brotherhood',
    caption: 'Brotherhood Around the Fire',
    location: 'Campfire'
  },
  {
    src: '/images/unsplash/hiking-backpack.webp',
    alt: 'Men hiking through the wilderness',
    caption: 'The Journey Begins',
    location: 'Trail'
  },
  {
    src: '/images/unsplash/landscape-1.webp',
    alt: 'Serene mountain landscape - freedom in nature',
    caption: 'Find Your Freedom',
    location: 'Wilderness'
  },
  {
    src: '/images/unsplash/camp-stove.webp',
    alt: 'Campfire cooking and connection',
    caption: 'Share a Meal, Share a Story',
    location: 'Camp'
  },
  {
    src: '/images/unsplash/sleeping-bag.webp',
    alt: 'Sleeping under the stars',
    caption: 'Rest and Recharge',
    location: 'Night'
  }
];

// ============================================================
// CONSTANTS
// ============================================================
const TEAM_PHOTO = '/images/logos/team-photo.png';

const TIMELINE = [
  { year: '2019', title: 'The First Retreat', desc: 'A small group of men head into the forest together for the first time. No plan. No phones. What came out of that weekend changed everything.', img: '/images/unsplash/forest-campfire.webp' },
  { year: '2020', title: 'The Revelation', desc: 'When the world shut down, we realized men needed more than productivity. They needed reconnection, presence, and permission to slow down.', img: '/images/unsplash/hiking-backpack.webp' },
  { year: '2021', title: 'First Retreat', desc: '12 men. One national forest. Zero phones. The Boyz In The Woodz concept was born from a single campfire conversation that lasted until 3am.', img: '/images/unsplash/forest-campfire.webp' },
  { year: '2022', title: 'The Brotherhood Grows', desc: 'Survival Pack 01 drops. The Chair and The Woodz merge into one ecosystem — a single loyalty wallet, one code, one family.', img: '/images/unsplash/landscape-1.webp' },
  { year: '2023', title: 'Points & Community', desc: 'Brotherhood Points launch — 10 points per dollar at either business. Chapters form in 6 cities. The movement goes national.', img: '/images/unsplash/landscape-1.webp' },
  { year: '2024', title: 'The Code Goes Public', desc: 'Five non-negotiables. Thousands of men living by them. The Code is now printed, framed, and hanging in barbershops across the country.', img: '/images/unsplash/hiking-backpack.webp' },
];

const VALUES = [
  { icon: Shield, title: 'Presence Over Performance', desc: 'We don\'t perform brotherhood — we practice it. No posturing. No keeping score. Just real men showing up as they are.' },
  { icon: Heart, title: 'Leave Better', desc: 'Every haircut, every retreat, every product should send you home feeling like a better version of yourself.' },
  { icon: Users, title: 'The Chair Confessional', desc: 'There\'s something about the barbershop that opens men up. We protect that space with everything we have.' },
  { icon: Trees, title: 'Nature as Medicine', desc: 'Cortisol drops. Presence rises. The forest does what no supplement can. 20 minutes in nature changes everything.' },
  { icon: Zap, title: 'Science Backs It', desc: 'Everything we do is grounded in neuroscience, physiology, and behavioral research. This isn\'t wellness — it\'s science.' },
  { icon: Trophy, title: 'Earn Your Brotherhood', desc: 'Points, badges, retreats — the ecosystem rewards men who show up consistently and invest in themselves.' },
];

const STATS = [
  { value: '1,200+', label: 'Active Brothers', icon: Users },
  { value: '18+', label: 'Retreats Run', icon: Trees },
  { value: '15K+', label: 'Haircuts Given', icon: Star },
  { value: '5', label: 'The Code Rules', icon: Shield },
];

const TEAM_MEMBERS = [
  {
    name: 'Hector Castro',
    role: 'Co-Founder',
    tag: 'visionary',
    bio: 'Hector brings years of mastery behind the chair and a passion for building community. His vision and dedication are the backbone of the movement.',
    icon: Crown,
    color: 'text-amber-400',
  },
  {
    name: 'Ryan Cooper',
    role: 'Co-Founder',
    tag: 'operator',
    bio: 'Ryan keeps the ship running and the culture strong. From operations to community building, he ensures every brother has what they need to thrive.',
    icon: Shield,
    color: 'text-blue-400',
  },
  {
    name: 'Jess Wild',
    role: 'Wilderness Guide',
    tag: 'guide',
    bio: 'With 12+ years in wilderness therapy and outdoor leadership, Jess brings deep expertise in nature-based healing. She leads every retreat with compassion, skill, and an unwavering commitment to brotherhood.',
    icon: Compass,
    color: 'text-emerald-400',
  },
];

// ============================================================
// SEO STRUCTURED DATA
// ============================================================
const seoData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      name: 'About BOYZ IN THE WOODZ',
      description: 'The story behind Boyz In The Woodz — a dual-brand ecosystem of wilderness retreats and barbershop community for men.',
      publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
    },
    {
      '@type': 'Organization',
      name: 'BOYZ IN THE WOODZ',
      alternateName: 'BITW',
      description: 'Wilderness retreats, barbershop community, and clothing for men seeking brotherhood, freedom, and nature.',
      foundingDate: '2021',
      founder: [{ '@type': 'Person', name: 'Hector Castro' }, { '@type': 'Person', name: 'Ryan Cooper' }],
      knowsAbout: ['Men\'s mental health', 'Wilderness therapy', 'Barbershop community', 'Brotherhood', 'Nature-based wellness'],
      slogan: 'Brotherhood. Freedom. Nature.',
    },
  ],
};

// ============================================================
// CAROUSEL COMPONENT
// ============================================================
function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && CAROUSEL_IMAGES.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % CAROUSEL_IMAGES.length);
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const goToSlide = (index) => {
    if (index >= 0 && index < CAROUSEL_IMAGES.length) {
      setCurrentIndex(index);
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 5000);
    }
  };

  if (CAROUSEL_IMAGES.length === 0) {
    return <div className="w-full h-full bg-black/50 rounded-2xl" />;
  }

  const currentImage = CAROUSEL_IMAGES[currentIndex];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ opacity: { duration: 1.8, ease: 'easeInOut' }, scale: { duration: 5, ease: 'easeOut' } }}
          className="absolute inset-0 w-full h-full"
        >
          <img 
            src={currentImage.src} 
            alt={currentImage.alt || 'Hero image'} 
            className="w-full h-full object-cover" 
            loading="lazy" 
            onError={(e) => {
              e.target.src = '/images/unsplash/landscape-1.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-700 rounded-full ${
              index === currentIndex
                ? 'w-6 h-1.5 bg-white/80'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Caption overlay */}
      <div className="absolute bottom-12 left-6 right-6 z-10">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[9px] font-heading tracking-wider uppercase text-primary/80">
            {currentImage.location}
          </span>
          <span className="w-6 h-px bg-primary/30" />
          <span className="text-[8px] text-white/40">
            {currentIndex + 1} / {CAROUSEL_IMAGES.length}
          </span>
        </div>
        <h3 className="font-heading text-xl text-white tracking-wide">
          {currentImage.caption}
        </h3>
        <p className="text-sm text-white/50 max-w-sm">
          {currentImage.alt}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeYear, setActiveYear] = useState(0);
  const timelineTimer = useRef(null);

  useEffect(() => {
    timelineTimer.current = setInterval(() => {
      setActiveYear(prev => (prev + 1) % TIMELINE.length);
    }, 6000);
    return () => clearInterval(timelineTimer.current);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ─── SEO ─── */}
      <SEO
        title="Our Story — BOYZ IN THE WOODZ | Wilderness Retreats & Brotherhood"
        description="Two businesses. One brotherhood. Wilderness retreats, a barbershop, and clothing built for men who need space to breathe. Discover the origin, values, and mission."
        canonical="/about"
        ogImage="/images/og/about-og.jpg"
        jsonLd={seoData}
      />

      {/* ─── HERO WITH CAROUSEL ─── */}
      <section className="relative py-8 md:py-10" style={{ paddingTop: '20px', paddingBottom: '28px' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Hero Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-3xl mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-gradient-to-r from-primary to-transparent" />
              <span className="text-xs font-heading tracking-[0.3em] text-primary/80 uppercase">Est. 2021</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide uppercase text-foreground leading-[0.9] mb-4">
              Two Businesses.
              <br />
              <span className="text-primary">One Brotherhood.</span>
            </h1>

            <p className="text-muted-foreground text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
              A man needs a cut and a reset — we built both. Wilderness retreats, a barbershop,
              and clothing for men who need space to breathe.
            </p>
          </motion.div>

          {/* ── Carousel - Full width on desktop ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full mx-auto mb-6"
            style={{ height: '300px', maxHeight: '40vh' }}
          >
            <HeroCarousel />
          </motion.div>

          {/* ── Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <Button asChild size="lg" className="font-heading tracking-wider uppercase text-sm bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group">
              <Link to="/retreat/apply">
                <Trees className="w-4 h-4 mr-2" />
                Explore Retreats
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-heading tracking-wider uppercase text-sm border-border/50 hover:border-primary/30">
              <Link to="/the-code">The Code</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-6 md:py-8 bg-black/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="w-4 h-4 text-primary/50" />
                  <div className="font-heading text-xl sm:text-2xl md:text-3xl text-foreground">
                    {stat.value}
                  </div>
                </div>
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-heading tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ORIGIN STORY ─── */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, hsl(82,60%,35%) 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Origin</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase mt-2 leading-tight">
              A Cut &amp; A Reset
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto mt-4 leading-relaxed">
              What started as a camping trip became a movement. Men running on empty —
              great at providing for everyone else, terrible at filling their own cup.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  So we built a brotherhood around nature. <span className="text-foreground font-medium">Wilderness retreats that strip away the noise.</span>
                </p>
                <p className="text-muted-foreground leading-relaxed mt-3">
                  <span className="text-foreground font-medium">Gear that reminds you who you are.</span> A community that shows up —
                  in the woods and in real life.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="font-heading tracking-wider uppercase text-sm group">
                  <Link to="/retreat/apply">
                    Apply for Retreat
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-sm">
                  <Link to="/the-code">The Code</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={TEAM_PHOTO} alt="Brotherhood" className="w-full h-64 md:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Quote className="w-5 h-5 text-primary/80 mb-2" />
                  <p className="text-white text-sm italic leading-relaxed">
                    "The forest strips away everything that doesn't matter.
                    The chair gives you back what does."
                  </p>
                  <p className="text-white/40 text-xs mt-2 font-heading tracking-wider uppercase">
                    — Hector Castro, Co-founder
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section className="py-16 md:py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(82,60%,35%) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The People</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase mt-2">Meet The Team</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {TEAM_MEMBERS.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 bg-gradient-to-b from-secondary/50 to-secondary/10 overflow-hidden">
                  <img src={TEAM_PHOTO} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <span className="text-[8px] font-heading tracking-[0.25em] uppercase px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/20">
                      {member.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <member.icon className={`w-4 h-4 ${member.color}`} />
                    <span className={`text-xs font-heading tracking-wider uppercase ${member.color}`}>{member.role}</span>
                  </div>
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-heading text-lg tracking-wider uppercase">{member.name}</h3>
                  <p className={`text-xs font-heading tracking-wider uppercase ${member.color} mb-2`}>{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Journey</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Timeline</h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-2.5">
              {TIMELINE.map((entry, i) => (
                <motion.button
                  key={entry.year}
                  onClick={() => { setActiveYear(i); clearInterval(timelineTimer.current); }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    activeYear === i
                      ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5'
                      : 'border-border/30 hover:border-border hover:bg-secondary/10'
                  }`}
                >
                  <span className={`font-heading text-2xl flex-shrink-0 transition-colors ${
                    activeYear === i ? 'text-primary' : 'text-muted-foreground/30'
                  }`}>
                    {entry.year}
                  </span>
                  <div>
                    <h3 className={`font-heading text-sm tracking-wider uppercase transition-colors ${
                      activeYear === i ? 'text-foreground' : 'text-foreground/60'
                    }`}>
                      {entry.title}
                    </h3>
                    {activeYear === i && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-muted-foreground mt-1.5 leading-relaxed"
                      >
                        {entry.desc}
                      </motion.p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="lg:sticky lg:top-24">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeYear}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl"
                >
                  <img src={TIMELINE[activeYear].img} alt={TIMELINE[activeYear].title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="font-heading text-5xl text-primary/80">{TIMELINE[activeYear].year}</span>
                    <h3 className="font-heading text-xl text-white uppercase tracking-wider mt-1">{TIMELINE[activeYear].title}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VALUES ─── */}
      <section className="py-16 md:py-24 bg-secondary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, hsl(82,60%,35%) 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">What We Stand For</span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Core Values</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {VALUES.map((val, i) => (
              <motion.div
                key={val.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="group bg-card border border-border/50 rounded-2xl p-6 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <val.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base tracking-wider uppercase mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARKET VALIDATION ─── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Market Is Ready</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Why This Works</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { value: '$121B', label: 'Global wellness market for men', year: '2024' },
              { value: '42%', label: 'of men 25-45 actively seek offline social experiences' },
              { value: '89%', label: 'of people want less screen time but don\'t know how' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card border border-border/50 rounded-2xl p-6 text-center hover:border-primary/30 transition-all duration-300"
              >
                <div className="font-heading text-3xl md:text-4xl text-primary">{stat.value}</div>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{stat.label}</p>
                {stat.year && <p className="text-[10px] text-muted-foreground mt-1 font-heading tracking-wider uppercase">{stat.year}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Common Questions</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Got Questions?</h2>
          </motion.div>

          <div className="space-y-3">
            {[
              { q: 'What is Boyz In The Woodz exactly?', a: 'We\'re a dual-brand ecosystem: a barbershop (The Chair) and a men\'s outdoor retreat brand (The Woodz). Both share a loyalty system, a code of conduct, and a mission to build complete men.' },
              { q: 'Do I have to accept The Code to shop?', a: 'The Code is required for retreat applications and some exclusive products. For general shopping, it\'s encouraged but optional.' },
              { q: 'Who is this for?', a: 'Men who are good at taking care of everyone else and terrible at filling their own cup. Men who want a cut and a reset.' },
              { q: 'Are retreats only for members?', a: 'Anyone can apply. Brotherhood members get priority waitlist slots and reduced deposit requirements.' },
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/20 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/10 transition-colors"
                >
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-3 transition-all duration-200 ${
                    openFaq === i ? 'rotate-180 text-primary' : ''
                  }`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE FINAL TRUTH ─── */}
      <section className="py-16 md:py-24 bg-primary/5 border-y border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(82,60%,35%) 20px, hsl(82,60%,35%) 21px)' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Final Truth</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-3 mb-6">
              This Only Works If It Stays Real
            </h2>

            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {['Experience-first', 'Brotherhood-first', 'Truth-first'].map((value, i) => (
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="px-5 py-2 rounded-full border border-primary/30 bg-primary/10 font-heading text-xs tracking-wider uppercase text-primary hover:bg-primary/20 transition-colors"
                >
                  {value}
                </motion.span>
              ))}
            </div>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-primary/40 to-transparent rounded-full" />
              <p className="text-muted-foreground text-sm leading-relaxed italic pl-4">
                "The moment it becomes content-first, aesthetic-first, profit-first — it dies.
                The moment it stays experience-first, brotherhood-first, truth-first — it grows."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CLOSING CTA ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/unsplash/landscape-1.webp" alt="Campfire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(270deg, hsl(82,60%,35%), hsl(28,70%,45%), hsl(82,60%,35%))', backgroundSize: '400% 100%', animation: 'gradient-x 8s ease infinite' }} />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star className="w-10 h-10 text-primary mx-auto mb-5" />
            </motion.div>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl tracking-wide uppercase text-white mb-4">
              Ready to Join?
            </h2>

            <p className="text-white/60 text-sm md:text-base lg:text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Whether you start in the chair or in the woods — you're welcome in this brotherhood.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-heading tracking-wider uppercase text-sm px-8 py-6 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group">
                <Link to="/retreat/apply">
                  <Trees className="w-4 h-4 mr-2" />
                  Apply for Retreat
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-sm px-8 py-6 border-white/20 text-white hover:bg-white/10 group">
                <Link to="/shop/boyz">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop Survival Pack
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>

            <Link
              to="/contact"
              className="inline-block mt-6 text-xs text-white/40 hover:text-primary font-heading tracking-widest uppercase transition-colors"
            >
              Questions? Contact Us →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}