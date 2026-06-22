-- ============================================================
-- ADMIN RLS POLICIES — Safe to re-run (drops before recreating)
-- Run this in Supabase SQL Editor.
-- ============================================================

-- ── retreat_applications ──
DROP POLICY IF EXISTS "Admins can manage retreat applications" ON retreat_applications;
CREATE POLICY "Admins can manage retreat applications"
ON retreat_applications FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── profiles ──
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true));

-- ── products ──
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── orders ──
DROP POLICY IF EXISTS "Admins can manage orders" ON orders;
CREATE POLICY "Admins can manage orders"
ON orders FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── appointments ──
DROP POLICY IF EXISTS "Admins can manage appointments" ON appointments;
CREATE POLICY "Admins can manage appointments"
ON appointments FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── barbers ──
DROP POLICY IF EXISTS "Admins can manage barbers" ON barbers;
CREATE POLICY "Admins can manage barbers"
ON barbers FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── loyalty_transactions ──
DROP POLICY IF EXISTS "Admins can manage loyalty transactions" ON loyalty_transactions;
CREATE POLICY "Admins can manage loyalty transactions"
ON loyalty_transactions FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── events ──
DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events"
ON events FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── studio_sessions ──
DROP POLICY IF EXISTS "Admins can manage studio sessions" ON studio_sessions;
CREATE POLICY "Admins can manage studio sessions"
ON studio_sessions FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── app_settings ──
DROP POLICY IF EXISTS "Admins can manage app settings" ON app_settings;
CREATE POLICY "Admins can manage app settings"
ON app_settings FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ── blog_posts ──
DROP POLICY IF EXISTS "Admins can manage blog posts" ON blog_posts;
CREATE POLICY "Admins can manage blog posts"
ON blog_posts FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- ============================================================
-- MAKE YOURSELF AN ADMIN
-- Replace the email below with your actual account email,
-- then uncomment and run this line separately.
-- ============================================================
-- UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
