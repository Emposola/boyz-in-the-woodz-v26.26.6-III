import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Trophy, Users, PenLine, Heart, Flame } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const ICON_MAP = {
  'footprints': '🌿',
  'zap': '⚡',
  'tree-pine': '🏕️',
  'shield': '🛡️',
  'book-open': '📖',
  'shopping-bag': '🛍️',
  'users': '🤝',
  'trophy': '🏆',
  'flame': '🔥',
  'crown': '👑',
};

export default function BadgesPage() {
  const { user, isAuthenticated } = useAuth();
  const [badges, setBadges] = useState([]);
  const [earnedIds, setEarnedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    supabase.from('badges').select('*').eq('active', true).then(({ data }) => {
      if (data) setBadges(data);
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      supabase.from('user_badges').select('badge_id').eq('user_id', user.id).then(({ data }) => {
        if (data) setEarnedIds(new Set(data.map(b => b.badge_id)));
      });
    }
    setLoading(false);
  }, [isAuthenticated, user]);

  const CATEGORIES = ['All', ...new Set(badges.map(b => b.category))];

  const filtered = cat === 'All' ? badges : badges.filter(b => b.category === cat);
  const earnedCount = badges.filter(b => earnedIds.has(b.id)).length;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Badges — BOYZ IN THE WOODZ" description="Collect badges as you progress through the brotherhood." canonical="/badges" />
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Your Journey</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Brotherhood Badges</h1>
          <div className="flex items-center gap-6 mt-4">
            <div>
              <p className="font-heading text-3xl" style={{ color: FG }}>{earnedCount}</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Earned</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-foreground">{badges.length - earnedCount}</p>
              <p className="text-xs text-muted-foreground font-heading tracking-wider uppercase">Remaining</p>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span><span>{badges.length ? Math.round((earnedCount / badges.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${badges.length ? (earnedCount / badges.length) * 100 : 0}%`, background: FG }} />
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

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((badge, i) => {
              const earned = earnedIds.has(badge.id);
              return (
                <motion.div key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  onMouseEnter={() => setHover(badge.id)} onMouseLeave={() => setHover(null)}
                  className={`relative bg-card border rounded-2xl p-5 text-center transition-all cursor-pointer ${earned ? 'border-primary/40 hover:border-primary/70' : 'border-border hover:border-border/80'} ${!earned ? 'opacity-60' : ''}`}>
                  <div className="text-4xl mb-3">{ICON_MAP[badge.icon] || '🎖️'}</div>
                  <h3 className="font-heading text-xs tracking-[0.15em] uppercase leading-tight mb-1">{badge.name}</h3>
                  <p className="text-[10px] text-muted-foreground mb-2">{badge.description}</p>
                  {earned ? (
                    <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded-full text-white" style={{ background: FG }}>Earned ✓</span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">+{badge.points} pts</span>
                  )}
                  {hover === badge.id && earned && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground whitespace-nowrap shadow-xl z-10">
                      {badge.category} · +{badge.points} pts
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
