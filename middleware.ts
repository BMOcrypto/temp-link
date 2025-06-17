import { type NextRequest, NextResponse } from "next/server"
import { rateLimiter, securityHeaders, getClientIP } from "./lib/security"
import { loggers } from "./lib/logger"
import { config as appConfig } from "./lib/config"

export async function middleware(request: NextRequest) {
  const start = Date.now()
  const requestId = Math.random().toString(36).substring(7)
  const ip = getClientIP(request)
  const userAgent = request.headers.get("user-agent") || "unknown"

  // Log incoming request
  loggers.api.info({
    requestId,
    method: request.method,
    url: request.url,
    ip,
    userAgent: userAgent.substring(0, 200), // Truncate long user agents
  })

  try {
    // Apply security headers
    const response = NextResponse.next()

    // Set security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    // CORS handling
    const origin = request.headers.get("origin")
    if (origin && appConfig.security.allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }

    // Rate limiting for API routes
    if (request.nextUrl.pathname.startsWith("/api/")) {
      try {
        await rateLimiter.checkRateLimit(ip)
      } catch (error) {
        loggers.security.warn({
          event: "rate_limit_exceeded",
          requestId,
          ip,
          path: request.nextUrl.pathname,
        })

        return new NextResponse("Rate limit exceeded", {
          status: 429,
          headers: {
            "Retry-After": "900", // 15 minutes
            ...Object.fromEntries(Object.entries(securityHeaders)),
          },
        })
      }
    }

    // Add request ID to response headers
    response.headers.set("X-Request-ID", requestId)

    // Log response
    const duration = Date.now() - start
    loggers.api.info({
      requestId,
      status: response.status,
      duration,
    })

    return response
  } catch (error) {
    const duration = Date.now() - start

    loggers.api.error({
      requestId,
      error: error instanceof Error ? error.message : "Unknown error",
      duration,
    })

    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: Object.fromEntries(Object.entries(securityHeaders)),
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
}
