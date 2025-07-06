import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { linkId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { linkId } = params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "daily"

    const supabase = createServerClient()

    // Verify link belongs to user
    const { data: link } = await supabase.from("links").select("id").eq("id", linkId).eq("user_id", user.id).single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    let timeData: any[] = []

    if (type === "hourly") {
      // Last 24 hours
      const hours = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date()
        hour.setHours(hour.getHours() - (23 - i), 0, 0, 0)
        return hour
      })

      const { data: clicks } = await supabase
        .from("clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", hours[0].toISOString())

      timeData = hours.map((hour) => {
        const hourClicks =
          clicks?.filter((click) => {
            const clickHour = new Date(click.clicked_at).getHours()
            return clickHour === hour.getHours()
          }).length || 0

        return {
          period: hour.getHours().toString(),
          clicks: hourClicks,
        }
      })
    } else if (type === "daily") {
      // Last 30 days
      const days = Array.from({ length: 30 }, (_, i) => {
        const day = new Date()
        day.setDate(day.getDate() - (29 - i))
        day.setHours(0, 0, 0, 0)
        return day
      })

      const { data: clicks } = await supabase
        .from("clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", days[0].toISOString())

      timeData = days.map((day) => {
        const dayClicks =
          clicks?.filter((click) => {
            const clickDate = new Date(click.clicked_at).toDateString()
            return clickDate === day.toDateString()
          }).length || 0

        return {
          period: day.toISOString().split("T")[0],
          clicks: dayClicks,
        }
      })
    } else if (type === "weekly") {
      // Last 12 weeks
      const weeks = Array.from({ length: 12 }, (_, i) => {
        const week = new Date()
        week.setDate(week.getDate() - (11 - i) * 7)
        week.setHours(0, 0, 0, 0)
        return week
      })

      const { data: clicks } = await supabase
        .from("clicks")
        .select("clicked_at")
        .eq("link_id", linkId)
        .gte("clicked_at", weeks[0].toISOString())

      timeData = weeks.map((week, index) => {
        const weekStart = new Date(week)
        const weekEnd = new Date(week)
        weekEnd.setDate(weekEnd.getDate() + 7)

        const weekClicks =
          clicks?.filter((click) => {
            const clickDate = new Date(click.clicked_at)
            return clickDate >= weekStart && clickDate < weekEnd
          }).length || 0

        return {
          period: `Week ${index + 1}`,
          clicks: weekClicks,
        }
      })
    }

    return NextResponse.json(timeData)
  } catch (error) {
    console.error("Time analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
