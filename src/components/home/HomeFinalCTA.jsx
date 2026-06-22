/* ============================================================
   HOME FINAL CTA — "The Final Truth" closing statement
   SEO: Branded closing with strong emotional + conversion signal
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomeFinalCTA() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/images/unsplash/landscape-1.webp" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 opacity-15" style={{
          background: 'linear-gradient(270deg, hsl(82,60%,35%), hsl(28,70%,45%), hsl(82,60%,35%))',
          backgroundSize: '400% 100%',
          animation: 'gradient-x 8s ease infinite',
        }} />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {/* Values */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Experience-first', 'Brotherhood-first', 'Truth-first'].map((v, i) => (
              <motion.span key={v} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-heading tracking-widest uppercase text-primary">
                {v}
              </motion.span>
            ))}
          </div>

          <h2 className="font-heading text-4xl md:text-6xl tracking-wide uppercase text-white mb-4">
            Come Outside.<br />Reset.<br />Go Back <span className="text-primary">Stronger.</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-lg mx-auto italic">
            "You don't need to escape your life. You just need a place to breathe."
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-heading tracking-wider uppercase text-sm bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              <Link to="/retreat/apply">
                <Trees className="w-4 h-4 mr-2" /> Apply for Retreat
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-heading tracking-wider uppercase text-sm border-white/25 text-white hover:bg-white/10 px-8">
              <Link to="/shop/boyz">
                <ShoppingBag className="w-4 h-4 mr-2" /> Shop Survival Pack
              </Link>
            </Button>
          </div>

          <Link to="/about" className="inline-block mt-8 text-[10px] text-white/30 hover:text-primary font-heading tracking-widest uppercase transition-colors">
            Learn Our Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
