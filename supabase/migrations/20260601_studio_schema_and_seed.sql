-- ============================================================
-- 1. MIGRATION: Add new columns to studio_sessions
-- ============================================================
ALTER TABLE public.studio_sessions
  ADD COLUMN IF NOT EXISTS slug text UNIQUE,
  ADD COLUMN IF NOT EXISTS host_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'campfire_talk',
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming',
  ADD COLUMN IF NOT EXISTS meeting_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS recording_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '',
  ADD COLUMN IF NOT EXISTS max_participants integer,
  ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS viewer_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Constraints
ALTER TABLE public.studio_sessions DROP CONSTRAINT IF EXISTS studio_sessions_status_check;
ALTER TABLE public.studio_sessions ADD CONSTRAINT studio_sessions_status_check
  CHECK (status IN ('upcoming', 'live', 'recorded'));

ALTER TABLE public.studio_sessions DROP CONSTRAINT IF EXISTS studio_sessions_session_type_check;
ALTER TABLE public.studio_sessions ADD CONSTRAINT studio_sessions_session_type_check
  CHECK (session_type IN ('retreat_prep', 'mens_circle', 'barber_live', 'campfire_talk', 'q_and_a', 'announcement'));

-- Indexes
CREATE INDEX IF NOT EXISTS idx_studio_sessions_slug ON public.studio_sessions(slug);
CREATE INDEX IF NOT EXISTS idx_studio_sessions_status ON public.studio_sessions(status);
CREATE INDEX IF NOT EXISTS idx_studio_sessions_featured ON public.studio_sessions(featured);

-- ============================================================
-- 2. SEED: Initial sessions so the Studio page has content
-- ============================================================
INSERT INTO public.studio_sessions (title, slug, description, host_name, session_type, status, scheduled_at, duration_minutes, meeting_url, recording_url, thumbnail_url, viewer_count, featured, active, tags)
VALUES
  (
    'The Code: A 5-Rule Deep Dive',
    'the-code-deep-dive',
    'Brotherhood leadership breaks down each of the 5 rules with stories from the field. This is the session that made 200+ men apply for retreat.',
    'Marcus Trail',
    'campfire_talk',
    'recorded',
    NOW() - INTERVAL '3 days',
    90,
    '',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1200&q=85',
    4200,
    true,
    true,
    ARRAY['the-code', 'brotherhood', 'recorded']
  ),
  (
    'New Member Q&A — What to Expect at Your First Retreat',
    'new-member-qa',
    'Everything you have been afraid to ask. 60 minutes of honest answers from a man who has facilitated 30+ retreats. No sugarcoating.',
    'Coach Mike',
    'q_and_a',
    'recorded',
    NOW() - INTERVAL '7 days',
    60,
    '',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85',
    2800,
    false,
    true,
    ARRAY['q-and-a', 'new-members', 'retreat']
  ),
  (
    'Archetypes Workshop: Which Man Are You?',
    'archetypes-workshop',
    'A live workshop guiding men through the four archetypes. Includes breakout discussions, live polls, and brutally honest self-assessment.',
    'Dr. Antoine G. & Marcus Trail',
    'retreat_prep',
    'recorded',
    NOW() - INTERVAL '14 days',
    80,
    '',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85',
    1900,
    false,
    true,
    ARRAY['archetypes', 'workshop', 'identity']
  ),
  (
    'Fall Retreat Announcement — Big Bend 2025',
    'big-bend-announcement',
    'The official reveal of our most ambitious retreat yet. Dates, itinerary, capacity, pricing, and what makes Big Bend different from anything we have done.',
    'Brotherhood Team',
    'announcement',
    'recorded',
    NOW() - INTERVAL '21 days',
    45,
    '',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=85',
    5100,
    false,
    true,
    ARRAY['big-bend', 'announcement', 'retreat']
  ),
  (
    'Behind the Chair with Dre — Live Cut Session',
    'behind-the-chair-dre',
    'Watch Dre work in real time. Ask questions, learn technique, and hear the conversations that happen when the clippers are running.',
    'Dre Williams',
    'barber_live',
    'recorded',
    NOW() - INTERVAL '5 days',
    60,
    '',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=85',
    2300,
    false,
    true,
    ARRAY['barber', 'technique', 'recorded']
  ),
  (
    'Campfire Sessions #12 — On Grief, Loss & Brotherhood',
    'campfire-sessions-12',
    'An open men is circle around what none of us were taught: how to hold grief without losing yourself. Join live this Thursday.',
    'Coach Mike',
    'campfire_talk',
    'upcoming',
    NOW() + INTERVAL '3 days',
    90,
    'https://www.youtube.com/embed/live_stream?channel=UCxxxxxx',
    '',
    'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1200&q=85',
    0,
    true,
    true,
    ARRAY['grief', 'campfire', 'upcoming']
  ),
  (
    'Behind The Chair: Advanced Fade Masterclass',
    'advanced-fade-masterclass',
    'Watch Dre teach the Brotherhood barbers advanced fading and blending techniques. Open to the public — earn 50 points for watching live.',
    'Dre Williams',
    'barber_live',
    'upcoming',
    NOW() + INTERVAL '6 days',
    75,
    'https://www.youtube.com/embed/live_stream?channel=UCxxxxxx',
    '',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200&q=85',
    0,
    false,
    true,
    ARRAY['barber', 'technique', 'upcoming']
  )
ON CONFLICT (slug) DO NOTHING;
