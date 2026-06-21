/* ============================================================
   UPCOMING EVENTS — Retreats, Cut & Country, pop-ups
   Calendar view + list. One-click add to calendar.
   ============================================================ */
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { motion } from 'framer-motion';
import { CalendarDays, Trees, Scissors, MapPin, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

/* --- Fallback events --- */
const FALLBACK_EVENTS = [
  { id: 'e1', title: 'Broken Bow Fall Retreat', type: 'retreat', location_name: 'Broken Bow, OK', start_date: '2026-10-10T08:00:00', end_date: '2026-10-12T16:00:00', capacity: 12, spots_remaining: 4, price: 0, image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80', description: 'A 3-day wilderness reset. No phones, all brotherhood.' },
  { id: 'e2', title: 'Cut & Country Day — Austin', type: 'cut_and_country', location_name: 'The Chair Flagship, Austin TX', start_date: '2026-09-20T10:00:00', end_date: '2026-09-20T18:00:00', capacity: 50, spots_remaining: 22, price: 0, image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80', description: 'Country music, discounted cuts, and gear pop-up all day.' },
  { id: 'e3', title: 'Big Bend Winter Basecamp', type: 'retreat', location_name: 'Big Bend, TX', start_date: '2027-01-15T08:00:00', end_date: '2027-01-17T16:00:00', capacity: 10, spots_remaining: 2, price: 0, image_url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80', description: 'Desert stars and cold mornings. The most intense retreat.' },
  { id: 'e4', title: 'Gear Pop-Up — Dallas Deep Ellum', type: 'popup', location_name: 'Deep Ellum, Dallas TX', start_date: '2026-08-15T11:00:00', end_date: '2026-08-15T20:00:00', capacity: 200, spots_remaining: 150, price: 0, image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', description: 'Full Survival Pack 01 collection. Live music. Free merch raffle.' },
  { id: 'e5', title: 'Hill Country Spring Retreat', type: 'retreat', location_name: 'Wimberley, TX', start_date: '2027-04-05T08:00:00', end_date: '2027-04-07T16:00:00', capacity: 15, spots_remaining: 8, price: 0, image_url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&q=80', description: 'Wildflower season in the Hill Country. River swimming included.' },
];

const TYPE_CONFIG = {
  retreat:       { color: 'bg-green-900/30 text-green-400', label: 'Retreat', icon: Trees },
  cut_and_country: { color: 'bg-amber-900/30 text-amber-400', label: 'Cut & Country', icon: Scissors },
  popup:         { color: 'bg-primary/20 text-primary', label: 'Pop-Up', icon: MapPin },
  workshop:      { color: 'bg-blue-900/30 text-blue-400', label: 'Workshop', icon: CalendarDays },
};

function addToCalendar(event) {
  const start = new Date(event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(event.end_date || event.start_date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location_name || '')}`;
  window.open(url, '_blank');
}

export default function Events() {
  const [filter, setFilter] = useState('all');

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => api.entities.Event.filter({ active: true }, 'start_date', 20),
    initialData: [],
  });

  const displayEvents = events.length > 0 ? events : FALLBACK_EVENTS;
  const filtered = filter === 'all' ? displayEvents : displayEvents.filter(e => e.type === filter);

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <CalendarDays className="w-8 h-8 text-primary mx-auto mb-3" />
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Upcoming Events</h1>
          <p className="text-muted-foreground text-sm mt-2">Retreats, Cut & Country days, and gear pop-ups.</p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {['all', 'retreat', 'cut_and_country', 'popup'].map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase border transition-colors ${filter === t ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>
                {t === 'all' ? 'All Events' : t === 'cut_and_country' ? 'Cut & Country' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Events Grid --- */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event, i) => {
            const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.popup;
            const Icon = cfg.icon;
            const spotsLeft = event.spots_remaining ?? event.capacity;
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl overflow-hidden group">
                {event.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${cfg.color} border-0 text-[10px] gap-1`}><Icon className="w-3 h-3" />{cfg.label}</Badge>
                    {spotsLeft <= 5 && <span className="text-[10px] text-destructive font-heading">Only {spotsLeft} left!</span>}
                  </div>
                  <h3 className="font-heading text-lg tracking-wider uppercase">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {format(new Date(event.start_date), 'EEEE, MMM d')}
                    {event.end_date && event.end_date !== event.start_date && ` – ${format(new Date(event.end_date), 'MMM d')}`}
                  </p>
                  {event.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{event.description}</p>}
                  <div className="flex gap-2 mt-4">
                    {event.type === 'retreat' ? (
                      <Button asChild size="sm" className="flex-1 font-heading tracking-wider uppercase text-xs">
                        <Link to="/retreat/apply">Apply <ArrowRight className="w-3 h-3 ml-1" /></Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline" className="flex-1 font-heading tracking-wider uppercase text-xs">
                        <Link to={event.type === 'cut_and_country' ? '/barber/book' : '/shop/boyz'}>Learn More</Link>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => addToCalendar(event)}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}