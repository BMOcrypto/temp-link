import { config } from "./config"
import { logger } from "./logger"

// Metrics collection
class MetricsCollector {
  private metrics = new Map<string, number>()
  private counters = new Map<string, number>()

  // Increment a counter
  increment(name: string, value = 1): void {
    const current = this.counters.get(name) || 0
    this.counters.set(name, current + value)
  }

  // Set a gauge value
  gauge(name: string, value: number): void {
    this.metrics.set(name, value)
  }

  // Record timing
  timing(name: string, duration: number): void {
    this.metrics.set(`${name}_duration`, duration)
  }

  // Get all metrics
  getMetrics(): Record<string, number> {
    return {
      ...Object.fromEntries(this.metrics),
      ...Object.fromEntries(this.counters),
    }
  }

  // Reset metrics
  reset(): void {
    this.metrics.clear()
    this.counters.clear()
  }
}

export const metrics = new MetricsCollector()

// Performance monitoring
export function measurePerformance<T extends any[], R>(fn: (...args: T) => Promise<R>, metricName: string) {
  return async (...args: T): Promise<R> => {
    const start = performance.now()

    try {
      const result = await fn(...args)
      const duration = performance.now() - start

      metrics.timing(metricName, duration)
      metrics.increment(`${metricName}_success`)

      return result
    } catch (error) {
      const duration = performance.now() - start

      metrics.timing(metricName, duration)
      metrics.increment(`${metricName}_error`)

      throw error
    }
  }
}

// Health check endpoint data
export async function getHealthStatus() {
  const { checkDatabaseHealth } = await import("./supabase")

  const health = {
    status: "healthy" as "healthy" | "degraded" | "unhealthy",
    timestamp: new Date().toISOString(),
    version: config.app.version,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: await checkDatabaseHealth(),
    metrics: config.monitoring.enableMetrics ? metrics.getMetrics() : undefined,
  }

  // Determine overall health status
  if (!health.database) {
    health.status = "unhealthy"
  }

  return health
}

// Error tracking (Sentry integration)
export async function initializeErrorTracking() {
  if (config.monitoring.sentryDsn && typeof window !== "undefined") {
    try {
      const Sentry = await import("@sentry/nextjs")

      Sentry.init({
        dsn: config.monitoring.sentryDsn,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
        beforeSend(event) {
          // Filter out non-critical errors in production
          if (process.env.NODE_ENV === "production") {
            if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
              return null
            }
          }
          return event
        },
      })

      logger.info({ event: "sentry_initialized" })
    } catch (error) {
      logger.error({
        event: "sentry_initialization_failed",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
}

// Custom analytics tracking
export function trackEvent(event: string, properties?: Record<string, any>): void {
  if (config.monitoring.enableMetrics) {
    metrics.increment(`event_${event}`)

    logger.info({
      event: "analytics_event",
      name: event,
      properties,
      timestamp: new Date().toISOString(),
    })
  }
}

// Business metrics
export const businessMetrics = {
  linkCreated: (userId?: string, tier?: string) => {
    trackEvent("link_created", { userId, tier })
  },

  linkClicked: (linkId: string, country?: string) => {
    trackEvent("link_clicked", { linkId, country })
  },

  userRegistered: (tier: string) => {
    trackEvent("user_registered", { tier })
  },

  userUpgraded: (userId: string, fromTier: string, toTier: string) => {
    trackEvent("user_upgraded", { userId, fromTier, toTier })
  },

  apiRequest: (endpoint: string, method: string, statusCode: number) => {
    trackEvent("api_request", { endpoint, method, statusCode })
  },
}
