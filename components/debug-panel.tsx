"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { checkDatabaseConnection, pingDatabase } from "@/lib/db-utils"
import { checkSupabaseConnection } from "@/lib/supabase-client"
import { useAuth } from "@/components/auth-provider"
import { Loader2 } from "lucide-react"

export function DebugPanel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [authStatus, setAuthStatus] = useState<any>(null)
  const [pingResult, setPingResult] = useState<any>(null)
  const { user } = useAuth()

  const runDiagnostics = async () => {
    setIsChecking(true)

    try {
      // Check database connection
      const dbResult = await checkDatabaseConnection()
      setDbStatus(dbResult)

      // Check auth connection
      const authResult = await checkSupabaseConnection()
      setAuthStatus({
        connected: authResult,
        user: user ? { id: user.id, email: user.email } : null,
      })

      // Ping database
      const ping = await pingDatabase()
      setPingResult(ping)
    } catch (error) {
      console.error("Error running diagnostics:", error)
    } finally {
      setIsChecking(false)
    }
  }

  // This component is hidden by default and can be shown by adding ?debug=true to the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("debug") === "true") {
      setIsVisible(true)
    }
  }, [])

  if (!isVisible) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 opacity-90 hover:opacity-100 transition-opacity">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Debug Panel</CardTitle>
        <CardDescription className="text-xs">Troubleshoot database and auth issues</CardDescription>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>User:</strong> {user ? `${user.email} (${user.id})` : "Not logged in"}
        </div>

        {dbStatus && (
          <div>
            <strong>Database:</strong> {dbStatus.connected ? "Connected ✅" : "Disconnected ❌"}
            {dbStatus.error && <div className="text-red-500">{dbStatus.error}</div>}
          </div>
        )}

        {authStatus && (
          <div>
            <strong>Auth:</strong> {authStatus.connected ? "Connected ✅" : "Disconnected ❌"}
          </div>
        )}

        {pingResult && (
          <div>
            <strong>Database Latency:</strong> {pingResult.latency}ms
            {pingResult.error && <div className="text-red-500">{pingResult.error}</div>}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" className="w-full text-xs" onClick={runDiagnostics} disabled={isChecking}>
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Running Diagnostics...
            </>
          ) : (
            "Run Diagnostics"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
