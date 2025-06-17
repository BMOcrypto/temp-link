import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AdminHeader } from "@/components/admin/header"
import { AdminStats } from "@/components/admin/stats"
import { UsersTable } from "@/components/admin/users-table"
import { SystemHealth } from "@/components/admin/system-health"

export default async function AdminPage() {
  const user = await getCurrentUser()

  // In a real app, check if user is admin
  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor system health and manage users</p>
        </div>

        <div className="space-y-8">
          <AdminStats />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <UsersTable />
            <SystemHealth />
          </div>
        </div>
      </main>
    </div>
  )
}
