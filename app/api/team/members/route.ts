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

    // Get team members for teams where user is owner or member
    const { data: members, error } = await supabase
      .from("team_members")
      .select(`
        id,
        role,
        status,
        invited_at,
        joined_at,
        user_id,
        team_id,
        users:user_id (
          email,
          full_name
        )
      `)
      .or(`team_id.in.(${await getUserTeamIds(supabase, user.id)})`)
      .order("invited_at", { ascending: false })

    if (error) {
      throw error
    }

    // Format the response
    const formattedMembers =
      members?.map((member) => ({
        id: member.id,
        name: member.users?.full_name || member.users?.email?.split("@")[0] || "Unknown",
        email: member.users?.email || "",
        role: member.role,
        status: member.status,
        joinedAt: member.joined_at || member.invited_at,
      })) || []

    return NextResponse.json(formattedMembers)
  } catch (error) {
    console.error("Team members fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    const supabase = createServerClient()

    // Get user's team (assuming they have one team for now)
    const { data: userTeam } = await supabase.from("teams").select("id").eq("owner_id", user.id).single()

    if (!userTeam) {
      // Create a team if user doesn't have one
      const { data: newTeam, error: teamError } = await supabase
        .from("teams")
        .insert({
          name: `${user.email?.split("@")[0]}'s Team`,
          owner_id: user.id,
        })
        .select()
        .single()

      if (teamError) {
        throw teamError
      }

      userTeam.id = newTeam.id
    }

    // Check if user exists
    const { data: invitedUser } = await supabase.from("users").select("id").eq("email", email).single()

    // Create team member invitation
    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        team_id: userTeam.id,
        user_id: invitedUser?.id,
        role,
        status: invitedUser ? "active" : "pending",
        invited_by: user.id,
        joined_at: invitedUser ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // TODO: Send invitation email if user doesn't exist

    return NextResponse.json({ success: true, member })
  } catch (error) {
    console.error("Team invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getUserTeamIds(supabase: any, userId: string): Promise<string> {
  const { data: teams } = await supabase.from("teams").select("id").eq("owner_id", userId)

  const { data: memberTeams } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .eq("status", "active")

  const allTeamIds = [...(teams?.map((t) => t.id) || []), ...(memberTeams?.map((t) => t.team_id) || [])]

  return allTeamIds.join(",") || "null"
}
