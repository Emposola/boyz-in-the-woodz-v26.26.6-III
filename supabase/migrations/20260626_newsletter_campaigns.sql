-- Campaigns table
CREATE TABLE IF NOT EXISTS public.newsletter_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  body_html text NOT NULL,
  body_text text DEFAULT '',
  status text DEFAULT 'draft',
  sent_at timestamptz,
  recipient_count integer DEFAULT 0,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage campaigns"
  ON public.newsletter_campaigns
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Unsubscribes table
CREATE TABLE IF NOT EXISTS public.newsletter_unsubscribes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL REFERENCES public.newsletter_subscribers(email),
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.newsletter_unsubscribes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert unsubscribe"
  ON public.newsletter_unsubscribes
  FOR INSERT
  WITH CHECK (true);
