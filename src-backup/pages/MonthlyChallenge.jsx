/* ============================================================
   MONTHLY CHALLENGE — /community/challenge
   ============================================================ */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Check, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const LEADERBOARD = [
  { rank: 1, name: 'Marcus T.', city: 'Houston', progress: 3, badge: '🏆' },
  { rank: 2, name: 'David R.', city: 'Atlanta', progress: 3, badge: '🥈' },
  { rank: 3, name: 'James W.', city: 'Chicago', progress: 3, badge: '🥉' },
  { rank: 4, name: 'Andre L.', city: 'Dallas', progress: 2 },
  { rank: 5, name: 'Kevin H.', city: 'Memphis', progress: 2 },
  { rank: 6, name: 'Troy M.', city: 'Nashville', progress: 2 },
  { rank: 7, name: 'Rico B.', city: 'Miami', progress: 1 },
  { rank: 8, name: 'Damon K.', city: 'Detroit', progress: 1 },
  { rank: 9, name: 'Chris P.', city: 'Phoenix', progress: 1 },
  { rank: 10, name: 'Leon S.', city: 'Seattle', progress: 1 },
];

const PAST_CHALLENGES = [
  { month: 'May 2026', title: 'Share 1 Gratitude Post', winner: 'Marcus T.', participants: 347, badge: '🙏' },
  { month: 'Apr 2026', title: 'Take a 30-Minute Nature Walk', winner: 'Kevin H.', participants: 289, badge: '🌿' },
  { month: 'Mar 2026', title: 'Call a Brother You\'ve Lost Touch With', winner: 'David R.', participants: 412, badge: '📞' },
];

export default function MonthlyChallenge() {
  const [joined, setJoined] = useState(false);
  const [userProgress, setUserProgress] = useState(1);
  const [countdown, setCountdown] = useState({ d: 11, h: 14, m: 22, s: 8 });

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

  const communityTotal = 1847;
  const communityGoal = 3000;
  const goal = 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: SAND }} />
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>June 2026</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-foreground mb-2">Monthly Challenge</h1>
          <p className="text-muted-foreground text-lg">Upload 3 Proofs of Nature This Month</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-6">
            {/* Countdown */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-xs font-heading tracking-[0.2em] uppercase text-muted-foreground mb-3">Challenge Ends In</p>
              <div className="flex gap-4">
                {[['D', countdown.d], ['H', countdown.h], ['M', countdown.m], ['S', countdown.s]].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <div className="font-heading text-3xl text-foreground">{String(v).padStart(2, '0')}</div>
                    <div className="text-[9px] text-muted-foreground uppercase font-heading tracking-wider">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Challenge Details */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-heading text-xl tracking-wider uppercase mb-4" style={{ color: FG }}>The Challenge</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">Upload 3 photos proving you spent time in nature this month. A hike, a park, your backyard — wherever the outside is. Tag where you were.</p>
              <div className="space-y-2">
                {['Photo must be outdoors', 'Tag location (city at minimum)', 'Caption required (1 sentence)', 'One upload per week counts'].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 flex-shrink-0" style={{ color: FG }} /> {r}
                  </div>
                ))}
              </div>
            </div>

            {/* Your Progress */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4">Your Progress</h2>
              <div className="flex gap-3 mb-4">
                {Array.from({ length: goal }, (_, i) => (
                  <div key={i} className={`flex-1 h-16 rounded-xl border-2 flex items-center justify-center transition-all ${i < userProgress ? 'border-primary bg-primary/10' : 'border-border'}`}>
                    {i < userProgress ? <Check className="w-6 h-6" style={{ color: FG }} /> : <span className="text-muted-foreground font-heading text-lg">{i + 1}</span>}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{userProgress}/{goal} proofs uploaded</span>
                <span>{Math.round((userProgress / goal) * 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(userProgress / goal) * 100}%`, background: FG }} />
              </div>
            </div>

            {/* Community Progress */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4">Community Progress</h2>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{communityTotal.toLocaleString()} proofs uploaded</span>
                <span>Goal: {communityGoal.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${(communityTotal / communityGoal) * 100}%` }} transition={{ duration: 1.2, delay: 0.3 }}
                  className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${FG}, #4CAF50)` }} />
              </div>
              <p className="text-xs text-muted-foreground">{communityGoal - communityTotal} more needed to unlock community reward</p>
            </div>

            {/* Past Challenges */}
            <div>
              <h2 className="font-heading text-lg tracking-wider uppercase mb-4">Past Challenges</h2>
              <div className="space-y-3">
                {PAST_CHALLENGES.map(c => (
                  <div key={c.month} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <span className="text-2xl">{c.badge}</span>
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{c.month}</p>
                      <p className="font-heading text-sm tracking-wider uppercase">{c.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Winner</p>
                      <p className="text-sm font-medium" style={{ color: FG }}>{c.winner}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Participants</p>
                      <p className="font-heading text-base text-foreground">{c.participants}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Prize */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <Trophy className="w-8 h-8 mb-3" style={{ color: SAND }} />
              <h3 className="font-heading text-base tracking-wider uppercase mb-2">Complete to Earn</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-yellow-400" /> +500 Brotherhood Points</div>
                <div className="flex items-center gap-2 text-sm"><span className="text-lg">🏆</span> "Challenge Champion" Badge</div>
                <div className="flex items-center gap-2 text-sm"><span className="text-lg">🌿</span> Featured in June Recap</div>
              </div>
            </div>

            {/* Join CTA */}
            {!joined ? (
              <Button onClick={() => setJoined(true)} className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
                Join This Challenge
              </Button>
            ) : (
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                <Check className="w-6 h-6 mx-auto mb-2" style={{ color: FG }} />
                <p className="font-heading text-sm tracking-wider uppercase" style={{ color: FG }}>You're In!</p>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4">June Leaderboard</h3>
              <div className="space-y-2">
                {LEADERBOARD.map(b => (
                  <div key={b.rank} className="flex items-center gap-2 py-1">
                    <span className="font-heading text-sm text-muted-foreground w-5">{b.badge || `#${b.rank}`}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground">{b.city}</p>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className={`w-4 h-4 rounded-full border ${i < b.progress ? 'border-primary bg-primary/30' : 'border-border'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}