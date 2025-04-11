"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, FileText, FolderKanban, Settings, LogOut, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  className?: string
}

export function DashboardSidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Update the navItems array to remove Team and Analytics
  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Documents",
      href: "/dashboard/documents",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const sidebarContent = (
    <>
      <div className="flex items-center px-4 py-6">
        <Link href="/dashboard" className="flex items-center" onClick={closeMobileMenu}>
          <span className="text-2xl font-bold text-primary">ProVibe</span>
          <span className="ml-1 text-xs text-primary">BETA</span>
        </Link>
      </div>
      <div className="space-y-1 px-3">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMobileMenu}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-auto px-3 py-4">
        <div className="flex items-center justify-between rounded-md px-3 py-2">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col pt-16">{sidebarContent}</div>
      </div>

      {/* Desktop sidebar */}
      <div className={cn("hidden h-screen w-64 flex-col border-r bg-background md:flex", className)}>
        {sidebarContent}
      </div>
    </>
  )
}
