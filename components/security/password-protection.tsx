"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Lock, Shield, Eye, EyeOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PasswordProtectionProps {
  linkId?: string
  userTier: "free" | "pro"
  onUpdate?: (settings: any) => void
}

export function PasswordProtection({ linkId, userTier, onUpdate }: PasswordProtectionProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (isEnabled && !password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/links/${linkId}/security`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passwordProtected: isEnabled,
          password: isEnabled ? password : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Security Updated",
          description: "Link security settings have been updated",
        })
        onUpdate?.({ passwordProtected: isEnabled, password: isEnabled ? password : null })
      } else {
        throw new Error("Failed to update security settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Password protection is available for Pro users</p>
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
          <Lock className="h-5 w-5" />
          Password Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="password-protection">Enable Password Protection</Label>
            <p className="text-sm text-gray-600">Require a password to access this link</p>
          </div>
          <Switch id="password-protection" checked={isEnabled} onCheckedChange={setIsEnabled} />
        </div>

        {isEnabled && (
          <div className="space-y-3">
            <Label htmlFor="link-password">Password</Label>
            <div className="relative">
              <Input
                id="link-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Users will need to enter this password before being redirected to the original URL
            </p>
          </div>
        )}

        <Button onClick={handleSave} disabled={isLoading} className="w-full">
          <Shield className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Security Settings"}
        </Button>

        {isEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900">Security Features</p>
                <ul className="text-blue-800 mt-1 space-y-1">
                  <li>• Password is encrypted and stored securely</li>
                  <li>• Failed attempts are logged and monitored</li>
                  <li>• Password can be changed anytime</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
