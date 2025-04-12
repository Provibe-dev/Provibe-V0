"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Github, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase-client" // Import supabase client

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const { login, loginWithSSO, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const showDebug = searchParams.get("debug") === "true"

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    // Clear the logged out flag when user visits login page
    localStorage.removeItem("v0_user_logged_out")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Validate inputs
      if (!email || !password) {
        setErrorMessage("Please enter both email and password")
        setIsLoading(false)
        return
      }

      // Check for test user
      if (email === "test@example.com" && password === "password123") {
        console.log("Logging in as test user")
        await login(email, password)
        toast({
          title: "Login successful",
          description: "Welcome back to ProVibe, Test User!",
        })
        router.push("/dashboard")
        return
      }

      // Regular login flow
      console.log("Attempting login with:", email)

      try {
        await login(email, password)

        toast({
          title: "Login successful",
          description: "Welcome back to ProVibe!",
        })

        // Explicitly navigate to dashboard after successful login
        router.push("/dashboard")
      } catch (loginError: any) {
        console.error("Login error details:", loginError)

        // Handle specific error cases
        if (loginError.message?.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password. Please check your credentials and try again.")
        } else if (loginError.message?.includes("Invalid API key")) {
          setErrorMessage("System configuration error. Please contact support with error code: SUPABASE_API_KEY")
        } else if (loginError.status === 401 || loginError.message?.includes("Unauthorized")) {
          setErrorMessage(
            "Authentication failed. This could be due to incorrect credentials or a system configuration issue.",
          )
        } else {
          setErrorMessage(loginError.message || "Login failed. Please try again.")
        }

        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")

      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSOLogin = async (provider: "google" | "github") => {
    try {
      setIsLoading(true)
      setErrorMessage(null)
      await loginWithSSO(provider)
      toast({
        title: "SSO Login initiated",
        description: `Redirecting to ${provider} for authentication...`,
      })
      // Note: The actual redirect happens in the loginWithSSO function
    } catch (error) {
      console.error(`${provider} login error:`, error)
      setErrorMessage(`Could not login with ${provider}. Please try again.`)
      toast({
        title: "SSO login failed",
        description: `Could not login with ${provider}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // For testing purposes, let's add a function to pre-fill the test user credentials
  const fillTestCredentials = () => {
    setEmail("test@example.com")
    setPassword("password123")
  }

  // Add a debug function to test Supabase connection
  const testConnection = async () => {
    try {
      setDebugInfo({ status: "testing" })

      // Test if environment variables are set
      const envInfo = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? "✅ Set"
          : "❌ Missing (first 5 chars: " +
            (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
              ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5) + "...)"
              : "N/A)"),
      }

      // Test Supabase connection
      const { data, error } = await supabase.auth.getSession()

      setDebugInfo({
        status: "complete",
        environment: envInfo,
        connection: error ? "❌ Failed" : "✅ Success",
        error: error ? error.message : null,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      setDebugInfo({
        status: "error",
        message: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="ProVibe Logo" className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-emerald-500">ProVibe</span>
              <span className="ml-1 text-xs text-emerald-400">LITE</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
          <CardDescription className="text-center">Enter your email below to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(error || errorMessage) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errorMessage ||
                  (error === "auth-callback-failed"
                    ? "Authentication failed. Please try again."
                    : error === "no-session"
                      ? "No session found. Please sign in again."
                      : "An error occurred. Please try again.")}
              </AlertDescription>
            </Alert>
          )}

          {showDebug && (
            <div className="bg-slate-800 p-3 rounded text-xs text-slate-300 space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Debug Mode</span>
                <button onClick={testConnection} className="text-emerald-400 hover:text-emerald-300">
                  Test Connection
                </button>
              </div>

              {debugInfo && (
                <pre className="whitespace-pre-wrap overflow-auto max-h-40">{JSON.stringify(debugInfo, null, 2)}</pre>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full" onClick={() => handleSSOLogin("google")} disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleSSOLogin("github")} disabled={isLoading}>
              <Github className="h-5 w-5 mr-2" />
              GitHub
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/reset-password" className="text-sm text-emerald-500 hover:text-emerald-400">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                onClick={fillTestCredentials}
                className="text-emerald-500 hover:text-emerald-400 hover:underline"
              >
                Use test account: test@example.com / password123
              </button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-emerald-500 hover:text-emerald-400">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
