"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar"

export function MainNavbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if user is authenticated and redirect if needed
  useEffect(() => {
    if (pathname?.startsWith("/dashboard") && !user) {
      router.push("/auth/login")
    }
  }, [pathname, user, router])

  const navItems = [
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "Pricing",
      link: "/#pricing",
    },
    {
      name: "About",
      link: "/#about",
    },
  ]

  const handleLogin = () => {
    router.push("/auth/login")
    setIsMobileMenuOpen(false)
  }

  const handleSignUp = () => {
    router.push("/auth/register")
    setIsMobileMenuOpen(false)
  }

  const handleDashboard = () => {
    router.push("/dashboard")
    setIsMobileMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsMobileMenuOpen(false)
    router.push("/")
  }

  return (
    <Navbar className="fixed">
      {/* Desktop Navigation */}
      <NavBody>
        <NavbarLogo />
        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <NavbarButton variant="secondary" onClick={handleDashboard}>
                Dashboard
              </NavbarButton>
              <NavbarButton variant="emerald" onClick={handleLogout}>
                Logout
              </NavbarButton>
            </>
          ) : (
            <>
              <NavbarButton variant="secondary" onClick={handleLogin}>
                Sign In
              </NavbarButton>
              <NavbarButton variant="emerald" onClick={handleSignUp}>
                Sign Up
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {navItems.map((item, idx) => (
            <Link
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block py-2">{item.name}</span>
            </Link>
          ))}
          <div className="mt-4 flex w-full flex-col gap-4">
            {user ? (
              <>
                <NavbarButton onClick={handleDashboard} variant="secondary" className="w-full">
                  Dashboard
                </NavbarButton>
                <NavbarButton onClick={handleLogout} variant="emerald" className="w-full">
                  Logout
                </NavbarButton>
              </>
            ) : (
              <>
                <NavbarButton onClick={handleLogin} variant="secondary" className="w-full">
                  Sign In
                </NavbarButton>
                <NavbarButton onClick={handleSignUp} variant="emerald" className="w-full">
                  Sign Up
                </NavbarButton>
              </>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  )
}
