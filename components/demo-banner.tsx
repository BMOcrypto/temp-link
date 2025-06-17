"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DemoBanner() {
  // Only show banner if Supabase is not configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Demo Mode:</strong> This is a demonstration of TempLink. To enable full functionality including
        authentication and database storage, please configure your Supabase environment variables.
      </AlertDescription>
    </Alert>
  )
}
