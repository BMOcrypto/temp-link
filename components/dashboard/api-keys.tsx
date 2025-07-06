"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Key, Copy, RotateCcw, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface ApiKeysProps {
  userTier: "free" | "pro"
  userId: string
}

export function ApiKeys({ userTier, userId }: ApiKeysProps) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userTier === "pro") {
      fetchApiKey()
    }
  }, [userTier])

  const fetchApiKey = async () => {
    try {
      const response = await fetch("/api/user/api-key")
      if (response.ok) {
        const data = await response.json()
        setApiKey(data.apiKey)
      }
    } catch (error) {
      console.error("Failed to fetch API key:", error)
    }
  }

  const generateApiKey = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/user/api-key", {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setApiKey(data.apiKey)
        toast({
          title: "API Key Generated",
          description: "Your new API key has been created successfully.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate API key",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyApiKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      toast({
        title: "Copied!",
        description: "API key copied to clipboard",
      })
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Key className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">API access is available for Pro users</p>
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
          <Key className="h-5 w-5" />
          API Keys
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiKey ? (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Your API Key</label>
            <div className="flex items-center gap-2">
              <Input type={isVisible ? "text" : "password"} value={apiKey} readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={copyApiKey}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Keep your API key secure and never share it publicly.</p>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">No API key generated yet</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={generateApiKey} disabled={isLoading} variant={apiKey ? "outline" : "default"}>
            <RotateCcw className="h-4 w-4 mr-2" />
            {isLoading ? "Generating..." : apiKey ? "Regenerate" : "Generate API Key"}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>• Use your API key in the Authorization header</p>
          <p>• Rate limit: 1000 requests per hour</p>
          <p>• See API documentation for usage examples</p>
        </div>
      </CardContent>
    </Card>
  )
}
