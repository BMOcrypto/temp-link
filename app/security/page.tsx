import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { PasswordProtection } from "@/components/security/password-protection"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react"

export default async function SecurityPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  const supabase = createServerClient()
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  // Mock security status data
  const securityStatus = {
    overallScore: 85,
    twoFactorEnabled: true,
    passwordProtectedLinks: 3,
    recentSecurityEvents: 0,
    lastSecurityScan: "2024-01-20T10:30:00Z",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Center</h1>
          <p className="text-gray-600">Manage your account security and link protection settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Security Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-green-500"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${securityStatus.overallScore}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{securityStatus.overallScore}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Security Score</h3>
                    <p className="text-sm text-gray-600">Excellent security posture</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Two-Factor Authentication</span>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        Enabled
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Password Protected Links</span>
                      </div>
                      <Badge variant="outline">{securityStatus.passwordProtectedLinks}</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Recent Security Events</span>
                      </div>
                      <Badge variant="outline">{securityStatus.recentSecurityEvents}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Protection */}
            <PasswordProtection userTier={userData?.tier || "free"} />

            {/* Security Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Security Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Strong Account Security</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your account has two-factor authentication enabled and uses a strong password.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Enable Password Protection</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Consider adding password protection to sensitive links for an extra layer of security.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Eye className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Monitor Link Access</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Regularly review your link analytics to detect any unusual access patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Account Protection</span>
                  <Badge variant="default" className="bg-green-600">
                    Secure
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Link Encryption</span>
                  <Badge variant="default" className="bg-green-600">
                    Active
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Privacy</span>
                  <Badge variant="default" className="bg-green-600">
                    Compliant
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Access Monitoring</span>
                  <Badge variant="default" className="bg-green-600">
                    Enabled
                  </Badge>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Last security scan: {new Date(securityStatus.lastSecurityScan).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Security Events */}
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Successful login</span>
                      <div className="text-gray-500">2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Password updated</span>
                      <div className="text-gray-500">3 days ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">2FA verification</span>
                      <div className="text-gray-500">1 week ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Security Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <p>Use unique passwords for all your accounts</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <p>Enable two-factor authentication wherever possible</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <p>Regularly review and update your security settings</p>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                    <p>Monitor your account for unusual activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
