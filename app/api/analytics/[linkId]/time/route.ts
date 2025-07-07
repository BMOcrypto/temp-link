import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { linkId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode") || "daily"

    const supabase = createServerClient()
    const { linkId } = params

    // Verify link belongs to user
    const { data: link } = await supabase.from("links").select("id").eq("id", linkId).eq("user_id", user.id).single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Get time-based data from clicks
    const { data: clickData, error } = await supabase
      .from("clicks")
      .select("clicked_at")
      .eq("link_id", linkId)
      .order("clicked_at", { ascending: true })

    if (error) {
      throw error
    }

    // Process time data based on mode
    let timeData: any[] = []
    let peakTime = ""
    const totalClicks = clickData?.length || 0

    if (mode === "hourly") {
      const hourlyStats = new Array(24).fill(0)

      clickData?.forEach((click) => {
        const hour = new Date(click.clicked_at).getHours()
        hourlyStats[hour]++
      })

      timeData = hourlyStats.map((clicks, hour) => ({
        period: hour.toString(),
        clicks,
        label: `${hour}:00`,
      }))

      const peakHour = hourlyStats.indexOf(Math.max(...hourlyStats))
      peakTime = `${peakHour}:00 (Peak Hour)`
    } else if (mode === "daily") {
      const dailyStats = new Array(7).fill(0)
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

      clickData?.forEach((click) => {
        const day = new Date(click.clicked_at).getDay()
        dailyStats[day]++
      })

      timeData = dailyStats.map((clicks, day) => ({
        period: day.toString(),
        clicks,
        label: dayNames[day].slice(0, 3),
      }))

      const peakDay = dailyStats.indexOf(Math.max(...dailyStats))
      peakTime = `${dayNames[peakDay]} (Peak Day)`
    } else if (mode === "weekly") {
      const weeklyStats = new Map()

      clickData?.forEach((click) => {
        const date = new Date(click.clicked_at)
        const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
        const weekKey = weekStart.toISOString().split("T")[0]

        weeklyStats.set(weekKey, (weeklyStats.get(weekKey) || 0) + 1)
      })

      timeData = Array.from(weeklyStats.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([week, clicks], index) => ({
          period: index.toString(),
          clicks,
          label: `Week ${index + 1}`,
        }))

      const maxWeek = Math.max(...Array.from(weeklyStats.values()))
      const peakWeekIndex = Array.from(weeklyStats.values()).indexOf(maxWeek)
      peakTime = `Week ${peakWeekIndex + 1} (Peak Week)`
    }

    return NextResponse.json({
      timeData,
      peakTime,
      totalClicks,
      mode,
    })
  } catch (error) {
    console.error("Time analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
