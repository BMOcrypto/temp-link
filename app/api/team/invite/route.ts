import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { sendTeamInvitation } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, role = "editor" } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user has Pro subscription
    const { data: userData } = await supabase.from("users").select("tier, name").eq("id", user.id).single()

    if (userData?.tier !== "pro") {
      return NextResponse.json({ error: "Pro subscription required for team features" }, { status: 403 })
    }

    // Get or create user's team
    let { data: userTeam } = await supabase.from("teams").select("id, name").eq("owner_id", user.id).single()

    if (!userTeam) {
      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: `${userData.name || user.email?.split("@")[0]}'s Team`,
          owner_id: user.id,
        })
        .select()
        .single()

      if (teamError) {
        throw teamError
      }
      userTeam = newTeam
    }

    // Check if invitation already exists
    const { data: existingInvite } = await supabase
      .from("team_invitations")
      .select("id")
      .eq("team_id", userTeam.id)
      .eq("email", email)
      .eq("status", "pending")
      .single()

    if (existingInvite) {
      return NextResponse.json({ error: "Invitation already sent to this email" }, { status: 400 })
    }

    // Check if user is already a team member
    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", userTeam.id)
      .eq("email", email)
      .single()

    if (existingMember) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 400 })
    }

    // Generate invitation token
    const inviteToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiration

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from("team_invitations")
      .insert({
        team_id: userTeam.id,
        email,
        role,
        token: inviteToken,
        invited_by: user.id,
        expires_at: expiresAt.toISOString(),
        status: "pending",
      })
      .select()
      .single()

    if (inviteError) {
      throw inviteError
    }

    // Send invitation email
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/teams/invite/${inviteToken}`

    try {
      await sendTeamInvitation({
        to: email,
        inviterName: userData.name || user.email?.split("@")[0] || "Team Owner",
        teamName: userTeam.name,
        inviteUrl,
      })
    } catch (emailError) {
      console.error("Failed to send invitation email:", emailError)
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expires_at,
      },
    })
  } catch (error) {
    console.error("Team invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
