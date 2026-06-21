/* ============================================================
   BADGES PAGE — /dashboard/badges
   ============================================================ */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Users, PenLine, Heart, Flame } from 'lucide-react';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const BROWN = '#5C4033';

const ALL_BADGES = [
  { id: 1, name: 'The Initiate', desc: 'Take the pledge', icon: '🌿', earned: true, points: 0, category: 'Pledge', color: FG },
  { id: 2, name: 'The Wanderer', desc: 'Attend 1 retreat', icon: '🏕️', earned: true, points: 500, category: 'Retreats', color: FG },
  { id: 3, name: 'The Trailblazer', desc: 'Attend 3 retreats', icon: '🥾', earned: false, points: 750, category: 'Retreats', color: '#8B6914' },
  { id: 4, name: 'The Firekeeper', desc: 'Attend 5 retreats', icon: '🔥', earned: false, points: 1000, category: 'Retreats', color: '#8B6914' },
  { id: 5, name: 'The Storyteller', desc: 'Upload 10 proofs', icon: '📸', earned: true, points: 200, category: 'Proofs', color: FG },
  { id: 6, name: 'The Chronicler', desc: 'Upload 50 proofs', icon: '📚', earned: false, points: 500, category: 'Proofs', color: BROWN },
  { id: 7, name: 'The Connector', desc: 'Refer 5 brothers', icon: '🤝', earned: false, points: 500, category: 'Community', color: FG },
  { id: 8, name: 'The Ambassador', desc: 'Refer 20 brothers', icon: '🌐', earned: false, points: 1500, category: 'Community', color: '#8B6914' },
  { id: 9, name: 'The Chapter Founder', desc: 'Start a chapter', icon: '🏡', earned: false, points: 2000, category: 'Leadership', color: BROWN },
  { id: 10, name: 'The Chapter Leader', desc: 'Lead a chapter for 6 months', icon: '👑', earned: false, points: 3000, category: 'Leadership', color: '#8B6914' },
  { id: 11, name: 'The Scribe', desc: 'Submit an approved blog post', icon: '✍️', earned: false, points: 500, category: 'Content', color: FG },
  { id: 12, name: 'The Poet', desc: 'Write an approved letter', icon: '📜', earned: false, points: 500, category: 'Content', color: FG },
  { id: 13, name: 'The Listener', desc: 'Attend 10 virtual campfires', icon: '🎧', earned: false, points: 300, category: 'Community', color: BROWN },
  { id: 14, name: 'The Supporter', desc: 'Send 20 anonymous supports on confessions', icon: '💚', earned: false, points: 200, category: 'Community', color: FG },
  { id: 15, name: 'The Legend', desc: 'Complete all other badges', icon: '⭐', earned: false, points: 5000, category: 'Secret', color: '#8B6914', secret: true },
  { id: 16, name: 'The Steadfast', desc: 'Active for 52 consecutive weeks', icon: '🌲', earned: false, points: 500, category: 'Streak', color: FG },
  { id: 17, name: 'The Guest Author', desc: 'First blog post approved', icon: '📝', earned: false, points: 500, category: 'Content', color: FG },
  { id: 18, name: 'Challenge Champion', desc: 'Complete a monthly challenge', icon: '🏆', earned: false, points: 300, category: 'Challenges', color: '#8B6914' },
];

const CATEGORIES = ['All', 'Pledge', 'Retreats', 'Proofs', 'Community', 'Leadership', 'Content', 'Streak', 'Challenges', 'Secret'];

export default function BadgesPage() {
  const [cat, setCat] = useState('All');
  const [hover, setHover] = useState(null);

  const filtered = cat === 'All' ? ALL_BADGES : ALL_BADGES.filter(b => b.category === cat);
  const earned = ALL_BADGES.filter(b => b.earned).length;

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Your Journey</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Brotherhood Badges</h1>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="font-heading text-3xl" style={{ color: FG }}>{earned}</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Earned</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-foreground">{ALL_BADGES.length - earned}</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Remaining</p>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span><span>{Math.round((earned / ALL_BADGES.length) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${(earned / ALL_BADGES.length) * 100}%`, background: FG }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-heading tracking-wider uppercase transition-all ${cat === c ? 'text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              style={cat === c ? { background: FG } : {}}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((badge, i) => (
            <motion.div key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              onHoverStart={() => setHover(badge.id)} onHoverEnd={() => setHover(null)}
              className={`relative bg-card border rounded-2xl p-5 text-center transition-all cursor-pointer ${badge.earned ? 'border-primary/40 hover:border-primary/70' : 'border-border hover:border-border/80'} ${!badge.earned ? 'opacity-60' : ''}`}>
              {badge.secret && !badge.earned && (
                <div className="absolute inset-0 bg-card/90 rounded-2xl flex items-center justify-center flex-col gap-2">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                  <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">Secret Badge</span>
                </div>
              )}
              <div className="text-4xl mb-3">{badge.icon}</div>
              <h3 className="font-heading text-xs tracking-[0.15em] uppercase leading-tight mb-1">{badge.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-2">{badge.desc}</p>
              {badge.earned ? (
                <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white" style={{ background: FG }}>Earned ✓</span>
              ) : (
                <span className="text-[10px] text-muted-foreground">+{badge.points} pts</span>
              )}
              {hover === badge.id && badge.earned && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground whitespace-nowrap shadow-xl z-10">
                  {badge.category} · +{badge.points} pts
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}