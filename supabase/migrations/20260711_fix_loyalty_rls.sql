-- ============================================================
-- Migration: Fix RLS for loyalty_transactions and profiles
-- Allows users to insert their own loyalty_transactions
-- and update their own profiles.loyalty_points
-- ============================================================

-- Allow users to insert their own loyalty transactions
DROP POLICY IF EXISTS "Users can insert own loyalty transactions" ON loyalty_transactions;
CREATE POLICY "Users can insert own loyalty transactions" ON loyalty_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile (loyalty_points, last_active_at, etc.)
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Grant usage on sequences if needed (for serial columns)
