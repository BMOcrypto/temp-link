import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Key, LinkIcon, BarChart3 } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
            <p className="text-xl text-gray-600">Integrate TempLink into your applications with our RESTful API</p>
            <Badge variant="secondary" className="mt-4">
              Pro Feature
            </Badge>
          </div>

          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Authentication
                </CardTitle>
                <CardDescription>All API requests require authentication using your API key</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>curl -H "Authorization: Bearer YOUR_API_KEY" \</div>
                  <div className="ml-4">https://templink.io/api/links</div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Get your API key from your Pro dashboard settings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Create Link
                </CardTitle>
                <CardDescription>POST /api/links - Create a new temporary link</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div>{"{"}</div>
                      <div className="ml-4">"url": "https://example.com",</div>
                      <div className="ml-4">"customSlug": "my-link",</div>
                      <div className="ml-4">"expiresIn": "24h"</div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Response</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <div>{"{"}</div>
                      <div className="ml-4">"shortCode": "my-link",</div>
                      <div className="ml-4">"shortUrl": "https://templink.io/my-link",</div>
                      <div className="ml-4">"originalUrl": "https://example.com",</div>
                      <div className="ml-4">"expiresAt": "2024-01-16T10:30:00Z"</div>
                      <div>{"}"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Get Analytics
                </CardTitle>
                <CardDescription>GET /api/links/:id/analytics - Get link analytics data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  <div>{"{"}</div>
                  <div className="ml-4">"totalClicks": 42,</div>
                  <div className="ml-4">"uniqueClicks": 38,</div>
                  <div className="ml-4">"countries": [</div>
                  <div className="ml-8">{'{ "country": "US", "clicks": 25 },'}</div>
                  <div className="ml-8">{'{ "country": "UK", "clicks": 13 }'}</div>
                  <div className="ml-4">],</div>
                  <div className="ml-4">"referrers": [...]</div>
                  <div>{"}"}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Rate Limits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>
                    <strong>Pro Plan:</strong> 1000 requests per hour
                  </p>
                  <p>
                    <strong>Headers:</strong> X-RateLimit-Remaining, X-RateLimit-Reset
                  </p>
                  <p>
                    <strong>Status Code:</strong> 429 when limit exceeded
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">Need help getting started? Contact our support team.</p>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
