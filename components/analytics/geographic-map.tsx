"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, TrendingUp, MapPin } from "lucide-react"

interface GeographicData {
  country: string
  countryCode: string
  clicks: number
  percentage: number
  flag: string
}

interface GeographicMapProps {
  linkId: string
}

export function GeographicMap({ linkId }: GeographicMapProps) {
  const [geoData, setGeoData] = useState<GeographicData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalClicks, setTotalClicks] = useState(0)

  useEffect(() => {
    fetchGeographicData()
  }, [linkId])

  const fetchGeographicData = async () => {
    try {
      const response = await fetch(`/api/analytics/${linkId}/geographic`)
      if (response.ok) {
        const data = await response.json()
        setGeoData(data.countries)
        setTotalClicks(data.totalClicks)
      } else {
        // Mock data for demo
        const mockData = [
          { country: "United States", countryCode: "US", clicks: 125, percentage: 45.5, flag: "🇺🇸" },
          { country: "United Kingdom", countryCode: "GB", clicks: 67, percentage: 24.4, flag: "🇬🇧" },
          { country: "Canada", countryCode: "CA", clicks: 34, percentage: 12.4, flag: "🇨🇦" },
          { country: "Germany", countryCode: "DE", clicks: 28, percentage: 10.2, flag: "🇩🇪" },
          { country: "France", countryCode: "FR", clicks: 21, percentage: 7.6, flag: "🇫🇷" },
        ]
        setGeoData(mockData)
        setTotalClicks(275)
      }
    } catch (error) {
      console.error("Failed to fetch geographic data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIntensityColor = (percentage: number) => {
    if (percentage >= 40) return "bg-blue-600"
    if (percentage >= 20) return "bg-blue-500"
    if (percentage >= 10) return "bg-blue-400"
    if (percentage >= 5) return "bg-blue-300"
    return "bg-blue-200"
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geographic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{geoData.length}</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalClicks}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{geoData[0]?.country.split(" ")[0] || "N/A"}</div>
            <div className="text-sm text-gray-600">Top Country</div>
          </div>
        </div>

        {/* Country List */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Top Countries
          </h4>

          {geoData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No geographic data available</p>
              <p className="text-sm">Data will appear as your links get clicked</p>
            </div>
          ) : (
            <div className="space-y-3">
              {geoData.map((country, index) => (
                <div key={country.countryCode} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Top
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{country.clicks}</div>
                      <div className="text-sm text-gray-600">{country.percentage}%</div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getIntensityColor(country.percentage)}`}
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* World Map Placeholder */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center">
          <Globe className="h-16 w-16 text-blue-400 mx-auto mb-3" />
          <h4 className="font-medium text-blue-900 mb-2">Interactive World Map</h4>
          <p className="text-sm text-blue-700">Visual world map with click heatmaps coming soon in the next update</p>
        </div>
      </CardContent>
    </Card>
  )
}
