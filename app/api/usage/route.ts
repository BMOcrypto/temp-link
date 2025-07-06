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

    // Get current month start
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get user tier
    const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

    // Get links created this month
    const { count: linksThisMonth } = await supabase
      .from("links")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString())

    // Get clicks this month
    const { data: linksData } = await supabase
      .from("links")
      .select("id, click_count, short_code")
      .eq("user_id", user.id)
      .gte("created_at", monthStart.toISOString())

    const clicksThisMonth = linksData?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0

    // Get top performing link
    const topPerformingLink = linksData?.reduce((top, link) => {
      if (!top || (link.click_count || 0) > (top.click_count || 0)) {
        return link
      }
      return top
    }, null as any)

    return NextResponse.json({
      linksThisMonth: linksThisMonth || 0,
      linksLimit: userData?.tier === "free" ? 10 : -1,
      clicksThisMonth,
      topPerformingLink: topPerformingLink
        ? {
            shortCode: topPerformingLink.short_code,
            clicks: topPerformingLink.click_count || 0,
          }
        : null,
    })
  } catch (error) {
    console.error("Usage API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
