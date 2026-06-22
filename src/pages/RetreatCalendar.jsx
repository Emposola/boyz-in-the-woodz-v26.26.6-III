/* ============================================================
   RETREAT CALENDAR — Pulls live events from DB
   Falls back to static data if DB is empty
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Calendar, MapPin, Users, Filter, ArrowRight, Trees, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const STATIC_RETREATS = [
  { id: 's1', title: 'Broken Bow Summer Reset', start_date: '2026-07-18', location_name: 'Broken Bow, OK', type: 'retreat', difficulty: 'Easy', duration: '2-day', full_price: 297, deposit_amount: 100, capacity: 12, spots_remaining: 2, image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=75', active: true },
  { id: 's2', title: 'Ouachita Deep Dive', start_date: '2026-08-07', location_name: 'Ouachita NF, AR', type: 'retreat', difficulty: 'Moderate', duration: '3-day', full_price: 497, deposit_amount: 150, capacity: 10, spots_remaining: 5, image_url: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=600&q=75', active: true },
  { id: 's3', title: 'Broken Bow Late Summer', start_date: '2026-08-22', location_name: 'Broken Bow, OK', type: 'retreat', difficulty: 'Easy', duration: '2-day', full_price: 297, deposit_amount: 100, capacity: 12, spots_remaining: 0, image_url: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=600&q=75', active: true },
  { id: 's4', title: 'Ozark Expedition', start_date: '2026-09-12', location_name: 'Ozark NF, MO', type: 'retreat', difficulty: 'Hard', duration: '5-day', full_price: 897, deposit_amount: 250, capacity: 8, spots_remaining: 3, image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=75', active: true },
  { id: 's5', title: 'Broken Bow Fall Reset', start_date: '2026-09-26', location_name: 'Broken Bow, OK', type: 'retreat', difficulty: 'Easy', duration: '2-day', full_price: 297, deposit_amount: 100, capacity: 12, spots_remaining: 8, image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=75', active: true },
  { id: 's6', title: 'Shawnee Deep Dive', start_date: '2026-10-10', location_name: 'Shawnee NF, IL', type: 'retreat', difficulty: 'Moderate', duration: '3-day', full_price: 497, deposit_amount: 150, capacity: 10, spots_remaining: 6, image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=75', active: true },
];

const DIFFICULTY_COLOR = {
  Easy: 'text-green-400 bg-green-900/30',
  Moderate: 'text-yellow-400 bg-yellow-900/30',
  Hard: 'text-red-400 bg-red-900/30',
};

export default function RetreatCalendar() {
  const [filters, setFilters] = useState({ difficulty: 'all', duration: 'all' });

  const { data: dbEvents = [], isLoading } = useQuery({
    queryKey: ['retreat-calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', 'retreat')
        .eq('active', true)
        .order('start_date', { ascending: true });
      if (error) return [];
      return data || [];
    },
  });

  const retreats = dbEvents.length > 0 ? dbEvents : STATIC_RETREATS;

  const filtered = retreats.filter(r => {
    if (filters.difficulty !== 'all' && (r.difficulty || '').toLowerCase() !== filters.difficulty) return false;
    if (filters.duration !== 'all' && r.duration !== filters.duration) return false;
    return true;
  });

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const FilterBtn = ({ fKey, val, label }) => (
    <button onClick={() => setFilter(fKey, val)}
      className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all border ${
        filters[fKey] === val ? 'text-white border-transparent' : 'border-border text-muted-foreground hover:border-primary/40'
      }`}
      style={filters[fKey] === val ? { background: FG } : {}}>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Retreat Calendar — Upcoming Events"
        description="View upcoming retreat dates and secure your spot in the brotherhood. Limited spots per retreat."
        canonical="/retreat-calendar"
      />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
            alt="Retreats" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-heading tracking-[0.3em] uppercase mb-3 block" style={{ color: SAND }}>
            Plan Your Reset
          </span>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white mb-4">
            Retreat <span style={{ color: FG }}>Calendar</span>
          </h1>
          <p className="text-white/70 text-lg mb-2">Pick your date. Pay your deposit. Show up different.</p>
          <p className="text-white/40 text-sm">A deposit secures your spot. Only committed men need apply.</p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="py-5 bg-card border-b border-border sticky top-16 lg:top-20 z-20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground mr-1 flex-shrink-0" />
            <FilterBtn fKey="difficulty" val="all" label="All" />
            <FilterBtn fKey="difficulty" val="easy" label="Easy" />
            <FilterBtn fKey="difficulty" val="moderate" label="Moderate" />
            <FilterBtn fKey="difficulty" val="hard" label="Hard" />
            <div className="w-px h-5 bg-border mx-1" />
            <FilterBtn fKey="duration" val="all" label="All Lengths" />
            <FilterBtn fKey="duration" val="2-day" label="2-Day" />
            <FilterBtn fKey="duration" val="3-day" label="3-Day" />
            <FilterBtn fKey="duration" val="5-day" label="5-Day" />
          </div>
        </div>
      </section>

      {/* Retreat Cards */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-44 bg-secondary" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filtered.map((r, i) => {
                const spots = r.spots_remaining ?? r.capacity ?? 0;
                const price = r.full_price ?? 297;
                const deposit = r.deposit_amount ?? 100;
                const diffColor = DIFFICULTY_COLOR[r.difficulty] || DIFFICULTY_COLOR.Easy;
                const isFull = spots <= 0;

                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300 hover:-translate-y-1">

                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      {r.image_url ? (
                        <img src={r.image_url} alt={r.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <Trees className="w-12 h-12 text-muted-foreground/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                        {r.difficulty && (
                          <span className={`text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-sm ${diffColor}`}>
                            {r.difficulty}
                          </span>
                        )}
                        {r.duration && (
                          <span className="text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm">
                            {r.duration}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div>
                          <p className="font-heading text-lg uppercase text-white tracking-wider">{r.title}</p>
                          <p className="text-white/60 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{r.location_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-heading text-2xl text-white">${price}</span>
                          <p className="text-white/50 text-[10px]">${deposit} deposit</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-5 flex items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        {r.start_date && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {r.start_date.includes('T')
                                ? format(new Date(r.start_date), 'MMM d, yyyy')
                                : r.start_date}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-muted-foreground" />
                          {isFull ? (
                            <span className="text-xs font-heading text-yellow-500 tracking-wider">Waitlist Available</span>
                          ) : spots <= 3 ? (
                            <span className="text-xs font-heading text-red-400 tracking-wider">Only {spots} spots left</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">{spots} of {r.capacity} spots left</span>
                          )}
                        </div>
                      </div>

                      <Button asChild size="sm"
                        className="font-heading tracking-wider uppercase flex-shrink-0 text-xs"
                        style={{ background: FG }}>
                        <Link to="/retreat/apply">
                          {isFull ? 'Join Waitlist' : 'Apply Now'}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Trees className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-heading tracking-wider uppercase">No retreats match your filters</p>
              <button onClick={() => setFilters({ difficulty: 'all', duration: 'all' })}
                className="text-xs text-primary mt-2 hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-16 px-4">
        <div className="max-w-xl mx-auto text-center bg-card border border-border rounded-2xl p-8">
          <Trees className="w-10 h-10 mx-auto mb-3" style={{ color: FG }} />
          <h3 className="font-heading text-2xl tracking-wide uppercase mb-2">Not Sure Which Retreat?</h3>
          <p className="text-sm text-muted-foreground mb-5">
            The Weekend Reset is designed for first-timers. No experience needed — just show up.
          </p>
          <Button asChild className="font-heading tracking-wider uppercase" style={{ background: FG }}>
            <Link to="/how-it-works">See How It Works <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
