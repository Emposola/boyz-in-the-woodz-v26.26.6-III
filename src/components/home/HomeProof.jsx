/* ============================================================
   HOME PROOF — Social proof + Brotherhood numbers combined
   SEO: Targets "men's brotherhood community reviews",
   "wilderness retreat testimonials", "barbershop community"
   long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';

const REVIEWS = [
  { name: 'Marcus D.', text: 'Best investment in myself all year. The retreat rewired me.' },
  { name: 'James T.', text: 'Left feeling like a brand new man. The Code is real.' },
  { name: 'Dev P.', text: 'Walk in looking rough. Walk out feeling sharp. Every time.' },
  { name: 'Chris W.', text: 'My cortisol levels are actually down. Science doesn\'t lie.' },
  { name: 'Aaron B.', text: 'The brotherhood here is not just marketing. It\'s real.' },
  { name: 'Mike S.', text: 'Dre gave me the cleanest fade I\'ve ever had. I\'m a regular now.' },
];

const NUMBERS = [
  { value: '12,800+', label: 'Brothers Pledged' },
  { value: '23+', label: 'Retreats Held' },
  { value: '4,891', label: 'Proofs Shared' },
  { value: '12', label: 'Active Chapters' },
  { value: '89%', label: 'Feel Better After' },
  { value: '2.4M', label: 'Points Earned' },
];

export default function HomeProof() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4">
        {/* Reviews Marquee */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="text-center mb-8">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Social Proof</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Brothers Speak</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REVIEWS.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-4">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 text-accent fill-accent" />)}
                </div>
                <p className="text-xs text-muted-foreground italic leading-relaxed">"{r.text}"</p>
                <p className="text-xs font-medium mt-2">— {r.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Numbers Grid */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="text-center mb-8">
            <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Real Numbers</span>
            <h2 className="font-heading text-3xl md:text-4xl tracking-wide uppercase mt-2">Brotherhood By The Numbers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {NUMBERS.map((n, i) => (
              <motion.div key={n.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-card border border-border rounded-xl p-4 text-center">
                <div className="font-heading text-2xl md:text-3xl text-primary">{n.value}</div>
                <p className="text-[10px] text-muted-foreground mt-1 font-heading tracking-wider uppercase">{n.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
          <Link to="/brotherhood/directory"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs text-primary hover:text-primary/80 transition-colors">
            Join The Brotherhood <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
