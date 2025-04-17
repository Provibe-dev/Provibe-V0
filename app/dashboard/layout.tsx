"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      // If not loading and no user, check for session first
      if (!loading && !user) {
        console.log("No user in state, checking for session");
        
        try {
          // Double-check session with Supabase directly
          const { data } = await supabase.auth.getSession();
          
          if (!data?.session) {
            console.log("No session found, redirecting to login");
            router.replace("/auth/login");
          } else {
            console.log("Session exists but user state not updated");
            // Session exists but user state hasn't been updated
            // This will trigger a refresh in the auth provider
          }
        } catch (error) {
          console.error("Error checking session:", error);
          router.replace("/auth/login");
        }
      }
    };
    
    checkAuth();
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    )
  }

  // Don't render the dashboard if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto p-4">{children}</div>
    </div>
  )
}
