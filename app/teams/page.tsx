import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { TeamWorkspace } from "@/components/teams/team-workspace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Crown, UserCheck, Eye } from "lucide-react"

export default async function TeamsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-600">Collaborate with your team on link management</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TeamWorkspace userTier={userData?.tier || "free"} />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">Owner</p>
                      <p className="text-sm text-yellow-800">Full control, billing access</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Admin</p>
                      <p className="text-sm text-blue-800">Manage team, create links</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">Editor</p>
                      <p className="text-sm text-green-800">Create and edit links</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Viewer</p>
                      <p className="text-sm text-gray-800">View links and analytics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {userData?.tier === "pro" && (
              <Card>
                <CardHeader>
                  <CardTitle>Team Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Members</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Invites</span>
                      <span className="font-semibold">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Links Created</span>
                      <span className="font-semibold">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Clicks</span>
                      <span className="font-semibold">3,456</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
