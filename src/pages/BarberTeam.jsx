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
const FALLBACK_BARBERS = [
  { id: 'f1', name: 'Marcus "Steady" Cole', bio: 'Master barber with 12 years behind the chair. Specializes in fades and beard sculpting. Also a trained wilderness EMT.', specialties: ['Fades', 'Beard Sculpting'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', first_aid_certified: true, wilderness_certified: true },
  { id: 'f2', name: 'Dre Washington', bio: 'Known for razor-sharp lineups and patience with kids. Dre brings energy to every chair session.', specialties: ['Lineups', "Kids' Cuts"], image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', first_aid_certified: false, wilderness_certified: false },
  { id: 'f3', name: 'Tomás Rivera', bio: 'Hot towel shave specialist who trained in traditional barbering. Retreat facilitator on weekends.', specialties: ['Hot Towel Shave', 'Classic Cuts'], image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', first_aid_certified: true, wilderness_certified: true },
];

export default function BarberTeam() {
  /* --- Fetch barbers from DB --- */
  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => api.entities.Barber.filter({ active: true }),
    initialData: [],
  });

  const displayBarbers = barbers.length > 0 ? barbers : FALLBACK_BARBERS;

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
                {barber.image_url ? (
                  <img src={barber.image_url} alt={barber.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Scissors className="w-12 h-12 opacity-20" />
                  </div>
                )}
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