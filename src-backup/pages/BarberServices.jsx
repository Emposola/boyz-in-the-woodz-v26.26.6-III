/* ============================================================
   BARBER SERVICES — List of 5 core services with pricing
   Haircut, Beard Trim, Hot Towel Shave, Kid's Cut, VIP Package
   ============================================================ */
import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/* --- Service data (static until Phase 2 booking) --- */
const SERVICES = [
  { name: 'Haircut', price: 35, duration: 45, desc: 'Precision cut tailored to your face shape. Includes hot towel finish and styling.' },
  { name: 'Beard Trim', price: 20, duration: 20, desc: 'Line up, shape, and condition. Your beard, but better.' },
  { name: 'Hot Towel Shave', price: 45, duration: 40, desc: 'Old-school straight razor shave with hot towels and essential oils.' },
  { name: "Kid's Cut", price: 25, duration: 30, desc: 'Patient, fun, and clean. First haircut certificates available.' },
  { name: 'VIP Package', price: 80, duration: 90, desc: 'The full experience: haircut, hot towel shave, shoulder massage, and a cold drink.', featured: true },
];

export default function BarberServices() {
  return (
    <div className="min-h-screen">
      {/* --- Hero --- */}
      <section
        className="relative h-64 md:h-80 flex items-end bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1400&q=80)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 pb-8 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Scissors className="w-5 h-5 text-accent" />
            <span className="text-xs font-heading tracking-[0.3em] text-accent uppercase">The Chair</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Services</h1>
        </div>
      </section>

      {/* --- Services List --- */}
      <section className="max-w-3xl mx-auto px-4 py-12 space-y-4">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`bg-card border rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4 ${service.featured ? 'border-accent' : 'border-border'}`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-xl tracking-wider uppercase">{service.name}</h3>
                {service.featured && (
                  <span className="bg-accent/20 text-accent text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{service.desc}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} min</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-heading text-2xl">${service.price}</span>
              <Button variant="outline" className="font-heading tracking-wider uppercase text-xs border-accent text-accent hover:bg-accent hover:text-accent-foreground" asChild>
                <Link to="/barber/walkin">
                  Book <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
}