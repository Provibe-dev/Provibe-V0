// Database schema types for the Provibe Lite project

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  subscription: "free" | "pro"
  credits_remaining: number
  projects_limit: number
}

export interface Project {
  id: string
  user_id: string
  name: string
  created_at: Date
  updated_at: Date
  status: "draft" | "completed"

  // Step 1: Idea
  idea: string
  refined_idea?: string
  voice_note_url?: string

  // Step 2: Tools
  selected_tools: string[]

  // Step 3: Details
  product_details: Record<string, string>

  // Step 4: Plan
  project_plan?: string
}

export interface ProjectDocument {
  id: string
  project_id: string
  title: string
  type: "prd" | "user_flow" | "architecture" | "schema" | "api_spec"
  content: string
  created_at: Date
  updated_at: Date
  status: "pending" | "generating" | "completed" | "error"
  error_message?: string
}

export interface CreditUsageLog {
  id: string
  user_id: string
  project_id?: string
  document_id?: string
  action: "idea_refinement" | "ai_answer" | "plan_generation" | "document_generation" | "document_regeneration"
  credits_used: number
  created_at: Date
}

// Supabase table names
export const TABLES = {
  PROFILES: "profiles",
  PROJECTS: "projects",
  PROJECT_DOCUMENTS: "project_documents",
  CREDIT_USAGE_LOG: "credit_usage_log",
}
