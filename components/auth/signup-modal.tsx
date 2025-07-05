"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Clock, Mail, Lock, User, X } from "lucide-react"
import { signUp } from "@/lib/auth"
import { toast } from "@/hooks/use-toast"

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: "free" | "pro"
}

export function SignUpModal({ isOpen, onClose, selectedPlan }: SignUpModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(email, password, name, selectedPlan)
      toast({
        title: "Account created successfully!",
        description: `Welcome to TempLink ${selectedPlan === "pro" ? "Pro" : "Free"}! Please check your email to verify your account.`,
      })

      // Reset form
      setName("")
      setEmail("")
      setPassword("")
      onClose()

      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard"
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again.",
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-xl font-bold">Join TempLink</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center">
            <div
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                selectedPlan === "pro" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {selectedPlan === "pro" ? "Pro Plan - $5/month" : "Free Plan"}
            </div>
            <p className="text-gray-600 mt-2">
              {selectedPlan === "pro"
                ? "Get unlimited links and advanced analytics"
                : "Start with 10 free links per month"}
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="modal-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="modal-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="modal-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="modal-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="modal-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="modal-password"
                type="password"
                placeholder="Create a password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${selectedPlan === "pro" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : `Start ${selectedPlan === "pro" ? "Pro Trial" : "Free Plan"}`}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 border-t pt-4">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                onClose()
                window.location.href = "/auth/signin"
              }}
              className="text-blue-600 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
