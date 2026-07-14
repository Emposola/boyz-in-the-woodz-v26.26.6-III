import { supabase } from '@/lib/supabase';

const GOAL_TYPE_QUERIES = {
  proofs: async (userId, challenge) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'published')
      .gte('created_at', challenge.start_date)
      .lte('created_at', challenge.end_date);
    if (error) return 0;
    return data.length || 0;
  },

  points: async (userId, challenge) => {
    const { data, error } = await supabase
      .from('loyalty_transactions')
      .select('points_amount')
      .eq('user_id', userId)
      .eq('type', 'earn')
      .gte('created_at', challenge.start_date)
      .lte('created_at', challenge.end_date);
    if (error) return 0;
    return (data || []).reduce((sum, t) => sum + (t.points_amount || 0), 0);
  },

  retreats: async (userId, _challenge) => {
    const { data, error } = await supabase
      .from('retreat_applications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('attended', true);
    if (error) return 0;
    return data.length || 0;
  },

  journal: async (userId, challenge) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('author_id', userId)
      .eq('status', 'published')
      .gte('created_at', challenge.start_date)
      .lte('created_at', challenge.end_date);
    if (error) return 0;
    return data.length || 0;
  },

  referrals: async (userId, _challenge) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('referred_by', userId);
    if (error) return 0;
    return data.length || 0;
  },
};

export async function calculateAutoProgress(userId, challenge) {
  if (!userId || !challenge) return 0;
  const queryFn = GOAL_TYPE_QUERIES[challenge.goal_type];
  if (!queryFn) return 0;
  const count = await queryFn(userId, challenge);
  return Math.min(count, challenge.goal_target);
}

export async function fetchActiveChallenges() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('monthly_challenges')
    .select('*')
    .eq('active', true)
    .lte('start_date', now)
    .gte('end_date', now)
    .order('goal_target', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchFutureChallenges() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('monthly_challenges')
    .select('*')
    .eq('active', true)
    .gt('start_date', now)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchPastChallenges(limit = 6) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('monthly_challenges')
    .select('*')
    .eq('active', true)
    .lt('end_date', now)
    .order('end_date', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function fetchUserParticipants(userId, challengeIds) {
  if (!userId || !challengeIds.length) return {};
  const { data, error } = await supabase
    .from('challenge_participants')
    .select('challenge_id, id, progress, completed_at')
    .eq('user_id', userId)
    .in('challenge_id', challengeIds);
  if (error) return {};
  const map = {};
  (data || []).forEach(p => { map[p.challenge_id] = p; });
  return map;
}

export async function joinChallenge(challengeId, userId) {
  const { error } = await supabase
    .from('challenge_participants')
    .insert({ challenge_id: challengeId, user_id: userId, progress: 0 });
  if (error) return error;
  supabase.from('activity_feed').insert({
    user_id: userId,
    action_type: 'challenge_joined',
    description: 'Joined a monthly challenge',
  }).then(() => {}).catch(() => {});
  return null;
}

export async function leaveChallenge(challengeId, userId) {
  const { error } = await supabase
    .from('challenge_participants')
    .delete()
    .eq('challenge_id', challengeId)
    .eq('user_id', userId);
  return error;
}

export async function fetchChallengeBySlug(slug) {
  const { data, error } = await supabase
    .from('monthly_challenges')
    .select('*')
    .eq('slug', slug)
    .single();
  if (error) return null;
  return data;
}

export async function fetchChallengeParticipants(challengeId, page = 0, pageSize = 50) {
  const rangeStart = page * pageSize;
  const rangeEnd = rangeStart + pageSize - 1;

  const { data, error, count } = await supabase
    .from('challenge_participants')
    .select('user_id, progress, completed_at, joined_at, profiles:user_id(full_name, city, avatar_url)', { count: 'exact' })
    .eq('challenge_id', challengeId)
    .order('progress', { ascending: false })
    .order('completed_at', { ascending: true, nullsLast: true })
    .range(rangeStart, rangeEnd);

  if (error) throw error;
  return {
    participants: (data || []).map((p, i) => ({
      rank: rangeStart + i + 1,
      user_id: p.user_id,
      name: p.profiles?.full_name || 'Anonymous',
      city: p.profiles?.city || null,
      avatar_url: p.profiles?.avatar_url || null,
      progress: p.progress || 0,
      completed_at: p.completed_at,
      joined_at: p.joined_at,
    })),
    total: count || 0,
    hasMore: (data || []).length === pageSize,
  };
}

export function getGoalTypeActionUrl(goalType) {
  switch (goalType) {
    case 'proofs':
    case 'journal':
      return '/journal/submit';
    case 'retreats':
      return '/retreat/apply';
    case 'referrals':
      return '/account?tab=referral';
    case 'points':
    default:
      return '/shop';
  }
}

export function getGoalTypeActionLabel(goalType) {
  switch (goalType) {
    case 'proofs':
    case 'journal':
      return 'Write a Post';
    case 'retreats':
      return 'Apply for Retreat';
    case 'referrals':
      return 'Refer a Brother';
    case 'points':
    default:
      return 'Shop & Earn';
  }
}

