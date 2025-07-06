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
    const supabase = createServerClient()

    // Verify link belongs to user
    const { data: link } = await supabase.from("links").select("id").eq("id", linkId).eq("user_id", user.id).single()

    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Get geographic data from clicks
    const { data: clicks } = await supabase
      .from("clicks")
      .select("country")
      .eq("link_id", linkId)
      .not("country", "is", null)

    if (!clicks || clicks.length === 0) {
      return NextResponse.json([])
    }

    // Count clicks by country
    const countryMap = new Map<string, number>()
    clicks.forEach((click) => {
      if (click.country) {
        countryMap.set(click.country, (countryMap.get(click.country) || 0) + 1)
      }
    })

    const totalClicks = clicks.length

    // Convert to array and sort by clicks
    const geoData = Array.from(countryMap.entries())
      .map(([countryCode, clickCount]) => ({
        country: getCountryName(countryCode),
        countryCode,
        clicks: clickCount,
        percentage: (clickCount / totalClicks) * 100,
      }))
      .sort((a, b) => b.clicks - a.clicks)

    return NextResponse.json(geoData)
  } catch (error) {
    console.error("Geographic analytics error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    US: "United States",
    GB: "United Kingdom",
    CA: "Canada",
    DE: "Germany",
    FR: "France",
    JP: "Japan",
    AU: "Australia",
    BR: "Brazil",
    IN: "India",
    CN: "China",
    RU: "Russia",
    IT: "Italy",
    ES: "Spain",
    NL: "Netherlands",
    SE: "Sweden",
    NO: "Norway",
    DK: "Denmark",
    FI: "Finland",
    CH: "Switzerland",
    AT: "Austria",
    BE: "Belgium",
    IE: "Ireland",
    PT: "Portugal",
    PL: "Poland",
    CZ: "Czech Republic",
    HU: "Hungary",
    GR: "Greece",
    TR: "Turkey",
    IL: "Israel",
    AE: "United Arab Emirates",
    SA: "Saudi Arabia",
    EG: "Egypt",
    ZA: "South Africa",
    NG: "Nigeria",
    KE: "Kenya",
    MX: "Mexico",
    AR: "Argentina",
    CL: "Chile",
    CO: "Colombia",
    PE: "Peru",
    VE: "Venezuela",
    KR: "South Korea",
    TH: "Thailand",
    VN: "Vietnam",
    MY: "Malaysia",
    SG: "Singapore",
    ID: "Indonesia",
    PH: "Philippines",
    NZ: "New Zealand",
  }
  return countries[countryCode] || countryCode
}
