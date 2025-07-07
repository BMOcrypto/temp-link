import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { randomBytes } from "crypto"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    const { data: webhooks, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(webhooks || [])
  } catch (error) {
    console.error("Webhooks fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, events, isActive = true } = await request.json()

    if (!url || !events || events.length === 0) {
      return NextResponse.json({ error: "URL and events are required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Generate webhook secret
    const secret = randomBytes(32).toString("hex")

    const { data: webhook, error } = await supabase
      .from("webhooks")
      .insert({
        user_id: user.id,
        url,
        events,
        secret,
        is_active: isActive,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(webhook)
  } catch (error) {
    console.error("Webhook creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
