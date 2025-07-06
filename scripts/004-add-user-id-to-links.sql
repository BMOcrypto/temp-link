-- Add user_id column to links table if it doesn't exist
ALTER TABLE links ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add title and is_nsfw columns
ALTER TABLE links ADD COLUMN IF NOT EXISTS title VARCHAR(255);
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_nsfw BOOLEAN DEFAULT false;

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_links_user_id_created ON links(user_id, created_at DESC);

-- Update existing links to have a default user (optional)
-- UPDATE links SET user_id = (SELECT id FROM users LIMIT 1) WHERE user_id IS NULL;
