import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Key, Shield, Zap } from "lucide-react"

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600">Integrate TempLink into your applications with our RESTful API</p>
          <Badge className="mt-4 bg-purple-100 text-purple-800">Pro Feature</Badge>
        </div>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                All API requests require authentication using your API key. Include it in the Authorization header:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                &nbsp;&nbsp;&nbsp;&nbsp;https://templink.io/api/links
              </div>
              <p className="text-sm text-gray-500">Get your API key from your Pro dashboard settings.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Create Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">POST</Badge>
                <code className="text-sm">/api/links</code>
              </div>

              <p className="text-gray-600">Create a new temporary link with custom expiration.</p>

              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  {`{
  "originalUrl": "https://example.com/long-url",
  "customSlug": "my-link",
  "expiry": "24h"
}`}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  {`{
  "id": "uuid",
  "shortCode": "my-link",
  "originalUrl": "https://example.com/long-url",
  "expiresAt": "2024-01-15T10:30:00Z",
  "clickCount": 0
}`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Get Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">GET</Badge>
                <code className="text-sm">/api/links/{"{id}"}/analytics</code>
              </div>

              <p className="text-gray-600">Retrieve detailed analytics for a specific link.</p>

              <div>
                <h4 className="font-semibold mb-2">Response:</h4>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                  {`{
  "totalClicks": 42,
  "uniqueClicks": 38,
  "countries": {
    "US": 25,
    "UK": 10,
    "CA": 7
  },
  "devices": {
    "desktop": 30,
    "mobile": 12
  },
  "referrers": {
    "direct": 20,
    "google.com": 15,
    "twitter.com": 7
  }
}`}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Rate Limits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Link Creation</span>
                  <Badge variant="outline">100/hour</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Analytics Requests</span>
                  <Badge variant="outline">1000/hour</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">General API Calls</span>
                  <Badge variant="outline">5000/hour</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Rate limits are per API key. Contact support if you need higher limits.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Need help getting started? Check out our examples and SDKs.</p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline">Node.js SDK</Badge>
            <Badge variant="outline">Python SDK</Badge>
            <Badge variant="outline">PHP SDK</Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
