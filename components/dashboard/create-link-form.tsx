"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { isValidUrl } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export function CreateLinkForm() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [expiry, setExpiry] = useState("24h")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Link created!",
        description: "Your temporary link has been created successfully.",
      })

      setUrl("")
      setCustomSlug("")
      setExpiry("24h")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="url">Original URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Custom Slug (Optional)</Label>
            <Input id="slug" placeholder="my-link" value={customSlug} onChange={(e) => setCustomSlug(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="expiry">Expires In</Label>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
