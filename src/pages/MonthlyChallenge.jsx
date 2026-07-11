import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Check, ArrowRight, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

export default function MonthlyChallenge() {
  const { user, isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('monthly_challenges')
      .select('*')
      .eq('active', true)
      .lte('start_date', new Date().toISOString())
      .gte('end_date', new Date().toISOString())
      .limit(1)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setChallenge(data);
          const target = new Date(data.end_date);
          const update = () => {
            const diff = target - new Date();
            if (diff <= 0) { setCountdown({ d: 0, h: 0, m: 0, s: 0 }); return; }
            setCountdown({
              d: Math.floor(diff / 86400000),
              h: Math.floor((diff % 86400000) / 3600000),
              m: Math.floor((diff % 3600000) / 60000),
              s: Math.floor((diff % 60000) / 1000),
            });
          };
          update();
          const t = setInterval(update, 1000);
          return () => clearInterval(t);
        }
      });

    supabase
      .from('challenge_participants')
      .select('user_id, progress, profiles:user_id(full_name, city)')
      .order('progress', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) {
          setParticipants(data.map((p, i) => ({
            rank: i + 1,
            name: p.profiles?.full_name || 'Anonymous',
            city: p.profiles?.city || null,
            progress: p.progress || 0,
          })));
        }
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user && challenge) {
      supabase
        .from('challenge_participants')
        .select('id, progress')
        .eq('challenge_id', challenge.id)
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setJoined(true);
          }
        });
    }
    setLoading(false);
  }, [isAuthenticated, user, challenge]);

  const handleJoin = async () => {
    if (!isAuthenticated || !challenge) return;
    const { error } = await supabase.from('challenge_participants').insert({
      challenge_id: challenge.id,
      user_id: user.id,
      progress: 0,
    });
    if (!error) {
      setJoined(true);
      supabase.from('activity_feed').insert({
        user_id: user.id,
        action_type: 'challenge_joined',
        description: `Joined the ${challenge.title} challenge`,
      }).catch(() => {});
    }
  };

  const communityTotal = participants.reduce((s, p) => s + p.progress, 0);
  const goal = challenge?.goal_target || 3;

  return (
    <div className="min-h-screen bg-background">
      <SEO title={challenge ? `${challenge.title} — Monthly Challenge` : 'Monthly Challenge'} description="Join the monthly brotherhood challenge. Earn points, compete, and unlock badges." canonical="/community/challenge" />
      <section className="relative py-14" style={{ background: 'linear-gradient(135deg, rgba(45,90,39,0.1) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4" style={{ color: SAND }} />
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>
              {challenge ? new Date(challenge.start_date).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Monthly'}
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-foreground mb-2">Monthly Challenge</h1>
          <p className="text-muted-foreground text-lg">{challenge?.title || 'Loading...'}</p>
        </div>
      </section>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>
      ) : !challenge ? (
        <div className="text-center py-20 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-heading tracking-wider uppercase">No Active Challenge</p>
          <p className="text-xs mt-2">Check back at the start of next month.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">
            <div className="space-y-6">
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

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-heading text-xl tracking-wider uppercase mb-4" style={{ color: FG }}>The Challenge</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{challenge.description}</p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-heading text-lg tracking-wider uppercase mb-4">Community Progress</h2>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>{communityTotal.toLocaleString()} completions</span>
                  <span>Participants: {participants.length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-card border border-border rounded-2xl p-5">
                <Trophy className="w-8 h-8 mb-3" style={{ color: SAND }} />
                <h3 className="font-heading text-base tracking-wider uppercase mb-2">Prize</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm"><Zap className="w-4 h-4 text-yellow-400" /> +{challenge.prize_points} Brotherhood Points</div>
                  {challenge.prize_badge_id && <div className="flex items-center gap-2 text-sm"><span className="text-lg">🏆</span> Special Badge</div>}
                </div>
              </div>

              {!isAuthenticated ? (
                <Button asChild className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
                  <a href="/auth/signin">Sign in to Join</a>
                </Button>
              ) : !joined ? (
                <Button onClick={handleJoin} className="w-full font-heading tracking-wider uppercase" style={{ background: FG }}>
                  Join This Challenge
                </Button>
              ) : (
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                  <Check className="w-6 h-6 mx-auto mb-2" style={{ color: FG }} />
                  <p className="font-heading text-sm tracking-wider uppercase" style={{ color: FG }}>You're In!</p>
                </div>
              )}

              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-heading text-sm tracking-[0.2em] uppercase mb-4">Leaderboard</h3>
                <div className="space-y-2">
                  {participants.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No participants yet. Be the first!</p>
                  ) : (
                    participants.map(b => (
                      <div key={b.rank} className="flex items-center gap-2 py-1">
                        <span className="font-heading text-sm text-muted-foreground w-5">#{b.rank}</span>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground">{b.name}</p>
                          {b.city && <p className="text-[10px] text-muted-foreground">{b.city}</p>}
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: goal }, (_, i) => (
                            <div key={i} className={`w-4 h-4 rounded-full border ${i < b.progress ? 'border-primary bg-primary/30' : 'border-border'}`} />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
