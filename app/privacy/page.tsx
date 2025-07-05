import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Database, Trash2, Globe, Lock } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-xl text-gray-600">
              Your privacy is important to us. Learn how we collect, use, and protect your data.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 15, 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Information</h3>
                  <p className="text-gray-600">
                    When you create an account, we collect your email address, name, and chosen password. This
                    information is necessary to provide our services and communicate with you.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Link Data</h3>
                  <p className="text-gray-600">
                    We store the original URLs you shorten, custom slugs, expiration dates, and basic metadata. This
                    data is essential for our link shortening service to function.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Analytics Data</h3>
                  <p className="text-gray-600">
                    We collect anonymous click data including IP addresses (hashed), referrer information, device types,
                    and geographic location (country/city level only) to provide analytics.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-gray-600">
                  <li>• Provide and maintain our link shortening service</li>
                  <li>• Generate analytics and insights for your links</li>
                  <li>• Communicate with you about your account and our services</li>
                  <li>• Improve our services and develop new features</li>
                  <li>• Prevent fraud and ensure security</li>
                  <li>• Comply with legal obligations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Encryption</h3>
                  <p className="text-gray-600">
                    All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Your passwords
                    are hashed using industry-standard bcrypt.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Access Controls</h3>
                  <p className="text-gray-600">
                    We implement strict access controls and regularly audit who has access to your data. Only authorized
                    personnel can access user data for support purposes.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Infrastructure</h3>
                  <p className="text-gray-600">
                    Our infrastructure is hosted on secure, SOC 2 compliant cloud providers with regular security
                    updates and monitoring.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Data Retention & Deletion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Automatic Deletion</h3>
                  <p className="text-gray-600">
                    Expired links and their associated data are automatically deleted 30 days after expiration to
                    protect your privacy and comply with data minimization principles.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Deletion</h3>
                  <p className="text-gray-600">
                    You can delete your account at any time. Upon deletion, all your data will be permanently removed
                    within 30 days, except where required by law.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Portability</h3>
                  <p className="text-gray-600">
                    You can export your data at any time through your dashboard. We provide data in standard formats
                    (JSON, CSV) for easy portability.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your data may be processed in countries other than your own. We ensure adequate protection through
                  standard contractual clauses and by working only with providers that meet international data
                  protection standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 mb-4">
                  Depending on your location, you may have the following rights regarding your personal data:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    • <strong>Access:</strong> Request a copy of your personal data
                  </li>
                  <li>
                    • <strong>Rectification:</strong> Correct inaccurate or incomplete data
                  </li>
                  <li>
                    • <strong>Erasure:</strong> Request deletion of your personal data
                  </li>
                  <li>
                    • <strong>Portability:</strong> Export your data in a machine-readable format
                  </li>
                  <li>
                    • <strong>Restriction:</strong> Limit how we process your data
                  </li>
                  <li>
                    • <strong>Objection:</strong> Object to certain types of processing
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">To exercise these rights, contact us at privacy@templink.io</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or our data practices, contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> privacy@templink.io
                  </p>
                  <p>
                    <strong>Address:</strong> TempLink Inc., 123 Tech Street, San Francisco, CA 94105
                  </p>
                  <p>
                    <strong>Data Protection Officer:</strong> dpo@templink.io
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Policy Updates</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We'll notify you of significant changes via email or
              through our service. Your continued use of TempLink after changes constitutes acceptance of the updated
              policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
