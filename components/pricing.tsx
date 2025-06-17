import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for personal use",
      features: [
        { name: "10 active links per month", included: true },
        { name: "Basic analytics", included: true },
        { name: "Standard expiration options", included: true },
        { name: "Community support", included: true },
        { name: "Custom domains", included: false },
        { name: "API access", included: false },
        { name: "Advanced analytics", included: false },
        { name: "Priority support", included: false },
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$5",
      period: "per month",
      description: "For professionals and businesses",
      features: [
        { name: "Unlimited links", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom domains", included: true },
        { name: "API access", included: true },
        { name: "Geolocation data", included: true },
        { name: "Device tracking", included: true },
        { name: "Export reports", included: true },
        { name: "Priority support", included: true },
      ],
      cta: "Start Pro Trial",
      popular: true,
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500 mr-3" />
                      ) : (
                        <X className="h-5 w-5 text-gray-400 mr-3" />
                      )}
                      <span className={feature.included ? "" : "text-gray-400"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
