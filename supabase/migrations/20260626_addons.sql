CREATE TABLE IF NOT EXISTS addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage addons" ON addons;
CREATE POLICY "Admins can manage addons" ON addons FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

DROP POLICY IF EXISTS "Anyone can read addons" ON addons;
CREATE POLICY "Anyone can read addons" ON addons FOR SELECT USING (true);

INSERT INTO addons (name, price, description, active) VALUES
  ('Shampoo & Condition', 8, 'Deep cleanse with premium botanical shampoo and conditioner', true),
  ('Hold Steady Pomade', 12, 'Light-hold matte pomade for all-day texture', true),
  ('Beard Oil Treatment', 10, 'Nourishing argan & jojoba oil blend with hot towel', true),
  ('Scalp Massage (10 min)', 15, 'Therapeutic scalp massage releasing tension', true);
