"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Link2, Zap } from "lucide-react"
import { isValidUrl } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { DemoBanner } from "@/components/demo-banner"

export function Hero() {
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
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalUrl: url,
          customSlug,
          expiry,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Link created!",
          description: `Your temporary link: templink.io/${data.shortCode}`,
        })
        setUrl("")
        setCustomSlug("")
      } else {
        throw new Error("Failed to create link")
      }
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
    <section className="container mx-auto px-4 py-20">
      <DemoBanner />

      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TempLink
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create time-limited short links that automatically expire. Perfect for temporary sharing, event promotions,
          and secure link distribution.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto mb-16">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Create Your Temporary Link
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="url">Original URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your-long-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Custom Slug (Optional)</Label>
                <Input
                  id="slug"
                  placeholder="my-custom-link"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                />
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
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              <Zap className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Temporary Link"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Time-Limited</h3>
          <p className="text-gray-600">Set custom expiration dates and times for your links</p>
        </div>

        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Link2 className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Custom Slugs</h3>
          <p className="text-gray-600">Create memorable short links with custom slugs</p>
        </div>

        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Analytics</h3>
          <p className="text-gray-600">Track clicks, referrers, and geographic data</p>
        </div>
      </div>
    </section>
  )
}
