import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { createServerClient } from "@/lib/supabase"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { LinksTable } from "@/components/dashboard/links-table"
import { CreateLinkForm } from "@/components/dashboard/create-link-form"
import { BillingCard } from "@/components/dashboard/billing-card"
import { ApiKeys } from "@/components/dashboard/api-keys"
import { BulkOperations } from "@/components/dashboard/bulk-operations"
import { QRCodeGenerator } from "@/components/dashboard/qr-code-generator"
import { LinkPreview } from "@/components/dashboard/link-preview"
import { UsageAnalytics } from "@/components/dashboard/usage-analytics"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin")
  }

  // Get user data from our database
  const supabase = createServerClient()
  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your temporary links and view analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StatsCards />
            <LinksTable />
          </div>

          <div className="space-y-6">
            <CreateLinkForm />
            <UsageAnalytics userTier={userData?.tier || "free"} />
            <BillingCard
              userTier={userData?.tier || "free"}
              subscriptionStatus={userData?.subscription_status}
              userId={user.id}
            />
          </div>
        </div>

        {/* Pro Features Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Advanced Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <ApiKeys userTier={userData?.tier || "free"} userId={user.id} />
            <BulkOperations userTier={userData?.tier || "free"} />
            <QRCodeGenerator />
            <LinkPreview />
          </div>
        </div>
      </main>
    </div>
  )
}
