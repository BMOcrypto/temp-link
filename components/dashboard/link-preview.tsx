"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, ExternalLink, Globe, Clock, MousePointer } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface LinkPreviewData {
  title: string
  description: string
  image: string
  domain: string
  clicks: number
  expiresAt: string
  isActive: boolean
}

export function LinkPreview() {
  const [shortCode, setShortCode] = useState("")
  const [previewData, setPreviewData] = useState<LinkPreviewData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadPreview = async () => {
    if (!shortCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a short code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/links/preview/${shortCode}`)
      if (response.ok) {
        const data = await response.json()
        setPreviewData(data)
      } else {
        throw new Error("Link not found")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load link preview",
        variant: "destructive",
      })
      setPreviewData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Link Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter short code"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && loadPreview()}
          />
          <Button onClick={loadPreview} disabled={isLoading}>
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "Preview"}
          </Button>
        </div>

        {previewData && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{previewData.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{previewData.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{previewData.domain}</span>
                  </div>
                </div>
                {previewData.image && (
                  <img
                    src={previewData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg ml-4"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MousePointer className="h-4 w-4" />
                    <span>{previewData.clicks} clicks</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Expires {new Date(previewData.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={previewData.isActive ? "default" : "secondary"}>
                    {previewData.isActive ? "Active" : "Expired"}
                  </Badge>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`/${shortCode}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
