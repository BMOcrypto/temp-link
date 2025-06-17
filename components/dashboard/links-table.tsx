"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Copy, BarChart3, Trash2 } from "lucide-react"
import { formatTimeRemaining } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

export function LinksTable() {
  // Mock data - in a real app, this would come from your database
  const [links] = useState([
    {
      id: "1",
      shortCode: "abc123",
      originalUrl: "https://example.com/very-long-url-that-needs-shortening",
      title: "Example Website",
      clicks: 25,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      shortCode: "next-js",
      originalUrl: "https://github.com/vercel/next.js",
      title: "Next.js Repository",
      clicks: 142,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      createdAt: "2024-01-10T14:20:00Z",
    },
    {
      id: "3",
      shortCode: "expired-link",
      originalUrl: "https://example.com/expired-content",
      title: "Expired Content",
      clicks: 67,
      expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isActive: false,
      createdAt: "2024-01-05T09:15:00Z",
    },
  ])

  const copyToClipboard = (shortCode: string) => {
    navigator.clipboard.writeText(`https://templink.io/${shortCode}`)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">{link.shortCode}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.shortCode)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate" title={link.originalUrl}>
                    {link.title || link.originalUrl}
                  </div>
                </TableCell>
                <TableCell>{link.clicks}</TableCell>
                <TableCell>
                  <Badge variant={link.isActive ? "default" : "secondary"}>
                    {link.isActive ? "Active" : "Expired"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={link.isActive ? "text-green-600" : "text-red-600"}>
                    {formatTimeRemaining(link.expiresAt)}
                  </span>
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
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
