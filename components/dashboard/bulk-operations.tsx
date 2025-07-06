"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface BulkOperationsProps {
  userTier: "free" | "pro"
}

export function BulkOperations({ userTier }: BulkOperationsProps) {
  const [urls, setUrls] = useState("")
  const [expiry, setExpiry] = useState("24h")
  const [isLoading, setIsLoading] = useState(false)

  const handleBulkCreate = async () => {
    const urlList = urls.split("\n").filter((url) => url.trim())

    if (urlList.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one URL",
        variant: "destructive",
      })
      return
    }

    if (urlList.length > 100) {
      toast({
        title: "Error",
        description: "Maximum 100 URLs allowed per batch",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/links/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: urlList,
          expiry,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create links")
      }

      toast({
        title: "Success!",
        description: `Created ${data.created} links successfully`,
      })

      setUrls("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create links",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await fetch("/api/links/export")
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `templink-export-${new Date().toISOString().split("T")[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Export Complete",
          description: "Your links have been exported to CSV",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export links",
        variant: "destructive",
      })
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Bulk operations are available for Pro users</p>
            <Badge variant="outline">Pro Feature</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Bulk Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Bulk Create Links</label>
          <Textarea
            placeholder="Enter URLs (one per line)&#10;https://example.com/page1&#10;https://example.com/page2"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={6}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum 100 URLs per batch</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Expiry Time</label>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="6h">6 Hours</SelectItem>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleBulkCreate} disabled={isLoading} className="flex-1">
            <Upload className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Links"}
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
