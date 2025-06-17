"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Zap, Globe } from "lucide-react"

export function SystemHealth() {
  const healthMetrics = [
    {
      name: "Server Status",
      status: "healthy",
      value: 99.9,
      icon: Server,
      description: "All systems operational",
    },
    {
      name: "Database",
      status: "healthy",
      value: 98.5,
      icon: Database,
      description: "Response time: 45ms",
    },
    {
      name: "API Performance",
      status: "warning",
      value: 85.2,
      icon: Zap,
      description: "Slightly elevated response times",
    },
    {
      name: "CDN Status",
      status: "healthy",
      value: 99.8,
      icon: Globe,
      description: "Global edge locations active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "default"
      case "warning":
        return "secondary"
      case "error":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="h-4 w-4" />
                <span className="font-medium">{metric.name}</span>
              </div>
              <Badge variant={getStatusColor(metric.status)}>{metric.status}</Badge>
            </div>
            <Progress value={metric.value} className="h-2" />
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
