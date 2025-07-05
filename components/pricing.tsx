"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"
import { SignUpModal } from "@/components/auth/signup-modal"

export function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "pro">("free")

  const handlePlanSelect = (plan: "free" | "pro") => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use and trying out TempLink",
      features: [
        "10 active links per month",
        "Basic analytics (clicks, referrers)",
        "Standard expiration options",
        "Email support",
        "HTTPS encryption",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$5",
      period: "per month",
      description: "For power users and businesses who need more",
      features: [
        "Unlimited links",
        "Advanced analytics (geolocation, devices)",
        "Custom domains",
        "API access with authentication",
        "Priority support",
        "Bulk operations",
        "Export data",
      ],
      buttonText: "Start Pro Trial",
      popular: true,
    },
  ]

  return (
    <>
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade at any time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 ${
                  plan.popular ? "border-purple-500 shadow-2xl scale-105" : "border-gray-200 shadow-lg"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full text-lg py-3 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                        : "bg-gray-900 hover:bg-gray-800"
                    }`}
                    onClick={() => handlePlanSelect(plan.name.toLowerCase() as "free" | "pro")}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600">
              All plans include HTTPS encryption, automatic link expiration, and basic security features.
            </p>
          </div>
        </div>
      </section>

      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedPlan={selectedPlan} />
    </>
  )
}
