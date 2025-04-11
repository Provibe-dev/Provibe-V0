"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

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
