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

    // Check if user is Pro
    const { data: userData } = await supabase.from("users").select("tier").eq("id", user.id).single()

    if (userData?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required for export" }, { status: 403 })
    }

    const { data: links } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (!links) {
      return NextResponse.json({ error: "No links found" }, { status: 404 })
    }

    // Generate CSV
    const headers = ["Short Code", "Original URL", "Title", "Clicks", "Status", "Created", "Expires", "NSFW"]
    const csvRows = [
      headers.join(","),
      ...links.map((link) =>
        [
          link.short_code,
          `"${link.original_url}"`,
          `"${link.title || ""}"`,
          link.click_count || 0,
          link.is_active ? "Active" : "Expired",
          new Date(link.created_at).toISOString().split("T")[0],
          new Date(link.expires_at).toISOString().split("T")[0],
          link.is_nsfw ? "Yes" : "No",
        ].join(","),
      ),
    ]

    const csvContent = csvRows.join("\n")

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="templink-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
