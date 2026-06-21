/* ============================================================
   LOYALTY EXPLAINER — Brotherhood Points overview on homepage
   Shows earn/redeem mechanics with visual icons
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Coins, ShoppingBag, Gift, ArrowRight, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STEPS = [
  { icon: ShoppingBag, title: 'Shop Anywhere', desc: 'Buy gear or grooming products from either business.' },
  { icon: Coins, title: 'Earn 10pts / $1', desc: 'Every dollar spent earns Brotherhood Points automatically.' },
  { icon: Repeat, title: 'Stack & Redeem', desc: '500 points = $5 off any product or service.' },
  { icon: Gift, title: 'Bonus Drops', desc: 'Referrals, retreats, and reviews earn bonus points.' },
];

export default function LoyaltyExplainer() {
  return (
    <section className="py-16 md:py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Brotherhood Points</span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase mt-2">
            One Ecosystem. One Wallet.
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <step.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-lg tracking-wider uppercase">{step.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button asChild variant="outline" className="font-heading tracking-wider uppercase border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <Link to="/points">
              Explore Points <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}