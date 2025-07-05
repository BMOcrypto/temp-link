import { Shield, BarChart3, Globe, Smartphone, Key, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Features() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Private",
      description: "All links are encrypted and automatically deleted after expiration. Your data stays private.",
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Track clicks, geographic data, referrers, and device types with comprehensive analytics.",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description: "Lightning-fast redirects worldwide with our global content delivery network.",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices with responsive design and mobile-first approach.",
    },
    {
      icon: Key,
      title: "API Access",
      description: "Integrate TempLink into your applications with our comprehensive REST API.",
    },
    {
      icon: Trash2,
      title: "Auto-Cleanup",
      description: "Expired links are automatically removed, keeping your dashboard clean and organized.",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, manage, and track temporary links with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
