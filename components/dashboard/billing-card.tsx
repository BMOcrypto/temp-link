"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Crown, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface BillingCardProps {
  userTier: "free" | "pro"
  subscriptionStatus?: string
  userId: string
}

export function BillingCard({ userTier, subscriptionStatus, userId }: BillingCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "price_1234567890",
          userId,
          email: "user@example.com", // In real app, get from user context
        }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        const stripe = (await import("@stripe/stripe-js")).loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        const stripeInstance = await stripe
        await stripeInstance?.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start checkout process",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      const { url } = await response.json()

      if (url) {
        window.open(url, "_blank")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing & Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Current Plan:</span>
              <Badge className={userTier === "pro" ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"}>
                {userTier === "pro" && <Crown className="w-3 h-3 mr-1" />}
                {userTier.toUpperCase()}
              </Badge>
            </div>
            {userTier === "pro" && subscriptionStatus && (
              <p className="text-sm text-gray-600 mt-1">
                Status: <span className="capitalize">{subscriptionStatus}</span>
              </p>
            )}
          </div>
          <div className="text-right">
            {userTier === "pro" ? (
              <div>
                <p className="font-semibold">$5.00</p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold">$0.00</p>
                <p className="text-sm text-gray-600">forever</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {userTier === "free" ? (
            <Button onClick={handleUpgrade} disabled={isLoading} className="w-full">
              {isLoading ? "Loading..." : "Upgrade to Pro"}
            </Button>
          ) : (
            <Button
              onClick={handleManageBilling}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-transparent"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {isLoading ? "Loading..." : "Manage Billing"}
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-600">
          {userTier === "free" ? (
            <ul className="space-y-1">
              <li>• 10 active links per month</li>
              <li>• Basic analytics</li>
              <li>• Standard support</li>
            </ul>
          ) : (
            <ul className="space-y-1">
              <li>• Unlimited links</li>
              <li>• Advanced analytics</li>
              <li>• API access</li>
              <li>• Priority support</li>
              <li>• Custom domains</li>
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
