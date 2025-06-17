import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { config } from "./config"
import { loggers } from "./logger"
import { DatabaseError } from "./errors"

// Singleton pattern for client-side Supabase client
let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    supabaseClient = createClient(config.database.supabase.url, config.database.supabase.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: "public",
      },
      global: {
        headers: {
          "X-Client-Info": `${config.app.name}@${config.app.version}`,
        },
      },
    })
  }
  return supabaseClient
}

// Server-side Supabase client with service role
export function createServerClient(): SupabaseClient {
  return createClient(config.database.supabase.url, config.database.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: "public",
    },
    global: {
      headers: {
        "X-Client-Info": `${config.app.name}-server@${config.app.version}`,
      },
    },
  })
}

// Database operation wrapper with error handling and logging
export async function withDatabaseOperation<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
  const startTime = Date.now()
  const operationId = Math.random().toString(36).substring(7)

  loggers.database.debug({
    operation: operationName,
    operationId,
    phase: "start",
  })

  try {
    const result = await operation()
    const duration = Date.now() - startTime

    loggers.database.info({
      operation: operationName,
      operationId,
      phase: "success",
      duration,
    })

    return result
  } catch (error) {
    const duration = Date.now() - startTime

    loggers.database.error({
      operation: operationName,
      operationId,
      phase: "error",
      duration,
      error: error instanceof Error ? error.message : "Unknown error",
    })

    if (error && typeof error === "object" && "code" in error) {
      // Supabase error codes
      const supabaseError = error as { code: string; message: string }

      switch (supabaseError.code) {
        case "23505": // Unique violation
          throw new DatabaseError("Resource already exists")
        case "23503": // Foreign key violation
          throw new DatabaseError("Referenced resource not found")
        case "42P01": // Table does not exist
          throw new DatabaseError("Database schema error")
        default:
          throw new DatabaseError(`Database operation failed: ${supabaseError.message}`)
      }
    }

    throw new DatabaseError("Database operation failed")
  }
}

// Connection health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from("users").select("id").limit(1)
    return !error
  } catch (error) {
    loggers.database.error({
      event: "health_check_failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return false
  }
}

// Database types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          tier: "free" | "pro"
          api_key: string | null
          links_created_this_month: number
          subscription_id: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          tier?: "free" | "pro"
          api_key?: string | null
          links_created_this_month?: number
          subscription_id?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          tier?: "free" | "pro"
          api_key?: string | null
          links_created_this_month?: number
          subscription_id?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          user_id: string | null
          original_url: string
          short_code: string
          custom_slug: string | null
          title: string | null
          expires_at: string
          is_active: boolean
          is_nsfw: boolean
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          original_url: string
          short_code: string
          custom_slug?: string | null
          title?: string | null
          expires_at: string
          is_active?: boolean
          is_nsfw?: boolean
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          original_url?: string
          short_code?: string
          custom_slug?: string | null
          title?: string | null
          expires_at?: string
          is_active?: boolean
          is_nsfw?: boolean
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      clicks: {
        Row: {
          id: string
          link_id: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          country: string | null
          city: string | null
          device_type: string | null
          browser: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          link_id: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          clicked_at?: string
        }
        Update: {
          id?: string
          link_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          clicked_at?: string
        }
      }
    }
  }
}
