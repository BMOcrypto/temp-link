"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, User, Mail, Lock, Shield, CreditCard, Zap, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { PaymentMethodForm } from "./payment-method-form"

interface CaptchaData {
  question: string
  token: string
}

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    tier: "free",
    captchaAnswer: "",
    agreeToTerms: false,
  })

  const [captcha, setCaptcha] = useState<CaptchaData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const router = useRouter()

  // Load CAPTCHA on component mount
  useEffect(() => {
    loadCaptcha()
  }, [])

  const loadCaptcha = async () => {
    try {
      const response = await fetch("/api/auth/captcha")
      if (response.ok) {
        const data = await response.json()
        setCaptcha(data)
      }
    } catch (error) {
      console.error("Failed to load CAPTCHA:", error)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, and apostrophes"
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter, uppercase letter, and number"
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // CAPTCHA validation
    if (!formData.captchaAnswer) {
      newErrors.captchaAnswer = "Please solve the CAPTCHA"
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          tier: formData.tier,
          captchaAnswer: formData.captchaAnswer,
          captchaToken: captcha?.token,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.requiresPayment && data.stripeCustomerId) {
          setStripeCustomerId(data.stripeCustomerId)
          setShowPayment(true)
          toast({
            title: "Account created!",
            description: "Please complete your payment to activate Pro features.",
          })
        } else {
          toast({
            title: "Account created successfully!",
            description: "Welcome to TempLink. You can now start creating temporary links.",
          })
          router.push("/auth/signin?message=registration-success")
        }
      } else {
        throw new Error(data.error || "Registration failed")
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
      // Reload CAPTCHA on error
      loadCaptcha()
      setFormData((prev) => ({ ...prev, captchaAnswer: "" }))
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful!",
      description: "Your Pro subscription is now active. Welcome to TempLink Pro!",
    })
    router.push("/dashboard")
  }

  if (showPayment && stripeCustomerId) {
    return <PaymentMethodForm customerId={stripeCustomerId} onSuccess={handlePaymentSuccess} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">TempLink</span>
          </div>
          <CardTitle>Create Your Account</CardTitle>
          <p className="text-gray-600">Join TempLink and start creating temporary links</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Selection */}
            <div className="space-y-3">
              <Label>Choose Your Plan</Label>
              <RadioGroup
                value={formData.tier}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, tier: value }))}
                className="grid grid-cols-1 gap-3"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value="free" id="free" />
                  <div className="flex-1">
                    <Label htmlFor="free" className="font-medium">
                      Free Plan
                    </Label>
                    <p className="text-sm text-gray-600">10 links/month • Basic analytics</p>
                  </div>
                  <div className="text-lg font-bold">$0</div>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50 border-blue-200 bg-blue-50">
                  <RadioGroupItem value="pro" id="pro" />
                  <div className="flex-1">
                    <Label htmlFor="pro" className="font-medium flex items-center gap-1">
                      Pro Plan
                      <Zap className="h-4 w-4 text-blue-600" />
                    </Label>
                    <p className="text-sm text-gray-600">Unlimited links • Advanced analytics • API access</p>
                  </div>
                  <div className="text-lg font-bold text-blue-600">$5/mo</div>
                </div>
              </RadioGroup>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    className={`pl-10 ${errors.password ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Must be 8+ characters with uppercase, lowercase, and number
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    required
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* CAPTCHA */}
            <div className="space-y-2">
              <Label>Security Verification</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span className="text-sm">What is {captcha?.question}?</span>
                <Button type="button" variant="ghost" size="sm" onClick={loadCaptcha}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <Input
                type="number"
                placeholder="Enter the answer"
                value={formData.captchaAnswer}
                onChange={(e) => setFormData((prev) => ({ ...prev, captchaAnswer: e.target.value }))}
                className={errors.captchaAnswer ? "border-red-500" : ""}
                required
              />
              {errors.captchaAnswer && <p className="text-sm text-red-600">{errors.captchaAnswer}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: !!checked }))}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}

            {/* Pro Plan Benefits */}
            {formData.tier === "pro" && (
              <Alert>
                <CreditCard className="h-4 w-4" />
                <AlertDescription>
                  You'll be redirected to complete payment setup after account creation. Your Pro features will be
                  activated immediately upon successful payment.
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  {formData.tier === "pro" && <span className="ml-2">($5/month)</span>}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
