import { getSupabaseClient, createServerClient } from "./supabase"

export async function signUp(email: string, password: string, name: string, tier: "free" | "pro" = "free") {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) throw error

  // Create user record in our users table
  if (data.user) {
    const { error: insertError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email!,
      name,
      tier,
      api_key: tier === "pro" ? `tl_api_${data.user.id.slice(0, 8)}_${Date.now()}` : null,
    })

    if (insertError) throw insertError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  try {
    const supabase = createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function resetPassword(email: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  if (error) throw error
}

export async function updatePassword(password: string) {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) throw error
}
