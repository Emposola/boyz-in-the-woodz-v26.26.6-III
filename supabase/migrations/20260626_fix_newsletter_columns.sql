-- Fix missing columns on existing newsletter_subscribers table
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
