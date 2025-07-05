export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using TempLink ("the Service"), you accept and agree to be bound by the terms and
                provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                TempLink provides URL shortening services with automatic expiration functionality. We offer both free
                and premium tiers with varying features and limitations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To access certain features, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Share illegal, harmful, or offensive content</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Distribute malware or phishing links</li>
                <li>Spam or abuse the service</li>
                <li>Attempt to gain unauthorized access to our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Service Limitations</h2>
              <p className="text-gray-700 mb-4">
                Free accounts are limited to 10 active links per month. Pro accounts have unlimited links but are
                subject to fair use policies and rate limiting.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                Pro subscriptions are billed monthly at $5/month. Payments are processed securely through Stripe.
                Refunds are available within 30 days of purchase.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of the Service is also governed by our Privacy Policy. We automatically delete expired links
                and associated data after 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by TempLink and are
                protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account immediately, without prior notice, for conduct that we believe
                violates these Terms or is harmful to other users or the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or
                error-free operation of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall TempLink be liable for any indirect, incidental, special, consequential, or punitive
                damages arising out of your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via
                email or through the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Contact Information</h2>
              <p className="text-gray-700">If you have any questions about these Terms, please contact us:</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">TempLink Legal Team</p>
                <p>Email: legal@templink.io</p>
                <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
