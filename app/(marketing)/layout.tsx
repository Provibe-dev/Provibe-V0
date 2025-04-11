import type React from "react"
import { MainNavbar } from "@/components/main-navbar"

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <MainNavbar />
      <div className="pt-16">{children}</div>
    </>
  )
}
