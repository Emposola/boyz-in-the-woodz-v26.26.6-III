-- ============================================================
-- Migration: Full user deletion with cascade for all data
-- Fixes FK constraints to CASCADE where missing
-- ============================================================

-- Fix profiles FK to CASCADE
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey,
  ADD CONSTRAINT profiles_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix products FK to CASCADE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'created_by') THEN
    ALTER TABLE products DROP CONSTRAINT IF EXISTS products_created_by_fkey;
    ALTER TABLE products ADD CONSTRAINT products_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix blog_posts FK to CASCADE
ALTER TABLE blog_posts
  DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey,
  ADD CONSTRAINT blog_posts_author_id_fkey
    FOREIGN KEY (author_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix events FK to CASCADE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'user_id') THEN
    ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
    ALTER TABLE events ADD CONSTRAINT events_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix retreat_applications FK to CASCADE
ALTER TABLE retreat_applications
  DROP CONSTRAINT IF EXISTS retreat_applications_user_id_fkey,
  ADD CONSTRAINT retreat_applications_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Fix newsletter_subscribers FK to CASCADE
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_subscribers' AND column_name = 'user_id') THEN
    ALTER TABLE newsletter_subscribers DROP CONSTRAINT IF EXISTS newsletter_subscribers_user_id_fkey;
    ALTER TABLE newsletter_subscribers ADD CONSTRAINT newsletter_subscribers_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix monthly_challenges.created_by FK to SET NULL (only if column exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'monthly_challenges' AND column_name = 'created_by') THEN
    ALTER TABLE monthly_challenges DROP CONSTRAINT IF EXISTS monthly_challenges_created_by_fkey;
    ALTER TABLE monthly_challenges ADD CONSTRAINT monthly_challenges_created_by_fkey
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;
