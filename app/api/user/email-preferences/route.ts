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

    const { data: preferences, error } = await supabase
      .from("email_preferences")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      // Create default preferences if they don't exist
      const { data: newPreferences, error: insertError } = await supabase
        .from("email_preferences")
        .insert({
          user_id: user.id,
          marketing_emails: true,
          security_alerts: true,
          usage_notifications: true,
          team_invitations: true,
          webhook_notifications: false,
          weekly_reports: true,
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      return NextResponse.json(newPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Email preferences fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const preferences = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("email_preferences")
      .upsert({
        user_id: user.id,
        ...preferences,
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Email preferences update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
