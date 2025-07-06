import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateShortCode, isValidUrl } from "@/lib/utils"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    // Parse request body safely
    let payload: Record<string, unknown> | null = null
    try {
      const raw = await request.text()
      payload = raw ? (JSON.parse(raw) as Record<string, unknown>) : null
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    if (!payload) {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 })
    }

    // Extract and validate fields
    const originalUrl = payload.originalUrl as string | undefined
    const customSlug = (payload.customSlug as string | undefined)?.trim() || undefined
    const expiry = (payload.expiry as string | undefined) ?? "24h"
    const title = (payload.title as string | undefined)?.trim() || undefined
    const isNsfw = Boolean(payload.isNsfw)

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json({ error: "originalUrl must be a valid URL" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check usage limits for free users
    if (user) {
      const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

      if (userData?.tier === "free") {
        const { count } = await supabase
          .from("links")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("is_active", true)

        if ((count || 0) >= 10) {
          return NextResponse.json(
            {
              error: "Free plan limit reached. Upgrade to Pro for unlimited links.",
            },
            { status: 403 },
          )
        }
      }
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

    // Generate/validate shortCode
    const shortCode = customSlug || generateShortCode()
    const { data: existing } = await supabase.from("links").select("id").eq("short_code", shortCode).maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Short code already exists" }, { status: 409 })
    }

    // Insert row
    const { data, error } = await supabase
      .from("links")
      .insert({
        user_id: user?.id || null,
        original_url: originalUrl,
        short_code: shortCode,
        custom_slug: customSlug,
        title,
        expires_at: expiresAt.toISOString(),
        is_nsfw: isNsfw,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    }

    return NextResponse.json({
      id: data.id,
      shortCode,
      originalUrl,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
