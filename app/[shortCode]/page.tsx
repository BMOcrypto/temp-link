import { redirect, notFound } from "next/navigation"
import { createServerClient, withDatabaseOperation } from "@/lib/supabase"
import { cache } from "@/lib/cache"
import { getClientIP, parseUserAgent } from "@/lib/security"
import { loggers } from "@/lib/logger"
import { businessMetrics } from "@/lib/monitoring"
import { headers } from "next/headers"

interface Props {
  params: {
    shortCode: string
  }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = params
  const headersList = headers()
  const ip = getClientIP({ headers: { get: (name: string) => headersList.get(name) } } as any)
  const userAgent = headersList.get("user-agent")
  const referrer = headersList.get("referer")
  const { browser, device } = parseUserAgent(userAgent)

  loggers.api.info({
    event: "link_access_attempt",
    shortCode,
    ip,
    device,
    browser,
    referrer,
  })

  // Try to get link from cache first
  const cacheKey = cache.keys.link(shortCode)
  let link = await cache.get(cacheKey)

  if (!link) {
    // Fetch from database
    const supabase = createServerClient()
    const { data, error } = await withDatabaseOperation(
      () => supabase.from("links").select("*").eq("short_code", shortCode).single(),
      "fetch_link_by_short_code",
    )

    if (error || !data) {
      loggers.api.warn({
        event: "link_not_found",
        shortCode,
        ip,
      })
      notFound()
    }

    link = data
    // Cache the link for future requests
    await cache.set(cacheKey, link, 3600) // 1 hour
  }

  // Check if link is expired or inactive
  const now = new Date()
  const expiresAt = new Date(link.expires_at)

  if (now > expiresAt || !link.is_active) {
    loggers.business.info({
      event: "expired_link_accessed",
      linkId: link.id,
      shortCode,
      expiresAt: link.expires_at,
      ip,
    })

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Link Expired</h1>
            <p className="text-gray-600 mb-6">This temporary link has expired and is no longer available.</p>
          </div>

          <div className="space-y-4">
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create New Link
            </a>
            <p className="text-sm text-gray-500">Expired on {new Date(link.expires_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )
  }

  // Record the click asynchronously
  const supabase = createServerClient()

  // Don't await this to avoid slowing down the redirect
  Promise.all([
    // Record click
    withDatabaseOperation(
      () =>
        supabase.from("clicks").insert({
          link_id: link.id,
          ip_address: ip,
          user_agent: userAgent?.substring(0, 500), // Truncate long user agents
          referrer: referrer?.substring(0, 500),
          device_type: device,
          browser,
          clicked_at: new Date().toISOString(),
        }),
      "record_click",
    ),

    // Update click count
    withDatabaseOperation(
      () =>
        supabase
          .from("links")
          .update({
            click_count: (link.click_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq("id", link.id),
      "update_click_count",
    ),
  ]).catch((error) => {
    loggers.api.error({
      event: "click_recording_failed",
      linkId: link.id,
      shortCode,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  })

  // Track business metrics
  businessMetrics.linkClicked(link.id)

  loggers.business.info({
    event: "link_clicked",
    linkId: link.id,
    shortCode,
    originalUrl: link.original_url,
    ip,
    device,
    browser,
  })

  // Invalidate cache for this link to ensure fresh click count
  await cache.del(cacheKey)

  // Redirect to original URL
  redirect(link.original_url)
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const { shortCode } = params

  return {
    title: `Redirecting... | TempLink`,
    description: `You are being redirected from templink.io/${shortCode}`,
    robots: "noindex, nofollow",
  }
}
