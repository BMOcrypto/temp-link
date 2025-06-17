"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Ban, Mail, Crown } from "lucide-react"

export function UsersTable() {
  // Mock data
  const users = [
    {
      id: "1",
      email: "john@example.com",
      name: "John Doe",
      tier: "free",
      linksCount: 8,
      clicksCount: 234,
      joinedAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      email: "jane@example.com",
      name: "Jane Smith",
      tier: "pro",
      linksCount: 45,
      clicksCount: 1892,
      joinedAt: "2024-01-10",
      status: "active",
    },
    {
      id: "3",
      email: "spam@example.com",
      name: "Spam User",
      tier: "free",
      linksCount: 15,
      clicksCount: 12,
      joinedAt: "2024-01-20",
      status: "flagged",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Links</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.tier === "pro" ? "default" : "secondary"}>
                    {user.tier === "pro" && <Crown className="h-3 w-3 mr-1" />}
                    {user.tier.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{user.linksCount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.status === "active" ? "default" : user.status === "flagged" ? "destructive" : "secondary"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Ban className="mr-2 h-4 w-4" />
                        Ban User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
