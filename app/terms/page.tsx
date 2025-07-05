import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, AlertTriangle, CreditCard, Shield, Users, Gavel } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-xl text-gray-600">Please read these terms carefully before using TempLink</p>
            <p className="text-sm text-gray-500 mt-4">Last updated: January 15, 2024</p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  By accessing and using TempLink ("the Service"), you accept and agree to be bound by the terms and
                  provision of this agreement. If you do not agree to abide by the above, please do not use this
                  service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Service Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  TempLink is a URL shortening service that creates temporary links with expiration dates. We offer both
                  free and paid subscription tiers with different features and limitations.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Free Tier</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Up to 10 active links per month</li>
                    <li>• Basic click analytics</li>
                    <li>• Standard expiration options</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pro Tier</h3>
                  <ul className="text-gray-600 space-y-1">
                    <li>• Unlimited link creation</li>
                    <li>• Advanced analytics and reporting</li>
                    <li>• Custom domains and slugs</li>
                    <li>• API access</li>
                    <li>• Priority support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Acceptable Use Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 mb-4">
                  You agree not to use TempLink for any unlawful or prohibited activities, including but not limited to:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Linking to illegal, harmful, or malicious content</li>
                  <li>• Phishing, fraud, or deceptive practices</li>
                  <li>• Spam or unsolicited commercial communications</li>
                  <li>• Copyright infringement or intellectual property violations</li>
                  <li>• Adult content without appropriate warnings</li>
                  <li>• Harassment, hate speech, or discriminatory content</li>
                  <li>• Malware, viruses, or other harmful software</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  We reserve the right to suspend or terminate accounts that violate these policies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Billing and Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Pro Subscription</h3>
                  <p className="text-gray-600">
                    Pro subscriptions are billed monthly at $5/month. Payment is due in advance and will be
                    automatically charged to your payment method on file.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cancellation</h3>
                  <p className="text-gray-600">
                    You may cancel your subscription at any time. Cancellation will take effect at the end of your
                    current billing period. No refunds are provided for partial months.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Price Changes</h3>
                  <p className="text-gray-600">
                    We reserve the right to change our pricing with 30 days notice. Existing subscribers will be
                    notified via email before any price changes take effect.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Service Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  While we strive to maintain high availability, we do not guarantee uninterrupted service. We may
                  perform maintenance, updates, or experience outages that temporarily affect service availability.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Link Expiration</h3>
                  <p className="text-gray-600">
                    Links will automatically expire at their designated time and become inaccessible. We are not
                    responsible for any consequences resulting from expired links.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Backup</h3>
                  <p className="text-gray-600">
                    While we maintain backups, you are responsible for keeping your own records of important links and
                    data.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  TempLink is provided "as is" without any warranties, express or implied. We shall not be liable for
                  any direct, indirect, incidental, special, or consequential damages resulting from the use or
                  inability to use our service.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">User Content</h3>
                  <p className="text-gray-600">
                    You are solely responsible for the content you link to through our service. We do not monitor or
                    control the content of external websites.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Third-Party Services</h3>
                  <p className="text-gray-600">
                    Our service may integrate with third-party services. We are not responsible for the availability,
                    content, or practices of these external services.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  The TempLink service, including its design, functionality, and content, is protected by copyright and
                  other intellectual property laws. You may not copy, modify, or distribute our service without explicit
                  permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may terminate or suspend your account immediately, without prior notice, for any reason whatsoever,
                  including without limitation if you breach the Terms. Upon termination, your right to use the service
                  will cease immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  These Terms shall be interpreted and governed by the laws of the State of California, United States.
                  Any disputes shall be resolved in the courts of San Francisco County, California.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <strong>Email:</strong> legal@templink.io
                  </p>
                  <p>
                    <strong>Address:</strong> TempLink Inc., 123 Tech Street, San Francisco, CA 94105
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 p-6 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of significant changes via
              email or through our service. Your continued use of TempLink after changes constitutes acceptance of the
              new terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
