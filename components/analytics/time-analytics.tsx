"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface TimeData {
  period: string
  clicks: number
  hour?: number
  day?: string
}

interface TimeAnalyticsProps {
  linkId: string
}

export function TimeAnalytics({ linkId }: TimeAnalyticsProps) {
  const [timeData, setTimeData] = useState<TimeData[]>([])
  const [viewType, setViewType] = useState<"hourly" | "daily" | "weekly">("daily")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTimeData()
  }, [linkId, viewType])

  const fetchTimeData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/${linkId}/time?type=${viewType}`)
      if (response.ok) {
        const data = await response.json()
        setTimeData(data)
      }
    } catch (error) {
      console.error("Failed to fetch time data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatXAxisLabel = (value: string) => {
    if (viewType === "hourly") {
      return `${value}:00`
    }
    if (viewType === "daily") {
      return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    return value
  }

  const getChartTitle = () => {
    switch (viewType) {
      case "hourly":
        return "Clicks by Hour (Last 24 Hours)"
      case "daily":
        return "Clicks by Day (Last 30 Days)"
      case "weekly":
        return "Clicks by Week (Last 12 Weeks)"
      default:
        return "Click Analytics"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Analytics
          </CardTitle>
          <Select value={viewType} onValueChange={(value: "hourly" | "daily" | "weekly") => setViewType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600">{getChartTitle()}</h4>
        </div>

        {timeData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No time data available yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {viewType === "hourly" ? (
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickFormatter={formatXAxisLabel} />
                <YAxis />
                <Tooltip labelFormatter={(value) => `${value}:00`} formatter={(value: number) => [value, "Clicks"]} />
                <Bar dataKey="clicks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tickFormatter={formatXAxisLabel} />
                <YAxis />
                <Tooltip labelFormatter={formatXAxisLabel} formatter={(value: number) => [value, "Clicks"]} />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        {/* Peak Time Insights */}
        {timeData.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">📊 Insights</h5>
            <div className="text-sm text-blue-800">
              {viewType === "hourly" && (
                <p>
                  Peak hour: {timeData.reduce((max, curr) => (curr.clicks > max.clicks ? curr : max)).period}:00 with{" "}
                  {Math.max(...timeData.map((d) => d.clicks))} clicks
                </p>
              )}
              {viewType === "daily" && (
                <p>
                  Best day:{" "}
                  {formatXAxisLabel(timeData.reduce((max, curr) => (curr.clicks > max.clicks ? curr : max)).period)}{" "}
                  with {Math.max(...timeData.map((d) => d.clicks))} clicks
                </p>
              )}
              {viewType === "weekly" && (
                <p>
                  Best week: {timeData.reduce((max, curr) => (curr.clicks > max.clicks ? curr : max)).period} with{" "}
                  {Math.max(...timeData.map((d) => d.clicks))} clicks
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
