-- Add missing columns to barbers table
ALTER TABLE barbers ADD COLUMN IF NOT EXISTS first_aid_certified boolean DEFAULT false;
ALTER TABLE barbers ADD COLUMN IF NOT EXISTS wilderness_certified boolean DEFAULT false;

-- Seed barbers
INSERT INTO barbers (name, bio, specialties, image_url, active, first_aid_certified, wilderness_certified) VALUES ('Marcus "Steady" Cole', 'Master barber with 12 years behind the chair. Specializes in fades and beard sculpting. Also a trained wilderness EMT.', '["Fades","Beard Sculpting"]', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', true, true, true) ON CONFLICT DO NOTHING;

INSERT INTO barbers (name, bio, specialties, image_url, active, first_aid_certified, wilderness_certified) VALUES ('Dre Washington', 'Known for razor-sharp lineups and patience with kids. Dre brings energy to every chair session.', '["Lineups","Kids Cuts"]', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80', true, false, false) ON CONFLICT DO NOTHING;

INSERT INTO barbers (name, bio, specialties, image_url, active, first_aid_certified, wilderness_certified) VALUES ('Tomás Rivera', 'Hot towel shave specialist who trained in traditional barbering. Retreat facilitator on weekends.', '["Hot Towel Shave","Classic Cuts"]', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', true, true, true) ON CONFLICT DO NOTHING;
