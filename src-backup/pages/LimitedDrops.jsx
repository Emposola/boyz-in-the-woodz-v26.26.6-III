/* ============================================================
   LIMITED DROPS — /shop/limited-edition
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bell, ArrowRight, Flame, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cartContext';
import { toast } from 'sonner';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const ACTIVE_DROPS = [
  { id: 'ld1', name: 'Wilderness Collection Hoodie', color: 'Forest Floor', price: 79, stock: 23, maxStock: 100, img: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80', badge: 'Drop 03', earlyAccess: false },
  { id: 'ld2', name: 'Trail Blazer Tee', color: 'Washed Charcoal', price: 42, stock: 47, maxStock: 150, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80', badge: 'Drop 03', earlyAccess: false },
];

const UPCOMING_IMG = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80';

const PAST_DROPS = [
  { name: 'Broken Bow Hoodie', drop: 'Drop 02', img: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&q=75', soldOut: true },
  { name: 'Fire Ceremony Tee', drop: 'Drop 02', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=75', soldOut: true },
  { name: 'Expedition Jacket', drop: 'Drop 01', img: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=75', soldOut: true },
  { name: 'Summit Cap', drop: 'Drop 01', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=75', soldOut: true },
];

export default function LimitedDrops() {
  const [countdown, setCountdown] = useState({ d: 6, h: 12, m: 33, s: 0 });
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notified, setNotified] = useState(false);
  const [userPoints] = useState(3200); // simulated
  const earlyAccessUnlocked = userPoints >= 5000;
  const { addItem } = useCart();

  useEffect(() => {
    const t = setInterval(() => {
      setCountdown(c => {
        let { d, h, m, s } = c;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; d--; }
        return { d: Math.max(0, d), h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=85" alt="Limited Drops" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/40" />
        </div>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-5xl mx-auto px-4 pb-12 w-full">
          <div className="flex items-center gap-2 mb-3"><Flame className="w-4 h-4 text-orange-400" /><span className="text-xs font-heading tracking-[0.3em] uppercase text-orange-400">Limited Edition</span></div>
          <h1 className="font-heading text-5xl md:text-7xl tracking-wide uppercase text-white leading-none">Wilderness<br /><span className="text-primary">Collection</span></h1>
          <p className="text-white/60 mt-3">Drop 03 — While supplies last.</p>
        </motion.div>
      </section>

      {/* Countdown */}
      <div className="border-b border-border" style={{ background: 'rgba(45,90,39,0.05)' }}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground">Next Drop — Drop 04</p>
            <p className="text-sm text-foreground">Summer Edition · Drops July 1st</p>
          </div>
          <div className="flex items-center gap-4">
            {[['D', countdown.d], ['H', countdown.h], ['M', countdown.m], ['S', countdown.s]].map(([l, v]) => (
              <div key={l} className="text-center">
                <div className="font-heading text-3xl text-foreground">{String(v).padStart(2, '0')}</div>
                <div className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Active Drop Items */}
        <div className="mb-14">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Available Now</span>
          <h2 className="font-heading text-3xl tracking-wide uppercase mb-6">Drop 03 — Active</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {ACTIVE_DROPS.map(item => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl overflow-hidden group">
                <div className="relative h-64 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-heading tracking-wider uppercase px-2.5 py-1 rounded-full text-white" style={{ background: SAND, color: '#1a1a1a' }}>{item.badge}</span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex justify-between text-[10px] text-white/70 mb-1">
                      <span>Stock</span><span>{item.stock} / {item.maxStock} left</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-orange-400" style={{ width: `${(item.stock / item.maxStock) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{item.color}</p>
                  <h3 className="font-heading text-base tracking-wider uppercase">{item.name}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-heading text-xl">${item.price}</span>
                    <Button onClick={() => { addItem({ id: item.id, name: item.name, price: item.price, image_url: item.img, business: 'boyz' }); toast.success('Added to cart!'); }}
                      size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming — Teaser */}
        <div className="mb-14">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Coming Soon</span>
          <h2 className="font-heading text-3xl tracking-wide uppercase mb-6">Drop 04 — Summer Edition</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-secondary">
                <img src={UPCOMING_IMG} alt="Upcoming" className="w-full h-full object-cover filter blur-md scale-110" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-2">
                  <Lock className="w-8 h-8 text-white/50" />
                  <p className="text-xs font-heading tracking-[0.2em] uppercase text-white/60">Drops July 1st</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notify */}
          <div className="mt-6 bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4">
            <Bell className="w-6 h-6 flex-shrink-0" style={{ color: FG }} />
            <p className="text-sm text-muted-foreground flex-1">Get notified the moment Drop 04 goes live.</p>
            {notified ? (
              <span className="text-sm font-heading tracking-wider uppercase" style={{ color: FG }}><Check className="w-4 h-4 inline mr-1" />You're on the list</span>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setNotified(true); }} className="flex gap-2 w-full sm:w-auto">
                <Input type="email" placeholder="your@email.com" value={notifyEmail} onChange={e => setNotifyEmail(e.target.value)} required className="bg-secondary border-border text-sm sm:w-52" />
                <Button type="submit" size="sm" className="font-heading tracking-wider uppercase flex-shrink-0" style={{ background: FG }}>Notify Me</Button>
              </form>
            )}
          </div>
        </div>

        {/* Early Access */}
        <div className="bg-card border rounded-2xl p-6 mb-14" style={{ borderColor: earlyAccessUnlocked ? `${SAND}60` : '#36454F40' }}>
          <div className="flex items-start gap-4">
            {earlyAccessUnlocked ? <Check className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: FG }} /> : <Lock className="w-6 h-6 flex-shrink-0 mt-0.5 text-muted-foreground" />}
            <div>
              <h3 className="font-heading text-base tracking-wider uppercase mb-1" style={earlyAccessUnlocked ? { color: FG } : {}}>
                {earlyAccessUnlocked ? 'Early Access — Unlocked' : 'Early Access — Locked'}
              </h3>
              <p className="text-sm text-muted-foreground">Members with 5,000+ points get access 24 hours before public launch. You have <strong className="text-foreground">{userPoints.toLocaleString()}</strong> points. {!earlyAccessUnlocked && `Need ${(5000 - userPoints).toLocaleString()} more.`}</p>
            </div>
          </div>
        </div>

        {/* Past Drops */}
        <div>
          <h2 className="font-heading text-2xl tracking-wide uppercase mb-6">Past Drops — Sold Out</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PAST_DROPS.map((item, i) => (
              <div key={i} className="relative rounded-xl overflow-hidden aspect-square opacity-60">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale" />
                <div className="absolute inset-0 bg-black/50 flex items-end p-3">
                  <div>
                    <p className="text-[9px] font-heading tracking-wider uppercase text-white/60">{item.drop}</p>
                    <p className="text-xs text-white font-heading uppercase tracking-wide">{item.name}</p>
                    <p className="text-[9px] text-red-400 font-heading uppercase tracking-wider mt-0.5">Sold Out</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}