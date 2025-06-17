import { type NextRequest, NextResponse } from "next/server"
import { withErrorHandling, AuthenticationError } from "@/lib/errors"
import { createServerClient } from "@/lib/supabase"
import { createSetupIntent } from "@/lib/stripe"
import { loggers } from "@/lib/logger"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const { customerId } = await request.json()

  if (!customerId) {
    throw new AuthenticationError("Customer ID required")
  }

  // Verify customer exists in our database
  const supabase = createServerClient()
  const { data: user } = await supabase.from("users").select("id").eq("stripe_customer_id", customerId).single()

  if (!user) {
    throw new AuthenticationError("Invalid customer")
  }

  const setupIntent = await createSetupIntent(customerId)

  loggers.business.info({
    event: "setup_intent_created",
    customerId,
    setupIntentId: setupIntent.id,
  })

  return NextResponse.json({
    clientSecret: setupIntent.client_secret,
  })
})
