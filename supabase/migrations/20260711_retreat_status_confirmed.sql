-- ============================================================
-- Migration: Swap 'approved' → 'confirmed' in status check
-- ============================================================

-- First migrate all existing rows to valid statuses
UPDATE retreat_applications SET status = 'confirmed' WHERE status IN ('approved', 'attended');
UPDATE retreat_applications SET status = 'rejected' WHERE status IN ('cancelled', 'canceled');
UPDATE retreat_applications SET status = 'pending' WHERE status IS NULL OR status NOT IN ('pending', 'confirmed', 'waitlist', 'rejected');

-- Drop old constraint, create new one
ALTER TABLE retreat_applications DROP CONSTRAINT IF EXISTS retreat_applications_status_check;
ALTER TABLE retreat_applications ADD CONSTRAINT retreat_applications_status_check
  CHECK (status IN ('pending', 'confirmed', 'waitlist', 'rejected'));
