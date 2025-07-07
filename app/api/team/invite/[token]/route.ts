import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const supabase = createServerClient()

    const { data: invitation, error } = await supabase
      .from("team_invitations")
      .select(`
        id,
        email,
        role,
        expires_at,
        status,
        teams!inner (
          name
        ),
        users!invited_by (
          name,
          email
        )
      `)
      .eq("token", params.token)
      .single()

    if (error || !invitation) {
      return NextResponse.json({ error: "Invalid invitation token" }, { status: 404 })
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 })
    }

    return NextResponse.json({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      teamName: invitation.teams.name,
      inviterName: invitation.users?.name || invitation.users?.email?.split("@")[0] || "Team Owner",
      expiresAt: invitation.expires_at,
      status: invitation.status,
    })
  } catch (error) {
    console.error("Get invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
