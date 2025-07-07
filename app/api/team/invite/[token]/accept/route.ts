import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { token: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from("team_invitations")
      .select("*")
      .eq("token", params.token)
      .eq("status", "pending")
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 })
    }

    // Check if invitation is expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json({ error: "Invitation has expired" }, { status: 400 })
    }

    // Check if user email matches invitation email
    if (user.email !== invitation.email) {
      return NextResponse.json(
        {
          error: "This invitation is for a different email address",
        },
        { status: 400 },
      )
    }

    // Check if user is already a team member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", invitation.team_id)
      .eq("user_id", user.id)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "You are already a member of this team" }, { status: 400 })
    }

    // Add user to team
    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: invitation.team_id,
      user_id: user.id,
      role: invitation.role,
      joined_at: new Date().toISOString(),
    })

    if (memberError) {
      throw memberError
    }

    // Update invitation status
    const { error: updateError } = await supabase
      .from("team_invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitation.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Accept invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
