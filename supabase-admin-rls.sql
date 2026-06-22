-- ============================================================
-- ADMIN RLS POLICIES
-- Admins (is_admin = true in profiles) can read/write everything.
-- Run this in Supabase SQL Editor.
-- ============================================================

-- Helper: reusable admin check
-- (Supabase doesn't support functions in WITH CHECK directly,
--  so we inline the subquery each time)

-- ── retreat_applications (admin full access) ──
CREATE POLICY "Admins can manage retreat applications"
ON retreat_applications FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── profiles (admin can read all, update all) ──
CREATE POLICY "Admins can read all profiles"
ON profiles FOR SELECT
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

CREATE POLICY "Admins can update all profiles"
ON profiles FOR UPDATE
USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- ── products (admin full access) ──
CREATE POLICY "Admins can manage products"
ON products FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── orders (admin full access) ──
CREATE POLICY "Admins can manage orders"
ON orders FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── appointments (admin full access) ──
CREATE POLICY "Admins can manage appointments"
ON appointments FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── barbers (admin full access) ──
CREATE POLICY "Admins can manage barbers"
ON barbers FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── loyalty_transactions (admin can read all) ──
CREATE POLICY "Admins can manage loyalty transactions"
ON loyalty_transactions FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── events (admin full access) ──
CREATE POLICY "Admins can manage events"
ON events FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── studio_sessions (admin full access) ──
CREATE POLICY "Admins can manage studio sessions"
ON studio_sessions FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── app_settings (admin full access) ──
CREATE POLICY "Admins can manage app settings"
ON app_settings FOR ALL
USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
)
WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

-- ── Make yourself an admin (replace with your email) ──
-- UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
