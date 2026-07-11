-- ============================================================
-- Migration: Retreat System Overhaul
-- Adds missing columns, payment tracking, proper status flow
-- ============================================================

-- ── Events table: Add missing retreat fields ──
ALTER TABLE events ADD COLUMN IF NOT EXISTS full_price integer;
ALTER TABLE events ADD COLUMN IF NOT EXISTS deposit_amount integer;
ALTER TABLE events ADD COLUMN IF NOT EXISTS difficulty text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS duration integer;
ALTER TABLE events ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_name text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS spots_remaining integer;

-- ── Retreat Applications: Add payment & tracking fields ──
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS deposit_paid boolean DEFAULT false;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS deposit_amount integer DEFAULT 0;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS balance_paid boolean DEFAULT false;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS balance_amount integer DEFAULT 0;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS total_amount integer DEFAULT 0;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS paid_in_full boolean DEFAULT false;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS stripe_deposit_payment_id text;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS stripe_balance_payment_id text;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS attended boolean DEFAULT false;

-- ── Seed some retreat events so the app doesn't fall back to hardcoded data ──
INSERT INTO events (title, location_name, description, type, full_price, deposit_amount, difficulty, duration, start_date, end_date, capacity, spots_remaining, active, featured)
VALUES
  ('Broken Bow Fall Reset', 'Broken Bow, OK', 'A weekend of brotherhood, campfires, and reset in the pines.', 'retreat', 297, 100, 'Easy', 2, '2026-09-18T14:00:00Z', '2026-09-20T12:00:00Z', 20, 20, true, true),
  ('Ouachita Deep Dive', 'Ouachita National Forest, AR', 'Three days of deep work, hiking, and brotherhood.', 'retreat', 497, 150, 'Moderate', 3, '2026-10-09T14:00:00Z', '2026-10-12T12:00:00Z', 15, 15, true, true),
  ('Ozark Expedition', 'Ozark National Forest, AR', 'The ultimate brotherhood challenge. 5 days of expedition, survival, and transformation.', 'retreat', 897, 250, 'Hard', 5, '2026-11-06T14:00:00Z', '2026-11-11T12:00:00Z', 10, 10, true, true)
ON CONFLICT (id) DO NOTHING;

-- ── RLS: Allow users to read their own application payment fields ──
DROP POLICY IF EXISTS "Users can view own retreat applications" ON retreat_applications;
CREATE POLICY "Users can view own retreat applications" ON retreat_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Allow public read of retreat_applications for leaderboard display
DROP POLICY IF EXISTS "Public can view retreat applications for leaderboard" ON retreat_applications;
CREATE POLICY "Public can view retreat applications for leaderboard" ON retreat_applications
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own retreat applications" ON retreat_applications;
CREATE POLICY "Users can insert own retreat applications" ON retreat_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own retreat applications" ON retreat_applications;
CREATE POLICY "Users can update own retreat applications" ON retreat_applications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
