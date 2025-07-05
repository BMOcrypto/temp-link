"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Link2, Zap } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function Hero() {
  const [url, setUrl] = useState("")
  const [customSlug, setCustomSlug] = useState("")
  const [expiry, setExpiry] = useState("24h")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL to shorten",
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
          customSlug: customSlug || undefined,
          expiry,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create link")
      }

      toast({
        title: "Success!",
        description: `Link created! Your temporary link: templink.io/${data.shortCode}`,
      })

      // Reset form
      setUrl("")
      setCustomSlug("")
      setExpiry("24h")
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

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Temporary Links That Expire
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create time-limited URLs that automatically expire. Perfect for sharing sensitive content, temporary access,
            or time-sensitive information.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto mb-16 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your URL
                </label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/your-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg py-3"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom slug (optional)
                  </label>
                  <Input
                    id="slug"
                    placeholder="my-custom-link"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-2">
                    Expires in
                  </label>
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

              <Button
                type="submit"
                className="w-full text-lg py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Temporary Link"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Time-Limited</h3>
            <p className="text-gray-600">Set custom expiration times from 1 hour to 30 days</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom URLs</h3>
            <p className="text-gray-600">Create memorable short links with custom slugs</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">Track clicks, locations, and referrer data</p>
          </div>
        </div>
      </div>
    </section>
  )
}
