/* Upcoming events preview strip on homepage */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Trees, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const FALLBACK = [
  { id: '1', title: 'Broken Bow Fall Retreat', type: 'retreat', location_name: 'Broken Bow, OK', start_date: '2026-10-10', spots_remaining: 4 },
  { id: '2', title: 'Cut & Country Day — Austin', type: 'cut_and_country', location_name: 'Austin, TX', start_date: '2026-09-20', spots_remaining: 22 },
  { id: '3', title: 'Big Bend Winter Basecamp', type: 'retreat', location_name: 'Big Bend, TX', start_date: '2027-01-15', spots_remaining: 2 },
];

export default function UpcomingEventsStrip() {
  const { data: events } = useQuery({
    queryKey: ['home-events'],
    queryFn: () => base44.entities.Event.filter({ active: true }, 'start_date', 3),
    initialData: [],
  });
  const display = events.length > 0 ? events.slice(0, 3) : FALLBACK;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Coming Up</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-1">Upcoming Events</h2>
          </div>
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs hidden md:flex">
            <Link to="/events">View All <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {display.map((ev, i) => (
            <motion.div key={ev.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors group">
              <div className="flex items-center gap-2 mb-3">
                {ev.type === 'retreat' ? <Trees className="w-4 h-4 text-primary" /> : <Scissors className="w-4 h-4 text-accent" />}
                <span className={`text-[10px] font-heading tracking-wider uppercase ${ev.type === 'retreat' ? 'text-primary' : 'text-accent'}`}>
                  {ev.type === 'cut_and_country' ? 'Cut & Country' : ev.type}
                </span>
              </div>
              <h3 className="font-heading text-base tracking-wide uppercase group-hover:text-primary transition-colors">{ev.title}</h3>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" /> {ev.location_name}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {ev.start_date ? format(new Date(ev.start_date), 'MMM d, yyyy') : ''}
              </div>
              {ev.spots_remaining <= 5 && (
                <p className="text-xs text-destructive mt-2 font-medium">Only {ev.spots_remaining} spots left!</p>
              )}
              <Link to={ev.type === 'retreat' ? '/retreat/apply' : '/events'}
                className="mt-3 text-xs text-primary font-heading tracking-wider uppercase flex items-center gap-1 hover:gap-2 transition-all">
                {ev.type === 'retreat' ? 'Apply Now' : 'Learn More'} <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6 md:hidden">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase text-xs">
            <Link to="/events">View All Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}