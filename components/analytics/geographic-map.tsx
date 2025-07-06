"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Users, MapPin } from "lucide-react"

interface GeographicData {
  country: string
  countryCode: string
  clicks: number
  percentage: number
}

interface GeographicMapProps {
  linkId: string
}

export function GeographicMap({ linkId }: GeographicMapProps) {
  const [geoData, setGeoData] = useState<GeographicData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchGeographicData()
  }, [linkId])

  const fetchGeographicData = async () => {
    try {
      const response = await fetch(`/api/analytics/${linkId}/geographic`)
      if (response.ok) {
        const data = await response.json()
        setGeoData(data)
      }
    } catch (error) {
      console.error("Failed to fetch geographic data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCountryFlag = (countryCode: string) => {
    return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
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
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
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
      <CardContent>
        {geoData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No geographic data available yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* World Map Visualization */}
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 text-center">
              <Globe className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <p className="text-sm text-gray-600">Interactive world map coming soon</p>
              <p className="text-xs text-gray-500">Click data from {geoData.length} countries</p>
            </div>

            {/* Country List */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Top Countries
              </h4>
              {geoData.slice(0, 10).map((country, index) => (
                <div key={country.countryCode} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                    <img
                      src={getCountryFlag(country.countryCode) || "/placeholder.svg"}
                      alt={`${country.country} flag`}
                      className="w-6 h-4 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{country.clicks}</div>
                    <div className="text-xs text-gray-500">{country.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
