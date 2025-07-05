import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MessageCircle, Mail, Phone, Clock, Link, Shield, BarChart } from "lucide-react"

export default function HelpPage() {
  const categories = [
    {
      icon: Link,
      title: "Creating Links",
      count: 8,
      description: "Learn how to create and customize temporary links",
    },
    {
      icon: Clock,
      title: "Expiration Settings",
      count: 5,
      description: "Understanding expiration times and automatic cleanup",
    },
    {
      icon: BarChart,
      title: "Analytics",
      count: 6,
      description: "Track clicks, locations, and performance data",
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      count: 4,
      description: "Data protection, GDPR compliance, and security features",
    },
  ]

  const faqs = [
    {
      question: "How do I create a temporary link?",
      answer:
        "Simply paste your URL in the form on our homepage, choose an expiration time, and click 'Create Temporary Link'. You can also add a custom slug for easier sharing.",
    },
    {
      question: "What happens when a link expires?",
      answer:
        "Expired links automatically return a 404 error and are removed from your dashboard. The original URL becomes inaccessible through the short link.",
    },
    {
      question: "Can I extend the expiration of an existing link?",
      answer:
        "Yes! Pro users can edit existing links and extend their expiration time from the dashboard. Free users need to create a new link.",
    },
    {
      question: "How accurate are the analytics?",
      answer:
        "Our analytics track real-time data including clicks, geographic locations, devices, and referrers. Data is updated within seconds of each click.",
    },
    {
      question: "Is there an API available?",
      answer:
        "Yes! Pro users get access to our comprehensive REST API for creating links, retrieving analytics, and managing their account programmatically.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 mb-8">Find answers to common questions and get help with TempLink</p>

          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input placeholder="Search for help..." className="pl-10 py-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <category.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
                <Badge variant="outline">{category.count} articles</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-gray-600">Available 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-gray-600">Response within 4 hours</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-gray-600">Pro users only</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href="/docs/api" className="block text-blue-600 hover:underline">
                    API Documentation
                  </a>
                  <a href="/status" className="block text-blue-600 hover:underline">
                    System Status
                  </a>
                  <a href="/privacy" className="block text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="block text-blue-600 hover:underline">
                    Terms of Service
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
