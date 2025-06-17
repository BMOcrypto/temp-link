import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'your_stripe_secret_key',
    LINK_EXPIRATION_TIME: process.env.LINK_EXPIRATION_TIME || '1d', // Default to 1 day
};

export default config;