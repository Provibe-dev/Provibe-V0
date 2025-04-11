import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Check if we're in the v0 preview environment
const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")

// Get environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Admin client for server-side operations
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseServiceKey && !isV0Preview) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable")
  }

  return createClient<Database>(supabaseUrl || "", supabaseServiceKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  })
}

// Helper function to check if Supabase is properly configured
export const checkSupabaseConnection = async () => {
  if (isV0Preview) {
    return true // Pretend connection is successful in preview
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase connection check failed: Missing credentials")
    return false
  }

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("Supabase connection error:", error)
      return false
    }
    console.log("Supabase connection successful")
    return true
  } catch (error) {
    console.error("Supabase connection check failed:", error)
    return false
  }
}
