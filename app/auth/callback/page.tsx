"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Processing auth callback")

        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const errorParam = hashParams.get("error")
        const errorDescription = hashParams.get("error_description")

        // Handle explicit OAuth errors
        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescription)
          setError(`Authentication failed: ${errorDescription || errorParam}`)
          setTimeout(() => router.push(`/auth/login?error=${encodeURIComponent(errorParam)}`), 2000)
          return
        }

        if (accessToken) {
          console.log("Found access token in URL")
          // Exchange the access token for a session
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting auth session:", error)
            setError("Authentication failed. Please try again.")
            setTimeout(() => router.push("/auth/login?error=auth-callback-failed"), 2000)
            return
          }

          if (data?.session) {
            console.log("Session established, redirecting to dashboard")
            // Use replace instead of push to prevent back button issues
            router.replace("/dashboard")
          } else {
            console.log("No session found after OAuth")
            setError("No session found. Please sign in again.")
            setTimeout(() => router.push("/auth/login?error=no-session"), 2000)
          }
        } else {
          console.log("No access token in URL, checking for existing session")
          // Check if we have a session already
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting auth session:", error)
            setError("Authentication failed. Please try again.")
            setTimeout(() => router.push("/auth/login?error=auth-callback-failed"), 2000)
            return
          }

          if (data?.session) {
            console.log("Existing session found, redirecting to dashboard")
            // Use replace instead of push to prevent back button issues
            router.replace("/dashboard")
          } else {
            console.log("No existing session found")
            setError("No session found. Please sign in again.")
            setTimeout(() => router.push("/auth/login?error=no-session"), 2000)
          }
        }
      } catch (error) {
        console.error("Error in auth callback:", error)
        setError("An unexpected error occurred. Please try again.")
        setTimeout(() => router.push("/auth/login?error=auth-callback-failed"), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <div className="space-y-4">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-muted-foreground mt-2">Redirecting you back to login...</p>
          </div>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Completing authentication...</h2>
            <p className="text-muted-foreground mt-2">You'll be redirected shortly</p>
          </>
        )}
      </div>
    </div>
  )
}
