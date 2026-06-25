-- Migration: Add missing columns to studio_sessions for admin-managed dynamic content
-- Adds: slug, host_name, session_type, status, meeting_url, recording_url,
--       thumbnail_url, max_participants, current_participants, viewer_count,
--       featured, tags
-- Old columns (instructor, max_capacity, registered_count, live_url) left in
-- place for safety — code now reads/writes the new columns.

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
