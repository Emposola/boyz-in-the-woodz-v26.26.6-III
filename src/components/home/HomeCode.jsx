/* ============================================================
   HOME CODE — The 5 non-negotiables (compact visual)
   SEO: Targets "men's code of conduct", "brotherhood rules",
   "wilderness retreat code" long-tail keywords
   ============================================================ */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Smartphone, Footprints, Heart, Eye, ArrowUp, ArrowRight, Shield } from 'lucide-react';

const RULES = [
  { icon: Smartphone, num: '01', title: 'No Phones', desc: 'Full presence only' },
  { icon: Footprints, num: '02', title: 'Show Up', desc: 'Body and mind' },
  { icon: Heart, num: '03', title: 'Respect', desc: 'Everyone, always' },
  { icon: Eye, num: '04', title: 'No Ego', desc: 'Leave it at the gate' },
  { icon: ArrowUp, num: '05', title: 'Leave Better', desc: 'Or don\'t come' },
];

export default function HomeCode() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <Shield className="w-7 h-7 text-primary mx-auto mb-3" />
          <span className="text-xs font-heading tracking-[0.3em] text-primary uppercase">Non-Negotiable</span>
          <h2 className="font-heading text-3xl md:text-5xl tracking-wide uppercase mt-2">The Code</h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-md mx-auto">
            Five rules. Zero compromises. Follow the code → create trust → build safety → brotherhood grows.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {RULES.map((r, i) => (
            <motion.div key={r.num} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors group">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <r.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-heading text-2xl text-border block mb-1">{r.num}</span>
              <h3 className="font-heading text-sm tracking-wider uppercase">{r.title}</h3>
              <p className="text-[10px] text-muted-foreground mt-1">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
          <Link to="/the-code"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-heading tracking-wider uppercase text-xs text-primary hover:text-primary/80 transition-colors">
            Read The Code <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
