import pino from "pino"
import { config } from "./config"

// Create logger instance
export const logger = pino({
  level: config.app.version === "development" ? "debug" : "info",
  transport:
    config.app.version === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      "password",
      "token",
      "authorization",
      "cookie",
      "api_key",
      "secret",
      "*.password",
      "*.token",
      "*.authorization",
      "*.cookie",
      "*.api_key",
      "*.secret",
    ],
    censor: "[REDACTED]",
  },
})

// Structured logging helpers
export const loggers = {
  auth: logger.child({ module: "auth" }),
  api: logger.child({ module: "api" }),
  database: logger.child({ module: "database" }),
  security: logger.child({ module: "security" }),
  performance: logger.child({ module: "performance" }),
  business: logger.child({ module: "business" }),
}

// Performance monitoring
export function withPerformanceLogging<T extends any[], R>(fn: (...args: T) => Promise<R>, operation: string) {
  return async (...args: T): Promise<R> => {
    const start = Date.now()
    const operationId = Math.random().toString(36).substring(7)

    loggers.performance.info({
      operation,
      operationId,
      phase: "start",
    })

    try {
      const result = await fn(...args)
      const duration = Date.now() - start

      loggers.performance.info({
        operation,
        operationId,
        phase: "success",
        duration,
      })

      return result
    } catch (error) {
      const duration = Date.now() - start

      loggers.performance.error({
        operation,
        operationId,
        phase: "error",
        duration,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      throw error
    }
  }
}
