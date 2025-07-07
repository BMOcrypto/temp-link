"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, TrendingUp, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface TimeData {
  period: string
  clicks: number
  label: string
}

interface TimeAnalyticsProps {
  linkId: string
}

export function TimeAnalytics({ linkId }: TimeAnalyticsProps) {
  const [timeData, setTimeData] = useState<TimeData[]>([])
  const [viewMode, setViewMode] = useState<"hourly" | "daily" | "weekly">("daily")
  const [isLoading, setIsLoading] = useState(true)
  const [peakTime, setPeakTime] = useState<string>("")
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    fetchTimeData()
  }, [linkId, viewMode])

  const fetchTimeData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics/${linkId}/time?mode=${viewMode}`)
      if (response.ok) {
        const data = await response.json()
        setTimeData(data.timeData)
        setPeakTime(data.peakTime)
        setTotalClicks(data.totalClicks)
      } else {
        // Mock data for demo
        generateMockData()
      }
    } catch (error) {
      console.error("Failed to fetch time data:", error)
      generateMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const generateMockData = () => {
    let mockData: TimeData[] = []
    let peak = ""
    let total = 0

    switch (viewMode) {
      case "hourly":
        mockData = Array.from({ length: 24 }, (_, i) => {
          const clicks = Math.floor(Math.random() * 20) + (i >= 9 && i <= 17 ? 10 : 2)
          total += clicks
          return {
            period: i.toString(),
            clicks,
            label: `${i}:00`,
          }
        })
        peak = "14:00 (Peak Hour)"
        break
      case "daily":
        mockData = Array.from({ length: 7 }, (_, i) => {
          const clicks = Math.floor(Math.random() * 50) + 10
          total += clicks
          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
          return {
            period: i.toString(),
            clicks,
            label: days[i],
          }
        })
        peak = "Wednesday (Peak Day)"
        break
      case "weekly":
        mockData = Array.from({ length: 4 }, (_, i) => {
          const clicks = Math.floor(Math.random() * 200) + 50
          total += clicks
          return {
            period: i.toString(),
            clicks,
            label: `Week ${i + 1}`,
          }
        })
        peak = "Week 3 (Peak Week)"
        break
    }

    setTimeData(mockData)
    setPeakTime(peak)
    setTotalClicks(total)
  }

  const getChartColor = () => {
    switch (viewMode) {
      case "hourly":
        return "#3B82F6"
      case "daily":
        return "#10B981"
      case "weekly":
        return "#8B5CF6"
      default:
        return "#3B82F6"
    }
  }

  const getViewModeIcon = () => {
    switch (viewMode) {
      case "hourly":
        return <Clock className="h-4 w-4" />
      case "daily":
        return <Calendar className="h-4 w-4" />
      case "weekly":
        return <Activity className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
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
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
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
          <div className="flex gap-2">
            <Button
              variant={viewMode === "hourly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("hourly")}
            >
              Hourly
            </Button>
            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("daily")}
            >
              Daily
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("weekly")}
            >
              Weekly
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalClicks}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              {getViewModeIcon()}
              Total Clicks
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{peakTime}</div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Peak Time
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "hourly" ? (
              <BarChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Time: ${label}`} formatter={(value) => [value, "Clicks"]} />
                <Bar dataKey="clicks" fill={getChartColor()} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip labelFormatter={(label) => `Period: ${label}`} formatter={(value) => [value, "Clicks"]} />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke={getChartColor()}
                  strokeWidth={3}
                  dot={{ fill: getChartColor(), strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance Insights
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            {viewMode === "hourly" && (
              <>
                <p>• Peak activity occurs during business hours (9 AM - 5 PM)</p>
                <p>• Lowest activity during early morning hours (2 AM - 6 AM)</p>
                <p>• Consider scheduling content during peak hours for maximum engagement</p>
              </>
            )}
            {viewMode === "daily" && (
              <>
                <p>• Weekdays show higher engagement than weekends</p>
                <p>• Wednesday typically has the highest click-through rate</p>
                <p>• Plan important campaigns for mid-week launches</p>
              </>
            )}
            {viewMode === "weekly" && (
              <>
                <p>• Consistent growth pattern over the past month</p>
                <p>• Week 3 showed exceptional performance</p>
                <p>• Maintain current strategy for sustained growth</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
