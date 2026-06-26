ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS deposit_paid boolean DEFAULT false;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS payment_pending boolean DEFAULT true;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS deposit_amount numeric(10,2) DEFAULT 0;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS balance_amount numeric(10,2) DEFAULT 0;
ALTER TABLE retreat_applications ADD COLUMN IF NOT EXISTS total_amount numeric(10,2) DEFAULT 0;
