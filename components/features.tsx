import { BarChart3, Shield, Globe, Smartphone, Key, Trash2 } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track clicks, referrers, geographic data, and device information in real-time.",
    },
    {
      icon: Shield,
      title: "Security First",
      description: "HTTPS encryption, rate limiting, and CAPTCHA protection against spam and abuse.",
    },
    {
      icon: Globe,
      title: "Custom Domains",
      description: "Use your own domain for branded short links (Pro feature).",
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Responsive design works perfectly on all devices and screen sizes.",
    },
    {
      icon: Key,
      title: "API Access",
      description: "RESTful API with JWT authentication for seamless integration (Pro feature).",
    },
    {
      icon: Trash2,
      title: "Auto-Cleanup",
      description: "GDPR-compliant automatic deletion of expired link data after 30 days.",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to create, manage, and track temporary links effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
