import { randomBytes } from "crypto"
import { RateLimitError } from "./errors"
import { loggers } from "./logger"
import { config } from "./config"

// Rate limiting with Redis (fallback to memory)
class RateLimiter {
  private memoryStore = new Map<string, { count: number; resetTime: number }>()

  async checkRateLimit(
    identifier: string,
    windowMs: number = config.rateLimit.windowMs,
    maxRequests: number = config.rateLimit.maxRequests,
  ): Promise<void> {
    const now = Date.now()
    const key = `rate_limit:${identifier}`

    // Try Redis first (if available)
    if (process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const { Redis } = await import("@upstash/redis")
        const redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })

        const current = await redis.incr(key)
        if (current === 1) {
          await redis.expire(key, Math.ceil(windowMs / 1000))
        }

        if (current > maxRequests) {
          loggers.security.warn({
            event: "rate_limit_exceeded",
            identifier,
            current,
            maxRequests,
          })
          throw new RateLimitError()
        }
        return
      } catch (error) {
        loggers.security.error({
          event: "redis_rate_limit_error",
          error: error instanceof Error ? error.message : "Unknown error",
        })
        // Fall back to memory store
      }
    }

    // Memory-based rate limiting (fallback)
    const record = this.memoryStore.get(key)

    if (!record || now > record.resetTime) {
      this.memoryStore.set(key, { count: 1, resetTime: now + windowMs })
      return
    }

    if (record.count >= maxRequests) {
      loggers.security.warn({
        event: "rate_limit_exceeded_memory",
        identifier,
        count: record.count,
        maxRequests,
      })
      throw new RateLimitError()
    }

    record.count++
  }

  // Cleanup expired entries (for memory store)
  cleanup(): void {
    const now = Date.now()
    for (const [key, record] of this.memoryStore.entries()) {
      if (now > record.resetTime) {
        this.memoryStore.delete(key)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Cleanup memory store every 5 minutes
if (typeof window === "undefined") {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000)
}

// Security headers
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
  ].join("; "),
}

// CSRF protection - browser-compatible
export function generateCSRFToken(): string {
  if (typeof window !== "undefined") {
    // Browser environment - use Web Crypto API
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  } else {
    // Node.js environment
    return randomBytes(32).toString("hex")
  }
}

export function verifyCSRFToken(token: string, expected: string): boolean {
  if (!token || !expected || token.length !== expected.length) {
    return false
  }

  // Constant-time comparison to prevent timing attacks
  let result = 0
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ expected.charCodeAt(i)
  }

  return result === 0
}

// Input sanitization
export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") return ""

  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/data:/gi, "")
    .trim()
    .substring(0, 1000) // Limit length
}

// Hash generation for short codes (to prevent enumeration)
export function generateSecureShortCode(length = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  if (typeof window !== "undefined") {
    // Browser environment
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    return result
  } else {
    // Node.js environment
    const bytes = randomBytes(length)
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length]
    }
    return result
  }
}

// IP address extraction and validation
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const cfConnectingIP = request.headers.get("cf-connecting-ip")

  const ip = cfConnectingIP || realIP || forwarded?.split(",")[0] || "unknown"

  // Validate IP format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/

  if (ip !== "unknown" && !ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
    loggers.security.warn({
      event: "invalid_ip_format",
      ip,
      headers: {
        forwarded,
        realIP,
        cfConnectingIP,
      },
    })
    return "unknown"
  }

  return ip
}

// User agent parsing and validation
export function parseUserAgent(userAgent: string | null): {
  browser: string
  device: string
  os: string
} {
  if (!userAgent) {
    return { browser: "unknown", device: "unknown", os: "unknown" }
  }

  // Simple user agent parsing (in production, use a proper library like ua-parser-js)
  const ua = userAgent.toLowerCase()

  let browser = "unknown"
  if (ua.includes("chrome")) browser = "chrome"
  else if (ua.includes("firefox")) browser = "firefox"
  else if (ua.includes("safari")) browser = "safari"
  else if (ua.includes("edge")) browser = "edge"

  let device = "desktop"
  if (ua.includes("mobile")) device = "mobile"
  else if (ua.includes("tablet")) device = "tablet"

  let os = "unknown"
  if (ua.includes("windows")) os = "windows"
  else if (ua.includes("mac")) os = "macos"
  else if (ua.includes("linux")) os = "linux"
  else if (ua.includes("android")) os = "android"
  else if (ua.includes("ios")) os = "ios"

  return { browser, device, os }
}

// Content Security Policy nonce generation
export function generateNonce(): string {
  if (typeof window !== "undefined") {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  } else {
    return randomBytes(16).toString("base64")
  }
}
