-- Add team management tables
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'inactive')),
    invited_by UUID REFERENCES auth.users(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(team_id, user_id)
);

-- Add webhook configuration table
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL DEFAULT '{}',
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_triggered TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'failed', 'pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add webhook delivery logs
CREATE TABLE IF NOT EXISTS webhook_deliveries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    webhook_id UUID REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retry_count INTEGER DEFAULT 0
);

-- Add password protection to links
ALTER TABLE links ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_password_protected BOOLEAN DEFAULT false;

-- Add security and analytics fields
ALTER TABLE links ADD COLUMN IF NOT EXISTS access_count INTEGER DEFAULT 0;
ALTER TABLE links ADD COLUMN IF NOT EXISTS last_accessed TIMESTAMP WITH TIME ZONE;

-- Enhanced clicks table for better analytics
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS country VARCHAR(100);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS country_code VARCHAR(10);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS device_type VARCHAR(50);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS browser VARCHAR(100);
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS os VARCHAR(100);

-- Add team association to links
ALTER TABLE links ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
CREATE INDEX IF NOT EXISTS idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX IF NOT EXISTS idx_clicks_country ON clicks(country);
CREATE INDEX IF NOT EXISTS idx_clicks_device_type ON clicks(device_type);
CREATE INDEX IF NOT EXISTS idx_links_team_id ON links(team_id);
CREATE INDEX IF NOT EXISTS idx_links_password_protected ON links(is_password_protected);

-- Add RLS policies for teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they belong to" ON teams
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid() AND status = 'active')
    );

CREATE POLICY "Team owners can manage their teams" ON teams
    FOR ALL USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Users can view team members of their teams" ON team_members
    FOR SELECT USING (
        team_id IN (
            SELECT id FROM teams WHERE owner_id = auth.uid()
            UNION
            SELECT team_id FROM team_members WHERE user_id = auth.uid() AND status = 'active'
        )
    );

CREATE POLICY "Team owners and admins can manage members" ON team_members
    FOR ALL USING (
        team_id IN (
            SELECT id FROM teams WHERE owner_id = auth.uid()
            UNION
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active'
        )
    );

-- Webhooks policies
CREATE POLICY "Users can manage their own webhooks" ON webhooks
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can view their webhook deliveries" ON webhook_deliveries
    FOR SELECT USING (
        webhook_id IN (SELECT id FROM webhooks WHERE user_id = auth.uid())
    );

-- Update links policies to include team access
DROP POLICY IF EXISTS "Users can view their own links" ON links;
CREATE POLICY "Users can view their own links and team links" ON links
    FOR SELECT USING (
        user_id = auth.uid() OR
        team_id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid() AND status = 'active'
        )
    );

DROP POLICY IF EXISTS "Users can manage their own links" ON links;
CREATE POLICY "Users can manage their own links and team links with permission" ON links
    FOR ALL USING (
        user_id = auth.uid() OR
        team_id IN (
            SELECT team_id FROM team_members 
            WHERE user_id = auth.uid() 
            AND role IN ('owner', 'admin', 'editor') 
            AND status = 'active'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
