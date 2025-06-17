-- Insert sample users
INSERT INTO users (id, email, name, tier, api_key) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin@templink.io', 'Admin User', 'pro', 'tl_api_admin_123456789'),
  ('550e8400-e29b-41d4-a716-446655440002', 'john@example.com', 'John Doe', 'free', NULL),
  ('550e8400-e29b-41d4-a716-446655440003', 'jane@example.com', 'Jane Smith', 'pro', 'tl_api_jane_987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert sample links
INSERT INTO links (id, user_id, original_url, short_code, title, expires_at, click_count) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'https://example.com/very-long-url-that-needs-shortening', 'abc123', 'Example Website', NOW() + INTERVAL '7 days', 25),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'https://github.com/vercel/next.js', 'next-js', 'Next.js Repository', NOW() + INTERVAL '30 days', 142),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'https://tailwindcss.com/docs', 'tw-docs', 'Tailwind CSS Docs', NOW() + INTERVAL '14 days', 89),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'https://supabase.com/dashboard', 'supa-db', 'Supabase Dashboard', NOW() - INTERVAL '1 day', 67)
ON CONFLICT (short_code) DO NOTHING;

-- Insert sample clicks for analytics
INSERT INTO clicks (link_id, ip_address, user_agent, referrer, country, city, device_type, browser, clicked_at) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '192.168.1.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'https://google.com', 'US', 'New York', 'Desktop', 'Chrome', NOW() - INTERVAL '2 hours'),
  ('660e8400-e29b-41d4-a716-446655440001', '192.168.1.2', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', 'https://twitter.com', 'US', 'Los Angeles', 'Mobile', 'Safari', NOW() - INTERVAL '1 hour'),
  ('660e8400-e29b-41d4-a716-446655440002', '192.168.1.3', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'direct', 'CA', 'Toronto', 'Desktop', 'Firefox', NOW() - INTERVAL '30 minutes');
