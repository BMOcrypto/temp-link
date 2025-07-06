import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()
    const { data } = await supabase.from("users").select("api_key, tier").eq("id", user.id).single()

    if (data?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    }

    return NextResponse.json({ apiKey: data.api_key })
  } catch (error) {
    console.error("Get API key error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    // Generate new API key
    const apiKey = `tl_api_${user.id.slice(0, 8)}_${Date.now()}`

    const { error } = await supabase.from("users").update({ api_key: apiKey }).eq("id", user.id)

    if (error) throw error

    return NextResponse.json({ apiKey })
  } catch (error) {
    console.error("Generate API key error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
