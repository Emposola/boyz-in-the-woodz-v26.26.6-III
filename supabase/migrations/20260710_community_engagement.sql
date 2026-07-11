-- ============================================================
-- COMMUNITY ENGAGEMENT — Tables, columns, seed data, RLS
-- Phase 1: Foundation for real DB-backed engagement pages
-- ============================================================

-- ─── PROFILE COLUMNS ───
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS loyalty_points integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pledge_accepted boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pledged_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS directory_opt_in boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS archetype text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests text[];
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_active_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- ─── BADGES ───
DROP TABLE IF EXISTS story_likes CASCADE;
DROP TABLE IF EXISTS challenge_progress CASCADE;
DROP TABLE IF EXISTS activity_feed CASCADE;
DROP TABLE IF EXISTS challenge_participants CASCADE;
DROP TABLE IF EXISTS monthly_challenges CASCADE;
DROP TABLE IF EXISTS connections CASCADE;
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  category text DEFAULT 'general',
  points integer DEFAULT 0,
  requirements jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE monthly_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  goal_type text DEFAULT 'proofs' CHECK (goal_type IN ('proofs', 'points', 'retreats', 'journal', 'referrals')),
  goal_target integer DEFAULT 1,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  prize_points integer DEFAULT 500,
  prize_badge_id uuid REFERENCES badges(id),
  active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES monthly_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed_at timestamptz,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

CREATE TABLE activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL CHECK (action_type IN (
    'welcome_bonus', 'purchase', 'retreat_survey', 'journal_approved',
    'badge_earned', 'challenge_joined', 'challenge_completed',
    'connection_sent', 'connection_accepted', 'barber_booking',
    'pledge_taken', 'story_submitted', 'points_awarded', 'referral'
  )),
  description text,
  points integer DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE story_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  story_id uuid NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_loyalty_points ON profiles(loyalty_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_directory_opt_in ON profiles(directory_opt_in) WHERE directory_opt_in = true;
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_recipient ON connections(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON connections(status);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_challenge ON challenge_participants(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_participants_user ON challenge_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_action ON activity_feed(action_type);
CREATE INDEX IF NOT EXISTS idx_story_likes_story ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_monthly_challenges_active ON monthly_challenges(active) WHERE active = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all new tables
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;

-- BADGES — public read, admin write
DROP POLICY IF EXISTS "Badges are public read" ON badges;
CREATE POLICY "Badges are public read" ON badges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage badges" ON badges;
CREATE POLICY "Admins can manage badges" ON badges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- USER BADGES — users read own, admin all, insert via trigger only
DROP POLICY IF EXISTS "Users can read own badges" ON user_badges;
CREATE POLICY "Users can read own badges" ON user_badges FOR SELECT USING (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

DROP POLICY IF EXISTS "Service can insert user badges" ON user_badges;
CREATE POLICY "Service can insert user badges" ON user_badges FOR INSERT WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- CONNECTIONS — users manage their own
DROP POLICY IF EXISTS "Users can read own connections" ON connections;
CREATE POLICY "Users can read own connections" ON connections FOR SELECT USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);

DROP POLICY IF EXISTS "Users can insert connections" ON connections;
CREATE POLICY "Users can insert connections" ON connections FOR INSERT WITH CHECK (
  auth.uid() = requester_id
);

DROP POLICY IF EXISTS "Users can update their connections" ON connections;
CREATE POLICY "Users can update their connections" ON connections FOR UPDATE USING (
  auth.uid() = requester_id OR auth.uid() = recipient_id
) WITH CHECK (
  auth.uid() = requester_id OR auth.uid() = recipient_id
);

-- MONTHLY CHALLENGES — public read, admin write
DROP POLICY IF EXISTS "Challenges are public read" ON monthly_challenges;
CREATE POLICY "Challenges are public read" ON monthly_challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage challenges" ON monthly_challenges;
CREATE POLICY "Admins can manage challenges" ON monthly_challenges FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- CHALLENGE PARTICIPANTS — public read for leaderboard, user insert own
DROP POLICY IF EXISTS "Challenge participants public read" ON challenge_participants;
CREATE POLICY "Challenge participants public read" ON challenge_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join challenges" ON challenge_participants;
CREATE POLICY "Users can join challenges" ON challenge_participants FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can update own progress" ON challenge_participants;
CREATE POLICY "Users can update own progress" ON challenge_participants FOR UPDATE USING (
  auth.uid() = user_id
) WITH CHECK (
  auth.uid() = user_id
);

-- ACTIVITY FEED — public read, insert via service
DROP POLICY IF EXISTS "Activity feed public read" ON activity_feed;
CREATE POLICY "Activity feed public read" ON activity_feed FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service can insert activity" ON activity_feed;
CREATE POLICY "Service can insert activity" ON activity_feed FOR INSERT WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- STORY LIKES — authenticated users manage own
DROP POLICY IF EXISTS "Story likes public read" ON story_likes;
CREATE POLICY "Story likes public read" ON story_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like" ON story_likes;
CREATE POLICY "Authenticated users can like" ON story_likes FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can unlike" ON story_likes;
CREATE POLICY "Users can unlike" ON story_likes FOR DELETE USING (
  auth.uid() = user_id
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Badge definitions
INSERT INTO badges (slug, name, description, icon, category, points) VALUES
  ('first-step', 'First Step', 'Joined the brotherhood. Welcome.', 'footprints', 'pledge', 100),
  ('early-adopter', 'Early Adopter', 'One of the first 1,000 brothers to take the pledge.', 'zap', 'pledge', 200),
  ('trailblazer', 'Trailblazer', 'Attended your first retreat.', 'tree-pine', 'retreats', 300),
  ('veteran', 'Veteran', 'Attended 3+ retreats. The woods know your name.', 'shield', 'retreats', 500),
  ('storyteller', 'Storyteller', 'Shared your story in the journal and it was published.', 'book-open', 'content', 250),
  ('gearhead', 'Gearhead', 'Placed your first order from the survival shop.', 'shopping-bag', 'proofs', 200),
  ('connector', 'Connector', 'Connected with 5 brothers through the directory.', 'users', 'community', 300),
  ('champion', 'Champion', 'Won a monthly challenge.', 'trophy', 'challenges', 500),
  ('streak-master', 'Streak Master', 'Active for 30 consecutive days.', 'flame', 'streak', 400),
  ('brotherhood-pillar', 'Brotherhood Pillar', 'Earned 5,000+ loyalty points. True pillar of the community.', 'crown', 'leadership', 1000)
ON CONFLICT (slug) DO NOTHING;

-- Current month's challenge (July 2026)
INSERT INTO monthly_challenges (slug, title, description, goal_type, goal_target, start_date, end_date, prize_points)
VALUES (
  'july-2026-proofs',
  'Share 3 Proofs of Nature',
  'Upload 3 moments from the outdoors this month. A sunrise. A trail. A campfire. Show us where you find your reset.',
  'proofs',
  3,
  '2026-07-01T00:00:00Z',
  '2026-07-31T23:59:59Z',
  500
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- EXISTING USERS: Give them a loyalty_points baseline
-- Sum up their existing loyalty_transactions into profiles
-- ============================================================
UPDATE profiles p
SET loyalty_points = COALESCE((
  SELECT SUM(points_amount)
  FROM loyalty_transactions lt
  WHERE lt.user_id = p.id
), 0)
WHERE p.loyalty_points = 0;
