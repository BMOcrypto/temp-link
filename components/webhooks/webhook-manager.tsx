"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Webhook, Plus, Trash2, TestTube, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WebhookConfig {
  id: string
  url: string
  events: string[]
  isActive: boolean
  secret: string
  lastTriggered?: string
  status: "active" | "failed" | "pending"
}

interface WebhookManagerProps {
  userTier: "free" | "pro"
}

export function WebhookManager({ userTier }: WebhookManagerProps) {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [newWebhook, setNewWebhook] = useState({
    url: "",
    events: [] as string[],
    isActive: true,
  })
  const [isLoading, setIsLoading] = useState(false)

  const availableEvents = [
    { value: "link.created", label: "Link Created" },
    { value: "link.clicked", label: "Link Clicked" },
    { value: "link.expired", label: "Link Expired" },
    { value: "link.deleted", label: "Link Deleted" },
  ]

  useEffect(() => {
    if (userTier === "pro") {
      fetchWebhooks()
    }
  }, [userTier])

  const fetchWebhooks = async () => {
    try {
      const response = await fetch("/api/webhooks")
      if (response.ok) {
        const data = await response.json()
        setWebhooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch webhooks:", error)
    }
  }

  const createWebhook = async () => {
    if (!newWebhook.url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a webhook URL",
        variant: "destructive",
      })
      return
    }

    if (newWebhook.events.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one event",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newWebhook),
      })

      if (response.ok) {
        toast({
          title: "Webhook Created",
          description: "Your webhook has been created successfully",
        })
        setNewWebhook({ url: "", events: [], isActive: true })
        fetchWebhooks()
      } else {
        throw new Error("Failed to create webhook")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteWebhook = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Webhook Deleted",
          description: "Webhook has been deleted successfully",
        })
        fetchWebhooks()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive",
      })
    }
  }

  const testWebhook = async (webhookId: string) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}/test`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Test Sent",
          description: "Test webhook has been sent successfully",
        })
      } else {
        throw new Error("Failed to send test webhook")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test webhook",
        variant: "destructive",
      })
    }
  }

  const toggleWebhook = async (webhookId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/webhooks/${webhookId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        toast({
          title: "Webhook Updated",
          description: `Webhook has been ${isActive ? "enabled" : "disabled"}`,
        })
        fetchWebhooks()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update webhook",
        variant: "destructive",
      })
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Webhook className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Notifications</h3>
            <p className="text-gray-600 mb-4">Get instant notifications when events happen with your links</p>
            <Badge variant="outline" className="mb-4">
              Pro Feature
            </Badge>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Real-time event notifications</p>
              <p>• Custom webhook endpoints</p>
              <p>• Event filtering</p>
              <p>• Delivery status tracking</p>
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
          <Webhook className="h-5 w-5" />
          Webhooks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create New Webhook */}
        <div className="space-y-4 p-4 border rounded-lg">
          <h4 className="font-medium">Create New Webhook</h4>

          <div>
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-app.com/webhooks/templink"
              value={newWebhook.url}
              onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
            />
          </div>

          <div>
            <Label>Events to Subscribe</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {availableEvents.map((event) => (
                <label key={event.value} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newWebhook.events.includes(event.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setNewWebhook({
                          ...newWebhook,
                          events: [...newWebhook.events, event.value],
                        })
                      } else {
                        setNewWebhook({
                          ...newWebhook,
                          events: newWebhook.events.filter((ev) => ev !== event.value),
                        })
                      }
                    }}
                    className="rounded"
                  />
                  <span>{event.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button onClick={createWebhook} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Create Webhook"}
          </Button>
        </div>

        {/* Existing Webhooks */}
        <div className="space-y-3">
          <h4 className="font-medium">Active Webhooks ({webhooks.length})</h4>
          {webhooks.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Webhook className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No webhooks configured</p>
              <p className="text-sm">Create your first webhook to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{webhook.url}</code>
                        <Badge variant={webhook.status === "active" ? "default" : "destructive"} className="text-xs">
                          {webhook.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {webhook.status}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                      {webhook.lastTriggered && (
                        <p className="text-xs text-gray-500">
                          Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={webhook.isActive}
                        onCheckedChange={(checked) => toggleWebhook(webhook.id, checked)}
                      />
                      <Button variant="outline" size="sm" onClick={() => testWebhook(webhook.id)}>
                        <TestTube className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteWebhook(webhook.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                    <strong>Secret:</strong> <code>{webhook.secret}</code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Webhook Documentation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-medium text-blue-900 mb-2">📚 Webhook Documentation</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Webhooks are sent as POST requests with JSON payload</p>
            <p>• Include the secret in X-TempLink-Signature header for verification</p>
            <p>• Retry failed deliveries up to 3 times with exponential backoff</p>
            <p>• Timeout after 30 seconds</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
