"use client"

import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Home, FileText, Settings, User, LogOut, FolderKanban } from "lucide-react"

export function AppSidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  if (!user) {
    return null
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex h-screen w-16 flex-col border-r bg-slate-900 transition-all duration-300 hover:w-64 md:w-64">
      <div className="flex h-16 items-center justify-center border-b px-4">
        <div className="flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <span className="text-lg font-bold">P</span>
          </div>
          <span className="ml-2 text-xl font-bold text-white opacity-0 transition-opacity duration-300 hover:opacity-100 md:opacity-100">
            ProVibe
          </span>
        </div>
      </div>
      <nav className="flex-1 space-y-2 p-2">
        <NavItem
          href="/dashboard"
          icon={<Home className="h-5 w-5" />}
          label="Dashboard"
          isActive={pathname === "/dashboard"}
        />
        <NavItem
          href="/dashboard/projects"
          icon={<FolderKanban className="h-5 w-5" />}
          label="Projects"
          isActive={isActive("/dashboard/projects")}
        />
        <NavItem
          href="/dashboard/documents"
          icon={<FileText className="h-5 w-5" />}
          label="Documents"
          isActive={isActive("/dashboard/documents")}
        />
        <NavItem
          href="/dashboard/profile"
          icon={<User className="h-5 w-5" />}
          label="Profile"
          isActive={isActive("/dashboard/profile")}
        />
        <NavItem
          href="/dashboard/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={isActive("/dashboard/settings")}
        />
      </nav>
      <div className="border-t p-2">
        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-lg px-2 py-2 text-gray-300 hover:bg-slate-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3 opacity-0 transition-opacity duration-300 hover:opacity-100 md:opacity-100">
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}

function NavItem({
  href,
  icon,
  label,
  isActive,
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg px-2 py-2 ${
        isActive ? "bg-slate-800 text-white" : "text-gray-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icon}
      <span className="ml-3 opacity-0 transition-opacity duration-300 hover:opacity-100 md:opacity-100">{label}</span>
    </Link>
  )
}
