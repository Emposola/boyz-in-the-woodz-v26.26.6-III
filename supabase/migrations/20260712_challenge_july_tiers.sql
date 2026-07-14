-- ============================================================
-- CHALLENGE TIERS (ACTIVE NOW) — July 2026
-- The previous tier migration seeded August (future-dated, not yet active).
-- This seeds 3 active tiers for the CURRENT month so they show immediately.
-- Also removes the old single "july-2026-proofs" to avoid a duplicate.
-- ============================================================

DELETE FROM monthly_challenges WHERE slug = 'july-2026-proofs';

INSERT INTO monthly_challenges (slug, title, description, goal_type, goal_target, start_date, end_date, prize_points)
VALUES
  (
    'jul-2026-bronze',
    'Bronze: Share 1 Proof',
    'Bronze tier — Share 1 moment from the outdoors this month. A sunrise. A trail. A campfire. Every brother starts somewhere.',
    'proofs',
    1,
    '2026-07-01T00:00:00Z',
    '2026-07-31T23:59:59Z',
    100
  ),
  (
    'jul-2026-silver',
    'Silver: Share 3 Proofs',
    'Silver tier — Upload 3 outdoor moments this month. Show us where you find your reset. The woods are calling.',
    'proofs',
    3,
    '2026-07-01T00:00:00Z',
    '2026-07-31T23:59:59Z',
    300
  ),
  (
    'jul-2026-gold',
    'Gold: Share 5 Proofs',
    'Gold tier — Share 5 moments from the wild. Deep immersion. True brotherhood. Only the dedicated earn gold.',
    'proofs',
    5,
    '2026-07-01T00:00:00Z',
    '2026-07-31T23:59:59Z',
    500
  )
ON CONFLICT (slug) DO NOTHING;
