import { logger } from "./logger"

// Custom error classes
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly code?: string

  constructor(message: string, statusCode = 500, isOperational = true, code?: string) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.code = code

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 400, true, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, true, "AUTHENTICATION_ERROR")
    this.name = "AuthenticationError"
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, true, "AUTHORIZATION_ERROR")
    this.name = "AuthorizationError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, true, "NOT_FOUND_ERROR")
    this.name = "NotFoundError"
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429, true, "RATE_LIMIT_ERROR")
    this.name = "RateLimitError"
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, true, "DATABASE_ERROR")
    this.name = "DatabaseError"
  }
}

// Error handler utility
export function handleError(error: unknown, context?: string): AppError {
  const errorId = Math.random().toString(36).substring(7)

  if (error instanceof AppError) {
    logger.error({
      errorId,
      context,
      error: {
        name: error.name,
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        stack: error.stack,
      },
    })
    return error
  }

  if (error instanceof Error) {
    logger.error({
      errorId,
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    })
    return new AppError(error.message, 500, false)
  }

  logger.error({
    errorId,
    context,
    error: String(error),
  })

  return new AppError("An unexpected error occurred", 500, false)
}

// Global error boundary for API routes
export function withErrorHandling<T extends any[], R>(handler: (...args: T) => Promise<R>) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      throw handleError(error, "API_HANDLER")
    }
  }
}
