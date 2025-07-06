"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QRCodeGenerator() {
  const [shortCode, setShortCode] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateQRCode = async () => {
    if (!shortCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a short code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const url = `${window.location.origin}/${shortCode}`
      // Using QR Server API for QR code generation
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`
      setQrCodeUrl(qrUrl)

      toast({
        title: "QR Code Generated",
        description: "Your QR code is ready for download",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `qr-code-${shortCode}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Downloaded",
        description: "QR code saved to your device",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Short Code</label>
          <Input
            placeholder="Enter short code (e.g., abc123)"
            value={shortCode}
            onChange={(e) => setShortCode(e.target.value)}
          />
        </div>

        <Button onClick={generateQRCode} disabled={isLoading} className="w-full">
          <QrCode className="h-4 w-4 mr-2" />
          {isLoading ? "Generating..." : "Generate QR Code"}
        </Button>

        {qrCodeUrl && (
          <div className="text-center space-y-4">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="mx-auto border rounded-lg" />
            <Button onClick={downloadQRCode} variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
