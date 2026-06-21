/* ============================================================
   GEAR LOAN TRACKER — Inventory, requests, QR checkout
   ============================================================ */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Check, AlertCircle, Calendar, ArrowRight, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FOREST_GREEN = '#2D5A27';

const GEAR = [
  { id: 1, name: '4-Person Tent', qty: 8, available: 5, lastMaintained: 'May 2026', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=70' },
  { id: 2, name: 'Sleeping Bag (3-Season)', qty: 15, available: 9, lastMaintained: 'Apr 2026', img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&q=70' },
  { id: 3, name: 'Hiking Backpack (60L)', qty: 10, available: 7, lastMaintained: 'May 2026', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=70' },
  { id: 4, name: 'Camp Stove + Fuel', qty: 6, available: 4, lastMaintained: 'Jun 2026', img: 'https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?w=400&q=70' },
  { id: 5, name: 'Headlamp', qty: 20, available: 14, lastMaintained: 'Mar 2026', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70' },
  { id: 6, name: 'Fishing Rod & Tackle', qty: 8, available: 6, lastMaintained: 'May 2026', img: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=70' },
];

export default function GearLoan() {
  const [requested, setRequested] = useState([]);

  const toggle = (id) => setRequested(r => r.includes(id) ? r.filter(x => x !== id) : [...r, id]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${FOREST_GREEN} 0%, transparent 60%)` }} />
        <div className="relative max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-heading tracking-[0.3em] uppercase mb-3 block" style={{ color: '#D2B48C' }}>Brotherhood Gear</span>
            <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-foreground mb-3">
              Gear <span style={{ color: FOREST_GREEN }}>Loan</span>
            </h1>
            <p className="text-muted-foreground text-lg">Don't have gear? We got you. Borrow what you need for your retreat.</p>
          </motion.div>
        </div>
      </section>

      {/* QR Checkout Info */}
      <section className="py-4 bg-secondary/30 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-4 text-sm text-muted-foreground">
          <QrCode className="w-5 h-5 flex-shrink-0" style={{ color: FOREST_GREEN }} />
          <p>Gear checkout uses QR codes at pickup. Scan your code at the trailhead to check out gear. Return reminders sent 2 days before due date.</p>
        </div>
      </section>

      {/* Gear Grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {GEAR.map((g, i) => {
              const isReq = requested.includes(g.id);
              const avail = g.available > 0;
              return (
                <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 transition-all">
                  <div className="relative h-40 overflow-hidden">
                    <img src={g.img} alt={g.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs font-heading tracking-wider uppercase px-2.5 py-1 rounded-full ${avail ? 'bg-green-900/80 text-green-300' : 'bg-red-900/80 text-red-300'}`}>
                        {avail ? `${g.available} available` : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading text-base tracking-wider uppercase mb-1">{g.name}</h3>
                    <p className="text-xs text-muted-foreground mb-1">Total stock: {g.qty}</p>
                    <p className="text-xs text-muted-foreground mb-4">Last maintained: {g.lastMaintained}</p>
                    <Button
                      onClick={() => avail && toggle(g.id)}
                      disabled={!avail}
                      className="w-full font-heading tracking-wider uppercase text-xs"
                      variant={isReq ? 'secondary' : 'default'}
                      style={isReq ? {} : avail ? { background: FOREST_GREEN } : {}}
                    >
                      {isReq ? <><Check className="w-3.5 h-3.5 mr-1" /> Requested</> : 'Request for Retreat'}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {requested.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-card border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ borderColor: FOREST_GREEN }}>
              <div>
                <p className="font-heading text-base tracking-wider uppercase" style={{ color: FOREST_GREEN }}>
                  {requested.length} item{requested.length > 1 ? 's' : ''} in your gear request
                </p>
                <p className="text-sm text-muted-foreground">Gear is reserved when your retreat application is confirmed.</p>
              </div>
              <Button asChild className="font-heading tracking-wider uppercase flex-shrink-0" style={{ background: FOREST_GREEN }}>
                <Link to="/retreat/apply">Continue to Application <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}