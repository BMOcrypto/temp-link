import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Lazily-initialised *browser* client.
 * – Only created when both NEXT_PUBLIC env-vars are defined.
 * – Attempting to use Supabase without configuration will throw
 *   a human-readable error instead of crashing the app at import time.
 */
let _browserClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    throw new Error(
      "Supabase environment variables are missing. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    )
  }

  if (!_browserClient) {
    _browserClient = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return _browserClient
}

/**
 * Server-side client (service-role if key is provided, otherwise anon).
 * Called inside route-handlers / server functions, NOT at the top level.
 */
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      "Supabase server credentials are missing. " + "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
