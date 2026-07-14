import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Trophy, Zap, Check, ArrowRight, Clock, Users, Medal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import SEO from '@/components/shared/SEO';
import { supabase } from '@/lib/supabase';
import {
  fetchActiveChallenges,
  fetchFutureChallenges,
  fetchPastChallenges,
  fetchUserParticipants,
  calculateAutoProgress,
  joinChallenge,
  leaveChallenge,
} from '@/lib/challengeUtils';

const FG = '#2D5A27';
const SAND = '#D2B48C';

const TIER_COLORS = {
  bronze: { bg: '#CD7F32', light: 'rgba(205,127,50,0.15)', label: 'Bronze' },
  silver: { bg: '#C0C0C0', light: 'rgba(192,192,192,0.15)', label: 'Silver' },
  gold: { bg: '#FFD700', light: 'rgba(255,215,0,0.15)', label: 'Gold' },
};

function getTierConfig(slug) {
  if (slug.includes('bronze')) return TIER_COLORS.bronze;
  if (slug.includes('silver')) return TIER_COLORS.silver;
  if (slug.includes('gold')) return TIER_COLORS.gold;
  return { bg: FG, light: 'rgba(45,90,39,0.15)', label: 'Standard' };
}

function ChallengeCard({ challenge, participants, userParticipant, userId, isAuthenticated, onJoin, onLeave, onRefresh }) {
  const tier = getTierConfig(challenge.slug);
  const joined = !!userParticipant;
  const progress = userParticipant?.progress || 0;
  const pct = challenge.goal_target > 0 ? Math.min((progress / challenge.goal_target) * 100, 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.12] transition-all overflow-hidden">
      {/* Tier accent line */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${tier.bg}, transparent)` }} />

      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-heading tracking-[0.2em] uppercase px-2 py-0.5 rounded-full" style={{ background: tier.light, color: tier.bg }}>
              {tier.label}
            </span>
            <span className="text-[10px] font-heading tracking-widest uppercase text-white/30">
              {challenge.goal_target} {challenge.goal_type}
            </span>
          </div>
          <h3 className="font-heading text-lg tracking-wider uppercase text-white mt-2 hover:text-white/80 transition-colors">
            <Link to={`/brotherhood/challenges/${challenge.slug}`}>{challenge.title}</Link>
          </h3>
          <p className="text-xs text-white/40 mt-1 max-w-md">{challenge.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-1 justify-end">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span className="font-heading text-sm text-yellow-400">+{challenge.prize_points}</span>
          </div>
          <p className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5">Points</p>
        </div>
      </div>

      {/* Progress bar */}
      {joined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/40 mb-1.5">
            <span>Progress</span>
            <span>{progress}/{challenge.goal_target}</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${tier.bg}, ${tier.bg}80)` }} />
          </div>
          {pct >= 100 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: tier.bg }}>
                <Check className="w-3 h-3 text-black" />
              </div>
              <span className="text-[10px] font-heading tracking-widest uppercase" style={{ color: tier.bg }}>Goal reached</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {isAuthenticated ? (
          joined ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="font-heading tracking-wider uppercase text-xs border-white/20 text-white/60"
                onClick={async () => { await onLeave(challenge.id); onRefresh(); }}>
                Leave
              </Button>
              <Link to={`/brotherhood/challenges/${challenge.slug}`}>
                <Button size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: tier.bg }}>
                  {progress >= challenge.goal_target ? 'View' : 'Complete Now'} <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: tier.bg }}
                onClick={async () => { await onJoin(challenge.id); onRefresh(); }}>
                Join Challenge
              </Button>
              <Link to={`/brotherhood/challenges/${challenge.slug}`}>
                <Button size="sm" variant="outline" className="font-heading tracking-wider uppercase text-xs border-white/20 text-white/60">
                  Start Now <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>
          )
        ) : (
          <Button asChild size="sm" className="font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
            <a href="/auth/signin">Sign in to Join</a>
          </Button>
        )}
        <div className="flex items-center gap-1.5 text-[10px] text-white/30">
          <Users className="w-3 h-3" />
          <span>{participants || 0}</span>
        </div>
      </div>
    </motion.div>
  );
}

function PastChallengeCard({ challenge }) {
  return (
    <Link to={`/brotherhood/challenges/${challenge.slug}`}
      className="block bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-heading text-sm tracking-wider uppercase text-white/70 truncate">{challenge.title}</h4>
          <p className="text-[10px] text-white/30 mt-0.5">{challenge.goal_target} {challenge.goal_type} &middot; +{challenge.prize_points} pts</p>
        </div>
        <span className="text-[10px] text-white/20 font-heading tracking-widest uppercase flex-shrink-0">
          {new Date(challenge.end_date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </Link>
  );
}

export default function ChallengeDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [futureChallenges, setFutureChallenges] = useState([]);
  const [pastChallenges, setPastChallenges] = useState([]);
  const [userParticipants, setUserParticipants] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [active, future, past] = await Promise.all([
        fetchActiveChallenges(),
        fetchFutureChallenges(),
        fetchPastChallenges(),
      ]);
      setActiveChallenges(active);
      setFutureChallenges(future);
      setPastChallenges(past);

      if (user) {
        const allIds = [...active, ...future].map(c => c.id);
        const parts = await fetchUserParticipants(user.id, allIds);
        setUserParticipants(parts);

        const updated = [...active, ...future];
        const changed = {};
        for (const challenge of updated) {
          const existing = parts[challenge.id];
          if (existing) {
            const auto = await calculateAutoProgress(user.id, challenge);
            if (auto !== existing.progress) {
              changed[challenge.id] = auto;
            }
          }
        }

        const updates = Object.entries(changed);
        if (updates.length > 0) {
          await Promise.all(updates.map(([cid, prog]) =>
            supabase.from('challenge_participants')
              .update({ progress: prog, completed_at: prog >= (active.concat(future).find(c => c.id === cid)?.goal_target || 0) ? new Date().toISOString() : null })
              .eq('challenge_id', cid)
              .eq('user_id', user.id)
          ));
          const refreshedParts = await fetchUserParticipants(user.id, allIds);
          setUserParticipants(refreshedParts);
        }
      }
    } catch (e) {
      console.error('Challenge load error:', e);
    }
    setLoading(false);
    setRefreshing(false);
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleJoin = async (challengeId) => {
    if (!user) return;
    const err = await joinChallenge(challengeId, user.id);
    if (err) console.error('Join error:', err);
  };

  const handleLeave = async (challengeId) => {
    if (!user) return;
    const err = await leaveChallenge(challengeId, user.id);
    if (err) console.error('Leave error:', err);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalJoined = Object.keys(userParticipants).filter(k => userParticipants[k]).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-heading tracking-widest uppercase text-muted-foreground animate-pulse">Loading Challenges</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <SEO title="Brotherhood Challenges — BOYZ IN THE WOODZ" description="Complete monthly challenges, earn points, and unlock badges." canonical="/brotherhood/challenges" />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a1a 40%, #0a0a0a 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23ffffff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-[0.08]" style={{ background: FG, filter: 'blur(120px)' }} />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4" style={{ color: SAND }} />
              <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Monthly</span>
            </div>
            <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white leading-none">
              Challenges
            </h1>
            <p className="text-white/50 mt-3 max-w-xl">Complete challenges, earn points, unlock badges. Push yourself. Rise through the ranks.</p>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-3">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <Target className="w-4 h-4" style={{ color: SAND }} />
              <div>
                <p className="font-heading text-xl text-white">{activeChallenges.length}</p>
                <p className="text-[9px] text-white/30 font-heading tracking-widest uppercase">Active</p>
              </div>
            </div>
            {isAuthenticated && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
                <Trophy className="w-4 h-4" style={{ color: SAND }} />
                <div>
                  <p className="font-heading text-xl text-white">{totalJoined}</p>
                  <p className="text-[9px] text-white/30 font-heading tracking-widest uppercase">Joined</p>
                </div>
              </div>
            )}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <p className="font-heading text-xl text-white">
                  {activeChallenges.reduce((s, c) => s + c.prize_points, 0).toLocaleString()}
                </p>
                <p className="text-[9px] text-white/30 font-heading tracking-widest uppercase">Total Prize</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Challenges */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {refreshing && (
          <div className="flex justify-center mb-6">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: SAND }} />
          </div>
        )}

        {activeChallenges.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto mb-4 text-white/10" />
            <p className="font-heading text-xl tracking-wider uppercase text-white/30">No Active Challenges</p>
            <p className="text-sm text-white/20 mt-2">Check back at the start of next month.</p>
          </div>
        ) : (
          <>
            <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white/40 mb-6">Active Challenges</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} participants={0}
                  userParticipant={userParticipants[challenge.id]} userId={user?.id}
                  isAuthenticated={isAuthenticated}
                  onJoin={handleJoin} onLeave={handleLeave} onRefresh={handleRefresh} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Your Challenges */}
      {isAuthenticated && totalJoined > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white/40 mb-6">Your Challenges</h2>
          <div className="space-y-3">
            {activeChallenges.filter(c => userParticipants[c.id]).map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} participants={0}
                userParticipant={userParticipants[challenge.id]} userId={user?.id}
                isAuthenticated={isAuthenticated}
                onJoin={handleJoin} onLeave={handleLeave} onRefresh={handleRefresh} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Challenges */}
      {futureChallenges.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white/40 mb-6">Next Month</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureChallenges.map(challenge => (
              <div key={challenge.id} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 opacity-60">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5" style={{ color: SAND }} />
                  <span className="text-[10px] font-heading tracking-widest uppercase text-white/30">
                    Starts {new Date(challenge.start_date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <h3 className="font-heading text-base tracking-wider uppercase text-white/50">{challenge.title}</h3>
                <p className="text-xs text-white/30 mt-1">{challenge.goal_target} {challenge.goal_type} &middot; +{challenge.prize_points} pts</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Past Challenges */}
      {pastChallenges.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white/40 mb-6">Past Challenges</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pastChallenges.map(challenge => (
              <PastChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {!isAuthenticated && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 text-center">
            <Medal className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <h3 className="font-heading text-xl tracking-wider uppercase text-white mb-2">Ready to Compete?</h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Sign up, join challenges, earn points, and climb the leaderboard.</p>
            <Link to="/auth/signup">
              <Button className="font-heading tracking-wider uppercase" style={{ background: FG }}>
                Join the Brotherhood <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
