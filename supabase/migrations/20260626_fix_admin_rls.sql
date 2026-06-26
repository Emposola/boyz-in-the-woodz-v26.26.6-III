-- Add is_admin to profiles (needed by admin RLS policies)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;

-- Allow users to insert their own retreat applications
DROP POLICY IF EXISTS "Users can insert own retreat applications" ON retreat_applications;
CREATE POLICY "Users can insert own retreat applications"
ON retreat_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Re-apply admin RLS for retreat_applications (now that is_admin exists)
DROP POLICY IF EXISTS "Admins can manage retreat applications" ON retreat_applications;
CREATE POLICY "Admins can manage retreat applications"
ON retreat_applications FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true));
