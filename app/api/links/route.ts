import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateShortCode, isValidUrl } from "@/lib/utils"

export async function POST(request: NextRequest) {
  // -------- 1. Safe-parse the body --------
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

  // -------- 2. Extract & validate fields --------
  const originalUrl = payload.originalUrl as string | undefined
  const customSlug = (payload.customSlug as string | undefined)?.trim() || undefined
  const expiry = (payload.expiry as string | undefined) ?? "24h"

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return NextResponse.json({ error: "originalUrl must be a valid URL" }, { status: 400 })
  }

  const supabase = createServerClient()

  // -------- 3. Compute expiration --------
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

  // -------- 4. Generate / validate shortCode --------
  const shortCode = customSlug || generateShortCode()
  const { data: existing } = await supabase.from("links").select("id").eq("short_code", shortCode).maybeSingle()

  if (existing) {
    return NextResponse.json({ error: "Short code already exists" }, { status: 409 })
  }

  // -------- 5. Insert row --------
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
    console.error("Supabase error:", error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    shortCode,
    originalUrl,
    expiresAt: expiresAt.toISOString(),
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    const supabase = createServerClient()
    const query = supabase.from("links").select("*").order("created_at", { ascending: false }).maybeSingle()

    const { data, error } = userId ? await query.eq("user_id", userId) : await query

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
