/* ============================================================
   LOYALTY / BROTHERHOOD POINTS — How to earn, calculator slider
   $1 = 10pts, 500pts = $5. Dynamic calculator.
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Coins, ShoppingBag, Users, Award, Gift, Calculator } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import SEO from '@/components/shared/SEO';

/* --- Ways to earn --- */
const EARN_METHODS = [
  { icon: ShoppingBag, title: 'Purchase', desc: 'Earn 10 pts per $1 spent on any product or service.' },
  { icon: Users, title: 'Referral', desc: 'Refer a friend — both earn 200 bonus points.' },
  { icon: Award, title: 'Signup Bonus', desc: 'Get 100 points just for creating your account.' },
  { icon: Gift, title: 'Retreat Survey', desc: 'Complete a post-retreat survey for 100 bonus points.' },
];

export default function Points() {
  const [spendAmount, setSpendAmount] = useState([50]);
  const pointsEarned = spendAmount[0] * 10;
  const dollarValue = (pointsEarned / 500) * 5;

  return (
    <div className="min-h-screen">
      <SEO title="Brotherhood Points — BOYZ IN THE WOODZ" description="Track and earn Brotherhood Points. Proof of nature builds your reputation." canonical="/points" />
      {/* --- Hero --- */}
      <section className="py-20 md:py-28 bg-secondary/30 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto px-4">
          <Coins className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-heading text-4xl md:text-6xl tracking-wide uppercase">Brotherhood Points</h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            One wallet. Two businesses. Every dollar earned at The Woodz or The Chair 
            builds your balance. Redeem anywhere.
          </p>
        </motion.div>
      </section>

      {/* --- How to Earn --- */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="font-heading text-2xl tracking-wider uppercase text-center mb-10">How To Earn</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {EARN_METHODS.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-lg p-6 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <m.icon className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base tracking-wider uppercase">{m.title}</h3>
              <p className="text-xs text-muted-foreground mt-2">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Points Calculator --- */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-lg p-8"
        >
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Calculator className="w-5 h-5 text-primary" />
            <h3 className="font-heading text-xl tracking-wider uppercase">Points Calculator</h3>
          </div>

          {/* Spend Slider */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spend Amount</span>
              <span className="font-heading text-2xl">${spendAmount[0]}</span>
            </div>
            <Slider
              value={spendAmount}
              onValueChange={setSpendAmount}
              min={1}
              max={500}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$1</span>
              <span>$500</span>
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="font-heading text-3xl text-primary">{pointsEarned.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Points Earned</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <div className="font-heading text-3xl text-accent">${dollarValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Reward Value</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            500 points = $5 off any product or service. Points never expire.
          </p>
        </motion.div>
      </section>
    </div>
  );
}