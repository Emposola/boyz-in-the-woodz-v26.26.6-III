/* ============================================================
   RETREAT CALENDAR — Full calendar of upcoming retreats
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Filter, ArrowRight, Trees, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const RETREATS = [
  { id: 1, slug: 'broken-bow-jul-2026', title: 'Broken Bow Summer Reset', dates: 'Jul 18–20, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', difficulty: 'Easy', duration: '2-day', season: 'summer', price: 297, capacity: 12, spotsLeft: 2, terrain: 'Forest / Lake', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=75' },
  { id: 2, slug: 'ouachita-aug-2026', title: 'Ouachita Deep Dive', dates: 'Aug 7–9, 2026', location: 'Ouachita NF, AR', type: 'Deep Dive', difficulty: 'Moderate', duration: '3-day', season: 'summer', price: 497, capacity: 10, spotsLeft: 5, terrain: 'River / Forest', img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=600&q=75' },
  { id: 3, slug: 'broken-bow-aug-2026', title: 'Broken Bow Late Summer', dates: 'Aug 22–24, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', difficulty: 'Easy', duration: '2-day', season: 'summer', price: 297, capacity: 12, spotsLeft: 0, terrain: 'Forest / Lake', img: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=75' },
  { id: 4, slug: 'ozark-sep-2026', title: 'Ozark Expedition', dates: 'Sep 12–16, 2026', location: 'Ozark NF, MO', type: 'Expedition', difficulty: 'Hard', duration: '5-day', season: 'fall', price: 897, capacity: 8, spotsLeft: 3, terrain: 'Mountains / Trail', img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=75' },
  { id: 5, slug: 'broken-bow-sep-2026', title: 'Broken Bow Fall Reset', dates: 'Sep 26–28, 2026', location: 'Broken Bow, OK', type: 'Weekend Reset', difficulty: 'Easy', duration: '2-day', season: 'fall', price: 297, capacity: 12, spotsLeft: 8, terrain: 'Forest / Lake', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=75' },
  { id: 6, slug: 'shawnee-oct-2026', title: 'Shawnee Deep Dive', dates: 'Oct 10–12, 2026', location: 'Shawnee NF, IL', type: 'Deep Dive', difficulty: 'Moderate', duration: '3-day', season: 'fall', price: 497, capacity: 10, spotsLeft: 6, terrain: 'Forest / Bluffs', img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=75' },
];

const FOREST_GREEN = '#2D5A27';

export default function RetreatCalendar() {
  const [filters, setFilters] = useState({ location: 'all', difficulty: 'all', duration: 'all', season: 'all' });

  const filtered = RETREATS.filter(r => {
    if (filters.difficulty !== 'all' && r.difficulty.toLowerCase() !== filters.difficulty) return false;
    if (filters.duration !== 'all' && r.duration !== filters.duration) return false;
    if (filters.season !== 'all' && r.season !== filters.season) return false;
    return true;
  });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const FilterBtn = ({ fKey, val, label }) => (
    <button
      onClick={() => setFilter(fKey, val)}
      className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${filters[fKey] === val ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
      style={filters[fKey] === val ? { background: FOREST_GREEN } : {}}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Retreat Calendar — Upcoming Events" description="View upcoming retreat dates and reserve your spot in the brotherhood." canonical="/retreat/calendar" />
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" alt="Retreats" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-heading tracking-[0.3em] uppercase mb-3 block" style={{ color: '#D2B48C' }}>Plan Your Reset</span>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white mb-4">
            Retreat <span style={{ color: FOREST_GREEN }}>Calendar</span>
          </h1>
          <p className="text-white/70 text-lg">Pick your date. Pack light. Come back different.</p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-card border-b border-border sticky top-20 z-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground mr-1" />
            <FilterBtn fKey="difficulty" val="all" label="All Difficulty" />
            <FilterBtn fKey="difficulty" val="easy" label="Easy" />
            <FilterBtn fKey="difficulty" val="moderate" label="Moderate" />
            <FilterBtn fKey="difficulty" val="hard" label="Hard" />
            <div className="w-px h-5 bg-border mx-1" />
            <FilterBtn fKey="duration" val="all" label="All Lengths" />
            <FilterBtn fKey="duration" val="2-day" label="2-Day" />
            <FilterBtn fKey="duration" val="3-day" label="3-Day" />
            <FilterBtn fKey="duration" val="5-day" label="5-Day" />
            <div className="w-px h-5 bg-border mx-1" />
            <FilterBtn fKey="season" val="all" label="All Seasons" />
            <FilterBtn fKey="season" val="summer" label="Summer" />
            <FilterBtn fKey="season" val="fall" label="Fall" />
          </div>
        </div>
      </section>

      {/* Retreat Cards */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">
                <div className="relative h-44 overflow-hidden">
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-xs font-heading tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      {r.type}
                    </span>
                    <span className="text-xs font-heading tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      {r.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <div>
                      <p className="font-heading text-lg uppercase text-white tracking-wider">{r.title}</p>
                      <p className="text-white/60 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" />{r.location}</p>
                    </div>
                    <span className="font-heading text-2xl text-white">${r.price}</span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{r.dates}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      {r.spotsLeft === 0 ? (
                        <span className="text-xs font-heading text-yellow-500 tracking-wider">WAITLIST AVAILABLE</span>
                      ) : r.spotsLeft <= 3 ? (
                        <span className="text-xs font-heading text-red-400 tracking-wider">ONLY {r.spotsLeft} SPOTS LEFT</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{r.spotsLeft} of {r.capacity} spots left</span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" className="font-heading tracking-wider uppercase flex-shrink-0" style={{ background: FOREST_GREEN }}>
                    <Link to={r.spotsLeft === 0 ? '/retreat/waitlist' : '/retreat/apply'}>
                      {r.spotsLeft === 0 ? 'Join Waitlist' : 'Apply Now'}
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Trees className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading tracking-wider uppercase">No retreats match your filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}