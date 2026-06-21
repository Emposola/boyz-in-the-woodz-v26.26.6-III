/* ============================================================
   RETREAT DETAIL — Dynamic page for each retreat type
   Routes: /retreat/weekend-reset, /retreat/deep-dive, /retreat/expedition
   ============================================================ */
import React, { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Clock, MapPin, Users, Star, ChevronDown, ArrowRight, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const RETREATS = {
  'weekend-reset': {
    title: 'The Weekend Reset',
    duration: '2 Days / 1 Night',
    price: 297,
    difficulty: 'Easy',
    difficultyColor: '#2D5A27',
    bestFor: 'First-timers, Hustlers, Anyone who needs air',
    img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=85',
    tagline: 'Two days. No phone. New you.',
    description: 'The Weekend Reset is the perfect entry point into the brotherhood. No experience needed — just the willingness to show up. We handle the rest.',
    includes: ['Tent (shared option)', 'Friday dinner + Saturday breakfast & lunch', 'Guided morning hike (2–4 miles, easy terrain)', 'Fire ceremony Saturday night', '2 certified guides', 'Brotherhood welcome pack'],
    notIncluded: ['Transportation to trailhead', 'Personal gear (or rent from us)', 'Sleeping bag (or rent from us)'],
    packing: ['Hiking shoes or trail runners', 'Layered clothing (temperatures drop at night)', 'Rain jacket', 'Sunscreen', 'Personal medications', 'Journal (optional)', 'Water bottle (or buy ours)', 'Cash for tips'],
    itinerary: [
      { day: 'Friday', time: '4:00 PM', event: 'Arrival & check-in at trailhead' },
      { day: 'Friday', time: '5:30 PM', event: 'Camp setup — learn your shelter' },
      { day: 'Friday', time: '7:00 PM', event: 'Dinner around the fire' },
      { day: 'Friday', time: '9:00 PM', event: 'Opening circle — share your intention' },
      { day: 'Saturday', time: '6:30 AM', event: 'Sunrise walk (optional)' },
      { day: 'Saturday', time: '8:00 AM', event: 'Breakfast' },
      { day: 'Saturday', time: '9:30 AM', event: 'Guided hike — silence for first 30 min' },
      { day: 'Saturday', time: '1:00 PM', event: 'Lunch + free time' },
      { day: 'Saturday', time: '3:00 PM', event: 'Brotherhood workshop' },
      { day: 'Saturday', time: '7:00 PM', event: 'Fire ceremony — what are you leaving behind?' },
      { day: 'Saturday', time: '10:00 PM', event: 'Open fire, optional storytelling' },
      { day: 'Sunday', time: '7:00 AM', event: 'Breakfast + pack down' },
      { day: 'Sunday', time: '10:00 AM', event: 'Closing circle — what are you taking home?' },
      { day: 'Sunday', time: '11:30 AM', event: 'Departure' },
    ],
    reviews: [
      { name: 'Marcus T.', rating: 5, text: 'I came back lighter. My wife noticed.' },
      { name: 'James W.', rating: 5, text: 'No phones. No ego. Two days I needed.' },
      { name: 'David R.', rating: 5, text: 'The fire ceremony hit different. I cried. It was perfect.' },
    ],
  },
  'deep-dive': {
    title: 'The Deep Dive',
    duration: '3 Days / 2 Nights',
    price: 497,
    difficulty: 'Moderate',
    difficultyColor: '#8B6914',
    bestFor: 'Fathers, Lost Ones, Men in transition',
    img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=1600&q=85',
    tagline: 'Go deeper. Stay longer. Come back changed.',
    description: 'Three days to quiet the noise. The Deep Dive includes solo hiking time, fishing, swimming, and stargazing. Some hiking experience recommended.',
    includes: ['Solo tent', 'All meals (Fri dinner through Sun lunch)', 'Silent hike (3 hours, solo)', 'Guided fishing session', 'Swimming hole access', 'Stargazing ceremony', '2 guides + 1 mentorship facilitator'],
    notIncluded: ['Transportation', 'Personal gear', 'Fishing license (we handle it)'],
    packing: ['Hiking boots (required)', 'Swimwear', 'Insect repellent', 'Headlamp', 'Sleeping bag (or rent)', 'Warm layers for night', 'Journal', 'Open mind'],
    itinerary: [
      { day: 'Friday', time: '3:00 PM', event: 'Arrival & orientation' },
      { day: 'Friday', time: '5:00 PM', event: 'Camp setup' },
      { day: 'Friday', time: '7:00 PM', event: 'Opening dinner + intention setting' },
      { day: 'Saturday', time: '6:00 AM', event: 'Silent sunrise hike (3 hrs)' },
      { day: 'Saturday', time: '10:00 AM', event: 'Breakfast + rest' },
      { day: 'Saturday', time: '1:00 PM', event: 'Fishing + swimming hole' },
      { day: 'Saturday', time: '6:00 PM', event: 'Dinner + brotherhood workshop' },
      { day: 'Saturday', time: '9:30 PM', event: 'Stargazing ceremony' },
      { day: 'Sunday', time: '6:30 AM', event: 'Solo reflection walk' },
      { day: 'Sunday', time: '9:00 AM', event: 'Closing breakfast' },
      { day: 'Sunday', time: '10:30 AM', event: 'Closing circle + departure' },
    ],
    reviews: [
      { name: 'Kevin H.', rating: 5, text: 'The silent hike broke something open in me. In a good way.' },
      { name: 'Troy M.', rating: 5, text: 'First time fishing since my dad. I cried twice.' },
      { name: 'Andre L.', rating: 5, text: 'Best money I ever spent. Period.' },
    ],
  },
  'expedition': {
    title: 'The Expedition',
    duration: '5 Days / 4 Nights',
    price: 897,
    difficulty: 'Hard',
    difficultyColor: '#5C4033',
    bestFor: 'Experienced outdoorsmen, Nostalgic, Seekers',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85',
    tagline: 'Five days. The full experience. The full reset.',
    description: 'The Expedition is the full experience. Backpacking, survival skills training, a solo night in the wilderness, and campfire storytelling. Backpacking experience required.',
    includes: ['Full backpacking setup', 'All meals (trail meals day 3–4)', 'Survival skills: fire, shelter, navigation', 'Solo night (night 3, fully guided safety)', 'Campfire storytelling', 'Professional photography package'],
    notIncluded: ['Transportation to trailhead', 'Physical fitness level: must be able to hike 8+ miles/day with pack'],
    packing: ['Backpack (60L+)', 'Trail hiking boots (broken in)', 'Trekking poles', 'All weather gear', 'Energy bars', 'Medical information form (required)', 'Emergency contact details'],
    itinerary: [
      { day: 'Day 1', time: '2:00 PM', event: 'Arrival, gear check, orientation' },
      { day: 'Day 1', time: '5:00 PM', event: 'Opening ceremony' },
      { day: 'Day 2', time: '7:00 AM', event: 'Begin backpacking (8 miles)' },
      { day: 'Day 2', time: '5:00 PM', event: 'Set camp, survival skills workshop' },
      { day: 'Day 3', time: '6:00 AM', event: 'Navigation training' },
      { day: 'Day 3', time: 'Dusk', event: 'Solo night begins' },
      { day: 'Day 4', time: 'Sunrise', event: 'Solo night ends — group reunion' },
      { day: 'Day 4', time: '3:00 PM', event: 'Summit or destination hike' },
      { day: 'Day 4', time: '7:00 PM', event: 'Campfire storytelling — final night' },
      { day: 'Day 5', time: '6:00 AM', event: 'Closing sunrise' },
      { day: 'Day 5', time: '9:00 AM', event: 'Closing circle, pack out, depart' },
    ],
    reviews: [
      { name: 'Rico B.', rating: 5, text: 'The solo night changed my relationship with fear.' },
      { name: 'Damon K.', rating: 5, text: '5 days I will never forget. Grateful for every moment.' },
      { name: 'Chris P.', rating: 5, text: 'I\'ve done other trips. Nothing compares to this brotherhood.' },
    ],
  },
};

export default function RetreatDetail() {
  const { type: paramType } = useParams();
  const location = useLocation();
  // derive type from URL if param not set
  const urlType = location.pathname.split('/').pop();
  const type = paramType || urlType;
  const retreat = RETREATS[type] || RETREATS['weekend-reset'];
  const [openFaq, setOpenFaq] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheck = (item) => setCheckedItems(c => c.includes(item) ? c.filter(x => x !== item) : [...c, item]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={retreat.img} alt={retreat.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-5xl mx-auto px-4 pb-12 w-full">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full text-white" style={{ background: FG }}>
              {retreat.duration}
            </span>
            <span className="text-xs font-heading tracking-wider uppercase px-3 py-1 rounded-full text-white" style={{ background: retreat.difficultyColor }}>
              {retreat.difficulty} difficulty
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase text-white">{retreat.title}</h1>
          <p className="text-white/70 text-lg mt-2 mb-6">{retreat.tagline}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="font-heading tracking-wider uppercase" style={{ background: FG }}>
              <Link to="/retreat/apply">Apply Now — ${retreat.price} <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase border-white/30 text-white hover:bg-white/10">
              <Link to="/retreat/waitlist">Join Waitlist</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Main Content */}
          <div className="space-y-10">
            {/* Description */}
            <div>
              <p className="text-muted-foreground text-base leading-relaxed">{retreat.description}</p>
              <p className="text-sm text-muted-foreground mt-2"><strong className="text-foreground">Best for:</strong> {retreat.bestFor}</p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="font-heading text-2xl tracking-wide uppercase mb-5" style={{ color: FG }}>The Itinerary</h2>
              <div className="space-y-0.5">
                {retreat.itinerary.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                    <div className="flex-shrink-0 text-right w-24">
                      <p className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground/60">{item.day}</p>
                      <p className="text-xs font-heading" style={{ color: SAND }}>{item.time}</p>
                    </div>
                    <div className="flex-shrink-0 w-2 h-2 rounded-full mt-1.5" style={{ background: FG }} />
                    <p className="text-sm text-foreground/80">{item.event}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Packing List */}
            <div>
              <h2 className="font-heading text-2xl tracking-wide uppercase mb-5" style={{ color: FG }}>Packing List</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {retreat.packing.map(item => (
                  <button key={item} onClick={() => toggleCheck(item)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${checkedItems.includes(item) ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-border/80'}`}>
                    <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border transition-all ${checkedItems.includes(item) ? 'border-primary bg-primary' : 'border-border'}`}>
                      {checkedItems.includes(item) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm transition-colors ${checkedItems.includes(item) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item}</span>
                  </button>
                ))}
              </div>
              {checkedItems.length > 0 && (
                <p className="text-xs text-muted-foreground mt-3">{checkedItems.length}/{retreat.packing.length} items packed</p>
              )}
            </div>

            {/* Reviews */}
            <div>
              <h2 className="font-heading text-2xl tracking-wide uppercase mb-5" style={{ color: FG }}>What Brothers Said</h2>
              <div className="space-y-4">
                {retreat.reviews.map((r, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex mb-2">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-base italic font-accent text-foreground mb-2">"{r.text}"</p>
                    <p className="text-xs text-muted-foreground font-heading tracking-wider">{r.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Price card */}
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-28">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-heading text-4xl text-foreground">${retreat.price}</span>
                <span className="text-sm text-muted-foreground">per person</span>
              </div>
              <p className="text-xs text-muted-foreground mb-5">{retreat.duration} · {retreat.difficulty} difficulty</p>

              <h4 className="font-heading text-xs tracking-wider uppercase mb-3" style={{ color: FG }}>What's Included</h4>
              <ul className="space-y-2 mb-5">
                {retreat.includes.map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: FG }} />
                    {item}
                  </li>
                ))}
              </ul>

              <h4 className="font-heading text-xs tracking-wider uppercase mb-3 text-muted-foreground">Not Included</h4>
              <ul className="space-y-1 mb-6">
                {retreat.notIncluded.map(item => (
                  <li key={item} className="text-xs text-muted-foreground">— {item}</li>
                ))}
              </ul>

              <Button asChild className="w-full font-heading tracking-wider uppercase mb-3" style={{ background: FG }}>
                <Link to="/retreat/apply">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" className="w-full font-heading tracking-wider uppercase text-xs">
                <Link to="/retreat/waitlist">Join Waitlist</Link>
              </Button>
              <Link to="/retreat-calendar" className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Calendar className="w-3.5 h-3.5" /> View All Dates
              </Link>
            </div>

            {/* Navigation between retreat types */}
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-3">Other Retreats</p>
              {Object.entries(RETREATS).filter(([k]) => k !== type).map(([k, r]) => (
                <Link key={k} to={`/retreat/${k}`}
                  className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0 hover:text-primary transition-colors group">
                  <div>
                    <p className="text-sm font-medium">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.duration} · ${r.price}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}