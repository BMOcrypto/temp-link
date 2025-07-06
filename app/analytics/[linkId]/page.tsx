"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, Copy, Calendar, MousePointer, Globe } from "lucide-react"
import { formatTimeRemaining } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { GeographicMap } from "@/components/analytics/geographic-map"
import { TimeAnalytics } from "@/components/analytics/time-analytics"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface Props {
  params: {
    linkId: string
  }
}

export default function AnalyticsPage({ params }: Props) {
  // Mock data - in a real app, this would come from your database
  const linkData = {
    id: params.linkId,
    shortCode: "abc123",
    originalUrl: "https://example.com/very-long-url-that-needs-shortening",
    title: "Example Website",
    clicks: 247,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
  }

  const clicksOverTime = [
    { date: "2024-01-15", clicks: 12 },
    { date: "2024-01-16", clicks: 19 },
    { date: "2024-01-17", clicks: 25 },
    { date: "2024-01-18", clicks: 31 },
    { date: "2024-01-19", clicks: 28 },
    { date: "2024-01-20", clicks: 35 },
    { date: "2024-01-21", clicks: 42 },
  ]

  const referrerData = [
    { name: "Direct", value: 45, color: "#3B82F6" },
    { name: "Google", value: 30, color: "#10B981" },
    { name: "Twitter", value: 15, color: "#F59E0B" },
    { name: "Facebook", value: 10, color: "#EF4444" },
  ]

  const deviceData = [
    { name: "Desktop", value: 60, color: "#8B5CF6" },
    { name: "Mobile", value: 35, color: "#06B6D4" },
    { name: "Tablet", value: 5, color: "#84CC16" },
  ]

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`https://templink.io/${shortCode}`)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Advanced Analytics</h1>
              <div className="flex items-center gap-4">
                <code className="bg-gray-100 px-3 py-1 rounded text-sm">templink.io/{linkData.shortCode}</code>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(linkData.shortCode)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={linkData.originalUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </a>
                </Button>
              </div>
            </div>

            <Badge variant={linkData.isActive ? "default" : "secondary"}>
              {linkData.isActive ? "Active" : "Expired"}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{linkData.clicks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clicks Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Country</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">🇺🇸 US</div>
              <p className="text-xs text-muted-foreground">45% of clicks</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expires In</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatTimeRemaining(linkData.expiresAt)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TimeAnalytics linkId={params.linkId} />
          <GeographicMap linkId={params.linkId} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={referrerData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {referrerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
