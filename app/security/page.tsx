import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { PasswordProtection } from "@/components/security/password-protection"
import { WebhookManager } from "@/components/webhooks/webhook-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, AlertTriangle } from "lucide-react"

export default async function SecurityPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const supabase = createServerClient()
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security & Integrations</h1>
          <p className="text-gray-600">Manage security settings and webhook integrations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PasswordProtection userTier={userData?.tier || "free"} />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">HTTPS Encryption</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Secure Link Storage</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">ACTIVE</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Link Scanning</span>
                    </div>
                    <span className="text-xs text-yellow-600 font-medium">PRO ONLY</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h5 className="font-medium text-blue-900 mb-2">🔒 Security Best Practices</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use strong passwords for protected links</li>
                    <li>• Regularly review and rotate API keys</li>
                    <li>• Monitor webhook delivery logs</li>
                    <li>• Set appropriate expiration times</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <WebhookManager userTier={userData?.tier || "free"} />
          </div>
        </div>
      </main>
    </div>
  )
}
