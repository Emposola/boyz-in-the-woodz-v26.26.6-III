import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Trophy, Target, BarChart3, Zap, ArrowRight, Check, Users, Crown, Search, MapPin, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import SEO from '@/components/shared/SEO';

const FG = '#2D5A27';
const SAND = '#D2B48C';

function CountUp({ end, duration = 1.5, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

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

const MEDAL_EMOJIS = { 1: '🥇', 2: '🥈', 3: '🥉' };

const PAGE_SIZE = 50;

function Leaderboard() {
  const { user } = useAuth();
  const [brothers, setBrothers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    loadPage(0, true);
  }, []);

  const loadPage = async (pageNum, reset = false) => {
    const rangeStart = pageNum * PAGE_SIZE;
    const rangeEnd = rangeStart + PAGE_SIZE - 1;

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, city, loyalty_points, pledge_accepted')
      .order('loyalty_points', { ascending: false })
      .range(rangeStart, rangeEnd);

    if (error) { setLoading(false); return; }
    if (!profiles || profiles.length === 0) { setLoading(false); setBrothers([]); return; }

    const { data: retreats } = await supabase
      .from('retreat_applications')
      .select('user_id')
      .eq('attended', true)
      .in('user_id', profiles.map(p => p.id));

    const rc = {};
    (retreats || []).forEach(r => { rc[r.user_id] = (rc[r.user_id] || 0) + 1; });

    const mapped = profiles.map((b, i) => ({
      rank: rangeStart + i + 1,
      id: b.id,
      name: b.full_name || 'Anonymous',
      city: b.city || null,
      points: b.loyalty_points || 0,
      retreats: rc[b.id] || 0,
    }));

    setBrothers(prev => reset ? mapped : [...prev, ...mapped]);
    setHasMore(profiles.length === PAGE_SIZE);

    if (reset) {
      const [totalRes, pointsRes, pledgedRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('loyalty_points'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('pledge_accepted', true),
      ]);
      setTotalCount(totalRes.count || 0);
      setStats({
        total: totalRes.count || 0,
        totalPoints: (pointsRes.data || []).reduce((s, p) => s + (p.loyalty_points || 0), 0),
        pledged: pledgedRes.count || 0,
      });
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadPage(next);
  };

  const filtered = useMemo(() => {
    if (!search) return brothers;
    const q = search.toLowerCase();
    return brothers.filter(b => b.name.toLowerCase().includes(q) || (b.city && b.city.toLowerCase().includes(q)));
  }, [brothers, search]);

  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    if (!user) { setMyRank(null); return; }
    supabase.from('profiles').select('id').lte('loyalty_points', 0).then(({ count }) => {
      // Will be refined below with the actual user points
    });
    // Get user's points + count of profiles with more points
    supabase.from('profiles').select('loyalty_points').eq('id', user.id).single().then(({ data: me }) => {
      if (!me) return;
      supabase.from('profiles').select('id', { count: 'exact', head: true }).gt('loyalty_points', me.loyalty_points || 0).then(({ count }) => {
        setMyRank((count || 0) + 1);
      });
    });
  }, [user]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-heading tracking-widest uppercase text-muted-foreground animate-pulse">Loading Brotherhood</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <SEO title="Brotherhood Leaderboard — BOYZ IN THE WOODZ" description="Top brothers ranked by loyalty points, retreats, and engagement." canonical="/brotherhood/leaderboard" />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a1a 40%, #0a0a0a 100%)' }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0v60M0 30h60\' stroke=\'%23ffffff\' stroke-width=\'0.5\'/%3E%3C/svg%3E")' }} />
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-[0.08]" style={{ background: FG, filter: 'blur(120px)' }} />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 rounded-full opacity-[0.05]" style={{ background: '#D2B48C', filter: 'blur(100px)' }} />

        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4" style={{ color: SAND }} />
              <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Brotherhood</span>
            </div>
            <h1 className="font-heading text-6xl md:text-7xl tracking-wide uppercase text-white leading-none mb-3">
              The <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(135deg, ${FG}, #4CAF50)` }}>Leaderboard</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl">Where the real ones stand. Points earned. Retreats attended. Brotherhood proven.</p>
          </motion.div>

          {/* Stats bar */}
          {stats && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                  { icon: Users, value: <CountUp end={totalCount} />, label: 'Brothers', sub: 'On the board' },
                { icon: Trophy, value: <CountUp end={stats.pledged} />, label: 'Pledged', sub: 'Took the oath' },
                { icon: Zap, value: <CountUp end={Math.floor(stats.totalPoints)} />, label: 'Total Points', sub: 'Across all brothers' },
                { icon: TrendingUp, value: <CountUp end={stats.total ? Math.floor(stats.totalPoints / stats.total) : 0} />, label: 'Avg Points', sub: 'Per brother' },
              ].map((s, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <s.icon className="w-3.5 h-3.5" style={{ color: FG }} />
                    <span className="text-[10px] font-heading tracking-widest uppercase text-white/40">{s.label}</span>
                  </div>
                  <p className="font-heading text-2xl text-white">{s.value}</p>
                  <p className="text-[10px] text-white/30">{s.sub}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* My rank bar */}
          {user && myRank && myRank > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-6 bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-heading text-sm" style={{ background: FG }}>
                #{myRank}
              </div>
              <div className="flex-1">
                <p className="font-heading text-sm tracking-wider uppercase text-white">Your Rank</p>
                <p className="text-xs text-white/40">Among {totalCount.toLocaleString()} brothers</p>
              </div>
              <Link to="/account" className="text-xs font-heading tracking-wider uppercase flex items-center gap-1 hover:underline" style={{ color: FG }}>
                View Dashboard <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          )}

          {/* Search + Rank info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..."
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all" />
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/30 font-heading tracking-widest uppercase flex-shrink-0">
              <Award className="w-3 h-3" />
              <span>Ranked by Loyalty Points</span>
              <div className="group relative">
                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center cursor-help text-[8px]">?</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#1a1a1a] border border-white/10 rounded-lg p-3 text-[10px] text-white/60 font-heading tracking-wider normal-case opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p className="font-bold text-white/80 mb-1 tracking-widest uppercase text-[9px]">How Points Work</p>
                  <ul className="space-y-1">
                    <li>• +100 Welcome bonus on signup</li>
                    <li>• +Points on product purchases</li>
                    <li>• +Points for retreat attendance</li>
                    <li>• +Points for journal submissions</li>
                    <li>• +Badge bonuses when unlocked</li>
                    <li>• Higher points = higher rank</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Podium — visually: [2nd | 1st | 3rd] but labels use actual rank */}
      {top3.length > 0 && (
        <section className="relative -mt-4 md:-mt-8 z-10 max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center md:items-end gap-2 md:gap-5">
            {/* Render order: 2nd place (left), 1st place (center), 3rd place (right) */}
            {[1, 0, 2].map(idx => {
              const b = top3[idx];
              if (!b) return null;
              const rank = b.rank; // 1, 2, or 3
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const delay = isFirst ? 0.1 : isSecond ? 0 : 0.2;
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: 'easeOut' }}
                  className={`flex-1 max-w-[110px] md:max-w-[200px] text-center ${isFirst ? 'md:h-44' : isSecond ? 'md:h-36' : 'md:h-28'}`}>
                  <div className="relative">
                    <div className="text-lg md:text-3xl mb-0.5 md:mb-2">{MEDAL_EMOJIS[rank] || '🎖️'}</div>
                    <div className={`w-10 h-10 md:w-16 md:h-16 mx-auto rounded-full overflow-hidden border-2 mb-0.5 md:mb-2`} style={{ borderColor: isFirst ? '#FFD700' : isSecond ? '#C0C0C0' : '#CD7F32' }}>
                      <img src={AVATARS[b.rank % AVATARS.length]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-heading text-[10px] md:text-sm tracking-wider uppercase text-white leading-tight truncate">{b.name}</p>
                    {b.city && <p className="text-[8px] md:text-[10px] text-white/40 truncate hidden md:block">{b.city}</p>}
                    <p className="font-heading text-sm md:text-xl mt-0 md:mt-1" style={{ color: isFirst ? '#FFD700' : isSecond ? '#C0C0C0' : '#CD7F32' }}>{b.points.toLocaleString()}</p>
                    <p className="text-[7px] md:text-[9px] text-white/30 tracking-widest uppercase hidden md:block">points</p>
                    {b.retreats > 0 && (
                      <p className="text-[8px] md:text-[10px] text-white/50 mt-0.5"><span className="mr-0.5">🏕️</span>{b.retreats}</p>
                    )}
                  </div>
                  <div className={`mt-1 md:mt-2 rounded-t-xl flex items-center justify-center font-heading text-[8px] md:text-xs tracking-widest uppercase text-white`}
                    style={{ background: isFirst ? 'linear-gradient(180deg, #FFD700 0%, #B8860B 100%)' : isSecond ? 'linear-gradient(180deg, #C0C0C0 0%, #808080 100%)' : 'linear-gradient(180deg, #CD7F32 0%, #8B4513 100%)', height: '16px md:24px' }}>
                     <span className="hidden md:inline">{isFirst ? '1st Place' : isSecond ? '2nd Place' : '3rd Place'}</span>
                     <span className="md:hidden">{isFirst ? '1st' : isSecond ? '2nd' : '3rd'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Leaderboard List */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {rest.length === 0 && top3.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-white/10" />
            <p className="font-heading text-2xl tracking-wider uppercase text-white/30">No brothers yet</p>
            <p className="text-sm text-white/20 mt-2">Be the first. Sign up, earn points, claim your spot.</p>
          </motion.div>
        ) : (
          <div className="space-y-1.5">
            {/* Header Row */}
            <div className="hidden md:flex items-center gap-4 px-5 py-2 text-[10px] font-heading tracking-widest uppercase text-white/20">
              <span className="w-10 text-center">Rank</span>
              <span className="flex-1">Brother</span>
              <span className="w-20 text-center">Retreats</span>
              <span className="w-28 text-right">Points</span>
            </div>

            {rest.map((b, i) => {
              const isMe = user?.id === b.id;
              const showRank = b.rank;
              return (
                <motion.div key={b.id} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.015 }}
                  className={`group relative rounded-xl transition-all duration-300 ${isMe ? 'bg-white/[0.06] border border-white/[0.12]' : 'bg-white/[0.02] border border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]'}`}>
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Rank */}
                    <div className="w-10 flex-shrink-0 text-center">
                      {showRank <= 10 ? (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center font-heading text-xs mx-auto"
                          style={{ background: showRank <= 3 ? `${FG}30` : 'rgba(255,255,255,0.05)' }}>
                          {showRank <= 3 ? MEDAL_EMOJIS[showRank] : <span className="text-white/30">#{showRank}</span>}
                        </div>
                      ) : (
                        <span className="font-heading text-xs text-white/20">#{showRank}</span>
                      )}
                    </div>

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/[0.06]">
                        <img src={AVATARS[b.rank % AVATARS.length]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-heading text-sm tracking-wider uppercase text-white truncate">
                            {b.name}
                          </p>
                          {isMe && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-heading tracking-widest uppercase" style={{ background: `${FG}30`, color: FG }}>You</span>}
                        </div>
                        {b.city && (
                          <div className="flex items-center gap-1 text-[10px] text-white/30 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />{b.city}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Retreats */}
                    <div className="flex items-center gap-1 w-16 sm:w-20 justify-center flex-shrink-0">
                      <div className="hidden sm:flex">
                        {Array.from({ length: Math.min(b.retreats, 3) }).map((_, j) => (
                          <span key={j} className="text-sm" style={{ marginLeft: j > 0 ? '-4px' : '0' }}>🏕️</span>
                        ))}
                      </div>
                      <span className="text-[10px] sm:text-xs text-white/40 font-mono">{b.retreats}</span>
                    </div>

                    {/* Points */}
                    <div className="w-28 text-right flex-shrink-0">
                      <p className="font-heading text-lg" style={{ color: FG }}>{b.points.toLocaleString()}</p>
                      <p className="text-[9px] text-white/20 tracking-widest uppercase -mt-0.5">pts</p>
                    </div>

                    {/* Progress bar */}
                    {brothers[0]?.points > 0 && (
                      <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-[2px] rounded-full overflow-hidden opacity-30">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(b.points / brothers[0].points) * 100}%`, background: `linear-gradient(90deg, ${FG}, #4CAF50)` }} />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
            <Button onClick={handleLoadMore} variant="outline" className="font-heading tracking-wider uppercase text-xs border-white/20 text-white/60 hover:text-white hover:border-white/40">
              Load More — Showing {brothers.length} of {totalCount.toLocaleString()}
            </Button>
          </motion.div>
        )}

        {!hasMore && brothers.length > 0 && (
          <p className="text-center mt-8 text-[10px] font-heading tracking-widest uppercase text-white/20">
            Showing all {brothers.length.toLocaleString()} brothers
          </p>
        )}

        {/* Bottom CTA */}
        {!user && !hasMore && (
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 text-center bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
            <Crown className="w-8 h-8 mx-auto mb-3 text-white/20" />
            <h3 className="font-heading text-xl tracking-wider uppercase text-white mb-2">Want Your Name Here?</h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">Sign up, take the pledge, buy gear, attend retreats, and earn your way onto the board.</p>
            <Link to="/auth/signup">
              <Button className="font-heading tracking-wider uppercase" style={{ background: FG }}>
                Join the Brotherhood <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        )}
      </section>
    </div>
  );
}

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
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a1a 40%, #0a0a0a 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" style={{ color: SAND }} />
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>Monthly</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white leading-none">Challenges</h1>
          <p className="text-white/50 mt-3">Complete challenges, earn points, unlock badges.</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/[0.12] transition-all">
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="text-[10px] font-heading tracking-wider uppercase text-white/30">Ends {c.deadline}</span>
            </div>
            <h3 className="font-heading text-sm tracking-wider uppercase text-white mb-1">{c.title}</h3>
            <p className="text-xs text-white/40 mb-4">Reward: <span style={{ color: FG }}>{c.reward}</span></p>
            {c.total > 1 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/30 mb-1"><span>Progress</span><span>{c.progress}/{c.total}</span></div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
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

function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('pledge_accepted', true),
      supabase.from('events').select('id', { count: 'exact', head: true }).eq('type', 'retreat'),
      supabase.from('loyalty_transactions').select('points_amount').eq('type', 'earn'),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    ]).then(([pledged, retreats, transactions, posts]) => {
      const totalPoints = (transactions.data || []).reduce((sum, t) => sum + (t.points_amount || 0), 0);
      setStats({ brothersPledged: pledged.count || 0, retreatsHeld: retreats.count || 0, pointsEarned: totalPoints, blogPosts: posts.count || 0 });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const S = [
    { label: 'Brothers Pledged', value: stats?.brothersPledged?.toLocaleString() || '—', icon: '🌿', desc: 'Active brotherhood members' },
    { label: 'Retreats Held', value: stats?.retreatsHeld?.toLocaleString() || '—', icon: '🏕️', desc: 'Transforming lives since 2021' },
    { label: 'Points Earned', value: stats?.pointsEarned ? (stats.pointsEarned / 1000).toFixed(1) + 'K' : '—', icon: '⭐', desc: 'Total brotherhood points earned' },
    { label: 'Blog Posts', value: stats?.blogPosts?.toLocaleString() || '—', icon: '📖', desc: 'Stories from the field' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a2a1a 40%, #0a0a0a 100%)' }}>
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4" style={{ color: SAND }} />
            <span className="text-xs font-heading tracking-[0.3em] uppercase" style={{ color: SAND }}>By the Numbers</span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl tracking-wide uppercase text-white leading-none">Brotherhood Statistics</h1>
          <p className="text-white/50 mt-3">Live anonymous impact of the movement.</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {S.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-white/[0.12] transition-all">
            <div className="text-4xl mb-3">{s.icon}</div>
            <div className="font-heading text-4xl text-white mb-1" style={{ color: FG }}>{s.value}</div>
            <p className="font-heading text-xs tracking-[0.2em] uppercase text-white mb-1">{s.label}</p>
            <p className="text-xs text-white/40">{s.desc}</p>
          </motion.div>
        ))}
      </div>
      {loading && <div className="flex justify-center py-8"><div className="w-6 h-6 border-4 border-primary/20 border-t-primary rounded-full animate-spin" /></div>}
    </div>
  );
}

export default function BrotherhoodHub() {
  const location = useLocation();
  if (location.pathname.includes('/leaderboard')) return <><SEO title="Brotherhood Leaderboard — BOYZ IN THE WOODZ" description="Top brothers ranked by loyalty points, retreats, and engagement." canonical="/brotherhood/leaderboard" /><Leaderboard /></>;
  if (location.pathname.includes('/challenges')) return <><SEO title="Brotherhood Challenges — BOYZ IN THE WOODZ" description="Complete monthly challenges, earn points, and unlock badges." canonical="/brotherhood/challenges" /><Challenges /></>;
  if (location.pathname.includes('/statistics')) return <><SEO title="Brotherhood Statistics — BOYZ IN THE WOODZ" description="Live impact numbers from the Boyz In The Woodz brotherhood movement." canonical="/brotherhood/statistics" /><Statistics /></>;
  return <><SEO title="Brotherhood Leaderboard — BOYZ IN THE WOODZ" description="Top brothers ranked by loyalty points." canonical="/brotherhood" /><Leaderboard /></>;
}
