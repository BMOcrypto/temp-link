import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, email } = await request.json()

    if (!priceId || !userId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: user } = await supabase.from("users").select("*").eq("id", userId).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${request.nextUrl.origin}/dashboard?success=true`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
