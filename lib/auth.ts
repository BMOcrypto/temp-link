export async function signUp(email: string, password: string, name: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Authentication not available in demo mode. Please configure Supabase.")
  }

  const { supabase } = await import("./supabase")

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
      tier: "free",
    })

    if (insertError) throw insertError
  }

  return data
}

export async function signIn(email: string, password: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Authentication not available in demo mode. Please configure Supabase.")
  }

  const { supabase } = await import("./supabase")

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return
  }

  const { supabase } = await import("./supabase")
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  const { supabase } = await import("./supabase")
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
