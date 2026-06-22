/* ============================================================
   BROTHERHOOD HUB PAGES — Leaderboard, Challenges, Statistics
   Routes: /brotherhood/leaderboard, /brotherhood/challenges, /brotherhood/statistics
   ============================================================ */
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Target, BarChart3, Zap, Star, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';
const SAND = '#D2B48C';

/* ─── LEADERBOARD ─── */
function Leaderboard() {
  const brothers = [
    { rank: 1, name: 'Marcus T.', points: 8420, retreats: 5, proofs: 47, city: 'Houston, TX', badge: '🏆' },
    { rank: 2, name: 'James W.', points: 7350, retreats: 4, proofs: 38, city: 'Atlanta, GA', badge: '🥈' },
    { rank: 3, name: 'David R.', points: 6980, retreats: 4, proofs: 31, city: 'Chicago, IL', badge: '🥉' },
    { rank: 4, name: 'Andre L.', points: 5640, retreats: 3, proofs: 28, city: 'Dallas, TX', badge: '' },
    { rank: 5, name: 'Kevin H.', points: 5120, retreats: 3, proofs: 24, city: 'Memphis, TN', badge: '' },
    { rank: 6, name: 'Troy M.', points: 4890, retreats: 2, proofs: 22, city: 'Nashville, TN', badge: '' },
    { rank: 7, name: 'Rico B.', points: 4320, retreats: 2, proofs: 19, city: 'Miami, FL', badge: '' },
    { rank: 8, name: 'Damon K.', points: 3980, retreats: 2, proofs: 15, city: 'Detroit, MI', badge: '' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Brotherhood</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Leaderboard</h1>
          <p className="text-muted-foreground">Top brothers ranked by points, proofs, and retreats attended.</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Top 3 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {brothers.slice(0, 3).map((b, i) => (
            <motion.div key={b.rank} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-card border rounded-2xl p-5 text-center ${i === 0 ? 'border-yellow-500/40 bg-yellow-900/10' : 'border-border'}`}
              style={i === 0 ? { order: 0 } : {}}>
              <div className="text-3xl mb-2">{b.badge || `#${b.rank}`}</div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-heading text-lg text-white" style={{ background: FG }}>
                {b.name.split(' ').map(n => n[0]).join('')}
              </div>
              <p className="font-heading text-sm tracking-wider uppercase">{b.name}</p>
              <p className="text-xs text-muted-foreground">{b.city}</p>
              <p className="font-heading text-xl mt-2" style={{ color: FG }}>{b.points.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">points</p>
            </motion.div>
          ))}
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {brothers.map((b, i) => (
            <motion.div key={b.rank} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <span className="font-heading text-2xl text-muted-foreground/40 w-8 text-center flex-shrink-0">#{b.rank}</span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-heading flex-shrink-0" style={{ background: FG }}>
                {b.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm tracking-wider uppercase">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.city}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs text-muted-foreground">
                <div className="text-center"><p className="font-heading text-sm text-foreground">{b.retreats}</p><p>Retreats</p></div>
                <div className="text-center"><p className="font-heading text-sm text-foreground">{b.proofs}</p><p>Proofs</p></div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-heading text-lg" style={{ color: FG }}>{b.points.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">pts</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── CHALLENGES ─── */
function Challenges() {
  const [joined, setJoined] = useState([]);
  const challenges = [
    { id: 1, title: 'Upload 3 Proofs This Month', reward: '150 pts + Trail Blazer badge', progress: 0, total: 3, deadline: 'Jun 30', icon: '📸' },
    { id: 2, title: 'Attend a Virtual Campfire', reward: '100 pts', progress: 0, total: 1, deadline: 'Jun 30', icon: '🔥' },
    { id: 3, title: 'Refer a Brother', reward: '200 pts', progress: 0, total: 1, deadline: 'Jun 30', icon: '🤝' },
    { id: 4, title: 'Read 5 Journal Posts', reward: '50 pts', progress: 3, total: 5, deadline: 'Jun 30', icon: '📖' },
    { id: 5, title: 'Complete Your Profile', reward: '75 pts + Profile badge', progress: 0, total: 1, deadline: 'Ongoing', icon: '✅' },
    { id: 6, title: 'Apply for a Retreat', reward: '500 pts + Brave Step badge', progress: 0, total: 1, deadline: 'Dec 31', icon: '🏕️' },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>Monthly</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Challenges</h1>
          <p className="text-muted-foreground">Complete challenges, earn points, unlock badges.</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-10 grid sm:grid-cols-2 gap-5">
        {challenges.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[10px] font-heading tracking-wider uppercase text-muted-foreground">Ends {c.deadline}</span>
            </div>
            <h3 className="font-heading text-base tracking-wider uppercase mb-1">{c.title}</h3>
            <p className="text-xs text-muted-foreground mb-4">Reward: <span style={{ color: FG }}>{c.reward}</span></p>
            {c.total > 1 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span><span>{c.progress}/{c.total}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(c.progress / c.total) * 100}%`, background: FG }} />
                </div>
              </div>
            )}
            <Button onClick={() => setJoined(j => j.includes(c.id) ? j : [...j, c.id])} size="sm"
              className="w-full font-heading tracking-wider uppercase text-xs"
              variant={joined.includes(c.id) ? 'secondary' : 'default'}
              style={joined.includes(c.id) ? {} : { background: FG }}>
              {joined.includes(c.id) ? <><Check className="w-3.5 h-3.5 mr-1" /> Joined</> : 'Accept Challenge'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── STATISTICS ─── */
function Statistics() {
  const stats = [
    { label: 'Brothers Pledged', value: '1,247', icon: '🌿', desc: 'Active brotherhood members' },
    { label: 'Retreats Held', value: '23', icon: '🏕️', desc: 'Since 2021' },
    { label: 'Proofs Shared', value: '4,891', icon: '📸', desc: 'Moments of transformation' },
    { label: 'Points Earned', value: '2.4M', icon: '⭐', desc: 'Total brotherhood points' },
    { label: 'Chapters Active', value: '12', icon: '🗺️', desc: 'Cities across the country' },
    { label: 'Blog Posts', value: '89', icon: '📖', desc: 'Stories from the field' },
  ];
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-xs font-heading tracking-[0.3em] uppercase block mb-2" style={{ color: SAND }}>By the Numbers</span>
          <h1 className="font-heading text-5xl tracking-wide uppercase text-foreground mb-2">Brotherhood Statistics</h1>
          <p className="text-muted-foreground">Live impact of the Boyz In The Woodz movement.</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/40 transition-all">
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="font-heading text-4xl text-foreground mb-1" style={{ color: FG }}>{s.value}</div>
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-foreground mb-1">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function BrotherhoodHub() {
  const location = useLocation();
  if (location.pathname.includes('/leaderboard')) return <Leaderboard />;
  if (location.pathname.includes('/challenges')) return <Challenges />;
  if (location.pathname.includes('/statistics')) return <Statistics />;
  return <Leaderboard />;
}