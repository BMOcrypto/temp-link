// Environment variable validation schema
const envSchema = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: (val: string) => {
    if (!val) throw new Error("NEXT_PUBLIC_SUPABASE_URL is required")
    try {
      new URL(val)
      return val
    } catch {
      throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    }
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: (val: string) => {
    if (!val || val.length < 10) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
    return val
  },
  SUPABASE_SERVICE_ROLE_KEY: (val: string) => {
    if (!val || val.length < 10) throw new Error("SUPABASE_SERVICE_ROLE_KEY is required")
    return val
  },

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: (val?: string) => val,
  STRIPE_SECRET_KEY: (val?: string) => val,
  STRIPE_PRO_PRICE_ID: (val?: string) => val,
  STRIPE_WEBHOOK_SECRET: (val?: string) => val,

  // Application
  NODE_ENV: (val: string) => {
    const allowed = ["development", "production", "test"]
    return allowed.includes(val) ? val : "development"
  },

  // Rate limiting
  REDIS_URL: (val?: string) => val,
  UPSTASH_REDIS_REST_URL: (val?: string) => val,
  UPSTASH_REDIS_REST_TOKEN: (val?: string) => val,

  // Security
  ALLOWED_ORIGINS: (val?: string) => val,
  MAX_LINKS_PER_USER_FREE: (val?: string) => Number(val) || 10,
  MAX_LINKS_PER_USER_PRO: (val?: string) => Number(val) || 1000,
}

// Validate environment variables
function validateEnv() {
  try {
    const env = process.env

    return {
      NEXT_PUBLIC_SUPABASE_URL: envSchema.NEXT_PUBLIC_SUPABASE_URL(env.NEXT_PUBLIC_SUPABASE_URL || ""),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: envSchema.NEXT_PUBLIC_SUPABASE_ANON_KEY(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""),
      SUPABASE_SERVICE_ROLE_KEY: envSchema.SUPABASE_SERVICE_ROLE_KEY(env.SUPABASE_SERVICE_ROLE_KEY || ""),
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: envSchema.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY(
        env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      ),
      STRIPE_SECRET_KEY: envSchema.STRIPE_SECRET_KEY(env.STRIPE_SECRET_KEY),
      STRIPE_PRO_PRICE_ID: envSchema.STRIPE_PRO_PRICE_ID(env.STRIPE_PRO_PRICE_ID),
      STRIPE_WEBHOOK_SECRET: envSchema.STRIPE_WEBHOOK_SECRET(env.STRIPE_WEBHOOK_SECRET),
      NODE_ENV: envSchema.NODE_ENV(env.NODE_ENV || "development"),
      NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: env.NEXTAUTH_URL,
      REDIS_URL: envSchema.REDIS_URL(env.REDIS_URL),
      UPSTASH_REDIS_REST_URL: envSchema.UPSTASH_REDIS_REST_URL(env.UPSTASH_REDIS_REST_URL),
      UPSTASH_REDIS_REST_TOKEN: envSchema.UPSTASH_REDIS_REST_TOKEN(env.UPSTASH_REDIS_REST_TOKEN),
      SENTRY_DSN: env.SENTRY_DSN,
      VERCEL_URL: env.VERCEL_URL,
      ALLOWED_ORIGINS: envSchema.ALLOWED_ORIGINS(env.ALLOWED_ORIGINS),
      MAX_LINKS_PER_USER_FREE: envSchema.MAX_LINKS_PER_USER_FREE(env.MAX_LINKS_PER_USER_FREE),
      MAX_LINKS_PER_USER_PRO: envSchema.MAX_LINKS_PER_USER_PRO(env.MAX_LINKS_PER_USER_PRO),
      GOOGLE_ANALYTICS_ID: env.GOOGLE_ANALYTICS_ID,
    }
  } catch (error) {
    console.error("❌ Invalid environment variables:", error)
    throw new Error("Invalid environment configuration")
  }
}

export const env = validateEnv()

// Application configuration
export const config = {
  app: {
    name: "TempLink",
    version: "1.0.0",
    url: env.NEXTAUTH_URL || `https://${env.VERCEL_URL}` || "http://localhost:3000",
  },

  database: {
    supabase: {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },

  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
    proPriceId: env.STRIPE_PRO_PRICE_ID,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },

  security: {
    allowedOrigins: env.ALLOWED_ORIGINS?.split(",") || [],
    maxLinksPerUserFree: env.MAX_LINKS_PER_USER_FREE,
    maxLinksPerUserPro: env.MAX_LINKS_PER_USER_PRO,
    bcryptRounds: 12,
    jwtExpiresIn: "7d",
  },

  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // per window
    skipSuccessfulRequests: false,
  },

  cache: {
    defaultTTL: 300, // 5 minutes
    linkTTL: 3600, // 1 hour
    analyticsTTL: 900, // 15 minutes
  },

  monitoring: {
    sentryDsn: env.SENTRY_DSN,
    enableMetrics: env.NODE_ENV === "production",
  },
} as const
