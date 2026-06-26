CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  active boolean DEFAULT true,
  source text DEFAULT 'footer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
ALTER TABLE public.newsletter_subscribers ADD COLUMN IF NOT EXISTS source text DEFAULT 'footer';

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can insert their email" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Authenticated users can view" ON public.newsletter_subscribers;

CREATE POLICY "Anyone can insert" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view" ON public.newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON public.newsletter_subscribers(active);
