"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Immediately start the logout process
    const performLogout = async () => {
      try {
        console.log("Logout page: Starting logout process")
        // Set the logged out flag
        localStorage.setItem("v0_user_logged_out", "true")
        await logout()
        // The logout function now handles the redirect
      } catch (error) {
        console.error("Logout page: Error during logout:", error)
        // Force redirect to login even if logout fails
        router.push("/auth/login")
      }
    }

    performLogout()

    // Safety timeout - redirect to login after 3 seconds even if logout is still processing
    const safetyTimeout = setTimeout(() => {
      console.log("Logout page: Safety timeout triggered")
      router.push("/auth/login")
    }, 3000)

    return () => clearTimeout(safetyTimeout)
  }, [logout, router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Logging out...</h2>
        <p className="text-muted-foreground mt-2">You'll be redirected shortly</p>
      </div>
    </div>
  )
}
