import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, HelpCircle, Clock, Users, Shield, Zap } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a temporary link?",
      answer:
        "Simply paste your URL into the form on our homepage, set an expiration time, and click 'Create Link'. Your temporary link will be generated instantly.",
    },
    {
      question: "What happens when a link expires?",
      answer:
        "When a link expires, it becomes inactive and will show a '404 - Link Expired' page to visitors. The link data is automatically deleted after 30 days for privacy.",
    },
    {
      question: "Can I customize my short links?",
      answer: "Yes! Pro users can create custom slugs for their links. Free users get randomly generated short codes.",
    },
    {
      question: "How many links can I create?",
      answer: "Free users can create up to 10 active links per month. Pro users have unlimited link creation.",
    },
    {
      question: "Can I track link analytics?",
      answer:
        "Yes! All users get basic click tracking. Pro users get advanced analytics including geolocation, device types, and referrer data.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes, Pro users get access to our RESTful API for programmatic link creation and management. Check our API documentation for details.",
    },
  ]

  const categories = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Getting Started",
      description: "Learn the basics of creating and managing temporary links",
      articles: 12,
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Account Management",
      description: "Manage your account, billing, and subscription settings",
      articles: 8,
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Security & Privacy",
      description: "Understanding our security measures and privacy policies",
      articles: 6,
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "API & Integrations",
      description: "Developer resources and integration guides",
      articles: 15,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get help with TempLink</p>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search for help..." className="pl-10 py-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">{category.icon}</div>
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{category.articles} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Quick answers to the most common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
            <p className="text-gray-600 mb-6">Can't find what you're looking for? Our support team is here to help.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:support@templink.io"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
