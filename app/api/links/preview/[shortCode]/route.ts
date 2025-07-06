import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { shortCode: string } }) {
  try {
    const { shortCode } = params
    const supabase = createServerClient()

    const { data: link, error } = await supabase.from("links").select("*").eq("short_code", shortCode).single()

    if (error || !link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Extract domain from URL
    const url = new URL(link.original_url)
    const domain = url.hostname

    // Mock metadata (in production, you'd fetch this from the actual URL)
    const previewData = {
      title: link.title || `Link to ${domain}`,
      description: `Temporary link to ${link.original_url}`,
      image: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      domain,
      clicks: link.click_count || 0,
      expiresAt: link.expires_at,
      isActive: link.is_active && new Date(link.expires_at) > new Date(),
    }

    return NextResponse.json(previewData)
  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
