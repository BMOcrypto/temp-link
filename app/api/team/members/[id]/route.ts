import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await request.json()

    if (!["admin", "editor", "viewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user is team owner or admin
    const { data: teamMember } = await supabase
      .from("team_members")
      .select(`
        id,
        team_id,
        role,
        teams!inner (
          owner_id
        )
      `)
      .eq("id", params.id)
      .single()

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    const isOwner = teamMember.teams.owner_id === user.id
    const { data: currentUserMember } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamMember.team_id)
      .eq("user_id", user.id)
      .single()

    const isAdmin = currentUserMember?.role === "admin"

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Update member role
    const { error } = await supabase.from("team_members").update({ role }).eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update member role error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Check if user is team owner or admin
    const { data: teamMember } = await supabase
      .from("team_members")
      .select(`
        id,
        team_id,
        user_id,
        teams!inner (
          owner_id
        )
      `)
      .eq("id", params.id)
      .single()

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 })
    }

    const isOwner = teamMember.teams.owner_id === user.id
    const { data: currentUserMember } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamMember.team_id)
      .eq("user_id", user.id)
      .single()

    const isAdmin = currentUserMember?.role === "admin"
    const isSelf = teamMember.user_id === user.id

    if (!isOwner && !isAdmin && !isSelf) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Cannot remove team owner
    if (teamMember.user_id === teamMember.teams.owner_id) {
      return NextResponse.json({ error: "Cannot remove team owner" }, { status: 400 })
    }

    // Remove team member
    const { error } = await supabase.from("team_members").delete().eq("id", params.id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Remove team member error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
