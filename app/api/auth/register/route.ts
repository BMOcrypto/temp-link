import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, withDatabaseOperation } from "@/lib/supabase"
import { validateInput, validateRegister } from "@/lib/validation"
import { withErrorHandling, ValidationError } from "@/lib/errors"
import { loggers } from "@/lib/logger"
import { getClientIP, rateLimiter } from "@/lib/security"
import { businessMetrics } from "@/lib/monitoring"
import { verifyCaptcha } from "@/lib/captcha"
import { createStripeCustomer } from "@/lib/stripe"
import bcrypt from "bcryptjs"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const requestId = request.headers.get("x-request-id") || "unknown"
  const ip = getClientIP(request)

  // Rate limiting
  await rateLimiter.checkRateLimit(`register:${ip}`, 60 * 60 * 1000, 5) // 5 attempts per hour

  loggers.api.info({
    requestId,
    event: "user_registration_started",
    ip,
  })

  // Parse and validate request body
  const body = await request.json()
  const { email, password, name, captchaAnswer, captchaToken, tier = "free" } = body

  // Validate input data
  const validatedData = validateInput(validateRegister, { email, password, name })

  // Verify CAPTCHA
  if (!captchaAnswer || !captchaToken) {
    throw new ValidationError("CAPTCHA verification required")
  }

  if (!verifyCaptcha(Number.parseInt(captchaAnswer), captchaToken)) {
    loggers.security.warn({
      event: "registration_captcha_failed",
      requestId,
      ip,
      email: validatedData.email,
    })
    throw new ValidationError("CAPTCHA verification failed")
  }

  const supabase = createServerClient()

  // Check if user already exists
  const { data: existingUser } = await withDatabaseOperation(
    () => supabase.from("users").select("id").eq("email", validatedData.email).single(),
    "check_user_exists",
  )

  if (existingUser) {
    loggers.security.warn({
      event: "registration_duplicate_email",
      requestId,
      ip,
      email: validatedData.email,
    })
    throw new ValidationError("An account with this email already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(validatedData.password, 12)

  // Create Stripe customer for Pro users
  let stripeCustomerId: string | null = null
  if (tier === "pro") {
    try {
      const customer = await createStripeCustomer(validatedData.email, validatedData.name)
      stripeCustomerId = customer.id
    } catch (error) {
      loggers.api.error({
        event: "stripe_customer_creation_failed",
        requestId,
        email: validatedData.email,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw new ValidationError("Failed to set up payment processing")
    }
  }

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: validatedData.email,
    password: validatedData.password,
    email_confirm: true, // Auto-confirm for demo
    user_metadata: {
      name: validatedData.name,
      tier,
    },
  })

  if (authError || !authData.user) {
    loggers.api.error({
      event: "supabase_auth_creation_failed",
      requestId,
      email: validatedData.email,
      error: authError?.message || "Unknown error",
    })
    throw new ValidationError("Failed to create user account")
  }

  // Create user record in our database
  const userData = {
    id: authData.user.id,
    email: validatedData.email,
    name: validatedData.name,
    tier: tier as "free" | "pro",
    stripe_customer_id: stripeCustomerId,
    links_created_this_month: 0,
  }

  const { data: user, error: userError } = await withDatabaseOperation(
    () => supabase.from("users").insert(userData).select().single(),
    "create_user_record",
  )

  if (userError) {
    // Cleanup auth user if database insert fails
    await supabase.auth.admin.deleteUser(authData.user.id)

    loggers.api.error({
      event: "user_record_creation_failed",
      requestId,
      userId: authData.user.id,
      error: userError.message,
    })
    throw new ValidationError("Failed to complete user registration")
  }

  // Track business metrics
  businessMetrics.userRegistered(tier)

  loggers.business.info({
    event: "user_registered",
    requestId,
    userId: user.id,
    email: validatedData.email,
    tier,
    hasStripeCustomer: !!stripeCustomerId,
  })

  // Return user data (excluding sensitive information)
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      tier: user.tier,
    },
    message: "Account created successfully",
    requiresPayment: tier === "pro",
    stripeCustomerId,
  })
})
