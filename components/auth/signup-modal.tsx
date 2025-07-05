"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star, User, Mail, Lock } from "lucide-react"
import { signUp } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: "free" | "pro"
}

export function SignUpModal({ isOpen, onClose, selectedPlan }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await signUp(formData.email, formData.password, formData.name, selectedPlan)

      toast({
        title: "Success!",
        description: `Welcome to TempLink ${selectedPlan === "pro" ? "Pro" : ""}! Please check your email to verify your account.`,
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      onClose()
      router.push("/dashboard")
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Create Your Account</DialogTitle>
          <div className="text-center mt-2">
            <Badge
              className={`${selectedPlan === "pro" ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-600"}`}
            >
              {selectedPlan === "pro" && <Star className="w-4 h-4 mr-1" />}
              {selectedPlan === "pro" ? "Pro Plan" : "Free Plan"}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button
            type="submit"
            className={`w-full ${
              selectedPlan === "pro"
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : `Create ${selectedPlan === "pro" ? "Pro" : "Free"} Account`}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose()
              router.push("/auth/signin")
            }}
            className="text-blue-600 hover:underline"
          >
            Sign in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
