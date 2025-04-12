"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase-client"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Verify the recovery token on mount
  useEffect(() => {
    const verifyRecoveryToken = async () => {
      try {
        // Check if we have a recovery token in the URL hash
        if (typeof window !== "undefined") {
          const hash = window.location.hash
        
          if (!hash || !hash.includes("type=recovery")) {
            setErrorMessage("Invalid or expired password reset link. Please request a new password reset.")
            setIsVerifying(false)
            return
          }
        
          // The recovery token is automatically picked up by Supabase client
          // We just need to check if we can get the user
          const { data: userData, error: userError } = await supabase.auth.getUser()
        
          if (userError || !userData.user) {
            console.error("Recovery token verification error:", userError)
            setErrorMessage("Invalid or expired recovery token. Please request a new password reset.")
          } else {
            console.log("Recovery token verified successfully")
            // Token is valid, user can proceed with password reset
          }
        }
      } catch (error) {
        console.error("Error verifying recovery token:", error)
        setErrorMessage("Failed to verify recovery token. Please request a new password reset.")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyRecoveryToken()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      // Validate passwords
      if (!password || !confirmPassword) {
        setErrorMessage("Please enter and confirm your new password")
        return
      }

      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long")
        return
      }

      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match")
        return
      }

      // Update password using the recovery token
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        console.error("Password update error:", error)
        throw error
      }

      // Show success message
      setSuccessMessage("Your password has been successfully updated.")

      toast({
        title: "Password updated",
        description: "Your password has been successfully changed",
      })

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error: any) {
      console.error("Password update error:", error)

      // Handle specific error cases
      if (error.message?.includes("Invalid API key")) {
        setErrorMessage("System configuration error. Please contact support with error code: SUPABASE_API_KEY")
      } else {
        setErrorMessage(error.message || "Failed to update password. Please try again.")
      }

      toast({
        title: "Update failed",
        description: "There was a problem updating your password",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ProVibe Logo" className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-emerald-500">ProVibe</span>
              <span className="ml-1 text-xs text-emerald-400">LITE</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Update your password</CardTitle>
          <CardDescription className="text-center">Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isVerifying ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <span className="ml-2">Verifying your reset link...</span>
            </div>
          ) : (
            <>
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {!errorMessage && !successMessage && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating password...
                      </>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </form>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            <Link href="/auth/login" className="inline-flex items-center text-emerald-500 hover:text-emerald-400">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
