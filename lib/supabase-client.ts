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
    "Missing Supabase credentials. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  )
  // Throw error in development to prevent silent failures
  if (process.env.NODE_ENV === 'development') {
    throw new Error("Missing Supabase credentials")
  }
}

// Create a Supabase client
export const supabase = createClient<Database>(supabaseUrl || "", supabaseAnonKey || "")

// Admin client for server-side operations
export const getServiceSupabase = () => {
  const isV0Preview = typeof window !== "undefined" && window.location.hostname.includes("vusercontent.net")
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  
  // In client-side code, we won't have access to the service role key
  // So we'll use a mock client for preview or return the regular client
  if (typeof window !== "undefined") {
    if (isV0Preview) {
      console.log("Using mock service client for preview environment")
      // Return a mock client that doesn't make real requests
      return {
        from: () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: MOCK_PROJECT, error: null }),
            }),
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({ data: { id: "mock-doc-id" }, error: null }),
            }),
          }),
          update: () => ({
            eq: async () => ({ error: null }),
          }),
        }),
      } as any;
    } else {
      console.warn("Service role client requested in client-side code. Using regular client instead.")
      return supabase;
    }
  }

  // Server-side code
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

// Mock project data for client-side preview
const MOCK_PROJECT = {
  id: "mock-project-1",
  name: "Mobile App Documentation",
  status: "completed",
  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  idea: "A comprehensive mobile app for managing personal finances and investments",
  refined_idea: "This innovative product concept aims to solve financial management challenges...",
  selected_tools: ["React Native", "Node.js", "MongoDB"],
  product_details: {
    targetAudience: "Young professionals aged 25-40",
    problemSolved: "The difficulty of tracking multiple financial accounts",
    keyFeatures: "Expense tracking, investment portfolio management, financial goal setting",
    successMetrics: "User acquisition rate, retention rate",
    timeline: "3 months for MVP, 6 months for full launch",
  },
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

// Helper function to report auth errors to monitoring system
export const reportAuthError = (type: string, error: any) => {
  console.error(`Auth error (${type}):`, error)
  // Here you would integrate with your error monitoring service
  // Example: Sentry.captureException(error)
}
