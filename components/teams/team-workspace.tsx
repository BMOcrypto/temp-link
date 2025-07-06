"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, Plus, MoreHorizontal, Crown, UserCheck, UserX, Mail } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "editor" | "viewer"
  joinedAt: string
  status: "active" | "pending" | "inactive"
}

interface TeamWorkspaceProps {
  userTier: "free" | "pro"
}

export function TeamWorkspace({ userTier }: TeamWorkspaceProps) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (userTier === "pro") {
      fetchTeamMembers()
    }
  }, [userTier])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch("/api/team/members")
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.error("Failed to fetch team members:", error)
    }
  }

  const inviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/team/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: "editor",
        }),
      })

      if (response.ok) {
        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${inviteEmail}`,
        })
        setInviteEmail("")
        fetchTeamMembers()
      } else {
        throw new Error("Failed to send invitation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({
          title: "Role Updated",
          description: "Member role has been updated successfully",
        })
        fetchTeamMembers()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive",
      })
    }
  }

  const removeMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Member Removed",
          description: "Team member has been removed successfully",
        })
        fetchTeamMembers()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-600" />
      case "admin":
        return <UserCheck className="h-4 w-4 text-blue-600" />
      default:
        return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800"
      case "admin":
        return "bg-blue-100 text-blue-800"
      case "editor":
        return "bg-green-100 text-green-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (userTier === "free") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Workspace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600 mb-4">Invite team members and collaborate on link management</p>
            <Badge variant="outline" className="mb-4">
              Pro Feature
            </Badge>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Invite unlimited team members</p>
              <p>• Role-based permissions</p>
              <p>• Shared link management</p>
              <p>• Team analytics</p>
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
          <Users className="h-5 w-5" />
          Team Workspace
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite Section */}
        <div className="space-y-3">
          <h4 className="font-medium">Invite Team Member</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && inviteMember()}
            />
            <Button onClick={inviteMember} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              {isLoading ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </div>

        {/* Team Members */}
        <div className="space-y-3">
          <h4 className="font-medium">Team Members ({members.length})</h4>
          {members.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Mail className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No team members yet</p>
              <p className="text-sm">Invite your first team member to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{member.name}</span>
                        {member.status === "pending" && (
                          <Badge variant="outline" className="text-xs">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      <span className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.role}
                      </span>
                    </Badge>

                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => updateMemberRole(member.id, "admin")}>
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateMemberRole(member.id, "editor")}>
                            Make Editor
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateMemberRole(member.id, "viewer")}>
                            Make Viewer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => removeMember(member.id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Permissions */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium mb-3">Role Permissions</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Crown className="h-3 w-3 text-yellow-600" />
                Owner
              </span>
              <span className="text-gray-600">Full access, billing, team management</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <UserCheck className="h-3 w-3 text-blue-600" />
                Admin
              </span>
              <span className="text-gray-600">Manage links, invite members</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-3 w-3 text-green-600" />
                Editor
              </span>
              <span className="text-gray-600">Create and edit links</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-3 w-3 text-gray-600" />
                Viewer
              </span>
              <span className="text-gray-600">View links and analytics</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
