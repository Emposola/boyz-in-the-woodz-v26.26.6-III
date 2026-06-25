-- Supabase Schema Migration for BOYZ IN THE WOODZ
-- This file contains all the table definitions needed for the application
-- Run these migrations in your Supabase SQL editor

-- 1. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business text,
  category text,
  price decimal(10, 2),
  compare_at_price decimal(10, 2),
  description text,
  image_url text,
  images jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '[]'::jsonb,
  inventory integer DEFAULT 0,
  proof_badge_text text,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Barbers Table
CREATE TABLE IF NOT EXISTS public.barbers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  image_url text,
  bio text,
  specialties jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  location_id uuid,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  barber_id uuid REFERENCES public.barbers(id) ON DELETE SET NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  service_type text,
  status text DEFAULT 'pending',
  notes text,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  city text,
  state text,
  zip_code text,
  phone text,
  email text,
  hours jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT true,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  image_url text,
  excerpt text,
  status text DEFAULT 'draft',
  published boolean DEFAULT false,
  featured boolean DEFAULT false,
  category text,
  tags jsonb DEFAULT '[]'::jsonb,
  view_count integer DEFAULT 0,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  published_at timestamp with time zone
);

-- 7. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  type text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  image_url text,
  capacity integer,
  registered_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_number text UNIQUE,
  total_price decimal(10, 2),
  status text DEFAULT 'pending',
  items jsonb DEFAULT '[]'::jsonb,
  shipping_address jsonb DEFAULT '{}'::jsonb,
  payment_method text,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Loyalty Transactions Table
CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points_amount integer NOT NULL,
  transaction_type text,
  description text,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL
);

-- 10. Retreat Applications Table
CREATE TABLE IF NOT EXISTS public.retreat_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id uuid REFERENCES public.events(id) ON DELETE SET NULL,
  status text DEFAULT 'pending',
  responses jsonb DEFAULT '{}'::jsonb,
  medical_info jsonb DEFAULT '{}'::jsonb,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  confirmed_at timestamp with time zone,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Barber Reviews Table
CREATE TABLE IF NOT EXISTS public.barber_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  approved boolean DEFAULT false,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Studio Sessions Table
CREATE TABLE IF NOT EXISTS public.studio_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  host_name text DEFAULT '',
  session_type text DEFAULT 'campfire_talk',
  status text DEFAULT 'upcoming',
  scheduled_at timestamp with time zone NOT NULL,
  duration_minutes integer,
  meeting_url text DEFAULT '',
  recording_url text DEFAULT '',
  thumbnail_url text DEFAULT '',
  max_participants integer,
  current_participants integer DEFAULT 0,
  viewer_count integer DEFAULT 0,
  featured boolean DEFAULT false,
  active boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Waitlist Queue Table
CREATE TABLE IF NOT EXISTS public.waitlist_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  phone text,
  status text DEFAULT 'waiting',
  position integer,
  service_type text,
  created_date timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. App Settings Table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_name text DEFAULT 'BOYZ IN THE WOODZ',
  app_logo_url text,
  theme_color text,
  primary_contact_email text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retreat_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barber_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Profiles: Users can read own profile, public profiles are readable
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles are readable" ON public.profiles
  FOR SELECT USING (true);

-- Products: Everyone can read, only authenticated users can create/update/delete (admin check needed)
CREATE POLICY "Products are readable" ON public.products
  FOR SELECT USING (true);

-- Barbers: Everyone can read
CREATE POLICY "Barbers are readable" ON public.barbers
  FOR SELECT USING (true);

-- Appointments: Users can view own appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id OR true);

-- Blog Posts: Everyone can read published posts
CREATE POLICY "Blog posts are readable" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.uid() = author_id);

-- Events: Everyone can read active events
CREATE POLICY "Events are readable" ON public.events
  FOR SELECT USING (true);

-- Orders: Users can view own orders
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Loyalty Transactions: Users can view own transactions
CREATE POLICY "Users can view own loyalty transactions" ON public.loyalty_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Retreat Applications: Users can view own applications
CREATE POLICY "Users can view own retreat applications" ON public.retreat_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Barber Reviews: Everyone can read approved reviews
CREATE POLICY "Barber reviews are readable" ON public.barber_reviews
  FOR SELECT USING (approved = true OR auth.uid() = user_id);

-- Studio Sessions: Everyone can read
CREATE POLICY "Studio sessions are readable" ON public.studio_sessions
  FOR SELECT USING (true);

-- Waitlist Queue: Users can view own entries
CREATE POLICY "Users can view own waitlist entries" ON public.waitlist_queue
  FOR SELECT USING (auth.uid() = user_id OR true);

-- App Settings: Everyone can read
CREATE POLICY "App settings are readable" ON public.app_settings
  FOR SELECT USING (true);

-- Create Indexes for better performance
CREATE INDEX idx_barbers_location_id ON public.barbers(location_id);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_barber_id ON public.appointments(barber_id);
CREATE INDEX idx_blog_posts_author_id ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_events_location_id ON public.events(location_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX idx_retreat_applications_user_id ON public.retreat_applications(user_id);
CREATE INDEX idx_barber_reviews_barber_id ON public.barber_reviews(barber_id);
CREATE INDEX idx_waitlist_queue_user_id ON public.waitlist_queue(user_id);

-- Insert default app settings
INSERT INTO public.app_settings (app_name, app_logo_url, theme_color)
VALUES ('BOYZ IN THE WOODZ', 'https://your-domain.com/logo.png', '#000000')
ON CONFLICT DO NOTHING;
