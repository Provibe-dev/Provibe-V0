"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase-client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

type User = {
  id: string
  name: string
  email: string
  subscription: "free" | "pro"
  avatar?: string
  credits_remaining: number
  projects_limit: number
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithSSO: (provider: "google" | "github") => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Check if we're in the v0 preview environment
const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

// Test user for development and testing
const TEST_USER: User = {
  id: "test_user_id",
  name: "Test User",
  email: "test@example.com",
  subscription: "pro",
  avatar: `https://ui-avatars.com/api/?name=Test+User&background=10B981&color=fff`,
  credits_remaining: 750,
  projects_limit: 5,
}

// Add this function to your auth-provider.tsx file
// This will help diagnose Supabase connection issues

export const testSupabaseConnection = async () => {
  try {
    // First test if the URL is reachable
    const urlTest = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL || "", {
      method: "HEAD",
      mode: "no-cors", // This allows us to at least check if the domain is reachable
    })

    console.log("Supabase URL test:", urlTest.status !== 0 ? "Reachable" : "Unreachable")

    // Then test if we can make an anonymous request to Supabase
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error("Supabase connection test failed:", error)
      return {
        success: false,
        error: error.message,
        details: {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
          key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
        },
      }
    }

    return {
      success: true,
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      },
    }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return {
      success: false,
      error: error.message,
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing",
      },
    }
  }
}

// Add session caching to prevent repeated checks
const SESSION_CACHE_TIME = 60 * 1000; // 1 minute cache
let cachedSession = null;
let lastSessionCheck = 0;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Convert Supabase user and profile to our User type
  const formatUser = (supabaseUser: SupabaseUser, profile: Profile | null): User => {
    return {
      id: supabaseUser.id,
      name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User",
      email: supabaseUser.email || "",
      subscription: profile?.subscription_tier || "free",
      avatar:
        profile?.avatar_url ||
        supabaseUser.user_metadata?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "User")}&background=10B981&color=fff`,
      credits_remaining: profile?.credits_remaining || 1000,
      projects_limit: profile?.subscription_tier === "pro" ? 20 : 2,
    }
  }

  // Refresh user data from Supabase
  const refreshUser = async () => {
    try {
      // In v0 preview, return test user
      if (isV0Preview) {
        setUser(TEST_USER)
        return TEST_USER
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        const formattedUser = formatUser(session.user, profile)
        setUser(formattedUser)
        return formattedUser
      }
      return null
    } catch (error) {
      console.error("Error refreshing user:", error)
      return null
    }
  }

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check cache first to avoid unnecessary API calls
        const now = Date.now();
        if (cachedSession && (now - lastSessionCheck < SESSION_CACHE_TIME)) {
          console.log("Using cached session");
          if (cachedSession.user) {
            setUser(cachedSession.user);
          }
          setLoading(false);
          return;
        }

        // Check if user has explicitly logged out
        const userLoggedOut = localStorage.getItem("v0_user_logged_out")

        // In v0 preview, respect the logged out state
        if (isV0Preview) {
          if (userLoggedOut === "true") {
            console.log("User previously logged out, keeping logged out state")
            setUser(null)
            setLoading(false)
            return
          }

          // Only auto-login if not previously logged out
          console.log("Using test user in v0 preview environment")
          setUser(TEST_USER)
          localStorage.setItem("v0_test_user_logged_in", "true")
          setLoading(false)
          return
        }

        // First check for test user in localStorage
        const storedUser = localStorage.getItem("provibe_user")
        if (storedUser && !userLoggedOut) {
          const parsedUser = JSON.parse(storedUser)
          if (parsedUser.email === "test@example.com") {
            console.log("Found test user in localStorage")
            setUser(TEST_USER)
            setLoading(false)
            return
          }
        }

        // Then check for an active Supabase session
        console.log("Checking for Supabase session")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (session?.user) {
          console.log("Found active session for user:", session.user.email)
          try {
            // Get user profile from Supabase
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single()

            if (profileError && profileError.code !== "PGRST116") {
              console.error("Error fetching profile:", profileError)
            }

            // Create profile if it doesn't exist
            if (!profile) {
              console.log("Creating new profile for user:", session.user.email)
              const newProfile = {
                id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User",
                avatar_url: session.user.user_metadata?.avatar_url,
                subscription_tier: "free",
                credits_remaining: 1000,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }

              const { error: insertError } = await supabase.from("profiles").insert([newProfile])
              
              if (insertError) {
                console.error("Error creating profile:", insertError)
                // Log the error and continue with basic user info
                const formattedUser = formatUser(session.user, null)
                setUser(formattedUser)
                
                // Report error to monitoring system
                reportAuthError("profile_creation_failed", insertError)
                return
              }

              // Fetch the newly created profile
              const { data: createdProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single()

              const formattedUser = formatUser(session.user, createdProfile)
              setUser(formattedUser)
            } else {
              const formattedUser = formatUser(session.user, profile)
              setUser(formattedUser)
            }
          } catch (profileError) {
            console.error("Profile error:", profileError)
            // Fallback to basic user info if profile fetch fails
            const formattedUser = formatUser(session.user, null)
            setUser(formattedUser)
          }
        } else if (error) {
          console.error("Supabase auth error:", error)
          
          // Check if token needs refresh
          if (error.message?.includes("token") || error.status === 401) {
            await supabase.auth.refreshSession()
            // Retry auth check after refresh attempt
            const { data: refreshData } = await supabase.auth.getSession()
            if (refreshData.session) {
              // Session refreshed successfully, restart auth check
              checkAuth()
              return
            }
          }
          
          // If we're not on an auth page, redirect to login
          if (!pathname?.includes("/auth/")) {
            router.push("/auth/login")
          }
        } else if (!pathname?.includes("/auth/")) {
          // If no session and not on auth page, redirect to login
          console.log("No active session, redirecting to login")
          router.push("/auth/login")
        }
      } catch (error) {
        console.error("Authentication error:", error)
        // If there's an error and we're not on an auth page, redirect to login
        if (!pathname?.includes("/auth/")) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    // Set up auth state listener with debouncing
    let authChangeTimeout;
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      // Debounce auth state changes
      clearTimeout(authChangeTimeout);
      authChangeTimeout = setTimeout(async () => {
        // Your existing auth state change logic...
        
        // Update cache on auth state change
        if (session && event === "SIGNED_IN") {
          cachedSession = { user: formattedUser };
          lastSessionCheck = Date.now();
        } else if (event === "SIGNED_OUT") {
          cachedSession = null;
        }
      }, 100);
    })

    // Prevent race conditions by setting a flag
    let isMounted = true
    
    // Only run checkAuth if component is still mounted
    const safeCheckAuth = async () => {
      if (isMounted) {
        await checkAuth()
      }
    }
    
    safeCheckAuth()

    return () => {
      isMounted = false
      if (!isV0Preview) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Clear the logged out flag when user explicitly logs in
      localStorage.removeItem("v0_user_logged_out");

      // In v0 preview, use test user
      if (isV0Preview) {
        console.log("Using test user in v0 preview environment");
        setUser(TEST_USER);
        localStorage.setItem("v0_test_user_logged_in", "true");
        return TEST_USER;
      }

      // Special case for test user
      if (email === "test@example.com" && password === "password123") {
        console.log("Logging in as test user");
        localStorage.setItem("provibe_user", JSON.stringify(TEST_USER));
        setUser(TEST_USER);
        return TEST_USER;
      }

      // Regular Supabase authentication
      console.log("Attempting Supabase login with:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Supabase login error:", error);
        throw error;
      }

      if (!data.user) {
        throw new Error("No user returned from login");
      }

      console.log("Login successful for:", data.user?.email);

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();
      
      // Format and set user
      const formattedUser = formatUser(data.user, profile);
      
      // Update state and localStorage atomically
      setUser(formattedUser);
      localStorage.setItem("provibe_user", JSON.stringify(formattedUser));
      
      console.log("User state updated:", formattedUser);
      return formattedUser;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const loginWithSSO = async (provider: "google" | "github") => {
    setLoading(true)
    try {
      // Clear the logged out flag when user explicitly logs in
      localStorage.removeItem("v0_user_logged_out")

      // In v0 preview, use test user
      if (isV0Preview) {
        console.log("Using test user in v0 preview environment")
        setUser(TEST_USER)
        localStorage.setItem("v0_test_user_logged_in", "true")
        setLoading(false)
        return
      }

      console.log(`Initiating ${provider} SSO login`)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        console.error(`${provider} SSO error:`, error)
        throw error
      }

      console.log(`${provider} SSO initiated:`, data)
      // The actual user data will be set after the OAuth redirect
      // via the useEffect above that checks the session
    } catch (error) {
      console.error(`${provider} login error:`, error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    console.log("Logout initiated")

    try {
      // Clear local state immediately
      setUser(null)

      // Remove all auth-related items from localStorage
      localStorage.removeItem("provibe_user")
      localStorage.removeItem("supabase.auth.token")
      localStorage.removeItem("v0_test_user_logged_in")

      // For v0 preview environment, set a flag to prevent auto-login
      if (isV0Preview) {
        console.log("V0 preview environment detected, setting logged out state")
        localStorage.setItem("v0_user_logged_out", "true")
        router.push("/auth/login")
        return
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Supabase signOut error:", error)
      }

      console.log("Logout completed, redirecting to login page")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if there's an error, force redirect to login
      router.push("/auth/login")
    }
  }

  const register = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      // Clear the logged out flag when user explicitly registers
      localStorage.removeItem("v0_user_logged_out")

      // In v0 preview, use test user
      if (isV0Preview) {
        console.log("Using test user in v0 preview environment")
        setUser(TEST_USER)
        localStorage.setItem("v0_test_user_logged_in", "true")
        return
      }

      console.log("Registering new user:", email)

      // First, sign up the user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      })

      if (error) {
        console.error("Registration error:", error)
        throw error
      }

      if (!data.user) {
        throw new Error("User registration failed")
      }

      console.log("Registration successful for:", data.user?.email)

      // Create profile for the new user
      console.log("Creating profile for new user with ID:", data.user.id)
      const newProfile = {
        id: data.user.id,
        full_name: name,
        avatar_url: null,
        subscription_tier: "free",
        credits_remaining: 1000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { error: profileError } = await supabase.from("profiles").insert([newProfile])

      if (profileError) {
        console.error("Error creating profile:", profileError)
        // Don't throw here, as the user is already created
      }

      const formattedUser = formatUser(data.user, newProfile)
      setUser(formattedUser)
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithSSO, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
