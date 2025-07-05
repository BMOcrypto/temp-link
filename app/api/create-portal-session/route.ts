import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user's subscription
    const { data: user } = await supabase.from("users").select("subscription_id, email").eq("id", userId).single()

    if (!user?.subscription_id) {
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 })
    }

    // Get the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription_id)

    if (!subscription.customer) {
      return NextResponse.json({ error: "No customer found" }, { status: 404 })
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.customer as string,
      return_url: `${request.nextUrl.origin}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
