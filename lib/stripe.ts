import Stripe from "stripe"
import { loggers } from "./logger"

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
  typescript: true,
})

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  priceIds: {
    pro: process.env.STRIPE_PRO_PRICE_ID || "price_1234567890",
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
}

// Create customer
export async function createStripeCustomer(email: string, name: string): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "templink_signup",
      },
    })

    loggers.business.info({
      event: "stripe_customer_created",
      customerId: customer.id,
      email,
    })

    return customer
  } catch (error) {
    loggers.api.error({
      event: "stripe_customer_creation_failed",
      email,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}

// Create subscription
export async function createSubscription(
  customerId: string,
  priceId: string,
  paymentMethodId?: string,
): Promise<Stripe.Subscription> {
  try {
    const subscriptionData: Stripe.SubscriptionCreateParams = {
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    }

    if (paymentMethodId) {
      subscriptionData.default_payment_method = paymentMethodId
    }

    const subscription = await stripe.subscriptions.create(subscriptionData)

    loggers.business.info({
      event: "stripe_subscription_created",
      subscriptionId: subscription.id,
      customerId,
      priceId,
    })

    return subscription
  } catch (error) {
    loggers.api.error({
      event: "stripe_subscription_creation_failed",
      customerId,
      priceId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}

// Create setup intent for payment method collection
export async function createSetupIntent(customerId: string): Promise<Stripe.SetupIntent> {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    })

    return setupIntent
  } catch (error) {
    loggers.api.error({
      event: "stripe_setup_intent_creation_failed",
      customerId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}

// Verify webhook signature
export function verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(payload, signature, stripeConfig.webhookSecret)
  } catch (error) {
    loggers.security.error({
      event: "stripe_webhook_verification_failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}
