"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface InvitationData {
  id: string
  email: string
  role: string
  teamName: string
  inviterName: string
  expiresAt: string
  status: string
}

export default function TeamInvitePage() {
  const params = useParams()
  const router = useRouter()
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchInvitation()
  }, [params.token])

  const fetchInvitation = async () => {
    try {
      const response = await fetch(`/api/team/invite/${params.token}`)

      if (response.ok) {
        const data = await response.json()
        setInvitation(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Invalid or expired invitation")
      }
    } catch (error) {
      setError("Failed to load invitation")
    } finally {
      setLoading(false)
    }
  }

  const acceptInvitation = async () => {
    setAccepting(true)
    try {
      const response = await fetch(`/api/team/invite/${params.token}/accept`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Invitation Accepted",
          description: "You've successfully joined the team!",
        })
        router.push("/teams")
      } else {
        const errorData = await response.json()
        toast({
          title: "Error",
          description: errorData.error || "Failed to accept invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept invitation",
        variant: "destructive",
      })
    } finally {
      setAccepting(false)
    }
  }

  const declineInvitation = async () => {
    try {
      const response = await fetch(`/api/team/invite/${params.token}/decline`, {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Invitation Declined",
          description: "You've declined the team invitation",
        })
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "Failed to decline invitation",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline invitation",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/")} variant="outline">
              Go to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invitation) {
    return null
  }

  const isExpired = new Date(invitation.expiresAt) < new Date()
  const isAlreadyAccepted = invitation.status === "accepted"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Users className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <CardTitle>Team Invitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">You're invited to join</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">{invitation.teamName}</p>
            <p className="text-gray-600">
              Invited by <strong>{invitation.inviterName}</strong>
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Role:</span>
              <Badge variant="outline">{invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1)}</Badge>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-gray-600">{invitation.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Expires:</span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(invitation.expiresAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isExpired ? (
            <div className="text-center">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600 font-medium">This invitation has expired</p>
              <p className="text-sm text-gray-600">Please contact the team owner for a new invitation</p>
            </div>
          ) : isAlreadyAccepted ? (
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Invitation already accepted</p>
              <Button onClick={() => router.push("/teams")} className="mt-4">
                Go to Teams
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button onClick={acceptInvitation} disabled={accepting} className="w-full">
                {accepting ? "Accepting..." : "Accept Invitation"}
              </Button>
              <Button onClick={declineInvitation} variant="outline" className="w-full bg-transparent">
                Decline
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 text-center">
            By accepting this invitation, you'll be able to collaborate on link management and access team features.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
