import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { linkId: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()
    const { linkId } = params

    // Verify link belongs to user
    const { data: link } = await supabase.from("links").select("id").eq("id", linkId).eq("user_id", user.id).single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Get geographic data from clicks
    const { data: clickData, error } = await supabase
      .from("clicks")
      .select("country, country_code")
      .eq("link_id", linkId)
      .not("country", "is", null)

    if (error) {
      throw error
    }

    // Process geographic data
    const countryStats = new Map()
    let totalClicks = 0

    clickData?.forEach((click) => {
      const country = click.country || "Unknown"
      const countryCode = click.country_code || "XX"

      if (countryStats.has(country)) {
        countryStats.set(country, {
          ...countryStats.get(country),
          clicks: countryStats.get(country).clicks + 1,
        })
      } else {
        countryStats.set(country, {
          country,
          countryCode,
          clicks: 1,
          flag: getCountryFlag(countryCode),
        })
      }
      totalClicks++
    })

    // Convert to array and calculate percentages
    const countries = Array.from(countryStats.values())
      .map((country) => ({
        ...country,
        percentage: totalClicks > 0 ? (country.clicks / totalClicks) * 100 : 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10) // Top 10 countries

    return NextResponse.json({
      countries,
      totalClicks,
    })
  } catch (error) {
    console.error("Geographic analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getCountryFlag(countryCode: string): string {
  const flagMap: Record<string, string> = {
    US: "🇺🇸",
    GB: "🇬🇧",
    CA: "🇨🇦",
    DE: "🇩🇪",
    FR: "🇫🇷",
    JP: "🇯🇵",
    AU: "🇦🇺",
    BR: "🇧🇷",
    IN: "🇮🇳",
    CN: "🇨🇳",
    IT: "🇮🇹",
    ES: "🇪🇸",
    NL: "🇳🇱",
    SE: "🇸🇪",
    NO: "🇳🇴",
    DK: "🇩🇰",
    FI: "🇫🇮",
    CH: "🇨🇭",
    AT: "🇦🇹",
    BE: "🇧🇪",
  }
  return flagMap[countryCode] || "🌍"
}
