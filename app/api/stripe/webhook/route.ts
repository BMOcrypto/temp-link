import { type NextRequest, NextResponse } from "next/server"
import { withErrorHandling } from "@/lib/errors"
import { verifyWebhookSignature } from "@/lib/stripe"
import { createServerClient } from "@/lib/supabase"
import { loggers } from "@/lib/logger"
import { businessMetrics } from "@/lib/monitoring"

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  const event = verifyWebhookSignature(body, signature)
  const supabase = createServerClient()

  loggers.business.info({
    event: "stripe_webhook_received",
    type: event.type,
    eventId: event.id,
  })

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      // Update user subscription status
      const { error } = await supabase
        .from("users")
        .update({
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          tier: subscription.status === "active" ? "pro" : "free",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)

      if (error) {
        loggers.api.error({
          event: "subscription_update_failed",
          subscriptionId: subscription.id,
          customerId,
          error: error.message,
        })
      } else {
        businessMetrics.userUpgraded(customerId, "free", "pro")
        loggers.business.info({
          event: "subscription_updated",
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status,
        })
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const customerId = subscription.customer as string

      // Downgrade user to free tier
      const { error } = await supabase
        .from("users")
        .update({
          subscription_id: null,
          subscription_status: null,
          tier: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId)

      if (error) {
        loggers.api.error({
          event: "subscription_cancellation_failed",
          subscriptionId: subscription.id,
          customerId,
          error: error.message,
        })
      } else {
        loggers.business.info({
          event: "subscription_cancelled",
          subscriptionId: subscription.id,
          customerId,
        })
      }
      break
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object
      const customerId = invoice.customer as string

      loggers.business.warn({
        event: "payment_failed",
        invoiceId: invoice.id,
        customerId,
        amount: invoice.amount_due,
      })
      break
    }

    default:
      loggers.api.debug({
        event: "unhandled_webhook_event",
        type: event.type,
      })
  }

  return NextResponse.json({ received: true })
})
