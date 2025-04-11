import { supabase } from "@/lib/supabase-client"

export async function checkDatabaseConnection() {
  try {
    // Try to fetch a small amount of data to test the connection
    const { data, error } = await supabase.from("profiles").select("id").limit(1)

    if (error) {
      console.error("Database connection error:", error)
      return {
        connected: false,
        error: error.message,
      }
    }

    return {
      connected: true,
      data,
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function pingDatabase() {
  const start = Date.now()
  try {
    const { data, error } = await supabase.from("profiles").select("id").limit(1)
    const end = Date.now()

    return {
      success: !error,
      latency: end - start,
      error: error?.message,
    }
  } catch (error) {
    const end = Date.now()
    return {
      success: false,
      latency: end - start,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
