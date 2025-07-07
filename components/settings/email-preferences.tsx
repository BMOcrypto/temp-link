"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Mail, Shield, Users, BarChart3, Webhook, Calendar } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface EmailPreferences {
  marketingEmails: boolean
  securityAlerts: boolean
  usageNotifications: boolean
  teamInvitations: boolean
  webhookNotifications: boolean
  weeklyReports: boolean
}

export function EmailPreferences() {
  const [preferences, setPreferences] = useState<EmailPreferences>({
    marketingEmails: true,
    securityAlerts: true,
    usageNotifications: true,
    teamInvitations: true,
    webhookNotifications: false,
    weeklyReports: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/email-preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences({
          marketingEmails: data.marketing_emails,
          securityAlerts: data.security_alerts,
          usageNotifications: data.usage_notifications,
          teamInvitations: data.team_invitations,
          webhookNotifications: data.webhook_notifications,
          weeklyReports: data.weekly_reports,
        })
      }
    } catch (error) {
      console.error("Failed to fetch email preferences:", error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreference = (key: keyof EmailPreferences, value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user/email-preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          marketing_emails: preferences.marketingEmails,
          security_alerts: preferences.securityAlerts,
          usage_notifications: preferences.usageNotifications,
          team_invitations: preferences.teamInvitations,
          webhook_notifications: preferences.webhookNotifications,
          weekly_reports: preferences.weeklyReports,
        }),
      })

      if (response.ok) {
        toast({
          title: "Preferences Updated",
          description: "Your email preferences have been saved successfully",
        })
      } else {
        throw new Error("Failed to update preferences")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-48"></div>
                </div>
                <div className="h-6 w-11 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
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
          <Mail className="h-5 w-5" />
          Email Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-red-600" />
                <span className="font-medium">Security Alerts</span>
              </div>
              <p className="text-sm text-gray-600">Important security notifications and login alerts</p>
            </div>
            <Switch
              checked={preferences.securityAlerts}
              onCheckedChange={(checked) => updatePreference("securityAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Usage Notifications</span>
              </div>
              <p className="text-sm text-gray-600">Alerts when approaching usage limits</p>
            </div>
            <Switch
              checked={preferences.usageNotifications}
              onCheckedChange={(checked) => updatePreference("usageNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">Team Invitations</span>
              </div>
              <p className="text-sm text-gray-600">Notifications for team invitations and updates</p>
            </div>
            <Switch
              checked={preferences.teamInvitations}
              onCheckedChange={(checked) => updatePreference("teamInvitations", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Webhook Notifications</span>
              </div>
              <p className="text-sm text-gray-600">Email notifications for webhook events</p>
            </div>
            <Switch
              checked={preferences.webhookNotifications}
              onCheckedChange={(checked) => updatePreference("webhookNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Weekly Reports</span>
              </div>
              <p className="text-sm text-gray-600">Weekly summary of your link performance</p>
            </div>
            <Switch
              checked={preferences.weeklyReports}
              onCheckedChange={(checked) => updatePreference("weeklyReports", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Marketing Emails</span>
              </div>
              <p className="text-sm text-gray-600">Product updates, tips, and promotional content</p>
            </div>
            <Switch
              checked={preferences.marketingEmails}
              onCheckedChange={(checked) => updatePreference("marketingEmails", checked)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button onClick={savePreferences} disabled={saving}>
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          <p>
            <strong>Note:</strong> Security alerts cannot be disabled as they are essential for account security. You
            can unsubscribe from marketing emails at any time using the link in those emails.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
