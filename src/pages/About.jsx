import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trees, Heart, Shield, Zap, Trophy, ArrowRight,
  Users, Star, ChevronDown, Quote, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const LOGO_URL = '/images/logos/logo-navbar-about.jpg';
const TEAM_PHOTO = '/images/logos/team-photo.png';

const TIMELINE = [
  { year: '2019', title: 'The First Retreat', desc: 'A small group of men head into the forest together for the first time. No plan. No phones. What came out of that weekend changed everything.', img: '/images/unsplash/forest-campfire.webp' },
  { year: '2020', title: 'The Revelation', desc: 'When the world shut down, we realized men needed more than productivity. They needed reconnection, presence, and permission to slow down.', img: '/images/unsplash/forest-hiking-trail.webp' },
  { year: '2021', title: 'First Retreat', desc: '12 men. One national forest. Zero phones. The Boyz In The Woodz concept was born from a single campfire conversation that lasted until 3am.', img: '/images/unsplash/forest-campfire.webp' },
  { year: '2022', title: 'The Brotherhood Grows', desc: 'Survival Pack 01 drops. The Chair and The Woodz merge into one ecosystem — a single loyalty wallet, one code, one family.', img: '/images/unsplash/men-group-bonding.webp' },
  { year: '2023', title: 'Points & Community', desc: 'Brotherhood Points launch — 10 points per dollar at either business. Chapters form in 6 cities. The movement goes national.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { year: '2024', title: 'The Code Goes Public', desc: 'Five non-negotiables. Thousands of men living by them. The Code is now printed, framed, and hanging in barbershops across the country.', img: '/images/unsplash/landscape-1.webp' },
];

const VALUES = [
  { icon: Shield, title: 'Presence Over Performance', desc: 'We don\'t perform brotherhood — we practice it. No posturing. No keeping score.' },
  { icon: Heart, title: 'Leave Better', desc: 'Every haircut, every retreat, every product should send you home feeling like a better version of yourself.' },
  { icon: Users, title: 'The Chair Confessional', desc: 'There\'s something about the barbershop that opens men up. We protect that space.' },
  { icon: Trees, title: 'Nature as Medicine', desc: 'Cortisol drops. Presence rises. The forest does what no supplement can.' },
  { icon: Zap, title: 'Science Backs It', desc: 'Everything we do is grounded in neuroscience, physiology, and behavioral research.' },
  { icon: Trophy, title: 'Earn Your Brotherhood', desc: 'Points, badges, retreats — the ecosystem rewards men who show up consistently.' },
];

const FAQS = [
  { q: 'What is Boyz In The Woodz exactly?', a: 'We\'re a dual-brand ecosystem: a barbershop (The Chair) and a men\'s outdoor retreat brand (The Woodz). Both share a loyalty system, a code of conduct, and a mission to build complete men.' },
  { q: 'Do I have to accept The Code to shop?', a: 'The Code is required for retreat applications and some exclusive products. For general shopping at The Chair, it\'s encouraged but optional.' },
  { q: 'Who is this for?', a: 'Men who are good at taking care of everyone else and terrible at filling their own cup. Men who want a cut and a reset — both in the same ecosystem.' },
  { q: 'Are retreats only for members?', a: 'Anyone can apply. Brotherhood members get priority waitlist slots and reduced deposit requirements.' },
];

function AnimatedCounter({ target, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const steps = 30;
    const stepTime = duration / steps;
    const raw = parseFloat(String(target).replace(/[,\+K]/g, ''));
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * raw));
      if (step >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  const format = (n) => {
    const t = String(target);
    if (t.endsWith('K+')) return n.toLocaleString() + '+';
    if (t.endsWith('+')) return n + '+';
    return String(target);
  };

  return <span ref={ref}>{format(count)}{suffix || ''}</span>;
}

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeYear, setActiveYear] = useState(0);
  const heroRef = useRef(null);
  const timelineTimer = useRef(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  useEffect(() => {
    timelineTimer.current = setInterval(() => {
      setActiveYear(prev => (prev + 1) % TIMELINE.length);
    }, 5000);
    return () => clearInterval(timelineTimer.current);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } }),
  };

  const fadeInLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
  const fadeInRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };

  const StatsCard = ({ children, className = '' }) => (
    <div className={`bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-5 hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden">
      <SEO
        title="Our Story — About BOYZ IN THE WOODZ | Wilderness Retreats & Brotherhood"
        description="Two businesses. One brotherhood. Wilderness retreats, a barbershop, and clothing built for men who need space to breathe. Discover the origin, values, and mission behind the Boyz In The Woodz movement."
        canonical="/about"
        ogImage="/images/og/about-og.jpg"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'AboutPage',
              name: 'About BOYZ IN THE WOODZ',
              description: 'The story behind Boyz In The Woodz — a dual-brand ecosystem of wilderness retreats and barbershop community for men.',
              publisher: { '@type': 'Organization', name: 'BOYZ IN THE WOODZ' },
              breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boyzinthewoodz.com/' }, { '@type': 'ListItem', position: 2, name: 'Our Story', item: 'https://boyzinthewoodz.com/about' }] },
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
        }}
      />

      {/* ── 1. CINEMATIC HERO (parallax) ── */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[560px] flex items-end pb-16 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src="/images/unsplash/forest-hiking-trail.webp" alt="Forest trail" className="w-full h-[110%] object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)' }} />
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(270deg, hsl(82,60%,35%,0.6), hsl(28,70%,45%,0.4), transparent)', backgroundSize: '400% 100%', animation: 'gradient-x 10s ease infinite' }} />
        </motion.div>
        <motion.div className="relative max-w-7xl mx-auto px-4 w-full" style={{ opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="inline-block bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 mb-6 shadow-lg">
              <img src={LOGO_URL} alt="BITW" className="h-14 w-auto" />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Our Story</span>
            </div>
            <h1 className="font-heading text-5xl md:text-8xl tracking-wide uppercase text-white leading-none mb-4">
              About The<br /><span className="text-primary">Ecosystem</span>
            </h1>
            <p className="text-white/60 text-base max-w-xl">
              Two businesses. One brotherhood. A man needs a cut and a reset — we built both.
            </p>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
          <span className="text-[10px] font-heading tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ── 2. ORIGIN STORY ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div variants={fadeInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Why We Exist</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-3 mb-6 leading-tight">
              A Man Needs<br />A Cut & A Reset
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              What started as a camping trip became a movement. We noticed men running on empty — great at providing for everyone else, terrible at filling their own cup.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              So we built a brotherhood around nature. <span className="text-foreground font-medium">Wilderness retreats that strip away the noise.</span> <span className="text-foreground font-medium">Gear that reminds you who you are.</span> A community that shows up — in the woods and in real life.
            </p>
            <div className="flex gap-3">
              <Button asChild className="font-heading tracking-wider uppercase group relative overflow-hidden">
                <Link to="/retreat/apply">
                  <span className="relative z-10 flex items-center">Apply for Retreat <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="font-heading tracking-wider uppercase group">
                <Link to="/the-code">The Code</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative">
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
              <img src="/images/unsplash/men-group-bonding.webp" alt="Brotherhood" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Quote className="w-6 h-6 text-primary mb-2" />
                <p className="font-accent text-white text-lg italic leading-snug">"The forest strips away everything that doesn't matter. The chair gives you back what does."</p>
                <p className="text-white/60 text-xs mt-2">— Marcus "Trail" Johnson, Co-founder</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="absolute -top-6 -right-6 bg-card/90 backdrop-blur-sm border border-primary/20 rounded-2xl p-4 shadow-2xl hidden md:block">
              <div className="font-heading text-3xl text-primary">1,200+</div>
              <p className="text-xs text-muted-foreground">Brothers in the ecosystem</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. STAFF ── */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, hsl(82,60%,35%) 0%, transparent 50%), radial-gradient(circle at 75% 50%, hsl(28,70%,45%) 0%, transparent 50%)' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The People</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Meet The Team</h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden mb-12 max-w-3xl mx-auto shadow-lg">
            <img src={TEAM_PHOTO} alt="The Urban Styles Team" className="w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <p className="font-heading text-2xl tracking-wider uppercase text-white">Urban Styles</p>
              <p className="text-white/60 text-xs mt-1 font-heading tracking-widest uppercase">The Team Behind The Chair</p>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Hector Castro', role: 'Owner', tag: 'barber',
                bio: 'Hector brings years of mastery behind the chair and a passion for building community. His vision and dedication are the backbone of what Urban Styles stands for.',
                stats: [{ v: '10+', l: 'Years cutting' }, { v: '5 ★', l: 'Avg. rating' }, { v: '1', l: 'Mission' }],
                color: 'text-primary', icon: Trees,
              },
              {
                name: 'Ryan Cooper', role: 'Owner', tag: 'barber',
                bio: 'Ryan keeps the ship running and the culture strong. From operations to community building, he ensures every client and every team member has what they need to thrive.',
                stats: [{ v: '100%', l: 'Committed' }, { v: 'Day 1', l: 'OG Member' }, { v: '∞', l: 'Energy' }],
                color: 'text-accent', icon: Shield,
              },
              {
                name: 'Britt', role: 'Owner', tag: 'barber',
                bio: 'Britt is the heart of the team — always bringing good energy, sharp skills, and a welcoming presence that makes every client feel right at home the moment they walk in.',
                stats: [{ v: 'Pro', l: 'Level Skills' }, { v: '❤️', l: 'Heart of the Shop' }, { v: 'Always', l: 'Showing Up' }],
                color: 'text-primary', icon: Heart,
              },
            ].map((member, i) => (
              <motion.div key={member.name} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden bg-secondary/50">
                  <img src={TEAM_PHOTO} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <member.icon className={`w-4 h-4 ${member.color}`} />
                    <span className={`text-xs font-heading tracking-wider uppercase ${member.color}`}>{member.role}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-around">
                    {member.stats.map(s => (
                      <div key={s.l} className="text-center">
                        <div className={`font-heading text-lg ${member.color}`}>{s.v}</div>
                        <div className="text-white/60 text-[9px]">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg tracking-wider uppercase">{member.name}</h3>
                  <p className={`text-xs font-heading tracking-wider uppercase ${member.color} mb-3`}>{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. TIMELINE (interactive + auto-advance) ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Journey</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Timeline</h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-start">
            <div className="space-y-2">
              {TIMELINE.map((entry, i) => (
                <motion.button key={entry.year} onClick={() => { setActiveYear(i); clearInterval(timelineTimer.current); }}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`w-full text-left flex items-start gap-5 p-4 rounded-xl border transition-all duration-300 ${activeYear === i ? 'bg-primary/10 border-primary/40 shadow-sm shadow-primary/10' : 'border-border/50 hover:border-border hover:bg-secondary/30'}`}>
                  <span className={`font-heading text-2xl flex-shrink-0 transition-colors ${activeYear === i ? 'text-primary' : 'text-muted-foreground/50'}`}>{entry.year}</span>
                  <div>
                    <h3 className={`font-heading text-base tracking-wider uppercase transition-colors ${activeYear === i ? 'text-foreground' : 'text-foreground/70'}`}>{entry.title}</h3>
                    {activeYear === i && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{entry.desc}</motion.p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div key={activeYear} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                  className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl">
                  <img src={TIMELINE[activeYear].img} alt={TIMELINE[activeYear].title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="font-heading text-5xl text-primary opacity-80">{TIMELINE[activeYear].year}</span>
                    <h3 className="font-heading text-xl text-white uppercase tracking-wider mt-1">{TIMELINE[activeYear].title}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. VALUES ── */}
      <section className="py-20 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, hsl(82,60%,35%) 0%, transparent 60%)' }} />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">What We Stand For</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Core Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((val, i) => (
              <motion.div key={val.title} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <val.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base tracking-wider uppercase mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. STATS BAR (animated counters) ── */}
      <section className="py-16 bg-primary/5 border-y border-primary/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { v: '1,200+', l: 'Active Brothers' },
              { v: '18+', l: 'Retreats Run' },
              { v: '15K+', l: 'Haircuts Given' },
              { v: '5', l: 'Rules in The Code' },
            ].map((stat, i) => (
              <motion.div key={stat.l} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="font-heading text-4xl md:text-5xl text-primary">
                  <AnimatedCounter target={stat.v} />
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-heading tracking-wider uppercase">{stat.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Common Questions</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase mt-2">Got Questions?</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/30 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-3 transition-all duration-200 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. THE FINAL TRUTH ── */}
      <section className="py-20 bg-primary/5 border-y border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, hsl(82,60%,35%) 20px, hsl(82,60%,35%) 21px)' }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Final Truth</span>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-3 mb-6">
              This Only Works If It Stays Real
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['Experience-first', 'Brotherhood-first', 'Truth-first'].map((value, i) => (
                <motion.span key={value} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="px-6 py-2 rounded-full border border-primary/30 bg-primary/10 font-heading text-sm tracking-wider uppercase text-primary hover:bg-primary/20 transition-colors">
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

      {/* ── 9. MARKET VALIDATION ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Why This Works</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">The Market Is Ready</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { value: '$121B', label: 'Global wellness market for men', year: '2024' },
              { value: '42%', label: 'of men 25-45 actively seek offline social experiences', year: '' },
              { value: '89%', label: 'of people want less screen time but don\'t know how', year: '' },
            ].map((stat, i) => (
              <motion.div key={stat.label} variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card/80 backdrop-blur-sm border border-border/70 rounded-xl p-6 text-center hover:border-primary/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5">
                <div className="font-heading text-4xl text-primary">{stat.value}</div>
                <p className="text-sm text-foreground/70 mt-2">{stat.label}</p>
                {stat.year && <p className="text-[10px] text-muted-foreground mt-1">{stat.year}</p>}
              </motion.div>
            ))}
          </div>
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}
            className="mt-8 bg-card/80 backdrop-blur-sm border border-primary/20 rounded-xl p-5 text-center">
            <p className="font-heading text-sm tracking-wider uppercase text-primary">The Growth Model — No Ads, No Hype</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-xs tracking-wider uppercase">Experience</span>
              <span>→</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-xs tracking-wider uppercase">Word of Mouth</span>
              <span>→</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-heading text-xs tracking-wider uppercase">Growth</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Clothing gets attention. Community creates loyalty. Experience creates movement.</p>
          </motion.div>
        </div>
      </section>

      {/* ── 10. CLOSING CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/unsplash/landscape-1.webp" alt="Campfire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(270deg, hsl(82,60%,35%), hsl(28,70%,45%), hsl(82,60%,35%))', backgroundSize: '400% 100%', animation: 'gradient-x 8s ease infinite' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase text-white mb-4">
              Ready to Join?
            </h2>
            <p className="text-white/70 text-base mb-8 max-w-lg mx-auto">
              Whether you start in the chair or in the woods — you're welcome in this brotherhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-heading tracking-wider uppercase text-base px-8 group relative overflow-hidden">
                <Link to="/retreat/apply">
                  <span className="relative z-10 flex items-center"><Trees className="w-4 h-4 mr-2" /> Apply for Retreat</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-base px-8 border-white/30 text-white hover:bg-white/10 relative group">
                <Link to="/shop/boyz"><ShoppingBag className="w-4 h-4 mr-2" /> Shop Survival Pack</Link>
              </Button>
            </div>
            <Link to="/contact" className="inline-block mt-6 text-xs text-white/50 hover:text-primary font-heading tracking-widest uppercase transition-colors">
              Questions? Contact Us →
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
