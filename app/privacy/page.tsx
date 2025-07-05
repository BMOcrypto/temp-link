export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: January 1, 2024</p>

          <div className="prose max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you create an account, use our services,
                or contact us for support.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Account information (name, email address, password)</li>
                <li>URLs you shorten and custom slugs you create</li>
                <li>Usage data and analytics (clicks, referrers, geographic data)</li>
                <li>Device and browser information</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Process and fulfill your requests for link shortening services</li>
                <li>Provide analytics and insights about your links</li>
                <li>Send you technical notices and support messages</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your information for as long as necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Active links are stored until expiration</li>
                <li>Expired link data is automatically deleted after 30 days</li>
                <li>Account information is retained until account deletion</li>
                <li>Analytics data is aggregated and anonymized after 2 years</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>All data is encrypted in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Monitoring for suspicious activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access and review your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience and collect analytics data. You can
                control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. International Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure
                appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this privacy policy from time to time. We will notify you of any material changes by email
                or through our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">TempLink Privacy Team</p>
                <p>Email: privacy@templink.io</p>
                <p>Address: 123 Tech Street, San Francisco, CA 94105</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
