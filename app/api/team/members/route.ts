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
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 })
    }

    // Mock team members data for now
    const mockMembers = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "owner",
        status: "active",
        joinedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "editor",
        status: "active",
        joinedAt: "2024-01-15T00:00:00Z",
      },
      {
        id: "3",
        name: "Bob Wilson",
        email: "bob@example.com",
        role: "viewer",
        status: "pending",
        joinedAt: null,
      },
    ]

    return NextResponse.json(mockMembers)
  } catch (error) {
    console.error("Team members API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
