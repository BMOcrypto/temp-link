"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Copy, ExternalLink } from "lucide-react"
import { isValidUrl } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export function CreateLinkForm() {
  const [formData, setFormData] = useState({
    url: "",
    customSlug: "",
    expiry: "24h",
    title: "",
    isNsfw: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidUrl(formData.url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: formData.url,
          customSlug: formData.customSlug || undefined,
          expiry: formData.expiry,
          title: formData.title || undefined,
          isNsfw: formData.isNsfw,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link")
      }

      const shortUrl = `${window.location.origin}/${data.shortCode}`
      setCreatedLink(shortUrl)

      toast({
        title: "Success!",
        description: "Your temporary link has been created successfully.",
      })

      // Reset form
      setFormData({
        url: "",
        customSlug: "",
        expiry: "24h",
        title: "",
        isNsfw: false,
      })
    } catch (error) {
      console.error("Error creating link:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create New Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        {createdLink && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-2">Link Created Successfully!</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-white px-2 py-1 rounded border text-green-700">{createdLink}</code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(createdLink)}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a href={createdLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">Original URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/your-long-url"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="My Important Link"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="slug">Custom Slug (Optional)</Label>
            <Input
              id="slug"
              placeholder="my-custom-link"
              value={formData.customSlug}
              onChange={(e) => handleInputChange("customSlug", e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated slug</p>
          </div>

          <div>
            <Label htmlFor="expiry">Expires In</Label>
            <Select value={formData.expiry} onValueChange={(value) => handleInputChange("expiry", value)}>
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

          <div className="flex items-center space-x-2">
            <Switch
              id="nsfw"
              checked={formData.isNsfw}
              onCheckedChange={(checked) => handleInputChange("isNsfw", checked)}
            />
            <Label htmlFor="nsfw" className="text-sm">
              Mark as NSFW (Not Safe For Work)
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
