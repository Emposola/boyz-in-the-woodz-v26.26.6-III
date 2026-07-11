import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, x-supabase-auth',
};

const BADGE_THRESHOLDS = {
  'first-step': 100,
  'early-adopter': 200,
  'gearhead': 200,
  'storyteller': 250,
  'connector': 300,
  'trailblazer': 300,
  'streak-master': 400,
  'champion': 500,
  'veteran': 500,
  'brotherhood-pillar': 5000,
};

const POINTS_BY_BADGE = {
  'first-step': 100,
  'early-adopter': 200,
  'trailblazer': 300,
  'veteran': 500,
  'storyteller': 250,
  'gearhead': 200,
  'connector': 300,
  'champion': 500,
  'streak-master': 400,
  'brotherhood-pillar': 1000,
};

async function checkAndAwardBadges(supabase, userId, totalPoints) {
  try {
    const { data: earned, error: earnErr } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId);
    if (earnErr) { console.error('check badges fetch error:', earnErr); return []; }

    const earnedIds = new Set((earned || []).map((e) => e.badge_id));

    const { data: allBadges, error: badgeErr } = await supabase
      .from('badges')
      .select('id, slug')
      .eq('active', true);
    if (badgeErr) { console.error('badges fetch error:', badgeErr); return []; }

    const awarded = [];

    for (const badge of allBadges || []) {
      if (earnedIds.has(badge.id)) continue;

      const threshold = BADGE_THRESHOLDS[badge.slug];
      if (!threshold || totalPoints < threshold) continue;

      const { error: ubErr } = await supabase.from('user_badges').insert({
        user_id: userId,
        badge_id: badge.id,
      });
      if (ubErr) { console.error(`user_badges insert error for ${badge.slug}:`, ubErr); continue; }

      const badgePts = POINTS_BY_BADGE[badge.slug] || 0;

      if (badgePts > 0) {
        const { error: ltErr } = await supabase.from('loyalty_transactions').insert({
          user_id: userId,
          points_amount: badgePts,
          type: 'earn',
          source: 'badge',
          description: `Earned "${badge.slug}" badge (+${badgePts} bonus points)`,
        });
        if (ltErr) console.error(`loyalty_transactions insert error for badge ${badge.slug}:`, ltErr);

        const { data: prof, error: pErr } = await supabase
          .from('profiles')
          .select('loyalty_points')
          .eq('id', userId)
          .single();
        if (!pErr && prof) {
          await supabase
            .from('profiles')
            .update({ loyalty_points: (prof.loyalty_points || 0) + badgePts })
            .eq('id', userId);
        }
      }

      await supabase.from('activity_feed').insert({
        user_id: userId,
        action_type: 'badge_earned',
        description: `Earned the "${badge.slug}" badge`,
        points: badgePts,
        metadata: { badge_slug: badge.slug },
      });

      awarded.push(badge.slug);
    }

    return awarded;
  } catch (err) {
    console.error('checkAndAwardBadges caught:', err);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { user_id, action, points, description, metadata } = await req.json();

    if (!user_id || !action || points === undefined) {
      return new Response(JSON.stringify({
        error: 'Missing required fields: user_id, action, points',
      }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Insert loyalty transaction
    const { error: ltErr } = await supabase.from('loyalty_transactions').insert({
      user_id,
      points_amount: points,
      type: 'earn',
      source: action,
      description: description || `${action} reward (${points} pts)`,
    });
    if (ltErr) {
      console.error('loyalty_transactions insert error:', ltErr);
      return new Response(JSON.stringify({ error: `loyalty_transactions insert failed: ${ltErr.message}` }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 2. Update profile points + last_active
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('loyalty_points')
      .eq('id', user_id)
      .single();
    if (profErr) {
      console.error('profile fetch error:', profErr);
      return new Response(JSON.stringify({ error: `profile fetch failed: ${profErr.message}` }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const currentPoints = profile?.loyalty_points || 0;
    const newTotal = currentPoints + points;

    const { error: upErr } = await supabase
      .from('profiles')
      .update({
        loyalty_points: newTotal,
        last_active_at: new Date().toISOString(),
      })
      .eq('id', user_id);
    if (upErr) {
      console.error('profile update error:', upErr);
      return new Response(JSON.stringify({ error: `profile update failed: ${upErr.message}` }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 3. Add to activity feed
    const { error: afErr } = await supabase.from('activity_feed').insert({
      user_id,
      action_type: action,
      description: description || `${action} reward`,
      points,
      metadata: metadata || null,
    });
    if (afErr) {
      console.error('activity_feed insert error:', afErr);
      return new Response(JSON.stringify({ error: `activity_feed insert failed: ${afErr.message}` }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 4. Check + award badges
    const badgesAwarded = await checkAndAwardBadges(supabase, user_id, newTotal);

    return new Response(JSON.stringify({
      success: true,
      points_awarded: points,
      total_points: newTotal,
      badges_awarded: badgesAwarded,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (err) {
    console.error('award-points error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
