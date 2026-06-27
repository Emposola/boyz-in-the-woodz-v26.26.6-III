import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Scissors, ArrowRight, Star, Clock, Shield, Award, Users, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const FEATURES = [
  { icon: Award, title: 'Master Barbers', desc: 'Years of craft. Every cut is intentional.' },
  { icon: Shield, title: 'The Code Standards', desc: 'Respect, quality, and brotherhood in every chair.' },
  { icon: Clock, title: 'Walk-ins Welcome', desc: 'Join the waitlist from your phone. No guessing.' },
  { icon: Star, title: 'Membership Perks', desc: 'Free cuts, priority booking, and exclusive drops.' },
];

export default function GroomingLodge() {
  const { data: services = [] } = useQuery({
    queryKey: ['services-lodge'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').eq('active', true).order('price');
      return data || [];
    },
  });

  return (
    <div className="min-h-screen">
      <SEO title="The Men's Grooming Lodge — BOYZ IN THE WOODZ" description="Premium men's grooming in a space built for brotherhood." canonical="/grooming-lodge" />

      <section className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background z-10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(45,90,39,0.2) 0%, transparent 70%)' }} />
        <div className="relative z-20 text-center max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Scissors className="w-5 h-5" style={{ color: SAND }} />
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>The Men's Grooming Lodge</span>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase mb-4 text-white">
            Where Men<br />Get <span style={{ color: FG }}>Sharp</span>
          </h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto mb-8">
            Not just a haircut. A reset. Hot towels, cold drinks, and conversation that matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/barber/book">
              <Button className="font-heading tracking-wider uppercase px-8 py-5 text-sm" style={{ background: FG }}>
                Book a Cut <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/barber/membership">
              <Button variant="outline" className="font-heading tracking-wider uppercase px-8 py-5 text-sm">
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: `${FG}22` }}>
                <f.icon className="w-6 h-6" style={{ color: FG }} />
              </div>
              <h3 className="font-heading text-sm tracking-wider uppercase mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-3">Services & Pricing</h2>
          <p className="text-muted-foreground text-sm">Premium grooming. Transparent pricing. No surprises.</p>
        </div>
        {services.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Loading services...</p>
        ) : (
          <div className="space-y-3">
            {services.map(s => (
              <div key={s.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading text-sm tracking-wider uppercase">{s.name}</h3>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>
                    {s.featured && <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full bg-yellow-900/40 text-yellow-400">Popular</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="font-heading text-xl" style={{ color: FG }}>${s.price}</span>
                  <Link to="/barber/book">
                    <Button size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
                      Book <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Gallery */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-3">The Lodge Experience</h2>
          <p className="text-muted-foreground text-sm">Step inside. Every detail is built for brotherhood.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80', alt: 'Precision haircut' },
            { src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80', alt: 'Beard trim' },
            { src: 'https://images.unsplash.com/photo-1585747861115-d7d2a6b8c2be?w=400&q=80', alt: 'Hot towel shave' },
            { src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80', alt: 'Interior' },
            { src: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&q=80', alt: 'Kid haircut' },
            { src: 'https://images.unsplash.com/photo-1596728325488-58c87691e9af?w=400&q=80', alt: 'Barber tools' },
            { src: 'https://images.unsplash.com/photo-1567894340315-735d7c361db7?w=400&q=80', alt: 'Barber chair' },
            { src: 'https://images.unsplash.com/photo-1634302086806-9e77b40037dc?w=400&q=80', alt: 'Products' },
          ].map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className={`overflow-hidden rounded-xl bg-secondary ${i === 0 ? 'row-span-2 col-span-2' : ''}`}>
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Loyalty strip */}
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${FG}22` }}>
            <Crown className="w-6 h-6" style={{ color: FG }} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-heading text-sm tracking-wider uppercase">Earn Brotherhood Points on Every Service</h3>
            <p className="text-xs text-muted-foreground mt-1">Every dollar spent = 10 points. Redeem for free cuts, exclusive merch, and retreat discounts.</p>
          </div>
          <Link to="/barber/membership">
            <Button variant="outline" size="sm" className="font-heading tracking-wider uppercase text-xs">Join Free</Button>
          </Link>
        </motion.div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-card border border-border rounded-2xl p-10 md:p-16">
          <Scissors className="w-8 h-8 mx-auto mb-4" style={{ color: SAND }} />
          <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mb-3">Ready for a Reset?</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            Walk in, sit down, and leave sharper than you arrived. The Lodge is open Tuesday through Saturday.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/barber/book">
              <Button className="font-heading tracking-wider uppercase px-8 py-5 text-sm" style={{ background: FG }}>
                Book Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/barber/walkin">
              <Button variant="outline" className="font-heading tracking-wider uppercase px-8 py-5 text-sm">
                Join Walk-in Waitlist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
