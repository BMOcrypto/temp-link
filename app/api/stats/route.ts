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

    // Get total links for user
    const { count: totalLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    // Get active links (not expired)
    const { count: activeLinks } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())

    // Get total clicks
    const { data: clicksData } = await supabase.from("links").select("click_count").eq("user_id", user.id)

    const totalClicks = clicksData?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0

    // Get clicks today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: clicksToday } = await supabase
      .from("clicks")
      .select("*", { count: "exact", head: true })
      .gte("clicked_at", today.toISOString())
      .in("link_id", clicksData?.map((link) => link.id) || [])

    return NextResponse.json({
      totalLinks: totalLinks || 0,
      totalClicks,
      activeLinks: activeLinks || 0,
      clicksToday: clicksToday || 0,
    })
  } catch (error) {
    console.error("Stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
