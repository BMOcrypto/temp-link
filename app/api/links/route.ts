import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, withDatabaseOperation } from "@/lib/supabase"
import { validateInput, validateCreateLink } from "@/lib/validation"
import { generateSecureShortCode, getClientIP, parseUserAgent } from "@/lib/security"
import { withErrorHandling } from "@/lib/errors"
import { loggers } from "@/lib/logger"
import { cache } from "@/lib/cache"
import { businessMetrics } from "@/lib/monitoring"
import { config } from "@/lib/config"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const requestId = request.headers.get("x-request-id") || "unknown"
  const ip = getClientIP(request)
  const userAgent = request.headers.get("user-agent")
  const { browser, device } = parseUserAgent(userAgent)

  loggers.api.info({
    requestId,
    event: "link_creation_started",
    ip,
    device,
    browser,
  })

  // Parse and validate request body
  const body = await request.json()
  const validatedData = validateInput(validateCreateLink, body)

  const supabase = createServerClient()

  // Calculate expiration date
  const now = new Date()
  let expiresAt: Date

  switch (validatedData.expiry) {
    case "1h":
      expiresAt = new Date(now.getTime() + 60 * 60 * 1000)
      break
    case "6h":
      expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000)
      break
    case "24h":
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      break
    case "7d":
      expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      break
    case "30d":
      expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      break
    default:
      expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  }

  // Generate short code with collision detection
  let shortCode = validatedData.customSlug || generateSecureShortCode()
  let attempts = 0
  const maxAttempts = 5

  while (attempts < maxAttempts) {
    // Check if short code exists (with caching)
    const cacheKey = cache.keys.link(shortCode)
    const cached = await cache.get(cacheKey)

    if (!cached) {
      const { data: existing } = await withDatabaseOperation(
        () => supabase.from("links").select("id").eq("short_code", shortCode).single(),
        "check_short_code_exists",
      )

      if (!existing) break
    }

    if (validatedData.customSlug) {
      // Custom slug already exists
      loggers.business.warn({
        event: "custom_slug_collision",
        requestId,
        shortCode,
        ip,
      })

      return NextResponse.json({ error: "Custom slug already exists" }, { status: 409 })
    }

    // Generate new short code
    shortCode = generateSecureShortCode()
    attempts++
  }

  if (attempts >= maxAttempts) {
    loggers.api.error({
      event: "short_code_generation_failed",
      requestId,
      attempts,
    })

    return NextResponse.json({ error: "Failed to generate unique short code" }, { status: 500 })
  }

  // Extract title from URL (optional enhancement)
  let title = validatedData.title
  if (!title) {
    try {
      const urlResponse = await fetch(validatedData.originalUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (urlResponse.ok) {
        const contentType = urlResponse.headers.get("content-type")
        if (contentType?.includes("text/html")) {
          // In a production app, you might want to fetch and parse the HTML title
          title = new URL(validatedData.originalUrl).hostname
        }
      }
    } catch (error) {
      // Ignore title extraction errors
      loggers.api.debug({
        event: "title_extraction_failed",
        requestId,
        url: validatedData.originalUrl,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  // Create the link
  const linkData = {
    original_url: validatedData.originalUrl,
    short_code: shortCode,
    custom_slug: validatedData.customSlug,
    title,
    expires_at: expiresAt.toISOString(),
    is_active: true,
  }

  const { data: link, error } = await withDatabaseOperation(
    () => supabase.from("links").insert(linkData).select().single(),
    "create_link",
  )

  if (error) {
    loggers.api.error({
      event: "link_creation_failed",
      requestId,
      error: error.message,
      shortCode,
    })
    throw error
  }

  // Cache the new link
  await cache.set(cache.keys.link(shortCode), link, config.cache.linkTTL)

  // Track business metrics
  businessMetrics.linkCreated(undefined, "anonymous")

  loggers.business.info({
    event: "link_created",
    requestId,
    linkId: link.id,
    shortCode,
    expiresAt: expiresAt.toISOString(),
    customSlug: !!validatedData.customSlug,
  })

  return NextResponse.json({
    id: link.id,
    shortCode,
    originalUrl: validatedData.originalUrl,
    title,
    expiresAt: expiresAt.toISOString(),
    createdAt: link.created_at,
  })
})

export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
  const userId = searchParams.get("userId")

  const supabase = createServerClient()

  // Build query
  let query = supabase
    .from("links")
    .select("*")
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  const { data: links, error } = await withDatabaseOperation(() => query, "fetch_links")

  if (error) {
    loggers.api.error({
      event: "links_fetch_failed",
      error: error.message,
      userId,
      page,
      limit,
    })
    throw error
  }

  return NextResponse.json({
    links,
    pagination: {
      page,
      limit,
      hasMore: links.length === limit,
    },
  })
})
