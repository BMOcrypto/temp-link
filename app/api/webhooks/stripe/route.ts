import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createServerClient()

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          // Update user to Pro tier
          await supabase
            .from("users")
            .update({
              tier: "pro",
              subscription_id: session.subscription as string,
              subscription_status: "active",
            })
            .eq("id", userId)
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          await supabase
            .from("users")
            .update({
              subscription_status: subscription.status,
            })
            .eq("subscription_id", subscription.id)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Downgrade user to free tier
          await supabase
            .from("users")
            .update({
              tier: "free",
              subscription_status: "canceled",
            })
            .eq("subscription_id", subscription.id)
        }
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        if (invoice.subscription) {
          await supabase
            .from("users")
            .update({
              subscription_status: "past_due",
            })
            .eq("subscription_id", invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
