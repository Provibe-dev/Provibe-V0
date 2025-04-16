import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ProVibe - AI-Powered Documentation Platform",
  description: "ProVibe refines your idea into build-ready documents—PRDs, flows, architecture & plans—so your no-code tool builds it right.",
  keywords: ["documentation", "product development", "PRD", "architecture", "no-code", "AI", "product planning", "user flows", "technical specifications"]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  (function() {
    // Skip service worker registration in v0 preview environment
    if (window.location.hostname.includes('vusercontent.net')) {
      console.log('Skipping service worker registration in v0 preview environment');
      return;
    }
  })();
`,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            {children}
            <Toaster />
            <SpeedInsights />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}


import './globals.css'
