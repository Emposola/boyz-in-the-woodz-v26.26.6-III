/* ============================================================
   ABOUT — 8 artful sections: hero, mission, founders, timeline,
   values, stats, team culture, closing CTA
   ============================================================ */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Trees, Heart, Shield, Zap, Trophy, ArrowRight,
  Users, MapPin, Star, ChevronDown, Quote, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/ce0384b42_1000018901.jpg';
const TEAM_PHOTO = 'https://media.base44.com/images/public/69fb006d51e7a4116cb6d468/8e5c625a4_image.png';

const TIMELINE = [
  { year: '2019', title: 'The First Retreat', desc: 'A small group of men head into the forest together for the first time. No plan. No phones. What came out of that weekend changed everything.', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80' },
  { year: '2020', title: 'The Revelation', desc: 'When the world shut down, we realized men needed more than productivity. They needed reconnection, presence, and permission to slow down.', img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80' },
  { year: '2021', title: 'First Retreat', desc: '12 men. One national forest. Zero phones. The Boyz In The Woodz concept was born from a single campfire conversation that lasted until 3am.', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80' },
  { year: '2022', title: 'The Brotherhood Grows', desc: 'Survival Pack 01 drops. The Chair and The Woodz merge into one ecosystem — a single loyalty wallet, one code, one family.', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80' },
  { year: '2023', title: 'Points & Community', desc: 'Brotherhood Points launch — 10 points per dollar at either business. Chapters form in 6 cities. The movement goes national.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { year: '2024', title: 'The Code Goes Public', desc: 'Five non-negotiables. Thousands of men living by them. The Code is now printed, framed, and hanging in barbershops across the country.', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' },
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

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeYear, setActiveYear] = useState(0);

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── 1. CINEMATIC HERO ── */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1600&q=85" alt="Forest" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 100%)' }} />
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(270deg, hsl(82,60%,35%,0.4), hsl(28,70%,45%,0.3), transparent)', backgroundSize: '400% 100%', animation: 'gradient-x 10s ease infinite' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <div className="inline-block bg-black border border-white/20 rounded-2xl px-4 py-2 mb-6 shadow-lg">
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
        </div>
        {/* Scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40">
          <span className="text-[10px] font-heading tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* ── 2. ORIGIN STORY ── */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
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
              <span className="btn-animated-border">
                <Button asChild className="font-heading tracking-wider uppercase relative">
                  <Link to="/retreat/apply">Apply for Retreat <ArrowRight className="w-4 h-4 ml-1" /></Link>
                </Button>
              </span>
              <span className="btn-animated-border">
                <Button asChild variant="outline" className="font-heading tracking-wider uppercase relative">
                  <Link to="/the-code">The Code</Link>
                </Button>
              </span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=85" alt="Brotherhood" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <Quote className="w-6 h-6 text-primary mb-2" />
                <p className="font-accent text-white text-lg italic leading-snug">"The forest strips away everything that doesn't matter. The chair gives you back what does."</p>
                <p className="text-white/60 text-xs mt-2">— Marcus "Trail" Johnson, Co-founder</p>
              </div>
            </div>
            {/* Floating stat card */}
            <div className="absolute -top-6 -right-6 bg-card border border-border rounded-2xl p-4 shadow-2xl hidden md:block">
              <div className="font-heading text-3xl text-primary">1,200+</div>
              <p className="text-xs text-muted-foreground">Brothers in the ecosystem</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 3. STAFF ── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The People</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Meet The Team</h2>
          </motion.div>

          {/* Team Photo */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden mb-12 max-w-3xl mx-auto">
            <img src={TEAM_PHOTO} alt="The Urban Styles Team" className="w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
              <p className="font-heading text-2xl tracking-wider uppercase text-white">Urban Styles</p>
              <p className="text-white/60 text-xs mt-1 font-heading tracking-widest uppercase">The Team Behind The Chair</p>
            </div>
          </motion.div>

          {/* Staff Cards */}
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
              <motion.div key={member.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300">
                <div className="relative h-44 overflow-hidden bg-secondary/50">
                  <img src={TEAM_PHOTO} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
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

      {/* ── 4. TIMELINE (interactive) ── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">The Journey</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Timeline</h2>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Year list */}
            <div className="space-y-2">
              {TIMELINE.map((entry, i) => (
                <motion.button key={entry.year} onClick={() => setActiveYear(i)}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`w-full text-left flex items-start gap-5 p-4 rounded-xl border transition-all duration-300 ${activeYear === i ? 'bg-primary/10 border-primary/40' : 'border-border/50 hover:border-border hover:bg-secondary/30'}`}>
                  <span className={`font-heading text-2xl flex-shrink-0 transition-colors ${activeYear === i ? 'text-primary' : 'text-muted-foreground/50'}`}>{entry.year}</span>
                  <div>
                    <h3 className={`font-heading text-base tracking-wider uppercase transition-colors ${activeYear === i ? 'text-foreground' : 'text-foreground/70'}`}>{entry.title}</h3>
                    {activeYear === i && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{entry.desc}</p>}
                  </div>
                </motion.button>
              ))}
            </div>
            {/* Image panel */}
            <div className="sticky top-28">
              <AnimatePresence mode="wait">
                <motion.div key={activeYear} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
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
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">What We Stand For</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase mt-2">Our Core Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((val, i) => (
              <motion.div key={val.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 group transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <val.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base tracking-wider uppercase mb-2">{val.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. STATS BAR ── */}
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
                <div className="font-heading text-4xl md:text-5xl text-primary">{stat.v}</div>
                <p className="text-xs text-muted-foreground mt-1 font-heading tracking-wider uppercase">{stat.l}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ── */}
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Common Questions</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase mt-2">Got Questions?</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/30 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-3 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
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

      {/* ── 8. CLOSING CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=85" alt="Campfire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(270deg, hsl(82,60%,35%), hsl(28,70%,45%), hsl(82,60%,35%))', backgroundSize: '400% 100%', animation: 'gradient-x 8s ease infinite' }} />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Star className="w-8 h-8 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase text-white mb-4">
              Ready to Join?
            </h2>
            <p className="text-white/70 text-base mb-8 max-w-lg mx-auto">
              Whether you start in the chair or in the woods — you're welcome in this brotherhood.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <span className="btn-animated-border">
                <Button asChild size="lg" className="font-heading tracking-wider uppercase text-base px-8 relative">
                  <Link to="/retreat/apply"><Trees className="w-4 h-4 mr-2" /> Apply for Retreat</Link>
                </Button>
              </span>
              <span className="btn-animated-border">
                <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-base px-8 border-white/30 text-white hover:bg-white/10 relative">
                  <Link to="/shop/boyz"><ShoppingBag className="w-4 h-4 mr-2" /> Shop Survival Pack</Link>
                </Button>
              </span>
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