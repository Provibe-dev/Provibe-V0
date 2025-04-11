"use client"

import type React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  // Function to handle smooth scrolling
  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    setIsMenuOpen(false)

    const section = document.getElementById(sectionId)
    if (section) {
      const offsetTop = section.offsetTop - 80 // Adjust for header height
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
      setActiveSection(sectionId)
    }
  }

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["features", "how-it-works", "tools", "pricing", "cta"]
      const scrollPosition = window.scrollY + 100 // Add offset for header

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-white">ProVibe</span>
            <span className="ml-1 text-xs text-emerald-400">BETA</span>
          </Link>
        </div>

        {/* Desktop Navigation with shadcn NavigationMenu */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="#features" legacyBehavior passHref onClick={(e) => handleScrollToSection(e, "features")}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-slate-800",
                      activeSection === "features" && "text-emerald-400",
                    )}
                  >
                    Features
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="#how-it-works"
                  legacyBehavior
                  passHref
                  onClick={(e) => handleScrollToSection(e, "how-it-works")}
                >
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-slate-800",
                      activeSection === "how-it-works" && "text-emerald-400",
                    )}
                  >
                    How It Works
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#tools" legacyBehavior passHref onClick={(e) => handleScrollToSection(e, "tools")}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-slate-800",
                      activeSection === "tools" && "text-emerald-400",
                    )}
                  >
                    Tools
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="#pricing" legacyBehavior passHref onClick={(e) => handleScrollToSection(e, "pricing")}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-slate-800",
                      activeSection === "pricing" && "text-emerald-400",
                    )}
                  >
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center md:flex">
          <ThemeToggle />
          <Button
            className="ml-4 bg-emerald-500 hover:bg-emerald-600"
            onClick={(e) => handleScrollToSection(e as any, "cta")}
          >
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-slate-900 md:hidden">
          <nav className="flex flex-col p-4">
            <Button
              variant="ghost"
              className={cn(
                "justify-start border-b border-slate-800 py-4 text-lg text-white hover:bg-slate-800",
                activeSection === "features" && "text-emerald-400",
              )}
              onClick={(e) => handleScrollToSection(e as any, "features")}
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "justify-start border-b border-slate-800 py-4 text-lg text-white hover:bg-slate-800",
                activeSection === "how-it-works" && "text-emerald-400",
              )}
              onClick={(e) => handleScrollToSection(e as any, "how-it-works")}
            >
              How It Works
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "justify-start border-b border-slate-800 py-4 text-lg text-white hover:bg-slate-800",
                activeSection === "tools" && "text-emerald-400",
              )}
              onClick={(e) => handleScrollToSection(e as any, "tools")}
            >
              Tools
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "justify-start border-b border-slate-800 py-4 text-lg text-white hover:bg-slate-800",
                activeSection === "pricing" && "text-emerald-400",
              )}
              onClick={(e) => handleScrollToSection(e as any, "pricing")}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className={cn(
                "justify-start border-b border-slate-800 py-4 text-lg text-white hover:bg-slate-800",
                activeSection === "cta" && "text-emerald-400",
              )}
              onClick={(e) => handleScrollToSection(e as any, "cta")}
            >
              Get Started
            </Button>
            <div className="mt-6 flex flex-col">
              <div className="flex justify-center mb-4">
                <ThemeToggle />
              </div>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600"
                onClick={(e) => handleScrollToSection(e as any, "cta")}
              >
                Get Started
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
