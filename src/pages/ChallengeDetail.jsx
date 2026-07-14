import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Trophy, Zap, Check, ArrowLeft, ArrowRight, Users, Medal, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/shared/SEO';
import {
  fetchChallengeBySlug,
  fetchUserParticipants,
  calculateAutoProgress,
  fetchChallengeParticipants,
  joinChallenge,
  leaveChallenge,
  getGoalTypeActionUrl,
  getGoalTypeActionLabel,
} from '@/lib/challengeUtils';

const FG = '#2D5A27';
const SAND = '#D2B48C';
const AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80',
  'https://images.unsplash.com/photo-1553267751-1c148a7280a1?w=100&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80',
  'https://images.unsplash.com/photo-1542178243-bc20204b769f?w=100&q=80',
  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&q=80',
];

const PAGE_SIZE = 50;

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

function useCountdown(target) {
  const [cd, setCd] = useState({ d: 0, h: 0, m: 0, s: 0, expired: false });
  useEffect(() => {
    if (!target) return;
    const update = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) { setCd({ d: 0, h: 0, m: 0, s: 0, expired: true }); return; }
      setCd({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
        expired: false,
      });
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [target]);
  return cd;
}

export default function ChallengeDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [userParticipant, setUserParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const countdown = useCountdown(challenge?.end_date);

  const loadPage = useCallback(async (pageNum, reset = false) => {
    if (!challenge) return;
    try {
      const result = await fetchChallengeParticipants(challenge.id, pageNum, PAGE_SIZE);
      setParticipants(prev => reset ? result.participants : [...prev, ...result.participants]);
      setTotalCount(result.total);
      setHasMore(result.hasMore);
    } catch (e) {
      console.error('Load participants error:', e);
    }
  }, [challenge]);

  useEffect(() => {
    fetchChallengeBySlug(slug).then(async (c) => {
      if (!c) { setLoading(false); return; }
      setChallenge(c);
      if (user) {
        const parts = await fetchUserParticipants(user.id, [c.id]);
        const existing = parts[c.id];
        if (existing) {
          const auto = await calculateAutoProgress(user.id, c);
          if (auto !== existing.progress) {
            const { error } = await supabase.from('challenge_participants')
              .update({
                progress: auto,
                completed_at: auto >= c.goal_target ? new Date().toISOString() : null,
              })
              .eq('id', existing.id);
            if (!error) existing.progress = auto;
          }
          setUserParticipant(existing);
        }
      }
      setLoading(false);
    });
  }, [slug, user]);

  useEffect(() => {
    if (challenge) loadPage(0, true);
  }, [challenge, loadPage]);

  const handleJoin = async () => {
    if (!user || !challenge || joining) return;
    setJoining(true);
    const err = await joinChallenge(challenge.id, user.id);
    if (err) { console.error('Join error:', err); setJoining(false); return; }
    const auto = await calculateAutoProgress(user.id, challenge);
    setUserParticipant({ challenge_id: challenge.id, user_id: user.id, progress: auto });
    setJoining(false);
    loadPage(0, true);
  };

  const handleLeave = async () => {
    if (!user || !challenge) return;
    const err = await leaveChallenge(challenge.id, user.id);
    if (err) { console.error('Leave error:', err); return; }
    setUserParticipant(null);
    loadPage(0, true);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next);
  };

  const tier = challenge ? getTierConfig(challenge.slug) : TIER_COLORS.standard;
  const joined = !!userParticipant;
  const userProgress = userParticipant?.progress || 0;
  const pct = challenge?.goal_target > 0 ? Math.min((userProgress / challenge.goal_target) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-heading tracking-widest uppercase text-muted-foreground animate-pulse">Loading Challenge</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-white/10" />
          <p className="font-heading text-xl tracking-wider uppercase text-white/30">Challenge Not Found</p>
          <Link to="/brotherhood/challenges">
            <Button className="mt-4 font-heading tracking-wider uppercase text-xs" variant="outline" style={{ borderColor: FG, color: FG }}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Challenges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <SEO title={`${challenge.title} — Challenge`} description={challenge.description} canonical={`/brotherhood/challenges/${challenge.slug}`} />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a1a 40%, #0a0a0a 100%)' }}>
        <div className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/brotherhood/challenges" className="inline-flex items-center gap-1.5 text-[10px] font-heading tracking-widest uppercase text-white/30 hover:text-white/60 mb-4 transition-colors">
              <ArrowLeft className="w-3 h-3" /> All Challenges
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-heading tracking-[0.2em] uppercase px-2 py-0.5 rounded-full" style={{ background: tier.light, color: tier.bg }}>
                {tier.label}
              </span>
              <span className="text-[10px] font-heading tracking-widest uppercase text-white/30">
                {challenge.goal_target} {challenge.goal_type}
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl tracking-wide uppercase text-white leading-none">{challenge.title}</h1>
            <p className="text-white/50 mt-3 max-w-xl">{challenge.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Left: Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-sm tracking-[0.2em] uppercase text-white/40">
                Leaderboard <span className="text-white/20">({totalCount})</span>
              </h2>
            </div>

            {participants.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-12 h-12 mx-auto mb-3 text-white/10" />
                <p className="font-heading text-sm tracking-wider uppercase text-white/30">No Participants Yet</p>
                <p className="text-xs text-white/20 mt-1">Be the first to join this challenge.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {participants.map((p, i) => (
                  <motion.div key={p.user_id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.01 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${user?.id === p.user_id ? 'bg-white/[0.06] border border-white/[0.12]' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
                    <span className="font-heading text-xs w-6 text-center" style={{ color: p.rank <= 3 ? TIER_COLORS[p.rank === 1 ? 'gold' : p.rank === 2 ? 'silver' : 'bronze'].bg : 'rgba(255,255,255,0.3)' }}>
                      {p.rank <= 3 ? ['🥇', '🥈', '🥉'][p.rank - 1] : `#${p.rank}`}
                    </span>
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/[0.06]">
                      <img src={AVATARS[i % AVATARS.length]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-xs tracking-wider uppercase text-white truncate">
                        {p.name}
                        {user?.id === p.user_id && <span className="ml-1.5 text-[8px] px-1 py-0.5 rounded-full font-heading tracking-widest uppercase" style={{ background: `${FG}30`, color: FG }}>You</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex gap-0.5">
                        {Array.from({ length: Math.min(p.progress, challenge.goal_target) }).map((_, j) => (
                          <div key={j} className="w-2.5 h-2.5 rounded-full" style={{ background: p.progress >= challenge.goal_target ? tier.bg : FG }} />
                        ))}
                      </div>
                      <span className="font-heading text-sm min-w-[3ch] text-right" style={{ color: FG }}>{p.progress}</span>
                      <span className="text-[9px] text-white/30">/ {challenge.goal_target}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="mt-6 text-center">
                <Button onClick={handleLoadMore} variant="outline" className="font-heading tracking-wider uppercase text-xs border-white/20 text-white/60 hover:text-white hover:border-white/40">
                  Load More — Showing {participants.length} of {totalCount}
                </Button>
              </div>
            )}
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-5">
            {/* Countdown */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-[10px] font-heading tracking-[0.2em] uppercase text-white/40 mb-3">
                {countdown.expired ? 'Challenge Ended' : 'Time Remaining'}
              </p>
              {!countdown.expired && (
                <div className="flex gap-3">
                  {[['Days', countdown.d], ['Hours', countdown.h], ['Mins', countdown.m], ['Secs', countdown.s]].map(([l, v]) => (
                    <div key={l} className="text-center">
                      <div className="font-heading text-2xl text-white">{String(v).padStart(2, '0')}</div>
                      <div className="text-[8px] text-white/30 uppercase font-heading tracking-widest">{l}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prize */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
              <Trophy className="w-6 h-6 mb-3" style={{ color: SAND }} />
              <h3 className="font-heading text-sm tracking-wider uppercase text-white mb-2">Prize</h3>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-heading text-base" style={{ color: tier.bg }}>+{challenge.prize_points} Points</span>
              </div>
            </div>

            {/* Your Progress */}
            {isAuthenticated && (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
                <h3 className="font-heading text-sm tracking-wider uppercase text-white mb-3">Your Progress</h3>
                {joined ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-heading text-lg" style={{ background: `${tier.bg}20` }}>
                        {userProgress >= challenge.goal_target ? '✅' : '🎯'}
                      </div>
                      <div>
                        <p className="font-heading text-xl text-white">{userProgress} <span className="text-sm text-white/40">/ {challenge.goal_target}</span></p>
                        <p className="text-[9px] text-white/30 tracking-widest uppercase">{challenge.goal_type}</p>
                      </div>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                        className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${tier.bg}, ${tier.bg}80)` }} />
                    </div>
                    {userProgress >= challenge.goal_target && (
                      <div className="flex items-center gap-1.5 text-xs mb-3" style={{ color: tier.bg }}>
                        <Check className="w-4 h-4" /> Goal reached — claim your prize when challenge ends!
                      </div>
                    )}
                    <Link to={getGoalTypeActionUrl(challenge.goal_type)}>
                      <Button size="sm" className="w-full font-heading tracking-wider uppercase text-xs mb-2" style={{ background: tier.bg }}>
                        {getGoalTypeActionLabel(challenge.goal_type)} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                    <Button onClick={handleLeave} size="sm" variant="outline" className="w-full font-heading tracking-wider uppercase text-xs border-white/20 text-white/60">
                      Leave Challenge
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleJoin} size="sm" className="w-full font-heading tracking-wider uppercase text-xs mb-2" style={{ background: tier.bg }} disabled={joining}>
                      {joining ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                      {joining ? 'Joining...' : 'Join This Challenge'}
                    </Button>
                    <Link to={getGoalTypeActionUrl(challenge.goal_type)}>
                      <Button size="sm" variant="outline" className="w-full font-heading tracking-wider uppercase text-xs border-white/20 text-white/60">
                        {getGoalTypeActionLabel(challenge.goal_type)} <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            )}

            {!isAuthenticated && (
              <Button asChild className="w-full font-heading tracking-wider uppercase text-xs" style={{ background: FG }}>
                <a href="/auth/signin">Sign in to Join</a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
