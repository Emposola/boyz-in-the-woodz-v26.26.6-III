/* ============================================================
   BARBER TEAM — 3-4 barber profiles with photos, bios, badges
   "First-aid certified" badge for retreat facilitators
   ============================================================ */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { motion } from 'framer-motion';
import { Scissors, Shield, Trees, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

/* --- Fallback barber data (shown when DB is empty) --- */
const COLORS = ['#2D5A27', '#5C4033', '#4A6741'];
const FALLBACK_BARBERS = [
  { id: 'f1', name: 'Marcus "Steady" Cole', bio: 'Master barber with 12 years behind the chair. Specializes in fades and beard sculpting. Also a trained wilderness EMT.', specialties: ['Fades', 'Beard Sculpting'], image_url: '/images/logos/team-photo.png', first_aid_certified: true, wilderness_certified: true },
  { id: 'f2', name: 'Dre Washington', bio: 'Known for razor-sharp lineups and patience with kids. Dre brings energy to every chair session.', specialties: ['Lineups', "Kids' Cuts"], image_url: '/images/logos/team-photo.png', first_aid_certified: false, wilderness_certified: false },
  { id: 'f3', name: 'Tomás Rivera', bio: 'Hot towel shave specialist who trained in traditional barbering. Retreat facilitator on weekends.', specialties: ['Hot Towel Shave', 'Classic Cuts'], image_url: '/images/logos/team-photo.png', first_aid_certified: true, wilderness_certified: true },
];

function BarberImg({ src, name, index = 0 }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = COLORS[index % COLORS.length];
  return (
    <div className="w-full h-full relative overflow-hidden" style={{ background: bgColor }}>
      <img src={src} alt={name} className="w-full h-full object-cover opacity-0 transition-opacity duration-300" onLoad={e => e.target.classList.remove('opacity-0')} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none" style={{ zIndex: -1 }}>
        <span className="text-4xl font-heading tracking-wider uppercase text-white/80">{initials}</span>
      </div>
    </div>
  );
}

export default function BarberTeam() {
  /* --- Fetch barbers from DB --- */
  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => api.entities.Barber.filter({ active: true }),
    initialData: [],
  });

  const displayBarbers = barbers.length > 0
    ? barbers.map((b, i) => ({ ...FALLBACK_BARBERS[i % FALLBACK_BARBERS.length], ...b, image_url: b.image_url || FALLBACK_BARBERS[i % FALLBACK_BARBERS.length].image_url }))
    : FALLBACK_BARBERS;

  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section className="py-20 md:py-28 bg-secondary/30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <Scissors className="w-8 h-8 text-accent mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Our Team</h1>
          <p className="text-muted-foreground text-sm mt-3">Barbers who cut hair. Guides who build men.</p>
        </motion.div>
      </section>

      {/* --- Team Grid --- */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[3/4] rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))
        ) : (
          displayBarbers.map((barber, i) => (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Photo */}
              <div className="aspect-[3/4] bg-secondary overflow-hidden">
                <BarberImg src={barber.image_url} name={barber.name} index={i} />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-heading text-lg tracking-wider uppercase">{barber.name}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{barber.bio}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {barber.specialties?.map(s => (
                    <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                  {barber.first_aid_certified && (
                    <Badge className="bg-red-900/30 text-red-400 text-[10px] gap-1">
                      <Shield className="w-2.5 h-2.5" /> First Aid
                    </Badge>
                  )}
                  {barber.wilderness_certified && (
                    <Badge className="bg-green-900/30 text-green-400 text-[10px] gap-1">
                      <Trees className="w-2.5 h-2.5" /> Wilderness Guide
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </section>
    </div>
  );
}