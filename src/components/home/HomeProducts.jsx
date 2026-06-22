/* ============================================================
   HOME PRODUCTS — Featured Survival Pack 01 + dual CTA
   SEO: Targets "men's outdoor clothing brand",
   "survival pack clothing", "brotherhood apparel"
   long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Trees, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeProducts() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Survival Pack 01</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">
            Proof You Were There
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-lg mx-auto">
            The clothing is not the product. The product is proof that the moment existed.
            Proof you're part of a community that makes you better.
          </p>
        </motion.div>

        {/* Dual CTA Cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Shop CTA */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden group h-72 md:h-80">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/images/unsplash/hiking-backpack.webp)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <ShoppingBag className="w-5 h-5 text-primary mb-2" />
              <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white">Shop The Woodz</h3>
              <p className="text-white/60 text-sm mt-1 mb-4">Hoodies, tees, caps, crewnecks — gear forged in the forest.</p>
              <Button asChild className="w-fit font-heading tracking-wider uppercase text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link to="/shop/boyz">Shop Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
              </Button>
            </div>
          </motion.div>

          {/* Barber CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden group h-72 md:h-80">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url(/images/unsplash/landscape-1.webp)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <Trees className="w-5 h-5 text-accent mb-2" />
              <h3 className="font-heading text-2xl md:text-3xl tracking-wide uppercase text-white">Apply For A Retreat</h3>
              <p className="text-white/60 text-sm mt-1 mb-4">2-5 days. No phones. All brotherhood. Limited spots.</p>
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
