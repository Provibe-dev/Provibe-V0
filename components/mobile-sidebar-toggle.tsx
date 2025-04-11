"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar} aria-label="Toggle Menu">
      <Menu className="h-5 w-5" />
    </Button>
  )
}
