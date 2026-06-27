ALTER TABLE barbers ADD COLUMN IF NOT EXISTS first_aid_certified boolean DEFAULT false;
ALTER TABLE barbers ADD COLUMN IF NOT EXISTS wilderness_certified boolean DEFAULT false;

DROP POLICY IF EXISTS "Admins can manage barbers" ON barbers;
CREATE POLICY "Admins can manage barbers" ON barbers FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
) WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
);

UPDATE barbers SET first_aid_certified = true, wilderness_certified = true, image_url = '/images/logos/team-photo.png' WHERE image_url IS NULL OR image_url = '';
