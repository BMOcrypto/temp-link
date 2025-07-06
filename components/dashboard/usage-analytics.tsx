"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Target } from "lucide-react"

interface UsageData {
  linksThisMonth: number
  linksLimit: number
  clicksThisMonth: number
  topPerformingLink: {
    shortCode: string
    clicks: number
  } | null
}

export function UsageAnalytics({ userTier }: { userTier: "free" | "pro" }) {
  const [usage, setUsage] = useState<UsageData>({
    linksThisMonth: 0,
    linksLimit: userTier === "free" ? 10 : -1,
    clicksThisMonth: 0,
    topPerformingLink: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUsageData()
  }, [])

  const fetchUsageData = async () => {
    try {
      const response = await fetch("/api/usage")
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error("Failed to fetch usage data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const usagePercentage = usage.linksLimit > 0 ? (usage.linksThisMonth / usage.linksLimit) * 100 : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Usage Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {userTier === "free" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Monthly Links</span>
              <span className="text-sm text-gray-600">
                {usage.linksThisMonth} / {usage.linksLimit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
            {usagePercentage > 80 && (
              <p className="text-xs text-orange-600 mt-1">
                You're approaching your monthly limit. Consider upgrading to Pro.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{usage.linksThisMonth}</div>
            <div className="text-xs text-blue-600">Links This Month</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{usage.clicksThisMonth}</div>
            <div className="text-xs text-green-600">Clicks This Month</div>
          </div>
        </div>

        {usage.topPerformingLink && (
          <div>
            <h4 className="text-sm font-medium mb-2">Top Performing Link</h4>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <code className="text-sm">{usage.topPerformingLink.shortCode}</code>
              <Badge variant="outline">{usage.topPerformingLink.clicks} clicks</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
