"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Shield, Lock, Eye, EyeOff, Key, AlertTriangle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PasswordProtectionProps {
  userTier: "free" | "pro"
  linkId?: string
}

export function PasswordProtection({ userTier, linkId }: PasswordProtectionProps) {
  const [isEnabled, setIsEnabled] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [securityLevel, setSecurityLevel] = useState<"weak" | "medium" | "strong">("weak")

  useEffect(() => {
    if (linkId && userTier === "pro") {
      fetchPasswordStatus()
    }
  }, [linkId, userTier])

  useEffect(() => {
    checkPasswordStrength(password)
  }, [password])

  const fetchPasswordStatus = async () => {
    try {
      const response = await fetch(`/api/links/${linkId}/password`)
      if (response.ok) {
        const data = await response.json()
        setIsEnabled(data.hasPassword)
      }
    } catch (error) {
      console.error("Failed to fetch password status:", error)
    }
  }

  const checkPasswordStrength = (pwd: string) => {
    if (pwd.length < 6) {
      setSecurityLevel("weak")
    } else if (pwd.length >= 6 && pwd.length < 12) {
      setSecurityLevel("medium")
    } else if (pwd.length >= 12 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(pwd)) {
      setSecurityLevel("strong")
    } else {
      setSecurityLevel("medium")
    }
  }

  const handlePasswordToggle = async (enabled: boolean) => {
    if (!enabled) {
      // Disable password protection
      setIsLoading(true)
      try {
        const response = await fetch(`/api/links/${linkId}/password`, {
          method: "DELETE",
        })

        if (response.ok) {
          setIsEnabled(false)
          setPassword("")
          setConfirmPassword("")
          toast({
            title: "Password Protection Disabled",
            description: "Your link is now publicly accessible",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to disable password protection",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsEnabled(true)
    }
  }

  const handlePasswordSave = async () => {
    if (!password.trim()) {
      toast({
        title: "Error",
        description: "Please enter a password",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/links/${linkId}/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        toast({
          title: "Password Protection Enabled",
          description: "Your link is now password protected",
        })
        setPassword("")
        setConfirmPassword("")
      } else {
        throw new Error("Failed to set password")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable password protection",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getSecurityBadge = () => {
    switch (securityLevel) {
      case "weak":
        return (
          <Badge variant="destructive" className="text-xs">
            Weak
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="text-xs">
            Medium
          </Badge>
        )
      case "strong":
        return (
          <Badge variant="default" className="text-xs bg-green-600">
            Strong
          </Badge>
        )
      default:
        return null
    }
  }

  const getSecurityColor = () => {
    switch (securityLevel) {
      case "weak":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "strong":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Password Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Secure Your Links</h3>
            <p className="text-gray-600 mb-4">Add password protection to your sensitive links</p>
            <Badge variant="outline" className="mb-4">
              Pro Feature
            </Badge>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Password-protected access</p>
              <p>• Encrypted password storage</p>
              <p>• Custom security messages</p>
              <p>• Access attempt logging</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Password Protection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isEnabled ? "bg-green-100" : "bg-gray-100"}`}>
              {isEnabled ? <Lock className="h-4 w-4 text-green-600" /> : <Key className="h-4 w-4 text-gray-600" />}
            </div>
            <div>
              <h4 className="font-medium">Password Protection</h4>
              <p className="text-sm text-gray-600">
                {isEnabled ? "Link is password protected" : "Link is publicly accessible"}
              </p>
            </div>
          </div>
          <Switch checked={isEnabled} onCheckedChange={handlePasswordToggle} disabled={isLoading} />
        </div>

        {/* Password Setup */}
        {isEnabled && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              Set Password
            </h4>

            <div className="space-y-3">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a secure password"
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
                {password && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-sm ${getSecurityColor()}`}>Password Strength:</span>
                    {getSecurityBadge()}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
              </div>

              <Button
                onClick={handlePasswordSave}
                disabled={isLoading || !password || password !== confirmPassword}
                className="w-full"
              >
                {isLoading ? "Saving..." : "Save Password"}
              </Button>
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Security Best Practices
          </h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Use at least 12 characters with mixed case, numbers, and symbols</p>
            <p>• Avoid common words or personal information</p>
            <p>• Share passwords securely through encrypted channels</p>
            <p>• Consider using a password manager for complex passwords</p>
          </div>
        </div>

        {/* Access Log Preview */}
        {isEnabled && (
          <div className="border rounded-lg p-4">
            <h5 className="font-medium mb-3 flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Recent Access Attempts
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Successful access</span>
                <span className="text-green-600">2 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span>Failed attempt</span>
                <span className="text-red-600">5 hours ago</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Successful access</span>
                <span className="text-green-600">1 day ago</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
