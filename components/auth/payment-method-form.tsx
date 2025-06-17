"use client"

import type React from "react"

import { useState } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, CreditCard, Shield, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface PaymentMethodFormProps {
  customerId: string
  onSuccess: () => void
}

function PaymentForm({ customerId, onSuccess }: PaymentMethodFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create setup intent
      const setupResponse = await fetch("/api/stripe/setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }),
      })

      if (!setupResponse.ok) {
        throw new Error("Failed to create payment setup")
      }

      const { clientSecret } = await setupResponse.json()

      // Confirm setup intent with payment method
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (setupIntent?.status === "succeeded") {
        toast({
          title: "Payment method added!",
          description: "Your Pro subscription is being activated...",
        })
        onSuccess()
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment setup failed"
      setError(errorMessage)
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TempLink</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Your Pro Subscription
          </CardTitle>
          <p className="text-gray-600">Add your payment method to activate Pro features</p>
        </CardHeader>

        <CardContent>
          {/* Pro Features Reminder */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Pro Features Include:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Unlimited temporary links
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Advanced analytics & reporting
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Custom domains
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                API access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Priority support
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Payment Information</label>
              <div className="p-3 border rounded-md">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={!stripe || isLoading}>
                {isLoading ? "Processing..." : "Start Pro Subscription - $5/month"}
              </Button>

              <p className="text-xs text-gray-500 text-center">You can cancel anytime. No long-term commitments.</p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{" "}
              <a href="/support" className="text-blue-600 hover:underline">
                Contact support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PaymentMethodForm({ customerId, onSuccess }: PaymentMethodFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm customerId={customerId} onSuccess={onSuccess} />
    </Elements>
  )
}
