import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { TeamWorkspace } from "@/components/teams/team-workspace"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Crown, UserCheck, Eye, Edit } from "lucide-react"

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
          <p className="text-gray-600">Collaborate with your team members and manage permissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TeamWorkspace userTier={userData?.tier || "free"} />
          </div>

          <div className="space-y-6">
            {/* Team Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">5</div>
                    <div className="text-sm text-blue-700">Team Members</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">127</div>
                    <div className="text-sm text-green-700">Shared Links</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Members</span>
                    <span className="font-medium">4/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "80%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role Permissions Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Permission Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <div>
                      <div className="font-medium">Owner</div>
                      <div className="text-sm text-gray-600">Full access & billing</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-gray-600">Manage team & links</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Edit className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Editor</div>
                      <div className="text-sm text-gray-600">Create & edit links</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Eye className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Viewer</div>
                      <div className="text-sm text-gray-600">View only access</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Sarah</span> created a new link
                      <div className="text-gray-500">2 hours ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Mike</span> joined the team
                      <div className="text-gray-500">1 day ago</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <span className="font-medium">Alex</span> updated link analytics
                      <div className="text-gray-500">2 days ago</div>
                    </div>
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
