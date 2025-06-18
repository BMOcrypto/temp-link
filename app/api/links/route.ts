import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateShortCode } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const { originalUrl, customSlug, expiry } = await request.json()

    if (!originalUrl) {
      return NextResponse.json({ error: "Original URL is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Calculate expiration date
    const now = new Date()
    let expiresAt: Date

    switch (expiry) {
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

    // Generate short code
    const shortCode = customSlug || generateShortCode()

    // Check if short code already exists
    const { data: existing } = await supabase.from("links").select("id").eq("short_code", shortCode).single()

    if (existing) {
      return NextResponse.json({ error: "Short code already exists" }, { status: 409 })
    }

    // Create the link
    const { data, error } = await supabase
      .from("links")
      .insert({
        original_url: originalUrl,
        short_code: shortCode,
        custom_slug: customSlug,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
    }

    return NextResponse.json({
      shortCode,
      originalUrl,
      expiresAt: expiresAt.toISOString(),
      id: data.id,
    })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServerClient()

    let query = supabase.from("links").select("*").order("created_at", { ascending: false })

    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
