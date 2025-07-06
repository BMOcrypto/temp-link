import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateShortCode, isValidUrl } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { urls, expiry = "24h" } = await request.json()

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "URLs array is required" }, { status: 400 })
    }

    if (urls.length > 100) {
      return NextResponse.json({ error: "Maximum 100 URLs allowed per batch" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user is Pro
    const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

    if (userData?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required for bulk operations" }, { status: 403 })
    }

    // Validate all URLs
    const validUrls = urls.filter((url) => isValidUrl(url.trim()))

    if (validUrls.length === 0) {
      return NextResponse.json({ error: "No valid URLs provided" }, { status: 400 })
    }

    // Compute expiration
    const now = new Date()
    const expiryMap: Record<string, number> = {
      "1h": 1,
      "6h": 6,
      "24h": 24,
      "7d": 24 * 7,
      "30d": 24 * 30,
    }
    const hours = expiryMap[expiry] ?? 24
    const expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000)

    // Create links in batch
    const linksToCreate = validUrls.map((url) => ({
      user_id: user.id,
      original_url: url.trim(),
      short_code: generateShortCode(),
      expires_at: expiresAt.toISOString(),
    }))

    const { data, error } = await supabase.from("links").insert(linksToCreate).select()

    if (error) {
      console.error("Bulk create error:", error)
      return NextResponse.json({ error: "Failed to create links" }, { status: 500 })
    }

    return NextResponse.json({
      created: data.length,
      links: data.map((link) => ({
        shortCode: link.short_code,
        originalUrl: link.original_url,
        shortUrl: `${request.nextUrl.origin}/${link.short_code}`,
      })),
    })
  } catch (error) {
    console.error("Bulk API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
