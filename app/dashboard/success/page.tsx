"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Crown, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function SuccessPage() {
  useEffect(() => {
    toast({
      title: "Welcome to TempLink Pro! 🎉",
      description: "Your subscription is now active. Enjoy unlimited links and advanced features!",
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Crown className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">TempLink Pro Activated</span>
          </div>

          <div className="text-left space-y-2 text-sm text-gray-600">
            <p>✅ Unlimited link creation</p>
            <p>✅ Advanced analytics & insights</p>
            <p>✅ Custom domains</p>
            <p>✅ API access</p>
            <p>✅ Priority support</p>
          </div>

          <div className="pt-4">
            <Link href="/dashboard">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500">You can manage your subscription anytime from your dashboard.</p>
        </CardContent>
      </Card>
    </div>
  )
}
