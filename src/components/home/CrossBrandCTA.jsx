/* Retreat + Shop dual CTA — Boyz In The Woodz only */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CrossBrandCTA() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Shop CTA */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden group cursor-pointer h-64">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/images/unsplash/hiking-backpack.webp)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <ShoppingBag className="w-6 h-6 text-primary mb-2" />
              <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white">Survival Pack 01</h3>
              <p className="text-white/70 text-sm mt-1 mb-4">Gear forged in the forest. Worn as proof.</p>
              <Button asChild className="w-fit font-heading tracking-wider uppercase text-xs">
                <Link to="/shop/boyz">Shop Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
          </motion.div>

          {/* Retreat CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden group cursor-pointer h-64">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/images/unsplash/landscape-1.webp)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <Trees className="w-6 h-6 text-accent mb-2" />
              <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white">Apply for a Retreat</h3>
              <p className="text-white/70 text-sm mt-1 mb-4">3 days. No phones. All brotherhood. Limited spots.</p>
              <Button asChild className="w-fit bg-accent hover:bg-accent/90 text-accent-foreground font-heading tracking-wider uppercase text-xs">
                <Link to="/retreat/apply">Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}