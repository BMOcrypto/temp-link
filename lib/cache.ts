import { config } from "./config"
import { loggers } from "./logger"

// Cache interface
interface CacheItem<T> {
  data: T
  expiresAt: number
}

// Memory cache implementation (fallback)
class MemoryCache {
  private cache = new Map<string, CacheItem<any>>()

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key)

    if (!item) return null

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  async set<T>(key: string, data: T, ttlSeconds: number = config.cache.defaultTTL): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000
    this.cache.set(key, { data, expiresAt })
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
      }
    }
  }
}

// Redis cache implementation
class RedisCache {
  private redis: any = null

  private async getRedis() {
    if (!this.redis && process.env.UPSTASH_REDIS_REST_URL) {
      try {
        const { Redis } = await import("@upstash/redis")
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
      } catch (error) {
        loggers.performance.error({
          event: "redis_connection_failed",
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }
    return this.redis
  }

  async get<T>(key: string): Promise<T | null> {
    const redis = await this.getRedis()
    if (!redis) return null

    try {
      const data = await redis.get(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      loggers.performance.error({
        event: "redis_get_failed",
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      return null
    }
  }

  async set<T>(key: string, data: T, ttlSeconds: number = config.cache.defaultTTL): Promise<void> {
    const redis = await this.getRedis()
    if (!redis) return

    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(data))
    } catch (error) {
      loggers.performance.error({
        event: "redis_set_failed",
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async del(key: string): Promise<void> {
    const redis = await this.getRedis()
    if (!redis) return

    try {
      await redis.del(key)
    } catch (error) {
      loggers.performance.error({
        event: "redis_del_failed",
        key,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async clear(): Promise<void> {
    const redis = await this.getRedis()
    if (!redis) return

    try {
      await redis.flushall()
    } catch (error) {
      loggers.performance.error({
        event: "redis_clear_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
}

// Cache manager with fallback
class CacheManager {
  private redisCache = new RedisCache()
  private memoryCache = new MemoryCache()

  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    const result = await this.redisCache.get<T>(key)
    if (result !== null) return result

    // Fallback to memory cache
    return await this.memoryCache.get<T>(key)
  }

  async set<T>(key: string, data: T, ttlSeconds?: number): Promise<void> {
    // Set in both caches
    await Promise.all([this.redisCache.set(key, data, ttlSeconds), this.memoryCache.set(key, data, ttlSeconds)])
  }

  async del(key: string): Promise<void> {
    await Promise.all([this.redisCache.del(key), this.memoryCache.del(key)])
  }

  async clear(): Promise<void> {
    await Promise.all([this.redisCache.clear(), this.memoryCache.clear()])
  }

  // Cache key generators
  keys = {
    link: (shortCode: string) => `link:${shortCode}`,
    userLinks: (userId: string, page = 1) => `user_links:${userId}:${page}`,
    analytics: (linkId: string, period: string) => `analytics:${linkId}:${period}`,
    userTier: (userId: string) => `user_tier:${userId}`,
    rateLimitUser: (userId: string) => `rate_limit:user:${userId}`,
    rateLimitIP: (ip: string) => `rate_limit:ip:${ip}`,
  }
}

export const cache = new CacheManager()

// Cleanup memory cache every 5 minutes
if (typeof window === "undefined") {
  const memoryCache = new MemoryCache()
  setInterval(() => memoryCache.cleanup(), 5 * 60 * 1000)
}

// Cache warming utilities
export async function warmCache() {
  loggers.performance.info({ event: "cache_warming_started" })

  // Warm frequently accessed data
  // This would be implemented based on your specific use cases

  loggers.performance.info({ event: "cache_warming_completed" })
}
