-- Add billing-related fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS customer_id VARCHAR(255);

-- Create index for subscription lookups
CREATE INDEX IF NOT EXISTS idx_users_subscription_id ON users(subscription_id);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);

-- Update existing users to have proper tier values
UPDATE users SET tier = 'free' WHERE tier IS NULL;
