/* ============================================================
   BARBER PROFILE — Individual barber detail page
   Schedule, reviews, wilderness badge, booking button
   /barber/profile/:id
   ============================================================ */
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/supabaseClient';
import { Scissors, Star, Shield, Trees, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

function StarRating({ rating, max = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < Math.round(rating) ? 'text-accent fill-accent' : 'text-border'}`} />
      ))}
    </div>
  );
}

export default function BarberProfile() {
  const { id } = useParams();

  const { data: barbers, isLoading } = useQuery({
    queryKey: ['barber', id],
    queryFn: () => api.entities.Barber.filter({ id }),
    enabled: !!id,
    initialData: [],
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => api.entities.BarberReview.filter({ barber_id: id, approved: true }, '-created_date', 20),
    enabled: !!id,
    initialData: [],
  });

  const barber = barbers[0];
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  if (isLoading) return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-4">
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  if (!barber) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="font-heading text-3xl">Barber Not Found</h2>
      <Link to="/barber/team" className="text-primary text-sm mt-4">View All Barbers</Link>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* --- Hero Profile --- */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
            {barber.image_url && <img src={barber.image_url} alt={barber.name} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-4xl tracking-wide uppercase">{barber.name}</h1>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={avgRating} />
                <span className="text-sm text-muted-foreground">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {barber.specialties?.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
              {barber.first_aid_certified && <Badge className="bg-red-900/30 text-red-400 text-xs gap-1"><Shield className="w-3 h-3" /> First Aid</Badge>}
              {barber.wilderness_certified && <Badge className="bg-green-900/30 text-green-400 text-xs gap-1"><Trees className="w-3 h-3" /> Wilderness Guide</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{barber.bio}</p>
            <Button asChild className="mt-4 font-heading tracking-wider uppercase">
              <Link to={`/barber/book?barber=${barber.id}`}>
                <Calendar className="w-4 h-4 mr-2" /> Book with {barber.name.split(' ')[0]}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- Reviews --- */}
      <section className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <h2 className="font-heading text-xl tracking-wider uppercase mb-4">Client Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, i) => (
              <motion.div key={review.id} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{review.user_name || 'Anonymous'}</span>
                  <StarRating rating={review.rating} />
                </div>
                {review.comment && <p className="text-xs text-muted-foreground">{review.comment}</p>}
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}