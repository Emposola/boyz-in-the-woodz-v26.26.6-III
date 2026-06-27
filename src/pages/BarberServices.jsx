import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Scissors, Sparkles, Crown, Star, Scissors as ScissorsIcon, ArrowRight, Clock, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const SERVICE_ICONS = {
  'Haircut': Scissors,
  'Beard Trim': ScissorsIcon,
  'Hot Towel Shave': Sparkles,
  "Kid's Cut": Star,
  'VIP Package': Crown,
};

const SERVICE_IMAGES = {
  'Haircut': 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80',
  'Beard Trim': 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80',
  'Hot Towel Shave': 'https://images.unsplash.com/photo-1585747861115-d7d2a6b8c2be?w=600&q=80',
  "Kid's Cut": 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=80',
  'VIP Package': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80',
};

const PERKS = [
  { icon: Shield, label: 'Hot Towel Finish', desc: 'Every standard cut includes a hot towel treatment.' },
  { icon: Users, label: 'Brotherhood Points', desc: 'Earn points on every service. Redeem for free cuts.' },
  { icon: Clock, label: 'No Wait Policy', desc: 'Your appointment time is your start time. Guaranteed.' },
];

export default function BarberServices() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-page'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').eq('active', true).order('price');
      return data || [];
    },
  });

  return (
    <div className="min-h-screen">
      <SEO title="Services & Pricing — The Men's Grooming Lodge" description="Premium men's grooming services in Little Rock. Haircuts, beard trims, hot towel shaves, and VIP packages." canonical="/barber/services" />

      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1400&q=80" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background" />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Scissors className="w-5 h-5" style={{ color: SAND }} />
              <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>The Men's Grooming Lodge</span>
            </div>
            <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mb-4 text-white">Services & Pricing</h1>
            <p className="text-white/60 text-sm max-w-md mx-auto">Every service is built around precision, relaxation, and brotherhood.</p>
          </motion.div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid sm:grid-cols-3 gap-3">
          {PERKS.map((p, i) => (
            <motion.div key={p.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${FG}22` }}>
                <p.icon className="w-5 h-5" style={{ color: FG }} />
              </div>
              <div>
                <p className="text-xs font-heading tracking-wider uppercase">{p.label}</p>
                <p className="text-[10px] text-muted-foreground">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services grid */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
                <div className="h-40 bg-secondary" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-secondary rounded w-2/3" />
                  <div className="h-3 bg-secondary rounded w-full" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))
          ) : (
            services.map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.name] || Scissors;
              const img = SERVICE_IMAGES[svc.name] || '';
              return (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`bg-card border rounded-xl overflow-hidden group hover:border-accent/50 transition-colors ${svc.featured ? 'border-accent' : 'border-border'}`}
                >
                  {img && (
                    <div className="h-40 overflow-hidden">
                      <img src={img} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: FG }} />
                        <h3 className="font-heading text-sm tracking-wider uppercase">{svc.name}</h3>
                      </div>
                      {svc.featured && (
                        <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{svc.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{svc.duration_minutes} min</span>
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />+{Math.round(svc.price * 10)} pts</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="font-heading text-2xl" style={{ color: FG }}>${svc.price}</span>
                      <Link to="/barber/book">
                        <Button size="sm" className="font-heading tracking-wider uppercase text-xs gap-1" style={{ background: FG }}>
                          Book Now <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-10 md:p-16">
          <Crown className="w-8 h-8 mx-auto mb-4" style={{ color: SAND }} />
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-3">Not Sure What You Need?</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Book a consultation. We'll assess your style and recommend the perfect cut or package.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/barber/book">
              <Button className="font-heading tracking-wider uppercase px-8 py-5 text-sm" style={{ background: FG }}>
                Book a Consultation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/barber/membership">
              <Button variant="outline" className="font-heading tracking-wider uppercase px-8 py-5 text-sm">
                View Membership
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
