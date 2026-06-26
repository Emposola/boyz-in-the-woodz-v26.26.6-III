-- Services table for The Men's Grooming Lodge
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price numeric(10,2) DEFAULT 0,
  duration_minutes integer DEFAULT 30,
  active boolean DEFAULT true,
  category text DEFAULT 'grooming',
  featured boolean DEFAULT false,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Services are readable" ON services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));

-- Payment columns for appointments
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2) DEFAULT 0;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text DEFAULT '';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_id uuid REFERENCES services(id) ON DELETE SET NULL;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_name text DEFAULT '';
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_price numeric(10,2) DEFAULT 0;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS service_duration integer DEFAULT 30;
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS addons jsonb DEFAULT '[]'::jsonb;

-- Seed services
INSERT INTO services (name, description, price, duration_minutes, category, featured) VALUES ('Haircut', 'Precision cut + hot towel finish', 35.00, 45, 'grooming', true) ON CONFLICT DO NOTHING;
INSERT INTO services (name, description, price, duration_minutes, category, featured) VALUES ('Beard Trim', 'Shape, line-up, and condition', 20.00, 20, 'grooming', false) ON CONFLICT DO NOTHING;
INSERT INTO services (name, description, price, duration_minutes, category, featured) VALUES ('Hot Towel Shave', 'Old-school straight razor experience', 45.00, 40, 'grooming', false) ON CONFLICT DO NOTHING;
INSERT INTO services (name, description, price, duration_minutes, category, featured) VALUES ('Kid''s Cut', 'Patient and fun for all ages', 25.00, 30, 'grooming', false) ON CONFLICT DO NOTHING;
INSERT INTO services (name, description, price, duration_minutes, category, featured) VALUES ('VIP Package', 'Cut + shave + shoulder massage + cold drink', 80.00, 90, 'grooming', true) ON CONFLICT DO NOTHING;
