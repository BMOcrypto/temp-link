import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = createServerClient()

    // Update invitation status to declined
    const { error } = await supabase
      .from("team_invitations")
      .update({
        status: "declined",
        declined_at: new Date().toISOString(),
      })
      .eq("token", params.token)
      .eq("status", "pending")

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Decline invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
