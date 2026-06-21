/* ============================================================
   SERVICES — The Reset. The Return. The Brotherhood.
   Retreat experience types and add-ons
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, Shield, Zap, Star, ChevronDown, ArrowRight, Check, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RETREAT_TYPES = [
  {
    name: 'The Weekend Reset',
    duration: '2 days / 1 night',
    price: '$297',
    tag: 'Most Popular',
    tagColor: '#2D5A27',
    difficulty: 'Easy',
    bestFor: 'First-timers, Hustlers',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    includes: ['Camping gear provided', 'All meals (Fri dinner – Sun lunch)', 'Guided hikes', 'Fire ceremony', '2 certified guides'],
    color: '#2D5A27',
  },
  {
    name: 'The Deep Dive',
    duration: '3 days / 2 nights',
    price: '$497',
    tag: 'Best Value',
    tagColor: '#D2B48C',
    difficulty: 'Moderate',
    bestFor: 'Fathers, Lost Ones',
    img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=800&q=80',
    includes: ['All gear included', 'All meals', 'Silent hike', 'Fishing + swimming', 'Mentorship circle'],
    color: '#8B6914',
  },
  {
    name: 'The Expedition',
    duration: '5 days / 4 nights',
    price: '$897',
    tag: 'Full Experience',
    tagColor: '#5C4033',
    difficulty: 'Hard',
    bestFor: 'Nostalgic, experienced outdoorsmen',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    includes: ['Backpacking expedition', 'Survival skills training', 'Star gazing ceremony', 'Solo night', 'Full photography package'],
    color: '#5C4033',
  },
];

const INCLUDED_ALL = [
  'Tent (shared or solo option)', 'Sleeping pad', 'All meals (breakfast, lunch, dinner)',
  'Filtered water access', 'Campfire every night', '2 certified guides per retreat',
  'First aid kit + emergency comms', 'Brotherhood welcome pack',
];

const ADDONS = [
  { name: 'Private Tent (no sharing)', price: '+$50' },
  { name: 'Gear Rental Package (backpack, sleeping bag, headlamp)', price: '+$40' },
  { name: 'Fishing Gear Rental', price: '+$20' },
  { name: 'Professional Photography Package', price: '+$75' },
  { name: 'One-on-One Mentorship Session', price: '+$100' },
];

const UPCOMING = [
  { dates: 'Jul 18–20, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', capacity: '2 spots left', price: '$297' },
  { dates: 'Aug 7–9, 2026', location: 'Ouachita NF, AR', type: 'Deep Dive', capacity: '5 spots left', price: '$497' },
  { dates: 'Aug 22–24, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', capacity: 'Waitlist only', price: '$297' },
  { dates: 'Sep 12–16, 2026', location: 'Ozark NF, MO', type: 'Expedition', capacity: '3 spots left', price: '$897' },
  { dates: 'Sep 26–28, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', capacity: '8 spots left', price: '$297' },
  { dates: 'Oct 10–12, 2026', location: 'Shawnee NF, IL', type: 'Deep Dive', capacity: '6 spots left', price: '$497' },
];

const TESTIMONIALS = [
  { quote: "I came back lighter. My wife noticed.", name: 'Mike T.', retreat: 'Weekend Reset, Broken Bow' },
  { quote: "I taught my son to fish. We're closer now.", name: 'David R.', retreat: 'Deep Dive, Ouachita' },
  { quote: "No phones. No ego. Just men being real.", name: 'James W.', retreat: 'Expedition, Ozark' },
];

const FAQS = [
  { q: 'How do I get there?', a: 'Transportation to the trailhead is your responsibility. We send detailed directions 2 weeks before. Most brothers carpool — we connect you in the group chat.' },
  { q: 'What if I have dietary restrictions?', a: 'Just let us know when you apply. We accommodate vegetarian, vegan, gluten-free, and most allergies. Our guides cook real food.' },
  { q: 'What if the weather is bad?', a: 'We go rain or shine — that\'s part of the reset. If conditions are dangerous, we reschedule at no cost. We monitor forecasts 5 days out.' },
  { q: 'Is there cell service?', a: 'No — and that\'s the point. We have emergency satellite communication. You won\'t need your phone. You\'ll thank us.' },
  { q: 'Can I come alone?', a: 'Yes — most brothers do. You\'ll leave with friends. The retreat buddy system pairs first-timers with veterans.' },
  { q: 'What if I need to cancel?', a: '30+ days before: full refund. 14–29 days: 50% refund. Under 14 days: no refund. You can always transfer your spot to another brother.' },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85" alt="Mountain" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(135deg, #2D5A27 0%, transparent 60%)' }} />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative text-center px-4 max-w-4xl mx-auto">
          <span className="text-xs font-heading tracking-[0.3em] uppercase mb-4 block" style={{ color: '#D2B48C' }}>Retreat Experiences</span>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase text-white mb-4">
            The Reset.<br />The Return.<br />
            <span style={{ color: '#2D5A27' }}>The Brotherhood.</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Three types of experiences. One mission: bring you back stronger.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-heading tracking-wider uppercase" style={{ background: '#2D5A27' }}>
              <Link to="/retreat/apply"><ArrowRight className="w-4 h-4 mr-2" /> Apply for a Retreat</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase border-white/30 text-white hover:bg-white/10">
              <Link to="/retreat-calendar"><Calendar className="w-4 h-4 mr-2" /> View All Dates</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ── RETREAT TYPES ── */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>Choose Your Experience</span>
            <h2 className="font-heading text-4xl md:text-5xl tracking-wide uppercase text-foreground mt-2">Retreat Types</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {RETREAT_TYPES.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-52 overflow-hidden">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full text-white" style={{ background: r.tagColor }}>
                      {r.tag}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div>
                      <p className="font-heading text-xl uppercase text-white">{r.name}</p>
                      <p className="text-white/60 text-xs">{r.duration}</p>
                    </div>
                    <span className="font-heading text-3xl text-white">{r.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex gap-3 mb-4 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full border text-muted-foreground border-border">
                      {r.difficulty} difficulty
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border text-muted-foreground border-border">
                      Best for: {r.bestFor}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {r.includes.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2D5A27' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full font-heading tracking-wider uppercase" style={{ background: r.color }}>
                    <Link to="/retreat/apply">Apply Now →</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>All Retreats Include</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase text-foreground mt-2">What's Included</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {INCLUDED_ALL.map((item, i) => (
              <motion.div key={item} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#2D5A27' }} />
                <span className="text-sm text-muted-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADD-ONS ── */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>Optional Upgrades</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase text-foreground mt-2">Add-Ons</h2>
          </motion.div>
          <div className="space-y-3">
            {ADDONS.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-medium">{a.name}</span>
                <span className="font-heading text-lg" style={{ color: '#2D5A27' }}>{a.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING DATES ── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>Get Out There</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase text-foreground mt-2">Upcoming Dates</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {UPCOMING.map((u, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-heading text-base uppercase tracking-wider text-foreground">{u.dates}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{u.location}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{u.type}</span>
                  </div>
                  <p className={`text-xs mt-2 font-heading tracking-wider ${u.capacity.includes('Waitlist') ? 'text-yellow-500' : 'text-red-400'}`}>
                    {u.capacity}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-heading text-xl text-foreground">{u.price}</p>
                  <Button asChild size="sm" className="mt-2 font-heading tracking-wider text-xs" style={{ background: '#2D5A27' }}>
                    <Link to="/retreat/apply">Apply</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="font-heading tracking-wider uppercase">
              <Link to="/retreat-calendar"><Calendar className="w-4 h-4 mr-2" /> View Full Calendar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>Real Brothers, Real Resets</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase text-foreground mt-2">What They Said</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-lg font-accent italic text-foreground mb-4">"{t.quote}"</p>
                <p className="text-sm font-heading tracking-wider text-muted-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground/60">{t.retreat}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: '#2D5A27' }}>Retreat Questions</span>
            <h2 className="font-heading text-4xl tracking-wide uppercase text-foreground mt-2">FAQ</h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/30 transition-colors">
                  <span className="font-medium text-sm">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 ml-3 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} style={openFaq === i ? { color: '#2D5A27' } : {}} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=1600&q=80" alt="Campfire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Trees className="w-10 h-10 mx-auto mb-4" style={{ color: '#2D5A27' }} />
            <h2 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white mb-4">Ready to Reset?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">Apply for a retreat and take your first step back into the woodz.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="font-heading tracking-wider uppercase text-base px-10" style={{ background: '#2D5A27' }}>
                <Link to="/retreat/apply">Apply for a Retreat</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-base px-10 border-white/30 text-white hover:bg-white/10">
                <Link to="/retreat/waitlist">Join Waitlist for Sold Out Dates</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}