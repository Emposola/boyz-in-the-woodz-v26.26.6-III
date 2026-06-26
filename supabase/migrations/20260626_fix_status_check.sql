ALTER TABLE retreat_applications DROP CONSTRAINT IF EXISTS retreat_applications_status_check;
ALTER TABLE retreat_applications ADD CONSTRAINT retreat_applications_status_check CHECK (status IN ('pending', 'approved', 'waitlist', 'rejected'));
