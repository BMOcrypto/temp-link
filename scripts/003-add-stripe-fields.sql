-- Add Stripe-related fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS payment_method_id VARCHAR(255);

-- Create index for Stripe customer ID lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);

-- Update existing users to have proper constraints
UPDATE users SET tier = 'free' WHERE tier IS NULL;
