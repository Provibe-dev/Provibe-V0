"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function LogoutPage() {
  const { logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout()
        
        // Keep only the real logout logic
        if (window.location.pathname !== "/auth/login") {
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Logout error:", error)
        router.push("/auth/login")
      }
    }
    
    performLogout()
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
