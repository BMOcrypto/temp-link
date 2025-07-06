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

    // Check if user is Pro
    const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

    if (userData?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    }

    const { data: webhooks } = await supabase
      .from("webhooks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return NextResponse.json(webhooks || [])
  } catch (error) {
    console.error("Webhooks API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { url, events, isActive } = await request.json()

    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "URL and events are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user is Pro
    const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

    if (userData?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    }

    // Generate webhook secret
    const secret = `whsec_${randomBytes(32).toString("hex")}`

    const { data, error } = await supabase
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

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Create webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
