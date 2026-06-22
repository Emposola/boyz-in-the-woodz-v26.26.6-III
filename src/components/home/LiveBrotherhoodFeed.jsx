/* ============================================================
   LIVE BROTHERHOOD FEED — Homepage Section
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Radio } from 'lucide-react';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const FEED_ITEMS = [
  { avatar: 'MT', name: 'Marcus', city: 'Houston', action: 'just took the pledge', detail: 'brother #12,847', time: '2 min ago', color: FG },
  { avatar: 'JW', name: 'James', city: 'Chicago', action: 'uploaded a proof from', detail: 'Broken Bow Retreat', time: '5 min ago', color: '#5C4033' },
  { avatar: 'DR', name: 'David', city: 'Atlanta', action: 'earned the', detail: '"Trailblazer" badge', time: '8 min ago', color: '#8B6914' },
  { avatar: 'AL', name: 'Andre', city: 'Dallas', action: 'just booked', detail: 'Deep Dive Retreat — 3 spots remaining', time: '11 min ago', color: FG },
  { avatar: 'KH', name: 'Kevin', city: 'Memphis', action: 'shared a letter:', detail: '"Dear Dad, I Finally Get It"', time: '14 min ago', color: '#5C4033' },
  { avatar: 'TM', name: 'Troy', city: 'Nashville', action: 'completed the', detail: 'June Challenge', time: '18 min ago', color: '#8B6914' },
  { avatar: 'RB', name: 'Rico', city: 'Miami', action: 'just took the pledge', detail: 'brother #12,848', time: '21 min ago', color: FG },
  { avatar: 'DK', name: 'Damon', city: 'Detroit', action: 'The Houston Chapter', detail: 'just held a meetup with 14 brothers', time: '25 min ago', color: '#5C4033' },
];

export default function LiveBrotherhoodFeed() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx(i => (i + 1) % FEED_ITEMS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const item = FEED_ITEMS[activeIdx];

  return (
    <section className="py-12 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <Radio className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <h2 className="font-heading text-xl tracking-wider uppercase">Live Brotherhood Feed</h2>
              <p className="text-xs text-muted-foreground">What's happening right now</p>
            </div>
          </div>
          <Link to="/activity" className="text-xs font-heading tracking-wider uppercase text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Featured rotating item */}
          <div className="bg-card border border-border rounded-2xl p-5 min-h-[100px] flex items-center">
            <AnimatePresence mode="wait">
              {visible && (
                <motion.div key={activeIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }} className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-heading text-sm flex-shrink-0" style={{ background: item.color }}>
                    {item.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <strong>{item.name}</strong> from {item.city} {item.action}{' '}
                      <span style={{ color: item.color }}>{item.detail}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Static recent items */}
          <div className="space-y-2">
            {FEED_ITEMS.slice(1, 4).map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-heading text-[11px] flex-shrink-0" style={{ background: f.color }}>
                  {f.avatar}
                </div>
                <p className="text-xs text-foreground flex-1 line-clamp-1">
                  <strong>{f.name}</strong> {f.action} <span className="text-muted-foreground">{f.detail}</span>
                </p>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{f.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {FEED_ITEMS.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{ background: i === activeIdx ? FG : 'rgba(255,255,255,0.2)' }} />
          ))}
        </div>
      </div>
    </section>
  );
}